import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const mapCandidate = (c) => {
  if (!c) return null;
  return {
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    email: c.email,
    phone: c.phone,
    image: c.avatarUrl || `https://dummyjson.com/icon/${c.firstName}/128`,
    age: 25, 
    company: { 
      name: c.position || "Company",
      title: c.position || "Developer", 
      department: "Engineering"
    },
    address: { 
      city: c.location || "Unknown",
      address: "Street",
      state: c.source || "Direct",
      coordinates: { 
        lat: c.lat || 40.7128, 
        lng: c.lng || -74.0060 
      }
    },
    university: c.university || "Unknown",
    gender: c.gender || "Unknown",
    birthDate: c.birthDate || "1990-01-01",
    stageId: c.stageId, 
    positionInStage: c.positionInStage,
    weight: (c.salary || 0),
    createdAt: c.createdAt,
  };
};

export const coreApi = createApi({
  reducerPath: "coreApi",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:4000/api/" }),
  tagTypes: ['Candidate'],
  endpoints: (build) => ({
    getUsers: build.query({
      query: (search) => {
        const params = new URLSearchParams();
        params.append('limit', '100');
        if (search) params.append('search', search);
        return `candidates?${params.toString()}`;
      },
      transformResponse: (response) => {
        if (!response || !response.data) return [];
        return response.data.map(mapCandidate);
      },
      providesTags: ['Candidate'],
    }),

    getUserById: build.query({
      query: (id) => `candidates/${id}`,
      transformResponse: (response) => mapCandidate(response.data),
      providesTags: (result, error, id) => [{ type: 'Candidate', id }],
    }),

    createCandidate: build.mutation({
      query: (body) => ({
        url: 'candidates',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Candidate'],
    }),

    updateCandidate: build.mutation({
      query: ({ id, ...body }) => ({
        url: `candidates/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Candidate', id }, 'Candidate'],
    }),

    deleteCandidate: build.mutation({
      query: (id) => ({
        url: `candidates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Candidate'],
    }),

    bulkDeleteCandidates: build.mutation({
      query: (ids) => ({
        url: 'candidates/bulk-delete',
        method: 'POST',
        body: { ids },
      }),
      invalidatesTags: ['Candidate'],
    }),
  }),
});

export const { 
  useGetUsersQuery: useUsers, 
  useGetUserByIdQuery: useUserById,
  useCreateCandidateMutation,
  useUpdateCandidateMutation,
  useDeleteCandidateMutation,
  useBulkDeleteCandidatesMutation,
} = coreApi;