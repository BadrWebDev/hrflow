<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Leave;
use App\Models\User;
use App\Exports\UsersExport;
use App\Exports\LeavesExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\DB;

class ExportController extends Controller
{
    /**
     * Export users to Excel
     */
    public function exportUsersExcel()
    {
        return Excel::download(new UsersExport, 'users_' . date('Y-m-d') . '.xlsx');
    }

    /**
     * Export users to CSV
     */
    public function exportUsersCSV()
    {
        return Excel::download(new UsersExport, 'users_' . date('Y-m-d') . '.csv');
    }

    /**
     * Export leaves to Excel
     */
    public function exportLeavesExcel(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        
        return Excel::download(
            new LeavesExport($startDate, $endDate), 
            'leaves_' . date('Y-m-d') . '.xlsx'
        );
    }

    /**
     * Export leaves to CSV
     */
    public function exportLeavesCSV(Request $request)
    {
        $startDate = $request->query('start_date');
        $endDate = $request->query('end_date');
        
        return Excel::download(
            new LeavesExport($startDate, $endDate), 
            'leaves_' . date('Y-m-d') . '.csv'
        );
    }

    /**
     * Generate leave report PDF
     */
    public function exportLeaveReportPDF(Request $request)
    {
        $startDate = $request->query('start_date', now()->startOfMonth());
        $endDate = $request->query('end_date', now()->endOfMonth());

        $leaves = Leave::with(['user', 'leaveType', 'approver'])
            ->whereBetween('start_date', [$startDate, $endDate])
            ->get();

        // Statistics
        $stats = [
            'total' => $leaves->count(),
            'approved' => $leaves->where('status', 'approved')->count(),
            'pending' => $leaves->where('status', 'pending')->count(),
            'rejected' => $leaves->where('status', 'rejected')->count(),
            'total_days' => $leaves->where('status', 'approved')->sum('days'),
        ];

        // Group by leave type
        $byType = $leaves->groupBy('leaveType.name')->map(function($group) {
            return [
                'count' => $group->count(),
                'days' => $group->where('status', 'approved')->sum('days'),
            ];
        });

        $pdf = Pdf::loadView('pdf.leave-report', [
            'leaves' => $leaves,
            'stats' => $stats,
            'byType' => $byType,
            'startDate' => $startDate,
            'endDate' => $endDate,
            'generatedAt' => now()->format('Y-m-d H:i:s'),
        ]);

        return $pdf->download('leave_report_' . date('Y-m-d') . '.pdf');
    }

    /**
     * Generate monthly summary PDF
     */
    public function exportMonthlySummaryPDF(Request $request)
    {
        $month = $request->query('month', now()->format('Y-m'));
        $startDate = date('Y-m-01', strtotime($month));
        $endDate = date('Y-m-t', strtotime($month));

        $leaves = Leave::with(['user', 'leaveType'])
            ->whereBetween('start_date', [$startDate, $endDate])
            ->get();

        // Group by user
        $byUser = $leaves->groupBy('user.name')->map(function($group) {
            return [
                'total' => $group->count(),
                'approved' => $group->where('status', 'approved')->count(),
                'pending' => $group->where('status', 'pending')->count(),
                'rejected' => $group->where('status', 'rejected')->count(),
                'days' => $group->where('status', 'approved')->sum('days'),
            ];
        });

        $pdf = Pdf::loadView('pdf.monthly-summary', [
            'byUser' => $byUser,
            'month' => date('F Y', strtotime($month)),
            'totalLeaves' => $leaves->count(),
            'totalDays' => $leaves->where('status', 'approved')->sum('days'),
            'generatedAt' => now()->format('Y-m-d H:i:s'),
        ]);

        return $pdf->download('monthly_summary_' . $month . '.pdf');
    }
}
