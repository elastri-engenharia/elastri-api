import { Router } from "express"

import { prisma } from "@/external/repositories/postgres/helpers"
import { Role } from "@prisma/client"
import { encoder } from "@/external/encoder/bcrypt-encoder"

import auth from "@/presentation/middleware/authentication"
import can from "@/presentation/middleware/acl"

export default (router: Router) => {
  router.get("/users/roles", auth, can(["ADMIN"]), async (req, res) => {
    const roles = Role

    return res.status(200).json({ roles })
  })

  router.get(
    "/users",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const users = await prisma.user.findMany()

      return res.status(200).json({ users })
    },
  )

  router.post(
    "/users/create",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const { username, email, password, role } = req.body

      const userExists = await prisma.user.findFirst({
        where: {
          OR: [{ email: email }, { username: username }],
        },
      })

      if (userExists) {
        return res
          .status(400)
          .json({ message: "Username or Email already exists" })
      }

      const passwordEncrypted = await encoder(password)

      const users = await prisma.user.create({
        data: {
          username,
          email,
          password: passwordEncrypted,
          role,
        },
      })

      return res.status(201).json({ users })
    },
  )

  router.get(
    "/users/:id_user/user",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC", "ACCESS_FUNC_RDC"]),
    async (req, res) => {
      const { id_user } = req.params

      const user = await prisma.user.findFirst({
        where: {
          id_user,
        },
      })

      return user
        ? res.status(200).json({ user })
        : res.status(400).json({ message: "User not found" })
    },
  )

  router.put(
    "/users/:id_user/update",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC", "ACCESS_FUNC_RDC"]),
    async (req, res) => {
      const { id_user } = req.params
      const { username, email, password, role } = req.body

      const usernameOrNotFound = await prisma.user.findFirst({
        where: {
          id_user: {
            not: id_user,
          },
          AND: { username },
        },
      })

      const emailOrNotFound = await prisma.user.findFirst({
        where: {
          id_user: {
            not: id_user,
          },
          AND: { email },
        },
      })

      if (usernameOrNotFound) {
        return res.status(400).json({ message: "Sorry username is in use." })
      }

      if (emailOrNotFound) {
        return res.status(400).json({ message: "Sorry email is in email." })
      }

      const userUpdated = await prisma.user.update({
        where: {
          id_user,
        },
        data: {
          username,
          email,
          password,
          role,
        },
      })

      return userUpdated
        ? res.status(200).json({ userUpdated })
        : res.status(400).json({ message: "Unable to update this user." })
    },
  )
}
