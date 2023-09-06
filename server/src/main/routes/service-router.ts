import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

import can from "@/presentation/middleware/acl"
import auth from "@/presentation/middleware/authentication"

export default (router: Router) => {
  router.get(
    "/services",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const services = await prisma.service.findMany({
        select: {
          id_service: true,
          code_service: true,
          name_service: true,
          code_totvs: true,
          activity: true,
          garden: {
            select: {
              id_garden: true,
              name: true,
            },
          },
          subfield: {
            select: {
              id_subField: true,
              name: true,
            },
          },
          undMeasure: {
            select: {
              id_measurement: true,
              symbol: true,
            },
          },
          Area: {
            select: {
              id_area: true,
            },
          },
          foreseen: true,
          advance: true,
          construction_idConstruction: {
            select: {
              id_construction: true,
              code_construction: true,
              name_construction: true,
            },
          },
          collaborator_idCollaborator: {
            select: {
              id_collaborator: true,
              matriculation: true,
              name_collaborator: true,
            },
          },
          disabled_service: true,
        },
      })

      return services
        ? res.status(200).json({ services })
        : res.status(400).json({ message: "No record found for services." })
    },
  )

  router.get(
    "/services/:id_service/service",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const { id_service } = req.params

      const service = await prisma.service.findFirst({
        where: {
          id_service,
        },
        select: {
          id_service: true,
          code_service: true,
          name_service: true,
          code_totvs: true,
          activity: true,
          garden: {
            select: {
              id_garden: true,
              name: true,
            },
          },
          subfield: {
            select: {
              id_subField: true,
              name: true,
            },
          },
          undMeasure: {
            select: {
              id_measurement: true,
              symbol: true,
            },
          },
          Area: {
            select: {
              id_area: true,
            },
          },
          foreseen: true,
          advance: true,
          construction_idConstruction: {
            select: {
              id_construction: true,
              code_construction: true,
              name_construction: true,
            },
          },
          collaborator_idCollaborator: {
            select: {
              id_collaborator: true,
              matriculation: true,
              name_collaborator: true,
            },
          },
          disabled_service: true,
        },
      })

      return service
        ? res.status(200).json({ service })
        : res.status(400).json({ message: "Service not found." })
    },
  )

  router.post(
    "/services/create",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const {
        code_service,
        name_service,
        code_totvs,
        activity,
        gardenId_garden,
        subFieldId_subField,
        measurementId_measurement,
        areaId_area,
        foreseen,
        advance,
        constructionId_construction,
        collaborator_idCollaborator,
        disabled_service,
      } = req.body

      const data: {
        code_service: string
        name_service: string
        code_totvs: string
        activity: string
        garden: { connect: { id_garden: string } }
        subfield?: { connect: { id_subField: string } }
        undMeasure: { connect: { id_measurement: string } }
        Area?: { connect: { id_area: string } }
        foreseen: string
        advance: string
        construction_idConstruction: { connect: { id_construction: string } }
        collaborator_idCollaborator?: { connect: { id_collaborator: string } }
        disabled_service: boolean
      } = {
        code_service,
        name_service,
        code_totvs,
        activity,
        garden: { connect: { id_garden: gardenId_garden } },
        undMeasure: { connect: { id_measurement: measurementId_measurement } },
        foreseen,
        advance,
        construction_idConstruction: {
          connect: { id_construction: constructionId_construction },
        },
        disabled_service,
      }

      const serviceOrNotFound = await prisma.service.findFirst({
        where: {
          code_service,
        },
      })

      if (serviceOrNotFound)
        return res.status(400).json({ message: "Service already exists." })

      if (subFieldId_subField?.length) {
        data.subfield = { connect: { id_subField: subFieldId_subField } }
      }

      if (areaId_area?.length) {
        data.Area = { connect: { id_area: areaId_area } }
      }

      if (collaborator_idCollaborator?.length) {
        data.collaborator_idCollaborator = {
          connect: { id_collaborator: collaborator_idCollaborator },
        }
      }

      const service = await prisma.service.create({ data })

      return service
        ? res.status(201).json({ service })
        : res.status(400).json({ message: "Unable to register service." })
    },
  )

  router.put(
    "/services/:id_service/update",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const { id_service } = req.params

      const {
        code_service,
        name_service,
        code_totvs,
        activity,
        gardenId_garden,
        subFieldId_subField,
        measurementId_measurement,
        areaId_area,
        foreseen,
        advance,
        constructionId_construction,
        collaborator_idCollaborator,
        disabled_service,
      } = req.body

      const data: {
        code_service: string
        name_service: string
        code_totvs: string
        activity: string
        garden: { connect: { id_garden: string } }
        subfield?: { connect: { id_subField: string } }
        undMeasure: { connect: { id_measurement: string } }
        Area?: { connect: { id_area: string } }
        foreseen: string
        advance: string
        construction_idConstruction: { connect: { id_construction: string } }
        collaborator_idCollaborator?: {
          set?: []
          connect?: [
            {
              id_collaborator: string
            },
          ]
        }
        disabled_service: boolean
      } = {
        code_service,
        name_service,
        code_totvs,
        activity,
        garden: { connect: { id_garden: gardenId_garden } },
        undMeasure: { connect: { id_measurement: measurementId_measurement } },
        foreseen,
        advance,
        construction_idConstruction: {
          connect: { id_construction: constructionId_construction },
        },
        disabled_service,
      }

      const serviceIsInNotUse = await prisma.service.findFirst({
        where: {
          NOT: {
            id_service,
          },
          AND: {
            code_service,
          },
        },
      })

      if (serviceIsInNotUse)
        return res.status(400).json({ message: "Sorry service is in use." })

      if (subFieldId_subField?.length) {
        data.subfield = { connect: { id_subField: subFieldId_subField } }
      }

      if (areaId_area?.length) {
        data.Area = { connect: { id_area: areaId_area } }
      }

      if (collaborator_idCollaborator?.length) {
        data.collaborator_idCollaborator = {
          set: [],
          connect: collaborator_idCollaborator,
        }
      } else {
        data.collaborator_idCollaborator = {
          set: [],
        }
      }

      const serviceUpdated = await prisma.service.update({
        where: {
          id_service,
        },
        data,
      })

      return serviceUpdated
        ? res.status(200).json({ serviceUpdated })
        : res.status(400).json({ message: "Unable to register service." })
    },
  )
}
