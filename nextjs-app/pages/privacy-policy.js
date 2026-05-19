import Head from 'next/head';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
        <div className="max-w-3xl mx-auto px-4 py-4 flex justify-between items-center">
          <a href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">Finding AI Tools</a>
        </div>
      </header>
      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">Privacy Policy</h1>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
          <p><strong>Last Updated:</strong> May 2026</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">1. Information We Collect</h2>
          <p>We do not collect any personal information from visitors. We do not require registration, and we do not store any user data on our servers.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">2. Cookies and Tracking</h2>
          <p>We use Google Analytics to understand website traffic and usage patterns. Google Analytics may use cookies to collect anonymous usage data. You can opt out of Google Analytics tracking by using the Google Analytics Opt-out Browser Add-on.</p>
          <p>We also use Google AdSense to display advertisements. Google AdSense may use cookies to serve personalized ads based on your browsing history. You can opt out of personalized advertising by visiting Google's Ads Settings.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">3. Third-Party Services</h2>
          <p>Our website contains links to third-party websites and services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review their privacy policies before providing any personal information.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">4. Data Security</h2>
          <p>We implement reasonable security measures to protect the integrity of our website. However, no method of transmission over the Internet is 100% secure.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">5. Children's Privacy</h2>
          <p>Our website is not directed at children under 13 years of age. We do not knowingly collect personal information from children.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">6. Changes to This Policy</h2>
          <p>We may update this privacy policy from time to time. Changes will be posted on this page with an updated revision date.</p>
          
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-6">7. Contact</h2>
          <p>If you have any questions about this privacy policy, please contact us at <a href="mailto:contact@findingaitools.com" className="text-indigo-600 hover:underline">contact@findingaitools.com</a>.</p>
        </div>
      </main>
    </div>
  );
}