import React, { useEffect, useRef, useState } from "react";
import API from "../services/api";
import { WS_URL } from "../config";
import { useNavigate } from "react-router-dom";

const Chat = () => {
  const [users, setUsers] = useState([]);
  const [receiverId, setReceiverId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const wsRef = useRef(null);
  const chatEndRef = useRef(null);

  const token = localStorage.getItem("token");
  const payload = token ? JSON.parse(atob(token.split(".")[1])) : null;
  const userId = payload?.user_id;

  const currentUserName = payload?.username || `User ${userId}`;
  const selectedUser = users?.find(u => u.id === receiverId);

  const navigate = useNavigate();
  const [onlineUsers, setOnlineUsers] = useState([]);

  // =========================
  // AUTO LOAD MESSAGES
  // =========================
  useEffect(() => {
    if (receiverId) {
      loadMessages(receiverId);
    }
  }, [receiverId]);

  // =========================
  // Load Users
  // =========================
  useEffect(() => {
    API.get("/chat/users")
      .then(res => {
        setUsers(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => console.error("❌ Users error:", err));
  }, []);



// =========================
// 🔥 AUTO SELECT FIRST USER (OFFLINE FIX)
// =========================
useEffect(() => {
  if (users.length > 0 && !receiverId) {
    const firstUser = users[0];

    console.log("🔥 Auto selecting user:", firstUser.username);

    setReceiverId(firstUser.id);
    loadMessages(firstUser.id);
  }
}, [users]);





  // =========================
  // WebSocket
  // =========================
  useEffect(() => {
    if (!userId) return;

    const connectWS = () => {
      const socket = new WebSocket(`${WS_URL}/ws/${userId}`);

      socket.onopen = () => {
        console.log("✅ WS CONNECTED");
      };

      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);

        if (data.type === "message") {
          const newMsg = {
            id: data.id || Date.now(),
            sender_id: data.sender_id,
            message: data.message,
            file_url: data.file_url,
            file_type: data.file_type,
            status: "DELIVERED",
          };

          setMessages(prev => [...(prev || []), newMsg]);
        }

        if (data.type === "online_users") {
          setOnlineUsers(Array.isArray(data.users) ? data.users : []);
        }
      };

      socket.onerror = (err) => {
        console.error("❌ WS ERROR:", err);
      };

      socket.onclose = () => {
        console.log("❌ WS CLOSED → reconnecting...");
        setTimeout(connectWS, 2000);
      };

      wsRef.current = socket;
    };

    connectWS();

    return () => {
      wsRef.current?.close();
    };
  }, [userId]);

  // =========================
  // Logout
  // =========================
  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // =========================
  // Load Messages
  // =========================
  const loadMessages = async (id) => {
    try {
      const res = await API.get(`/chat/messages/${id}`);
      setMessages(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("❌ Load message error:", err);
      setMessages([]); // prevent crash
    }
  };

  // =========================
  // Send Message
  // =========================
  const sendMessage = async () => {
    if (!receiverId) {
      alert("Select a user first");
      return;
    }

    if (!text && !file) return;

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      console.log("⏳ Waiting for connection...");
      setTimeout(() => sendMessage(), 500);
      return;
    }

    const payload = {
      type: "message",
      receiver_id: parseInt(receiverId),
      message: text,
    };

    wsRef.current.send(JSON.stringify(payload));

    setMessages(prev => [
      ...(prev || []),
      {
        id: Date.now(),
        sender_id: userId,
        message: text,
        status: "SENT",
      }
    ]);

    setText("");
  };

  // =========================
  // Auto Scroll
  // =========================
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>

      {/* Sidebar */}
      <div style={styles.sidebar}>
        <h3>Chats</h3>

        {(users || []).map((u) => (
          <div
            key={u.id}
            onClick={() => {
              setReceiverId(u.id);
              loadMessages(u.id);
            }}
            style={{
              ...styles.userItem,
              background: receiverId === u.id ? "#2a3942" : "transparent",
            }}
          >
            <div style={styles.avatar}>{u.username[0]}</div>
            <div>
              {u.username}
              <br />
              <small>
                {onlineUsers.includes(u.id) ? "🟢 Online" : "⚪ Offline"}
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* Chat Area */}
      <div style={styles.chatArea}>

        <div style={styles.header}>
          <div>👤 {currentUserName}</div>
          <div>💬 {selectedUser?.username || "Select user"}</div>

          <button style={styles.logoutBtn} onClick={handleLogout}>
            Logout
          </button>
        </div>

        <div style={styles.messages}>
          {(messages || []).map((m) => (
            <div key={m.id} style={{ textAlign: m.sender_id === userId ? "right" : "left" }}>
              <div style={styles.bubble}>
                {m.message}
              </div>
            </div>
          ))}
          <div ref={chatEndRef}></div>
        </div>

        <div style={styles.inputArea}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            style={styles.textInput}
            placeholder="Type message..."
          />

          <button style={styles.sendBtn} onClick={sendMessage}>
            ➤
          </button>
        </div>

      </div>
    </div>
  );
};

const styles = {
  container: { display: "flex", height: "100vh", background: "#111b21", color: "white" },
  sidebar: { width: "30%", padding: 10 },
  chatArea: { width: "70%", display: "flex", flexDirection: "column" },

  header: {
    display: "flex",
    justifyContent: "space-between",
    padding: 10,
    borderBottom: "1px solid #2a3942"
  },

  logoutBtn: {
    background: "#ff4d4f",
    border: "none",
    padding: "6px 10px",
    color: "white",
    cursor: "pointer"
  },

  messages: { flex: 1, overflowY: "auto", padding: 10 },
  inputArea: { display: "flex", padding: 10 },
  textInput: { flex: 1, padding: 10 },
  sendBtn: { padding: 10, background: "#00a884", color: "white", border: "none" },

  bubble: { background: "#202c33", padding: 10, borderRadius: 10, margin: 5 },

  avatar: { width: 40, height: 40, borderRadius: "50%", background: "#00a884", display: "flex", alignItems: "center", justifyContent: "center" },
  userItem: { display: "flex", gap: 10, padding: 10, cursor: "pointer" },
};

export default Chat;