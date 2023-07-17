import { prisma } from "@/external/repositories/postgres/helpers"
import can from "@/presentation/middleware/acl"
import auth from "@/presentation/middleware/authentication"
import { Router } from "express"

export default (router: Router) => {
  router.get(
    "/collaborators",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC", "ACCESS_ADMIN_SNACK"]),
    async (req, res) => {
      const collaborators = await prisma.collaborator.findMany()
      return collaborators
        ? res.status(200).json({ collaborators })
        : res.status(400).json({ message: "No record found for collaborator." })
    },
  )

  router.get(
    "/collaborators/:id_collaborator/collaborator",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC", "ACCESS_ADMIN_SNACK"]),
    async (req, res) => {
      const { id_collaborator } = req.params

      const collaborator = await prisma.collaborator.findFirst({
        where: {
          id_collaborator,
        },
      })

      return collaborator
        ? res.status(200).json({ collaborator })
        : res.status(400).json({ message: "Collaborator not found." })
    },
  )

  router.post(
    "/collaborators/create",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC", "ACCESS_ADMIN_SNACK"]),
    async (req, res) => {
      const {
        matriculation,
        name_collaborator,
        office_collaborator,
        disabled_collaborator,
        responsible,
        construction_idConstruction,
      } = req.body

      const collaboratorOrNotFound = await prisma.collaborator.findFirst({
        where: {
          matriculation,
        },
      })

      const constructionOrNotFound = await prisma.construction.findFirst({
        where: {
          id_construction: construction_idConstruction,
        },
      })

      if (collaboratorOrNotFound)
        return res.status(400).json({ message: "Collaborator already exists." })

      if (!constructionOrNotFound)
        return res.status(400).json({ message: "Construction not found." })

      const collaborator = await prisma.collaborator.create({
        data: {
          matriculation,
          name_collaborator,
          office_collaborator,
          disabled_collaborator,
          responsible,
          construction_idConstruction: {
            connect: {
              id_construction: construction_idConstruction,
            },
          },
        },
      })

      return collaborator
        ? res.status(201).json({ collaborator })
        : res.status(400).json({ message: "Unable to register collaborator." })
    },
  )

  router.put(
    "/collaborators/:id_collaborator/update",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC", "ACCESS_ADMIN_SNACK"]),
    async (req, res) => {
      const { id_collaborator } = req.params

      const {
        matriculation,
        name_collaborator,
        office_collaborator,
        disabled_collaborator,
        responsible,
        construction_idConstruction,
      } = req.body

      const collaboratorIsInNotUse = await prisma.collaborator.findFirst({
        where: {
          NOT: {
            id_collaborator,
          },
          AND: {
            matriculation,
          },
        },
      })

      const constructionOrNotFound = await prisma.construction.findFirst({
        where: {
          id_construction: construction_idConstruction,
        },
      })

      if (collaboratorIsInNotUse)
        return res
          .status(400)
          .json({ message: "Sorry matriculation is in use." })

      if (!constructionOrNotFound)
        return res.status(400).json({ message: "Construction not found." })

      const updatedCollaborator = await prisma.collaborator.update({
        where: {
          id_collaborator,
        },
        data: {
          matriculation,
          name_collaborator,
          office_collaborator,
          disabled_collaborator,
          responsible,
          construction_idConstruction: {
            connect: {
              id_construction: construction_idConstruction,
            },
          },
        },
      })

      return updatedCollaborator
        ? res.status(200).json({ updatedCollaborator })
        : res
            .status(400)
            .json({ message: "Unable to update this collaborator." })
    },
  )
}
