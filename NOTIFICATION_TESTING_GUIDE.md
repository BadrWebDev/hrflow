# 🔔 Notification System - Testing Guide

## Overview
HRFlow includes a comprehensive notification system with both in-app notifications and email alerts.

## Features
- 📱 **In-App Notifications**: Bell icon in navbar with unread count badge
- 📧 **Email Notifications**: Beautiful HTML emails with color-coded badges
- 🔄 **Auto-Refresh**: Checks for new notifications every 30 seconds
- ✅ **Mark as Read**: Click individual notifications or mark all as read

---

## Notification Triggers

### 1. Leave Submitted (Admin receives)
**When:** Employee submits a new leave request
**Recipients:** All admin users
**Notification:**
- Title: "New Leave Request"
- Message: "John Doe has submitted a leave request"
- Icon: 📝

### 2. Leave Approved (Employee receives)
**When:** Admin approves a leave request
**Recipients:** The employee who submitted the request
**Notification:**
- Title: "Leave Request Approved"
- Message: "Your leave request has been approved"
- Icon: ✅
- Badge: Green "APPROVED"

### 3. Leave Rejected (Employee receives)
**When:** Admin rejects a leave request
**Recipients:** The employee who submitted the request
**Notification:**
- Title: "Leave Request Rejected"
- Message: "Your leave request has been rejected"
- Icon: ❌
- Badge: Red "REJECTED"

### 4. Leave Cancelled (Admin receives)
**When:** Employee cancels their pending request
**Recipients:** All admin users
**Notification:**
- Title: "Leave Request Cancelled"
- Message: "John Doe has cancelled their leave request"
- Icon: 🚫

---


## Testing Steps

### Test 1: Submit Leave (Employee → Admin)
1. Login as **Employee** (`john@hrflow.test` / `password`)
2. Click "Request Leave"
3. Fill in the form and submit
4. Logout

5. Login as **Admin** (`admin@hrflow.test` / `Admin1234`)
6. Check bell icon - you should see **1 unread notification**
7. Click the bell to see: "New Leave Request"
8. Check email log: `Backend/storage/logs/laravel.log` for email content

### Test 2: Approve Leave (Admin → Employee)
1. As **Admin**, approve the leave request from Test 1
2. Logout

3. Login as **Employee** (`john@hrflow.test` / `password`)
4. Check bell icon - you should see **1 unread notification**
5. Click the bell to see: "Leave Request Approved" with ✅
6. Click the notification to mark it as read
7. Check email log for approval email

### Test 3: Reject Leave (Admin → Employee)
1. Login as **Employee** (`john@hrflow.test` / `password`)
2. Submit another leave request
3. Logout

4. Login as **Admin** (`admin@hrflow.test` / `Admin1234`)
5. Reject the new request
6. Logout

7. Login as **Employee**
8. Check notification: "Leave Request Rejected" with ❌ (red)
9. Email log will show rejection email with red badge

### Test 4: Cancel Leave (Employee → Admin)
1. Login as **Employee**
2. Submit a leave request
3. Immediately cancel it from the dashboard
4. Logout

5. Login as **Admin**
6. Check notification: "Leave Request Cancelled" with 🚫

### Test 5: Mark All as Read
1. Login with account that has multiple unread notifications
2. Click the bell icon
3. Click "Mark all read" button
4. Badge should disappear
5. All notifications should appear without the blue dot

---

## Email Configuration

### Development (Current Setup)
```env
MAIL_MAILER=log
```
- Emails are logged to `Backend/storage/logs/laravel.log`
- Search for "MIME-Version" or "leave request" in the log file
- Safe for testing without sending real emails

### Production (Gmail SMTP)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your-email@gmail.com
MAIL_PASSWORD=your-app-password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=your-email@gmail.com
MAIL_FROM_NAME=HRFlow
```

**Note:** For Gmail, you need to:
1. Enable 2-Factor Authentication
2. Generate an "App Password" (not your regular password)
3. Use the app password in `MAIL_PASSWORD`

### Production (Mailtrap for Testing)
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your-mailtrap-username
MAIL_PASSWORD=your-mailtrap-password
MAIL_FROM_ADDRESS=noreply@hrflow.test
```

---

## Notification UI Components

### NotificationDropdown Component
- **Location:** `Frontend/src/components/NotificationDropdown.jsx`
- **Features:**
  - Bell icon with badge
  - Dropdown panel with list
  - Unread count
  - Mark as read functionality
  - Auto-polling every 30s

