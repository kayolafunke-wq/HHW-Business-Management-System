# HHW Business Management System

A comprehensive full-stack business management solution for inventory, sales, HR, and financial operations.

## 🚀 Tech Stack

### Frontend
- **React 18** with **TypeScript**
- **Vite** - Fast build tool
- **TailwindCSS** - Utility-first styling
- **Shadcn/ui** - Component library
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Query** - Server state & caching
- **Recharts** - Data visualization
- **Firebase SDK** - Authentication

### Backend
- **Node.js** with **Express.js**
- **TypeScript** - Type safety
- **Prisma ORM** - Database toolkit
- **PostgreSQL** - Production database
- **Firebase Admin SDK** - Auth verification
- **JWT** - Session tokens
- **Express Validator** - Input validation

### Infrastructure
- **Railway** - Hosting (Frontend + Backend)
- **PostgreSQL** - Database (Railway)
- **Firebase** - Authentication service

## 📁 Project Structure

```
hhw-business-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   ├── layouts/       # Layout wrappers
│   │   ├── lib/           # Utilities & helpers
│   │   ├── hooks/         # Custom React hooks
│   │   ├── store/         # Zustand stores
│   │   ├── services/      # API services
│   │   ├── types/         # TypeScript types
│   │   └── assets/        # Static assets
│   ├── public/
│   └── package.json
│
├── server/                # Node.js backend
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── routes/        # API routes
│   │   ├── middleware/    # Custom middleware
│   │   ├── services/      # Business logic
│   │   ├── utils/         # Utility functions
│   │   ├── types/         # TypeScript types
│   │   └── config/        # Configuration
│   ├── prisma/
│   │   └── schema.prisma  # Database schema
│   └── package.json
│
└── README.md
```

## 🎯 Features

### 1. Multi-Role Authentication
- Administrator
- Sales User
- Inventory User
- HR User

### 2. Dashboard
- Real-time KPIs
- Sales analytics
- Inventory alerts
- Performance charts

### 3. Sales Management
- Point of Sale (POS)
- Invoice generation with VAT
- Payment tracking
- Quotations
- Delivery notes

### 4. Inventory Management
- Product catalog
- Stock tracking
- Stock In/Out
- Low stock alerts
- Fast/Slow movers analytics

### 5. Human Resources
- Employee management
- Attendance tracking
- Leave management
- Payroll tracking

### 6. Financial Management
- Invoicing with VAT (17.5%)
- Debtors/Creditors
- Payment methods (Cash, Bank, Mobile Money)
- Financial reports

### 7. Reports & Analytics
- Sales reports
- Inventory reports
- HR reports
- Custom date ranges
- Export functionality

### 8. Audit & Security
- Audit log (all user actions)
- Role-based access control
- Session management

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 18+ and npm/yarn
- PostgreSQL database (Railway)
- Firebase project

### Environment Variables

#### Client `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

#### Server `.env`
```env
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your_jwt_secret_key
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your_project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
PORT=5000
NODE_ENV=development
```

### Installation

1. **Clone and navigate**
```bash
cd "BUSSINESS MANAGEMENT SYSTEM"
```

2. **Install frontend dependencies**
```bash
cd client
npm install
```

3. **Install backend dependencies**
```bash
cd ../server
npm install
```

4. **Setup database**
```bash
npx prisma generate
npx prisma migrate dev
npx prisma db seed
```

5. **Run development servers**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:5000

## 🚢 Deployment to Railway

### Backend Deployment
1. Create new Railway project
2. Add PostgreSQL service
3. Connect GitHub repo (server folder)
4. Add environment variables
5. Deploy

### Frontend Deployment
1. Build production bundle: `npm run build`
2. Deploy to Railway static hosting or Vercel

### Railway Configuration
See `railway.json` in each directory for configuration.

## 📝 Default Demo Accounts

- **Administrator**: admin / password
- **Sales User**: grace.sales / password
- **Inventory User**: steven.inv / password
- **HR User**: faith.hr / password

## 🔒 Security Features

- Firebase authentication
- JWT token-based sessions
- Role-based access control (RBAC)
- SQL injection prevention (Prisma)
- XSS protection
- CORS configuration
- Input validation
- Password hashing (Firebase)

## 📊 API Documentation

API runs on `http://localhost:5000/api`

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-token` - Verify Firebase token
- `POST /api/auth/logout` - Logout user

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Sales
- `GET /api/sales` - Get all sales
- `POST /api/sales` - Create sale
- `GET /api/sales/:id` - Get sale details

### Inventory
- `GET /api/inventory/movements` - Get stock movements
- `POST /api/inventory/stock-in` - Record stock in
- `POST /api/inventory/stock-out` - Record stock out

### Employees
- `GET /api/employees` - Get all employees
- `POST /api/employees` - Create employee
- `PUT /api/employees/:id` - Update employee

### Reports
- `GET /api/reports/sales` - Sales reports
- `GET /api/reports/inventory` - Inventory reports
- `GET /api/reports/hr` - HR reports

## 🤝 Contributing

This is a solo project for HHW Business Management.

## 📄 License

Proprietary - HHW Business Management System

## 👨‍💻 Developer

Built by SWANTIN

---

**Version**: 1.0.0  
**Last Updated**: 2026
