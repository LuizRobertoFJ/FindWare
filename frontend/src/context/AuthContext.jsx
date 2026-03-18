import { createContext, useContext, useEffect, useState } from "react";
import { API_URL } from "../api/config";

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function fetchUsuario() {
      const token = localStorage.getItem("token");

      if (!token) {
        setCarregando(false);
        return;
      }

      try {

        const resposta = await fetch(`${API_URL}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!resposta.ok) {
          throw new Error("Token inválido");
        }

        const dados = await resposta.json();
        setUsuario(dados);
      } catch (error) {
        localStorage.removeItem("token");
        setUsuario(null);
      } finally {
        setCarregando(false);
      }
    }

    fetchUsuario();
  }, []);

  return (
    <AuthContext.Provider value={{ usuario, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}