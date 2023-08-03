import { z } from "zod";

export interface Construction {
  id_construction: string;
  code_construction: string;
  name_construction: string;
  users?: [{ id_user: string; username: string }];
}

export const constructionFormSchema = z.object({
  code_construction: z
    .string()
    .toUpperCase()
    .nonempty("Este campo é obrigatório.")
    .max(20, "Este campo deve ter no máximo 20 caracteres."),
  name_construction: z
    .string()
    .toUpperCase()
    .nonempty("Este campo é obrigatório.")
    .max(100, "Este campo deve ter no máximo 100 caracteres."),
  users: z.array(z.string()).optional(),
});

export type constructionFormData = z.infer<typeof constructionFormSchema>;
