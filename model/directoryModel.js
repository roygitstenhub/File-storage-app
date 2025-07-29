import { model, Schema } from "mongoose";

const directorySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: Number,
        required: true,
        default: 0,
    },
    parentDirId: {
        type: Schema.Types.ObjectId,
        default: null,
        ref: "Directory"

    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true
    },
    path: [{ type: Schema.Types.ObjectId, ref: 'Directory' }]
}, {
    strict: "throw",
    timestamps: true
})

const Directory = model("Directory", directorySchema)

export default Directory