import { prisma } from "@/external/repositories/postgres/helpers"
import { NextFunction, Request, Response } from "express"
import { verify } from "jsonwebtoken"

interface JwtPayloadProps {
  id_user: string
}

export default function can(permissionsRoutes: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { authorization } = req.headers

    const [, token] = authorization.split(" ")

    const { id_user } = verify(
      token,
      process.env.JWT_SECRET_KEY,
    ) as JwtPayloadProps

    const user = await prisma.user.findFirst({
      where: {
        id_user,
      },
    })

    if (!user) {
      return res.status(400).json({ message: "User does not exists." })
    }

    const permissionExists = permissionsRoutes
      .map((permission) => permission)
      .some((permission) => user.role.includes(permission))

    if (!permissionExists) {
      return res.status(401).end()
    }

    return next()
  }
}
