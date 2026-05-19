import Head from 'next/head';

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Finding AI Tools</a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Contact Us</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
          <p>We'd love to hear from you. Whether you have a suggestion for a new AI tool to add, found incorrect information, or have a business inquiry, please reach out.</p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">Email</h2>
          <p><a href="mailto:contact@findingaitools.com" className="text-indigo-600 hover:underline">contact@findingaitools.com</a></p>
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">Social Media</h2>
          <p>Follow us for the latest AI tool updates and news.</p>
        </div>
      </main>
    </div>
  );
}