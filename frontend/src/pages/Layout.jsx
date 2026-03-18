import MenuLateral from "../components/MenuLateral";

export default function Layout({ children }) {
  return (
    <div style={{ display: "flex", width: "100%", height: "100vh" }}>
      <MenuLateral />
      <main style={{ marginLeft: '280px', flex: 1, padding: '20px 25px', overflow: 'hidden', fontFamily: "'Segoe UI', Roboto, sans-serif" }}>
        {children}
      </main>
    </div>
  );
}