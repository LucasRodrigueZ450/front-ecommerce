import React from "react";
import { useLocation } from "react-router-dom";

function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();

  // Agora detecta login e registro
  const isAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <footer className={`main-footer ${isAuthPage ? "footer-login" : ""}`}>
      <div className="footer-container">

        {/* Oculta conteúdo completo em páginas de autenticação */}
        {!isAuthPage && (
          <div className="footer-grid">

            <div className="footer-col">
              <h3 className="footer-title">
                <span className="footer-icon">🛒</span> Loja UNIFOR
              </h3>
              <p className="footer-text">Sistema de E-commerce Integrado</p>
            </div>

            <div className="footer-col">
              <h4 className="footer-subtitle">Projeto Acadêmico</h4>
              <p className="footer-text">Integração de Sistemas</p>
              <p className="footer-text">
                <strong>Universidade de Fortaleza - UNIFOR</strong>
              </p>
            </div>

            <div className="footer-col">
              <h4 className="footer-subtitle">Tecnologias</h4>
              <div className="footer-tags">
                <span>React + Vite</span>
                <span>Node.js</span>
                <span>MongoDB</span>
              </div>
            </div>

          </div>
        )}

        <div className="footer-bottom">
          <p className="footer-copy">
            © {currentYear} Projeto de Integração de Sistemas - UNIFOR.  
            Todos os direitos reservados.
          </p>
          <p className="footer-small">Desenvolvido para fins educacionais</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
