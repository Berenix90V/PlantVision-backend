import mongoose from 'mongoose'
import { plantSchema, IPlant } from "./plant";

/**
 * Defines a hub. A hub is a collection of plants
 */
export interface IHub {
    location: string,
    name: string,
    slots: number,
    plants?: IPlant[]
}

type UserDocumentsProps = {
    plants: mongoose.Types.DocumentArray<IPlant>
}
type UsersModelType = mongoose.Model<IHub, {}, UserDocumentsProps>

const hubSchema = new mongoose.Schema<IHub, UsersModelType>({
    name:{
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    slots: {
        type: Number,
        required: true
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

const Hub = mongoose.model<IHub, UsersModelType>('Hub', hubSchema)

export { Hub, hubSchema }