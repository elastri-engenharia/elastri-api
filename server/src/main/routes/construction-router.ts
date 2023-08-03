import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

import can from "@/presentation/middleware/acl"
import auth from "@/presentation/middleware/authentication"

export default (router: Router) => {
  router.get(
    "/constructions",
    auth,
    can(["ADMIN", "ACCESS_ADMIN"]),
    async (req, res) => {
      const constructions = await prisma.construction.findMany({
        include: {
          users: true,
        },
      })

      return constructions
        ? res.status(200).json({ constructions })
        : res
            .status(400)
            .json({ message: "No record found for constructions." })
    },
  )

  router.get(
    "/constructions/:id_construction/construction",
    auth,
    can(["ADMIN", "ACCESS_ADMIN"]),
    async (req, res) => {
      const { id_construction } = req.params

      const construction = await prisma.construction.findFirst({
        where: {
          id_construction,
        },
        include: {
          users: true,
        },
      })

      return construction
        ? res.status(200).json({ construction })
        : res.status(400).json({ message: "Construction not found." })
    },
  )

  router.post(
    "/constructions/create",
    auth,
    can(["ADMIN", "ACCESS_ADMIN"]),
    async (req, res) => {
      const { code_construction, name_construction } = req.body

      const constructionOrNotFound = await prisma.construction.findFirst({
        where: {
          code_construction,
        },
      })

      if (constructionOrNotFound)
        return res.status(400).json({ message: "Construction already exists." })

      const construction = await prisma.construction.create({
        data: {
          code_construction,
          name_construction,
        },
      })

      return construction
        ? res.status(201).json({ construction })
        : res.status(400).json({ message: "Unable to register construction." })
    },
  )

  router.patch(
    "/constructions/:id_construction/update",
    auth,
    can(["ADMIN", "ACCESS_ADMIN"]),
    async (req, res) => {
      const { id_construction } = req.params

      const { code_construction, name_construction, users } = req.body

      console.log(users)

      const constructionIsInNotUse = await prisma.construction.findFirst({
        where: {
          NOT: {
            id_construction,
          },
          AND: {
            code_construction,
          },
        },
      })

      if (constructionIsInNotUse)
        return res
          .status(400)
          .json({ message: "Sorry code_construction is in use." })

      const updatedConstruction = await prisma.construction.update({
        where: {
          id_construction,
        },
        data: {
          code_construction,
          name_construction,
          users: {
            set: users,
          },
        },
      })

      return updatedConstruction
        ? res.status(200).json({ updatedConstruction })
        : res
            .status(400)
            .json({ message: "Unable to update this construction." })
    },
  )
}
