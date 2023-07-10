import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/thirds", async (req, res) => {
    const thirds = await prisma.third.findMany()

    return thirds
      ? res.status(200).json({ thirds })
      : res.status(400).json({ message: "No record found third." })
  })

  router.get("/thirds/:id_third/third", async (req, res) => {
    const { id_third } = req.params

    const third = await prisma.third.findFirst({
      where: {
        id_third,
      },
    })

    return third
      ? res.status(200).json({ third })
      : res.status(400).json({ message: "Third nor found." })
  })
}
