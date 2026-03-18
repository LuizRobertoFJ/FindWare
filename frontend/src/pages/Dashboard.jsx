import { useEffect, useState } from "react";

import Grafico from "../components/Grafico";
import MetricasCards from "../components/MetricasCards";
import AlertasEstoque from "../components/AlertasEstoque";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
 
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>Relatório de Inventário</h1>
        <div style={styles.linhaDecorativa}></div>
      </header>

      {/* Main Content: Gráfico + Cards */}
      <div style={styles.mainContent}>
        {/* Lado Esquerdo - Gráfico (60%) */}
        <div style={styles.graficoContainer}>
          <Grafico />
        </div>

        {/* Lado Direito - Cards (40%) */}
        <div style={styles.cardsContainer}>
          <MetricasCards />
        </div>
      </div>

      {/* Alertas - 100% de largura abaixo */}
      <div style={styles.alertasContainer}>
        <AlertasEstoque />
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    width: "100%",
    gap: "16px",
    minHeight: 0
  },
  header: {
    paddingBottom: "12px",
    borderBottom: "2px solid rgba(16, 185, 129, 0.1)"
  },
  titulo: {
    fontSize: "clamp(18px, 5vw, 24px)",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  linhaDecorativa: {
    width: "30px",
    height: "2px",
    backgroundColor: "#10b981"
  },
  mainContent: {
    display: "flex",
    flexDirection: "row",
    gap: "16px",
    flex: 1,
    minHeight: 0,
  },
  graficoContainer: {
    flex: "1",
    minHeight: 0,
    minWidth: 0,
  },
  cardsContainer: {
    flex: "1",
    minHeight: 0,
    minWidth: 0,
  },
  alertasContainer: {
    flex: "0 0 auto",
    maxHeight: "30%",
    overflow: "auto"
  }
};

// CSS Responsivo Global
const responsiveStyles = `
@media (max-width: 768px) {
  [class*="mainContent"] {
    flex-direction: column !important;
    gap: 12px !important;
  }

  [class*="graficoContainer"],
  [class*="cardsContainer"] {
    flex: 1 !important;
    min-height: 300px !important;
  }

  [class*="alertasContainer"] {
    max-height: 40% !important;
  }
}

@media (max-width: 480px) {
  [class*="container"] {
    gap: 12px !important;
  }

  [class*="titulo"] {
    font-size: 18px !important;
  }

  [class*="graficoContainer"],
  [class*="cardsContainer"] {
    min-height: 280px !important;
  }
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = responsiveStyles;
  document.head.appendChild(style);
}

