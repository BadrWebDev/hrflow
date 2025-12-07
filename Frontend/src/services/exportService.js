import api from './api';

const downloadFile = async (url, filename) => {
  try {
    const response = await api.get(url, {
      responseType: 'blob',
    });

    // Create a blob URL and trigger download
    const blob = new Blob([response.data], { 
      type: response.headers['content-type'] 
    });
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(downloadUrl);
  } catch (error) {
    console.error('Download failed:', error);
    alert('Failed to download file. Please try again.');
  }
};

const exportService = {
  // Export users to Excel
  exportUsersExcel: () => {
    downloadFile('/export/users/excel', `users_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  // Export users to CSV
  exportUsersCSV: () => {
    downloadFile('/export/users/csv', `users_${new Date().toISOString().split('T')[0]}.csv`);
  },

  // Export leaves to Excel
  exportLeavesExcel: (startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const url = `/export/leaves/excel${params.toString() ? '?' + params.toString() : ''}`;
    downloadFile(url, `leaves_${new Date().toISOString().split('T')[0]}.xlsx`);
  },

  // Export leaves to CSV
  exportLeavesCSV: (startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const url = `/export/leaves/csv${params.toString() ? '?' + params.toString() : ''}`;
    downloadFile(url, `leaves_${new Date().toISOString().split('T')[0]}.csv`);
  },

  // Export leave report PDF
  exportLeaveReportPDF: (startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    const url = `/export/leave-report/pdf${params.toString() ? '?' + params.toString() : ''}`;
    downloadFile(url, `leave_report_${new Date().toISOString().split('T')[0]}.pdf`);
  },

  // Export monthly summary PDF
  exportMonthlySummaryPDF: (month = null) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    const url = `/export/monthly-summary/pdf${params.toString() ? '?' + params.toString() : ''}`;
    downloadFile(url, `monthly_summary_${month || 'current'}.pdf`);
  },
};

export default exportService;
