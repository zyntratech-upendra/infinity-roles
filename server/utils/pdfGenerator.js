const PDFDocument = require('pdfkit');

const generateJoiningLetter = (employeeData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 45, size: 'A4' });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      const companyName = employeeData.companyName || 'The Infinity Roles';
      const companyCode = employeeData.companyCode || 'CORP-GEN';

      // Header Banner
      doc.rect(45, 40, 505, 55).fill('#4f46e5');
      doc.fillColor('#ffffff').fontSize(18).font('Helvetica-Bold').text(companyName.toUpperCase(), 60, 52);
      doc.fillColor('#e0e7ff').fontSize(10).font('Helvetica').text(`Staffing & Workforce Management • Company Code: ${companyCode}`, 60, 74);

      // Document Title
      doc.moveDown(3);
      doc.fillColor('#1e293b').fontSize(15).font('Helvetica-Bold').text('OFFICIAL APPOINTMENT & JOINING LETTER', 45, 120, { align: 'center' });
      
      // Date & Reference
      doc.fontSize(9).font('Helvetica').fillColor('#64748b')
        .text(`Date of Issue: ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`, 45, 145, { align: 'right' });
      doc.text(`Ref ID: EMP/APPT/${employeeData.employeeId || 'NEW'}`, 45, 145, { align: 'left' });

      // Salutation
      doc.moveDown(1.5);
      doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text(`To,`);
      doc.text(`${employeeData.name}`);
      doc.font('Helvetica').fillColor('#475569').text(`Employee ID: ${employeeData.employeeId}`);
      if (employeeData.email) doc.text(`Email: ${employeeData.email}`);
      if (employeeData.phoneNumber) doc.text(`Phone: ${employeeData.phoneNumber}`);

      // Body text
      doc.moveDown(1);
      doc.fillColor('#334155').fontSize(10).font('Helvetica').lineGap(4);
      doc.text(
        `We are pleased to formally offer you appointment as a valued workforce team member under ${companyName}. ` +
        `Based on your qualifications and verification, you have been categorized under the ${employeeData.skillLevel || 'Skilled'} tier.`
      );

      // Wage Particulars Grid / Table
      doc.moveDown(1);
      doc.fillColor('#1e293b').fontSize(11).font('Helvetica-Bold').text('ALLOTTED REMUNERATION & WAGE PARTICULARS:');
      doc.moveDown(0.5);

      const tableTop = doc.y;
      doc.rect(45, tableTop, 505, 24).fill('#f1f5f9');
      doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold');
      doc.text('PARTICULAR / COMPONENT', 55, tableTop + 7);
      doc.text('SPECIFICATION / AMOUNT', 320, tableTop + 7, { align: 'right' });

      let currentY = tableTop + 24;
      const particulars = [
        ['Assigned Skill Level Tier', employeeData.skillLevel || 'Standard'],
        ['Basic Daily Wage', employeeData.basicWage ? `Rs. ${employeeData.basicWage} / day` : 'Statutory Standard'],
        ['HRA & Allowances', employeeData.hraDa ? `Rs. ${employeeData.hraDa} / day` : 'As per policy'],
        ['Overtime Rate', employeeData.overtimeRatePerHour ? `Rs. ${employeeData.overtimeRatePerHour} / hour` : '1.5x Normal Rate'],
        ['Calculated Monthly Wage (26 Days Basis)', employeeData.monthlyWage ? `Rs. ${Number(employeeData.monthlyWage).toLocaleString('en-IN')}` : 'Variable as per shifts'],
      ];

      particulars.forEach(([label, value], idx) => {
        const bg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        doc.rect(45, currentY, 505, 20).fill(bg);
        doc.fillColor('#475569').fontSize(9).font('Helvetica').text(label, 55, currentY + 5);
        doc.fillColor('#0f172a').font('Helvetica-Bold').text(value, 320, currentY + 5, { align: 'right' });
        currentY += 20;
      });

      // Terms
      doc.y = currentY + 15;
      doc.fillColor('#1e293b').fontSize(10).font('Helvetica-Bold').text('TERMS OF EMPLOYMENT:');
      doc.moveDown(0.3);
      doc.fillColor('#475569').fontSize(8.5).font('Helvetica').lineGap(3);
      doc.text('1. You will adhere to company safety guidelines, operational protocols, and supervisory directives.');
      doc.text('2. All wages will be credited into your designated bank account or approved disbursement channel.');
      doc.text('3. You may access your employee self-service portal using your registered credentials.');

      // Sign-off
      doc.moveDown(2);
      const signY = doc.y + 20;
      doc.rect(45, signY, 150, 1).fill('#cbd5e1');
      doc.rect(400, signY, 150, 1).fill('#cbd5e1');
      
      doc.fillColor('#0f172a').fontSize(9).font('Helvetica-Bold')
        .text('Authorized Signatory', 45, signY + 6)
        .text('Employee Acceptance', 400, signY + 6);
      doc.fillColor('#64748b').fontSize(8).font('Helvetica')
        .text(companyName, 45, signY + 18)
        .text('Signature & Date', 400, signY + 18);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generateJoiningLetter };
