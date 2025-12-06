# HRFlow - Complete Implementation Guide

## 🎉 What We Built

A full-stack HR & Leave Management System with:
- **Backend**: Laravel 11 REST API with authentication
- **Frontend**: React 19 with modern UI
- **Features**: Employee leave requests, admin approval system, department management

---

## 🏗️ Project Structure

```
HRFlow/
├── Backend/          # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/    # API controllers
│   │   │   └── Middleware/     # IsAdmin middleware
│   │   └── Models/             # Database models
│   ├── database/
│   │   ├── migrations/         # Database schema
│   │   └── seeders/            # Test data
│   └── routes/
│       └── api.php             # API routes
│
└── Frontend/         # React App
    └── src/
        ├── components/         # Reusable components
        ├── context/            # Auth context
        ├── pages/              # Page components
        └── services/           # API services
```

---

## 🚀 Running the Application

### Backend (Port 8000):
```bash
cd Backend
php artisan serve
```

### Frontend (Port 5174):
```bash
cd Frontend
npm run dev
```

### Access:
- Frontend: http://localhost:5174
- Backend API: http://localhost:8000/api

---

## 🔐 Demo Credentials

### Admin Account:
- Email: `admin@hrflow.test`
- Password: `Admin1234`
- Can: Approve/reject leaves, manage users, departments

### Employee Account:
- Email: `john@hrflow.test`
- Password: `password`
- Can: Request leaves, view own requests

---

## 📚 Step-by-Step Explanation (For Beginners)

### BACKEND (Laravel)

#### 1. **Database Models** (Like Excel Tables)
- **User**: Stores employee info (name, email, password, role, department)
- **Department**: Company departments (HR, IT, Finance)
- **LeaveType**: Types of leave (Annual, Sick, Unpaid)
- **Leave**: Leave requests with status (pending/approved/rejected)

#### 2. **Controllers** (Handle Requests)
Think of controllers as waiters in a restaurant:
- Customer (frontend) makes a request
- Waiter (controller) processes it
- Kitchen (database) provides data
- Waiter returns response

**We created:**
- `ApiAuthController`: Login, register, logout
- `LeaveController`: Create, view, approve leaves
- `DepartmentController`: Manage departments
- `UserController`: Manage employees
- `LeaveTypeController`: Manage leave types

#### 3. **Middleware** (Security Guards)
Middleware checks permissions BEFORE reaching controllers:

```php
// Without middleware (BAD - repetitive):
public function store() {
    if ($user->role !== 'admin') {
        return error; // Repeat in every method!
    }
    // actual code...
}

// With middleware (GOOD - write once):
Route::middleware('admin')->post('/departments', [Controller@store]);
// Middleware checks admin role automatically
```

#### 4. **API Routes** (URL Endpoints)
Routes define what URLs do what:
- `POST /api/login` → Login user
- `GET /api/leaves` → Get leaves
- `POST /api/leaves` → Create leave (authenticated users)
- `PUT /api/leaves/{id}` → Approve leave (admin only)

**Route Protection Layers:**
```
Request → auth:sanctum (logged in?) → admin (is admin?) → Controller
```

---

### FRONTEND (React)

#### 1. **Services** (Talk to Backend)
Services are like phone operators connecting frontend to backend:

