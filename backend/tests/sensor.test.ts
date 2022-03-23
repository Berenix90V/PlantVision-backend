import { IPlant, Plant } from '../src/models/plant'
import { beforeAll, afterEach, afterAll } from '@jest/globals'
import app from '../src/app'
import mongoose, { Mongoose } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { ISensor } from '../src/models/sensors'

let mongoServer: MongoMemoryServer
let con: Mongoose

jest.setTimeout(20 * 1000)

beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    con = await mongoose.connect(mongoServer.getUri(), { dbName: "Plants" })
})

afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({});
    }
})

afterAll(async () => {
    if (con)
        await con.disconnect()
    if (mongoServer)
        await mongoServer.stop()
})

describe('Retrieve all sensor data from a plant', () => {
    test('should return 404 when retrieving sensor data from a non existing plant', async () => {
        const response = await request(app).get("/sensor/all/Salvia")
        expect(response.statusCode).toBe(404)
    })
    test('should return all sensor data from an existing plant', async () => {
        const plant = new Plant({
            name: "Salvia",
            sensor: [
                {
                    "airHumidity": 30.2,
                    "soilMoisture": 90,
                    "airTemperature": 26,
                    "lightIntensity": 100
                },
                {
                    "airHumidity": 30.2,
                    "soilMoisture": 10,
                    "airTemperature": 26,
                    "lightIntensity": 100
                }
            ]
        })
        Plant.create(plant)

        const response = await request(app).get("/sensor/all/Salvia")
        expect(response.statusCode).toBe(200)

        const retrievedSensors: [ISensor] = response.body
        expect(retrievedSensors).toBeTruthy()
        expect(retrievedSensors).toHaveLength(2)
    })
})

describe('Retrieve latest sensor data from a plant', () => {
    test('should return 404 when retrieving sensor data from a non existing plant', async () => {
        const response = await request(app).get("/sensor/latest/Salvia")
        expect(response.statusCode).toBe(404)
    })
    test('should return the latest sensor data from an existing plant', async () => {
        const plant = new Plant({
            name: "Salvia",
            sensor: [
                {
                    "airHumidity": 30.2,
                    "soilMoisture": 90,
                    "airTemperature": 26,
                    "lightIntensity": 100
                },
            ]
        })
        Plant.create(plant)

        await new Promise((r) => setTimeout(r, 2000))

        plant.sensor.push({
            "airHumidity": 30.2,
            "soilMoisture": 10,
            "airTemperature": 26,
            "lightIntensity": 100
        })

        plant.save()

        const response = await request(app).get("/sensor/latest/Salvia")
        expect(response.statusCode).toBe(200)

        const retrivedSensor: ISensor = response.body

        console.log(retrivedSensor)

        const sortByTimestamp = (x: ISensor, y: ISensor) => x.timestamp!.getTime() - y.timestamp!.getTime()

        const actualDate = plant.sensor.sort(sortByTimestamp).reverse()[0].timestamp?.getTime()
        const expectedDate = new Date(retrivedSensor.timestamp!).getTime()

        expect(actualDate).toEqual(expectedDate)
    })

})