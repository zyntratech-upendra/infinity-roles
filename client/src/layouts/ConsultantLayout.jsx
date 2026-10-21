import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, Bell, Search, LayoutDashboard, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import InfinityLogo from '../components/InfinityLogo';

const ConsultantLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [consultant, setConsultant] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { name: 'Dashboard', path: '/consultant/dashboard', icon: <LayoutDashboard size={20} /> },
  ];

  useEffect(() => {
    const fetchConsultantProfile = async () => {
      const token = localStorage.getItem('consultantToken');
      if (!token) {
        navigate('/consultant/login');
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/consultant/me`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setConsultant(data);
        } else {
          localStorage.removeItem('consultantToken');
          navigate('/consultant/login');
        }
      } catch (error) {
        console.error('Error fetching consultant data', error);
      }
    };

    fetchConsultantProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('consultantToken');
    navigate('/consultant/login');
  };

  if (!consultant) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-50 text-gray-500 font-medium">Loading...</div>;
  }

  // Generate initials
  const initials = consultant.name ? consultant.name.substring(0, 2).toUpperCase() : 'CO';

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white text-gray-800 flex flex-col transition-transform duration-300 ease-in-out border-r border-gray-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="h-20 flex items-center px-6 border-b border-gray-100 relative">
          <Link to="/" className="flex items-center">
            <InfinityLogo size="sm" />
          </Link>
          <button className="lg:hidden absolute right-4 text-gray-400 hover:text-gray-800" onClick={() => setSidebarOpen(false)}>
            <X size={24} />
          </button>
        </div>

        {/* User Profile Block */}
        <div className="p-6 border-b border-gray-100 flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-700 flex items-center justify-center text-white font-bold text-lg shadow-sm">
            {initials}
          </div>
          <div className="overflow-hidden">
            <h3 className="font-bold text-gray-900 text-sm truncate">{consultant.name}</h3>
            <p className="text-xs text-indigo-600 font-bold">{consultant.role}</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6">
          <p className="px-8 text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Main Menu</p>
          <nav className="space-y-1">
            {menuItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center space-x-4 px-8 py-3 transition-all ${
                    isActive 
                    ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 font-bold' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-l-4 border-transparent font-medium'
                  }`}
                >
                  <span className={`${isActive ? 'text-indigo-600' : 'text-gray-400'}`}>{item.icon}</span>
                  <span className="text-sm">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500 font-medium">
          <span className="font-semibold text-slate-600">Infinity Roles • Consultant</span>
          <button onClick={handleLogout} className="text-red-500 font-bold hover:text-red-600 transition-colors flex items-center">
            Logout
          </button>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col w-full min-w-0">
        
        {/* Topbar */}
        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 z-10">
          <div className="flex items-center flex-1">
            <button 
              className="lg:hidden text-gray-500 hover:text-gray-900 focus:outline-none mr-4"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={24} />
            </button>
            
            <div className="hidden md:flex relative group w-full max-w-2xl">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border-transparent rounded-lg focus:bg-white focus:border-[#0e3d79] focus:ring-2 focus:ring-[#0e3d79]/20 transition-all outline-none text-sm font-medium"
              />
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <button className="relative text-gray-400 hover:text-gray-900 transition-colors p-2 rounded-full hover:bg-gray-50">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            
            {/* Profile Dropdown */}
            <div className="relative group">
              <div className="flex items-center space-x-2 cursor-pointer bg-gray-50 py-1.5 px-2 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors">
                <div className="w-8 h-8 rounded-full bg-[#0e3d79] flex items-center justify-center text-white font-bold text-xs shadow-sm">
                  {initials}
                </div>
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </div>

              {/* Dropdown Menu */}
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50">
                <div className="py-2">
                  <div className="px-4 py-3 border-b border-gray-50">
                    <p className="text-sm font-bold text-gray-900 truncate">{consultant.name}</p>
                    <p className="text-xs text-gray-500 font-medium">{consultant.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full flex items-center px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors border-t border-gray-50 mt-1">
                    <LogOut className="w-4 h-4 mr-3" />
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ConsultantLayout;
