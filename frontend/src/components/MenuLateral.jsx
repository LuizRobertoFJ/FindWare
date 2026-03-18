import { Link, useLocation } from "react-router-dom";    
import { useAuth } from "../context/AuthContext";   

export default function MenuLateral() {
    const location = useLocation(); // Hook para identificar a rota atual

    return (
        <div style={styles.sidebar}>
            <div style={styles.logoArea}>
                <h1 style={styles.logoText}>
                    Find<span style={styles.logoSpan}>Ware</span>
                </h1>
            </div>
            
            <nav style={styles.nav}>
                <ul style={styles.ul}>
                    <li style={styles.li}>
                        <Link to="/dashboard" style={{
                            ...styles.link,
                            ...(location.pathname === "/dashboard" ? styles.activeLink : {})
                        }}>
                            <span style={styles.icon}></span> Home
                        </Link>
                    </li>
                    <li style={styles.li}>
                        <Link to="/addproduto" style={{
                            ...styles.link,
                            ...(location.pathname === "/addproduto" ? styles.activeLink : {})
                        }}>
                            <span style={styles.icon}></span> Novo Produto
                        </Link>
                    </li>
                    <li style={styles.li}>
                        <Link to="/listaprodutos" style={{
                            ...styles.link,
                            ...(location.pathname === "/listaprodutos" ? styles.activeLink : {})
                        }}>
                            <span style={styles.icon}></span> Estoque
                        </Link>
                    </li>
                    
                    {/* Espaçador para empurrar o sair para o final */}
                    <div style={{ flex: 1 }}></div>

                    <li style={styles.li}>
                        <Link to="/sair" style={styles.logoutLink}>
                            <span style={styles.icon}></span> Sair
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
        background: "linear-gradient(180deg, #f6f6f7 0%, #cfcdcd 100%)",
        color: "#000000",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        left: 0,
        top: 0,
        zIndex: 1000,
        boxShadow: "4px 0 20px rgba(0,0,0,0.15)",
        borderRight: "1px solid rgba(255,255,255,0.1)",
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },
    logoArea: {
        padding: "40px 20px",
        textAlign: "center",
    },
    logoText: {
        fontSize: "28px",
        fontWeight: "900",
        margin: 0,
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        letterSpacing: "-1px",
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
    },
    ul: {
        listStyle: "none",
        padding: "0 15px",
        margin: 0,
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    li: {
        width: "100%",
        marginBottom: "8px",
    },
    link: {
        display: "flex",
        alignItems: "center",
        padding: "12px 20px",
        color: "#000000",
        textDecoration: "none",
        fontSize: "15px",
        fontWeight: "500",
        borderRadius: "12px",
        transition: "all 0.3s ease",
        position: "relative",
    },
    activeLink: {
        background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
        color: "#ffffff",
        fontWeight: "700",
        boxShadow: "0 4px 15px rgba(16, 185, 129, 0.3)",
    },
    icon: {
        marginRight: "12px",
        fontSize: "18px",
    },
    logoutLink: {
        display: "flex",
        alignItems: "center",
        padding: "15px 20px",
        color: "#ffffff",
        textDecoration: "none",
        fontSize: "15px",
        fontWeight: "700",
        borderTop: "1px solid rgba(255,255,255,0.1)",
        marginBottom: "20px",
        background: "rgba(252, 68, 68, 0.87)",
        borderRadius: "12px",
        transition: "all 0.3s ease",
    }
};