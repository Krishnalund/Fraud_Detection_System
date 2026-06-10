# 🔍 Fraud Detection & Transaction Monitoring System

A full-stack web application that monitors financial transactions, detects fraudulent activities, and provides real-time analytics through an interactive dashboard.

---

## Group Members

| Name | Student ID |
|------|------------|
| Krishna Lund | 023-24-0271 |
| Sneha Kanjwani | 023-24-0273 |

---

## Project Overview

This system allows users to submit financial transactions, which are then analyzed using fraud detection rules and stored in MongoDB. The frontend dashboard displays real-time transaction statistics, fraud alerts, charts, and reports.

---

## Features

- ✅ Real-time transaction monitoring
- ✅ Automatic fraud detection with risk scoring (Low / Medium / High)
- ✅ Live fraud alerts panel
- ✅ Interactive charts (Doughnut, Bar, Node Distribution)
- ✅ Transaction history with search & filter
- ✅ Transaction simulator for testing
- ✅ PDF report generation
- ✅ Dashboard auto-refresh every 5 seconds

---

## Technologies Used

### Frontend
| Technology | Purpose |
|------------|---------|
| React.js | UI framework |
| React Router | Page navigation |
| Chart.js | Charts and graphs |
| Axios | API communication |
| jsPDF | PDF report generation |

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js | Server runtime |
| Express.js | REST API framework |

### Database
| Technology | Purpose |
|------------|---------|
| MongoDB | Stores all transaction data |

---


## How to Run Locally

### Prerequisites — Install these first:
- [Node.js](https://nodejs.org) — Download and install the **LTS version**
- [MongoDB Community](https://www.mongodb.com/try/download/community) — Download and install
- [Install Postman]-give input using api commands or you can also give input or test transaction using 
  simulator in our project

---

### Step 1 — Clone or Extract the Project

If you have the ZIP file, extract it to a folder.

### Step 2 — Start the Backend

Open a terminal and run:

```bash
cd backend
npm install
node server.js
```

You should see:
```
Server running on port 5000
MongoDB connected
```

---

### Step 3 — Start the Frontend

Open a **second terminal** in client's integrated terminal and run:

```bash
cd frontend
npm install
npm start
```

The browser will automatically open at:
```
http://localhost:3000
```

---

### Step 4 — Add a Transaction (Using Postman)

Open Postman and send a **POST** request:

- **URL:** `http://localhost:5000/api/add-transaction`
- **Method:** `POST`
- **Body (JSON):**

```json
{
  "sender": "Sophia",
  "receiver": "Hassan",
  "amount": 120000,
  "location": "Foreign",
  "device": "Desktop"
}
```

The dashboard will automatically update with the new transaction.

---

## How It Works

```
User submits transaction
        ↓
Backend receives & analyzes it
        ↓
Fraud detection rules assign risk level
(Low / Medium / High)
        ↓
Transaction saved to MongoDB
        ↓
Dashboard fetches & displays updated data
        ↓
Charts, alerts & statistics update in real time
```

---

## Dashboard Pages

| Page | Description |
|------|-------------|
| **Home** | Introduction, features, and system workflow |
| **Dashboard** | Live stats, charts, fraud alerts, and transaction table |
| **History** | Full transaction log with search, filter, and sort |
| **Simulator** | Manually test transactions and see fraud results |

---


## For the Instructor

To test the project:
1. Open the live website link in any browser
2. Navigate to the **Simulator** page to add test transactions
3. View real-time results on the **Dashboard**
4. Check full history on the **History** page
5. Download a PDF report using the **Export** button on the Dashboard


