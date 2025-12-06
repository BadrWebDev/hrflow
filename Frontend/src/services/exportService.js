import api from './api';

const exportService = {
  // Export users to Excel
  exportUsersExcel: () => {
    window.open(`${api.defaults.baseURL}/export/users/excel`, '_blank');
  },

  // Export users to CSV
  exportUsersCSV: () => {
    window.open(`${api.defaults.baseURL}/export/users/csv`, '_blank');
  },

  // Export leaves to Excel
  exportLeavesExcel: (startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    window.open(`${api.defaults.baseURL}/export/leaves/excel?${params}`, '_blank');
  },

  // Export leaves to CSV
  exportLeavesCSV: (startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    window.open(`${api.defaults.baseURL}/export/leaves/csv?${params}`, '_blank');
  },

  // Export leave report PDF
  exportLeaveReportPDF: (startDate = null, endDate = null) => {
    const params = new URLSearchParams();
    if (startDate) params.append('start_date', startDate);
    if (endDate) params.append('end_date', endDate);
    window.open(`${api.defaults.baseURL}/export/leave-report/pdf?${params}`, '_blank');
  },

  // Export monthly summary PDF
  exportMonthlySummaryPDF: (month = null) => {
    const params = new URLSearchParams();
    if (month) params.append('month', month);
    window.open(`${api.defaults.baseURL}/export/monthly-summary/pdf?${params}`, '_blank');
  },
};

export default exportService;
