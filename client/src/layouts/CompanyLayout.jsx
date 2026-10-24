import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, LogOut, Bell, Search, LayoutDashboard, Users, Shield, 
  Building2, BadgePercent, ChevronDown, Copy, Check 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InfinityLogo from '../components/InfinityLogo';

const CompanyLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [company, setCompany] = useState(null);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/company/dashboard', icon: <LayoutDashboard size={19} /> },
    { name: 'Workforce Roster', path: '/company/workforce', icon: <Users size={19} /> },
    { name: 'Assigned Supervisors', path: '/company/supervisors', icon: <Shield size={19} /> },
    { name: 'Wage Scales & Particulars', path: '/company/wages', icon: <BadgePercent size={19} /> },
  ];

  useEffect(() => {
    const fetchCompanyProfile = async () => {
      const token = localStorage.getItem('companyToken');
      if (!token) {
        navigate('/company/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/company/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCompany(data);
          localStorage.setItem('companyInfo', JSON.stringify(data));
        } else {
          localStorage.removeItem('companyToken');
          localStorage.removeItem('companyInfo');
          navigate('/company/login');
        }
      } catch (error) {
        console.error('Error fetching company profile', error);
      }
    };

    fetchCompanyProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('companyToken');
    localStorage.removeItem('companyInfo');
    navigate('/company/login');
  };

  const copyCompanyCode = () => {
    if (company?.companyCode) {
      navigator.clipboard.writeText(company.companyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!company) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-medium">
        <div className="flex items-center gap-3">
          <div className="w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading Company Portal...</span>
        </div>
      </div>
    );
  }

  const initials = company.companyName ? company.companyName.substring(0, 2).toUpperCase() : 'CO';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white text-slate-800 flex flex-col transition-transform duration-300 ease-in-out border-r border-slate-200/80 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Brand Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-100">
          <Link to="/" className="flex items-center">
            <InfinityLogo size="sm" />
          </Link>
          <button 
            className="lg:hidden text-slate-400 hover:text-slate-800 p-1 rounded-lg" 
            onClick={() => setSidebarOpen(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Company Identity Block */}
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center space-x-3.5 mb-3">
            {company.logoUrl ? (
              <img 
                src={company.logoUrl} 
                alt={company.companyName} 
                className="w-12 h-12 rounded-xl object-contain bg-white border border-slate-200 p-1 shadow-xs" 
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-600 to-indigo-600 flex items-center justify-center text-white font-black text-base shadow-xs">
                {initials}
              </div>
            )}
            <div className="overflow-hidden min-w-0">
              <h3 className="font-extrabold text-slate-900 text-sm truncate">{company.companyName}</h3>
              <p className="text-[11px] text-slate-500 truncate">{company.industry || 'Client Organization'}</p>
            </div>
          </div>

          {/* Company Code Pill with Instant Copy */}
          <div className="flex items-center justify-between bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
            <div className="flex items-center gap-1.5 min-w-0">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Code:</span>
              <span className="text-xs font-mono font-extrabold text-indigo-700 truncate">{company.companyCode}</span>
            </div>
            <button 
              onClick={copyCompanyCode}
              title="Copy company code"
              className="p-1 text-slate-400 hover:text-indigo-600 rounded transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="flex-1 overflow-y-auto py-5 px-3">
          <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Company Management</p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all ${
                    isActive 
                      ? 'bg-indigo-50 text-indigo-700 font-bold border border-indigo-100 shadow-2xs' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <span className={`${isActive ? 'text-indigo-600' : 'text-slate-400'}`}>{item.icon}</span>
                  <span className="text-xs">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium bg-slate-50/40">
          <span className="text-[11px] font-semibold text-slate-500">The Infinity Roles • Company</span>
          <button 
            onClick={handleLogout} 
            className="text-rose-600 font-bold hover:text-rose-700 text-xs transition-colors flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Area */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-slate-200/80 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center flex-1">
            <button 
              className="lg:hidden text-slate-500 hover:text-slate-900 focus:outline-none mr-4 p-1.5 rounded-lg border border-slate-200"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={20} />
            </button>
            
            <div className="hidden md:flex items-center gap-3">
              <span className="px-2.5 py-1 rounded-md bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                Company Portal
              </span>
              <span className="text-slate-400 text-sm">•</span>
              <span className="text-sm font-semibold text-slate-700">{company.companyName}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <button 
              title="Notifications"
              className="relative text-slate-400 hover:text-slate-800 transition-colors p-2 rounded-xl hover:bg-slate-100 border border-slate-200/60"
            >
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-indigo-600 rounded-full"></span>
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-2.5 cursor-pointer bg-slate-50 py-1.5 px-3 rounded-full border border-slate-200 hover:bg-slate-100 transition-colors">
                <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                  {initials}
                </div>
                <span className="text-xs font-bold text-slate-700 hidden sm:inline-block max-w-[120px] truncate">
                  {company.companyName}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-60 bg-white rounded-2xl shadow-xl border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 p-2">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-extrabold text-slate-900 truncate">{company.companyName}</p>
                  <p className="text-[11px] text-slate-500 font-medium truncate">{company.email}</p>
                  <p className="text-[10px] font-mono text-indigo-600 font-bold mt-1">Code: {company.companyCode}</p>
                </div>
                <button 
                  onClick={handleLogout} 
                  className="w-full flex items-center px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors mt-1"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out of Company Portal
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content Outlet */}
        <main className="flex-1 overflow-y-auto bg-slate-50/60 p-4 sm:p-6 lg:p-8">
          <Outlet context={{ company, setCompany }} />
        </main>
      </div>
    </div>
  );
};

export default CompanyLayout;
