import express, {Request, Response} from 'express'
import { not_found, success } from '../models/message'
import { User } from '../models/user'
import {Attribute, IAttribute} from "../models/attribute";

const router = express.Router()

const basePath = "/attribute/:username/:plantName"

/**
 * Fetches the latest attribute data
 * @param req The request
 * @param res The response
 * @returns HTTP 404 with a not found message if either the user or the plant don't exist,
 * HTTP 200 with the attribute data otherwise
 */
const fetchLatest = async (req: Request, res: Response) => {
    const userName = req.params.username
    const plantName = req.params.plantName

    const user = await User.findOne({username: userName, "plants.name": plantName});
    if(!user) {
        return res.status(404).json(not_found(`User ${userName} with plant ${plantName} not found`))
    } else {
        const attributes: [IAttribute] = user.plants.find(p => p.name == plantName)!.attributes!;
        return res.status(200).json(attributes.at(attributes.length - 1))
    }
}
/**
 * Adds a new attribute to a plant
 * @param req The request
 * @param res The response
 * @returns HTTP 404 with a not found message if either the user or the plant don't exist,
 * HTTP 200 with a success message otherwise
 */
const addAttribute = async (req: Request, res: Response) => {
    const name = req.params.username
    const plantName = req.params.plantName
    const {score, attributes} = req.body

    const user = await User.findOne({username: name, "plants.name": plantName})

    if(!user)
        return res.status(404).json(not_found(`User ${name} with plant ${plantName} not found`))
    else {
        const plant = user.plants.find((p) => p.name == plantName)!;
        const attribute: IAttribute = new Attribute({
            score: score,
            attributes: attributes ?? [],
        })
        plant.attributes!.push(attribute)
        user!.save().then(() => res.status(200).json(success("Attribute added")))
    }
}

router.get(basePath, fetchLatest)
router.post(basePath, addAttribute)

export { router as AttributeRouter }