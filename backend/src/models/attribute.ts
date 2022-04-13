import mongoose from 'mongoose'

export interface IAttribute {
    attributes: String[],
    score?: number
    imageOfTheDay?: {
        data: Buffer,
        contentType: String
    },
    createdAt?: Date
}

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
