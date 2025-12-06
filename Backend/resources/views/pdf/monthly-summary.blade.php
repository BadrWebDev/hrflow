<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Monthly Leave Summary</title>
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
        .overview {
            background: #f8f9fa;
            padding: 20px;
            border-radius: 5px;
            margin-bottom: 30px;
            text-align: center;
        }
        .overview h2 {
            margin: 0 0 10px 0;
            color: #667eea;
        }
        .overview-stats {
            display: table;
            width: 100%;
            margin-top: 15px;
        }
        .overview-stat {
            display: table-cell;
            width: 50%;
            padding: 10px;
        }
        .overview-stat .number {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
        }
        .overview-stat .label {
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
        .text-center {
            text-align: center;
        }
        .text-right {
            text-align: right;
        }
        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 10px;
            color: #999;
            border-top: 1px solid #ddd;
            padding-top: 10px;
        }
        .highlight {
            background: #fff3cd;
            font-weight: bold;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>HRFlow - Monthly Leave Summary</h1>
        <p>{{ $month }}</p>
        <p>Generated on: {{ $generatedAt }}</p>
    </div>

    <div class="overview">
        <h2>Overview</h2>
        <div class="overview-stats">
            <div class="overview-stat">
                <div class="number">{{ $totalLeaves }}</div>
                <div class="label">Total Leave Requests</div>
            </div>
            <div class="overview-stat">
                <div class="number">{{ $totalDays }}</div>
                <div class="label">Total Approved Days</div>
            </div>
        </div>
    </div>

    <h3 style="color: #667eea;">Employee-wise Summary</h3>
    <table>
        <thead>
            <tr>
                <th>Employee Name</th>
                <th class="text-center">Total Requests</th>
                <th class="text-center">Approved</th>
                <th class="text-center">Pending</th>
                <th class="text-center">Rejected</th>
                <th class="text-center">Approved Days</th>
            </tr>
        </thead>
        <tbody>
            @forelse($byUser as $userName => $data)
            <tr>
                <td>{{ $userName }}</td>
                <td class="text-center">{{ $data['total'] }}</td>
                <td class="text-center">{{ $data['approved'] }}</td>
                <td class="text-center">{{ $data['pending'] }}</td>
                <td class="text-center">{{ $data['rejected'] }}</td>
                <td class="text-center highlight">{{ $data['days'] }}</td>
            </tr>
            @empty
            <tr>
                <td colspan="6" style="text-align: center; padding: 20px; color: #999;">
                    No leave requests found for this month
                </td>
            </tr>
            @endforelse
            @if($byUser->count() > 0)
            <tr style="background: #667eea; color: white; font-weight: bold;">
                <td>TOTAL</td>
                <td class="text-center">{{ $byUser->sum('total') }}</td>
                <td class="text-center">{{ $byUser->sum('approved') }}</td>
                <td class="text-center">{{ $byUser->sum('pending') }}</td>
                <td class="text-center">{{ $byUser->sum('rejected') }}</td>
                <td class="text-center">{{ $byUser->sum('days') }}</td>
            </tr>
            @endif
        </tbody>
    </table>

    <div class="footer">
        <p>This is a computer-generated document. No signature is required.</p>
        <p>&copy; {{ date('Y') }} HRFlow - HR & Leave Management System</p>
    </div>
</body>
</html>
