import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../pages/Home';
import About from '../pages/About';
import Features from '../pages/Features';
import Contact from '../pages/Contact';
import AdminLayout from '../layouts/AdminLayout';
import Dashboard from '../pages/admin/Dashboard';
import AdminLogin from '../pages/admin/AdminLogin';
import Profile from '../pages/admin/Profile';
import Settings from '../pages/admin/Settings';
import SupervisorManagement from '../pages/admin/SupervisorManagement';
import ConsultantManagement from '../pages/admin/ConsultantManagement';
import CompanyManagement from '../pages/admin/CompanyManagement';
import UserManagement from '../pages/admin/UserManagement';
import EmployeeManagement from '../pages/supervisor/EmployeeManagement';

// Supervisor Routes
import SupervisorLayout from '../layouts/SupervisorLayout';
import SupervisorLogin from '../pages/supervisor/SupervisorLogin';
import SupervisorDashboard from '../pages/supervisor/SupervisorDashboard';
import AddEmployee from '../pages/supervisor/AddEmployee';

// Consultant Routes
import ConsultantLayout from '../layouts/ConsultantLayout';
import ConsultantLogin from '../pages/consultant/ConsultantLogin';
import ConsultantDashboard from '../pages/consultant/ConsultantDashboard';

// Employee Routes
import EmployeeLayout from '../layouts/EmployeeLayout';
import EmployeeLogin from '../pages/employee/EmployeeLogin';
import EmployeeDashboard from '../pages/employee/EmployeeDashboard';

// Company Routes
import CompanyLayout from '../layouts/CompanyLayout';
import CompanyLogin from '../pages/company/CompanyLogin';
import CompanyDashboard from '../pages/company/CompanyDashboard';
import CompanyWorkforce from '../pages/company/CompanyWorkforce';
import CompanySupervisors from '../pages/company/CompanySupervisors';
import CompanyWageParticulars from '../pages/company/CompanyWageParticulars';

// Auth Routes (Generic)
import ForgotPassword from '../pages/auth/ForgotPassword';
import ResetPassword from '../pages/auth/ResetPassword';
const MainLayout = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-grow flex flex-col">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const AppRouter = () => {
  return (
    <Router>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/features" element={<Features />} />
          <Route path="/contact" element={<Contact />} />
          
          {/* Supervisor Login & Recovery */}
          <Route path="/supervisor/login" element={<SupervisorLogin />} />
          <Route path="/supervisor/forgot-password" element={<ForgotPassword role="supervisor" />} />
          <Route path="/supervisor/reset-password/:token" element={<ResetPassword role="supervisor" />} />
          
          {/* Employee Login & Recovery */}
          <Route path="/employee/login" element={<EmployeeLogin />} />
          <Route path="/employee/forgot-password" element={<ForgotPassword role="employee" />} />
          <Route path="/employee/reset-password/:token" element={<ResetPassword role="employee" />} />

          {/* Company Login & Recovery */}
          <Route path="/company/login" element={<CompanyLogin />} />
          <Route path="/company/forgot-password" element={<ForgotPassword role="company" />} />
          <Route path="/company/reset-password/:token" element={<ResetPassword role="company" />} />
        </Route>        
        {/* Admin Login & Recovery */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword role="admin" />} />
        <Route path="/admin/reset-password/:token" element={<ResetPassword role="admin" />} />

        {/* Consultant Login & Recovery */}
        <Route path="/consultant/login" element={<ConsultantLogin />} />
        <Route path="/consultant/forgot-password" element={<ForgotPassword role="consultant" />} />
        <Route path="/consultant/reset-password/:token" element={<ResetPassword role="consultant" />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="supervisors" element={<SupervisorManagement />} />
          <Route path="consultants" element={<ConsultantManagement />} />
          <Route path="companies" element={<CompanyManagement />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Supervisor Routes */}
        <Route path="/supervisor" element={<SupervisorLayout />}>
          <Route path="dashboard" element={<SupervisorDashboard />} />
          <Route path="employees" element={<EmployeeManagement />} />
          <Route path="employees/add" element={<AddEmployee />} />
        </Route>

        {/* Consultant Routes */}
        <Route path="/consultant" element={<ConsultantLayout />}>
          <Route path="dashboard" element={<ConsultantDashboard />} />
        </Route>

        {/* Employee Routes */}
        <Route path="/employee" element={<EmployeeLayout />}>
          <Route path="dashboard" element={<EmployeeDashboard />} />
        </Route>

        {/* Company Routes */}
        <Route path="/company" element={<CompanyLayout />}>
          <Route path="dashboard" element={<CompanyDashboard />} />
          <Route path="workforce" element={<CompanyWorkforce />} />
          <Route path="supervisors" element={<CompanySupervisors />} />
          <Route path="wages" element={<CompanyWageParticulars />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default AppRouter;
