import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

import {
  FaBox,
  FaShoppingCart,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaTruck
} from "react-icons/fa";

import MessageBox from "../components/MessageBox";
import Loader from "../components/Loader";

import "./Orders.css";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOrders() {
      try {
        const response = await api.get("/orders/my");
        setOrders(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
        setError("Erro ao carregar pedidos. Tente novamente.");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusConfig = (status) => {
    const configs = {
      approved: {
        color: "#28a745",
        icon: <FaCheckCircle />,
        text: "Aprovado",
        description: "Seu pagamento foi aprovado e o pedido está sendo processado."
      },
      pending: {
        color: "#ffc107",
        icon: <FaClock />,
        text: "Pendente",
        description: "Aguardando confirmação do pagamento."
      },
      rejected: {
        color: "#dc3545",
        icon: <FaTimesCircle />,
        text: "Recusado",
        description: "Pagamento recusado. Tente novamente ou entre em contato."
      },
      delivered: {
        color: "#17a2b8",
        icon: <FaTruck />,
        text: "Entregue",
        description: "Pedido entregue com sucesso!"
      },
      shipping: {
        color: "#6f42c1",
        icon: <FaTruck />,
        text: "Em Transporte",
        description: "Seu pedido está a caminho."
      }
    };

    return configs[status] || {
      color: "#6c757d",
      icon: <FaBox />,
      text: status,
      description: "Status do pedido."
    };
  };

  /* ==========================
     LOADING
  =========================== */
  if (loading) {
    return (
      <div className="orders-page">
        <div style={{ textAlign: "center" }}>
          <Loader size="large" />
          <h3>Carregando seus pedidos...</h3>
        </div>
      </div>
    );
  }

  /* ==========================
     ERRO AO CARREGAR
  =========================== */
  if (error) {
    return (
      <div className="orders-page">
        <MessageBox type="error">{error}</MessageBox>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Tentar Novamente
        </button>
      </div>
    );
  }

  /* ==========================
     SEM PEDIDOS
  =========================== */
  if (orders.length === 0) {
    return (
      <div className="orders-page" style={{ textAlign: "center" }}>
        <div style={{ fontSize: "70px", color: "#fff", opacity: 0.7, marginBottom: "20px" }}>
          <FaBox />
        </div>

        <h2 style={{ color: "#fff" }}>Nenhum pedido encontrado</h2>

        <p style={{ color: "#e6e6e6", marginBottom: "20px" }}>
          Você ainda não fez nenhum pedido. Que tal explorar alguns produtos?
        </p>

        <button
          className="btn btn-primary"
          onClick={() => navigate("/products")}
        >
          <FaShoppingCart style={{ marginRight: "8px" }} />
          Ver Produtos
        </button>
      </div>
    );
  }

  /* ==========================
     LISTA DE PEDIDOS
  =========================== */
  return (
    <div className="orders-page">
      
      {/* Cabeçalho */}
      <div className="orders-title">
        <h2>
          <FaBox /> Meus Pedidos
        </h2>

        <span>
          {orders.length} {orders.length === 1 ? "pedido" : "pedidos"}
        </span>
      </div>

      {/* Lista */}
      <div className="orders-list">
        {orders.map((order) => {
          const status = getStatusConfig(order.status);

          return (
            <div key={order._id} className="order-card">

              {/* HEADER DO CARD */}
              <div className="order-header">
                <div>
                  <h3>Pedido #{order._id.slice(-8).toUpperCase()}</h3>
                  <div className="order-meta">
                    Realizado em {formatDate(order.createdAt)}
                  </div>
                </div>

                <div
                  className="order-status"
                  style={{ color: status.color }}
                >
                  <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    {status.icon}
                    {status.text}
                  </span>
                </div>
              </div>

              {/* DETALHES DO PEDIDO */}
              <div className="order-details">
                
                <div className="order-totals">
                  <div className="detail-row">
                    <span>Total do Pedido:</span>
                    <strong>R$ {order.total.toFixed(2)}</strong>
                  </div>

                  {order.paymentId && (
                    <div className="detail-row">
                      <span>ID do Pagamento:</span>
                      <span className="payment-id">{order.paymentId}</span>
                    </div>
                  )}
                </div>

                <div className="order-items">
                  <h4>Itens do Pedido:</h4>

                  <div className="items-grid">
                    {order.items.map((item, index) => (
                      <div key={index} className="order-item">
                        <div className="item-info">
                          <span className="item-name">{item.name}</span>
                          <span className="item-quantity">Qtd: {item.quantity}</span>
                        </div>

                        <span className="item-price">
                          R$ {(item.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="order-footer">
                <div className="status-description">{status.description}</div>
              </div>

            </div>
          );
        })}
      </div>

      {/* CONTINUAR COMPRANDO */}
      <div className="orders-footer">
        <button
          className="btn btn-outline"
          onClick={() => navigate("/products")}
        >
          <FaShoppingCart style={{ marginRight: "8px" }} />
          Continuar Comprando
        </button>
      </div>
    </div>
  );
}

export default Orders;
