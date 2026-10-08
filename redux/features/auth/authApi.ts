import { baseApi } from "@/redux/api/baseApi";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;

  message: string;

  authorization: {
    type: string;
    access_token: string;
    refresh_token: string;
  };

  role: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    getCurrentUser: builder.query<LoginResponse, void>({
      query: () => ({
        url: "/auth/me",
        method: "GET",
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useGetCurrentUserQuery } = authApi;
