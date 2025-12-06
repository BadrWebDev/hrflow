# Middleware Test Summary

## What We Built:

### 1. IsAdmin Middleware (`app/Http/Middleware/IsAdmin.php`)
```php
// This code runs BEFORE the controller
if (!$request->user() || $request->user()->role !== 'admin') {
    return response()->json(['error' => 'Unauthorized'], 403);
}
// If check passes, request continues to controller
```

### 2. Registered in `bootstrap/app.php`
```php
$middleware->alias([
    'admin' => \App\Http\Middleware\IsAdmin::class,
]);
```
Now we can use `->middleware('admin')` in routes!

### 3. Applied to Routes (`routes/api.php`)

**Route Protection Layers:**
```
Request → auth:sanctum (check logged in) → admin (check role) → Controller
```

**Public Routes (No Protection):**
- POST /api/register
- POST /api/login

**Authenticated Routes (auth:sanctum only):**
- GET /api/departments (anyone can view)
- GET /api/leave-types (anyone can view)
- GET /api/users/{id} (view own profile)
- POST /api/leaves (create leave request)

**Admin-Only Routes (auth:sanctum + admin middleware):**
- POST /api/departments (create)
- PUT /api/departments/{id} (update)
- DELETE /api/departments/{id} (delete)
- POST /api/users (create employee)
- GET /api/users (list all)
- PUT /api/leaves/{id} (approve/reject)
- All leave-type management (create/update/delete)

## How It Works:

### Example Request Flow:

**Employee tries to create department:**
```
1. Request: POST /api/departments
2. Pass auth:sanctum? ✅ (logged in)
3. Pass admin middleware? ❌ (role = 'employee')
4. REJECTED with 403: "Unauthorized. Admin access required."
5. Controller never reached!
```

**Admin tries to create department:**
```
1. Request: POST /api/departments
2. Pass auth:sanctum? ✅ (logged in)
3. Pass admin middleware? ✅ (role = 'admin')
4. Controller executes: DepartmentController@store
5. Department created!
```

## Benefits:

### Before Middleware:
```php
// Had to write this in EVERY method
public function store(Request $request) {
    if (Auth::user()->role !== 'admin') {
        return response()->json(['error' => 'Unauthorized'], 403);
    }
    // actual logic...
}
```

### After Middleware:
```php
// Clean controller - middleware handles security
public function store(Request $request) {
    // actual logic only!
}
```

**Code reduced by ~40 lines across controllers!**

## Test Commands:

```bash
# Test as employee (should fail for admin routes)
curl -H "Authorization: Bearer {employee_token}" POST http://localhost:8000/api/departments

# Test as admin (should succeed)
curl -H "Authorization: Bearer {admin_token}" POST http://localhost:8000/api/departments
```
