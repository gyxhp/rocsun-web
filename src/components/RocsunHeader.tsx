// src/components/Header.jsx
import { Layout } from "antd";

const { Header } = Layout;

export default function RocsunHeader() {
  return (
    <Header
      style={{
        background: "#fff",
        height: "60px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 20px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <h3 style={{ margin: 0 }}>Rocsun 管理系统</h3>
      <div>
        <span>👤 Admin</span>
      </div>
    </Header>
  );
}