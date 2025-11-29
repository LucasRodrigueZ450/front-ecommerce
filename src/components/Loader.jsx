import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faShoppingCart } from "@fortawesome/free-solid-svg-icons";

function Header() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const location = useLocation();
  const navigate = useNavigate();

  const hideMenu =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <header className="main-header">
      <div className="container">
        <div className="header-content">
          <h1>🛒 Loja UNIFOR</h1>
          <p>Sistema de E-commerce Integrado</p>
        </div>

        {!hideMenu && (
          <nav className="main-nav">

            {/* HOME */}
            <Link to="/products" className="nav-btn">
              🏠 Produtos
            </Link>

            {/* ÍCONE DO CARRINHO */}
            {user && (
              <div 
                className="nav-btn"
                style={{ position: "relative" }}
                onClick={() => navigate("/cart")}
              >
                <FontAwesomeIcon icon={faShoppingCart} size="lg" />

                {totalItems > 0 && (
                  <span
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      background: "#e74c3c",
                      color: "#fff",
                      fontSize: "12px",
                      padding: "3px 7px",
                      borderRadius: "50%",
                      fontWeight: "bold"
                    }}
                  >
                    {totalItems}
                  </span>
                )}
              </div>
            )}

            {user && (
              <>
                <Link to="/products/create" className="nav-btn">
                  ➕ Criar Produto
                </Link>

                <button className="nav-btn" onClick={logout}>
                  🚪 Sair
                </button>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}

export default Header;
