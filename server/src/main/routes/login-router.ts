import { compare } from "@/external/encoder/bcrypt-compare"
import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"
import { sign } from "jsonwebtoken"

export default (router: Router) => {
  router.post("/login", async (req, res) => {
    try {
      const { username, password } = req.body

      const user = await prisma.user.findFirst({
        where: {
          username,
        },
      })

      if (username !== user.username)
        return res
          .status(400)
          .json({ message: "Username or password incorrect." })

      if (!(await compare(password, user.password)))
        return res
          .status(400)
          .json({ message: "Username or password incorrect." })

      const token = sign(
        { id_user: user.id_user, username: user.username, role: user.role },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "1h",
        },
      )

      return res.status(200).json({
        id_user: user.id_user,
        username: user.username,
        role: user.role,
        token: token,
      })
    } catch (error) {
      return res.status(400).json({ error: error.message })
    }
  })
}
