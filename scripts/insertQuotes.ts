import 'dotenv/config';
import { MongoClient } from "mongodb";
import fs from "fs";
import path from "path";

// ✅ Replace with your actual MongoDB URI
const uri = process.env.MONGODB_URI!;
const dbName = "Nexium"; // Or your actual DB name

// Load the quotes.json file
const filePath = path.join(__dirname, "../src/data/quotes.json");
const rawData = fs.readFileSync(filePath, "utf-8");
const quotesData = JSON.parse(rawData);

async function insertQuotes() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection("quotes");

    const bulkOps = Object.entries(quotesData).map(([topic, quotes]) => ({
      updateOne: {
        filter: { topic },
        update: { $set: { topic, quotes } },
        upsert: true, // insert if not exists
      },
    }));

    const result = await collection.bulkWrite(bulkOps);
    console.log("✅ Quotes inserted or updated:", result);
  } catch (err) {
    console.error("❌ Error inserting quotes:", err);
  } finally {
    await client.close();
  }
}

insertQuotes();
