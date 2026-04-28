import jsPDF from 'jspdf';

/**
 * Generates a professional invoice PDF using jsPDF's native vector text API.
 * Text is selectable, crisp at any zoom, and properly spaced.
 */
export async function generateInvoicePDF({
  logo,
  qris,
  tanggal,
  jatuhTempo,
  recipients,
  items,
  subtotal,
  paymentInstructions,
  closingNotes,
  formatDate,
  formatCurrency,
}) {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'pt',
    format: 'a4',
    compress: true,
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ─── Color helpers ────────────────────────────────────────
  const slate800 = [30, 41, 59];
  const slate600 = [71, 85, 105];
  const slate500 = [100, 116, 139];
  const slate400 = [148, 163, 184];
  const slate100 = [241, 245, 249];
  const slate50 = [248, 250, 252];

  const setColor = (rgb) => pdf.setTextColor(rgb[0], rgb[1], rgb[2]);
  const setDrawColor = (rgb) => pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
  const setFillColor = (rgb) => pdf.setFillColor(rgb[0], rgb[1], rgb[2]);

  // ─── Font helpers ─────────────────────────────────────────
  const setFont = (style = 'normal', size = 10) => {
    pdf.setFont('helvetica', style);
    pdf.setFontSize(size);
  };

  // Wrap text to fit within maxWidth, returns array of lines
  const wrapText = (text, maxWidth) => {
    return pdf.splitTextToSize(text, maxWidth);
  };

  // ─── HEADER ───────────────────────────────────────────────
  // Logo (left)
  if (logo) {
    try {
      pdf.addImage(logo, 'AUTO', margin, y, 120, 60, undefined, 'FAST');
    } catch {
      // Skip logo if it can't be loaded
    }
  } else {
    setFillColor(slate100);
    pdf.roundedRect(margin, y, 120, 60, 4, 4, 'F');
    setFont('italic', 9);
    setColor(slate400);
    pdf.text('Logo Area', margin + 60, y + 34, { align: 'center' });
  }

  // Right header
  const rightX = pageWidth - margin;
  setFont('normal', 22);
  setColor(slate800);
  pdf.text('Faktur', rightX, y + 18, { align: 'right' });

  setFont('bold', 10);
  setColor(slate800);
  pdf.text('Dentistry Charity XVII', rightX, y + 36, { align: 'right' });

  setFont('normal', 10);
  setColor(slate600);
  pdf.text('dentistrycharityvxi@gmail.com', rightX, y + 50, { align: 'right' });

  y += 80;

  // ─── INFO SECTION (grey box) ──────────────────────────────
  const infoBoxHeight = 90;
  setFillColor(slate50);
  pdf.roundedRect(margin, y, contentWidth, infoBoxHeight, 6, 6, 'F');

  const infoMargin = margin + 20;
  const infoY = y + 24;

  // Left: Ditagih Kepada
  setFont('bold', 8);
  setColor(slate500);
  pdf.text('DITAGIH KEPADA', infoMargin, infoY);

  let recipientY = infoY + 18;
  recipients.forEach((r) => {
    setFont('bold', 10);
    setColor(slate800);
    pdf.text(r.name || 'Nama Penerima', infoMargin, recipientY);
    if (r.email) {
      setFont('normal', 10);
      setColor(slate600);
      pdf.text(r.email, infoMargin, recipientY + 14);
      recipientY += 30;
    } else {
      recipientY += 16;
    }
  });

  // Right: Dates
  const dateRightX = pageWidth - margin - 20;
  const dateLabelX = dateRightX - 100;

  setFont('bold', 10);
  setColor(slate800);
  pdf.text('Tanggal', dateLabelX, infoY + 18);
  setFont('normal', 10);
  setColor(slate600);
  pdf.text(formatDate(tanggal), dateRightX, infoY + 18, { align: 'right' });

  setFont('bold', 10);
  setColor(slate800);
  pdf.text('Jatuh tempo', dateLabelX, infoY + 36);
  setFont('normal', 10);
  setColor(slate600);
  pdf.text(formatDate(jatuhTempo), dateRightX, infoY + 36, { align: 'right' });

  y += infoBoxHeight + 24;

  // ─── ITEMS TABLE ──────────────────────────────────────────
  // Table header
  const col1X = margin;
  const col2X = margin + contentWidth * 0.45;
  const col3X = margin + contentWidth * 0.65;
  const col4X = pageWidth - margin;

  setDrawColor(slate100);
  pdf.setLineWidth(1.5);
  pdf.line(margin, y + 18, pageWidth - margin, y + 18);

  setFont('bold', 10);
  setColor(slate800);
  pdf.text('Barang', col1X, y + 12);
  pdf.text('Kuantitas', col2X, y + 12, { align: 'center' });
  pdf.text('Harga', col3X + 20, y + 12, { align: 'right' });
  pdf.text('Jumlah', col4X, y + 12, { align: 'right' });

  y += 22;

  // Table rows
  items.forEach((item) => {
    const rowY = y + 14;

    setFont('bold', 10);
    setColor(slate800);
    // Wrap long item names
    const nameLines = wrapText(item.name || 'Nama Barang', contentWidth * 0.4);
    nameLines.forEach((line, i) => {
      pdf.text(line, col1X, rowY + i * 14);
    });

    setFont('normal', 10);
    pdf.text(String(item.quantity), col2X, rowY, { align: 'center' });
    pdf.text(formatCurrency(item.cost), col3X + 20, rowY, { align: 'right' });
    pdf.text(formatCurrency(item.quantity * item.cost), col4X, rowY, { align: 'right' });

    const rowHeight = Math.max(nameLines.length * 14, 14) + 10;
    y += rowHeight;

    // Divider
    setDrawColor(slate100);
    pdf.setLineWidth(0.5);
    pdf.line(margin, y, pageWidth - margin, y);
  });

  y += 20;

  // ─── BOTTOM SECTION: Payment + Totals ─────────────────────
  const bottomLeftX = margin;
  const bottomRightX = margin + contentWidth * 0.55;
  const bottomRightWidth = contentWidth * 0.45;
  const savedY = y;

  // --- Left: Payment Instructions ---
  setFont('bold', 9);
  setColor(slate800);
  pdf.text('Instruksi Pembayaran', bottomLeftX, y + 4);
  y += 16;

  // QRIS image
  if (qris) {
    try {
      pdf.addImage(qris, 'AUTO', bottomLeftX, y, 120, 120, undefined, 'FAST');
    } catch {
      // Skip QRIS if it can't be loaded
    }
  } else {
    setFillColor(slate50);
    pdf.roundedRect(bottomLeftX, y, 120, 120, 4, 4, 'F');
    setDrawColor(slate100);
    pdf.setLineWidth(1);
    pdf.roundedRect(bottomLeftX, y, 120, 120, 4, 4, 'S');
    setFont('italic', 8);
    setColor(slate400);
    pdf.text('QRIS Area', bottomLeftX + 60, y + 64, { align: 'center' });
  }
  y += 130;

  // Payment text
  setFont('normal', 8);
  setColor(slate600);
  const paymentLines = wrapText(paymentInstructions || '', contentWidth * 0.45);
  paymentLines.forEach((line) => {
    pdf.text(line, bottomLeftX, y);
    y += 12;
  });

  // --- Right: Totals ---
  let rightY = savedY;

  // Subtotal
  setFont('normal', 10);
  setColor(slate600);
  pdf.text('Subtotal', bottomRightX, rightY + 4);
  setFont('normal', 10);
  setColor(slate800);
  pdf.text(formatCurrency(subtotal), pageWidth - margin, rightY + 4, { align: 'right' });

  rightY += 28;

  // Divider
  setDrawColor(slate100);
  pdf.setLineWidth(0.5);
  pdf.line(bottomRightX, rightY - 6, pageWidth - margin, rightY - 6);

  // Total
  setFont('bold', 10);
  setColor(slate800);
  pdf.text('Total', bottomRightX, rightY + 4);
  setFont('bold', 14);
  pdf.text(formatCurrency(subtotal), pageWidth - margin, rightY + 4, { align: 'right' });

  rightY += 32;

  // Saldo Jatuh Tempo box
  const balanceBoxWidth = bottomRightWidth;
  const balanceBoxHeight = 52;
  setFillColor(slate50);
  pdf.roundedRect(bottomRightX, rightY, balanceBoxWidth, balanceBoxHeight, 6, 6, 'F');

  setFont('bold', 7);
  setColor(slate500);
  pdf.text('SALDO JATUH TEMPO', bottomRightX + balanceBoxWidth - 12, rightY + 18, { align: 'right' });

  setFont('bold', 16);
  setColor(slate800);
  pdf.text(formatCurrency(subtotal), bottomRightX + balanceBoxWidth - 12, rightY + 38, { align: 'right' });

  // ─── CLOSING NOTES ────────────────────────────────────────
  const closingY = Math.max(y, rightY + balanceBoxHeight) + 24;

  // Divider
  setDrawColor(slate100);
  pdf.setLineWidth(0.5);
  pdf.line(margin, closingY, pageWidth - margin, closingY);

  setFont('normal', 9);
  setColor(slate600);
  const closingLines = wrapText(closingNotes || '', contentWidth);
  let cY = closingY + 18;
  closingLines.forEach((line) => {
    pdf.text(line, margin, cY);
    cY += 13;
  });

  return pdf;
}
