export default function Sair() {
    // Remover o token do localStorage para "deslogar" o usuário
    localStorage.removeItem("token");   
    // Redirecionar para a página de login
    window.location.href = "/";
    return null; // Não renderiza nada
}