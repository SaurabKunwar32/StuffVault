import mongoose from "mongoose";
import { connectDB } from "./db.js";

await connectDB();
const client = mongoose.connection.getClient();

try {
  const db = mongoose.connection.db;
  const command = "collMod";

  await db.command({
    [command]: 'users',
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: [
          '_id',
          'name',
          'email',
          'rootdirId'
        ],
        properties: {
          _id: {
            bsonType: 'objectId'
          },
          name: {
            bsonType: 'string',
            minLength: 3,
            description: 'Name must be a string with at least 3 characters'
          },
          email: {
            bsonType: 'string',
            pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+.[a-zA-Z]{2,}$',
            description: 'Email must be a valid email address'
          },
          password: {
            bsonType: 'string',
            minLength: 4,
            description: 'Password must be at least 4 characters long'
          },
          rootdirId: {
            bsonType: 'objectId',
          },
          picture: {
            bsonType: 'string',
          },
          __v: {
            bsonType: "int",
          },
          role: {
            bsonType: 'string',
            enum: ["Admin", "Manager", "User", "Owner"],
          },
          isDeleted: {
            bsonType: 'bool'
          },
          authProvider: {
            bsonType: 'string',
            enum: ["local", "google", "github"],
          },
        },
        additionalProperties: false
      }
    },
    validationAction: 'error',
    validationLevel: 'strict'
  })


  await db.command({
    [command]: 'directories',
    validator: {
      $jsonSchema: {
        bsonType: "object",
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
            bsonType: 'string',
          },
          parentDirId: {
            bsonType: ['objectId', 'null'],
          },
          userId: {
            bsonType: 'objectId',
          },
          __v: {
            bsonType: "int",
          },
        },
        additionalProperties: false
      }
    },
    validationAction: 'error',
    validationLevel: 'strict'
  })


  await db.command({
    [command]: "files",
    validator: {
      $jsonSchema: {
        bsonType: "object",
        required: ["_id", "name", "extension", "userId", "parentDirId"],
        properties: {
          _id: {
            bsonType: "objectId",
          },
          name: {
            bsonType: "string",
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
          __v: {
            bsonType: "int",
          },
        },
        additionalProperties: false,
      },
    },
    validationAction: "error",
    validationLevel: "strict",
  });

} catch (err) {
  console.log("Error setting up the database", err);
} finally {
  await client.close();
}
