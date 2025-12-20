import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
    LogOut, LayoutDashboard, Users,
    Calendar, PenTool, Briefcase,
    Settings, CircleHelp, Bell, ChevronRight, Menu, X, Search, Mail, MessageSquare
} from 'lucide-react';
import { ROUTES } from '../../utils/constants';

const HRLayout = ({ children, fullWidth = true }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            // Handle HR Search
        }
    };

    const handleLogout = () => {
        logout();
        navigate(ROUTES.LOGIN);
    };

    const getPageTitle = () => {
        const path = location.pathname;
        if (path === ROUTES.HR_DASHBOARD) return 'Overview';
        if (path === ROUTES.HR_CANDIDATES) return 'Applications';
        if (path === ROUTES.HR_JOBS) return 'Job Listings';
        if (path === ROUTES.POST_JOB) return 'Post New Job';
        if (path.includes('/hr/jobs/edit/')) return 'Edit Job';
        if (path === ROUTES.HR_MEETINGS) return 'Interviews';
        if (path === ROUTES.HR_MCQ) return 'Assessments';

        // Fallback: capitalized last segment
        const lastSegment = path.split('/').pop();
        return lastSegment.charAt(0).toUpperCase() + lastSegment.slice(1);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900 selection:bg-emerald-600 selection:text-white">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] flex flex-col shadow-sm
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
                {/* Logo */}
                <div className="h-20 flex items-center px-8 border-b border-slate-50">
                    <Link to={ROUTES.HR_DASHBOARD} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-emerald-200 group-hover:scale-105 transition-transform duration-300">
                            <span className="font-bold text-lg tracking-tighter">S</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-lg font-bold text-slate-900 tracking-tight leading-none group-hover:text-emerald-700 transition-colors">SmartRecruit</span>
                            <span className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mt-0.5">Enterprise</span>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <div className="px-6 py-6 space-y-8 flex-1 overflow-y-auto custom-scrollbar">

                    {/* Section: Overview */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3 flex items-center gap-2">
                            platform
                        </span>
                        <Link
                            to={ROUTES.HR_DASHBOARD}
                            onClick={() => setIsSidebarOpen(false)}
                            className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${location.pathname === ROUTES.HR_DASHBOARD
                                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-[1.02]'
                                : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                                }`}
                        >
                            <LayoutDashboard className={`w-[18px] h-[18px] ${location.pathname === ROUTES.HR_DASHBOARD ? 'text-emerald-100' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                            Overview
                        </Link>
                    </div>

                    {/* Section: Recruitment */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3">Recruitment</span>
                        {[
                            { path: ROUTES.HR_CANDIDATES, label: 'Applications', icon: Users },
                            { path: ROUTES.HR_JOBS, label: 'Active Jobs', icon: Briefcase },
                            { path: ROUTES.POST_JOB, label: 'Post New Job', icon: PenTool },
                            { path: ROUTES.HR_MESSAGES, label: 'Messages', icon: Mail },
                        ].map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${location.pathname === item.path
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-[1.02]'
                                    : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                                    }`}
                            >
                                <item.icon className={`w-[18px] h-[18px] ${location.pathname === item.path ? 'text-emerald-100' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                    {/* Section: Management */}
                    <div className="space-y-2">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-3">Management</span>
                        {[
                            { path: ROUTES.HR_MEETINGS, label: 'Interviews', icon: Calendar },
                            { path: ROUTES.HR_MCQ, label: 'Assessments', icon: PenTool },
                        ].map((item) => (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all duration-300 group ${location.pathname === item.path
                                    ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200 scale-[1.02]'
                                    : 'text-slate-500 hover:bg-emerald-50 hover:text-emerald-700'
                                    }`}
                            >
                                <item.icon className={`w-[18px] h-[18px] ${location.pathname === item.path ? 'text-emerald-100' : 'text-slate-400 group-hover:text-emerald-600'}`} />
                                {item.label}
                            </Link>
                        ))}
                    </div>

                </div>

                {/* Bottom User Card */}
                <div className="p-6 border-t border-slate-100 bg-slate-50/50">
                    <div className="flex items-center justify-between">
                        <Link to={ROUTES.HR_SETTINGS} className="flex items-center gap-3 hover:bg-white p-2 -ml-2 rounded-lg transition-all group cursor-pointer">
                            <div className="w-10 h-10 rounded-full bg-white border border-slate-200 flex items-center justify-center text-emerald-700 font-bold shadow-sm group-hover:border-emerald-200 group-hover:text-emerald-600 transition-colors">
                                {user?.name?.charAt(0) || 'A'}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900 group-hover:text-emerald-700 transition-colors">{user?.name?.split(' ')[0] || 'Admin'}</span>
                                <span className="text-[10px] font-medium text-slate-500">Super Admin</span>
                            </div>
                        </Link>
                        <button onClick={handleLogout} className="p-2 rounded-lg hover:bg-white hover:text-red-500 text-slate-400 transition-all hover:shadow-sm">
                            <LogOut className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden bg-slate-50">
                {/* Header */}
                <header className="h-24 flex items-center justify-between px-8 shrink-0 bg-slate-50/80 backdrop-blur-xl z-10 sticky top-0">

                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            className="lg:hidden p-2 text-slate-500 hover:bg-white hover:shadow-sm rounded-xl transition-all"
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        >
                            <Menu className="w-6 h-6" />
                        </button>

                        <h1 className="text-xl font-bold text-slate-900 hidden md:block">
                            {getPageTitle()}
                        </h1>
                    </div>

                    {/* Search */}
                    <div className="flex-1 max-w-md mx-6">
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-4 w-4 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-11 pr-4 py-3 bg-white border border-slate-200/60 rounded-2xl text-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/10 focus:border-emerald-500/50 transition-all shadow-sm group-hover:shadow-md group-hover:border-emerald-200/60"
                                placeholder="Search candidates, jobs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleSearch}
                            />
                        </div>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <Link to={ROUTES.HR_MESSAGES} className="p-3 bg-white rounded-xl text-slate-400 hover:text-emerald-600 shadow-sm border border-slate-100 hover:border-emerald-200 hover:shadow-md hover:scale-105 transition-all relative group">
                            <Mail className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12" />
                            {/* Notification Pulse */}
                            <span className="absolute top-2.5 right-2.5 flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 border border-white"></span>
                            </span>
                        </Link>
                        <Link to={ROUTES.HR_SETTINGS} className="p-3 bg-white rounded-xl text-slate-400 hover:text-emerald-600 shadow-sm border border-slate-100 hover:border-emerald-200 hover:shadow-md transition-all">
                            <Settings className="w-5 h-5" />
                        </Link>
                    </div>
                </header>

                {/* Content */}
                <main className={`flex-1 px-8 pb-8 overflow-y-auto custom-scrollbar ${fullWidth ? '' : 'max-w-7xl mx-auto w-full'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default HRLayout;
