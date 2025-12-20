import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../../components/common/Layout';
import StatCard from '../../components/hr/dashboard/StatCard';
import ChartWidget from '../../components/hr/dashboard/ChartWidget';
import HeatmapWidget from '../../components/hr/dashboard/HeatmapWidget';
import CandidateTable from '../../components/hr/dashboard/CandidateTable';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

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
      </div>
    </Layout>
  );
};

export default Dashboard;
