import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Plus, Package, LogOut } from "lucide-react";

export default function MenuLateral({ menuAberto, setMenuAberto }) {
    const location = useLocation();

    const handleLinkClick = () => {
        // Fechar menu ao clicar em um link (mobile/tablet - <1024px)
        if (window.innerWidth < 1024) {
            setMenuAberto(false);
        }
    };

    const menuItems = [
        { icon: LayoutDashboard, label: "Painel Geral", path: "/dashboard" },
        { icon: Plus, label: "Novo Produto", path: "/addproduto" },
        { icon: Package, label: "Estoque", path: "/listaprodutos" },
    ];

    return (
        <div style={{
            ...styles.sidebar,
            ...(menuAberto ? styles.sidebarAberto : styles.sidebarFechado)
        }}>
            <div style={styles.logoArea}>
                <h1 style={styles.logoText}>
                    Find<span style={styles.logoSpan}>Ware</span>
                </h1>
            </div>
            
            <nav style={styles.nav}>
                <ul style={styles.ul}>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <li key={item.path} style={styles.li}>
                                <Link 
                                    to={item.path}
                                    onClick={handleLinkClick}
                                    style={{
                                        ...styles.link,
                                        ...(isActive ? styles.activeLink : {})
                                    }}
                                >
                                    <Icon size={20} style={{ marginRight: "12px" }} />
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        );
                    })}
                    
                    <div style={{ flex: 1 }}></div>

                    <li style={styles.li}>
                        <Link 
                            to="/sair"
                            onClick={handleLinkClick}
                            style={styles.logoutLink}
                        >
                            <LogOut size={20} style={{ marginRight: "12px" }} />
                            <span>Sair</span>
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

const styles = {
    sidebar: {
        width: "280px",
        height: "100vh",
        background: "#ffffff",
        color: "#111827",
        display: "flex",
        flexDirection: "column",
        position: "relative",
        zIndex: 1000,
        boxShadow: "4px 0 20px rgba(0,0,0,0.08)",
        borderRight: "1px solid #e5e7eb",
        fontFamily: "'Segoe UI', Roboto, sans-serif",
        transition: "transform 0.3s ease",
    },
    sidebarAberto: {
        // Controlado pelo menuWrapper em mobile
    },
    sidebarFechado: {
        // Controlado pelo menuWrapper em mobile
    },
    logoArea: {
        padding: "32px 20px 24px",
        textAlign: "center",
        borderBottom: "1px solid #f3f4f6",
    },
    logoText: {
        fontSize: "26px",
        fontWeight: "800",
        margin: 0,
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "-0.5px",
    },
    logoSpan: {
        background: "linear-gradient(135deg, #34d399 0%, #10b981 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
    },
    nav: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    ul: {
        listStyle: "none",
        padding: "20px 12px 0",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        gap: "8px",
    },
    li: {
        margin: 0,
    },
    link: {
        display: "flex",
        alignItems: "center",
        padding: "12px 14px",
        color: "#6b7280",
        textDecoration: "none",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.2s ease",
        cursor: "pointer",
    },
    activeLink: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "white",
        boxShadow: "0 4px 12px rgba(16, 185, 129, 0.25)",
    },
    logoutLink: {
        display: "flex",
        alignItems: "center",
        padding: "12px 14px",
        color: "#ef4444",
        textDecoration: "none",
        borderRadius: "10px",
        fontSize: "14px",
        fontWeight: "600",
        transition: "all 0.2s ease",
        cursor: "pointer",
        margin: "12px 0 20px 0",
        borderTop: "1px solid #f3f4f6",
    },
};