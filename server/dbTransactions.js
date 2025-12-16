import { MongoClient } from "mongodb";

 const client = new MongoClient('mongodb://127.0.0.1:27017')

await client.connect()

console.log("Database Connected");

const db = client.db()  
const directories = db.collection('directories')
const users = db.collection('users')


const session = client.startSession()
session.startTransaction()

try {
  await directories.insertOne({ name: "db", username: "saurab" }, { session })
  await users.insertOne({ name: "sa", rootDirName: "db" }, { session })
  await session.commitTransaction()

} catch (err) {
  console.log(err);
  await session.abortTransaction()
}

await client.close()

console.log("database disconnected");
