import { z } from 'zod';

export const getCandidatesQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(100),
  search: z.string().optional(),
  stageId: z.string().optional(),
});

export const createCandidateSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().optional(),
  position: z.string().optional(),
  location: z.string().optional(),
  salary: z.number().optional(),
  source: z.string().optional(),
  birthDate: z.string().optional(),
  stageId: z.string().optional().nullable(),
});