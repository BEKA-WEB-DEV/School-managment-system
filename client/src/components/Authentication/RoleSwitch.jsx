// src/components/Authentication/RoleSwitch.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { use } from "react";

const RoleSwitch = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [selectedRole, setSelectedRole] = useState("");

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = () => {
    if (!selectedRole) {
      return;
    }

    // Store the selected role in local storage or context
    localStorage.setItem("selectedRole", selectedRole);

    // Redirect to the appropriate dashboard based on the selected role
    switch (selectedRole) {
      case "student":
        navigate.push("/dashboard/student");
        break;
      case "parent":
        navigate.push("/dashboard/parent");
        break;
      case "teacher":
        navigate.push("/dashboard/teacher");
        break;
      case "registrar":
        navigate.push("/dashboard/registrar");
        break;
      case "academic":
        navigate.push("/dashboard/academic");
        break;
      case "admin":
        navigate.push("/dashboard/admin");
        break;
      default:
        console.log("Invalid role selected");
    }
  };

  const handleLogout = () => {
    logout();
    history.push("/");
  };

  return (
    <div className="role-switch-container">
      <h2>Select Your Role</h2>
      <select value={selectedRole} onChange={handleRoleChange}>
        <option value="">Select Role</option>
        <option value="student">Student</option>
        <option value="parent">Parent</option>
        <option value="teacher">Teacher</option>
        <option value="registrar">Registrar</option>
        <option value="academic">Academic Staff</option>
        <option value="admin">Admin</option>
      </select>
      <button onClick={handleSubmit}>Submit</button>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default RoleSwitch;
