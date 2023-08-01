import { z } from "zod";

export interface Construction {
  id_construction: string;
  code_construction: string;
  name_construction: string;
  company_idCompany: {
    id_company: string;
    company_name: string;
  };
  user_idUser?: string;
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
  company_idCompany: z.string().nonempty("Este campo é obrigatório."),
});

export type constructionFormData = z.infer<typeof constructionFormSchema>;
