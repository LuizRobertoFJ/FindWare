export default function Sair() {

    const navigate = useNavigate();

    async function handleLogout() {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include",
        });
        navigate("/");
    }

    return (
        <button onClick={handleLogout}>
            Sair
        </button>
    );
}