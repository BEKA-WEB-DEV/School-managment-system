import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState(
    localStorage.getItem("selectedRole") || ""
  );

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setUser({ token: storedToken });
    }
    setLoading(false);
  }, []);

  const login = (user) => {
    setUser(user);
    localStorage.setItem("token", user.accessToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("selectedRole");
    setSelectedRole("");
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, logout, selectedRole, setSelectedRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
