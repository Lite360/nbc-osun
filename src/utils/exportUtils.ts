import type { Registration } from '../types';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

export function exportToCSV(registrations: Registration[], filename = 'NBC_Osun_Registrations.csv') {
  if (!registrations.length) return;

  const headers = [
    'Reference',
    'Full Name',
    'State Code',
    'Phone',
    'Email',
    'LGA',
    'Bank Name',
    'Account Name',
    'Account Number',
    'Location Verified',
    'Status',
    'Admin Note',
    'Registration Date'
  ];

  const rows = registrations.map(r => [
    `"${r.registration_reference}"`,
    `"${r.full_name.replace(/"/g, '""')}"`,
    `"${r.state_code}"`,
    `"${r.phone}"`,
    `"${r.email}"`,
    `"${r.lga}"`,
    `"${r.bank_name}"`,
    `"${r.account_name.replace(/"/g, '""')}"`,
    `"${r.account_number}"`,
    `"${r.location_verified ? 'YES' : 'NO'}"`,
    `"${r.status.toUpperCase()}"`,
    `"${(r.admin_note || '').replace(/"/g, '""')}"`,
    `"${new Date(r.created_at).toLocaleString()}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(registrations: Registration[], filename = 'NBC_Osun_Registrations.xlsx') {
  if (!registrations.length) return;

  const data = registrations.map(r => ({
    'Registration Reference': r.registration_reference,
    'Full Name': r.full_name,
    'State Code': r.state_code,
    'Phone': r.phone,
    'Email': r.email,
    'LGA': r.lga,
    'Bank Name': r.bank_name,
    'Account Name': r.account_name,
    'Account Number': r.account_number,
    'Location Verified': r.location_verified ? 'Verified at Venue' : 'Unverified',
    'Status': r.status.toUpperCase(),
    'Admin Note': r.admin_note || '-',
    'Registration Date': new Date(r.created_at).toLocaleString()
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');

  XLSX.writeFile(workbook, filename);
}

export function exportToPDF(registrations: Registration[], filename = 'NBC_Osun_Registrations.pdf') {
  if (!registrations.length) return;

  const doc = new jsPDF({ orientation: 'landscape' });
  
  // Header Title
  doc.setFontSize(16);
  doc.setTextColor(230, 28, 36); // NBC Red
  doc.text('NBC OSUN - CORPS MEMBER REGISTRATION REPORT', 14, 15);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()} | Total Records: ${registrations.length}`, 14, 22);

  let startY = 30;
  const pageHeight = doc.internal.pageSize.height;

  // Simple Table Header
  doc.setFillColor(230, 28, 36);
  doc.rect(14, startY, 269, 8, 'F');

  doc.setFontSize(9);
  doc.setTextColor(255, 255, 255);
  doc.text('Reference', 16, startY + 5.5);
  doc.text('Full Name', 55, startY + 5.5);
  doc.text('State Code', 105, startY + 5.5);
  doc.text('LGA', 135, startY + 5.5);
  doc.text('Phone', 170, startY + 5.5);
  doc.text('Status', 210, startY + 5.5);
  doc.text('Date', 240, startY + 5.5);

  startY += 8;

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(8);

  registrations.forEach((r, idx) => {
    if (startY > pageHeight - 15) {
      doc.addPage();
      startY = 15;
      
      // Draw Header again on new page
      doc.setFillColor(230, 28, 36);
      doc.rect(14, startY, 269, 8, 'F');
      doc.setFontSize(9);
      doc.setTextColor(255, 255, 255);
      doc.text('Reference', 16, startY + 5.5);
      doc.text('Full Name', 55, startY + 5.5);
      doc.text('State Code', 105, startY + 5.5);
      doc.text('LGA', 135, startY + 5.5);
      doc.text('Phone', 170, startY + 5.5);
      doc.text('Status', 210, startY + 5.5);
      doc.text('Date', 240, startY + 5.5);
      startY += 8;
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(8);
    }

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, startY, 269, 7, 'F');
    }

    doc.text(r.registration_reference.substring(0, 18), 16, startY + 5);
    doc.text(r.full_name.substring(0, 24), 55, startY + 5);
    doc.text(r.state_code, 105, startY + 5);
    doc.text(r.lga.substring(0, 16), 135, startY + 5);
    doc.text(r.phone, 170, startY + 5);
    doc.text(r.status.toUpperCase(), 210, startY + 5);
    doc.text(new Date(r.created_at).toLocaleDateString(), 240, startY + 5);

    startY += 7;
  });

  doc.save(filename);
}
