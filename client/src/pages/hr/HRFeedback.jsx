import { useState, useEffect, useCallback } from 'react';
import Layout from '../../components/common/Layout';
import api from '../../services/api';
import {
  MessageSquare, Search, RefreshCw, ChevronLeft, ChevronRight,
  Star, AlertCircle, CheckCircle2, Clock, Filter
} from 'lucide-react';

const TYPE_OPTIONS = ['All', 'General Feedback', 'Suggestion', 'Feature Request', 'Bug Report'];
const STATUS_OPTIONS = ['All', 'New', 'Reviewed'];
const PAGE_LIMIT = 15;

const typeBadge = (type) => {
  const map = {
    'Bug Report':       'bg-red-100 text-red-700',
    'Feature Request':  'bg-purple-100 text-purple-700',
    'Suggestion':       'bg-blue-100 text-blue-700',
    'General Feedback': 'bg-slate-100 text-slate-600',
  };
  return map[type] || 'bg-slate-100 text-slate-600';
};

const StatusSelect = ({ status, isUpdating, onChange }) => {
  const isReviewed = status === 'Reviewed';
  
  return (
    <div className="relative inline-flex items-center">
      <select
        value={status}
        disabled={isUpdating}
        onChange={(e) => onChange(e.target.value)}
        className={`appearance-none pl-7 pr-8 py-1.5 rounded-full text-xs font-bold cursor-pointer outline-none focus:ring-2 focus:ring-offset-1 transition-all border
          ${isReviewed 
            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200 focus:ring-emerald-500' 
            : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border-amber-200 focus:ring-amber-500'
          }
          ${isUpdating ? 'opacity-50 cursor-wait' : ''}
        `}
      >
        <option value="New" className="bg-white text-slate-700 font-medium">New</option>
        <option value="Reviewed" className="bg-white text-slate-700 font-medium">Reviewed</option>
      </select>
      
      <div className="absolute left-2.5 pointer-events-none flex items-center justify-center">
        {isReviewed ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
        ) : (
          <Clock className="w-3.5 h-3.5 text-amber-600" />
        )}
      </div>
      <div className="absolute right-2.5 pointer-events-none flex items-center justify-center">
        <svg className={`w-3.5 h-3.5 ${isReviewed ? 'text-emerald-600' : 'text-amber-600'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
};

const StarRating = ({ rating }) => {
  if (!rating) return <span className="text-slate-400 text-xs">—</span>;
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          className={`w-3.5 h-3.5 ${n <= rating ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200'}`}
        />
      ))}
    </span>
  );
};

