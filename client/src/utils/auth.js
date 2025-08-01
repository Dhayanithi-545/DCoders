import { useNavigate } from 'react-router-dom';

export const TOKEN_KEY = 'auth_token';

export const setToken = (token) => {
  const expiresAt = new Date();
  expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 month from now
  
  document.cookie = `${TOKEN_KEY}=${token}; path=/; expires=${expiresAt.toUTCString()}`;
};

export const getToken = () => {
  const cookies = document.cookie.split(';');
  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i].trim();
    if (cookie.startsWith(TOKEN_KEY + '=')) {
      return cookie.substring(TOKEN_KEY.length + 1);
    }
  }
  return null;
};

export const removeToken = () => {
  document.cookie = `${TOKEN_KEY}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const useAuthRedirect = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    const token = getToken();
    if (token) {
      navigate('/dashboard');
    } else {
      navigate('/login');
    }
  }, [navigate]);
};
