# 🔗 URL Shortener

A simple and secure URL shortener web application built using **Node.js**, **Express**, **MongoDB**, and **EJS**. It allows users to shorten long URLs, view analytics (click counts), and manage their shortened links via a user-friendly interface.

---

## 🌐 Live Website

👉 [LinkSlice](https://url-shortener-1-bk6b.onrender.com/)

---

## 🚀 Features

- 🔐 User authentication (Signup/Login)
- 🔗 Shorten any long URL to a compact one
- 📊 Analytics for each short link (click count)
- 🧑 Dashboard to view and manage all your URLs
- 💡 Built with security and clean design in mind

---

## 🛠️ Tech Stack

- **Backend**: Node.js, Express
- **Frontend**: EJS, HTML, CSS
- **Database**: MongoDB + Mongoose
- **Authentication**: Cookies + Custom JWT logic
- **Dev Tools**: Nodemon, dotenv

---

## ⚙️ Getting Started (Local Setup)

### 🧾 1. Clone the Repo

```bash
git clone https://github.com/PriyanshLathigara/URL-Shortener.git
cd URL-Shortener
```

### 📦 2. Install Dependencies

```bash
npm install
```

### 🛡️ 3. Set Up Environment Variables

- Create a .env file in the root folder:

```bash
PORT=8001
MONGO_URL=your_mongo_connection_string
secret=your_secret_key
```

- ⚠️ Do not share your .env file publicly. For team projects, create a .env.example.

### 🔄 4. Run in Development Mode

```bash
npm run dev
```

- Now open your browser at: http://localhost:8001
- ✅ All set! Your app is up and running locally.
- And All set, Done & Dusted.
