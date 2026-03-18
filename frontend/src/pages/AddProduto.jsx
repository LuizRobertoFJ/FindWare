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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.titulo}>Novo Produto</h2>
          <p style={styles.subtitulo}>Preencha os dados abaixo para atualizar seu estoque</p>
        </div>

        <form onSubmit={handleAdd} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome do Produto</label>
            <input
              type="text"
              placeholder="Ex: Batom Rare Beauty"
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
              placeholder="Ex: Cor Mascavo - Longa duração"
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
                placeholder="0,00"
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
                placeholder="0"
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
    justifyContent: "center",
    alignItems: "flex-start",
    minHeight: "100%",
    paddingTop: "clamp(20px, 5vw, 50px)",
    paddingBottom: "clamp(20px, 5vw, 50px)",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.98)",
    padding: "clamp(25px, 8vw, 50px)",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.08)",
    border: "1px solid rgba(0, 0, 0, 0.05)",
    width: "100%",
    maxWidth: "520px",
    backdropFilter: "blur(10px)",
    margin: "0 auto",
  },
  header: {
    marginBottom: "35px",
    borderBottom: "2px solid rgba(16, 185, 129, 0.1)",
    paddingBottom: "20px",
  },
  titulo: {
    fontSize: "clamp(1.5rem, 5vw, 2rem)",
    fontWeight: "800",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: 0,
  },
  subtitulo: {
    color: "#6b7280",
    fontSize: "clamp(0.85rem, 2vw, 0.95rem)",
    marginTop: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  row: {
    display: "flex",
    flexDirection: "row",
    gap: "20px",
  },
  label: {
    fontSize: "0.9rem",
    fontWeight: "700",
    color: "#1f2937",
    marginLeft: "2px",
  },
  input: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "2px solid #E5E7EB",
    fontSize: "1rem",
    outline: "none",
    backgroundColor: "#F9FAFB",
    transition: "all 0.3s ease",
    fontFamily: "inherit",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
  },
  botao: {
    padding: "16px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "white",
    border: "none",
    borderRadius: "12px",
    fontWeight: "700",
    fontSize: "1.05rem",
    cursor: "pointer",
    marginTop: "10px",
    transition: "all 0.3s ease",
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  erro: {
    color: "#DC2626",
    backgroundColor: "#FEE2E2",
    padding: "14px 16px",
    borderRadius: "10px",
    textAlign: "center",
    fontSize: "0.9rem",
    fontWeight: "600",
    border: "1px solid #FECACA",
  },
};

// CSS Responsivo
const responsiveAddStyles = `
@media (max-width: 768px) {
  [class*="row"] {
    flex-direction: column !important;
    gap: 16px !important;
  }

  [class*="card"] {
    margin: 0 auto !important;
    width: 100% !important;
  }

  [class*="botao"] {
    width: 100% !important;
  }
}
`;

if (typeof document !== "undefined") {
  const style = document.createElement("style");
  style.textContent = responsiveAddStyles;
  document.head.appendChild(style);
}