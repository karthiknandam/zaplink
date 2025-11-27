import z from "zod";

export const linkSchema = z.object({
  id: z.string().optional(),

  code: z
    .string()
    .min(6, { error: "Code must be 6-7 Characters" })
    .max(7, { error: "Cannot exceed 7 Characters" })
    .optional(),
  url: z.url({ error: "Must be a valid url" }),

  count: z.int().optional(),

  lastClicked: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type linkType = z.infer<typeof linkSchema>;
