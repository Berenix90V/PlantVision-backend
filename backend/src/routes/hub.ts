import express, {Request, Response} from 'express'
import { Hub, IHub } from '../models/hub';
import { not_found, success } from '../models/message';
import { Plant } from '../models/plant';
import { User } from '../models/user';

const router = express.Router();

/**
 * Adds a new plant to a hub
 * @param req The request
 * @param res The response
 * @returns HTTP 201 with a success message if the user was added correctly,
 * HTTP 409 with a conflict message if the user already exists, HTTP 404 with a not found message if the user is not found
 */
const addPlant = async (req: Request, res: Response) => {
    const username = req.params.username
    const hub = req.params.hub
    const {name, description, sensor, plantType} = req.body

    if (!await User.exists({ username: username })) {
        return res.status(404).json(not_found("User not found"))
    }
    else {
        const user = await User.findOne({ username: username })
        const userHub: IHub | undefined = user!.hubs!.find(h => h.name == hub)
        if (!userHub || 
            (userHub.plants!.length == userHub.slots &&
                 userHub.plants!.filter(p => p.name == "").length == 0)
            )
            return res.status(404).json(not_found("Hub is full"))
        
        let empty = userHub.plants!.findIndex(p => p.name == "")
        if(empty != -1) {
            userHub.plants![empty] = new Plant({
                name: name,
                description: description,
                sensor: sensor,
                plantType: plantType
            })
        }
        else userHub.plants!.push(new Plant({
            name: name,
            description: description,
            sensor: sensor,
            plantType: plantType
        }))
        
        return user!.save().then(() => res.status(200).json(success("Plant added")))

    }
}

const fetchUserHubs = async(req: Request, res: Response) => {
    const username = req.params.username

    const user = await User.findOne({username: username})
    if(!user)
        return res.status(404).json(not_found("User or hub not found"))
    else {
        return res.status(200)
        .json(user.hubs?.map(h=> h == null? null : {
            hub_name: h.name,
            plants: h.plants,
            location: h.location,
            slots: h.slots
        } ))
    }
}

const fetchPlants = async (req: Request, res: Response) => {
    const username = req.params.username
    const hub = req.params.hub

    const user = await User.findOne({username: username, "hubs.name": hub})
    if(!user)
        return res.status(404).json(not_found("User or hub not found"))
    else {
        return res.status(200)
        .json(
            user.hubs?.find(h => h.name == hub)!.plants?.map(p => p.name == "" ? null : {
                name: p.name,
                type: p.plantType,
                description: p.description
            }))
    }
}

const fetchPlant = async (req: Request, res: Response) => {
    const username = req.params.username
    const hub = req.params.hub
    const plantName = req.params.plantName

    const user = await User.findOne({username: username, "hubs.name": hub})
    if(!user)
        return res.status(404).json(not_found("User or hub not found"))
    else {
        const plant = user.hubs?.find(h => h.name == hub)?.plants?.find(p => p.name == plantName)
        if(plant == undefined)
            return res.status(404).json(not_found("Plant not found"))
        else
            return res.status(200).json(plant)
    }
}


const deletePlant = async (req: Request, res: Response) => {
    const username = req.params.username
    const hub = req.params.hub
    const plantName = req.params.plantName

    const user = await User.findOne({username: username, "hubs.name": hub})
    if(!user)
        return res.status(404).json(not_found("User or hub not found"))
    else {
        const plant = user.hubs?.find(h => h.name == hub)?.plants?.find(p => p.name == plantName)
        if(plant == undefined)
            return res.send(404).json(not_found("Plant not found"))
        else
            plant.name = "";
            return user!.save().then(() => res.status(200).json(success("Plant deleted")))
    }
}


router.post("/hub/:username/:hub", addPlant)
router.get("/hub/:username/:hub", fetchPlants)
router.get("/hubs/:username", fetchUserHubs)
router.get("/hub/:username/:hub/:plantName", fetchPlant)
router.delete("/hub/:username/:hub/:plantName", deletePlant)


export {router as hubRouter}