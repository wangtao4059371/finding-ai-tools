import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { getAllTools, getToolById } from '../../lib/api';

export default function ToolDetail({ tool }) {
  if (!tool) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-gray-500 dark:text-gray-400 text-lg">Tool Not Found</div>
      </div>
    );
  }

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.name,
    description: tool.description,
    url: `https://findingaitools.com/tool/${tool.id}`,
    applicationCategory: tool.tag,
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: tool.pricing,
      priceCurrency: 'USD',
    },
  };

  return (
    <>
      <Head>
        <title>{tool.name} - Finding AI Tools</title>
        <meta name="description" content={tool.description} />
        <meta property="og:title" content={`${tool.name} - Finding AI Tools`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:url" content={`https://findingaitools.com/tool/${tool.id}`} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      </Head>

      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-3xl mx-auto px-4 py-4">
            <Link href="/" className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-2">
              ← Back to List
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-8">
          <article className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 transition-all animate-fade-in">
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={tool.logo}
                alt={tool.name}
                width={80}
                height={80}
                className="rounded-xl bg-gray-100 dark:bg-gray-700 object-cover border border-gray-200 dark:border-gray-600"
                unoptimized
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
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">Base Model</span>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium">{tool.base_model}</p>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-500 dark:text-gray-400 block mb-1">Framework</span>
                  <p className="text-purple-600 dark:text-purple-400 font-medium">{tool.framework}</p>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-gray-100 dark:border-gray-700">
              <div className="flex flex-col gap-2">
                <span className="text-gray-500 dark:text-gray-400">Category: <span className="text-indigo-600 dark:text-indigo-400">#{tool.tag}</span></span>
                <span className="text-green-600 dark:text-green-400 font-medium">{tool.pricing}</span>
              </div>
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto text-center bg-indigo-600 dark:bg-indigo-500 text-white px-8 py-3 rounded-lg hover:bg-indigo-700 dark:hover:bg-indigo-600 transition-all font-semibold"
              >
                Visit Project →
              </a>
            </div>
          </article>
        </main>
      </div>
    </>
  );
}

export async function getStaticPaths() {
  const tools = await getAllTools();
  const paths = tools.map(tool => ({
    params: { id: tool.id.toString() },
  }));
  return { paths, fallback: 'blocking' };
}

export async function getStaticProps({ params }) {
  try {
    const tool = await getToolById(params.id);
    return { props: { tool }, revalidate: 60 };
  } catch (error) {
    return { notFound: true };
  }
}