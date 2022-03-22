import express, { Request, Response } from 'express'
import { Plant } from '../models/plant'


const router = express.Router()

router.get("/plants", async (req: Request, res: Response) => {
    const plants = await Plant.find({})
    return res.status(200).json(plants)
})

router.get("/plants/:name", async (req: Request, res: Response) => {
    const name = req.params.name
    const plant = await Plant.findOne({ name: name })

    if (!plant)
        return res.status(404).json({ error: "This plant does not exist" })
    else
        return res.status(200).json(plant)
})

router.post("/plants", async (req: Request, res: Response) => {
    const { name, description, sensor } = req.body
    const plant = new Plant({ name, description, sensor })

    await plant.save()
    return res.status(201).json(plant)
})

router.put("/plants/:name", async (req: Request, res: Response) => {
    const name = req.params.name
    const { sensor } = req.body
    const plant = await Plant.findOne({ name: name })

    if (!plant)
        return res.status(404).json({ error: "The plant does not exist" })

    else {
        plant.sensor.push(sensor)
        plant.save()
        return res.status(200).json(plant)
    }

})


export { router as plantsRouter }