import express, { json, urlencoded } from "express"
import { plantRouter } from "./routes/plant"
import { userRouter } from "./routes/user"


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


export default app