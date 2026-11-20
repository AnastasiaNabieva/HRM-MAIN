import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const parserApi = createApi({
  reducerPath: "parserApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4002/api/" }),
  endpoints: (build) => ({
    uploadResume: build.mutation({
      query: (formData) => ({
        url: 'upload/resume',
        method: 'POST',
        body: formData,
      }),
    }),
  }),
});

export const { useUploadResumeMutation } = parserApi;