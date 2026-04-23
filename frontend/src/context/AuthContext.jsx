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
        try {

      const resposta = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
      });
      if(resposta.status === 401) {
        setUsuario(null);
        setCarregando(false);
        return;
      }
      if (!resposta.ok) {
        throw new Error("Usuário não autenticado");
      }
    
        const dados = await resposta.json();
        setUsuario(dados);
      } catch (error) {
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