import { prisma } from "@/external/repositories/postgres/helpers"
import { Router } from "express"

export default (router: Router) => {
  router.get("/areas", async (req, res) => {
    const areas = await prisma.area.findMany()

    return areas
      ? res.status(200).json({ areas })
      : res.status(400).json({ message: "No record found for area." })
  })

  router.get("/areas/:id_area/area", async (req, res) => {
    const { id_area } = req.params

    const area = await prisma.area.findFirst({
      where: {
        id_area,
      },
    })

    return area
      ? res.status(200).json({ area })
      : res.status(400).json({ message: "Area not found." })
  })

  router.post("/areas/create", async (req, res) => {
    const { name } = req.body

    const areaOrNotFound = await prisma.area.findFirst({
      where: {
        name,
      },
    })

    if (areaOrNotFound)
      return res.status(400).json({ message: "Area already exists." })

    const area = await prisma.area.create({
      data: {
        name,
      },
    })

    return area
      ? res.status(201).json({ area })
      : res.status(400).json({ message: "Unable to register area." })
  })

  router.patch("/areas/:id_area/update", async (req, res) => {
    const { id_area } = req.params

    const { name } = req.body

    const areaOrNotFound = await prisma.area.findFirst({
      where: {
        NOT: {
          id_area,
        },
        AND: {
          name,
        },
      },
    })

    if (areaOrNotFound)
      return res.status(400).json({ message: "Sorry name is in use." })

    const area = await prisma.area.update({
      where: {
        id_area,
      },
      data: {
        name,
      },
    })

    return area
      ? res.status(200).json({ area })
      : res.status(400).json({ message: "Unable to update this area." })
  })
}
