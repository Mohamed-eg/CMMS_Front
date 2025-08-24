# Gas Station CMMS (Computerized Maintenance Management System)

A comprehensive maintenance management system designed specifically for gas stations, built with Next.js, React, and Redux Toolkit.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mohammeds-projects-51744e9a/v0-next-js-frontend-build)
[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Redux Toolkit](https://img.shields.io/badge/Redux%20Toolkit-764ABC?style=for-the-badge&logo=redux)](https://redux-toolkit.js.org/)

## 🚀 Overview

The Gas Station CMMS is a modern web application that streamlines maintenance operations for gas station facilities. It provides role-based access control, real-time work order management, asset tracking, and comprehensive reporting capabilities.

### Key Features

- **🔐 Role-Based Access Control**: Different interfaces for Admin/Manager and Technician users
- **📋 Work Order Management**: Create, assign, track, and complete maintenance tasks
- **🏢 Asset Management**: Comprehensive asset tracking with specifications and maintenance history
- **👥 User Management**: Team management with role assignments and permissions
- **📊 Analytics & Reporting**: Performance metrics and maintenance insights
- **📍 GPS Integration**: Automatic location capture for work orders
- **🔔 Real-time Notifications**: Stay updated with work order status changes
- **📱 Responsive Design**: Works seamlessly on desktop and mobile devices

## 🏗️ Architecture

### Frontend Stack
- **Framework**: Next.js 14 (App Router)
- **UI Library**: React with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Authentication**: JWT-based with localStorage
- **HTTP Client**: Axios with interceptors

### Backend Integration
- **API Base URL**: `https://cmms-back.vercel.app/api`
- **Authentication**: JWT tokens
- **Data Format**: JSON
- **Error Handling**: Comprehensive error handling with user feedback

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Quick Start

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CMMS_Front
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Add your environment variables:
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://cmms-back.vercel.app/api
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication & User Roles

### User Types

#### Admin/Manager Users
- **Full Access**: Complete system access
- **Features**: Dashboard, Analytics, Work Orders, Assets, Users, Reports, Settings
- **Navigation**: Full sidebar with all sections

#### Technician Users
- **Limited Access**: Work order-focused interface
- **Features**: View assigned work orders, submit new work orders, view notifications
- **Navigation**: Minimal sidebar with work order section only

### Login Flow
1. Navigate to `/login`
2. Enter credentials
3. System checks user role
4. Automatic redirect based on role:
   - Technicians → `/dashboard/technician`
   - Admin/Manager → `/dashboard`

## 🛣️ API Routes & Endpoints

### Authentication
```
POST /api/auth/login
POST /api/auth/logout
POST /api/auth/refresh
```

### Work Orders
```
GET    /api/workorders/           # List all work orders
POST   /api/workorders/           # Create new work order
GET    /api/workorders/{id}       # Get specific work order
PUT    /api/workorders/{id}       # Update work order
DELETE /api/workorders/{id}       # Delete work order
```

### Assets
```
GET    /api/assets/               # List all assets
POST   /api/assets/               # Create new asset
GET    /api/assets/{id}           # Get specific asset
PUT    /api/assets/{id}           # Update asset
DELETE /api/assets/{id}           # Delete asset
```

### Users
```
GET    /api/users/                # List all users
POST   /api/users/                # Create new user
GET    /api/users/{id}            # Get specific user
PUT    /api/users/{id}            # Update user
DELETE /api/users/{id}            # Delete user
```

### Stations
```
GET    /api/stations/             # List all stations
POST   /api/stations/             # Create new station
GET    /api/stations/{id}         # Get specific station
PUT    /api/stations/{id}         # Update station
DELETE /api/stations/{id}         # Delete station
```

## 📁 Project Structure

```
CMMS_Front/
├── app/                          # Next.js App Router
│   ├── dashboard/                # Dashboard pages
│   │   ├── layout.js            # Role-based layout
│   │   ├── page.js              # Admin dashboard
│   │   ├── technician/          # Technician portal
│   │   │   ├── page.js          # Main technician dashboard
│   │   │   ├── submit/          # Work order submission
│   │   │   └── notifications/   # Notifications page
│   │   ├── users/               # User management
│   │   ├── assets/              # Asset management
│   │   ├── work-orders/         # Work order management
│   │   └── ...                  # Other admin pages
│   ├── login/                   # Authentication
│   └── globals.css              # Global styles
├── components/                   # Reusable components
│   ├── ui/                      # Shadcn/ui components
│   ├── app-sidebar.js           # Navigation sidebar
│   ├── work-order-form.js       # Work order form
│   ├── add-asset-form.js        # Asset creation form
│   └── user-edit-form.js        # User editing form
├── lib/                         # Utilities and configurations
│   ├── api/                     # API functions
│   ├── features/                # Redux slices
│   ├── config/                  # Configuration files
│   └── store.js                 # Redux store
├── hooks/                       # Custom React hooks
├── public/                      # Static assets
└── styles/                      # Additional styles
```

## 🎯 Key Features Explained

### Role-Based Access Control
- **Automatic Redirects**: Users are redirected based on their role after login
- **Layout Switching**: Different layouts for technicians vs admin/manager
- **Navigation Filtering**: Sidebar adapts based on user permissions
- **Page Protection**: Admin pages redirect technicians to their portal

### Work Order Management
- **Creation**: Comprehensive work order forms with GPS integration
- **Assignment**: Assign work orders to specific technicians
- **Tracking**: Real-time status updates and progress tracking
- **Completion**: Mark work orders as completed with notes

### Asset Management
- **Comprehensive Forms**: Detailed asset creation with specifications
- **Maintenance History**: Track maintenance records and schedules
- **Photo Management**: Add multiple photos via URLs
- **GPS Coordinates**: Automatic location capture

### GPS Integration
- **Automatic Location**: Get current GPS coordinates with one click
- **High Accuracy**: Uses high accuracy mode for precise location
- **Error Handling**: Comprehensive error handling for location services
- **Fallback**: Manual coordinate entry if GPS unavailable

## 🧪 Testing

### Test Users

Use these mock users to test different roles:

#### Admin User
- **Email**: `ahmed.rashid@gasstation.sa`
- **Role**: `Admin`
- **Access**: Full system access

#### Manager User
- **Email**: `abdullah.rashid@gasstation.sa`
- **Role**: `Manager`
- **Access**: Full system access

#### Technician User
- **Email**: `mohammed.fahad@gasstation.sa`
- **Role**: `Technician`
- **Access**: Limited to work order features

### Testing Scenarios

1. **Login as Technician**
   - Should redirect to `/dashboard/technician`
   - Should see limited navigation
   - Should not access admin pages

2. **Login as Admin/Manager**
   - Should redirect to `/dashboard`
   - Should see full navigation
   - Should access all features

3. **Direct URL Access**
   - Technicians accessing admin pages → automatic redirect
   - Role-based navigation filtering
   - Layout switching based on role

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
```env
NEXT_PUBLIC_API_BASE_URL=https://cmms-back.vercel.app/api
```

## 🔧 Development

### Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### Code Style
- **ESLint**: Configured for Next.js and React
- **Prettier**: Code formatting
- **TypeScript**: Type checking enabled

### State Management
- **Redux Toolkit**: For global state management
- **Async Thunks**: For API calls and side effects
- **Slices**: Organized by feature (users, assets, workOrders)

## 📊 Performance

### Optimizations
- **Code Splitting**: Automatic with Next.js
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: Built-in bundle analyzer
- **Caching**: Redux state persistence

### Monitoring
- **Error Boundaries**: React error boundaries
- **Loading States**: Comprehensive loading indicators
- **Error Handling**: Toast notifications for user feedback

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the [ROLE_BASED_ACCESS.md](ROLE_BASED_ACCESS.md) for detailed documentation
- Review the troubleshooting section in the documentation

## 🔄 Version History

- **v1.0.0**: Initial release with role-based access control
- **v1.1.0**: Added GPS integration and enhanced work order management
- **v1.2.0**: Comprehensive asset management and user management features

---

**Built with ❤️ for efficient gas station maintenance management**
