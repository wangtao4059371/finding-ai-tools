import Head from 'next/head';
import Link from 'next/link';
import Nav from '../components/Nav';
import { getAllPosts, getCategories } from '../lib/blog';
import { getLocale } from '../lib/i18n';

export default function Blog({ posts, categories }) {
  const locale = getLocale();
  const t = (zh, en) => locale === 'zh' ? zh : en;

  return (
    <>
      <Head>
        <title>{t('AI工具教程与评测博客', 'AI Tools Blog - Tutorials & Reviews')}</title>
        <meta name="description" content={t('AI工具评测、对比、教程。GPT, Claude, DeepSeek, Midjourney使用指南。', 'AI tools reviews, comparisons, tutorials. GPT, Claude, DeepSeek, Midjourney guides.')} />
        <meta name="robots" content="index,follow" />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{t('📝 博客', '📝 Blog')}</h1>
            <p className="text-gray-500 mt-1">{t('AI工具评测 · 对比分析 · 使用教程', 'AI Tool Reviews · Comparisons · Tutorials')}</p>
          </div>
        </header>
        <main className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid gap-6">
            {posts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group block">
                <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 hover:shadow-md transition-all group-hover:border-indigo-200 dark:group-hover:border-indigo-800">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span className="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">{post.category}</span>
                    <span>{post.date}</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors mb-2">{post.title}</h2>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2">{post.excerpt}</p>
                </article>
              </Link>
            ))}
            {posts.length === 0 && (
              <p className="text-center text-gray-400 py-12">{t('暂无文章', 'No posts yet')}</p>
            )}
          </div>
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