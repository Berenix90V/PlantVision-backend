import { IPlant, Plant } from '../models/plant'
import { beforeAll, afterEach, afterAll } from '@jest/globals'
import app from '../app'
import mongoose, { Mongoose } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'

let mongoServer: MongoMemoryServer
let con: Mongoose

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

describe("Insert a new plant", () => {

    test('Should save a new salvia plant without a sensor array', async () => {

        const response = await request(app).post("/plants").send({
            name: "Salvia",
            description: "Salvia plant"
        })

        expect(response.statusCode).toBe(201)
        const plant: IPlant = response.body
        expect(plant).toBeTruthy()
        expect(plant.name).toBe("Salvia")
        expect(plant.description).toBe("Salvia plant")
        expect(plant.sensor).toStrictEqual([])
    })

    test('Should save a new salvia plant with a sensor array containing 1 reading', async () => {

        const response = await request(app).post("/plants").send({
            name: "Salvia",
            description: "Salvia plant",
            sensor: [
                {
                    "airHumidity": 30.2,
                    "soilMoisture": 90,
                    "airTemperature": 26,
                    "lightIntensity": 100
                }
            ]
        })

        expect(response.statusCode).toBe(201)
        const plant: IPlant = response.body
        expect(plant).toBeTruthy()
        expect(plant.name).toBe("Salvia")
        expect(plant.description).toBe("Salvia plant")
        expect(plant.sensor?.length).toBe(1)
    })

})

describe('Retrieve a plant', () => {
    const newPlant = new Plant({
        name: "Salvia",
        description: "Salvia plant"
    })

    test('should return an existing Salvia plant', async () => {
        await newPlant.save()
        const response = await request(app).get("/plants/Salvia").expect(200)
        const plant: IPlant = response.body

        expect(plant).toBeTruthy()
        expect(plant.name).toBe("Salvia")
    })

    test('should return 404 when searching for a non exisiting plant', async () => { 
        const response = await request(app).get("/plants/Basilico")
        expect(response.statusCode).toBe(404)
     })
})

describe('Retrieve all plants', () => {
    test('should return an empty list of plants', async () => {
        const response = await request(app).get("/plants").expect(200)
        const plants: [IPlant] = response.body
        expect(plants).toStrictEqual([])
    })
    test('should return a list of 3 plants', async () => {
        Plant.insertMany([
            {
                name: "Salvia"
            },
            {
                name: "Basilico",
                description: "Basilico plant"
            },
            {
                name: "Rosmarino",
                sensor: []
            }
        ])
        const response = await request(app).get("/plants").expect(200)
        const plants: [IPlant] = response.body
        expect(plants).toHaveLength(3)
    })
})

describe('Add a sensor reading to a plant', () => { 
    test('should return 404 when adding to a non existing plant', async () => { 
        const response = await request(app).put("/plants/Basilico").send({sensor: {}})
        expect(response.statusCode).toBe(404)
     })
     test('should add a sensor reading to an existing plant', async () => { 
        const oldPlant = new Plant({
            name: "Salvia",
            description: "Salvia plant",
            sensor: [
                {
                    "airHumidity": 30.2,
                    "soilMoisture": 90,
                    "airTemperature": 26,
                    "lightIntensity": 100
                }
            ]
        })

        Plant.create(oldPlant)


        const response = await request(app).put("/plants/Salvia").send({
            sensor: {
                "airHumidity": 30.2,
                "soilMoisture": 90,
                "airTemperature": 26,
                "lightIntensity": 100
            }
        })
        expect(response.statusCode).toBe(200)

        const newPlant: IPlant = response.body
        expect(newPlant).toBeTruthy()
        expect(newPlant).toBeDefined()
        expect(newPlant.sensor?.length).toBeGreaterThan(oldPlant.sensor.length)
      })
 })