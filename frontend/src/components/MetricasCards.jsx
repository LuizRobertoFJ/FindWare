import { useEffect, useState } from "react";
import { API_URL } from "../api/config";

export default function MetricasCards() {
  const [opcao, setOpcao] = useState(0);
  const [labels, setLabels] = useState([]);
  const [produtosCriticos, setProdutosCriticos] = useState(0);
  const [ticketMedio, setTicketMedio] = useState(0);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const responseProdutos = await fetch(`${API_URL}/produtos/`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const produtos = await responseProdutos.json();
        
        const criticos = produtos.filter(p => p.quantidade < 5 && p.quantidade > 0).length;
        setProdutosCriticos(criticos);

        const response = await fetch(`${API_URL}/produtos/relatorio`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        
        setOpcao(data.total_geral || 0);
        setLabels(data.labels || []);
        
        // Calcular ticket médio
        if (data.labels.length > 0) {
          setTicketMedio(data.total_geral / data.labels.length);
        }
        
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setCarregando(false);
      }
    }
    fetchData();
  }, []);

  if (carregando) {
    return (
      <div style={styles.container}>
        <p style={{ color: "#94a3b8" }}>Carregando...</p>
      </div>
    );
  }

  const metricas = [
    {
      titulo: "Patrimônio em Estoque",
      valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(opcao),
      cor: "#3b82f6"
    },
    {
      titulo: "Itens Cadastrados",
      valor: labels.length,
      subtitulo: "Unidades",
      cor: "#10b981"
    },
    {
      titulo: "Estoque Crítico",
      valor: produtosCriticos,
      cor: "#f97316"
    },
    {
      titulo: "Ticket Médio",
      valor: new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(ticketMedio),
      cor: "#8b5cf6"
    }
  ];

  return (
    <div style={styles.container}>
      {metricas.map((metrica, index) => (
        <div key={index} style={{...styles.card, borderLeftColor: metrica.cor}}>
          <div style={styles.cardHeader}>
            <h3 style={styles.titulo}>{metrica.titulo}</h3>
          </div>
          <div style={styles.cardBody}>
            <p style={styles.valor}>{metrica.valor}</p>
            {metrica.subtitulo && <span style={styles.subtitulo}>{metrica.subtitulo}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    flex: 1,
    minWidth: "0"
  },
  card: {
    backgroundColor: "#ffffff",
    border: "1px solid #f1f5f9",
    borderLeft: "4px solid #3b82f6",
    borderRadius: "12px",
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
    transition: "all 0.3s ease"
  },
  cardHeader: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flex: 1
  },
  titulo: {
    fontSize: "14px",
    fontWeight: "600",
    color: "#374151",
    margin: 0,
    whiteSpace: "wrap"
  },
  cardBody: {
    textAlign: "right",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "2px"
  },
  valor: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#111827",
    margin: 0
  },
  subtitulo: {
    fontSize: "10px",
    color: "#9ca3af",
    fontWeight: "500"
  }
};
