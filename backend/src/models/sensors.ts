import mongoose from 'mongoose'

export interface ISensor {
    timestamp?: Date,
    airHumidity: number,
    soilMoisture: number,
    airTemperature: number,
    lightIntensity: number,
}

const sensorSchema = new mongoose.Schema<ISensor>({
    airHumidity: {
        type: Number,
        required: true
    },
    soilMoisture: {
        type: Number,
        required: true
    },
    airTemperature: {
        type: Number,
        required: true
    },
    lightIntensity: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now()
    }
})

export { sensorSchema }
