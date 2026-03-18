import { useState } from "react";
import { API_URL } from "../api/config";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState(""); // Adicionado para UX
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  async function handleRegister(e) {
    e.preventDefault();
    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(`${API_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, email, senha }),
      });

      if (resposta.ok) {
        window.location.href = "/dashboard";
      } else {
        setErro("Erro ao criar conta. Tente novamente.");
      }
    } catch (erro) {
      setErro("Erro de conexão com o servidor.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.titulo}>Find<span>Ware</span></h2>
        <p style={styles.subtitulo}>Acesse sua conta para gerenciar seu estoque</p>

        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Nome</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              style={styles.input}
              placeholder="exemplo@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              style={styles.input}
              placeholder="******"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
            />
          </div>

          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirme a senha</label>
            <input
              type="password"
              style={styles.input}
              placeholder="******"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
              required
            />
          </div>

          {erro && <span style={styles.erro}>{erro}</span>}

          <button type="submit" disabled={carregando} style={styles.botao}>
            {carregando ? "Processando..." : "Criar conta gratuita"}
          </button>
        </form>

        <div style={styles.footer}>
          <span>Já possui uma conta? </span>
          <a href="/" style={styles.link}>Entrar no sistema</a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "100%",
    height: "100vh",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
    padding: "20px",
    boxSizing: "border-box",
  },
  card: {
    background: "rgba(255, 255, 255, 0.95)",
    padding: "50px",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  titulo: {
    fontSize: "2.5rem",
    fontWeight: "900",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 12px 0",
    letterSpacing: "-1px",
  },
  subtitulo: {
    fontSize: "1rem",
    color: "#6b7280",
    marginBottom: "30px",
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
    textAlign: "left",
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
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
    background: "#F9FAFB",
    outline: "none",
    fontSize: "1rem",
    fontFamily: "inherit",
    transition: "all 0.3s ease",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.02)",
  },
  botao: {
    padding: "16px",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    color: "#ffffff",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    fontWeight: "700",
    fontSize: "1.05rem",
    transition: "all 0.3s ease",
    marginTop: "10px",
    boxShadow: "0 8px 20px rgba(16, 185, 129, 0.3)",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  erro: {
    color: "#DC2626",
    fontSize: "0.9rem",
    fontWeight: "600",
    backgroundColor: "#FEE2E2",
    padding: "12px 14px",
    borderRadius: "10px",
    textAlign: "center",
    border: "1px solid #FECACA",
  },
  footer: {
    marginTop: "28px",
    fontSize: "0.95rem",
    color: "#6b7280",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    paddingTop: "20px",
    borderTop: "1px solid #E5E7EB",
  },
  link: {
    color: "#10b981",
    textDecoration: "none",
    fontWeight: "700",
    transition: "all 0.3s",
    cursor: "pointer",
  },
};