import React, { useEffect, useState } from 'react';
import { 
  Building2, 
  Users, 
  Briefcase, 
  TrendingUp, 
  ShieldCheck, 
  FileText, 
  Search, 
  DollarSign, 
  CheckCircle2, 
  Loader2, 
  Award,
  Filter,
  Eye,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ConsultantDashboard = () => {
  const [stats, setStats] = useState({
    companiesCount: 0,
    workersCount: 0,
    supervisorsCount: 0,
    skillDistribution: [],
    auditCompliance: '99.4%',
  });
  const [companies, setCompanies] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('companies'); // 'companies' | 'workers' | 'compliance'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCompanyModal, setSelectedCompanyModal] = useState(null);

  const token = localStorage.getItem('consultantToken')?.replace(/^"|"$/g, '');

  useEffect(() => {
    const fetchConsultantData = async () => {
      setLoading(true);
      try {
        const [statsRes, compRes, workRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/consultant/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL}/consultant/companies`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL}/consultant/workers`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        if (statsRes.ok) setStats(await statsRes.json());
        if (compRes.ok) setCompanies(await compRes.json());
        if (workRes.ok) setWorkers(await workRes.json());
      } catch (err) {
        console.error('Failed to load consultant data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchConsultantData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-bold text-slate-400">Loading statutory audit & analytics...</p>
      </div>
    );
  }

  const statCards = [
    { title: 'Audited Companies', value: stats.companiesCount, icon: <Building2 className="w-5 h-5 text-indigo-600" />, badge: 'Active Entities' },
    { title: 'Governed Workforce', value: stats.workersCount, icon: <Users className="w-5 h-5 text-emerald-600" />, badge: 'Skill Allotted' },
    { title: 'Supervisors in Field', value: stats.supervisorsCount, icon: <Briefcase className="w-5 h-5 text-purple-600" />, badge: 'Active Leads' },
    { title: 'Compliance Index', value: stats.auditCompliance || '99.4%', icon: <ShieldCheck className="w-5 h-5 text-cyan-600" />, badge: 'Verified' },
  ];

  return (
    <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full space-y-6 font-sans">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-white via-indigo-50/40 to-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold mb-3">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Statutory Wage Audit & Compliance Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Consultant & Audit Hub
          </h1>
          <p className="text-slate-500 mt-1 text-xs sm:text-sm max-w-2xl leading-relaxed">
            Monitor client companies, verify wage structures (Unskilled, Skilled, High, Super), and audit workforce payroll distributions.
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-200/60 font-bold text-xs">
          <CheckCircle2 className="w-4 h-4" />
          <span>Statutory Synced</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((sc, i) => (
          <div key={i} className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{sc.title}</span>
              <div className="p-2 bg-slate-50 rounded-xl">{sc.icon}</div>
            </div>
            <div>
              <p className="text-2xl font-black text-slate-900">{sc.value}</p>
              <span className="text-[10px] font-bold text-indigo-600 mt-1 inline-block">{sc.badge}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Tabs Header */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('companies')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'companies' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Client Companies & Wage Scales ({companies.length})
            </button>
            <button
              onClick={() => setActiveTab('workers')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'workers' ? 'bg-indigo-600 text-white shadow-xs' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              Audited Workforce ({workers.length})
            </button>
          </div>

          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium focus:bg-white focus:border-indigo-500 outline-none"
            />
          </div>
        </div>

        {/* Tab 1: Companies & Wage Grid Table */}
        {activeTab === 'companies' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 text-slate-600 font-bold border-b border-slate-200/80">
                  <th className="py-3 px-4">Company Name & Code</th>
                  <th className="py-3 px-4">Domain / Reg.</th>
                  <th className="py-3 px-4">Unskilled Basic</th>
                  <th className="py-3 px-4">Skilled Basic</th>
                  <th className="py-3 px-4">High Skilled</th>
                  <th className="py-3 px-4">Super Skilled</th>
                  <th className="py-3 px-4 text-right">Audit Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {companies
                  .filter(c => c.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || c.companyCode?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(c => (
                    <tr key={c._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{c.companyName}</span>
                        <span className="block font-mono text-[10px] text-indigo-600 font-bold">{c.companyCode}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        <div>{c.industry || 'Staffing'}</div>
                        <div className="text-[10px] text-slate-400">{c.registrationNumber || 'N/A'}</div>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-slate-700">
                        ₹{c.wageParticulars?.unskilled?.basicWage || 450} <span className="text-[9px] text-slate-400 font-normal">/day</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-indigo-700">
                        ₹{c.wageParticulars?.skilled?.basicWage || 650} <span className="text-[9px] text-slate-400 font-normal">/day</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-purple-700">
                        ₹{c.wageParticulars?.highlySkilled?.basicWage || 850} <span className="text-[9px] text-slate-400 font-normal">/day</span>
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-700">
                        ₹{c.wageParticulars?.superSkilled?.basicWage || 1100} <span className="text-[9px] text-slate-400 font-normal">/day</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => setSelectedCompanyModal(c)}
                          className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-[11px] rounded-lg cursor-pointer"
                        >
                          Audit Wage Scale
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Workers Table */}
        {activeTab === 'workers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 text-slate-600 font-bold border-b border-slate-200/80">
                  <th className="py-3 px-4">Worker Profile</th>
                  <th className="py-3 px-4">Company Context</th>
                  <th className="py-3 px-4">Skill Tier Allotted</th>
                  <th className="py-3 px-4">Daily Basic Wage</th>
                  <th className="py-3 px-4">Calculated Monthly Remuneration</th>
                  <th className="py-3 px-4">Supervisor Lead</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {workers
                  .filter(w => w.name?.toLowerCase().includes(searchQuery.toLowerCase()) || w.employeeId?.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map(w => (
                    <tr key={w._id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <span className="font-bold text-slate-900">{w.name}</span>
                        <span className="block font-mono text-[10px] text-indigo-600">{w.employeeId}</span>
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        {w.companyId?.companyName || 'Corporate Client'}
                        <span className="block text-[10px] text-indigo-600">{w.companyCode || w.companyId?.companyCode}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-bold text-[10px]">
                          {w.skillLevel || w.skillType || 'Skilled'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-mono">
                        ₹{w.wageParticulars?.basicWage || 0}/day
                      </td>
                      <td className="py-3 px-4 font-bold font-mono text-emerald-700">
                        ₹{w.wageParticulars?.monthlyWage ? Number(w.wageParticulars.monthlyWage).toLocaleString('en-IN') : 'N/A'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {w.supervisorId?.name || 'Assigned Lead'}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Company Audit Wage Modal */}
      <AnimatePresence>
        {selectedCompanyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedCompanyModal(null)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 z-10 space-y-5"
            >
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-lg">{selectedCompanyModal.companyName}</h3>
                  <span className="font-mono text-xs font-bold text-indigo-700">Code: {selectedCompanyModal.companyCode}</span>
                </div>
                <button onClick={() => setSelectedCompanyModal(null)} className="p-1 rounded-lg text-slate-400 hover:text-slate-800">
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 text-slate-600 font-bold">
                      <th className="py-2.5 px-4">Skill Category</th>
                      <th className="py-2.5 px-4">Daily Basic</th>
                      <th className="py-2.5 px-4">HRA & DA</th>
                      <th className="py-2.5 px-4">OT Rate/Hr</th>
                      <th className="py-2.5 px-4">Monthly Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium">
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-slate-800">Unskilled</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.unskilled?.basicWage}</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.unskilled?.hraDa}</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.unskilled?.overtimeRatePerHour}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">₹{selectedCompanyModal.wageParticulars?.unskilled?.monthlyWage?.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-indigo-900">Skilled</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.skilled?.basicWage}</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.skilled?.hraDa}</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.skilled?.overtimeRatePerHour}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-indigo-700">₹{selectedCompanyModal.wageParticulars?.skilled?.monthlyWage?.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-purple-900">Highly Skilled</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.highlySkilled?.basicWage}</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.highlySkilled?.hraDa}</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.highlySkilled?.overtimeRatePerHour}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-purple-700">₹{selectedCompanyModal.wageParticulars?.highlySkilled?.monthlyWage?.toLocaleString('en-IN')}</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-4 font-bold text-emerald-900">Super Skilled</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.superSkilled?.basicWage}</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.superSkilled?.hraDa}</td>
                      <td className="py-2.5 px-4">₹{selectedCompanyModal.wageParticulars?.superSkilled?.overtimeRatePerHour}</td>
                      <td className="py-2.5 px-4 font-mono font-bold text-emerald-700">₹{selectedCompanyModal.wageParticulars?.superSkilled?.monthlyWage?.toLocaleString('en-IN')}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end pt-2">
                <button onClick={() => setSelectedCompanyModal(null)} className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default ConsultantDashboard;
