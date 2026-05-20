'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';
import { getLocale } from '../lib/i18n';

const DIMS = [
  {k:'reasoning',l:'推理能力'},{k:'chinese',l:'中文能力'},{k:'coding',l:'编程能力'},{k:'math',l:'数学能力'},
  {k:'hallucination',l:'幻觉控制'},{k:'speed',l:'响应速度'},{k:'api_cost',l:'API成本'},{k:'agent',l:'Agent能力'},{k:'long_text',l:'长文本能力'}
];

const MODELS = [
  {nm:"GPT-5.5 / Instant",co:"OpenAI（美国）",pr:"Plus $20/月, Pro $200/月",ur:"https://chat.openai.com",de:"全球大模型生态领头羊。5.5版本在异构数据聚合、高级系统重构等黑盒任务中稳定度极高，幻觉率历史最低。1M超长上下文与原生工具搜索提供最佳Agent工业底座。",re:9.8,ch:8.5,coding:9.7,ma:9.6,ha:9.5,sp:7.5,ap:4,ag:9.8,lt:9},
  {nm:"Claude Opus 4.7",co:"Anthropic（美国）",pr:"Pro $20/月, API按量计费",ur:"https://claude.ai",de:"行业公认长文本逻辑处理与代码重构王者。极度严谨的系统指令遵循度，输出客观精准无废话。企业文档审计与核心业务流集成首选。",re:9.7,ch:8.3,coding:9.8,ma:9.4,ha:9.7,sp:7.2,ap:3.8,ag:9.2,lt:9.5},
  {nm:"DeepSeek V4 Pro",co:"深度求索（中国）",pr:"API极具性价比,1M上下文",ur:"https://www.deepseek.com",de:"最硬核黑马。数学、STEM和代码生成正面迎战全球顶级闭源模型。独特代币压缩与稀疏注意力机制，计算效率极致。",re:9.5,ch:9.2,coding:9.6,ma:9.7,ha:8.8,sp:8.8,ap:9,ag:9.3,lt:9},
  {nm:"Gemini 3.1 Pro",co:"Google DeepMind（美国）",pr:"Google One $19.99/月",ur:"https://deepmind.google/gemini",de:"谷歌原生多模态集大成之作。融合视频、音频、图表与文本，跨模态推理深度集成Google生态。",re:9.2,ch:8,coding:8.8,ma:9,ha:8.5,sp:8.5,ap:6.5,ag:8.8,lt:9.2},
  {nm:"Qwen 3.6 Max",co:"阿里巴巴（中国）",pr:"API按量计费,开源免费",ur:"https://tongyi.aliyun.com",de:"阿里云全尺寸覆盖。多语言翻译、长文本摘要及中文商业逻辑推理表现优异。",re:9,ch:9.5,coding:8.8,ma:8.7,ha:8.5,sp:8.7,ap:8.5,ag:8.9,lt:8.8},
];

function dim(m,k){return k==='reasoning'?m.re:k==='chinese'?m.ch:k==='coding'?m.coding:k==='math'?m.ma:k==='hallucination'?m.ha:k==='speed'?m.sp:k==='api_cost'?m.ap:k==='agent'?m.ag:k==='long_text'?m.lt:0}
function avg(m){return (DIMS.reduce((s,d)=>s+dim(m,d.k),0)/9).toFixed(1)}
function fav(url){try{return 'https://www.google.com/s2/favicons?domain='+new URL(url).hostname+'&sz=32'}catch(e){return''}}

