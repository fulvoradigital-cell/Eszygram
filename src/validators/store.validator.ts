import { z } from "zod";

export const trackEventSchema = z.object({
  type: z.enum(["view", "click"]),
  blockId: z.string().optional(),
  referrer: z.string().max(500).optional(),
});

export const captureLeadSchema = z
  .object({
    blockId: z.string().min(1, "Block ID is required"),
    email: z
      .string()
      .trim()
      .email("Please enter a valid email address")
      .toLowerCase()
      .optional()
      .or(z.literal("")),
    whatsapp: z
      .string()
      .trim()
      .min(8, "Please enter a valid WhatsApp number")
      .max(20)
      .optional()
      .or(z.literal("")),
    name: z.string().trim().max(80).optional(),
  })
  .refine(
    (data) => Boolean(data.email || data.whatsapp),
    {
      message: "Please provide either an email or WhatsApp number",
      path: ["email"],
    }
  );

export const updateThemeSchema = z.object({
  preset: z.string().min(1),
  primaryColor: z.string().min(1),
  backgroundColor: z.string().min(1),
  font: z.string().min(1),
  buttonRadius: z.string().optional(),
  cardStyle: z.enum(["glass", "solid", "bordered"]).optional(),
});

export const updateSeoSchema = z.object({
  metaTitle: z.string().max(80).optional().default(""),
  metaDescription: z.string().max(200).optional().default(""),
  ogImage: z.string().optional().default(""),
});

export type TrackEventInput = z.infer<typeof trackEventSchema>;
export type CaptureLeadInput = z.infer<typeof captureLeadSchema>;
export type UpdateThemeInput = z.infer<typeof updateThemeSchema>;
export type UpdateSeoInput = z.infer<typeof updateSeoSchema>;
