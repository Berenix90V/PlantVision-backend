import express, { Request, Response } from 'express'
import { Plant } from '../models/plant'


const router = express.Router()

/**
 * @brief This route returns all the plants registered in the database
 * @returns A JSON array with all the plants registerd, and empty array if there are none
 * @example GET http://host:post/plants
 */
router.get("/plants", async (req: Request, res: Response) => {
    const plants = await Plant.find({})
    return res.status(200).json(plants)
})


/**
 * @brief This route returns all the plants registered in the database
 * @returns The selected plant with status code 200, status code 404 otherwise
 * @example GET http://host:post/plants/Basel
 */
router.get("/plants/:name", async (req: Request, res: Response) => {
    const name = req.params.name
    const plant = await Plant.findOne({ name: name })

    if (!plant)
        return res.status(404).json({ error: "This plant does not exist" })
    else
        return res.status(200).json(plant)
})


/**
 * @brief This route inserts a new plant in the database
 * @returns The inserted plant with status code 201, status code 404 otherwise
 * @example POST http://host:post/plants {"name": "name", "description": "", "sensor"": []}
 * @see [@link IPlant] for data format
 */
router.post("/plants", async (req: Request, res: Response) => {
    const { name, description, sensor } = req.body
    const plant = new Plant({ name, description, sensor })

    await plant.save()
    return res.status(201).json(plant)
})

/**
 * @brief This route updates the sensor data for a plant
 * @returns The modified plant with status code 200, status code 404 otherwise
 * @example POST http://host:post/plants/Basel {"sensor": {
        "airHumidity": 30.2,
        "soilMoisture": 90,
        "airTemperature": 26,
        "lightIntensity": 100
    }}
 * @see [@link ISensor] for data format

 */
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