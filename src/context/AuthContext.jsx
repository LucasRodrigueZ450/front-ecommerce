import React, { createContext, useState, useContext } from "react";
import { authAPI } from "../services/api";

export const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // LOGIN
  const login = async (email, password) => {
  setLoading(true);
  setError("");

  try {
    const response = await authAPI.login(email, password);
    const { user: userData, token: authToken } = response.data;

    setUser(userData);
    setToken(authToken);

    // 🔥 SALVANDO NO LOCALSTORAGE
    localStorage.setItem("token", authToken);
    localStorage.setItem("userId", userData.id);  // <-- ESSENCIAL
    localStorage.setItem("userName", userData.name);
    localStorage.setItem("userEmail", userData.email);

    return { success: true };
  } catch (err) {
    const message = err.response?.data?.error || "Erro ao fazer login";
    setError(message);
    return { success: false, error: message };
  } finally {
    setLoading(false);
  }
};

  // REGISTRO (SEM LOGIN AUTOMÁTICO)
  const register = async (name, email, password) => {
    setLoading(true);
    setError("");

    try {
      const response = await authAPI.register(name, email, password);

      // backend envia message, token, user — MAS NÃO vamos logar aqui
      return {
        success: true,
        message: response.data.message
      };

    } catch (err) {
      const message = err.response?.data?.error || "Erro ao criar conta";
      setError(message);
      return { success: false, error: message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    setError("");
  };

  const value = {
    user,
    token,
    login,
    register,
    logout,
    error,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
