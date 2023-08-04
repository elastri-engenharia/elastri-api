import { prisma } from "@/external/repositories/postgres/helpers"
import can from "@/presentation/middleware/acl"
import auth from "@/presentation/middleware/authentication"
import { Router } from "express"

export default (router: Router) => {
  router.get(
    "/collaborators",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const collaborators = await prisma.collaborator.findMany({
        include: {
          construction_idConstruction: true,
          user_idUser: true,
        },
      })
      return collaborators
        ? res.status(200).json({ collaborators })
        : res.status(400).json({ message: "No record found for collaborator." })
    },
  )

  router.get(
    "/collaborators/:id_collaborator/collaborator",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
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
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      let disabled_collaborator = false

      const {
        matriculation,
        name_collaborator,
        office_collaborator,
        responsible,
        admission_date,
        resignation_date,
        construction_idConstruction,
        user_idUser,
      } = req.body

      resignation_date?.length
        ? (disabled_collaborator = true)
        : disabled_collaborator

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

      if (user_idUser?.length) {
        const collaborator = await prisma.collaborator.create({
          data: {
            matriculation,
            name_collaborator,
            office_collaborator,
            disabled_collaborator,
            responsible,
            admission_date,
            resignation_date,
            construction_idConstruction: {
              connect: {
                id_construction: construction_idConstruction,
              },
            },
            user_idUser: {
              connect: {
                id_user: user_idUser,
              },
            },
          },
        })

        return collaborator
          ? res.status(201).json({ collaborator })
          : res
              .status(400)
              .json({ message: "Unable to register collaborator." })
      }

      const collaborator = await prisma.collaborator.create({
        data: {
          matriculation,
          name_collaborator,
          office_collaborator,
          disabled_collaborator,
          responsible,
          admission_date,
          resignation_date,
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
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const { id_collaborator } = req.params
      let disabled_collaborator = false

      const {
        matriculation,
        name_collaborator,
        office_collaborator,
        responsible,
        admission_date,
        resignation_date,
        construction_idConstruction,
        user_idUser,
      } = req.body

      resignation_date?.length
        ? (disabled_collaborator = true)
        : disabled_collaborator

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

      if (user_idUser?.length) {
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
            admission_date,
            resignation_date,
            construction_idConstruction: {
              connect: {
                id_construction: construction_idConstruction,
              },
            },
            user_idUser: {
              connect: {
                id_user: user_idUser,
              },
            },
          },
        })

        return updatedCollaborator
          ? res.status(200).json({ updatedCollaborator })
          : res
              .status(400)
              .json({ message: "Unable to update this collaborator." })
      }

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
          admission_date,
          resignation_date,
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
