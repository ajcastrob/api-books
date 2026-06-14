import { z } from "zod";

const bookSchema = z.object({
  name: z.string({
    invalid_type_error: "Book title must be a string",
    required_error: "Book title is required",
  }),
  author: z.string(),
  characters: z.array(z.string()),
  conflict: z.string(),
  year: z.number().int().positive(),
  image: z.string(),
  slug: z.string(),
  summary: z.string(),
  description: z.string(),
  genre: z.array(
    z.enum([
      "romance",
      "psicológico",
      "realismo",
      "drama social",
      "aventura",
      "drama",
      "gótico",
      "bildungsroman",
      "histórico",
      "ciencia ficción",
      "tragedia",
    ]),
  ),
});

export const validateSchema = (input) => {
  return bookSchema.safeParse(input);
};

export const validatePartialSchema = (input) => {
  return bookSchema.partial().safeParse(input);
};
