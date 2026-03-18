import Chart from "react-apexcharts";
import { useEffect, useState } from "react";
import { API_URL } from "../api/config";

export default function Grafico() {
  const [opcao, setOpcao] = useState(0);
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`${API_URL}/produtos/relatorio`, {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${localStorage.getItem("token")}`
          }
        });
        const data = await response.json();
        
        setOpcao(data.total_geral || 0);
        setLabels(data.labels || []);
        setSeries(data.series || []);
        setCarregando(false);
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setCarregando(false);
      }
    }
    fetchData();
  }, []);

  const options = {
    chart: { 
        type: "donut",
        fontFamily: 'Inter, -apple-system, sans-serif'
    },
    labels: labels,
    // Cores em tons verdes profissionais
    colors: ["#10b981", "#059669", "#34d399", "#6ee7b7", "#a7f3d0", "#d1fae5"],
    stroke: { width: 2, colors: ['#ffffff'] },
    legend: {
      position: 'bottom',
      fontSize: '13px',
      fontWeight: 400,
      labels: { colors: '#64748b' },
      markers: { radius: 2 }
    },
    dataLabels: { enabled: false },
    plotOptions: {
      pie: {
        donut: {
          size: '80%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'VALOR TOTAL',
              fontSize: '12px',
              fontWeight: 600,
              color: '#94a3b8',
              formatter: () => `R$ ${opcao.toLocaleString('pt-BR')}`
            }
          }
        }
      }
    }
  };

  if (carregando) {
    return (
        <div style={styles.loadingContainer}>
            <p style={{ fontSize: '14px', letterSpacing: '1px' }}>PROCESSANDO DADOS...</p>
        </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.chartWrapper}>
        <div style={styles.chartHeader}>
            <h3 style={styles.chartTitle}>Distribuição Financeira</h3>
        </div>
        <div style={{ padding: '16px 20px', flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 0 }}>
            <Chart options={options} series={series} type="donut" width="100%" height={280} />
        </div>
      </div>

      <div style={styles.footerInfo}>
        {labels.length > 0 ? `${labels.slice(0, 3).join(" | ")}${labels.length > 3 ? "..." : ""}` : ""}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    flex: 1,
    minHeight: 0
  },
  chartWrapper: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
    flex: 1,
    display: "flex",
    flexDirection: "column",
    minHeight: 0,
    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)"
  },
  chartHeader: {
    padding: '16px 20px',
    borderBottom: '1px solid #f1f5f9',
    flexShrink: 0
  },
  chartTitle: { 
    fontSize: "15px", 
    fontWeight: 700, 
    color: "#111827", 
    margin: 0, 
    textTransform: 'uppercase',
    letterSpacing: "0.5px"
  },
  footerInfo: {
    marginTop: "8px",
    fontSize: "10px",
    color: "#94a3b8",
    textAlign: 'center',
    letterSpacing: '0.5px'
  },
  loadingContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#94a3b8'
  }
};