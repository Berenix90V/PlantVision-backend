import mongoose from 'mongoose'

/**
 * The document format of a sensor in the mongodb database
 */export interface ISensor {
    airHumidity: number,
    soilMoisture: number,
    airTemperature: number,
    lightIntensity: number,
}

/**
 * The schema of the sensor subdocument in the database
 */
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
},{
    timestamps: true,
})

const Sensor = mongoose.model("Sensor", sensorSchema)

export { Sensor, sensorSchema }
