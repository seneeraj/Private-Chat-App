import React, { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  // =========================
  // 🔄 LOAD USERS
  // =========================
  const loadUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      console.log("🔥 Loading users with token:", token);

      if (!token) {
        console.log("⏳ No token yet");
        return;
      }

      const res = await API.get("/admin/pending-users");
      console.log("🔥 API RESPONSE:", res.data);

      const data = Array.isArray(res.data)
        ? res.data
        : res.data.users || res.data.data || [];

      setUsers(data);
    } catch (err) {
      console.error("❌ Error loading users:", err);
    }
  };

  // =========================
  // ✅ APPROVE USER
  // =========================
  const approveUser = async (id) => {
    try {
      await API.put(`/admin/approve/${id}`);
      loadUsers();
    } catch (err) {
      console.error("❌ Approve error:", err);
    }
  };

  // =========================
  // 🚀 LOAD ON START
  // =========================
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔑 Admin token:", token);

    if (!token) {
      console.log("❌ No token → redirecting");
      navigate("/");
      return;
    }

    loadUsers();
  }, [navigate]);

  return (
    <div style={styles.container}>

      {/* 🔥 HEADER (NEW) */}
      <div style={styles.header}>
        <h2 style={{ margin: 0 }}>⚙️ Admin Panel</h2>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            style={styles.navBtn}
            onClick={() => navigate("/chat")}
          >
            💬 Chat
          </button>

          <button
            style={styles.logoutBtn}
            onClick={() => {
              localStorage.removeItem("token");
              navigate("/");
            }}
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {/* 🔥 CONTENT */}
      {users.length === 0 ? (
        <p style={{ color: "#aaa" }}>No pending users</p>
      ) : (
        <div style={styles.grid}>
          {users.map((u) => (
            <div key={u.id} style={styles.card}>

              <div style={styles.avatar}>
                {u.username ? u.username[0].toUpperCase() : "U"}
              </div>

              <h3>{u.username}</h3>

              <span style={styles.status}>PENDING</span>

              <button
                style={styles.approveBtn}
                onClick={() => approveUser(u.id)}
              >
                Approve
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// =========================
// 🎨 STYLES
// =========================
const styles = {
  container: {
    padding: 20,
    background: "#111b21",
    minHeight: "100vh",
    color: "white",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
    maxWidth: "1400px",
    margin: "0 auto",
  },

  // 🔥 NEW HEADER STYLE
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  navBtn: {
    background: "#3b82f6",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    color: "white",
    cursor: "pointer",
  },

  logoutBtn: {
    background: "#ef4444",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    color: "white",
    cursor: "pointer",
  },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 20,
    width: "100%",
  },

  card: {
    background: "#202c33",
    padding: 20,
    borderRadius: 12,
    textAlign: "center",
    boxShadow: "0 4px 10px rgba(0,0,0,0.4)",
  },

  avatar: {
    width: 60,
    height: 60,
    borderRadius: "50%",
    background: "#00a884",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 24,
    margin: "0 auto 10px",
  },

  status: {
    display: "inline-block",
    background: "#ffa000",
    padding: "5px 10px",
    borderRadius: 20,
    fontSize: 12,
    marginTop: 10,
  },

  approveBtn: {
    marginTop: 15,
    background: "#00a884",
    border: "none",
    padding: "8px 12px",
    borderRadius: 6,
    cursor: "pointer",
    color: "white",
  },
};

export default Admin;