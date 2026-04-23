import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api/config";

export default function ListaProdutos() {
    const { usuario } = useAuth();
    const [produtos, setProdutos] = useState([]);
    const [produtosParaEditar, setProdutosParaEditar] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [hoveredSuggestion, setHoveredSuggestion] = useState(null);

    useEffect(() => {
        async function fetchProdutos() {
            try {
                const resposta = await fetch(`${API_URL}/produtos/`, {
                    headers: {
                        "Content-Type": "application/json",
                        credentials: "include",
                    },
                });
                const dados = await resposta.json();
                setProdutos(dados);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        }
        fetchProdutos();

        // Fechar sugestões ao clicar fora
        const handleClickOutside = () => {
            setShowSuggestions(false);
        };

        document.addEventListener("click", handleClickOutside);
        return () => document.removeEventListener("click", handleClickOutside);
    }, []);

    // Filtrar produtos com estoque
    const produtosComEstoque = produtos.filter(p => p.quantidade > 0);

    // Filtrar sugestões baseado no termo de busca
    const suggestions = searchTerm.trim()
        ? produtosComEstoque.filter(p => 
            p.nome.toLowerCase().includes(searchTerm.toLowerCase())
          ).slice(0, 8)
        : [];

    // Produtos exibidos (todos com estoque ou filtrados by search)
    const produtosExibidos = searchTerm.trim()
        ? produtosComEstoque.filter(p => 
            p.nome.toLowerCase().includes(searchTerm.toLowerCase())
          )
        : produtosComEstoque;

   async function handleDelete(id) {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;

    try {
        const resposta = await fetch(`${API_URL}/produtos/${id}`, {
            method: "DELETE",
            headers: {
                credentials: "include",
            },
        });

        if (resposta.ok) {
            // Filtra o estado para remover o produto da tela na hora
            setProdutos(produtos.filter(p => p.id !== id));
            alert("Produto excluído com sucesso!");
        } else {
            alert("Erro ao excluir produto.");
        }
    } catch (error) {
        console.error("Erro na requisição de delete:", error);
    }
}

async function handleSalvarEdicao(produtoEditado) {
    try {
        const resposta = await fetch(`${API_URL}/produtos/${produtoEditado.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                credentials: "include",
            },
            body: JSON.stringify({
                nome: produtoEditado.nome,
                descricao: produtoEditado.descricao,
                preco: produtoEditado.preco,
                quantidade: produtoEditado.quantidade
            }),
        });

        if (resposta.ok) {
            const data = await resposta.json();
            // Atualiza a lista na tela com os novos dados
            setProdutos(produtos.map(p => p.id === produtoEditado.id ? data.produto : p));
            setProdutosParaEditar(null); // Fecha o modal
            alert("Produto atualizado!");
        } else {
            alert("Erro ao atualizar produto.");
        }
    } catch (error) {
        console.error("Erro na requisição de update:", error);
    }
}

const handleSelectSuggestion = (nome) => {
    setSearchTerm(nome);
    setShowSuggestions(false);
};

const handleClearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
};

    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h2 style={styles.titulo}>Gerenciamento de Estoque</h2>
                <p style={styles.subtitulo}>{produtosComEstoque.length} produtos com estoque</p>
            </header>

            {/* INPUT DE PESQUISA COM AUTOCOMPLETE */}
            <div style={styles.searchContainer} onClick={(e) => e.stopPropagation()}>
                <div style={styles.searchWrapper}>
                    <input
                        type="text"
                        placeholder="Pesquisar produtos em estoque..."
                        value={searchTerm}
                        onChange={(e) => {
                            setSearchTerm(e.target.value);
                            setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        style={styles.searchInput}
                    />
                    {searchTerm && (
                        <button 
                            onClick={handleClearSearch}
                            style={styles.clearButton}
                            title="Limpar busca"
                        >
                            ×
                        </button>
                    )}
                </div>

                {/* SUGESTÕES DE AUTOCOMPLETE */}
                {showSuggestions && suggestions.length > 0 && (
                    <div style={styles.suggestionsBox}>
                        {suggestions.map((produto) => (
                            <div
                                key={produto.id}
                                onClick={() => handleSelectSuggestion(produto.nome)}
                                onMouseEnter={() => setHoveredSuggestion(produto.id)}
                                onMouseLeave={() => setHoveredSuggestion(null)}
                                style={{
                                    ...styles.suggestionItem,
                                    ...(hoveredSuggestion === produto.id ? {backgroundColor: "#F0F9FF"} : {})
                                }}
                            >
                                <div style={styles.suggestionName}>{produto.nome}</div>
                                <div style={styles.suggestionDetails}>
                                    {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)} • 
                                    <span style={{marginLeft: '5px'}}>Est: {produto.quantidade} unid.</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {showSuggestions && searchTerm && suggestions.length === 0 && (
                    <div style={{...styles.suggestionsBox, color: '#94a3b8', textAlign: 'center', padding: '15px'}}>
                        Nenhum produto encontrado com estoque
                    </div>
                )}
            </div>

            <div style={styles.grid}>
                {produtosExibidos.length > 0 ? (
                    produtosExibidos.map((produto) => (
                    <div key={produto.id} style={styles.card}>
                        <div style={styles.cardInfo}>
                            <h3 style={styles.nomeProduto}>{produto.nome}</h3>
                            <span style={styles.badgePreco}>
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(produto.preco)}
                            </span>
                            <p style={styles.descricao}>{produto.descricao || "Sem descrição disponível."}</p>
                            <div style={styles.estoqueInfo}>
                                Estoque: <strong>{produto.quantidade || 0} unid.</strong>
                            </div>
                        </div>

                        <div style={styles.cardActions}>
                            <button 
                                onClick={() => setProdutosParaEditar(produto)}
                                style={styles.btnEdit}
                            >
                                Editar
                            </button>
                            <button 
                                onClick={() => handleDelete(produto.id)}
                                style={styles.btnDel}
                            >
                                Excluir
                            </button>
                        </div>
                    </div>
                ))
                ) : (
                    <div style={styles.emptyState}>
                        <p style={styles.emptyStateText}>
                            {searchTerm ? "Nenhum produto encontrado com essa busca" : "Nenhum produto com estoque disponível"}
                        </p>
                    </div>
                )}
            </div>

            {/* MODAL DE EDIÇÃO */}
            {produtosParaEditar && (
                <div style={styles.overlay} onClick={() => setProdutosParaEditar(null)}>
                    <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <h3 style={styles.modalTitle}>Editar Produto</h3>
                        
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Nome do Produto</label>
                            <input 
                                style={styles.input}
                                value={produtosParaEditar.nome} 
                                onChange={(e) => setProdutosParaEditar({...produtosParaEditar, nome: e.target.value})} 
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Descrição</label>
                            <input 
                                style={styles.input}
                                value={produtosParaEditar.descricao || ""} 
                                onChange={(e) => setProdutosParaEditar({...produtosParaEditar, descricao: e.target.value})} 
                                placeholder="Ex: Cor, tamanho, etc..."
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Preço Unitário</label>
                            <input 
                                style={styles.input}
                                type="number"
                                value={produtosParaEditar.preco} 
                                onChange={(e) => setProdutosParaEditar({...produtosParaEditar, preco: Number(e.target.value)})} 
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Quantidade</label>
                            <input 
                                style={styles.input}
                                type="number"
                                value={produtosParaEditar.quantidade} 
                                onChange={(e) => setProdutosParaEditar({...produtosParaEditar, quantidade: Number(e.target.value)})} 
                            />
                        </div>

                        <div style={styles.modalActions}>
                            <button style={styles.btnCancel} onClick={() => setProdutosParaEditar(null)}>Cancelar</button>
                            <button 
                                style={styles.btnSave}
                                onClick={() => handleSalvarEdicao(produtosParaEditar)}
                            >
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    container: {
    },
    header: {
        marginBottom: "16px",
    },
    titulo: {
        fontSize: "clamp(18px, 5vw, 24px)",
        color: "#111827",
        margin: 0,
        fontWeight: "600",
         textTransform: "uppercase",
    },
    subtitulo: {
        color: "#6B7280",
        fontSize: "clamp(12px, 2vw, 13px)",
        fontWeight: "600",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "14px",
    },
    card: { 
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
        border: "1px solid rgba(0, 0, 0, 0.05)",
        transition: "all 0.3s ease",
    },
    cardInfo: {
        flex: 1,
    },
    nomeProduto: {
        margin: "0 0 8px 0",
        fontSize: "clamp(14px, 3vw, 16px)",
        color: "#1F2937",
        fontWeight: "700",
    },
    badgePreco: {
        display: "inline-block",
        backgroundColor: "#ECFDF5",
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
        color: "#059669",
        padding: "6px 14px",
        borderRadius: "20px",
        fontSize: "14px",
        fontWeight: "700",
        marginBottom: "12px",
        border: "1px solid rgba(16, 185, 129, 0.2)",
    },
    descricao: {
        fontSize: "13px",
        color: "#6B7280",
        lineHeight: "1.5",
        marginBottom: "12px",
        fontWeight: "500",
    },
    estoqueInfo: {
        fontSize: "13px",
        color: "#374151",
        borderTop: "1px solid #F3F4F6",
        paddingTop: "10px",
        marginBottom: "15px",
    },
    cardActions: {
        display: "flex",
        gap: "10px",
    },
    btnEdit: { 
        flex: 1,
        backgroundColor: "#F3F4F6",
        color: "#374151",
        border: "2px solid #E5E7EB",
        padding: "12px",
        cursor: "pointer",
        borderRadius: "10px",
        fontWeight: "700",
        fontSize: "13px",
        transition: "all 0.3s ease",
    },
    btnDel: { 
        backgroundColor: "#FEE2E2",
        border: "2px solid #FECACA",
        color: "#DC2626",
        padding: "12px",
        cursor: "pointer",
        borderRadius: "10px",
        fontWeight: "700",
        fontSize: "13px",
        transition: "all 0.3s ease",
    },
    overlay: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(17, 24, 39, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: "blur(4px)"
    },
    modal: {
        backgroundColor: 'white',
        padding: 'clamp(16px, 4vw, 20px)',
        borderRadius: '16px',
        width: '100%',
        maxWidth: '480px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        maxHeight: '90vh',
        overflowY: 'auto',
        margin: '0 20px'
    },
    modalTitle: {
        margin: "0 0 10px 0",
        fontSize: "18px",
        color: "#111827",
        fontWeight: "800",
    },
    inputGroup: {
        display: "flex",
        flexDirection: "column",
        gap: "5px"
    },
    label: {
        fontSize: "13px",
        fontWeight: "600",
        color: "#374151"
    },
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #D1D5DB",
        outline: "none"
    },
    modalActions: {
        display: "flex",
        gap: "10px",
        marginTop: "10px"
    },
    btnCancel: {
        flex: 1,
        padding: "10px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#F3F4F6"
    },
    btnSave: {
        flex: 2,
        padding: "10px",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        backgroundColor: "#10B981",
        color: "white",
        fontWeight: "bold"
    },
    modalInput: {
        width: "100%",
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #D1D5DB",
        outline: "none"
    },
    
    // Estilos do Search com Autocomplete
    searchContainer: {
        position: "relative",
        marginBottom: "30px",
        maxWidth: "500px",
    },
    searchWrapper: {
        position: "relative",
        display: "flex",
        alignItems: "center",
    },
    searchInput: {
        width: "100%",
        padding: "14px 40px 14px 16px",
        fontSize: "15px",
        border: "2px solid #E5E7EB",
        borderRadius: "12px",
        outline: "none",
        transition: "all 0.3s ease",
        backgroundColor: "#ffffff",
        fontFamily: "inherit",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
    },
    clearButton: {
        position: "absolute",
        right: "12px",
        background: "none",
        border: "none",
        fontSize: "18px",
        color: "#94a3b8",
        cursor: "pointer",
        padding: "4px 8px",
        transition: "color 0.2s",
    },
    suggestionsBox: {
        position: "absolute",
        top: "100%",
        left: 0,
        right: 0,
        backgroundColor: "#FFFFFF",
        border: "1px solid #E5E7EB",
        borderRadius: "8px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        maxHeight: "300px",
        overflowY: "auto",
        zIndex: 100,
        marginTop: "4px",
    },
    suggestionItem: {
        padding: "12px 16px",
        cursor: "pointer",
        borderBottom: "1px solid #F3F4F6",
        transition: "backgroundColor 0.15s",
    },
    suggestionItemHover: {
        backgroundColor: "#F0F9FF",
    },
    suggestionName: {
        fontSize: "14px",
        fontWeight: "600",
        color: "#111827",
        marginBottom: "4px",
    },
    suggestionDetails: {
        fontSize: "12px",
        color: "#6B7280",
    },
    emptyState: {
        gridColumn: "1 / -1",
        textAlign: "center",
        padding: "40px 20px",
        color: "#94a3b8",
    },
    emptyStateText: {
        fontSize: "16px",
        margin: 0,
    },

};

// CSS Responsivo Global
const responsiveListaStyles = `
@media (max-width: 768px) {
  [class*="grid"] {
    grid-template-columns: 1fr !important;
  }

  [class*="cardActions"] {
    flex-direction: column !important;
  }

  [class*="btnEdit"],
  [class*="btnDel"] {
    width: 100% !important;
  }

  [class*="modal"] {
    width: calc(100% - 40px) !important;
    margin: 20px !important;
  }

  [class*="modalTitle"] {
    font-size: 20px !important;
  }
}

@media (max-width: 480px) {
  [class*="grid"] {
    grid-template-columns: 1fr !important;
    gap: 15px !important;
  }

  [class*="card"] {
    padding: 16px !important;
  }

  [class*="nomeProduto"] {
    font-size: 16px !important;
  }
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = responsiveListaStyles;
  document.head.appendChild(style);
}