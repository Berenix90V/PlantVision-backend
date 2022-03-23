import express, { json, urlencoded } from "express"
import { plantsRouter } from "./routes/plants"
import { sensorRouter } from "./routes/sensor"


const app = express()
app.use(json())
app.use(urlencoded({
    extended: true
}))

app.use(plantsRouter)
app.use(sensorRouter)

export default app