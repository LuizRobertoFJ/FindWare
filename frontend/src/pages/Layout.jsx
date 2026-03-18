import { useState } from "react";
import MenuLateral from "../components/MenuLateral";
import { Menu, X } from "lucide-react";

export default function Layout({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);

  return (
    <div style={{ display: "flex", width: "100%", height: "100vh", position: "relative" }}>
      {/* Menu Hambúrguer - Apenas Mobile */}
      <button
        style={styles.botaoMenu}
        onClick={() => setMenuAberto(!menuAberto)}
        aria-label="Abrir menu"
      >
        {menuAberto ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Menu Lateral */}
      <MenuLateral menuAberto={menuAberto} setMenuAberto={setMenuAberto} />

      {/* Overlay quando menu aberto (mobile) */}
      {menuAberto && (
        <div 
          style={styles.overlay}
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Conteúdo Principal */}
      <main style={{
        marginLeft: menuAberto ? 0 : "280px",
        flex: 1,
        padding: "20px 25px",
        overflow: "auto",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        transition: "margin-left 0.3s ease",
        "@media (max-width: 768px)": {
          marginLeft: 0,
          padding: "15px",
        }
      }} className="responsive-main">
        {children}
      </main>
    </div>
  );
}

const styles = {
  botaoMenu: {
    display: "none",
    position: "fixed",
    top: "15px",
    left: "15px",
    zIndex: 1001,
    background: "#10b981",
    border: "none",
    color: "white",
    padding: "8px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "20px",
    transition: "all 0.3s ease",
  },
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    zIndex: 999,
  },
};

// Adicionar media query via CSS global
const mediaQueryStyle = `
@media (max-width: 768px) {
  [style*="botaoMenu"] {
    display: block !important;
  }
  
  .responsive-main {
    margin-left: 0 !important;
    padding: 60px 15px 15px !important;
  }
}
`;

// Injetar styles globais
if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = mediaQueryStyle;
  document.head.appendChild(style);
}