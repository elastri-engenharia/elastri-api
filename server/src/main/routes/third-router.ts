import { prisma } from "@/external/repositories/postgres/helpers"
import can from "@/presentation/middleware/acl"
import auth from "@/presentation/middleware/authentication"
import { Router } from "express"

export default (router: Router) => {
  router.get(
    "/thirds",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const thirds = await prisma.third.findMany()

      return thirds
        ? res.status(200).json({ thirds })
        : res.status(400).json({ message: "No record found third." })
    },
  )

  router.get(
    "/thirds/:id_third/third",
    auth,
    can(["ADMIN", "ACCESS_ADMIN"]),
    async (req, res) => {
      const { id_third } = req.params

      const third = await prisma.third.findFirst({
        where: {
          id_third,
        },
      })

      return third
        ? res.status(200).json({ third })
        : res.status(400).json({ message: "Third nor found." })
    },
  )

  router.post(
    "/thirds/create",
    auth,
    can(["ADMIN", "ACCESS_ADMIN"]),
    async (req, res) => {
      const {
        code_third,
        name_third,
        disabled_third,
        construction_idConstruction,
      } = req.body

      const thirdOrNotFound = await prisma.third.findFirst({
        where: {
          code_third,
        },
      })

      const constructionOrNotFound = await prisma.construction.findFirst({
        where: {
          id_construction: construction_idConstruction,
        },
      })

      if (thirdOrNotFound)
        return res.status(400).json({ message: "Third already exists." })

      if (!constructionOrNotFound)
        return res.status(400).json({ message: "Construction not found." })

      const construction = await prisma.third.create({
        data: {
          code_third,
          name_third,
          disabled_third,
          construction_idConstruction: {
            connect: {
              id_construction: construction_idConstruction,
            },
          },
        },
      })

      return construction
        ? res.status(200).json({ construction })
        : res.status(400).json({ message: "Unable to register third." })
    },
  )

  router.patch(
    "/thirds/:id_third/update",
    auth,
    can(["ADMIN", "ACCESS_ADMIN"]),
    async (req, res) => {
      const { id_third } = req.params

      const {
        code_third,
        name_third,
        disabled_third,
        construction_idConstruction,
      } = req.body

      const thirdIsInNotUse = await prisma.third.findFirst({
        where: {
          NOT: {
            id_third,
          },
          AND: {
            code_third,
          },
        },
      })

      const constructionOrNotFound = await prisma.construction.findFirst({
        where: {
          id_construction: construction_idConstruction,
        },
      })

      if (thirdIsInNotUse)
        return res.status(400).json({ message: "Sorry code_third is in use." })

      if (!constructionOrNotFound)
        return res.status(400).json({ message: "Construction not found." })

      const updatedThird = await prisma.third.update({
        where: {
          id_third,
        },
        data: {
          code_third,
          name_third,
          disabled_third,
          construction_idConstruction: {
            connect: {
              id_construction: construction_idConstruction,
            },
          },
        },
      })

      return updatedThird
        ? res.status(200).json({ updatedThird })
        : res.status(400).json({ message: "Unable to update this third." })
    },
  )
}
