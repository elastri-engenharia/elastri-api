import { prisma } from "@/external/repositories/postgres/helpers"
import can from "@/presentation/middleware/acl"
import auth from "@/presentation/middleware/authentication"
import { Router } from "express"

export default (router: Router) => {
  router.get(
    "/subfields",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const subfields = await prisma.subField.findMany()

      return subfields
        ? res.status(200).json({ subfields })
        : res.status(400).json({ message: "No record found for garnde." })
    },
  )

  router.get(
    "/subfields/:id_subField/subfield",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const { id_subField } = req.params

      const subfield = await prisma.subField.findFirst({
        where: {
          id_subField,
        },
      })

      return subfield
        ? res.status(200).json({ subfield })
        : res.status(400).json({ message: "SubField not found." })
    },
  )

  router.post("/subfields/create", async (req, res) => {
    const { name } = req.body

    const subfieldOrNotFound = await prisma.subField.findFirst({
      where: {
        name,
      },
    })

    if (subfieldOrNotFound)
      return res.status(400).json({ message: "Subfield already exists." })

    const subfield = await prisma.subField.create({
      data: {
        name,
      },
    })

    return subfield
      ? res.status(201).json({ subfield })
      : res.status(400).json({ message: "Unable to register subfield." })
  })

  router.patch(
    "/subfields/:id_subField/update",
    auth,
    can(["ADMIN", "ACCESS_ADMIN", "ACCESS_ADMIN_RDC"]),
    async (req, res) => {
      const { id_subField } = req.params

      const { name } = req.body

      const subfieldIsInUseNot = await prisma.subField.findFirst({
        where: {
          NOT: {
            id_subField,
          },
          AND: {
            name,
          },
        },
      })

      if (subfieldIsInUseNot)
        return res.status(400).json({ message: "Sorry name is in use." })

      const subfield = await prisma.subField.update({
        where: {
          id_subField,
        },
        data: {
          name,
        },
      })

      return subfield
        ? res.status(200).json({ subfield })
        : res.status(400).json({ message: "Unable to update this subfield." })
    },
  )
}
