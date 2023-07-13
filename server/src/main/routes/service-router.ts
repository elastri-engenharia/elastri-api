import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/services", async (req, res) => {
    const services = await prisma.service.findMany({
      select: {
        id_service: true,
        code_service: true,
        name_service: true,
        code_totvs: true,
        activity: true,
        garden: {
          select: {
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
  })

  router.get("/services/:id_service/service", async (req, res) => {
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
  })

  router.post("/services/create", async (req, res) => {
    const {
      code_service,
      name_service,
      code_totvs,
      activity,
      gardenId_garden,
      subFieldId_subField,
      measurementId_measurement,
      foreseen,
      advance,
      constructionId_construction,
      collaborator_idCollaborator,
      disabled_service,
    } = req.body

    const verifySubField = subFieldId_subField ? subFieldId_subField : undefined

    const serviceOrNotFound = await prisma.service.findFirst({
      where: {
        code_service,
      },
    })

    if (serviceOrNotFound)
      return res.status(400).json({ message: "Service already exists." })

    if (typeof verifySubField === "undefined") {
      const service = await prisma.service.create({
        data: {
          code_service,
          name_service,
          code_totvs,
          activity,
          garden: {
            connect: {
              id_garden: gardenId_garden,
            },
          },
          undMeasure: {
            connect: {
              id_measurement: measurementId_measurement,
            },
          },
          foreseen,
          advance,
          disabled_service,
          collaborator_idCollaborator: {
            connect: {
              id_collaborator: collaborator_idCollaborator,
            },
          },
          construction_idConstruction: {
            connect: {
              id_construction: constructionId_construction,
            },
          },
        },
      })

      return service
        ? res.status(201).json({ service })
        : res.status(400).json({ message: "Unable to register service." })
    }

    const createdService = await prisma.service.create({
      data: {
        code_service,
        name_service,
        code_totvs,
        activity,
        garden: {
          connect: {
            id_garden: gardenId_garden,
          },
        },
        subfield: {
          connect: {
            id_subField: subFieldId_subField,
          },
        },
        undMeasure: {
          connect: {
            id_measurement: measurementId_measurement,
          },
        },
        foreseen,
        advance,
        disabled_service,
        collaborator_idCollaborator: {
          connect: {
            id_collaborator: collaborator_idCollaborator,
          },
        },
        construction_idConstruction: {
          connect: {
            id_construction: constructionId_construction,
          },
        },
      },
    })

    return createdService
      ? res.status(201).json({ createdService })
      : res.status(400).json({ message: "Unable to register service." })
  })
}
