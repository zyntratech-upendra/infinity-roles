import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
  BadgePercent, 
  ShieldCheck, 
  Calculator, 
  Info, 
  CheckCircle2, 
  AlertCircle, 
  DollarSign, 
  Plus, 
  Trash2, 
  Save, 
  Loader2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';

const createEmptyWageStructure = () => ({
  unskilled: { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
  skilled: { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
  highlySkilled: { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
  superSkilled: { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
  customTiers: [],
});

const CompanyWageParticulars = () => {
  const { company, setCompany } = useOutletContext();
  
  const [wages, setWages] = useState(() => {
    return company?.wageParticulars 
      ? JSON.parse(JSON.stringify(company.wageParticulars)) 
      : createEmptyWageStructure();
  });

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });

  useEffect(() => {
    if (company?.wageParticulars) {
      setWages(JSON.parse(JSON.stringify(company.wageParticulars)));
    }
  }, [company]);

  const handleWageChange = (tier, field, val) => {
    const num = parseFloat(val) || 0;
    setWages(prev => {
      const updatedTier = { ...(prev?.[tier] || {}), [field]: num };
      const basic = field === 'basicWage' ? num : (updatedTier.basicWage || 0);
      const hra = field === 'hraDa' ? num : (updatedTier.hraDa || 0);
      updatedTier.monthlyWage = Math.round((basic + hra) * 26);
      return { ...prev, [tier]: updatedTier };
    });
  };

  const addCustomTier = () => {
    setWages(prev => ({
      ...prev,
      customTiers: [
        ...(prev.customTiers || []),
        { title: '', basicWage: 500, hraDa: 100, overtimeRatePerHour: 90, monthlyWage: 15600 }
      ]
    }));
  };

  const handleCustomTierChange = (index, field, val) => {
    setWages(prev => {
      const list = [...(prev.customTiers || [])];
      if (field === 'title') {
        list[index].title = val;
      } else {
        const num = parseFloat(val) || 0;
        list[index][field] = num;
        const basic = field === 'basicWage' ? num : (list[index].basicWage || 0);
        const hra = field === 'hraDa' ? num : (list[index].hraDa || 0);
        list[index].monthlyWage = Math.round((basic + hra) * 26);
      }
      return { ...prev, customTiers: list };
    });
  };

  const removeCustomTier = (index) => {
    setWages(prev => ({
      ...prev,
      customTiers: (prev.customTiers || []).filter((_, i) => i !== index)
    }));
  };

  const handleFillTemplate = () => {
    setWages({
      unskilled: { basicWage: 450, hraDa: 100, overtimeRatePerHour: 80, monthlyWage: 14300 },
      skilled: { basicWage: 650, hraDa: 150, overtimeRatePerHour: 120, monthlyWage: 20800 },
      highlySkilled: { basicWage: 850, hraDa: 200, overtimeRatePerHour: 160, monthlyWage: 27300 },
      superSkilled: { basicWage: 1100, hraDa: 250, overtimeRatePerHour: 200, monthlyWage: 35100 },
      customTiers: [],
    });
    setMessage({ text: 'Standard statutory template populated. Click "Save Wage Structure" to apply.', type: 'info' });
  };

  const handleClearAll = () => {
    setWages(createEmptyWageStructure());
    setMessage({ text: 'All wage particulars reset to ₹0. Click "Save Wage Structure" to persist.', type: 'info' });
  };

  const handleSaveWages = async () => {
    setSaving(true);
    setMessage({ text: '', type: '' });
    const token = localStorage.getItem('companyToken');

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/company/wages`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ wageParticulars: wages })
      });
      const data = await res.json();

      if (res.ok) {
        if (setCompany) {
          setCompany(prev => ({ ...prev, wageParticulars: wages }));
        }
        setMessage({ text: 'Worker wage scales and particulars successfully updated!', type: 'success' });
      } else {
        setMessage({ text: data.message || 'Failed to save wage particulars', type: 'error' });
      }
    } catch (err) {
      setMessage({ text: 'Network error saving wages. Please check server connection.', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const tiers = [
    {
      key: 'unskilled',
      name: 'Unskilled Worker',
      badge: 'bg-amber-50 text-amber-700 border-amber-200',
      description: 'General manual operations, entry-level loaders, and helpers.',
    },
    {
      key: 'skilled',
      name: 'Skilled Worker',
      badge: 'bg-sky-50 text-sky-700 border-sky-200',
      description: 'Trained technicians, certified machinery operators, and assembly staff.',
    },
    {
      key: 'highlySkilled',
      name: 'Highly Skilled Worker',
      badge: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      description: 'Master craftsmen, electrical engineers, quality control specialists.',
    },
    {
      key: 'superSkilled',
      name: 'Super Skilled Worker',
      badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      description: 'Technical shift leads, precision fabricators, and shift foremen.',
    },
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 font-sans">
      
      {/* Top Header & Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-extrabold uppercase tracking-wider mb-2 border border-indigo-100">
            <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
            <span>Company Wage Administration</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Worker Wage Scales & Salary Grid</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Configure skill-specific daily basic, HRA/DA & overtime remuneration for <span className="font-mono font-bold text-indigo-600">{company?.companyName}</span> ({company?.companyCode})
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleFillTemplate}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Auto-fill recommended government wage structure"
          >
            Use Template
          </button>
          <button
            type="button"
            onClick={handleClearAll}
            className="px-3.5 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            title="Reset all rates to 0"
          >
            Clear All
          </button>
          <button
            type="button"
            onClick={handleSaveWages}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Saving Grid...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Wage Structure</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Notification Message Banner */}
      {message.text && (
        <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center gap-2.5 shadow-xs transition-all ${
          message.type === 'success' 
            ? 'bg-emerald-50 text-emerald-800 border-emerald-200' 
            : message.type === 'info'
            ? 'bg-indigo-50 text-indigo-800 border-indigo-200'
            : 'bg-rose-50 text-rose-800 border-rose-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Info Callout */}
      <div className="p-5 rounded-3xl bg-indigo-50/70 border border-indigo-200/80 flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
          <Calculator className="w-5 h-5" />
        </div>
        <div className="text-xs text-indigo-950 leading-relaxed">
          <h4 className="font-extrabold text-indigo-900 text-sm mb-1">Automated Worker Salary Calculation Formula</h4>
          <p className="text-indigo-800">
            Whenever supervisors record attendance or generate worker disbursements under <strong>{company?.companyCode}</strong>, monthly remuneration is calculated via:
          </p>
          <div className="mt-2.5 font-mono font-bold text-[11px] bg-white/90 p-2.5 rounded-xl border border-indigo-200 inline-block shadow-2xs">
            Monthly Remuneration = (Basic Daily Wage + HRA/DA) × 26 Days + (Overtime Hours × OT Rate/Hr)
          </div>
        </div>
      </div>

      {/* 4 Standard Tier Cards with Direct Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {tiers.map((tier) => {
          const tierData = wages?.[tier.key] || { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 };
          const basic = tierData.basicWage || 0;
          const hra = tierData.hraDa || 0;
          const ot = tierData.overtimeRatePerHour || 0;
          const gross = tierData.monthlyWage || Math.round((basic + hra) * 26);

          return (
            <div 
              key={tier.key} 
              className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs hover:border-indigo-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${tier.badge}`}>
                    {tier.name}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400 font-bold uppercase">{tier.key}</span>
                </div>

                <p className="text-xs text-slate-500 mb-5">{tier.description}</p>

                {/* Interactive Inputs Grid */}
                <div className="space-y-3 bg-slate-50/70 p-4 rounded-2xl border border-slate-100 text-xs">
                  <div className="flex justify-between items-center gap-3">
                    <span className="font-semibold text-slate-700">Basic Wage (₹/Day):</span>
                    <input
                      type="number"
                      min="0"
                      value={basic}
                      onChange={(e) => handleWageChange(tier.key, 'basicWage', e.target.value)}
                      className="w-28 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-xs text-right outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-2xs"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <span className="font-semibold text-slate-700">HRA & DA (₹/Day):</span>
                    <input
                      type="number"
                      min="0"
                      value={hra}
                      onChange={(e) => handleWageChange(tier.key, 'hraDa', e.target.value)}
                      className="w-28 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-slate-900 text-xs text-right outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-2xs"
                    />
                  </div>
                  <div className="flex justify-between items-center gap-3">
                    <span className="font-semibold text-slate-700">OT Rate (₹/Hour):</span>
                    <input
                      type="number"
                      min="0"
                      value={ot}
                      onChange={(e) => handleWageChange(tier.key, 'overtimeRatePerHour', e.target.value)}
                      className="w-28 px-3 py-1.5 bg-white border border-slate-200 rounded-xl font-mono font-bold text-indigo-700 text-xs text-right outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 shadow-2xs"
                    />
                  </div>
                  <div className="pt-2.5 border-t border-slate-200/80 flex justify-between items-center">
                    <span className="font-extrabold text-slate-900">Monthly Gross (26 Days):</span>
                    <span className="font-mono font-black text-emerald-700 text-sm">
                      ₹{gross.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 text-[11px] text-slate-400 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Statutory remuneration compliance enabled</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Custom Specialized Tiers Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/90 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 tracking-tight">Organization-Specific Custom Tiers</h3>
            <p className="text-xs text-slate-500 mt-0.5">Define specialized craftsman roles, technicians, or site-specific wage rates</p>
          </div>

          <button
            type="button"
            onClick={addCustomTier}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200/60 transition-colors cursor-pointer self-start sm:self-auto shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Custom Role Tier</span>
          </button>
        </div>

        {(!wages?.customTiers || wages.customTiers.length === 0) ? (
          <div className="p-8 text-center bg-slate-50/60 rounded-2xl border border-dashed border-slate-200">
            <Sparkles className="w-6 h-6 text-indigo-400 mx-auto mb-2" />
            <p className="text-xs font-bold text-slate-700">No Custom Tiers Added</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Click "Add Custom Role Tier" if your company uses specialized worker pay brackets.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {wages.customTiers.map((ct, idx) => (
              <div key={idx} className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/60 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <div className="flex-1">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Role Title</span>
                  <input
                    type="text"
                    value={ct.title}
                    onChange={(e) => handleCustomTierChange(idx, 'title', e.target.value)}
                    placeholder="e.g. Master Welder / QA Specialist"
                    className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-800 outline-none focus:border-indigo-500"
                  />
                </div>
                <div className="w-24">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">Basic/Day</span>
                  <input
                    type="number"
                    min="0"
                    value={ct.basicWage}
                    onChange={(e) => handleCustomTierChange(idx, 'basicWage', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-800 outline-none"
                  />
                </div>
                <div className="w-24">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">HRA/DA</span>
                  <input
                    type="number"
                    min="0"
                    value={ct.hraDa}
                    onChange={(e) => handleCustomTierChange(idx, 'hraDa', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-800 outline-none"
                  />
                </div>
                <div className="w-24">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold mb-1">OT/Hr</span>
                  <input
                    type="number"
                    min="0"
                    value={ct.overtimeRatePerHour}
                    onChange={(e) => handleCustomTierChange(idx, 'overtimeRatePerHour', e.target.value)}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold font-mono text-slate-800 outline-none"
                  />
                </div>
                <div className="text-right min-w-[100px] pt-4 sm:pt-0">
                  <span className="block text-[10px] text-slate-400 uppercase font-bold">Monthly</span>
                  <span className="font-mono font-black text-indigo-700 text-xs">
                    ₹{(ct.monthlyWage || (ct.basicWage + ct.hraDa) * 26).toLocaleString('en-IN')}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => removeCustomTier(idx)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors self-end sm:self-center cursor-pointer"
                  title="Remove Tier"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default CompanyWageParticulars;
