import express, {Request, Response} from 'express'
import { not_found, success, conflict } from '../models/message'
import { User } from '../models/user'

const router = express.Router()
const basePath = "/sensor/:username/:plantName"


router.get(basePath, async (req: Request, res: Response) => {
    const name = req.params.username
    const plantName = req.params.plantName
    const latest = req.query.latest

    const user = await User.findOne({username: name, "plants.name": plantName})
    if(!user) {
        return res.status(404).json(not_found(`User ${name} with plant {plantName} not found`))
    }
    else {
        const sensorReadings = user.plants.find(p => p.name == plantName)!.sensor!
        return res.status(200).json(latest && latest == 'true' ? sensorReadings.at(sensorReadings.length - 1) : sensorReadings);
    }
})

export {router as sensorRouter}