import Head from 'next/head';
import Link from 'next/link';
import { useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Nav from '../../components/Nav';
import { getAdjacentPosts, getAllPosts, getPostBySlug, getRelatedPosts } from '../../lib/blog';
import { useLocale } from '../../lib/i18n';
import { trackEvent } from '../../lib/analytics';

function getHeadings(content) {
  return content
    .split('\n')
    .map(line => {
      const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
      if (!match) return null;
      const text = match[2].replace(/[#*_`[\]()]/g, '').trim();
      if (!text || text.toLowerCase() === 'english version') return null;
      return { level: match[1].length, text };
    })
    .filter(Boolean)
    .map((heading, index) => ({ ...heading, id: `section-${index}` }));
}

function markdownText(children) {
  return Array.isArray(children) ? children.join('') : String(children || '');
}

function getPostTitle(post, locale) {
  return locale === 'zh' ? post.title : (post.title_en || post.title);
}

function Meta({ post, locale }) {
  const readingTime = locale === 'zh' ? post.readingTime : (post.readingTime_en || post.readingTime);
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
      <span className="rounded-md bg-indigo-50 px-2 py-1 font-medium text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300">
        {post.category}
      </span>
      <span>{post.date}</span>
      {post.updated && post.updated !== post.date && (
        <span>{locale === 'zh' ? `更新 ${post.updated}` : `Updated ${post.updated}`}</span>
      )}
      <span className="h-1 w-1 rounded-full bg-gray-300 dark:bg-gray-600" />
      <span>{locale === 'zh' ? `约 ${readingTime} 分钟` : `${readingTime} min read`}</span>
    </div>
  );
}

function Toc({ headings, title, post, source }) {
  if (!headings.length) return null;
  return (
    <nav className="space-y-1 text-sm">
      <p className="mb-3 font-semibold text-gray-900 dark:text-gray-100">{title}</p>
      {headings.map(heading => (
        <a
          key={heading.id}
          href={`#${heading.id}`}
          onClick={() => trackEvent('blog_toc_click', {
            post_title: post?.title,
            post_slug: post?.slug,
            heading_text: heading.text,
            source,
          })}
          className={`block rounded-md py-1.5 pr-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-indigo-600 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-indigo-400 ${heading.level === 3 ? 'pl-5' : 'pl-2 font-medium'}`}
        >
          {heading.text}
        </a>
      ))}
    </nav>
  );
}

function RelatedCard({ post, locale }) {
  const title = getPostTitle(post, locale);
  return (
    <Link
      href={`/blog/${post.slug}`}
      onClick={() => trackEvent('select_related_blog', {
        post_title: post.title,
        post_slug: post.slug,
        post_category: post.category,
      })}
      className="group block"
    >
      <article className="min-w-0 overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-800">
        <div className="aspect-[16/9] overflow-hidden bg-gray-100 dark:bg-gray-700">
          <img src={post.cover} alt={title} className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]" loading="lazy" />
        </div>
        <div className="p-4">
          <Meta post={post} locale={locale} />
          <h3 className="mt-3 line-clamp-2 break-all text-base font-bold leading-snug text-gray-900 group-hover:text-indigo-600 sm:break-words dark:text-gray-100 dark:group-hover:text-indigo-400" style={{ overflowWrap: 'anywhere' }}>
            {title}
          </h3>
        </div>
      </article>
    </Link>
  );
}

function AdjacentLink({ post, label, locale, align = 'left' }) {
  if (!post) return <div />;
  const title = getPostTitle(post, locale);
  return (
    <Link
      href={`/blog/${post.slug}`}
      onClick={() => trackEvent('select_adjacent_blog', {
        post_title: post.title,
        post_slug: post.slug,
        direction: align === 'right' ? 'next' : 'previous',
      })}
      className={`block rounded-lg border border-gray-100 bg-white p-4 shadow-sm transition-all hover:border-indigo-200 hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:border-indigo-800 ${align === 'right' ? 'text-right' : ''}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">{label}</span>
      <p className="mt-2 line-clamp-2 break-all text-sm font-semibold text-gray-900 sm:break-words dark:text-gray-100" style={{ overflowWrap: 'anywhere' }}>{title}</p>
    </Link>
  );
}

export default function BlogPost({ post, relatedPosts, previousPost, nextPost }) {
  const locale = useLocale();
  const t = (zh, en) => locale === 'zh' ? zh : en;

  useEffect(() => {
    if (!post) return;

    trackEvent('blog_detail_view', {
      post_title: post.title,
      post_slug: post.slug,
      post_category: post.category,
      reading_time_min: post.readingTime,
    });

    let sentReadDepth = false;
    const onScroll = () => {
      if (sentReadDepth) return;
      const doc = document.documentElement;
      const scrollableHeight = doc.scrollHeight - window.innerHeight;
      const depth = scrollableHeight <= 0 ? 1 : window.scrollY / scrollableHeight;
      if (depth >= 0.75) {
        sentReadDepth = true;
        trackEvent('blog_read_75', {
          post_title: post.title,
          post_slug: post.slug,
          post_category: post.category,
        });
        window.removeEventListener('scroll', onScroll);
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [post]);

  if (!post) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Nav />
        <div className="mx-auto max-w-3xl px-4 py-20 text-center text-gray-400">{t('文章不存在', 'Post not found')}</div>
      </div>
    );
  }

  const parts = post.content.split('---\n\n## English Version');
  const zhContent = parts[0] || post.content;
  const enContent = parts.length > 1 ? '## English Version' + parts[1] : '';
  const displayContent = locale === 'zh' ? zhContent : (enContent || zhContent);
  const displayTitle = getPostTitle(post, locale);
  const displayExcerpt = locale === 'zh' ? post.excerpt : (post.excerpt_en || post.excerpt);
  const headings = getHeadings(displayContent);
  let headingIndex = 0;
  const canonicalUrl = `https://findingaitools.com/blog/${post.slug}`;
  const imageUrl = post.cover.startsWith('http') ? post.cover : `https://findingaitools.com${post.cover}`;
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: displayTitle,
    description: displayExcerpt,
    image: imageUrl,
    datePublished: post.date,
    dateModified: post.updated || post.date,
    author: { '@type': 'Organization', name: 'Finding AI Tools' },
    publisher: { '@type': 'Organization', name: 'Finding AI Tools' },
    mainEntityOfPage: canonicalUrl,
  };

  const markdownComponents = {
    h2: ({ children }) => {
      if (markdownText(children).trim().toLowerCase() === 'english version') {
        return <h2>{children}</h2>;
      }
      const heading = headings[headingIndex++];
      return <h2 id={heading?.id}>{children}</h2>;
    },
    h3: ({ children }) => {
      const heading = headings[headingIndex++];
      return <h3 id={heading?.id}>{children}</h3>;
    },
    img: ({ src, alt }) => (
      <span className="my-8 block overflow-hidden rounded-lg border border-gray-100 bg-gray-100 shadow-sm dark:border-gray-700 dark:bg-gray-800">
        <img src={src} alt={alt || ''} className="w-full object-cover" loading="lazy" />
      </span>
    ),
    table: ({ children }) => (
      <div className="my-6 overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
        <table>{children}</table>
      </div>
    ),
    blockquote: ({ children }) => (
      <blockquote className="rounded-lg border-l-4 border-indigo-500 bg-indigo-50 px-5 py-4 text-gray-700 dark:bg-indigo-950/40 dark:text-gray-300">
        {children}
      </blockquote>
    ),
  };

  return (
    <>
      <Head>
        <title>{`${displayTitle} - Finding AI Tools`}</title>
        <meta name="description" content={displayExcerpt} />
        <meta property="og:title" content={displayTitle} />
        <meta property="og:description" content={displayExcerpt} />
        <meta property="og:type" content="article" />
        <meta property="og:image" content={imageUrl} />
        <meta property="article:published_time" content={post.date} />
        <meta property="article:modified_time" content={post.updated || post.date} />
        <link rel="canonical" href={canonicalUrl} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }} />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="border-b border-gray-100 bg-white dark:border-gray-700 dark:bg-gray-800">
          <div className="mx-auto max-w-6xl px-4 py-4">
            <Link href="/blog" className="text-sm font-semibold text-indigo-600 hover:underline dark:text-indigo-400">
              {t('返回博客', 'Back to Blog')}
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-4 py-8">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_240px]">
            <article className="min-w-0">
              <div className="overflow-hidden rounded-lg border border-gray-100 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <div className="aspect-[16/9] bg-gray-100 dark:bg-gray-700">
                  <img src={post.cover} alt={displayTitle} className="h-full w-full object-cover" loading="eager" />
                </div>
                <div className="p-6 md:p-10">
                  <Meta post={post} locale={locale} />
                  <h1 className="mt-4 break-all text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:break-words dark:text-gray-100 md:text-4xl" style={{ overflowWrap: 'anywhere' }}>
                    {displayTitle}
                  </h1>
                  <p className="mt-4 break-all text-base leading-7 text-gray-600 sm:break-words dark:text-gray-400">{displayExcerpt}</p>

                  {headings.length > 0 && (
                    <details className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-4 lg:hidden dark:border-gray-700 dark:bg-gray-900">
                      <summary className="cursor-pointer text-sm font-semibold text-gray-900 dark:text-gray-100">
                        {t('文章目录', 'Contents')}
                      </summary>
                      <div className="mt-4">
                        <Toc headings={headings} title="" post={post} source="mobile_toc" />
                      </div>
                    </details>
                  )}

                  <div className="prose prose-indigo mt-8 max-w-none prose-headings:scroll-mt-24 prose-headings:text-gray-900 prose-p:leading-7 prose-p:text-gray-700 prose-li:text-gray-700 prose-code:rounded prose-code:bg-gray-100 prose-code:px-1 prose-pre:bg-gray-900 prose-table:m-0 prose-table:w-full prose-th:bg-gray-50 prose-th:px-3 prose-th:py-2 prose-td:px-3 prose-td:py-2 dark:prose-invert dark:prose-headings:text-gray-100 dark:prose-p:text-gray-300 dark:prose-li:text-gray-300 dark:prose-code:bg-gray-700 dark:prose-pre:bg-gray-950 dark:prose-th:bg-gray-700">
                    <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>{displayContent}</ReactMarkdown>
                  </div>

                  {post.source && (
                    <p className="mt-6 border-t border-gray-100 pt-5 text-xs text-gray-500 dark:border-gray-700 dark:text-gray-400">
                      {t('原文出处', 'Source')}: <a
                        href={post.source}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackEvent('blog_source_click', {
                          post_title: post.title,
                          post_slug: post.slug,
                          post_category: post.category,
                          link_url: post.source,
                        })}
                        className="text-indigo-600 hover:underline dark:text-indigo-400"
                      >
                        {post.source}
                      </a>
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <AdjacentLink post={previousPost} label={t('上一篇', 'Previous')} locale={locale} />
                <AdjacentLink post={nextPost} label={t('下一篇', 'Next')} locale={locale} align="right" />
              </div>

              {relatedPosts.length > 0 && (
                <section className="mt-10">
                  <h2 className="mb-4 text-xl font-bold text-gray-900 dark:text-gray-100">{t('相关文章', 'Related Articles')}</h2>
                  <div className="grid gap-5 md:grid-cols-3">
                    {relatedPosts.map(related => <RelatedCard key={related.slug} post={related} locale={locale} />)}
                  </div>
                </section>
              )}
            </article>

            <aside className="hidden lg:block">
              <div className="sticky top-24 rounded-lg border border-gray-100 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-800">
                <Toc headings={headings} title={t('文章目录', 'Contents')} post={post} source="desktop_toc" />
              </div>
            </aside>
          </div>
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
  const { previousPost, nextPost } = getAdjacentPosts(params.slug);
  const relatedPosts = getRelatedPosts(params.slug, post.category);
  return { props: { post, relatedPosts, previousPost, nextPost }, revalidate: 3600 };
}
