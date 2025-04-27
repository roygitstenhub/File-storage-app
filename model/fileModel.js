import { model, Schema } from "mongoose";

const fileSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    extension: {
        type: String,
        required: true,
      },
    userId:{
        type:Schema.Types.ObjectId,
        required:true
    },
    parentDirId:{
        type:Schema.Types.ObjectId,
        default:null,
        ref:"Directory"

    },
},{
    strict:"throw"
})

const File = model("File", fileSchema)

export default File