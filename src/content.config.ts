import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const projects = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/projects" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    status: z.enum(["geplant", "in-arbeit", "abgeschlossen"]),
    draft: z.boolean().default(true),
    reviewRequired: z.boolean().default(true),
  }),
});

export const collections = { projects };
