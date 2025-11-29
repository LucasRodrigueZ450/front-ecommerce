import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import MessageBox from "../components/MessageBox";
import Loader from "../components/Loader";
import api from "../services/api";

import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaShoppingCart,
  FaBox
} from "react-icons/fa";

function PaymentStatus() {
  const { status } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { clearCart } = useCart();

  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState(null);

  // pega o orderId enviado pelo MercadoPago
  const orderId = new URLSearchParams(location.search).get("orderId");

  useEffect(() => {
    if (!orderId) return;

    let interval;

    const checkOrderStatus = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);

        setOrder(data);

        // se o backend atualizar para approved → redireciona
        if (data.status === "approved") {
          clearCart();

          setTimeout(() => {
            navigate("/products");
          }, 2000);
        }
      } catch (error) {
        console.log("Erro ao buscar pedido:", error);
      } finally {
        setLoading(false);
      }
    };

    // primeira verificação
    checkOrderStatus();

    // checar a cada 3,5s
    interval = setInterval(checkOrderStatus, 3500);

    return () => clearInterval(interval);

  }, [orderId, navigate, clearCart]);


  const getStatusInfo = () => {
    if (!order) return {};

    const map = {
      approved: {
        title: "Pagamento Aprovado!",
        color: "#2ecc71",
        icon: <FaCheckCircle />,
        message: "Seu pagamento foi aprovado! Redirecionando..."
      },
      pending: {
        title: "Pagamento Pendente",
        color: "#f1c40f",
        icon: <FaClock />,
        message: "Estamos aguardando a confirmação do Mercado Pago."
      },
      rejected: {
        title: "Pagamento Recusado",
        color: "#e74c3c",
        icon: <FaTimesCircle />,
        message: "O pagamento não foi aprovado."
      }
    };

    return map[order.status] || map.pending;
  };

  const info = getStatusInfo();

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-container" style={{ textAlign: "center" }}>
          <Loader size="large" />
          <h2>Verificando pagamento...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="form-container" style={{ maxWidth: "600px", textAlign: "center" }}>

          {/* Ícone */}
          <div style={{ fontSize: "80px", marginBottom: "20px", color: info.color }}>
            {info.icon}
          </div>

          {/* Título */}
          <h2 style={{ marginBottom: "10px", color: info.color }}>
            {info.title}
          </h2>

          {/* Mensagem */}
          <MessageBox type="info">{info.message}</MessageBox>

          {/* Detalhes do pedido */}
          {order && (
            <div style={{
              background: "#f8f9fa",
              padding: "20px",
              textAlign: "left",
              marginTop: "20px",
              borderRadius: "10px"
            }}>
              <h4 style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FaBox /> Detalhes do Pedido
              </h4>

              <p><strong>ID:</strong> {order._id}</p>
              <p><strong>Total:</strong> R$ {order.total?.toFixed(2)}</p>
              <p><strong>Status:</strong> {order.status}</p>
            </div>
          )}

          {/* Botões */}
          <div style={{ marginTop: "25px", display: "grid", gap: "12px" }}>
            <button className="btn btn-primary" onClick={() => navigate("/products")}>
              <FaShoppingCart style={{ marginRight: "8px" }} /> Continuar comprando
            </button>

            <button className="btn btn-outline" onClick={() => navigate("/orders")}>
              Ver meus pedidos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PaymentStatus;
