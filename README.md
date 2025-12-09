# HRFlow - Human Resources Management System

<p align="center">
  <img src="https://img.shields.io/badge/Laravel-11.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white" alt="Laravel">
  <img src="https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React">
  <img src="https://img.shields.io/badge/PHP-8.2-777BB4?style=for-the-badge&logo=php&logoColor=white" alt="PHP">
  <img src="https://img.shields.io/badge/MySQL-8.0-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL">
</p>

## 📋 Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Technologies](#technologies)
- [Architecture](#architecture)
- [Installation](#installation)
- [Usage](#usage)
- [API Documentation](#api-documentation)
- [Development Journey](#development-journey)
- [License](#license)

## 🎯 Overview

**HRFlow** is a comprehensive Human Resources Management System designed to streamline employee management, leave requests, department organization, and role-based access control. Built with modern web technologies, it provides a seamless experience for both administrators and employees.

### What Does HRFlow Do?

- **Employee Management**: Create, update, and manage employee profiles with department assignments
- **Leave Management**: Submit, approve, and track leave requests with different leave types
- **Department Organization**: Manage departments with hierarchical structure and department managers
- **Role-Based Access Control (RBAC)**: Flexible permission system with custom roles and granular permissions
- **Real-Time Notifications**: Get instant updates on leave approvals, rejections, and system events
- **Reporting & Analytics**: Export data and generate reports for HR insights
- **Bulk Operations**: Perform bulk actions on multiple leave requests or users

## ✨ Features

### For Employees
- ✅ Submit leave requests with date ranges and reasons
- ✅ View personal leave history and status
- ✅ Receive real-time notifications
- ✅ Update personal profile information
- ✅ View department information

### For Administrators
- ✅ Approve/reject leave requests with comments
- ✅ Manage employees (create, edit, delete)
- ✅ Organize departments and assign managers
- ✅ Create and manage leave types with quotas
- ✅ Configure custom roles with granular permissions
- ✅ Bulk approve/reject leave requests
- ✅ Export data (Excel, CSV, PDF)
- ✅ View comprehensive dashboard analytics

### Advanced Features
- 🔐 **Smart Permission System**: Auto-grant dependent permissions (e.g., "create user" automatically grants "view users", "view departments", "view roles")
- 🎨 **Modern UI/UX**: Glassmorphic design with smooth animations and micro-interactions
- 📱 **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- 🔔 **Real-Time Updates**: Live notification system with unread badges
- 🌐 **RESTful API**: Clean API architecture for easy integration

## 🛠 Technologies

### Backend Stack

#### Core Framework
- **Laravel 11.x** - PHP web application framework
  - Eloquent ORM for database interactions
  - Artisan CLI for task automation
  - Built-in authentication scaffolding
  - RESTful API routing

#### Authentication & Authorization
- **Laravel Sanctum** - API token authentication
  - Stateless authentication for SPA
  - Token management with personal access tokens
  - CORS configuration for cross-origin requests
  
- **Spatie Laravel Permission** - Role and permission management
  - Guard-based permissions (web guard)
  - Many-to-many relationship between users, roles, and permissions
  - Permission checking with `hasPermissionTo()` and `hasRole()`
  - Model traits: `HasRoles`, `HasPermissions`
  - Automatic dependency resolution for permissions

#### Database
- **MySQL 8.0** - Relational database
  - InnoDB storage engine
  - Foreign key constraints
  - Full-text search capabilities
  
#### Key Laravel Packages
- `laravel/sanctum` - API authentication
- `spatie/laravel-permission` - RBAC system
- `laravel/tinker` - Interactive REPL for debugging

### Frontend Stack

#### Core Framework
- **React 19.0** - JavaScript library for building user interfaces
  - Functional components with Hooks (useState, useEffect, useContext)
  - Context API for state management
  - React Router DOM for navigation
  
#### Build Tools
- **Vite 7.2** - Next-generation frontend tooling
  - Lightning-fast HMR (Hot Module Replacement)
  - Optimized production builds
  - ES modules support
  
#### HTTP Client
- **Axios** - Promise-based HTTP client
  - Interceptors for request/response handling
  - Automatic token injection
  - Error handling middleware

#### Styling
- **Custom CSS** with modern features
  - CSS Custom Properties (CSS variables) for theming
  - CSS Grid & Flexbox layouts
  - Keyframe animations
  - Backdrop filters (glassmorphism effect)
  - Smooth transitions & transforms

### Design System

#### Color Palette
- Primary: `#6366f1` (Indigo) - Main brand color
- Success: `#10b981` (Emerald) - Positive actions
- Warning: `#f59e0b` (Amber) - Alerts
- Danger: `#ef4444` (Red) - Destructive actions
- Neutrals: Gray scale from 50 to 900

#### Typography
- System font stack for optimal readability
- Size scale: 0.75rem to 2rem
- Font weights: 400, 500, 600, 700

#### Spacing System
- Scale: xs (0.5rem) to 2xl (2rem)
- Consistent padding and margin values

#### UI Components
- **Buttons**: Primary, secondary, success, danger variants
- **Cards**: Elevated surfaces with shadow and border
- **Badges**: Status indicators with color coding
- **Modals**: Overlay dialogs with backdrop blur
- **Forms**: Input fields, select dropdowns, checkboxes
- **Tables**: Sortable, hoverable rows

#### Animations
- `fadeIn`, `slideUp`, `slideDown` - Entry animations
- `gradientShift` - Background animation (15s)
- `pulse`, `spin` - Loading indicators
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
│   └── bulkService.js
└── styles/
    ├── index.css             # Global + variables
    ├── components.css        # Reusable components
    └── Dashboard.css
```

### Database Schema

**Core Tables:**
- `users` - Employee information
- `departments` - Department structure
- `leaves` - Leave requests
- `leave_types` - Leave type definitions
- `notifications` - System notifications

**Spatie Permission Tables:**
- `roles` - Role definitions
- `permissions` - Permission definitions
- `model_has_roles` - User-role assignments
- `role_has_permissions` - Role-permission assignments

### Authentication Flow

1. User submits credentials → Backend validates
2. Sanctum token generated and returned
3. Token stored in `localStorage`
4. Axios interceptor injects token in all requests
5. Backend validates token on protected routes
6. User data fetched and stored in Context

### Permission System Flow

1. Admin creates role with permissions
2. Backend auto-adds dependent permissions
3. User assigned to role
4. Controllers check `hasPermissionTo()`
5. Frontend guards UI based on permissions

## 📦 Installation

### Prerequisites
- PHP >= 8.2
- Composer >= 2.0
- Node.js >= 18.0
- MySQL >= 8.0

### Backend Setup

```bash
# Navigate to backend
cd Backend

# Install dependencies
composer install

# Configure environment
cp .env.example .env
php artisan key:generate

# Update .env with database credentials
DB_DATABASE=hrflow
DB_USERNAME=root
DB_PASSWORD=your_password

# Run migrations with seeders
php artisan migrate:fresh --seed

# Start server
php artisan serve
```

**Default Credentials:**
- Admin: `admin@hrflow.test` / `Admin1234`
- Employee: `john@hrflow.test` / `password`

### Frontend Setup

```bash
# Navigate to frontend
cd Frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Frontend runs on `http://localhost:5173`

## 📚 Usage

### Creating a Custom Role

1. Login as admin
2. Click "🔐 Manage Roles"
3. Click "+ Create Role"
4. Enter role name
5. Select permissions (dependencies auto-checked)
6. Click "Create Role"

### Assigning Roles to Users

1. Navigate to "Users" tab
2. Click "Assign Role" on user row
3. Select role from dropdown
4. Click "Assign Role"

### Managing Leave Requests

**Employee:**
1. Click "Request Leave"
2. Select leave type and dates
3. Enter reason
4. Submit request

**Admin:**
1. View pending requests in dashboard
2. Click "Approve" or "Reject"
3. Employee receives notification

## 🔌 API Documentation

### Authentication

```http
POST /api/login
Content-Type: application/json

{
  "email": "admin@hrflow.test",
  "password": "Admin1234"
}

Response:
{
  "token": "1|abc123...",
  "user": {...}
}
```

### Leave Management

```http
GET /api/leaves
Authorization: Bearer {token}

Response:
[
  {
    "id": 1,
    "user_id": 2,
    "leave_type_id": 1,
    "start_date": "2025-12-20",
    "end_date": "2025-12-22",
    "status": "pending",
    "user": {...},
    "leaveType": {...}
  }
]
```

### Role Management

```http
POST /api/roles
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "hr_manager",
  "permissions": ["create user", "approve leave"]
}

Response:
{
  "id": 4,
  "name": "hr_manager",
  "permissions": [
    {"name": "create user"},
    {"name": "view users"},      // Auto-added
    {"name": "view departments"}, // Auto-added
    {"name": "view roles"},       // Auto-added
    {"name": "approve leave"}
  ]
}
```

## 🛣 Development Journey

### Phase 1: Foundation
- Set up Laravel backend with Sanctum authentication
- Created React frontend with Vite
- Designed database schema and migrations
- Implemented basic CRUD operations

### Phase 2: Authentication & Authorization
- Integrated Laravel Sanctum for API tokens
- Installed Spatie Permission package
- Created roles and permissions seeder
- **Fixed**: Guard mismatch (changed from `sanctum` to `web`)
- **Fixed**: Role assignment not working (added `assignRole()` call)

### Phase 3: Core Features
- Built leave request system
- Implemented approval workflow
- Created department management
- Added leave type configuration

### Phase 4: RBAC System
- Developed role management UI
- Implemented permission dependencies
- **Fixed**: Admin middleware blocking non-admin users with permissions
- **Fixed**: Hardcoded role validation (changed to dynamic)
- Added smart permission toggling in frontend

### Phase 5: UI/UX Enhancement
- Created comprehensive CSS variable system
- Built component library
- Implemented glassmorphic design
- Added animations and micro-interactions
- **Fixed**: Dashboard stats showing 0 on initial load

### Phase 6: Advanced Features
- Added notification system
- Implemented export functionality
- Created bulk operations
- Added real-time updates

### Key Challenges Solved

**Challenge 1: Guard Mismatch**
- **Problem**: Roles used `sanctum` guard, users used `web`
- **Solution**: Standardized to `web` guard throughout
- **Impact**: Permission checks started working

**Challenge 2: Permission Access**
- **Problem**: Non-admins couldn't access role endpoints
- **Solution**: Moved routes outside admin middleware
- **Impact**: Permission-based access implemented correctly

**Challenge 3: Dynamic Roles**
- **Problem**: User creation only accepted 'employee' or 'admin'
- **Solution**: Changed validation to `exists:roles,name`
- **Impact**: Custom roles can be assigned

**Challenge 4: Permission Dependencies**
- **Problem**: Users had incomplete permission sets
- **Solution**: Auto-dependency system in backend + frontend
- **Impact**: Valid permission combinations guaranteed

## 📄 License

This project is open-sourced under the MIT License.

## 🙏 Acknowledgments

- Laravel community for excellent documentation
- React team for React 19 features
- Spatie for the Permission package
- Vite team for amazing build tool

---

<p align="center">Made with ❤️ using Laravel & React</p>
