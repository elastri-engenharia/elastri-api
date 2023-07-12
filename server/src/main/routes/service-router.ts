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
        disabled_service: true,
      },
    })

    return service
      ? res.status(200).json({ service })
      : res.status(400).json({ message: "Service not found." })
  })
}
