'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function QuoteForm() {
  const [topic, setTopic] = useState('');
  const [quotes, setQuotes] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuotes([]);
    setIndex(0);
    try {
      const res = await fetch(`/api/quotes?topic=${encodeURIComponent(topic)}`);
      if (!res.ok) throw new Error('Failed to fetch quotes');
      const data = await res.json();
      setQuotes(data.quotes || []);
      setIndex(0);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unknown error');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNext = () => {
    if (quotes.length > 1) {
      setIndex((prev) => (prev + 1) % quotes.length);
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-center"
      >
        <Input
          type="text"
          placeholder="Type a topic... (e.g. growth, fear, change)"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="text-lg px-6 py-4 rounded-xl shadow-lg border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500"
        />
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto"
        >
          <Button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 px-8 py-4 text-lg font-semibold rounded-xl shadow-md hover:shadow-xl transition duration-300"
            disabled={loading}
          >
            {loading ? 'Loading...' : 'Generate'}
          </Button>
        </motion.div>
      </form>

      {error && (
        <div className="text-red-500 text-center mb-4">{error}</div>
      )}

      <AnimatePresence mode="wait">
        {quotes.length > 0 && (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.4 }}
            className="relative"
          >
            <Card className="p-6 text-center shadow-xl border-none bg-gradient-to-br from-gray-800 to-gray-700 text-white rounded-2xl">
              <CardContent className="text-xl font-medium">
                “{quotes[index]}”
              </CardContent>
            </Card>

            {quotes.length > 1 && (
              <button
                onClick={handleNext}
                className="absolute top-2 right-2 text-white hover:text-purple-400 transition"
                title="Next Quote"
              >
                <RotateCcw className="w-6 h-6" />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
