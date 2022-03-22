import express from 'express'
import { json, urlencoded } from 'body-parser'
import { plantsRouter } from './routes/plants'
import { sensorRouter } from './routes/sensor'
import mongoose from 'mongoose'
import config from "./config"

const app = express()
app.use(json())
app.use(urlencoded({
    extended: true
}))

app.use(plantsRouter)
app.use(sensorRouter)


const PORT = process.env.PORT || 5000;

mongoose.connect(config.CONNECTION_URL_DOCKER, {
    user: config.DB_USERNAME,
    pass: config.DB_PASSWORD
})
.then(() => app.listen(PORT, () => console.log(`server running on port ${PORT}`)))
.catch((error) => console.log(error.message));