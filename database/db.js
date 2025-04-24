import { MongoClient } from "mongodb";

export const client = new MongoClient('mongodb://127.0.0.1:27017/storageApp')

export async function connectDb() {
    await client.connect()
    const db = client.db()
    console.log("Connected to database")
    return db
}

process.on("SIGINT", async () => {
    await client.close()
    console.log("Client disconnected")
    process.exit(0)
})
