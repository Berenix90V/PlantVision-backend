import { IPlant, Plant } from '../src/models/plant'
import { beforeAll, afterEach, afterAll } from '@jest/globals'
import app from '../src/app'
import mongoose, { Mongoose } from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import request from 'supertest'
import { MessageType, IMessage } from '../src/models/message'
import { IUser, User } from '../src/models/user'
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
        await collection.deleteMany({})
        await collection.dropIndexes()
    }
})

afterAll(async () => {
    if (con)
        await con.disconnect()
    if (mongoServer)
        await mongoServer.stop()
})

const user: IUser = {
    username: "Silvio",
    password: "test",
    plants: []
}
const plant: IPlant = {
    name: "Salvia",
    description: "Salvia plant"
}
const sensor: ISensor = {
    airTemperature: 23.3,
    airHumidity: 87,
    lightIntensity: 100,
    soilMoisture: 42
}

describe('Plants', () => {
    it("should be found if user exists", async () => {
        await User.create(user)
        await request(app).put("/user/Silvio").send(plant)
        const response = await request(app).get("/plant/Silvio")
        expect(response.statusCode).toBe(200)
        const responseMessage: [IPlant] = response.body
        expect(responseMessage).toHaveLength(1)
    })
    it("should not be found if user doens't exist", async() => {
        const response = await request(app).get("/plant/Silvio")
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
    })
    it("should be deleted if user is found", async () => {
        await User.create(user)
        await request(app).put("/user/Silvio").send(plant)
        let response = await request(app).delete("/plant/Silvio")
        expect(response.statusCode).toBe(200)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.OK)
        response = await request(app).get("/plant/Silvio")
        expect(response.statusCode).toBe(200)
        const plants: [IPlant] = response.body
        expect(plants).toHaveLength(0)
    })
    it("should not be deleted if user doesn't exist", async () => {
        await request(app).put("/user/Silvio").send(plant)
        let response = await request(app).delete("/plant/Silvio")
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
    })
})

describe('Plant', () => { 
    it("should be added if doesn't exist",async () => {
        await User.create(user)
        const response = await request(app).post("/plant/Silvio").send(plant)
        expect(response.statusCode).toBe(201)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.OK)
    })
    it("should not be added if user doesn't exist", async () => {
        const response = await request(app).post("/plant/Silvio").send(plant)
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
    })
    it("should not be added if a plant with the same name exists", async () => {
        await User.create(user)
        let response = await request(app).post("/plant/Silvio").send(plant)
        expect(response.statusCode).toBe(201)
        let responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.OK)
        response = await request(app).post("/plant/Silvio").send(plant)
        expect(response.statusCode).toBe(409)
        responseMessage = response.body
        expect(responseMessage.type).toBe(MessageType.CONFLICT)
    })
    it("should be found when user and plant exist", async () => {
        await User.create(user)
        await request(app).put("/user/Silvio").send(plant)
        const response = await request(app).get("/plant/Silvio/Salvia")
        expect(response.statusCode).toBe(200)
        const responseMessage: IPlant = response.body
        expect(responseMessage).toBeTruthy();
        expect(responseMessage.name).toBe(plant.name)
    })
    it("should not be found when user doesn't exist", async () => {
        const response = await request(app).get("/plant/Silvio/Salvia")
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
        expect(responseMessage.message).toBe("User not found")
    })
    it("should not be found when plant doesn't exist", async () => {
        await User.create(user)
        const response = await request(app).get("/plant/Silvio/Salvia")
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
        expect(responseMessage.message).toBe("Plant not found")
    })
    it("should not be added when user doesn't exist", async () => {
        const response = await request(app).put("/plant/Silvio/Salvia").send(sensor)
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
        expect(responseMessage.message).toBe("User not found")
    })
    it("should not be added when plant doesn't exist", async () => {
        await User.create(user)
        const response = await request(app).put("/plant/Silvio/Salvia").send(sensor)
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
        expect(responseMessage.message).toBe("Plant not found")
    })
    it("should be added when user and plant exist", async () => {
        await User.create(user)
        await request(app).put("/user/Silvio").send(plant)
        const response = await request(app).put("/plant/Silvio/Salvia").send(sensor)
        expect(response.statusCode).toBe(200)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.OK)
    })
})