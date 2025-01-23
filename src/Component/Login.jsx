import React, { useState } from "react";
import { Link } from "react-router-dom";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import axios from "axios";
import styles from "../Styles/login.module.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setUser(response.data.user);
    } catch (error) {
      setError("Login failed. Please check your credentials.");
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.heading}>Login</h1>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.inputGroup}>
          <label className={styles.label}>Email</label>
          <input
            type="email"
            value={email}
            required
            className={styles.input}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup} style={{ position: "relative" }}>
          <label className={styles.label}>Password</label>
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            className={styles.input}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </span>
        </div>

        <button type="submit" className={styles.button}>
          Login
        </button>
        <h5 className="Register">
          <center>
            Don't have an account? <Link to="/signup">Sign Up</Link> now
          </center>
        </h5>
      </form>
    </div>
  );
};

export default Login;
