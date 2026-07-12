# 📚 Property Management System (PMS) – GitHub README

```markdown
# 🏢 Property Management System (PMS)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)
![Prisma](https://img.shields.io/badge/Prisma-7-2D3748.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)
![License](https://img.shields.io/badge/License-MIT-yellow.svg)

A comprehensive, production-ready **Property Management System** built with **Node.js**, **Express**, **PostgreSQL**, and **React** + **TypeScript**. Designed for property managers, landlords, tenants, and administrators to streamline property operations, contract management, payments, and maintenance.

---

## 📋 Table of Contents

- [Features](#-features)
- [Demo](#-demo)
- [User Guide](#-user-guide)
  - [Who Is This For](#who-is-this-for)
  - [Quick Start](#quick-start)
  - [Core Workflows](#core-workflows)
- [Release Notes](#-release-notes)
- [Tech Stack](#-tech-stack)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🎯 Features

### 🔐 Authentication & Security
- JWT authentication with access & refresh tokens
- Role-based access control (6 roles)
- Password hashing with bcrypt
- Security headers (Helmet)
- Rate limiting
- Input validation (Joi)

### 🏠 Core Modules
| Module | Description |
|--------|-------------|
| **Dashboard** | Multi-role dashboard with analytics, charts, and activity feed |
| **Properties** | Full CRUD for Apartments, Offices, Villas, Warehouses, Lands |
| **Vehicles** | Fleet management with rental rates and status tracking |
| **Contracts** | Rental agreements with PDF generation and digital signatures |
| **Payments** | Manual + Stripe integration, invoices, refunds |
| **Maintenance** | Work orders, priority tracking, assignment |
| **Inspections** | Property inspections with condition assessment |
| **Power of Attorney** | Legal authorizations and asset management permissions |

### 📊 Analytics & Reporting
- Revenue & Profit/Loss reports
- Occupancy analytics
- Maintenance reports
- CSV export
- Audit logging

### 🔔 Real-time Features
- WebSocket (Socket.IO) notifications
- Email notifications (Nodemailer)
- In-app notification center

---

## 🖥️ Demo

### Default Admin Credentials
```
Email: admin@example.com
Password: admin123
```

### API Documentation
```
http://localhost:5000/api-docs
```

---

## 📖 User Guide

### Who Is This For?

| Role | Description | Key Capabilities |
|------|-------------|------------------|
| **SYSTEM_ADMIN** | System administrator | Full control, user management, audit logs |
| **PROPERTY_MANAGER** | Operations manager | Manage properties, contracts, maintenance |
| **TENANT** | Renter/occupant | View contracts, payments, submit maintenance |
| **LANDLORD** | Property owner | View properties, contracts, rental income |
| **ACCOUNTANT** | Financial officer | Process payments, financial reports |
| **LEGAL_ADMIN** | Legal administrator | Manage POAs, legal documents |

---

### Quick Start

#### Prerequisites
- Node.js (v18+)
- PostgreSQL (v15+)
- npm or yarn

#### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/property-management-system.git
cd property-management-system/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database and JWT credentials

# Set up database
npx prisma db push
npx prisma db seed  # Creates admin user

# Start the server
npm run dev
```

#### Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your API URL

