import express, { json, urlencoded } from "express"
import { plantsRouter } from "./routes/plants"
import { sensorRouter } from "./routes/sensor"


/**
 * Creates an new application, adding support for JSON data and URL parsing
 */
const app = express()
app.use(json())
app.use(urlencoded({
    extended: true
}))

/**
 * Adds the routes
 */
app.use(plantsRouter)
app.use(sensorRouter)

export default app