import Head from 'next/head';
import Nav from '../components/Nav';
import { useLocale } from '../lib/i18n';

export default function Privacy() {
  const locale = useLocale();
  const t = (zh, en) => locale === 'zh' ? zh : en;

  return (
    <>
      <Head>
        <title>{t('隐私政策 - AI 智能指数', 'Privacy Policy - Finding AI Tools')}</title>
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://findingaitools.com/privacy-policy" />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm"><div className="max-w-3xl mx-auto px-4 py-4" /></header>
        <main className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('隐私政策','Privacy Policy')}</h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border space-y-4 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <p><strong>{t('最后更新：2026年5月','Last Updated: May 2026')}</strong></p>
            <h2 className="text-xl font-bold mt-6">{t('1. 信息收集','1. Information Collection')}</h2>
            <p>{t('我们不收集任何个人信息，无需注册即可使用本网站。','We do not collect personal information. No registration required.')}</p>
            <h2 className="text-xl font-bold mt-6">{t('2. Cookie与追踪','2. Cookies & Tracking')}</h2>
            <p>{t('我们使用Google Analytics和Google AdSense来分析流量和展示广告。这些服务可能使用Cookie。您可以通过浏览器设置选择退出。','We use Google Analytics and Google AdSense for traffic analysis and advertising. These services may use cookies. You can opt out via browser settings.')}</p>
            <h2 className="text-xl font-bold mt-6">{t('3. 第三方服务','3. Third-Party Services')}</h2>
            <p>{t('本网站包含第三方链接，请阅读其隐私政策。','This site contains third-party links. Please review their privacy policies.')}</p>
            <h2 className="text-xl font-bold mt-6">{t('4. 联系我们','4. Contact')}</h2>
            <p><a href="mailto:wangtao4059371@gmail.com" className="text-indigo-600">wangtao4059371@gmail.com</a></p>
          </div>
        </main>
      </div>
    </>
  );
}
