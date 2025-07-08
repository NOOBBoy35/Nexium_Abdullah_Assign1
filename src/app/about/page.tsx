'use client';

import { motion } from 'framer-motion';
import { useState, useRef } from 'react';

export default function AboutPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-center text-indigo-400 drop-shadow-[0_2px_12px_rgba(99,102,241,0.25)]">About Me</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-lg text-gray-100 leading-relaxed font-medium">
        <div className="bg-white/15 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 max-w-5xl w-full min-w-0 text-justify">
          👋 Hi, I&apos;m <span className="font-semibold text-blue-500">Abdullah Mansoor</span>, a dedicated and curious Computer Science student at the
          <span className="font-semibold text-blue-500"> Ghulam Ishaq Khan Institute of Engineering Sciences and Technology (GIKI)</span>.
          With a strong foundation in programming, web development, and artificial intelligence, I&#39;ve worked on a range of projects involving
          <span className="font-semibold text-blue-500"> React</span>, <span className="font-semibold text-blue-500">Python</span>, and <span className="font-semibold text-blue-500">machine learning</span>.
        </div>

        <div className="bg-white/15 backdrop-blur-lg rounded-3xl shadow-xl p-8 border border-white/20 max-w-3xl w-full min-w-0 text-justify">
          🛠️ This website is part of my internship at <span className="font-semibold text-blue-500">Nexium</span>, where I&#39;m learning to build full-stack applications using modern tools like
          <span className="font-semibold text-blue-500"> Next.js</span>, <span className="font-semibold text-blue-500">Tailwind CSS</span>, <span className="font-semibold text-blue-500">Supabase</span>, and <span className="font-semibold text-blue-500">MongoDB Atlas</span>.
          The goal of this project is not just to build a quote generator, but to improve my understanding of clean UI, component-based architecture, and efficient backend integration.
        </div>
      </div>

      <div className="flex justify-center gap-6">
        <a
          href="https://github.com/NOOBBoy35"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-gray-800 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
        >
          GitHub
        </a>

        <a
          href="https://www.linkedin.com/in/abdullah-mansoor-a9a424218/"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-600 text-white px-6 py-3 rounded-xl shadow-md hover:scale-105 transition-transform"
        >
          LinkedIn
        </a>
      </div>
      {/* Nexium project badge */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, type: 'spring', bounce: 0.3 }}
        className="fixed bottom-6 right-6 z-50"
      >
        <div
          className="relative px-8 py-4 rounded-2xl flex items-center text-lg font-semibold text-gray-100 shadow-2xl backdrop-blur-2xl"
          style={{
            background: 'linear-gradient(120deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.18) 100%)',
            border: '2px solid',
            borderImage: 'linear-gradient(120deg, #6366f1 0%, #a78bfa 100%) 1',
            boxShadow: '0 4px 32px 0 rgba(99,102,241,0.18), 0 1.5px 8px 0 rgba(139,92,246,0.18)',
            fontFamily: 'var(--font-geist-sans), sans-serif',
          }}
        >
          <span className="tracking-wide opacity-90">A project for</span>
          <span className="ml-3 font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-blue-400 to-purple-400 drop-shadow-[0_2px_12px_rgba(99,102,241,0.25)] animate-pulse">NEXIUM</span>
        </div>
      </motion.div>

      {/* Review game badge */}
      <ReviewGameBox />
    </div>
  );
}

// ReviewGameBox component
function ReviewGameBox() {
  const [showThanks, setShowThanks] = useState(false);
  const [thumbsDownPos, setThumbsDownPos] = useState({ x: 0, y: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Move thumbs down to a random position within the box
  const moveThumbsDown = () => {
    if (!boxRef.current) return;
    const box = boxRef.current.getBoundingClientRect();
    const maxX = box.width - 40; // emoji size
    const maxY = box.height - 40;
    const newX = Math.random() * maxX;
    const newY = Math.random() * maxY;
    setThumbsDownPos({ x: newX, y: newY });
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 400);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, type: 'spring', bounce: 0.3 }}
      className="fixed bottom-6 left-0 z-50 min-w-[320px] min-h-[88px] w-[320px] h-[88px]"
    >
      <div
        ref={boxRef}
        className="relative px-10 py-6 rounded-2xl flex flex-row items-center justify-center text-lg font-semibold text-gray-100 shadow-2xl backdrop-blur-2xl min-w-[320px] min-h-[88px] w-[320px] h-[88px] gap-4"
        style={{
          background: 'linear-gradient(120deg, rgba(99,102,241,0.18) 0%, rgba(139,92,246,0.18) 100%)',
          border: '2px solid',
          borderImage: 'linear-gradient(120deg, #6366f1 0%, #a78bfa 100%) 1',
          boxShadow: '0 4px 32px 0 rgba(99,102,241,0.18), 0 1.5px 8px 0 rgba(139,92,246,0.18)',
          fontFamily: 'var(--font-geist-sans), sans-serif',
        }}
      >
        {!showThanks ? (
          <>
            <span className="tracking-wide opacity-90 mr-3 text-center">Leave a review</span>
            <button
              className="text-3xl hover:scale-125 transition-transform duration-150 mx-1"
              aria-label="Thumbs up"
              onClick={() => {
                setShowThanks(true);
              }}
            >
              👍
            </button>
            <motion.button
              className="text-3xl mx-1 relative"
              aria-label="Thumbs down"
              style={{ left: thumbsDownPos.x, top: thumbsDownPos.y }}
              onMouseEnter={moveThumbsDown}
              onMouseMove={moveThumbsDown}
              onClick={moveThumbsDown}
              animate={{ scale: isRunning ? 1.2 : 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            >
              👎
            </motion.button>
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.4 }}
            className="w-full h-full flex justify-center items-center min-w-[320px] min-h-[88px] w-[320px] h-[88px]"
            style={{ pointerEvents: 'none' }}
          >
            <span className="bg-white/80 text-indigo-700 font-bold px-6 py-3 rounded-xl shadow-lg text-xl">Thank you!</span>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
