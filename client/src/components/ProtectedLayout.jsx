import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getToken } from '../utils/auth';

const ProtectedLayout = ({ children }) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null → loading, false → redirect

  useEffect(() => {
    const token = getToken();
    if (!token) {
      navigate('/login'); // ✅ Correct: inside useEffect
    } else {
      setIsAuthenticated(true);
    }
  }, [navigate]);

  // Optional: show nothing while checking token
  if (isAuthenticated === null) return null;

  return <>{children}</>;
};

export default ProtectedLayout;
