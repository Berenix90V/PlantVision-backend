import mongoose from 'mongoose'
import { sensorSchema, ISensor } from './sensors'

/**
 * The document format of a plant in the mongodb database
 */
export interface IPlant {
    name: string,
    description?: string,
    createdAt?: Date,
    sensor?: [ISensor]
}

/**
 * These types allow to have the sensor as a subdocument
 */
type PlantsDocumentsProps = {
    sensor: mongoose.Types.DocumentArray<ISensor>
}
type PlantsModelType = mongoose.Model<IPlant, {}, PlantsDocumentsProps>

/**
 * The schema of the plant document in the database
 */
export const plantSchema = new mongoose.Schema<IPlant, PlantsModelType>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    sensor: {
        type: [sensorSchema],
        default: [],
        unique: false,
        sparse: true
    }
})

const Plant = mongoose.model<IPlant, PlantsModelType>('Plant', plantSchema)

export { Plant }
