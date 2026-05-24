import Head from 'next/head';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Nav from '../../components/Nav';
import { getAllPosts, getPostBySlug } from '../../lib/blog';
import { getLocale } from '../../lib/i18n';

export default function BlogPost({ post }) {
  const locale = getLocale();
  const t = (zh, en) => locale === 'zh' ? zh : en;

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Nav />
        <div className="max-w-3xl mx-auto px-4 py-20 text-center text-gray-400">{t('文章不存在', 'Post not found')}</div>
      </div>
    );
  }

  // Split content by language
  const parts = post.content.split('---\n\n## English Version');
  const zhContent = parts[0] || post.content;
  const enContent = parts.length > 1 ? '## English Version' + parts[1] : '';
  const displayContent = locale === 'zh' ? zhContent : (enContent || zhContent);

  return (
    <>
      <Head>
        <title>{post.title} - Finding AI Tools</title>
        <meta name="description" content={post.excerpt} />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.excerpt} />
        <meta property="og:type" content="article" />
        <meta property="article:published_time" content={post.date} />
        <link rel="canonical" href={`https://findingaitools.com/blog/${post.slug}`} />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <Link href="/blog" className="text-indigo-600 dark:text-indigo-400 hover:underline text-sm">← {t('返回博客', 'Back to Blog')}</Link>
          </div>
        </header>
        <main className="max-w-3xl mx-auto px-4 py-8">
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-10">
            <div className="flex items-center gap-3 text-xs text-gray-400 mb-4">
              <span className="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded">{post.category}</span>
              <span>{post.date}</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{post.title}</h1>
            <div className="prose dark:prose-invert prose-indigo max-w-none prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-li:text-gray-700 dark:prose-li:text-gray-300 prose-code:bg-gray-100 dark:prose-code:bg-gray-700 prose-code:px-1 prose-code:rounded prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-600 prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-600 prose-th:bg-gray-50 dark:prose-th:bg-gray-700 prose-th:px-3 prose-th:py-2 prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-600 prose-td:px-3 prose-td:py-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayContent}</ReactMarkdown>
            </div>
            {post.source && (
              <p className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
                {t('原文出处', 'Source')}: <a href={post.source} target="_blank" rel="noopener noreferrer" className="text-indigo-500 hover:underline">{post.source}</a>
              </p>
            )}
          </article>
        </main>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const posts = getAllPosts();
  return {
    paths: posts.map(p => ({ params: { slug: p.slug } })),
    fallback: 'blocking',
  };
}

export async function getStaticProps({ params }) {
  const post = getPostBySlug(params.slug);
  if (!post) return { notFound: true };
  return { props: { post }, revalidate: 3600 };
}