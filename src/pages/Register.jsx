import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import MessageBox from "../components/MessageBox";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

import "./register.css";

function Register() {
  const { register, error, loading } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess("");

    const result = await register(name, email, password);

    if (result.success) {
      setSuccess(result.message);
      setName("");
      setEmail("");
      setPassword("");
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => navigate("/login"), 2500);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="register-page">
      <div className="register-card">
        <h2 className="register-title">📝 Criar Conta</h2>

        {success && <MessageBox type="success">{success}</MessageBox>}
        {error && <MessageBox type="error">{error}</MessageBox>}

        <button
          type="button"
          className="btn-back-login"
          onClick={() => navigate("/login")}
        >
          Já tem cadastro? Fazer Login
        </button>

        <form onSubmit={handleSubmit} className="register-form">
          <label>Nome:</label>
          <input
            type="text"
            placeholder="Seu nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            required
          />

          <label>Senha:</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Sua senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />

            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
            </span>
          </div>

          <button
            type="submit"
            className="btn-submit"
            disabled={loading}
          >
            {loading ? "Criando..." : "Cadastrar"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
