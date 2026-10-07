const REFRESH_TOKEN_KEY = "refresh_token";

export const tokenStorage = {
  getRefreshToken: () => {
    if (typeof window === "undefined") return null;

    return localStorage.getItem(REFRESH_TOKEN_KEY);
  },

  setRefreshToken: (token: string) => {
    if (typeof window === "undefined") return;

    localStorage.setItem(REFRESH_TOKEN_KEY, token);
  },

  removeRefreshToken: () => {
    if (typeof window === "undefined") return;

    localStorage.removeItem(REFRESH_TOKEN_KEY);
  },
};
