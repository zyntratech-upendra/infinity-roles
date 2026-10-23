import React from 'react';
import { motion } from 'framer-motion';

/**
 * 1. Workforce & Role Hierarchy Master Illustration
 * Rich, colorful, modern vector artwork showing multi-tier role orchestration,
 * avatars, shield security, floating status markers, and solid clean lines.
 */
export const HierarchyIllustration = ({ className = 'w-full h-auto max-w-xl' }) => {
  return (
    <svg viewBox="0 0 560 440" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Decorative soft architectural backdrop plate */}
      <rect x="15" y="15" width="530" height="410" rx="28" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />
      
      {/* Circuit / Matrix Grid Points */}
      <g opacity="0.35">
        {[60, 130, 200, 280, 360, 430, 500].map((x) =>
          [50, 110, 170, 230, 290, 350, 400].map((y) => (
            <circle key={`pt-${x}-${y}`} cx={x} cy={y} r="1.5" fill="#94A3B8" />
          ))
        )}
      </g>

      {/* Dynamic Data Highway Connections */}
      <path d="M280 120 V165 H145 V210" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 5" />
      <path d="M280 165 H415 V210" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeDasharray="5 5" />
      <path d="M145 285 V315 H80 V340" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <path d="M145 315 H210 V340" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
      <path d="M415 285 V340" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />

      {/* TOP: Admin Root Hub (Crown of Hierarchy) */}
      <g transform="translate(180, 45)">
        {/* Soft shadow plate */}
        <rect width="200" height="75" rx="20" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="2" filter="drop-shadow(0 6px 16px rgba(79, 70, 229, 0.12))" />
        
        {/* Admin Avatar Circle */}
        <rect x="16" y="16" width="44" height="44" rx="14" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.5" />
        {/* Shield Icon */}
        <path d="M38 27 L47 31 V40 C47 45 38 49 38 49 C38 49 29 45 29 40 V31 L38 27 Z" fill="#4F46E5" />
        <path d="M34 38 L37 41 L43 35" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />

        {/* Admin Text */}
        <text x="70" y="37" fill="#0F172A" fontFamily="Outfit, sans-serif" fontSize="14" fontWeight="800">Main Admin</text>
        <text x="70" y="52" fill="#4F46E5" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700">PLATFORM GOVERNANCE</text>
        
        {/* Verified Shield Node */}
        <circle cx="188" cy="16" r="7" fill="#059669" />
        <path d="M185 16 L187 18 L191 14" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
      </g>

      {/* MIDDLE LEFT: Supervisor (Shift & Roster Command) */}
      <g transform="translate(45, 210)">
        <rect width="200" height="75" rx="18" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.8" filter="drop-shadow(0 4px 14px rgba(2, 132, 199, 0.10))" />
        
        {/* Supervisor Avatar */}
        <rect x="14" y="15" width="44" height="44" rx="14" fill="#E0F2FE" stroke="#BAE6FD" strokeWidth="1.5" />
        <circle cx="36" cy="31" r="7" fill="#0284C7" />
        <path d="M25 48 C25 42 30 39 36 39 C42 39 47 42 47 48" fill="#0284C7" />

        <text x="68" y="36" fill="#0F172A" fontFamily="Outfit, sans-serif" fontSize="13" fontWeight="800">Supervisor</text>
        <text x="68" y="51" fill="#0284C7" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700">SHIFT & ATTENDANCE</text>

        {/* Live Badge */}
        <rect x="135" y="10" width="55" height="18" rx="9" fill="#E0F2FE" />
        <text x="162" y="22" fill="#0369A1" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="8" fontWeight="800" textAnchor="middle">ON DUTY</text>
      </g>

      {/* MIDDLE RIGHT: Consultant (Auditing & Review) */}
      <g transform="translate(315, 210)">
        <rect width="200" height="75" rx="18" fill="#FFFFFF" stroke="#7C3AED" strokeWidth="1.8" filter="drop-shadow(0 4px 14px rgba(124, 58, 237, 0.10))" />
        
        {/* Consultant Avatar */}
        <rect x="14" y="15" width="44" height="44" rx="14" fill="#F5F3FF" stroke="#DDD6FE" strokeWidth="1.5" />
        <rect x="27" y="29" width="18" height="15" rx="3" fill="#7C3AED" />
        <path d="M32 29 V27 C32 25.5 33.5 24 36 24 C38.5 24 40 25.5 40 27 V29" stroke="#7C3AED" strokeWidth="1.6" />

        <text x="68" y="36" fill="#0F172A" fontFamily="Outfit, sans-serif" fontSize="13" fontWeight="800">Consultant</text>
        <text x="68" y="51" fill="#7C3AED" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700">AUDIT & COMPLIANCE</text>

        {/* External Badge */}
        <rect x="135" y="10" width="55" height="18" rx="9" fill="#F5F3FF" />
        <text x="162" y="22" fill="#6D28D9" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="8" fontWeight="800" textAnchor="middle">SCOPED</text>
      </g>

      {/* BOTTOM ROW: Workforce Nodes & Projects */}
      {/* Employee 1 */}
      <g transform="translate(30, 340)">
        <rect width="105" height="50" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
        <circle cx="24" cy="25" r="8" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
        <text x="40" y="26" fill="#0F172A" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700">Staff Alpha</text>
        <text x="40" y="38" fill="#059669" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9" fontWeight="600">● Clocked In</text>
      </g>

      {/* Employee 2 */}
      <g transform="translate(155, 340)">
        <rect width="105" height="50" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
        <circle cx="24" cy="25" r="8" fill="#F1F5F9" stroke="#64748B" strokeWidth="1.5" />
        <text x="40" y="26" fill="#0F172A" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700">Staff Beta</text>
        <text x="40" y="38" fill="#059669" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9" fontWeight="600">● Clocked In</text>
      </g>

      {/* Audit Engagement Box */}
      <g transform="translate(345, 340)">
        <rect width="140" height="50" rx="12" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1.2" />
        <rect x="14" y="15" width="20" height="20" rx="6" fill="#ECFDF5" />
        <path d="M20 25 L23 28 L28 22" stroke="#059669" strokeWidth="1.6" strokeLinecap="round" />
        <text x="42" y="26" fill="#0F172A" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700">Q4 Compliance</text>
        <text x="42" y="38" fill="#64748B" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9">Inspection Passed</text>
      </g>

      {/* Floating System Feature Tags */}
      <g transform="translate(40, 60)">
        <rect width="115" height="30" rx="15" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" />
        <circle cx="16" cy="15" r="4" fill="#4F46E5" />
        <text x="26" y="19" fill="#4338CA" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9" fontWeight="800">RBAC ISOLATION</text>
      </g>

      <g transform="translate(390, 60)">
        <rect width="125" height="30" rx="15" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
        <circle cx="16" cy="15" r="4" fill="#059669" />
        <text x="26" y="19" fill="#065F46" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9" fontWeight="800">REAL-TIME SYNCED</text>
      </g>
    </svg>
  );
};

