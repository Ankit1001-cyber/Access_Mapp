import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import styles from "../Styles/navbar.module.css";
import logo from "./map.jpg";

const Navbar = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("/api/profile", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data);
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        });
    }
  }, []);

  return (
    <nav className={styles.navbar}>
      <div>
        <h2 className={styles.logoButton} title="About us">
          <Link to="/about" title="about us">
            <img src={logo} alt="Access Map Logo" className={styles.avatar} />{" "}
          </Link>
          Access Map
        </h2>
      </div>

      <ul className={styles.navLinks}>
        <li>
          <div className={styles.profile}>
            {user ? (
              <Link to="/profile" title="Profile" aria-label="User Profile">
                <img
                  src={`https://www.gravatar.com/avatar/${md5(
                    user.email
                  )}?d=identicon`}
                  alt="User Avatar"
                  className={styles.avatar}
                  onError={(e) => (e.target.src = "/default-avatar.png")}
                />
              </Link> 
            ) : (
              <img
                src="/default-avatar.png"
                alt="Default Avatar"
                className={styles.avatar}
              />
            )}
            <span className={styles.name}>{user ? user.name : "Guest"}</span>
          </div>
        </li>
        <li>
          <Link to="/home" title="Home" aria-label="Home">
            Home
          </Link>
        </li>
        <li>
          <Link to="/map" title="Map" aria-label="Map">
            Map
          </Link>
        </li>
        <li>
          <Link to="/report" title="Report" aria-label="Report">
            Report
          </Link>
        </li>
      </ul>

      <div className={styles.rightSection}>
        {!user ? (
          <Link to="/login" className={styles.loginButton} title="Login">
            Login
          </Link>
        ) : (
          <button
            type="button"
            className={styles.logOutButton}
            title="Logout"
            onClick={() => {
              localStorage.removeItem("token");
              setUser(null);
            }}
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
