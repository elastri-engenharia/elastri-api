import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/constructions", async (req, res) => {
    const constructions = await prisma.construction.findMany()

    return constructions
      ? res.status(200).json({ constructions })
      : res.status(400).json({ message: "No record found for constructions." })
  })
}
