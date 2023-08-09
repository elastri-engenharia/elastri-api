import { z } from "zod";

export interface SubField {
  id_subField: string;
  name: string;
}

export const subFieldFormSchema = z.object({
  name: z.string().toUpperCase().nonempty("Este campo é obrigatório"),
});

export type subFieldFormData = z.infer<typeof subFieldFormSchema>;
