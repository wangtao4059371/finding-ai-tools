import Head from 'next/head';
import Nav from '../components/Nav';
import { getLocale } from '../lib/i18n';

export default function About() {
  const locale = getLocale();
  const t = (zh, en) => locale === 'zh' ? zh : en;

  return (
    <>
      <Head>
        <title>{t('关于我们 - AI 智能指数', 'About - Finding AI Tools')}</title>
        <meta name="description" content={t('关于Finding AI Tools，一个集AI大模型评测排名与AI工具导航于一体的独立平台。','About Finding AI Tools, a platform combining AI model rankings and tool discovery.')} />
        <meta property="og:title" content={t('关于我们','About Finding AI Tools')} />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href="https://findingaitools.com/about" />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b"><div className="max-w-3xl mx-auto px-4 py-4" /></header>
        <main className="max-w-3xl mx-auto px-4 py-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6">{t('关于我们','About Us')}</h1>
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border space-y-5 text-gray-700 dark:text-gray-300 leading-relaxed">

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('我们做什么','What We Do')}</h2>
            <p>{t(
              'Finding AI Tools 是一个集AI大模型评测排名与AI工具导航于一体的独立平台。本站主要分为两大板块：AI评测排名和AI工具目录。',
              'Finding AI Tools is an independent platform combining AI model evaluation rankings with a curated AI tools directory. The site has two main sections: AI rankings and the tools catalog.'
            )}</p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('AI 评测排名','AI Rankings')}</h2>
            <p>{t(
              '我们的AI评测排名板块基于SuperCLUE中文大模型评测基准的最新数据（2026年3-4月评测），对24款国内外主流大模型进行6个维度的客观打分。维度涵盖数学推理、幻觉控制、科学推理、指令遵循、代码生成和智能体能力。用户可以通过雷达图对比任意两个模型，查看总分排行榜和分项柱状图。',
              'Our AI rankings are based on the latest SuperCLUE Chinese LLM benchmark (March-April 2026), covering 24 major models across 6 dimensions: math reasoning, hallucination control, science reasoning, instruction following, code generation, and agent capability. Users can compare any two models via radar charts and browse total score leaderboards with bar charts.'
            )}</p>
            <p>{t(
              '评测数据来源于SuperCLUE团队公开发布的行业基准报告。我们在每个评测页底部均注明了数据出处，并对SuperCLUE团队的专业工作表示感谢。',
              'The benchmark data is sourced from publicly released industry reports by the SuperCLUE team. Attribution and thanks are noted at the bottom of each ranking page.'
            )}</p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('AI 工具目录','AI Tools Directory')}</h2>
            <p>{t(
              'AI工具目录收录了250款以上的AI工具、开源项目和智能体，覆盖AI写作、AI绘画、AI视频、AI音频/音乐、AI办公、AI开发工具、大模型AI等多个分类。每个工具包含详细介绍、分类标签、官网链接和GitHub星标等信息。',
              'Our tools directory catalogs 250+ AI tools, open-source projects, and agents across categories including AI writing, image generation, video, audio/music, office, development tools, and large model APIs. Each listing includes detailed descriptions, category tags, official links, and GitHub star counts.'
            )}</p>
            <p>{t(
              '我们也收录了GitHub上大量优质的AI开源项目，从LLM框架、Agent开发平台到Stable Diffusion生态工具。每个GitHub项目都展示了真实Star数和作者头像。',
              'The directory also features numerous high-quality open-source AI projects from GitHub, ranging from LLM frameworks and agent development platforms to Stable Diffusion ecosystem tools. Each project displays its actual star count and author avatar.'
            )}</p>

            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">{t('联系我们','Contact')}</h2>
            <p>{t(
              '本站由个人独立维护。如有任何意见、建议或内容纠错，欢迎通过邮箱联系：',
              'This site is independently maintained. For feedback, suggestions, or content corrections, please contact:'
            )} <a href="mailto:wangtao4059371@gmail.com" className="text-indigo-600 hover:underline">wangtao4059371@gmail.com</a></p>

          </div>
        </main>
      </div>
    </>
  );
}