import type { Registration } from '../types';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';

export function exportToCSV(registrations: Registration[], filename = 'NBC_Osun_Attendance.csv') {
  if (!registrations.length) return;

  const headers = [
    'S/N',
    'Full Name',
    'State Code',
    'Phone',
    'LGA',
    'Bank Name',
    'Account Name',
    'Account Number'
  ];

  const rows = registrations.map((r, index) => [
    `"${index + 1}"`,
    `"${r.full_name.replace(/"/g, '""')}"`,
    `"${r.state_code}"`,
    `"${r.phone}"`,
    `"${r.lga}"`,
    `"${r.bank_name}"`,
    `"${r.account_name.replace(/"/g, '""')}"`,
    `"${r.account_number}"`
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

export function exportToExcel(registrations: Registration[], filename = 'NBC_Osun_Attendance.xlsx') {
  if (!registrations.length) return;

  const data = registrations.map((r, index) => ({
    'S/N': index + 1,
    'Full Name': r.full_name,
    'State Code': r.state_code,
    'Phone': r.phone,
    'LGA': r.lga,
    'Bank Name': r.bank_name,
    'Account Name': r.account_name,
    'Account Number': r.account_number
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Attendance');

  XLSX.writeFile(workbook, filename);
}

export function exportToPDF(registrations: Registration[], filename = 'NBC_Osun_Attendance.pdf') {
  if (!registrations.length) return;

  const doc = new jsPDF({ orientation: 'landscape' });
  const pageWidth = doc.internal.pageSize.width;

  // Centralized Header Title
  doc.setFontSize(16);
  doc.setTextColor(230, 28, 36); // NBC Red
  doc.text('NBC OSUN - CORPS MEMBER ATTENDANCE REPORT', pageWidth / 2, 15, { align: 'center' });

  // Centralized Subtitle / Metadata
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated on: ${new Date().toLocaleString()} | Total Records: ${registrations.length}`, pageWidth / 2, 22, { align: 'center' });

  let startY = 30;
  const pageHeight = doc.internal.pageSize.height;

  // Table Header Function
  const renderTableHeader = (yPos: number) => {
    doc.setFillColor(230, 28, 36);
    doc.rect(14, yPos, 269, 8, 'F');
    doc.setFontSize(9);
    doc.setTextColor(255, 255, 255);
    doc.text('S/N', 18, yPos + 5.5);
    doc.text('Full Name', 35, yPos + 5.5);
    doc.text('State Code', 85, yPos + 5.5);
    doc.text('Phone', 120, yPos + 5.5);
    doc.text('LGA', 150, yPos + 5.5);
    doc.text('Bank Name', 185, yPos + 5.5);
    doc.text('Account Name', 225, yPos + 5.5);
    doc.text('Account Number', 260, yPos + 5.5);
  };

  renderTableHeader(startY);
  startY += 8;

  doc.setTextColor(30, 30, 30);
  doc.setFontSize(8);

  registrations.forEach((r, idx) => {
    if (startY > pageHeight - 15) {
      doc.addPage();
      startY = 15;
      renderTableHeader(startY);
      startY += 8;
      doc.setTextColor(30, 30, 30);
      doc.setFontSize(8);
    }

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, startY, 269, 7, 'F');
    }

    // Grid row borders for clean tabulated presentation
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, startY, 269, 7);

    doc.text(String(idx + 1), 18, startY + 5);
    doc.text(r.full_name.substring(0, 22), 35, startY + 5);
    doc.text(r.state_code, 85, startY + 5);
    doc.text(r.phone, 120, startY + 5);
    doc.text(r.lga.substring(0, 14), 150, startY + 5);
    doc.text(r.bank_name.substring(0, 18), 185, startY + 5);
    doc.text(r.account_name.substring(0, 18), 225, startY + 5);
    doc.text(r.account_number, 260, startY + 5);

    startY += 7;
  });

  doc.save(filename);
}