/**
 * 2. Facial Biometric & Geo-Attendance Master Illustration
 * Features high-precision mobile smartphone, facial scanner reticle, 
 * GPS geofence radar, map pin, live verification status, and attendance check-in.
 */
export const AttendanceIllustration = ({ className = 'w-full h-auto max-w-xl' }) => {
  return (
    <svg viewBox="0 0 560 440" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Decorative backdrop plate */}
      <rect x="15" y="15" width="530" height="410" rx="28" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Geofence Radar Concentric Rings */}
      <g transform="translate(380, 200)">
        <circle cx="0" cy="0" r="130" stroke="#0284C7" strokeWidth="1" strokeDasharray="6 6" opacity="0.3" />
        <circle cx="0" cy="0" r="85" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5" />
        <circle cx="0" cy="0" r="40" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
        {/* Map Pin Target */}
        <path d="M0 -14 C-7 -14 -12 -9 -12 -2 C-12 6 0 16 0 16 C0 16 12 6 12 -2 C12 -9 7 -14 0 -14 Z" fill="#0284C7" />
        <circle cx="0" cy="-3" r="4" fill="#FFFFFF" />
      </g>

      {/* Main Smartphone Device Container */}
      <g transform="translate(70, 45)">
        {/* Phone Body */}
        <rect width="240" height="345" rx="32" fill="#FFFFFF" stroke="#0F172A" strokeWidth="3" filter="drop-shadow(0 12px 24px rgba(15, 23, 42, 0.08))" />
        
        {/* Speaker notch */}
        <rect x="90" y="12" width="60" height="5" rx="2.5" fill="#E2E8F0" />

        {/* Camera Face Scanning Screen Canvas */}
        <rect x="16" y="28" width="208" height="230" rx="18" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1" />
        
        {/* Soft Background Mesh on Phone */}
        <g opacity="0.2">
          {[36, 68, 100, 132, 164, 196].map((x) =>
            [48, 80, 112, 144, 176, 208, 240].map((y) => (
              <circle key={`ph-grid-${x}-${y}`} cx={x} cy={y} r="1.5" fill="#4F46E5" />
            ))
          )}
        </g>

        {/* Live Facial Silhouette */}
        <circle cx="120" cy="115" r="46" fill="#EEF2FF" stroke="#4F46E5" strokeWidth="2" />
        <circle cx="120" cy="104" r="18" fill="#C7D2FE" />
        <path d="M92 142 C97 128 108 126 120 126 C132 126 143 128 148 142" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" />

        {/* Biometric Scanning Reticle Brackets */}
        <path d="M85 75 H98 V62" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M155 75 H142 V62" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M85 155 H98 V168" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M155 155 H142 V168" stroke="#4F46E5" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Live Scanning Horizontal Beam */}
        <line x1="86" y1="115" x2="154" y2="115" stroke="#4F46E5" strokeWidth="2" strokeDasharray="3 3" />

        {/* Geo Stamp Bar on Phone Screen */}
        <g transform="translate(28, 195)">
          <rect width="184" height="42" rx="10" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="1" filter="drop-shadow(0 2px 4px rgba(0,0,0,0.04))" />
          <circle cx="20" cy="21" r="7" fill="#0284C7" />
          <path d="M17 21 L19 23 L23 19" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" />
          <text x="36" y="19" fill="#0F172A" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="800">17.4435° N, 78.3772° E</text>
          <text x="36" y="32" fill="#059669" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9" fontWeight="700">● GEOFENCE MATCH: 100%</text>
        </g>

        {/* Action Punch Success Button */}
        <g transform="translate(20, 275)">
          <rect width="200" height="45" rx="14" fill="#4F46E5" filter="drop-shadow(0 4px 10px rgba(79, 70, 229, 0.25))" />
          <path d="M50 22 L55 27 L66 16" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          <text x="80" y="27" fill="#FFFFFF" fontFamily="Outfit, sans-serif" fontSize="12" fontWeight="800">Clock-In Verified</text>
        </g>
      </g>

      {/* RIGHT SIDE: Live Shift Stats & Verification Pill Cards */}
      <g transform="translate(330, 60)">
        {/* On-Time Verification Pill */}
        <rect width="185" height="60" rx="16" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" filter="drop-shadow(0 4px 12px rgba(5, 150, 105, 0.08))" />
        <circle cx="30" cy="30" r="14" fill="#ECFDF5" />
        <path d="M24 30 L28 34 L36 26" stroke="#059669" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="54" y="26" fill="#065F46" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="800">SHIFT PUNCH: 09:00 AM</text>
        <text x="54" y="42" fill="#0F172A" fontFamily="Outfit, sans-serif" fontSize="13" fontWeight="800">Zero Proxy Fraud</text>
      </g>

      <g transform="translate(330, 140)">
        {/* Worksite Radius Pill */}
        <rect width="185" height="60" rx="16" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" filter="drop-shadow(0 4px 12px rgba(2, 132, 199, 0.08))" />
        <circle cx="30" cy="30" r="14" fill="#E0F2FE" />
        <path d="M30 20 C25 20 21 24 21 29 C21 35 30 42 30 42 C30 42 39 35 39 29 C39 24 35 20 30 20 Z" fill="#0284C7" />
        <circle cx="30" cy="27" r="3" fill="#FFFFFF" />
        <text x="54" y="26" fill="#0369A1" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="800">RADIUS FENCE ±15M</text>
        <text x="54" y="42" fill="#0F172A" fontFamily="Outfit, sans-serif" fontSize="13" fontWeight="800">Building 4 Perimeter</text>
      </g>

      <g transform="translate(330, 220)">
        {/* Attendance Roster Pill */}
        <rect width="185" height="75" rx="16" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.5" filter="drop-shadow(0 4px 12px rgba(79, 70, 229, 0.08))" />
        <text x="18" y="25" fill="#4F46E5" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="800">DAILY SHIFT ROSTER</text>
        <text x="18" y="46" fill="#0F172A" fontFamily="Outfit, sans-serif" fontSize="18" fontWeight="800">48 / 50 Present</text>
        <text x="18" y="62" fill="#059669" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700">● 96.0% On-Time Record</text>
      </g>

      {/* Floating Camera Verified Badge */}
      <g transform="translate(330, 315)">
        <rect width="185" height="38" rx="12" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1" />
        <circle cx="20" cy="19" r="5" fill="#4F46E5" />
        <text x="34" y="23" fill="#3730A3" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="800">ENCRYPTED LIVE SELFIE</text>
      </g>
    </svg>
  );
};

