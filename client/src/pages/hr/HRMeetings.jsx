import { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Clock, User, Plus, Video, MapPin, ExternalLink, Loader2,
  CheckCircle, XCircle, AlertCircle, MoreHorizontal, Search, Filter,
  ChevronDown, MessageSquare, Briefcase, Mail
} from 'lucide-react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import ChatDialog from '../../components/common/ChatDialog';
import { useAuth } from '../../contexts/AuthContext';

const HRMeetings = () => {
  const { user: currentUser } = useAuth();
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const [activeTab, setActiveTab] = useState('Upcoming'); // Upcoming, Completed, Cancelled
  const [searchTerm, setSearchTerm] = useState('');

  // Cancellation Modal State
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [notifyCandidate, setNotifyCandidate] = useState(true);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedFeedbackMeeting, setSelectedFeedbackMeeting] = useState(null);
  const [isSavingFeedback, setIsSavingFeedback] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({
    overall: '',
    strengths: '',
    improvements: ''
  });

  // Chat State
  const [showChat, setShowChat] = useState(false);
  const [chatCandidate, setChatCandidate] = useState(null);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      setLoading(true);
      const response = await api.get('/hr/interviews');
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    } finally {
      setLoading(false);
    }
  };

  const openCancelModal = (meeting) => {
    setSelectedMeeting(meeting);
    setCancelReason('');
    setNotifyCandidate(true);
    setShowCancelModal(true);
  };

  const closeCancelModal = () => {
    setShowCancelModal(false);
    setSelectedMeeting(null);
  };

  const handleConfirmCancel = async () => {
    if (!selectedMeeting) return;

    try {
      setCancellingId(selectedMeeting._id);
      await api.patch(`/hr/interviews/${selectedMeeting._id}/cancel`, {
        reason: cancelReason,
        notify: notifyCandidate
      });

      // Update local state
      setMeetings(prev => prev.map(m =>
        m._id === selectedMeeting._id ? { ...m, status: 'Cancelled' } : m
      ));

      closeCancelModal();
    } catch (error) {
      console.error('Error cancelling interview:', error);
      alert('Failed to cancel interview');
    } finally {
      setCancellingId(null);
    }
  };

  const openChat = (meeting) => {
    setChatCandidate(meeting.candidateId);
    setShowChat(true);
  };

  const openFeedbackModal = (meeting) => {
    setSelectedFeedbackMeeting(meeting);
    setFeedbackForm({
      overall: meeting.feedbackByHR?.overall || '',
      strengths: (meeting.feedbackByHR?.strengths || []).join(', '),
      improvements: (meeting.feedbackByHR?.improvements || []).join(', '),
    });
    setShowFeedbackModal(true);
  };

  const closeFeedbackModal = () => {
    setShowFeedbackModal(false);
    setSelectedFeedbackMeeting(null);
    setFeedbackForm({ overall: '', strengths: '', improvements: '' });
  };

  const submitFeedback = async () => {
    if (!selectedFeedbackMeeting) return;

    try {
      setIsSavingFeedback(true);
      const response = await api.patch(`/hr/interviews/${selectedFeedbackMeeting._id}/feedback`, {
        overall: feedbackForm.overall,
        strengths: feedbackForm.strengths,
        improvements: feedbackForm.improvements,
      });

      setMeetings(prev => prev.map(meeting =>
        meeting._id === selectedFeedbackMeeting._id ? response.data : meeting
      ));
      closeFeedbackModal();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      alert('Failed to save feedback. Please try again.');
    } finally {
      setIsSavingFeedback(false);
    }
  };

  // Derived Stats
  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayMeetings = meetings.filter(m => {
      const d = new Date(m.scheduledAt);
      return d >= today && d < tomorrow && m.status !== 'Cancelled';
    });

    return {
      upcoming: meetings.filter(m => m.status === 'Scheduled' && new Date(m.scheduledAt) >= new Date()).length,
      today: todayMeetings.length,
      completed: meetings.filter(m => m.status === 'Completed').length,
      cancelled: meetings.filter(m => m.status === 'Cancelled').length
    };
  }, [meetings]);

  // Filtering and Grouping
  const filteredAndGroupedMeetings = useMemo(() => {
    let filtered = meetings.filter(m => {
      const matchesSearch =
        (m.candidateId?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (m.jobRole?.toLowerCase() || '').includes(searchTerm.toLowerCase());

      const isPast = new Date(m.scheduledAt) < new Date();

      let matchesTab = true;
      if (activeTab === 'Upcoming') {
        matchesTab = m.status === 'Scheduled' && !isPast;
      } else if (activeTab === 'Completed') {
        matchesTab = m.status === 'Completed' || (m.status === 'Scheduled' && isPast);
      } else if (activeTab === 'Cancelled') {
        matchesTab = m.status === 'Cancelled';
      }

      return matchesSearch && matchesTab;
    });

    // Sort by date
    filtered.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));

    // Group by Date Label
    const groups = {};
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    filtered.forEach(m => {
      const d = new Date(m.scheduledAt);
      d.setHours(0, 0, 0, 0);

      let label = d.toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });
      if (d.getTime() === today.getTime()) label = 'Today';
      else if (d.getTime() === tomorrow.getTime()) label = 'Tomorrow';

      if (!groups[label]) groups[label] = [];
      groups[label].push(m);
    });

    return groups;
  }, [meetings, activeTab, searchTerm]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled': return 'bg-blue-100 text-blue-700 border-transparent';
      case 'Completed': return 'bg-emerald-100 text-emerald-700 border-transparent';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-transparent';
      default: return 'bg-slate-100 text-slate-700 border-transparent';
    }
  };

  return (
    <Layout role="hr" fullWidth={true}>
      <div className="min-h-screen bg-slate-50/50 p-8 relative">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Interviews</h1>
            <p className="text-slate-500 mt-1">Manage your interview schedule and upcoming meetings.</p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">Today's Interviews</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.today}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-violet-50 text-violet-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">Upcoming</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.upcoming}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">Completed</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.completed}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                <XCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">Cancelled</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.cancelled}</div>
          </div>
        </div>

        {/* Filters & Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex bg-slate-100/50 p-1.5 rounded-xl">
            {['Upcoming', 'Completed', 'Cancelled'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-200/50'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-auto md:min-w-[300px] mr-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search candidate or role..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 rounded-xl text-sm transition-all outline-none"
            />
          </div>
        </div>

        {/* Meetings List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
        ) : Object.keys(filteredAndGroupedMeetings).length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No meetings found</h3>
            <p className="text-slate-500 mt-1">Adjust filters or schedule a new interview.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(filteredAndGroupedMeetings).map(([dateLabel, groupMeetings]) => (
              <div key={dateLabel}>
                <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 pl-1">
                  {dateLabel}
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {groupMeetings.map((meeting) => (
                    <div key={meeting._id} className="bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-lg hover:border-emerald-200 transition-all flex flex-col md:flex-row items-center gap-6 group">

                      {/* Left: Time & Status Strip */}
                      <div className="flex flex-col items-center justify-center min-w-[100px] border-r border-slate-100 pr-6 md:h-full">
                        <div className="text-2xl font-bold text-slate-800 tracking-tight">
                          {new Date(meeting.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1 mb-2">
                          {new Date(meeting.scheduledAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </div>
                        <div className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wide border ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </div>
                      </div>

                      {/* Middle: Info */}
                      <div className="flex-1 min-w-0 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className="w-12 h-12 shrink-0 rounded-full bg-gradient-to-br from-indigo-50 to-slate-100 border border-slate-200 flex items-center justify-center text-indigo-700 font-bold text-lg">
                            {meeting.candidateId?.name?.charAt(0) || 'C'}
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 text-lg truncate">{meeting.candidateId?.name || 'Unknown Candidate'}</h3>
                            <div className="flex items-center gap-2 text-sm text-slate-500">
                              <Briefcase className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{meeting.jobRole}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col justify-center space-y-1 min-w-0 overflow-hidden">
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            {meeting.platform === 'In-Person' ? <MapPin className="w-4 h-4 shrink-0" /> : <Video className="w-4 h-4 shrink-0" />}
                            <span className="font-medium truncate">{meeting.platform}</span>
                          </div>
                          {meeting.meetingPassword && (
                            <div className="text-xs text-slate-400 truncate">
                              Passcode: <span className="font-mono">{meeting.meetingPassword}</span>
                            </div>
                          )}
                          {meeting.feedbackByHR?.submittedAt && (
                            <div className="text-xs text-emerald-600 font-medium">
                              Feedback submitted
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t md:border-t-0 border-slate-200">
                        {meeting.meetingLink && meeting.platform !== 'In-Person' && meeting.status !== 'Cancelled' && (
                          <a
                            href={meeting.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 md:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 font-bold text-sm transition-all shadow-md shadow-emerald-200 hover:shadow-lg hover:shadow-emerald-300"
                          >
                            <ExternalLink className="w-4 h-4" />
                            Join Interview
                          </a>
                        )}
                        <button
                          onClick={() => openChat(meeting)}
                          className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                          title="Message Candidate"
                        >
                          <MessageSquare className="w-5 h-5" />
                        </button>
                        {meeting.status !== 'Cancelled' && (
                          <button
                            onClick={() => openFeedbackModal(meeting)}
                            className="px-4 py-2 text-sm font-bold rounded-xl bg-amber-50 text-amber-700 hover:bg-amber-100 transition-colors"
                            title="Add Interview Feedback"
                          >
                            {meeting.feedbackByHR?.submittedAt ? 'Edit Feedback' : 'Add Feedback'}
                          </button>
                        )}
                        {meeting.status !== 'Cancelled' && (
                          <button
                            onClick={() => openCancelModal(meeting)}
                            disabled={cancellingId === meeting._id}
                            className="p-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                            title="Cancel Interview"
                          >
                            {cancellingId === meeting._id ? <Loader2 className="w-5 h-5 animate-spin" /> : <XCircle className="w-5 h-5" />}
                          </button>
                        )}
                      </div>

                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Chat Dialog */}
        <ChatDialog
          isOpen={showChat}
          onClose={() => setShowChat(false)}
          candidate={chatCandidate}
          currentUser={currentUser}
        />

        {/* Cancellation Modal */}
        {showCancelModal && selectedMeeting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
              {/* Modal Header */}
              <div className="p-6 border-b border-slate-200 bg-red-50">
                <div className="flex items-center gap-3 text-red-700 mb-2">
                  <AlertCircle className="w-6 h-6" />
                  <h3 className="text-xl font-bold">Cancel Interview</h3>
                </div>
                <p className="text-red-600/80 text-sm">
                  Are you sure you want to cancel the interview with <strong>{selectedMeeting.candidateId?.name}</strong>?
                </p>
              </div>

              {/* Modal Body */}
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Reason for Cancellation
                  </label>
                  <textarea
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="e.g., Scheduling conflict, Position filled..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 min-h-[100px] text-sm resize-none"
                  />
                </div>

                <label className="flex items-center gap-3 p-3 rounded-xl border border-slate-200 bg-slate-50 cursor-pointer hover:bg-white transition-colors">
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${notifyCandidate ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'}`}>
                    {notifyCandidate && <CheckCircle className="w-3.5 h-3.5" />}
                  </div>
                  <input
                    type="checkbox"
                    checked={notifyCandidate}
                    onChange={(e) => setNotifyCandidate(e.target.checked)}
                    className="hidden"
                  />
                  <div className="flex-1">
                    <span className="text-sm font-bold text-slate-900">Notify Candidate</span>
                    <p className="text-xs text-slate-500">Send an automated cancellation email</p>
                  </div>
                  <Mail className="w-5 h-5 text-slate-400" />
                </label>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3 cancel-modal-actions">
                <button
                  onClick={closeCancelModal}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 hover:text-slate-900 transition-colors"
                >
                  Keep Interview
                </button>
                <button
                  onClick={handleConfirmCancel}
                  disabled={cancellingId === selectedMeeting._id}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20 transition-all flex items-center gap-2"
                >
                  {cancellingId === selectedMeeting._id ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Cancelling...
                    </>
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Confirm Cancellation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Feedback Modal */}
        {showFeedbackModal && selectedFeedbackMeeting && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden">
              <div className="p-6 border-b border-slate-200 bg-amber-50">
                <h3 className="text-xl font-bold text-amber-800">Interview Feedback</h3>
                <p className="text-sm text-amber-700 mt-1">
                  {selectedFeedbackMeeting.candidateId?.name} - {selectedFeedbackMeeting.jobRole}
                </p>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-900 mb-2">Overall Feedback</label>
                  <textarea
                    value={feedbackForm.overall}
                    onChange={(e) => setFeedbackForm(prev => ({ ...prev, overall: e.target.value }))}
                    placeholder="Summarize interview performance..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 min-h-[110px] text-sm resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Strengths (comma separated)</label>
                    <input
                      type="text"
                      value={feedbackForm.strengths}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, strengths: e.target.value }))}
                      placeholder="Communication, problem solving"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-900 mb-2">Improvements (comma separated)</label>
                    <input
                      type="text"
                      value={feedbackForm.improvements}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, improvements: e.target.value }))}
                      placeholder="System design depth"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-400 text-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-200 bg-slate-50 flex justify-end gap-3">
                <button
                  onClick={closeFeedbackModal}
                  disabled={isSavingFeedback}
                  className="px-5 py-2.5 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={submitFeedback}
                  disabled={isSavingFeedback}
                  className="px-5 py-2.5 rounded-xl font-bold text-white bg-amber-600 hover:bg-amber-700 transition-all flex items-center gap-2"
                >
                  {isSavingFeedback ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save Feedback'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HRMeetings;
