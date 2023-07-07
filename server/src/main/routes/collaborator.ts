import { Router } from "express"

export default (router: Router) => {
  router.get("/collaborators", (req, res) => {
    return res.status(200).json("Bem vindo")
  })
}
