import express, { json, urlencoded } from "express"
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


export default app