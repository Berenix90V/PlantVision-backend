import request from "supertest";
import app from "../src/app";
import {plant, sensor, user} from "./base";
import {IMessage, MessageType} from "../src/models/message";
import {User} from "../src/models/user";
import {ISensor} from "../src/models/sensors";

describe("Sensor", () => {
    it("should not be added when user doesn't exist", async () => {
        const response = await request(app).put("/plant/Silvio/Sage").send(sensor)
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
        expect(responseMessage.message).toBe("User not found")
    })
    it("should not be added when plant doesn't exist", async () => {
        await User.create(user)
        const response = await request(app).put("/plant/Silvio/Sage").send(sensor)
        expect(response.statusCode).toBe(404)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.NOT_FOUND)
        expect(responseMessage.message).toBe("Plant not found")
    })
    it("should be added when user and plant exist", async () => {
        await User.create(user)
        await request(app).put("/user/Silvio").send(plant)
        const response = await request(app).put("/plant/Silvio/Sage").send(sensor)
        expect(response.statusCode).toBe(200)
        const responseMessage: IMessage = response.body
        expect(responseMessage.type).toBe(MessageType.OK)
    })
    it("should return its data when user and plant exist", async () => {
        const sensor2: ISensor = {
            airTemperature: 42,
            airHumidity: 100,
            lightIntensity: 32,
            soilMoisture: 9.0
        }
        await User.create(user)
        await request(app).put("/user/Silvio").send(plant)
        await request(app).put("/plant/Silvio/Sage").send(sensor)
        await request(app).put("/plant/Silvio/Sage").send(sensor2)
        let response = await request(app).get("/sensor/Silvio/Sage")
        expect(response.statusCode).toBe(200)
        let responseMessage: [ISensor] = response.body
        expect(responseMessage).toHaveLength(2)
    })
    it("should return its latest data when user and plant exist", async () => {
        const sensor2: ISensor = {
            airTemperature: 42,
            airHumidity: 100,
            lightIntensity: 32,
            soilMoisture: 9.0
        }
        await User.create(user)
        await request(app).put("/user/Silvio").send(plant)
        await request(app).put("/plant/Silvio/Sage").send(sensor)
        await request(app).put("/plant/Silvio/Sage").send(sensor2)
        let response = await request(app).get("/sensor/Silvio/Sage?latest=true")
        expect(response.statusCode).toBe(200)
        let responseMessage: ISensor = response.body
        expect(responseMessage.airTemperature).toEqual(sensor2.airTemperature)
        expect(responseMessage.airHumidity).toEqual(sensor2.airHumidity)
        expect(responseMessage.soilMoisture).toEqual(sensor2.soilMoisture)
        expect(responseMessage.lightIntensity).toEqual(sensor2.lightIntensity)
    })
})