import Head from 'next/head';
import Nav from '../components/Nav';
import { useLocale } from '../lib/i18n';

export default function Contact() {
  const locale = useLocale();
  const t = (zh, en) => locale === 'zh' ? zh : en;

  return (
    <>
      <Head>
        <title>{t('联系我们 - AI 智能指数', 'Contact - Finding AI Tools')}</title>
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://findingaitools.com/contact" />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm"><div className="max-w-3xl mx-auto px-4 py-4" /></header>
        <main className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('联系我们','Contact Us')}</h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border space-y-4 text-gray-700 dark:text-gray-300">
            <p>{t('如有任何问题、建议或合作意向，请通过以下方式联系：','For questions, suggestions, or business inquiries:')}</p>
            <p>{t('邮箱','Email')}: <a href="mailto:wangtao4059371@gmail.com" className="text-indigo-600 hover:underline">wangtao4059371@gmail.com</a></p>
          </div>
        </main>
      </div>
    </>
  );
}
