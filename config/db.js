const { MongoClient } = require("mongodb");

let db;

async function connectDB() {
    const client = new MongoClient(process.env.MONGODB_URI);

    await client.connect();

    db = client.db("agri_link");

    await db.collection("users").createIndex(
        { email: 1 },
        { unique: true }
    );

    console.log("MongoDB connected successfully!");
}

function getDB() {
    if (!db) {
        throw new Error("Database is not connected.");
    }

    return db;
}

module.exports = { connectDB, getDB };
