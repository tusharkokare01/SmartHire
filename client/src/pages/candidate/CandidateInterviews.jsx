import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar, Video, Clock, MapPin, ExternalLink, Copy, CheckCircle,
  ArrowLeft, Timer, Briefcase, ChevronRight, Sparkles
} from 'lucide-react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';

const CandidateInterviews = () => {
  const { user } = useAuth();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [nextInterview, setNextInterview] = useState(null);
  const [timeLeft, setTimeLeft] = useState('');
  const [feedbackDrafts, setFeedbackDrafts] = useState({});
  const [savingFeedbackId, setSavingFeedbackId] = useState(null);

  useEffect(() => {
    fetchInterviews();
  }, [user]);

  useEffect(() => {
    if (nextInterview) {
      const timer = setInterval(() => {
        const now = new Date();
        const start = new Date(nextInterview.scheduledAt);
        const diff = start - now;

        if (diff <= 0) {
          setTimeLeft('Starting now');
          clearInterval(timer);
        } else {
          const days = Math.floor(diff / (1000 * 60 * 60 * 24));
          const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const seconds = Math.floor((diff % (1000 * 60)) / 1000);

          let timeString = '';
          if (days > 0) timeString += `${days}d `;
          if (hours > 0) timeString += `${hours}h `;
          timeString += `${minutes}m ${seconds}s`;
          setTimeLeft(timeString);
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [nextInterview]);

  const fetchInterviews = async () => {
    if (!user) return;

    const userId = user.id || user._id;
    if (!userId || userId === 'undefined' || userId === 'null') {
      setInterviews([]);
      setError('User session is incomplete. Please sign in again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await api.get(`/candidate/interviews?candidateId=${userId}`);
      const data = Array.isArray(response.data) ? response.data : [];

      // Sort by date
      const sorted = data.sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt));
      setInterviews(sorted);

      // Find next upcoming interview
      const now = new Date();
      const next = sorted.find(i => new Date(i.scheduledAt) > now && i.status !== 'Cancelled');
      setNextInterview(next);

    } catch (err) {
      console.error('Error fetching interviews:', err);
      if (err.response && err.response.status === 404) {
        setInterviews([]);
        setError(null);
      } else {
        setError('Failed to load interviews');
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(undefined, {
      weekday: 'long', month: 'long', day: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString(undefined, {
      hour: '2-digit', minute: '2-digit'
    });
  };

  const updateDraft = (interviewId, patch) => {
    setFeedbackDrafts(prev => ({
      ...prev,
      [interviewId]: {
        rating: prev[interviewId]?.rating || 5,
        comment: prev[interviewId]?.comment || '',
        ...patch,
      }
    }));
  };

  const submitCandidateFeedback = async (interviewId) => {
    const userId = user?.id || user?._id;
    if (!userId) {
      alert('User session missing. Please sign in again.');
      return;
    }

    const draft = feedbackDrafts[interviewId] || { rating: 5, comment: '' };

    try {
      setSavingFeedbackId(interviewId);
      const response = await api.patch(`/candidate/interviews/${interviewId}/feedback`, {
        candidateId: userId,
        rating: draft.rating,
        comment: draft.comment,
      });

      setInterviews(prev => prev.map(item => (
        item._id === interviewId ? response.data : item
      )));
    } catch (err) {
      console.error('Error submitting candidate feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSavingFeedbackId(null);
    }
  };

  return (
    <Layout role="candidate">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-10">
          <Link
            to={ROUTES.CANDIDATE_DASHBOARD}
            className="inline-flex items-center text-slate-400 hover:text-slate-900 transition-colors mb-6 group text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Dashboard
          </Link>
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 tracking-tight">My Interviews</h1>
              <p className="text-slate-500 mt-2 text-lg">Manage your schedule and preparation.</p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 shadow-sm">
                <Sparkles className="w-4 h-4 text-amber-400" />
                {interviews.length} Scheduled
              </div>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-900"></div>
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 text-center">
            <p className="font-medium">{error}</p>
            <button onClick={fetchInterviews} className="mt-4 text-sm underline hover:text-red-800">Try Again</button>
          </div>
        ) : interviews.length === 0 ? (
          <div className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-sm">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Calendar className="w-10 h-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No interviews yet</h3>
            <p className="text-slate-500 max-w-md mx-auto mb-8">
              Your scheduled interviews will appear here.
            </p>
            <Link
              to={ROUTES.JOB_SEARCH}
              className="inline-flex items-center px-6 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors font-medium"
            >
              Browse Jobs
              <ChevronRight className="w-4 h-4 ml-2" />
            </Link>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Hero Section - Next Interview */}
            {nextInterview && (
              <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50/50 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl group-hover:bg-emerald-100/50 transition-colors duration-500"></div>
                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between gap-8">
                    <div className="flex-1">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold uppercase tracking-wider mb-6">
                        <Timer className="w-3 h-3" />
                        Up Next
                      </div>
                      <h2 className="text-4xl font-bold text-slate-900 mb-4 tracking-tight">{nextInterview.jobRole}</h2>

                      <div className="flex flex-wrap items-center gap-6 text-slate-600 mb-8">
                        <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Video className="w-4 h-4 text-slate-400" />
                          {nextInterview.platform}
                        </span>
                        <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {formatDate(nextInterview.scheduledAt)}
                        </span>
                      </div>

                      {nextInterview.meetingLink && (
                        <div className="flex flex-wrap gap-4">
                          <a
                            href={nextInterview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-3 shadow-xl shadow-slate-200"
                          >
                            <Video className="w-5 h-5" />
                            Join Interview
                          </a>
                          {nextInterview.meetingPassword && (
                            <div className="flex items-center gap-3 px-5 py-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                              <span className="text-xs text-slate-400 uppercase tracking-wider font-bold">Passcode</span>
                              <code className="font-mono font-bold text-slate-900 text-lg">{nextInterview.meetingPassword}</code>
                              <button
                                onClick={() => copyToClipboard(nextInterview.meetingPassword, nextInterview._id)}
                                className="p-2 hover:bg-slate-50 rounded-lg transition-colors text-slate-400 hover:text-slate-600 ml-2"
                              >
                                {copiedId === nextInterview._id ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col justify-center items-center md:items-end min-w-[240px] border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-8">
                      <div className="text-center md:text-right">
                        <div className="text-sm text-slate-400 mb-2 font-medium uppercase tracking-wider">Starting In</div>
                        <div className="text-5xl font-bold text-slate-900 font-mono tracking-tighter tabular-nums">{timeLeft}</div>
                        <div className="text-sm text-slate-500 mt-3 font-medium">
                          {formatTime(nextInterview.scheduledAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Other Interviews List */}
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                <Briefcase className="w-5 h-5 text-slate-400" />
                All Interviews
              </h3>
              <div className="grid gap-4">
                {interviews.map((interview) => (
                  <div
                    key={interview._id}
                    className={`bg-white rounded-2xl border transition-all duration-300 hover:shadow-lg hover:border-slate-300 group
                      ${interview._id === nextInterview?._id ? 'border-emerald-200 shadow-md ring-1 ring-emerald-50' : 'border-slate-200'}
                    `}
                  >
                    <div className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="flex items-start gap-5">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 transition-colors
                          ${interview.status === 'Completed' ? 'bg-green-50 text-green-600' :
                            interview.status === 'Cancelled' ? 'bg-red-50 text-red-600' :
                              'bg-slate-50 text-slate-600 group-hover:bg-slate-100'}
                        `}>
                          {interview.status === 'Completed' ? <CheckCircle className="w-7 h-7" /> : <Video className="w-7 h-7" />}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-xl mb-1">{interview.jobRole}</h4>
                          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-slate-500">
                            <span className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-slate-400" />
                              {formatDate(interview.scheduledAt)}
                            </span>
                            <span className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-slate-400" />
                              {formatTime(interview.scheduledAt)}
                            </span>
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border
                              ${interview.status === 'Scheduled' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                interview.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-100' :
                                  'bg-slate-100 text-slate-600 border-slate-200'}
                            `}>
                              {interview.status}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 pl-[4.5rem] md:pl-0">
                        {interview.meetingLink && interview.status === 'Scheduled' && (
                          <a
                            href={interview.meetingLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:border-slate-400 hover:text-slate-900 transition-all flex items-center gap-2"
                          >
                            Join
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        )}
                        {interview.meetingPassword && interview.status === 'Scheduled' && (
                          <button
                            onClick={() => copyToClipboard(interview.meetingPassword, interview._id)}
                            className="p-2.5 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-xl transition-colors border border-transparent hover:border-slate-200"
                            title="Copy Passcode"
                          >
                            {copiedId === interview._id ? <CheckCircle className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                          </button>
                        )}
                      </div>
                    </div>

                    {interview.status === 'Completed' && (
                      <div className="px-6 pb-6 pl-[6.5rem] md:pl-6">
                        {interview.feedbackByCandidate?.submittedAt ? (
                          <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                            <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Your Feedback</div>
                            <div className="text-sm text-emerald-900 font-medium mb-1">Rating: {interview.feedbackByCandidate.rating}/5</div>
                            <p className="text-sm text-emerald-800">
                              {interview.feedbackByCandidate.comment || 'No additional comment provided.'}
                            </p>
                          </div>
                        ) : (
                          <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 space-y-3">
                            <div className="text-xs font-bold uppercase tracking-wider text-amber-700">Share Interview Feedback</div>
                            <div className="flex items-center gap-3">
                              <label className="text-sm font-medium text-slate-700">Rating</label>
                              <select
                                value={feedbackDrafts[interview._id]?.rating || 5}
                                onChange={(e) => updateDraft(interview._id, { rating: Number(e.target.value) })}
                                className="px-3 py-2 rounded-lg border border-amber-200 bg-white text-sm"
                              >
                                {[5, 4, 3, 2, 1].map(score => (
                                  <option key={score} value={score}>{score}</option>
                                ))}
                              </select>
                            </div>
                            <textarea
                              value={feedbackDrafts[interview._id]?.comment || ''}
                              onChange={(e) => updateDraft(interview._id, { comment: e.target.value })}
                              placeholder="How was the interview experience?"
                              className="w-full min-h-[90px] px-3 py-2 rounded-lg border border-amber-200 bg-white text-sm focus:outline-none focus:border-amber-400"
                            />
                            <button
                              onClick={() => submitCandidateFeedback(interview._id)}
                              disabled={savingFeedbackId === interview._id}
                              className="px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-bold hover:bg-amber-700 disabled:opacity-70"
                            >
                              {savingFeedbackId === interview._id ? 'Submitting...' : 'Submit Feedback'}
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CandidateInterviews;
