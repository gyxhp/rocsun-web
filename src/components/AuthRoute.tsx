import { useAuth } from '../contexts/AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

interface AuthRouteProps {
  children: JSX.Element;
}

export default function AuthRoute({ children }: AuthRouteProps) {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // 保存当前路径以便登录后重定向
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}