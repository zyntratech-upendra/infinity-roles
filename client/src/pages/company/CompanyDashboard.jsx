import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { 
  Building2, Users, Shield, BadgePercent, TrendingUp, DollarSign, 
  ArrowRight, Phone, Mail, Award, Clock, FileText, CheckCircle2, Copy, Check 
} from 'lucide-react';
import { motion } from 'framer-motion';

const CompanyDashboard = () => {
  const { company } = useOutletContext();
  const [workforce, setWorkforce] = useState([]);
  const [loadingWorkforce, setLoadingWorkforce] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchWorkforce = async () => {
      const token = localStorage.getItem('companyToken');
      if (!token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/company/workforce`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setWorkforce(data);
        }
      } catch (err) {
        console.error('Error fetching company workforce', err);
      } finally {
        setLoadingWorkforce(false);
      }
    };

    fetchWorkforce();
  }, []);

  const copyCode = () => {
    if (company?.companyCode) {
      navigator.clipboard.writeText(company.companyCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wageGrid = company?.wageParticulars || {};
  const tiers = [
    { key: 'unskilled', label: 'Unskilled Tier', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { key: 'skilled', label: 'Skilled Tier', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    { key: 'highlySkilled', label: 'Highly Skilled', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
    { key: 'superSkilled', label: 'Super Skilled', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  ];

  // Count workers per tier
  const workerTierCount = (tierName) => {
    return workforce.filter((w) => w.skillLevel === tierName).length;
  };

  // Calculate estimated total monthly wage roll
  const totalMonthlyWageBill = workforce.reduce((acc, curr) => {
    return acc + (Number(curr.wageParticulars?.monthlyGross) || Number(curr.salary) || 0);
  }, 0);

  const supervisors = company?.supervisors || [];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {company.logoUrl ? (
              <img 
                src={company.logoUrl} 
                alt={company.companyName} 
                className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-contain bg-slate-50 border border-slate-200 p-2 shadow-xs" 
              />
            ) : (
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-sky-600 flex items-center justify-center text-white font-black text-2xl shadow-xs">
                {company.companyName ? company.companyName.substring(0, 2).toUpperCase() : 'CO'}
              </div>
            )}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified Organization
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                  {company.industry || 'General Industry'}
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {company.companyName}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {company.city ? `${company.city}, ${company.state || ''} ${company.country || ''}` : 'Corporate Workspace'} • Registered {new Date(company.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          {/* Quick Actions & Code Badge */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto">
            <div className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-2xl px-4 py-2.5 shadow-2xs">
              <div className="mr-3">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Organization Code</div>
                <div className="text-sm font-mono font-black text-indigo-700">{company.companyCode}</div>
              </div>
              <button 
                onClick={copyCode}
                className="p-1.5 bg-white hover:bg-indigo-50 text-slate-500 hover:text-indigo-600 rounded-xl border border-slate-200 transition-colors"
                title="Copy Code"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            <Link
              to="/company/workforce"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs transition-all"
            >
              <Users className="w-4 h-4" />
              <span>Inspect Workforce</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 2. Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Workforce</span>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {loadingWorkforce ? '...' : workforce.length}
          </div>
          <div className="mt-2 flex items-center text-xs font-semibold text-indigo-600">
            <Link to="/company/workforce" className="inline-flex items-center hover:underline">
              <span>View full roster</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Assigned Supervisors</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
              <Shield className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {supervisors.length}
          </div>
          <div className="mt-2 flex items-center text-xs font-semibold text-sky-600">
            <Link to="/company/supervisors" className="inline-flex items-center hover:underline">
              <span>View assignments</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Active Wage Tiers</span>
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
              <BadgePercent className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {4 + (wageGrid.customTiers?.length || 0)}
          </div>
          <div className="mt-2 flex items-center text-xs font-semibold text-purple-600">
            <Link to="/company/wages" className="inline-flex items-center hover:underline">
              <span>Review wage schedule</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Est. Monthly Payroll</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-black text-slate-900 tracking-tight">
            {loadingWorkforce ? '...' : `₹${totalMonthlyWageBill.toLocaleString()}`}
          </div>
          <div className="mt-2 text-xs font-medium text-slate-500">
            Based on active enrolled contracts
          </div>
        </div>

      </div>

      {/* 3. Skill Tiers Wage Grid Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
              Statutory Skill-Wise Salary Matrix
            </h2>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Admin-allotted salary particulars for workforce enrolled under company code <span className="font-mono font-bold text-indigo-600">{company.companyCode}</span>
            </p>
          </div>
          <Link 
            to="/company/wages" 
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>View Full Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tiers.map((t) => {
            const particulars = wageGrid[t.key] || {};
            const count = workerTierCount(
              t.key === 'unskilled' ? 'Unskilled' :
              t.key === 'skilled' ? 'Skilled' :
              t.key === 'highlySkilled' ? 'Highly Skilled' : 'Super Skilled'
            );

            return (
              <div 
                key={t.key} 
                className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-indigo-200 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${t.color}`}>
                    {t.label}
                  </span>
                  <span className="text-xs font-bold text-slate-500">
                    {count} worker{count !== 1 ? 's' : ''}
                  </span>
                </div>

                <div className="space-y-2 mt-4 text-xs font-medium text-slate-600">
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">Daily Basic:</span>
                    <span className="font-extrabold text-slate-900 font-mono">₹{particulars.dailyWage || 0}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">HRA / DA:</span>
                    <span className="font-extrabold text-slate-900 font-mono">₹{particulars.hraDa || 0}</span>
                  </div>
                  <div className="flex justify-between border-b border-slate-100 pb-1.5">
                    <span className="text-slate-400">OT Hourly:</span>
                    <span className="font-extrabold text-slate-900 font-mono">₹{particulars.otRate || 0}/hr</span>
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="font-bold text-slate-700">26-Day Monthly:</span>
                    <span className="font-black text-indigo-700 font-mono text-sm">
                      ₹{particulars.monthlyGross || ((particulars.dailyWage || 0) * 26 + (particulars.hraDa || 0))}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {wageGrid.customTiers?.length > 0 && (
          <div className="mt-5 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Custom Enterprise Tiers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {wageGrid.customTiers.map((ct, idx) => (
                <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{ct.tierName}</span>
                    <p className="text-[10px] text-slate-400 font-mono">Daily: ₹{ct.dailyWage} • OT: ₹{ct.otRate}/hr</p>
                  </div>
                  <span className="font-black text-indigo-700 font-mono">₹{ct.monthlyGross || (ct.dailyWage * 26)}/mo</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 4. Bottom Grid: Assigned Supervisors & Latest Enrolled Workers */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: Assigned Supervisors */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Assigned Supervisors</h3>
                <p className="text-xs text-slate-500">Supervisors deployed to manage your shifts</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-sky-50 text-sky-700 border border-sky-100 text-xs font-bold">
                {supervisors.length} active
              </span>
            </div>

            {supervisors.length === 0 ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium">
                No supervisors assigned by Admin yet.
              </div>
            ) : (
              <div className="space-y-3">
                {supervisors.map((s) => (
                  <div key={s._id} className="p-4 rounded-2xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                        {s.name ? s.name.substring(0, 2).toUpperCase() : 'SU'}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-900">{s.name}</h4>
                        <p className="text-[10px] text-slate-500 font-mono">{s.supervisorId || s.email}</p>
                      </div>
                    </div>
                    {s.phoneNumber && (
                      <span className="text-[11px] font-mono text-slate-600 bg-white px-2 py-1 rounded-lg border border-slate-200">
                        {s.phoneNumber}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <Link to="/company/supervisors" className="text-xs font-bold text-indigo-600 hover:underline">
              Inspect all assigned supervisors →
            </Link>
          </div>
        </div>

        {/* Right: Recent Workforce Additions */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Recent Workforce Additions</h3>
                <p className="text-xs text-slate-500">Latest team members registered under your company code</p>
              </div>
              <Link 
                to="/company/workforce" 
                className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
              >
                View Roster ({workforce.length})
              </Link>
            </div>

            {loadingWorkforce ? (
              <div className="text-center py-8 text-xs text-slate-400 font-medium">
                Loading workforce data...
              </div>
            ) : workforce.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No workers enrolled yet</p>
                <p className="text-[11px] text-slate-400 mt-1 max-w-xs mx-auto">
                  Assigned supervisors can register workers under your company code <span className="font-mono font-bold text-indigo-600">{company.companyCode}</span>.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {workforce.slice(0, 5).map((w) => (
                  <div key={w._id} className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {w.profilePicture ? (
                        <img 
                          src={w.profilePicture} 
                          alt={w.name} 
                          className="w-9 h-9 rounded-xl object-cover border border-slate-200" 
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 font-bold flex items-center justify-center text-xs">
                          {w.name ? w.name.substring(0, 2).toUpperCase() : 'WO'}
                        </div>
                      )}
                      <div>
                        <div className="text-xs font-bold text-slate-900">{w.name}</div>
                        <div className="text-[10px] text-slate-400 font-mono">
                          ID: {w.employeeId || 'Pending'} • By: {w.supervisorId?.name || 'Supervisor'}
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {w.skillLevel || 'Skilled'}
                      </span>
                      <div className="text-xs font-mono font-extrabold text-slate-800 mt-0.5">
                        ₹{(w.wageParticulars?.monthlyGross || w.salary || 0).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 text-center">
            <Link to="/company/workforce" className="text-xs font-bold text-indigo-600 hover:underline">
              Open comprehensive workforce roster →
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CompanyDashboard;
