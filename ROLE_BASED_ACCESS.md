# Role-Based Access Control (RBAC) System

## Overview

The CMMS application implements a comprehensive role-based access control system that provides different user experiences based on user roles.

## User Roles

### 1. Admin/Manager Users
- **Full Access**: Complete access to all features and pages
- **Navigation**: Full sidebar with all sections (Dashboard, Analytics, Operations, Management)
- **Features**:
  - Dashboard overview and analytics
  - Work order management (create, edit, delete, assign)
  - Asset management (add, edit, delete, view)
  - User management (add, edit, delete, view)
  - Station management
  - Reports and analytics
  - System settings

### 2. Technician Users
- **Limited Access**: Restricted to work order-related features only
- **Navigation**: Minimal sidebar with only "Work Orders" section
- **Features**:
  - View assigned work orders
  - Submit new work orders
  - View notifications
  - Update work order status
  - Access to dedicated technician portal

## Implementation Details

### Authentication Flow

1. **Login Process**:
   ```javascript
   // After successful login, check user role
   const userRole = response.user?.role?.toLowerCase()
   
   // Redirect based on role
   if (userRole === "technician") {
     router.push("/dashboard/technician")
   } else {
     router.push("/dashboard")
   }
   ```

2. **Layout Protection**:
   ```javascript
   // In dashboard layout
   const userRole = user.role?.toLowerCase()
   const isTechnician = userRole === "technician"
   
   if (isTechnician) {
     // Render technician layout
     return <TechnicianLayout>{children}</TechnicianLayout>
   } else {
     // Render full admin layout
     return <AdminLayout>{children}</AdminLayout>
   }
   ```

### Page Protection

Each admin page includes role checking:

```javascript
useEffect(() => {
  const userData = localStorage.getItem("user")
  if (userData) {
    const user = JSON.parse(userData)
    const userRole = user.role?.toLowerCase()
    if (userRole === "technician") {
      router.push("/dashboard/technician")
      return
    }
  }
}, [router])
```

### Navigation Filtering

The sidebar automatically filters navigation items based on user role:

```javascript
const getFilteredNavigationItems = () => {
  if (isTechnician) {
    return [
      {
        title: "Operations",
        items: [
          {
            title: "Work Orders",
            url: "/dashboard/technician",
            icon: Wrench,
            description: "View and manage your assigned work orders",
          },
        ],
      },
    ]
  }
  return navigationItems // Full navigation for admin/manager
}
```

## Technician Portal Features

### 1. Main Dashboard (`/dashboard/technician`)
- **Quick Stats**: Total assigned, in progress, completed, pending work orders
- **Work Orders Tab**: List of assigned work orders with status and actions
- **Notifications Tab**: System notifications and updates
- **Submit Work Order**: Quick access to create new work orders

### 2. Submit Work Order (`/dashboard/technician/submit`)
- **Dedicated Page**: Clean, focused interface for work order submission
- **GPS Integration**: Automatic location capture
- **Form Validation**: Client-side validation for required fields
- **Success Feedback**: Toast notifications and automatic redirect

### 3. Notifications (`/dashboard/technician/notifications`)
- **Comprehensive View**: All notifications with read/unread status
- **Filtering**: By notification type and priority
- **Actions**: Mark as read, mark all as read
- **Types**: Work order assigned, updated, completed, maintenance due, system alerts

## Security Features

### 1. Route Protection
- **Automatic Redirects**: Technicians are automatically redirected from admin pages
- **Layout Isolation**: Different layouts prevent access to admin features
- **Navigation Hiding**: Sidebar items are filtered based on role

### 2. Data Isolation
- **Work Order Filtering**: Technicians only see their assigned work orders
- **Asset Restrictions**: No access to asset management for technicians
- **User Management**: Technicians cannot access user management

### 3. Session Management
- **Token Storage**: Authentication tokens stored in localStorage
- **Role Persistence**: User role maintained across sessions
- **Logout Cleanup**: Proper cleanup of authentication data

## Testing the System

### Test Users

Use these mock users to test different roles:

1. **Admin User**:
   - Email: `ahmed.rashid@gasstation.sa`
   - Role: `Admin`
   - Access: Full system access

2. **Manager User**:
   - Email: `abdullah.rashid@gasstation.sa`
   - Role: `Manager`
   - Access: Full system access

3. **Technician User**:
   - Email: `mohammed.fahad@gasstation.sa`
   - Role: `Technician`
   - Access: Limited to work order features

### Testing Scenarios

1. **Login as Technician**:
   - Should redirect to `/dashboard/technician`
   - Should see limited navigation
   - Should not access admin pages

2. **Login as Admin/Manager**:
   - Should redirect to `/dashboard`
   - Should see full navigation
   - Should access all features

3. **Direct URL Access**:
   - Technicians trying to access `/dashboard/users` → redirected to technician portal
   - Technicians trying to access `/dashboard/assets` → redirected to technician portal
   - Technicians trying to access `/dashboard/work-orders` → redirected to technician portal

## File Structure

```
app/dashboard/
├── layout.js                    # Role-based layout switching
├── page.js                      # Admin dashboard
├── technician/
│   ├── page.js                  # Technician main dashboard
│   ├── submit/
│   │   └── page.js             # Work order submission page
│   └── notifications/
│       └── page.js             # Notifications page
├── users/
│   └── page.js                 # User management (admin only)
├── assets/
│   └── page.js                 # Asset management (admin only)
└── work-orders/
    └── page.js                 # Work order management (admin only)

components/
├── app-sidebar.js              # Role-based navigation filtering
└── work-order-form.js          # Shared work order form

lib/
├── api/
│   └── auth.js                 # Authentication with role support
└── config/
    └── api.js                  # API configuration
```

## Future Enhancements

1. **Real-time Notifications**: WebSocket integration for live updates
2. **Advanced Permissions**: Granular permission system within roles
3. **Audit Logging**: Track user actions and access attempts
4. **Multi-factor Authentication**: Enhanced security for admin users
5. **Role Hierarchy**: Support for role inheritance and delegation

## Troubleshooting

### Common Issues

1. **Technician accessing admin pages**:
   - Check localStorage for user role
   - Verify redirect logic in layout.js
   - Ensure page protection is implemented

2. **Navigation not filtering**:
   - Check userData structure in app-sidebar.js
   - Verify role field names (role vs Role)
   - Test with different user roles

3. **Login redirect issues**:
   - Check login response structure
   - Verify role field in user object
   - Test with mock users

### Debug Commands

```javascript
// Check current user role
console.log(localStorage.getItem("user"))

// Check if user is technician
const user = JSON.parse(localStorage.getItem("user"))
console.log(user.role || user.Role)

// Force technician role for testing
localStorage.setItem("user", JSON.stringify({
  ...user,
  role: "technician"
}))
``` 