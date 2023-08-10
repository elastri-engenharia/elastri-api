import { z } from "zod";

export interface Area {
  id_area: string;
  name: string;
}

export const areaFormSchema = z.object({
  name: z.string().toUpperCase().nonempty("Este campo é obrigatório"),
});

export type areaFormData = z.infer<typeof areaFormSchema>;
