import quotes from "@/data/quotes.json";

// Tell TypeScript the shape of the imported JSON
type QuotesMap = {
  [key: string]: string[];
};

const typedQuotes = quotes as QuotesMap;

export function getQuotesForTopic(topic: string): string[] {
  const lower = topic.toLowerCase().trim();
  const found = typedQuotes[lower];

  if (!found || found.length === 0) {
    // Get all quotes from all topics
    const allQuotes = Object.values(typedQuotes).flat();
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    const randomQuote = allQuotes[randomIndex];

    return [
      `No exact match found for "${topic}". Here's a random quote instead:\n\n"${randomQuote}"`,
    ];
  }

  return found.slice(0, 3);
}
