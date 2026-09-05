# 🚗 GoCar – AI-Powered Car Renting Platform

A full-stack web application for online car rental with secure JWT authentication, car listings with search/filter, booking management, simulated payments, AI-powered suggestions, and a complete admin portal.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + Vite + Tailwind CSS v4 |
| Backend | FastAPI (Python 3.11+) |
| Database | MongoDB (local or Atlas) |
| Auth | JWT (access tokens) |
| Payments | Simulated (no real charges) |
| AI | Rule-based suggestions (Gemini API optional) |

## 🚀 Quick Start

### Prerequisites
1. **Node.js** (v18+) - [Download](https://nodejs.org)
2. **Python** (3.11+) - [Download](https://python.org)
3. **MongoDB** - [Download Community Server](https://www.mongodb.com/try/download/community)
   - Install MongoDB Community Edition
   - Make sure `mongod` is running on `localhost:27017`

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Seed the database with sample data
python seed_data.py

# Start the server
uvicorn main:app --reload --port 8000
```

API will be available at: http://localhost:8000
API Docs (Swagger): http://localhost:8000/docs

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

App will be available at: http://localhost:5173

## 🔑 Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@gocar.com | admin123 |
| User | user@gocar.com | user123 |

## 📋 Features

### User Features
- ✅ JWT Authentication (Signup/Login)
- ✅ Browse cars with search, filter, sort, pagination
- ✅ Car detail view with specs and features
- ✅ Book cars with date selection
- ✅ Simulated payment processing (Card/UPI/NetBanking)
- ✅ Dashboard with booking stats
- ✅ Booking history with cancel option
- ✅ Payment history with transaction IDs
- ✅ Profile management
- ✅ AI suggestions (cheapest car finder)
- ✅ AI demand predictions

### Admin Features
- ✅ Admin dashboard with revenue stats
- ✅ Add/Edit/Delete cars
- ✅ Toggle car availability
- ✅ Manage all bookings (update status)
- ✅ View all users

### Design
- ✅ Stunning glassmorphism dark UI
- ✅ Gradient accents and animations
- ✅ Fully responsive (mobile + desktop)
- ✅ Framer Motion page transitions
- ✅ Loading skeletons
- ✅ Toast notifications

## 📁 Project Structure

```
gocar/
├── backend/
│   ├── main.py              # FastAPI entry point
│   ├── config.py             # Settings
│   ├── database.py           # MongoDB connection
│   ├── seed_data.py          # DB seeder
│   ├── models/               # Pydantic schemas
│   ├── routes/               # API endpoints
│   ├── middleware/            # JWT auth
│   └── utils/                # Helpers, email, AI
├── frontend/
│   ├── src/
│   │   ├── api/              # Axios client
│   │   ├── context/          # Auth context
│   │   ├── components/       # Reusable components
│   │   └── pages/            # All pages + admin
│   └── index.html
└── README.md
```

## 🌐 API Endpoints

### Auth
- `POST /api/auth/signup` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/profile` - Get profile
- `PUT /api/auth/profile` - Update profile

### Cars
- `GET /api/cars` - List/search/filter cars
- `GET /api/cars/{id}` - Car details
- `GET /api/cars/cities/list` - Get cities

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - My bookings
- `PUT /api/bookings/{id}/cancel` - Cancel booking

### Payments
- `POST /api/payments` - Process payment
- `GET /api/payments` - My payments

### AI
- `POST /api/ai/suggest` - Get cheapest car suggestion
- `POST /api/ai/demand` - Demand predictions

### Admin
- `POST /api/admin/cars` - Add car
- `PUT /api/admin/cars/{id}` - Update car
- `DELETE /api/admin/cars/{id}` - Delete car
- `GET /api/admin/bookings` - All bookings
- `PUT /api/admin/bookings/{id}/status` - Update booking status
- `GET /api/admin/stats` - Dashboard stats
- `GET /api/admin/users` - All users
