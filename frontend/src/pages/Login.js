import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post("/auth/login", {
        username,
        password,
      });

      const token = res.data.access_token;

      console.log("✅ LOGIN RESPONSE:", res.data);

      if (!token) {
        alert("No token received!");
        return;
      }

      // 🔥 SAVE TOKEN
      localStorage.setItem("token", token);

      console.log("✅ TOKEN SAVED:", token);

      window.location.reload();   // 🔥 IMPORTANT

      // 🔥 FORCE REDIRECT
      const payload = JSON.parse(atob(token.split(".")[1]));

	if (payload.role === "ADMIN") {
		  window.location.href = "/admin";
		} else {
		  window.location.href = "/chat";
		}

    } catch (err) {
	  console.error("❌ Login error:", err.response?.data || err.message);
	  alert(err.response?.data?.detail || "Login failed");
}
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: 20 }}>Login</h2>

        <input
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>
          Login
        </button>

        <p style={{ marginTop: 15 }}>
          New user?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/signup")}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

// 🎨 UI ONLY (NO LOGIC CHANGE)
const styles = {
  container: {
    height: "100vh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#111b21",
  },

  card: {
    background: "#202c33",
    padding: 30,
    borderRadius: 12,
    width: 320,
    textAlign: "center",
    color: "white",
    boxShadow: "0 6px 20px rgba(0,0,0,0.5)",
  },

  input: {
    width: "100%",
    padding: 10,
    margin: "10px 0",
    borderRadius: 6,
    border: "none",
    outline: "none",
  },

  button: {
    width: "100%",
    padding: 10,
    background: "#00a884",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 10,
    fontWeight: "bold",
  },

  link: {
    color: "#00a884",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Login;