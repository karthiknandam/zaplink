import z from "zod";

export const linkSchema = z.object({
  id: z.string().optional(),

  code: z
    .string()
    .min(6, { error: "Hash code length must be 6-7 Characters" })
    .max(7, { error: "Hash code length must be 6-7 Characters" })
    .optional(),
  url: z.string().min(1, { error: "Url is required" }),

  count: z.int().optional(),

  lastClicked: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type linkType = z.infer<typeof linkSchema>;
