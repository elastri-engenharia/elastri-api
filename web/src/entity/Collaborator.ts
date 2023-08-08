import { z } from "zod";

export interface Gender {
  value: string;
}

export const genders = [{ value: "M" }, { value: "F" }];

export interface Collaborator {
  id_collaborator: string;
  matriculation: string;
  name_collaborator: string;
  office_collaborator: string;
  city: string;
  gender: string;
  admission_date: string;
  resignation_date?: string;
  disabled_collaborator?: boolean;
  responsible: boolean;
  construction_idConstruction: {
    id_construction: string;
    code_construction: string;
    name_construction: string;
    companyId_company: string;
  };
  user_idUser: {
    id_user: string;
    username: string;
    email: string;
    password: string;
    role: string;
  };
}

const regex = new RegExp(/^\d{1,10}$/);

export const collaboratorFormSchema = z.object({
  matriculation: z.string().regex(regex, "Este campo deve ser numérico."),
  name_collaborator: z
    .string()
    .nonempty("Este campo é obrigatório.")
    .max(100, "Deve conter no máximo 100 caracteres.")
    .toUpperCase(),
  office_collaborator: z
    .string()
    .nonempty("Este campo é obrigatório.")
    .toUpperCase(),
  city: z.string().nonempty("Este campo é obrigatório").toUpperCase(),
  gender: z.string().nonempty("Este campo é obrigatório"),
  admission_date: z.string().nonempty("Este campo é obrigatório."),
  resignation_date: z.string().optional(),
  disabled_collaborator: z.boolean().optional(),
  responsible: z.boolean(),
  construction_idConstruction: z.string(),
  user_idUser: z.string().optional(),
});

export type collaboratorFormData = z.infer<typeof collaboratorFormSchema>;
