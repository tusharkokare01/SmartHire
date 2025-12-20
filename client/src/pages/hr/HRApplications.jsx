import { useEffect, useState, useMemo } from 'react';
import {
  Users, Search, FileText, MapPin, Briefcase, ExternalLink, X, Loader2, Clock, Building2,
  CheckCircle, XCircle, Star, Mail, Calendar, Download, MessageSquare, Filter, ChevronDown, ChevronRight,
  Sparkles, Phone, TrendingUp, Eye, Send, Plus, Award, AlertCircle
} from 'lucide-react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { Template1, Template2, Template3 } from '../../components/resume/ResumeTemplates';
import { Template4, Template5, Template6, Template7, Template8, Template9, Template10, Template11, Template12, Template13 } from '../../components/resume/NewResumeTemplates';
import { useAuth } from '../../contexts/AuthContext';

const templates = {
  1: Template1, 2: Template2, 3: Template3,
  4: Template4, 5: Template5, 6: Template6,
  7: Template7, 8: Template8, 9: Template9,
  10: Template10, 11: Template11, 12: Template12,
  13: Template13
};

const STATUSES = ['All', 'Applied', 'In Review', 'Shortlisted', 'Interview Scheduled', 'Offer Extended', 'Hired', 'Rejected'];

const HRCandidates = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedCandidates, setSelectedCandidates] = useState([]);
  const [expandedCandidate, setExpandedCandidate] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showResumeModal, setShowResumeModal] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [showInterviewModal, setShowInterviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [scheduledInterview, setScheduledInterview] = useState(null);
  const [currentApplication, setCurrentApplication] = useState(null);
  const [candidateNotes, setCandidateNotes] = useState({});
  const [filterSkills, setFilterSkills] = useState('');
  const [isScheduling, setIsScheduling] = useState(false);
  const [emailData, setEmailData] = useState({ subject: '', body: '' });
  const [noteText, setNoteText] = useState('');
  const [interviewData, setInterviewData] = useState({ date: '', time: '', location: '', platform: 'Zoom' });

  // Confirmation Modal State
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'warning', // warning, danger
    confirmText: 'Proceed',
    onConfirm: null
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.get('/applications');
      console.log('Fetched applications:', response.data);
      setApplications(response.data || []);
    } catch (err) {
      console.error('Error fetching applications:', err);
      setError('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (appId, newStatus) => {
    const app = applications.find(a => a._id === appId);

    // Check if candidate has a scheduled interview
    if (app && app.status === 'Interview Scheduled') {
      if (newStatus === 'Shortlisted') {
        setConfirmModal({
          isOpen: true,
          title: 'Active Interview Exists',
          message: 'This candidate has a scheduled interview. Changing status to "Shortlisted" will NOT automatically cancel the interview. Are you sure you want to proceed?',
          type: 'warning',
          confirmText: 'Proceed Anyway',
          onConfirm: () => executeStatusUpdate(appId, newStatus)
        });
        return;
      } else if (newStatus === 'Rejected') {
        setConfirmModal({
          isOpen: true,
          title: 'Confirm Rejection',
          message: 'This candidate has a scheduled interview. Rejecting them will AUTOMATICALLY CANCEL the interview. Are you sure you want to proceed?',
          type: 'danger',
          confirmText: 'Reject & Cancel Interview',
          onConfirm: () => executeStatusUpdate(appId, newStatus)
        });
        return;
      }
    }

    // No confirmation needed for other cases
    executeStatusUpdate(appId, newStatus);
  };

  const executeStatusUpdate = async (appId, newStatus) => {
    try {
      await api.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplications(apps => apps.map(app =>
        app._id === appId ? { ...app, status: newStatus } : app
      ));
      setConfirmModal(prev => ({ ...prev, isOpen: false }));

      // Automated Message Logic
      const app = applications.find(a => a._id === appId);
      if (app && ['Shortlisted', 'Hired', 'Rejected'].includes(newStatus)) {
        let subject = '';
        let content = '';

     if (newStatus === 'Shortlisted') {
    // Subject is now action-oriented
    subject = `Next Steps: You are Shortlisted for ${app.jobTitle}`;
    content = `Dear ${app.candidateId.name},\n\nWe are happy to tell you that you have been shortlisted for the ${app.jobTitle} position.\n\nYour skills match our requirements well. We will contact you soon to explain the next steps in the interview process.\n\nBest regards,\nThe Recruitment Team`;

} else if (newStatus === 'Hired') {
    // Subject clearly states "Job Offer"
    subject = `Congratulations! Job Offer for ${app.jobTitle}`;
    content = `Dear ${app.candidateId.name},\n\nWe are delighted to offer you the position of ${app.jobTitle} at ${app.company}!\n\nWe were very impressed by your interview. You will receive the official offer letter with all the details in your email shortly.\n\nWelcome to the team!\nThe Recruitment Team`;

} else if (newStatus === 'Rejected') {
    // Subject indicates a decision has been made
    subject = `Application Status Update: ${app.jobTitle}`;
    content = `Dear ${app.candidateId.name},\n\nThank you for applying for the ${app.jobTitle} position.\n\nWe have reviewed your application carefully. Unfortunately, we have decided to move forward with other candidates who match our current needs more closely.\n\nWe wish you the best in your job search.\n\nSincerely,\nThe Recruitment Team`;
}

        if (subject && content) {
          await api.post('/messages', {
            senderId: user._id || user.id,
            receiverId: app.candidateId._id,
            subject,
            content
          });
          // alert(`Automated '${newStatus}' message sent to candidate.`); // Optional: distinct notification
        }
      }

    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const toggleSelectCandidate = (appId, e) => {
    e.stopPropagation();
    setSelectedCandidates(prev =>
      prev.includes(appId) ? prev.filter(id => id !== appId) : [...prev, appId]
    );
  };

  const toggleExpand = (app) => {
    setExpandedCandidate(expandedCandidate === app._id ? null : app._id);
  };

  const bulkUpdateStatus = async (status) => {
    try {
      await Promise.all(selectedCandidates.map(id => updateStatus(id, status)));
      setSelectedCandidates([]);
    } catch (error) {
      console.error('Bulk update failed:', error);
    }
  };

  const addNote = (appId) => {
    if (!noteText.trim()) return;
    const note = {
      text: noteText,
      date: new Date().toISOString(),
      author: 'HR Manager'
    };
    setCandidateNotes(prev => ({
      ...prev,
      [appId]: [...(prev[appId] || []), note]
    }));
    setNoteText('');
    setShowNotesModal(false);
  };

  const openResumeModal = (app, e) => {
    e.stopPropagation();
    setCurrentApplication(app);
    setShowResumeModal(true);
  };

  const openScheduleModal = (app, e) => {
    e.stopPropagation();
    setCurrentApplication(app);

    // Set default date to 1 week from now
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    const dateString = nextWeek.toISOString().split('T')[0];

    setInterviewData({
      date: dateString,
      time: '10:00',
      location: '',
      platform: 'Zoom'
    });

    setShowInterviewModal(true);
  };

  const filteredApplications = useMemo(() => {
    return applications.filter(app => {
      const candidateName = app.candidateId?.name || '';
      const jobTitle = app.jobTitle || '';
      const company = app.company || '';

      const matchesSearch = (
        candidateName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesStatus = selectedStatus === 'All' || app.status === selectedStatus;

      const matchesSkills = !filterSkills ||
        app.resumeId?.skills?.some(skill =>
          skill.toLowerCase().includes(filterSkills.toLowerCase())
        );

      return matchesSearch && matchesStatus && matchesSkills;
    });
  }, [applications, searchTerm, selectedStatus, filterSkills]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Shortlisted': return 'bg-emerald-100 text-emerald-800 border-transparent';
      case 'Rejected': return 'bg-red-100 text-red-800 border-transparent';
      case 'Interview Scheduled': return 'bg-blue-100 text-blue-800 border-transparent';
      case 'Hired': return 'bg-purple-100 text-purple-800 border-transparent';
      case 'In Review': return 'bg-orange-100 text-orange-800 border-transparent';
      default: return 'bg-slate-100 text-slate-800 border-transparent';
    }
  };

  const renderResumeTemplate = (resume) => {
    if (!resume) return null;
    const TemplateComponent = templates[resume.templateId] || Template1;
    return <TemplateComponent formData={resume} />;
  };

  return (
    <Layout role="hr" fullWidth={true}>
      <div className="min-h-screen bg-slate-50/50 p-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[var(--primary)] tracking-tight">
                Applications
              </h1>
              <p className="text-[var(--text-secondary)] mt-1">Manage and track your recruitment pipeline.</p>
            </div>
            <div className="flex gap-4">
              <div className="px-4 py-2 bg-white border border-[var(--border)] rounded-xl shadow-sm flex items-center gap-3">
                <div className="p-2 bg-[var(--bg-primary)] rounded-lg text-[var(--primary)]">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xl font-bold text-[var(--primary)] leading-none">{filteredApplications.length}</div>
                  <div className="text-xs font-medium text-[var(--text-secondary)]">Total Applications</div>
                </div>
              </div>
              {selectedCandidates.length > 0 && (
                <div className="px-4 py-2 bg-[var(--primary)] text-white rounded-xl shadow-sm flex items-center gap-3">
                  <div className="p-2 bg-white/10 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xl font-bold leading-none">{selectedCandidates.length}</div>
                    <div className="text-xs font-medium opacity-80">Selected</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Search & Filters */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--text-light)]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search applications..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all text-sm shadow-sm placeholder-slate-400 font-medium"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 transition-all shadow-sm border ${showFilters
                ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
                : 'bg-white text-[var(--text-secondary)] border-[var(--border)] hover:border-[var(--primary)] hover:text-[var(--primary)]'
                }`}
            >
              <Filter className="w-4 h-4" />
              Filters
              <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showFilters ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Filter Panel */}
          {showFilters && (
            <div className="mb-6 p-6 bg-white border border-[var(--border)] rounded-xl shadow-sm grid grid-cols-3 gap-6 animate-in slide-in-from-top-2">
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full p-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] bg-[var(--bg-primary)]"
                >
                  {STATUSES.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Skills</label>
                <input
                  type="text"
                  value={filterSkills}
                  onChange={(e) => setFilterSkills(e.target.value)}
                  placeholder="e.g., React, Python"
                  className="w-full p-2.5 border border-[var(--border)] rounded-lg text-sm focus:outline-none focus:border-[var(--primary)] bg-[var(--bg-primary)]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[var(--text-secondary)] mb-2 uppercase tracking-wider">Actions</label>
                <button
                  onClick={() => {
                    setSelectedStatus('All');
                    setFilterSkills('');
                  }}
                  className="w-full p-2.5 bg-[var(--bg-primary)] hover:bg-gray-200 text-[var(--text-secondary)] rounded-lg text-sm font-medium transition-all"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          )}

          {/* Bulk Actions Bar */}
          {selectedCandidates.length > 0 && (
            <div className="mb-6 p-4 bg-[var(--primary)] text-white rounded-xl flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-[var(--accent)]" />
                <span className="font-bold">
                  {selectedCandidates.length} selected
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => bulkUpdateStatus('Shortlisted')}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
                >
                  Shortlist
                </button>
                <button
                  onClick={() => bulkUpdateStatus('Rejected')}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-100 rounded-lg text-sm font-medium transition-all"
                >
                  Reject
                </button>
                <button
                  onClick={() => setSelectedCandidates([])}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-all"
                >
                  Clear
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Candidates List */}
        {error && (
          <div className="p-4 mb-6 bg-red-50 text-red-600 rounded-xl border border-red-200">
            Error: {error}
            <button onClick={fetchApplications} className="ml-4 underline font-bold">Retry</button>
          </div>
        )}

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-16 h-16 animate-spin text-violet-600 mb-6" />
            <p className="text-slate-600 font-bold text-xl">Loading applications...</p>
          </div>
        ) : filteredApplications.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-slate-200 shadow-lg">
            <div className="w-24 h-24 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">No applications found</h3>
            <p className="text-slate-600 text-lg">Try adjusting your filters or search terms</p>
            <div className="mt-4 text-xs text-slate-400">
              Debug: Total Apps: {applications.length} | Search: "{searchTerm}" | Status: "{selectedStatus}"
            </div>
            <div className="flex gap-3 justify-center mt-4">
              <button onClick={fetchApplications} className="px-4 py-2 bg-slate-100 rounded-lg text-sm font-medium hover:bg-slate-200 transition-all">
                Refresh Data
              </button>
              <button
                onClick={() => {
                  setApplications([
                    {
                      _id: 'demo1',
                      candidateId: { name: 'Demo Candidate', email: 'demo@example.com' },
                      jobTitle: 'Senior React Developer',
                      company: 'Tech Corp',
                      status: 'Applied',
                      createdAt: new Date().toISOString(),
                      resumeId: { skills: ['React', 'Node.js', 'TypeScript'] }
                    },
                    {
                      _id: 'demo2',
                      candidateId: { name: 'John Doe', email: 'john@example.com' },
                      jobTitle: 'Product Manager',
                      company: 'Innovation Inc',
                      status: 'Interview Scheduled',
                      createdAt: new Date().toISOString(),
                      resumeId: { skills: ['Product Management', 'Agile', 'JIRA'] }
                    }
                  ]);
                }}
                className="px-4 py-2 bg-[var(--primary)] text-white rounded-lg text-sm font-medium hover:bg-[var(--primary-light)] transition-all"
              >
                Load Demo Data
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredApplications.map((app) => (
              <div
                key={app._id}
                className={`bg-white rounded-2xl border transition-all duration-300 ${expandedCandidate === app._id
                  ? 'border-emerald-500 ring-4 ring-emerald-500/5 shadow-xl scale-[1.01]'
                  : 'border-slate-200 hover:border-emerald-200 hover:shadow-lg'
                  }`}
              >
                {/* Compact Row */}
                <div
                  onClick={() => toggleExpand(app)}
                  className="p-5 cursor-pointer flex items-center gap-5 hover:bg-slate-50/50 transition-all rounded-2xl"
                >
                  {/* Checkbox */}
                  <input
                    type="checkbox"
                    checked={selectedCandidates.includes(app._id)}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => toggleSelectCandidate(app._id, e)}
                    className="w-5 h-5 rounded-md border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />

                  {/* Expand Icon */}
                  <div className={`transition-transform duration-200 text-[var(--text-light)] ${expandedCandidate === app._id ? 'rotate-90' : ''}`}>
                    <ChevronRight className="w-5 h-5" />
                  </div>

                  {/* Avatar */}
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border border-slate-200 flex items-center justify-center text-slate-700 font-bold text-lg shadow-inner">
                    {app.candidateId?.name?.charAt(0) || 'C'}
                  </div>

                  {/* Candidate Info */}
                  <div className="flex-1 min-w-0 grid grid-cols-12 gap-4 items-center">
                    <div className="col-span-4">
                      <h3 className="text-sm font-bold text-[var(--primary)] truncate">
                        {app.candidateId?.name || 'Unknown Candidate'}
                      </h3>
                      <p className="text-xs text-slate-500 truncate font-medium mt-0.5">{app.jobTitle}</p>
                    </div>

                    <div className="col-span-3">
                      <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                        <Building2 className="w-3 h-3" />
                        <span className="truncate">{app.company}</span>
                      </div>
                    </div>

                    <div className="col-span-3">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                        {app.status || 'Applied'}
                      </span>
                    </div>

                    <div className="col-span-2 text-right text-xs text-[var(--text-light)]">
                      {new Date(app.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {/* Quick View Button */}
                  <button
                    onClick={(e) => openResumeModal(app, e)}
                    className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] hover:bg-[var(--bg-primary)] rounded-lg transition-all"
                    title="View Resume"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Expanded Content */}
                {expandedCandidate === app._id && (
                  <div className="px-6 pb-6 pt-6 bg-white border-t border-slate-100 animate-in slide-in-from-top-2 rounded-b-2xl">
                    <div className="flex items-start justify-between mb-6">
                      {/* Skills */}
                      {app.resumeId?.skills?.length > 0 ? (
                        <div className="flex-1 mr-4">
                          <h4 className="text-xs font-bold text-[var(--text-secondary)] mb-3 uppercase tracking-wider flex items-center gap-2">
                            <Award className="w-3 h-3" />
                            Skills & Expertise
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {app.resumeId.skills.map((skill, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-white text-[var(--primary)] border border-[var(--border)] rounded-lg text-xs font-medium shadow-sm"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : <div></div>}

                      {/* Primary View Resume Button */}
                      <button
                        onClick={(e) => openResumeModal(app, e)}
                        className="px-5 py-2.5 bg-[var(--primary)] text-white rounded-xl hover:bg-[var(--primary-light)] font-bold text-sm flex items-center gap-2 shadow-sm hover:shadow-md transition-all whitespace-nowrap"
                      >
                        <Eye className="w-4 h-4" />
                        View Resume
                      </button>
                    </div>

                    {/* Action Buttons Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(app._id, 'Shortlisted');
                        }}
                        className="p-4 bg-white border border-emerald-200 rounded-xl hover:bg-emerald-50 transition-all group flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-emerald-300"
                      >
                        <div className="p-3 bg-emerald-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <CheckCircle className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="text-sm font-bold text-emerald-800">Shortlist</div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(app._id, 'Rejected');
                        }}
                        className="p-4 bg-white border border-red-200 rounded-xl hover:bg-red-50 transition-all group flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-red-300"
                      >
                        <div className="p-3 bg-red-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <XCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="text-sm font-bold text-red-800">Reject</div>
                      </button>
                      <button
                        onClick={(e) => openScheduleModal(app, e)}
                        className="p-4 bg-white border border-blue-200 rounded-xl hover:bg-blue-50 transition-all group flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-blue-300"
                      >
                        <div className="p-3 bg-blue-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <Calendar className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-sm font-bold text-blue-800">Schedule</div>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentApplication(app);
                          setShowEmailModal(true);
                        }}
                        className="p-4 bg-white border border-purple-200 rounded-xl hover:bg-purple-50 transition-all group flex flex-col items-center justify-center gap-2 shadow-sm hover:shadow-md hover:border-purple-300"
                      >
                        <div className="p-3 bg-purple-50 rounded-xl group-hover:scale-110 transition-transform duration-300">
                          <Mail className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-sm font-bold text-purple-800">Email</div>
                      </button>
                    </div>

                    {/* More Actions */}
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setCurrentApplication(app);
                          setShowNotesModal(true);
                        }}
                        className="px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm group"
                      >
                        <MessageSquare className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                        Add Note
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          // Open modal to print
                          openResumeModal(app, e);
                          // Small timeout to allow modal to open then print
                          setTimeout(() => window.print(), 500);
                        }}
                        className="px-4 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 hover:text-slate-900 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-sm group"
                      >
                        <Download className="w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
                        Download PDF
                      </button>
                    </div>

                    {/* Notes Display */}
                    {candidateNotes[app._id]?.length > 0 && (
                      <div className="mt-6 p-4 bg-white border border-[var(--border)] rounded-xl shadow-sm">
                        <h4 className="font-bold text-[var(--primary)] mb-3 flex items-center gap-2 text-sm">
                          <MessageSquare className="w-4 h-4" />
                          Notes ({candidateNotes[app._id].length})
                        </h4>
                        <div className="space-y-2">
                          {candidateNotes[app._id].map((note, idx) => (
                            <div key={idx} className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border)]">
                              <p className="text-sm text-[var(--text-secondary)] mb-1">{note.text}</p>
                              <p className="text-xs text-[var(--text-light)] font-medium">
                                {note.author} • {new Date(note.date).toLocaleDateString()}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Full Screen Resume Modal */}
        {showResumeModal && currentApplication && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl w-full max-w-6xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200">
              <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50 no-print">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">
                    {currentApplication.candidateId?.name}'s Resume
                  </h2>
                  <p className="text-slate-500 text-sm">
                    Applied for {currentApplication.jobTitle} at {currentApplication.company}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => window.print()}
                    className="px-4 py-2 bg-slate-900 text-white rounded-xl hover:bg-black font-medium transition-all flex items-center gap-2 text-sm shadow-sm"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                  <button
                    onClick={() => setShowResumeModal(false)}
                    className="p-2 hover:bg-slate-200 rounded-full transition-all text-slate-500"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-8 bg-slate-100/50 print-content">
                {currentApplication.resumeId ? (
                  <div className="bg-white shadow-lg rounded-xl mx-auto max-w-4xl border border-slate-200">
                    {renderResumeTemplate(currentApplication.resumeId)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-slate-400">
                    <div className="w-20 h-20 rounded-full bg-white border border-slate-200 flex items-center justify-center mb-4">
                      <FileText className="w-10 h-10 text-slate-300" />
                    </div>
                    <p className="text-xl font-bold">Resume not available</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Email Modal */}
        {showEmailModal && currentApplication && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Send Email</h2>
                <button onClick={() => setShowEmailModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">To</label>
                  <input
                    type="email"
                    value={currentApplication.candidateId?.email || ''}
                    disabled
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium text-slate-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Subject</label>
                  <input
                    type="text"
                    value={emailData.subject}
                    onChange={(e) => setEmailData({ ...emailData, subject: e.target.value })}
                    placeholder="Email subject"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Message</label>
                  <textarea
                    value={emailData.body}
                    onChange={(e) => setEmailData({ ...emailData, body: e.target.value })}
                    rows="6"
                    placeholder="Email message"
                    className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={async () => {
                      if (!emailData.subject || !emailData.body) {
                        alert('Please fill in both subject and message.');
                        return;
                      }

                      try {
                        await api.post('/messages', {
                          senderId: user._id || user.id,
                          receiverId: currentApplication.candidateId._id,
                          subject: emailData.subject,
                          content: emailData.body
                        });
                        alert(`Message sent to ${currentApplication.candidateId?.name}`);
                        setShowEmailModal(false);
                        setEmailData({ subject: '', body: '' });
                      } catch (err) {
                        console.error("Failed to send message", err);
                        alert("Failed to send message.");
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-purple-200"
                  >
                    <Send className="w-4 h-4" />
                    Send Email
                  </button>
                  <button
                    onClick={() => setShowEmailModal(false)}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-bold text-sm transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Modal */}
        {showNotesModal && currentApplication && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Add Note</h2>
                <button onClick={() => setShowNotesModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add your notes about this candidate..."
                rows="5"
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm mb-6"
              />
              <div className="flex gap-3">
                <button
                  onClick={() => addNote(currentApplication._id)}
                  className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-200"
                >
                  <Plus className="w-4 h-4" />
                  Add Note
                </button>
                <button
                  onClick={() => setShowNotesModal(false)}
                  className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-bold text-sm transition-all"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Interview Modal */}
        {showInterviewModal && currentApplication && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-slate-900">Schedule Interview</h2>
                <button onClick={() => setShowInterviewModal(false)} className="p-2 hover:bg-slate-100 rounded-full transition-all text-slate-500">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Candidate</label>
                  <input
                    type="text"
                    value={currentApplication.candidateId?.name || ''}
                    disabled
                    className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium text-slate-600"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Date</label>
                    <input
                      type="date"
                      value={interviewData.date}
                      onChange={(e) => setInterviewData({ ...interviewData, date: e.target.value })}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Time</label>
                    <input
                      type="time"
                      value={interviewData.time}
                      onChange={(e) => setInterviewData({ ...interviewData, time: e.target.value })}
                      className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Platform</label>
                  <div className="w-full p-3 border border-slate-200 rounded-xl bg-slate-50 text-sm font-medium text-slate-600 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Zoom Meeting
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">
                    {interviewData.platform === 'In-Person' ? 'Location' : 'Meeting Link (Optional)'}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={interviewData.location}
                      onChange={(e) => setInterviewData({ ...interviewData, location: e.target.value })}
                      placeholder={interviewData.platform === 'In-Person' ? "Office address" : "Leave empty to auto-generate link"}
                      disabled={isScheduling}
                      className="flex-1 p-3 border border-slate-200 rounded-xl focus:outline-none focus:border-emerald-500 text-sm disabled:bg-slate-50"
                    />
                    {['Google Meet', 'Zoom'].includes(interviewData.platform) && (
                      <button
                        type="button"
                        disabled={isScheduling}
                        onClick={async () => {
                          try {
                            setIsScheduling(true);
                            const response = await api.post('/hr/generate-link', {
                              platform: interviewData.platform,
                              topic: `Interview with ${currentApplication.candidateId?.name}`,
                              startTime: interviewData.date ? new Date(`${interviewData.date}T${interviewData.time || '10:00'}`) : new Date()
                            });
                            setInterviewData(prev => ({
                              ...prev,
                              location: response.data.link,
                              password: response.data.password
                            }));
                          } catch (error) {
                            console.error('Failed to generate link:', error);
                            alert('Failed to generate link. Please try again.');
                          } finally {
                            setIsScheduling(false);
                          }
                        }}
                        className="px-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold hover:bg-slate-200 transition-all disabled:opacity-70 flex items-center gap-2 text-slate-700"
                        title="Generate Link Now"
                      >
                        {isScheduling ? <Loader2 className="w-3 h-3 animate-spin" /> : <ExternalLink className="w-3 h-3" />}
                        Generate
                      </button>
                    )}
                  </div>
                  {interviewData.password && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-100 rounded-lg flex items-center gap-2 text-xs text-yellow-800">
                      <span className="font-bold">Passcode:</span>
                      <code className="bg-white px-1 py-0.5 rounded border border-yellow-200">{interviewData.password}</code>
                    </div>
                  )}
                  {['Google Meet', 'Zoom'].includes(interviewData.platform) && !interviewData.location && (
                    <p className="text-xs text-slate-400 mt-1">
                      * Link will be auto-generated via {interviewData.platform} API
                    </p>
                  )}
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    disabled={isScheduling}
                    onClick={async () => {
                      try {
                        // Validate inputs
                        if (!interviewData.date || !interviewData.time) {
                          alert('Please select both date and time.');
                          return;
                        }

                        setIsScheduling(true);
                        // 1. Create Interview Record
                        const response = await api.post('/hr/interviews', {
                          candidateId: currentApplication.candidateId._id,
                          jobRole: currentApplication.jobTitle,
                          scheduledAt: new Date(`${interviewData.date}T${interviewData.time}`),
                          platform: interviewData.platform,
                          meetingLink: interviewData.location,
                          meetingPassword: interviewData.password
                        });

                        // 2. Update Application Status
                        await updateStatus(currentApplication._id, 'Interview Scheduled');

                        // 3. Send Automated Message
                        await api.post('/messages', {
                          senderId: user._id || user.id,
                          receiverId: currentApplication.candidateId._id,
                          subject: `Interview Invitation: ${currentApplication.jobTitle}`,
                          content: `Dear ${currentApplication.candidateId.name},\n\nWe would like to invite you for an interview for the ${currentApplication.jobTitle} position.\n\nDetails:\nDate: ${interviewData.date}\nTime: ${interviewData.time}\nPlatform: ${interviewData.platform}\nLink: ${interviewData.location || 'See dashboard'}\n${interviewData.password ? `Passcode: ${interviewData.password}\n` : ''}\nPlease be available 5 minutes before the scheduled time.\n\nBest regards,\nRecruitment Team`
                        });

                        // Show success modal with link
                        setScheduledInterview({
                          platform: interviewData.platform,
                          link: response.data.meetingLink,
                          password: response.data.meetingPassword,
                          date: interviewData.date,
                          time: interviewData.time
                        });
                        setShowInterviewModal(false);
                        setShowSuccessModal(true);
                        setInterviewData({ date: '', time: '', location: '', platform: 'Google Meet' });
                      } catch (error) {
                        console.error('Failed to schedule interview:', error);
                        alert('Failed to schedule interview. Please try again.');
                      } finally {
                        setIsScheduling(false);
                      }
                    }}
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-emerald-200"
                  >
                    {isScheduling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating Link...
                      </>
                    ) : (
                      <>
                        <Calendar className="w-4 h-4" />
                        Schedule
                      </>
                    )}
                  </button>
                  <button
                    disabled={isScheduling}
                    onClick={() => setShowInterviewModal(false)}
                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 font-bold text-sm transition-all disabled:opacity-70"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success Modal */}
        {showSuccessModal && scheduledInterview && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl border border-slate-200 text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Interview Scheduled!</h2>
              <p className="text-slate-500 mb-6">
                The interview has been successfully scheduled via <span className="font-bold">{scheduledInterview.platform}</span>.
              </p>

              {scheduledInterview.link && (
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 mb-6 text-left">
                  <label className="block text-xs font-bold text-slate-500 mb-2 uppercase tracking-wider">Meeting Link</label>
                  <div className="flex gap-2 mb-2">
                    <input
                      readOnly
                      value={scheduledInterview.link}
                      className="flex-1 bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-600 select-all"
                    />
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(scheduledInterview.link);
                        alert('Link copied!');
                      }}
                      className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600"
                      title="Copy Link"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                  {scheduledInterview.password && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-bold">Passcode:</span>
                      <code className="bg-white px-2 py-0.5 rounded border border-gray-200">{scheduledInterview.password}</code>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={() => setShowSuccessModal(false)}
                className="w-full px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition-all"
              >
                Done
              </button>
            </div>
          </div>
        )}
        {/* Confirmation Modal */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 bg-black/50 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
              <div className="flex items-start gap-4 mb-6">
                <div className={`p-3 rounded-full flex-shrink-0 ${confirmModal.type === 'danger' ? 'bg-red-100 text-red-600' : 'bg-amber-100 text-amber-600'}`}>
                  <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">{confirmModal.title}</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {confirmModal.message}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setConfirmModal(prev => ({ ...prev, isOpen: false }))}
                  className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmModal.onConfirm}
                  className={`px-5 py-2.5 text-white font-bold rounded-xl transition-colors text-sm shadow-md ${confirmModal.type === 'danger'
                    ? 'bg-red-600 hover:bg-red-700 shadow-red-200'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                    }`}
                >
                  {confirmModal.confirmText}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HRCandidates;
