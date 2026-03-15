import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { ROUTES } from '../../utils/constants';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const normalizedRole = typeof user?.role === 'string' ? user.role.trim().toLowerCase() : '';

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  const normalizedAllowedRoles = allowedRoles.map((role) =>
    typeof role === 'string' ? role.trim().toLowerCase() : role
  );

  if (allowedRoles.length > 0 && !normalizedAllowedRoles.includes(normalizedRole)) {
    return <Navigate to={normalizedRole === 'hr' ? ROUTES.HR_DASHBOARD : ROUTES.CANDIDATE_DASHBOARD} replace />;
  }

  return children;
};

export default ProtectedRoute;

