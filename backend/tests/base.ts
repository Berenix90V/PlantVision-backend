import {MongoMemoryServer} from "mongodb-memory-server";
import mongoose, {Mongoose} from "mongoose";
import {beforeAll} from "@jest/globals";
import {IUser} from "../src/models/user";
import {IPlant} from "../src/models/plant";
import {ISensor} from "../src/models/sensors";
import {IAttribute} from "../src/models/attribute";

/**
 * In memory mongodb database and connection
 */
export let mongoServer: MongoMemoryServer
export let con: Mongoose

/**
 * Set a reasonable timeout in case the in memory database creation is slow
 */
jest.setTimeout(20 * 1000)

/**
 * Before the tests are executed, create the database and open a connection to it
 */
beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create()
    con = await mongoose.connect(mongoServer.getUri(), { dbName: "Plants" })
})

/**
 * After each test, clean the database
 */
afterEach(async () => {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        const collection = collections[key];
        await collection.deleteMany({})
        await collection.dropIndexes()
    }
})

/**
 * After all the tests are done, close the connection and delete the in memory database
 */
afterAll(async () => {
    if (con)
        await con.disconnect()
    if (mongoServer)
        await mongoServer.stop()
})

export const user: IUser = {
    username: "Silvio",
    password: "test",
    plants: []
}
export const plant: IPlant = {
    name: "Sage",
    description: "Sage plant"
}
export const sensor: ISensor = {
    airTemperature: 23.3,
    airHumidity: 87,
    lightIntensity: 100,
    soilMoisture: 42
}

export const attribute: IAttribute = {
    score: 8.5,
    attributes: ['green', 'likes sun', 'moist terrain'],
}