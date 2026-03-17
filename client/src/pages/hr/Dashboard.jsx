import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import StatCard from '../../components/hr/dashboard/StatCard';
import ChartWidget from '../../components/hr/dashboard/ChartWidget';
import HeatmapWidget from '../../components/hr/dashboard/HeatmapWidget';
import CandidateTable from '../../components/hr/dashboard/CandidateTable';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { MessageSquare, ArrowRight } from 'lucide-react';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    candidates: { value: 0, trend: "0%", trendUp: true },
    hired: { value: 0, trend: "0%", trendUp: true },
    activeJobs: { value: 0, trend: "0%", trendUp: true },
    interviews: { value: 0, trend: "0%", trendUp: true }
  });

  const [trends, setTrends] = useState([]);
  const [recentApplications, setRecentApplications] = useState([]);
  const [feedbackSummary, setFeedbackSummary] = useState({ newCount: 0, total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, trendsRes, recentRes] = await Promise.all([
          api.get('/hr/stats'),
          api.get('/hr/stats/trends'),
          api.get('/hr/applications/recent')
        ]);

        // API now returns { candidates: { value, trend, trendUp }, ... }
        setStats({
          candidates: statsRes.data.candidates,
          hired: statsRes.data.hired,
          activeJobs: statsRes.data.activeJobs,
          interviews: statsRes.data.interviews,
          totalApplications: statsRes.data.raw?.totalApplicants || 0
        });

        setTrends(trendsRes.data);
        setRecentApplications(recentRes.data);

      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchFeedbackSummary = async () => {
      try {
        const res = await api.get('/feedback/all', { params: { status: 'New', limit: 1, page: 1 } });
        const allRes = await api.get('/feedback/all', { params: { limit: 1, page: 1 } });
        setFeedbackSummary({ newCount: res.data.total || 0, total: allRes.data.total || 0 });
      } catch {
        // non-critical — silently ignore
      }
    };
    fetchFeedbackSummary();
  }, []);

  if (loading) {
    return (
      <Layout role="hr">
        <div className="flex items-center justify-center h-[80vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout role="hr" fullWidth={true}>
      <div className="space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div onClick={() => navigate('/hr/candidates')} className="cursor-pointer transition-transform hover:scale-[1.02]">
            <StatCard
              title="Total Candidates"
              value={stats.candidates.value}
              trend={stats.candidates.trend}
              trendUp={stats.candidates.trendUp}
            />
          </div>
          <div onClick={() => navigate('/hr/candidates', { state: { filter: 'Hired' } })} className="cursor-pointer transition-transform hover:scale-[1.02]">
            <StatCard
              title="Hired Candidates"
              value={stats.hired.value}
              trend={stats.hired.trend}
              trendUp={stats.hired.trendUp}
            />
          </div>
          <div onClick={() => navigate('/hr/jobs')} className="cursor-pointer transition-transform hover:scale-[1.02]">
            <StatCard
              title="Active Jobs"
              value={stats.activeJobs.value}
              trend={stats.activeJobs.trend}
              trendUp={stats.activeJobs.trendUp}
            />
          </div>
          <div onClick={() => navigate('/hr/meetings')} className="cursor-pointer transition-transform hover:scale-[1.02]">
            <StatCard
              title="Interviews Scheduled"
              value={stats.interviews.value}
              trend={stats.interviews.trend}
              trendUp={stats.interviews.trendUp}
            />
          </div>
        </div>

        {/* Middle Section: Chart and Heatmap */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <ChartWidget data={trends} total={stats.totalApplications} />
          </div>
          <div className="lg:col-span-1">
            <HeatmapWidget />
          </div>
        </div>

        {/* Bottom Section: Candidate Table */}
        <div>
          <CandidateTable candidates={recentApplications} />
        </div>

        {/* Feedback Summary Card */}
        <div
          onClick={() => navigate('/hr/feedback')}
          className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 flex items-center justify-between cursor-pointer hover:border-emerald-300 hover:shadow-md transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <MessageSquare className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">User Feedback & Suggestions</h3>
              <p className="text-sm text-slate-500">
                {feedbackSummary.newCount > 0
                  ? <span><span className="font-semibold text-amber-600">{feedbackSummary.newCount} new</span> submission{feedbackSummary.newCount !== 1 ? 's' : ''} awaiting review</span>
                  : `${feedbackSummary.total} total submission${feedbackSummary.total !== 1 ? 's' : ''}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-emerald-600 font-semibold text-sm group-hover:gap-3 transition-all">
            View All <ArrowRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
