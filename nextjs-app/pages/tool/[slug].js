import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect } from 'react';
import { getAllTools, getToolBySlug } from '../../lib/api';
import { translate, useLocale } from '../../lib/i18n';
import ToolCard from '../../components/ToolCard';
import { trackEvent, trackVisitProject } from '../../lib/analytics';

function formatStableDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toISOString().slice(0, 10);
}

function toolLogo(tool) {
  return tool.owner_avatar_url || tool.logo || '/favicon.svg';
}

function githubPath(tool) {
  if (tool.owner_login && tool.repo_name) return `${tool.owner_login}/${tool.repo_name}`;
  try {
    const url = new URL(tool.github_url || tool.url);
    if (url.hostname !== 'github.com') return '';
    const [owner, repo] = url.pathname.split('/').filter(Boolean);
    return owner && repo ? `${owner}/${repo.replace(/\.git$/, '')}` : '';
  } catch (e) {
    return '';
  }
}

function topicsList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  return String(value).split(',').map(item => item.trim()).filter(Boolean);
}

export default function ToolDetail({ tool, relatedTools }) {
  const locale = useLocale();
  const t = key => translate(key, locale);

  useEffect(() => {
    if (!tool) return;
    trackEvent('tool_detail_view', {
      tool_name: tool.name,
      tool_slug: tool.slug || tool.id,
      tool_category: tool.tag,
      tool_type: tool.type,
      pricing: tool.pricing,
    });
  }, [tool]);

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
  const canonicalUrl = `https://findingaitools.com/tool/${tool.slug}`;
  const repoPath = githubPath(tool);
  const topics = topicsList(tool.topics).slice(0, 8);

  return (
    <>
      <Head>
        <title>{`${tool.name} - Finding AI Tools`}</title>
        <meta name="description" content={tool.description} />
        <link rel="canonical" href={canonicalUrl} />
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
            data-ad-client="ca-pub-7649278856996509" data-ad-slot="XXXXXXXXXX" data-ad-format="auto"/>
          
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={toolLogo(tool)}
                alt={tool.name}
                width={80}
                height={80}
                className="rounded-xl bg-gray-100 dark:bg-gray-700 object-cover border border-gray-200 dark:border-gray-600"
                unoptimized
                loading="lazy"
              />
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{tool.name}</h1>
                {repoPath && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{repoPath}</p>
                )}
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

            {repoPath && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">Stars</span>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{tool.stars > 0 ? tool.stars.toLocaleString() : '-'}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">Forks</span>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{tool.forks > 0 ? tool.forks.toLocaleString() : '-'}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">{locale === 'zh' ? '语言' : 'Language'}</span>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{tool.language || '-'}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">{locale === 'zh' ? '最近更新' : 'Updated'}</span>
                  <p className="text-gray-900 dark:text-gray-100 font-medium">{tool.pushed_at ? formatStableDate(tool.pushed_at) : '-'}</p>
                </div>
              </div>
            )}

            {topics.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {topics.map(topic => (
                  <span key={topic} className="px-2.5 py-1 text-xs font-medium rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                    {topic}
                  </span>
                ))}
              </div>
            )}

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
                {locale === 'zh' ? '内容更新时间' : 'Last updated'}: {formatStableDate(tool.content_updated)}
              </p>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 dark:text-gray-400">{locale === 'zh' ? '分类' : 'Category'}: <span className="text-indigo-600 dark:text-indigo-400">#{tool.tag}</span></span>
                {repoPath && tool.license && (
                  <span className="text-gray-500 dark:text-gray-400">License: <span className="text-gray-700 dark:text-gray-300">{tool.license}</span></span>
                )}
                <span className="text-green-600 dark:text-green-400 font-medium">{tool.pricing}</span>
              </div>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackVisitProject(tool, 'tool_detail')}
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
    const summaryTool = tools.find(t => t.slug === params.slug);
    
    if (!summaryTool) return { notFound: true };

    const tool = await getToolBySlug(params.slug);
    
    const relatedTools = tools
      .filter(t => t.tag === tool.tag && t.id !== tool.id)
      .slice(0, 4);
    
    return { props: { tool, relatedTools }, revalidate: 60 };
  } catch (error) {
    return { notFound: true };
  }
}
