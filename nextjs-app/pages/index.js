'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';
import RadarChart from '../components/RadarChart';
import { getLocale } from '../lib/i18n';

const DIMS = [
  {k:'reasoning',l:'推理能力'},{k:'chinese',l:'中文能力'},{k:'coding',l:'编程能力'},{k:'math',l:'数学能力'},
  {k:'hallucination',l:'幻觉控制'},{k:'speed',l:'响应速度'},{k:'api_cost',l:'API成本'},{k:'agent',l:'Agent能力'},{k:'long_text',l:'长文本能力'}
];

const MODELS = [
  {nm:"GPT-5.5 / Instant",co:"OpenAI（美国）",pr:"Plus $20/月, Pro $200/月",ur:"https://chat.openai.com",de:"OpenAI在2025年发布了GPT-5.5系列，包含旗舰版GPT-5.5和轻量级的GPT-5.5 Instant两个版本。这一代模型最大的变化在于推理能力的大幅跃升——OpenAI内部数据显示，GPT-5.5在MATH、GPQA等复杂推理基准上较前代提升了约30%。技术架构上，GPT-5.5引入了原生的工具使用机制，模型能自主决定何时调用搜索、代码解释器或第三方API，而不需要开发者额外编写编排逻辑。1M token的上下文窗口是另一个硬指标，这相当于能一次性处理超过70万英文单词或整套技术文档。GPT-5.5 Instant则专注于低延迟场景，在保持核心推理质量的前提下，响应速度提高了近3倍，适合实时对话和高并发API服务。ChatGPT Plus和Pro用户已可直接使用，API也已面向企业开放。",re:9.8,ch:8.5,coding:9.7,ma:9.6,ha:9.5,sp:7.5,ap:4,ag:9.8,lt:9},
  {nm:"Claude Opus 4.7",co:"Anthropic（美国）",pr:"Pro $20/月, API按量计费",ur:"https://claude.ai",de:"Anthropic推出的Claude Opus 4.7是当前Claude系列中能力最强的旗舰模型。它被定位为Opus层级，与Sonnet、Haiku共同构成三档模型矩阵，始终代表Anthropic在推理深度、知识广度和输出质量上的最高水准。Opus 4.7在复杂推理任务上有了明显跃升，特别是在多步代码调试和复杂业务逻辑编排中，表现如资深架构师。它在GPQA和MATH等硬核推理基准上追平甚至超越了同期旗舰模型。长度方面，Opus 4.7支持200K token上下文，足以覆盖绝大多数文档级的推理场景。系统指令遵循度是Opus 4.7另一个被广泛认可的强项——它能严格按给定格式输出，不随意发挥，这在企业自动化工作流中至关重要。目前Pro订阅20美元每月，API按token计费。",re:9.7,ch:8.3,coding:9.8,ma:9.4,ha:9.7,sp:7.2,ap:3.8,ag:9.2,lt:9.5},
  {nm:"Gemini 3.1 Pro",co:"Google DeepMind（美国）",pr:"Google One $19.99/月",ur:"https://deepmind.google/gemini",de:"Google DeepMind的Gemini 3.1 Pro被视为对Gemini系列能力边界的重新定义。核心升级围绕多模态融合和智能体化两条主线展开。它不再只是能看能读的模型，而是把图像生成、音频控制、视频创作整合到了同一个底层架构里，内置了Nano Banana生图和Veo视频生成能力。在推理方面，3.1 Pro表现出更连贯的逻辑链条和更低的幻觉率，尤其在长上下文记忆和跨模态检索上进步显著。Google对外公布的基准测试显示，它在MMLU-Pro和多个多模态推理排行榜上达到SOTA。接入层面，3.1 Pro通过Google One AI Premium订阅和Vertex AI企业平台提供服务，基础版定价19.99美元每月。",re:9.2,ch:8,coding:8.8,ma:9,ha:8.5,sp:8.5,ap:6.5,ag:8.8,lt:9.2},
  {nm:"Grok 3 Pro",co:"xAI（美国）",pr:"X Premium+ $16/月",ur:"https://x.ai/grok",de:"xAI推出的Grok 3 Pro是目前Grok系列的最强版本。与依赖历史训练数据的模型不同，Grok 3 Pro最大的特色是实时接入X平台的数据流，拥有当前大模型中最强的实时信息捕捉和上下文更新能力。在硬核推理方面，3 Pro在数学证明、逻辑编码和物理模拟等任务上大幅进步，风格直接略带幽默。xAI官方数据显示其在数学和STEM评测中的得分比前代提升了超过40%。Grok 3 Pro通过X Premium+会员提供，每月16美元，API已逐步开放。对于需要实时数据聚合、金融动态分析和新闻追踪的应用场景，Grok 3 Pro是目前最天然的选择。",re:8.7,ch:7,coding:8.5,ma:9.1,ha:7.5,sp:8.8,ap:7,ag:8,lt:7.5},
  {nm:"DeepSeek V4 Pro",co:"深度求索（中国）",pr:"API极具性价比,1M上下文",ur:"https://www.deepseek.com",de:"DeepSeek V4 Pro是深度求索在基础大模型领域的最硬核答卷。从官方信息看，V4 Pro最大的卖点是世界顶级的推理能力和大幅提升的Agent能力——它更会想，也更会做。在数学、STEM和代码生成等核心评测中，V4 Pro正面迎战全球顶级闭源模型，表现毫不逊色。技术上，它采用独特的代币压缩算法与深度稀疏注意力机制，计算效率极高，1M上下文窗口让它在处理超长文档和代码库时优势明显。结构化输出标准的稳定性和极具性价比的API定价（较同类低30-50%），使其成为自动化系统和多Agent协作场景的首选。",re:9.5,ch:9.2,coding:9.6,ma:9.7,ha:8.8,sp:8.8,ap:9,ag:9.3,lt:9},
  {nm:"Qwen 3.6 Max",co:"阿里巴巴（中国）",pr:"API按量计费,开源免费",ur:"https://tongyi.aliyun.com",de:"通义千问3.6 Max是阿里通义实验室最新推出的旗舰级大语言模型，定位全能至强。基于超万亿参数规模的预训练，它在模型容量和知识密度上处于大模型第一梯队。3.6 Max覆盖自然语言理解、文本生成、视觉理解、音频理解等基础能力，同时深度整合工具调用、角色扮演和AI Agent交互。在多语言翻译、长文本商业报告摘要及中文商业逻辑推理上表现尤为突出，能完美处理复杂排版网页与图文混排财报的解析。阿里云延续全尺寸覆盖策略，中小参数版本开源免费，旗舰版API按量计费。",re:9,ch:9.5,coding:8.8,ma:8.7,ha:8.5,sp:8.7,ap:8.5,ag:8.9,lt:8.8},
  {nm:"ERNIE 5.1（文心）",co:"百度（中国）",pr:"API按量计费,高级会员",ur:"https://yiyan.baidu.com",de:"文心一言ERNIE 5.1是百度在大模型领域的最新旗舰产品。最显著的变化在于理解与生成之间的边界被进一步模糊。官方数据显示，ERNIE 5.1在多个中文自然语言理解基准测试中得分较上一代提升约15%，尤其在复杂逻辑推理和长文本语义捕捉上表现接近人类专家水平。技术层面，ERNIE 5.1采用全新的知识增强加多任务联合训练架构，深度集成了百度搜索资源矩阵和Famou Agent 2.0环境。在中文长篇写作和本地化营销策划上具有天然优势，API已开放按量计费。",re:9.1,ch:9.6,coding:8.5,ma:8.6,ha:8.7,sp:8.3,ap:7.5,ag:9.1,lt:8.5},
  {nm:"Kimi K2.6",co:"月之暗面（中国）",pr:"API按Token计费",ur:"https://kimi.moonshot.cn",de:"月之暗面的Kimi K2.6是他们迄今为止最硬核的一次更新。K2.6不再只是一个聊天机器人，而是把代码、深度研究、智能体集群和自动化操作整合到了同一界面。最突出的变化在编程和智能体——内置的Kimi Code模块可直接处理代码仓库级别的任务，而不只是写几行函数。在Agent群体智能方面，K2.6首次引入多Agent协作机制，多个AI实例可同步分工完成复杂项目。超长文本无损处理仍是Kim的招牌能力，可轻松吞下庞大代码库或几百页PDF并精准提取结构化信息。API按Token计费。",re:8.9,ch:9.3,coding:8.6,ma:8.2,ha:8.6,sp:8,ap:8.8,ag:9,lt:9.7},
  {nm:"Llama 4 Scout/Maverick",co:"Meta（美国）",pr:"完全开源免费",ur:"https://llama.meta.com",de:"Meta的Llama 4系列彻底改变了多模态大模型的竞争格局。该系列包含Maverick和Scout两个版本，采用全新128专家混合架构，在消费级硬件上即可运行出惊人效果。Maverick定位旗舰，推理能力对标顶级闭源模型。Scout则采用17B参数的高效设计。Llama 4支持10M极限上下文窗口，并原生融入跨模态视觉处理，能同时理解图像和文本。作为完全开源免费的模型，Llama 4已成为独立部署系统的最强开源底座，全球开发者社区正在围绕它构建丰富的工具生态。",re:9,ch:7.8,coding:8.5,ma:8.8,ha:8,sp:9,ap:9.5,ag:8.2,lt:9.8},
  {nm:"Mistral Large 3",co:"Mistral AI（法国）",pr:"API按量计费",ur:"https://mistral.ai",de:"Mistral AI作为欧洲AI领头羊，坚持小参数高智能的技术路线。最新旗舰Mistral Large 3在逻辑推理、多语言商务写作上直接对标欧美顶级闭源模型。它的核心优势在于高效架构——相比同等能力的竞品，推理成本显著更低。专门为代码优化的Codestral 2子型号已成为开源社区最受欢迎的代码补全和自动化测试脚本生成引擎。Mistral Large 3支持函数调用、JSON模式输出和Agent工作流编排，云端API按量计费，同时提供开放权重版本供研究使用。",re:8.8,ch:7.5,coding:9,ma:8.5,ha:8.3,sp:9.2,ap:8,ag:8.5,lt:8},
  {nm:"Command R7+",co:"Cohere（加拿大）",pr:"API按量计费",ur:"https://cohere.com",de:"Cohere的Command R7+是一款定位企业级场景的大型语言模型。它不追求在聊天榜单上刷分，而是围绕私有、安全、可定制三个核心设计原则打造。Command R7+在RAG和多语言商务协作方面表现突出——在跨国供应链文档解析、多国语言合规审查和跨系统API调度上稳定性极强。它原生支持工具调用和结构化JSON输出，让企业能把模型直接嵌入现有工作流。Cohere特别强调数据隐私，支持私有云和本地化部署，API按量计费，企业也可定制私有化方案。",re:8.2,ch:7.2,coding:7.8,ma:7.5,ha:8.8,sp:8.3,ap:7.2,ag:9,lt:8.5},
  {nm:"GLM-5.1",co:"智谱AI（中国）",pr:"API按量计费,企业定制",ur:"https://www.zhipuai.cn",de:"智谱AI的GLM-5.1是对智能体工程的重新定义。官方基准测试显示，它在SWE-bench Verified和Terminal Bench 2.0两项核心Agent编程评测中追平了Claude Opus 4.5，达到开源模型中最强水平。GLM-5.1不仅在聊天上表现出色，更重要的是具备了在真实开发环境中自主编写、调试和部署代码的能力。逻辑推理、Function Calling和全链路Agent流程管理是其三大技术支柱。全模态能力支持自动生成数据可视化图表并执行Python代码分析，API高并发稳定性极佳。",re:8.8,ch:9.2,coding:8.4,ma:8.5,ha:8.9,sp:8.6,ap:8.2,ag:8.7,lt:8.7},
  {nm:"Doubao Seed 2.0",co:"字节跳动（中国）",pr:"API超低定价",ur:"https://www.volcengine.com",de:"豆包Seed 2.0是字节跳动旗下火山引擎推出的新一代模型，走了一条务实的路——不盲目追求参数规模，而是重点优化理解与生成的一致性。Seed 2.0最突出的能力是上下文记忆，在长文本处理场景中能精准提取关键数据并在后续对话中精准引用。语义理解流畅度和多轮高频对话意图捕捉细腻，语音流媒体合成技术国内领先。击穿行业的性价比和超高并发支持是它的核心卖点，API提供行业超低定价，特别适合内容批量生成、自动化营销分发和海量请求并发场景。",re:8.7,ch:9.4,coding:8,ma:8,ha:8.4,sp:9.3,ap:9.2,ag:8.5,lt:8.2},
  {nm:"HunYuan 3.5（混元）",co:"腾讯（中国）",pr:"API按量计费,腾讯云生态",ur:"https://cloud.tencent.com",de:"腾讯混元大模型3.5是一次扎实的升级。总参数量突破万亿级别，采用混合专家模型的改进方案，在保持大参数的同时显著降低了推理成本。HunYuan 3.5在生图、文生视频等多模态领域和微信QQ生态的自动化文本理解上全方位迭代。它极大加强了复杂长文本上下文检索与中文多轮对话连贯性，为微信小程序和企业微信生态内的自动化应用提供了无缝接入便利。API按量计费，深度绑定腾讯云生态。",re:8.5,ch:9.1,coding:8.2,ma:8.1,ha:8.3,sp:8.4,ap:8,ag:8.3,lt:8.4},
  {nm:"SenseChat V6（商量）",co:"商汤科技（中国）",pr:"API按量计费,一体机部署",ur:"https://www.sensetime.com",de:"商汤科技的SenseChat V6是日日新大模型系列的一次实质性迭代，定位为多模态交互中枢。它整合了自然语言处理、图像生成、自动化数据标注和自定义模型训练等能力，能同时处理文字、图片、代码甚至3D场景。依托商汤自研的SenseCore AI基础设施，V6在训练效率和推理速度上都有显著提升。凭借CV领域的硬核底蕴，V6在多模态图文解析、空间几何逻辑推演和医疗工业视觉图表理解上专业度极高，并提供软硬件一体私有化部署方案。",re:8.3,ch:9,coding:8.1,ma:8,ha:8.6,sp:8.2,ap:7,ag:8.4,lt:8},
  {nm:"Yi 3.5",co:"零一万物（中国）",pr:"API计费,部分开源",ur:"https://www.01.ai",de:"零一万物的Yi 3.5延续了基座模型加企业级应用的双轮驱动策略。Yi-Lightning作为全球SOTA级别的混合专家语言模型，在推理效率上实现了显著突破——相比同等参数规模的稠密模型，大幅降低了推理延迟和部署成本。Yi 3.5在中英文双语深度翻译和跨境电商文案生成方面语感优势明显，多次在LMSYS榜单上逆袭。部分中参数模型开源，主力模型API计费，价格低廉响应迅速，特别适合跨国业务团队使用。",re:8.6,ch:9,coding:8.3,ma:8,ha:8.2,sp:9.1,ap:8.7,ag:8.1,lt:8.6},
  {nm:"Baichuan 4-Turbo",co:"百川智能（中国）",pr:"API计费,企业定制",ur:"https://www.baichuan-ai.com",de:"百川智能的Baichuan 4-Turbo在中文理解基准C-Eval和CMMLU上得分超过了GPT-4和Claude 3.5 Sonnet，尤其在数学推理和代码生成等硬逻辑任务上优势明显。核心差异化在于长文本检索的无损精准度，以及医疗、传统文化等长尾专业领域的深度垂直微调。融合RAG技术后能有效解决专业问题的胡言乱语现象，适合垂直行业知识库和法律医疗初审辅助工具。API计费，同时提供定制化企业医疗和搜索方案。",re:8.4,ch:9,coding:7.9,ma:7.8,ha:8.7,sp:8.5,ap:7.8,ag:8,lt:8.9},
  {nm:"TeleChat 2（天翼）",co:"中国电信（中国）",pr:"API计费,政企专网",ur:"https://www.chinatelecom.com.cn",de:"中国电信的TeleChat 2是运营商体系内少有的自研大模型。它没有走参数竞赛的路线，而是把重心放在了实际应用上。基于星辰大模型平台，参数量级覆盖百亿到千亿不等，支持文本生成、代码编写、逻辑推理、多轮对话等主流任务。在中文理解上针对政务、通信、金融等垂直领域做了专项优化，在公文写作、政策法规解读和客服话术自动生成等严肃政企场景下合规准确率极高。天然支持与运营商通信基础设施深度集成，提供政企专网私有部署方案。",re:8,ch:9.1,coding:7.5,ma:7.6,ha:8.8,sp:8.3,ap:7.5,ag:7.8,lt:8},
  {nm:"MiniMax ABAB 6.5",co:"MiniMax（中国）",pr:"API按量计费,海螺¥25/月",ur:"https://www.minimax.io",de:"MiniMax的ABAB 6.5（M2.7）是M2.5的正式迭代版本，核心卖点是自我改进能力——模型能在运行过程中主动识别薄弱环节，通过调用外部工具或检索知识库来修正输出。作为国内泛娱乐与角色扮演领域的绝对王者，它拥有市面上极其细腻的情商和人设维持能力，多轮高频对话中完美锁定设定的人设语气和隐藏情感倾向。多模态语音合成的方言和情绪化表达也极为出色。海螺AI会员每月25元即可使用，API按量计费。",re:8.2,ch:9.3,coding:7.8,ma:7.7,ha:8.1,sp:8.9,ap:8.6,ag:8.2,lt:8.3},
  {nm:"Phi-4 / Phi-4 Mini",co:"微软（美国）",pr:"开源免费,Azure托管",ur:"https://azure.microsoft.com",de:"微软的Phi-4是端侧小模型的天花板，用约14B参数实现了令人意外的性能表现。它最亮眼的是数学和编程能力——在MATH和HumanEval等基准上，得分接近许多比它大数倍的模型。Phi-4的成功证明了高质量教科书级数据训练的价值。Mini版本可在笔记本、手机甚至边缘设备上部署，在基础语法纠错和结构化文本提取上速度极快延迟极低。Phi-4完全开源免费，Azure提供托管API计费。",re:7.8,ch:7,coding:7.5,ma:7.2,ha:7.8,sp:9.5,ap:9.8,ag:7,lt:6.5},
  {nm:"Gemma 2.5",co:"Google（美国）",pr:"开源免费,允许商用",ur:"https://ai.google.dev",de:"谷歌的Gemma 2.5是开源阵营的主力军，基于Gemini技术衍生的学术级模型。它以极度纯净的学术表现著称，在数学逻辑、纯文本推导和指令严格遵循度上扎实可靠。作为完全开源且允许商用的模型，Gemma 2.5已成为大模型底层算法研究和垂直领域基准模型魔改的优质白盒底座。开发者可通过Google AI Studio免费使用，也支持本地部署。",re:7.5,ch:6.8,coding:7,ma:7.8,ha:8.2,sp:9,ap:9.5,ag:7.2,lt:7},
  {nm:"Stable Diff 3.5",co:"Stability AI（英国）",pr:"开源免费,API按次",ur:"https://stability.ai",de:"Stability AI的Stable Diffusion 3.5采用了全新的多模态扩散Transformer架构，在生成质量、文本理解能力和风格多样性上都有明显提升。输出分辨率达到4MP约400万像素，让生成的图片在印刷或大屏展示时保持清晰细节。多主体排版、文字内嵌和空间透视逻辑有质的飞跃。全球开发者基于它开发了数以万计的控制插件，是掌控生成流程、搭建自动化图文生成流水线的工业级标准。权重开源免费，API按次计费。",re:6.5,ch:6,coding:2.5,ma:1.5,ha:7.5,sp:8,ap:9.5,ag:3.5,lt:2.5},
  {nm:"Flux.1 Pro",co:"Black Forest Labs（德国）",pr:"Pro API计费,Dev开源",ur:"https://blackforestlabs.ai",de:"Black Forest Labs的Flux.1 Pro由Stable Diffusion原班核心人马创立，输出分辨率达4MP，画质上限和对超长复杂提示词的惊人理解力逼近Midjourney。在人类手部结构、复杂多人场景和真实照片级质感上表现硬核。作为当前图文生成领域最火爆的新星，Flux.1 Pro已成为专业创作者的必备工具。Pro版API计费，Dev和Schnell版本开源供社区使用。",re:7.5,ch:6.8,coding:2,ma:1.8,ha:8.8,sp:7,ap:6,ag:3,lt:3.5},
  {nm:"Sora 2.0 Pro",co:"OpenAI（美国）",pr:"定向API,影视订阅",ur:"https://openai.com/sora",de:"OpenAI的Sora 2.0 Pro是颠覆全球影视与视频内容生产的物理级模拟器。2.0版本在保持60秒超长高保真视频生成能力的同时，极大修复了前代的物理因果律漏洞——能模拟真实3D空间的流体物理、光线折射和多镜头运动一致性。它的核心突破在于对物理世界的深层理解，而非简单拼贴画面。虽然API还未全面开放，但已向部分影视工作室提供定向接入，未来将改变短视频和影视制作的工作流程。",re:8.5,ch:7,coding:3.5,ma:3,ha:8,sp:4,ap:2,ag:5,lt:4},
  {nm:"Kling 2.0（可灵）",co:"快手（中国）",pr:"算力点卡,官方API",ur:"https://kling.kuaishou.com",de:"快手的可灵AI 2.0把视频生成拉到了新高度。它不再只是文生视频工具，而是进化成了多模态创作平台。2.0版本通过改进的3D时空注意力机制，解决了AI视频人物变脸和场景跳帧的长期痛点。在运镜平滑度、大运动幅度肢体协调性和画面光影连续性上成熟度极高。可灵提供算力点卡计费和官方API接口，商业化门槛较低，特别适合搭建短视频自动化剪辑流水线，已在创作者社区中广泛采用。",re:8,ch:8.5,coding:3,ma:2.5,ha:7.8,sp:7.5,ap:7,ag:4.5,lt:3},
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
              <div className="max-w-[700px] mx-auto">
                <RadarChart
                  labels={DIMS.map(d=>d.l)}
                  datasets={models.map((mod,i)=>({
                    label: mod.nm,
                    data: DIMS.map(d=>dim(mod,d.k)),
                    backgroundColor: (i===0?'rgba(99,102,241,0.2)':'rgba(239,68,68,0.2)'),
                    borderColor: (i===0?'rgba(99,102,241,0.9)':'rgba(239,68,68,0.9)'),
                    borderWidth: 2.5,
                    pointBackgroundColor: i===0?'#6366f1':'#ef4444',
                    pointRadius: 4,
                  }))}
                />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4 justify-center">
                {tags.map((t,i)=><span key={i} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.cls}`}>{t.icon} {DIMS[i].l} {t.v}</span>)}
              </div>
            </div>

            <div className="w-full xl:w-[340px] flex-shrink-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border p-7">
                {isCmp?(
                  <div>
                    <div className="font-bold text-lg text-indigo-600 mb-4">{locale==='zh'?'对比详情':'Comparison'}</div>
                    <table className="w-full text-[15px]">
                      <thead><tr className="text-gray-400 text-xs"><th className="text-left pb-2">{locale==='zh'?'维度':'Dim'}</th><th className="text-right pb-2 text-indigo-600 font-semibold">{models[0].nm.split(' ')[0]}</th><th className="text-right pb-2 text-red-500 font-semibold">{models[1].nm.split(' ')[0]}</th></tr></thead>
                      <tbody>
                        {DIMS.map(d=>{const va=dim(models[0],d.k),vb=dim(models[1],d.k);return <tr key={d.k} className="border-t border-gray-50 dark:border-gray-700"><td className="py-2 text-gray-500">{locale==='zh'?d.l:d.k}</td><td className={`text-right py-2 font-semibold ${va>vb?'text-red-600':vb>va?'text-green-600':''}`}>{va}</td><td className={`text-right py-2 font-semibold ${vb>va?'text-red-600':va>vb?'text-green-600':''}`}>{vb}</td></tr>;})}
                        <tr className="border-t-2 border-gray-200 dark:border-gray-600 font-extrabold"><td className="py-2">{locale==='zh'?'综合':'Overall'}</td><td className={`text-right py-2 ${+avg(models[0])>+avg(models[1])?'text-red-600':'text-green-600'}`}>{avg(models[0])}</td><td className={`text-right py-2 ${+avg(models[1])>+avg(models[0])?'text-red-600':'text-green-600'}`}>{avg(models[1])}</td></tr>
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