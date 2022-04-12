import { IPlant, Plant } from '../src/models/plant'
import app from '../src/app'
import request from 'supertest'
import { MessageType, IMessage } from '../src/models/message'
import { User } from '../src/models/user'
import {plant, sensor, user} from './base'

describe('Plants', () => {
    it("should be found if user exists", async () => {
        await User.create(user)
        await request(app).post("/user/Silvio").send(plant)
        const response = await request(app).get("/plant/Silvio")
        expect(response.statusCode).toBe(200)
        const responseMessage: [IPlant] = response.body
        expect(responseMessage).toHaveLength(1)
    })
    it("should not be found if user doesn't exist", async() => {
        const response = await request(app).get("/plant/Silvio")
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
    })
    it("should be deleted if user is found", async () => {
        await User.create(user)
        await request(app).post("/user/Silvio").send(plant)
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
        let response = await request(app).delete("/plant/Silvio")
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
    })
})

describe('Plant', () => { 
    it("should be found when user and plant exist", async () => {
        await User.create(user)
        await request(app).post("/user/Silvio").send(plant)
        const response = await request(app).get("/plant/Silvio/Sage")
        expect(response.statusCode).toBe(200)
        const responseMessage: IPlant = response.body
        expect(responseMessage).toBeTruthy();
        expect(responseMessage.name).toBe(plant.name)
    })
    it("should not be found when user doesn't exist", async () => {
        const response = await request(app).get("/plant/Silvio/Sage")
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
        expect(responseMessage.message).toBe("User not found")
    })
    it("should not be found when plant doesn't exist", async () => {
        await User.create(user)
        const response = await request(app).get("/plant/Silvio/Sage")
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
        expect(responseMessage.message).toBe("Plant not found")
    })
    it("should not be deleted when user doesn't exist", async () => {
        await User.create(user)
        let response = await request(app).delete("/plant/Silvio/Sage")
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
    })
    it("should not be deleted when plant doesn't exist", async () => {
        let response = await request(app).delete("/plant/Silvio/Sage")
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
    })
    it("should be deleted when plant and user exist", async () => {
        await User.create(user)
        await request(app).post("/user/Silvio").send(plant)
        let response = await request(app).get("/plant/Silvio")
        expect(response.statusCode).toBe(200)
        let plants: [IPlant] = response.body
        expect(plants).toHaveLength(1)
        response = await request(app).delete("/plant/Silvio/Sage")
        expect(response.statusCode).toBe(200)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.OK)
        response = await request(app).get("/plant/Silvio")
        expect(response.statusCode).toBe(200)
        plants = response.body
        expect(plants).toHaveLength(0)
    })
})