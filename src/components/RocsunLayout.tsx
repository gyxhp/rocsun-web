
import RocsunHeader from './RocsunHeader';
import { Layout } from 'antd';
import Sidebar from './Sidebar';

const { Content } = Layout;

export default function RocsunLayout({ children }: { children: React.ReactNode })  {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Sidebar />
            <Layout>
                <RocsunHeader />
                <Content style={{ margin: 16, padding: 24, background: "#fff", borderRadius: 8 }}>
                    {children}
                </Content>
            </Layout>
        </Layout>
    )
}