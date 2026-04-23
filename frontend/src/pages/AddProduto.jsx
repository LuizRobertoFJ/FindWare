import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { API_URL } from "../api/config";

export default function AddProduto() {
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  const { usuario } = useAuth();

  async function handleAdd(e) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(`${API_URL}/produtos/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          credentials: "include",
        },
        body: JSON.stringify({
          nome,
          descricao,
          preco,
          quantidade,
          usuarioId: usuario.id,
        }),
      });

      if (resposta.ok) {
        const data = await resposta.json();
        setNome("");
        setDescricao("");
        setPreco("");
        setQuantidade("");
        // Mensagem personalizada baseada na resposta do servidor
        const mensagem = data.mensagem.includes("atualizada") 
          ? "✅ Quantidade do produto aumentada!" 
          : "✅ Produto adicionado ao estoque!";
        alert(mensagem);
      } else {
        setErro("Ops! Não conseguimos salvar o produto.");
      }
    } catch (error) {
      setErro("Erro de conexão com o servidor.");
    }
    setCarregando(false);
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.titulo}>Novo Produto</h1>
        <p style={styles.subtitulo}>Preencha os dados para adicionar ao inventário</p>
        <div style={styles.linhaDecorativa}></div>
      </header>

      <div style={styles.card}>
        <form onSubmit={handleAdd} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome do Produto</label>
            <input
              type="text"
              placeholder="Produto"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Descrição Curta</label>
            <input
              type="text"
              placeholder="Detalhes"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.inputGroup, flex: 2 }}>
              <label style={styles.label}>Preço (R$)</label>
              <input
                type="number"
                placeholder="Preço"
                value={preco}
                onChange={(e) => setPreco(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <div style={{ ...styles.inputGroup, flex: 1 }}>
              <label style={styles.label}>Qtd.</label>
              <input
                type="number"
                placeholder="Quantidade"
                value={quantidade}
                onChange={(e) => setQuantidade(e.target.value)}
                style={styles.input}
                required
              />
            </div>
          </div>

          {erro && <p style={styles.erro}>{erro}</p>}

          <button type="submit" style={styles.botao} disabled={carregando}>
            {carregando ? "Salvando..." : "Adicionar ao Inventário"}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    gap: "16px",
  },
  header: {
    paddingBottom: "12px",
    borderBottom: "2px solid rgba(16, 185, 129, 0.1)",
  },
  titulo: {
    fontSize: "clamp(16px, 5vw, 24px)",
    fontWeight: "600",
    color: "#111827",
    margin: "0 0 8px 0",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  subtitulo: {
    color: "#6b7280",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    margin: "0 0 8px 0",
  },
  linhaDecorativa: {
    width: "30px",
    height: "2px",
    backgroundColor: "#10b981",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    padding: "clamp(16px, 5vw, 24px)",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    width: "90%",
    backdropFilter: "blur(10px)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: "12px",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: "700",
    color: "#1f2937",
    marginLeft: "2px",
  },
  input: {
    padding: "10px 12px",
    borderRadius: "10px",
    border: "1.5px solid #E5E7EB",
    fontSize: "0.95rem",
    outline: "none",
    backgroundColor: "#F9FAFB",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
  },
  botao: {
    padding: "10px 16px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    marginTop: "4px",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  erro: {
    color: "#DC2626",
    backgroundColor: "#FEE2E2",
    padding: "12px 14px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "0.85rem",
    fontWeight: "600",
    border: "1px solid #FECACA",
    margin: "0",
  },
};

// CSS Responsivo
const responsiveAddStyles = `
@media (max-width: 768px) {
  [style*="gap: 16px"] {
    gap: 12px !important;
  }

  [style*="padding: clamp"] {
    padding: 16px !important;
  }

  [style*="gap: 20px"] {
    flex-direction: column !important;
    gap: 0 !important;
  }
}

@media (max-width: 480px) {
  [style*="fontSize: 0.95rem"] {
    font-size: 0.85rem !important;
  }
  [style*="flex-direction: row"] {
    flex-direction: column !important;
  }
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = responsiveAddStyles;
  document.head.appendChild(style);
}