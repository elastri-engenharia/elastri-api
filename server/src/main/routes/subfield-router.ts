import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/subfields", async (req, res) => {
    const subfields = await prisma.subField.findMany()

    return subfields
      ? res.status(200).json({ subfields })
      : res.status(400).json({ message: "No record found for garnde." })
  })

  router.get("/subfields/:id_subField/subfield", async (req, res) => {
    const { id_subField } = req.params

    const subfield = await prisma.subField.findFirst({
      where: {
        id_subField,
      },
    })

    return subfield
      ? res.status(200).json({ subfield })
      : res.status(400).json({ message: "SubField not found." })
  })
}