### Notification Service
- **Location:** `Frontend/src/services/notificationService.js`
- **Endpoints:**
  - `GET /api/notifications` - Fetch all notifications
  - `GET /api/notifications/unread-count` - Get unread count
  - `POST /api/notifications/{id}/read` - Mark one as read
  - `POST /api/notifications/mark-all-read` - Mark all as read

### Backend Service
- **Location:** `Backend/app/Services/NotificationService.php`
- **Methods:**
  - `notifyLeaveSubmitted()` - Notify admins
  - `notifyLeaveApproved()` - Notify employee
  - `notifyLeaveRejected()` - Notify employee
  - `notifyLeaveCancelled()` - Notify admins
  - `sendEmail()` - Send email with error handling

---

## Email Template

**Location:** `Backend/resources/views/emails/leave-notification.blade.php`

**Features:**
- Gradient header (#667eea → #764ba2)
- Color-coded badges:
  - 🟢 Green: Approved
  - 🔴 Red: Rejected
  - 🟡 Yellow: Pending
  - ⚪ Gray: Cancelled
- Leave details section
- Responsive design
- Professional styling

---

## Database Schema

**Table:** `notifications`

| Column      | Type      | Description                           |
|-------------|-----------|---------------------------------------|
| id          | bigint    | Primary key                           |
| user_id     | bigint    | Recipient user                        |
| title       | string    | Notification title                    |
| message     | text      | Notification message                  |
| type        | string    | Type (leave_submitted, etc.)          |
| data        | json      | Additional data (leave details)       |
| read_at     | timestamp | When notification was read (nullable) |
| email_sent  | boolean   | Whether email was sent successfully   |
| created_at  | timestamp | Creation time                         |
| updated_at  | timestamp | Last update time                      |

---

## Troubleshooting

### Notification Not Appearing
1. Check browser console for errors
2. Verify token is valid (check Network tab)
3. Check `Backend/storage/logs/laravel.log` for errors
4. Ensure backend is running on port 8000

### Email Not Sent
1. Check `MAIL_MAILER` in `.env` is set to `log`
2. Verify log file exists: `Backend/storage/logs/laravel.log`
3. Search log for "MIME-Version" or email content
4. If using SMTP, verify credentials and firewall settings

### Unread Count Not Updating
1. Wait 30 seconds for auto-refresh
2. Click bell to manually refresh
3. Check browser console for fetch errors
4. Verify API endpoint: `GET /api/notifications/unread-count`

### Notification Shows Wrong Recipient
1. Check `NotificationService.php` logic
2. Verify `isAdmin()` is working correctly
3. Check database `notifications` table for `user_id`
4. Ensure proper user is logged in

---

## Code Examples

### Trigger Notification Manually
```php
use App\Services\NotificationService;

$notificationService = new NotificationService();
$notificationService->notifyLeaveApproved($leave);
```

### Check Notifications in Tinker
```bash
php artisan tinker

# Get all notifications for user ID 1
Notification::where('user_id', 1)->get();

# Count unread notifications
Notification::where('user_id', 1)->whereNull('read_at')->count();

# Mark all as read
Notification::where('user_id', 1)->update(['read_at' => now()]);
```

### Test Email Sending
```bash
php artisan tinker

# Send test email
Mail::raw('Test email', function ($message) {
    $message->to('test@example.com')
            ->subject('Test Email from HRFlow');
});

# Check laravel.log for output
```

---

## Future Enhancements

- [ ] Real-time notifications using WebSockets (Laravel Echo + Pusher)
- [ ] Push notifications for mobile browsers
- [ ] Notification preferences (toggle email/in-app per type)
- [ ] Notification history with pagination
- [ ] Filter notifications by type
- [ ] Delete individual notifications
- [ ] Sound notification on new alert

---

## Summary

✅ **Notifications Created:** When leaves are submitted/approved/rejected/cancelled  
✅ **In-App Display:** Bell icon with dropdown list  
✅ **Email Alerts:** Beautiful HTML emails sent automatically  
✅ **Mark as Read:** Individual and bulk options  
✅ **Auto-Refresh:** Every 30 seconds  
✅ **Error Handling:** Email failures don't break notification creation  

**Status:** Fully functional and production-ready! 🚀
