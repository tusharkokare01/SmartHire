import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Search,
  Users,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronRight,
  CircleHelp,
  TrendingUp,
  Calendar,
  PenTool,
  Crown,
  Mail,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';
import HRLayout from './HRLayout'; // Import the new separated layout

const Layout = ({ children, role = 'candidate', fullWidth = false }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  // --- SEPARATION LOGIC ---
  if (role === 'hr') {
    return <HRLayout>{children}</HRLayout>;
  }
  // ------------------------

  // Scroll Listener for Header Effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Page Title Helper
  const getPageTitle = () => {
    const path = location.pathname.split('/').pop();
    if (!path || path === 'dashboard') return 'Dashboard';
    return path.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`${ROUTES.JOB_SEARCH}?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const navItems = [
    { path: ROUTES.CANDIDATE_DASHBOARD, label: 'Dashboard', icon: LayoutDashboard },
    { path: ROUTES.RESUME_BUILDER, label: 'Resume Builder', icon: FileText },
    { path: ROUTES.JOB_SEARCH, label: 'Find Jobs', icon: Search },
    { path: ROUTES.MOCK_INTERVIEW, label: 'Mock Interview', icon: Users },
    { path: ROUTES.CANDIDATE_INTERVIEWS, label: 'Interviews', icon: Calendar },
    { path: ROUTES.SETTINGS, label: 'Settings', icon: PenTool },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-200">

      {/* Top Navigation Header - Dynamic Scroll */}
      <header className={`fixed top-0 inset-x-0 z-50 px-4 md:px-6 transition-all duration-150 ease-out ${scrolled
        ? 'pt-4 pb-4 bg-white border-b border-slate-200'
        : 'pt-6'
        }`}>
        <div
          className={`mx-auto max-w-7xl rounded-2xl px-4 h-16 flex items-center justify-between transition-all duration-200 ease-out ${scrolled
            ? 'bg-white/80 backdrop-blur-xl border border-white/40 shadow-sm'
            : 'bg-transparent border-transparent shadow-none'
            }`}
        >

          {/* Logo */}
          <Link to={ROUTES.CANDIDATE_DASHBOARD} className="flex items-center gap-2 group">
            <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold shadow-lg transition-all duration-300 ${scrolled ? 'bg-emerald-600 text-white shadow-emerald-500/30' : 'bg-emerald-600/90 text-white shadow-none'
              }`}>
              S
            </div>
            <span className={`font-bold text-lg tracking-tight hidden sm:block transition-colors ${scrolled ? 'text-slate-900' : 'text-slate-800'}`}>Smart Career hub</span>
          </Link>

          {/* Center Navigation Pills - Desktop */}
          <nav className={`hidden lg:flex items-center gap-1 p-1 rounded-xl border transition-all duration-300 ${scrolled ? 'bg-slate-100/50 border-slate-200/50' : 'bg-white/50 border-white/50 shadow-sm'
            }`}>
            {navItems.map((item, index) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={`${item.path}-${index}`}
                  to={item.path}
                  className={`relative px-4 py-1.5 rounded-lg text-sm font-semibold transition-all duration-200 ${isActive
                    ? 'text-emerald-700 bg-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                    }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search Trigger (Mobile/Compact) */}
            <button className="lg:hidden p-2 text-slate-500 hover:bg-slate-100 rounded-full">
              <Search className="h-4 w-4" />
            </button>

            {/* Desktop Search */}
            <div className={`hidden md:flex items-center border rounded-full px-3 py-1.5 w-64 focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all ${scrolled ? 'bg-slate-50 border-slate-100' : 'bg-white/80 border-white shadow-sm'
              }`}>
              <Search className="h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                placeholder="Search..."
                className="bg-transparent border-none outline-none text-sm w-full ml-2 placeholder:text-slate-400 text-slate-700"
              />
            </div>

            <div className="h-6 w-px bg-slate-200 hidden sm:block opacity-50"></div>

            <div className="relative group">
              <Link
                to={ROUTES.MESSAGES}
                className={`relative p-2.5 rounded-full transition-all duration-300 hidden sm:flex items-center justify-center ${scrolled
                  ? 'text-slate-500 hover:text-emerald-600 hover:bg-emerald-50/80 hover:shadow-sm hover:scale-105'
                  : 'text-slate-600 hover:text-emerald-600 hover:bg-white/80 hover:shadow-sm hover:scale-105 backdrop-blur-sm'
                  }`}>
                <Mail className="h-5 w-5 transition-transform duration-300 group-hover:-rotate-12" />
                
                {/* Notification Pulse */}
                <span className="absolute top-2 right-2 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500 border border-white"></span>
                </span>
              </Link>
            </div>

            {/* User Profile */}
            <div className="relative group">
              <button className="flex items-center gap-2 pl-1 pr-1 py-1 rounded-full hover:bg-slate-100/50 transition-all border border-transparent hover:border-slate-200/50">
                <div className="relative">
                  <div className="h-8 w-8 rounded-full bg-slate-200 border border-white shadow-sm flex items-center justify-center text-xs font-bold text-slate-600">
                    {user?.name?.charAt(0) || 'U'}
                  </div>
                  {user?.subscriptionStatus === 'active' && (
                    <div className="absolute -top-1 -right-1 h-4 w-4 bg-amber-400 rounded-full border-2 border-white flex items-center justify-center" title="Pro Member">
                      <Crown className="h-2 w-2 text-white fill-current" />
                    </div>
                  )}
                </div>
                <ChevronRight className="h-3 w-3 text-slate-400 hidden sm:block" />
              </button>

              {/* Dropdown Menu */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-xl border border-slate-100 p-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all transform origin-top-right">
                <div className="px-3 py-2 border-b border-slate-50 mb-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{user?.name || 'User Name'}</p>
                    {user?.subscriptionStatus === 'active' && (
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-gradient-to-r from-amber-200 to-yellow-400 text-amber-900 border border-amber-200/50 shadow-sm flex items-center gap-1">
                        <Crown className="h-3 w-3" /> PRO
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{user?.email || 'user@example.com'}</p>
                </div>
                <Link to={ROUTES.SETTINGS} className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">
                  <PenTool className="h-4 w-4" /> Settings
                </Link>
                <button onClick={logout} className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg">
                  <LogOut className="h-4 w-4" /> Sign Out
                </button>
              </div>
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Dropdown */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-4 right-4 mt-2 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 lg:hidden animate-fade-in-up origin-top">
            <nav className="flex flex-col gap-1">
              {navItems.map((item, index) => {
                const isActive = location.pathname === item.path;
                return (
                  <Link
                    key={`${item.path}-${index}`}
                    to={item.path}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        )}
      </header>

      {/* Main Content Area */}
      <main className="pt-24 pb-8 px-4 md:px-6 max-w-7xl mx-auto min-h-[calc(100vh-1rem)] animate-fade-in-up">
        {children}
      </main>

    </div>
  );
};

export default Layout;

