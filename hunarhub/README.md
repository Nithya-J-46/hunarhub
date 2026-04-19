# HunarHub – Digital Marketplace for Local Micro-Entrepreneurs

A full-stack web platform connecting local micro-entrepreneurs (cobblers, potters, tailors, artisans) with customers.

## 🚀 Tech Stack
- **Frontend:** React (Vite) + Tailwind CSS
- **Backend:** Node.js + Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT

## 📁 Project Structure
```
hunarhub/
├── client/   → React frontend
└── server/   → Node.js backend
```

## ⚙️ Setup Instructions

### Backend
```bash
cd server
npm install
# Create .env file with MONGO_URI and JWT_SECRET
npm start
```

### Frontend
```bash
cd client
npm install
npm run dev
```

## 🌐 Deployment
- Backend → [Render.com](https://render.com)
- Frontend → [Vercel](https://vercel.com)
- Database → [MongoDB Atlas](https://cloud.mongodb.com)

## 👥 User Roles
- **Customer** – Browse, book services, buy products
- **Entrepreneur** – Manage profile, listings, orders
- **Admin** – Verify entrepreneurs, manage platform
