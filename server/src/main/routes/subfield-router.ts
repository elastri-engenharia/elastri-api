import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/subfields", async (req, res) => {
    const subfields = await prisma.subField.findMany()

    return subfields
      ? res.status(200).json({ subfields })
      : res.status(400).json({ message: "No record found for garnde." })
  })
}
