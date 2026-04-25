# 🛡️ VaultX - Enterprise-Grade Password Security

VaultX is a high-performance, professional-grade SaaS password manager designed for extreme security and minimalism. Built on the MERN stack with zero-knowledge architecture, it ensures your secrets never leave your browser unencrypted.

---

## 🌐 Live Infrastructure

*   **Vault Terminal (Frontend)**: [https://passop-flame.vercel.app](https://passop-flame.vercel.app)
*   **Security Core (Backend)**: [https://passop-8ewz.onrender.com](https://passop-8ewz.onrender.com)

---

## ✨ Advanced Features

### 🔐 Zero-Knowledge Encryption
*   **Client-Side AES-256**: All passwords are encrypted locally using your Master Key before reaching the database.
*   **Master Key Protocol**: Your Master Key is never stored on any server, ensuring only you have access.

### 🛡️ Real-Time Security
*   **Auto-Lock Engine**: The vault automatically locks after **60 seconds of inactivity** to prevent unauthorized physical access.
*   **Breach Detection**: Integrated with HaveIBeenPwned API to check if your passwords have been leaked in public breaches.
*   **Secure Generator**: One-click high-entropy password generation.

### 🌐 Unified Authentication
*   **Social Sign-In**: Instant access using Google OAuth 2.0 with permanent secure encryption keys.
*   **Master Key Recovery**: Secure, time-limited reset links delivered via real-time SMTP (Nodemailer).

### 🎨 Premium User Experience
*   **SaaS Dashboard**: A minimalist "Bitwarden-style" interface with glassmorphism and smooth `framer-motion` animations.
*   **Fully Responsive**: Engineered for perfect security on Desktop, Tablet, and Mobile.

---

## ⚙️ Engineering Stack

*   **Frontend**: React 18, Tailwind CSS, Lucide Icons, Framer Motion
*   **Backend**: Node.js, Express.js, JWT, Nodemailer
*   **Database**: MongoDB Atlas (Encrypted Clusters)
*   **Infrastructure**: Vercel (Frontend), Render (Backend)

---

## 📁 Repository Architecture

```text
passop/
├── src/                # React components & UI logic
│   ├── components/     # Vault, Lock, Auth & Navigation
│   └── App.jsx         # Global state & security timer
├── backend/            # Express security layer
│   ├── routes/         # Auth & Data endpoints
│   ├── controllers/    # Business logic
│   └── services/       # Database & Email services
└── vercel.json         # SPA routing configuration
```

---

## 🔧 Deployment Configuration

### Environment Variables (.env)
Required for full functionality:
*   `VITE_API_URL`: Backend service endpoint
*   `VITE_GOOGLE_CLIENT_ID`: Google OAuth ID
*   `GMAIL_USER`: SMTP sender email
*   `GMAIL_APP_PASSWORD`: Secure 16-character SMTP token
*   `FRONTEND_URL`: Production frontend address

---

## 👨‍💻 Built with ❤️ by IJHARUL
*Precision engineered for the next generation of digital privacy.*
