import { Button, Form, Input, Card, message } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { USER_API } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

interface LoginForm {
  username: string;
  password: string;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginForm) => {
    setLoading(true);
    try {
      const res = await fetch(USER_API.LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(values),
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const data = await res.json();
      console.log('登录API响应:', data); // 调试日志
      if (data.success && data!.data) {
        message.success('登录成功');
        login(data.data.token, { 
          nickname: data.data.nickname || data.data.username,
          username: data.data.username
        });
        const from = location.state?.from?.pathname || '/';
        navigate(from, { replace: true });
      } else {
        message.error(data.message || '登录失败');
      }
    } catch (err) {
      console.error(err);
      message.error('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f0f2f5'
    }}>
      <Card 
        title="用户登录" 
        style={{ width: 400 }}
        // extra={<a onClick={() => navigate('/register')}>注册账号</a>}
      >
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={ onFinish }
          autoComplete="off"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: '请输入用户名' }]}
          >
            <Input prefix={ <UserOutlined /> } placeholder="用户名" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="密码" />
          </Form.Item>
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              style={{ width: '100%', marginBottom: 16 }}
            >
              登录
            </Button>
            或 <a onClick={() => navigate('/register')}>立即注册</a>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}