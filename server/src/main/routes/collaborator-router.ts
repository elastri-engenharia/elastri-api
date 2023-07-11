import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/collaborators", async (req, res) => {
    const collaborators = await prisma.collaborator.findMany()
    return collaborators
      ? res.status(200).json({ collaborators })
      : res.status(400).json({ message: "Collaborator not found." })
  })
}