# Start the development server
npm run dev
```

---

### Core Workflows

#### 1. Property Management
1. Navigate to **Properties** → **Add Property**
2. Fill in property details (title, type, area, address, financials)
3. Upload images (optional)
4. Click **Save**

#### 2. Creating a Contract
1. Navigate to **Contracts** → **New Contract**
2. Select asset type (Property/Vehicle/Land)
3. Select asset and parties (Tenant, Landlord)
4. Set contract terms (dates, rent)
5. Click **Save** → PDF generated automatically

#### 3. Processing a Payment
1. Navigate to **Contracts** → select active contract
2. Click **Process Payment**
3. Enter amount, method, and date
4. Click **Pay** → Invoice generated

#### 4. Reporting Maintenance
1. Navigate to **Maintenance** → **New Request**
2. Select asset and describe the issue
3. Set priority (Low → Critical)
4. Click **Submit**

#### 5. Managing Power of Attorney
1. Navigate to **Power of Attorney** → **New POA**
2. Select asset type and asset
3. Choose scope (Full/Limited/Specific)
4. Set validity dates and notary information
5. Click **Save**

---

### Role-Specific Views

#### Admin Dashboard
- Full metrics (Total Assets, Active Contracts, Pending Maintenance, Total Paid)
- Revenue chart
- Quick actions (New Property, New Contract, Report Maintenance)
- Recent activity feed

#### Tenant Dashboard
- My Contracts
- My Payments
- My Maintenance Requests
- Limited to personal data only

#### Property Manager Dashboard
- All property metrics
- Full asset management
- Maintenance and inspection tracking

#### Accountant Dashboard
- Revenue metrics
- Financial reports
- Payment processing

---

## 📦 Release Notes

### v1.0.0 – Initial Release (July 2024)

#### 🚀 New Features

**Authentication & Authorization**
- JWT authentication with access & refresh tokens
- 6 user roles with granular permissions
- Registration, login, logout
- Password hashing with bcrypt

**User Management**
- User profile management
- Admin user CRUD operations
- Role assignment

**Property Management**
- Complete CRUD operations
- 7 property types supported
- Image upload and management
- Status tracking (Available/Rented/Under Maintenance)

**Vehicle Management**
- Full CRUD operations
- VIN and license plate validation
- Daily and monthly rate tracking

**Contract Management**
- Contract creation with asset linking
- Automatic contract number generation
- PDF generation
- Status tracking (Draft/Active/Expired/Terminated)

**Payment Processing**
- Manual payment logging
- Stripe integration (online payments)
- Invoice PDF generation
- Refund processing

**Maintenance & Inspections**
- Maintenance request creation
- Priority and status tracking
- Technician assignment
- Inspection scheduling
- Condition assessment

**Power of Attorney**
- POA creation and management
- Asset linking
- Scope management (Full/Limited/Specific)
- Notary information tracking

**Dashboard & Reporting**
- Multi-role dashboard
- Revenue charts
- Occupancy analytics
- Profit & Loss reports
- CSV export

**Real-time Features**
- WebSocket (Socket.IO) notifications
- Email notifications (Nodemailer)
- In-app notification center

**Audit Logging**
- Complete audit trail
- IP and user-agent tracking
- Admin view for logs

**Security**
- Helmet security headers
- Rate limiting
- CORS configuration
- Input validation (Joi)
- SQL injection protection (Prisma)

**Technical**
- Prisma ORM with PostgreSQL
- TypeScript
- Tailwind CSS
- Swagger/OpenAPI documentation
- Winston logging

---

#### 🐛 Bug Fixes

- Fixed image upload folder detection for properties
- Fixed date conversion in contract creation
- Fixed audit logging duplication
- Fixed role-based dashboard rendering
- Fixed CORS issues in production
- Fixed payment number generation
- Fixed inspection module missing `deletedAt` field

---

#### 🧪 Testing

- ✅ Database connection tested
- ✅ All CRUD endpoints tested via Postman
- ✅ Authentication flow tested
- ✅ Payment processing tested (Stripe test mode)
- ✅ Role-based access tested
- ✅ WebSocket connection tested

---

#### ⚠️ Known Issues

- Password reset flow not implemented yet
- Email verification not implemented yet
- Two-factor authentication not implemented
- Multi-language support not implemented
- SMS notifications not implemented

---

### 🗓️ Roadmap

| Feature | Priority | Target Release |
|---------|----------|----------------|
| Mobile app (React Native) | High | Q3 2024 |
| Email verification | High | Q3 2024 |
| Password reset flow | High | Q3 2024 |
| 2FA for admin accounts | Medium | Q4 2024 |
| Multi-language (Arabic/English) | Medium | Q4 2024 |
| Advanced analytics dashboard | Medium | Q4 2024 |
| Tenant portal mobile app | Low | Q1 2025 |
| QuickBooks integration | Low | Q1 2025 |
| SMS notifications (Twilio) | Low | Q1 2025 |

---

## 🛠️ Tech Stack

### Backend
- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Auth:** JWT, bcrypt
- **Email:** Nodemailer
- **Payments:** Stripe
- **Real-time:** Socket.IO
- **Logging:** Winston
- **Validation:** Joi

### Frontend
- **Framework:** React 18
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State:** React Context, Zustand
- **API Client:** Axios
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Heroicons

### DevOps
- **Containerization:** Docker (optional)
- **CI/CD:** GitHub Actions (optional)
- **Monitoring:** Winston, PM2 (optional)

---

## 🔧 Environment Variables

### Backend `.env`
```env
# Server
PORT=5000
NODE_ENV=development

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/pms_db

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret
JWT_EXPIRES_IN=7d
JWT_REFRESH_EXPIRES_IN=30d

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password

