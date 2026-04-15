import { useState } from "react";
import { Link } from "react-router-dom";
import { API_URL } from "../api/config";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    try {
      const resposta = await fetch(`${API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });

      const dados = await resposta.json();

      if (!resposta.ok) {
        setErro(dados.mensagem || "Credenciais inválidas");
        setCarregando(false);
        return;
      }

      localStorage.setItem("token", dados.token);
      window.location.href = "/dashboard";

    } catch (erro) {
      setErro("Erro ao conectar ao servidor");
    }
    setCarregando(false);
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.titulo}>Find<span>Ware</span></h2>
          <p style={styles.subtitulo}>Acesse sua conta para gerenciar seu estoque</p>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>E-mail</label>
            <input
              type="email"
              placeholder="Digite seu e-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Senha</label>
            <input
              type="password"
              placeholder="Digite sua senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              style={styles.input}
              required
            />
          </div>

          {erro && <p style={styles.erro}>{erro}</p>}

          <button type="submit" style={styles.botao} disabled={carregando}>
            {carregando ? "Autenticando..." : "Entrar no Sistema"}
          </button>
          
          <div style={styles.footer}>
            <span>Novo por aqui?</span>
            <Link to="/cadastro" style={styles.linkConta}>Criar uma conta gratuita</Link>
          </div>
        </form>
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
    padding: "20px",
    boxSizing: "border-box",
    fontFamily: "'Segoe UI', Roboto, sans-serif",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: "50px",
    borderRadius: "24px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 1px rgba(0, 0, 0, 0.1)",
    backdropFilter: "blur(10px)",
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    border: "1px solid rgba(255, 255, 255, 0.2)",
  },
  header: {
    marginBottom: "40px",
  },
  titulo: {
    fontSize: "2.5rem",
    fontWeight: "900",
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "0 0 12px 0",
    letterSpacing: "-1px",
    fontFamily: "Fugaz One, cursive",
  },
  subtitulo: {
    fontSize: "1rem",
    color: "#6b7280",
    margin: 0,
    lineHeight: "1.5",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "22px",
  },
  inputWrapper: {
    textAlign: "left",
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
    fontSize: "1rem",
    outline: "none",
    transition: "all 0.3s ease",
    backgroundColor: "#F9FAFB",
    fontFamily: "inherit",
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
    margin: 0,
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
  linkConta: {
    color: "#10b981",
    textDecoration: "none",
    fontWeight: "700",
    transition: "all 0.3s",
    cursor: "pointer",
  }
};