**api.js**: Base configuration
- Sets backend URL (http://localhost:8000/api)
- Adds authentication token to every request
- Handles errors (like 401 Unauthorized)

**authService.js**: Authentication
- `login()`: Send email/password, get token
- `register()`: Create new account
- `logout()`: Clear token, redirect to login

**leaveService.js**: Leave operations
- `getLeaves()`: Fetch all leaves
- `createLeave()`: Submit new request
- `updateLeave()`: Approve/reject (admin)

#### 2. **Context** (Global State)
Like a shared clipboard everyone can access:

**AuthContext**: 
- Stores current user info
- Provides `isAuthenticated`, `isAdmin` checks
- Available to all components without passing props

#### 3. **Components** (Building Blocks)

**PrivateRoute**: Security guard for pages
```jsx
// Blocks unauthenticated users
<PrivateRoute>
  <Dashboard />  {/* Only logged-in users see this */}
</PrivateRoute>
```

**Navbar**: Top bar with logo and logout

#### 4. **Pages** (Full Screens)

**Login/Register**: Authentication forms
- Collect email/password
- Call authService.login()
- Store token in localStorage
- Redirect to dashboard

**EmployeeDashboard**:
- View personal leave requests
- Submit new leave request
- Cancel pending requests
- See statistics (total, pending, approved)

**AdminDashboard**:
- View ALL leave requests
- Approve/reject requests
- Manage employees (view, delete)
- View departments and leave types
- Tabbed interface for different sections

---

## 🔄 How Data Flows

### Example: Employee Requests Leave

1. **Frontend** (EmployeeDashboard.jsx):
   ```jsx
   User fills form → clicks "Submit"
   → handleSubmit() called
   → leaveService.createLeave(data)
   ```

2. **Service** (leaveService.js):
   ```js
   → api.post('/leaves', data)
   → Adds token to headers
   → Sends HTTP request to backend
   ```

3. **Backend** (Laravel):
   ```
   → Route: POST /api/leaves
   → Middleware: auth:sanctum (checks token)
   → Controller: LeaveController@store
   → Validates data
   → Saves to database
   → Returns JSON response
   ```

4. **Response Flows Back**:
   ```
   Backend → Frontend → Service → Component
   → Updates UI (shows success message)
   → Refreshes leave list
   ```

---

## 🎨 Key Technologies Explained

### Laravel (Backend)
- **PHP Framework**: Like React but for backend
- **Eloquent ORM**: Talk to database using code (not SQL)
  ```php
  User::where('role', 'admin')->get(); // Gets all admins
  ```
- **Sanctum**: Token-based authentication
- **Migrations**: Version control for database

### React (Frontend)
- **Components**: Reusable UI pieces (like LEGO blocks)
- **Hooks**: 
  - `useState`: Store component data
  - `useEffect`: Run code when component loads
  - `useContext`: Access global state
- **React Router**: Handle navigation (like GPS for pages)

### Axios
- HTTP client (makes API calls easier)
- Handles requests/responses
- Better than fetch API

---

## 🔧 What Each File Does

### Backend Key Files:

| File | Purpose |
|------|---------|
| `routes/api.php` | Defines all API endpoints |
| `app/Models/*.php` | Database table definitions |
| `app/Http/Controllers/*.php` | Business logic handlers |
| `app/Http/Middleware/IsAdmin.php` | Admin permission checker |
| `database/migrations/*.php` | Database structure |
| `database/seeders/DatabaseSeeder.php` | Test data |

### Frontend Key Files:

| File | Purpose |
|------|---------|
| `src/App.jsx` | Main app with routing |
| `src/services/api.js` | API configuration |
| `src/context/AuthContext.jsx` | Global user state |
| `src/pages/Login.jsx` | Login page |
| `src/pages/EmployeeDashboard.jsx` | Employee view |
| `src/pages/AdminDashboard.jsx` | Admin view |

---

## 🎓 What You Learned

### Backend Concepts:
1. ✅ **REST API** design
2. ✅ **Authentication** with tokens
3. ✅ **Authorization** with middleware
4. ✅ **CRUD operations** (Create, Read, Update, Delete)
5. ✅ **Database relationships** (User has Leaves)
6. ✅ **MVC pattern** (Model-View-Controller)

### Frontend Concepts:
1. ✅ **React components** and props
2. ✅ **State management** with Context
3. ✅ **API integration** with Axios
4. ✅ **Routing** with React Router
5. ✅ **Form handling** and validation
6. ✅ **Conditional rendering** (show/hide based on data)
7. ✅ **Protected routes** (auth required)

---

## 🚧 Next Steps to Improve

1. **Add Leave Balance System**
   - Track remaining days per employee
   - Prevent over-requesting

2. **Email Notifications**
   - Notify when leave approved/rejected

3. **File Uploads**
   - Attach medical certificates

4. **Calendar View**
   - Visual leave calendar

5. **Reports & Analytics**
   - Dashboard with charts
   - Export to PDF/Excel

6. **Mobile Responsive**
   - Better mobile UI

---

## 📝 Common Beginner Questions

### Q: What is an API?
**A:** Like a menu at a restaurant. Frontend (customer) orders from the menu (API), backend (kitchen) prepares and serves the data.

### Q: What is a token?
**A:** Like a VIP wristband at a concert. Once you login (pay entry), you get a wristband (token). Show it to access restricted areas (protected routes).

### Q: What is middleware?
**A:** Security checkpoints. Like airport security checking your passport before you board.

### Q: Why separate frontend and backend?
**A:** Like separating kitchen and dining room. Clean separation, can scale independently, team can work in parallel.

### Q: What is state?
**A:** Component memory. Like a notepad where React writes down current values (form inputs, user data, etc).

---

## 🐛 Troubleshooting

### Backend not starting?
```bash
php artisan config:clear
php artisan cache:clear
php artisan serve
```

### Frontend not loading?
```bash
rm -rf node_modules
npm install
npm run dev
```

### CORS errors?
Check `config/cors.php` - should allow localhost:5174

### 401 Unauthorized?
- Token expired → Login again
- Token not sent → Check api.js interceptor

---

## 📞 Support

If stuck:
1. Check browser console (F12) for errors
2. Check Laravel logs: `storage/logs/laravel.log`
3. Use `dd($variable)` in Laravel to debug
4. Use `console.log(variable)` in React to debug

---

**Congratulations! You built a complete full-stack application! 🎉**
