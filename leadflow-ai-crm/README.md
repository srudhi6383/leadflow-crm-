# ⚡ LeadFlow AI CRM - Enterprise SaaS Sales Intelligence Platform

> A production-ready, commercial-grade enterprise CRM application built with Node.js, Express, MongoDB Atlas, React 19, Vite, Tailwind CSS, Recharts, and JWT Authentication.

---

## 🌟 Project Overview

**LeadFlow AI CRM** is designed for modern B2B SaaS sales teams, account executives, and executive leaders to track sales pipelines, forecast quarterly revenue velocity, manage client contacts, and convert high-value target enterprise accounts.

Inspired by industry leaders like **HubSpot**, **Salesforce**, **Linear**, **Vercel**, and **Stripe Dashboard**, LeadFlow AI features a sleek, high-contrast UI with glassmorphism, dynamic theme switches (Dark/Light mode), interactive data visualizations, and audit streams.

---

## 📸 Interface Preview & Design Aesthetics

- **Primary Color**: `#4F46E5` (Indigo 600)
- **Success Color**: `#10B981` (Emerald 500)
- **Danger Color**: `#EF4444` (Red 500)
- **Warning Color**: `#F59E0B` (Amber 500)
- **Border Radius**: `16px` (`rounded-2xl`)
- **Typography**: Inter Font
- **Icons**: Lucide React


---

## ✨ Key Features

### 🔐 1. Authentication & Security
- **JWT Token Authentication** via HTTP Bearer headers & secure cookies.
- **Password Hashing** with Bcryptjs.
- **Role-Based Access Control (RBAC)**: Admin, Sales, User.
- **Persistent Sessions & Remember Me** support.
- **One-Click Demo Credentials**: Test Admin (`admin@leadflow.ai`) and Sales AE (`sarah.chen@leadflow.ai`).

### 📊 2. Executive Dashboard
- **Telemetry Stat Cards**: Total Leads, Revenue Velocity, Target Accounts, Conversion Rate.
- **Recharts Data Visualizations**:
  - Quarterly Revenue vs. Target Quotas (Area Chart)
  - Monthly New Leads vs. Won Deals (Bar Chart)
  - Lead Acquisition Sources Distribution (Pie Chart)
- **Real-Time Audit Activity Log**: Automated logs for lead creation, status updates, and note additions.
- **Upcoming Tasks & Reminders**.

### 💼 3. Leads & Deal Pipeline Module
- **Full CRUD Operations**: Create, view, update status/priority, and delete opportunities.
- **Interactive Notes Thread**: Post activity notes per opportunity.
- **Debounced Real-Time Search & Multi-Filters**: Filter by Status, Priority, or Acquisition Source.
- **Client-side & Server-side CSV Export**.
- **Pagination & Sorting**.

### 🏢 4. Target Enterprise Accounts (Companies)
- **Full CRUD Operations**: Company Name, Industry Sector, Employee Count, Annual Revenue, Website, Contact Info, Address.
- **Industry Sector Filters**.
- **CSV Data Export**.

### 👤 5. Client Contacts Directory
- **Full CRUD Operations**: Executive name, email, phone, job designation, company association link.
- **Company Association Filters**.
- **CSV Data Export**.

### 📈 6. Advanced Analytics & Team Performance
- **KPI Metrics**: Average Deal Size, Win Rate, Sales Cycle Length, MRR YoY Growth.
- **Sales Conversion Funnel**: Stage-by-stage progression telemetry.
- **Sales Executive Quota Leaderboard**.

### ⚙️ 7. Customization & Settings
- **Theme Switcher**: Instant transition between Light SaaS Mode and Dark Midnight Mode.
- **User Profile Management**: Update job title, phone number, and password credentials.
- **Notification Preferences**.

---

## 📁 Project Structure

```
leadflow-ai-crm/
├── client/                      # React 19 + Vite Frontend
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/          # Button, Input, Select, Table, Modal, Card, Skeleton, Pagination, Badge
│       │   ├── dashboard/
│       │   ├── leads/
│       │   ├── companies/
│       │   ├── contacts/
│       │   ├── analytics/
│       │   ├── settings/
│       │   └── layout/          # Sidebar, Navbar, Breadcrumb, DashboardLayout
│       ├── contexts/            # ThemeContext, AuthContext, ToastContext
│       ├── hooks/               # useAuth, useDebounce, usePagination, useApi, useLocalStorage
│       ├── pages/               # Login, Register, Dashboard, Leads, Companies, Contacts, Analytics, Settings, Profile, 404, 403
│       ├── routes/              # AppRoutes, ProtectedRoutes
│       ├── services/            # Axios API wrappers (auth, lead, company, contact, dashboard, analytics)
│       ├── styles/              # index.css (Tailwind CSS custom tokens)
│       ├── utils/               # formatters, exportCsv, validators
│       ├── App.jsx
│       └── main.jsx
│
├── server/                      # Node.js + Express Backend
│   └── src/
│       ├── config/              # db.js (MongoDB connection with fallback store)
│       ├── controllers/         # auth, dashboard, lead, company, contact, analytics controllers
│       ├── middleware/          # authMiddleware, roleMiddleware, errorMiddleware, validateMiddleware
│       ├── models/              # User, Company, Contact, Lead, Activity Mongoose schemas
│       ├── routes/              # Express endpoint routers
│       ├── seed/                # seedDatabase.js
│       ├── services/            # inMemoryStore.js (Fallback dataset)
│       ├── utils/               # generateToken, apiResponse, csvExporter
│       ├── validators/          # Input schema validators
│       ├── app.js
│       └── server.js
│
└── README.md
```

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19 + Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS (Custom Indigo/Emerald Design System)
- **Icons**: Lucide React
- **Charts**: Recharts
- **HTTP Client**: Axios
- **Forms**: React Hook Form

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB Atlas / Mongoose ORM (with automatic fallback storage)
- **Authentication**: JWT (JSON Web Tokens) & Bcryptjs
- **Security**: CORS, Cookie-Parser, Dotenv

---

## 🚀 Environment Variables Setup

### Server (`server/.env`)
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/leadflow_crm
JWT_SECRET=leadflow_super_secret_jwt_key_2026_production_safe
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### Client (`client/.env`)
```env
VITE_API_URL=http://localhost:5000/api
```

---

## 💻 Installation & Quick Start Commands

### 1. Backend Server Setup
```bash
cd server
npm install
npm run seed     # Populate database with demo users & pipeline leads
npm run dev      # Start Node.js API server on http://localhost:5000
```

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev      # Start Vite client on http://localhost:5173
```

---

## 🔑 Demo Login Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@leadflow.ai` | `password123` |
| **Sales AE** | `sarah.chen@leadflow.ai` | `password123` |

