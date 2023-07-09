export interface Encoder {
  encoder(plain: string): Promise<string>
  compare(plain: string, hashed: string): Promise<boolean>
}
