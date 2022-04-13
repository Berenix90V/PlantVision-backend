import mongoose from 'mongoose'

/**
 * Defines an attribute. An attribute is a combination of a score from 0 to 10 of a plant, which determines the condition
 * of the plant according to the user, a list of key phrases that the user can add, to give more insight on the plant, and
 * optionally an image of the day.
 */
export interface IAttribute {
    attributes: String[],
    score?: number
    imageOfTheDay?: {
        data: Buffer,
        contentType: String
    },
    createdAt?: Date
}

/**
 * Defines a MongoDB Attribute schema
 */
const attributeSchema = new mongoose.Schema<IAttribute>({
    score: {
        type: Number
    },
    attributes: {
        type: [String]
    },
    imageOfTheDay: {
        data: Buffer,
        contentType: String
    }
}, {
    timestamps: true,
})

const Attribute = mongoose.model("Attribute", attributeSchema);

export { Attribute, attributeSchema }
