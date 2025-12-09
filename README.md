<div align="center">

# HRFlow

### Enterprise-Grade Human Resources Management System

[![Laravel](https://img.shields.io/badge/Laravel-11.x-FF2D20?style=flat-square&logo=laravel&logoColor=white)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=flat-square&logo=react&logoColor=black)](https://reactjs.org)
[![PHP](https://img.shields.io/badge/PHP-8.2+-777BB4?style=flat-square&logo=php&logoColor=white)](https://php.net)
[![MySQL](https://img.shields.io/badge/MySQL-8.0+-4479A1?style=flat-square&logo=mysql&logoColor=white)](https://mysql.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

[Features](#-key-features) • [Tech Stack](#-technology-stack) • [Installation](#-installation) • [Documentation](#-documentation) • [API](#-api-reference)

</div>

---

## 📖 Overview

HRFlow is a modern, full-stack Human Resources Management System engineered for scalability, security, and user experience. It empowers organizations to efficiently manage workforce operations, leave requests, departmental structures, and granular access control through an intuitive interface.

Built on Laravel 11 and React 19, HRFlow implements industry best practices including RESTful API architecture, token-based authentication, and dynamic role-based access control (RBAC).

---

## 🚀 Key Features

### Core Functionality

| Feature | Description |
|---------|-------------|
| **Employee Management** | Complete CRUD operations with department assignments and profile management |
| **Leave Management** | Multi-type leave requests with approval workflows and quota tracking |
| **Department Organization** | Hierarchical department structure with manager assignments |
| **RBAC System** | Dynamic roles with 25+ granular permissions and auto-dependency resolution |
| **Email Notifications** | Automated email alerts for leave approvals, rejections, and status updates |
| **In-App Notifications** | Real-time notification system with unread badges and notification center |
| **Advanced Reporting** | Generate monthly summaries, date-range reports, and export data in multiple formats |
| **Data Export** | Export users, leaves, and reports in Excel, CSV, and PDF formats |
| **Bulk Operations** | Batch processing for leave approvals and administrative tasks |

### Advanced Capabilities

- **Smart Permission Dependencies**: Automatically grant prerequisite permissions (e.g., "create user" implies "view users", "view departments")
- **Email Integration**: Automatic email notifications sent via Laravel Mail when leave requests are approved/rejected
- **Comprehensive Reporting**: Monthly summary PDFs, date-range leave reports, and customizable data exports
- **Flexible Data Export**: Download employee data, leave records filtered by date range, and monthly summaries in Excel, CSV, or PDF
- **Glassmorphic UI**: Modern design system with 70+ CSS variables and smooth animations
- **Responsive Design**: Mobile-first approach with cross-device compatibility
- **RESTful API**: Clean, documented API architecture for seamless integrations
- **Token Authentication**: Stateless authentication via Laravel Sanctum

---

## 💻 Technology Stack

### Backend Architecture

```
Laravel 11.x Framework
├── Authentication: Laravel Sanctum (Stateless token-based)
├── Authorization: Spatie Laravel Permission (RBAC)
├── Email: Laravel Mail with Mailtrap/SMTP
├── Database: MySQL 8.0+ (InnoDB Engine)
├── ORM: Eloquent
└── API: RESTful Architecture
```

**Key Components:**
- **Laravel Sanctum**: Personal access tokens for SPA authentication, CORS configuration
- **Spatie Permission**: Role-permission management with guard-based access control (`web` guard)
- **Laravel Mail**: Email notifications for leave approvals, rejections, and system updates
- **Eloquent ORM**: Database abstraction with relationship management
- **Middleware**: Authentication, authorization, and CORS handling

### Frontend Architecture

```
React 19.0 Ecosystem
├── Build Tool: Vite 7.2
├── HTTP Client: Axios
├── Routing: React Router DOM
├── State: Context API
└── Styling: Custom CSS (70+ Variables)
```

**Key Features:**
- **Vite**: Next-generation bundler with instant HMR and optimized builds
- **Axios Interceptors**: Automatic token injection and centralized error handling
- **Context API**: Global authentication state management
- **CSS Variables**: Themeable design system with consistent spacing and colors

### Database Schema

```sql
Core Tables:
├── users (id, name, email, department_id)
├── departments (id, name, description)
├── leaves (id, user_id, leave_type_id, start_date, end_date, status)
├── leave_types (id, name, days_allowed)
├── roles (id, name, guard_name)
├── permissions (id, name, guard_name)
├── model_has_roles (user_id, role_id)
└── role_has_permissions (role_id, permission_id)
```
- `shakeError` - Error feedback

## 🏗 Architecture

### Backend Architecture (MVC Pattern)

```
app/
├── Http/
│   ├── Controllers/
│   │   ├── Auth/              # Authentication
│   │   ├── LeaveController    # Leave CRUD operations
│   │   ├── UserController     # User management
│   │   ├── DepartmentController
│   │   ├── LeaveTypeController
│   │   ├── RoleController     # RBAC management
│   │   └── NotificationController
│   ├── Middleware/
│   │   └── IsAdmin.php        # Admin route protection
│   └── Requests/              # Form validation
├── Models/
│   ├── User.php              # HasRoles, HasPermissions
│   ├── Leave.php
│   ├── Department.php
│   └── LeaveType.php
└── Providers/
```

### Frontend Architecture

```
src/
├── components/
│   ├── Navbar.jsx            # Top navigation
│   ├── ExportPanel.jsx       # Data export dropdown
│   └── ProtectedRoute.jsx    # Auth guard
├── pages/
│   ├── Login.jsx             # Authentication
│   ├── Register.jsx
│   ├── EmployeeDashboard.jsx # Employee view
│   ├── AdminDashboard.jsx    # Admin view
│   └── RoleManagement.jsx    # RBAC management
├── context/
│   └── AuthContext.jsx       # Global auth state
├── services/
│   ├── api.js                # Axios instance
│   ├── authService.js        # Auth API calls
│   ├── leaveService.js
│   ├── roleService.js
---

## 🏗️ System Architecture

### Project Structure

```
HRFlow/
├── Backend/                    # Laravel 11 API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/   # Business logic
│   │   │   ├── Middleware/    # Request filtering
│   │   │   └── Requests/      # Form validation
│   │   └── Models/            # Eloquent models
│   ├── database/
│   │   ├── migrations/        # Schema definitions
│   │   └── seeders/           # Sample data
│   ├── routes/
│   │   └── api.php            # API endpoints
│   └── config/                # Application configuration
│
└── Frontend/                   # React 19 SPA
    ├── src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Route-level components
    │   ├── context/           # Global state management
    │   ├── services/          # API abstraction layer
    │   └── styles/            # CSS modules
    └── public/                # Static assets
```

### Authentication Flow

```
1. User Login
   ↓
2. Laravel validates credentials
   ↓
3. Sanctum generates access token
   ↓
4. Token returned to frontend
   ↓
5. Token stored in localStorage
   ↓
6. Axios interceptor injects token in headers
   ↓
7. Backend validates token on each request
```

### Permission Architecture

```
User → Roles → Permissions

Example:
User "John Doe"
  ↓
Role "Department Manager"
  ↓
Permissions: [view users, approve leave, view departments]
  ↓
Auto-granted: [view roles] (dependency resolution)
```

---

## 📦 Installation

### System Requirements

- **PHP**: 8.2 or higher
- **Composer**: 2.0+
- **Node.js**: 18.0+ (LTS recommended)
- **MySQL**: 8.0+
- **Git**: Latest version

### Backend Setup

```bash
# Clone repository
git clone https://github.com/yourusername/hrflow.git
cd hrflow/Backend

# Install PHP dependencies
composer install

# Environment configuration
cp .env.example .env
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hrflow
DB_USERNAME=root
DB_PASSWORD=your_password

# Configure email (optional - for notifications)
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=your_mailtrap_username
MAIL_PASSWORD=your_mailtrap_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS=noreply@hrflow.test
MAIL_FROM_NAME="HRFlow System"

# Run migrations and seed data
php artisan migrate:fresh --seed

# Start development server
php artisan serve
```

**Server runs at**: `http://localhost:8000`

**Default credentials:**
- **Admin**: `admin@hrflow.test` / `Admin1234`
- **Employee**: `john@hrflow.test` / `password`

### Frontend Setup

```bash
# Navigate to frontend
cd ../Frontend

# Install Node dependencies
npm install

# Start development server
npm run dev
```

**Application runs at**: `http://localhost:5173`

### Email Configuration (Optional)

HRFlow sends automated email notifications for:
- Leave request submissions (to admins)
- Leave approvals (to employees)
- Leave rejections (to employees)
- Leave cancellations (to admins)

**Mailtrap (Development):**
1. Sign up at [mailtrap.io](https://mailtrap.io)
2. Copy SMTP credentials to `.env`
3. Test emails will appear in Mailtrap inbox

**Gmail/SMTP (Production):**
```env
MAIL_MAILER=smtp
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
MAIL_ENCRYPTION=tls
```

### Production Build

```bash
# Backend optimization
composer install --optimize-autoloader --no-dev
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Frontend build
npm run build
```

---

## 📖 Documentation

### User Workflows

**Creating Custom Roles:**
1. Login as administrator
2. Navigate to "Manage Roles"
3. Click "Create Role" button
4. Define role name and select permissions
5. System automatically grants dependent permissions
6. Save role

**Leave Request Process:**
- **Employee**: Submit → Select type/dates → Add reason → Await approval
- **Manager**: Review → Approve/Reject → Add comments → Employee notified

**Export & Reporting:**
1. Click "📊 Export & Reports" button
2. Choose export type:
   - **Employee Data**: Download all users in Excel or CSV
   - **Leave Data**: Export leaves with optional date range filtering
   - **Monthly Reports**: Generate PDF summary for specific month
3. Select filters (date range or month)
4. System generates and downloads report instantly

**Available Reports:**
- **Users Excel/CSV**: Complete employee directory with departments
- **Leaves Excel/CSV**: Leave records with date range filtering
- **Leave Report PDF**: Formatted report with statistics and leave details
- **Monthly Summary PDF**: Comprehensive monthly overview with charts and insights

### Configuration

**Environment Variables:**
```env
# Backend (.env)
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173

# Database
DB_CONNECTION=mysql
DB_DATABASE=hrflow

# Sanctum
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DRIVER=cookie
```

---

## 🔌 API Reference

### Authentication Endpoints

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@hrflow.test",
  "password": "Admin1234"
}
```

**Response:**
```json
{
  "token": "1|abc123xyz...",
  "user": {
    "id": 1,
    "name": "Admin User",
    "email": "admin@hrflow.test",
    "role": "admin"
  }
}
```

#### Register
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123",
  "department_id": 1,
  "role": "employee"
}
```

### Leave Management

#### Get All Leaves
```http
GET /api/leaves
Authorization: Bearer {token}
```

#### Create Leave Request
```http
POST /api/leaves
Authorization: Bearer {token}
Content-Type: application/json

{
  "leave_type_id": 1,
  "start_date": "2025-12-20",
  "end_date": "2025-12-22",
  "reason": "Personal matters"
}
```

#### Update Leave Status
```http
PUT /api/leaves/{id}/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "approved",
  "comment": "Approved by manager"
}
```

### Role & Permission Management

#### Get All Roles
```http
GET /api/roles
Authorization: Bearer {token}
```

#### Create Role with Permissions
```http
POST /api/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "hr_manager",
  "permissions": ["create user", "approve leave", "view departments"]
}
```

**Response** (with auto-granted dependencies):
```json
{
  "id": 4,
  "name": "hr_manager",
  "permissions": [
    "create user",
    "view users",        // Auto-granted
    "view departments",  // Original
    "view roles",        // Auto-granted
    "approve leave"
  ]
}
```

### User Management

#### Get All Users
```http
GET /api/users
Authorization: Bearer {token}
```

#### Assign Role to User
```http
POST /api/users/{id}/assign-role
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "department_manager"
}
```

---

## 🚀 Development Journey

### Project Evolution

**Phase 1: Foundation** (Week 1)
- Laravel backend scaffolding with Sanctum
- React frontend initialization with Vite
- Database schema design and migrations
- Basic authentication implementation

**Phase 2: Core Features** (Week 2)
- Leave management system (CRUD)
- Department organization module
- User management with role assignment
- API endpoint development

**Phase 3: RBAC Implementation** (Week 3)
- Spatie Permission package integration
- **Challenge**: Guard mismatch (`sanctum` vs `web`) causing permission failures
- **Solution**: Standardized to `web` guard across all models
- Dynamic permission dependency system

**Phase 4: UI/UX Enhancement** (Week 4)
- Custom CSS design system with 70+ variables
- Glassmorphic component library
- Responsive layouts and animations
- **Challenge**: Dashboard stats showing zero on mount
- **Solution**: Implemented `fetchAllStats()` with `Promise.all()`

**Phase 5: Advanced Features** (Week 5)
- Smart permission dependencies (frontend + backend)
- Bulk operations for leave approvals
- Export functionality (Excel/CSV/PDF)
- Real-time notification system

### Technical Challenges Solved

| Challenge | Impact | Solution |
|-----------|--------|----------|
| **Guard Mismatch** | Permission checks failing | Changed all guards from `sanctum` to `web` |
| **Admin Middleware** | Non-admin users blocked from role endpoints | Moved routes outside admin middleware, used permission checks |
| **Hardcoded Validation** | Custom roles rejected | Changed validation from `in:employee,admin` to `exists:roles,name` |
| **Permission Dependencies** | Incomplete permission sets | Implemented auto-dependency resolution in `RoleController` |
| **Stats Not Loading** | Dashboard showed zero | Used `Promise.all()` for concurrent data fetching |

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 📞 Support

For issues, questions, or contributions:
- **Issues**: [GitHub Issues](https://github.com/yourusername/hrflow/issues)
- **Documentation**: [Wiki](https://github.com/yourusername/hrflow/wiki)
- **Email**: support@hrflow.dev

---

<div align="center">

**Built with ❤️ using Laravel & React**

[⬆ Back to Top](#hrflow)

</div>
