// src/components/Header.jsx
import { Layout, Dropdown, Menu } from "antd";
import { useAuth } from "../contexts/AuthContext";
import type { MenuProps } from 'antd';

const { Header } = Layout;

export default function RocsunHeader() {
  const { user, logout } = useAuth();
  
  const items: MenuProps['items'] = [
    {
      key: '1',
      label: '个人中心',
    },
    {
      key: '2',
      label: '退出登录',
      onClick: logout
    }
  ];

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
      <Dropdown menu={{ items }} placement="bottomRight">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: 8 }}>👤 {user?.nickname || '用户'}</span>
        </div>
      </Dropdown>
    </Header>
  );
}