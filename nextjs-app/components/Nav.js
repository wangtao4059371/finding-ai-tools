import Link from 'next/link';
import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import { getLocale } from '../lib/i18n';

export default function Nav() {
  const router = useRouter();
  const [darkMode, setDarkMode] = useState(false);
  const locale = getLocale();

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains('dark'));
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            Finding AI Tools
          </Link>
          <nav className="flex gap-1">
            <Link
              href="/"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                router.pathname === '/'
                  ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {locale === 'zh' ? 'AI评分' : 'AI Ratings'}
            </Link>
            <Link
              href="/tools"
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                router.pathname === '/tools' || router.pathname.startsWith('/tool/')
                  ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              {locale === 'zh' ? 'AI工具' : 'AI Tools'}
            </Link>
          </nav>
        </div>
        <button
          onClick={toggleDark}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          {darkMode ? (
            <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 3a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0V4a1 1 0 0 1 1-1zm0 15a1 1 0 0 1 1 1v1a1 1 0 1 1-2 0v-1a1 1 0 0 1 1-1zm8.66-12.66a1 1 0 0 1 0 1.42l-.71.71a1 1 0 1 1-1.42-1.42l.71-.71a1 1 0 0 1 1.42 0zM5.64 16.34a1 1 0 0 1 0 1.42l-.71.71a1 1 0 1 1-1.42-1.42l.71-.71a1 1 0 0 1 1.42 0zM21 12a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zM5 12a1 1 0 0 1-1 1H3a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1zm15.66 4.34a1 1 0 0 1-1.42 0l-.71-.71a1 1 0 1 1 1.42-1.42l.71.71a1 1 0 0 1 0 1.42zM7.05 7.05a1 1 0 0 1-1.42 0l-.71-.71a1 1 0 0 1 1.42-1.42l.71.71a1 1 0 0 1 0 1.42zM12 7a5 5 0 1 0 0 10 5 5 0 0 0 0-10z"/></svg>
          ) : (
            <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 24 24"><path d="M21.64 13a1 1 0 0 0-1.05-.14 8.05 8.05 0 0 1-3.37.73 8.15 8.15 0 0 1-8.14-8.1 8.59 8.59 0 0 1 .25-2A1 1 0 0 0 8 2.36a10.14 10.14 0 1 0 14 11.69 1 1 0 0 0-.36-1.05zm-9.5 6.69A8.14 8.14 0 0 1 7.08 5.22v.27a10.15 10.15 0 0 0 10.14 9.93 8.14 8.14 0 0 1-5.08 4.27z"/></svg>
          )}
        </button>
      </div>
    </header>
  );
}