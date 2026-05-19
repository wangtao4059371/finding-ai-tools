import Head from 'next/head';

export default function Terms() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Finding AI Tools</a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Terms of Service</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
          <p><strong>Last Updated:</strong> May 2026</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">1. Acceptance of Terms</h2>
          <p>By accessing and using Finding AI Tools, you agree to be bound by these Terms of Service. If you do not agree, please do not use our website.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">2. Description of Service</h2>
          <p>Finding AI Tools is a directory and information resource providing curated listings and descriptions of AI tools, agents, and models. We do not endorse or guarantee the quality of any listed product or service.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">3. Content Accuracy</h2>
          <p>While we strive to provide accurate and up-to-date information, we make no warranties about the completeness, reliability, or accuracy of the content on our website. AI tool information, including pricing and features, may change without notice.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">4. External Links</h2>
          <p>Our website contains links to third-party websites. We are not responsible for the content, privacy policies, or practices of any third-party websites.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">5. Intellectual Property</h2>
          <p>All original content on Finding AI Tools is protected by copyright. AI tool names, logos, and trademarks belong to their respective owners.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">6. Limitation of Liability</h2>
          <p>Finding AI Tools shall not be liable for any damages arising from the use or inability to use our website or the tools listed within.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">7. Changes to Terms</h2>
          <p>We reserve the right to modify these terms at any time. Continued use of the website after changes constitutes acceptance of the new terms.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">8. Contact</h2>
          <p>For questions about these terms, contact <a href="mailto:wangtao4059371@gmail.com" className="text-indigo-600 hover:underline">wangtao4059371@gmail.com</a>.</p>
        </div>
      </main>
    </div>
  );
}