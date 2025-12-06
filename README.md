# 🚀 HRFlow - HR & Leave Management System

> A modern, full-stack web application for managing employee leave requests with role-based access control and real-time approval workflows.

[![Laravel](https://img.shields.io/badge/Laravel-11.x-red?logo=laravel)](https://laravel.com)
[![React](https://img.shields.io/badge/React-19.x-blue?logo=react)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📸 Screenshots

### Employee Dashboard
![Employee Dashboard](screenshots/employee-dashboard.png)
*Submit and track leave requests with real-time status updates*

### Admin Dashboard
![Admin Dashboard](screenshots/admin-dashboard.png)
*Approve/reject requests and manage employees from a centralized interface*

### Login Screen
![Login Screen](screenshots/login.png)
*Secure authentication with demo credentials for testing*

---

## ✨ Features

### 👤 For Employees
- 📝 Submit leave requests with date range selection
- 📊 View personal leave history and statistics
- 🔔 Real-time status updates (Pending/Approved/Rejected)
- ❌ Cancel pending requests
- 📈 Dashboard with visual statistics

### 👨‍💼 For Administrators
- ✅ Approve or reject leave requests
- 👥 Manage employees (view, create, delete)
- 🏢 Manage departments and leave types
- 📊 View company-wide leave statistics
- 🔍 Filter and search functionality

### 🔐 Security
- JWT-based authentication with Laravel Sanctum
- Role-based access control (RBAC)
- Protected API routes with middleware
- Automatic token refresh
- Secure password hashing

---

## 🛠️ Tech Stack

### Backend
- **Framework:** Laravel 11
- **Database:** MySQL
- **Authentication:** Laravel Sanctum (Token-based)
- **API:** RESTful architecture

### Frontend
- **Library:** React 19
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **State Management:** Context API
- **Build Tool:** Vite
- **Styling:** Custom CSS

---

## 📋 Prerequisites

Before running this project, make sure you have:

- PHP >= 8.2
- Composer
- Node.js >= 18.x
- MySQL/MariaDB
- npm or yarn

---

## 🚀 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/hrflow.git
cd hrflow
```

### 2. Backend Setup

```bash
# Navigate to backend folder
cd Backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env file
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=hrflow
DB_USERNAME=root
DB_PASSWORD=your_password

# Run migrations and seed database
php artisan migrate:fresh --seed

# Start Laravel server
php artisan serve
```

Backend will run on: `http://localhost:8000`

### 3. Frontend Setup

```bash
# Navigate to frontend folder (from root)
cd Frontend

# Install npm dependencies
npm install

# Start development server
npm run dev
```

Frontend will run on: `http://localhost:5173` or `http://localhost:5174`

---

## 🔑 Demo Credentials

### Admin Account
```
Email: admin@hrflow.test
Password: Admin1234
```
**Permissions:** Full access to approve/reject leaves, manage users, departments, and settings

### Employee Account
```
Email: john@hrflow.test
Password: password
```
**Permissions:** Submit leave requests, view personal history

### Additional Employee
```
Email: jane@hrflow.test
Password: password
```

---

## 📁 Project Structure

```
HRFlow/
├── Backend/                 # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # API Controllers
│   │   │   └── Middleware/     # Custom Middleware (IsAdmin)
│   │   └── Models/             # Eloquent Models
│   ├── database/
│   │   ├── migrations/         # Database Schema
│   │   └── seeders/            # Sample Data
│   └── routes/
│       └── api.php             # API Routes
│
└── Frontend/                # React Application
    └── src/
        ├── components/         # Reusable Components
        ├── context/            # Auth Context (Global State)
        ├── pages/              # Page Components
        ├── services/           # API Service Layer
        └── App.jsx             # Main Application Router
```

---

## 🔌 API Endpoints

### Authentication
```http
POST   /api/register          # Create new account
POST   /api/login             # User login
POST   /api/logout            # User logout
GET    /api/me                # Get current user
```

### Leaves (Authenticated)
```http
GET    /api/leaves            # List leaves (all for admin, own for employee)
POST   /api/leaves            # Create leave request
GET    /api/leaves/{id}       # View specific leave
PUT    /api/leaves/{id}       # Update leave status (admin only)
DELETE /api/leaves/{id}       # Cancel leave request
```

### Admin Only Routes
```http
GET    /api/users             # List all employees
POST   /api/users             # Create employee
DELETE /api/users/{id}        # Delete employee

GET    /api/departments       # List departments
POST   /api/departments       # Create department
PUT    /api/departments/{id}  # Update department
DELETE /api/departments/{id}  # Delete department

GET    /api/leave-types       # List leave types
POST   /api/leave-types       # Create leave type
PUT    /api/leave-types/{id}  # Update leave type
DELETE /api/leave-types/{id}  # Delete leave type
```

---

## 🧪 Testing

### Test API Endpoints
```bash
# Login and get token
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@hrflow.test","password":"Admin1234"}'

# Use token for authenticated requests
curl -X GET http://localhost:8000/api/leaves \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 🎯 Key Features Implementation

### 1. Authentication Flow
- User logs in → Backend validates → Returns JWT token
- Token stored in localStorage
- Axios interceptor adds token to all requests
- Auto-redirect on 401 Unauthorized

### 2. Role-Based Access Control
```php
// Middleware protects admin routes
Route::middleware(['auth:sanctum', 'admin'])->group(function () {
    Route::post('/departments', [DepartmentController::class, 'store']);
});
```

### 3. Real-Time Updates
- Optimistic UI updates
- Instant feedback on actions
- Auto-refresh after mutations

### 4. Responsive Design
- Mobile-friendly interface
- Adaptive grid layouts
- Touch-optimized controls

---

## 🌟 What Makes This Project Stand Out

1. **Enterprise Architecture:** Clean separation of concerns, scalable structure
2. **Security First:** Token authentication, middleware protection, input validation
3. **Modern Stack:** Latest versions of Laravel and React
4. **Best Practices:** DRY principle, reusable components, service layer pattern
5. **User Experience:** Intuitive UI, loading states, error handling
6. **Code Quality:** Well-commented, organized, maintainable

---

## 📚 What I Learned

### Backend Development
- RESTful API design principles
- Laravel Sanctum authentication
- Eloquent ORM and relationships
- Middleware for authorization
- Database migrations and seeding
- API resource controllers

### Frontend Development
- React Hooks (useState, useEffect, useContext)
- React Router v6 navigation
- Axios interceptors and error handling
- Context API for state management
- Protected routes implementation
- Form handling and validation

### Full-Stack Integration
- Token-based authentication flow
- API integration patterns
- Error handling strategies
- CORS configuration
- Development workflow

---

## 🚀 Future Enhancements

- [ ] **Leave Balance System** - Track remaining days per leave type
- [ ] **Email Notifications** - Notify on approval/rejection
- [ ] **Calendar View** - Visual leave calendar
- [ ] **File Uploads** - Attach documents to requests
- [ ] **Reports & Analytics** - Dashboard with charts
- [ ] **Mobile App** - React Native version
- [ ] **Dark Mode** - Theme switching
- [ ] **Export to PDF/Excel** - Leave reports

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👤 Author

**Your Name**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your LinkedIn](https://linkedin.com/in/yourprofile)
- Portfolio: [yourwebsite.com](https://yourwebsite.com)

---

## 🙏 Acknowledgments

- Laravel Community for excellent documentation
- React Team for the amazing library
- All contributors and testers

---

## 📧 Contact

For questions or feedback, please reach out:
- Email: your.email@example.com
- Project Link: [https://github.com/yourusername/hrflow](https://github.com/yourusername/hrflow)

---

**⭐ If you found this project helpful, please give it a star!**
