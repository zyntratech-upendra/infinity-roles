import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Shield, Database, Globe, Save, CheckCircle2 } from 'lucide-react';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [saved, setSaved] = useState(false);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: 'general', name: 'General Preferences', icon: <Globe className="w-4 h-4" /> },
    { id: 'security', name: 'Security & Roles', icon: <Shield className="w-4 h-4" /> },
    { id: 'notifications', name: 'Notifications & Alerts', icon: <Bell className="w-4 h-4" /> },
    { id: 'database', name: 'Data & Backups', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Banner with Glassmorphism */}
      <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-7 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold mb-2">
            <span>Governance Preferences</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight font-display flex items-center gap-2.5">
            <SettingsIcon className="w-7 h-7 text-indigo-600" />
            System Settings
          </h1>
          <p className="text-slate-500 mt-1 font-medium text-xs sm:text-sm">
            Configure global platform preferences, security baselines, and notification webhooks.
          </p>
        </div>

        {saved && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation Sidebar */}
        <div className="w-full lg:w-64 space-y-2">
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl border border-slate-200/80 p-2 shadow-sm space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-bold rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {tab.icon}
                <span>{tab.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-3xl shadow-sm border border-slate-200/80 p-6 sm:p-8">
          <form onSubmit={handleSave} className="space-y-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">General Preferences</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Basic platform identity and administrative points of contact.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Platform Name
                    </label>
                    <input
                      type="text"
                      defaultValue="The Infinity Roles"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-xs font-medium text-slate-800"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      System Support Email
                    </label>
                    <input
                      type="email"
                      defaultValue="support@infinityroles.com"
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-xs font-medium text-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Platform Timezone
                  </label>
                  <select
                    defaultValue="UTC+05:30"
                    className="w-full sm:w-1/2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-xs font-medium text-slate-800"
                  >
                    <option value="UTC+05:30">UTC+05:30 (India Standard Time)</option>
                    <option value="UTC+00:00">UTC+00:00 (GMT)</option>
                    <option value="UTC-05:00">UTC-05:00 (Eastern Time)</option>
                  </select>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">Security & Roles</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Multi-tenant role boundaries and authentication policies.</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Enforce Strict GPS Geofence</p>
                      <p className="text-[11px] text-slate-500">Block attendance punches outside configured radius.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div>
                      <p className="text-xs font-bold text-slate-900">Live Camera Verification</p>
                      <p className="text-[11px] text-slate-500">Require live webcam snapshots for employee attendance punch-ins.</p>
                    </div>
                    <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">Notifications & Alerts</h2>
                  <p className="text-xs text-slate-500 mt-0.5">Email templates and automated provisioning alerts.</p>
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-100">
                  <div>
                    <p className="text-xs font-bold text-slate-900">Automated Welcome Credentials Email</p>
                    <p className="text-[11px] text-slate-500">Instantly dispatch email with credentials when a new supervisor or consultant is created.</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-indigo-600 rounded" />
                </div>
              </div>
            )}

            {activeTab === 'database' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900 font-display">Data & Backups</h2>
                  <p className="text-xs text-slate-500 mt-0.5">MongoDB Atlas connectivity and automated audit trails.</p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 text-xs text-slate-700">
                  <p className="font-bold text-indigo-900 mb-1">Atlas Cloud Cluster</p>
                  <p className="text-[11px] text-slate-600">Database connections are encrypted in-transit (TLS 1.3) and managed automatically via Mongoose connection pool.</p>
                </div>
              </div>
            )}

            <div className="pt-6 border-t border-slate-200/80 flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-700 hover:to-purple-800 text-white font-bold text-xs shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
