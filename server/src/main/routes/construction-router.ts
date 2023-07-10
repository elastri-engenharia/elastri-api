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

  router.post("/constructions/create", async (req, res) => {
    const { code_construction, name_construction, company_idCompany } = req.body

    const constructionOrNotFound = await prisma.construction.findFirst({
      where: {
        code_construction,
      },
    })

    const companyOrNotFound = await prisma.company.findFirst({
      where: {
        id_company: company_idCompany,
      },
    })

    if (constructionOrNotFound)
      return res.status(400).json({ message: "Construction already exists." })

    if (!companyOrNotFound)
      return res.status(404).json({ message: "Company not found." })

    const construction = await prisma.construction.create({
      data: {
        code_construction,
        name_construction,
        company_idCompany: {
          connect: {
            id_company: company_idCompany,
          },
        },
      },
    })

    return construction
      ? res.status(201).json({ construction })
      : res.status(400).json({ message: "Unable to register construction." })
  })
}
