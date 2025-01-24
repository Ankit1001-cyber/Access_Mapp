import React, { useState } from "react";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../Styles/signup.module.css";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [dob, setDob] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    if (!dob) {
      alert("Please enter your Date of Birth.");
      return;
    }

    const userData = { name, email, dob, password };

    try {
      const response = await axios.post("/api/signup", userData);
      alert("Sign-Up successful!");
      navigate("/login"); 
    } catch (error) {
      setError("Sign-up failed. Please try again.");
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSignUp}>
        <h2 className={styles.heading}>Sign Up</h2>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.inputGroup}>
          <label htmlFor="fullName" className={styles.label}>
            Full Name
          </label>
          <input
            id="fullName"
            type="text"
            placeholder="Enter your full name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="dob" className={styles.label}>
            Date of Birth
          </label>
          <input
            id="dob"
            type="date"
            placeholder="Enter your date of birth"
            required
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="email" className={styles.label}>
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>

        <div className={styles.inputGroup} style={{ position: "relative" }}>
          <label htmlFor="password" className={styles.label}>
            Password
          </label>
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </span>
        </div>

        <div className={styles.inputGroup} style={{ position: "relative" }}>
          <label htmlFor="confirmPassword" className={styles.label}>
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            placeholder="Confirm your password"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className={styles.input}
          />
          <span
            className={styles.eyeIcon}
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
          </span>
        </div>

        <button type="submit" className={styles.button}>
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;
