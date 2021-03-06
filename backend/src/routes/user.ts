import express, { Request, Response } from 'express'
import { user } from '../../tests/base'
import { Hub } from '../models/hub'
import { not_found, success, conflict } from '../models/message'
import { User } from '../models/user'

const router = express.Router()

/**
 * Fetches the user by its unique username
 * @param req The request
 * @param res The response
 * @returns HTTP 200 response with the user's data in JSON if the user is found,
 * HTTP 404 with a not found message otherwise
 */
const fetchUserByName = async (req: Request, res: Response) => {
    const name = req.params.username

    const user = await User.findOne({ username: name })

    if (!user) {
        return res.status(404).json(not_found("User not found"))
    }
    else {
        return res.status(200).json({
            username: user.username,
            hubs: user.hubs
        })
    }
}

/**
 * Adds a new user
 * @param req The request
 * @param res The response
 * @returns HTTP 201 with a success message if the user was added correctly,
 * HTTP 409 with a conflict message if the user already exists
 */
const addUser = async (req: Request, res: Response) => {
    const { username, password, hubs } = req.body

    if (await User.exists({ username: username })) {
        return res.status(409).json(conflict(`User already exists`))
    }
    else {
        const user = new User({
            username: username,
            password: password,
            hubs: hubs
        })
        return user.save().then(() => res.status(201).json(success("User created")))
    }
}

/**
 * Deletes a user
 * @param req The request
 * @param res The response
 * @returns HTTP 204 response with if the user is deleted correctly,
 * HTTP 404 with a not found message if the user doesn't exist
 */
const deleteUser = async (req:Request, res: Response) => {
    const username = req.params.username

    if(!await User.exists({username: username})) {
        return res.status(404).json(not_found("User not found"))
    }
    else {
        return User.deleteOne({username: username})
            .then(() => res.sendStatus(204))
    }

}


const checkLogin = async (req: Request, res: Response) => {
    const {username, password} = req.body
    
    const user = await User.findOne({ username: username })

    if (!user) {
        return res.status(404).json(not_found("User not found"))
    }
    else {
        if(user.password == password){
            return res.status(200).json({
                username: user.username,
                hubs: user.hubs
            })
        } else{
            return res.status(404).json(not_found("Password not matching"))
        }
        
    }
}

/**
 * Adds a new plant to a hub
 * @param req The request
 * @param res The response
 * @returns HTTP 201 with a success message if the user was added correctly,
 * HTTP 409 with a conflict message if the user already exists, HTTP 404 with a not found message if the user is not found
 */
 const addHub = async (req: Request, res: Response) => {
    const username = req.params.username
    const {name, location, slots, plants} = req.body

    if (!await User.exists({ username: username })) {
        return res.status(404).json(not_found("User not found"))
    }
    else {
        const user = await User.findOne({ username: username })
        user!.hubs?.push(new Hub({
            name: name,
            location: location,
            slots: slots
        }))
        return user!.save().then(() => res.status(200).json(success("Hub added")))

    }
}


router.get("/user/:username", fetchUserByName)
router.post("/user", addUser)
router.delete("/user/:username", deleteUser)
router.post("/user/login", checkLogin)
router.post("/user/")
router.post("/user/:username", addHub)

export { router as userRouter }