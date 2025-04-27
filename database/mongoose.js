import mongoose from "mongoose";

await mongoose.connect("mongodb://127.0.0.1:27017/storageApp").then(()=>{
    console.log("connected to mongoose")
}).catch((err)=>{
    console.log(err)
})