---
title: "Claude Code vs Codex 终极对比：开发者实测报告 2026"
date: "2026-05-21"
excerpt: "基于数月实测，从任务完成跨度、Token效率、生态粘性到RAG Pipeline案例，深度对比Claude Code与Codex。结论：没有绝对错误的选择，但Anthropic生态和100美元中档让Claude Code更香。"
excerpt_en: "Based on months of real-world testing, this deep dive compares Claude Code vs Codex across task completion horizons, token efficiency, ecosystem stickiness, and a RAG pipeline case study. Verdict: no wrong choice, but Anthropic's ecosystem and $100 tier tip the scale."
category: "AI编程"
cover: ""
source: "https://zhuanlan.zhihu.com/p/2015111659312662474"
---

## Opus 4.6 vs GPT-5.3-Codex：任务完成时间跨度

Codex 和 Claude Code 的核心差异在于**任务完成时间跨度**——模型能以一定可靠性完成多长的任务（按人类专家时间衡量）。Opus 4.6 在 50% 成功率下能处理 12 小时的任务，而 GPT-5.3-Codex 仅 5 小时 50 分钟。80% 成功率时差距缩小，但模型能力差距确实存在，并直接映射到两个 agent 处理困难任务的能力上。

![任务完成时间跨度对比](/blog/img_01.webp)

## 速度 vs 可靠性

Claude 更快是共识，但编程 agent 是长期协作。一个 agent 快一半但需要你花 10 分钟调试，另一个慢点但零返工——后者更值。这不是说谁更容易犯错，而是评估时要记住：速度不是唯一指标。

## 任务类型决定表现

两者表现高度依赖任务类型。AI 工程任务中可能一个更强，Web 开发中另一个被吊打。低级编程该用哪个尚不明确。理想做法是在简单可验证环境中先测试，但每月花 300-400 美元双持不现实。

## 诞生背景

Claude Code 最初是 @bcherny 的副业项目，2025 年 2 月 24 日以研究预览版发布，用 Claude 3.7 Sonnet。OpenAI 的 Codex CLI 2025 年 4 月 16 日首发，最新版 GPT-5.3-Codex（2026 年 2 月 5 日）被 OpenAI 称为“第一个参与创造自己的模型”。

## 技术栈

Claude Code 用 TypeScript + React + Ink，打包为 Bun 可执行文件（Anthropic 2025 年 12 月收购 Bun 为此）。Codex CLI 用 Rust，追求性能与可移植性，甚至挖来了 Ratatui 维护者。两个 CLI 都是模型薄壳，但 Claude Code 偶有小故障。

## Token 效率差距

Morphism 评测显示：**相同任务 Claude Code 比 Codex 多消耗 3.2–4.2 倍 Token**。做 Figma 插件，Codex 用 150 万 Token，Claude 用 620 万。这意味着 Claude 订阅更容易撞 Token 上限。

![Token 效率对比](/blog/img_02.webp)

## 使用体验

开发者普遍描述：Claude 像高级工程师，边干边问、展示推理；Codex 像承包商，丢任务取结果。但如果你在 AGENTS.md 里明确要求，两者行为差异会大幅缩小。区别存在，但没 X 上吹得那么夸张。

## 快速数据

VS Code Marketplace：Claude Code 610 万安装量，4/5 分；Codex 540 万，3.5/5 分。GitHub 星数：Claude Code 约 65-72K，Codex 约 64K。

![GitHub Stars 对比](/blog/img_03.webp)

## 为什么我换回 Claude Code

### Anthropic 生态拉力

选哪个不只是编程问题，等于订阅整个生态。Claude 正变成像 Apple 一样火热的生态——Claude Cowork、Chat、Code 三件套。OpenAI 这边除了 Codex 都挺无聊。我已用 Claude Chat 替代 ChatGPT，没动力迁移。

![生态对比](/blog/img_04.webp)

### 价格

入门都是 20 美元/月。Claude Code 有 100 美元中档（Max 5x），Codex 从 20 直接跳到 200。**Claude Code 实际上更便宜**，允许选够用的档。

## 技能与插件

技能兼容，但大多数技能中心以 Claude Code 命名。Codex 插件支持刚起步。不过很多开发者（包括我）**根本不用插件**。

## RAG Pipeline 案例研究

我让两个 agent 搭建论文问答 RAG pipeline：取论文、提取文本、分块、embedding、检索、用 llama-3.1-8b-instant 生成答案。

### 实现差异

- **向量存储**：Claude 选 ChromaDB，Codex 选 FAISS（更底层、更省内存）
- **分块**：Claude 用递归字符分割（目标 1000 字符，200 重叠），Codex 用句子级词分割（最多 220 词，40 重叠）
- **置信度**：Claude 用单一 L2 距离阈值，Codex 用多标准三档
- **代码架构**：Claude 扁平函数，Codex OOP 类 + argparse CLI，工程化程度更高

