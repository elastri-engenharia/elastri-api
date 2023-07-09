import * as bcrypt from "bcrypt"

export async function compare(plain: string, hashed: string): Promise<boolean> {
  return await bcrypt.compare(plain, hashed)
}
