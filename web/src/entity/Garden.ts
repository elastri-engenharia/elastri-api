import { z } from "zod";

export interface Garden {
  id_garden: string;
  name: string;
}

export const gardenFormSchema = z.object({
  name: z.string().toUpperCase().nonempty("Este campo é obrigatório"),
});

export type gardenFormData = z.infer<typeof gardenFormSchema>;
