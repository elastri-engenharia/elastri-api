import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

import can from "@/presentation/middleware/acl"
import auth from "@/presentation/middleware/authentication"

export default (router: Router) => {
  router.get(
    "/measurements",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const measurements = await prisma.measurement.findMany()

      return measurements
        ? res.status(200).json({ measurements })
        : res.status(400).json({ message: "No record  found for measurement." })
    },
  )

  router.get(
    "/measurements/:id_measurement/measurement",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
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
    },
  )

  router.post(
    "/measurements/create",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
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
    },
  )

  router.patch(
    "/measurements/:id_measurement/update",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const { id_measurement } = req.params

      const { name_measurement, symbol } = req.body

      const measurementIsInNotUse = await prisma.measurement.findFirst({
        where: {
          NOT: {
            id_measurement,
          },
          AND: {
            symbol,
          },
        },
      })

      if (measurementIsInNotUse)
        return res.status(400).json({ message: "Sorry symbol is in use." })

      const measurement = await prisma.measurement.update({
        where: {
          id_measurement,
        },
        data: {
          name_measurement,
          symbol,
        },
      })

      return measurement
        ? res.status(200).json({ measurement })
        : res
            .status(400)
            .json({ message: "Unable to update this measurement." })
    },
  )
}