const HRFeedback = () => {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);

  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [filterType, setFilterType] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);

  const [summary, setSummary] = useState({ total: 0, newCount: 0, reviewedCount: 0 });

  const fetchFeedback = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const params = {
        limit: PAGE_LIMIT,
        page,
        ...(filterStatus !== 'All' && { status: filterStatus }),
        ...(filterType !== 'All' && { type: filterType }),
        ...(search.trim() && { search: search.trim() }),
      };

      const [res, summaryNew, summaryReviewed] = await Promise.all([
        api.get('/feedback/all', { params }),
        api.get('/feedback/all', { params: { status: 'New', limit: 1, page: 1 } }),
        api.get('/feedback/all', { params: { status: 'Reviewed', limit: 1, page: 1 } }),
      ]);

      setRows(Array.isArray(res.data.items) ? res.data.items : []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
      setSummary({
        total: (summaryNew.data.total || 0) + (summaryReviewed.data.total || 0),
        newCount: summaryNew.data.total || 0,
        reviewedCount: summaryReviewed.data.total || 0,
      });
    } catch (err) {
      console.error('Failed to fetch feedback:', err);
      setError('Failed to load feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, filterType, search]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setPage(1);
  }, [filterStatus, filterType, search]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);
      const res = await api.patch(`/feedback/${id}/status`, { status });
      setRows((prev) => prev.map((r) => (r._id === id ? res.data : r)));
      setSummary((prev) => {
        const row = rows.find((r) => r._id === id);
        if (!row || row.status === status) return prev;
        const delta = status === 'Reviewed' ? 1 : -1;
        return {
          ...prev,
          newCount: prev.newCount - delta,
          reviewedCount: prev.reviewedCount + delta,
        };
      });
    } catch {
      alert('Failed to update status. Please try again.');
    } finally {
      setUpdatingId(null);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setFilterType('All');
    setFilterStatus('All');
    setPage(1);
  };

  const hasFilters = search || filterType !== 'All' || filterStatus !== 'All';

  return (
    <Layout role="hr" fullWidth>
      <div className="space-y-6">

        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-200">
              <MessageSquare className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">User Feedback</h1>
              <p className="text-sm text-slate-500">Review and manage feedback & suggestions from users</p>
            </div>
          </div>
          <button
            onClick={fetchFeedback}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Submissions</p>
            <p className="text-3xl font-bold text-slate-900">{summary.total}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Awaiting Review</p>
            <p className="text-3xl font-bold text-slate-900">{summary.newCount}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 shadow-sm">
            <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Reviewed</p>
            <p className="text-3xl font-bold text-emerald-700">{summary.reviewedCount}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-4">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search */}
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search subject or message..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2.5 bg-emerald-600 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors"
              >
                Search
              </button>
            </form>

            {/* Type Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-slate-400 shrink-0" />
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {TYPE_OPTIONS.map((t) => <option key={t}>{t}</option>)}
              </select>
            </div>

            {/* Status Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {STATUS_OPTIONS.map((s) => <option key={s}>{s}</option>)}
            </select>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-slate-500 hover:text-red-500 font-medium px-2 transition-colors whitespace-nowrap"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Table Header Info */}
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              {loading ? 'Loading…' : `${total} result${total !== 1 ? 's' : ''}${hasFilters ? ' (filtered)' : ''}`}
            </p>
            {totalPages > 1 && (
              <p className="text-sm text-slate-400">
                Page {page} of {totalPages}
              </p>
            )}
          </div>

          {/* Error */}
          {error && (
            <div className="p-6 flex items-center gap-3 text-red-600 bg-red-50">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span className="text-sm font-medium">{error}</span>
              <button onClick={fetchFeedback} className="ml-auto text-sm underline font-semibold">Retry</button>
            </div>
          )}

          {/* Loading skeleton */}
          {loading && !error && (
            <div className="divide-y divide-slate-100">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="px-6 py-4 animate-pulse flex gap-4">
                  <div className="w-24 h-4 bg-slate-100 rounded" />
                  <div className="w-32 h-4 bg-slate-100 rounded" />
                  <div className="flex-1 h-4 bg-slate-100 rounded" />
                  <div className="w-16 h-4 bg-slate-100 rounded" />
                </div>
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && !error && rows.length === 0 && (
            <div className="p-16 text-center">
              <MessageSquare className="w-12 h-12 text-slate-200 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No feedback found</p>
              {hasFilters && (
                <button onClick={clearFilters} className="mt-2 text-sm text-emerald-600 hover:underline font-semibold">
                  Clear filters
                </button>
              )}
            </div>
          )}

          {/* Data Table */}
          {!loading && !error && rows.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Type</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Subject / Message</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Rating</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rows.map((row) => {
                    const isExpanded = expandedId === row._id;
                    return (
                      <tr key={row._id} className="hover:bg-slate-50/50 transition-colors align-top">
                        {/* User */}
                        <td className="px-5 py-4 w-44">
                          <div className="font-semibold text-slate-900 truncate">{row.userId?.name || 'Unknown'}</div>
                          <div className="text-xs text-slate-500 truncate max-w-[160px]">{row.userId?.email || '—'}</div>
                          <span className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${row.role === 'hr' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                            {row.role}
                          </span>
                        </td>

                        {/* Type */}
                        <td className="px-5 py-4 w-36">
                          <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${typeBadge(row.type)}`}>
                            {row.type}
                          </span>
                        </td>

                        {/* Subject + Message */}
                        <td className="px-5 py-4 max-w-sm">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : row._id)}
                            className="text-left w-full group"
                          >
                            <div className="font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors">
                              {row.subject}
                            </div>
                            <div className={`text-xs text-slate-500 mt-0.5 ${isExpanded ? '' : 'line-clamp-2'}`}>
                              {row.message}
                            </div>
                            <span className="text-[11px] text-emerald-600 font-medium group-hover:underline">
                              {isExpanded ? 'Show less' : 'Show more'}
                            </span>
                          </button>
                        </td>

                        {/* Rating */}
                        <td className="px-5 py-4 w-28">
                          <StarRating rating={row.rating} />
                        </td>

                        {/* Date */}
                        <td className="px-5 py-4 w-36 text-xs text-slate-500 whitespace-nowrap">
                          {new Date(row.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric', month: 'short', day: 'numeric'
                          })}
                          <div className="text-slate-400">
                            {new Date(row.createdAt).toLocaleTimeString(undefined, {
                              hour: '2-digit', minute: '2-digit'
                            })}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="px-5 py-4 w-40">
                          <StatusSelect
                            status={row.status}
                            isUpdating={updatingId === row._id}
                            onChange={(newValue) => updateStatus(row._id, newValue)}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {!loading && !error && totalPages > 1 && (
            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" /> Previous
              </button>

              <div className="flex items-center gap-1.5">
                {[...Array(Math.min(totalPages, 7))].map((_, i) => {
                  let p;
                  if (totalPages <= 7) {
                    p = i + 1;
                  } else if (page <= 4) {
                    p = i + 1;
                  } else if (page >= totalPages - 3) {
                    p = totalPages - 6 + i;
                  } else {
                    p = page - 3 + i;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-xl text-sm font-semibold transition-all ${p === page
                        ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-200'
                        : 'text-slate-600 hover:bg-slate-100'
                        }`}
                    >
                      {p}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Next <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default HRFeedback;
