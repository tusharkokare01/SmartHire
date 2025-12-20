import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Video, Mic, Play, Square, Send, TrendingUp, Loader2, Sparkles, Briefcase, Code, Clock, CheckCircle2, FileText, ChevronDown, Volume2, Trophy, Download, ArrowLeft, Lock } from 'lucide-react';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { loadJSON, saveJSON } from '../../utils/storage';
import axios from 'axios';
import { ROUTES } from '../../utils/constants';


const MockInterview = () => {
  const { user } = useAuth();
  const videoRef = useRef(null);
  const [isRecording, setIsRecording] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [setupComplete, setSetupComplete] = useState(false);
  const [isAIGenerated, setIsAIGenerated] = useState(false);
  const [interviewFinished, setInterviewFinished] = useState(false);
  const [userAnswers, setUserAnswers] = useState([]);
  const [interviewParams, setInterviewParams] = useState({
    role: '',
    skills: '',
    experienceLevel: 'Mid-Level'
  });
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [isResumeDropdownOpen, setIsResumeDropdownOpen] = useState(false);
  const recognitionRef = useRef(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (user?.email) {
      const savedResumes = loadJSON(`resumes_list_${user.email}`, []);
      setResumes(savedResumes);
    }
  }, [user]);

  useEffect(() => {
    if (videoRef.current && mediaStream) {
      videoRef.current.srcObject = mediaStream;
    }
  }, [mediaStream, isRecording]);

  const generateQuestions = async () => {
    if (!interviewParams.role || !interviewParams.skills) {
      alert("Please enter a role and skills.");
      return;
    }

    setIsProcessing(true);
    try {
     const selectedResume = resumes.find(
  r => String(r.id || r._id) === String(selectedResumeId)
);

      const payload = { ...interviewParams, resumeData: selectedResume };

      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/generate-questions`, payload);
      const receivedQuestions = response.data;

      // Normalize questions immediately to prevent crashes
      const normalizedQuestions = receivedQuestions.map((q, idx) => ({
        id: q.id || `ai-q-${idx}`,
        text: q.text || q.question || "Question placeholder",
        type: q.type || 'General',
        isMock: !!q.isMock
      }));

      // Robust check using explicit flag
      const isMock = normalizedQuestions.some(q => q.isMock);

      setIsAIGenerated(!isMock);
      setQuestions(normalizedQuestions);
      setSetupComplete(true);
      setSetupComplete(true);
      setInterviewStarted(true);
      setStartTime(Date.now());
      setCurrentQuestion(receivedQuestions[0]);
    } catch (error) {
      console.error("Failed to generate questions", error);
      // Fallback to local mock questions so user isn't blocked
      const mockQuestions = [
        { id: 1, text: `Tell me about your experience as a ${interviewParams.role}.`, type: 'Introduction' },
        { id: 2, text: `What are your key strengths in ${interviewParams.skills}?`, type: 'Technical' },
        { id: 3, text: 'Describe a challenging project you worked on.', type: 'Behavioral' },
        { id: 4, text: 'How do you handle tight deadlines?', type: 'Behavioral' },
        { id: 5, text: `What is your proficiency level in ${interviewParams.skills.split(',')[0]}?`, type: 'Technical' }
      ];
      setIsAIGenerated(false);
      setQuestions(mockQuestions);
      setSetupComplete(true);
      setSetupComplete(true);
      setInterviewStarted(true);
      setStartTime(Date.now());
      setCurrentQuestion(mockQuestions[0]);
      // alert("AI generation failed. Using mock questions instead.");
    } finally {
      setIsProcessing(false);
    }
  };

  // Voice Selection State
  const [speechVoice, setSpeechVoice] = useState(null);

  // Load and select the best available voice
  useEffect(() => {
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Try to find a high-quality English voice (Google, Microsoft, or Apple)
      const preferredVoice = voices.find(v =>
        (v.name.includes('Google') && v.name.includes('English')) ||
        (v.name.includes('Samantha') && v.lang.includes('en')) ||
        (v.name.includes('Microsoft Zira') && v.lang.includes('en'))
      );
      setSpeechVoice(preferredVoice || voices.find(v => v.lang.includes('en')) || voices[0]);
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  // Cleanup media/speech on unmount
  useEffect(() => {
    return () => {
      // 1. Stop Speech Synthesis
      window.speechSynthesis.cancel();
      
      // 2. Stop Camera Stream
      if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
      }
      
      // 3. Stop Recognition
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [mediaStream]);

  // Auto-speak question when it changes
  useEffect(() => {
    if (currentQuestion?.text && 'speechSynthesis' in window) {
      // Small delay to ensure UI is ready and feels natural
      const timer = setTimeout(() => {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(currentQuestion.text);

        if (speechVoice) {
          utterance.voice = speechVoice;
        }

        utterance.rate = 1.0; // Normal speed
        utterance.pitch = 1.0; // Natural pitch
        utterance.volume = 1.0;

        window.speechSynthesis.speak(utterance);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [currentQuestion, speechVoice]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      setMediaStream(stream);

      // Cleanup previous instance if exists to prevent leaks/overlap
      if (recognitionRef.current) {
        recognitionRef.current.onend = null; // Prevent zombie callbacks
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }

      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        // Optimize: Don't rebuild string from scratch if possible, but for short answers strict mapping is safe.
        // Critical Fix: Ensure we don't have dupes from overlapping instances (handled by cleanup above).
        recognition.onresult = (event) => {
          const current = Array.from(event.results)
            .map(result => result[0].transcript)
            .join('');
          setTranscript(current);
        };
        
        recognition.onerror = (event) => {
             console.error("Speech reco error", event.error);
             // Optional: Handle 'no-speech' or 'network' errors gracefully
        };

        recognition.start();
        recognitionRef.current = recognition;
      } else {
        alert("Speech recognition not supported in this browser. Please use Chrome.");
      }

      setIsRecording(true);
      setEvaluation(null);
      setTranscript('');
    } catch (err) {
      console.error("Error starting interview:", err);
      if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        alert("❌ Camera is already in use by another application.\n\nPlease close other apps using your camera (Zoom, Teams, Skype, OBS, etc.) and try again.");
      } else if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        alert("❌ Camera/microphone permission denied.\n\nPlease allow access in your browser settings and refresh the page.");
      } else {
        alert(`Could not access camera/microphone. Details: ${err.name} - ${err.message}`);
      }
    }
  };

  const stopRecording = async () => {
    setIsRecording(false);
    setIsProcessing(true);

    // Stop Camera
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }

    // Stop Speech
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    // Evaluate
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/ai/evaluate-interview`, {
        question: currentQuestion.text,
        answer: transcript || "No answer detected."
      }, { timeout: 15000 }); // 15s timeout to prevent hanging

      const result = response.data;
      setEvaluation(result);

      // Add to session history
      setUserAnswers(prev => [...prev, {
        question: currentQuestion,
        answer: transcript,
        evaluation: result
      }]);

      // Save to localStorage
      if (user?.email) {
        const key = `interviews_${user.email}`;
        const existing = loadJSON(key, []);
        existing.push({
          questionId: currentQuestion.id,
          question: currentQuestion.text,
          type: currentQuestion.type,
          createdAt: new Date().toISOString(),
          ...result,
        });
        saveJSON(key, existing);
      }

    } catch (error) {
      console.error("Evaluation failed", error);
      const msg = error.response?.data?.error || error.message || "Unknown error";
      alert(`Failed to evaluate answer: ${msg}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const nextQuestion = () => {
    const currentIndex = questions.findIndex((q) => q.id === currentQuestion.id);
    if (currentIndex < questions.length - 1) {
      setCurrentQuestion(questions[currentIndex + 1]);
      setEvaluation(null);
      setTranscript('');
    } else {
      setInterviewFinished(true);
    }
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
            <h1 className="text-3xl font-bold text-slate-900">Mock Interview</h1>
            <p className="text-secondary mt-1">Practice interviews with AI evaluation</p>
          </div>
        </div>

        {!interviewStarted ? (
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden max-w-5xl mx-auto border border-slate-100 transition-all hover:shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px]">

              {/* Left Side - Visual & Info */}
              <div className="lg:col-span-2 bg-slate-50 relative overflow-hidden p-8 flex flex-col justify-between border-r border-slate-100">
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                {/* Dynamic Orbs */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-100/40 rounded-full mix-blend-multiply filter blur-3xl -mr-20 -mt-20 animate-pulse"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/40 rounded-full mix-blend-multiply filter blur-3xl -ml-20 -mb-20 animate-pulse" style={{ animationDelay: '2s' }}></div>

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white border border-slate-100 rounded-2xl flex items-center justify-center mb-8 shadow-sm">
                    <Video className="w-8 h-8 text-emerald-600" />
                  </div>

                  <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight tracking-tight">
                    Ace Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-blue-600">Next Interview</span>
                  </h2>

                  <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-xs">
                    Practice with an AI interviewer that adapts to your profile and gives real-time feedback.
                  </p>

                  <div className="space-y-3">
                    {[
                      { icon: Sparkles, text: "Smart Question Generation", color: "text-emerald-600", bg: "bg-emerald-50" },
                      { icon: TrendingUp, text: "Performance Analytics", color: "text-blue-600", bg: "bg-blue-50" },
                      { icon: Mic, text: "Speech Clarity Analysis", color: "text-purple-600", bg: "bg-purple-50" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-white/80 backdrop-blur-sm border border-slate-100 shadow-sm">
                        <div className={`w-8 h-8 rounded-lg ${item.bg} flex items-center justify-center ${item.color}`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="text-slate-700 font-medium text-sm">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="relative z-10 mt-12 pt-6 border-t border-slate-200/60 flex justify-between items-center">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-white/60 backdrop-blur-sm rounded-full border border-slate-100 shadow-sm">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">Interview Engine: Online</span>
                  </div>
                  <span className="text-[10px] font-medium text-slate-400 font-mono">v3.0.1</span>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="lg:col-span-3 bg-white p-8 lg:p-12 flex flex-col justify-center">
                <div className="max-w-md mx-auto w-full space-y-8">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">Configure Session</h3>
                    <p className="text-slate-500 mt-1">Set up your mock interview parameters</p>
                  </div>

                  <div className="space-y-6">
                    {/* Target Role */}
                    <div className="group">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Target Role</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          value={interviewParams.role}
                          onChange={(e) => setInterviewParams({ ...interviewParams, role: e.target.value })}
                          placeholder="e.g. Senior Product Designer"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                        />
                      </div>
                    </div>

                    {/* Key Skills */}
                    <div className="group">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Key Skills</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                          <Code className="w-5 h-5" />
                        </div>
                        <input
                          type="text"
                          value={interviewParams.skills}
                          onChange={(e) => setInterviewParams({ ...interviewParams, skills: e.target.value })}
                          placeholder="e.g. Figma, React, User Research"
                          className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-900 placeholder-slate-400 font-medium"
                        />
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div className="group">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Experience Level</label>
                      <div className="relative">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                          <Clock className="w-5 h-5" />
                        </div>
                        <select
                          value={interviewParams.experienceLevel}
                          onChange={(e) => setInterviewParams({ ...interviewParams, experienceLevel: e.target.value })}
                          className="w-full pl-12 pr-10 py-3.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all text-slate-900 font-medium appearance-none"
                        >
                          <option>Entry Level</option>
                          <option>Mid-Level</option>
                          <option>Senior Level</option>
                          <option>Lead / Manager</option>
                        </select>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>

                    {/* Resume Context - Premium Feature Card */}
                    <div className="pt-2">
                      {user?.subscriptionStatus === 'active' ? (
                        <div className={`relative rounded-xl transition-all duration-300 ${selectedResumeId ? 'bg-gradient-to-br from-emerald-50/50 to-emerald-50/50 border-2 border-emerald-500 shadow-sm' : 'bg-slate-50 border-2 border-dashed border-slate-300 hover:border-emerald-400 hover:bg-slate-50/80'}`}>

                          {/* Active Badge */}
                          {selectedResumeId && (
                            <div className="absolute -top-2.5 -right-2.5 z-10">
                              <span className="relative flex h-5 w-5">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 items-center justify-center shadow-sm">
                                  <CheckCircle2 className="w-3 h-3 text-white" />
                                </span>
                              </span>
                            </div>
                          )}

                          <div className="p-4">
                            <div className="flex items-center gap-4">
                              {/* Icon Box */}
                              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 transition-all shadow-sm ${selectedResumeId ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-white border border-slate-200 text-slate-400'}`}>
                                <FileText className="w-6 h-6" />
                              </div>

                              <div className="flex-1 min-w-0">
                                {/* Label */}
                                <div className="mb-2">
                                  <label className={`block text-xs font-bold uppercase tracking-wider mb-0.5 ${selectedResumeId ? 'text-emerald-700' : 'text-slate-500'}`}>
                                    {selectedResumeId ? 'Active Resume' : 'Resume Context'}
                                  </label>
                                </div>

                                {/* Custom Dropdown */}
                                <div className="relative">
                                  <button
                                    onClick={() => setIsResumeDropdownOpen(!isResumeDropdownOpen)}
                                    className={`w-full flex items-center justify-between py-2.5 pl-3 pr-3 rounded-lg text-sm font-semibold outline-none transition-all ${selectedResumeId
                                      ? 'bg-white border border-emerald-200 text-emerald-900 shadow-sm hover:border-emerald-300'
                                      : 'bg-white border border-slate-200 text-slate-600 shadow-sm hover:border-slate-300 hover:bg-slate-50'
                                      }`}
                                  >
                                    <span className="truncate">
                                      {selectedResumeId
                                        ? resumes.find(r => (r.id || r._id) === selectedResumeId)?.name || 'Untitled Resume'
                                        : 'Select a resume to connect...'}
                                    </span>
                                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isResumeDropdownOpen ? 'rotate-180 text-emerald-500' : 'text-slate-400'}`} />
                                  </button>

                                  {/* Dropdown Menu */}
                                  {isResumeDropdownOpen && (
                                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                                      <div className="max-h-48 overflow-y-auto py-1">
                                        <button
                                          onClick={() => {
                                            setSelectedResumeId('');
                                            setIsResumeDropdownOpen(false);
                                          }}
                                          className="w-full text-left px-4 py-2.5 text-sm text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors border-b border-slate-50"
                                        >
                                          No Resume
                                        </button>
                                        {resumes.map((resume) => (
                                          <button
                                            key={resume.id}
                                            onClick={() => {
                                              setSelectedResumeId(resume.id || resume._id);
                                              setIsResumeDropdownOpen(false);
                                            }}
                                            className={`w-full text-left px-4 py-2.5 text-sm transition-colors flex items-center justify-between group ${selectedResumeId === (resume.id || resume._id)
                                              ? 'bg-emerald-50 text-emerald-700 font-medium'
                                              : 'text-slate-700 hover:bg-slate-50 hover:text-emerald-600'
                                              }`}
                                          >
                                            <span className="truncate">{resume.name || 'Untitled Resume'}</span>
                                            {selectedResumeId === resume.id && (
                                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                            )}
                                          </button>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Premium Lock State
                        <div className="relative rounded-xl bg-slate-50 border-2 border-dashed border-slate-300 p-6 text-center">
                          <div className="mb-3 flex justify-center">
                            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                              <Lock className="w-6 h-6 text-slate-400" />
                            </div>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 mb-1">Premium Feature</h4>
                          <p className="text-xs text-slate-500 mb-4">Connect specific resumes to tailor your interview questions.</p>
                          <Link to="/candidate/subscription" className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:underline">
                            Upgrade to Pro
                          </Link>
                        </div>
                      )}
                    </div>

                    <button
                      onClick={generateQuestions}
                      disabled={isProcessing || user?.subscriptionStatus !== 'active'}
                      className={`w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 transition-all shadow-xl mt-4 ${user?.subscriptionStatus === 'active'
                        ? 'bg-slate-900 hover:bg-slate-800 text-white hover:shadow-2xl hover:-translate-y-1'
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                      {user?.subscriptionStatus === 'active' ? (
                        <>
                          {isProcessing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5 fill-current" />}
                          {isProcessing ? 'Generating Session...' : 'Start Interview'}
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Unlock Mock Interview
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : interviewFinished ? (
          <div className="max-w-5xl mx-auto animate-in fade-in slide-in-from-bottom-8 duration-700">

            {/* Celebration Header */}
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative mb-8">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500"></div>
              <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-50 rounded-full mix-blend-multiply filter blur-3xl -mr-20 -mt-20 opacity-50"></div>
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-50 rounded-full mix-blend-multiply filter blur-3xl -ml-20 -mb-20 opacity-50"></div>

              <div className="p-12 text-center relative z-10">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-3xl mb-8 shadow-inner transform rotate-3 hover:rotate-6 transition-transform">
                  <Trophy className="w-12 h-12 text-yellow-600 drop-shadow-sm" />
                </div>

                <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                  Interview Mastery
                </h2>
                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  You've completed the session! Here's a comprehensive breakdown of your performance and AI-driven insights.
                </p>

                {/* Hero Score */}
                <div className="mt-12 flex justify-center">
                  <div className="relative">
                    <svg className="w-64 h-64 transform -rotate-90">
                      <circle
                        className="text-slate-100"
                        strokeWidth="12"
                        stroke="currentColor"
                        fill="transparent"
                        r="110"
                        cx="128"
                        cy="128"
                      />
                      <circle
                        className="text-yellow-500 transition-all duration-1000 ease-out"
                        strokeWidth="12"
                        strokeDasharray={2 * Math.PI * 110}
                        strokeDashoffset={2 * Math.PI * 110 * (1 - ((userAnswers.length > 0 ? Math.round(userAnswers.reduce((acc, curr) => acc + (curr.evaluation?.overallRating || 0), 0) / userAnswers.length) : 0) / 100))}
                        strokeLinecap="round"
                        stroke="currentColor"
                        fill="transparent"
                        r="110"
                        cx="128"
                        cy="128"
                      />
                    </svg>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                      <span className="text-6xl font-black text-slate-900 tracking-tighter">
                        {userAnswers.length > 0 
                          ? Math.round(userAnswers.reduce((acc, curr) => acc + (curr.evaluation?.overallRating || 0), 0) / userAnswers.length) 
                          : 0}
                        <span className="text-3xl text-slate-400 align-top">%</span>
                      </span>
                      <div className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">Overall Score</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
                <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {userAnswers.length > 0 
                    ? Math.min(98, Math.round((userAnswers.reduce((acc, curr) => acc + (curr.evaluation?.overallRating || 0), 0) / userAnswers.length) * 1.1)) 
                    : 0}%
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Selection Probability</div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
                <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {userAnswers.length} / {questions.length}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Questions Completed</div>
              </div>

              <div className="bg-white p-8 rounded-3xl shadow-xl border border-slate-100 flex flex-col items-center text-center hover:shadow-2xl transition-shadow">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                  <Clock className="w-6 h-6" />
                </div>
                <div className="text-3xl font-bold text-slate-900 mb-1">
                  {(() => {
                    if (!startTime) return '0m';
                    const diffMs = Date.now() - startTime;
                    const mins = Math.floor(diffMs / 60000);
                    return `${mins}m`;
                  })()}
                </div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Session Duration</div>
              </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white rounded-3xl shadow-xl border border-slate-100 overflow-hidden mb-8">
              <div className="p-8 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3">
                  <TrendingUp className="w-6 h-6 text-slate-400" />
                  Question Analysis
                </h3>
              </div>
              <div className="divide-y divide-slate-100">
                {userAnswers.map((item, index) => (
                  <div key={index} className="p-6 hover:bg-slate-50 transition-colors group">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex gap-4">
                        <span className="flex-shrink-0 w-8 h-8 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </span>
                        <div>
                          <h4 className="font-bold text-slate-900 text-lg mb-1">{item.question.text}</h4>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800">
                            {item.question.type}
                          </span>
                        </div>
                      </div>
                      <div className={`flex-shrink-0 px-4 py-2 rounded-xl font-bold text-lg ${item.evaluation.overallRating >= 80 ? 'bg-green-100 text-green-700' :
                        item.evaluation.overallRating >= 60 ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {item.evaluation.overallRating}%
                      </div>
                    </div>
                    <div className="pl-12">
                      <div className="space-y-3">
                        <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                          <span className="font-bold text-slate-900 block mb-1 text-xs uppercase tracking-wide">Your Answer:</span>
                          <p className="text-slate-700 text-sm italic">"{item.answer}"</p>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4">
                          <span className="font-bold text-emerald-900 block mb-1 text-xs uppercase tracking-wide flex items-center gap-2">
                            <Sparkles className="w-3 h-3" /> AI Feedback:
                          </span>
                          <p className="text-emerald-800 text-sm">{item.evaluation?.suggestions?.[0] || 'Good answer!'}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center gap-4 pb-12">
              <button
                onClick={() => {
                  setInterviewFinished(false);
                  setInterviewStarted(false);
                  setSetupComplete(false);
                  setUserAnswers([]);
                  setTranscript('');
                  setEvaluation(null);
                  setCurrentQuestion(null);
                  setQuestions([]);
                  // Clean reset without reload
                }}
                className="px-8 py-4 bg-white border-2 border-slate-200 text-slate-700 rounded-xl hover:border-slate-300 hover:bg-slate-50 font-bold text-lg transition-all shadow-sm hover:shadow-md"
              >
                Start New Session
              </button>
              <button
                onClick={() => window.print()}
                className="px-8 py-4 bg-slate-900 text-white rounded-xl hover:bg-black font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center gap-3"
              >
                <Download className="w-5 h-5" />
                Download Report
              </button>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {/* Header / Progress - Minimal */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">
                  {questions.indexOf(currentQuestion) + 1}
                </div>
                <div className="text-sm font-medium text-slate-500">
                  of {questions.length} Questions
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-300'}`}></span>
                <span className="text-sm font-medium text-slate-600 uppercase tracking-wider">
                  {isRecording ? 'Recording' : 'Standby'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

              {/* Left Side - Question */}
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider">
                      {currentQuestion?.type}
                    </span>
                    {isAIGenerated && (
                      <span className="flex items-center gap-1 text-xs font-medium text-purple-600">
                        <Sparkles className="w-3 h-3" /> AI Generated
                      </span>
                    )}
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight mb-6">
                    {currentQuestion?.text}
                  </h2>

                  <button
                    onClick={() => {
                      if ('speechSynthesis' in window) {
                        window.speechSynthesis.cancel();
                        const utterance = new SpeechSynthesisUtterance(currentQuestion?.text);
                        if (speechVoice) {
                          utterance.voice = speechVoice;
                        }
                        utterance.rate = 1.0;
                        utterance.pitch = 1.0;
                        window.speechSynthesis.speak(utterance);
                      }
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    <Volume2 className="w-4 h-4" />
                    Read Question Aloud
                  </button>
                </div>

                {/* Detailed AI Feedback */}
                {evaluation && (
                  <div className="pt-8 border-t border-slate-100 animate-in fade-in slide-in-from-bottom-4">
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Performance Analysis</h3>
                        <p className="text-xs text-slate-500">Detailed breakdown of your answer</p>
                      </div>
                    </div>

                    {/* Score Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                      <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 text-center transition-transform hover:scale-105">
                        <div className="text-2xl font-bold text-slate-900 mb-1">{evaluation.overallRating}%</div>
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Overall</div>
                      </div>
                      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 text-center transition-transform hover:scale-105">
                        <div className="text-2xl font-bold text-blue-600 mb-1">{evaluation.confidenceScore}%</div>
                        <div className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Confidence</div>
                      </div>
                      <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 text-center transition-transform hover:scale-105">
                        <div className="text-2xl font-bold text-purple-600 mb-1">{evaluation.clarityScore}%</div>
                        <div className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">Clarity</div>
                      </div>
                      <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 text-center transition-transform hover:scale-105">
                        <div className="text-2xl font-bold text-emerald-600 mb-1">{evaluation.relevanceScore}%</div>
                        <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Relevance</div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      {/* Key Improvements */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                          <TrendingUp className="w-3 h-3" /> Key Improvements
                        </h4>
                        <div className="grid gap-3">
                          {evaluation.suggestions.map((suggestion, idx) => (
                            <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-white border border-slate-100 shadow-sm">
                              <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                              <span className="text-sm text-slate-700 font-medium">{suggestion}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Ideal Answer */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Ideal Answer Recommendation</h4>
                        <div className="bg-gradient-to-br from-slate-50 to-white p-5 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-16 h-16 bg-slate-100 rounded-full -mr-8 -mt-8 opacity-50"></div>
                          <p className="text-sm text-slate-600 leading-relaxed italic relative z-10">
                            "{evaluation.idealAnswer}"
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Side - Webcam & Controls */}
              <div className="space-y-6 lg:sticky lg:top-8">
                <div className="bg-slate-100 rounded-2xl overflow-hidden relative aspect-[4/3] shadow-inner">
                  {isRecording ? (
                    <>
                      <video
                        ref={videoRef}
                        autoPlay
                        muted
                        playsInline
                        className="w-full h-full object-cover transform scale-x-[-1]"
                      />
                      <div className="absolute bottom-4 left-4 right-4 text-center">
                        <div className="inline-block px-4 py-2 bg-black/60 backdrop-blur-md text-white text-sm font-medium rounded-xl max-w-full transition-all">
                          {transcript ? (
                            <span className="animate-in fade-in">{transcript}</span>
                          ) : (
                            <span className="opacity-75 italic">Speak now... I'm listening 🎙️</span>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400">
                      <Video className="w-12 h-12 mb-3 opacity-20" />
                      <p className="text-sm font-medium">Camera Paused</p>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {!isRecording ? (
                    <button
                      onClick={() => {
                        // Auto-speak question when starting if not already spoken? 
                        // Actually, let's just start recording.
                        startRecording();
                      }}
                      disabled={isProcessing}
                      className="w-full py-4 bg-slate-900 hover:bg-black text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <div className="w-3 h-3 rounded-full bg-red-500"></div>}
                      {isProcessing ? 'Processing...' : 'Start Answer'}
                    </button>
                  ) : (
                    <button
                      onClick={stopRecording}
                      className="w-full py-4 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-900 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      <Square className="w-3 h-3 fill-current text-red-500" />
                      Stop Recording
                    </button>
                  )}

                  {evaluation && (
                    <button
                      onClick={nextQuestion}
                      className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      Next Question <ChevronDown className="w-4 h-4 -rotate-90" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MockInterview;
