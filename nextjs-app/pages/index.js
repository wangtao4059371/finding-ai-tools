'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { Radar } from 'react-chartjs-2';
import { Chart, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend } from 'chart.js';
import Nav from '../components/Nav';
import { getLocale } from '../lib/i18n';

Chart.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

const DIMS = [
  {k:'reasoning',l:'推理能力'},{k:'chinese',l:'中文能力'},{k:'coding',l:'编程能力'},{k:'math',l:'数学能力'},
  {k:'hallucination',l:'幻觉控制'},{k:'speed',l:'响应速度'},{k:'api_cost',l:'API成本'},{k:'agent',l:'Agent能力'},{k:'long_text',l:'长文本能力'}
];

const MODELS = [
  {nm:"GPT-5.5 / Instant",co:"OpenAI（美国）",pr:"Plus $20/月, Pro $200/月",ur:"https://chat.openai.com",de:"全球大模型生态领头羊。5.5版本在异构数据聚合、高级系统重构等黑盒任务中稳定度极高，幻觉率历史最低。1M超长上下文与原生工具搜索提供最佳Agent工业底座。",re:9.8,ch:8.5,coding:9.7,ma:9.6,ha:9.5,sp:7.5,ap:4,ag:9.8,lt:9},
  {nm:"Claude Opus 4.7",co:"Anthropic（美国）",pr:"Pro $20/月, API按量计费",ur:"https://claude.ai",de:"行业公认长文本逻辑处理与代码重构王者。极度严谨的系统指令遵循度，输出客观精准无废话，是企业文档审计与核心业务流集成的首选。",re:9.7,ch:8.3,coding:9.8,ma:9.4,ha:9.7,sp:7.2,ap:3.8,ag:9.2,lt:9.5},
  {nm:"Gemini 3.1 Pro",co:"Google DeepMind（美国）",pr:"Google One $19.99/月",ur:"https://deepmind.google/gemini",de:"谷歌原生多模态集大成之作，底层融合视频、音频、多维图表与文本。可传入长视频或整个站点多媒体素材进行跨模态推理，深度集成Google生态。",re:9.2,ch:8,coding:8.8,ma:9,ha:8.5,sp:8.5,ap:6.5,ag:8.8,lt:9.2},
  {nm:"Grok 3 Pro",co:"xAI（美国）",pr:"X Premium+ $16/月",ur:"https://x.ai/grok",de:"依托X平台实时数据流，拥有全网最强时效性信息捕捉能力。硬核数学推理和物理模拟大幅进步，实时数据聚合和动态市场分析类智能体的理想选择。",re:8.7,ch:7,coding:8.5,ma:9.1,ha:7.5,sp:8.8,ap:7,ag:8,lt:7.5},
  {nm:"DeepSeek V4 Pro",co:"深度求索（中国）",pr:"API极具性价比,1M上下文",ur:"https://www.deepseek.com",de:"最硬核黑马。数学、STEM和代码生成核心评测正面迎战全球顶级闭源模型。独特代币压缩与稀疏注意力机制，计算效率极致，自动化系统搭建首选。",re:9.5,ch:9.2,coding:9.6,ma:9.7,ha:8.8,sp:8.8,ap:9,ag:9.3,lt:9},
  {nm:"Qwen 3.6 Max",co:"阿里巴巴（中国）",pr:"API按量计费,开源免费",ur:"https://tongyi.aliyun.com",de:"阿里云模型性能与开源生态双重胜利。全尺寸覆盖，多语言翻译、长文本摘要及中文商业逻辑推理表现优异。",re:9,ch:9.5,coding:8.8,ma:8.7,ha:8.5,sp:8.7,ap:8.5,ag:8.9,lt:8.8},
  {nm:"ERNIE 5.1（文心）",co:"百度（中国）",pr:"API按量计费,高级会员",ur:"https://yiyan.baidu.com",de:"异步强化学习架构+智能体后训练技术。集成百度搜索矩阵，中文长篇写作和本地化营销策划天然优势。",re:9.1,ch:9.6,coding:8.5,ma:8.6,ha:8.7,sp:8.3,ap:7.5,ag:9.1,lt:8.5},
  {nm:"Kimi K2.6",co:"月之暗面（中国）",pr:"API按Token计费",ur:"https://kimi.moonshot.cn",de:"超长文本无损处理独树一帜。代码编写和Agent群体智能重大升级，可处理庞大代码库或几百页PDF精准提取信息。",re:8.9,ch:9.3,coding:8.6,ma:8.2,ha:8.6,sp:8,ap:8.8,ag:9,lt:9.7},
  {nm:"Llama 4 Scout/Maverick",co:"Meta（美国）",pr:"完全开源免费",ur:"https://llama.meta.com",de:"128专家架构+10M极限上下文，消费级节点跑出惊人效果，独立部署最强开源底座。",re:9,ch:7.8,coding:8.5,ma:8.8,ha:8,sp:9,ap:9.5,ag:8.2,lt:9.8},
  {nm:"Mistral Large 3",co:"Mistral AI（法国）",pr:"API按量计费",ur:"https://mistral.ai",de:"欧洲AI领头羊，小参数高智能。逻辑推理和多语言商务写作不输顶级闭源模型。",re:8.8,ch:7.5,coding:9,ma:8.5,ha:8.3,sp:9.2,ap:8,ag:8.5,lt:8},
];

