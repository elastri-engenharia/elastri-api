import { Express, Router } from "express"
import { readdirSync } from "fs"

export default (app: Express): void => {
  const router = Router()
  app.use("/api", router)
  readdirSync(`${__dirname}/../routes`).map(async (file) => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(await import(`${__dirname}/../routes/${file}`)).default(router)
  })
}
