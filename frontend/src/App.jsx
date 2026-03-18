import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddProduto from "./pages/AddProduto";
import ProtectedRoute from "./components/ProtectedRoute";
import Cadastro from "./pages/Cadastro";
import ListaProdutos from "./pages/ListaProdutos";
import Sair from "./components/Sair";
import Layout from "./pages/Layout";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/cadastro" element={<Cadastro />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Layout>
            <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/addproduto"
        element={
          <ProtectedRoute>
            <Layout>
            <AddProduto />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/listaprodutos"
        element={
          <ProtectedRoute>
            <Layout>
            <ListaProdutos />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/sair"
        element={
          <ProtectedRoute>
            <Sair />
          </ProtectedRoute>
        }
      />


    </Routes>
  );
}

export default App;