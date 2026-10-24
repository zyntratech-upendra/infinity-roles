import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Building2, 
  Briefcase, 
  TrendingUp, 
  UserPlus, 
  Award, 
  DollarSign, 
  FileText, 
  ArrowUpRight, 
  CheckCircle2, 
  Loader2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const SupervisorDashboard = () => {
  const [stats, setStats] = useState({
    totalEmployees: 0,
    skillCounts: {
      Unskilled: 0,
      Skilled: 0,
      'Highly Skilled': 0,
      'Super Skilled': 0,
      'User-Defined': 0,
    },
    companyCode: '',
  });
  const [company, setCompany] = useState(null);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem('supervisorToken')?.replace(/^"|"$/g, '');

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [statsRes, compRes, empRes] = await Promise.all([
          fetch(`${import.meta.env.VITE_API_URL}/supervisor/stats`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL}/supervisor/company`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          fetch(`${import.meta.env.VITE_API_URL}/supervisor/employees`, {
            headers: { Authorization: `Bearer ${token}` }
          }),
        ]);

        if (statsRes.ok) {
          const statsData = await statsRes.json();
          setStats(statsData);
        }
        if (compRes.ok) {
          const compData = await compRes.json();
          setCompany(compData);
        }
        if (empRes.ok) {
          const empData = await empRes.json();
          setRecentEmployees(empData.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load supervisor dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
        <p className="text-xs font-bold text-slate-400">Loading supervisor operations...</p>
      </div>
    );
  }

  const skillCards = [
    { title: 'Unskilled Workforce', count: stats.skillCounts?.Unskilled || 0, color: 'text-amber-700 bg-amber-50 border-amber-200/60' },
    { title: 'Skilled Workers', count: stats.skillCounts?.Skilled || 0, color: 'text-indigo-700 bg-indigo-50 border-indigo-200/60' },
    { title: 'Highly Skilled', count: stats.skillCounts?.['Highly Skilled'] || 0, color: 'text-purple-700 bg-purple-50 border-purple-200/60' },
    { title: 'Super Skilled', count: stats.skillCounts?.['Super Skilled'] || 0, color: 'text-emerald-700 bg-emerald-50 border-emerald-200/60' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* Top Welcome & Assigned Company Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-indigo-50/40 to-white border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold mb-3">
              <Building2 className="w-3.5 h-3.5" />
              <span>Assigned Company: {company?.companyName || 'Corporate Client'}</span>
              <span className="font-mono bg-indigo-200/60 px-1.5 rounded text-[10px]">{company?.companyCode || stats.companyCode}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Supervisor Command Console
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Register on-ground workers, allot company-specific skill wage structures, and manage official joining letters.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/supervisor/employees/add"
              className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Register New Worker</span>
            </Link>
          </div>
        </div>

        {/* Company Wage Scale Highlights */}
        {company?.wageParticulars && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100 text-center">
            <div className="p-2.5 bg-white/80 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-slate-400 font-bold block uppercase">Unskilled Wage</span>
              <span className="text-xs font-bold text-slate-800">₹{company.wageParticulars.unskilled?.basicWage}/day • ₹{company.wageParticulars.unskilled?.monthlyWage?.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="p-2.5 bg-white/80 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-indigo-500 font-bold block uppercase">Skilled Wage</span>
              <span className="text-xs font-bold text-indigo-700">₹{company.wageParticulars.skilled?.basicWage}/day • ₹{company.wageParticulars.skilled?.monthlyWage?.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="p-2.5 bg-white/80 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-purple-500 font-bold block uppercase">High Skilled</span>
              <span className="text-xs font-bold text-purple-700">₹{company.wageParticulars.highlySkilled?.basicWage}/day • ₹{company.wageParticulars.highlySkilled?.monthlyWage?.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="p-2.5 bg-white/80 rounded-xl border border-slate-200/60">
              <span className="text-[10px] text-emerald-500 font-bold block uppercase">Super Skilled</span>
              <span className="text-xs font-bold text-emerald-700">₹{company.wageParticulars.superSkilled?.basicWage}/day • ₹{company.wageParticulars.superSkilled?.monthlyWage?.toLocaleString('en-IN')}/mo</span>
            </div>
          </div>
        )}
      </div>

      {/* Metrics Row: Total and Skill Breakdown */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Managed</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{stats.totalEmployees}</p>
          </div>
          <span className="text-[10px] text-emerald-600 font-bold mt-2 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" /> Under {company?.companyCode || 'Company'}
          </span>
        </div>

        {skillCards.map((sc, i) => (
          <div key={i} className="p-5 bg-white rounded-3xl border border-slate-200/80 shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{sc.title}</span>
              <p className="text-2xl font-black text-slate-900 mt-1">{sc.count}</p>
            </div>
            <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-full border w-fit mt-2 ${sc.color}`}>
              Skill Tier
            </span>
          </div>
        ))}
      </div>

      {/* Recent Workers Roster Card */}
      <div className="bg-white/90 rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">Recent Workforce Enrollments</h3>
            <p className="text-xs text-slate-500">Latest workers enrolled under Company Code {company?.companyCode || stats.companyCode}.</p>
          </div>

          <Link
            to="/supervisor/employees"
            className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            <span>View All Workforce</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentEmployees.length === 0 ? (
          <div className="text-center py-12 p-6">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-slate-800">No Workers Registered Yet</h4>
            <p className="text-xs text-slate-400 mt-0.5 mb-4">Start enrolling workers with skill-wise wages.</p>
            <Link
              to="/supervisor/employees/add"
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-indigo-700"
            >
              <UserPlus className="w-4 h-4" />
              <span>Enroll First Worker</span>
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 text-slate-600 font-bold border-b border-slate-200/70">
                  <th className="py-3 px-6">Worker</th>
                  <th className="py-3 px-6">Skill Level Tier</th>
                  <th className="py-3 px-6">Wage Scale</th>
                  <th className="py-3 px-6">Monthly Salary</th>
                  <th className="py-3 px-6">Documents</th>
                  <th className="py-3 px-6 text-right">Registered</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {recentEmployees.map((emp) => (
                  <tr key={emp._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 overflow-hidden flex items-center justify-center font-bold text-slate-700 text-xs">
                          {emp.profilePhotoUrl ? (
                            <img src={emp.profilePhotoUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            emp.name.substring(0, 2).toUpperCase()
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900">{emp.name}</p>
                          <span className="font-mono text-[10px] text-indigo-600">{emp.employeeId}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-6">
                      <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-100">
                        {emp.skillLevel || emp.skillType || 'Skilled'}
                      </span>
                    </td>

                    <td className="py-3.5 px-6 text-slate-600 font-mono text-[11px]">
                      ₹{emp.wageParticulars?.basicWage || 0}/day Basic
                    </td>

                    <td className="py-3.5 px-6 font-bold text-emerald-600 font-mono">
                      ₹{emp.wageParticulars?.monthlyWage ? Number(emp.wageParticulars.monthlyWage).toLocaleString('en-IN') : 'N/A'}
                    </td>

                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2">
                        {emp.aadhaarUrl ? (
                          <a href={emp.aadhaarUrl} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 hover:underline font-bold">Aadhaar</a>
                        ) : (
                          <span className="text-[10px] text-slate-300">No Aadhaar</span>
                        )}
                        <span>•</span>
                        {emp.panUrl ? (
                          <a href={emp.panUrl} target="_blank" rel="noreferrer" className="text-[10px] text-indigo-600 hover:underline font-bold">PAN</a>
                        ) : (
                          <span className="text-[10px] text-slate-300">No PAN</span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-6 text-right text-slate-400 text-[11px]">
                      {new Date(emp.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default SupervisorDashboard;
