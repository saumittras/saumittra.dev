import Cookies from 'js-cookie';

const TOKEN_KEY = 'admin_token';

export const setToken = (token: string) => {
  Cookies.set(TOKEN_KEY, token, { expires: 1 }); // 1 day expire
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token); // Fallback for easier dev tracking
  }
};

export const getToken = () => {
  return Cookies.get(TOKEN_KEY);
};

export const removeToken = () => {
  Cookies.remove(TOKEN_KEY);
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const isAuthenticated = () => {
  return !!getToken();
};