function dim(m,k){return k==='reasoning'?m.re:k==='chinese'?m.ch:k==='coding'?m.coding:k==='math'?m.ma:k==='hallucination'?m.ha:k==='speed'?m.sp:k==='api_cost'?m.ap:k==='agent'?m.ag:k==='long_text'?m.lt:0}
function avg(m){return (DIMS.reduce((s,d)=>s+dim(m,d.k),0)/9).toFixed(1)}
function fav(url){try{return 'https://www.google.com/s2/favicons?domain='+new URL(url).hostname+'&sz=32'}catch(e){return''}}

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mainIdx, setMainIdx] = useState(0);
  const [compareIdx, setCompareIdx] = useState(-1);
  const [locale, setLocale] = useState('en');

  useEffect(() => { setMounted(true); setLocale(getLocale()); }, []);

  if (!mounted) return null;

  const m = MODELS[mainIdx];
  const models = [m];
  if (compareIdx >= 0 && compareIdx !== mainIdx) models.push(MODELS[compareIdx]);
  const isCmp = models.length === 2;

  const chartData = {
    labels: DIMS.map(d=>d.l),
    datasets: models.map((mod,i) => ({
      label: mod.nm,
      data: DIMS.map(d=>dim(mod,d.k)),
      backgroundColor: (i===0?'rgba(99,102,241,0.2)':'rgba(239,68,68,0.2)'),
      borderColor: (i===0?'rgba(99,102,241,0.9)':'rgba(239,68,68,0.9)'),
      borderWidth: 2.5,
      pointBackgroundColor: i===0?'#6366f1':'#ef4444',
      pointRadius: 4,
    })),
  };

  const tags = DIMS.map(d=>{
    const v=dim(m,d.k);
    if(v>=9) return {cls:'bg-green-100 text-green-700',icon:'🏆',v};
    if(v<=5) return {cls:'bg-red-100 text-red-700',icon:'⚠️',v};
    return {cls:'bg-gray-100 text-gray-600',icon:'',v};
  });

  return (
    <>
      <Head>
        <title>AI 大模型多维评分 - Finding AI Tools</title>
        <meta name="description" content="9维度 x 26款主流AI大模型工程化评测对比，支持1v1深入对比。推理/编程/中文/数学/Agent能力一图看透。" />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="text-center mb-2">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">AI 大模型多维评分体系</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">9维度 · {MODELS.length}款主流模型工程化评测 · 支持1v1深度对比</p>
          </div>

          <div className="flex justify-center items-center gap-2 mb-4 text-sm">
            <span className="text-gray-500">当前: <strong className="text-indigo-600">{m.nm}</strong></span>
            <span className="text-gray-400">VS</span>
            <select
              value={compareIdx}
              onChange={e=>{const v=parseInt(e.target.value);setCompareIdx(v>=0&&v===mainIdx?-1:v)}}
              className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm"
            >
              <option value="-1">-- 选择对比模型 --</option>
              {MODELS.map((mod,i) => i!==mainIdx ? <option key={i} value={i}>{mod.nm}</option> : null)}
            </select>
            {compareIdx >= 0 && (
              <span className="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-2 py-1 rounded text-xs cursor-pointer" onClick={()=>setCompareIdx(-1)}>
                VS {MODELS[compareIdx].nm} · ✕
              </span>
            )}
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Left: Model List */}
            <div className="lg:w-60 flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 max-h-[500px] overflow-y-auto">
              <div className="px-4 py-3 text-xs font-bold text-gray-400 uppercase border-b sticky top-0 bg-white dark:bg-gray-800 z-10">全部模型 ({MODELS.length})</div>
              {MODELS.map((mod,i)=>(
                <div
                  key={i}
                  onClick={()=>{setMainIdx(i);setCompareIdx(-1)}}
                  className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer text-sm border-b border-gray-50 dark:border-gray-700 transition-colors ${i===mainIdx?'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold border-l-3 border-l-indigo-600':'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <img src={fav(mod.ur)} className="w-5 h-5 rounded" alt="" onError={e=>e.target.style.display='none'} />
                  <span className="truncate flex-1">{mod.nm}</span>
                  <span className="text-xs text-gray-400 ml-auto">{avg(mod)}</span>
                </div>
              ))}
            </div>

            {/* Center: Chart */}
            <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <div className="text-center font-bold text-lg mb-2 text-gray-900 dark:text-gray-100">
                {isCmp ? `${models[0].nm}  VS  ${models[1].nm}` : models[0].nm}
              </div>
              <div className="max-w-lg mx-auto">
                <Radar data={chartData} options={{
                  responsive:true,
                  scales:{r:{beginAtZero:true,max:10,ticks:{stepSize:2,font:{size:11}},pointLabels:{font:{size:11}}}},
                  plugins:{legend:{display:isCmp,position:'bottom'}}
                }} />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-3 justify-center">
                {tags.map((t,i)=>(
                  <span key={i} className={`px-2 py-0.5 rounded-full text-xs font-medium ${t.cls}`}>{t.icon} {DIMS[i].l} {t.v}</span>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="lg:w-72 flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5">
                {isCmp ? (
                  <div>
                    <div className="font-bold text-sm text-indigo-600 mb-3">对比详情</div>
                    <table className="w-full text-xs">
                      <thead><tr className="text-gray-500"><th className="text-left pb-2">维度</th><th className="text-right pb-2">{models[0].nm.split(' ')[0]}</th><th className="text-right pb-2">{models[1].nm.split(' ')[0]}</th></tr></thead>
                      <tbody>
                        {DIMS.map(d=>{
                          const va=dim(models[0],d.k), vb=dim(models[1],d.k);
                          return <tr key={d.k} className="border-t border-gray-100 dark:border-gray-700"><td className="py-1.5 text-gray-500">{d.l}</td><td className={`text-right py-1.5 font-medium ${va>vb?'text-red-600':vb>va?'text-green-600':''}`}>{va}</td><td className={`text-right py-1.5 font-medium ${vb>va?'text-red-600':va>vb?'text-green-600':''}`}>{vb}</td></tr>;
                        })}
                        <tr className="border-t-2 border-gray-200 dark:border-gray-600 font-bold"><td className="py-1.5">综合</td><td className={`text-right py-1.5 ${+avg(models[0])>+avg(models[1])?'text-red-600':'text-green-600'}`}>{avg(models[0])}</td><td className={`text-right py-1.5 ${+avg(models[1])>+avg(models[0])?'text-red-600':'text-green-600'}`}>{avg(models[1])}</td></tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>
                    <div className="text-center">
                      <div className="text-4xl font-extrabold text-indigo-600">{avg(m)}</div>
                      <div className="text-xs text-gray-400 mt-1">综合评分 / 10</div>
                      <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{width:(+avg(m)*10)+'%'}} />
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-3 mb-2"><strong>{m.co}</strong> · {m.pr}</div>
                    <div className="text-xs text-gray-600 leading-relaxed bg-gray-50 dark:bg-gray-750 rounded-lg p-3 mb-3">{m.de}</div>
                    <a href={m.ur} target="_blank" className="block w-full text-center py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                      🌐 {locale==='zh'?'访问官网':'Visit Website'}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8 mt-8">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{locale==='zh'?'关于我们':'About'}</h4>
              <ul className="space-y-1">
                <li><a href="/about" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale==='zh'?'关于':'About'}</a></li>
                <li><a href="/contact" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale==='zh'?'联系我们':'Contact'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{locale==='zh'?'法律条款':'Legal'}</h4>
              <ul className="space-y-1">
                <li><a href="/privacy-policy" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale==='zh'?'隐私政策':'Privacy Policy'}</a></li>
                <li><a href="/terms" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale==='zh'?'服务条款':'Terms'}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{locale==='zh'?'热门工具':'Popular'}</h4>
              <ul className="space-y-1">
                <li><a href="/tool/chatgpt" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">ChatGPT</a></li>
                <li><a href="/tool/deepseek" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">DeepSeek</a></li>
                <li><a href="/tool/claude" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">Claude</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Finding AI Tools</h4>
              <p className="text-xs text-gray-400">© 2026 AI Tools Directory</p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}