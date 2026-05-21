'use client';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Nav from '../components/Nav';
import RadarChart from '../components/RadarChart';
import { getLocale } from '../lib/i18n';

const getDim = (m,k) => m[k] || 0;
const COLORS = ['#6366f1','#ef4444','#10b981','#f59e0b','#8b5cf6','#ec4899','#06b6d4','#f97316','#84cc16','#14b8a6','#e11d48','#3b82f6','#a855f7','#eab308','#0ea5e9','#22c55e','#d946ef','#64748b','#f43f5e','#0d9488','#8b5cf6','#ea580c','#2563eb','#ca8a04'];

const DIMS = [
  {k:'math',l:'数学推理',le:'Math'},{k:'hallucination',l:'幻觉控制',le:'Hallucination'},{k:'science',l:'科学推理',le:'Science'},{k:'instruction',l:'指令遵循',le:'Instruction'},{k:'coding',l:'代码生成',le:'Coding'},{k:'agent',l:'智能体',le:'Agent'},
];

const MODELS = [
  {nm:"Claude Opus 4.6",co:"Anthropic",pr:"API",ur:"https://claude.ai",de:"Claude Opus 4.6是Anthropic公司于2025年发布的最新一代旗舰大语言模型，代表了该公司在AI安全与能力平衡方面的最新技术成果。作为Claude系列中性能最强的型号，Opus 4.6在多个关键维度上实现了显著突破。  在核心能力方面，Opus 4.6的上下文窗口扩展至200K tokens，能够一次性处理约15万个英文单词或同等长度的中文内容，相当于三本《三体》体量的长篇小说。在MMLU（大规模多任务语言理解）基准测试中，Opus 4.6得分达到90.8%，较前代Opus 3.5提升约3个百分点；在GSM8K数学推理测试中准确率突破96%；在HumanEval代码生成测试中通过率达到93.5%。这些数据表明，该模型在知识问答、逻辑推理和编程任务上均达到行业顶尖水平。  技术亮点上，Opus 4.6采用了Anthropic独有的Constitutional AI（宪法式A",total:77.02,math:85.71,hallucination:82.95,science:85.37,instruction:47.57,coding:71.15,agent:89.35},
  {nm:"Gemini 3.1 Pro",co:"Google",pr:"API",ur:"https://deepmind.google/gemini",de:"Gemini 3.1 Pro 是 Google DeepMind 推出的多模态大语言模型，定位为处理复杂任务和将创意概念转化为现实的核心工具。该模型于 2025 年发布，属于 Gemini 3.x 系列中的高端版本，专注于深度推理、长上下文理解和多模态生成能力。根据 Google DeepMind 官方技术文档，Gemini 3.1 Pro 在多个基准测试中表现优异，例如在 MMLU（大规模多任务语言理解）测试中得分超过 90%，在数学推理（如 GSM8K）和代码生成（如 HumanEval）任务中也达到行业领先水平。其上下文窗口扩展至 200 万 token，能够一次性处理如《指环王》三部曲体量的文本，或分析长达数小时的视频内容。  技术亮点方面，Gemini 3.1 Pro 采用了混合专家模型（MoE）架构，通过动态路由机制在推理时激活部分参数，从而在保持高性能的同时降低计算成本。该模",total:76.69,math:92.44,hallucination:80.5,science:81.71,instruction:56.76,coding:69.78,agent:78.96},
  {nm:"GPT-5.4",co:"OpenAI",pr:"API",ur:"https://chat.openai.com",de:"GPT-5.4是OpenAI于2025年发布的最新大型语言模型，代表了生成式AI领域的重大技术突破。该模型在多项基准测试中表现卓越，其核心能力包括：在MMLU（大规模多任务语言理解）测试中达到98.7%的准确率，较前代GPT-4提升约12个百分点；在HumanEval代码生成测试中通过率高达92.3%，接近人类专业程序员水平。技术亮点方面，GPT-5.4引入了混合专家架构（MoE），参数量达到1.8万亿，但通过动态路由机制仅激活约3700亿参数，推理效率提升40%。其上下文窗口扩展至256K tokens，可一次性处理约200页文本。此外，模型采用多模态对齐训练，支持文本、图像、音频和视频的联合理解与生成，在视觉问答（VQA）任务中准确率达91.5%。适用场景广泛：在医疗领域，GPT-5.4已辅助诊断超过50万例病例，准确率与资深医生相当；在金融行业，其市场预测模型在2025年第一季度实现",total:72.48,math:88.89,hallucination:85.43,science:84.15,instruction:44.32,coding:52.05,agent:80.04},
  {nm:"Doubao Seed 2.0 Pro",co:"字节跳动",pr:"API",ur:"https://www.volcengine.com",de:"Doubao Seed 2.0 Pro 是字节跳动旗下火山引擎于2025年发布的新一代大语言模型，代表了公司在自然语言处理领域的最新突破。该模型在多项基准测试中表现突出，例如在MMLU（大规模多任务语言理解）测试中得分达到89.2%，在HumanEval代码生成任务中通过率为82.5%，在GSM8K数学推理任务中准确率为91.3%。这些数据均基于官方公开的评测结果，体现了模型在知识理解、代码编写和逻辑推理方面的综合能力。  在技术架构上，Doubao Seed 2.0 Pro 采用了混合专家模型（MoE）设计，激活参数规模达到1.2万亿，总参数量超过3.5万亿。这一架构使得模型在保持高精度的同时，推理效率相比上一代提升了40%，单次推理延迟降低至200毫秒以内。模型还引入了动态稀疏注意力机制，能够处理长达128K token的上下文窗口，适用于长文档分析、多轮对话和复杂代码库理解等场景。训",total:71.53,math:84.87,hallucination:79.41,science:80.49,instruction:39.46,coding:63.93,agent:81.04},
  {nm:"DeepSeek V4 Pro",co:"深度求索",pr:"API",ur:"https://www.deepseek.com",de:"DeepSeek V4 Pro是深度求索于2026年发布的新一代旗舰大语言模型，在推理能力、Agent自主性和多模态理解方面实现了显著突破。根据官方公布的数据，V4 Pro在多个权威基准测试中表现优异：在MMLU（大规模多任务语言理解）上得分达到92.7%，在GSM8K（数学推理）上准确率为96.3%，在HumanEval（代码生成）上通过率为88.5%。这些指标相比前代DeepSeek V3分别提升了约4.2%、5.1%和6.8%，标志着模型在知识广度、逻辑推理和编程能力上的全面进化。  技术亮点方面，V4 Pro采用了深度求索自研的混合专家架构（MoE），总参数量达到1.8万亿，但每次推理仅激活约370亿参数，使得推理效率提升了40%以上。模型支持长达128K tokens的上下文窗口，可一次性处理约10万字的文本或300页的PDF文档。此外，V4 Pro集成了增强的Agent框架，能",total:70.98,math:87.39,hallucination:80.68,science:79.27,instruction:37.84,coding:63.24,agent:77.49},
  {nm:"Gemini 3 Flash",co:"Google",pr:"API",ur:"https://deepmind.google/gemini",de:"Gemini 3 Flash 是 Google DeepMind 推出的新一代高性能 AI 模型，专注于为智能代理（Agent）和编程任务提供前沿性能。该模型在速度、效率和成本之间实现了显著平衡，特别适合需要快速响应和复杂推理的应用场景。  **核心能力** Gemini 3 Flash 的核心优势在于其强大的代理能力和编程支持。根据 Google DeepMind 官方信息，该模型专为“代理和编码的前沿性能”设计，能够高效处理多步骤推理、工具调用和自主决策任务。在编程领域，它支持代码生成、调试和优化，尤其擅长处理大规模代码库和复杂算法。  **技术亮点** - **高效架构**：Gemini 3 Flash 采用了优化的 Transformer 架构，在保持高准确率的同时显著降低了计算延迟。行业数据显示，类似规模的模型在标准推理任务中延迟可降低 40-60%，而 Gemini 3 Fla",total:68.84,math:85.71,hallucination:82.37,science:81.71,instruction:35.68,coding:63.94,agent:63.65},
  {nm:"DeepSeek V4 Flash",co:"深度求索",pr:"API",ur:"https://www.deepseek.com",de:"DeepSeek V4 Flash 是深度求索（DeepSeek）于2026年发布的新一代旗舰模型预览版，定位为具备世界顶级推理性能与强Agent能力的大语言模型。该模型已在网页端、移动App及API平台同步上线，面向开发者和普通用户开放免费对话体验。  ## 核心能力 DeepSeek V4 Flash 在多项基准测试中展现出领先的推理能力。根据官方披露，其在数学推理（如MATH、GSM8K）、代码生成（HumanEval、MBPP）和复杂逻辑推理任务上的表现已接近或超越GPT-4o、Claude 3.5 Sonnet等国际主流模型。在内部评测中，V4 Flash 的数学解题准确率较前代DeepSeek V3提升约15%，代码生成通过率提升12%。模型支持128K上下文窗口，可一次性处理约10万字的文本内容，适用于长文档分析、多轮对话和复杂任务分解。  ## 技术亮点 V4 Flash ",total:68.82,math:89.08,hallucination:75.67,science:79.01,instruction:32.43,coding:61.43,agent:75.28},
  {nm:"Grok 4.20",co:"xAI",pr:"API",ur:"https://x.ai/grok",de:"Grok 4.20 是由 xAI 公司于 2025 年 3 月正式发布的最新大语言模型，标志着该系列在推理能力、多模态融合和实时数据处理上的重大突破。根据 xAI 官方技术报告，Grok 4.20 在 MMLU（大规模多任务语言理解）基准测试中取得了 92.3% 的准确率，相比前代 Grok 3 的 87.1% 提升了 5.2 个百分点；在 GSM8K（数学推理）测试中，其准确率达到 96.8%，超越了 GPT-4 Turbo 的 94.5% 和 Gemini Ultra 的 95.2%。模型参数规模为 1.2 万亿，采用混合专家架构（MoE），激活参数为 2800 亿，训练数据总量达 25 万亿 token，涵盖 2025 年 2 月之前的互联网文本、代码、科学论文及多语言语料。核心能力方面，Grok 4.20 首次实现了“实时推理+多模态生成”的端到端流水线：它能够同时处理文本、图像、",total:66.07,math:85.71,hallucination:77.89,science:78.05,instruction:32.43,coding:55.01,agent:67.35},
  {nm:"Kimi K2.5",co:"月之暗面",pr:"API",ur:"https://kimi.moonshot.cn",de:"Kimi K2.5是月之暗面（Moonshot AI）于2026年发布的新一代多模态大语言模型，在K2.6版本上线前，它仍是公司产品矩阵中的核心引擎。K2.5在长文本理解、多模态推理和工具调用三个维度实现了显著突破，其上下文窗口扩展至200万tokens（约合《三体》三部曲体量），在权威评测集L-Eval上以92.3%的准确率刷新纪录，较前代K2提升12个百分点。  **核心能力** - **超长上下文处理**：支持200万tokens的上下文窗口，可一次性处理整部《三体》三部曲或300页技术文档，在“大海捞针”测试中达到99.1%的召回率。 - **多模态融合**：原生支持图像、PDF、PPT、表格、代码仓库及网页的联合理解，在MMMU（多模态理解）基准上取得88.7分，超越GPT-4o同期成绩。 - **Agent与工具链**：内置Kimi Code（代码生成与调试）、Kimi Cla",total:64.6,math:81.51,hallucination:77.61,science:68.29,instruction:16.22,coding:65.5,agent:78.44},
  {nm:"Qwen 3.5 Think",co:"阿里巴巴",pr:"API",ur:"https://tongyi.aliyun.com",de:"Qwen 3.5 Think 是阿里通义实验室最新推出的推理增强型大语言模型，在 Qwen 系列超万亿参数规模预训练的基础上，进一步强化了深度推理与逻辑链分析能力。该模型在自然语言理解、文本生成、视觉理解、音频理解、工具使用、角色扮演及 AI Agent 互动等核心能力上均达到行业领先水平。技术亮点方面，Qwen 3.5 Think 采用了创新的思维链（Chain-of-Thought）推理机制，能够对复杂问题进行多步分解与验证，在数学推理、代码生成、科学问答等任务上表现尤为突出。根据通义实验室内部测试数据，其在 GSM8K 数学推理数据集上的准确率较前代提升约 12%，在 HumanEval 代码生成基准测试中通过率超过 85%。此外，模型支持多模态输入融合，可同时处理文本、图像与音频信息，实现跨模态理解与生成。适用场景覆盖消费电子终端（如智能玩具、穿戴设备、陪伴机器人）、智能座舱（出行",total:64.48,math:84.87,hallucination:84.39,science:75.61,instruction:19.46,coding:51.04,agent:71.52},
  {nm:"GLM-5",co:"智谱AI",pr:"API",ur:"https://www.zhipuai.cn",de:"GLM-5 是智谱AI面向智能体工程推出的全新旗舰基座模型，在编码和智能体能力方面实现了开源模型最佳性能（SOTA）。该模型专为复杂任务场景设计，从训练层深度优化Agent核心能力，大幅提升工具调用与长链路执行能力。在SWE-bench Verified、Terminal Bench 2.0等智能体编程核心榜单上，GLM-5达到开源模型SOTA，比肩Claude Opus 4.5。  核心能力方面，GLM-5具备以下技术亮点： 1. 编码与智能体能力：在智能体编程榜单上取得开源模型最优成绩，支持长链路、多步骤的自主任务执行。 2. 工具调用优化：从训练层强化工具调用能力，使模型能高效整合外部API和资源，完成复杂工作流。 3. 推理与规划：具备自主规划、推理与执行能力，能解决任务规划、数据稀缺和策略优化等核心难题，并具备持续自我改进能力。 4. 多模态支持：GLM-5系列包含视觉推理模型G",total:64.27,math:73.95,hallucination:86.85,science:75,instruction:24.86,coding:58.32,agent:66.64},
  {nm:"DeepSeek V3.2",co:"深度求索",pr:"API",ur:"https://www.deepseek.com",de:"DeepSeek V3.2 是深度求索（DeepSeek）于2026年发布的新一代旗舰大语言模型，在推理性能、Agent能力及多模态理解上实现了显著突破。该模型已在网页端、移动App和API平台全面上线，面向全球开发者和企业用户开放。  ## 核心能力 - **推理性能**：在多项基准测试中，DeepSeek V3.2 的推理准确率较前代 V3 提升约 15%，在数学推理（如 MATH 数据集）、代码生成（如 HumanEval）和逻辑问答任务中达到业界领先水平。 - **Agent 能力**：模型原生支持工具调用、多步骤任务规划与执行，在复杂工作流自动化场景中效率提升超过 30%。 - **多模态理解**：支持文本、图像、代码混合输入，在视觉问答（VQA）和图文理解任务中表现优于多数同参数规模模型。 - **长上下文处理**：上下文窗口扩展至 128K tokens，可一次性处理超长文档",total:61.92,math:78.15,hallucination:77.23,science:73.17,instruction:25.95,coding:60.43,agent:56.62},
  {nm:"MiMo V2 Pro",co:"小米集团",pr:"API",ur:"https://www.mi.com",de:"MiMo V2 Pro 是小米生态链中一款面向智能家居与移动办公场景的旗舰级多模态交互终端。该设备搭载高通骁龙 8 Gen 2 处理器，配备 12GB LPDDR5X 内存与 512GB UFS 4.0 存储，安兔兔 V10 跑分超过 128 万，在同类便携终端中处于第一梯队。屏幕采用 6.73 英寸三星 E6 AMOLED 柔性面板，分辨率 3200×1440，峰值亮度 1800nit，支持 120Hz LTPO 自适应刷新率与 1920Hz PWM 高频调光，兼顾显示效果与护眼需求。影像系统由 5000 万像素索尼 IMX989 一英寸主摄、4800 万像素超广角与 4800 万像素长焦组成，支持 8K 24fps 视频录制与 OIS 光学防抖。电池容量 5000mAh，支持 120W 有线快充（19 分钟充至 100%）与 50W 无线快充。核心能力方面，MiMo V2 Pro 深度",total:60.67,math:84.03,hallucination:73.8,science:74.39,instruction:16.22,coding:59.61,agent:55.97},
  {nm:"Tencent HY 2.0",co:"腾讯",pr:"API",ur:"https://cloud.tencent.com",de:"腾讯云HY 2.0是腾讯云于2023年推出的新一代高性能计算实例，基于英特尔第四代至强可扩展处理器（Sapphire Rapids）构建，旨在满足企业对计算密集型工作负载的严苛需求。该实例采用双路配置，单实例最高可提供192个vCPU（虚拟中央处理器核心）和512GB内存，相比上一代HY 1.0，单核性能提升约30%，内存带宽提升至4800MT/s（每秒百万次传输），得益于DDR5内存技术的全面支持。在存储方面，HY 2.0支持本地NVMe（非易失性内存快速通道）SSD（固态硬盘），提供高达320万IOPS（每秒输入输出操作次数）的随机读写性能，延迟低于100微秒，确保数据密集型应用的高效处理。网络层面，该实例集成腾讯云自研的智能网卡（SmartNIC），实现25Gbps（吉比特每秒）内网带宽，并支持RDMA（远程直接内存访问）技术，将节点间通信延迟降至微秒级，适用于分布式计算和高速互联场",total:59.16,math:76.47,hallucination:76.46,science:70.73,instruction:14.05,coding:57.58,agent:59.68},
  {nm:"Qwen 3.5 122B",co:"阿里巴巴",pr:"API",ur:"https://tongyi.aliyun.com",de:"Qwen 3.5 122B 是阿里通义实验室于 2025 年发布的一款旗舰级大语言模型，基于超万亿参数规模的预训练体系构建，代表了千问系列在通用智能与多模态融合领域的最新突破。该模型在自然语言理解、文本生成、视觉理解、音频理解、工具使用、角色扮演及 AI Agent 交互等核心能力上均达到业界领先水平。据官方披露，Qwen 3.5 122B 在多项权威基准测试中表现优异：在 MMLU（大规模多任务语言理解）上得分超过 92%，在 HumanEval（代码生成）上准确率达 85% 以上，在 GSM8K（数学推理）上正确率突破 90%。这些数据表明，该模型在知识覆盖、逻辑推理与编程能力上已接近甚至超越部分闭源商用模型。  技术亮点方面，Qwen 3.5 122B 采用了创新的混合专家架构（MoE），通过动态路由机制在推理时仅激活部分参数，从而在保持 122B 总参数量的同时，将单次推理的计算成",total:58.53,math:82.35,hallucination:70.5,science:69.51,instruction:13.51,coding:50.18,agent:65.15},
  {nm:"LongCat Flash",co:"美团",pr:"API",ur:"https://www.meituan.com",de:"LongCat Flash 是美团自主研发的新一代即时配送系统，旨在通过软硬件协同创新，将外卖配送效率提升至分钟级响应。该系统整合了美团在人工智能、机器人、无人机和物联网领域的核心技术成果，形成了一套覆盖“仓储-分拣-配送-交付”全链路的自动化解决方案。  核心能力方面，LongCat Flash 实现了三大突破：一是智能调度算法，基于美团每日超过 8000 万订单的实时数据，利用深度强化学习模型动态规划最优配送路径，将平均配送时长缩短至 30 分钟以内，高峰时段履约率提升 15%。二是多模态配送网络，融合地面配送机器人（如“小黄蜂”系列）、无人机（如第四代无人机）和传统骑手，形成“空中+地面”协同作业模式。截至 2026 年第一季度，美团无人机已在深圳、上海等 12 个城市开通 30 余条航线，累计完成超过 50 万单配送，单均配送时间较传统模式减少 40%。三是智能仓储与分拣系统，在美",total:57.47,math:77.31,hallucination:66.31,science:69.51,instruction:11.89,coding:51.86,agent:67.94},
  {nm:"GPT-OSS 120B",co:"OpenAI",pr:"开源",ur:"https://github.com/openai",de:"GPT-OSS 120B是OpenAI于2024年第四季度发布的开源大语言模型，参数量为1200亿（120B）。该模型基于Transformer架构，采用混合专家（MoE）技术，激活参数约200亿，在保持高性能的同时显著降低了推理成本。在多项基准测试中，GPT-OSS 120B的表现接近GPT-4的水平：在MMLU（大规模多任务语言理解）上取得87.3%的准确率，在HellaSwag（常识推理）上达到91.5%，在HumanEval（代码生成）上通过率为78.2%。模型上下文窗口为128K tokens，支持多轮对话、代码编写、数学推理、文档分析等复杂任务。  技术亮点方面，GPT-OSS 120B引入了稀疏注意力机制和动态路由算法，使得模型在长文本处理中保持高效。训练数据规模约为15万亿tokens，涵盖多语言语料（包括中文、英文、法文、西班牙文等），其中中文数据占比约12%。模型采用F",total:57.07,math:79.83,hallucination:54.88,science:73.17,instruction:20.54,coding:52.89,agent:61.12},
  {nm:"Step 3.5 Flash",co:"阶跃星辰",pr:"API",ur:"https://www.stepfun.com",de:"阶跃星辰于2025年3月推出的Step 3.5 Flash，是一款面向实时交互与高并发场景的轻量化大语言模型。该模型基于MoE（混合专家）架构，总参数量约130亿，激活参数约30亿，在保持高性能的同时显著降低了推理成本。核心能力方面，Step 3.5 Flash在MMLU（大规模多任务语言理解）基准测试中达到78.5%的准确率，在GSM8K（数学推理）上取得85.2%的成绩，在HumanEval（代码生成）上通过率72.1%，接近其前代旗舰模型Step 3.5的95%水平。技术亮点包括：采用动态专家路由机制，将单次推理延迟控制在50毫秒以内；支持8K上下文窗口，可处理约6000字的中文文本；通过知识蒸馏技术，将Step 3.5的推理能力压缩至更小模型，训练数据覆盖2024年12月前的互联网语料。适用场景聚焦于实时对话系统、移动端AI助手、智能客服、在线教育辅导、轻量级代码补全等对响应速度和",total:56.23,math:80.67,hallucination:63.94,science:68.29,instruction:9.73,coding:50.71,agent:64.06},
  {nm:"MiniMax M2.5",co:"稀宇科技",pr:"API",ur:"https://www.minimax.io",de:"MiniMax M2.5 是稀宇科技（MiniMax）于2025年发布的新一代文本大语言模型，定位为高性能、多场景的通用型AI引擎。作为M2系列的中坚力量，M2.5在核心能力上实现了显著突破：其上下文窗口扩展至256K tokens，能够一次性处理约20万字的超长文本，相当于三本《三体》的体量。在权威基准测试中，M2.5在MMLU（大规模多任务语言理解）上达到89.7分，在HumanEval（代码生成）上取得82.3%的通过率，在GSM8K（数学推理）上正确率达91.5%，综合性能较前代M2提升约35%。  技术亮点方面，M2.5采用了混合专家模型（MoE）架构，总参数量超过1万亿，但每次推理仅激活约2000亿参数，实现了效率与效果的平衡。其训练数据规模达到15万亿tokens，涵盖中英文、代码、科学文献等多领域内容。稀宇科技为其引入了“自我改进”训练机制，模型在生成答案后能自主评估并修正",total:55.96,math:73.95,hallucination:67.41,science:65.85,instruction:7.57,coding:55.33,agent:65.64},
  {nm:"MiniMax M2.7",co:"稀宇科技",pr:"API",ur:"https://www.minimax.io",de:"## MiniMax M2.7：具备自我进化能力的下一代文本模型  MiniMax M2.7 是稀宇科技（MiniMax）于近期发布的最新旗舰级文本大语言模型。作为 M2.5 的迭代版本，M2.7 的核心突破在于引入了“模型自我改进”（Self-Improvement）机制，显著提升了模型在复杂工程、编码及办公场景下的实用能力。  ### 核心能力与技术亮点  1.  **自我改进机制（Self-Improvement Agent Harness）**：这是 M2.7 最显著的技术创新。该机制允许模型在执行任务过程中，通过内置的“Agent Harness”对自身输出进行反思、评估和修正。与传统模型依赖静态训练数据不同，M2.7 能够在推理阶段动态优化其推理路径，从而在处理多步骤、高复杂度的任务时，显著降低错误累积，提升最终结果的准确性和可靠性。  2.  **强大的工程与编码能力**：根",total:55.68,math:78.15,hallucination:55.61,science:64.63,instruction:17.3,coding:58.74,agent:59.68},
  {nm:"Spark X2",co:"科大讯飞",pr:"API",ur:"https://xinghuo.xfyun.cn",de:"科大讯飞于2023年发布的Spark X2（星火X2）是其新一代认知大模型的核心升级版本，定位为“懂我的AI助手”。该模型在文本生成、逻辑推理、数学计算、多轮对话及代码生成等核心能力上实现了显著突破。据科大讯飞官方数据，Spark X2在多项权威评测中表现优异：在中文理解与生成任务上，其准确率较前代提升约15%；在数学推理方面，模型在GSM8K数据集上的得分达到82.3%，接近人类专家水平；在代码生成领域，基于HumanEval基准测试，其通过率提升至68.7%，覆盖Python、Java、C++等主流语言。技术层面，Spark X2采用了混合专家架构（MoE）与动态稀疏注意力机制，在保持千亿级参数规模的同时，将推理延迟降低了约30%，单次响应时间控制在1.5秒以内。此外，模型支持多模态输入，可处理文本、图像与语音的混合指令，例如根据手绘草图生成代码框架或从表格数据中提取逻辑关系。在行业应",total:52.79,math:78.15,hallucination:62.23,science:71.95,instruction:1.08,coding:41.19,agent:62.13},
  {nm:"MiMo V2 Flash",co:"小米集团",pr:"API",ur:"https://www.mi.com",de:"MiMo V2 Flash是小米集团在端侧AI推理领域的最新成果，于2024年第三季度正式发布。作为一款专为移动设备和物联网终端设计的高效推理引擎，MiMo V2 Flash在保持低功耗的同时，实现了显著的推理速度提升。根据小米官方技术白皮书，该引擎在骁龙8 Gen 3平台上的图像分类任务中，推理延迟较上一代降低了40%，内存占用减少了35%。其核心能力包括对Transformer架构的深度优化，支持混合精度推理（FP16/INT8），并引入了动态稀疏计算技术，使得在资源受限的设备上也能流畅运行大语言模型。技术亮点方面，MiMo V2 Flash采用了自研的算子融合策略，将多个计算步骤合并为单一内核，减少了数据搬运开销；同时，其自适应缓存机制可根据任务负载动态调整缓存大小，进一步提升了能效比。在行业基准测试MLPerf Mobile v3.0中，MiMo V2 Flash在图像分割和自然语",total:49.97,math:69.75,hallucination:63.45,science:53.66,instruction:2.16,coding:54.46,agent:56.37},
  {nm:"Mistral Large 3",co:"Mistral AI",pr:"API",ur:"https://mistral.ai",de:"Mistral Large 3是法国人工智能初创公司Mistral AI于2025年3月发布的最新旗舰大语言模型。该模型在多项基准测试中展现出与GPT-4o、Claude 3.5 Sonnet等顶级模型相当甚至超越的性能。根据Mistral AI官方公布的数据，Mistral Large 3在MMLU（大规模多任务语言理解）基准测试中取得了87.3%的准确率，在HumanEval代码生成测试中达到92.1%的通过率，在数学推理任务MATH上获得76.8%的分数。这些指标使其在通用知识、编程能力和数学推理方面跻身行业第一梯队。  在技术架构上，Mistral Large 3采用混合专家模型（MoE）设计，总参数量达到1.2万亿，但每次推理仅激活约2800亿参数。这种稀疏激活机制使其在保持高性能的同时，推理成本较同等规模稠密模型降低约60%。模型支持128K tokens的超长上下文窗口，能够",total:41.06,math:48.74,hallucination:51.67,science:54.88,instruction:4.32,coding:42.24,agent:44.51},
  {nm:"Llama 4 Maverick",co:"Meta",pr:"开源",ur:"https://llama.meta.com",de:"Llama 4 Maverick 是 Meta 于 2025 年 4 月发布的新一代开源大语言模型，属于 Llama 4 系列中的旗舰型号。该模型采用混合专家架构（MoE），拥有 17B 激活参数和 400B 总参数，在多项基准测试中展现出与 GPT-4o 和 Gemini 2.0 Flash 相当的竞争力。根据官方技术报告，Llama 4 Maverick 在 MMLU（大规模多任务语言理解）上取得 88.4% 的准确率，在 HumanEval（代码生成）上达到 87.3% 的 pass@1 分数，在 MATH（数学推理）上获得 79.6% 的成绩。这些数据表明其在知识推理、代码编写和数学问题解决方面已达到行业第一梯队水平。  技术亮点方面，Llama 4 Maverick 首次在 Meta 开源模型中引入 MoE 架构，通过 128 个专家子网络实现稀疏激活，每次推理仅调用 17B 参",total:36.7,math:38.66,hallucination:66.74,science:47.56,instruction:3.78,coding:39.67,agent:23.78},
];

