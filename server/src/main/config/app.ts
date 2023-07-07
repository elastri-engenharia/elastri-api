import express from "express"
import setupRouter from "./setup-router"

const app = express()

setupRouter(app)

export { app }
