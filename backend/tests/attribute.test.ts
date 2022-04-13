import { IPlant, Plant } from '../src/models/plant'
import app from '../src/app'
import request from 'supertest'
import { MessageType, IMessage } from '../src/models/message'
import { User } from '../src/models/user'
import {plant, sensor, user, attribute} from './base'
import {ISensor} from "../src/models/sensors";
import {IAttribute} from "../src/models/attribute";

describe("Attribute", () => {
    it("should not be added when user doesn't exist", async () => {
        const response = await request(app).post("/attribute/Silvio/Sage").send(sensor)
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
    })
    it("should not be added when plant doesn't exist", async () => {
        await User.create(user)
        const response = await request(app).post("/attribute/Silvio/Sage").send(sensor)
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
    })
    it("should be added when user and plant exist", async () => {
        await User.create(user)
        await request(app).post("/plant/Silvio").send(plant)
        const response = await request(app).post("/attribute/Silvio/Sage").send(sensor)
        expect(response.statusCode).toBe(200)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.OK)
    })
    it("should return its latest data when user and plant exist", async () => {
        const attribute2: IAttribute = {
            score: 1,
            attributes: ['dead', 'needs lots of water']
        }
        await User.create(user)
        await request(app).post("/plant/Silvio").send(plant)
        await request(app).post("/attribute/Silvio/Sage").send(attribute)
        await request(app).post("/attribute/Silvio/Sage").send(attribute2)
        let response = await request(app).get("/attribute/Silvio/Sage")
        expect(response.statusCode).toBe(200)
        const responseMessage: IAttribute = response.body
        expect(responseMessage.attributes).toEqual(attribute2.attributes)
        expect(responseMessage.score).toEqual(attribute2.score)
    })
})