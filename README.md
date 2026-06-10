# 🛡️ FraudGuard — Real-time Fraud Detection System

A full-stack web application that detects and monitors fraudulent transactions in real-time using rule-based risk scoring, JWT authentication, and role-based access control.

---

## 🚀 Live Demo
> Coming soon after deployment

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
- Express.js
- MongoDB + Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- dotenv

---

## 📁 Project Structure
```
Fraud_Detection_System/
├── client/                  # React Frontend
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
├── server.js                       # Express backend
├── package.json
└── .env                            # Environment variables (not in repo)
```
---

### 1. Clone the repository

git clone https://github.com/Krishnalund/Fraud_Detection_System.git
cd Fraud_Detection_System


### 2. Install backend dependencies
npm install


### 3. Install frontend dependencies
cd client
npm install


### 4. Create `.env` file in root folder
MONGO_URI=mongodb://127.0.0.1:27017/fraudDB
JWT_SECRET=your_secret_key_here
PORT=5000

### 5. Run the backend
cd ..
node server.js

### 6. Run the frontend
cd client
npm start

### 7. Open in browser
http://localhost:3000


## 👤 Default Roles

| Role      | Access  
|---|---|                                                            
| **User**  | Register, Login, Submit transactions, View own history      |
| **Admin** | Full dashboard, View all transactions, Generate PDF reports |

> To make yourself admin: Open MongoDB Compass → `fraudDB` → `users` → change `role` from `"user"` to `"admin"`

---

## 🌐 API Endpoints
### Auth
| Method    | Endpoint       | Description         |
|---|---|---|
| POST      | `/register`    | Create new account  |
| POST      | `/login`       | Login and get token |

### Transactions (Protected)
| Method | Endpoint                  | Access                |
|---|---|---|
| GET    | `/transactions`           | Admin: all, User: own |
| POST   | `/add-transaction`        | Any logged in user    |
| POST   | `/simulate-transaction`   | Any logged in user    |
| GET    | `/frauds`                 | Admin only            |
| GET    | `/high-risk-transactions` | Admin only            |
| GET    | `/total-transactions`     | Admin only            |
| GET    | `/total-frauds`           | Admin only            |
| GET    | `/node-stats`             | Admin only            |

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (never stored as plain text)
- **JWT tokens** expire after 7 days
- **Protected routes** — unauthenticated users redirected to login
- **Admin-only routes** — unauthorized users blocked at both frontend and backend
- `.env` file excluded from repository

---

## 📦 Deployment

- **Frontend** — Vercel
- **Backend** — Render
- **Database** — MongoDB Atlas

---

## 📄 License

This project is for educational purposes.