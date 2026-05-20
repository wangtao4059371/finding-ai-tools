'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';
import RadarChart from '../components/RadarChart';
import { getLocale } from '../lib/i18n';

const getDim = (m,k) => m[k] || 0;
const avg = (m) => (DIMS.reduce((s,d)=>s+getDim(m,d.k),0)/DIMS.length).toFixed(1);

const COLORS = [
  '#6366f1','#ef4444','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#f97316',
  '#84cc16','#14b8a6','#e11d48','#3b82f6','#a855f7','#eab308','#0ea5e9','#22c55e',
  '#d946ef','#64748b','#f43f5e','#0d9488','#8b5cf6','#ea580c','#2563eb','#ca8a04',
];

const DIMS = [
  {k:'math',l:'数学推理',le:'Math'},
  {k:'hallucination',l:'幻觉控制',le:'Hallucination'},
  {k:'science',l:'科学推理',le:'Science'},
  {k:'instruction',l:'指令遵循',le:'Instruction'},
  {k:'coding',l:'代码生成',le:'Coding'},
  {k:'agent',l:'智能体',le:'Agent'},
];

const MODELS = [
  {nm:"Claude Opus 4.6",co:"Anthropic",pr:"API",ur:"https://claude.ai",de:"Anthropic旗舰模型。指令遵循和智能体任务规划表现顶级，SuperCLUE总分第一。",total:77.02,math:85.71,hallucination:82.95,science:85.37,instruction:47.57,coding:71.15,agent:89.35},
  {nm:"Gemini 3.1 Pro",co:"Google",pr:"API",ur:"https://deepmind.google/gemini",de:"Google多模态旗舰。数学推理92.44分全场最高，科学推理表现优秀。",total:76.69,math:92.44,hallucination:80.5,science:81.71,instruction:56.76,coding:69.78,agent:78.96},
  {nm:"GPT-5.4",co:"OpenAI",pr:"API",ur:"https://chat.openai.com",de:"OpenAI最新旗舰。幻觉控制85.43分和智能体80.04分表现出色。",total:72.48,math:88.89,hallucination:85.43,science:84.15,instruction:44.32,coding:52.05,agent:80.04},
  {nm:"Doubao Seed 2.0 Pro",co:"字节跳动",pr:"API",ur:"https://www.volcengine.com",de:"国产模型排名第1。智能体81.04分仅次于Claude，全维度均衡。",total:71.53,math:84.87,hallucination:79.41,science:80.49,instruction:39.46,coding:63.93,agent:81.04},
  {nm:"DeepSeek V4 Pro",co:"深度求索",pr:"API",ur:"https://www.deepseek.com",de:"开源模型最高分。数学87.39、幻觉控制80.68表现亮眼。",total:70.98,math:87.39,hallucination:80.68,science:79.27,instruction:37.84,coding:63.24,agent:77.49},
  {nm:"Gemini 3 Flash",co:"Google",pr:"API",ur:"https://deepmind.google/gemini",de:"轻量级高性能。幻觉控制82.37分，科学推理81.71分。",total:68.84,math:85.71,hallucination:82.37,science:81.71,instruction:35.68,coding:63.94,agent:63.65},
  {nm:"DeepSeek V4 Flash",co:"深度求索",pr:"API",ur:"https://www.deepseek.com",de:"数学89.08分极高，成本效益出色的轻量版。",total:68.82,math:89.08,hallucination:75.67,science:79.01,instruction:32.43,coding:61.43,agent:75.28},
  {nm:"Grok 4.20",co:"xAI",pr:"API",ur:"https://x.ai/grok",de:"马斯克xAI旗舰。数学推理85.71分，全维度均衡发展。",total:66.07,math:85.71,hallucination:77.89,science:78.05,instruction:32.43,coding:55.01,agent:67.35},
  {nm:"Kimi K2.5",co:"月之暗面",pr:"API",ur:"https://kimi.moonshot.cn",de:"国产开源黑马。代码生成65.5分，智能体78.44分。",total:64.6,math:81.51,hallucination:77.61,science:68.29,instruction:16.22,coding:65.5,agent:78.44},
  {nm:"Qwen 3.5 Think",co:"阿里巴巴",pr:"API",ur:"https://tongyi.aliyun.com",de:"阿里旗舰。幻觉控制84.39分全场第二，整体均衡。",total:64.48,math:84.87,hallucination:84.39,science:75.61,instruction:19.46,coding:51.04,agent:71.52},
  {nm:"GLM-5",co:"智谱AI",pr:"API",ur:"https://www.zhipuai.cn",de:"智谱旗舰。幻觉控制86.85分全场最高。",total:64.27,math:73.95,hallucination:86.85,science:75,instruction:24.86,coding:58.32,agent:66.64},
  {nm:"DeepSeek V3.2",co:"深度求索",pr:"API",ur:"https://www.deepseek.com",de:"高性价比之选。数学78.15，科学73.17全维度覆盖。",total:61.92,math:78.15,hallucination:77.23,science:73.17,instruction:25.95,coding:60.43,agent:56.62},
  {nm:"MiMo V2 Pro",co:"小米集团",pr:"API",ur:"https://www.mi.com",de:"小米旗舰。数学84.03表现出色，综合国产第5名。",total:60.67,math:84.03,hallucination:73.8,science:74.39,instruction:16.22,coding:59.61,agent:55.97},
  {nm:"Tencent HY 2.0",co:"腾讯",pr:"API",ur:"https://cloud.tencent.com",de:"腾讯混元。数学76.47，幻觉76.46，综合59.16分。",total:59.16,math:76.47,hallucination:76.46,science:70.73,instruction:14.05,coding:57.58,agent:59.68},
  {nm:"Qwen 3.5 122B",co:"阿里巴巴",pr:"API",ur:"https://tongyi.aliyun.com",de:"轻量版开源。数学82.35分，中小参数代表。",total:58.53,math:82.35,hallucination:70.5,science:69.51,instruction:13.51,coding:50.18,agent:65.15},
  {nm:"LongCat Flash",co:"美团",pr:"API",ur:"https://www.meituan.com",de:"美团开源。智能体67.94分，数学77.31分。",total:57.47,math:77.31,hallucination:66.31,science:69.51,instruction:11.89,coding:51.86,agent:67.94},
  {nm:"GPT-OSS 120B",co:"OpenAI",pr:"开源",ur:"https://github.com/openai",de:"OpenAI开源。数学79.83分，科学73.17分。",total:57.07,math:79.83,hallucination:54.88,science:73.17,instruction:20.54,coding:52.89,agent:61.12},
  {nm:"Step 3.5 Flash",co:"阶跃星辰",pr:"API",ur:"https://www.stepfun.com",de:"开源新秀。数学80.67分，科学68.29分。",total:56.23,math:80.67,hallucination:63.94,science:68.29,instruction:9.73,coding:50.71,agent:64.06},
  {nm:"MiniMax M2.5",co:"稀宇科技",pr:"API",ur:"https://www.minimax.io",de:"数学73.95，智能体65.64，综合55.96。",total:55.96,math:73.95,hallucination:67.41,science:65.85,instruction:7.57,coding:55.33,agent:65.64},
  {nm:"MiniMax M2.7",co:"稀宇科技",pr:"API",ur:"https://www.minimax.io",de:"数学78.15，代码58.74，综合55.68分。",total:55.68,math:78.15,hallucination:55.61,science:64.63,instruction:17.3,coding:58.74,agent:59.68},
  {nm:"Spark X2",co:"科大讯飞",pr:"API",ur:"https://xinghuo.xfyun.cn",de:"语音AI厂商大模型。数学78.15，科学71.95。",total:52.79,math:78.15,hallucination:62.23,science:71.95,instruction:1.08,coding:41.19,agent:62.13},
  {nm:"MiMo V2 Flash",co:"小米集团",pr:"API",ur:"https://www.mi.com",de:"轻量开源。数学69.75，代码54.46。",total:49.97,math:69.75,hallucination:63.45,science:53.66,instruction:2.16,coding:54.46,agent:56.37},
  {nm:"Mistral Large 3",co:"Mistral AI",pr:"API",ur:"https://mistral.ai",de:"欧洲代表。数学48.74，幻觉51.67。",total:41.06,math:48.74,hallucination:51.67,science:54.88,instruction:4.32,coding:42.24,agent:44.51},
  {nm:"Llama 4 Maverick",co:"Meta",pr:"开源",ur:"https://llama.meta.com",de:"Meta开源旗舰。幻觉66.74尚可，智能体23.78偏低。",total:36.7,math:38.66,hallucination:66.74,science:47.56,instruction:3.78,coding:39.67,agent:23.78},
];

