import { z } from "zod";

export interface Company {
  id_company: string;
  company_name: string;
}

export const companyFormSchema = z.object({
  company_name: z.string().nonempty("Este campo é obrigatório."),
});

export type companyFormData = z.infer<typeof companyFormSchema>;
