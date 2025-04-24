import { connectDb, client } from "./db.js";

const db = await connectDb()

try {
    await db.command({
        collMod: "users",
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
                    }
                },
                additionalProperties: false
            }
        },
        validationAction: "error",
        validationLevel: "strict",
    })

    await db.command({
        collMod: "directories",
        validator: {
            $jsonSchema: {
                required: [
                    '_id',
                    'name',
                    'parentDirId',
                    'userId'
                ],
                properties: {
                    _id: {
                        bsonType: 'objectId'
                    },
                    name: {
                        bsonType: 'string'
                    },
                    parentDirId: {
                        bsonType: [
                            'objectId',
                            'null'
                        ]
                    },
                    userId: {
                        bsonType: 'objectId'
                    }
                },
                additionalProperties: false
            }
        },
        validationAction: "error",
        validationLevel: "strict",
    })

    await db.command({
        collMod: "files",
        validator: {
            $jsonSchema: {
                required: [
                    '_id',
                    'extension',
                    'name',
                    'parentDirId',
                    'userId'
                ],
                properties: {
                    _id: {
                        bsonType: 'objectId'
                    },
                    extension: {
                        bsonType: 'string'
                    },
                    name: {
                        bsonType: 'string'
                    },
                    parentDirId: {
                        bsonType: [
                            'objectId',
                            'null'
                        ]
                    },
                    userId: {
                        bsonType: 'objectId'
                    }
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
    client.close()
}

