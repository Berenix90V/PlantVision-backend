import mongoose from 'mongoose'
import { sensorSchema, ISensor } from './sensors'

/**
 * Defines a plant. A plant is an entity that defines a user-owned plant. It contains sensor readings as well as its attributes
 */
export interface IPlant {
    name: string,
    description?: string,
    plantType:string,
    createdAt?: Date,
    sensor?: [ISensor],
}

/**
 * These types allow to have the sensor as a sub document
 */
type PlantsDocumentsProps = {
    sensor: mongoose.Types.DocumentArray<ISensor>,
}
type PlantsModelType = mongoose.Model<IPlant, {}, PlantsDocumentsProps>

/**
 * The schema of the plant document in the database
 */
export const plantSchema = new mongoose.Schema<IPlant, PlantsModelType>({
    name: {
        type: String,
    },
    plantType:{
        type: String,
    },
    description: {
        type: String,
    },
    sensor: {
        type: [sensorSchema],
        default: [],
        unique: false,
        sparse: true
    },
},{
    timestamps: true
})

const Plant = mongoose.model<IPlant, PlantsModelType>('Plant', plantSchema)

export const emptyPlant: IPlant = {
    name: "",
    plantType: "Empty",
}

export { Plant }
