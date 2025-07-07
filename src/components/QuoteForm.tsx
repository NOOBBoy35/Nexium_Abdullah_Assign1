'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Geist_Mono } from "next/font/google";

const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

export default function QuoteForm() {
  const [topic, setTopic] = useState('');
  const [quotes, setQuotes] = useState<string[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!topic) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(async () => {
      const res = await fetch(`/api/quotes/suggest?q=${encodeURIComponent(topic)}`);
      if (res.ok) {
        const data = await res.json();
        setSuggestions(data.topics || []);
        setShowSuggestions((data.topics || []).length > 0);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    }, 200);
    return () => {
      if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    };
  }, [topic]);

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.7 }}
      className="p-8 max-w-2xl mx-auto"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-4 mb-10 items-center justify-center relative"
      >
        <div className="w-full relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type a topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onFocus={() => setShowSuggestions(suggestions.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
            className="text-2xl px-8 py-6 rounded-2xl shadow-lg border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500 bg-white/10 backdrop-blur-md text-white placeholder:text-gray-300 min-w-[320px]"
          />
          {showSuggestions && (
            <ul className="absolute left-0 right-0 mt-2 bg-white/30 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl z-20 max-h-60 overflow-auto">
              {suggestions.map((s) => (
                <li
                  key={s}
                  onMouseDown={() => handleSuggestionClick(s)}
                  className="px-6 py-3 text-lg text-gray-400 hover:bg-purple-100/60 cursor-pointer first:rounded-t-xl last:rounded-b-xl transition"
                >
                  {s}
                </li>
              ))}
            </ul>
          )}
        </div>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full sm:w-auto"
        >
          <Button
            type="submit"
            className="bg-gradient-to-r from-indigo-500 to-purple-500 px-12 py-6 text-2xl font-bold rounded-2xl shadow-lg hover:shadow-2xl transition duration-300 min-w-[180px]"
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
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <Card className="p-8 text-center shadow-2xl border border-purple-400/30 bg-white/10 backdrop-blur-lg text-white rounded-3xl transition-all duration-500">
              <CardContent className="flex flex-col items-center">
                <blockquote
                  className={`text-2xl md:text-3xl font-semibold italic text-white drop-shadow-lg mb-2 ${geistMono.variable}`}
                  style={{ fontFamily: 'var(--font-geist-mono), monospace' }}
                >
                  {quotes[index]}
                </blockquote>
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
    </motion.div>
  );
}
