import React, { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post("/auth/signup", {
        username,
        email,
        password,
      });

      alert("Signup successful");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.detail || "Signup failed");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Signup</h2>

        <input
          placeholder="Username"
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          placeholder="Email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          style={styles.input}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.button} onClick={handleSignup}>
          Signup
        </button>

        <p>
          Already have account?{" "}
          <span
            style={styles.link}
            onClick={() => navigate("/")}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "#0b141a",
  },
  card: {
    background: "#1f2c34",
    padding: 30,
    borderRadius: 10,
    width: 300,
    textAlign: "center",
    boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
  },
  title: {
    marginBottom: 20,
    color: "white",
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    border: "none",
  },
  button: {
    width: "100%",
    padding: 10,
    background: "#00a884",
    color: "white",
    border: "none",
    borderRadius: 5,
    cursor: "pointer",
  },
  link: {
    color: "#00a884",
    cursor: "pointer",
  },
};

export default Signup;