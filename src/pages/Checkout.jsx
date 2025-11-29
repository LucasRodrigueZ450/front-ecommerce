import { useCart } from "../context/CartContext";
import api from "../services/api";
import { useState } from "react";
import { toast } from "react-toastify";
import "./checkout.css";

function Checkout() {
  const { cartItems, clearCart } = useCart();
  const [loading, setLoading] = useState(false);

  if (!cartItems || cartItems.length === 0) {
    return (
      <div className="checkout-empty">
        <h2>Seu carrinho está vazio</h2>
        <a href="/products" className="btn-view-products">Ver Produtos</a>
      </div>
    );
  }

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const handlePayment = async () => {
    try {
      setLoading(true);

      const response = await api.post("/payment/process", {
        items: cartItems,
        total,
      });

      toast.success("Redirecionando para o pagamento...");

      // ⚠ NÃO LIMPA O CARRINHO AQUI
      // clearCart(); // ❌ REMOVIDO

      // 🔥 Agora funciona sem erro
      window.location.href = response.data.init_point;

    } catch (err) {
      console.error(err);
      toast.error("Erro ao iniciar pagamento.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="checkout-container">
      <div className="checkout-card">
        <h2 className="checkout-title">Checkout</h2>

        <ul className="checkout-list">
          {cartItems.map((item) => (
            <li key={item._id} className="checkout-item">
              <span>
                {item.name} — <strong>{item.quantity}×</strong>
              </span>
              <span>R${item.price.toFixed(2)}</span>
            </li>
          ))}
        </ul>

        <h3 className="checkout-total">
          Total: <span>R${total.toFixed(2)}</span>
        </h3>

        <button
          className="checkout-btn"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Processando..." : "Ir para pagamento"}
        </button>
      </div>
    </div>
  );
}

export default Checkout;
