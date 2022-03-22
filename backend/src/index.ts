import express from 'express'
import { json, urlencoded } from 'body-parser'
import { plantsRouter } from './routes/plants'
import mongoose from 'mongoose'
import { sensorRoute } from './routes/sensor'

const app = express()
app.use(json())
app.use(urlencoded({
    extended: true
}))

app.use(plantsRouter)
app.use(sensorRoute)

const CONNECTION_URL = 'mongodb+srv://cristian:cristian@cluster0.xtqwj.mongodb.net/Plants?retryWrites=true&w=majority';
const PORT = process.env.PORT || 5000;

mongoose.connect(CONNECTION_URL)
.then(() => app.listen(PORT, () => console.log(`server running on port ${PORT}`)))
.catch((error) => console.log(error.message));