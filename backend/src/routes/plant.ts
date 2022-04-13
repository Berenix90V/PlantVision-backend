import express, {Request, Response} from 'express'
import { not_found, success, conflict } from '../models/message'
import { IPlant, Plant } from '../models/plant'
import { User } from '../models/user'
import { ISensor, Sensor } from '../models/sensors'

const router = express.Router()

/**
 * Fetches all user plants
 * @param req The request
 * @param res The response
 * @returns HTTP 404 with a not found message if the user is not found,
 * HTTP 200 with the user plants otherwise
 */
const getPlantsByUsername = async (req: Request, res: Response) => {
    const name = req.params.username
    const user = await User.findOne({username: name})
    if(!user)
        return res.status(404).json(not_found("User not found"))
    else {
        return res.status(200).json(user.plants)
    }
}

/**
 * Fetches a user plant
 * @param req The request
 * @param res The response
 * @returns HTTP 404 with a not found message if the user or the plant are not found,
 * HTTP 200 with the user plant otherwise
 */
const getPlantByUsername = async(req: Request, res: Response) => {
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
}

/**
 * Deletes all user plants
 * @param req The request
 * @param res The response
 * @returns HTTP 404 with a not found message if the user is not found,
 * HTTP 200 with a success message otherwise
 */
const deletePlantsByUsername = async (req:Request, res: Response) => {
    const username = req.params.username

    if(!await User.exists({username: username})) {
        return res.status(404).json(not_found("User not found"))
    }
    else {
        User.updateOne({username: username},
            {$set: {plants: []}}
        ).then((_) => res.status(200).json(success("Plants deleted successfully")))
    }
}

/**
 * Deletes a user plant
 * @param req The request
 * @param res The response
 * @returns HTTP 404 with a not found message if the user or the plant are not found,
 * HTTP 200 with the user plant otherwise
 */
const deletePlantByUsername = async (req: Request, res: Response) => {
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

}

/**
 * Adds a new plant to a user
 * @param req The request
 * @param res The response
 * @returns HTTP 201 with a success message if the user was added correctly,
 * HTTP 409 with a conflict message if the user already exists, HTTP 404 with a not found message if the user is not found
 */
const addPlant = async (req: Request, res: Response) => {
    const username = req.params.username
    const {name, description, sensor} = req.body

    if (!await User.exists({ username: username })) {
        return res.status(404).json(not_found("User not found"))
    }
    else {
        const user = await User.findOne({ username: username })
        if (user!.plants.find(plant => plant.name == name))
            return res.status(409).json(conflict("Plant already exists"))
        user!.plants.push(new Plant({
            name: name,
            description: description,
            sensor: sensor
        }))
        return user!.save().then(() => res.status(200).json(success("Plant added")))

    }
}

router.get("/plant/:username",getPlantsByUsername)
router.get("/plant/:username/:plantName", getPlantByUsername)
router.delete("/plant/:username", deletePlantsByUsername)
router.delete("/plant/:username/:plantName", deletePlantByUsername)
router.post("/plant/:username", addPlant)

export {router as plantRouter }