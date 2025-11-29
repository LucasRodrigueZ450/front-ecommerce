import React from 'react';
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'white' 
      }}>
        <div className="loading">Carregando...</div>
      </div>
    );
  }

  if (!user) {
    // Redirecionar para login mantendo a URL de origem
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && user.role !== 'admin') {
    return (
      <div style={{ 
        textAlign: 'center', 
        padding: '40px',
        color: 'white'
      }}>
        <h2>⚠️ Acesso Negado</h2>
        <p>Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;