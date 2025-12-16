import mongoose from "mongoose";

export async function connectDB() {
    try {
        await mongoose.connect(process.env.DB_URL);
        console.log("Database Connected !!");
    } catch (err) {
        console.log(err);
        console.log("Could not connect to the database !!");
        process.exit(1);
    }
}

process.on("SIGINT", async () => {
    await mongoose.disconnect();
    console.log("Database Disconnected");
    process.exit(0);
});
