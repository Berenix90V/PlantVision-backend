import mongoose from 'mongoose'
import { plantSchema, IPlant } from "./plant";

export interface IUser {
    username: string,
    password: string,
    createdAt?: Date,
    plants?: IPlant[]
}

type UserDocumentsProps = {
    plants: mongoose.Types.DocumentArray<IPlant>
}
type UsersModelType = mongoose.Model<IUser, {}, UserDocumentsProps>

const userSchema = new mongoose.Schema<IUser, UsersModelType>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    plants: {
        type: [plantSchema],
        default: []
    }
})

const User = mongoose.model<IUser, UsersModelType>('User', userSchema)

export { User }