/**
 * 3. Automated Payroll & Compliant Payslip Master Illustration
 * Features automated calculation machinery, executive verified PDF payslip sheet,
 * currency badges, net-salary callout, and 1-click delivery.
 */
export const PayrollIllustration = ({ className = 'w-full h-auto max-w-xl' }) => {
  return (
    <svg viewBox="0 0 560 440" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Decorative backdrop plate */}
      <rect x="15" y="15" width="530" height="410" rx="28" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="1.5" />

      {/* Left Column: Official Digital Payslip Sheet */}
      <g transform="translate(50, 45)">
        {/* White Paper Sheet */}
        <rect width="250" height="345" rx="20" fill="#FFFFFF" stroke="#0F172A" strokeWidth="2.5" filter="drop-shadow(0 12px 24px rgba(15, 23, 42, 0.08))" />
        
        {/* Top Letterhead */}
        <rect x="20" y="20" width="36" height="36" rx="10" fill="#EEF2FF" stroke="#C7D2FE" strokeWidth="1.2" />
        <text x="38" y="43" fill="#4F46E5" fontFamily="Outfit, sans-serif" fontSize="18" fontWeight="900" textAnchor="middle">∞</text>
        <text x="68" y="34" fill="#0F172A" fontFamily="Outfit, sans-serif" fontSize="12" fontWeight="800">The Infinity Roles</text>
        <text x="68" y="48" fill="#64748B" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9" fontWeight="600">Executive Salary Voucher</text>

        {/* Dividing Line */}
        <line x1="20" y1="68" x2="230" y2="68" stroke="#E2E8F0" strokeWidth="1.5" />

        {/* Employee Info Header */}
        <rect x="20" y="78" width="210" height="32" rx="8" fill="#F8FAFC" />
        <text x="30" y="98" fill="#0F172A" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700">EMP-0419 • Shift A (26 Days)</text>

        {/* Line Items */}
        <text x="20" y="132" fill="#64748B" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10">Basic Compensation</text>
        <text x="230" y="132" fill="#0F172A" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700" textAnchor="end">$3,800.00</text>

        <text x="20" y="156" fill="#64748B" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10">Shift & Geo Allowance</text>
        <text x="230" y="156" fill="#059669" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700" textAnchor="end">+$450.00</text>

        <text x="20" y="180" fill="#64748B" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10">Overtime (14.5 Hours)</text>
        <text x="230" y="180" fill="#059669" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700" textAnchor="end">+$290.00</text>

        <text x="20" y="204" fill="#64748B" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10">Statutory Tax Withholding</text>
        <text x="230" y="204" fill="#DC2626" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700" textAnchor="end">-$340.00</text>

        {/* Dividing Line */}
        <line x1="20" y1="222" x2="230" y2="222" stroke="#E2E8F0" strokeWidth="1.5" />

        {/* Net Take-Home Callout Box */}
        <rect x="20" y="234" width="210" height="54" rx="12" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1.5" />
        <text x="32" y="254" fill="#065F46" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="700">NET DISBURSED SALARY</text>
        <text x="32" y="276" fill="#065F46" fontFamily="Outfit, sans-serif" fontSize="18" fontWeight="900">$4,200.00</text>

        {/* Green Paid Seal Stamp */}
        <g transform="translate(160, 240)">
          <rect width="60" height="26" rx="6" fill="#059669" />
          <text x="30" y="17" fill="#FFFFFF" fontFamily="Outfit, sans-serif" fontSize="11" fontWeight="800" textAnchor="middle">PAID</text>
        </g>

        {/* 1-Click PDF Button at bottom */}
        <g transform="translate(20, 300)">
          <rect width="210" height="32" rx="10" fill="#4F46E5" />
          <text x="105" y="20" fill="#FFFFFF" fontFamily="Outfit, sans-serif" fontSize="10" fontWeight="800" textAnchor="middle">Download Signed PDF</text>
        </g>
      </g>

      {/* Right Column: Automated Calculation Pipeline Badges */}
      <g transform="translate(325, 60)">
        {/* Fast Run Card */}
        <rect width="190" height="75" rx="18" fill="#FFFFFF" stroke="#4F46E5" strokeWidth="1.5" filter="drop-shadow(0 4px 12px rgba(79, 70, 229, 0.08))" />
        <circle cx="32" cy="38" r="14" fill="#EEF2FF" />
        <path d="M32 28 V38 L38 42" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" />
        <text x="56" y="32" fill="#4F46E5" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="800">AUTOMATED ENGINE</text>
        <text x="56" y="50" fill="#0F172A" fontFamily="Outfit, sans-serif" fontSize="15" fontWeight="800">85% Time Saved</text>
        <text x="56" y="64" fill="#64748B" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9">Zero Excel Reconciliations</text>
      </g>

      <g transform="translate(325, 150)">
        {/* Compliance Tax Card */}
        <rect width="190" height="75" rx="18" fill="#FFFFFF" stroke="#059669" strokeWidth="1.5" filter="drop-shadow(0 4px 12px rgba(5, 150, 105, 0.08))" />
        <circle cx="32" cy="38" r="14" fill="#ECFDF5" />
        <path d="M26 38 L30 42 L38 34" stroke="#059669" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
        <text x="56" y="32" fill="#059669" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="800">STATUTORY AUDIT</text>
        <text x="56" y="50" fill="#0F172A" fontFamily="Outfit, sans-serif" fontSize="15" fontWeight="800">100% Tax Compliant</text>
        <text x="56" y="64" fill="#64748B" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9">TDS, PF & ESI Formatted</text>
      </g>

      <g transform="translate(325, 240)">
        {/* Direct Bank Disbursement */}
        <rect width="190" height="75" rx="18" fill="#FFFFFF" stroke="#0284C7" strokeWidth="1.5" filter="drop-shadow(0 4px 12px rgba(2, 132, 199, 0.08))" />
        <circle cx="32" cy="38" r="14" fill="#E0F2FE" />
        <path d="M24 33 H40 M24 38 H40 M24 43 H34" stroke="#0284C7" strokeWidth="2" strokeLinecap="round" />
        <text x="56" y="32" fill="#0284C7" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="800">SALARY DISBURSEMENT</text>
        <text x="56" y="50" fill="#0F172A" fontFamily="Outfit, sans-serif" fontSize="15" fontWeight="800">Direct Portal Sync</text>
        <text x="56" y="64" fill="#64748B" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="9">Instant Payslip Notification</text>
      </g>

      {/* Floating Currency Stamp */}
      <g transform="translate(325, 330)">
        <rect width="190" height="38" rx="12" fill="#ECFDF5" stroke="#A7F3D0" strokeWidth="1" />
        <circle cx="20" cy="19" r="6" fill="#059669" />
        <text x="34" y="23" fill="#065F46" fontFamily="Plus Jakarta Sans, sans-serif" fontSize="10" fontWeight="800">AUDITED FINANCIAL LEDGER</text>
      </g>
    </svg>
  );
};
