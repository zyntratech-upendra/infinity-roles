/**
 * Beautiful, responsive, light-themed HTML email templates for The Infinity Roles
 */

const getBaseWrapper = (content, headerBadge = 'Portal Notification') => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>The Infinity Roles</title>
  <style>
    body { margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; }
    .container { max-width: 580px; margin: 30px auto; background-color: #ffffff; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01); border: 1px solid #e2e8f0; }
    .header { background: linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%); padding: 32px 24px; text-align: center; border-bottom: 1px solid #e2e8f0; }
    .badge { display: inline-block; padding: 4px 12px; background-color: #4f46e5; color: #ffffff; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; border-radius: 9999px; margin-bottom: 12px; }
    .logo-text { font-size: 26px; font-weight: 800; color: #1e293b; margin: 0; letter-spacing: -0.02em; }
    .logo-accent { color: #4f46e5; }
    .content { padding: 36px 32px; background-color: #ffffff; }
    .footer { padding: 24px 32px; background-color: #f8fafc; text-align: center; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b; line-height: 1.6; }
    .btn { display: inline-block; padding: 12px 28px; background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%); color: #ffffff !important; text-decoration: none; font-weight: 700; font-size: 14px; border-radius: 10px; margin: 20px 0; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.25); }
    .otp-card { background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 2px dashed #6366f1; border-radius: 14px; padding: 24px; text-align: center; margin: 24px 0; }
    .otp-code { font-family: 'Courier New', monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #4f46e5; margin: 10px 0; }
    .info-box { background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px 20px; margin: 20px 0; }
    .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #edf2f7; font-size: 14px; }
    .info-row:last-child { border-bottom: none; }
    .info-label { color: #64748b; font-weight: 500; }
    .info-value { color: #0f172a; font-weight: 700; text-align: right; }
  </style>
</head>
<body>
  <div style="padding: 20px 10px;">
    <div class="container">
      <div class="header">
        <div class="badge">${headerBadge}</div>
        <h1 class="logo-text">The Infinity <span class="logo-accent">Roles</span></h1>
      </div>
      <div class="content">
        ${content}
      </div>
      <div class="footer">
        <p style="margin: 0 0 6px 0;">This is an automated communication from <strong>The Infinity Roles Platform</strong>.</p>
        <p style="margin: 0;">If you did not initiate this request, please contact system administration immediately.</p>
        <p style="margin: 8px 0 0 0; font-size: 11px; color: #94a3b8;">&copy; 2026 The Infinity Roles. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>
`;

/**
 * OTP Verification Email Template
 */
const getOtpEmailTemplate = ({ recipientName = 'User', otp, role = 'Portal', expiresMinutes = 10 }) => {
  const content = `
    <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 8px;">Password Reset Verification</h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0;">
      Hello <strong>${recipientName}</strong>, we received a request to reset your password for your <strong>${role}</strong> account.
    </p>

    <div class="otp-card">
      <div style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em;">Your One-Time Password (OTP)</div>
      <div class="otp-code">${otp}</div>
      <div style="font-size: 12px; color: #ef4444; font-weight: 600;">Valid for the next ${expiresMinutes} minutes</div>
    </div>

    <p style="color: #475569; font-size: 14px; line-height: 1.6;">
      Enter this 6-digit code on the reset verification screen to authorize creating your new password.
    </p>

    <div style="margin-top: 24px; padding: 14px 18px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 10px; font-size: 13px; color: #92400e;">
      <strong>Security Notice:</strong> Never share this OTP with anyone. Infinity Roles staff will never ask for your verification code.
    </div>
  `;
  return getBaseWrapper(content, `${role} Security`);
};

/**
 * Supervisor Credentials & Company Assignment Email
 */
const getSupervisorWelcomeTemplate = ({ name, email, password, companyName, companyCode, loginUrl }) => {
  const content = `
    <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 8px;">Welcome to The Infinity Roles</h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0;">
      Hello <strong>${name}</strong>, you have been registered as an authorized <strong>Supervisor</strong>${companyName ? ` for <strong>${companyName}</strong>` : ''}.
    </p>

    <div class="info-box">
      <div style="font-size: 12px; font-weight: 700; color: #4f46e5; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.05em;">Assigned Company & Credentials</div>
      ${companyName ? `
      <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 10px;">
        <tr><td style="padding: 6px 0; color: #64748b;">Company Name:</td><td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${companyName}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Company Code:</td><td style="padding: 6px 0; font-weight: 700; color: #4f46e5; text-align: right;">${companyCode}</td></tr>
      </table>
      <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin: 10px 0;" />
      ` : ''}
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #64748b;">Portal Login Email:</td><td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${email}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Temporary Password:</td><td style="padding: 6px 0; font-weight: 700; color: #4f46e5; text-align: right; font-family: monospace; font-size: 16px;">${password}</td></tr>
      </table>
    </div>

    <div style="text-align: center;">
      <a href="${loginUrl}" class="btn">Login to Supervisor Console</a>
    </div>

    <p style="color: #64748b; font-size: 13px; line-height: 1.5; margin-top: 15px;">
      As a supervisor for this company, you can now register workers, allocate skill-wise salary particulars, and monitor on-ground workforce operations.
    </p>
  `;
  return getBaseWrapper(content, 'Supervisor Onboarding');
};

/**
 * Worker / Employee Joining & Salary Allotment Email
 */
const getEmployeeWelcomeTemplate = ({ name, employeeId, email, password, companyName, companyCode, skillLevel, monthlyWage, loginUrl }) => {
  const content = `
    <h2 style="color: #0f172a; font-size: 22px; font-weight: 700; margin-top: 0; margin-bottom: 8px;">Welcome to the Team, ${name}!</h2>
    <p style="color: #475569; font-size: 15px; line-height: 1.6; margin-top: 0;">
      Your worker onboarding has been successfully finalized under <strong>${companyName || 'The Infinity Roles'}</strong>. Your official Joining Letter is attached to this email.
    </p>

    <div class="info-box">
      <div style="font-size: 12px; font-weight: 700; color: #0d9488; text-transform: uppercase; margin-bottom: 10px; letter-spacing: 0.05em;">Workforce & Salary Allotment</div>
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #64748b;">Employee ID:</td><td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${employeeId}</td></tr>
        ${companyCode ? `<tr><td style="padding: 6px 0; color: #64748b;">Company Code:</td><td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${companyCode}</td></tr>` : ''}
        <tr><td style="padding: 6px 0; color: #64748b;">Assigned Skill Level:</td><td style="padding: 6px 0; font-weight: 700; color: #0d9488; text-align: right;">${skillLevel}</td></tr>
        ${monthlyWage ? `<tr><td style="padding: 6px 0; color: #64748b;">Allotted Monthly Wage:</td><td style="padding: 6px 0; font-weight: 800; color: #059669; text-align: right;">₹${monthlyWage.toLocaleString('en-IN')}</td></tr>` : ''}
      </table>
      <hr style="border: 0; border-top: 1px dashed #cbd5e1; margin: 10px 0;" />
      <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
        <tr><td style="padding: 6px 0; color: #64748b;">Login ID:</td><td style="padding: 6px 0; font-weight: 700; color: #0f172a; text-align: right;">${email}</td></tr>
        <tr><td style="padding: 6px 0; color: #64748b;">Temporary Password:</td><td style="padding: 6px 0; font-weight: 700; color: #0d9488; text-align: right; font-family: monospace;">${password}</td></tr>
      </table>
    </div>

    <div style="text-align: center;">
      <a href="${loginUrl}" class="btn" style="background: linear-gradient(135deg, #0d9488 0%, #059669 100%); box-shadow: 0 4px 12px rgba(13, 148, 136, 0.25);">Login to Employee Portal</a>
    </div>
  `;
  return getBaseWrapper(content, 'Employee Onboarding');
};

module.exports = {
  getOtpEmailTemplate,
  getSupervisorWelcomeTemplate,
  getEmployeeWelcomeTemplate,
};
