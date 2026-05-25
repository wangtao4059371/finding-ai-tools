import Head from 'next/head';
import Nav from '../components/Nav';
import { useLocale } from '../lib/i18n';

export default function Terms() {
  const locale = useLocale();
  const t = (zh, en) => locale === 'zh' ? zh : en;

  return (
    <>
      <Head>
        <title>{t('服务条款 - AI 智能指数', 'Terms of Service - Finding AI Tools')}</title>
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://findingaitools.com/terms" />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm"><div className="max-w-3xl mx-auto px-4 py-4" /></header>
        <main className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('服务条款','Terms of Service')}</h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <p><strong>{t('最后更新：2026年5月','Last Updated: May 2026')}</strong></p>
            <h2 className="text-xl font-bold mt-6">{t('1. 接受条款','1. Acceptance')}</h2>
            <p>{t('使用本网站即表示您同意本服务条款。','By using this website you agree to these terms.')}</p>
            <h2 className="text-xl font-bold mt-6">{t('2. 内容准确性','2. Content Accuracy')}</h2>
            <p>{t('我们力求提供准确信息，但不保证完全无误。AI模型评分和价格可能随时变化。','We strive for accuracy but make no warranties about completeness. Scores and pricing may change.')}</p>
            <h2 className="text-xl font-bold mt-6">{t('3. 外部链接','3. External Links')}</h2>
            <p>{t('本网站包含第三方链接，我们不对第三方内容负责。','This site contains third-party links. We are not responsible for their content.')}</p>
            <h2 className="text-xl font-bold mt-6">{t('4. 知识产权','4. Intellectual Property')}</h2>
            <p>{t('本网站原创内容受版权保护。AI模型名称和商标归各自所有者。','Original content is copyrighted. Model names and trademarks belong to their owners.')}</p>
            <h2 className="text-xl font-bold mt-6">{t('5. 联系我们','5. Contact')}</h2>
            <p>{t('如有问题请联系','Questions: ')}<a href="mailto:wangtao4059371@gmail.com" className="text-indigo-600">wangtao4059371@gmail.com</a></p>
          </div>
        </main>
      </div>
    </>
  );
}
