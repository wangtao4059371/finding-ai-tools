import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { getAllTools, getToolBySlug } from '../../lib/api';
import { getLocale, t } from '../../lib/i18n';
import ToolCard from '../../components/ToolCard';

export default function ToolDetail({ tool, relatedTools }) {
  const locale = getLocale();

  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400 text-lg">{t('toolNotFound')}</div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `https://findingaitools.com/tool/${tool.slug}`,
  };

  return (
    <>
      <Head>
        <title>{tool.name} - Finding AI Tools</title>
        <meta name="description" content={tool.description} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        {/* Breadcrumb */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-3xl mx-auto px-4 py-3">
            <nav className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">
              <Link href="/" className="hover:text-indigo-600 dark:hover:text-indigo-400">Home</Link>
              <span>›</span>
              <Link href={`/?tag=${tool.tag}`} className="hover:text-indigo-600 dark:hover:text-indigo-400">{tool.tag}</Link>
              <span>›</span>
              <span className="text-gray-900 dark:text-gray-100 font-medium truncate">{tool.name}</span>
            </nav>
          </div>
        </div>

        {/* Header with back link */}
        <header className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2">
              ← {t('backToList')}
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <ins className="adsbygoogle block mx-auto mb-6" style={{display:'block',maxWidth:728,height:90}}
            data-ad-client="ca-pub-XXXXXXXXXXXX" data-ad-slot="XXXXXXXXXX" data-ad-format="auto"/>
          
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={tool.logo}
                alt={tool.name}
                width={80}
                height={80}
                className="rounded-xl bg-gray-100 dark:bg-gray-700 object-cover border border-gray-200 dark:border-gray-600"
                unoptimized
                loading="lazy"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tool.name}</h1>
                <span className={`inline-block mt-2 px-3 py-1 text-sm font-bold rounded-lg ${
                  tool.type === 'Agent' 
                    ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' 
                    : 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300'
                }`}>
                  {tool.type.toUpperCase()}
                </span>
              </div>
            </div>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 text-lg">{tool.description}</p>

            {tool.type === 'Agent' && (
              <div className="grid grid-cols-2 gap-4 mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">{t('baseModel')}</span>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">{tool.base_model}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">{t('framework')}</span>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">{tool.framework}</p>
                </div>
              </div>
            )}

            {tool.content && (
              <div 
                className="prose dark:prose-invert prose-indigo max-w-none text-gray-700 dark:text-gray-300 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: tool.content }}
              />
            )}
            {tool.content_updated && (
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                {locale === 'zh' ? '内容更新时间' : 'Last updated'}: {new Date(tool.content_updated).toLocaleDateString()}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 dark:text-gray-400">{locale === 'zh' ? '分类' : 'Category'}: <span className="text-indigo-600 dark:text-indigo-400">#{tool.tag}</span></span>
                <span className="text-green-600 dark:text-green-400 font-medium">{tool.pricing}</span>
              </div>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => { if (typeof gtag !== 'undefined') gtag('event', 'visit_project', { tool_name: tool.name }); }}
                className="w-full sm:w-auto text-center bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all font-semibold"
              >
                {t('visitProject')} →
              </a>
            </div>
          </article>

          {/* Related Tools */}
          {relatedTools.length > 0 && (
            <section className="mt-8">
              <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {locale === 'zh' ? '相关工具' : 'Related Tools'}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {relatedTools.slice(0, 4).map(t => (
                  <ToolCard key={t.id} tool={t} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const tools = await getAllTools();
  const paths = tools.filter(t => t.slug).map(tool => ({ params: { slug: tool.slug } }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  try {
    const tools = await getAllTools();
    const tool = tools.find(t => t.slug === params.slug);
    
    if (!tool) return { notFound: true };
    
    const relatedTools = tools
      .filter(t => t.tag === tool.tag && t.id !== tool.id)
      .slice(0, 4);
    
    return { props: { tool, relatedTools }, revalidate: 60 };
  } catch (error) {
    return { notFound: true };
  }
}