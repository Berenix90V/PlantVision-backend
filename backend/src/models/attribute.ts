import mongoose from 'mongoose'

/**
 * The document format of a sensor in the mongodb database
 */export interface IAttribute {
    timestamp?: Date,
    attributes?: [String],
    imageOfTheDay?: {
        data: Buffer,
        contentType: String
    }
}

/**
 * The schema of the sensor subdocument in the database
 */
const attributeSchema = new mongoose.Schema<IAttribute>({
    
    timestamp: {
        type: Date,
        default: Date.now()
    },
    attributes: {
        type: [String]
    },
    imageOfTheDay: {
        data: Buffer,
        contentType: String
    }
})

export { attributeSchema }
