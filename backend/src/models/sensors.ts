import mongoose from 'mongoose'

/**
 * Defines a sensor. A sensor is a collection of sensor readings, specifically:
 * - Air temperature and humidity
 * - Soil moisture
 * - Light intensity
 *
 * This data is sent by the sensors through the appropriate HTTP request and will get inserted into this structure, for
 * storing and better accessing of the individual values in the front end of the application
 */export interface ISensor {
    airHumidity: number,
    soilMoisture: number,
    airTemperature: number,
    lightIntensity: number,
}

/**
 * The schema of the sensor sub document in the database
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
