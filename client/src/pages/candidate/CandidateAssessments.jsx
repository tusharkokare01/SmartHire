import React, { useState, useEffect } from 'react';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import api from '../../services/api';
import { Play, CheckCircle, Clock, AlertCircle, ChevronRight, Trophy, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CandidateAssessments = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Test Taking State
  const [activeTest, setActiveTest] = useState(null); // The full assessment object being taken
  const [activeResultId, setActiveResultId] = useState(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState({}); // { 0: 1, 1: 3 } (questionIdx: optionIdx)
  const [submitting, setSubmitting] = useState(false);
  const [testResult, setTestResult] = useState(null); // Immediate result after submit
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [warnings, setWarnings] = useState(0);
  const [showWarningModal, setShowWarningModal] = useState(false);

  useEffect(() => {
    fetchAssessments();
  }, [user]);

  // Timer Effect
  useEffect(() => {
    let timer;
    if (activeTest && !testResult && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            submitTest(); // Auto submit when time runs out
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeTest, testResult, timeLeft]);

  // Proctoring Effect (Tab Switch Detection)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && activeTest && !testResult && !showWarningModal) {
        handleViolation();
      }
    };

    const handleViolation = () => {
      const newWarnings = warnings + 1;
      setWarnings(newWarnings);

      if (newWarnings >= 3) {
        // Auto Submit (Fail)
        submitTest(true);
      } else {
        setShowWarningModal(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [activeTest, testResult, warnings, showWarningModal]);

  const fetchAssessments = async () => {
    try {
      console.log('Current User State:', user);
      const userId = user?._id || user?.id;
      if (!userId) {
        console.warn('User ID missing in auth context');
        return;
      }
      const res = await api.get(`/assessments/my-assessments/${userId}`);
      setAssessments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const startTest = (assignment) => {
    setActiveTest(assignment.assessmentId);
    setActiveResultId(assignment._id);
    setCurrentQuestionIdx(0);
    setAnswers({});
    setTestResult(null);
    setTestResult(null);
    setWarnings(0);
    setShowWarningModal(false);
    setTimeLeft((assignment.assessmentId.duration || 30) * 60); // Initialize timer (default 30 mins)
  };

  const handleAnswer = (optionIdx) => {
    setAnswers(prev => ({
      ...prev,
      [currentQuestionIdx]: optionIdx
    }));
  };

  const submitTest = async () => {
    if (!activeResultId) return;
    try {
      setSubmitting(true);
      const res = await api.post('/assessments/submit', {
        resultId: activeResultId,
        answers: answers
      });
      setTestResult(res.data);
      // Wait a bit then refresh list
      setTimeout(() => {
        fetchAssessments();
      }, 1000);
    } catch (error) {
      alert('Failed to submit test');
      console.error(error);
    } finally {
      setSubmitting(false);
    }
  };

  // --- RENDER: ACTIVE TEST UI ---
  if (activeTest && !testResult) {
    if (!activeTest.questions || activeTest.questions.length === 0) {
      return (
        <div className="p-8 text-center">
          <h2 className="text-xl font-bold text-red-500">Error: No questions found for this assessment.</h2>
          <button onClick={() => setActiveTest(null)} className="mt-4 px-4 py-2 bg-slate-200 rounded-lg">Go Back</button>
        </div>
      );
    }
    const question = activeTest.questions[currentQuestionIdx];
    const isLast = currentQuestionIdx === activeTest.questions.length - 1;
    const progress = ((currentQuestionIdx + 1) / activeTest.questions.length) * 100;


    const formatTime = (seconds) => {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
        {/* Header */}
        <div className="h-16 border-b border-slate-200 flex items-center justify-between px-8 bg-white/50 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="font-bold text-white">S</span>
            </div>
            <div>
              <h2 className="font-bold text-slate-900 text-sm uppercase tracking-wide">Smart Career hub Evaluation</h2>
              <p className="text-slate-500 text-xs font-medium">{activeTest.title} • {user?.name || 'Candidate'}</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Progress</span>
              <span className="text-sm font-bold text-slate-700">{currentQuestionIdx + 1} / {activeTest.questions.length}</span>
            </div>
            <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500 transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${timeLeft < 60 ? 'bg-red-50 border-red-200 text-red-600 animate-pulse' : 'bg-slate-50 border-slate-200 text-slate-700'}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
            </div>
          </div>
        </div>

        {/* Question Canvas */}
        <div className="flex-1 max-w-3xl mx-auto w-full p-8 flex flex-col justify-center animate-in fade-in duration-500">
          <h3 className="text-2xl md:text-3xl font-bold leading-tight mb-8 text-slate-900">
            {question.question}
          </h3>

          <div className="space-y-3">
            {question.options.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 flex items-center justify-between group
                   ${answers[currentQuestionIdx] === idx
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-lg shadow-emerald-500/10'
                    : 'border-slate-200 bg-white hover:border-emerald-200 hover:bg-slate-50'
                  }
                 `}
              >
                <span className="font-medium text-lg">{opt}</span>
                {answers[currentQuestionIdx] === idx && <CheckCircle className="w-5 h-5 text-emerald-500" />}
              </button>
            ))}
          </div>
        </div>

        {/* Footer Navigation */}
        <div className="h-20 border-t border-slate-200 flex items-center justify-between px-8 bg-white">
          <button
            onClick={() => setCurrentQuestionIdx(prev => Math.max(0, prev - 1))}
            disabled={currentQuestionIdx === 0}
            className="text-slate-500 font-bold hover:text-slate-900 disabled:opacity-30 disabled:hover:text-slate-500 transition-colors"
          >
            Previous
          </button>

          {isLast ? (
            <button
              onClick={submitTest}
              disabled={submitting}
              className="bg-emerald-600 text-white px-8 py-3 rounded-full font-bold hover:bg-emerald-700 transition-all shadow-lg flex items-center gap-2"
            >
              {submitting ? 'Submitting...' : 'Submit Assessment'}
              {!submitting && <CheckCircle className="w-5 h-5" />}
            </button>
          ) : (
            <button
              onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
              className="bg-slate-900 text-white px-6 py-3 rounded-full font-bold hover:bg-slate-800 transition-all shadow-lg flex items-center gap-2"
            >
              Next Question
              <ChevronRight className="w-5 h-5" />
            </button>
          )}
        </div>


        {/* Warning Modal */}
        {
          showWarningModal && (
            <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm">
              <div className="bg-white max-w-md w-full rounded-2xl p-8 text-center animate-bounce-in">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Warning: Tab Switch Detected!</h3>
                <p className="text-slate-600 mb-6">
                  You are not allowed to switch tabs or minimize the window during the assessment.
                  <br /><br />
                  <span className="font-bold text-red-600">Strike {warnings}/3</span>. If you reach 3 strikes, the test will automatically submit.
                </p>
                <button
                  onClick={() => setShowWarningModal(false)}
                  className="w-full py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-all"
                >
                  I Understand, Return to Test
                </button>
              </div>
            </div>
          )
        }
      </div >
    );
  }

  // --- RENDER: RESULT SUCCESS UI ---
  if (testResult) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
        <div className="bg-white max-w-md w-full rounded-3xl shadow-2xl p-8 text-center animate-in zoom-in-95 duration-300">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Trophy className="w-10 h-10 text-emerald-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">Assessment Complete!</h2>
          <p className="text-slate-500 mb-8">Your answers have been submitted securely.</p>

          <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100">
            <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-1">Your Score</div>
            <div className="text-5xl font-black text-emerald-600 tracking-tight">
              {testResult.score}<span className="text-2xl text-slate-300 font-medium">/{testResult.total}</span>
            </div>
            <div className="mt-2 inline-block px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
              {testResult.percentage}% Accuracy
            </div>
          </div>

          <button
            onClick={() => { setActiveTest(null); setTestResult(null); }}
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // --- RENDER: MAIN LIST ---
  return (
    <Layout role="candidate">
      <div className="max-w-5xl mx-auto p-8 font-sans">
        <button
          onClick={() => navigate('/candidate/dashboard')}
          className="mb-6 flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Dashboard
        </button>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Assessments</h1>
        <p className="text-slate-500 mb-8">Technical screenings and skill tests assigned to you.</p>

        {loading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-100 rounded-xl" />)}
          </div>
        ) : (
          <div className="space-y-4">
            {assessments.length === 0 ? (
              <div className="text-center py-20 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200">
                <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 custom-shadow">
                  <CheckCircle className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No Assessments Assigned</h3>
                <p className="text-slate-500">You're all caught up! Check back later.</p>
              </div>
            ) : (
              assessments.map(item => (
                <div key={item._id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${item.status === 'Completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'}`}>
                      {item.status === 'Completed' ? <CheckCircle className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900">{item.assessmentId?.title || 'Untitled Assessment'}</h3>
                      <p className="text-sm text-slate-500 flex items-center gap-4 mt-1">
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {item.assessmentId?.duration || 30} mins</span>
                        <span className="flex items-center gap-1"><AlertCircle className="w-3 h-3" /> {item.assessmentId?.questions?.length || 0} Questions</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {item.status === 'Completed' ? (
                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">{item.score !== undefined ? item.score : '-'}/{item.totalQuestions}</div>
                        <div className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Completed</div>
                      </div>
                    ) : (
                      <button
                        onClick={() => startTest(item)}
                        className="px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center gap-2 shadow-lg shadow-slate-200"
                      >
                        Start Test
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CandidateAssessments;

