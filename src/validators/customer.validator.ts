import { z } from "zod";

export const customerQuerySchema = z.object({
  type: z.enum(["all", "buyer", "lead"]).default("all"),
  search: z.string().trim().optional(),
  sort: z.enum(["latest", "spend", "orders"]).default("latest"),
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CustomerQueryInput = z.infer<typeof customerQuerySchema>;
