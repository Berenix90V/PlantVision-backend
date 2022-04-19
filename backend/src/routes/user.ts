import express, { Request, Response } from 'express'
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
            plants: user.plants
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
    const { username, password, plants } = req.body

    if (await User.exists({ username: username })) {
        return res.status(409).json(conflict(`User already exists`))
    }
    else {
        const user = new User({
            username: username,
            password: password,
            plants: plants
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
                plants: user.plants
            })
        } else{
            return res.status(404).json(not_found("Password not matching"))
        }
        
    }
}

router.get("/user/:username", fetchUserByName)
router.post("/user", addUser)
router.delete("/user/:username", deleteUser)
router.post("/user/login", checkLogin)

export { router as userRouter }