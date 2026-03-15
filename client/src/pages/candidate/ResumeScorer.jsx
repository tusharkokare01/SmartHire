import { useState, useEffect } from 'react';
import {
  FileText,
  Search,
  Upload,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Loader2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { fetchAllResumes } from '../../services/resumeService';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';

const ResumeScorer = () => {
  const { user } = useAuth();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  /* ===========================
     LOAD RESUMES
  ============================ */
  useEffect(() => {
    const loadData = async () => {
      if (!user?.email) return;

      const unifiedResumes = await fetchAllResumes(user);
      setResumes(unifiedResumes);

      if (unifiedResumes.length > 0) {
        setSelectedResumeId(unifiedResumes[0].id);
      }
    };
    loadData();
  }, [user]);

  /* ===========================
     NORMALIZE RESUME DATA
     (CRITICAL FOR ATS)
  ============================ */
  const normalizeResume = (resume) => ({
    personalInfo: resume.personalInfo || {},
    profileSummary: resume.profileSummary || '',

    experience: Array.isArray(resume.experience)
      ? resume.experience.map(exp => ({
        title: exp.title || '',
        company: exp.company || '',
        duration: exp.duration || '',
        description: exp.description || ''
      }))
      : [],

    education: Array.isArray(resume.education)
      ? resume.education.map(edu => ({
        degree: edu.degree || '',
        institution: edu.institution || '',
        year: edu.year || '',
        gpa: edu.gpa || ''
      }))
      : [],

    projects: Array.isArray(resume.projects)
      ? resume.projects.map(proj => ({
        name: proj.name || '',
        description: proj.description || '',
        technologies: proj.technologies || '',
        link: proj.link || ''
      }))
      : [],

    certifications: Array.isArray(resume.certifications)
      ? resume.certifications.map(cert => ({
        name: cert.name || '',
        issuer: cert.issuer || '',
        year: cert.year || ''
      }))
      : [],

    skills: Array.isArray(resume.skills) ? resume.skills : [],
    tools: Array.isArray(resume.tools) ? resume.tools : [],
    languages: Array.isArray(resume.languages) ? resume.languages : [],
    extraSections: Array.isArray(resume.extraSections) ? resume.extraSections : []
  });

  /* ===========================
     ANALYZE RESUME
  ============================ */
  const handleAnalyze = async () => {
    if (!selectedResumeId || !jobDescription.trim()) {
      alert('Please select a resume and enter a job description.');
      return;
    }

    const selectedResume = resumes.find(r => String(r.id) === String(selectedResumeId));
    if (!selectedResume) {
      alert('Selected resume not found.');
      return;
    }

    const safeResumeData = normalizeResume(selectedResume);

    setIsAnalyzing(true);
    setResult(null);

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/ai/score-resume`,
        {
          resumeData: safeResumeData,
          jobDescription: jobDescription.trim()
        }
      );

      const data = response.data || {};

      // Defensive fallback
      setResult({
        matchScore: Number(data.matchScore) || 0,
        missingKeywords: Array.isArray(data.missingKeywords) ? data.missingKeywords : [],
        tips: Array.isArray(data.tips) ? data.tips : [],
        summary: data.summary || 'Analysis completed.'
      });
    } catch (error) {
      console.error('Resume analysis failed:', error);
      alert('Failed to analyze resume. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  /* ===========================
     UI
  ============================ */
  return (
    <Layout role="candidate">
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            to={ROUTES.CANDIDATE_DASHBOARD}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700"
          >
            <ArrowLeft className="w-6 h-6" />
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-slate-900">AI Resume Scorer</h1>
            <p className="text-secondary mt-1">
              ATS-based resume match using all resume sections
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LEFT */}
          <div className="space-y-6">
            <div className="bg-surface rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-emerald-600" />
                Select Resume
              </h2>

              {resumes.length > 0 ? (
                resumes.map(resume => (
                  <div
                    key={resume.id}
                    onClick={() => setSelectedResumeId(resume.id)}
                    className={`p-4 mb-3 rounded-lg border-2 cursor-pointer ${selectedResumeId === resume.id
                        ? 'border-emerald-600 bg-emerald-600/5'
                        : 'border-slate-200 hover:border-slate-300'
                      }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className="font-medium">{resume.name || 'Untitled Resume'}</h3>
                        <p className="text-sm text-slate-500">
                          {resume.personalInfo?.fullName || 'Unnamed'}
                        </p>
                      </div>
                      {selectedResumeId === resume.id && (
                        <CheckCircle className="w-5 h-5 text-emerald-600" />
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 border-dashed border-2 rounded-lg border-slate-200">
                  <p className="mb-4 text-slate-500 font-medium">No resumes found</p>
                  <Link
                    to={ROUTES.RESUME_BUILDER}
                    className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-all font-semibold shadow-sm"
                  >
                    Create Resume <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              )}
            </div>

            <div className="bg-surface rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                Job Description
              </h2>

              <textarea
                value={jobDescription}
                onChange={e => setJobDescription(e.target.value)}
                className="w-full h-64 p-4 border rounded-lg resize-none"
                placeholder="Paste full job description here"
              />

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing || !jobDescription.trim()}
                className="w-full mt-4 py-3 bg-emerald-600 text-white rounded-lg flex justify-center gap-2 disabled:opacity-60"
              >
                {isAnalyzing ? <Loader2 className="animate-spin w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze Resume'}
              </button>
            </div>
          </div>

          {/* RIGHT */}
          <div>
            {result ? (
              <div className="bg-surface rounded-lg shadow p-6 sticky top-6">
                <h2 className="text-xl font-bold text-center mb-4">
                  Match Score: {result.matchScore}%
                </h2>

                <p className="text-center text-slate-600 mb-6">
                  {result.summary}
                </p>

                <h3 className="font-semibold text-red-600 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Missing Keywords
                </h3>

                <div className="flex flex-wrap gap-2 mb-6">
                  {result.missingKeywords.length > 0
                    ? result.missingKeywords.map((k, i) => (
                      <span key={i} className="px-3 py-1 bg-red-100 rounded-full text-sm">
                        {k}
                      </span>
                    ))
                    : <span className="text-sm text-slate-500">None 🎉</span>}
                </div>

                <h3 className="font-semibold text-blue-600 mb-2 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Improvement Tips
                </h3>

                <ul className="space-y-2">
                  {result.tips.length > 0
                    ? result.tips.map((tip, i) => (
                      <li key={i} className="bg-blue-50 p-3 rounded text-sm">
                        {tip}
                      </li>
                    ))
                    : <li className="text-sm text-slate-500">No major improvements needed</li>}
                </ul>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-dashed border-2 rounded-lg p-12">
                <Upload className="w-16 h-16 text-slate-300 mb-4" />
                <p>Select resume and JD to analyze</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ResumeScorer;
