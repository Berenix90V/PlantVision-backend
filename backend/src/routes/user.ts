import express, { Request, Response } from 'express'
import { MessageType, IMessage, not_found, success, conflict } from '../models/message'
import { IPlant, Plant } from '../models/plant'
import { User } from '../models/user'

const router = express.Router()

router.get("/user/:username", async (req: Request, res: Response) => {
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
})

router.post("/user", async (req: Request, res: Response) => {
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
        await user.save()
        return res.status(201).json(success("User created"))
    }
})

router.put("/user/:username", async (req: Request, res: Response) => {
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
        user!.save()
        return res.status(200).json(success("Plant added"))
    }
})

export { router as userRouter }