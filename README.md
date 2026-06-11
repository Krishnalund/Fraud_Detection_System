# 🛡️ FraudGuard — Real-time Fraud Detection System

A full-stack web application that detects and monitors fraudulent transactions in real-time using rule-based risk scoring, JWT authentication, and role-based access control.

---

## 🚀 Live Demo
https://transact-guard-frontend.vercel.app/

---

## ✨ Features

- 🔐 **Authentication** — Secure login & registration with JWT tokens and bcrypt password hashing
- 👥 **Role-based Access** — Admin sees all transactions; Users see only their own
- 📊 **Real-time Dashboard** — Live stats, charts, fraud alerts, and node statistics
- 🔬 **Transaction Simulator** — Auto-generates random transactions for testing
- 📝 **Manual Transaction Entry** — Submit real transactions with full details
- ⚠️ **Risk Scoring Engine** — Automatically scores transactions as Low / Medium / High risk
- 📄 **PDF Report Generation** — Download detailed fraud reports with charts and stats
- 📜 **Transaction History** — View and filter all past transactions

---

## 🧠 How Risk Scoring Works

| Condition           | Risk Points Added |
|---|---|
| Amount > 50,000 PKR | +50 points        |
| Amount > 20,000 PKR | +20 points        |
| Unknown Device      | +25 points        |
| Foreign Location    | +25 points        |

| Total Score | Risk Level  | Fraud? |
|---|---|---|
| 70+         | 🔴 High    | Yes    |
| 30–69       | 🟡 Medium  | No     |
| 0–29        | 🟢 Low     | No     |

---

## 🛠️ Tech Stack

### Frontend
- React.js
- Axios
- React Router DOM
- jsPDF (PDF generation)
- Recharts (charts)

### Backend
- Node.js
- Express.js (Serverless — deployed on Vercel)
- MongoDB Atlas + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv

---
```
## 📁 Project Structure
Fraud_Detection_System/
├── backend/                        # Node.js + Express Backend (Serverless)
│   ├── config/
│   │   ├── db.js                   # MongoDB connection
│   │   ├── env.js                  # Environment variables
│   │   └── mlModel.js              # ML model config
│   ├── controllers/
│   │   ├── authController.js       # Register & Login logic
│   │   ├── transactionController.js# Transaction & fraud scoring logic
│   │   └── adminController.js      # Admin stats & fraud data
│   ├── middleware/
│   │   └── auth.js                 # JWT verify & admin guard
│   ├── models/
│   │   ├── User.js                 # User schema
│   │   └── Transaction.js          # Transaction schema
│   ├── routes/
│   │   ├── authRoutes.js           # /register /login
│   │   ├── transactionRoutes.js    # /add-transaction /transactions
│   │   └── adminRoutes.js          # /frauds /total-transactions /total-frauds
│   ├── services/                   # Business logic services
│   ├── uploads/                    # Uploaded files
│   ├── utils/                      # Helper functions
│   ├── app.js                      # Express app (Vercel entry point)
│   ├── index.js                    # Local development server
│   ├── vercel.json                 # Vercel deployment config
│   └── .env                        # Environment variables (not in repo)
├── client/                         # React Frontend
│   ├── public/
│   └── src/
│       ├── App.js                  # Routes
│       ├── Navbar.js               # Navigation with auth
│       ├── Login.js                # Login page
│       ├── Register.js             # Registration page
│       ├── Dashboard.js            # Admin dashboard
│       ├── History.js              # Transaction history
│       ├── SimulateTransaction.js  # Transaction simulator
│       ├── AddTransaction.js       # Manual transaction form
│       └── ProtectedRoute.js       # Route protection
├── .gitignore
└── README.md
```
---

## ⚙️ Getting Started

### 1. Clone the repository
git clone https://github.com/Krishnalund/Fraud_Detection_System.git
cd Fraud_Detection_System

### 2. Install backend dependencies
cd backend
npm install

### 3. Install frontend dependencies
cd ../client
npm install

### 4. Create `.env` file inside `backend/` folder
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key_here
PORT=5000

### 5. Run the backend
cd ../backend
node index.js

### 6. Run the frontend
cd ../client
npm start

### 7. Open in browser
http://localhost:3000

---

## 👤 Default Roles

| Role      | Access                                                        |
|---|---|
| **User**  | Register, Login, Submit transactions, View own history        |
| **Admin** | Full dashboard, View all transactions, Generate PDF reports   |

> To make yourself admin: Go to MongoDB Atlas → Data Explorer → `fraud_detection` → `users` → change `role` from `"user"` to `"admin"`

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint    | Description         |
|---|---|---|
| POST   | `/register` | Create new account  |
| POST   | `/login`    | Login and get token |

### Transactions (Protected)
| Method | Endpoint           | Access                |
|---|---|---|
| GET    | `/transactions`    | Admin: all, User: own |
| POST   | `/add-transaction` | Any logged in user    |

### Admin Only
| Method | Endpoint               | Description            |
|---|---|---|
| GET    | `/frauds`              | Get all fraud cases    |
| GET    | `/total-transactions`  | Total transaction count|
| GET    | `/total-frauds`        | Total fraud count      |
| GET    | `/node-stats`          | Node distribution stats|

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (never stored as plain text)
- **JWT tokens** expire after 7 days
- **Protected routes** — unauthenticated users redirected to login
- **Admin-only routes** — unauthorized users blocked at both frontend and backend
- `.env` file excluded from repository

---

### Deployment

- Frontend deployed on Vercel
- Backend deployed on Vercel Serverless Functions
- MongoDB Atlas used as cloud database
- app.js serves as the Vercel entry point
- index.js is used for local development

---

## 📄 License

This project is for educational purposes.