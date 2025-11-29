import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaShoppingCart, FaBoxOpen, FaListUl } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";

import "./Header.css";

function Header() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path ? "nav-btn active" : "nav-btn";

  return (
    <header className="main-header">
      <div className="header-content">
        <h1>Loja UNIFOR</h1>
        <p>Sistema de E-commerce Integrado</p>
      </div>

      {/* 🔵 NAV SUPERIOR */}
      <nav className="main-nav">
        <Link className={isActive("/products")} to="/products">
          <FaBoxOpen /> Produtos
        </Link>

        <Link className={isActive("/orders")} to="/orders">
          <FaListUl /> Meus Pedidos
        </Link>

        <Link className={isActive("/cart")} to="/cart">
          <FaShoppingCart /> Carrinho
        </Link>

        <button className="logout-btn" onClick={logout}>
          Sair
        </button>
      </nav>

      {/* 👤 E-MAIL DO USUÁRIO */}
      {user && (
        <div className="user-label">
          Olá, {user.email}
        </div>
      )}
    </header>
  );
}

export default Header;
