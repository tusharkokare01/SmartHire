import { useState, useEffect } from 'react';
import { Calendar, Clock, Video, MapPin, ExternalLink, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { ROUTES } from '../../../utils/constants';

const HeatmapWidget = () => {
  const navigate = useNavigate();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await api.get('/hr/interviews');
        // Filter upcoming only and sort
        const upcoming = res.data
          .filter(m => new Date(m.scheduledAt) > new Date() && m.status !== 'Cancelled')
          .sort((a, b) => new Date(a.scheduledAt) - new Date(b.scheduledAt))
          .slice(0, 5); // Show top 5
        setInterviews(upcoming);
      } catch (err) {
        console.error("Failed to fetch interviews", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-slate-900 font-bold text-lg">Interview Schedule</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Upcoming meetings</p>
        </div>
        <button
          onClick={() => navigate(ROUTES.HR_MEETINGS)}
          className="text-xs font-bold text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1"
        >
          View All <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {loading ? (
          <div className="h-full flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          </div>
        ) : interviews.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 py-8">
            <Calendar className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-medium">No upcoming interviews</p>
          </div>
        ) : (
          <div className="space-y-3">
            {interviews.map((interview) => (
              <div key={interview._id} className="group flex items-center gap-4 p-3 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-md transition-all">
                {/* Time Box */}
                <div className="flex flex-col items-center justify-center min-w-[3.5rem] bg-white rounded-lg border border-slate-200 p-2 group-hover:border-emerald-100">
                  <span className="text-xs font-bold text-slate-400 uppercase leading-none mb-1">
                    {new Date(interview.scheduledAt).toLocaleDateString(undefined, { weekday: 'short' })}
                  </span>
                  <span className="text-sm font-bold text-slate-900 leading-none">
                    {new Date(interview.scheduledAt).getDate()}
                  </span>
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="text-sm font-bold text-slate-900 truncate pr-2">{interview.candidateId?.name || 'Candidate'}</h4>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                      {new Date(interview.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 truncate mb-1">{interview.jobRole}</div>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                      {interview.platform === 'In-Person' ? <MapPin className="w-3 h-3" /> : <Video className="w-3 h-3" />}
                      {interview.platform}
                    </div>
                  </div>
                </div>

                {/* Join Action */}
                {interview.meetingLink && interview.platform !== 'In-Person' && (
                  <a
                    href={interview.meetingLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                    title="Join Meeting"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default HeatmapWidget;
