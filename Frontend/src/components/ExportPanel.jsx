import { useState, useEffect, useRef } from 'react';
import exportService from '../services/exportService';
import './ExportPanel.css';

const ExportPanel = () => {
  const [showPanel, setShowPanel] = useState(false);
  const panelRef = useRef(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    month: new Date().toISOString().slice(0, 7), // YYYY-MM format
  });

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setShowPanel(false);
      }
    };

    if (showPanel) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showPanel]);

  const handleExport = (type) => {
    switch (type) {
      case 'users-excel':
        exportService.exportUsersExcel();
        break;
      case 'users-csv':
        exportService.exportUsersCSV();
        break;
      case 'leaves-excel':
        exportService.exportLeavesExcel(filters.startDate, filters.endDate);
        break;
      case 'leaves-csv':
        exportService.exportLeavesCSV(filters.startDate, filters.endDate);
        break;
      case 'leave-report-pdf':
        exportService.exportLeaveReportPDF(filters.startDate, filters.endDate);
        break;
      case 'monthly-summary-pdf':
        exportService.exportMonthlySummaryPDF(filters.month);
        break;
      default:
        break;
    }
  };

  return (
    <div className="export-panel" ref={panelRef}>
      <button
        className="btn-export"
        onClick={() => setShowPanel(!showPanel)}
      >
        📊 Export & Reports
      </button>

      {showPanel && (
        <div className="export-dropdown">
          <div className="export-section">
            <h4>👥 Employee Data</h4>
            <div className="export-buttons">
              <button onClick={() => handleExport('users-excel')} className="export-btn">
                📗 Users Excel
              </button>
              <button onClick={() => handleExport('users-csv')} className="export-btn">
                📄 Users CSV
              </button>
            </div>
          </div>

          <div className="export-section">
            <h4>🏖️ Leave Data</h4>
            <div className="filter-group">
              <label>Date Range (Optional)</label>
              <div className="date-range">
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
                  placeholder="Start Date"
                />
                <span>to</span>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
                  placeholder="End Date"
                />
              </div>
            </div>
            <div className="export-buttons">
              <button onClick={() => handleExport('leaves-excel')} className="export-btn">
                📗 Leaves Excel
              </button>
              <button onClick={() => handleExport('leaves-csv')} className="export-btn">
                📄 Leaves CSV
              </button>
              <button onClick={() => handleExport('leave-report-pdf')} className="export-btn pdf">
                📕 Leave Report PDF
              </button>
            </div>
          </div>

          <div className="export-section">
            <h4>📈 Monthly Reports</h4>
            <div className="filter-group">
              <label>Select Month</label>
              <input
                type="month"
                value={filters.month}
                onChange={(e) => setFilters({ ...filters, month: e.target.value })}
              />
            </div>
            <div className="export-buttons">
              <button onClick={() => handleExport('monthly-summary-pdf')} className="export-btn pdf">
                📕 Monthly Summary PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExportPanel;
