# 💬 Private Chat Application (Approval-Based)

A full-stack real-time chat application with **user authentication, admin approval system, WebSocket messaging, and offline message support**.

---

## 🚀 Features

### 🔐 Authentication & Security

* User Signup & Login (JWT आधारित authentication)
* Password hashing (secure storage)
* Role-based access (Admin / User)

### 👨‍💼 Admin Panel

* New users require **admin approval**
* Admin dashboard to:

  * View pending users
  * Approve users
* Only approved users can access chat

### 💬 Real-Time Chat

* WebSocket-based instant messaging
* Online/offline user status
* One-to-one chat system

### 📩 Offline Messaging (Key Feature)

* Messages are stored in database when receiver is offline
* Automatically loaded when user logs in
* Persistent chat history

### 📁 File Sharing

* Upload images, PDFs, and files
* Stored locally in `/uploads`
* Accessible via generated URLs

---

## 🏗️ Tech Stack

### Backend

* **FastAPI** ⚡
* **SQLAlchemy** (ORM)
* **SQLite** (Database)
* **WebSockets** (Real-time communication)
* **JWT Authentication**
* **Fernet Encryption** (message security)

### Frontend

* **React.js**
* **Axios**
* **React Router**
* Custom CSS UI

---

## 📁 Project Structure

```
chat-app/
│
├── backend/
│   ├── app/
│   │   ├── api/routes/
│   │   │   ├── auth.py
│   │   │   ├── chat.py
│   │   │   ├── chat_ws.py
│   │   │   ├── admin.py
│   │   │
│   │   ├── core/
│   │   │   ├── encryption.py
│   │   │   ├── security.py
│   │   │
│   │   ├── db/
│   │   │   ├── database.py
│   │   │   ├── models.py
│   │   │
│   │   ├── main.py
│   │
│   ├── uploads/
│   ├── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Signup.js
│   │   │   ├── Chat.js
│   │   │   ├── Admin.js
│   │   │
│   │   ├── services/api.js
│   │   ├── App.js
│   │
│   ├── package.json
│
├── README.md
├── LICENSE
├── .gitignore
```

---

## ⚙️ Installation & Setup

### 🔧 Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload
```

👉 Backend will run on:

```
http://127.0.0.1:8000
```

---

### 💻 Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run app
npm start
```

👉 Frontend will run on:

```
http://localhost:3000
```

---

## 🔑 Default Flow

1. User signs up → Status = `PENDING`
2. Admin logs in → Approves user
3. Approved user logs in → Access chat
4. Users can:

   * Send real-time messages
   * Send messages to offline users
5. Offline user logs in → Sees stored messages

---

## 🔄 API Endpoints

### Auth

* `POST /auth/signup`
* `POST /auth/login`

### Chat

* `GET /chat/users`
* `GET /chat/messages/{receiver_id}`
* `POST /chat/upload`

### Admin

* `GET /admin/pending-users`
* `PUT /admin/approve/{id}`

### WebSocket

* `/ws/{user_id}`

---

## 🔐 Security Features

* JWT Token Authentication
* Password hashing (bcrypt)
* Message encryption (Fernet)
* Role-based access control
* CORS protection enabled

---

## 🧪 Testing Scenarios

### ✅ Online Messaging

* Both users online → instant delivery

### ✅ Offline Messaging

* Sender sends message → receiver offline
* Receiver logs in → message loaded from DB

### ✅ Admin Approval

* User cannot login until approved

---

## ⚠️ Important Notes

* Do NOT upload:

  * `chat.db`
  * `/uploads` files
  * `.env`
* Encryption key must be **constant** for message decryption
* Ensure backend runs before frontend

---

## 🚀 Future Enhancements

* ✅ Message Seen / Delivered ticks
* ✅ Typing indicator
* ✅ Group chat
* ✅ Push notifications
* ✅ Cloud deployment (AWS / Render / Railway)
* ✅ PostgreSQL / MongoDB integration

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 👨‍💻 Author

Developed by **Neeraj Bhatia**

---

## ⭐ Support

If you like this project:

* ⭐ Star the repo
* 🍴 Fork it
* 📢 Share it

---

## 💡 Inspiration

A lightweight **WhatsApp-style chat system** with admin-controlled access and secure messaging.


