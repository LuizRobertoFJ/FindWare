import { useEffect, useState } from "react";
import { API_URL } from "../api/config";

export default function AlertasEstoque() {
  const [produtosCriticos, setProdutosCriticos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const LIMITE_CRITICO = 5; // Limite para considerar estoque crítico

  useEffect(() => {
    async function fetchProdutos() {
      try {
        const resposta = await fetch(`${API_URL}/produtos/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const dados = await resposta.json();
        
        // Filtrar produtos com estoque abaixo do limite crítico
        const criticos = dados
          .filter(p => p.quantidade > 0 && p.quantidade < LIMITE_CRITICO)
          .sort((a, b) => a.quantidade - b.quantidade); // Ordena por quantidade ascendente
        
        setProdutosCriticos(criticos);
        setCarregando(false);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
        setCarregando(false);
      }
    }
    
    fetchProdutos();
  }, []);

  if (carregando) {
    return (
      <div style={styles.container}>
        <p style={{ color: "#94a3b8" }}>Carregando alertas...</p>
      </div>
    );
  }

  if (produtosCriticos.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>✓</div>
          <h3 style={styles.emptyTitle}>Todos os estoques normais</h3>
          <p style={styles.emptyText}>Nenhum produto com estoque crítico</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.headerTitle}>
          <h2 style={styles.titulo}>Alertas de Estoque Crítico</h2>
        </div>
        <span style={styles.badge}>{produtosCriticos.length} item(ns)</span>
      </div>

      <div style={styles.alertsContainer}>
        {produtosCriticos.map((produto, index) => (
          <div key={produto.id} style={styles.alertCard}>
            <div style={styles.cardLeft}>
              <div style={styles.numberBadge}>{index + 1}</div>
              <div style={styles.productInfo}>
                <h3 style={styles.productName}>{produto.nome}</h3>
                <p style={styles.productDesc}>{produto.descricao || "Sem descrição"}</p>
              </div>
            </div>

            <div style={styles.cardRight}>
              <div style={styles.quantityContainer}>
                <span style={styles.quantityLabel}>Quantidade:</span>
                <div style={{
                  ...styles.quantityBadge,
                  backgroundColor: produto.quantidade === 0 ? "#FEE2E2" : "#FEF3C7",
                  color: produto.quantidade === 0 ? "#DC2626" : "#B45309"
                }}>
                  {produto.quantidade} unid.
                </div>
              </div>
              <div style={styles.priceContainer}>
                <span style={styles.priceLabel}>Preço:</span>
                <span style={styles.priceValue}>
                  {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={styles.footer}>
        <p style={styles.footerText}>
          Recomendamos revisar o estoque desses produtos em breve.
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
    padding: "0px",
    marginBottom: "0px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
    maxHeight: "35%",
    minHeight: "160px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "14px 18px",
    borderBottom: "2px solid rgba(16, 185, 129, 0.1)",
    flexShrink: 0
  },
  headerTitle: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
  },
  alertIcon: {
    fontSize: "16px",
    color: "#B45309",
    display: "none"
  },
  titulo: {
    fontSize: "15px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  badge: {
    display: "inline-block",
    backgroundColor: "#FEF3C7",
    color: "#B45309",
    padding: "6px 12px",
    borderRadius: "20px",
    fontSize: "13px",
    fontWeight: "700",
  },
  alertsContainer: {
    padding: "0px",
    overflowY: "auto",
    flex: 1
  },
  alertCard: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "12px 18px",
    borderBottom: "1px solid #f1f5f9",
    transition: "all 0.3s ease",
    backgroundColor: "rgba(254, 243, 199, 0.1)",
    fontSize: "13px",
    "&:last-child": {
      borderBottom: "none",
    },
  },
  cardLeft: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flex: 1,
  },
  numberBadge: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "28px",
    height: "28px",
    backgroundColor: "#FEF3C7",
    color: "#B45309",
    borderRadius: "50%",
    fontWeight: "700",
    fontSize: "12px",
    flexShrink: 0
  },
  productInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  productName: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#111827",
    margin: 0,
  },
  productDesc: {
    fontSize: "11px",
    color: "#6b7280",
    margin: 0,
  },
  cardRight: {
    display: "flex",
    gap: "16px",
    alignItems: "center",
  },
  quantityContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "flex-end",
  },
  quantityLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  quantityBadge: {
    padding: "8px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    fontWeight: "700",
  },
  priceContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    alignItems: "flex-end",
  },
  priceLabel: {
    fontSize: "12px",
    color: "#6b7280",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  priceValue: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#059669",
  },
  emptyState: {
    textAlign: "center",
    padding: "30px 20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  emptyIcon: {
    fontSize: "48px",
    display: "none",
    marginBottom: "16px",
  },
  emptyTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px 0",
  },
  emptyText: {
    fontSize: "14px",
    color: "#6b7280",
    margin: 0,
  },
  footer: {
    padding: "10px 18px",
    backgroundColor: "rgba(16, 185, 129, 0.05)",
    borderTop: "1px solid rgba(16, 185, 129, 0.1)",
    borderRadius: "0 0 12px 12px",
    flexShrink: 0
  },
  footerText: {
    fontSize: "11px",
    color: "#059669",
    margin: 0,
    fontWeight: "500",
  },
};
