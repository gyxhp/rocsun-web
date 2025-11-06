import { Route, Routes } from "react-router-dom";
import Layout from "./components/RocsunLayout";
import UserManage from "./pages/UserManage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthRoute from "./components/AuthRoute";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={
          <AuthRoute>
            <Layout>
              <div>欢迎使用 Rocsun 管理系统</div>
            </Layout>
          </AuthRoute>
        } />
        <Route path="/users" element={
          <AuthRoute>
            <Layout>
              <UserManage />
            </Layout>
          </AuthRoute>
        } />
        <Route path="*" element={
          <AuthRoute>
            <Layout>
              <div style={{ padding: 24 }}>
                <h1>404</h1>
                <p>页面不存在</p>
              </div>
            </Layout>
          </AuthRoute>
        } />
      </Routes>
    </AuthProvider>
  )
}

export default App;