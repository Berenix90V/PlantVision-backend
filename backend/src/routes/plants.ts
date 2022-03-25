import express, { Request, Response } from 'express'
import { Plant } from '../models/plant'
import { MessageType, IMessage } from '../models/message'


const router = express.Router()

/**
 * @brief This route returns all the plants registered in the database
 * @returns A JSON array with all the plants registerd, and empty array if there are none
 */
router.get("/plants", async (req: Request, res: Response) => {
    const plants = await Plant.find({})
    return res.status(200).json(plants)
})


/**
 * @brief This route returns all the plants registered in the database
 * @returns The selected plant, an error message
 */
router.get("/plants/:name", async (req: Request, res: Response) => {
    const name = req.params.name
    const plant = await Plant.findOne({ name: name })

    if (!plant) {
        let error: IMessage = {
            type: MessageType.NOT_FOUND,
            message: `The plant ${name} is not in the database`
        }
        return res.status(404).json(error)
    }
    else
        return res.status(200).json(plant)
})


/**
 * @brief This route inserts a new plant in the database
 * @returns The inserted plant, an error message otherwise
 */
router.post("/plants", async (req: Request, res: Response) => {
    const { name, description, sensor } = req.body


    const plant = new Plant({ name, description, sensor })

    if(await Plant.exists({name: name})) {
        let error: IMessage = {
            type: MessageType.CONFLICT,
            message: `The plant ${name} already exists`
        }
        return res.status(409).json(error)
    }
    else {
        await plant.save()
        return res.status(201).json(plant)
    }
})

/**
 * @brief This route updates the sensor data for a plant
 * @returns The modified plant, an error message otherwise
 */
router.put("/plants/:name", async (req: Request, res: Response) => {
    const name = req.params.name
    const { sensor } = req.body
    const plant = await Plant.findOne({ name: name })

    if (!plant) {
        let error: IMessage = {
            type: MessageType.NOT_FOUND,
            message: `The plant ${name} is not in the database`
        }
        return res.status(404).json(error)
    }

    else {
        plant.sensor.push(sensor)
        plant.save()
        return res.status(200).json(plant)
    }

})


export { router as plantsRouter }