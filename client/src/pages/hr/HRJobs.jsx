import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Briefcase, MapPin, DollarSign, Clock, Search, Eye, Edit, Trash2,
  Users, Building2, Sparkles, Filter, ChevronDown, MoreHorizontal,
  TrendingUp, CheckCircle, XCircle, AlertCircle, Loader2, LayoutGrid, List as ListIcon, CalendarDays,
  Power, PowerOff
} from 'lucide-react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const HRJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All'); // All, Open, Closed, Draft
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

  // Modal States
  const [viewJob, setViewJob] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ isOpen: false, jobId: null, jobTitle: '' });
  const [statusModal, setStatusModal] = useState({ isOpen: false, jobId: null, currentStatus: '', jobTitle: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  const fetchJobs = async () => {
    if (!user) return; // Wait for user to be loaded

    try {
      setLoading(true);
      // Use the jobs route which has the dynamic applicant counting logic
      const userId = user._id || user.id;
      const response = await api.get(`/jobs/hr/${userId}`);
      setJobs(response.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.jobId) return;

    try {
      setIsDeleting(true);
      await api.delete(`/jobs/${deleteModal.jobId}`);
      // Remove from list
      setJobs(prev => prev.filter(j => j._id !== deleteModal.jobId));
      setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' });
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('Failed to delete job');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleStatusUpdate = (jobId, currentStatus, jobTitle = '') => {
    setStatusModal({
      isOpen: true,
      jobId,
      currentStatus,
      jobTitle: jobTitle || jobs.find(j => j._id === jobId)?.title || 'this job'
    });
  };

  const executeStatusUpdate = async () => {
    const { jobId, currentStatus } = statusModal;
    if (!jobId) return;

    const newStatus = currentStatus === 'Open' ? 'Closed' : 'Open';

    try {
      setIsUpdatingStatus(true);
      const response = await api.patch(`/jobs/${jobId}/status`, { status: newStatus });

      // Update local state
      setJobs(prev => prev.map(job =>
        job._id === jobId ? { ...job, status: newStatus } : job
      ));

      // Also update viewJob if it is open
      if (viewJob && viewJob._id === jobId) {
        setViewJob(prev => ({ ...prev, status: newStatus }));
      }

      setStatusModal({ isOpen: false, jobId: null, currentStatus: '', jobTitle: '' });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update job status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Derived Stats
  const stats = useMemo(() => {
    return {
      total: jobs.length,
      active: jobs.filter(j => j.status === 'Open').length,
      applicants: jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0),
      closed: jobs.filter(j => j.status === 'Closed').length
    };
  }, [jobs]);

  const filteredJobs = jobs.filter(job => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesTab = activeTab === 'All' || job.status === activeTab;

    return matchesSearch && matchesTab;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Closed': return 'bg-slate-50 text-slate-700 border-slate-200';
      case 'Draft': return 'bg-amber-50 text-amber-700 border-amber-200';
      default: return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <Layout role="hr" fullWidth={true}>
      <div className="min-h-screen bg-slate-50 p-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Job Listings</h1>
            <p className="text-slate-500 mt-1">Manage your opportunities and track active roles.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-white p-1 rounded-xl border border-slate-200 flex items-center shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="Grid View"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-50 text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                title="List View"
              >
                <ListIcon className="w-5 h-5" />
              </button>
            </div>
            <Link
              to="/hr/post-job"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              Post New Job
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Briefcase className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">Total Jobs</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.total}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <CheckCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">Active Now</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.active}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">Total Applicants</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.applicants}</div>
          </div>
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-slate-50 text-slate-600 rounded-lg">
                <XCircle className="w-5 h-5" />
              </div>
              <span className="text-sm font-medium text-slate-500">Closed</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{stats.closed}</div>
          </div>
        </div>

        {/* Filters & Tabs */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 mb-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['All', 'Open', 'Closed', 'Draft'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === tab
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-900'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-auto md:min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-transparent focus:bg-white focus:border-emerald-600 rounded-xl text-sm transition-all outline-none"
            />
          </div>
        </div>

        {/* Jobs List */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border-2 border-dashed border-slate-200">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Briefcase className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-500 mb-6">Create a new job post to get started.</p>
            <Link to="/hr/post-job" className="text-emerald-600 font-bold hover:underline">
              Post a Job
            </Link>
          </div>
        ) : viewMode === 'grid' ? (
          // GRID VIEW
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <div key={job._id} className="group bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-full -mr-16 -mt-16 opacity-0 group-hover:opacity-100 transition-opacity blur-2xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex justify-between items-start mb-4 relative">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition-colors">
                      {job.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5 text-sm text-slate-500">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[150px]">{job.company}</span>
                    </div>
                  </div>
                  <button className="p-1 hover:bg-slate-50 rounded-lg text-slate-400 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                {/* Status Badge */}
                <div className="mb-6 relative">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(job.status)}`}>
                    <div className={`w-1.5 h-1.5 rounded-full ${job.status === 'Open' ? 'bg-emerald-500' : 'bg-current'}`} />
                    {job.status}
                  </span>
                </div>

                {/* Job Details */}
                <div className="space-y-3 mb-6 flex-1 relative">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {job.location} ({job.workMode})
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                    {job.salary?.min ? `$${job.salary.min.toLocaleString()} - $${job.salary.max.toLocaleString()}` : 'Not specified'}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                    Posted {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto relative">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span className="text-slate-900 font-bold">{job.applicantsCount || 0}</span> Applicants
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setViewJob(job)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-emerald-600 hover:text-white text-slate-600 rounded-lg text-xs font-bold transition-all flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                    <button
                      onClick={() => handleStatusUpdate(job._id, job.status)}
                      className={`p-1.5 rounded-lg transition-all duration-300 ${job.status === 'Open'
                        ? 'text-emerald-600 bg-emerald-50 hover:bg-red-50 hover:text-red-600'
                        : 'text-slate-400 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600'
                        }`}
                      title={job.status === 'Open' ? 'Close Job' : 'Reopen Job'}
                    >
                      {job.status === 'Open' ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                    </button>
                    <Link
                      to={`/hr/jobs/edit/${job._id}`}
                      className="p-1.5 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg text-slate-400 transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => setDeleteModal({ isOpen: true, jobId: job._id, jobTitle: job.title })}
                      className="p-1.5 hover:bg-red-50 hover:text-red-600 rounded-lg text-slate-400 transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          // LIST VIEW (TABLE)
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-left">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Job Role</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Posted</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">Applicants</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredJobs.map((job) => (
                    <tr key={job._id} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{job.title}</div>
                        <div className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <Building2 className="w-3 h-3" /> {job.company}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="inline-flex items-center px-2 py-0.5 rounded border border-slate-200 bg-white text-xs font-medium text-slate-500">
                          {job.type}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-slate-400" />
                          {job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(job.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border ${getStatusColor(job.status)}`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${job.status === 'Open' ? 'bg-emerald-500' : 'bg-current'}`} />
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-slate-100 rounded-lg text-slate-600 text-xs font-bold">
                          <Users className="w-3.5 h-3.5" />
                          {job.applicantsCount || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewJob(job)}
                            className="p-1.5 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleStatusUpdate(job._id, job.status)}
                            className={`p-1.5 rounded-lg transition-all duration-300 ${job.status === 'Open'
                              ? 'text-emerald-600 bg-emerald-50 hover:bg-red-50 hover:text-red-600'
                              : 'text-slate-400 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-600'
                              }`}
                            title={job.status === 'Open' ? 'Close Job' : 'Reopen Job'}
                          >
                            {job.status === 'Open' ? <Power className="w-4 h-4" /> : <PowerOff className="w-4 h-4" />}
                          </button>
                          <Link
                            to={`/hr/jobs/edit/${job._id}`}
                            className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => setDeleteModal({ isOpen: true, jobId: job._id, jobTitle: job.title })}
                            className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* View Job Modal */}
        {viewJob && (
          <div className="fixed inset-0 bg-slate-900/40 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl max-w-2xl w-full shadow-xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col relative outline-none">

              {/* Header */}
              <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-start bg-white sticky top-0 z-10">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="text-2xl font-bold text-slate-900 tracking-tight">{viewJob.title}</h2>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(viewJob.status)}`}>
                      {viewJob.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-500 text-sm font-medium">
                    <Building2 className="w-4 h-4" />
                    {viewJob.company}
                  </div>
                </div>
                <button
                  onClick={() => setViewJob(null)}
                  className="p-2 hover:bg-slate-50 rounded-lg text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="overflow-y-auto custom-scrollbar flex-1 p-8 space-y-8">

                {/* Info Cards - Minimalist */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <MapPin className="w-3.5 h-3.5" />
                      Location
                    </div>
                    <div className="font-semibold text-slate-900">
                      {viewJob.location} <span className="text-slate-400 font-normal">({viewJob.workMode})</span>
                    </div>
                  </div>
                  <div className="p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-2 mb-1 text-slate-400 text-xs font-bold uppercase tracking-wider">
                      <DollarSign className="w-3.5 h-3.5" />
                      Salary
                    </div>
                    <div className="font-semibold text-slate-900">
                      {viewJob.salary ? `$${viewJob.salary.min.toLocaleString()} - $${viewJob.salary.max.toLocaleString()}` : 'Not Specified'}
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-6">
                  <div className="prose prose-sm max-w-none prose-slate">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Briefcase className="w-5 h-5 text-slate-400" />
                      About the Role
                    </h3>
                    <div className="text-slate-600 leading-relaxed whitespace-pre-wrap pl-7">
                      {viewJob.description}
                    </div>
                  </div>

                  <div className="prose prose-sm max-w-none prose-slate">
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-slate-400" />
                      Requirements
                    </h3>
                    <ul className="space-y-2 pl-2">
                      {Array.isArray(viewJob.requirements) ? viewJob.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-3 text-slate-600">
                          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0" />
                          <span className="leading-relaxed">{req}</span>
                        </li>
                      )) : (
                        <p className="text-slate-600 whitespace-pre-wrap pl-7">{viewJob.requirements}</p>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="px-8 py-5 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3 z-10">
                <Link
                  to={`/hr/jobs/edit/${viewJob._id}`}
                  className="px-4 py-2 bg-white text-slate-700 font-bold rounded-lg hover:bg-slate-50 border border-slate-200 transition-all shadow-sm flex items-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>

                {viewJob.status === 'Open' ? (
                  <button
                    onClick={() => handleStatusUpdate(viewJob._id, 'Open')}
                    className="px-4 py-2 bg-white text-amber-600 font-bold rounded-lg hover:bg-amber-50 border border-slate-200 hover:border-amber-200 transition-all shadow-sm flex items-center gap-2"
                  >
                    <Power className="w-4 h-4" />
                    Close Job
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusUpdate(viewJob._id, 'Closed')}
                    className="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 hover:shadow-emerald-200 transition-all shadow-md flex items-center gap-2"
                  >
                    <Power className="w-4 h-4" />
                    Reopen Job
                  </button>
                )}

                <button
                  onClick={() => setViewJob(null)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Done
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Delete Modal */}
        {deleteModal.isOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 transform transition-all scale-100">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 ring-8 ring-red-50/50">
                  <Trash2 className="w-8 h-8 text-red-500" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Delete Job Listing?</h3>
                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  Are you sure you want to delete <span className="font-bold text-slate-900">"{deleteModal.jobTitle}"</span>? This action handles data permanently and cannot be undone.
                </p>
                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setDeleteModal({ isOpen: false, jobId: null, jobTitle: '' })}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    disabled={isDeleting}
                    className="flex-1 px-4 py-3 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                  >
                    {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Delete'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Status Update Modal */}
        {statusModal.isOpen && (
          <div className="fixed inset-0 bg-slate-900/60 z-[60] flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 transform transition-all scale-100">
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-6 ring-8 ${statusModal.currentStatus === 'Open' ? 'bg-amber-50 ring-amber-50/50' : 'bg-emerald-50 ring-emerald-50/50'
                  }`}>
                  {statusModal.currentStatus === 'Open' ? (
                    <PowerOff className="w-8 h-8 text-amber-500" />
                  ) : (
                    <Power className="w-8 h-8 text-emerald-500" />
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {statusModal.currentStatus === 'Open' ? 'Close Job Posting?' : 'Reopen Job Posting?'}
                </h3>

                <p className="text-slate-500 text-sm mb-8 leading-relaxed">
                  {statusModal.currentStatus === 'Open'
                    ? <span>Are you sure you want to close <span className="font-bold text-slate-900">"{statusModal.jobTitle}"</span>? It will be hidden from candidates but kept in your records.</span>
                    : <span>Are you sure you want to reopen <span className="font-bold text-slate-900">"{statusModal.jobTitle}"</span>? It will become visible to candidates again.</span>
                  }
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setStatusModal({ isOpen: false, jobId: null, currentStatus: '', jobTitle: '' })}
                    className="flex-1 px-4 py-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={executeStatusUpdate}
                    disabled={isUpdatingStatus}
                    className={`flex-1 px-4 py-3 font-bold rounded-xl text-white shadow-lg flex items-center justify-center gap-2 transition-colors ${statusModal.currentStatus === 'Open'
                      ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'
                      : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'
                      }`}
                  >
                    {isUpdatingStatus ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      statusModal.currentStatus === 'Open' ? 'Close Job' : 'Reopen Job'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default HRJobs;
