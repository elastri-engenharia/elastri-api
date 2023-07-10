import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/companys", async (req, res) => {
    const companys = await prisma.company.findMany()

    return companys
      ? res.status(200).json({ companys })
      : res.status(400).json({
          message: "No record found for company.",
        })
  })
}
