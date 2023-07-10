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

  router.get("/companys/:id_company/company", async (req, res) => {
    const { id_company } = req.params

    const company = await prisma.company.findFirst({
      where: {
        id_company,
      },
    })

    return company
      ? res.status(200).json({ company })
      : res.status(400).json({ message: "Company not found." })
  })

  router.post("/companys/create", async (req, res) => {
    const { company_name } = req.body

    const companyOrNotFound = await prisma.company.findFirst({
      where: {
        company_name,
      },
    })

    if (companyOrNotFound)
      return res.status(400).json({ message: "Company already exists." })

    const company = await prisma.company.create({
      data: {
        company_name,
      },
    })

    return company
      ? res.status(201).json({ company })
      : res.status(400).json({ message: "Unable to register company." })
  })
}
