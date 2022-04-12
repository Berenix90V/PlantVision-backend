import app from '../src/app'
import request from 'supertest'
import { MessageType, IMessage } from '../src/models/message'
import { IUser, User } from '../src/models/user'
import {plant, user} from "./base";

describe('User', () => {
    it("should be created if doesn't exist", async () => {
        const response = await request(app).post("/user").send(user)
        expect(response.statusCode).toBe(201)
        const message: IMessage = response.body
        expect(message.type).toBe(MessageType.OK)
    })
    it("should not be created if already exist", async () => {
        const response = await request(app).post("/user").send(user)
        expect(response.statusCode).toBe(201)
        const message: IMessage = response.body
        expect(message.type).toBe(MessageType.OK)

        const newResponse = await request(app).post("/user").send(user)
        expect(newResponse.statusCode).toBe(409)
        const newMessage: IMessage = newResponse.body
        expect(newMessage.type).toBe(MessageType.CONFLICT)
    })
    it("should return its data when exists",async () => {
        await User.create(user)
        const response = await request(app).get("/user/Silvio")
        expect(response.status).toBe(200)
        const userData = response.body
        expect(userData.password).toBeFalsy()
        expect(userData.username).toBe(user.username)
    })
    it("should not be found when doesn't exist",async () => {
        await User.create(user)
        const response = await request(app).get(`/user/Mario`)
        expect(response.status).toBe(404)
        const userData: IMessage = response.body
        expect(userData.type).toBe(MessageType.NOT_FOUND)
    })
    it("should add a new plant", async () => {
        await User.create(user)
        const response = await request(app).put("/user/Silvio").send(plant)
        expect(response.statusCode).toBe(200)
        const newResponse = await request(app).get("/user/Silvio")
        expect(newResponse.statusCode).toBe(200)
        const modUser: IUser = newResponse.body
        expect(modUser.username).toBe(user.username)
        expect(modUser.plants).toHaveLength(1)
    })
    it("should not be found when adding a plant to a non existing user", async () => {
        const response = await request(app).put("/user/Silvio").send(plant)
        expect(response.statusCode).toBe(404)
        const message: IMessage = response.body
        expect(message.type).toBe(MessageType.NOT_FOUND) 
    })
    it("should conflict when adding an existing plant", async () => {
        await User.create(user)
        const response = await request(app).put("/user/Silvio").send(plant)
        expect(response.statusCode).toBe(200)
        const newResponse = await request(app).put("/user/Silvio").send(plant)
        expect(newResponse.statusCode).toBe(409)
        const message: IMessage = newResponse.body
        expect(message.type).toBe(MessageType.CONFLICT)
    })
    it("should be deleted when exists",async () => {
        await User.create(user)
        const response = await request(app).delete("/user/Silvio")
        expect(response.statusCode).toBe(204)
        expect(response.body).toStrictEqual({})
        const getUserResponse = await request(app).get("/user/Silvio")
        expect(getUserResponse.statusCode).toBe(404)
    })
    it("should not be deleted when doesn't exist",async () => {
        const response = await request(app).delete("/user/Silvio")
        expect(response.statusCode).toBe(404)
        const messageBody: IMessage = response.body
        expect(messageBody.type).toBe(MessageType.NOT_FOUND)
    })
 })