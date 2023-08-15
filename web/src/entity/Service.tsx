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
  Area: {
    id_area: string;
    name: string;
  };
  foreseen: string;
  advance: string;
  construction_idConstruction: {
    id_construction: string;
    code_construction: string;
    name_construction: string;
  };
  collaborator_idCollaborator?: [
    {
      id_collaborator: string;
      matriculation: string;
      name_collaborator: string;
    }
  ];
  disabled_service: boolean;
  production: string;
}

const regex = new RegExp(/^[+-]?(\d+|\d{1,5}(\.\d{1,2})*)?$/);

export const serviceFormSchema = z.object({
  code_service: z.string().toUpperCase().nonempty("Este campo é obrigatório."),
  name_service: z.string().toUpperCase().nonempty("Este campo é obrigatório."),
  code_totvs: z.string().toUpperCase().nonempty("Este campo é obrigatório."),
  activity: z.string().toUpperCase().nonempty("Este campo é obrigatório."),
  gardenId_garden: z.string().nonempty("Este campo é obrigatório."),
  measurementId_measurement: z.string().nonempty("Este campo é obrigatório."),
  subFieldId_subField: z.string().optional(),
  areaId_area: z.string().optional(),
  foreseen: z.string().regex(regex, "Este campo deve ser numérico."),
  advance: z.string().default("0"),
  constructionId_construction: z.string().nonempty("Este campo é obrigatório."),
  collaborator_idCollaborator: z.array(z.string().optional()),
  disabled_service: z.boolean(),
  production: z.string().optional(),
});

export type serviceFormData = z.infer<typeof serviceFormSchema>;
