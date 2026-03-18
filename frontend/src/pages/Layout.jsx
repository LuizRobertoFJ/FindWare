import { useState, useEffect } from "react";
import MenuLateral from "../components/MenuLateral";
import { Menu, X } from "lucide-react";

export default function Layout({ children }) {
  const [menuAberto, setMenuAberto] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  // Detectar mudança de tamanho de tela
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMenuAberto(false); // Fechar menu ao voltar para desktop
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div style={{
      display: "flex",
      width: "100%",
      minHeight: "100vh",
      position: "relative",
    }}>
      {/* Menu Hambúrguer - Apenas Mobile */}
      {isMobile && (
        <button
          style={styles.botaoMenu}
          onClick={() => setMenuAberto(!menuAberto)}
          aria-label="Abrir menu"
        >
          {menuAberto ? <X size={24} /> : <Menu size={24} />}
        </button>
      )}

      {/* Menu Lateral - Sempre renderizado, visibilidade controlada por CSS responsivo */}
      <div style={{
        ...styles.menuWrapper,
        ...(isMobile && !menuAberto ? { transform: "translateX(-100%)" } : {})
      }}>
        <MenuLateral menuAberto={menuAberto} setMenuAberto={setMenuAberto} />
      </div>

      {/* Overlay quando menu aberto (mobile) */}
      {isMobile && menuAberto && (
        <div 
          style={styles.overlay}
          onClick={() => setMenuAberto(false)}
        />
      )}

      {/* Conteúdo Principal */}
      <main style={{
        ...styles.mainContent,
        marginLeft: isMobile ? 0 : "280px",
        paddingTop: isMobile ? "60px" : "0px",
      }}>
        {children}
      </main>
    </div>
  );
}

const styles = {
  botaoMenu: {
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
  menuWrapper: {
    transition: "transform 0.3s ease",
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
  mainContent: {
    flex: 1,
    padding: "20px 25px",
    overflow: "auto",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    transition: "all 0.3s ease",
  }
};