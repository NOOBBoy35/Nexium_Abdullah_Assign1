export default function AboutPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-indigo-600 text-center">About Me</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-lg text-gray-100 leading-relaxed font-medium">
        <div>
          👋 Hi, I&apos;m <span className="font-semibold text-indigo-600">Abdullah Mansoor</span>, a dedicated and curious Computer Science student at the
          <span className="font-semibold text-indigo-600"> Ghulam Ishaq Khan Institute of Engineering Sciences and Technology (GIKI)</span>.
          With a strong foundation in programming, web development, and artificial intelligence, I&#39;ve worked on a range of projects involving
          <span className="font-semibold text-indigo-600"> React</span>, <span className="font-semibold text-indigo-600">Python</span>, and <span className="font-semibold text-indigo-600">machine learning</span>.
        </div>

        <div>
          🛠️ This website is part of my internship at <span className="font-semibold text-indigo-600">Nexium</span>, where I&#39;m learning to build full-stack applications using modern tools like
          <span className="font-semibold text-indigo-600"> Next.js</span>, <span className="font-semibold text-indigo-600">Tailwind CSS</span>, <span className="font-semibold text-indigo-600">Supabase</span>, and <span className="font-semibold text-indigo-600">MongoDB Atlas</span>.
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
    </div>
  );
}
