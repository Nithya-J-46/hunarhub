# HunarHub – Digital Marketplace for Local Micro-Entrepreneurs

![HunarHub Banner](https://img.shields.io/badge/Status-Live-brightgreen) ![Tech Stack](https://img.shields.io/badge/Tech_Stack-MERN-blue) ![License](https://img.shields.io/badge/License-MIT-purple)

HunarHub is a comprehensive full-stack web application designed to empower local micro-entrepreneurs such as cobblers, potters, tailors, and street vendors. It bridges the gap between traditional local skills and modern digital consumers by providing an easy-to-use platform for discovering, booking services, and purchasing handmade products.

---

## 🎯 Problem Statement & Solution

**The Problem:** Traditional micro-entrepreneurs rely heavily on foot traffic and word-of-mouth. They often lack the technical skills and financial resources to establish an online presence, causing them to lose potential customers to large e-commerce platforms.

**The Solution:** HunarHub provides a zero-friction, mobile-responsive marketplace specifically tailored for local artisans. It allows them to showcase their skills, accept service requests, and sell physical products locally without the complexity of managing a standalone website.

---

## ✨ Key Features

### For Customers
* **Advanced Discovery:** Search for local entrepreneurs by category, skills, location, and price.
* **Service Requests:** Submit custom service requests (e.g., shoe repair, custom tailoring) and track their status.
* **Product Marketplace:** Browse and purchase handmade physical products from local artisans.
* **Personal Dashboard:** Track all ongoing service requests and product order shipments.

### For Entrepreneurs
* **Business Profile:** Create and manage a digital storefront detailing skills, pricing, and availability.
* **Order Management:** Accept, reject, or complete service requests via a dedicated dashboard.
* **Product Listings:** List physical inventory for sale with automated stock tracking.
* **Earnings Tracker:** Automatically track earnings from completed services and delivered products.

### For Administrators
* **Verification System:** Verify the authenticity of newly registered entrepreneurs.
* **User Management:** Oversee all customers and entrepreneurs on the platform.

---

## 🚀 Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, React Router DOM
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose ODM)
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs
* **Deployment:** Railway.app (Single-service deployment architecture)

---

## 📁 Project Structure

```text
hunarhub/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI elements (Navbar, Cards)
│   │   ├── context/        # React Context API (Auth state)
│   │   ├── pages/          # Full page views (Home, Dashboards, Auth)
│   │   └── App.jsx         # Main router configuration
│   └── vite.config.js      # Vite configuration & proxy settings
│
├── server/                 # Node.js/Express Backend
│   ├── middleware/         # Custom middleware (JWT auth validation)
│   ├── models/             # Mongoose schemas (User, Product, Order)
│   ├── routes/             # RESTful API endpoints
│   └── server.js           # Express entry point & production static serving
│
└── package.json            # Root configuration for Railway deployment
```

---

## ⚙️ Local Setup & Installation

To run this project locally on your machine, follow these steps:

### 1. Clone the repository
```bash
git clone https://github.com/Nithya-J-46/hunarhub.git
cd hunarhub/hunarhub
```

### 2. Configure Environment Variables
Create a `.env` file inside the `/server` directory and add the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 3. Install Dependencies & Run (Development Mode)
You will need two terminal windows to run both the frontend and backend simultaneously.

**Terminal 1: Backend**
```bash
cd server
npm install
npm run dev
```

**Terminal 2: Frontend**
```bash
cd client
npm install
npm run dev
```
The application will be available at `http://localhost:5173`.

---

## 🌐 Production Deployment

The project is configured for seamless deployment on **Railway.app** as a unified full-stack service.

1. Connect the GitHub repository to a new Railway project.
2. In Railway **Variables**, add your `MONGO_URI` and `JWT_SECRET`.
3. In Railway **Settings**, ensure the **Root Directory** is set to `/hunarhub` (if the project is nested).
4. Railway will automatically install dependencies, build the React frontend, and serve the production assets via the Express backend over port `8080`.

---

## 📜 API Endpoints Overview

| Route | Method | Description | Access |
|-------|--------|-------------|--------|
| `/api/auth/register` | POST | Register a new user | Public |
| `/api/auth/login` | POST | Authenticate user & get token | Public |
| `/api/entrepreneurs` | GET | Fetch and filter entrepreneurs | Public |
| `/api/products` | GET | Fetch all listed products | Public |
| `/api/orders` | POST | Create a service/product request | Customer |
| `/api/orders/:id` | PUT | Update order status | Entrepreneur |

---
*Developed as an academic/portfolio project.*
