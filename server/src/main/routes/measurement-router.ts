import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/measurements", async (req, res) => {
    const measurements = await prisma.measurement.findMany()

    return measurements
      ? res.status(200).json({ measurements })
      : res.status(400).json({ message: "No record  found for measurement." })
  })
}
