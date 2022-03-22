import mongoose from 'mongoose'
import { sensorSchema, ISensor } from './sensors'

export interface IPlant {
    name: string,
    description?: string,
    createdAt?: Date,
    sensor?: [ISensor]
}

type PlantsDocumentsProps = {
    sensor: mongoose.Types.DocumentArray<ISensor>
}

type PlantsModelType = mongoose.Model<IPlant, {}, PlantsDocumentsProps>

const plantSchema = new mongoose.Schema<IPlant, PlantsModelType>({
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
        default: []
    }
})

const Plant = mongoose.model<IPlant, PlantsModelType>('Plant', plantSchema)

export { Plant }
