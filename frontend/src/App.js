import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Chat from "./pages/Chat";
import Admin from "./pages/Admin";

function App() {
  const token = localStorage.getItem("token");

  let role = null;
  if (token) {
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      role = payload.role;
    } catch (e) {
      console.error("Token decode error:", e);
    }
  }

  return (
    <Routes>

      {/* 🔥 LOGIN ALWAYS FIRST */}
      <Route path="/" element={<Login />} />

      <Route path="/signup" element={<Signup />} />

      {/* 🔥 CHAT ROUTE (ROLE BASED REDIRECT) */}
      <Route
		path="/chat"
		element={
			token
			? <Chat />   // ✅ allow admin + user both
			: <Navigate to="/" />
		}
	  />

      {/* 🔥 ADMIN ROUTE */}
      <Route
        path="/admin"
        element={
          token && role === "ADMIN"
            ? <Admin />
            : <Navigate to="/" />
        }
      />

      {/* 🔥 FALLBACK (OPTIONAL BUT CLEAN) */}
      <Route path="*" element={<Navigate to="/" />} />

    </Routes>
  );
}

export default App;