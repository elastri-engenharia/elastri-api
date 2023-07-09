import * as bcrypt from "bcrypt"

export async function encoder(plain: string): Promise<string> {
  const rounds = 10
  return await bcrypt.hash(plain, rounds)
}
