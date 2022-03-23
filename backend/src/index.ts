import mongoose from "mongoose";
import app from "./app";
import config from "./config"

/**
 * Connets to the database
 */
mongoose.connect(config.CONNECTION_URL_DOCKER, {
    user: config.DB_USERNAME,
    pass: config.DB_PASSWORD
})
.then(() => app.listen(config.PORT, () => console.log(`server running on port ${config.PORT}`)))
.catch((error) => console.log(error.message));
