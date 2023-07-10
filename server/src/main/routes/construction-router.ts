import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/constructions", async (req, res) => {
    const constructions = await prisma.construction.findMany()

    return constructions
      ? res.status(200).json({ constructions })
      : res.status(400).json({ message: "No record found for constructions." })
  })

  router.get(
    "/constructions/:id_construction/construction",
    async (req, res) => {
      const { id_construction } = req.params

      const construction = await prisma.construction.findFirst({
        where: {
          id_construction,
        },
      })

      return construction
        ? res.status(200).json({ construction })
        : res.status(400).json({ message: "Construction not found." })
    },
  )
}
