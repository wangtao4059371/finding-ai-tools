import Head from 'next/head';

export default function About() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Finding AI Tools</a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">About Finding AI Tools</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>Finding AI Tools is a curated directory of the best AI tools, agents, and foundation models available on the market. Our mission is to help you discover, compare, and choose the right AI solutions for your needs.</p>
          <p>We cover a wide range of categories including AI writing assistants, image generators, video creation tools, audio and music AI, coding assistants, autonomous agents, and large language models from leading companies like OpenAI, Google, Anthropic, Meta, and more.</p>
          <p>Our team constantly monitors the AI landscape to bring you the most up-to-date information about new tools, pricing changes, and feature updates.</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">Why We Built This</h2>
          <p>The AI industry is moving incredibly fast. Every day, new tools and models are released. It's hard to keep up. We created Finding AI Tools to be your one-stop resource for navigating the AI ecosystem.</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">Contact Us</h2>
          <p>Have a suggestion or found an issue? <a href="/contact" className="text-indigo-600 hover:underline">Get in touch</a>.</p>
        </div>
      </main>
    </div>
  );
}