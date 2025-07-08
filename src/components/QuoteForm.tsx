'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Geist_Mono } from "next/font/google";
import { Check, Copy } from 'lucide-react';

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
  const justChoseSuggestion = useRef(false);
  const [suppressSuggestions, setSuppressSuggestions] = useState(false);

  // Typewriter effect for headline
  const headline = "One word can change your day.";
  const subtext = "Type a word. Get inspired.";
  const [typed, setTyped] = useState("");
  const [showSub, setShowSub] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const typeIndex = useRef(0);

  // Quote of the Day logic
  const [qotd, setQotd] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    fetch('/api/quotes')
      .then((res) => res.json())
      .then((data) => {
        if (data && Array.isArray(data.quotes) && data.quotes.length > 0) {
          setQotd(data.quotes[0].replace(/^No exact match found.*\n\n"|"$/g, ''));
        }
      });
  }, []);
  const handleCopy = () => {
    if (!qotd) return;
    navigator.clipboard.writeText(qotd);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  useEffect(() => {
    if (hasAnimated) return;
    setTyped("");
    setShowSub(false);
    typeIndex.current = 0;
    setHasAnimated(true);
    const typeNext = () => {
      if (typeIndex.current < headline.length) {
        const nextChar = headline[typeIndex.current];
        setTyped((prev) => prev + (nextChar ?? ""));
        typeIndex.current++;
        if (typeIndex.current < headline.length) {
          setTimeout(typeNext, 110);
        } else {
          setTimeout(() => setShowSub(true), 400);
        }
      }
    };
    typeNext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (suppressSuggestions) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    if (!topic || loading) {
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
  }, [topic, loading, suppressSuggestions]);

  const handleSuggestionClick = (suggestion: string) => {
    setTopic(suggestion);
    setShowSuggestions(false);
    justChoseSuggestion.current = true;
    setSuppressSuggestions(true);
    inputRef.current?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setQuotes([]);
    setIndex(0);
    setSuggestions([]);
    setShowSuggestions(false);
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

  // Animate dino running left to right at the bottom of the card
  const [dinoProgress, setDinoProgress] = useState(0); // 0 to 1
  const dinoDuration = 4.5; // seconds for one run (slower)
  const dinoOffset = 24; // px from edge
  const dinoSize = 64; // px
  const cardWidth = 640; // px (max-w-2xl)
  const cardHeight = 320; // px (approx, adjust as needed)
  useEffect(() => {
    let raf: number;
    let start: number | null = null;
    let started = false;
    function animate(ts: number) {
      if (!started) return;
      if (start === null) start = ts;
      const elapsed = (ts - start) / 1000;
      let progress = (elapsed / dinoDuration);
      let looped = false;
      if (progress >= 1) {
        looped = true;
        progress = 1;
      }
      setDinoProgress(progress);
      if (!looped) {
        raf = requestAnimationFrame(animate);
      } else {
        // Instantly reset after fade out at boundary
        setTimeout(() => {
          setDinoProgress(0);
          start = null;
          raf = requestAnimationFrame(animate);
        }, 1); // 1ms = instant
      }
    }
    const startDino = () => {
      started = true;
      raf = requestAnimationFrame(animate);
    };
    const timeout = setTimeout(startDino, 3000); // 3 seconds delay
    return () => {
      clearTimeout(timeout);
      cancelAnimationFrame(raf);
    };
  }, []);
  // Calculate dino position (left to right at bottom)
  const dinoX = dinoOffset + (cardWidth - 2 * dinoOffset - dinoSize) * Math.min(dinoProgress, 1);
  const dinoY = cardHeight - dinoOffset - dinoSize;

  // Dino fade logic
  // Fade in in first 15% of run, instantly fade out at the end
  const fadeZone = 0.15;
  let dinoOpacity = 1;
  if (dinoProgress < fadeZone) {
    dinoOpacity = dinoProgress / fadeZone;
  } else if (dinoProgress >= 1) {
    dinoOpacity = 0;
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="p-8 max-w-2xl mx-auto"
      >
        <div className="flex flex-col items-center justify-center mb-10 select-none">
          <h1 className="text-3xl md:text-5xl font-bold text-center tracking-tight text-white mb-1 min-h-[2.5em] font-sans" style={{ fontFamily: 'var(--font-geist-sans),sans-serif' }}>
            <span className="inline-block whitespace-pre">
              {typed}
              {typed.length < headline.length ? <span className="animate-pulse text-purple-400">|</span> : null}
            </span>
          </h1>
          {showSub && (
            <motion.p
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1.4, type: 'spring', bounce: 0.3 }}
              className="text-lg md:text-2xl text-gray-300 text-center mb-4 font-medium"
              style={{ fontFamily: 'var(--font-geist-sans),sans-serif' }}
            >
              {subtext}
            </motion.p>
          )}
        </div>
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
              onChange={(e) => {
                setTopic(e.target.value);
                justChoseSuggestion.current = false;
                setSuppressSuggestions(false);
              }}
              onFocus={() => {
                setShowSuggestions(suggestions.length > 0);
                justChoseSuggestion.current = false;
              }}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 100)}
              className="text-2xl px-8 py-6 rounded-2xl shadow-xl border-2 border-gray-300 focus:outline-none focus:ring-4 focus:ring-purple-500 bg-white/10 backdrop-blur-md text-white placeholder:text-gray-300 min-w-[320px] placeholder:text-2xl"
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
      {/* Quote of the Day Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, type: 'spring', bounce: 0.2 }}
        className="flex flex-col items-center justify-center mt-16 mb-8"
      >
        <div className="relative w-full max-w-2xl px-6" style={{ minHeight: cardHeight }}>
          {/* Dino animation - smoothly runs along the bottom */}
          {dinoOpacity > 0 && (
            <motion.img
              src="/assets/dino.png"
              alt="Pixel Dinosaur"
              animate={{
                x: dinoX,
                y: dinoY,
                opacity: dinoOpacity,
                scale: 1,
              }}
              transition={{ ease: 'linear', duration: 0.1 }}
              className="w-16 h-16 absolute z-20 pointer-events-none select-none"
              style={{ left: 0, top: 0 }}
            />
          )}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-400/30 via-indigo-300/20 to-blue-200/10 blur-xl opacity-80 -z-10" />
          <motion.div
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.1, delay: 0.2, type: 'spring', bounce: 0.25 }}
            className="rounded-3xl bg-white/20 backdrop-blur-2xl shadow-2xl border border-white/20 p-8 md:p-12 flex flex-col items-center"
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="text-base md:text-lg font-semibold text-indigo-300 tracking-wide uppercase">Quote of the Day</span>
              <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-purple-400 to-indigo-400 animate-pulse" />
            </div>
            <blockquote className="text-2xl md:text-3xl font-medium text-center text-indigo-100 drop-shadow-lg mb-6 select-text transition-all duration-500 min-h-[2.5em]">
              {qotd ? (
                <span>{qotd}</span>
              ) : (
                <span className="text-indigo-200 animate-pulse">Loading...</span>
              )}
            </blockquote>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-6 py-2 rounded-xl bg-gradient-to-r from-indigo-500/80 to-purple-500/80 text-white font-semibold shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-purple-400/60"
              disabled={!qotd}
              aria-label="Copy quote to clipboard"
            >
              {copied ? <Check className="w-5 h-5 text-green-300" /> : <Copy className="w-5 h-5" />}
              <span>{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
}
