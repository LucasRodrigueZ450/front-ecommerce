import "./Cart.css";
import { useCart } from "../context/CartContext";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Cart() {
  const navigate = useNavigate();

  // Evita crash caso o contexto não retorne nada
  const {
    cartItems = [],
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart() || {};

  // Previne erro quando cartItems ainda não foi carregado
  const items = Array.isArray(cartItems) ? cartItems : [];

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-container">

        <div className="cart-header">
          <h2>
            <FaShoppingCart /> Meu Carrinho ({items.length} item
            {items.length !== 1 ? "s" : ""})
          </h2>

          {items.length > 0 && (
            <button className="btn-clean" onClick={clearCart}>
              <FaTrash /> Limpar Carrinho
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="cart-empty">
            <FaShoppingCart size={58} />
            <h3>Seu carrinho está vazio</h3>
            <button
              className="btn-primary"
              onClick={() => navigate("/products")}
            >
              Ver Produtos
            </button>
          </div>
        ) : (
          <div className="cart-content">

            <div className="cart-items-list">
              {items.map((item) => (
                <div key={item._id} className="cart-item-card">

                  <div className="cart-item-image">
                    <img src={item.image} />
                  </div>

                  <div className="cart-item-info">
                    <h3>{item.name}</h3>
                    <p>{item.category}</p>
                    <span className="cart-item-price">
                      R$ {item.price.toFixed(2)}
                    </span>
                  </div>

                  <div className="cart-item-quantity">
                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

                    <button
                      onClick={() =>
                        updateQuantity(item._id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <div className="cart-item-remove">
                    <button
                      className="remove-btn"
                      onClick={() => removeFromCart(item._id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary-box">
              <h3>Resumo do Pedido</h3>

              <div className="summary-row">
                <span>Subtotal:</span>
                <strong>R$ {subtotal.toFixed(2)}</strong>
              </div>

              <div className="summary-row">
                <span>Frete:</span>
                <span>Calcular no checkout</span>
              </div>

              <div className="summary-total">
                <span>Total estimado:</span>
                <strong>R$ {subtotal.toFixed(2)}</strong>
              </div>

              <div className="cart-summary-buttons">
                <button
                  className="btn-outline"
                  onClick={() => navigate("/products")}
                >
                  Continuar Comprando
                </button>

                <button
                  className="btn-primary"
                  onClick={() => navigate("/checkout")}
                >
                  Finalizar Compra
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
