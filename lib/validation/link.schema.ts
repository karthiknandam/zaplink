import z from "zod";

export const linkSchema = z.object({
  id: z.string().optional(),

  code: z
    .string()
    .regex(/^[A-Za-z0-9]{6,7}$/, {
      message: "Code must be 6–7 alphanumeric characters",
    })
    .optional(),
  url: z.url({ error: "Must be a valid url" }),

  count: z.int().optional(),
  icon: z.url().optional(),

  lastClicked: z.date().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export type linkType = z.infer<typeof linkSchema>;
