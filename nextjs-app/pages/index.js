import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getAllTools } from '../lib/api';
import { getLocale, t } from '../lib/i18n';
import ToolCard from '../components/ToolCard';
import FilterTags from '../components/FilterTags';

const PAGE_SIZE = 12;

export default function Home({ tools }) {
  const [activeTag, setActiveTag] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState('en');

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    setLocale(getLocale());
  }, []);

  const tags = ['全部', ...new Set(tools.map(t => t.tag))];

  let filteredTools = activeTag === '全部' ? tools : tools.filter(t => t.tag === activeTag);
  
  if (searchQuery.trim()) {
    filteredTools = filteredTools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  const totalPages = Math.ceil(filteredTools.length / PAGE_SIZE);
  const paginatedTools = filteredTools.slice(0, page * PAGE_SIZE);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const handleLoadMore = () => {
    setLoading(true);
    setTimeout(() => {
      setPage(p => p + 1);
      setLoading(false);
    }, 500);
  };

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Finding AI Tools',
    url: 'https://findingaitools.com',
    description: 'Discover the best AI tools, agents, and foundation models. Find the perfect AI tool for your needs.',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://findingaitools.com/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  const itemListData = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: tools.map((tool, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: tool.name,
        description: tool.description,
        url: `https://findingaitools.com/tool/${tool.id}`,
      },
    })),
  };

  return (
    <>
      <Head>
        <title>Finding AI Tools - Best AI Agents & Tools Directory</title>
        <meta name="description" content="Discover the best AI tools, agents, and foundation models. ChatGPT, Claude, Gemini, Midjourney - all in one place." />
        <meta property="og:title" content="Finding AI Tools - Best AI Agents & Tools Directory" />
        <meta property="og:description" content="Discover the best AI tools, agents, and foundation models." />
        <meta property="og:url" content="https://findingaitools.com" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListData) }} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700 sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {locale === 'zh' ? '🤖 AI 智能体与工具导航' : '🤖 Finding AI Tools'}
            </h1>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              aria-label={darkMode ? t('lightMode') : t('darkMode')}
            >
              {darkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </header>

        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="relative">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setPage(1);
                }}
                className="w-full sm:w-80 px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-48 shrink-0">
            <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-xs mb-3">
              {t('categories')}
            </h3>
            <FilterTags tags={tags} activeTag={activeTag} onFilter={(tag) => { setActiveTag(tag); setPage(1); }} />
          </aside>

          <section className="flex-1">
            <ins className="adsbygoogle"
              style={{ display: 'block' }}
              data-ad-client="ca-pub-XXXXXXXXXXXX"
              data-ad-slot="XXXXXXXXXX"
              data-ad-format="auto"
              data-full-width-responsive="true"
            />
            
            {paginatedTools.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 col-span-full text-center py-8">{t('noResults')}</p>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedTools.map((tool, index) => (
                    <div key={tool.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                      <ToolCard tool={tool} />
                    </div>
                  ))}
                </div>
                
                {page < totalPages && (
                  <div className="mt-8 text-center">
                    <button
                      onClick={handleLoadMore}
                      disabled={loading}
                      className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all disabled:opacity-50"
                    >
                      {loading ? t('loading') : `${t('loadMore')} (${paginatedTools.length}/${filteredTools.length})`}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </main>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8 mt-8">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Finding AI Tools</h4>
              <ul className="space-y-1">
                <li><a href="/about" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">About</a></li>
                <li><a href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Legal</h4>
              <ul className="space-y-1">
                <li><a href="/privacy-policy" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">Privacy Policy</a></li>
                <li><a href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">Terms</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Categories</h4>
              <ul className="space-y-1">
                <li><a href="/?tag=大模型AI" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">AI Models</a></li>
                <li><a href="/?tag=AI音频/音乐" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">AI Music</a></li>
                <li><a href="/?tag=AI学习资源" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">Learning</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Tools</h4>
              <ul className="space-y-1">
                <li><a href="/tool/chatgpt" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">ChatGPT</a></li>
                <li><a href="/tool/claude" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">Claude</a></li>
                <li><a href="/tool/gemini" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">Gemini</a></li>
                <li><a href="/tool/deepseek" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">DeepSeek</a></li>
              </ul>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center text-gray-500 dark:text-gray-400 text-xs">
            {t('footer')}
          </div>
        </footer>

        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXX" crossOrigin="anonymous" />
      </div>
    </>
  );
}

export async function getStaticProps() {
  const tools = await getAllTools();
  return {
    props: { tools },
    revalidate: 60,
  };
}