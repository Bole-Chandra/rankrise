# 🎓 Rankrise Educational Platform

A full-stack educational platform for Rankrise coaching institute — built with **React + Vite** (frontend) and **Node.js + Express + MongoDB Atlas** (backend).

---

## 📁 Project Structure

```
new1/
├── client/          # React + Vite frontend
│   ├── src/
│   │   ├── pages/       # All page components
│   │   ├── components/  # Shared components (Navbar, Footer, etc.)
│   │   └── routes/      # App routing
│   └── vite.config.js
├── server/          # Node.js + Express backend
│   ├── config/      # Database config
│   ├── controllers/ # Route logic
│   ├── middleware/  # Auth + error handling
│   ├── models/      # Mongoose models
│   ├── routes/      # API routes
│   ├── .env         # ⚠️ Your secrets — never commit this!
│   └── server.js    # Entry point
└── package.json     # Root: run both client + server
```

---

## ⚡ Quick Start

### 1. Install All Dependencies
```bash
cd new1
npm run install:all
```

### 2. Configure MongoDB Atlas

**Step-by-step Atlas setup:**
1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com)
2. Create a free **M0 Cluster** (if you haven't already)
3. Click **Connect** → **Drivers** → Select **Node.js**
4. Copy the connection string (looks like `mongodb+srv://...`)
5. Open `server/.env` and replace the `MONGODB_URI` line:

```env
MONGODB_URI=mongodb+srv://yourUsername:yourPassword@cluster0.xxxxx.mongodb.net/rankrise?retryWrites=true&w=majority&appName=rankrise
```

> ⚠️ **Important**: In Atlas → **Network Access** → Add your IP address (or `0.0.0.0/0` for all IPs during development)

### 3. Seed the Admin User
```bash
npm run seed
```
This creates:
- **Email**: `meghaphanikumar@gmail.com`
- **Password**: `ChandraCM`

### 4. Start Development Servers
```bash
npm run dev
```
This starts both:
- 🌐 **Frontend**: [http://localhost:5173](http://localhost:5173)
- 🔌 **Backend API**: [http://localhost:5000/api](http://localhost:5000/api)

---

## 🔑 Admin Panel

| URL | Credentials |
|-----|-------------|
| [http://localhost:5173/admin/login](http://localhost:5173/admin/login) | `meghaphanikumar@gmail.com` / `ChandraCM` |

---

## 📡 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Admin login |
| `GET` | `/api/auth/me` | Get current user |
| `POST` | `/api/admissions` | Submit admission form |
| `GET` | `/api/admissions` | Get all admissions (admin) |
| `GET` | `/api/blogs` | Get all blogs |
| `POST` | `/api/blogs` | Create blog (admin) |
| `POST` | `/api/contact` | Submit contact/enquiry |
| `GET` | `/api/gallery` | Get gallery items |

---

## 🌐 Frontend Pages

| Page | URL |
|------|-----|
| Home | `/` |
| About Us | `/aboutus.html` |
| **Admissions** | `/admissions` |
| Contact | `/contact.html` |
| Blog | `/blog.html` |
| Gallery | `/gallery.html` |
| IIT-JEE Coaching | `/best-iit-coaching-in-hyderabad.html` |
| NEET Coaching | `/best-neet-coaching-in-hyderabad.html` |
| EAMCET Coaching | `/best-eamcet-coaching-in-hyderabad.html` |
| BITSAT Coaching | `/best-bitsat-coaching-in-hyderabad.html` |
| MPC + IIT | `/mpc-with-iit-coaching-hyderabad.html` |
| BiPC + NEET | `/bipc-with-neet-coaching-hyderabad.html` |
| MPC + EAMCET | `/mpc-with-eamcet-coaching-hyderabad.html` |
| **Admin Login** | `/admin/login` |
| Admin Dashboard | `/admin/dashboard` |

---

## 🚀 Production Deployment (Hostinger)

1. Build the frontend: `cd client && npm run build`
2. Upload `client/dist/` as your web root
3. Deploy `server/` as a Node.js app
4. Set environment variables on hosting panel
5. Update `CLIENT_URL` in `server/.env` to your production domain

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, React Router v6 |
| Backend | Node.js, Express 5 |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | JWT (JSON Web Tokens) |
| Styling | Vanilla CSS (scoped per component) |
