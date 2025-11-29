// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import PaymentStatus from "./pages/PaymentStatus";
import Orders from "./pages/Orders";

// 🚀 IMPORTANDO A BIBLIOTECA DE NOTIFICAÇÕES
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <>
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <Products />
              </ProtectedRoute>
            }
          />

          <Route
            path="/products/create"
            element={
              <ProtectedRoute>
                <CreateProduct />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />

          <Route
            path="/payment-status/:status"
            element={
              <ProtectedRoute>
                <PaymentStatus />
              </ProtectedRoute>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      <Footer />

      {/* 🚀 NOTIFICAÇÕES EM TODA A APLICAÇÃO */}
      <ToastContainer position="top-right" autoClose={2000} theme="colored" />
    </>
  );
}

export default App;
