import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Link,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import {
  Card,
  CardContent,
  Box,
  AppBar,
  Toolbar,
  Typography,
  Container,
  Tab,
  Tabs,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    console.log(username, password);
    try {
      const response = await fetch(process.env.REACT_APP_LOGIN_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user: username,
          password: password,
        }),
      });
      console.log(response);
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        navigate("/home");
      } else {
        toast.error(`Invalid login credentials`, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
          pauseOnHover: true,
        });
      }
    } catch (e) {
      toast.error(
        e.message.includes("Failed")
          ? "Failed to connect to server"
          : `${e.message}`,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: true,
          closeOnClick: true,
          draggable: true,
          pauseOnHover: true,
        },
      );
    }
  };

  return (
    <Container
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        padding: "20px",
      }}
    >
      <div style={{ display: "flex", justifyContent: "center", gap: "4px" }}>
        <img src="/login.svg" style={{ width: "4%" }} />
        <h2 style={{ color: "#1abc9c" }}>Login</h2>
      </div>
      <div
        style={{
          margin: "2%",
          borderRadius: "7px",
          padding: "2%",
          paddingTop: "2%",
          width: "100%",
          maxWidth: "600px",
          backgroundColor: "#f9f9f9",
        }}
      >
        <div style={{ marginBottom: "10px" }}>
          <label htmlFor="username" style={{ color: "#1abc9c" }}>
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>
        <div style={{ marginBottom: "10px", width: "100%" }}>
          <label htmlFor="password" style={{ color: "#1abc9c" }}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: "5px",
              borderRadius: "4px",
              border: "1px solid #ccc",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        {errorMessage && (
          <div
            style={{
              color: "red",
              fontSize: "14px",
              marginBottom: "10px",
            }}
          >
            {errorMessage}
          </div>
        )}

        <div style={{ marginTop: "20px", width: "100%" }}>
          <button
            onClick={handleLogin}
            style={{
              backgroundColor: "#1abc9c",
              color: "white",
              padding: "5px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              width: "100%",
            }}
          >
            Log In
          </button>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img
            src="/waste-management-illustration-download-in-svg-png-gif-file-formats--garbage-man-loading-to-truck-street-cleaner-worker-sustainability-pack-nature-illustrations-4487428.webp"
            style={{ width: "100%", marginTop: "5%" }}
          />
        </div>
      </div>
    </Container>
  );
}
