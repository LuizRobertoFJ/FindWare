import { useEffect, useState } from "react";
import { Search, Edit2, Trash2 } from "lucide-react";
import Grafico from "../components/Grafico";
import MetricasCards from "../components/MetricasCards";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api/config";

export default function Dashboard() {
  const { usuario, carregando } = useAuth();
  const [produtos, setProdutos] = useState([]);
  const [produtosFiltrados, setProdutosFiltrados] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [novoFormulario, setNovoFormulario] = useState({
    nome: "",
    descricao: "",
    preco: "",
    quantidade: "",
  });
  const [mensagem, setMensagem] = useState("");

  // Injetar CSS responsivo
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      @media (max-width: 1280px) {
        [data-coluna-lateral] {
          width: 280px;
        }
      }
      @media (max-width: 1024px) {
        [data-dashboard] {
          flex-direction: column;
        }
        [data-coluna-lateral] {
          width: 100% !important;
          max-height: 300px;
        }
      }
      @media (max-width: 768px) {
        [data-dashboard] {
          flex-direction: column;
        }
        [data-coluna-lateral] {
          display: block;
          width: 100% !important;
          max-height: none;
        }
        [data-secao-grafico] {
          display: none;
        }
        [data-secao-formulario] {
          display: block;
        }
        [data-secao-produtos-estoque] {
          display: block;
        }
        [data-formulario-row] {
          flex-direction: column;
        }
        [data-titulo] {
          font-size: 16px !important;
        }
      }
    `;
    document.head.appendChild(style);
    return () => style.remove();
  }, []);

  // Buscar produtos
  useEffect(() => {
    if (!carregando) {
      fetchProdutos();
    }
  }, [carregando]);

  const fetchProdutos = async () => {
    try {
      const resposta = await fetch(`${API_URL}/produtos/`, {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const dados = await resposta.json();
      setProdutos(dados);
      setProdutosFiltrados(dados);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  // Filtrar produtos por busca
  const handleSearch = (valor) => {
    setSearchTerm(valor);
    const filtrados = produtos.filter((p) =>
      p.nome.toLowerCase().includes(valor.toLowerCase()) ||
      p.descricao?.toLowerCase().includes(valor.toLowerCase())
    );
    setProdutosFiltrados(filtrados);
  };

  // Adicionar novo produto
  const handleAdicionarProduto = async (e) => {
    e.preventDefault();
    if (!novoFormulario.nome || !novoFormulario.preco || !novoFormulario.quantidade) {
      setMensagem("Preencha os campos obrigatórios!");
      return;
    }

    try {
      const resposta = await fetch(`${API_URL}/produtos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(novoFormulario),
      });

      if (resposta.ok) {
        setMensagem("Produto adicionado com sucesso!");
        setNovoFormulario({ nome: "", descricao: "", preco: "", quantidade: "" });
        fetchProdutos();
        setTimeout(() => setMensagem(""), 3000);
      }
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      setMensagem("Erro ao adicionar produto!");
    }
  };

  // Deletar produto
  const handleDeletarProduto = async (id) => {
    if (!window.confirm("Deseja deletar este produto?")) return;

    try {
      await fetch(`${API_URL}/produtos/${id}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProdutos();
    } catch (error) {
      console.error("Erro ao deletar:", error);
    }
  };

  if (carregando) {
    return <div>Carregando...</div>;
  }

  return (
    <div style={styles.dashboardContainer} data-dashboard>
      {/* COLUNA CENTRAL - Conteúdo Principal */}
      <div style={styles.colunaCentral}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.titulo}>PAINEL DE GESTÃO DE INVENTÁRIO INTEGRADO</h1>
        </header>

        {/* Seção: Gráfico + Cards */}
        <div style={styles.secaoGraficoCards} data-secao-grafico>
          <div style={styles.graficoContainer}>
            <Grafico />
          </div>
          <div style={styles.cardsContainer}>
            <MetricasCards />
          </div>
        </div>

        {/* Seção: Adicionar Novo Produto */}
        <div style={styles.secaoFormulario} data-secao-formulario>
          <h2 style={styles.subtitulo}>ADICIONAR NOVO PRODUTO</h2>
          {mensagem && (
            <div style={{
              ...styles.mensagem,
              backgroundColor: mensagem.includes("sucesso") ? "#d1fae5" : "#fee2e2",
              color: mensagem.includes("sucesso") ? "#059669" : "#dc2626",
            }}>
              {mensagem}
            </div>
          )}
          <form onSubmit={handleAdicionarProduto} style={styles.formulario}>
            <div style={styles.formularioRow} data-formulario-row>
              <input
                type="text"
                placeholder="Produto"
                value={novoFormulario.nome}
                onChange={(e) => setNovoFormulario({ ...novoFormulario, nome: e.target.value })}
                style={styles.inputFormulario}
              />
              <input
                type="text"
                placeholder="Detalhes"
                value={novoFormulario.descricao}
                onChange={(e) => setNovoFormulario({ ...novoFormulario, descricao: e.target.value })}
                style={styles.inputFormulario}
              />
            </div>
            <div style={styles.formularioRow} data-formulario-row>
              <input
                type="number"
                placeholder="Preço"
                step="0.01"
                value={novoFormulario.preco}
                onChange={(e) => setNovoFormulario({ ...novoFormulario, preco: e.target.value })}
                style={styles.inputFormulario}
              />
              <input
                type="number"
                placeholder="Quantidade"
                value={novoFormulario.quantidade}
                onChange={(e) => setNovoFormulario({ ...novoFormulario, quantidade: e.target.value })}
                style={styles.inputFormulario}
              />
            </div>
            <button type="submit" style={styles.botaoAdicionar}>
              ADICIONAR AO INVENTÁRIO
            </button>
          </form>
        </div>
      </div>

      {/* COLUNA DIREITA - Gerenciamento e Estoque */}
      <div style={styles.colunaLateral} data-coluna-lateral data-secao-produtos-estoque>
        {/* Barra de Pesquisa */}
        <div style={styles.secaoPesquisa}>
          <div style={styles.inputPesquisa}>
            <Search size={18} style={{ color: "#9ca3af", marginRight: "8px" }} />
            <input
              type="text"
              placeholder="Pesquisar produtos em estoque..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              style={styles.inputPesquisaField}
            />
          </div>
        </div>

        {/* Lista de Produtos */}
        <div style={styles.listaProdutosContainer}>
          <h3 style={styles.subtituloLateral}>Produtos em Estoque</h3>
          {produtosFiltrados.length === 0 ? (
            <p style={styles.textVazio}>Nenhum produto encontrado</p>
          ) : (
            <div style={styles.listaProdutos}>
              {produtosFiltrados.slice(0, 5).map((produto) => (
                <div key={produto.id} style={styles.cartaoProduto}>
                  <div style={styles.imagemPlaceholder}>
                    <span style={{ fontSize: "24px" }}>📦</span>
                  </div>
                  <div style={styles.infoProduto}>
                    <h4 style={styles.nomeProduto}>{produto.nome}</h4>
                    <p style={styles.descricaoProduto}>{produto.descricao || "-"}</p>
                    <div style={styles.rodapeProduto}>
                      <span style={styles.tagPreco}>
                        R$ {parseFloat(produto.preco).toFixed(2)}
                      </span>
                      <span style={styles.quantidade}>
                        Estoque: {produto.quantidade} un.
                      </span>
                    </div>
                  </div>
                  <div style={styles.botoesProduto}>
                    <button style={styles.botaoEditar} title="Editar">
                      <Edit2 size={16} />
                    </button>
                    <button 
                      style={styles.botaoDeletar}
                      onClick={() => handleDeletarProduto(produto.id)}
                      title="Deletar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Painel de Alertas Críticos */}
        <div style={styles.panelAlertasCriticos}>
          <h3 style={styles.subtituloAlerta}>⚠️ Itens em Estoque Crítico</h3>
          <div style={styles.contentAlertasCriticos}>
            {produtosFiltrados.filter((p) => p.quantidade > 0 && p.quantidade < 5).length === 0 ? (
              <p style={styles.textAlertas}>✓ Nenhum item crítico</p>
            ) : (
              produtosFiltrados
                .filter((p) => p.quantidade > 0 && p.quantidade < 5)
                .sort((a, b) => a.quantidade - b.quantidade)
                .map((produto) => (
                  <div key={produto.id} style={styles.itemAlerta}>
                    <div style={styles.itemAlertaInfo}>
                      <span style={styles.itemAlertaNome}>{produto.nome}</span>
                      <span style={styles.itemAlertaQtd}>{produto.quantidade} un.</span>
                    </div>
                    <span style={styles.itemAlertaPreco}>
                      R$ {parseFloat(produto.preco).toFixed(2)}
                    </span>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  dashboardContainer: {
    display: "flex",
    gap: "12px",
    width: "100%",
    backgroundColor: "#f9fafb",
    overflow: "hidden",
  },

  // COLUNA CENTRAL
  colunaCentral: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflow: "hidden",
    paddingRight: "6px",
  },

  header: {
    paddingBottom: "12px",
    borderBottom: "2px solid #e5e7eb",
    marginBottom: "4px",
  },

  titulo: {
    
    fontWeight: "800",
    color: "#111827",
    margin: 0,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    fontSize: "clamp(18px, 5vw, 24px)",
  },

  secaoGraficoCards: {
    display: "flex",
    gap: "12px",
    flex: "0 0 auto",
  },

  graficoContainer: {
    flex: "1",
    minHeight: "280px",
  },

  cardsContainer: {
    flex: "1",
    minHeight: "280px",
  },

  secaoFormulario: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "12px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },

  subtitulo: {
    fontSize: "clamp(12px, 4vw, 13px)",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 10px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  mensagem: {
    padding: "10px 12px",
    borderRadius: "8px",
    fontSize: "13px",
    fontWeight: "500",
    marginBottom: "12px",
    border: "1px solid currentColor",
    opacity: 0.9,
  },

  formulario: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },

  formularioRow: {
    display: "flex",
    gap: "8px",
  },

  inputFormulario: {
    flex: 1,
    padding: "8px 10px",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    fontSize: "13px",
    fontFamily: "inherit",
    transition: "all 0.2s ease",
    backgroundColor: "#fafbfc",
  },

  botaoAdicionar: {
    padding: "10px 14px",
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 2px 8px rgba(16, 185, 129, 0.2)",
  },

  // COLUNA LATERAL
  colunaLateral: {
    width: "300px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflow: "auto",
    paddingLeft: "6px",
  },

  secaoPesquisa: {
    flex: "0 0 auto",
  },

  inputPesquisa: {
    display: "flex",
    alignItems: "center",
    padding: "10px 12px",
    backgroundColor: "#ffffff",
    border: "1px solid #e5e7eb",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },

  inputPesquisaField: {
    flex: 1,
    border: "none",
    outline: "none",
    fontSize: "13px",
    fontFamily: "inherit",
    backgroundColor: "transparent",
  },

  listaProdutosContainer: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e5e7eb",
    padding: "10px",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
    flex: 1,
    minHeight: 0,
    overflow: "auto",
    display: "flex",
    flexDirection: "column",
  },

  subtituloLateral: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 8px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },

  textVazio: {
    fontSize: "12px",
    color: "#9ca3af",
    textAlign: "center",
    padding: "20px 0",
    margin: 0,
  },

  listaProdutos: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    overflow: "auto",
  },

  cartaoProduto: {
    display: "flex",
    gap: "10px",
    padding: "10px",
    backgroundColor: "#f9fafb",
    borderRadius: "10px",
    border: "1px solid #f3f4f6",
    transition: "all 0.2s ease",
    alignItems: "flex-start",
  },

  imagemPlaceholder: {
    width: "50px",
    height: "50px",
    backgroundColor: "#f0fdf4",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },

  infoProduto: {
    flex: 1,
    minWidth: 0,
  },

  nomeProduto: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#111827",
    margin: "0 0 2px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  descricaoProduto: {
    fontSize: "11px",
    color: "#9ca3af",
    margin: "0 0 6px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },

  rodapeProduto: {
    display: "flex",
    gap: "6px",
    flexDirection: "column",
    fontSize: "11px",
  },

  tagPreco: {
    display: "inline-block",
    backgroundColor: "#d1fae5",
    color: "#059669",
    padding: "4px 8px",
    borderRadius: "6px",
    fontWeight: "700",
    width: "fit-content",
  },

  quantidade: {
    color: "#6b7280",
    fontSize: "10px",
  },

  botoesProduto: {
    display: "flex",
    gap: "6px",
    flexShrink: 0,
  },

  botaoEditar: {
    padding: "6px",
    backgroundColor: "#f0f9ff",
    border: "1px solid #bfdbfe",
    borderRadius: "6px",
    color: "#0284c7",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  botaoDeletar: {
    padding: "6px",
    backgroundColor: "#fef2f2",
    border: "1px solid #fecaca",
    borderRadius: "6px",
    color: "#dc2626",
    cursor: "pointer",
    transition: "all 0.2s ease",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  panelAlertasCriticos: {
    backgroundColor: "#fffbeb",
    borderRadius: "12px",
    border: "1px solid #fcd34d",
    padding: "10px",
    flex: "0 0 auto",
    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.05)",
  },

  subtituloAlerta: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#92400e",
    margin: "0 0 8px 0",
    textTransform: "uppercase",
    letterSpacing: "0.3px",
  },

  contentAlertasCriticos: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    maxHeight: "180px",
    overflow: "auto",
  },

  textAlertas: {
    fontSize: "12px",
    color: "#b45309",
    textAlign: "center",
    padding: "10px 0",
    margin: 0,
  },

  itemAlerta: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "8px",
    backgroundColor: "rgba(255, 255, 255, 0.6)",
    borderRadius: "6px",
    fontSize: "11px",
    borderLeft: "3px solid #f59e0b",
  },

  itemAlertaInfo: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  itemAlertaNome: {
    fontWeight: "700",
    color: "#111827",
  },

  itemAlertaQtd: {
    color: "#b45309",
    fontSize: "10px",
  },

  itemAlertaPreco: {
    color: "#059669",
    fontWeight: "700",
  },
};

// CSS responsivo global
const responsiveStyles = `
  @media (max-width: 1280px) {
    [data-coluna-lateral] {
      width: 280px;
    }
  }

  @media (max-width: 1024px) {
    [data-dashboard] {
      flex-direction: column;
    }
    
    [data-coluna-lateral] {
      width: 100% !important;
      max-height: 300px;
    }
  }

  @media (max-width: 768px) {
    [data-secao-grafico] {
      flex-direction: column;
    }
    
    [data-formulario-row] {
      flex-direction: column;
    }
  }

  @media (max-width: 480px) {
    [data-dashboard] {
      gap: 12px !important;
    }

    [style*="titulo"] {
      font-size: 18px !important;
    }
  }
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = responsiveStyles;
  if (!document.getElementById("dashboard-responsive")) {
    style.id = "dashboard-responsive";
    document.head.appendChild(style);
  }
}

