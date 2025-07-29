import mongoose from "mongoose";
import { connectDb } from "./db.js";

await connectDb()
const client = mongoose.connection.getClient()

try {
    const db = mongoose.connection.db;
    const command = "collMod"

    await db.command({
        [command]: "users",
        validator: {
            $jsonSchema: {
                bsonType: 'object',
                required: [
                    '_id',
                    'username',
                    'email',
                    'password',
                    'rootDirId'
                ],
                properties: {
                    _id: {
                        bsonType: 'objectId'
                    },
                    username: {
                        bsonType: 'string',
                        minLength: 3
                    },
                    maxStorageInBytes: {
                        bsonType: "long"
                    },
                    email: {
                        bsonType: 'string',
                        pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$'
                    },
                    password: {
                        bsonType: 'string',
                        minLength: 4
                    },
                    rootDirId: {
                        bsonType: 'objectId'
                    },
                    picture: {
                        bsonType: "string",
                    },
                    role: {
                        enum: ["Admin", "Manager", "User"],
                    },
                    deleted: {
                        bsonType: "bool",
                    },
                    __v: {
                        bsonType: "int",
                    },
                },
                additionalProperties: false
            }
        },
        validationAction: "error",
        validationLevel: "strict",
    })

    await db.command({
        [command]: "directories",
        validator: {
            $jsonSchema: {
                required: [
                    // '_id',
                    'name',
                    // 'parentDirId',
                    'userId'
                ],
                properties: {
                    _id: {
                        bsonType: 'objectId'
                    },
                    name: {
                        bsonType: 'string'
                    },
                    size: {
                        bsonType: "int",
                    },
                    parentDirId: {
                        bsonType: [
                            'objectId',
                            'null'
                        ]
                    },
                    userId: {
                        bsonType: 'objectId'
                    },
                    path: {
                        bsonType: "array",
                        items: {
                            bsonType: "objectId"
                        }
                    },
                    createdAt: {
                        bsonType: "date",
                    },
                    updatedAt: {
                        bsonType: "date",
                    },
                    __v: {
                        bsonType: "int",
                    },
                },
                additionalProperties: false
            }
        },
        validationAction: "error",
        validationLevel: "strict",
    })

    await db.command({
        [command]: "files",
        validator: {
            $jsonSchema: {
                required: [
                    '_id',
                    'name',
                    'size',
                    'extension',
                    'userId',
                    'parentDirId',
                ],
                properties: {
                    _id: {
                        bsonType: "objectId",
                    },
                    name: {
                        bsonType: "string",
                    },
                    size: {
                        bsonType: "int",
                    },
                    extension: {
                        bsonType: "string",
                    },
                    userId: {
                        bsonType: "objectId",
                    },
                    parentDirId: {
                        bsonType: "objectId",
                    },
                    createdAt: {
                        bsonType: "date",
                    },
                    updatedAt: {
                        bsonType: "date",
                    },
                    __v: {
                        bsonType: "int",
                    },
                },
                additionalProperties: false
            }
        },
        validationAction: "error",
        validationLevel: "strict",
    })
} catch (error) {
    console.log("Error setting up the database")
} finally {
    await client.close()
}

