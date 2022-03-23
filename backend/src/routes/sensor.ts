import express, { Request, Response } from 'express'
import { Plant } from '../models/plant'
import { ISensor } from '../models/sensors'

const router = express.Router()

/**
 * @brief This route returns all the sensor data for a plant
 * @returns The selected plant's sensor data with status code 200, status code 404 otherwise
 * @example GET http://host:post/sensor/all/Basel
 */
router.get("/sensor/all/:name", async (req: Request, res: Response) => {
    const name = req.params.name
    const plant = await Plant.findOne({ name: name })

    if (!plant) return res.status(404).json({ message: "This plant doesn't exist" })

    return res.status(200).json(plant.sensor)
})

/**
 * @brief This route returns the latest sensor reading for a plant
 * @returns The latest sensor reading with status code 200, status code 404 otherwise
 * @example GET http://host:post/sensor/latest/Basel
 */
router.get("/sensor/latest/:name", async (req: Request, res: Response) => {
    const name = req.params.name
    const plant = await Plant.findOne({ name: name })

    if (!plant) return res.status(404).json({ message: "This plant doesn't exist" })

    return res.status(200).json(plant.sensor.sort((x: ISensor, y: ISensor) => x.timestamp!.getTime() - y.timestamp!.getTime()).reverse()[0])
})

export {router as sensorRouter }