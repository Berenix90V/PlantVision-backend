import mongoose from 'mongoose'
import { plantSchema, IPlant } from "./plant";

/**
 * Defines a user. A user is a collection of properties that define a single user. Only the strictly necessary data is being collected,
 * specifically:
 * - Username
 * - Password
 *
 * No personal data shall be collected since there is no need for it.
 * @todo Add email to allow for password reset and recovery
 */
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
        default: [],
        unique: false,
        sparse: true
    }
},{
    timestamps: true,
})

const User = mongoose.model<IUser, UsersModelType>('User', userSchema)

export { User }