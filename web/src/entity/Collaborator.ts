import { z } from "zod";

export interface Collaborator {
  id_collaborator: string;
  matriculation: string;
  name_collaborator: string;
  office_collaborator: string;
  disabled_collaborator: boolean;
  responsible: boolean;
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
  disabled_collaborator: z.boolean(),
  responsible: z.boolean(),
  construction_idConstruction: z.string(),
});

export type collaboratorFormData = z.infer<typeof collaboratorFormSchema>;
