import React, { useState, useEffect, useMemo } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Users, 
  DollarSign, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Eye, 
  X, 
  UploadCloud, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft,
  Briefcase, 
  MapPin, 
  Mail, 
  Phone, 
  FileText,
  UserPlus,
  ArrowUpRight,
  Filter,
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper: standard empty wage structure (no fake auto-population)
const createEmptyWageStructure = () => ({
  unskilled: { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
  skilled: { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
  highlySkilled: { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
  superSkilled: { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 },
  customTiers: [],
});

// Helper: check if company has actual configured wages (at least one basicWage > 0)
const hasConfiguredWages = (wageParticulars) => {
  if (!wageParticulars) return false;
  const tiers = ['unskilled', 'skilled', 'highlySkilled', 'superSkilled'];
  const hasBasic = tiers.some(tier => Number(wageParticulars[tier]?.basicWage || 0) > 0);
  const hasCustom = Array.isArray(wageParticulars.customTiers) && 
    wageParticulars.customTiers.some(t => Number(t.basicWage || 0) > 0);
  return hasBasic || hasCustom;
};

const CompanyManagement = () => {
  const [companies, setCompanies] = useState([]);
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // 'All' | 'Active' | 'Inactive'
  const [industryFilter, setIndustryFilter] = useState('All');
  const [wageFilter, setWageFilter] = useState('All'); // 'All' | 'Configured' | 'Not Configured'
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'workers-desc' | 'supervisors-desc'

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [companyWorkforce, setCompanyWorkforce] = useState([]);
  const [loadingWorkforce, setLoadingWorkforce] = useState(false);
  const [editingCompanyId, setEditingCompanyId] = useState(null);

  // Form State
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'supervisors' | 'wages'
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Logo file
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    companyName: '',
    companyCode: '',
    registrationNumber: '',
    email: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    industry: 'Manufacturing & Staffing',
    status: 'Active',
    selectedSupervisorIds: [],
    // Quick Add New Supervisor
    addNewSupervisorNow: false,
    newSupervisorName: '',
    newSupervisorEmail: '',
    newSupervisorPhone: '',
    // Wage Particulars Grid - clean zero values
    wageParticulars: createEmptyWageStructure()
  });

  const token = localStorage.getItem('adminToken');

  // Fetch Companies & Supervisors
  const fetchData = async () => {
    setLoading(true);
    try {
      const [compRes, supRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/companies`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/supervisors`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      if (compRes.ok) {
        const compData = await compRes.json();
        setCompanies(compData);
      }
      if (supRes.ok) {
        const supData = await supRes.json();
        setSupervisors(supData);
      }
    } catch (err) {
      console.error('Failed to load companies data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Generate random company code
  const generateRandomCode = () => {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const randLetters = letters.charAt(Math.floor(Math.random() * letters.length)) + letters.charAt(Math.floor(Math.random() * letters.length));
    const randNums = Math.floor(1000 + Math.random() * 9000);
    const code = `CMP-${randLetters}${randNums}`;
    setFormData(prev => ({ ...prev, companyCode: code }));
  };

  // Wage calculation helper
  const handleWageChange = (tier, field, value) => {
    const numVal = parseFloat(value) || 0;
    setFormData(prev => {
      const currentTier = { ...prev.wageParticulars[tier], [field]: numVal };
      // Auto-compute monthly wage based on 26 days basis
      const basic = field === 'basicWage' ? numVal : (currentTier.basicWage || 0);
      const hra = field === 'hraDa' ? numVal : (currentTier.hraDa || 0);
      currentTier.monthlyWage = Math.round((basic + hra) * 26);

      return {
        ...prev,
        wageParticulars: {
          ...prev.wageParticulars,
          [tier]: currentTier
        }
      };
    });
  };

  // Custom Tier Management
  const addCustomWageTier = () => {
    setFormData(prev => ({
      ...prev,
      wageParticulars: {
        ...prev.wageParticulars,
        customTiers: [
          ...prev.wageParticulars.customTiers,
          {
            title: 'Specialist Role ' + (prev.wageParticulars.customTiers.length + 1),
            basicWage: 950,
            hraDa: 200,
            overtimeRatePerHour: 180,
            monthlyWage: 29900
          }
        ]
      }
    }));
  };

  const handleCustomWageChange = (index, field, value) => {
    setFormData(prev => {
      const updatedTiers = [...prev.wageParticulars.customTiers];
      if (field === 'title') {
        updatedTiers[index].title = value;
      } else {
        const numVal = parseFloat(value) || 0;
        updatedTiers[index][field] = numVal;
        const basic = field === 'basicWage' ? numVal : (updatedTiers[index].basicWage || 0);
        const hra = field === 'hraDa' ? numVal : (updatedTiers[index].hraDa || 0);
        updatedTiers[index].monthlyWage = Math.round((basic + hra) * 26);
      }

      return {
        ...prev,
        wageParticulars: {
          ...prev.wageParticulars,
          customTiers: updatedTiers
        }
      };
    });
  };

  const removeCustomWageTier = (index) => {
    setFormData(prev => ({
      ...prev,
      wageParticulars: {
        ...prev.wageParticulars,
        customTiers: prev.wageParticulars.customTiers.filter((_, idx) => idx !== index)
      }
    }));
  };

  // Quick fill standard wage rates in registration drawer
  const handleFillRegistrationStandardRates = () => {
    setFormData(prev => ({
      ...prev,
      wageParticulars: {
        unskilled: { basicWage: 450, hraDa: 100, overtimeRatePerHour: 80, monthlyWage: 14300 },
        skilled: { basicWage: 650, hraDa: 150, overtimeRatePerHour: 120, monthlyWage: 20800 },
        highlySkilled: { basicWage: 850, hraDa: 200, overtimeRatePerHour: 160, monthlyWage: 27300 },
        superSkilled: { basicWage: 1100, hraDa: 250, overtimeRatePerHour: 200, monthlyWage: 35100 },
        customTiers: prev.wageParticulars?.customTiers || [],
      }
    }));
  };

  // Clear registration wages to 0
  const handleClearRegistrationWages = () => {
    setFormData(prev => ({
      ...prev,
      wageParticulars: createEmptyWageStructure()
    }));
  };

  // Logo file selection
  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  // Open modal for new registration
  const openNewRegistration = () => {
    setEditingCompanyId(null);
    setFormData({
      companyName: '',
      companyCode: `CMP-${Math.floor(1000 + Math.random() * 9000)}`,
      registrationNumber: '',
      email: '',
      phoneNumber: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      industry: 'Manufacturing & Staffing',
      status: 'Active',
      selectedSupervisorIds: [],
      addNewSupervisorNow: false,
      newSupervisorName: '',
      newSupervisorEmail: '',
      newSupervisorPhone: '',
      wageParticulars: createEmptyWageStructure()
    });
    setLogoFile(null);
    setLogoPreview('');
    setFormError('');
    setFormSuccess('');
    setActiveTab('profile');
    setIsRegisterModalOpen(true);
  };

  // Open modal for editing
  const openEditCompany = (company) => {
    setEditingCompanyId(company._id);
    setFormData({
      companyName: company.companyName || '',
      companyCode: company.companyCode || '',
      registrationNumber: company.registrationNumber || '',
      email: company.email || '',
      phoneNumber: company.phoneNumber || '',
      address: company.address || '',
      city: company.city || '',
      state: company.state || '',
      pincode: company.pincode || '',
      industry: company.industry || 'Manufacturing & Staffing',
      status: company.status || 'Active',
      selectedSupervisorIds: (company.supervisors || []).map(s => typeof s === 'object' ? s._id : s),
      addNewSupervisorNow: false,
      newSupervisorName: '',
      newSupervisorEmail: '',
      newSupervisorPhone: '',
      wageParticulars: company.wageParticulars ? JSON.parse(JSON.stringify(company.wageParticulars)) : createEmptyWageStructure()
    });
    setLogoFile(null);
    setLogoPreview(company.logoUrl || '');
    setFormError('');
    setFormSuccess('');
    setActiveTab('profile');
    setIsRegisterModalOpen(true);
  };

  // Company Panel (Details Drawer) Interactive State
  const [panelTab, setPanelTab] = useState('overview'); // 'overview' | 'wages' | 'supervisors' | 'roster'
  const [panelWages, setPanelWages] = useState(createEmptyWageStructure());
  const [panelSupervisorIds, setPanelSupervisorIds] = useState([]);
  const [savingPanelWages, setSavingPanelWages] = useState(false);
  const [savingPanelSupervisors, setSavingPanelSupervisors] = useState(false);
  const [panelMessage, setPanelMessage] = useState({ text: '', type: '' });

  // Clear / Zero out all wages in Company Panel
  const handleClearPanelWages = () => {
    setPanelWages(createEmptyWageStructure());
    setPanelMessage({ text: 'All wage rates cleared to 0. Click "Save Wage Grid" to apply changes.', type: 'info' });
  };

  // Fill standard recommended rates in Company Panel
  const handleFillStandardRates = () => {
    setPanelWages({
      unskilled: { basicWage: 450, hraDa: 100, overtimeRatePerHour: 80, monthlyWage: 14300 },
      skilled: { basicWage: 650, hraDa: 150, overtimeRatePerHour: 120, monthlyWage: 20800 },
      highlySkilled: { basicWage: 850, hraDa: 200, overtimeRatePerHour: 160, monthlyWage: 27300 },
      superSkilled: { basicWage: 1100, hraDa: 250, overtimeRatePerHour: 200, monthlyWage: 35100 },
      customTiers: [],
    });
    setPanelMessage({ text: 'Standard wage template populated. Click "Save Wage Grid" to apply.', type: 'info' });
  };

  // View full company details & workforce
  const openCompanyDetails = async (company, defaultTab = 'overview') => {
    setSelectedCompany(company);
    setPanelTab(defaultTab);
    setPanelWages(company.wageParticulars ? JSON.parse(JSON.stringify(company.wageParticulars)) : createEmptyWageStructure());
    setPanelSupervisorIds((company.supervisors || []).map(s => typeof s === 'object' ? s._id : s));
    setPanelMessage({ text: '', type: '' });
    setIsDetailModalOpen(true);
    setLoadingWorkforce(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/companies/${company._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setSelectedCompany(data.company);
        if (data.company?.wageParticulars) {
          setPanelWages(data.company.wageParticulars);
        } else {
          setPanelWages(createEmptyWageStructure());
        }
        setPanelSupervisorIds((data.company?.supervisors || []).map(s => typeof s === 'object' ? s._id : s));
        setCompanyWorkforce(data.employees || []);
      }
    } catch (err) {
      console.error('Failed to load company workforce:', err);
    } finally {
      setLoadingWorkforce(false);
    }
  };

  // Wage calculation helper for Company Panel
  const handlePanelWageChange = (tier, field, value) => {
    const numVal = parseFloat(value) || 0;
    setPanelWages(prev => {
      const currentTier = { ...(prev?.[tier] || {}), [field]: numVal };
      const basic = field === 'basicWage' ? numVal : (currentTier.basicWage || 0);
      const hra = field === 'hraDa' ? numVal : (currentTier.hraDa || 0);
      currentTier.monthlyWage = Math.round((basic + hra) * 26);
      return {
        ...prev,
        [tier]: currentTier
      };
    });
  };

  const addCustomPanelWageTier = () => {
    setPanelWages(prev => ({
      ...prev,
      customTiers: [
        ...(prev.customTiers || []),
        { title: '', basicWage: 500, hraDa: 100, overtimeRatePerHour: 90, monthlyWage: 15600 }
      ]
    }));
  };

  const handleCustomPanelWageChange = (idx, field, value) => {
    setPanelWages(prev => {
      const updated = [...(prev.customTiers || [])];
      const numVal = (field === 'basicWage' || field === 'hraDa' || field === 'overtimeRatePerHour') 
        ? (parseFloat(value) || 0) 
        : value;

      updated[idx] = { ...updated[idx], [field]: numVal };
      if (field === 'basicWage' || field === 'hraDa') {
        const basic = field === 'basicWage' ? numVal : (updated[idx].basicWage || 0);
        const hra = field === 'hraDa' ? numVal : (updated[idx].hraDa || 0);
        updated[idx].monthlyWage = Math.round((basic + hra) * 26);
      }
      return { ...prev, customTiers: updated };
    });
  };

  const removeCustomPanelWageTier = (idx) => {
    setPanelWages(prev => ({
      ...prev,
      customTiers: (prev.customTiers || []).filter((_, i) => i !== idx)
    }));
  };

  const handleSavePanelWages = async () => {
    if (!selectedCompany) return;
    setSavingPanelWages(true);
    setPanelMessage({ text: '', type: '' });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/companies/${selectedCompany._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          wageParticulars: panelWages
        })
      });
      const data = await res.json();
      if (res.ok) {
        setSelectedCompany(prev => ({ ...prev, wageParticulars: panelWages }));
        setCompanies(prev => prev.map(c => c._id === selectedCompany._id ? { ...c, wageParticulars: panelWages } : c));
        setPanelMessage({ text: 'Wage grid updated successfully for this company!', type: 'success' });
      } else {
        setPanelMessage({ text: data.message || 'Failed to update wage grid', type: 'error' });
      }
    } catch (err) {
      setPanelMessage({ text: 'Network error updating wage grid', type: 'error' });
    } finally {
      setSavingPanelWages(false);
    }
  };

  const handleSavePanelSupervisors = async () => {
    if (!selectedCompany) return;
    setSavingPanelSupervisors(true);
    setPanelMessage({ text: '', type: '' });
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/companies/${selectedCompany._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          supervisors: panelSupervisorIds
        })
      });
      const data = await res.json();
      if (res.ok) {
        const updatedSupervisors = supervisors.filter(s => panelSupervisorIds.includes(s._id));
        setSelectedCompany(prev => ({ ...prev, supervisors: updatedSupervisors }));
        setCompanies(prev => prev.map(c => c._id === selectedCompany._id ? { ...c, supervisors: updatedSupervisors } : c));
        setPanelMessage({ text: 'Assigned supervisors updated successfully!', type: 'success' });
      } else {
        setPanelMessage({ text: data.message || 'Failed to update supervisors', type: 'error' });
      }
    } catch (err) {
      setPanelMessage({ text: 'Network error updating supervisors', type: 'error' });
    } finally {
      setSavingPanelSupervisors(false);
    }
  };

  // Submit Company (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!formData.companyName.trim()) {
      setFormError('Please provide a valid company name.');
      setActiveTab('profile');
      return;
    }
    if (!formData.companyCode.trim()) {
      setFormError('Company code is required.');
      setActiveTab('profile');
      return;
    }
    if (!formData.email.trim()) {
      setFormError('Official company email is required.');
      setActiveTab('profile');
      return;
    }

    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append('companyName', formData.companyName.trim());
      submitData.append('companyCode', formData.companyCode.trim().toUpperCase());
      submitData.append('registrationNumber', formData.registrationNumber);
      submitData.append('email', formData.email.trim());
      submitData.append('phoneNumber', formData.phoneNumber);
      submitData.append('address', formData.address);
      submitData.append('city', formData.city);
      submitData.append('state', formData.state);
      submitData.append('pincode', formData.pincode);
      submitData.append('industry', formData.industry);
      submitData.append('status', formData.status);
      submitData.append('supervisors', JSON.stringify(formData.selectedSupervisorIds));
      submitData.append('wageParticulars', JSON.stringify(formData.wageParticulars));

      if (formData.addNewSupervisorNow && formData.newSupervisorName && formData.newSupervisorEmail) {
        submitData.append('newSupervisorName', formData.newSupervisorName);
        submitData.append('newSupervisorEmail', formData.newSupervisorEmail);
        submitData.append('newSupervisorPhone', formData.newSupervisorPhone);
      }

      if (logoFile) {
        submitData.append('logo', logoFile);
      } else if (logoPreview && !logoPreview.startsWith('blob:')) {
        submitData.append('logoUrl', logoPreview);
      }

      const url = editingCompanyId 
        ? `${import.meta.env.VITE_API_URL}/admin/companies/${editingCompanyId}`
        : `${import.meta.env.VITE_API_URL}/admin/companies`;

      const method = editingCompanyId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: submitData
      });

      const result = await response.json();

      if (response.ok) {
        setFormSuccess(editingCompanyId ? 'Company updated successfully!' : 'Company registered with wage particulars & supervisor allocation!');
        setTimeout(() => {
          setIsRegisterModalOpen(false);
          fetchData();
        }, 1200);
      } else {
        setFormError(result.message || 'Failed to save company.');
      }
    } catch (err) {
      setFormError('A network or server error occurred while saving.');
    } finally {
      setSubmitting(false);
    }
  };

  // Delete company
  const handleDeleteCompany = async (companyId, companyName) => {
    if (!window.confirm(`Are you sure you want to delete "${companyName}"? This will unlink supervisors and employees.`)) {
      return;
    }

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/companies/${companyId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setCompanies(prev => prev.filter(c => c._id !== companyId));
      }
    } catch (err) {
      console.error('Delete company failed:', err);
    }
  };

  // Available dynamic industries
  const availableIndustries = useMemo(() => {
    const set = new Set();
    companies.forEach(c => {
      if (c.industry && c.industry.trim()) set.add(c.industry.trim());
    });
    return Array.from(set).sort();
  }, [companies]);

  // Filtered and sorted companies
  const filteredAndSortedCompanies = useMemo(() => {
    return companies
      .filter(company => {
        // Search query
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch = !q || (
          (company.companyName && company.companyName.toLowerCase().includes(q)) ||
          (company.companyCode && company.companyCode.toLowerCase().includes(q)) ||
          (company.email && company.email.toLowerCase().includes(q)) ||
          (company.city && company.city.toLowerCase().includes(q)) ||
          (company.industry && company.industry.toLowerCase().includes(q))
        );

        // Status filter
        const matchesStatus = statusFilter === 'All' || company.status === statusFilter;

        // Industry filter
        const matchesIndustry = industryFilter === 'All' || company.industry === industryFilter;

        // Wage status filter
        const isWageConfigured = hasConfiguredWages(company.wageParticulars);
        const matchesWage = 
          wageFilter === 'All' ||
          (wageFilter === 'Configured' && isWageConfigured) ||
          (wageFilter === 'Not Configured' && !isWageConfigured);

        return matchesSearch && matchesStatus && matchesIndustry && matchesWage;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
        }
        if (sortBy === 'name-asc') {
          return (a.companyName || '').localeCompare(b.companyName || '');
        }
        if (sortBy === 'name-desc') {
          return (b.companyName || '').localeCompare(a.companyName || '');
        }
        if (sortBy === 'workers-desc') {
          return (b.workerCount || 0) - (a.workerCount || 0);
        }
        if (sortBy === 'supervisors-desc') {
          return ((b.supervisors?.length || 0) - (a.supervisors?.length || 0));
        }
        return 0;
      });
  }, [companies, searchQuery, statusFilter, industryFilter, wageFilter, sortBy]);

  // Reset to page 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, industryFilter, wageFilter, sortBy, itemsPerPage]);

  const totalFiltered = filteredAndSortedCompanies.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / itemsPerPage));
  const paginatedCompanies = filteredAndSortedCompanies.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const hasActiveFilters = searchQuery !== '' || statusFilter !== 'All' || industryFilter !== 'All' || wageFilter !== 'All' || sortBy !== 'newest';

  const resetAllFilters = () => {
    setSearchQuery('');
    setStatusFilter('All');
    setIndustryFilter('All');
    setWageFilter('All');
    setSortBy('newest');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-7 max-w-7xl mx-auto pb-16 font-sans">
      
      {/* Top Banner with light gradient & soft glassmorphism */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-white via-indigo-50/50 to-white border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-indigo-200/30 to-purple-200/20 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200/60 text-indigo-700 text-xs font-bold mb-3 shadow-2xs">
              <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>Enterprise Corporate Registry</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Company Registration & Wage Hub
            </h1>
            <p className="text-sm text-slate-500 mt-1 max-w-2xl leading-relaxed">
              Register client companies, assign licensed supervisors, and configure skill-tier wage particulars (Unskilled, Skilled, High, Super & Custom Tiers) for automated worker salary calculation.
            </p>
          </div>

          <button
            onClick={openNewRegistration}
            className="flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-bold text-sm shadow-md shadow-indigo-600/20 hover:shadow-lg hover:shadow-indigo-600/30 active:scale-95 transition-all flex-shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Register New Company</span>
          </button>
        </div>

        {/* Quick Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
          <div className="p-3.5 bg-white/80 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Companies</span>
            <p className="text-2xl font-black text-slate-900 mt-0.5">{companies.length}</p>
          </div>
          <div className="p-3.5 bg-white/80 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Assigned Supervisors</span>
            <p className="text-2xl font-black text-indigo-600 mt-0.5">
              {companies.reduce((acc, c) => acc + (c.supervisors?.length || 0), 0)}
            </p>
          </div>
          <div className="p-3.5 bg-white/80 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Governed Workers</span>
            <p className="text-2xl font-black text-emerald-600 mt-0.5">
              {companies.reduce((acc, c) => acc + (c.workerCount || 0), 0)}
            </p>
          </div>
          <div className="p-3.5 bg-white/80 rounded-2xl border border-slate-200/60 shadow-2xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Status</span>
            <p className="text-2xl font-black text-cyan-600 mt-0.5">
              {companies.filter(c => c.status === 'Active').length}
            </p>
          </div>
        </div>
      </div>

      {/* Comprehensive Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by company name, code (e.g. CMP-XX), email, or city..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer p-0.5"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Status Quick Select Pills */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl self-start md:self-auto flex-shrink-0">
            {['All', 'Active', 'Inactive'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === status
                    ? 'bg-white text-indigo-700 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        {/* Filters Row: Industry, Wage Status, Sort, Reset */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1 mr-1">
              <Filter className="w-3.5 h-3.5 text-slate-400" /> Filters:
            </span>

            {/* Industry Filter Dropdown */}
            <select
              value={industryFilter}
              onChange={(e) => setIndustryFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="All">All Industries</option>
              {availableIndustries.map((ind) => (
                <option key={ind} value={ind}>{ind}</option>
              ))}
            </select>

            {/* Wage Configuration Status Filter */}
            <select
              value={wageFilter}
              onChange={(e) => setWageFilter(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer hover:bg-slate-100 transition-colors"
            >
              <option value="All">All Wage Statuses</option>
              <option value="Configured">Configured Wages</option>
              <option value="Not Configured">Wages Not Set (Pending)</option>
            </select>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 outline-none focus:border-indigo-500 cursor-pointer hover:bg-slate-100 transition-colors"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name-asc">Company Name (A-Z)</option>
                <option value="name-desc">Company Name (Z-A)</option>
                <option value="workers-desc">Most Workers</option>
                <option value="supervisors-desc">Most Supervisors</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer"
                title="Reset All Filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Results Counter */}
          <div className="text-xs text-slate-500 font-medium">
            Showing <span className="font-bold text-slate-800">{totalFiltered}</span> {totalFiltered === 1 ? 'company' : 'companies'}
          </div>
        </div>
      </div>

      {/* Companies List / Cards Grid */}
      {loading ? (
        <div className="min-h-[300px] flex flex-col items-center justify-center gap-3 bg-white rounded-3xl border border-slate-200/80 p-12">
          <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          <p className="text-xs font-bold text-slate-400">Loading registered companies...</p>
        </div>
      ) : paginatedCompanies.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-inner">
            <Building2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800">No Companies Found</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto mt-1 mb-6">
            {hasActiveFilters 
              ? 'No companies matched your current search and filter criteria.' 
              : 'Start by registering your first client company and assigning supervisors with skill wages.'}
          </p>
          {hasActiveFilters ? (
            <button
              onClick={resetAllFilters}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          ) : (
            <button
              onClick={openNewRegistration}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-md hover:bg-indigo-700 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Register First Company</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginatedCompanies.map((company, index) => {
            const supervisorCount = company.supervisors?.length || 0;
            const workerCount = company.workerCount || 0;
            const isWageConfigured = hasConfiguredWages(company.wageParticulars);

            return (
              <motion.div
                key={company._id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: index * 0.04 }}
                className="group relative bg-white hover:bg-white rounded-2xl border border-slate-200/90 hover:border-indigo-300 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                <div className="p-5 flex-1 flex flex-col">
                  {/* Top Header: Code & Live Status Dot */}
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <span className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-mono text-[11px] font-bold border border-slate-200/70 tracking-wide flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {company.companyCode}
                    </span>
                    
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      company.status === 'Active' 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/70' 
                        : 'bg-slate-100 text-slate-500 border border-slate-200/70'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        company.status === 'Active' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'
                      }`} />
                      {company.status}
                    </span>
                  </div>

                  {/* Brand: Logo + Name + Industry */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-2xs group-hover:border-indigo-200 transition-colors">
                      {company.logoUrl ? (
                        <img src={company.logoUrl} alt={company.companyName} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-tr from-indigo-50 to-slate-100 flex items-center justify-center text-indigo-600 font-black text-sm">
                          {company.companyName ? company.companyName.substring(0, 2).toUpperCase() : <Building2 className="w-5 h-5 text-indigo-500" />}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-slate-900 text-base leading-tight truncate group-hover:text-indigo-600 transition-colors" title={company.companyName}>
                        {company.companyName}
                      </h3>
                      <p className="text-xs text-slate-500 truncate mt-0.5 flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-slate-400" />
                        <span>{company.industry || 'Manufacturing & Staffing'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Contact Snippets Box */}
                  <div className="space-y-1.5 text-xs text-slate-600 mb-4 bg-slate-50/70 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 truncate" title={company.email}>
                      <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span className="truncate">{company.email}</span>
                    </div>
                    {company.phoneNumber ? (
                      <div className="flex items-center gap-2 truncate">
                        <Phone className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{company.phoneNumber}</span>
                      </div>
                    ) : null}
                    {company.city ? (
                      <div className="flex items-center gap-2 truncate">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{company.city}{company.state ? `, ${company.state}` : ''}</span>
                      </div>
                    ) : null}
                  </div>

                  {/* Wage Rates Section: Configured vs Not Configured */}
                  <div className="mb-4">
                    {isWageConfigured ? (
                      <div className="p-3 bg-indigo-50/40 rounded-xl border border-indigo-100/70">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-500 mb-2">
                          <span className="flex items-center gap-1 text-indigo-900 font-extrabold">
                            <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
                            Skill Wage Rates
                          </span>
                          <span className="text-[10px] text-indigo-600 font-medium">Daily Basic</span>
                        </div>
                        <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
                          <div className="bg-white py-1 px-1 rounded-lg border border-slate-200/60 shadow-2xs">
                            <span className="block text-[9px] text-slate-400 font-sans font-medium">Unskilled</span>
                            <span className="text-[11px] font-bold text-slate-800">₹{company.wageParticulars?.unskilled?.basicWage || 0}</span>
                          </div>
                          <div className="bg-white py-1 px-1 rounded-lg border border-slate-200/60 shadow-2xs">
                            <span className="block text-[9px] text-slate-400 font-sans font-medium">Skilled</span>
                            <span className="text-[11px] font-bold text-indigo-700">₹{company.wageParticulars?.skilled?.basicWage || 0}</span>
                          </div>
                          <div className="bg-white py-1 px-1 rounded-lg border border-slate-200/60 shadow-2xs">
                            <span className="block text-[9px] text-slate-400 font-sans font-medium">High</span>
                            <span className="text-[11px] font-bold text-purple-700">₹{company.wageParticulars?.highlySkilled?.basicWage || 0}</span>
                          </div>
                          <div className="bg-white py-1 px-1 rounded-lg border border-slate-200/60 shadow-2xs">
                            <span className="block text-[9px] text-slate-400 font-sans font-medium">Super</span>
                            <span className="text-[11px] font-bold text-emerald-700">₹{company.wageParticulars?.superSkilled?.basicWage || 0}</span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="p-3 bg-slate-50/80 rounded-xl border border-dashed border-slate-200 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2 text-slate-500">
                          <DollarSign className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                          <span className="text-[11px] font-medium text-slate-600">Wage rates not entered</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => openCompanyDetails(company, 'wages')}
                          className="text-[11px] font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 hover:underline cursor-pointer"
                        >
                          + Set Wages
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Supervisors & Workforce Counters */}
                  <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <div className="flex items-center gap-1.5 text-slate-600" title={`${supervisorCount} Assigned Supervisors`}>
                      <Users className="w-4 h-4 text-indigo-500" />
                      <span>{supervisorCount} Supervisor{supervisorCount === 1 ? '' : 's'}</span>
                    </div>

                    <div className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-100" title="Active registered workforce">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{workerCount} Workers</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 mt-3.5 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => openCompanyDetails(company)}
                      className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-600 text-xs font-bold transition-all cursor-pointer border border-slate-200/50 hover:border-indigo-200"
                      title="View Company Panel & Wages"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => openEditCompany(company)}
                      className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold transition-all cursor-pointer border border-slate-200/50 hover:border-slate-300"
                      title="Edit Company Details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteCompany(company._id, company.companyName)}
                      className="flex items-center justify-center gap-1 py-2 px-2.5 rounded-xl bg-slate-50 hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold transition-all cursor-pointer border border-slate-200/50 hover:border-rose-200"
                      title="Delete Company"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {totalFiltered > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-2xl border border-slate-200/90 p-4 shadow-xs">
          {/* Page Info & Items per page */}
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <span>
              Showing <strong className="text-slate-900">{Math.min(totalFiltered, (currentPage - 1) * itemsPerPage + 1)}</strong> to{' '}
              <strong className="text-slate-900">{Math.min(totalFiltered, currentPage * itemsPerPage)}</strong> of{' '}
              <strong className="text-slate-900">{totalFiltered}</strong> companies
            </span>

            <div className="flex items-center gap-1.5 ml-2 border-l border-slate-200 pl-3">
              <span className="text-slate-400">Per page:</span>
              <select
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(Number(e.target.value))}
                className="bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none cursor-pointer"
              >
                <option value={6}>6</option>
                <option value={9}>9</option>
                <option value={12}>12</option>
                <option value={24}>24</option>
              </select>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Prev</span>
            </button>

            {/* Page Number Pills */}
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(page => {
                  return page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1;
                })
                .map((page, idx, arr) => {
                  const prev = arr[idx - 1];
                  const showEllipsis = prev && page - prev > 1;

                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && (
                        <span className="px-1 text-slate-400 text-xs font-bold">...</span>
                      )}
                      <button
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        className={`w-8 h-8 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center ${
                          currentPage === page
                            ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30'
                            : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/60'
                        }`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ======================================================== */}
      {/* REGISTRATION SLIDE-OVER DRAWER (COMPACT & CLEAN 1-2 ROW) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Liquid Glass Backdrop Blur */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-slate-950/35 backdrop-blur-md"
              onClick={() => setIsRegisterModalOpen(false)}
            />

            {/* Slide-over Right Drawer Container - Decreased Width (max-w-md sm:max-w-lg) */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 pointer-events-none z-10">
              <motion.div
                initial={{ x: '100%', opacity: 0.7 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                className="w-screen max-w-md sm:max-w-xl pointer-events-auto h-full flex flex-col relative overflow-hidden liquid-glass-drawer text-slate-800"
              >
                {/* Ambient Liquid Aura Lights (Glowing Liquid Morphism) */}
                <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/15 blur-3xl pointer-events-none animate-liquid-float" />
                <div className="absolute top-1/2 -left-28 w-72 h-72 rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/15 to-indigo-400/15 blur-3xl pointer-events-none animate-liquid-float-reverse" />

                {/* Header (Liquid Glass) */}
                <div className="relative z-20 px-6 py-4 bg-white/60 backdrop-blur-xl border-b border-white/70 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-700 text-white flex items-center justify-center shadow-md shadow-indigo-600/30 flex-shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                          {editingCompanyId ? 'Edit Company Profile' : 'Register New Company'}
                        </h2>
                        {formData.companyCode && (
                          <span className="px-2 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-[10px] font-black border border-indigo-200/60 shadow-xs">
                            {formData.companyCode}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Set company profile, credentials & worker skill wage grid
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="p-2 rounded-2xl bg-white/60 hover:bg-white text-slate-500 hover:text-slate-900 border border-white/80 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                    title="Close Drawer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Registration Step / Tab Switcher */}
                <div className="relative z-20 px-6 py-2.5 bg-white/40 backdrop-blur-md border-b border-white/60 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('profile')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'profile'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900 border border-white/80'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>1. Company Profile</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab('wages')}
                    className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      activeTab === 'wages'
                        ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                        : 'bg-white/70 text-slate-600 hover:bg-white hover:text-slate-900 border border-white/80'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>2. Worker Wages</span>
                    {hasConfiguredWages(formData.wageParticulars) ? (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 ring-2 ring-emerald-200"></span>
                    ) : (
                      <span className="text-[10px] opacity-75 font-normal">(Optional)</span>
                    )}
                  </button>
                </div>

                {/* Form Body */}
                <form id="company-form" onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 space-y-4 relative z-10">
                  {formError && (
                    <div className="p-3.5 bg-rose-50/90 border border-rose-200 text-rose-700 rounded-2xl text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-xs">
                      <AlertCircle className="w-4 h-4 flex-shrink-0" />
                      <span>{formError}</span>
                    </div>
                  )}

                  {formSuccess && (
                    <div className="p-3.5 bg-emerald-50/90 border border-emerald-200 text-emerald-700 rounded-2xl text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-xs">
                      <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                      <span>{formSuccess}</span>
                    </div>
                  )}

                  {/* TAB 1: COMPANY PROFILE */}
                  {activeTab === 'profile' && (
                    <div className="space-y-4">
                      {/* 1 per row: Company Logo Upload Card */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1.5">Company Logo</label>
                        <div className="flex items-center gap-3.5 p-3 liquid-glass-panel rounded-2xl border border-white/80">
                          <div className="w-14 h-14 rounded-xl bg-white border border-indigo-100 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-inner">
                            {logoPreview ? (
                              <img src={logoPreview} alt="Preview" className="w-full h-full object-contain" />
                            ) : (
                              <Building2 className="w-7 h-7 text-indigo-400" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors">
                                <UploadCloud className="w-3.5 h-3.5" />
                                <span>{logoPreview ? 'Change' : 'Upload Logo'}</span>
                                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                              </label>
                              {logoPreview && (
                                <button
                                  type="button"
                                  onClick={() => { setLogoFile(null); setLogoPreview(''); }}
                                  className="px-2.5 py-1 text-xs text-rose-600 hover:text-rose-700 font-bold cursor-pointer"
                                >
                                  Remove
                                </button>
                              )}
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, WebP to Cloudinary</p>
                          </div>
                        </div>
                      </div>

                      {/* 1 per row: Company Name */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Company Name *</label>
                        <input
                          type="text"
                          required
                          value={formData.companyName}
                          onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                          placeholder="e.g. Apex Industrial Works"
                          className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                        />
                      </div>

                      {/* 1 per row: Company Code & Auto Code */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">
                          Company Code * <span className="text-[10px] text-slate-500 font-normal">(Unique Identifier)</span>
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={formData.companyCode}
                            onChange={(e) => setFormData({ ...formData, companyCode: e.target.value.toUpperCase() })}
                            placeholder="CMP-APEX01"
                            className="flex-1 px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-mono font-bold text-indigo-700 uppercase outline-none"
                          />
                          <button
                            type="button"
                            onClick={generateRandomCode}
                            className="px-3.5 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 rounded-xl text-xs font-bold transition-colors whitespace-nowrap cursor-pointer shadow-2xs"
                            title="Auto-Generate Code"
                          >
                            Auto Code
                          </button>
                        </div>
                      </div>

                      {/* 2 per row: Official Email & Phone Number */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Official Email *</label>
                          <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            placeholder="contact@apexworks.com"
                            className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                          <input
                            type="text"
                            value={formData.phoneNumber}
                            onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                            placeholder="+91 9876543210"
                            className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                          />
                        </div>
                      </div>

                      {/* 2 per row: GSTIN & Operational Status */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">GSTIN / CIN / Reg. No.</label>
                          <input
                            type="text"
                            value={formData.registrationNumber}
                            onChange={(e) => setFormData({ ...formData, registrationNumber: e.target.value })}
                            placeholder="36AAAAA0000A1Z5"
                            className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Operational Status</label>
                          <select
                            value={formData.status}
                            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-bold text-slate-900 outline-none"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                      </div>

                      {/* 1 per row: Industry / Domain */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Industry / Domain</label>
                        <input
                          type="text"
                          value={formData.industry}
                          onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                          placeholder="Manufacturing & Staffing"
                          className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                        />
                      </div>

                      {/* 1 per row: Corporate Address */}
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Corporate Address</label>
                        <input
                          type="text"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                          placeholder="Plot 42, Industrial Zone"
                          className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                        />
                      </div>

                      {/* 2 per row: City / District & Pincode */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">City / District</label>
                          <input
                            type="text"
                            value={formData.city}
                            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                            placeholder="Hyderabad"
                            className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-700 mb-1">Pincode</label>
                          <input
                            type="text"
                            value={formData.pincode}
                            onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                            placeholder="500081"
                            className="w-full px-3.5 py-2.5 liquid-glass-input rounded-xl text-xs font-medium text-slate-900 outline-none"
                          />
                        </div>
                      </div>

                      {/* Proceed to Wage Grid Step */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('wages')}
                          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 border border-indigo-200/70 transition-all cursor-pointer shadow-2xs"
                        >
                          <DollarSign className="w-4 h-4 text-indigo-600" />
                          <span>Next: Set Worker Wage Grid (Optional)</span>
                          <ChevronRight className="w-4 h-4 ml-auto" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: WORKER WAGE PARTICULARS (SKILL GRID) */}
                  {activeTab === 'wages' && (
                    <div className="space-y-4">
                      {/* Top Action Bar for Wages */}
                      <div className="flex items-center justify-between p-3 liquid-glass-panel rounded-2xl border border-white/80">
                        <div>
                          <h3 className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                            <DollarSign className="w-4 h-4 text-indigo-600" />
                            Worker Wage Structure
                          </h3>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            Daily basic wage, allowances & OT rates per skill tier
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={handleFillRegistrationStandardRates}
                            className="px-2.5 py-1.5 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Auto-fill recommended standard rates"
                          >
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span>Template</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleClearRegistrationWages}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-600 text-[11px] font-bold border border-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
                            title="Reset all rates to 0"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>Clear</span>
                          </button>
                        </div>
                      </div>

                      {/* 4 Standard Skill Tiers */}
                      <div className="space-y-3">
                        {[
                          { key: 'unskilled', label: 'Unskilled Worker', desc: 'Helpers, general labor, loaders', badgeColor: 'bg-slate-100 text-slate-700 border-slate-200' },
                          { key: 'skilled', label: 'Skilled Worker', desc: 'Machinists, certified operators, welders', badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200/80' },
                          { key: 'highlySkilled', label: 'Highly Skilled', desc: 'Senior technicians, supervisors, electricians', badgeColor: 'bg-purple-50 text-purple-700 border-purple-200/80' },
                          { key: 'superSkilled', label: 'Super Skilled', desc: 'Toolmakers, specialists, CNC masters', badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200/80' }
                        ].map(({ key, label, desc, badgeColor }) => {
                          const tierData = formData.wageParticulars?.[key] || { basicWage: 0, hraDa: 0, overtimeRatePerHour: 0, monthlyWage: 0 };
                          return (
                            <div key={key} className="p-3.5 liquid-glass-panel rounded-2xl border border-white/80 space-y-2.5 shadow-2xs">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md border ${badgeColor}`}>
                                    {label}
                                  </span>
                                  <span className="text-[10px] text-slate-400 hidden sm:inline">{desc}</span>
                                </div>
                                <div className="text-[11px] font-bold text-slate-700 bg-white/70 px-2.5 py-0.5 rounded-lg border border-slate-200/60 shadow-2xs">
                                  Monthly: <span className="text-indigo-700 font-extrabold font-mono">₹{(tierData.monthlyWage || 0).toLocaleString()}</span>
                                </div>
                              </div>

                              <div className="grid grid-cols-3 gap-2">
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 mb-1">Basic / Day (₹)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={tierData.basicWage || ''}
                                    onChange={(e) => handleWageChange(key, 'basicWage', e.target.value)}
                                    placeholder="0"
                                    className="w-full px-2.5 py-1.5 liquid-glass-input rounded-xl text-xs font-mono font-bold text-slate-800 outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 mb-1">HRA/DA / Day (₹)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={tierData.hraDa || ''}
                                    onChange={(e) => handleWageChange(key, 'hraDa', e.target.value)}
                                    placeholder="0"
                                    className="w-full px-2.5 py-1.5 liquid-glass-input rounded-xl text-xs font-mono font-bold text-slate-800 outline-none"
                                  />
                                </div>
                                <div>
                                  <label className="block text-[10px] font-bold text-slate-500 mb-1">OT Rate / Hr (₹)</label>
                                  <input
                                    type="number"
                                    min="0"
                                    step="1"
                                    value={tierData.overtimeRatePerHour || ''}
                                    onChange={(e) => handleWageChange(key, 'overtimeRatePerHour', e.target.value)}
                                    placeholder="0"
                                    className="w-full px-2.5 py-1.5 liquid-glass-input rounded-xl text-xs font-mono font-bold text-slate-800 outline-none"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Custom Wage Tiers Section */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-2">
                          <label className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5">
                            <span>Custom Specialty Tiers</span>
                            {formData.wageParticulars?.customTiers?.length > 0 && (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 font-bold">
                                {formData.wageParticulars.customTiers.length}
                              </span>
                            )}
                          </label>
                          <button
                            type="button"
                            onClick={addCustomWageTier}
                            className="px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200/60 transition-colors flex items-center gap-1 cursor-pointer"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add Tier</span>
                          </button>
                        </div>

                        {formData.wageParticulars?.customTiers?.length > 0 ? (
                          <div className="space-y-2.5">
                            {formData.wageParticulars.customTiers.map((tier, idx) => (
                              <div key={idx} className="p-3 bg-purple-50/40 rounded-xl border border-purple-100 space-y-2">
                                <div className="flex items-center gap-2">
                                  <input
                                    type="text"
                                    value={tier.title || ''}
                                    onChange={(e) => handleCustomWageChange(idx, 'title', e.target.value)}
                                    placeholder="Role Title (e.g. Forklift Driver)"
                                    className="flex-1 px-2.5 py-1.5 bg-white border border-purple-200 rounded-lg text-xs font-bold text-slate-800 outline-none"
                                  />
                                  <span className="text-[10px] text-purple-700 font-mono font-bold whitespace-nowrap">
                                    ₹{(tier.monthlyWage || 0).toLocaleString()}/mo
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => removeCustomWageTier(idx)}
                                    className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
                                    title="Remove tier"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  <input
                                    type="number"
                                    min="0"
                                    value={tier.basicWage || ''}
                                    onChange={(e) => handleCustomWageChange(idx, 'basicWage', e.target.value)}
                                    placeholder="Basic / Day"
                                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium outline-none"
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    value={tier.hraDa || ''}
                                    onChange={(e) => handleCustomWageChange(idx, 'hraDa', e.target.value)}
                                    placeholder="HRA/DA"
                                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium outline-none"
                                  />
                                  <input
                                    type="number"
                                    min="0"
                                    value={tier.overtimeRatePerHour || ''}
                                    onChange={(e) => handleCustomWageChange(idx, 'overtimeRatePerHour', e.target.value)}
                                    placeholder="OT Rate / Hr"
                                    className="px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-mono font-medium outline-none"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-center text-[11px] text-slate-400">
                            No custom tiers. Standard 4 skill categories are ready above.
                          </div>
                        )}
                      </div>

                      {/* Navigation back to profile */}
                      <div className="pt-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('profile')}
                          className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <ChevronLeft className="w-4 h-4" />
                          <span>Back to Company Profile</span>
                        </button>
                      </div>
                    </div>
                  )}
                </form>

                {/* Sticky Action Footer */}
                <div className="relative z-20 px-6 py-4 bg-white/70 backdrop-blur-2xl border-t border-white/70 flex items-center justify-between shadow-[0_-8px_25px_-5px_rgba(15,23,42,0.06)]">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-white/80 bg-white/60 hover:bg-white text-slate-600 hover:text-slate-900 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    form="company-form"
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Saving Company...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{editingCompanyId ? 'Save Company Changes' : 'Register Company'}</span>
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* ======================================================== */}
      {/* COMPANY PANEL SLIDE-OVER DRAWER (WAGES, SUPERVISORS, ROSTER) */}
      {/* ======================================================== */}
      <AnimatePresence>
        {isDetailModalOpen && selectedCompany && (
          <div className="fixed inset-0 z-50 overflow-hidden">
            {/* Liquid Glass Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="fixed inset-0 bg-slate-950/35 backdrop-blur-md"
              onClick={() => setIsDetailModalOpen(false)}
            />

            {/* Slide-over Right Drawer Container */}
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-4 sm:pl-10 pointer-events-none z-10">
              <motion.div
                initial={{ x: '100%', opacity: 0.7 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: '100%', opacity: 0 }}
                transition={{ type: 'spring', damping: 28, stiffness: 260 }}
                className="w-screen max-w-2xl lg:max-w-3xl pointer-events-auto h-full flex flex-col relative overflow-hidden liquid-glass-drawer text-slate-800"
              >
                {/* Liquid Aurora Background Lights */}
                <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-pink-500/15 blur-3xl pointer-events-none animate-liquid-float" />
                <div className="absolute top-1/2 -left-28 w-80 h-80 rounded-full bg-gradient-to-tr from-cyan-400/20 via-blue-500/15 to-indigo-400/15 blur-3xl pointer-events-none animate-liquid-float-reverse" />

                {/* Company Panel Top Header (Liquid Glass) */}
                <div className="relative z-20 px-6 sm:px-8 py-5 bg-white/60 backdrop-blur-xl border-b border-white/70 flex items-center justify-between shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="w-12 h-12 rounded-2xl liquid-glass-panel border-white/90 flex items-center justify-center overflow-hidden shadow-xs flex-shrink-0">
                      {selectedCompany.logoUrl ? (
                        <img src={selectedCompany.logoUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Building2 className="w-6 h-6 text-indigo-600" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">{selectedCompany.companyName}</h2>
                        <span className="px-2.5 py-0.5 rounded-lg bg-indigo-50 text-indigo-700 font-mono text-xs font-bold border border-indigo-200/50 shadow-2xs">
                          {selectedCompany.companyCode}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        {selectedCompany.email} • {selectedCompany.phoneNumber || 'No phone'} • {selectedCompany.city || 'Location N/A'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="p-2.5 rounded-2xl bg-white/60 hover:bg-white text-slate-500 hover:text-slate-900 border border-white/80 shadow-xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Company Panel Navigation Tabs */}
                <div className="relative z-20 px-6 sm:px-8 pt-3 pb-2 bg-white/40 backdrop-blur-xl border-b border-white/60 flex items-center gap-2 overflow-x-auto">
                  <button
                    type="button"
                    onClick={() => { setPanelTab('overview'); setPanelMessage({ text: '', type: '' }); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                      panelTab === 'overview'
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25'
                        : 'bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-white/70 shadow-2xs'
                    }`}
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Overview</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPanelTab('wages'); setPanelMessage({ text: '', type: '' }); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                      panelTab === 'wages'
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25'
                        : 'bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-white/70 shadow-2xs'
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5" />
                    <span>Skill & Unskilled Wages</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPanelTab('supervisors'); setPanelMessage({ text: '', type: '' }); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                      panelTab === 'supervisors'
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25'
                        : 'bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-white/70 shadow-2xs'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Assign Supervisors</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${panelTab === 'supervisors' ? 'bg-white/20 text-white' : 'bg-indigo-100 text-indigo-700'}`}>
                      {panelSupervisorIds.length}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => { setPanelTab('roster'); setPanelMessage({ text: '', type: '' }); }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all relative flex items-center gap-1.5 cursor-pointer ${
                      panelTab === 'roster'
                        ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/25'
                        : 'bg-white/50 text-slate-600 hover:text-slate-900 hover:bg-white/80 border border-white/70 shadow-2xs'
                    }`}
                  >
                    <Briefcase className="w-3.5 h-3.5" />
                    <span>Workforce Roster</span>
                    <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${panelTab === 'roster' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'}`}>
                      {companyWorkforce.length}
                    </span>
                  </button>
                </div>

                {/* Company Panel Body */}
                <div className="flex-1 overflow-y-auto px-6 sm:px-8 py-6 space-y-6 relative z-10">
                  {panelMessage.text && (
                    <div className={`p-3.5 rounded-2xl border text-xs font-bold flex items-center gap-2 backdrop-blur-md shadow-xs ${
                      panelMessage.type === 'success' ? 'bg-emerald-50/90 border-emerald-200 text-emerald-700' : 'bg-rose-50/90 border-rose-200 text-rose-700'
                    }`}>
                      {panelMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 flex-shrink-0" /> : <AlertCircle className="w-4 h-4 flex-shrink-0" />}
                      <span>{panelMessage.text}</span>
                    </div>
                  )}

                  {/* TAB 1: OVERVIEW */}
                  {panelTab === 'overview' && (
                    <div className="space-y-5">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl liquid-glass-panel">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Corporate Credentials</span>
                          <div className="mt-2 space-y-1.5 text-xs text-slate-700">
                            <div><strong>GSTIN / CIN:</strong> {selectedCompany.registrationNumber || 'Not configured'}</div>
                            <div><strong>Industry:</strong> {selectedCompany.industry || 'Staffing'}</div>
                            <div><strong>Operational Status:</strong> <span className="font-bold text-emerald-600">{selectedCompany.status || 'Active'}</span></div>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl liquid-glass-panel">
                          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Address & Contact</span>
                          <div className="mt-2 space-y-1.5 text-xs text-slate-700">
                            <div><strong>Address:</strong> {selectedCompany.address || 'N/A'}</div>
                            <div><strong>City / Pincode:</strong> {selectedCompany.city || 'N/A'} {selectedCompany.pincode ? `(${selectedCompany.pincode})` : ''}</div>
                            <div><strong>Official Email:</strong> {selectedCompany.email}</div>
                          </div>
                        </div>
                      </div>

                      {/* Portal Access & Default Password Callout */}
                      <div className="p-4 rounded-2xl liquid-glass-panel border-indigo-200/70 bg-gradient-to-r from-indigo-50/50 via-white/80 to-purple-50/30">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[11px] font-bold text-indigo-950 uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
                            <span>Client Organization Portal Credentials</span>
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            Active Portal Role
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1 text-xs text-slate-700">
                          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                            <span className="block text-[10px] text-slate-400 uppercase font-bold">Portal URL</span>
                            <span className="font-mono text-indigo-700 font-bold">/company/login</span>
                          </div>
                          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                            <span className="block text-[10px] text-slate-400 uppercase font-bold">Login Identifier</span>
                            <span className="font-mono text-slate-900 font-bold truncate block" title={selectedCompany.companyCode}>
                              {selectedCompany.companyCode} or Email
                            </span>
                          </div>
                          <div className="bg-white/80 p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                            <span className="block text-[10px] text-slate-400 uppercase font-bold">Default Password</span>
                            <code className="text-indigo-700 font-mono font-bold">Company@123</code>
                          </div>
                        </div>
                      </div>

                      {/* Quick Jump Action Cards */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div
                          onClick={() => setPanelTab('wages')}
                          className="p-4 rounded-2xl liquid-glass-panel border-indigo-200/60 hover:border-indigo-400 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                              <DollarSign className="w-4 h-4" />
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                          <h4 className="text-xs font-bold text-slate-900">Manage Skill-Wise Wage Grid</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Configure daily basic, HRA/DA & OT rates for unskilled, skilled & custom worker tiers.
                          </p>
                        </div>

                        <div
                          onClick={() => setPanelTab('supervisors')}
                          className="p-4 rounded-2xl liquid-glass-panel border-indigo-200/60 hover:border-indigo-400 cursor-pointer transition-all group"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                              <Users className="w-4 h-4" />
                            </div>
                            <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </div>
                          <h4 className="text-xs font-bold text-slate-900">Assign & Manage Supervisors</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            {panelSupervisorIds.length} supervisor(s) currently governing workers under this company.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: SKILL & UNSKILLED WAGES (DIRECTLY EDITABLE IN PANEL) */}
                  {panelTab === 'wages' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-indigo-600" />
                            <span>Skill-wise & Unskilled Wage Grid</span>
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Edit rates below and click <strong>Save Wage Grid</strong> to update. Monthly remuneration is auto-calculated on 26 days/mo.
                          </p>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap justify-end">
                          <button
                            type="button"
                            onClick={handleFillStandardRates}
                            className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                            title="Auto-fill standard government wage guidelines"
                          >
                            Template
                          </button>
                          <button
                            type="button"
                            onClick={handleClearPanelWages}
                            className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all cursor-pointer"
                            title="Clear all wage entries back to 0"
                          >
                            Clear All
                          </button>
                          <button
                            type="button"
                            onClick={handleSavePanelWages}
                            disabled={savingPanelWages}
                            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-bold shadow-md hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 transition-all cursor-pointer"
                          >
                            {savingPanelWages ? (
                              <>
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                <span>Saving...</span>
                              </>
                            ) : (
                              <>
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Save Wage Grid</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Interactive Wages Table */}
                      <div className="overflow-x-auto rounded-2xl border border-white/90 liquid-glass-panel shadow-xs">
                        <table className="w-full text-left border-collapse text-xs">
                          <thead>
                            <tr className="bg-slate-50/80 backdrop-blur-md text-slate-700 font-bold border-b border-slate-200/70">
                              <th className="py-2.5 px-4">Skill Category</th>
                              <th className="py-2.5 px-4">Basic (₹/Day)</th>
                              <th className="py-2.5 px-4">HRA & DA (₹/Day)</th>
                              <th className="py-2.5 px-4">OT Rate (₹/Hr)</th>
                              <th className="py-2.5 px-4">Monthly (26 Days)</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100/80 font-medium">
                            {/* Unskilled */}
                            <tr className="hover:bg-white/60 transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-bold text-slate-800">Unskilled Worker</span>
                                <span className="block text-[10px] text-slate-500">Helpers, loaders, cleaners</span>
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.unskilled?.basicWage || 0}
                                  onChange={(e) => handlePanelWageChange('unskilled', 'basicWage', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-slate-800 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.unskilled?.hraDa || 0}
                                  onChange={(e) => handlePanelWageChange('unskilled', 'hraDa', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-slate-800 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.unskilled?.overtimeRatePerHour || 0}
                                  onChange={(e) => handlePanelWageChange('unskilled', 'overtimeRatePerHour', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-slate-800 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4 font-bold text-indigo-700 font-mono">
                                ₹{(panelWages?.unskilled?.monthlyWage || 0).toLocaleString('en-IN')}
                              </td>
                            </tr>

                            {/* Skilled */}
                            <tr className="hover:bg-white/60 transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-bold text-indigo-900">Skilled Worker</span>
                                <span className="block text-[10px] text-slate-500">Certified technicians, operators</span>
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.skilled?.basicWage || 0}
                                  onChange={(e) => handlePanelWageChange('skilled', 'basicWage', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-indigo-900 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.skilled?.hraDa || 0}
                                  onChange={(e) => handlePanelWageChange('skilled', 'hraDa', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-indigo-900 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.skilled?.overtimeRatePerHour || 0}
                                  onChange={(e) => handlePanelWageChange('skilled', 'overtimeRatePerHour', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-indigo-900 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4 font-bold text-indigo-700 font-mono">
                                ₹{(panelWages?.skilled?.monthlyWage || 0).toLocaleString('en-IN')}
                              </td>
                            </tr>

                            {/* Highly Skilled */}
                            <tr className="hover:bg-white/60 transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-bold text-purple-900">Highly Skilled Worker</span>
                                <span className="block text-[10px] text-slate-500">Master craftsmen, machine leads</span>
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.highlySkilled?.basicWage || 0}
                                  onChange={(e) => handlePanelWageChange('highlySkilled', 'basicWage', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-purple-900 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.highlySkilled?.hraDa || 0}
                                  onChange={(e) => handlePanelWageChange('highlySkilled', 'hraDa', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-purple-900 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.highlySkilled?.overtimeRatePerHour || 0}
                                  onChange={(e) => handlePanelWageChange('highlySkilled', 'overtimeRatePerHour', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-purple-900 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4 font-bold text-purple-700 font-mono">
                                ₹{(panelWages?.highlySkilled?.monthlyWage || 0).toLocaleString('en-IN')}
                              </td>
                            </tr>

                            {/* Super Skilled */}
                            <tr className="hover:bg-white/60 transition-colors">
                              <td className="py-3 px-4">
                                <span className="font-bold text-emerald-900">Super Skilled Worker</span>
                                <span className="block text-[10px] text-slate-500">Foremen, technical specialists</span>
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.superSkilled?.basicWage || 0}
                                  onChange={(e) => handlePanelWageChange('superSkilled', 'basicWage', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-emerald-900 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.superSkilled?.hraDa || 0}
                                  onChange={(e) => handlePanelWageChange('superSkilled', 'hraDa', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-emerald-900 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4">
                                <input
                                  type="number"
                                  min="0"
                                  value={panelWages?.superSkilled?.overtimeRatePerHour || 0}
                                  onChange={(e) => handlePanelWageChange('superSkilled', 'overtimeRatePerHour', e.target.value)}
                                  className="w-24 px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-emerald-900 outline-none"
                                />
                              </td>
                              <td className="py-3 px-4 font-bold text-emerald-700 font-mono">
                                ₹{(panelWages?.superSkilled?.monthlyWage || 0).toLocaleString('en-IN')}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {/* Custom Tiers in Panel */}
                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="text-xs font-bold text-slate-900">Custom Wage Tiers for this Client</h4>
                            <p className="text-[11px] text-slate-500">Specialized roles unique to this enterprise (e.g. Crane Operator, Safety Lead).</p>
                          </div>
                          <button
                            type="button"
                            onClick={addCustomPanelWageTier}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/60 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Add Tier</span>
                          </button>
                        </div>

                        {(!panelWages?.customTiers || panelWages.customTiers.length === 0) ? (
                          <p className="text-xs text-slate-400 italic liquid-glass-panel p-3 rounded-xl">
                            No custom tiers defined. Click "+ Add Tier" if this company has custom job scales.
                          </p>
                        ) : (
                          <div className="space-y-2.5">
                            {panelWages.customTiers.map((tier, idx) => (
                              <div key={idx} className="p-3 liquid-glass-panel rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                                <div className="flex-1 min-w-[130px]">
                                  <input
                                    type="text"
                                    value={tier.title}
                                    onChange={(e) => handleCustomPanelWageChange(idx, 'title', e.target.value)}
                                    placeholder="Role Title"
                                    className="w-full px-2.5 py-1.5 liquid-glass-input rounded-lg text-xs font-bold text-slate-800 outline-none"
                                  />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-slate-500">Basic:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={tier.basicWage}
                                    onChange={(e) => handleCustomPanelWageChange(idx, 'basicWage', e.target.value)}
                                    className="w-20 px-2 py-1.5 liquid-glass-input rounded-lg text-xs font-bold"
                                  />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-slate-500">HRA:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={tier.hraDa}
                                    onChange={(e) => handleCustomPanelWageChange(idx, 'hraDa', e.target.value)}
                                    className="w-20 px-2 py-1.5 liquid-glass-input rounded-lg text-xs font-bold"
                                  />
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[10px] text-slate-500">OT/Hr:</span>
                                  <input
                                    type="number"
                                    min="0"
                                    value={tier.overtimeRatePerHour}
                                    onChange={(e) => handleCustomPanelWageChange(idx, 'overtimeRatePerHour', e.target.value)}
                                    className="w-20 px-2 py-1.5 liquid-glass-input rounded-lg text-xs font-bold"
                                  />
                                </div>
                                <div className="text-right font-mono font-bold text-indigo-700 text-xs min-w-[80px]">
                                  ₹{(tier.monthlyWage || 0).toLocaleString('en-IN')}
                                </div>
                                <button
                                  type="button"
                                  onClick={() => removeCustomPanelWageTier(idx)}
                                  className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg cursor-pointer"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* TAB 3: ASSIGN SUPERVISORS (DIRECTLY EDITABLE IN PANEL) */}
                  {panelTab === 'supervisors' && (
                    <div className="space-y-5">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                            <Users className="w-4 h-4 text-indigo-600" />
                            <span>Assign Supervisors to {selectedCompany.companyName}</span>
                          </h4>
                          <p className="text-[11px] text-slate-500 mt-0.5">
                            Supervisors checked here can register and govern workers under Company Code <strong>{selectedCompany.companyCode}</strong>.
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={handleSavePanelSupervisors}
                          disabled={savingPanelSupervisors}
                          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-bold shadow-md hover:from-indigo-700 hover:to-indigo-800 disabled:opacity-50 transition-all cursor-pointer"
                        >
                          {savingPanelSupervisors ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>Saving...</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Save Assigned Supervisors</span>
                            </>
                          )}
                        </button>
                      </div>

                      {supervisors.length === 0 ? (
                        <p className="p-4 liquid-glass-panel rounded-2xl text-xs text-slate-500">
                          No registered supervisors in system yet.
                        </p>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-96 overflow-y-auto p-1">
                          {supervisors.map((sup) => {
                            const isSelected = panelSupervisorIds.includes(sup._id);
                            return (
                              <div
                                key={sup._id}
                                onClick={() => {
                                  setPanelSupervisorIds(prev =>
                                    isSelected ? prev.filter(id => id !== sup._id) : [...prev, sup._id]
                                  );
                                }}
                                className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                                  isSelected
                                    ? 'bg-indigo-50/90 border-indigo-400 shadow-xs ring-2 ring-indigo-500/20'
                                    : 'bg-white/60 hover:bg-white border-white/80 hover:border-slate-300 shadow-2xs'
                                }`}
                              >
                                <div className="min-w-0 pr-2">
                                  <p className="text-xs font-bold text-slate-900 truncate">{sup.name}</p>
                                  <p className="text-[11px] text-slate-500 truncate">{sup.email}</p>
                                  <span className="inline-block mt-0.5 text-[9px] font-mono text-indigo-700 bg-indigo-50/80 px-2 py-0.5 rounded border border-indigo-100">
                                    {sup.supervisorId}
                                  </span>
                                </div>
                                <div className={`w-5 h-5 rounded-lg border flex items-center justify-center flex-shrink-0 transition-colors ${
                                  isSelected ? 'bg-indigo-600 border-indigo-600 text-white' : 'border-slate-300 bg-white'
                                }`}>
                                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  )}

                  {/* TAB 4: WORKFORCE ROSTER */}
                  {panelTab === 'roster' && (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                          <Briefcase className="w-4 h-4 text-indigo-600" />
                          <span>Workforce Roster ({companyWorkforce.length})</span>
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-0.5">
                          Workers currently enrolled under Company Code <strong>{selectedCompany.companyCode}</strong>.
                        </p>
                      </div>

                      {loadingWorkforce ? (
                        <div className="p-8 text-center liquid-glass-panel rounded-2xl">
                          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mx-auto" />
                        </div>
                      ) : companyWorkforce.length === 0 ? (
                        <p className="text-xs text-slate-500 italic liquid-glass-panel p-4 rounded-2xl">
                          No workers enrolled yet under this company code. Supervisors can enroll workers from the Supervisor Portal.
                        </p>
                      ) : (
                        <div className="overflow-x-auto rounded-2xl border border-white/90 liquid-glass-panel shadow-xs">
                          <table className="w-full text-left border-collapse text-xs">
                            <thead>
                              <tr className="bg-slate-50/80 backdrop-blur-md text-slate-700 font-bold border-b border-slate-200/70">
                                <th className="py-2.5 px-4">Worker ID & Name</th>
                                <th className="py-2.5 px-4">Contact</th>
                                <th className="py-2.5 px-4">Skill Tier</th>
                                <th className="py-2.5 px-4">Monthly Gross</th>
                                <th className="py-2.5 px-4">Enrolled On</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100/80 font-medium">
                              {companyWorkforce.map((emp) => (
                                <tr key={emp._id} className="hover:bg-white/50 transition-colors">
                                  <td className="py-2.5 px-4">
                                    <span className="font-bold text-slate-900">{emp.name}</span>
                                    <span className="block text-[10px] font-mono text-indigo-600">{emp.employeeId}</span>
                                  </td>
                                  <td className="py-2.5 px-4 text-slate-600">
                                    <div>{emp.email}</div>
                                    <div className="text-[10px] text-slate-400">{emp.phoneNumber || '-'}</div>
                                  </td>
                                  <td className="py-2.5 px-4">
                                    <span className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 font-bold text-[11px] border border-indigo-100">
                                      {emp.skillLevel || emp.skillType || 'Skilled'}
                                    </span>
                                  </td>
                                  <td className="py-2.5 px-4 font-bold text-emerald-700 font-mono">
                                    ₹{emp.wageParticulars?.monthlyWage ? Number(emp.wageParticulars.monthlyWage).toLocaleString('en-IN') : 'N/A'}
                                  </td>
                                  <td className="py-2.5 px-4 text-slate-400 text-[11px]">
                                    {new Date(emp.createdAt).toLocaleDateString()}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Company Panel Sticky Footer */}
                <div className="relative z-20 px-6 sm:px-8 py-4 bg-white/70 backdrop-blur-2xl border-t border-white/70 flex justify-end shadow-[0_-8px_25px_-5px_rgba(15,23,42,0.06)]">
                  <button
                    onClick={() => setIsDetailModalOpen(false)}
                    className="px-5 py-2.5 rounded-xl bg-slate-200/80 hover:bg-slate-300 text-slate-800 font-bold text-xs shadow-2xs transition-all cursor-pointer"
                  >
                    Close Panel
                  </button>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default CompanyManagement;