# Stripe
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Frontend
FRONTEND_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api/v1
VITE_WS_URL=ws://localhost:5000
```

---

## 🚀 Deployment

### Backend (Render/Heroku)
```bash
# Set environment variables in dashboard
# Run Prisma migrations
npx prisma migrate deploy

# Start the server
npm start
```

### Frontend (Vercel/Netlify)
```bash
# Build the project
npm run build

# Deploy the dist folder
# Set environment variables in your hosting dashboard
```

### Docker (Optional)
```bash
# Build and run with Docker Compose
docker-compose up -d
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 🙏 Acknowledgments

- [Prisma](https://www.prisma.io/) – Database ORM
- [Stripe](https://stripe.com/) – Payment processing
- [Tailwind CSS](https://tailwindcss.com/) – Styling
- [Heroicons](https://heroicons.com/) – Icons
- [Recharts](https://recharts.org/) – Charts

---

## 📧 Contact

- **Email:** support@yourdomain.com
- **Issues:** [GitHub Issues](https://github.com/yourusername/property-management-system/issues)
- **Documentation:** [Link to your docs]

---

## ⭐ Support

If you find this project useful, please give it a star! ⭐

---

**Built with ❤️ by Your Team**

---

### 📁 Repository Structure

```
property-management-system/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   ├── prisma/
│   │   └── schema.prisma
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   ├── components/
│   │   ├── contexts/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   ├── utils/
│   │   └── App.tsx
│   ├── .env.example
│   ├── package.json
│   └── README.md
├── docker-compose.yml
├── LICENSE
├── CONTRIBUTING.md
└── README.md
```

---

## 📊 Project Status

| Component | Status |
|-----------|--------|
| Backend API | ✅ Complete |
| Frontend | ✅ Complete |
| Authentication | ✅ Complete |
| Property CRUD | ✅ Complete |
| Vehicle CRUD | ✅ Complete |
| Contract CRUD | ✅ Complete |
| Payment Processing | ✅ Complete |
| Maintenance | ✅ Complete |
| Inspections | ✅ Complete |
| Power of Attorney | ✅ Complete |
| Dashboard | ✅ Complete |
| Reporting | ✅ Complete |
| Real-time | ✅ Complete |
| Audit Logs | ✅ Complete |
| API Documentation | ✅ Complete |
| Unit Tests | ⏳ In Progress |
| Mobile App | 📋 Planned |
```

---

## ✅ Files to Create in Your Repository

| File | Content |
|------|---------|
| `README.md` | The full content above |
| `CHANGELOG.md` | Version history and release notes |
| `CONTRIBUTING.md` | Contribution guidelines |
| `LICENSE` | MIT License |
| `.env.example` | Example environment variables |
| `docker-compose.yml` | Docker setup (optional) |
