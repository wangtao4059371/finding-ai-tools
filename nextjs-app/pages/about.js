import Head from 'next/head';
import Nav from '../components/Nav';
import { getLocale } from '../lib/i18n';

export default function About() {
  const locale = getLocale();
  const t = (zh, en) => locale === 'zh' ? zh : en;

  return (
    <>
      <Head>
        <title>{t('关于 - AI 智能指数', 'About - Finding AI Tools')}</title>
        <meta name="description" content={t('AI智能指数是一个AI大模型评测对比平台，基于SuperCLUE基准提供24款模型的6维度评分。','Finding AI Tools compares 24 AI models across 6 dimensions using SuperCLUE benchmarks.')} />
        <meta property="og:title" content={t('关于我们','About')} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://findingaitools.com/about" />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-100 dark:border-gray-700">
          <div className="max-w-3xl mx-auto px-4 py-4" />
        </header>
        <main className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('关于我们','About Us')}</h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border space-y-4 text-gray-700 dark:text-gray-300 leading-relaxed">
            <p>{t('AI智能指数是一个专注于AI大模型评测对比的独立平台。我们基于SuperCLUE中文大模型评测基准，为24款主流模型提供数学推理、幻觉控制、科学推理、指令遵循、代码生成和智能体能力共6个维度的客观评分。','Finding AI Tools is an independent platform for AI model evaluation and comparison. Based on the SuperCLUE benchmark, we provide objective 6-dimension ratings for 24 leading models.')}</p>
            <p>{t('我们的目标是帮助开发者、研究者和企业快速了解各大模型的能力差异，做出更明智的技术选型决策。','Our goal is to help developers, researchers, and enterprises quickly understand model capabilities and make informed decisions.')}</p>
          </div>
        </main>
      </div>
    </>
  );
}