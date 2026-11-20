import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const boardApi = createApi({
  reducerPath: "boardApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4001/api/" }),
  tagTypes: ['Board', 'Candidate'],
  endpoints: (build) => ({
    getBoard: build.query({
      query: () => 'board',
      providesTags: ['Board'],
    }),

    getStages: build.query({
      query: () => 'stages',
      providesTags: ['Board'],
    }),

    updateCandidateStage: build.mutation({
      query: ({ id, stageId, positionInStage }) => ({
        url: `board/candidates/${id}/stage`,
        method: 'PATCH',
        body: { stageId, positionInStage },
      }),
      invalidatesTags: ['Board', 'Candidate'],
    }),
  }),
});

export const { 
  useGetBoardQuery, 
  useGetStagesQuery,
  useUpdateCandidateStageMutation 
} = boardApi;