import { useMemo, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { getAllPosts, getCategories } from '../lib/blog';
import { useLocale } from '../lib/i18n';

function PostImage({ post, featured = false }) {
  return (
    <div className={`relative min-w-0 overflow-hidden bg-gray-100 dark:bg-gray-700 ${featured ? 'aspect-[16/9] lg:aspect-[5/3]' : 'aspect-[16/9]'}`}>
      <img
        src={post.cover}
        alt={post.title}
        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        loading={featured ? 'eager' : 'lazy'}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-gray-950/35 via-transparent to-transparent" />
    </div>
  );
}

function Meta({ post, locale }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <span className="rounded-md bg-indigo-50 px-2 py-1 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
        {post.category}
      </span>
      <span>{post.date}</span>
      <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
      <span>{locale === 'zh' ? `约 ${post.readingTime} 分钟` : `${post.readingTime} min read`}</span>
    </div>
  );
}

function PostCard({ post, locale }) {
  const excerpt = locale === 'zh' ? post.excerpt : (post.excerpt_en || post.excerpt);

  return (
    <Link href={`/blog/${post.slug}`} className="group block h-full">
      <article className="flex h-full min-w-0 flex-col overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-800">
        <PostImage post={post} />
        <div className="flex min-w-0 flex-1 flex-col p-5">
          <Meta post={post} locale={locale} />
          <h2 className="mt-3 line-clamp-2 break-all text-lg font-bold leading-snug text-gray-900 transition-colors group-hover:text-indigo-600 sm:break-words dark:text-gray-100 dark:group-hover:text-indigo-400" style={{ overflowWrap: 'anywhere' }}>
            {post.title}
          </h2>
          <p className="mt-3 line-clamp-3 break-all text-sm leading-6 text-gray-600 sm:break-words dark:text-gray-400">{excerpt}</p>
          <span className="mt-5 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
            {locale === 'zh' ? '阅读全文' : 'Read article'}
          </span>
        </div>
      </article>
    </Link>
  );
}

export default function Blog({ posts, categories }) {
  const locale = useLocale();
  const t = (zh, en) => locale === 'zh' ? zh : en;
  const [activeCategory, setActiveCategory] = useState('all');
  const [query, setQuery] = useState('');
  const featuredPost = posts[0] || null;
  const regularPosts = posts.slice(1);

  const filteredPosts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return regularPosts.filter(post => {
      const matchesCategory = activeCategory === 'all' || post.category === activeCategory;
      const haystack = `${post.title} ${post.excerpt} ${post.excerpt_en || ''} ${post.category}`.toLowerCase();
      return matchesCategory && (!normalizedQuery || haystack.includes(normalizedQuery));
    });
  }, [activeCategory, query, regularPosts]);

  return (
    <>
      <Head>
        <title>{t('AI工具教程与评测博客', 'AI Tools Blog - Tutorials & Reviews')}</title>
        <meta name="description" content={t('AI工具评测、对比、教程。GPT, Claude, DeepSeek, Midjourney使用指南。', 'AI tools reviews, comparisons, tutorials. GPT, Claude, DeepSeek, Midjourney guides.')} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://findingaitools.com/blog" />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
                Finding AI Tools
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
                {t('AI工具教程与评测博客', 'AI Tools Blog')}
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500 dark:text-gray-400">
                {t('聚合AI工具评测、模型对比、产品教程和开发者实测。', 'Reviews, comparisons, tutorials, and developer notes for AI tools and models.')}
              </p>
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {t(`共 ${posts.length} 篇文章`, `${posts.length} articles`)}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl overflow-x-hidden px-4 py-8">
          {featuredPost && (
            <section className="mb-8">
              <Link href={`/blog/${featuredPost.slug}`} className="group block w-[calc(100vw-2rem)] max-w-full overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all hover:border-indigo-200 hover:shadow-md sm:w-full dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-800">
                <article className="grid min-w-0 lg:grid-cols-[1.12fr_0.88fr]">
                  <PostImage post={featuredPost} featured />
                  <div className="flex min-w-0 flex-col justify-center p-6 md:p-8">
                    <Meta post={featuredPost} locale={locale} />
                    <h2 className="mt-4 break-all text-xl font-bold leading-snug text-gray-900 transition-colors group-hover:text-indigo-600 sm:break-words sm:text-2xl dark:text-gray-100 dark:group-hover:text-indigo-400 md:text-3xl" style={{ overflowWrap: 'anywhere' }}>
                      {featuredPost.title}
                    </h2>
                    <p className="mt-4 line-clamp-4 break-all text-sm leading-6 text-gray-600 sm:break-words dark:text-gray-400 md:text-base">
                      {locale === 'zh' ? featuredPost.excerpt : (featuredPost.excerpt_en || featuredPost.excerpt)}
                    </p>
                    <span className="mt-6 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                      {t('查看精选文章', 'Read featured article')}
                    </span>
                  </div>
                </article>
              </Link>
            </section>
          )}

          <section className="mb-6 rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveCategory('all')}
                  className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeCategory === 'all' ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                >
                  {t('全部', 'All')}
                </button>
                {categories.map(category => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${activeCategory === category ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="relative block w-full md:max-w-xs">
                <span className="sr-only">{t('搜索文章', 'Search posts')}</span>
                <input
                  type="search"
                  value={query}
                  onChange={event => setQuery(event.target.value)}
                  placeholder={t('搜索文章...', 'Search posts...')}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm text-gray-800 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 dark:border-gray-600 dark:bg-gray-900 dark:text-gray-100 dark:focus:ring-indigo-950"
                />
              </label>
            </div>
          </section>

          <section>
            <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">
              {t(`筛选结果：${filteredPosts.length} 篇`, `${filteredPosts.length} results`)}
            </div>
            {filteredPosts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredPosts.map(post => (
                  <PostCard key={post.slug} post={post} locale={locale} />
                ))}
              </div>
            ) : (
              <div className="rounded-lg border border-dashed border-gray-200 bg-white px-6 py-12 text-center text-sm text-gray-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400">
                {t('没有匹配的文章', 'No matching posts')}
              </div>
            )}
          </section>
        </main>
      </div>
    </>
  );
}

export async function getStaticProps() {
  const posts = getAllPosts();
  const categories = getCategories();
  return { props: { posts, categories }, revalidate: 3600 };
}
