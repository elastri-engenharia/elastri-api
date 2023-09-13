import { prisma } from "@/external/repositories/postgres/helpers"

import can from "@/presentation/middleware/acl"
import auth from "@/presentation/middleware/authentication"

import { multerConfig } from "@/presentation/middleware/multer"
import * as XLSX from "xlsx"
import * as fs from "fs"

import { Gender } from "@prisma/client"
import { Router } from "express"
import { encoder } from "@/external/encoder/bcrypt-encoder"

interface CollaboratorProps {
  id_collaborator?: string
  matriculation: string
  name_collaborator: string
  office_collaborator: string
  city: string
  gender: any
  disabled_collaborator: string
  responsible: string
  admission_date: string
  resignation_date?: string
  userId_user?: string
  constructionId_construction: string
}

export default (router: Router) => {
  router.get("/collaborators/gender", async (req, res) => {
    const genders = Gender

    return res.status(200).json({ genders })
  })

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
        city,
        gender,
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
            city,
            gender,
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
          city,
          gender,
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
        city,
        gender,
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
            city,
            gender,
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
          city,
          gender,
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

  router.post(
    "/collaborators/import",
    multerConfig.single("importCollaborator"),
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const { file } = req

      if (!file) {
        return res.status(400).json({ error: "No file uploaded" })
      }

      const filePath = file.path

      const wb = XLSX.readFile(filePath)

      const sheetNames = wb.SheetNames
      const firstSheetName = sheetNames[0]
      const firstSheet = wb.Sheets[firstSheetName]

      const jsonData = XLSX.utils.sheet_to_json(
        firstSheet,
      ) as Array<CollaboratorProps>

      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Error deleting file:", err)
        }
      })

      try {
        const createdCollaborators = await Promise.all(
          jsonData.map(async (collaboratorData) => {
            const resignationDate = collaboratorData.resignation_date
              ? collaboratorData.resignation_date
              : ""
            const disabledCollaborator = resignationDate ? true : false

            const constructionID = await prisma.construction.findFirst({
              where: {
                code_construction: collaboratorData.constructionId_construction,
              },
            })

            const generatingDefaultUsernameAndPassword =
              collaboratorData.name_collaborator
                .split(" ")[0]
                .toLocaleLowerCase() + collaboratorData.matriculation

            const passwordEncrypted = await encoder(
              generatingDefaultUsernameAndPassword,
            )

            const generatingDefaultEmail =
              generatingDefaultUsernameAndPassword + "@example.com.br"

            const thereIsAResponsibleCollaborator =
              collaboratorData.responsible === "true"

            const data: {
              matriculation: string
              name_collaborator: string
              office_collaborator: string
              city: string
              gender: any
              disabled_collaborator: boolean
              responsible: boolean
              admission_date: string
              construction_idConstruction: {
                connect: {
                  code_construction: string
                }
              }
              user_idUser?: {
                disconnect: true
                connect: {
                  id_user: string
                }
              }
            } = {
              matriculation: String(collaboratorData.matriculation),
              name_collaborator:
                collaboratorData.name_collaborator.toUpperCase(),
              office_collaborator:
                collaboratorData.office_collaborator.toUpperCase(),
              gender: collaboratorData.gender.toUpperCase(),
              city: collaboratorData.city.toUpperCase(),
              disabled_collaborator: disabledCollaborator,
              responsible: collaboratorData.responsible === "true",
              admission_date: collaboratorData.admission_date,
              construction_idConstruction: {
                connect: {
                  code_construction:
                    collaboratorData.constructionId_construction,
                },
              },
            }

            let responsibleContributorUserCreated

            if (thereIsAResponsibleCollaborator) {
              responsibleContributorUserCreated = await prisma.user.upsert({
                where: {
                  username: generatingDefaultUsernameAndPassword,
                },
                update: {
                  username: generatingDefaultUsernameAndPassword,
                  password: passwordEncrypted,
                  role: "ACCESS_FUNC_RDC",
                  email: generatingDefaultEmail,
                  construction: {
                    connect: {
                      id_construction: constructionID.id_construction,
                    },
                  },
                },
                create: {
                  username: generatingDefaultUsernameAndPassword,
                  password: passwordEncrypted,
                  role: "ACCESS_FUNC_RDC",
                  email: generatingDefaultEmail,
                  construction: {
                    connect: {
                      id_construction: constructionID.id_construction,
                    },
                  },
                },
                select: {
                  id_user: true,
                },
              })
            }

            if (responsibleContributorUserCreated?.length) {
              data.user_idUser = {
                disconnect: true,
                connect: {
                  id_user: responsibleContributorUserCreated,
                },
              }
            }

            const collaboratorExistsOrNot = await prisma.collaborator.findFirst(
              {
                where: {
                  matriculation: data.matriculation,
                },
                select: {
                  matriculation: true,
                },
              },
            )

            if (!collaboratorExistsOrNot) {
              return await prisma.collaborator.create({
                data,
              })
            }

            return await prisma.collaborator.update({
              where: {
                matriculation: data.matriculation,
              },
              data,
            })
          }),
        )

        return res.status(201).json({ createdCollaborators })
      } catch (error) {
        console.error("Error creating collaborators:", error)
        return res
          .status(400)
          .json({ message: "Unable to register collaborators." })
      }
    },
  )
}
