import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/thirds", async (req, res) => {
    const thirds = await prisma.third.findMany()

    return thirds
      ? res.status(200).json({ thirds })
      : res.status(400).json({ message: "No record found third." })
  })
}
