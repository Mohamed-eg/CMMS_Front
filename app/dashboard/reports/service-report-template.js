"use client"

export const generateServiceReportPDF = (data) => {
  const reportHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Service Report - ${data.stationName}</title>
      <meta charset="utf-8">
      <style>
        @page {
          size: A4;
          margin: 2cm;
        }
        
        body {
          font-family: 'Arial', sans-serif;
          font-size: 12px;
          line-height: 1.4;
          color: #333;
          margin: 0;
          padding: 0;
        }
        
        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 15px;
        }
        
        .title {
          font-size: 28px;
          font-weight: bold;
          margin-bottom: 10px;
          color: #2563eb;
        }
        
        .subtitle {
          font-size: 14px;
          color: #666;
        }
        
        .date-section {
          margin-bottom: 25px;
          font-size: 14px;
        }
        
        .date-label {
          font-weight: bold;
          display: inline-block;
          width: 60px;
        }
        
        .intro-section {
          margin-bottom: 25px;
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          border-left: 4px solid #2563eb;
        }
        
        .intro-text {
          margin-bottom: 15px;
          font-size: 13px;
        }
        
        .checklist {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .checklist li {
          margin-bottom: 8px;
          font-size: 13px;
        }
        
        .checkbox {
          color: #22c55e;
          font-weight: bold;
          margin-right: 8px;
        }
        
        .maintenance-section {
          margin-bottom: 30px;
        }
        
        .section-title {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 15px;
          color: #1f2937;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 5px;
        }
        
        .maintenance-table {
          width: 100%;
          border-collapse: collapse;
          margin: 15px 0;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
        }
        
        .maintenance-table th {
          background-color: #f3f4f6;
          border: 1px solid #d1d5db;
          padding: 12px;
          text-align: left;
          font-weight: bold;
          font-size: 12px;
          color: #374151;
        }
        
        .maintenance-table td {
          border: 1px solid #d1d5db;
          padding: 12px;
          vertical-align: top;
          font-size: 11px;
          min-height: 60px;
        }
        
        .section-name {
          font-weight: bold;
          background-color: #fef3c7;
        }
        
        .date-cell {
          text-align: center;
          font-weight: bold;
          color: #2563eb;
        }
        
        .service-cell {
          line-height: 1.5;
        }
        
        .additional-notes {
          margin: 25px 0;
          background-color: #f0f9ff;
          padding: 15px;
          border-radius: 5px;
          border-left: 4px solid #0ea5e9;
        }
        
        .notes-title {
          font-weight: bold;
          margin-bottom: 10px;
          color: #0c4a6e;
        }
        
        .signature-section {
          margin-top: 50px;
          display: flex;
          justify-content: space-between;
          page-break-inside: avoid;
        }
        
        .signature-box {
          width: 45%;
          text-align: center;
        }
        
        .signature-label {
          font-weight: bold;
          margin-bottom: 40px;
          font-size: 13px;
        }
        
        .signature-line {
          border-bottom: 2px solid #333;
          margin-top: 30px;
          padding-bottom: 5px;
          min-height: 20px;
          font-size: 12px;
        }
        
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 10px;
          color: #666;
          border-top: 1px solid #e5e7eb;
          padding-top: 15px;
        }
        
        @media print {
          body { print-color-adjust: exact; }
          .no-print { display: none; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="title">Service Report</div>
        <div class="subtitle">Periodic Inspection & Maintenance</div>
      </div>
      
      <div class="date-section">
        <span class="date-label">Date:</span>
        <strong>${new Date(data.date).toLocaleDateString("en-GB")}</strong>
      </div>
      
      <div class="intro-section">
        <div class="intro-text">
          Periodic Inspection & maintenance was carried out at <strong>${data.stationName}</strong> and included the following:
        </div>
        <ul class="checklist">
          <li><span class="checkbox">✓</span>Fuel Dispenser inspection.</li>
          <li><span class="checkbox">✓</span>Bathroom.</li>
          <li><span class="checkbox">✓</span>Control room.</li>
          <li><span class="checkbox">✓</span>Accommodation</li>
        </ul>
      </div>
      
      <div class="maintenance-section">
        <div class="section-title">Maintenance Service:</div>
        <table class="maintenance-table">
          <thead>
            <tr>
              <th style="width: 25%;">Section</th>
              <th style="width: 15%;">Date</th>
              <th style="width: 60%;">Maintenance Inspection & Service</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="section-name">Fuel Dispenser</td>
              <td class="date-cell">${new Date(data.date).toLocaleDateString("en-GB")}</td>
              <td class="service-cell">${data.fuelDispenser || "No maintenance activities recorded"}</td>
            </tr>
            <tr>
              <td class="section-name">Control Room & Accommodation</td>
              <td class="date-cell">${new Date(data.date).toLocaleDateString("en-GB")}</td>
              <td class="service-cell">${data.controlRoom || "No maintenance activities recorded"}</td>
            </tr>
            <tr>
              <td class="section-name">Bathroom</td>
              <td class="date-cell">${new Date(data.date).toLocaleDateString("en-GB")}</td>
              <td class="service-cell">${data.bathroom || "No maintenance activities recorded"}</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      ${
        data.additionalNotes
          ? `
      <div class="additional-notes">
        <div class="notes-title">Additional Notes:</div>
        <div>${data.additionalNotes}</div>
      </div>
      `
          : ""
      }
      
      <div class="signature-section">
        <div class="signature-box">
          <div class="signature-label">Station Supervisor</div>
          <div class="signature-line">${data.supervisor || ""}</div>
        </div>
        <div class="signature-box">
          <div class="signature-label">Signature</div>
          <div class="signature-line"></div>
        </div>
      </div>
      
      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString("en-GB")} at ${new Date().toLocaleTimeString("en-GB")}</p>
        <p>Gas Station CMMS - Maintenance Management System</p>
      </div>
    </body>
    </html>
  `

  return reportHTML
}

export const downloadServiceReportPDF = (data) => {
  const reportHTML = generateServiceReportPDF(data)

  // Create a new window for printing
  const printWindow = window.open("", "_blank", "width=800,height=600")

  if (printWindow) {
    printWindow.document.write(reportHTML)
    printWindow.document.close()

    // Wait for content to load then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 250)
    }
  } else {
    // Fallback: create downloadable HTML file
    const blob = new Blob([reportHTML], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `Service_Report_${data.stationName}_${data.date}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }
}

export default { generateServiceReportPDF, downloadServiceReportPDF }
