import { Response } from "express"
import { verify } from "jsonwebtoken"

export default function auth(req, res, next): Promise<Response | void> {
  try {
    const auth = req.headers.authorization

    if (!auth) {
      throw new Error("JWT is missing")
    }

    const [, token] = auth.split(" ")

    const tokenDecoded = verify(token, process.env.JWT_SECRET_KEY)

    if (tokenDecoded) {
      return next()
    } else {
      throw new Error("JWT invalid")
    }
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
