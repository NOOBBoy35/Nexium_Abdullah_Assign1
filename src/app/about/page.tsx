export default function AboutPage() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 text-indigo-600 text-center">About Me</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 text-lg text-gray-700">

        <div>
          👋 Hi, I'm <span className="font-semibold">Abdullah Mansoor</span>, a dedicated and curious Computer Engineering student at the 
          <span className="font-semibold"> Ghulam Ishaq Khan Institute of Engineering Sciences and Technology (GIKI)</span>. 
          With a strong foundation in programming, web development, and artificial intelligence, I’ve worked on a range of projects involving 
          <span className="font-semibold"> React</span>, <span className="font-semibold">Python</span>, and <span className="font-semibold">machine learning</span>.
        </div>

        <div>
          🛠️ This website is part of my internship at <span className="font-semibold">Nexium</span>, where I’m learning to build full-stack applications using modern tools like 
          <span className="font-semibold"> Next.js</span>, <span className="font-semibold">Tailwind CSS</span>, <span className="font-semibold">Supabase</span>, and <span className="font-semibold">MongoDB Atlas</span>. 
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
