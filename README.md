# 📚 Library Management System (LMS) [checkout backend @ https://github.com/Nachiket-Roy/LMS-Backend]

A full-stack **Library Management System (LMS)** built with **Node.js, Express, MongoDB, and React.js**.
It allows librarians and users to manage books, borrowing, payments, and notifications in a digital library environment.

## 🚀 Features

* 👤 **Authentication & Authorization**

  * User registration & login (with JWT/Passport).
  * Admin, librarian, and user roles.

* 📖 **Book Management**

  * Add, update, delete, and search books.
  * Track available and borrowed copies.

* 📦 **Borrow & Return System**

  * Borrow and return books.
  * Auto-update availability status.

* 🔔 **Notifications**

  * Alerts for due dates, late fees, and reservations.

* 💳 **Payments**

  * Fine management & payment records.

---


## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/Nachiket_Roy/LMS-Backend.git
cd LMS-Backend
```

### 2. Backend Setup

```bash

npm install
```

* Create a `.env` file:

```env
PORT = 3000
MONGODB = 
JWT_SECRET= 
JWT_REFRESH_SECRET = 
```
Make sure to use your own credentials.

* Run backend:

```bash
node seed.js 
nodemon server.js or node server.js
```

### 3. Frontend Setup

```bash
git clone https://github.com/Nachiket-Roy/LMS
npm install
npm run dev
```

---