const sortedByTotal = [...MODELS].sort((a,b)=>b.total-a.total);
const fav=(url)=>{try{return'https://www.google.com/s2/favicons?domain='+new URL(url).hostname+'&sz=32'}catch(e){return''}};

function ModelLogo({mod,size}){return <img loading="lazy" src={fav(mod.ur)} className={size||'w-5 h-5'} style={{borderRadius:3,flexShrink:0,width:size==='sm'?16:20,height:size==='sm'?16:20}} alt="" onError={e=>e.target.style.display='none'} />}

export default function Home() {
  const [mainIdx, setMainIdx] = useState(0);
  const [compareIdx, setCompareIdx] = useState(-1);
  const [locale, setLocale] = useState('en');
  const [mounted, setMounted] = useState(false);
  useEffect(()=>{setMounted(true);setLocale(getLocale())},[]);
  if(!mounted)return<div className="min-h-screen bg-gray-50 dark:bg-gray-900"/>;

  const m = MODELS[mainIdx];
  const models = [m];
  if(compareIdx>=0&&compareIdx!==mainIdx)models.push(MODELS[compareIdx]);
  const isCmp = models.length===2;

  const tags = DIMS.map(d=>{const v=getDim(m,d.k);if(v>=80)return{cls:'bg-green-100 text-green-700',icon:'🏆',v};if(v<=30)return{cls:'bg-red-100 text-red-700',icon:'⚠️',v};return{cls:'bg-gray-100 text-gray-600',icon:'',v};});

  const topDims=DIMS.filter(d=>getDim(m,d.k)>=80),lowDims=DIMS.filter(d=>getDim(m,d.k)<=30);
  const summary=locale==='zh'?(topDims.length?`核心优势：${topDims.map(d=>d.l+getDim(m,d.k)).join('、')}`:'')+(lowDims.length?` | 短板：${lowDims.map(d=>d.l+getDim(m,d.k)).join('、')}`:''):(topDims.length?`Strengths: ${topDims.map(d=>d.le+getDim(m,d.k)).join(', ')}`:'')+(lowDims.length?` | Weak: ${lowDims.map(d=>d.le+getDim(m,d.k)).join(', ')}`:'');
  let cmpSummary='';if(isCmp){const a=[],b=[];DIMS.forEach(d=>{const va=getDim(models[0],d.k),vb=getDim(models[1],d.k);if(va>vb)a.push({l:locale==='zh'?d.l:d.le,diff:va-vb});else if(vb>va)b.push({l:locale==='zh'?d.l:d.le,diff:vb-va})});a.sort((x,y)=>y.diff-x.diff);b.sort((x,y)=>y.diff-x.diff);cmpSummary=locale==='zh'?`${models[0].nm.split(' ')[0]}领先：${a.length?a.slice(0,3).map(d=>d.l+'+'+d.diff.toFixed(1)).join('、'):'—'} | ${models[1].nm.split(' ')[0]}领先：${b.length?b.slice(0,3).map(d=>d.l+'+'+d.diff.toFixed(1)).join('、'):'—'}`:`${models[0].nm.split(' ')[0]} wins: ${a.length?a.slice(0,3).map(d=>d.l+'+'+d.diff.toFixed(1)).join(', '):'—'} | ${models[1].nm.split(' ')[0]} wins: ${b.length?b.slice(0,3).map(d=>d.l+'+'+d.diff.toFixed(1)).join(', '):'—'}`;}

  return(<>
    <Head><title>AI 智能指数 SuperCLUE 2026 - Finding AI Tools</title><meta name="description" content="SuperCLUE中文大模型评测基准。24款模型6维度评测排名。"/></Head>
    <Nav/>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="text-center mb-5">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{locale==='zh'?'AI 智能指数':'AI Intelligence Index'}</h2>
          <p className="text-gray-500 text-sm mt-1">{locale==='zh'?`SuperCLUE 2026 · ${MODELS.length} 模型 · 6 维度`:`SuperCLUE 2026 · ${MODELS.length} models · 6 dims`}</p>
        </div>

        {/* 1. Radar + Compare Section (TOP) */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="flex justify-center items-center gap-3 mb-4 text-sm flex-wrap">
            <span className="text-gray-500">{locale==='zh'?'当前':'Current'}: <strong className="text-indigo-600">{m.nm}</strong></span>
            <span className="text-gray-400 font-semibold">VS</span>
            <select value={compareIdx} onChange={e=>{const v=parseInt(e.target.value);setCompareIdx(v>=0&&v===mainIdx?-1:v)}} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm">
              <option value="-1">{locale==='zh'?'-- 选择对比 --':'-- Select --'}</option>
              {MODELS.map((mod,i)=>i!==mainIdx?<option key={i} value={i}>{mod.nm}</option>:null)}
            </select>
            {compareIdx>=0&&<span className="text-xs text-indigo-600 cursor-pointer" onClick={()=>setCompareIdx(-1)}>VS {MODELS[compareIdx].nm} ✕</span>}
          </div>
          <div className="flex flex-col xl:flex-row gap-5 items-start">
            <div className="w-full xl:w-[280px] flex-shrink-0 bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[300px] xl:max-h-[500px] overflow-y-auto">
              <div className="px-4 py-3 text-sm font-bold text-gray-400 uppercase border-b sticky top-0 bg-gray-50 dark:bg-gray-750">{locale==='zh'?'模型':'Models'} ({MODELS.length})</div>
              {MODELS.map((mod,i)=>(
                <div key={i} onClick={()=>{setMainIdx(i);setCompareIdx(-1)}} className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer text-sm border-b border-gray-100 dark:border-gray-700 transition-colors ${i===mainIdx?'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 font-bold':'hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                  <ModelLogo mod={mod}/>
                  <span className="truncate flex-1">{mod.nm}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 text-gray-500">{mod.total.toFixed(1)}</span>
                </div>
              ))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-center font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">{isCmp?`${models[0].nm} VS ${models[1].nm}`:models[0].nm}</div>
              <div className="max-w-[650px] mx-auto"><RadarChart labels={DIMS.map(d=>locale==='zh'?d.l:d.le)} datasets={models.map((mod,i)=>({label:mod.nm,data:DIMS.map(d=>getDim(mod,d.k)),backgroundColor:(i===0?'rgba(99,102,241,0.2)':'rgba(239,68,68,0.2)'),borderColor:(i===0?'rgba(99,102,241,0.9)':'rgba(239,68,68,0.9)'),borderWidth:2.5,pointBackgroundColor:i===0?'#6366f1':'#ef4444',pointRadius:4}))}/></div>
              <div className="flex flex-wrap gap-1.5 mt-4 justify-center">{tags.map((t,i)=><span key={i} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.cls}`}>{t.icon} {locale==='zh'?DIMS[i].l:DIMS[i].le} {t.v}</span>)}</div>
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">{isCmp?cmpSummary:summary}</div>
            </div>
            <div className="w-full xl:w-[320px] flex-shrink-0">
              <div className="bg-gray-50 dark:bg-gray-750 rounded-xl border border-gray-100 dark:border-gray-700 p-6">
                {isCmp?(
                  <div>
                    <div className="font-bold text-lg text-indigo-600 mb-3">{locale==='zh'?'对比详情':'Comparison'}</div>
                    <table className="w-full text-sm">
                      <thead><tr className="text-gray-400 text-xs"><th className="text-left pb-2">{locale==='zh'?'维度':'Dim'}</th><th className="text-right pb-2 text-indigo-600 font-semibold">{models[0].nm.split(' ')[0]}</th><th className="text-right pb-2 text-red-500 font-semibold">{models[1].nm.split(' ')[0]}</th></tr></thead>
                      <tbody>
                        <tr className="border-t border-gray-100 dark:border-gray-700"><td className="py-2 text-gray-500 font-bold">{locale==='zh'?'总分':'Total'}</td><td className={`text-right py-2 font-bold ${models[0].total>models[1].total?'text-red-600':'text-green-600'}`}>{models[0].total.toFixed(1)}</td><td className={`text-right py-2 font-bold ${models[1].total>models[0].total?'text-red-600':'text-green-600'}`}>{models[1].total.toFixed(1)}</td></tr>
                        {DIMS.map(d=>{const va=getDim(models[0],d.k),vb=getDim(models[1],d.k);return<tr key={d.k} className="border-t border-gray-100 dark:border-gray-700"><td className="py-2 text-gray-500">{locale==='zh'?d.l:d.le}</td><td className={`text-right py-2 font-semibold ${va>vb?'text-red-600':vb>va?'text-green-600':''}`}>{va.toFixed(1)}</td><td className={`text-right py-2 font-semibold ${vb>va?'text-red-600':va>vb?'text-green-600':''}`}>{vb.toFixed(1)}</td></tr>})}
                      </tbody>
                    </table>
                  </div>
                ):(
                  <div>
                    <div className="text-center mb-3"><div className="text-[52px] font-extrabold text-indigo-600">{m.total.toFixed(1)}</div><div className="text-sm text-gray-400">{locale==='zh'?'SuperCLUE总分':'SuperCLUE Score'} /100</div></div>
                    <div className="flex items-center gap-2 text-sm mb-3"><ModelLogo mod={m} size="sm"/><strong className="text-gray-700 dark:text-gray-300">{m.co}</strong></div>
                    <div className="text-xs text-gray-600 leading-relaxed bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">{m.de}</div>
                    <a href={m.ur} target="_blank" className="block text-center py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">{locale==='zh'?'🌐 访问官网':'🌐 Visit'}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Total Score Vertical Bar Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{locale==='zh'?'📊 总分排名':'📊 Total Score Ranking'}</h3>
          <div className="flex items-end gap-0.5 h-[300px] px-2 max-w-full overflow-x-auto">
            {sortedByTotal.map((mod,i)=>(
              <div key={i} className="flex flex-col items-center justify-end h-full cursor-pointer group flex-shrink-0" style={{width:'3.5%'}} onClick={()=>setMainIdx(i)} title={`${mod.nm}: ${mod.total.toFixed(1)}`}>
                <span className="text-[9px] text-gray-400 mb-0.5 font-mono">{mod.total.toFixed(0)}</span>
                <div className="w-[60%] rounded-t transition-all group-hover:opacity-80" style={{height:mod.total*3+'px',backgroundColor:COLORS[i%COLORS.length],minHeight:2}}/>
                <div className="flex items-center gap-0.5 mt-1">
                  <ModelLogo mod={mod} size="sm"/>
                  <span className="text-[7px] text-gray-500 text-center leading-tight" style={{writingMode:'vertical-rl',textOrientation:'mixed',maxHeight:60}}>{mod.nm.split(' ')[0]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. Dimension Bar Charts (vertical, one per dimension, all models) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {DIMS.map(d=>{
            const sorted = [...MODELS].sort((a,b)=>getDim(b,d.k)-getDim(a,d.k));
            return(
              <div key={d.k} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
                <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">{locale==='zh'?d.l:d.le}</h4>
                <div className="flex items-end gap-[1px] h-[200px]">
                  {sorted.slice(0,12).map((mod,i)=>(
                    <div key={i} className="flex flex-col items-center justify-end h-full cursor-pointer group flex-shrink-0" style={{width:'7.8%'}} onClick={()=>{const idx=MODELS.indexOf(mod);if(idx>=0)setMainIdx(idx)}}>
                      <span className="text-[8px] text-gray-400 font-mono">{getDim(mod,d.k).toFixed(0)}</span>
                      <div className="w-[50%] rounded-t transition-all group-hover:opacity-80" style={{height:getDim(mod,d.k)*1.8+'px',backgroundColor:COLORS[MODELS.indexOf(mod)%COLORS.length],minHeight:1}}/>
                      <span className="text-[7px] text-gray-400 mt-0.5" style={{writingMode:'vertical-rl',textOrientation:'mixed',maxHeight:50}}>{mod.nm.split(' ')[0]}</span>
                    </div>
                  ))}
                </div>
              </div>
            );})}
        </div>
      </div>
    </div>
  </>);
}