export default function Home() {
  const [mainIdx, setMainIdx] = useState(0);
  const [compareIdx, setCompareIdx] = useState(-1);
  const [locale, setLocale] = useState('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); setLocale(getLocale()); }, []);

  if (!mounted) {
    return <div className="min-h-screen bg-gray-50 dark:bg-gray-900" />;
  }

  const m = MODELS[mainIdx];
  const models = [m];
  if (compareIdx >= 0 && compareIdx !== mainIdx) models.push(MODELS[compareIdx]);
  const isCmp = models.length === 2;

  const tags = DIMS.map(d=>{
    const v=dim(m,d.k);
    if(v>=9) return {cls:'bg-green-100 text-green-700',icon:'🏆',v};
    if(v<=5) return {cls:'bg-red-100 text-red-700',icon:'⚠️',v};
    return {cls:'bg-gray-100 text-gray-600',icon:'',v};
  });

  return (
    <>
      <Head>
        <title>AI Models Comparison 2026 - Finding AI Tools</title>
        <meta name="description" content="Compare AI models with 9-dimension ratings. GPT-5.5, DeepSeek, Claude, Gemini, Qwen side by side." />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="text-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {locale==='zh'?'AI 大模型多维评分':'AI Model Ratings'}
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              {locale==='zh'?`${MODELS.length} 款模型 · 9维度工程化评测`:`${MODELS.length} models · 9-dimension benchmark`}
            </p>
          </div>

          <div className="flex justify-center items-center gap-3 mb-5 text-sm">
            <span className="text-gray-500">{locale==='zh'?'当前':'Current'}: <strong className="text-indigo-600">{m.nm}</strong></span>
            <span className="text-gray-400 font-semibold">VS</span>
            <select value={compareIdx} onChange={e=>{const v=parseInt(e.target.value);setCompareIdx(v>=0&&v===mainIdx?-1:v)}}
              className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm">
              <option value="-1">-- Select --</option>
              {MODELS.map((mod,i)=>i!==mainIdx?<option key={i} value={i}>{mod.nm}</option>:null)}
            </select>
            {compareIdx>=0&&<span className="text-xs text-indigo-600 cursor-pointer" onClick={()=>setCompareIdx(-1)}>VS {MODELS[compareIdx].nm} ✕</span>}
          </div>

          <div className="flex flex-col xl:flex-row gap-5 items-start">
            <div className="w-full xl:w-[300px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border overflow-hidden max-h-[300px] xl:max-h-[calc(100vh-180px)] overflow-y-auto">
              <div className="px-5 py-3 text-sm font-bold text-gray-400 uppercase border-b sticky top-0 bg-white dark:bg-gray-800">{locale==='zh'?'模型':'Models'} ({MODELS.length})</div>
              {MODELS.map((mod,i)=>(
                <div key={i} onClick={()=>{setMainIdx(i);setCompareIdx(-1)}}
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer text-[15px] border-b border-gray-50 dark:border-gray-700 transition-colors ${i===mainIdx?'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 font-bold border-l-[3px] border-l-indigo-600':'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  <img loading="lazy" src={fav(mod.ur)} className="w-[22px] h-[22px] rounded" alt="" onError={e=>e.target.style.display='none'} />
                  <span className="truncate flex-1">{mod.nm}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500">{avg(mod)}</span>
                </div>
              ))}
            </div>

            <div className="flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-8">
              <div className="text-center font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">
                {isCmp?`${models[0].nm} VS ${models[1].nm}`:models[0].nm}
              </div>
              <div className="max-w-[700px] mx-auto text-center py-20 text-gray-400">
                📊 Radar chart loading...
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                {tags.map((t,i)=><span key={i} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.cls}`}>{t.icon} {DIMS[i].l} {t.v}</span>)}
              </div>
            </div>

            <div className="w-full xl:w-[340px] flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-7">
                {isCmp?(
                  <div>
                    <div className="font-bold text-lg text-indigo-600 mb-4">Comparison</div>
                    <table className="w-full text-[15px]">
                      <thead><tr className="text-gray-400 text-xs"><th className="text-left pb-2">Dim</th><th className="text-right pb-2">A</th><th className="text-right pb-2">B</th></tr></thead>
                      <tbody>
                        {DIMS.map(d=>{const va=dim(models[0],d.k),vb=dim(models[1],d.k);return <tr key={d.k} className="border-t border-gray-50"><td className="py-2 text-gray-500">{d.l}</td><td className={`text-right py-2 font-semibold ${va>vb?'text-red-600':vb>va?'text-green-600':''}`}>{va}</td><td className={`text-right py-2 font-semibold ${vb>va?'text-red-600':va>vb?'text-green-600':''}`}>{vb}</td></tr>;})}
                        <tr className="border-t-2 border-gray-200 font-extrabold"><td className="py-2">Overall</td><td className={`text-right py-2 ${+avg(models[0])>+avg(models[1])?'text-red-600':'text-green-600'}`}>{avg(models[0])}</td><td className={`text-right py-2 ${+avg(models[1])>+avg(models[0])?'text-red-600':'text-green-600'}`}>{avg(models[1])}</td></tr>
                      </tbody>
                    </table>
                  </div>
                ):(
                  <div>
                    <div className="text-center">
                      <div className="text-[56px] font-extrabold text-indigo-600">{avg(m)}</div>
                      <div className="text-sm text-gray-400 mt-1">Overall Score / 10</div>
                      <div className="h-2 bg-gray-100 rounded-full mt-4 mb-4 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{width:(+avg(m)*10)+'%'}} />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-4 mb-3"><strong>{m.co}</strong> · {m.pr}</div>
                    <div className="text-[14px] text-gray-600 leading-relaxed bg-gray-50 rounded-lg p-4 mb-5">{m.de}</div>
                    <a href={m.ur} target="_blank" rel="noopener noreferrer" className="block text-center py-3.5 bg-indigo-600 text-white rounded-lg text-base font-semibold hover:bg-indigo-700">🌐 Visit Website</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}