import { Link, useLocation } from "react-router-dom";
import { SettingOutlined, UserOutlined } from "@ant-design/icons";
import { Menu } from "antd";
import Sider from "antd/es/layout/Sider";

const menrItems = [
    { key: "/users", icon: <UserOutlined />, label: <Link to="/users">用户管理</Link> },
    { key: "/setting", icon: <SettingOutlined />, label: <Link to="/setting">系统设置</Link> },
]

export default function Sidebar() {
    const location = useLocation();
    // 提取路由的基本路径（去掉query）
    const pathKey = location.pathname.split("/")[1] ? 
                        `/${location.pathname.split("/")[1]}` : "/"
    return (
        <Sider collapsible theme="dark">
            <div style={{
                height: 60,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 20,
                fontWeight: "bold"
            }}
            >
                🔷 Rocsun
            </div>
            <Menu
                theme="dark"
                mode="inline"
                selectedKeys={[ pathKey ]}
                items={ menrItems }
            />
        </Sider>
    )
}