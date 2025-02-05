// src/components/Authentication/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/authService"; // Importing the default export
import styles from "./Login.module.css";

const Login = () => {
  const [userType, setUserType] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authService.login(userType, identifier, password);
      localStorage.setItem("token", response.accessToken);
      navigate.push("/role-switch");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.form}>
          <div className={styles.title}>Login</div>
          <form onSubmit={handleSubmit}>
            <div className={styles.input_boxes}>
              {/* <i className="fas fa-users"></i> */}
              <select
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="">Select User Type</option>
                <option value="student">Student</option>
                <option value="employee">Employee</option>
                <option value="admin">Admin</option>
                <option value="parent">Parent</option>
              </select>
            </div>
            {/* User ID input with a lock icon (change to fa-user if desired) */}
            <div className={styles.input_box}>
              <i className="fas fa-user"></i>
              <input
                type="text"
                placeholder="User ID"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
            {/* Password input with a lock icon */}
            <div className={styles.input_box}>
              <i className="fas fa-lock"></i>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            {/* Display error message */}
            {error && <p className={styles.error}>{error}</p>}
            <div className={styles.text}>
              <a href="#">Forgot password?</a>
            </div>
            <div className={`${styles.button} ${styles.input_box}`}>
              <input type="submit" value="Login" />
            </div>
          </form>
        </div>

        <div className={styles.cover}>
          <div className={styles.image}>
            <div className={styles.text}>
              <span className={styles.text_1}>
                Every new friend is a <br /> new adventure
              </span>
              <span className={styles.text_2}>Let's get connected</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
