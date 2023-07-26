import { z } from "zod";

export interface User {
  id_user: string;
  username: string;
  email: string;
  password: string;
  role: string;
}

export interface Role {
  value: string;
}

export const roles = [
  { value: "ADMIN" },
  { value: "ACCESS_ADMIN" },
  { value: "ACCESS_ADMIN_RDC" },
  { value: "ACCESS_ADMIN_SNACK" },
  { value: "ACCESS_FUNC_RDC" },
  { value: "ACCESS_FUNC_SNACK" },
  { value: "ACCESS_VISITOR_SNACK" },
];

export const userFormSchema = z.object({
  username: z.string().nonempty("Este campo é obrigatório."),
  email: z.string().email("Este campo deve ser do tipo Email."),
  password: z
    .string()
    .nonempty("Este campo é obrigatório.")
    .max(255, "Deve conter no máximo 100 caracteres."),
  role: z.string().nonempty("Este campo é obrigatório"),
});

export type userFormData = z.infer<typeof userFormSchema>;
