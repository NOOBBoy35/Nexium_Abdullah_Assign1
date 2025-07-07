import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI!;
const dbName = 'Nexium';
const collectionName = 'quotes';

export async function GET(req: NextRequest) {
    const topic = req.nextUrl.searchParams.get('topic') || '';
    const client = new MongoClient(uri);
    await client.connect();
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const doc = await collection.findOne({ topic: { $regex: `^${topic}$`, $options: 'i' } });
        if (doc && doc.quotes && doc.quotes.length > 0) {
            return NextResponse.json({ quotes: doc.quotes.slice(0, 3) });
        }
        // fallback: random quote
        const allDocsRaw = await collection.find().toArray();
        // Collect all quotes from documents that have the correct shape
        const allQuotes: string[] = [];
        for (const d of allDocsRaw) {
            if (typeof d.topic === 'string' && Array.isArray(d.quotes)) {
                allQuotes.push(...d.quotes);
            }
        }
        if (allQuotes.length === 0) {
            return NextResponse.json({ quotes: [`No quotes found in the database.`] });
        }
        const randomQuote = allQuotes[Math.floor(Math.random() * allQuotes.length)];
        return NextResponse.json({ quotes: [`No exact match found for "${topic}". Here's a random quote instead:\n\n"${randomQuote}"`] });
    } finally {
        await client.close();
    }
} 