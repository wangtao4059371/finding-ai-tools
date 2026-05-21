import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { getAllTools } from '../lib/api';
import { getLocale, t } from '../lib/i18n';
import Nav from '../components/Nav';
import ToolCard from '../components/ToolCard';
import FilterTags from '../components/FilterTags';

const MODEL_LOGOS = [
  "https://claude.ai","https://deepmind.google","https://openai.com","https://www.volcengine.com",
  "https://www.deepseek.com","https://deepmind.google","https://www.deepseek.com","https://x.ai",
  "https://kimi.moonshot.cn","https://tongyi.aliyun.com","https://www.zhipuai.cn","https://www.deepseek.com",
  "https://www.mi.com","https://cloud.tencent.com","https://tongyi.aliyun.com","https://www.meituan.com",
  "https://github.com/openai","https://www.stepfun.com","https://www.minimax.io","https://www.minimax.io",
  "https://xinghuo.xfyun.cn","https://www.mi.com","https://mistral.ai","https://llama.meta.com",
];

const favicon = (url) => 'https://www.google.com/s2/favicons?domain=' + new URL(url).hostname + '&sz=32';

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

export default function Tools({ tools }) {
  const [activeTag, setActiveTag] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [locale, setLocale] = useState('en');
  const [sortBy, setSortBy] = useState('default');
  const [showBackTop, setShowBackTop] = useState(false);
  const firstVisit = useRef(true);

  useEffect(() => {
    setLocale(getLocale());
    if (firstVisit.current) {
      firstVisit.current = false;
      setLoading(true);
      setTimeout(() => setLoading(false), 800);
    }
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
  } else if (sortBy === 'latest') {
    filteredTools = [...filteredTools].sort((a, b) => b.id - a.id);
  }

  const totalPages = Math.ceil(filteredTools.length / PAGE_SIZE);
  const paginatedTools = filteredTools.slice(0, page * PAGE_SIZE);

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
      <Nav />

        {/* Hero Section */}
        <a href="/ratings" className="block bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 dark:from-slate-950 dark:via-indigo-950 dark:to-slate-950 py-12 md:py-16 border-b border-indigo-900/30 cursor-pointer group">
          <div className="max-w-5xl mx-auto px-4">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center text-white mb-3 tracking-tight">
              {locale === 'zh' ? '热门 24 款 AI 大模型评测排名' : 'Top 24 AI Model Rankings'}
            </h1>

            {/* Logo Row */}
            <div className="flex justify-center flex-wrap gap-1.5 mb-6 max-w-3xl mx-auto">
              {MODEL_LOGOS.map((url,i)=>(
                <img key={i} loading="lazy" src={favicon(url)} className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/10 p-0.5 hover:bg-white/30 transition-all hover:scale-110" alt="" onError={e=>e.target.style.display='none'} />
              ))}
            </div>

            {/* Chart Previews Row */}
            <div className="flex flex-col md:flex-row gap-4 mb-6 max-w-3xl mx-auto">
              {/* Radar Preview */}
              <div className="flex-1 bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                <div className="text-xs text-indigo-300 font-semibold mb-2 text-center">📡 {locale==='zh'?'多维雷达对比':'Radar Comparison'}</div>
                <div className="flex justify-center">
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <polygon points="60,10 95,35 95,85 60,110 25,85 25,35" fill="rgba(99,102,241,0.2)" stroke="rgba(99,102,241,0.8)" strokeWidth="1.5"/>
                    <polygon points="60,20 88,38 88,82 60,100 32,82 32,38" fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.7)" strokeWidth="1.5"/>
                    <circle cx="60" cy="60" r="2" fill="#6366f1"/>
                    <circle cx="88" cy="38" r="2" fill="#6366f1"/>
                    <circle cx="88" cy="82" r="2" fill="#6366f1"/>
                    <circle cx="60" cy="100" r="2" fill="#6366f1"/>
                    <circle cx="32" cy="82" r="2" fill="#6366f1"/>
                    <circle cx="32" cy="38" r="2" fill="#6366f1"/>
                  </svg>
                </div>
              </div>
              {/* Bar Preview */}
              <div className="flex-1 bg-white/5 backdrop-blur rounded-xl p-4 border border-white/10">
                <div className="text-xs text-indigo-300 font-semibold mb-2 text-center">📊 {locale==='zh'?'总分排名':'Total Score Ranking'}</div>
                <div className="flex items-end gap-0.5 h-[100px] justify-center">
                  {[72,67,64,60,56,52,50,42,37].map((h,i)=>(
                    <div key={i} className="w-[8%] rounded-t transition-all" style={{height:h+'%',background:`hsl(${260-i*15},70%,${50+i*3}%)`,minHeight:2}}/>
                  ))}
                </div>
              </div>
            </div>

            {/* Sub Info + CTA */}
            <div className="text-center">
              <p className="text-sm text-indigo-200/80 mb-1">
                {locale==='zh' 
                  ? '6 维度评测：数学推理 · 幻觉控制 · 科学推理 · 指令遵循 · 代码生成 · 智能体'
                  : '6 dimensions: Math · Hallucination · Science · Instruction · Coding · Agent'}
              </p>
              <p className="text-xs text-indigo-300/60 mb-4">
                {locale==='zh' ? '数据来源：SuperCLUE 中文大模型评测基准 (2026.3)' : 'Source: SuperCLUE Chinese LLM Benchmark (March 2026)'}
              </p>
              <span className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-full font-bold text-base transition-all group-hover:scale-105 group-hover:shadow-lg group-hover:shadow-indigo-500/30">
                {locale==='zh' ? '点击查看完整排名' : 'View Full Rankings'}
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/></svg>
              </span>
            </div>
          </div>
        </a>

        {/* Stats */}
        <section className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 py-6">
          <div className="max-w-7xl mx-auto px-4 flex justify-center gap-8 md:gap-12">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-indigo-600">{toolCount}+</div>
              <div className="text-sm text-gray-500">{locale === 'zh' ? '收录工具' : 'Tools'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-indigo-600">{categoryCount}+</div>
              <div className="text-sm text-gray-500">{locale === 'zh' ? '分类' : 'Categories'}</div>
            </div>
          </div>
        </section>
                <div className="text-indigo-200 text-sm">{locale === 'zh' ? '分类' : 'Categories'}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Tools + AI Recommend */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">
                {locale === 'zh' ? '✨ 精选推荐' : '✨ Featured'}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {tools.filter(t=>t.slug).slice(0,3).map(tool => (
                  <a key={tool.id} href={`/tool/${tool.slug}`} className="group">
                    <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 rounded-xl p-5 border border-indigo-100 dark:border-indigo-900 hover:shadow-lg transition-all group-hover:scale-[1.02] h-full">
                      <div className="flex items-center gap-3 mb-3">
                        <img src={tool.logo} alt="" className="w-10 h-10 rounded-lg" onError={e=>e.target.style.display='none'} />
                        <div>
                          <div className="font-bold text-gray-900 dark:text-gray-100 text-sm">{tool.name}</div>
                          <span className="text-xs text-gray-500">#{tool.tag}</span>
                        </div>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{tool.description}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Search + Sort + Filter */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 sticky top-[73px] z-40">
          <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row gap-3 items-center">
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
                className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 text-sm"
              >
                <option value="default">{locale === 'zh' ? '默认排序' : 'Default'}</option>
                <option value="latest">{locale === 'zh' ? '最新收录' : 'Latest'}</option>
                <option value="name">{locale === 'zh' ? '名称 A-Z' : 'Name A-Z'}</option>
              </select>
            </div>
            <div className="flex gap-2 flex-wrap items-center">
              {['全部','免费','付费','开源'].map(f => (
                <button key={f} onClick={() => { setSearchQuery(f==='全部'?'':f); setPage(1); }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${searchQuery===f||(f==='全部'&&!searchQuery)?'bg-indigo-600 text-white shadow-sm':'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  {f}
                </button>
              ))}
              <span className="text-gray-300 dark:text-gray-600 mx-0.5">|</span>
              {['Agent','Tool'].map(t => (
                <button key={t} onClick={() => { setSearchQuery(t); setPage(1); }}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${searchQuery===t?'bg-indigo-600 text-white shadow-sm':'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                  {t}
                </button>
              ))}
              {searchQuery && (
                <button onClick={() => { setSearchQuery(''); setPage(1); }}
                  className="px-3 py-1.5 rounded-full text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  ✕ {locale==='zh'?'清除':'Clear'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-48 shrink-0">
            <h3 className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-xs mb-3">
              {t('categories')}
            </h3>
            <FilterTags tags={tags} activeTag={activeTag} onFilter={(tag) => { setActiveTag(tag); setPage(1); }} locale={locale} />
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