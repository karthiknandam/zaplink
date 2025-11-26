import z from "zod";

export const linkSchema = z.object({
  id: z.string().optional(),

  code: z.string().max(7, { error: "Cannot exceed 7 Characters" }).optional(),
  url: z.string().min(1, { error: "Url is required" }),

  count: z.int().optional(),

  lastClicked: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type linkType = z.infer<typeof linkSchema>;
