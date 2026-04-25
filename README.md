# 🛡️ VaultX – Production-Ready Password Manager

VaultX is a secure, full-stack password manager built with the MERN stack.  
It follows a **zero-knowledge approach** where all sensitive data is encrypted on the client side before being stored, ensuring user secrets remain private.

---

## 🌐 Live Demo

- **Frontend (Vercel)**: https://passop-flame.vercel.app  
- **Backend (Render)**: https://passop-8ewz.onrender.com  

---

## ✨ Key Features

### 🔐 Security First
- **Client-Side Encryption**: All passwords are encrypted in the browser before being sent to the backend  
- **Zero-Knowledge Design**: Server never sees plain-text passwords  
- **Password Hashing**: User authentication secured using bcrypt  
- **JWT Authentication**: Secure session handling  

### 🛡️ Protection & Safety
- **Auto-Lock System**: Vault locks after **60 seconds of inactivity**  
- **Breach Detection**: Checks compromised credentials using HaveIBeenPwned API  
- **Strong Password Generator**: Create secure passwords instantly  

### 🔑 Authentication
- **Email + Password Login**
- **Google OAuth 2.0 Sign-In**
- **Secure Password Reset via Email (Nodemailer)**

### 🎨 User Experience
- Clean **SaaS-style dashboard UI**
- Smooth animations using **Framer Motion**
- Fully responsive across devices

---

## ⚙️ Tech Stack

**Frontend**
- React (Vite)
- Tailwind CSS
- Framer Motion
- Lucide Icons

**Backend**
- Node.js
- Express.js
- JWT Authentication
- Bcrypt
- Nodemailer

**Database**
- MongoDB Atlas

**Deployment**
- Vercel (Frontend)
- Render (Backend)

---

## 📁 Project Structure

```
passop/
├── src/                  # Frontend (React)
│   ├── components/
│   └── App.jsx
├── backend/              # Backend (Express)
│   ├── routes/
│   ├── controllers/
│   ├── services/
│   └── utils/
└── vercel.json
```

---

## 🔧 Environment Variables

### Frontend (.env)
- `VITE_API_URL`
- `VITE_GOOGLE_CLIENT_ID`

### Backend (.env)
- `MONGO_URI`
- `JWT_SECRET`
- `GMAIL_USER`
- `GMAIL_APP_PASSWORD`
- `FRONTEND_URL`

---

## 🚀 Run Locally

```bash
git clone https://github.com/ijharul/passop.git
cd passop

# frontend
npm install
npm run dev

# backend
cd backend
npm install
npm start
```

---

## 📸 Screenshots

(Add your UI screenshots here)

---

## 🧠 Highlights

- Implemented **zero-knowledge encryption model**
- Built **secure authentication system (JWT + OAuth)**
- Designed **production-style UI/UX**
- Applied **basic DevOps practices (deployment + env handling)**

---

## 👨‍💻 Author

**Ijharul Haque**  
Built with ❤️ for secure and modern web applications

---

## 📄 License

This project is for educational and portfolio purposes.
