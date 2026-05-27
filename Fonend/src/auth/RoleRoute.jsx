import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import Loading from '../components/Loading';

const ROLE_REDIRECTS = {
  customer: '/customer',
  staff: '/staff',
  admin: '/admin',
};

const RoleRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) return <Loading />;
  if (!user) return <Navigate to="/login" replace />;

  const role = user.role?.toLowerCase();
  if (!allowedRoles.includes(role)) {
    const redirect = ROLE_REDIRECTS[role] || '/';
    return <Navigate to={redirect} replace />;
  }

  return children;
};

export default RoleRoute;
