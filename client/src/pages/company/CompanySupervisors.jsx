import React, { useState, useEffect } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { Shield, Mail, Phone, Users, ExternalLink, Award, CheckCircle2 } from 'lucide-react';

const CompanySupervisors = () => {
  const { company } = useOutletContext();
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupervisors = async () => {
      const token = localStorage.getItem('companyToken');
      if (!token) return;

      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/company/supervisors`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setSupervisors(data);
        }
      } catch (err) {
        console.error('Error fetching supervisors', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSupervisors();
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Assigned Supervisors</h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            Operational supervisors assigned by Admin to manage shifts and workforce under code <span className="font-mono font-bold text-indigo-600">{company?.companyCode}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-slate-700 shadow-2xs">
            Assigned: <span className="text-sky-600 font-black">{supervisors.length}</span> supervisors
          </span>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-xs text-slate-500 font-medium">
          <div className="w-6 h-6 border-2 border-sky-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          Loading supervisor records...
        </div>
      ) : supervisors.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200/90 shadow-xs max-w-lg mx-auto">
          <Shield className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No Supervisors Assigned</h3>
          <p className="text-xs text-slate-500 mt-1">
            The platform Admin has not assigned any supervisors to <span className="font-bold text-slate-700">{company?.companyName}</span> yet. Contact your administrator to allocate supervisors.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {supervisors.map((s) => (
            <div 
              key={s._id} 
              className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-xs hover:border-sky-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-700 font-black text-base shadow-2xs">
                    {s.name ? s.name.substring(0, 2).toUpperCase() : 'SU'}
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Authorized
                  </span>
                </div>

                <h3 className="text-base font-extrabold text-slate-900 tracking-tight mb-1">{s.name}</h3>
                <p className="text-xs font-mono font-bold text-indigo-600 mb-4">ID: {s.supervisorId || 'SU-EMP'}</p>

                <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span className="truncate">{s.email}</span>
                  </div>
                  {s.phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="font-mono">{s.phoneNumber}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>Role: Site & Shift Operations</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={`mailto:${s.email}`}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-sky-50 text-slate-700 hover:text-sky-700 font-bold text-xs border border-slate-200 text-center transition"
                >
                  Email Supervisor
                </a>
                {s.phoneNumber && (
                  <a
                    href={`tel:${s.phoneNumber}`}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-50 hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 font-bold text-xs border border-slate-200 text-center transition"
                  >
                    Call
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};

export default CompanySupervisors;
