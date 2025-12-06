<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Leave Report</title>
    <style>
        body {
            font-family: 'DejaVu Sans', Arial, sans-serif;
            font-size: 12px;
            color: #333;
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #667eea;
            padding-bottom: 10px;
        }
        .header h1 {
            color: #667eea;
            margin: 0;
            font-size: 24px;
        }
        .header p {
            margin: 5px 0;
            color: #666;
        }
        .stats {
            display: table;
            width: 100%;
            margin-bottom: 30px;
        }
        .stat-box {
            display: table-cell;
            width: 20%;
            padding: 15px;
            text-align: center;
            background: #f8f9fa;
            border-radius: 5px;
            margin: 0 5px;
        }
        .stat-box .number {
            font-size: 28px;
            font-weight: bold;
            color: #667eea;
        }
        .stat-box .label {
            font-size: 12px;
            color: #666;
            text-transform: uppercase;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        th {
            background: #667eea;
            color: white;
            padding: 10px;
            text-align: left;
            font-weight: bold;
        }
        td {
            padding: 8px;
            border-bottom: 1px solid #ddd;
        }
        tr:nth-child(even) {
            background: #f8f9fa;
        }
        .status {
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 10px;
            font-weight: bold;
            text-transform: uppercase;
        }
        .status-approved { background: #d4edda; color: #155724; }
        .status-pending { background: #fff3cd; color: #856404; }
        .status-rejected { background: #f8d7da; color: #721c24; }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .summary-section {
            margin: 20px 0;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
        }
        .summary-section h3 {
            margin-top: 0;
            color: #667eea;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>HRFlow - Leave Report</h1>
        <p>Period: {{ date('F d, Y', strtotime($startDate)) }} - {{ date('F d, Y', strtotime($endDate)) }}</p>
        <p>Generated on: {{ $generatedAt }}</p>
    </div>

    <div class="stats">
        <div class="stat-box">
            <div class="number">{{ $stats['total'] }}</div>
            <div class="label">Total Requests</div>
        </div>
        <div class="stat-box">
            <div class="number">{{ $stats['approved'] }}</div>
            <div class="label">Approved</div>
        </div>
        <div class="stat-box">
            <div class="number">{{ $stats['pending'] }}</div>
            <div class="label">Pending</div>
        </div>
        <div class="stat-box">
            <div class="number">{{ $stats['rejected'] }}</div>
            <div class="label">Rejected</div>
        </div>
        <div class="stat-box">
            <div class="number">{{ $stats['total_days'] }}</div>
            <div class="label">Total Days</div>
        </div>
    </div>

    @if($byType->count() > 0)
    <div class="summary-section">
        <h3>Leave Types Summary</h3>
        <table>
            <thead>
                <tr>
                    <th>Leave Type</th>
                    <th style="text-align: center">Requests</th>
                    <th style="text-align: center">Approved Days</th>
                </tr>
            </thead>
            <tbody>
                @foreach($byType as $type => $data)
                <tr>
                    <td>{{ $type }}</td>
                    <td style="text-align: center">{{ $data['count'] }}</td>
                    <td style="text-align: center">{{ $data['days'] }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>
    @endif

    <h3 style="margin-top: 30px; color: #667eea;">Leave Requests Detail</h3>
    <table>
        <thead>
            <tr>
                <th>Employee</th>
                <th>Type</th>
                <th>Start Date</th>
                <th>End Date</th>
                <th style="text-align: center">Days</th>
                <th>Status</th>
                <th>Approved By</th>
            </tr>
        </thead>
        <tbody>
            @forelse($leaves as $leave)
            <tr>
                <td>{{ $leave->user->name }}</td>
                <td>{{ $leave->leaveType->name }}</td>
                <td>{{ date('M d, Y', strtotime($leave->start_date)) }}</td>
                <td>{{ date('M d, Y', strtotime($leave->end_date)) }}</td>
                <td style="text-align: center">{{ $leave->days }}</td>
                <td>
                    <span class="status status-{{ $leave->status }}">
                        {{ ucfirst($leave->status) }}
                    </span>
                </td>
                <td>{{ $leave->approver?->name ?? '-' }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="7" style="text-align: center; padding: 20px; color: #999;">
                    No leave requests found for this period
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>

    <div class="footer">
        <p>This is a computer-generated document. No signature is required.</p>
        <p>&copy; {{ date('Y') }} HRFlow - HR & Leave Management System</p>
    </div>
</body>
</html>
