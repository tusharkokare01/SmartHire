import { useState, useEffect, useMemo } from 'react';
import {
  FileQuestion, Plus, Save, Trash2, Edit, CheckCircle,
  Users, Search, Clock, Award, ChevronRight, Loader2, X, Sparkles,
  LayoutDashboard, List, BarChart3, MoreVertical, ArrowLeft,
  Settings, Zap, Check, User
} from 'lucide-react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';

// --- SUB-COMPONENTS ---

// 1. STAT CARD
const StatCard = ({ title, value, subtext, icon: Icon, trend }) => (
  <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className="p-2.5 bg-gray-50 rounded-lg border border-[var(--border-light)] text-[var(--primary)]">
        <Icon className="w-5 h-5" />
      </div>
      {trend && (
        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
          {trend}
        </span>
      )}
    </div>
    <div className="text-3xl font-bold text-[var(--primary)] tracking-tight mb-1">{value}</div>
    <div className="text-sm font-medium text-[var(--text-secondary)]">{title}</div>
    {subtext && <div className="text-xs text-[var(--text-light)] mt-2">{subtext}</div>}
  </div>
);

const HRMCQ = () => {
  // Main View State: 'DASHBOARD' | 'EDITOR' | 'RESULTS'
  const [view, setView] = useState('DASHBOARD');
  const [loading, setLoading] = useState(true);

  // Data
  const [assessments, setAssessments] = useState([]);
  const [results, setResults] = useState([]);

  // Editor State
  const [editorMode, setEditorMode] = useState('CREATE'); // 'CREATE' | 'EDIT'
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 30,
    questions: [{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0 }],
  });

  // Assign Modal
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
  const [upcomingCandidates, setUpcomingCandidates] = useState([]);
  const [assigning, setAssigning] = useState(false);

  // AI State
  const [showAiModal, setShowAiModal] = useState(false);
  const [aiTopic, setAiTopic] = useState('');
  const [aiContext, setAiContext] = useState('');
  const [availableResumes, setAvailableResumes] = useState([]); // Store fetched resumes
  const [aiDifficulty, setAiDifficulty] = useState('Medium');
  const [aiLoading, setAiLoading] = useState(false);

  // Initial Data Fetch
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [assesRes, resultsRes, resumesRes] = await Promise.all([
        api.get('/assessments'),
        api.get('/assessments/results'),
        api.get('/resume') // Fetch detailed resumes
      ]);
      setAssessments(assesRes.data);
      setResults(resultsRes.data);
      setAvailableResumes(resumesRes.data); // Store resumes
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  // --- EDITOR LOGIC ---
  const startCreate = () => {
    setEditorMode('CREATE');
    setFormData({
      title: '',
      description: '',
      duration: 30,
      questions: [{ id: 1, question: '', options: ['', '', '', ''], correctAnswer: 0 }],
    });
    setView('EDITOR');
  };

  const startEdit = (assessment) => {
    setEditorMode('EDIT');
    // Ensure deep copy of questions to avoid mutation issues
    setFormData({
      ...assessment,
      questions: assessment.questions.map(q => ({
        ...q,
        options: [...q.options]
      }))
    });
    setView('EDITOR');
  };

  const handleDeleteAssessment = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure? This will delete the assessment and any PENDING assignments.')) return;
    try {
      await api.delete(`/assessments/${id}`);
      setAssessments(prev => prev.filter(a => a._id !== id));
    } catch (error) {
      console.error('Delete failed:', error);
      alert('Failed to delete');
    }
  };

  const handleEditorSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editorMode === 'EDIT' && formData._id) {
        // Handle Update
        await api.put(`/assessments/${formData._id}`, formData);
        alert('Assessment updated successfully!');
      } else {
        // Handle Create
        await api.post('/assessments', formData);
        alert('Assessment created successfully!');
      }
      await fetchData();
      setView('DASHBOARD');
    } catch (error) {
      console.error('Error saving:', error);
      alert('Failed to save assessment');
    }
  };

  const addQuestion = () => {
    setFormData(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        {
          id: prev.questions.length + 1,
          question: '',
          options: ['', '', '', ''],
          correctAnswer: 0,
        }
      ]
    }));
  };

  const updateQuestion = (idx, field, val) => {
    const newQ = [...formData.questions];
    newQ[idx][field] = val;
    setFormData({ ...formData, questions: newQ });
  };

  const updateOption = (qIdx, oIdx, val) => {
    const newQ = [...formData.questions];
    newQ[qIdx].options[oIdx] = val;
    setFormData({ ...formData, questions: newQ });
  };

  // --- AI LOGIC ---
  const handleAiGenerate = async () => {
    if (!aiTopic) return alert('Enter a topic');
    try {
      setAiLoading(true);
      const res = await api.post('/ai/generate-mcq', {
        topic: aiTopic,
        difficulty: aiDifficulty,
        count: 10,
        context: aiContext
      });
      const newQs = res.data.questions.map((q, i) => ({
        id: i + 1,
        question: q.question,
        options: q.options,
        correctAnswer: q.correctAnswer
      }));
      setFormData(prev => ({ ...prev, title: prev.title || `${aiTopic} Test`, questions: newQs }));
      setShowAiModal(false);
      setAiTopic('');
      setAiContext('');
    } catch (e) {
      console.error(e);
      alert('AI Generation Failed');
    } finally {
      setAiLoading(false);
    }
  };

  // --- ASSIGN LOGIC ---
  const openAssignModal = async (aid) => {
    setSelectedAssessmentId(aid);
    setShowAssignModal(true);
    setUpcomingCandidates([]); // Reset first
    try {
      // Fetch upcoming candidates from interviews
      const res = await api.get('/hr/interviews/upcoming');

      // Get list of candidates who ALREADY have this assessment assigned
      // We look at 'results' where assessmentId matches 'aid'
      const assignedCandidateIds = new Set(
        results  // results array contains all assignments/results
          .filter(r => r.assessmentId?._id === aid || r.assessmentId === aid)
          .map(r => r.candidateId?._id || r.candidateId)
      );

      const unique = [];
      const seen = new Set();

      res.data.forEach(i => {
        // Only valid candidates
        if (i.candidateId && i.candidateId._id) {
          const cid = i.candidateId._id;

          // Filter duplicates from the interview list AND already assigned candidates
          if (!seen.has(cid) && !assignedCandidateIds.has(cid)) {
            seen.add(cid);
            unique.push(i.candidateId);
          }
        }
      });
      setUpcomingCandidates(unique);
    } catch (e) { console.error(e); }
  };

  const handleAssign = async (cid) => {
    try {
      setAssigning(true);
      await api.post('/assessments/assign', { assessmentId: selectedAssessmentId, candidateId: cid });

      // Optimistic update: Remove from list immediately
      setUpcomingCandidates(prev => prev.filter(c => c._id !== cid));

      // Refresh data to update 'Results' stats
      await fetchData();
      alert('Assigned successfully!');

      // If no candidates left, close modal
      if (upcomingCandidates.length <= 1) {
        setShowAssignModal(false);
      }
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Failed to assign');
    }
    finally { setAssigning(false); }
  };

  // --- COMPUTED STATS ---
  const stats = useMemo(() => {
    const totalAssessments = assessments.length;
    const totalResults = results.length;
    const completed = results.filter(r => r.status === 'Completed').length;
    const avgScore = completed > 0
      ? (results.reduce((acc, curr) => acc + (curr.score || 0), 0) / completed).toFixed(1)
      : 0;

    return { totalAssessments, totalResults, completed, avgScore };
  }, [assessments, results]);

  return (
    <Layout role="hr" fullWidth={true}>
      <div className="min-h-screen bg-slate-50/50 text-slate-800 font-sans">

        {/* === DASHBOARD VIEW === */}
        {view === 'DASHBOARD' && (
          <div className="max-w-7xl mx-auto p-8 space-y-10">
            {/* Header */}
            <div className="flex justify-between items-end">
              <div>
                <h1 className="text-4xl font-bold tracking-tight mb-2 text-slate-900">Assessment Studio</h1>
                <p className="text-slate-500">Manage technical screenings, analyze results, and automate grading.</p>
              </div>
              <button
                onClick={startCreate}
                className="bg-zinc-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-black transition-all flex items-center gap-2 shadow-lg shadow-zinc-200 hover:shadow-xl hover:-translate-y-1"
              >
                <Plus className="w-5 h-5" />
                New Assessment
              </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatCard title="Active Tests" value={stats.totalAssessments} icon={LayoutDashboard} trend="+2 new" />
              <StatCard title="Candidates Tested" value={stats.totalResults} icon={Users} subtext="Lifetime total" />
              <StatCard title="Avg. Score" value={`${stats.avgScore}/10`} icon={BarChart3} trend={Number(stats.avgScore) > 6 ? 'Good' : 'Needs Focus'} />
              <StatCard title="Completion Rate" value={stats.totalResults ? `${Math.round((stats.completed / stats.totalResults) * 100)}%` : '0%'} icon={CheckCircle} />
            </div>

            {/* Content Tabs area */}
            <div className="space-y-6">
              <div className="flex items-center gap-8 border-b border-slate-200">
                <button className="pb-4 border-b-2 border-emerald-500 font-bold text-slate-800">All Assessments</button>
                <button
                  onClick={() => setView('RESULTS')}
                  className="pb-4 border-b-2 border-transparent font-medium text-slate-500 hover:text-emerald-600 transition-colors"
                >
                  Results Analytics
                </button>
              </div>

              {/* Project Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                  <div className="col-span-full py-20 flex justify-center"><Loader2 className="animate-spin w-8 h-8 text-emerald-600" /></div>
                ) : assessments.length === 0 ? (
                  <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-white">
                    <FileQuestion className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <p className="font-medium text-slate-500">No assessments found. Create your first one!</p>
                  </div>
                ) : (
                  assessments.map(assessment => (
                    <div key={assessment._id} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 relative overflow-hidden">
                      <div className="flex justify-between items-start mb-4">
                        <div className="bg-emerald-50 p-3 rounded-xl group-hover:bg-emerald-100 transition-colors">
                          <Zap className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => startEdit(assessment)}
                            className="p-2 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all"
                            title="Edit Assessment"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => handleDeleteAssessment(assessment._id, e)}
                            className="p-2 rounded-xl text-red-500 bg-red-50 hover:bg-red-100 hover:text-red-600 transition-all shadow-sm"
                            title="Delete Assessment"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>

                      <h3 className="text-xl font-bold mb-2 group-hover:text-emerald-700 transition-colors line-clamp-1 text-slate-900">{assessment.title}</h3>
                      <p className="text-sm text-slate-500 mb-6">{assessment.questions.length} Questions • {assessment.duration} Mins</p>

                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex -space-x-2">
                          {[1, 2, 3].map(i => (
                            <div key={i} className="w-8 h-8 rounded-full bg-slate-200 border-2 border-white flex items-center justify-center text-xs font-bold text-slate-500">
                              <User className="w-4 h-4" />
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={() => openAssignModal(assessment._id)}
                          className="bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-black transition-all shadow-md"
                        >
                          Assign
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* === RESULTS VIEW === */}
        {view === 'RESULTS' && (
          <div className="max-w-7xl mx-auto p-8 space-y-8">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => setView('DASHBOARD')} className="p-2 hover:bg-slate-100 rounded-xl transition-colors">
                <ArrowLeft className="w-6 h-6 text-slate-500" />
              </button>
              <h1 className="text-3xl font-serif font-bold text-slate-900">Performance Analytics</h1>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-slate-500">Candidate</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-slate-500">Test</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-slate-500">Score</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-slate-500">Status</th>
                    <th className="px-6 py-4 font-bold text-xs uppercase text-slate-500">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.map(r => (
                    <tr key={r._id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center font-bold text-slate-600">
                            {r.candidateId?.name?.[0] || 'U'}
                          </div>
                          <div>
                            <div className="font-bold text-slate-900">{r.candidateId?.name || 'Unknown'}</div>
                            <div className="text-xs text-slate-500">{r.candidateId?.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-700">{r.assessmentId?.title}</td>
                      <td className="px-6 py-4">
                        {r.status === 'Completed' ? (
                          <div className="flex items-center gap-3">
                            <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full ${r.score > 3 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                style={{ width: `${(r.score / r.totalQuestions) * 100}%` }}
                              />
                            </div>
                            <span className="font-bold text-sm text-slate-700">{(r.score / r.totalQuestions * 100).toFixed(0)}%</span>
                          </div>
                        ) : <span className="text-slate-400">—</span>}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${r.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' :
                          r.status === 'In Progress' ? 'bg-blue-50 text-blue-700 border border-blue-100' :
                            'bg-orange-50 text-orange-700 border border-orange-100'
                          }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${r.status === 'Completed' ? 'bg-emerald-500' :
                            r.status === 'In Progress' ? 'bg-blue-500' : 'bg-orange-500'
                            }`} />
                          {r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">{new Date(r.updatedAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* === EDITOR VIEW (FOCUS MODE) === */}
        {view === 'EDITOR' && (
          <div className="fixed inset-0 z-50 bg-[#FAFAFA] overflow-y-auto">
            {/* Editor Header */}
            <div className="fixed top-0 left-0 right-0 h-16 bg-white border-b border-slate-200 px-8 flex justify-between items-center z-20">
              <div className="flex items-center gap-4">
                <button onClick={() => setView('DASHBOARD')} className="p-2 hover:bg-slate-100 rounded-lg">
                  <ArrowLeft className="w-5 h-5 text-slate-500" />
                </button>
                <div className="h-6 w-px bg-slate-200" />
                <span className="font-bold text-sm text-slate-400 uppercase tracking-widest">{editorMode === 'CREATE' ? 'New Draft' : 'Editing'}</span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setShowAiModal(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-600 text-white rounded-xl font-bold text-sm hover:opacity-90 transition-all shadow-md shadow-emerald-200"
                >
                  <Sparkles className="w-4 h-4" />
                  AI Assistant
                </button>
                <button
                  onClick={handleEditorSubmit}
                  className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-black transition-all shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  Save & Publish
                </button>
              </div>
            </div>

            {/* Editor Canvas */}
            <div className="pt-24 pb-20 max-w-3xl mx-auto px-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

              {/* Meta Card */}
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Assessment Title</label>
                  <input
                    value={formData.title}
                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g. Senior Frontend Assessment"
                    className="w-full text-3xl font-bold placeholder-slate-300 border-none focus:ring-0 p-0 text-slate-900"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</label>
                    <input
                      value={formData.description}
                      onChange={e => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Brief description..."
                      className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-sm text-slate-700"
                    />
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Duration (Min)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={e => setFormData({ ...formData, duration: Number(e.target.value) })}
                      className="w-full bg-slate-50 border-none rounded-lg px-4 py-3 text-sm font-bold text-slate-900"
                    />
                  </div>
                </div>
              </div>

              {/* Questions Stream */}
              <div className="space-y-6">
                {formData.questions.map((q, idx) => (
                  <div key={q.id} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm group hover:border-slate-300 transition-colors relative">
                    <span className="absolute top-8 left-0 -translate-x-full pr-4 pt-1 font-bold text-slate-300 text-xl">
                      {String(idx + 1).padStart(2, '0')}
                    </span>

                    <div className="mb-6">
                      <input
                        value={q.question}
                        onChange={e => updateQuestion(idx, 'question', e.target.value)}
                        placeholder="Type your question here..."
                        className="w-full text-lg font-medium border-none focus:ring-0 p-0 placeholder-slate-300 text-slate-800"
                      />
                    </div>

                    <div className="space-y-3 pl-4 border-l-2 border-slate-100">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuestion(idx, 'correctAnswer', oIdx)}
                            className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${q.correctAnswer === oIdx ? 'border-emerald-500 bg-emerald-500 text-white' : 'border-slate-200 text-transparent hover:border-slate-300'
                              }`}
                          >
                            <Check className="w-3 h-3" />
                          </button>
                          <input
                            value={opt}
                            onChange={e => updateOption(idx, oIdx, e.target.value)}
                            placeholder={`Option ${oIdx + 1}`}
                            className={`flex-1 bg-transparent border-none text-sm focus:ring-0 p-0 ${q.correctAnswer === oIdx ? 'font-bold text-emerald-700' : 'text-slate-600'}`}
                          />
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button onClick={() => {
                        const n = formData.questions.filter((_, i) => i !== idx);
                        setFormData({ ...formData, questions: n });
                      }} className="p-2 hover:bg-red-50 hover:text-red-500 rounded-lg text-slate-400">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}

                <button
                  onClick={addQuestion}
                  className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-slate-400 hover:text-slate-600 transition-all flex items-center justify-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Add New Question
                </button>
              </div>
            </div>
          </div>
        )}

        {/* === MODALS (Global Overlays) === */}
        {/* AI Modal */}
        {showAiModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-slate-900">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  AI Generation
                </h2>
                <button onClick={() => setShowAiModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>

              <div className="space-y-4">
                {/* Candidate Selector */}
                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Auto-fill from Candidate (Optional)</label>
                  <select
                    onChange={(e) => {
                      const r = availableResumes.find(res => res._id === e.target.value);
                      if (r) {
                        setAiContext(JSON.stringify(r, null, 2));
                        setAiTopic(`Assessment for ${r.userId?.name || 'Candidate'}`);
                      }
                    }}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none bg-white text-slate-700"
                  >
                    <option value="">Select a candidate to auto-fill...</option>
                    {availableResumes.map(r => (
                      <option key={r._id} value={r._id}>
                        {r.userId?.name || r.resumeName} - {r.experience?.[0]?.title || 'Candidate'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Topic</label>
                  <input
                    value={aiTopic}
                    onChange={e => setAiTopic(e.target.value)}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none text-slate-700"
                    placeholder="e.g. React Hooks"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-slate-500">Resume / Context (Optional)</label>
                  <textarea
                    value={aiContext}
                    onChange={e => setAiContext(e.target.value)}
                    className="w-full mt-1 border border-slate-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-emerald-500 outline-none min-h-[100px] text-sm text-slate-700"
                    placeholder="Paste candidate resume or job description here to tailor questions..."
                  />
                </div>

                <button
                  onClick={handleAiGenerate}
                  disabled={aiLoading}
                  className="w-full py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all flex justify-center items-center gap-2 shadow-lg shadow-emerald-200"
                >
                  {aiLoading ? <Loader2 className="animate-spin w-5 h-5" /> : 'Generate Questions'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Assign Modal */}
        {showAssignModal && (
          <div className="fixed inset-0 z-[100] bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl p-6 animate-in zoom-in-95 border border-slate-200">
              <h2 className="text-xl font-bold mb-4 text-slate-900">Assign Candidate</h2>
              <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                {upcomingCandidates.map(c => (
                  <button
                    key={c._id}
                    onClick={() => handleAssign(c._id)}
                    className="w-full p-3 text-left hover:bg-emerald-50 rounded-xl border border-transparent hover:border-emerald-200 flex items-center gap-3 transition-all group"
                  >
                    <div className="w-8 h-8 bg-slate-800 text-white rounded-full flex items-center justify-center font-bold text-xs group-hover:bg-emerald-600 transition-colors">
                      {c.name[0]}
                    </div>
                    <div>
                      <div className="font-bold text-sm text-slate-800">{c.name}</div>
                      <div className="text-xs text-slate-500">{c.email}</div>
                    </div>
                  </button>
                ))}
                {upcomingCandidates.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-slate-400 text-sm">No eligible candidates found.</p>
                    <p className="text-xs text-slate-300 mt-1">They may already be assigned or no upcoming interviews.</p>
                  </div>
                )}
              </div>
              <button onClick={() => setShowAssignModal(false)} className="w-full mt-4 py-2 text-slate-500 font-bold hover:bg-slate-100 rounded-lg transition-colors">Cancel</button>
            </div>
          </div>
        )}

      </div>
    </Layout>
  );
};

export default HRMCQ;

