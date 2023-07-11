import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/collaborators", async (req, res) => {
    const collaborators = await prisma.collaborator.findMany()
    return collaborators
      ? res.status(200).json({ collaborators })
      : res.status(400).json({ message: "No record found for collaborator." })
  })

  router.get(
    "/collaborators/:id_collaborator/collaborator",
    async (req, res) => {
      const { id_collaborator } = req.params

      const collaborator = await prisma.collaborator.findFirst({
        where: {
          id_collaborator,
        },
      })

      return collaborator
        ? res.status(200).json({ collaborator })
        : res.status(400).json({ message: "Collaborator not found." })
    },
  )
}
