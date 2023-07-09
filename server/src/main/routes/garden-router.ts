import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/garden", async (req, res) => {
    const garden = await prisma.garden.findMany()

    return garden
      ? res.status(200).json({ garden })
      : res.status(400).json({ message: "No record found for garden." })
  })
}
