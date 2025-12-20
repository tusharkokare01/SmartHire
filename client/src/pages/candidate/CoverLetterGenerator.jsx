import { useState, useEffect } from 'react';
import { FileText, Search, PenTool, Download, Copy, Loader2, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { loadJSON } from '../../utils/storage';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const CoverLetterGenerator = () => {
  const { user } = useAuth();
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [formData, setFormData] = useState({
    companyName: '',
    jobTitle: '',
    jobDescription: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedLetter, setGeneratedLetter] = useState('');

  useEffect(() => {
    if (user?.email) {
      const savedResumes = loadJSON(`resumes_list_${user.email}`, []);
      setResumes(savedResumes);
      if (savedResumes.length > 0) {
        setSelectedResumeId(savedResumes[0].id);
      }
    }
  }, [user]);

  const handleGenerate = async () => {
    if (!selectedResumeId || !formData.companyName || !formData.jobTitle || !formData.jobDescription) {
      alert("Please fill in all fields and select a resume.");
      return;
    }

    setIsGenerating(true);
    try {
      const selectedResume = resumes.find(r => r.id === selectedResumeId);

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/generate-cover-letter`, {
        resumeData: selectedResume,
        ...formData
      });

      setGeneratedLetter(response.data.coverLetter);
    } catch (error) {
      console.error("Generation failed", error);
      alert("Failed to generate cover letter. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLetter);
    alert("Copied to clipboard!");
  };

  const downloadDoc = () => {
    const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Cover Letter</title></head><body>";
    const footer = "</body></html>";
    const content = generatedLetter.replace(/\n/g, "<br/>");
    const sourceHTML = header + content + footer;

    const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
    const element = document.createElement("a");
    element.href = source;
    element.download = `Cover_Letter_${formData.companyName || 'Generated'}.doc`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <Layout role="candidate">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.CANDIDATE_DASHBOARD}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500 hover:text-slate-700"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Cover Letter Generator</h1>
            <p className="text-secondary mt-1">Instantly write personalized cover letters tailored to any job</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            {/* Resume Selection */}
            <div className="bg-surface rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Select Resume Source
              </h2>
              {resumes.length > 0 ? (
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      onClick={() => setSelectedResumeId(resume.id)}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedResumeId === resume.id
                        ? 'border-emerald-600 bg-emerald-600/5'
                        : 'border-slate-200 hover:border-slate-300'
                        }`}
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-medium text-slate-900 text-sm">{resume.name || 'Untitled Resume'}</h3>
                        </div>
                        {selectedResumeId === resume.id && (
                          <CheckCircle className="w-4 h-4 text-emerald-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
                  <p className="text-slate-500 text-sm mb-3">No resumes found</p>
                  <Link
                    to={ROUTES.RESUME_BUILDER}
                    className="inline-flex items-center px-3 py-1.5 bg-emerald-600 text-white rounded text-sm hover:bg-emerald-600/90"
                  >
                    Create Resume
                  </Link>
                </div>
              )}
            </div>

            {/* Job Details */}
            <div className="bg-surface rounded-lg shadow p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-2 flex items-center gap-2">
                <PenTool className="w-5 h-5 text-emerald-600" />
                Job Details
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Company Name</label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  placeholder="e.g. Google"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Title</label>
                <input
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData({ ...formData, jobTitle: e.target.value })}
                  placeholder="e.g. Senior Frontend Engineer"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Job Description</label>
                <textarea
                  value={formData.jobDescription}
                  onChange={(e) => setFormData({ ...formData, jobDescription: e.target.value })}
                  placeholder="Paste the job description here..."
                  className="w-full h-32 p-4 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none"
                />
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || resumes.length === 0}
                className="w-full py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-600/90 font-medium flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <PenTool className="w-5 h-5" />}
                {isGenerating ? 'Writing Cover Letter...' : 'Generate Cover Letter'}
              </button>
            </div>
          </div>

          {/* Output Section */}
          <div className="h-full">
            <div className="bg-surface rounded-lg shadow p-6 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Generated Letter</h2>
                {generatedLetter && (
                  <div className="flex gap-2">
                    <button
                      onClick={copyToClipboard}
                      className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-md transition-colors"
                      title="Copy to Clipboard"
                    >
                      <Copy className="w-5 h-5" />
                    </button>
                    <button
                      onClick={downloadDoc}
                      className="p-2 text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-md transition-colors"
                      title="Download as Word Doc"
                    >
                      <FileText className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

              <textarea
                value={generatedLetter}
                onChange={(e) => setGeneratedLetter(e.target.value)}
                placeholder="Your AI-generated cover letter will appear here..."
                className="flex-1 w-full p-6 border rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none font-serif text-slate-800 leading-relaxed text-base min-h-[500px]"
              />
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CoverLetterGenerator;
