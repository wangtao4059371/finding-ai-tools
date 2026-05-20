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
  {nm:"Command R7+",co:"Cohere（加拿大）",pr:"API按量计费",ur:"https://cohere.com",de:"企业级RAG和多语言商务协作定制黑马模型。跨国供应链文档解析和企业合规审查稳定性极强。",re:8.2,ch:7.2,coding:7.8,ma:7.5,ha:8.8,sp:8.3,ap:7.2,ag:9,lt:8.5},
  {nm:"GLM-5.1",co:"智谱AI（中国）",pr:"API按量计费,企业定制",ur:"https://www.zhipuai.cn",de:"深厚学术积累，逻辑推理和全链路Agent流程管理表现出色，全模态能力可自动生成数据可视化。",re:8.8,ch:9.2,coding:8.4,ma:8.5,ha:8.9,sp:8.6,ap:8.2,ag:8.7,lt:8.7},
  {nm:"Doubao Seed 2.0",co:"字节跳动（中国）",pr:"API超低定价",ur:"https://www.volcengine.com",de:"击穿行业性价比和超高并发支持，语义理解流畅细腻，语音合成技术国内领先。",re:8.7,ch:9.4,coding:8,ma:8,ha:8.4,sp:9.3,ap:9.2,ag:8.5,lt:8.2},
  {nm:"HunYuan 3.5（混元）",co:"腾讯（中国）",pr:"API按量计费,腾讯云生态",ur:"https://cloud.tencent.com",de:"生图文生视频多模态及微信QQ生态全方位迭代，加强了长文本上下文检索与多轮对话连贯性。",re:8.5,ch:9.1,coding:8.2,ma:8.1,ha:8.3,sp:8.4,ap:8,ag:8.3,lt:8.4},
  {nm:"SenseChat V6（商量）",co:"商汤科技（中国）",pr:"API按量计费,一体机部署",ur:"https://www.sensetime.com",de:"CV领域硬核底蕴，多模态图文解析和医疗/工业视觉图表理解专业度极高。",re:8.3,ch:9,coding:8.1,ma:8,ha:8.6,sp:8.2,ap:7,ag:8.4,lt:8},
  {nm:"Yi 3.5",co:"零一万物（中国）",pr:"API计费,部分开源",ur:"https://www.01.ai",de:"LMSYS榜单一再逆袭，惊人性价比与推理速度。中英文双语翻译和跨境电商文案生成优势明显。",re:8.6,ch:9,coding:8.3,ma:8,ha:8.2,sp:9.1,ap:8.7,ag:8.1,lt:8.6},
  {nm:"Baichuan 4-Turbo",co:"百川智能（中国）",pr:"API计费,企业定制",ur:"https://www.baichuan-ai.com",de:"长文本检索无损精准度及医疗等领域深度垂直微调。RAG技术解决专业问题胡言乱语。",re:8.4,ch:9,coding:7.9,ma:7.8,ha:8.7,sp:8.5,ap:7.8,ag:8,lt:8.9},
  {nm:"TeleChat 2（天翼）",co:"中国电信（中国）",pr:"API计费,政企专网",ur:"https://www.chinatelecom.com.cn",de:"运营商背景大模型。政务公文写作、政策法规解读和客服话术生成等场景合规准确率极高。",re:8,ch:9.1,coding:7.5,ma:7.6,ha:8.8,sp:8.3,ap:7.5,ag:7.8,lt:8},
  {nm:"MiniMax ABAB 6.5",co:"MiniMax（中国）",pr:"API按量计费,海螺¥25/月",ur:"https://www.minimax.io",de:"泛娱乐与角色扮演领域王者。细腻情商与人设维持能力，多模态语音合成方言情绪化表达极出色。",re:8.2,ch:9.3,coding:7.8,ma:7.7,ha:8.1,sp:8.9,ap:8.6,ag:8.2,lt:8.3},
  {nm:"Phi-4 / Phi-4 Mini",co:"微软（美国）",pr:"开源免费,Azure托管",ur:"https://azure.microsoft.com",de:"端侧小模型天花板，小参数高智能。可部署在笔记本、手机甚至边缘设备，速度极快。",re:7.8,ch:7,coding:7.5,ma:7.2,ha:7.8,sp:9.5,ap:9.8,ag:7,lt:6.5},
  {nm:"Gemma 2.5",co:"Google（美国）",pr:"开源免费,允许商用",ur:"https://ai.google.dev",de:"谷歌开源阵营主力军。数学逻辑和纯文本推导扎实可靠，算法研究的优质白盒底座。",re:7.5,ch:6.8,coding:7,ma:7.8,ha:8.2,sp:9,ap:9.5,ag:7.2,lt:7},
  {nm:"Stable Diff 3.5",co:"Stability AI（英国）",pr:"开源免费,API按次",ur:"https://stability.ai",de:"全球开源绘图生态统治者。多主体排版和空间透视逻辑质的飞跃，开发者开发了数万控制插件。",re:6.5,ch:6,coding:2.5,ma:1.5,ha:7.5,sp:8,ap:9.5,ag:3.5,lt:2.5},
  {nm:"Flux.1 Pro",co:"Black Forest Labs（德国）",pr:"Pro API计费,Dev开源",ur:"https://blackforestlabs.ai",de:"SD原班人马创立。画质上限和超长提示词理解力惊人，复杂多人场景真实质感表现硬核。",re:7.5,ch:6.8,coding:2,ma:1.8,ha:8.8,sp:7,ap:6,ag:3,lt:3.5},
  {nm:"Sora 2.0 Pro",co:"OpenAI（美国）",pr:"定向API,影视订阅",ur:"https://openai.com/sora",de:"物理级视频模拟器。修复物理因果律漏洞，60秒长视频，3D空间流体光线折射多镜头运动一致性。",re:8.5,ch:7,coding:3.5,ma:3,ha:8,sp:4,ap:2,ag:5,lt:4},
  {nm:"Kling 2.0（可灵）",co:"快手（中国）",pr:"算力点卡,官方API",ur:"https://kling.kuaishou.com",de:"国内文生视频领域领跑者。运镜平滑度和肢体协调性极高，适合搭建短视频自动化剪辑流水线。",re:8,ch:8.5,coding:3,ma:2.5,ha:7.8,sp:7.5,ap:7,ag:4.5,lt:3},
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
    if(v>=9) return {cls:'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',icon:'🏆',v};
    if(v<=5) return {cls:'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',icon:'⚠️',v};
    return {cls:'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',icon:'',v};
  });

  return (
    <>
      <Head>
        <title>AI 大模型多维评分 - Finding AI Tools</title>
        <meta name="description" content="9维度 x 26款主流AI大模型工程化评测对比，支持1v1深入对比" />
      </Head>
      <Nav />
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="text-center mb-4">
<h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {locale==='zh'?'AI 大模型多维评分体系':'AI Model Multi-Dimensional Ratings'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                {locale==='zh'?`9 维度 × ${MODELS.length} 款模型工程化评测 · 点击左侧切换模型 · 下拉选第二模型进行 1v1 对比`:`9 dimensions × ${MODELS.length} models benchmarked · Click sidebar to switch · Select second model for 1v1 comparison`}
              </p>
          </div>

          <div className="flex justify-center items-center gap-3 mb-5 text-sm flex-wrap">
            <span className="text-gray-500">{locale==='zh'?'当前':'Current'}: <strong className="text-indigo-600 dark:text-indigo-400">{m.nm}</strong></span>
            <span className="text-gray-400 font-semibold">VS</span>
            <select
              value={compareIdx}
              onChange={e=>{const v=parseInt(e.target.value);setCompareIdx(v>=0&&v===mainIdx?-1:v)}}
              className="px-3 py-1.5 border-2 border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm focus:border-indigo-500 outline-none"
            >
              <option value="-1">{locale==='zh'?'-- 选择对比模型 --':'-- Select to Compare --'}</option>
              {MODELS.map((mod,i) => i!==mainIdx ? <option key={i} value={i}>{mod.nm}</option> : null)}
            </select>
            {compareIdx >= 0 && (
              <span className="bg-indigo-50 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded text-xs cursor-pointer font-medium" onClick={()=>setCompareIdx(-1)}>
                VS {MODELS[compareIdx].nm} · ✕ {locale==='zh'?'取消':'Cancel'}
              </span>
            )}
          </div>

          <div className="flex gap-5 items-start">
            {/* Left: Model List */}
            <div className="w-[300px] flex-shrink-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden max-h-[calc(100vh-180px)] overflow-y-auto">
              <div className="px-5 py-3.5 text-sm font-bold text-gray-400 uppercase border-b border-gray-50 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-800 z-10">{locale==='zh'?'全部模型':'All Models'} ({MODELS.length})</div>
              {MODELS.map((mod,i)=>(
                <div
                  key={i}
                  onClick={()=>{setMainIdx(i);setCompareIdx(-1)}}
                  className={`flex items-center gap-3 px-5 py-3 cursor-pointer text-[15px] border-b border-gray-50 dark:border-gray-700 transition-colors ${
                    i===mainIdx
                      ? 'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 font-bold border-l-[3px] border-l-indigo-600 pl-[17px]'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
                >
                  <img src={fav(mod.ur)} className="w-[22px] h-[22px] rounded flex-shrink-0" alt="" onError={e=>e.target.style.display='none'} />
                  <span className="truncate flex-1">{mod.nm}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">{avg(mod)}</span>
                </div>
              ))}
            </div>

            {/* Center: Chart */}
            <div className="flex-1 min-w-0 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
              <div className="text-center font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">
                {isCmp ? `${models[0].nm}  VS  ${models[1].nm}` : models[0].nm}
              </div>
              <div className="max-w-[560px] mx-auto">
                <Radar data={chartData} options={{
                  responsive:true,
                  scales:{r:{beginAtZero:true,max:10,ticks:{stepSize:2,font:{size:14}},pointLabels:{font:{size:14,font:{weight:'bold'}}}}},
                  plugins:{legend:{display:isCmp,position:'bottom',labels:{font:{size:14},padding:24}}}
                }} />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                {tags.map((t,i)=>(
                  <span key={i} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.cls}`}>{t.icon} {DIMS[i].l} {t.v}</span>
                ))}
              </div>
            </div>

            {/* Right: Info */}
            <div className="w-[340px] flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-7">
                {isCmp ? (
                  <div>
                    <div className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-4">{locale==='zh'?'对比详情':'Comparison'}</div>
                    <table className="w-full text-[15px]">
                      <thead><tr className="text-gray-400 text-xs"><th className="text-left pb-2">{locale==='zh'?'维度':'Dimension'}</th><th className="text-right pb-2">{models[0].nm.split(' ')[0]}</th><th className="text-right pb-2">{models[1].nm.split(' ')[0]}</th></tr></thead>
                      <tbody>
                        {DIMS.map(d=>{
                          const va=dim(models[0],d.k), vb=dim(models[1],d.k);
                          return <tr key={d.k} className="border-t border-gray-50 dark:border-gray-700"><td className="py-2 text-gray-500">{locale==='zh'?d.l:d.k}</td><td className={`text-right py-2 font-semibold ${va>vb?'text-red-600':vb>va?'text-green-600':''}`}>{va}</td><td className={`text-right py-2 font-semibold ${vb>va?'text-red-600':va>vb?'text-green-600':''}`}>{vb}</td></tr>;
                        })}
                        <tr className="border-t-2 border-gray-200 dark:border-gray-600 font-extrabold"><td className="py-2">{locale==='zh'?'综合':'Overall'}</td><td className={`text-right py-2 ${+avg(models[0])>+avg(models[1])?'text-red-600':'text-green-600'}`}>{avg(models[0])}</td><td className={`text-right py-2 ${+avg(models[1])>+avg(models[0])?'text-red-600':'text-green-600'}`}>{avg(models[1])}</td></tr>
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div>
                    <div className="text-center">
                      <div className="text-[56px] font-extrabold text-indigo-600 leading-none">{avg(m)}</div>
                      <div className="text-sm text-gray-400 mt-1">{locale==='zh'?'综合评分':'Overall Score'} / 10</div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full mt-4 mb-4 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{width:(+avg(m)*10)+'%'}} />
                      </div>
                    </div>
                    <div className="text-sm text-gray-500 mt-4 mb-3"><strong className="text-gray-700 dark:text-gray-300">{m.co}</strong> · {m.pr}</div>
                    <div className="text-[14px] text-gray-600 dark:text-gray-400 leading-relaxed bg-gray-50 dark:bg-gray-750 rounded-lg p-4 mb-5">{m.de}</div>
                    <a href={m.ur} target="_blank" rel="noopener noreferrer" className="block w-full text-center py-3.5 bg-indigo-600 text-white rounded-lg text-base font-semibold hover:bg-indigo-700 transition-colors">
                      🌐 {locale==='zh'?'访问官网':'Visit Website'}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8 mt-8">
          <div className="max-w-[1400px] mx-auto px-5 grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
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