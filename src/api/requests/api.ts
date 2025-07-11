import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const backendUrl = "http://localhost:3000";



const baseQuery = fetchBaseQuery({
  baseUrl: backendUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("token");

    if (token) {
      headers.set("authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const api = createApi({
  reducerPath: "api",
  baseQuery,
  tagTypes: ["Todo"],
  endpoints: (builder) => ({
    index: builder.query({
      query: () => ({
        url: "/",
        method: "GET",
      }),
    }),
  }),
});