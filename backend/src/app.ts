import express, { json, urlencoded } from "express"
import { plantRouter } from "./routes/plant"
import { userRouter } from "./routes/user"
import {sensorRouter} from "./routes/sensor";
import {AttributeRouter} from "./routes/attribute";


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
app.use(userRouter)
app.use(plantRouter)
app.use(sensorRouter)
app.use(AttributeRouter)


export default app