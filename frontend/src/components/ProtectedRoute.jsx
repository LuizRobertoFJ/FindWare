import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return <div>Carregando...</div>; // ou um spinner
  }

  if (!usuario) {
    return <Navigate to="/" />; // volta pro login
  }

  return children; // deixa entrar
}