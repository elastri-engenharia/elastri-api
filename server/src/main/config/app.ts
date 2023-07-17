import express from "express"
import cors from "cors"
import setupRouter from "./setup-router"

const app = express()

app.use(express.json())
app.use(cors())
setupRouter(app)

export { app }
