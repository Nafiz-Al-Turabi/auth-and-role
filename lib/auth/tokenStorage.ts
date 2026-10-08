const REFRESH_TOKEN_KEY = "refresh_token";
const ACCESS_TOKEN_KEY = "access_token";
const USER_ROLE_KEY = "user_role";

// Helper to set cookie for server-side proxy inspection
const setCookie = (name: string, value: string, days = 7) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; expires=${expires}; SameSite=Lax`;
};

const deleteCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

export const tokenStorage = {
  getRefreshToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
    setCookie(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    deleteCookie(REFRESH_TOKEN_KEY);
  },

  getAccessToken: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(ACCESS_TOKEN_KEY);
  },

  setAccessToken: (token: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ACCESS_TOKEN_KEY, token);
    setCookie(ACCESS_TOKEN_KEY, token);
  },

  removeAccessToken: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    deleteCookie(ACCESS_TOKEN_KEY);
  },

  getRole: () => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(USER_ROLE_KEY);
  },

  setRole: (role: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem(USER_ROLE_KEY, role);
    setCookie(USER_ROLE_KEY, role);
  },

  removeRole: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(USER_ROLE_KEY);
    deleteCookie(USER_ROLE_KEY);
  },

  clearAll: () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(USER_ROLE_KEY);
    deleteCookie(REFRESH_TOKEN_KEY);
    deleteCookie(ACCESS_TOKEN_KEY);
    deleteCookie(USER_ROLE_KEY);
  },
};
