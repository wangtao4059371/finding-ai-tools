import { useState, useEffect } from 'react';
import Head from 'next/head';
import { getAllTools } from '../lib/api';
import { getLocale, t } from '../lib/i18n';
import ToolCard from '../components/ToolCard';
import FilterTags from '../components/FilterTags';

const PAGE_SIZE = 12;

function SkeletonCard() {
  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 h-[350px] animate-pulse">
      <div className="flex items-start justify-between mb-4 mt-2">
        <div className="w-14 h-14 rounded-xl bg-gray-200 dark:bg-gray-700" />
      </div>
      <div className="h-6 w-3/4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
      <div className="h-4 w-full bg-gray-100 dark:bg-gray-600 rounded mb-1" />
      <div className="h-4 w-5/6 bg-gray-100 dark:bg-gray-600 rounded mb-1" />
      <div className="h-4 w-2/3 bg-gray-100 dark:bg-gray-600 rounded mb-4" />
      <div className="h-10 w-full bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 flex justify-between">
        <div className="h-4 w-16 bg-gray-100 dark:bg-gray-600 rounded" />
        <div className="h-4 w-20 bg-gray-100 dark:bg-gray-600 rounded" />
      </div>
    </div>
  );
}

export default function Home({ tools }) {
  const [activeTag, setActiveTag] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [locale, setLocale] = useState('en');
  const [sortBy, setSortBy] = useState('default');
  const [showBackTop, setShowBackTop] = useState(false);

  useEffect(() => {
    const isDark = localStorage.getItem('theme') === 'dark' || 
      (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(isDark);
    setLocale(getLocale());
    setTimeout(() => setLoading(false), 800);
  }, []);

  useEffect(() => {
    const onScroll = () => setShowBackTop(window.scrollY > 400);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const tags = ['全部', ...new Set(tools.map(t => t.tag))];
  const categoryCount = tags.length - 1;
  const toolCount = tools.length;

  let filteredTools = activeTag === '全部' ? tools : tools.filter(t => t.tag === activeTag);
  
  if (searchQuery.trim()) {
    filteredTools = filteredTools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  // 排序
  if (sortBy === 'name') {
    filteredTools = [...filteredTools].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === 'popular') {
    filteredTools = [...filteredTools].sort((a, b) => b.id - a.id);
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
    setPage(p => p + 1);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Head>
        <title>Finding AI Tools - Best AI Agents & Tools Directory</title>
        <meta name="description" content="Discover the best AI tools, agents, and foundation models. ChatGPT, Claude, Gemini, Midjourney - all in one place." />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Header */}
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

        {/* Hero Section */}
        <section className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 dark:from-indigo-900 dark:via-purple-900 dark:to-pink-900 py-16">
          <div className="max-w-7xl mx-auto px-4 text-center text-white">
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              {locale === 'zh' ? '发现最佳 AI 工具' : 'Discover the Best AI Tools'}
            </h2>
            <p className="text-lg sm:text-xl text-indigo-100 max-w-2xl mx-auto mb-8">
              {locale === 'zh' 
                ? '一站式导航平台，收录全球 AI 模型、智能体、创作工具，帮你快速找到需要的 AI 解决方案。'
                : 'Your one-stop directory for AI models, agents, and creative tools. Find the perfect AI solution for your needs.'}
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 mt-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{toolCount}+</div>
                <div className="text-indigo-200 text-sm">{locale === 'zh' ? '收录工具' : 'Tools'}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">{categoryCount}+</div>
                <div className="text-indigo-200 text-sm">{locale === 'zh' ? '分类' : 'Categories'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Search + Sort + Filter */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-[73px] z-40">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                placeholder={t('searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1); }}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="default">{locale === 'zh' ? '默认排序' : 'Default'}</option>
              <option value="popular">{locale === 'zh' ? '最新收录' : 'Latest'}</option>
              <option value="name">{locale === 'zh' ? '名称 A-Z' : 'Name A-Z'}</option>
            </select>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-48 shrink-0">
            <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-xs mb-3">
              {t('categories')}
            </h3>
            <FilterTags tags={tags} activeTag={activeTag} onFilter={(tag) => { setActiveTag(tag); setPage(1); }} />
          </aside>

          <section className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                    <SkeletonCard />
                  </div>
                ))}
              </div>
            ) : paginatedTools.length === 0 ? (
              <p className="text-gray-400 dark:text-gray-500 col-span-full text-center py-8">{t('noResults')}</p>
            ) : (
              <>
                <div className="mb-3 text-sm text-gray-500 dark:text-gray-400">
                  {locale === 'zh' ? `共 ${filteredTools.length} 个工具` : `${filteredTools.length} tools found`}
                </div>
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
                      className="px-8 py-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all"
                    >
                      {`${t('loadMore')} (${paginatedTools.length}/${filteredTools.length})`}
                    </button>
                  </div>
                )}
              </>
            )}
          </section>
        </main>

        {/* Back to Top */}
        {showBackTop && (
          <button
            onClick={scrollToTop}
            className="fixed bottom-6 right-6 z-50 p-3 bg-indigo-600 dark:bg-indigo-500 text-white rounded-full shadow-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all animate-fade-in"
          >
            ↑
          </button>
        )}

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8 mt-8">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{locale === 'zh' ? '关于我们' : 'About'}</h4>
              <ul className="space-y-1">
                <li><a href="/about" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale === 'zh' ? '关于' : 'About'}</a></li>
                <li><a href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale === 'zh' ? '联系我们' : 'Contact'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{locale === 'zh' ? '法律条款' : 'Legal'}</h4>
              <ul className="space-y-1">
                <li><a href="/privacy-policy" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale === 'zh' ? '隐私政策' : 'Privacy Policy'}</a></li>
                <li><a href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale === 'zh' ? '服务条款' : 'Terms'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{locale === 'zh' ? '分类' : 'Categories'}</h4>
              <ul className="space-y-1">
                <li><a href="/?tag=大模型AI" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale === 'zh' ? '大模型AI' : 'AI Models'}</a></li>
                <li><a href="/?tag=AI音频/音乐" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale === 'zh' ? 'AI音频/音乐' : 'AI Music'}</a></li>
                <li><a href="/?tag=AI学习资源" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale === 'zh' ? 'AI学习资源' : 'Learning'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{locale === 'zh' ? '热门工具' : 'Popular'}</h4>
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