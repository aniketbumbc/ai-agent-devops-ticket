import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function CheckAuth({ children, protectedRoute }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');

    // Protected route, but no token → redirect to login
    if (protectedRoute && !token) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }

    // Public route, but already logged in → redirect to home
    if (!protectedRoute && token) {
      navigate('/', { replace: true });
      return;
    }

    // Otherwise, access is allowed
    setAllowed(true);
  }, [navigate, protectedRoute, location]);

  // Wait until auth decision is made
  if (!allowed) {
    return <div>Loading...</div>;
  }

  return children;
}

export default CheckAuth;
