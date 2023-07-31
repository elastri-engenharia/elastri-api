import { z } from "zod";

export interface Company {
  id_company: string;
  company_name: string;
  users?: [
    {
      username: string;
    }
  ];
}

export const companyFormSchema = z.object({
  company_name: z.string().toUpperCase().nonempty("Este campo é obrigatório."),
  users: z.array(z.string()).optional(),
});

export type companyFormData = z.infer<typeof companyFormSchema>;
