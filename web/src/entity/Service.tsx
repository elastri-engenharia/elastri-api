import { z } from "zod";

export interface Service {
  id_service: string;
  code_service: string;
  name_service: string;
  code_totvs: string;
  activity: string;
  garden: {
    id_garden: string;
    name: string;
  };
  undMeasure: {
    id_measurement: string;
    symbol: string;
  };
  subfield: {
    id_subField: string;
    name: string;
  };
  areaId_area: string;
  foreseen: string;
  advance: string;
  constructionId_construction: {
    id_construction: string;
    code_construction: string;
    name_construction: string;
  };
  collaborator_idCollaborator: [
    {
      id_collaborator: string;
      matriculation: string;
      name_collaborator: string;
    }
  ];
  disabled_service: boolean;
  production: string;
}

export const serviceFormSchema = z.object({
  code_service: z.string().toUpperCase().nonempty("Este campo é obrigatório."),
  name_service: z.string().toUpperCase().nonempty("Este campo é obrigatório."),
  code_totvs: z.string().toUpperCase().nonempty("Este campo é obrigatório."),
  activity: z.string().toUpperCase().nonempty("Este campo é obrigatório."),
  gardenId_garden: z.string().nonempty("Este campo é obrigatório."),
  measurementId_measurement: z.string().nonempty("Este campo é obrigatório."),
  subFieldId_subField: z.string().optional(),
  areaId_area: z.string().optional(),
  foreseen: z.string().nonempty("Este campo é obrigatório."),
  advance: z.string().default("0"),
  constructionId_construction: z.string().nonempty("Este campo é obrigatório."),
  collaborator_idCollaborator: z.string().nonempty("Este campo é obrigatório."),
  disabled_service: z.boolean(),
  production: z.string().optional(),
});

export type serviceFormData = z.infer<typeof serviceFormSchema>;
