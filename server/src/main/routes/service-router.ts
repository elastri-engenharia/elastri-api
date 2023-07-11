import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/services", async (req, res) => {
    const services = await prisma.service.findMany()

    return services
      ? res.status(200).json({ services })
      : res.status(400).json({ message: "No record found for services." })
  })
}
