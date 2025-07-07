import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = 'Nexium';
const collectionName = 'quotes';

export async function GET(req: NextRequest) {
    const q = req.nextUrl.searchParams.get('q') || '';
    if (!q) {
        return NextResponse.json({ topics: [] });
    }
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        // Find up to 6 topics that start with the query string (case-insensitive)
        const docs = await collection.find({ topic: { $regex: `^${q}`, $options: 'i' } }).limit(6).toArray();
        const topics = docs.map((doc) => (doc as unknown as { topic: string }).topic);
        return NextResponse.json({ topics });
    } finally {
        await client.close();
    }
} 