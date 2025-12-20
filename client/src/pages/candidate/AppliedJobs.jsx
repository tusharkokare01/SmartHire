import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, 
  ExternalLink, 
  Trash2, 
  Calendar, 
  Building2, 
  MapPin, 
  Briefcase, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Search
} from 'lucide-react';
import Layout from '../../components/common/Layout';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import api from '../../services/api';

const AppliedJobs = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id || user?._id) {
      fetchAppliedJobs();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchAppliedJobs = async () => {
    try {
      const userId = user?.id || user?._id;
      if (!userId) return;
      const response = await api.get(`/applications/candidate/${userId}`);
      setAppliedJobs(response.data);
    } catch (error) {
      console.error('Error fetching applied jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case 'Shortlisted': 
        return { 
          badge: 'bg-amber-100/50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800', 
          icon: CheckCircle2 
        };
      case 'Rejected': 
        return { 
          badge: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800', 
          icon: XCircle 
        };
      case 'Hired': 
        return { 
          badge: 'bg-emerald-100/50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800', 
          icon: Briefcase 
        };
      case 'In Review': 
        return { 
          badge: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800', 
          icon: Clock 
        };
      default: 
        return { 
          badge: 'bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400 border-stone-200 dark:border-stone-700', 
          icon: Clock 
        };
    }
  };

  const handleCancelApplication = async (applicationId) => {
    if (!window.confirm('Are you sure you want to cancel this application?')) return;
    try {
      await api.delete(`/applications/${applicationId}`);
      setAppliedJobs(prev => prev.filter(job => job._id !== applicationId));
    } catch (error) {
      console.error('Error cancelling application:', error);
    }
  };

  const filteredJobs = appliedJobs.filter(job => {
    const matchesTab = activeTab === 'All' || (job.status || 'Applied') === activeTab;
    const matchesSearch = job.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const TABS = ['All', 'Shortlisted', 'In Review', 'Hired', 'Rejected'];

  return (
    <Layout role="candidate" fullWidth={true}>
      <div className="bg-stone-50 dark:bg-[#1c1917] min-h-screen font-sans text-stone-900 dark:text-stone-100 flex flex-col items-center">
        
        {/* Main Content Area */}
        <div className="w-full max-w-[1280px] flex-1 flex flex-col gap-10 py-12 px-6 md:px-12 lg:px-24">
            
            {/* Header Section */}
            <div className="flex flex-col gap-8">
                <Link 
                  to={ROUTES.CANDIDATE_DASHBOARD}
                  className="self-start group flex items-center gap-3 text-stone-500 hover:text-emerald-600 transition-colors font-medium text-sm"
                >
                  <div className="p-2 rounded-full bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 group-hover:border-emerald-200 dark:group-hover:border-emerald-800 group-hover:text-emerald-600 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                  </div>
                  Back to Dashboard
                </Link>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-stone-200 dark:border-stone-800">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-stone-900 dark:text-white mb-4 tracking-tight">Applied Jobs</h1>
                        <p className="text-stone-500 dark:text-stone-400 text-lg max-w-2xl leading-relaxed">
                            Keep track of your career opportunities and application status.
                        </p>
                    </div>
                </div>
            </div>

            {/* Controls & Filters - Redesigned: Tabs Left, Compact Search Right */}
            <div className="flex flex-col gap-8">
              
              <div className="flex flex-col-reverse md:flex-row gap-4 md:items-center justify-between sticky top-[80px] z-30 bg-stone-50/95 dark:bg-[#1c1917]/95 backdrop-blur-sm py-4 -my-4 px-1 rounded-xl">
                  
                  {/* Tabs (Left Side) */}
                  <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 no-scrollbar p-1 rounded-xl">
                      {TABS.map(tab => {
                          const count = tab === 'All' 
                              ? appliedJobs.length 
                              : appliedJobs.filter(j => (j.status || 'Applied') === tab).length;
                          
                          const isActive = activeTab === tab;

                          return (
                              <button
                                  key={tab}
                                  onClick={() => setActiveTab(tab)}
                                  className={`
                                      px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center gap-2
                                      ${isActive 
                                          ? 'bg-stone-900 dark:bg-white text-white dark:text-stone-900 shadow-md transform scale-100' 
                                          : 'bg-white dark:bg-stone-800 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-stone-700 hover:border-emerald-200 dark:hover:border-emerald-800 hover:text-emerald-600'
                                      }
                                  `}
                              >
                                  {tab}
                                  {count > 0 && (
                                    <span className={`flex items-center justify-center min-w-[1.25rem] h-5 px-1.5 rounded-full text-[10px] ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'}`}>
                                        {count}
                                    </span>
                                  )}
                              </button>
                          );
                      })}
                  </div>

                  {/* Compact Search (Right Side) */}
                  <div className="relative w-full md:w-64 group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Search className="h-4 w-4 text-stone-400 group-focus-within:text-emerald-600 transition-colors" />
                      </div>
                      <input 
                          type="text" 
                          placeholder="Search..." 
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="block w-full pl-9 pr-4 py-2 bg-transparent border-b-2 border-stone-200 dark:border-stone-700 text-stone-900 dark:text-white text-sm font-medium focus:border-emerald-600 dark:focus:border-emerald-500 outline-none transition-all placeholder:text-stone-400"
                      />
                  </div>
              </div>

              {/* Applications List */}
              <div className="flex flex-col gap-6">
                  {loading ? (
                      <div className="py-32 flex flex-col items-center justify-center gap-4">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
                          <p className="text-stone-400 text-base font-medium animate-pulse">Loading applications...</p>
                      </div>
                  ) : filteredJobs.length === 0 ? (
                      <div className="text-center py-32 bg-white dark:bg-[#292524] rounded-3xl border border-stone-200 dark:border-stone-800 border-dashed hover:border-stone-300 transition-colors">
                          <div className="w-20 h-20 bg-stone-50 dark:bg-stone-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner">
                            <Briefcase className="w-10 h-10 text-stone-300" />
                          </div>
                          <h3 className="text-2xl font-bold text-stone-900 dark:text-white mb-2">No applications found</h3>
                          <p className="text-stone-500 dark:text-stone-400 text-base max-w-sm mx-auto mb-8 leading-relaxed">
                              {searchTerm ? `No matches found for "${searchTerm}"` : "Explore new opportunities and your applications will appear here."}
                          </p>
                          {activeTab === 'All' && !searchTerm && (
                             <Link to={ROUTES.JOB_SEARCH} className="inline-flex items-center gap-2 px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-base transition-colors shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 transform hover:-translate-y-1">
                                <Search className="w-5 h-5" />
                                Browse Jobs
                             </Link>
                          )}
                      </div>
                  ) : (
                      filteredJobs.map((job) => {
                          const statusConfig = getStatusConfig(job.status);
                          const StatusIcon = statusConfig.icon;

                          return (
                              <div key={job._id} className="group bg-white dark:bg-[#292524] rounded-2xl p-8 border border-stone-200 dark:border-stone-800 shadow-sm hover:shadow-xl hover:shadow-emerald-900/5 hover:border-emerald-500/30 hover:-translate-y-1 transition-all duration-300 relative">
                                  
                                  <div className="flex flex-col md:flex-row gap-8 items-start">
                                      
                                      {/* Logo */}
                                      <div className="w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-2xl bg-white dark:bg-stone-800 border border-stone-100 dark:border-stone-700 shadow-sm flex items-center justify-center p-4 group-hover:scale-105 transition-transform duration-300 aspect-square">
                                          <img 
                                              src={`https://ui-avatars.com/api/?name=${encodeURIComponent(job.company)}&background=random&color=fff&size=256&bold=true&font-size=0.4`} 
                                              alt={job.company} 
                                              className="w-full h-full object-contain rounded-xl"
                                          />
                                      </div>

                                      {/* Info */}
                                      <div className="flex-1 min-w-0 flex flex-col gap-3">
                                          <div className="flex flex-wrap items-start justify-between gap-4">
                                              <div className="space-y-1">
                                                  <h3 className="text-2xl font-bold text-stone-900 dark:text-white group-hover:text-emerald-600 transition-colors leading-tight">
                                                      {job.jobTitle}
                                                  </h3>
                                                  <div className="flex items-center gap-2 text-stone-500 dark:text-stone-400 font-medium text-base">
                                                      <Building2 className="w-5 h-5" />
                                                      {job.company}
                                                  </div>
                                              </div>
                                              
                                              <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold border shadow-sm ${statusConfig.badge}`}>
                                                  <StatusIcon className="w-4 h-4" />
                                                  {job.status || 'Applied'}
                                              </div>
                                          </div>
                                          
                                          <div className="mt-2 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm font-semibold text-stone-400 uppercase tracking-widest">
                                              <span className="flex items-center gap-2">
                                                  <MapPin className="w-4 h-4" />
                                                  {job.location}
                                              </span>
                                              <span className="flex items-center gap-2">
                                                  <Briefcase className="w-4 h-4" />
                                                  {job.type || 'Full-time'}
                                              </span>
                                              <span className="flex items-center gap-2">
                                                  <Calendar className="w-4 h-4" />
                                                  Applied {new Date(job.createdAt).toLocaleDateString()}
                                              </span>
                                          </div>
                                      </div>

                                      {/* Actions */}
                                      <div className="flex items-center gap-3 w-full md:w-auto mt-4 md:mt-0 pt-6 md:pt-0 border-t md:border-t-0 border-stone-100 dark:border-stone-800 md:pl-8 md:border-l md:border-dashed self-stretch md:self-center">
                                          <a 
                                              href={job.url || "#"} 
                                              target="_blank" 
                                              rel="noopener noreferrer"
                                              className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 md:p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 hover:scale-105 transition-all font-bold"
                                              title="View Job Details"
                                          >
                                              <span className="md:hidden mr-2">View Job</span>
                                              <ExternalLink className="w-5 h-5" />
                                          </a>
                                          
                                          <button 
                                              onClick={() => handleCancelApplication(job._id)}
                                              className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 md:p-4 rounded-xl bg-stone-50 dark:bg-stone-800 text-stone-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 hover:scale-105 transition-all font-bold"
                                              title="Withdraw Application"
                                          >
                                              <span className="md:hidden mr-2">Withdraw</span>
                                              <Trash2 className="w-5 h-5" />
                                          </button>
                                      </div>
                                  </div>
                              </div>
                          );
                      })
                  )}
              </div>
            </div>
        </div>
      </div>
    </Layout>
  );
};

export default AppliedJobs;
