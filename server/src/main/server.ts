import * as dotenv from "dotenv"
import { app } from "@/main/config/app"

dotenv.config()

app.listen(process.env.PORT, () => console.log("Server is running..."))
