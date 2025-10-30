import { Route, Routes } from "react-router-dom";
import Layout from "./components/RocsunLayout";
import UserManage from "./pages/UserManage";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/users" element={<UserManage />} />
        <Route path="*" element={<div>欢迎使用 Rocsun 管理系统</div>} />
      </Routes>
    </Layout>
  )
}

export default App;