import mongoose from "mongoose";
import app from "./app";
import {config} from './config/config'

/**
 * Connets to the database
 */
mongoose.connect(config.CONNECTION_URL_REMOTE!, {
    user: config.DB_USERNAME,
    pass: config.DB_PASSWORD
})
.then(() => app.listen(config.SERVER_PORT, () => {
    console.log(`server running on port ${config.SERVER_PORT}`)

}))
.catch((error) => console.log(error.message));
