import { prisma } from "@/external/repositories/postgres/helpers"
import can from "@/presentation/middleware/acl"
import auth from "@/presentation/middleware/authentication"
import { Router } from "express"

export default (router: Router) => {
  router.get(
    "/gardens",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const garden = await prisma.garden.findMany()

      return garden
        ? res.status(200).json({ garden })
        : res.status(400).json({ message: "No record found for garden." })
    },
  )

  router.get(
    "/gardens/:id_garden/garden",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const { id_garden } = req.params

      const garden = await prisma.garden.findFirst({
        where: {
          id_garden,
        },
      })

      return garden
        ? res.status(200).json({ garden })
        : res.status(400).json({ message: "Garden not found." })
    },
  )

  router.post(
    "/gardens/create",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const { name } = req.body

      const gardenOrNotFound = await prisma.garden.findFirst({
        where: {
          name,
        },
      })

      if (gardenOrNotFound)
        return res.status(400).json({ message: "Gardem already exists." })

      const garden = await prisma.garden.create({
        data: {
          name,
        },
      })

      return garden
        ? res.status(201).json({ garden })
        : res.status(400).json({ message: "Unable to register garden." })
    },
  )

  router.patch(
    "/gardens/:id_garden/update",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const { id_garden } = req.params

      const { name } = req.body

      const gardenOrNotFound = await prisma.garden.findFirst({
        where: {
          NOT: {
            id_garden,
          },
          AND: {
            name,
          },
        },
      })

      if (gardenOrNotFound)
        return res.status(400).json({ message: "Sorry name is in use." })

      const garden = await prisma.garden.update({
        where: {
          id_garden,
        },
        data: {
          name,
        },
      })

      return garden
        ? res.status(200).json({ garden })
        : res.status(400).json({ message: "Unable to update this garden." })
    },
  )
}
