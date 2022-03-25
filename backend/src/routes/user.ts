import express, { Request, Response } from 'express'
import { MessageType, IMessage } from '../models/message'
import { IPlant } from '../models/plant'
import { ISensor } from '../models/sensors'
import { IUser, User } from '../models/user'

const router = express.Router()

router.get("/user/:name", async (req: Request, res: Response) => {
    const name = req.params.name

    const user = await User.findOne({username: name})

    if(!user) {
        let error: IMessage = {
            type: MessageType.NOT_FOUND,
            message: "User not found"
        }
        return res.status(404).json(error)
    }
    else {
        return res.status(200).json(user)
    }

})

router.post("/user",async (req: Request, res:Response) => {
    const { username, password, plants } = req.body


    if(await User.exists({username: username})) {
        let error: IMessage = {
            type: MessageType.CONFLICT,
            message: `The plant ${username} already exists`
        }
        return res.status(409).json(error)
    }
    else {
        const user = new User({
            username: username,
            password: password,
            plants: plants ? plants : []
        })

        const success: IMessage = {
            type: MessageType.OK,
            message: "User created"
        }
    
        await user.save()
        return res.status(201).json(success)
    }
})

export {router as userRouter }