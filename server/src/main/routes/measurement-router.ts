import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/measurements", async (req, res) => {
    const measurements = await prisma.measurement.findMany()

    return measurements
      ? res.status(200).json({ measurements })
      : res.status(400).json({ message: "No record  found for measurement." })
  })

  router.get("/measurements/:id_measurement/measurement", async (req, res) => {
    const { id_measurement } = req.params

    const measurement = await prisma.measurement.findFirst({
      where: {
        id_measurement,
      },
    })

    return measurement
      ? res.status(200).json({
          measurement,
        })
      : res.status(400).json({ message: "Measured not found." })
  })

  router.post("/measurements/create", async (req, res) => {
    const { name_measurement, symbol } = req.body

    const measurementOrNotFound = await prisma.measurement.findFirst({
      where: {
        symbol,
      },
    })

    if (measurementOrNotFound)
      return res.status(400).json({ message: "Sorry symbol is in use." })

    const measurement = await prisma.measurement.create({
      data: {
        name_measurement,
        symbol,
      },
    })

    return measurement
      ? res.status(201).json({ measurement })
      : res.status(400).json({ message: "Unable to register measurement." })
  })
}
