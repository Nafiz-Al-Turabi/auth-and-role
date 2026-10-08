import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { tokenStorage } from "@/lib/auth/tokenStorage";

interface AuthState {
  accessToken: string | null;
  role: string | null;
  isAuthenticated: boolean;
}

const getInitialState = (): AuthState => {
  if (typeof window === "undefined") {
    return {
      accessToken: null,
      role: null,
      isAuthenticated: false,
    };
  }

  const accessToken = tokenStorage.getAccessToken();
  const role = tokenStorage.getRole();
  const refreshToken = tokenStorage.getRefreshToken();

  return {
    accessToken,
    role,
    isAuthenticated: Boolean(accessToken || refreshToken),
  };
};

const initialState: AuthState = getInitialState();

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{
        accessToken: string;
        role: string;
      }>,
    ) => {
      state.accessToken = action.payload.accessToken;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },

    updateAccessToken: (state, action: PayloadAction<string>) => {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
    },

    logout: (state) => {
      state.accessToken = null;
      state.role = null;
      state.isAuthenticated = false;
      tokenStorage.clearAll();
    },
  },
});

export const { setCredentials, updateAccessToken, logout } = authSlice.actions;

export default authSlice.reducer;
