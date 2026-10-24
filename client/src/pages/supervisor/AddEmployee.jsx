import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ChevronRight, 
  ChevronLeft, 
  UploadCloud, 
  Camera, 
  CheckCircle, 
  Loader2, 
  Printer, 
  Building2, 
  DollarSign, 
  Briefcase, 
  FileText, 
  User, 
  Sparkles, 
  AlertCircle,
  RefreshCw,
  Award
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

const AddEmployee = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Company and Wage Particulars State
  const [company, setCompany] = useState(null);
  const [loadingCompany, setLoadingCompany] = useState(true);

  // Form Data State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    employeeId: `EMP-${Math.floor(1000 + Math.random() * 9000)}`,
    phoneNumber: '',
    address: '',
    dob: '',
    gender: 'Male',
    qualifications: '',
    institutions: '',
    passingYear: '',
    // Skill Level & Salary Allotment
    skillLevel: 'Skilled', // 'Unskilled' | 'Skilled' | 'Highly Skilled' | 'Super Skilled' | 'User-Defined'
    skills: '',
    experienceYears: '',
    previousRoles: '',
    previousSalary: '',
    // Wage particulars breakdown
    tierName: 'Skilled Worker',
    basicWage: 650,
    hraDa: 150,
    overtimeRatePerHour: 120,
    monthlyWage: 20800,
    calculationNotes: '',
  });

  // Files State
  const [files, setFiles] = useState({ aadhaar: null, pan: null });
  const [aadhaarPreviewName, setAadhaarPreviewName] = useState('');
  const [panPreviewName, setPanPreviewName] = useState('');
  const [photo, setPhoto] = useState(null);
  const [useWebcam, setUseWebcam] = useState(false);

  // Webcam Setup
  const webcamRef = useRef(null);
  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      setPhoto(imageSrc);
      setUseWebcam(false);
    }
  }, [webcamRef]);

  // Fetch Supervisor's Assigned Company & Wage Grid
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const token = localStorage.getItem('supervisorToken')?.replace(/^"|"$/g, '');
        const res = await fetch(`${import.meta.env.VITE_API_URL}/supervisor/company`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const compData = await res.json();
          setCompany(compData);
          
          // Pre-populate with company skilled tier rates
          const wages = compData.wageParticulars || {};
          const skilledRates = wages.skilled || { basicWage: 650, hraDa: 150, overtimeRatePerHour: 120, monthlyWage: 20800 };
          setFormData(prev => ({
            ...prev,
            basicWage: skilledRates.basicWage || 650,
            hraDa: skilledRates.hraDa || 150,
            overtimeRatePerHour: skilledRates.overtimeRatePerHour || 120,
            monthlyWage: skilledRates.monthlyWage || (skilledRates.basicWage + skilledRates.hraDa) * 26,
            tierName: 'Skilled Worker',
          }));
        }
      } catch (err) {
        console.error('Failed to load supervisor company wage grid', err);
      } finally {
        setLoadingCompany(false);
      }
    };

    fetchCompanyData();
  }, []);

  // Update salary particulars when skill level changes
  const handleSkillLevelChange = (selectedLevel) => {
    const wages = company?.wageParticulars || {};
    let basic = 0;
    let hra = 0;
    let ot = 0;
    let monthly = 0;
    let tierTitle = `${selectedLevel} Worker`;

    if (selectedLevel === 'Unskilled') {
      basic = wages.unskilled?.basicWage || 450;
      hra = wages.unskilled?.hraDa || 100;
      ot = wages.unskilled?.overtimeRatePerHour || 80;
      monthly = wages.unskilled?.monthlyWage || (basic + hra) * 26;
    } else if (selectedLevel === 'Skilled') {
      basic = wages.skilled?.basicWage || 650;
      hra = wages.skilled?.hraDa || 150;
      ot = wages.skilled?.overtimeRatePerHour || 120;
      monthly = wages.skilled?.monthlyWage || (basic + hra) * 26;
    } else if (selectedLevel === 'Highly Skilled') {
      basic = wages.highlySkilled?.basicWage || 850;
      hra = wages.highlySkilled?.hraDa || 200;
      ot = wages.highlySkilled?.overtimeRatePerHour || 160;
      monthly = wages.highlySkilled?.monthlyWage || (basic + hra) * 26;
    } else if (selectedLevel === 'Super Skilled') {
      basic = wages.superSkilled?.basicWage || 1100;
      hra = wages.superSkilled?.hraDa || 250;
      ot = wages.superSkilled?.overtimeRatePerHour || 200;
      monthly = wages.superSkilled?.monthlyWage || (basic + hra) * 26;
    } else if (selectedLevel === 'User-Defined') {
      basic = formData.basicWage || 600;
      hra = formData.hraDa || 150;
      ot = formData.overtimeRatePerHour || 100;
      monthly = Math.round((basic + hra) * 26);
      tierTitle = 'Custom Wage Tier';
    } else {
      // Check if it's one of the custom tiers defined by the company
      const customTier = wages.customTiers?.find(ct => ct.title === selectedLevel);
      if (customTier) {
        basic = customTier.basicWage;
        hra = customTier.hraDa;
        ot = customTier.overtimeRatePerHour;
        monthly = customTier.monthlyWage || (basic + hra) * 26;
        tierTitle = customTier.title;
      }
    }

    setFormData(prev => ({
      ...prev,
      skillLevel: selectedLevel,
      tierName: tierTitle,
      basicWage: basic,
      hraDa: hra,
      overtimeRatePerHour: ot,
      monthlyWage: monthly,
    }));
  };

  // Custom Wage field updates
  const handleCustomSalaryChange = (field, val) => {
    const num = parseFloat(val) || 0;
    setFormData(prev => {
      const basic = field === 'basicWage' ? num : prev.basicWage;
      const hra = field === 'hraDa' ? num : prev.hraDa;
      const ot = field === 'overtimeRatePerHour' ? num : prev.overtimeRatePerHour;
      const monthly = Math.round((basic + hra) * 26);
      return {
        ...prev,
        [field]: num,
        monthlyWage: monthly,
      };
    });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFiles({ ...files, [e.target.name]: file });
      if (e.target.name === 'aadhaar') setAadhaarPreviewName(file.name);
      if (e.target.name === 'pan') setPanPreviewName(file.name);
    }
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
      setFiles(prev => ({ ...prev, profilePhotoFile: file }));
    }
  };

  const nextStep = () => setCurrentStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  // Convert Base64 to File
  const dataURLtoFile = (dataurl, filename) => {
    if (!dataurl) return null;
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
  };

  // Submit Worker Registration
  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    try {
      const token = localStorage.getItem('supervisorToken')?.replace(/^"|"$/g, '');
      const submitData = new FormData();
      
      // Append text fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Append Cloudinary files
      if (files.aadhaar) submitData.append('aadhaar', files.aadhaar);
      if (files.pan) submitData.append('pan', files.pan);
      
      if (files.profilePhotoFile) {
        submitData.append('profilePhoto', files.profilePhotoFile);
      } else if (photo && photo.startsWith('data:')) {
        const photoFile = dataURLtoFile(photo, 'profile.jpg');
        submitData.append('profilePhoto', photoFile);
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/supervisor/employees`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: submitData
      });

      const data = await response.json();
      
      if (response.ok) {
        setSuccess('Worker registered successfully! Official appointment letter and login credentials have been dispatched via email.');
        setTimeout(() => {
          navigate('/supervisor/employees');
        }, 2500);
      } else {
        setError(data.message || 'Failed to create employee');
      }
    } catch (err) {
      setError('An error occurred during submission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'Personal Profile' },
    { num: 2, title: 'Qualifications' },
    { num: 3, title: 'Wage & Skill Allotment' },
    { num: 4, title: 'Documents & Photo' },
    { num: 5, title: 'Review & Issue Letter' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16 font-sans">
      
      {/* Assigned Company Code Banner */}
      <div className="bg-gradient-to-r from-white via-indigo-50/50 to-white rounded-3xl p-5 border border-indigo-100/80 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-bold shadow-md shadow-indigo-600/20">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-extrabold text-slate-900 text-sm sm:text-base">
                {company?.companyName || 'Corporate Workforce Hub'}
              </h2>
              <span className="px-2 py-0.5 rounded-lg bg-indigo-100 text-indigo-700 font-mono font-bold text-xs">
                Code: {company?.companyCode || 'ASSIGNED'}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Enrolling worker with company-specific wage scale & statutory calculation.
            </p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Wage Grid Synced</span>
        </div>
      </div>

      {/* Main Container Card */}
      <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-xs border border-slate-200/80 p-6 sm:p-8">
        
        {/* Step Indicator Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative px-2">
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-1 bg-slate-100 -z-0" />
            <div 
              className="absolute left-6 top-1/2 -translate-y-1/2 h-1 bg-gradient-to-r from-indigo-500 to-indigo-600 -z-0 transition-all duration-300"
              style={{ width: `calc(${((currentStep - 1) / (steps.length - 1)) * 100}% - 1rem)` }}
            />

            {steps.map((st) => {
              const isPassed = currentStep > st.num;
              const isCurrent = currentStep === st.num;

              return (
                <div key={st.num} className="relative z-10 flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-2xl flex items-center justify-center font-extrabold text-xs transition-all shadow-sm ${
                    isPassed 
                      ? 'bg-emerald-500 text-white' 
                      : isCurrent 
                        ? 'bg-indigo-600 text-white ring-4 ring-indigo-100 scale-110' 
                        : 'bg-white text-slate-400 border border-slate-200'
                  }`}>
                    {isPassed ? <CheckCircle size={16} /> : st.num}
                  </div>
                  <span className={`text-[11px] font-bold mt-2 hidden sm:block ${
                    isCurrent ? 'text-indigo-600' : 'text-slate-400'
                  }`}>
                    {st.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-bold flex items-center gap-2">
            <CheckCircle className="w-4 h-4 flex-shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Step Content */}
        <div className="min-h-[340px]">
          {/* STEP 1: PERSONAL PROFILE */}
          {currentStep === 1 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-extrabold text-slate-900">Personal & Identity Particulars</h3>
                <p className="text-xs text-slate-500">Provide official identity details as per government proofs.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (as per Aadhaar) *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="e.g. Suresh Kumar"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (Portal ID) *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="worker@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Employee ID *</label>
                  <input
                    type="text"
                    name="employeeId"
                    required
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    placeholder="EMP-1024"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono font-bold text-indigo-700 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Contact *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    value={formData.phoneNumber}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Gender</label>
                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Residential Address</label>
                  <textarea
                    rows={2}
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House number, Street, Village/Town, District, State"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 2: QUALIFICATIONS & EXPERIENCE */}
          {currentStep === 2 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <div className="border-b border-slate-100 pb-3 mb-4">
                <h3 className="text-base font-extrabold text-slate-900">Education & Technical Background</h3>
                <p className="text-xs text-slate-500">Record academic background and prior industrial experience.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Highest Qualification</label>
                  <input
                    type="text"
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    placeholder="e.g. ITI Fitter, Diploma, 10th"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Institution / Board</label>
                  <input
                    type="text"
                    name="institutions"
                    value={formData.institutions}
                    onChange={handleInputChange}
                    placeholder="e.g. Govt ITI College"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Passing Year</label>
                  <input
                    type="text"
                    name="passingYear"
                    value={formData.passingYear}
                    onChange={handleInputChange}
                    placeholder="e.g. 2021"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Total Experience (Years)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    placeholder="e.g. 3.5"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Previous Monthly Salary (₹)</label>
                  <input
                    type="number"
                    min="0"
                    name="previousSalary"
                    value={formData.previousSalary}
                    onChange={handleInputChange}
                    placeholder="e.g. 18000"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Skills (Comma separated)</label>
                  <input
                    type="text"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    placeholder="Welding, Lathe, Fabrication"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-3">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Previous Roles / Companies</label>
                  <input
                    type="text"
                    name="previousRoles"
                    value={formData.previousRoles}
                    onChange={handleInputChange}
                    placeholder="e.g. Helper at Tata Projects (2022-2024)"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 3: SKILL TIER & SALARY ALLOTMENT (CORE REQUIREMENT) */}
          {currentStep === 3 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900">Skill Tier & Automated Salary Allotment</h3>
                    <p className="text-xs text-slate-500">
                      Allot worker remuneration based on {company?.companyName || 'assigned company'} wage grid.
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-xl">
                    Company: {company?.companyCode || 'DEFAULT'}
                  </span>
                </div>
              </div>

              {/* Skill Tier Selectors */}
              <div>
                <label className="block text-xs font-extrabold text-slate-700 uppercase tracking-wider mb-2.5">
                  Select Worker Skill Level
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {['Unskilled', 'Skilled', 'Highly Skilled', 'Super Skilled', 'User-Defined'].map((lvl) => {
                    const isSelected = formData.skillLevel === lvl;
                    return (
                      <button
                        key={lvl}
                        type="button"
                        onClick={() => handleSkillLevelChange(lvl)}
                        className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                          isSelected
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-600/20'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Award className={`w-4 h-4 mb-1 ${isSelected ? 'text-white' : 'text-indigo-600'}`} />
                        <span className="text-xs font-bold">{lvl}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Additional Company Custom Tiers if any */}
                {company?.wageParticulars?.customTiers?.length > 0 && (
                  <div className="mt-3">
                    <span className="text-[11px] font-bold text-slate-400 block mb-1.5">Or Choose Company Bespoke Role:</span>
                    <div className="flex flex-wrap gap-2">
                      {company.wageParticulars.customTiers.map((cTier, i) => (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleSkillLevelChange(cTier.title)}
                          className={`px-3 py-1.5 rounded-xl border text-xs font-bold transition-all ${
                            formData.skillLevel === cTier.title
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                              : 'bg-white text-indigo-700 border-indigo-200 hover:bg-indigo-50'
                          }`}
                        >
                          {cTier.title} (₹{cTier.monthlyWage?.toLocaleString('en-IN')})
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Salary Calculation Breakdown Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-indigo-50/20 to-white border border-indigo-100 shadow-xs">
                <div className="flex items-center justify-between mb-4 border-b border-indigo-100/60 pb-3">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-indigo-600" />
                    <h4 className="text-sm font-extrabold text-slate-900">
                      Allotted Salary Breakdown: <span className="text-indigo-700">{formData.tierName}</span>
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">26 Days Standard Basis</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  {/* Basic Daily Wage */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Basic Daily Wage</span>
                    {formData.skillLevel === 'User-Defined' ? (
                      <input
                        type="number"
                        min="0"
                        value={formData.basicWage}
                        onChange={(e) => handleCustomSalaryChange('basicWage', e.target.value)}
                        className="w-full mt-1 text-base font-black text-slate-900 border-b border-indigo-500 outline-none"
                      />
                    ) : (
                      <p className="text-lg font-black text-slate-900 mt-1">₹{formData.basicWage} <span className="text-[11px] font-normal text-slate-400">/day</span></p>
                    )}
                    <span className="text-[10px] text-slate-400 mt-0.5 block">₹{(formData.basicWage * 26).toLocaleString('en-IN')} /mo</span>
                  </div>

                  {/* HRA & DA */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">HRA & Allowances</span>
                    {formData.skillLevel === 'User-Defined' ? (
                      <input
                        type="number"
                        min="0"
                        value={formData.hraDa}
                        onChange={(e) => handleCustomSalaryChange('hraDa', e.target.value)}
                        className="w-full mt-1 text-base font-black text-slate-900 border-b border-indigo-500 outline-none"
                      />
                    ) : (
                      <p className="text-lg font-black text-slate-900 mt-1">₹{formData.hraDa} <span className="text-[11px] font-normal text-slate-400">/day</span></p>
                    )}
                    <span className="text-[10px] text-slate-400 mt-0.5 block">₹{(formData.hraDa * 26).toLocaleString('en-IN')} /mo</span>
                  </div>

                  {/* Overtime Rate */}
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Overtime Rate</span>
                    {formData.skillLevel === 'User-Defined' ? (
                      <input
                        type="number"
                        min="0"
                        value={formData.overtimeRatePerHour}
                        onChange={(e) => handleCustomSalaryChange('overtimeRatePerHour', e.target.value)}
                        className="w-full mt-1 text-base font-black text-slate-900 border-b border-indigo-500 outline-none"
                      />
                    ) : (
                      <p className="text-lg font-black text-indigo-700 mt-1">₹{formData.overtimeRatePerHour} <span className="text-[11px] font-normal text-slate-400">/hr</span></p>
                    )}
                    <span className="text-[10px] text-slate-400 mt-0.5 block">Paid as per actual OT hours</span>
                  </div>

                  {/* Monthly Calculated Gross */}
                  <div className="p-3 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20">
                    <span className="text-[10px] font-bold text-indigo-200 uppercase tracking-wider block">Calculated Monthly Remuneration</span>
                    <p className="text-xl font-black mt-1 font-mono">₹{Number(formData.monthlyWage).toLocaleString('en-IN')}</p>
                    <span className="text-[10px] text-indigo-100 mt-0.5 block">Allotted in Joining Letter</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* STEP 4: CLOUDINARY DOCUMENTS & PROFILE PHOTO */}
          {currentStep === 4 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">Identity Documents & Worker Photograph</h3>
                <p className="text-xs text-slate-500">Securely stored and verified via Cloudinary storage.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Aadhaar Card */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 transition-all text-center">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">Aadhaar Card Upload</h4>
                  <p className="text-[10px] text-slate-400 mb-3">Upload PDF, JPG, or PNG</p>
                  
                  {aadhaarPreviewName ? (
                    <div className="flex items-center justify-center gap-2 p-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{aadhaarPreviewName}</span>
                    </div>
                  ) : (
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-xs font-bold text-slate-700 cursor-pointer shadow-xs">
                      <UploadCloud className="w-4 h-4 text-indigo-600" />
                      <span>Choose File</span>
                      <input type="file" name="aadhaar" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>

                {/* PAN Card */}
                <div className="p-4 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/50 transition-all text-center">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-2">
                    <FileText className="w-5 h-5" />
                  </div>
                  <h4 className="text-xs font-bold text-slate-800">PAN Card Upload</h4>
                  <p className="text-[10px] text-slate-400 mb-3">Upload PDF, JPG, or PNG</p>
                  
                  {panPreviewName ? (
                    <div className="flex items-center justify-center gap-2 p-2 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold">
                      <CheckCircle className="w-4 h-4" />
                      <span className="truncate max-w-[200px]">{panPreviewName}</span>
                    </div>
                  ) : (
                    <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-xs font-bold text-slate-700 cursor-pointer shadow-xs">
                      <UploadCloud className="w-4 h-4 text-indigo-600" />
                      <span>Choose File</span>
                      <input type="file" name="pan" accept=".pdf,image/*" onChange={handleFileChange} className="hidden" />
                    </label>
                  )}
                </div>
              </div>

              {/* Profile Photo: Upload or Webcam */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">Worker Passport Photograph</h4>
                    <p className="text-[10px] text-slate-400">Capture live snapshot or upload existing picture.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUseWebcam(!useWebcam)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 text-xs font-bold text-indigo-700 shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{useWebcam ? 'Close Camera' : 'Live Camera Snapshot'}</span>
                  </button>
                </div>

                {useWebcam ? (
                  <div className="flex flex-col items-center gap-3">
                    <div className="w-72 h-56 rounded-2xl overflow-hidden border-2 border-indigo-600 bg-black">
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        videoConstraints={{ facingMode: 'user' }}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={capture}
                      className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs shadow-md"
                    >
                      Capture Photo
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-2xl bg-white border border-slate-200 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                      {photo ? (
                        <img src={photo} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <User className="w-8 h-8 text-slate-300" />
                      )}
                    </div>
                    <div>
                      <label className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-400 text-xs font-bold text-slate-700 cursor-pointer shadow-xs">
                        <UploadCloud className="w-4 h-4 text-indigo-600" />
                        <span>Upload Photo File</span>
                        <input type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                      </label>
                      <p className="text-[10px] text-slate-400 mt-1">Recommended size: 400x400px (JPG/PNG)</p>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* STEP 5: REVIEW & FINALIZE */}
          {currentStep === 5 && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-base font-extrabold text-slate-900">Review & Confirm Appointment</h3>
                <p className="text-xs text-slate-500">
                  Please verify worker particulars and salary calculation before issuing the appointment letter.
                </p>
              </div>

              {/* Review Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shadow-md">
                      {photo ? (
                        <img src={photo} alt="" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        formData.name.substring(0, 2).toUpperCase() || 'WK'
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-900 text-base">{formData.name}</h4>
                      <p className="text-xs text-slate-500">{formData.email} • {formData.phoneNumber}</p>
                      <span className="font-mono text-[10px] text-indigo-600 font-bold bg-indigo-50 px-2 py-0.5 rounded-md mt-1 inline-block">
                        ID: {formData.employeeId}
                      </span>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Assigned Company</span>
                    <p className="font-bold text-slate-900 text-sm">{company?.companyName || 'General Staffing'}</p>
                    <span className="text-xs font-mono font-bold text-indigo-700">{company?.companyCode || 'CORP-GEN'}</span>
                  </div>
                </div>

                {/* Salary breakdown summary */}
                <div className="p-4 bg-white rounded-xl border border-indigo-100">
                  <span className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider block mb-2">
                    Remuneration Terms Summary
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 block">Skill Tier</span>
                      <span className="font-bold text-indigo-700">{formData.skillLevel}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Basic Daily</span>
                      <span className="font-bold text-slate-900">₹{formData.basicWage}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">HRA & DA</span>
                      <span className="font-bold text-slate-900">₹{formData.hraDa}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 block">Monthly Remuneration</span>
                      <span className="font-black text-emerald-600 font-mono text-sm">₹{Number(formData.monthlyWage).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-xs text-amber-800">
                  ⚡ <strong>Automated Action:</strong> Clicking "Complete Registration & Send Joining Letter" will generate the official branded PDF letter, save documents to Cloudinary, and send welcome login credentials to <span className="font-bold">{formData.email}</span>.
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer Navigation Buttons */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            disabled={currentStep === 1 || loading}
            onClick={prevStep}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Continue</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleSubmit}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-extrabold shadow-md shadow-emerald-600/20 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating Joining Letter & Registering...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Registration & Issue Joining Letter</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>

    </div>
  );
};

export default AddEmployee;