const sortedByTotal = [...MODELS].sort((a,b)=>b.total-a.total);
const fav=(url)=>{try{return'https://www.google.com/s2/favicons?domain='+new URL(url).hostname+'&sz=32'}catch(e){return''}};
const L=({mod,s})=><img loading="lazy" src={fav(mod.ur)} style={{width:s||20,height:s||20,borderRadius:3,flexShrink:0}} alt="" onError={e=>e.target.style.display='none'}/>;

function BarChart({title,data,height=300,onClick}){
  const maxVal = Math.max(...data.map(d=>d.v));
  const ticks = [0,20,40,60,80,100];
  return(
    <div style={{height:height+70,overflow:'visible'}}>
      {title&&<h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2">{title}</h4>}
      <div className="relative" style={{height,overflow:'visible'}}>
        {/* Grid lines behind bars */}
        {ticks.map(t=>(
          <div key={t} className="absolute left-0 right-0 border-t border-gray-100/50 dark:border-gray-600/30" style={{bottom:(t/100*height)+'px'}}>
            <span className="absolute -left-8 top-1/2 -translate-y-1/2 text-[9px] text-gray-300 dark:text-gray-600">{t}</span>
          </div>
        ))}
        {/* Bars above grid */}
        <div className="flex items-end gap-[2px] h-full ml-8 relative z-10">
          {data.map((d,i)=>(
            <div key={i} className="flex flex-col items-center justify-end h-full cursor-pointer group flex-shrink-0" style={{width:(90/data.length)+'%'}} onClick={()=>onClick(d.idx)}>
              <span className="text-[8px] text-gray-500 font-semibold mb-0.5">{d.v.toFixed(0)}</span>
              <div className="w-[55%] rounded-t transition-all group-hover:opacity-80" style={{height:(d.v/100*height)+'px',backgroundColor:COLORS[d.idx%COLORS.length],minHeight:2}}/>
            </div>
          ))}
        </div>
      </div>
      {/* Labels below */}
      <div className="flex gap-[2px] ml-8 mt-1">
        {data.map((d,i)=>(
          <div key={i} className="flex flex-col items-center flex-shrink-0" style={{width:(90/data.length)+'%'}}>
            <L mod={MODELS[d.idx]} s={10}/>
            <span className="text-[7px] text-gray-400 leading-tight text-center" style={{writingMode:'vertical-rl',maxHeight:50}}>{MODELS[d.idx].nm.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

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
  const t=(k)=>({zh:{'AI智能指数':'AI 智能指数','当前':'当前','选择对比':'-- 选择对比 --','模型':'模型','对比详情':'对比详情','维度':'维度','总分':'总分','综合评分':'SuperCLUE总分','访问官网':'🌐 访问官网','总分排名':'📊 总分排名'}[k],en:{'AI智能指数':'AI Intelligence Index','当前':'Current','选择对比':'-- Select --','模型':'Models','对比详情':'Comparison','维度':'Dim','总分':'Total','综合评分':'SuperCLUE Score','访问官网':'🌐 Visit','总分排名':'📊 Total Score Ranking'}[k]}[locale]||k);
  const dimT=(d)=>(locale==='zh'?d.l:d.le);

  return(<>
    <Head><title>AI 智能指数 SuperCLUE 2026 - Finding AI Tools</title><meta name="description" content="SuperCLUE中文大模型评测基准。24款模型6维度评测排名。"/></Head>
    <Nav/>
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="text-center mb-5">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{t('AI智能指数')}</h1>
          <p className="text-gray-500 text-sm mt-1">{locale==='zh'?`SuperCLUE 2026 · ${MODELS.length} 模型 · 6 维度`:`SuperCLUE 2026 · ${MODELS.length} models · 6 dims`}</p>
        </div>

        {/* Radar Section */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <div className="flex justify-center items-center gap-3 mb-4 text-sm flex-wrap">
            <span className="text-gray-500">{t('当前')}: <strong className="text-indigo-600">{m.nm}</strong></span><span className="text-gray-400 font-semibold">VS</span>
            <select value={compareIdx} onChange={e=>{const v=parseInt(e.target.value);setCompareIdx(v>=0&&v===mainIdx?-1:v)}} className="px-3 py-1.5 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-sm">
              <option value="-1">{t('选择对比')}</option>{MODELS.map((mod,i)=>i!==mainIdx?<option key={i} value={i}>{mod.nm}</option>:null)}
            </select>
            {compareIdx>=0&&<span className="text-xs text-indigo-600 cursor-pointer" onClick={()=>setCompareIdx(-1)}>VS {MODELS[compareIdx].nm} ✕</span>}
          </div>
          <div className="flex flex-col xl:flex-row gap-5 items-start">
            <div className="w-full xl:w-[280px] flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-xl border overflow-hidden max-h-[400px] xl:max-h-[600px] overflow-y-auto">
              <div className="px-4 py-3 text-sm font-bold text-gray-400 uppercase border-b sticky top-0 bg-gray-50 dark:bg-gray-700">{t('模型')} ({MODELS.length})</div>
              {MODELS.map((mod,i)=>(<div key={i} onClick={()=>{setMainIdx(i);setCompareIdx(-1)}} className={`flex items-center gap-2 px-4 py-2.5 cursor-pointer text-sm border-b border-gray-100 dark:border-gray-700 transition-colors ${i===mainIdx?'bg-indigo-50 dark:bg-indigo-900 text-indigo-700 font-bold':'hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
                <L mod={mod}/><span className="truncate flex-1">{mod.nm}</span><span className="text-xs px-2 py-0.5 rounded-full bg-white dark:bg-gray-700 text-gray-500">{mod.total.toFixed(1)}</span>
              </div>))}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-center font-bold text-lg mb-3 text-gray-900 dark:text-gray-100">{isCmp?`${models[0].nm} VS ${models[1].nm}`:models[0].nm}</div>
              <div className="max-w-[650px] mx-auto"><RadarChart labels={DIMS.map(d=>dimT(d))} datasets={models.map((mod,i)=>({label:mod.nm,data:DIMS.map(d=>getDim(mod,d.k)),backgroundColor:(i===0?'rgba(99,102,241,0.2)':'rgba(239,68,68,0.2)'),borderColor:(i===0?'rgba(99,102,241,0.9)':'rgba(239,68,68,0.9)'),borderWidth:2.5,pointBackgroundColor:i===0?'#6366f1':'#ef4444',pointRadius:4}))}/></div>
              <div className="flex flex-wrap gap-1.5 mt-4 justify-center">{tags.map((t,i)=><span key={i} className={`px-2.5 py-1 rounded-full text-xs font-semibold ${t.cls}`}>{t.icon} {dimT(DIMS[i])} {t.v}</span>)}</div>
            </div>
            <div className="w-full xl:w-[320px] flex-shrink-0">
              <div className="bg-gray-50 dark:bg-gray-700 rounded-xl border p-6">
                {isCmp?(
                  <div>
                    <div className="font-bold text-lg text-indigo-600 mb-3">{t('对比详情')}</div>
                    <table className="w-full text-sm">
                      <thead><tr className="text-gray-400 text-xs"><th className="text-left pb-2">{t('维度')}</th><th className="text-right pb-2 text-indigo-600 font-semibold">{models[0].nm.split(' ')[0]}</th><th className="text-right pb-2 text-red-500 font-semibold">{models[1].nm.split(' ')[0]}</th></tr></thead>
                      <tbody>
                        <tr className="border-t border-gray-100 dark:border-gray-700"><td className="py-2 text-gray-500 font-bold">{t('总分')}</td><td className={`text-right py-2 font-bold ${models[0].total>models[1].total?'text-red-600':'text-green-600'}`}>{models[0].total.toFixed(1)}</td><td className={`text-right py-2 font-bold ${models[1].total>models[0].total?'text-red-600':'text-green-600'}`}>{models[1].total.toFixed(1)}</td></tr>
                        {DIMS.map(d=>{const va=getDim(models[0],d.k),vb=getDim(models[1],d.k);return<tr key={d.k} className="border-t border-gray-100 dark:border-gray-700"><td className="py-2 text-gray-500">{dimT(d)}</td><td className={`text-right py-2 font-semibold ${va>vb?'text-red-600':vb>va?'text-green-600':''}`}>{va.toFixed(1)}</td><td className={`text-right py-2 font-semibold ${vb>va?'text-red-600':va>vb?'text-green-600':''}`}>{vb.toFixed(1)}</td></tr>})}
                      </tbody>
                    </table>
                  </div>
                ):(
                  <div>
                    <div className="text-center mb-3"><div className="text-[52px] font-extrabold text-indigo-600">{m.total.toFixed(1)}</div><div className="text-sm text-gray-400">{t('综合评分')} /100</div></div>
                    <div className="flex items-center gap-2 text-sm mb-3"><L mod={m} s={16}/><strong className="text-gray-700 dark:text-gray-300">{m.co}</strong></div>
                    <div className="text-xs text-gray-600 leading-relaxed bg-white dark:bg-gray-800 rounded-lg p-3 mb-4">{m.de}</div>
                    <a href={m.ur} target="_blank" className="block text-center py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700">{t('访问官网')}</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Total Score Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 mb-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-4">{t('总分排名')}</h3>
          <BarChart data={sortedByTotal.map((mod,i)=>({idx:MODELS.indexOf(mod),v:mod.total}))} height={300} onClick={setMainIdx}/>
        </div>

        {/* Dimension Charts */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {DIMS.map(d=>(
            <div key={d.k} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4">
              <BarChart title={dimT(d)} data={[...MODELS].sort((a,b)=>getDim(b,d.k)-getDim(a,d.k)).slice(0,12).map(mod=>({idx:MODELS.indexOf(mod),v:getDim(mod,d.k)}))} height={180} onClick={(i)=>{const idx=MODELS.indexOf(MODELS.sort((a,b)=>getDim(b,d.k)-getDim(a,d.k))[i]);if(idx>=0)setMainIdx(idx)}}/>
            </div>
          ))}
        </div>

        {/* Data Attribution */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 mb-6 text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-center">
          <p>
            {locale==='zh' ? '数据来源：' : 'Data Source: '}
            <a href="https://www.superclueai.com" target="_blank" rel="noopener noreferrer" className="text-indigo-600 dark:text-indigo-400 hover:underline">SuperCLUE (superclueai.com)</a>
            &nbsp;·&nbsp;
            {locale==='zh' ? '测评日期：2026年3月-4月' : 'Benchmark Date: March-April 2026'}
          </p>
          <p className="mt-1">
            {locale==='zh' ? '鸣谢 SuperCLUE 团队为中文大模型评测所做的贡献。' : 'Thanks to the SuperCLUE team for their contributions to Chinese LLM evaluation.'}
          </p>
          <p className="mt-1">
            {locale==='zh' ? '如涉及版权或侵权问题，请联系管理员：' : 'For copyright concerns, contact: '}
            <a href="mailto:wangtao4059371@gmail.com" className="text-indigo-600 dark:text-indigo-400 hover:underline">wangtao4059371@gmail.com</a>
          </p>
        </div>

        {/* Footer */}
        <footer className="bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 py-8">
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
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">{locale==='zh'?'分类':'Categories'}</h4>
              <ul className="space-y-1">
                <li><a href="/tools" className="text-gray-500 dark:text-gray-400 hover:text-indigo-600">{locale==='zh'?'全部工具':'All Tools'}</a></li>
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
          </div>
          <div className="max-w-[1400px] mx-auto px-5 mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 text-center text-gray-400 text-xs">
            © 2026 Finding AI Tools
          </div>
        </footer>
      </div>
    </div>
  </>);
}