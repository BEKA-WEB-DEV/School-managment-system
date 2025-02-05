// src/pages/Dashboard.jsx
import React from "react";
import { useAuth } from "../contexts/AuthContext";
import StudentDashboard from "../components/Dashboard/StudentDashboard";
import ParentDashboard from "../components/Dashboard/ParentDashboard";
import TeacherDashboard from "../components/Dashboard/TeacherDashboard";
import RegistrarDashboard from "../components/Dashboard/RegistrarDashboard";
import AcademicDashboard from "../components/Dashboard/AcademicDashboard";
import AdminDashboard from "../components/Dashboard/AdminDashboard";

const Dashboard = () => {
  const { user, selectedRole, logout } = useAuth();

  if (!user) {
    return <div>Loading...</div>;
  }

  let dashboardComponent;

  switch (selectedRole) {
    case "student":
      dashboardComponent = <StudentDashboard />;
      break;
    case "parent":
      dashboardComponent = <ParentDashboard />;
      break;
    case "teacher":
      dashboardComponent = <TeacherDashboard />;
      break;
    case "registrar":
      dashboardComponent = <RegistrarDashboard />;
      break;
    case "academic":
      dashboardComponent = <AcademicDashboard />;
      break;
    case "admin":
      dashboardComponent = <AdminDashboard />;
      break;
    default:
      dashboardComponent = <div>Invalid role selected</div>;
  }

  return (
    <div className="dashboard">
      <h2>Welcome, {user.user.type}</h2>
      {dashboardComponent}
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default Dashboard;
