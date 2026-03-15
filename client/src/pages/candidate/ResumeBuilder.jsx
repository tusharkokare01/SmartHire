import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { Save, Download, Eye, Sparkles, X, Wand2, ArrowLeft, FileText, ZoomIn, ZoomOut, ChevronDown, Check, LayoutTemplate, Lightbulb, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import axios from 'axios';
import api from '../../services/api';


import Layout from '../../components/common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { loadJSON, saveJSON } from '../../utils/storage';
import { ROUTES } from '../../utils/constants';
import { resumeSchema } from '../../utils/resumeValidation';

// Form Components
import PersonalInfoForm from '../../components/resume/forms/PersonalInfoForm';
import EducationForm from '../../components/resume/forms/EducationForm';
import ExperienceForm from '../../components/resume/forms/ExperienceForm';
import ProjectsForm from '../../components/resume/forms/ProjectsForm';
import CertificationsForm from '../../components/resume/forms/CertificationsForm';
import SkillsForm from '../../components/resume/forms/SkillsForm';
import LanguagesForm from '../../components/resume/forms/LanguagesForm';
import StrengthsForm from '../../components/resume/forms/StrengthsForm';
import ExtraSectionsForm from '../../components/resume/forms/ExtraSectionsForm';
// ResumePDF import removed as we now use html2canvas for PDF generation

// Templates
import { Template1, Template2, Template3 } from '../../components/resume/ResumeTemplates';
import { Template4, Template5, Template6, Template7, Template8, Template9, Template10, Template11, Template12, Template13 } from '../../components/resume/NewResumeTemplates';

const ResumeBuilder = () => {
  const { user } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();

  // Local UI State
  const [resumeName, setResumeName] = useState('My Resume');
  const [showPreview, setShowPreview] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(1);
  const [saveMessage, setSaveMessage] = useState('');
  const [backendResumeId, setBackendResumeId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [zoom, setZoom] = useState(0.8);

  // Zoom Helpers
  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 1.5));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.4));

  // AI Modal State
  const [showAIModal, setShowAIModal] = useState(false);
  const [aiInputs, setAiInputs] = useState({
    role: '',
    yearsExp: '',
    industry: '',
  });

  // Preview UI State
  const [showTemplateMenu, setShowTemplateMenu] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);





  // React Hook Form Setup
  const methods = useForm({
    resolver: zodResolver(resumeSchema),
    defaultValues: {
      personalInfo: {
        fullName: '',
        email: '',
        phone: '',
        address: '',
        linkedin: '',
        github: '',
      },
      profileSummary: '',
      education: [],
      experience: [],
      projects: [],
      certifications: [],
      skills: [],
      languages: [],
      extraSections: []
    }
  });

  const { reset, watch, handleSubmit, getValues } = methods;
  const formData = watch(); // Live data for preview/templates

  // Content Analysis Logic
  const getSuggestions = () => {
    const tips = [];
    if (!formData.personalInfo?.phone) tips.push({ type: 'critical', text: 'Phone number is missing', icon: AlertCircle });
    if (!formData.personalInfo?.linkedin) tips.push({ type: 'warning', text: 'Add LinkedIn profile for better visibility', icon: Lightbulb });
    if (!formData.profileSummary || formData.profileSummary.length < 50) tips.push({ type: 'warning', text: 'Profile summary is too short (aim for 2-3 sentences)', icon: FileText });
    if (!formData.experience || formData.experience.length === 0) tips.push({ type: 'critical', text: 'Add at least one work experience', icon: AlertCircle });
    if (!formData.skills || formData.skills.length < 3) tips.push({ type: 'warning', text: 'Add more skills (at least 5 recommended)', icon: Lightbulb });
    if (!formData.education || formData.education.length === 0) tips.push({ type: 'critical', text: 'Education section is missing', icon: AlertCircle });

    // Check descriptions
    const shortExp = formData.experience?.find(exp => !exp.description || exp.description.length < 20);
    if (shortExp) tips.push({ type: 'warning', text: `Expand description for ${shortExp.title} role`, icon: FileText });

    return tips;
  };

  const suggestions = getSuggestions();

  // Load existing resume
  useEffect(() => {
    if (!user?.email) return;

    if (id && id !== 'new') {
      const allResumes = loadJSON(`resumes_list_${user.email}`, []);
      const found = allResumes.find(r => r.id.toString() === id);

      if (found) {
        const { name, lastUpdated, templateId, userId, backendId, ...rest } = found;
        reset(rest);
        setResumeName(name || 'My Resume');
        setSelectedTemplate(Number(templateId) || 1);
        setBackendResumeId(backendId || null);
      } else {
        // Fallback: Fetch from backend
        const fetchFromBackend = async () => {
          try {
            const res = await api.get(`/resume/${id}`);
            if (res.data) {
              const { resumeName, templateId, userId, _id, ...rest } = res.data;
              reset(rest);
              setResumeName(resumeName || 'My Resume');
              setSelectedTemplate(Number(templateId) || 1);
              setBackendResumeId(_id);
            }
          } catch (e) {
            console.error("Failed to load resume", e);
          }
        };
        fetchFromBackend();
      }
    }
  }, [user, id, reset]);

  // Pre-fill user data for new resumes
  useEffect(() => {
    if (user && (!id || id === 'new')) {
      const currentValues = getValues();
      if (!currentValues.personalInfo.fullName && !currentValues.personalInfo.email) {
        reset({
          ...currentValues,
          personalInfo: {
            ...currentValues.personalInfo,
            fullName: user.name || '',
            email: user.email || '',
          }
        });
      }
    }
  }, [user, id, reset, getValues]);

  const generateResume = async () => {
    const { role, yearsExp, industry } = aiInputs;

    if (!role || !yearsExp) {
      alert('Please fill in all required fields');
      return;
    }

    setShowAIModal(false);

    try {
      setSaveMessage('Generating content with AI...');

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/generate-resume`, {
        role,
        yearsExp,
        industry,
        currentData: getValues()
      });

      const aiData = response.data || {};

      // Merge Strategy: Keep existing valid data, use AI for missing/new data
      // For arrays, we append AI suggestions
      const currentData = getValues();

      const mergedData = {
        ...currentData,
        ...aiData,
        personalInfo: {
          ...currentData.personalInfo,
          ...aiData.personalInfo,
          fullName: typeof (currentData.personalInfo.fullName || aiData.personalInfo?.fullName) === 'string'
            ? (currentData.personalInfo.fullName || aiData.personalInfo?.fullName || '')
            : String(currentData.personalInfo.fullName || aiData.personalInfo?.fullName || ''),
          email: String(currentData.personalInfo.email || aiData.personalInfo?.email || ''),
          phone: String(currentData.personalInfo.phone || aiData.personalInfo?.phone || ''),
          address: String(currentData.personalInfo.address || aiData.personalInfo?.address || ''),
        },
        skills: [...new Set([
          ...(currentData.skills || []),
          ...(aiData.skills || []).flatMap(s => {
            if (typeof s === 'string') return s;
            if (s && typeof s === 'object') {
              if (Array.isArray(s.technologies)) return s.technologies;
              if (typeof s.technologies === 'string') return s.technologies.split(',').map(t => t.trim());
              return s.name || s.skill || [];
            }
            return String(s);
          })
        ])].filter(Boolean),
        experience: [...(currentData.experience || []), ...(aiData.experience || [])].map(exp => ({
          ...exp,
          title: String(exp.title || ''),
          company: String(exp.company || ''),
          description: String(exp.description || '')
        })),
        education: [...(currentData.education || []), ...(aiData.education || [])].map(edu => ({
          ...edu,
          institution: String(edu.institution || ''),
          degree: String(edu.degree || '')
        })),
        projects: [...(currentData.projects || []), ...(aiData.projects || []).map(p => ({
          ...p,
          name: String(p.name || ''),
          description: String(p.description || ''),
          technologies: Array.isArray(p.technologies) ? p.technologies.join(', ') : String(p.technologies || '')
        }))],
      };

      reset(mergedData);
      setSaveMessage('Resume generated successfully!');
      setTimeout(() => setSaveMessage(''), 3000);

    } catch (error) {
      console.error('Error generating resume with AI:', error);
      alert('Failed to generate resume. Please try again.');
      setSaveMessage('Generation failed');
    }
  };

  const onSubmit = async (data) => {
    if (!user?.email) {
      alert('You must be logged in to save your resume.');
      return;
    }

    const allResumes = loadJSON(`resumes_list_${user.email}`, []);
    let updatedList;
    let currentId = id;

    const baseResumeData = {
      ...data,
      lastUpdated: new Date().toISOString(),
      userId: user.id || user._id,
      templateId: selectedTemplate
    };

    const localResumeData = {
      ...baseResumeData,
      name: resumeName,
    };

    let savedBackendId = backendResumeId;

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/resume`, {
        ...baseResumeData,
        resumeName: resumeName,
        ...(savedBackendId ? { resumeId: savedBackendId } : {}),
      });

      if (response.data && response.data._id) {
        savedBackendId = response.data._id;
        setBackendResumeId(savedBackendId);
      }

      setSaveMessage('Resume saved to cloud successfully!');
    } catch (error) {
      console.error('Failed to save to cloud:', error);
      setSaveMessage('Saved locally only (Cloud sync failed)');
    }

    const resumeData = {
      ...localResumeData,
      backendId: savedBackendId || undefined,
    };

    if (id && id !== 'new') {
      updatedList = allResumes.map(r =>
        r.id.toString() === id
          ? { ...resumeData, id: r.id }
          : r
      );
    } else {
      const newId = Date.now();
      currentId = newId;
      updatedList = [...allResumes, { ...resumeData, id: newId }];
    }

    saveJSON(`resumes_list_${user.email}`, updatedList);

    // Update global list
    const globalResumes = loadJSON('resumes_all', []);
    const summary = {
      id: currentId,
      userId: user.email,
      name: resumeName,
      role: data.experience?.[0]?.title || 'Candidate',
      experience: data.experience?.length > 0 ? `${data.experience.length} role(s)` : 'No professional experience',
      lastUpdated: resumeData.lastUpdated,
    };

    const existingIndex = globalResumes.findIndex(r => r.id === currentId);
    if (existingIndex === -1) {
      globalResumes.push(summary);
    } else {
      globalResumes[existingIndex] = summary;
    }
    saveJSON('resumes_all', globalResumes);

    setTimeout(() => setSaveMessage(''), 3000);

    if (!id || id === 'new') {
      navigate(`${ROUTES.RESUME_BUILDER}/${currentId}`, { replace: true });
    }
  };

  const onError = (errors) => {
    console.log("Validation Errors:", errors);
    alert("Please fix the validation errors before saving.");
  };

  const handleDownloadPDF = async () => {
    const element = document.getElementById('resume-pdf-target');
    if (!element) return;

    setIsDownloading(true);
    try {
      const canvas = await html2canvas(element, {
        scale: 2.0, // 2x is plenty sharp for printing while keeping file size small
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        letterRendering: true,
        allowTaint: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.95); // High quality JPEG for better compression than PNG
      const pdf = new jsPDF('p', 'mm', 'a4', true); // Enable internal compression

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      // Maintain aspect ratio while fitting to PDF width
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const imgScaledHeight = (imgHeight * pdfWidth) / imgWidth;

      let heightLeft = imgScaledHeight;
      let position = 0;
      let currentPage = 1;

      // Add first page
      pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgScaledHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;

      // Add subsequent pages if content overflows A4 height
      while (heightLeft > 0) {
        position = heightLeft - imgScaledHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, pdfWidth, imgScaledHeight, undefined, 'FAST');
        heightLeft -= pdfHeight;
        currentPage++;
      }

      // Add clickable links with correct mapping
      const links = element.querySelectorAll('a[href]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
          const rect = link.getBoundingClientRect();
          const elementRect = element.getBoundingClientRect();

          const relX = rect.left - elementRect.left;
          const relY = rect.top - elementRect.top;

          // PDF Dimensions (A4): 210mm wide. Element width is 816px.
          const pdfX = (relX / 816) * pdfWidth;
          const pdfY = (relY / 816) * pdfWidth; // Y also depends on width ratio for accurate mapping
          const pdfLinkWidth = (rect.width / 816) * pdfWidth;
          const pdfLinkHeight = (rect.height / 816) * pdfWidth;

          const linkPage = Math.floor(pdfY / pdfHeight);
          if (linkPage < currentPage) {
            pdf.setPage(linkPage + 1);
            const pageY = pdfY - (linkPage * pdfHeight);
            pdf.link(pdfX, pageY, pdfLinkWidth, pdfLinkHeight, { url: href });
          }
        }
      });

      pdf.save(`${resumeName || 'resume'}.pdf`);
    } catch (error) {
      console.error('PDF Generation failed:', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };


  const handleDownloadWord = () => {
    const doc = new Document({
      sections: [
        {
          properties: {},
          children: [
            // Header
            new Paragraph({
              text: formData.personalInfo.fullName || 'RESUME',
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
            }),
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({ text: `${formData.personalInfo.email} | ${formData.personalInfo.phone}`, bold: true }),
                new TextRun({ text: `\n${formData.personalInfo.address}` }),
                new TextRun({ text: formData.personalInfo.linkedin ? `\nLinkedIn: ${formData.personalInfo.linkedin}` : '' }),
                new TextRun({ text: formData.personalInfo.github ? `\nGitHub: ${formData.personalInfo.github}` : '' }),
              ],
            }),
            new Paragraph({ text: '' }), // Spacer

            // Summary
            ...(formData.profileSummary ? [
              new Paragraph({ text: 'Professional Summary', heading: HeadingLevel.HEADING_1 }),
              new Paragraph({ text: formData.profileSummary }),
              new Paragraph({ text: '' }),
            ] : []),

            // Experience
            ...(formData.experience.length > 0 ? [
              new Paragraph({ text: 'Experience', heading: HeadingLevel.HEADING_1 }),
              ...formData.experience.flatMap(exp => [
                new Paragraph({
                  children: [
                    new TextRun({ text: exp.title, bold: true, size: 24 }),
                    new TextRun({ text: ` at ${exp.company}`, bold: true }),
                  ]
                }),
                new Paragraph({
                  children: [new TextRun({ text: exp.duration, italics: true })]
                }),
                new Paragraph({ text: exp.description || '' }),
                new Paragraph({ text: '' }),
              ])
            ] : []),

            // Projects
            ...(formData.projects.length > 0 ? [
              new Paragraph({ text: 'Projects', heading: HeadingLevel.HEADING_1 }),
              ...formData.projects.flatMap(proj => [
                new Paragraph({
                  children: [
                    new TextRun({ text: proj.name, bold: true }),
                    new TextRun({ text: proj.link ? ` - ${proj.link}` : '' }),
                  ]
                }),
                new Paragraph({
                  children: [new TextRun({ text: `Tech Stack: ${proj.technologies}`, italics: true })]
                }),
                new Paragraph({ text: proj.description || '' }),
                new Paragraph({ text: '' }),
              ])
            ] : []),

            // Education
            ...(formData.education.length > 0 ? [
              new Paragraph({ text: 'Education', heading: HeadingLevel.HEADING_1 }),
              ...formData.education.flatMap(edu => [
                new Paragraph({
                  children: [
                    new TextRun({ text: edu.institution, bold: true }),
                  ]
                }),
                new Paragraph({
                  children: [
                    new TextRun({ text: edu.degree }),
                    new TextRun({ text: ` (${edu.year})` }),
                  ]
                }),
                new Paragraph({ text: '' }),
              ])
            ] : []),

            // Skills
            ...(formData.skills.length > 0 ? [
              new Paragraph({ text: 'Skills', heading: HeadingLevel.HEADING_1 }),
              new Paragraph({
                text: formData.skills.join(', '),
              }),
              new Paragraph({ text: '' }),
            ] : []),

            // Certifications
            ...(formData.certifications.length > 0 ? [
              new Paragraph({ text: 'Certifications', heading: HeadingLevel.HEADING_1 }),
              ...formData.certifications.flatMap(cert => [
                new Paragraph({
                  children: [
                    new TextRun({ text: cert.name, bold: true }),
                    new TextRun({ text: ` - ${cert.issuer} (${cert.year})` }),
                  ]
                }),
              ])
            ] : []),
          ],
        },
      ],
    });

    Packer.toBlob(doc).then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${resumeName || 'resume'}.docx`;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  };

  // Template Renderer Helper
  const renderTemplate = () => {
    const props = { formData };
    switch (Number(selectedTemplate)) {
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
      <div className="min-h-screen -m-8 p-8">

        {/* Hidden Preview for PDF Generation - Using absolute/off-screen to ensure full height rendering */}
        <div style={{ position: 'absolute', left: '-9999px', top: 0, width: '1000px', overflow: 'visible' }}>
          <div
            id="resume-pdf-target"
            key={selectedTemplate}
            style={{
              width: '816px', // Fixed A4 width (72dpi * 8.5" approx / 96dpi * 8.27" = 794px, 816 is a safe standard)
              minHeight: '1123px', // A4 height at 96dpi
              backgroundColor: 'white',
              transform: 'scale(1)',
              paddingBottom: '60px', // Bottom margin for multi-page flow
              display: 'block'
            }}
          >
            {renderTemplate()}
          </div>
        </div>


        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link
                to={ROUTES.CANDIDATE_DASHBOARD}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  Resume Builder
                </h1>
                <p className="text-slate-500 mt-1 text-sm">Create your professional resume with AI assistance</p>
              </div>
            </div>

            <div className="flex-1 max-w-md mx-4 hidden md:block">
              <input
                type="text"
                value={resumeName}
                onChange={(e) => setResumeName(e.target.value)}
                placeholder="Resume Name (e.g. Software Engineer)"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSubmit(onSubmit, onError)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <Save className="w-4 h-4" />
                Save
              </button>

              <button
                onClick={() => setShowAIModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                AI Generate
              </button>

              <button
                onClick={() => setShowPreview(!showPreview)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${showPreview
                  ? 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                <Eye className="w-4 h-4" />
                {showPreview ? 'Edit' : 'Preview'}
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium disabled:opacity-50"
              >
                {isDownloading ? (
                  <>
                    <Sparkles className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    PDF
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadWord}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
              >
                <FileText className="w-4 h-4" />
                Word
              </button>
            </div>
          </div>
          {saveMessage && (
            <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <p className="text-sm text-emerald-700">{saveMessage}</p>
            </div>
          )}
        </div>

        {/* AI Modal */}
        {showAIModal && createPortal(
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2"><Wand2 className="w-5 h-5 text-emerald-600" /> AI Resume Generator</h2>
                <button onClick={() => setShowAIModal(false)}><X className="w-5 h-5 text-slate-400 hover:text-slate-600" /></button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Target Job Role</label>
                  <input
                    value={aiInputs.role}
                    onChange={(e) => setAiInputs({ ...aiInputs, role: e.target.value })}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. Software Engineer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Experience (Years)</label>
                  <input
                    type="number"
                    value={aiInputs.yearsExp}
                    onChange={(e) => setAiInputs({ ...aiInputs, yearsExp: e.target.value })}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Industry</label>
                  <input
                    value={aiInputs.industry}
                    onChange={(e) => setAiInputs({ ...aiInputs, industry: e.target.value })}
                    className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-emerald-500 outline-none"
                    placeholder="e.g. Tech"
                  />
                </div>

                <div className="pt-2">
                  <button
                    onClick={generateResume}
                    className="w-full py-3 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20"
                  >
                    Generate Content
                  </button>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}

        {/* Content Area */}
        <FormProvider {...methods}>
          {showPreview ? createPortal(
            <div className="fixed inset-0 z-[9999] bg-slate-50 flex flex-col animate-in fade-in duration-200 font-sans text-slate-900">
              {/* Header Bar */}
              <div className="bg-white h-16 px-6 flex items-center justify-between border-b border-slate-200 shadow-sm flex-shrink-0 z-50">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setShowPreview(false)}
                    className="flex items-center gap-2 text-slate-500 hover:text-slate-800 transition-colors text-sm font-medium group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Go Back
                  </button>
                  <div className="h-6 w-px bg-slate-300 mx-2"></div>
                  <h1 className="text-xl font-bold text-slate-900 hidden sm:block">Full Preview</h1>

                  {/* Template Selector */}
                  <div className="relative ml-4">
                    <button
                      onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                      className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg text-sm font-medium text-slate-700 transition-colors"
                    >
                      <LayoutTemplate className="w-4 h-4" />
                      <span>Template: {selectedTemplate}</span>
                      <ChevronDown className="w-3 h-3 text-slate-400" />
                    </button>

                    {showTemplateMenu && (
                      <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-30 max-h-[400px] overflow-y-auto">
                        {[
                          { id: 1, name: 'Professional', desc: 'Classic & Clean' },
                          { id: 2, name: 'Modern', desc: 'Two Column Avatar' },
                          { id: 3, name: 'Dark Mode', desc: 'Bold Sidebar' },
                          { id: 4, name: 'Peach & Black', desc: 'High Contrast' },
                          { id: 5, name: 'Beige Minimal', desc: 'Soft & Elegant' },
                          { id: 6, name: 'Red Accent', desc: 'Striking & Bold' },
                          { id: 7, name: 'Slate Simple', desc: 'Dark Header' },
                          { id: 8, name: 'Academic', desc: 'Formal & Detailed' },
                          { id: 9, name: 'Minimalist', desc: 'Clean & Airy' },
                          { id: 10, name: 'Tech Focused', desc: 'Dark Code Style' },
                          { id: 11, name: 'Creative', desc: 'Colorful & Unique' },
                          { id: 12, name: 'Executive', desc: 'Traditional Serif' },
                          { id: 13, name: 'Startup', desc: 'Modern & Bold' },
                        ].map(t => (
                          <button
                            key={t.id}
                            onClick={() => { setSelectedTemplate(t.id); setShowTemplateMenu(false); }}
                            className={`w-full text-left px-4 py-3 hover:bg-slate-50 border-b border-slate-100 last:border-0 flex items-start gap-3 transition-colors ${selectedTemplate === t.id ? 'bg-emerald-50/50' : ''}`}
                          >
                            <div className={`w-4 h-4 mt-0.5 rounded-full border flex items-center justify-center flex-shrink-0 ${selectedTemplate === t.id ? 'border-emerald-600 bg-emerald-600' : 'border-slate-300'}`}>
                              {selectedTemplate === t.id && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div>
                              <p className={`text-sm font-semibold ${selectedTemplate === t.id ? 'text-emerald-700' : 'text-slate-800'}`}>{t.id}. {t.name}</p>
                              <p className="text-xs text-slate-500">{t.desc}</p>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {/* Content Suggestions */}
                  <div className="relative">
                    <button
                      onClick={() => setShowSuggestions(!showSuggestions)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${suggestions.length > 0 ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'}`}
                    >
                      {suggestions.length > 0 ? <Lightbulb className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                      {suggestions.length > 0 ? `${suggestions.length} Tips` : 'All Good!'}
                    </button>

                    {showSuggestions && (
                      <div className="absolute top-full right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-30 animate-in fade-in zoom-in duration-200">
                        <div className="bg-slate-50 px-4 py-3 border-b border-slate-100 flex justify-between items-center">
                          <h3 className="font-semibold text-slate-900">Resume Review</h3>
                          <button onClick={() => setShowSuggestions(false)}><X className="w-4 h-4 text-slate-400 hover:text-slate-600" /></button>
                        </div>
                        <div className="p-2 max-h-[400px] overflow-y-auto">
                          {suggestions.length === 0 ? (
                            <div className="p-4 text-center text-slate-500">
                              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                              <p>Great job! Your resume looks complete.</p>
                            </div>
                          ) : (
                            suggestions.map((tip, idx) => (
                              <div key={idx} className={`flex gap-3 p-3 rounded-lg mb-1 ${tip.type === 'critical' ? 'bg-red-50 text-red-700' : 'bg-amber-50 text-amber-700'}`}>
                                <tip.icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                <div className="text-sm">
                                  <p className="font-medium">{tip.text}</p>
                                  <p className="text-xs opacity-80 mt-1">Suggested improvement</p>
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                  <button
                    onClick={handleDownloadPDF}
                    disabled={isDownloading}
                    className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold shadow-md shadow-emerald-200 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isDownloading ? (
                      <>
                        <Sparkles className="w-4 h-4 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        Download PDF
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Main Content - Resume Canvas */}
              <div className="flex-1 overflow-auto bg-slate-100 p-8 flex justify-center items-start">
                <div className="relative group perspective-1000">
                  <div
                    id="resume-preview-content"
                    className="bg-white shadow-2xl transition-all duration-300 ease-out origin-top ring-1 ring-slate-900/5 mb-16"
                    style={{
                      width: '816px', // Fixed A4 width
                      minHeight: '1056px',
                      transform: `scale(${zoom})`,
                      marginTop: '20px',
                      marginBottom: `${(1056 * zoom) - 1056 + 100}px` // Extra margin for scrolling
                    }}
                  >
                    {renderTemplate()}
                  </div>

                  {/* Floating Zoom Controls (Bottom Right) */}
                  <div className="fixed bottom-8 right-8 flex flex-col gap-2 bg-white/90 backdrop-blur shadow-xl border border-slate-200 p-2 rounded-2xl z-20 transition-opacity opacity-20 hover:opacity-100">
                    <button onClick={handleZoomIn} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-emerald-600 transition-colors"><ZoomIn className="w-5 h-5" /></button>
                    <div className="w-full h-px bg-slate-200"></div>
                    <span className="text-xs font-bold text-center py-1 text-slate-400 select-none">{Math.round(zoom * 100)}%</span>
                    <div className="w-full h-px bg-slate-200"></div>
                    <button onClick={handleZoomOut} className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 hover:text-emerald-600 transition-colors"><ZoomOut className="w-5 h-5" /></button>
                  </div>
                </div>
              </div>
            </div>,
            document.body
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <PersonalInfoForm />
                {/* Profile Summary Field - kept inline as it's simple */}
                <div className="bg-white rounded-xl shadow-sm p-6 border border-slate-200">
                  <h2 className="text-lg font-semibold mb-4 text-slate-800">Profile Summary</h2>
                  <textarea
                    {...methods.register('profileSummary')}
                    placeholder="Summary..."
                    rows={5}
                    className="w-full px-4 py-3 border rounded-xl outline-none"
                  />
                </div>
                <EducationForm />
                <ExperienceForm />
                <ProjectsForm />
                <CertificationsForm />
                <SkillsForm />
                <LanguagesForm />
                <StrengthsForm />
                <ExtraSectionsForm />
              </div>

              <div className="lg:col-span-1">
                <div className="sticky top-4 space-y-4">

                  {/* Template Selector & Live Preview Header */}
                  <div className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
                    <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                      <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">Live Preview</h2>

                      {/* Compact Template Switcher */}
                      <div className="relative">
                        <button
                          onClick={() => setShowTemplateMenu(!showTemplateMenu)}
                          className="w-full flex items-center justify-between gap-2 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 hover:border-emerald-500 hover:ring-1 hover:ring-emerald-500/20 transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-2 overflow-hidden">
                            <LayoutTemplate className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                            <span className="truncate font-medium">{selectedTemplate}. {
                              [
                                { id: 1, name: 'Professional' }, { id: 2, name: 'Modern' }, { id: 3, name: 'Dark Mode' },
                                { id: 4, name: 'Peach & Black' }, { id: 5, name: 'Beige Minimal' }, { id: 6, name: 'Red Accent' },
                                { id: 7, name: 'Slate Simple' }, { id: 8, name: 'Academic' }, { id: 9, name: 'Minimalist' },
                                { id: 10, name: 'Tech Focused' }, { id: 11, name: 'Creative' }, { id: 12, name: 'Executive' },
                                { id: 13, name: 'Startup' }
                              ].find(t => t.id === Number(selectedTemplate))?.name || 'Template'
                            }</span>
                          </div>
                          <ChevronDown className="w-4 h-4 text-slate-400" />
                        </button>

                        {showTemplateMenu && (
                          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-[300px] overflow-y-auto">
                            {[
                              { id: 1, name: 'Professional', desc: 'Classic' },
                              { id: 2, name: 'Modern', desc: 'Avatar' },
                              { id: 3, name: 'Dark Mode', desc: 'Bold' },
                              { id: 4, name: 'Peach & Black', desc: 'Contrast' },
                              { id: 5, name: 'Beige Minimal', desc: 'Elegant' },
                              { id: 6, name: 'Red Accent', desc: 'Striking' },
                              { id: 7, name: 'Slate Simple', desc: 'Dark' },
                              { id: 8, name: 'Academic', desc: 'Detailed' },
                              { id: 9, name: 'Minimalist', desc: 'Clean' },
                              { id: 10, name: 'Tech Focused', desc: 'Code' },
                              { id: 11, name: 'Creative', desc: 'Unique' },
                              { id: 12, name: 'Executive', desc: 'Serif' },
                              { id: 13, name: 'Startup', desc: 'Modern' },
                            ].map(t => (
                              <button
                                key={t.id}
                                onClick={() => { setSelectedTemplate(t.id); setShowTemplateMenu(false); }}
                                className={`w-full text-left px-3 py-2.5 hover:bg-slate-50 border-b border-slate-50 last:border-0 flex items-center justify-between transition-colors ${selectedTemplate === t.id ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600'}`}
                              >
                                <span className="text-sm font-medium">{t.id}. {t.name}</span>
                                {selectedTemplate === t.id && <Check className="w-3 h-3" />}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Live Mini Preview Canvas */}
                    <div className="relative bg-slate-100/50 w-full overflow-hidden h-[500px] group">
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 origin-top transform scale-[0.4] shadow-2xl bg-white ring-1 ring-slate-900/5 select-none pointer-events-none" style={{ width: '816px', minHeight: '1056px' }}>
                        {renderTemplate()}
                      </div>

                      {/* Hover Overlay */}
                      <div className="absolute inset-0 bg-slate-900/0 hover:bg-slate-900/5 transition-colors flex items-end justify-center pb-8 cursor-pointer z-10" onClick={() => setShowPreview(true)}>
                        <div className="bg-white/90 backdrop-blur text-slate-900 px-5 py-2.5 rounded-full font-bold shadow-xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all flex items-center gap-2 text-sm ring-1 ring-slate-200">
                          <Eye className="w-4 h-4 text-emerald-600" />
                          <span>Click to Expand</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Tips Box */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                    <div className="flex gap-3">
                      <Lightbulb className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <div>
                        <h4 className="font-bold text-blue-800 text-sm mb-1">Pro Tip</h4>
                        <p className="text-blue-700 text-xs leading-relaxed">
                          Use the "AI Generate" button to instantly write professional bullet points for your experience!
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </FormProvider>

      </div>
    </Layout>
  );
};

export default ResumeBuilder;
