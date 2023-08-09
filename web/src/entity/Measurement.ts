import { z } from "zod";

export interface Measurement {
  id_measurement: string;
  name_measurement: string;
  symbol: string;
}

export const measurementFormSchema = z.object({
  name_measurement: z
    .string()
    .toUpperCase()
    .nonempty("Este campo é obrigatório"),
  symbol: z.string().toLowerCase().nonempty("Este campo é obrigatório"),
});

export type measurementFormData = z.infer<typeof measurementFormSchema>;
