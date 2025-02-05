// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Login from "./components/Authentication/Login";
import Dashboard from "./pages/Dashboard";
import RoleSwitch from "./components/Authentication/RoleSwitch";
import NotFound from "./pages/NotFound";
import CertificationList from './components/Certifications/CertificationList'; // Import CertificationList
import CertificationDetails from './components/Certifications/CertificationDetails'; // Import CertificationDetails
import CertificationForm from './components/Certifications/CertificationForm';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/role-switch" element={<RoleSwitch />} />
          <Route path="/" exact element={<Login />} />
          <Route path="/certifications" element={<CertificationList />} />
          <Route path="/certifications/new" element={<CertificationForm onSubmit={() => {}} />} />
          <Route path="/certifications/:id" element={<CertificationDetails />} />
          <Route path="/certifications/edit/:id" element={<CertificationForm initialData={{}} onSubmit={() => {}} />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
    
  );
};

export default App;
