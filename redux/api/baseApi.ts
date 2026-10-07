import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  createApi,
  fetchBaseQuery,
} from "@reduxjs/toolkit/query/react";

import type { RootState } from "../store";

import { logout, updateAccessToken } from "../features/auth/authSlice";

import { tokenStorage } from "@/lib/auth/tokenStorage";

const API_URL = "https://api.lexacademy.cloud/api";

const baseQuery = fetchBaseQuery({
  baseUrl: API_URL,

  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.accessToken;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    headers.set("Content-Type", "application/json");

    return headers;
  },
});

// *************************************
export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error?.status === 401) {
    const refreshToken = tokenStorage.getRefreshToken();

    if (!refreshToken) {
      api.dispatch(logout());

      return result;
    }

    const refreshResult = await baseQuery(
      {
        url: "/auth/refresh-tokens",
        method: "POST",

        body: {
          refresh_token: refreshToken,
        },
      },
      api,
      extraOptions,
    );

    if (refreshResult.data) {
      const data = refreshResult.data as {
        success: boolean;

        authorization: {
          type: string;
          access_token: string;
          refresh_token: string;
        };

        role: string;
      };

      const newAccessToken = data.authorization.access_token;

      const newRefreshToken = data.authorization.refresh_token;

      // Save NEW refresh token
      tokenStorage.setRefreshToken(newRefreshToken);

      // Save NEW access token in Redux
      api.dispatch(updateAccessToken(newAccessToken));

      // Retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      // Refresh token invalid/expired
      tokenStorage.removeRefreshToken();

      api.dispatch(logout());
    }
  }

  return result;
};

// *************************************
export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: baseQueryWithReauth,

  endpoints: () => ({}),
});
