import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Bell,
  Settings,
  Plus,
  FileText,
  Code,
  File,
  Edit,
  Download,
  Trash2,
  Eye,
  Edit3,
  Loader2,
  ArrowLeft
} from 'lucide-react';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { loadJSON, saveJSON } from '../../utils/storage';
import { ROUTES } from '../../utils/constants';
import api from '../../services/api';
import { fetchAllResumes } from '../../services/resumeService';

// PDF Generation Imports
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

// Template Imports for PDF Generation
import { Template1, Template2, Template3 } from '../../components/resume/ResumeTemplates';
import { Template4, Template5, Template6, Template7, Template8, Template9, Template10, Template11, Template12, Template13 } from '../../components/resume/NewResumeTemplates';

const timeAgo = (date) => {
  if (!date) return 'Unknown';
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days} day${days > 1 ? 's' : ''} ago`;
};

const MyResumes = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  // PDF Generation State
  const [downloadingId, setDownloadingId] = useState(null);
  const [pdfTargetResume, setPdfTargetResume] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      if (user?.email) {
        setLoading(true);
        try {
          // 1. Fetch from Backend
          const userId = user.id || user._id;
          let backendResumes = [];
          if (userId) {
            try {
              const res = await api.get(`/resume/user/${userId}`);
              backendResumes = res.data || [];
            } catch (err) {
              console.warn('Failed to fetch backend resumes:', err);
            }
          }

          // 2. Load Local
          let localList = loadJSON(`resumes_list_${user.email}`, []);

          // Migration for old single resume
          if (localList.length === 0) {
            const oldResume = loadJSON(`resume_${user.email}`, null);
            if (oldResume) {
              const migrated = {
                id: Date.now(),
                name: 'My First Resume',
                ...oldResume,
                lastUpdated: new Date().toISOString()
              };
              localList = [migrated];
              saveJSON(`resumes_list_${user.email}`, localList);
              localStorage.removeItem(`resume_${user.email}`);
            }
          }

          // 3. Get Unified List from Service
          const combined = await fetchAllResumes(user);

          setResumes(combined);
        } catch (error) {
          console.error("Resume load error", error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchResumes();
  }, [user]);

  const deleteResume = async (id) => {
    if (!user?.email) return;

    if (confirm('Are you sure you want to delete this resume?')) {
      const target = resumes.find(r => r.id === id);
      const backendId = target?.backendId;

      const updated = resumes.filter(r => r.id !== id);
      setResumes(updated);
      saveJSON(`resumes_list_${user.email}`, updated);

      if (backendId) {
        try {
          await api.delete(`/resume/${backendId}`);
        } catch (error) {
          console.error('Failed to delete resume from backend:', error);
        }
      }
    }
  };

  const createNewResume = () => navigate(`${ROUTES.RESUME_BUILDER}/new`);
  const editResume = (id) => navigate(`${ROUTES.RESUME_BUILDER}/${id}`);

  // --- DIRECT PDF DOWNLOAD LOGIC ---
  const handleDirectDownload = async (resumeId) => {
    const targetResume = resumes.find(r => r.id === resumeId);
    if (!targetResume) return;

    setDownloadingId(resumeId);
    setPdfTargetResume(targetResume);

    // Wait for React to render the hidden template container
    setTimeout(async () => {
      try {
        const element = document.getElementById('hidden-pdf-target');
        if (!element) throw new Error('PDF target not found');

        const canvas = await html2canvas(element, {
          scale: 2.0,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          letterRendering: true
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        const pdf = new jsPDF('p', 'mm', 'a4', true);

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const imgScaledHeight = (imgHeight * pdfWidth) / imgWidth;

        let heightLeft = imgScaledHeight;
        let position = 0;

        // Add content to PDF, spanning multiple pages if necessary
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgScaledHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgScaledHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgScaledHeight, undefined, 'FAST');
          heightLeft -= pdfHeight;
        }

        pdf.save(`${targetResume.name || 'resume'}.pdf`);
      } catch (error) {
        console.error('Download failed:', error);
        alert('Failed to generate PDF. Please try opening the resume editor.');
      } finally {
        setDownloadingId(null);
        setPdfTargetResume(null); // Clean up hidden DOM
      }
    }, 1000); // 1s buffer for rendering images/fonts
  };

  const renderHiddenTemplate = () => {
    if (!pdfTargetResume) return null;

    const props = { formData: pdfTargetResume };
    const tid = Number(pdfTargetResume.templateId) || 1;

    switch (tid) {
      case 1: return <Template1 {...props} />;
      case 2: return <Template2 {...props} />;
      case 3: return <Template3 {...props} />;
      case 4: return <Template4 {...props} />;
      case 5: return <Template5 {...props} />;
      case 6: return <Template6 {...props} />;
      case 7: return <Template7 {...props} />;
      case 8: return <Template8 {...props} />;
      case 9: return <Template9 {...props} />;
      case 10: return <Template10 {...props} />;
      case 11: return <Template11 {...props} />;
      case 12: return <Template12 {...props} />;
      case 13: return <Template13 {...props} />;
      default: return <Template1 {...props} />;
    }
  };


  return (
    <Layout role="candidate" fullWidth={true}>
      <div className="bg-stone-50 dark:bg-[#1c1917] min-h-screen font-sans text-stone-900 dark:text-stone-100 flex flex-col items-center">

        {/* Hidden Container for PDF Generation */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '1000px', overflow: 'visible' }}>
          <div
            id="hidden-pdf-target"
            style={{
              width: '816px',
              minHeight: '1123px',
              backgroundColor: 'white',
              paddingBottom: '60px', // Bottom margin for multi-page flow
              display: 'block'
            }}
          >
            {renderHiddenTemplate()}
          </div>
        </div>

        {/* Content Main */}
        <div className="w-full max-w-[1000px] flex-1 flex flex-col gap-8 py-8 px-4 md:px-10 lg:px-20">

          <div className="flex flex-col gap-2">
            <button
              onClick={() => navigate(-1)}
              className="self-start flex items-center gap-2 text-stone-500 hover:text-emerald-600 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-2">
              <div>
                <h1 className="text-stone-900 dark:text-white text-3xl md:text-4xl font-black leading-tight tracking-tight mb-2">My Resumes</h1>
                <p className="text-stone-500 dark:text-stone-400 text-base font-normal leading-relaxed max-w-xl">
                  Create, manage, and tailor your resumes for different job applications.
                </p>
              </div>
              <button
                onClick={createNewResume}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-bold shadow-sm transition-all transform hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
              >
                <Plus className="w-5 h-5" />
                Create New Resume
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-4 pb-12">
            <div className="hidden md:grid grid-cols-12 gap-4 px-4 text-xs font-semibold text-stone-400 uppercase tracking-wider">
              <div className="col-span-6">Resume Name</div>
              <div className="col-span-3">Last Modified</div>
              <div className="col-span-3 text-right">Actions</div>
            </div>

            {resumes.length === 0 && !loading ? (
              <div className="text-center py-12 border-2 border-dashed border-stone-200 dark:border-stone-700 rounded-xl">
                <p className="text-stone-400 font-medium">No resumes found. Create one to get started!</p>
              </div>
            ) : (
              resumes.map((resume) => {
                const IconComp = FileText;
                const bgClass = "bg-emerald-50 dark:bg-emerald-900/20";
                const textClass = "text-emerald-600 dark:text-emerald-500";
                const groupHoverBg = "group-hover:bg-emerald-600";

                return (
                  <div key={resume.id} className="group flex flex-col md:grid md:grid-cols-12 gap-4 items-center p-4 bg-white dark:bg-[#292524] border border-stone-200 dark:border-stone-800 rounded-xl hover:border-emerald-600/50 hover:shadow-md transition-all duration-200">

                    <div className="w-full md:col-span-6 flex items-center gap-4">
                      <div className={`size-12 shrink-0 rounded-lg ${bgClass} flex items-center justify-center ${textClass} ${groupHoverBg} group-hover:text-white transition-colors duration-200`}>
                        <IconComp className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-stone-900 dark:text-white group-hover:text-emerald-600 transition-colors">
                          {resume.name || 'Untitled Resume'}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-stone-400 flex items-center gap-1">
                            <Edit3 className="w-3 h-3" />
                            Updated {timeAgo(resume.lastUpdated)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:col-span-3 pl-[4rem] md:pl-0">
                      <span className="md:hidden font-medium text-stone-400 mr-2">Modified:</span>
                      <span className="text-sm text-stone-500 dark:text-stone-400">{timeAgo(resume.lastUpdated)}</span>
                    </div>

                    <div className="w-full md:col-span-3 flex items-center justify-end gap-2 pl-[4rem] md:pl-0 mt-2 md:mt-0">
                      <button onClick={() => editResume(resume.id)} className="p-2 text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors" title="View">
                        <Eye className="w-5 h-5" />
                      </button>

                      <button
                        onClick={() => editResume(resume.id)}
                        className="hidden md:flex px-3 py-2 text-sm font-bold text-white bg-stone-900 dark:bg-white dark:text-stone-900 hover:opacity-90 rounded-lg transition-opacity items-center gap-1"
                      >
                        <Edit3 className="w-4 h-4" />
                        Edit
                      </button>

                      <button
                        onClick={() => handleDirectDownload(resume.id)}
                        disabled={downloadingId === resume.id}
                        className="p-2 text-stone-500 hover:text-emerald-600 dark:text-stone-400 dark:hover:text-emerald-500 bg-transparent hover:bg-stone-100 dark:hover:bg-stone-800 rounded-lg transition-colors disabled:opacity-50"
                        title="Download PDF"
                      >
                        {downloadingId === resume.id ? (
                          <Loader2 className="w-5 h-5 animate-spin text-emerald-600" />
                        ) : (
                          <Download className="w-5 h-5" />
                        )}
                      </button>

                      <button
                        onClick={() => deleteResume(resume.id)}
                        className="p-2 text-stone-400 hover:text-red-600 dark:text-stone-500 dark:hover:text-red-400 bg-transparent hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}

          </div>
        </div>
      </div>
    </Layout>
  );
};

export default MyResumes;
