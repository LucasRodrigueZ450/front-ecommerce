import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaLock, FaUser, FaEye, FaEyeSlash } from "react-icons/fa";
import MessageBox from "../components/MessageBox";
import "./Login.css";

function Login() {
  const { login, user, loading, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const [showPassword, setShowPassword] = useState(false);
  const [localError, setLocalError] = useState("");

  useEffect(() => {
    if (user) {
      const from = location.state?.from?.pathname || "/products";
      navigate(from, { replace: true });
    }
  }, [user, navigate, location]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (localError) setLocalError("");
  };

  const validateForm = () => {
    if (!formData.email.trim()) return "Email é obrigatório";
    if (!formData.password) return "Senha é obrigatória";
    if (!/\S+@\S+\.\S+/.test(formData.email)) return "Email inválido";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setLocalError(validationError);
      return;
    }

    const success = await login(formData.email, formData.password);

    if (success) {
      const from = location.state?.from?.pathname || "/products";
      navigate(from, { replace: true });
    }
  };

  const handleDemoLogin = (type) => {
    const demoAccounts = {
      admin: { email: "admin@unifor.com", password: "123456" },
      user: { email: "user@unifor.com", password: "123456" }
    };
    setFormData(demoAccounts[type]);
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">

          <div className="login-header">
            <FaLock className="login-icon" />
            <h2>Bem-vindo de volta!</h2>
            <p>Faça login na sua conta</p>
          </div>

          {(error || localError) && (
            <MessageBox type="error" className="login-error-box">
              {localError || error}
            </MessageBox>
          )}

          <div className="demo-buttons">
            <p>Contas de demonstração:</p>
            <div className="demo-row">
              <button
                type="button"
                className="btn btn-outline demo-btn"
                onClick={() => handleDemoLogin("admin")}
                disabled={loading}
              >
                Admin
              </button>

              <button
                type="button"
                className="btn btn-outline demo-btn"
                onClick={() => handleDemoLogin("user")}
                disabled={loading}
              >
                Usuário
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>
                <FaUser size={14} /> Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Senha</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  placeholder="Sua senha"
                  required
                  disabled={loading}
                />
                <span
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </div>

            <button className="btn btn-primary login-submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="loading-spinner"></div>
                  Entrando...
                </>
              ) : (
                "Entrar"
              )}
            </button>
          </form>

          <div className="login-footer">
            <p>
              Não tem uma conta?{" "}
              <Link to="/register" className="register-link">
                Cadastre-se aqui
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;
