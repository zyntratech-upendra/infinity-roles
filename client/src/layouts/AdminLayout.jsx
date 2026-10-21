import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, 
  X, 
  LogOut, 
  Bell, 
  Search, 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  User, 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Shield,
  Briefcase,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InfinityLogo from '../components/InfinityLogo';

const AdminLayout = () => {
  // Mobile drawer open state
  const [mobileOpen, setMobileOpen] = useState(false);
  // Desktop collapsed (icon-only) state
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Supervisor Management', path: '/admin/supervisors', icon: <Users size={20} /> },
    { name: 'Consultant Management', path: '/admin/consultants', icon: <Briefcase size={20} /> },
    { name: 'Companies', path: '/admin/companies', icon: <Building2 size={20} /> },
    { name: 'Users Matrix', path: '/admin/users', icon: <Layers size={20} /> },
    { name: 'Settings', path: '/admin/settings', icon: <Settings size={20} /> },
  ];

  useEffect(() => {
    const fetchAdminProfile = async () => {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        navigate('/admin/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/admin/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setAdmin(data);
        } else {
          localStorage.removeItem('adminToken');
          navigate('/admin/login');
        }
      } catch (error) {
        console.error('Error fetching admin data', error);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  if (!admin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white font-medium">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-slate-400 font-semibold">Initializing Admin Console...</p>
        </div>
      </div>
    );
  }

  const initials = admin.email ? admin.email.substring(0, 2).toUpperCase() : 'AD';

  return (
    <div className="flex h-screen bg-slate-50/80 overflow-hidden font-sans relative">
      {/* Background Ambient Glows for glassmorphism */}
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-cyan-500/10 via-blue-500/10 to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Mobile Drawer Backdrop */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar (Desktop + Mobile Drawer) */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out
          bg-white/80 backdrop-blur-xl border-r border-slate-200/80 shadow-2xl lg:shadow-none
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'lg:w-20' : 'lg:w-72'}
          w-72
        `}
      >
        {/* Top Header Logo + Toggle Button */}
        <div className={`h-20 flex items-center border-b border-slate-100/80 transition-all ${
          isCollapsed ? 'justify-center px-2' : 'justify-between px-5'
        }`}>
          <Link to="/" className="flex items-center justify-center overflow-hidden">
            <InfinityLogo size={isCollapsed ? "sm" : "md"} variant="gradient" />
          </Link>

          {/* Desktop Toggle Button */}
          {!isCollapsed && (
            <button
              onClick={() => setIsCollapsed(true)}
              className="hidden lg:flex items-center justify-center w-8 h-8 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 transition-colors shadow-sm border border-slate-200"
              title="Collapse sidebar"
            >
              <ChevronLeft size={18} />
            </button>
          )}

          {/* Mobile Close Button */}
          <button 
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors ml-auto" 
            onClick={() => setMobileOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* User Card with Glassmorphism */}
        <div className={`p-3 border-b border-slate-100/80 transition-all ${isCollapsed ? 'flex justify-center px-1' : 'px-4'}`}>
          <div className={`relative group rounded-2xl bg-gradient-to-r from-indigo-50/60 via-purple-50/40 to-cyan-50/40 border border-indigo-100/60 flex items-center backdrop-blur-md shadow-sm overflow-hidden ${
            isCollapsed ? 'p-1.5 justify-center' : 'p-2.5 gap-3 w-full'
          }`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white font-extrabold text-xs shadow-md shadow-indigo-500/20 flex-shrink-0">
              {initials}
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden min-w-0 flex-1">
                <h3 className="font-bold text-slate-900 text-xs truncate leading-snug">{admin.email}</h3>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider">{admin.role || 'Main Admin'}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
              Main Menu
            </p>
          )}

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || (item.path !== '/admin/dashboard' && location.pathname.startsWith(item.path));
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  title={isCollapsed ? item.name : undefined}
                  className={`group relative flex items-center rounded-xl transition-all duration-200 ${
                    isCollapsed ? 'justify-center p-3' : 'px-3.5 py-2.5 gap-3'
                  } ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/25 font-bold' 
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900 font-semibold'
                  }`}
                >
                  <span className={`flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'
                  }`}>
                    {item.icon}
                  </span>
                  {!isCollapsed && (
                    <span className="text-xs flex-1 truncate tracking-tight">{item.name}</span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer Logout & Version */}
        <div className="p-3 border-t border-slate-100/80 bg-white/50 backdrop-blur-md flex items-center justify-between">
          {!isCollapsed ? (
            <>
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                <span className="font-bold text-[11px] text-slate-500">Infinity Roles v3.0</span>
              </div>
              <button 
                onClick={handleLogout} 
                className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <button 
              onClick={handleLogout} 
              className="w-full flex items-center justify-center p-2 rounded-lg text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors"
              title="Logout"
            >
              <LogOut size={18} />
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full min-w-0 overflow-hidden">
        
        {/* Topbar Glass Header */}
        <header className="h-20 bg-white/70 backdrop-blur-xl border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-30 sticky top-0 shadow-sm">
          <div className="flex items-center flex-1 gap-3">
            {/* Desktop Sidebar Toggle (Collapse / Open) */}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden lg:flex items-center justify-center p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-indigo-600 hover:border-indigo-200 hover:bg-indigo-50/50 shadow-sm transition-all"
              title={isCollapsed ? "Open sidebar" : "Collapse sidebar"}
            >
              <Menu size={20} />
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              className="lg:hidden p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 shadow-sm transition-colors"
              onClick={() => setMobileOpen(true)}
              aria-label="Open mobile menu"
            >
              <Menu size={22} />
            </button>

            {/* Global Search Bar */}
            <div className="hidden md:flex relative group w-full max-w-xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 w-4 h-4 transition-colors" />
              <input 
                type="text" 
                placeholder="Search supervisors, consultants, roles, or audit logs..." 
                className="w-full pl-11 pr-4 py-2.5 bg-slate-100/80 border border-slate-200/60 rounded-xl focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none text-xs font-medium text-slate-800 placeholder-slate-400"
              />
            </div>
          </div>
          
          <div className="flex items-center gap-3 sm:gap-5">
            {/* Live Status Pill */}
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-emerald-700 text-[11px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Platform Online</span>
            </div>

            {/* Notification Bell */}
            <button className="relative text-slate-500 hover:text-slate-900 transition-colors p-2.5 rounded-xl bg-slate-100/70 hover:bg-slate-200/70 border border-slate-200/60 shadow-sm">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gradient-to-r from-indigo-500 to-cyan-500 rounded-full animate-ping"></span>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 cursor-pointer bg-white py-1.5 pl-1.5 pr-3 rounded-full border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-500 flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {initials}
                </div>
                <div className="hidden sm:block text-left">
                  <p className="text-xs font-bold text-slate-800 truncate max-w-[120px]">{admin.email?.split('@')[0]}</p>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {dropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-slate-200/80 p-2 z-50 overflow-hidden"
                  >
                    <div className="px-3 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{admin.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                        {admin.role || 'Main Admin'}
                      </span>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <Link 
                        to="/admin/profile" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                      >
                        <User className="w-4 h-4 mr-2.5 text-slate-400" />
                        Account Profile
                      </Link>
                      <Link 
                        to="/admin/settings" 
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl transition-colors"
                      >
                        <Settings className="w-4 h-4 mr-2.5 text-slate-400" />
                        System Settings
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-slate-100">
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-2.5" />
                        Logout Session
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Page Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
