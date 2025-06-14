import mongoose from "mongoose"


export async function connectDb() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}`)
        console.log("Connected to mongoDB database")
    } catch (error) {
        console.log(error)
        console.log("Could not connect to the database")
        process.exit(1)
    }
}

process.on("SIGINT", async () => {
    await mongoose.disconnect()
    console.log("Database disconnected")
    process.exit(0)
})
