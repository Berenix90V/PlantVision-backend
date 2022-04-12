import express, {Request, Response} from 'express'
import { not_found, success, conflict } from '../models/message'
import { IPlant, Plant } from '../models/plant'
import { User } from '../models/user'
import { ISensor, Sensor } from '../models/sensors'

const router = express.Router()

router.get("/plant/:username",async (req: Request, res: Response) => {
    const name = req.params.username
    const user = await User.findOne({username: name})
    if(!user)
        return res.status(404).json(not_found("User not found"))
    else {
        return res.status(200).json(user.plants)
    }
})

router.get("/plant/:username/:plantName", async(req: Request, res: Response) => {
    const name = req.params.username
    const plantName = req.params.plantName
    const user = await User.findOne({username: name})
    if(!user)
        return res.status(404).json(not_found("User not found"))
    else {
        const plant = user.plants.find((p) => p.name == plantName);
        if(plant != undefined)
            return res.status(200).json(plant)
        else
            return res.status(404).json(not_found("Plant not found"))
    }
})

router.post("/plant/:username/:plantName", async (req: Request, res: Response) => {
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
})

router.delete("/plant/:username",async (req:Request, res: Response) => {
    const username = req.params.username
    
    if(!await User.exists({username: username})) {
        return res.status(404).json(not_found("User not found"))
    }
    else {
        User.updateOne({username: username},
            {$set: {plants: []}}
        ).then((_) => res.status(200).json(success("Plants deleted successfully")))
    }
})

router.delete("/plant/:username/:plantName", async (req: Request, res: Response) => {
    const name = req.params.username
    const plantName = req.params.plantName

    const user = await User.findOne({username: name, "plants.name": plantName})
    if(!user) {
        return res.status(404).json(not_found(`User ${name} with plant {plantName} not found`))
    }
    else {
        User.updateOne({username: name},
            {
                $pull : {"plants": {"name": plantName}}
            }
        ).then((_) => res.status(200).json(success("Plant removed correctly")))
    }

})

export {router as plantRouter }