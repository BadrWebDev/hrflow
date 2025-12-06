<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }
        .container {
            background-color: #f8f9fa;
            border-radius: 8px;
            padding: 30px;
        }
        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 20px;
            border-radius: 8px 8px 0 0;
            text-align: center;
        }
        .content {
            background: white;
            padding: 30px;
            border-radius: 0 0 8px 8px;
        }
        h1 {
            margin: 0;
            font-size: 24px;
        }
        .notification-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: bold;
            margin: 15px 0;
        }
        .badge-submitted {
            background: #fff3cd;
            color: #856404;
        }
        .badge-approved {
            background: #d4edda;
            color: #155724;
        }
        .badge-rejected {
            background: #f8d7da;
            color: #721c24;
        }
        .badge-cancelled {
            background: #e2e3e5;
            color: #383d41;
        }
        .details {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 6px;
            margin: 20px 0;
        }
        .details p {
            margin: 8px 0;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 2px solid #e0e0e0;
            color: #666;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            padding: 12px 30px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            text-decoration: none;
            border-radius: 6px;
            margin: 20px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏢 HRFlow</h1>
        </div>
        <div class="content">
            <h2>{{ $notification->title }}</h2>
            
            @php
                $badgeClass = 'badge-submitted';
                if (str_contains($notification->type, 'approved')) {
                    $badgeClass = 'badge-approved';
                } elseif (str_contains($notification->type, 'rejected')) {
                    $badgeClass = 'badge-rejected';
                } elseif (str_contains($notification->type, 'cancelled')) {
                    $badgeClass = 'badge-cancelled';
                }
            @endphp
            
            <span class="notification-badge {{ $badgeClass }}">
                {{ ucwords(str_replace('_', ' ', $notification->type)) }}
            </span>
            
            <p>{{ $notification->message }}</p>
            
            @if(!empty($notification->data))
            <div class="details">
                <strong>Details:</strong>
                @if(isset($notification->data['leave_type']))
                    <p><strong>Leave Type:</strong> {{ $notification->data['leave_type'] }}</p>
                @endif
                @if(isset($notification->data['start_date']))
                    <p><strong>Start Date:</strong> {{ \Carbon\Carbon::parse($notification->data['start_date'])->format('F d, Y') }}</p>
                @endif
                @if(isset($notification->data['end_date']))
                    <p><strong>End Date:</strong> {{ \Carbon\Carbon::parse($notification->data['end_date'])->format('F d, Y') }}</p>
                @endif
                @if(isset($notification->data['approved_by']))
                    <p><strong>Approved By:</strong> {{ $notification->data['approved_by'] }}</p>
                @endif
                @if(isset($notification->data['rejected_by']))
                    <p><strong>Rejected By:</strong> {{ $notification->data['rejected_by'] }}</p>
                @endif
                @if(isset($notification->data['user_name']))
                    <p><strong>Employee:</strong> {{ $notification->data['user_name'] }}</p>
                @endif
            </div>
            @endif
            
            <div style="text-align: center;">
                <a href="{{ config('app.frontend_url', 'http://localhost:5174') }}/dashboard" class="button">
                    View Dashboard
                </a>
            </div>
        </div>
        <div class="footer">
            <p>This is an automated notification from HRFlow</p>
            <p>© {{ date('Y') }} HRFlow. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
