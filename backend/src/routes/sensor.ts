import express, { Request, Response } from 'express'
import { Plant } from '../models/plant'
import { ISensor } from '../models/sensors'

const router = express.Router()

router.get("/sensor/all/:name", async (req: Request, res: Response) => {
    const name = req.params.name
    const plant = await Plant.findOne({ name: name })

    if (!plant) return res.status(404).json({ message: "This plant doesn't exist" })

    return res.status(200).json(plant.sensor)
})

router.get("/sensor/latest/:name", async (req: Request, res: Response) => {
    const name = req.params.name
    const plant = await Plant.findOne({ name: name })

    if (!plant) return res.status(404).json({ message: "This plant doesn't exist" })

    return res.status(200).json(plant.sensor.sort((x: ISensor, y: ISensor) => x.timestamp!.getTime() - y.timestamp!.getTime()).reverse()[0])
})

export {router as sensorRoute }