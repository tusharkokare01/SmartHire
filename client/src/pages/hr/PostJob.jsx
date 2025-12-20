import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, MapPin, DollarSign, Building2, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const PostJob = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get ID from URL for edit mode
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(!!id); // Loading state for fetching initial data
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchJobDetails();
    }
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const response = await api.get(`/jobs/${id}`);
      const job = response.data;

      setFormData({
        title: job.title || '',
        company: job.company,
        location: job.location,
        type: job.type || 'Full-time',
        workMode: job.workMode || 'On-site',
        description: job.description,
        requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : job.requirements,
        salaryMin: job.salary?.min || '',
        salaryMax: job.salary?.max || ''
      });
    } catch (err) {
      console.error('Error fetching job:', err);
      setError('Failed to load job details.');
    } finally {
      setFetching(false);
    }
  };

  const [formData, setFormData] = useState({
    title: '',
    company: user?.company || '', // Pre-fill if available
    location: '',
    type: 'Full-time',
    workMode: 'On-site',
    description: '',
    requirements: '', // Will split by newline
    salaryMin: '',
    salaryMax: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Transform data for API
      const jobPayload = {
        title: formData.title,
        company: formData.company,
        location: formData.location,
        type: formData.type,
        workMode: formData.workMode,
        description: formData.description,
        requirements: formData.requirements.split('\n').filter(req => req.trim() !== ''),
        salary: {
          min: formData.salaryMin ? Number(formData.salaryMin) : undefined,
          max: formData.salaryMax ? Number(formData.salaryMax) : undefined
        },
        postedBy: user?._id || user?.id // Try both ID formats
      };

      if (id) {
        // Update existing job
        await api.put(`/jobs/${id}`, jobPayload);
      } else {
        // Create new job
        await api.post('/jobs', jobPayload);
      }
      navigate('/hr/jobs');
    } catch (err) {
      console.error('Error saving job:', err);
      // Show actual error from backend if available
      const backendMessage = err.response?.data?.message || err.response?.data?.error || err.message;
      setError(backendMessage || `Failed to ${id ? 'update' : 'post'} job. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout role="hr">
      <div className="max-w-5xl mx-auto space-y-8 pb-12 px-6">
        {fetching ? (
          <div className="flex justify-center py-20">
            <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/hr/jobs')}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-6 h-6 text-slate-500" />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-slate-900">
                  {id ? (formData.title ? `Edit Job: ${formData.title}` : 'Edit Job') : 'Post a New Job'}
                </h1>
                <p className="text-slate-500 mt-1">{id ? 'Update job details and requirements' : 'Create a job listing to attract top talent'}</p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-emerald-100/50">
              <div className="p-8 space-y-8">

                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                  </div>
                )}

                {/* Basic Info */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                    Job Details
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Job Title</label>
                      <input
                        type="text"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        placeholder="e.g. Senior React Developer"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:bg-white hover:shadow-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Company Name</label>
                      <div className="relative">
                        <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="company"
                          required
                          value={formData.company}
                          onChange={handleChange}
                          placeholder="Your Company"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:bg-white hover:shadow-sm"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Job Type</label>
                      <select
                        name="type"
                        value={formData.type}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer hover:bg-white hover:shadow-sm"
                      >
                        <option>Full-time</option>
                        <option>Part-time</option>
                        <option>Contract</option>
                        <option>Freelance</option>
                        <option>Internship</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Work Mode</label>
                      <select
                        name="workMode"
                        value={formData.workMode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all cursor-pointer hover:bg-white hover:shadow-sm"
                      >
                        <option>On-site</option>
                        <option>Remote</option>
                        <option>Hybrid</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Location</label>
                      <div className="relative">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          type="text"
                          name="location"
                          required
                          value={formData.location}
                          onChange={handleChange}
                          placeholder="e.g. New York, NY"
                          className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:bg-white hover:shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Salary */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <DollarSign className="w-5 h-5 text-emerald-600" />
                    Salary Range (Annual)
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Minimum</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                        <input
                          type="number"
                          name="salaryMin"
                          value={formData.salaryMin}
                          onChange={handleChange}
                          placeholder="50000"
                          className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:bg-white hover:shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Maximum</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">$</span>
                        <input
                          type="number"
                          name="salaryMax"
                          value={formData.salaryMax}
                          onChange={handleChange}
                          placeholder="80000"
                          className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:bg-white hover:shadow-sm"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                    <Briefcase className="w-5 h-5 text-emerald-600" />
                    Description & Requirements
                  </h2>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Job Description</label>
                    <textarea
                      name="description"
                      required
                      rows="6"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Describe the role, responsibilities, and company culture..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:bg-white hover:shadow-sm"
                    ></textarea>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Requirements (One per line)</label>
                    <textarea
                      name="requirements"
                      rows="6"
                      value={formData.requirements}
                      onChange={handleChange}
                      placeholder="• 3+ years of React experience&#10;• Knowledge of Node.js&#10;• Strong communication skills"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all hover:bg-white hover:shadow-sm font-mono text-sm leading-relaxed"
                    ></textarea>
                  </div>
                </div>

              </div>

              {/* Footer */}
              <div className="px-8 py-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/hr/jobs')}
                  className="px-6 py-3 font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg shadow-emerald-200 hover:shadow-emerald-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5" />
                      {id ? 'Update Job' : 'Post Job'}
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </Layout>
  );
};

export default PostJob;