### 结果

100 道题中，Claude Code 赢 42 道，Codex 赢 33 道，25 道平手。Claude 赢主要因为置信度阈值更松、生成温度稍高（0.2 vs 0.1）。

![对比结果](/blog/img_05.webp)

## 选一个吧

**没有绝对错误的选择**。我的两大因素：Anthropic 生态 + 100 美元中档。即使升到 200 美元档，仍会选 Claude Code。

最重要的是你用这些工具做什么、怎么用。建议先试两个的 20 美元版本，用相关编程领域测试。记住：格局几个月一变，现在喜欢的三个月后可能漂移。

---

## English Version

## Opus 4.6 vs GPT-5.3-Codex: Task Completion Horizon

The core difference between Codex and Claude Code lies in **task completion time horizon**—how long a task a model can reliably complete (measured in human expert time). Opus 4.6 handles 12-hour tasks at 50% success rate, while GPT-5.3-Codex only manages 5 hours 50 minutes. The gap narrows at 80% success rate, but the model capability difference is real and directly maps to how these two agents handle difficult tasks.

## Speed vs Reliability

Claude is known to be faster, but coding agents are about **long-term** collaboration. An agent that's half as fast but requires 10 minutes of debugging is worse than one that's slower but zero rework. This isn't about which makes more mistakes—just keep this in mind when evaluating speed claims.

## Task Type Matters

Performance is highly task-dependent. One may dominate AI engineering tasks while getting crushed in web development. Which is better for low-level programming is unclear. Ideally test both in simple verifiable environments before going all-in, but spending $300-400/month on both isn't realistic.

## Origins

Claude Code started as @bcherny's side project, released as research preview on Feb 24, 2025 with Claude 3.7 Sonnet. OpenAI's Codex CLI launched April 16, 2025; the latest GPT-5.3-Codex (Feb 5, 2026) is called "the first model that helped create itself."

## Tech Stack

Claude Code: TypeScript + React + Ink, packaged as Bun executable (Anthropic acquired Bun in Dec 2025 for this). Codex CLI: Rust, prioritizing performance and portability—they even hired Ratatui's maintainer. Both are thin shells around models via API, though Claude Code has minor glitches.

## Token Efficiency Gap

Morphism benchmark: **Claude Code consumes 3.2–4.2x more tokens than Codex for the same task**. Building a Figma plugin: Codex used 1.5M tokens, Claude 6.2M. This means Claude subscriptions hit token limits faster.

## User Experience

Developers describe: Claude as a senior engineer who asks questions and shows reasoning; Codex as a contractor—drop task, come back for results. But if you specify requirements in AGENTS.md, behavior differences shrink significantly. The gap exists but isn't as dramatic as X makes it seem.

## Quick Stats

VS Code Marketplace: Claude Code 6.1M installs, 4/5 stars; Codex 5.4M, 3.5/5. GitHub stars: Claude Code ~65-72K, Codex ~64K.

## Why I Switched Back to Claude Code

### Anthropic Ecosystem Pull

Choosing between them means subscribing to an entire ecosystem. Claude is becoming an Apple-like ecosystem—Claude Cowork, Chat, Code. OpenAI feels fragmented beyond Codex. I already use Claude Chat over ChatGPT, so switching back was easy.

### Pricing

Both start at $20/month. Claude Code has a $100 mid-tier (Max 5x); Codex jumps from $20 to $200. **Claude Code is effectively cheaper** with a usable middle option.

## Skills & Plugins

Skills are compatible, but most skill hubs are Claude Code-named. Codex plugin support is nascent. Many developers (including me) **don't use plugins at all**.

## RAG Pipeline Case Study

I had both agents build a paper Q&A RAG pipeline: extract text, chunk, embed, retrieve, generate answers with llama-3.1-8b-instant.

### Implementation Differences

- **Vector store**: Claude chose ChromaDB, Codex chose FAISS (lower-level, more memory-efficient)
- **Chunking**: Claude used recursive character split (target 1000 chars, 200 overlap); Codex used sentence-level word split (max 220 words, 40 overlap)
- **Confidence**: Claude used single L2 distance threshold; Codex used multi-criteria three-tier system
- **Code architecture**: Claude flat functions; Codex OOP classes + argparse CLI, more production-ready

### Results

Out of 100 questions: Claude Code won 42, Codex won 33, 25 ties. Claude's win was mainly due to looser confidence threshold and slightly higher generation temperature (0.2 vs 0.1).

## Make Your Choice

**There's no wrong choice.** My two factors: Anthropic ecosystem + $100 tier. Even at $200/month, I'd stay with Claude Code.

What matters most is what you build and how you use these tools. Try both $20 versions with your domain. Remember: the landscape changes every few months—what you like today may drift in three.
