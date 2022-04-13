import express, {Request, Response} from 'express'
import { not_found, success, conflict } from '../models/message'
import { User } from '../models/user'
import {Sensor} from "../models/sensors";

const router = express.Router()
const basePath = "/sensor/:username/:plantName"

/**
 * Fetches either all sensor readings or just the latest
 * @param req The request
 * @param res The response
 * @returns HTTP 404 with a not found message if either the user or the plant don't exist,
 * HTTP200 with either a JSON array with all the sensor readings, or a single reading JSON object
 */
const fetchSensorData = async (req: Request, res: Response) => {
    const name = req.params.username
    const plantName = req.params.plantName
    const latest = req.query.latest

    const user = await User.findOne({username: name, "plants.name": plantName})
    if(!user) {
        return res.status(404).json(not_found(`User ${name} with plant ${plantName} not found`))
    }
    else {
        const sensorReadings = user.plants.find(p => p.name == plantName)!.sensor!
        return res.status(200).json(latest && latest == 'true' ? sensorReadings.at(sensorReadings.length - 1) : sensorReadings);
    }
}

/**
 * Adds a new sensor reading to a plant
 * @param req The request
 * @param res The response
 * @returns HTTP 404 with a not found message if either the user or the plant don't exist,
 * HTTP200 with a success message otherwise
 */
const addReading = async (req: Request, res: Response) => {
    const name = req.params.username
    const plantName = req.params.plantName
    const {airHumidity, soilMoisture, airTemperature, lightIntensity} = req.body

    const user = await User.findOne({username: name})

    if(!user)
        return res.status(404).json(not_found("User not found"))
    else {
        const plant = user.plants.find((p) => p.name == plantName);
        if(plant != undefined) {
            plant.sensor?.push(new Sensor({
                airHumidity: airHumidity,
                soilMoisture: soilMoisture,
                airTemperature: airTemperature,
                lightIntensity: lightIntensity
            }))
            user!.save().then(() => res.status(200).json(success("Plant added")))
        }
        else
            return res.status(404).json(not_found("Plant not found"))
    }
}

router.post(basePath, addReading)
router.get(basePath, fetchSensorData)

export {router as sensorRouter}