---
title: "Google I/O 2026 重点汇总：Gemini 3.5、AI 搜索、智能眼镜与开发者工具"
title_en: "Google I/O 2026 Recap: Gemini 3.5, AI Search, Smart Glasses, and Developer Tools"
date: "2026-05-28"
updated: "2026-05-28"
excerpt: "Google I/O 2026 的主线很明确：Google 正把 Gemini 从聊天助手推进到可执行任务的智能体系统。本文梳理 Gemini 3.5 Flash、Gemini Omni、AI Search、Gemini App、Antigravity、Android XR 智能眼镜和 Flow 的核心变化。"
excerpt_en: "Google I/O 2026 was built around the agentic Gemini era. This recap covers Gemini 3.5 Flash, Gemini Omni, AI Search, the Gemini app, Antigravity, Android XR smart glasses, and Flow."
category: "AI资讯"
cover: "/blog/google-io-2026/google-io-2026-01.webp"
source: "https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/"
---

> 更新时间：2026-05-28<br/>
> 资料来源：Google 官方 I/O 2026 汇总、Sundar Pichai 主题演讲，以及 Gemini App、开发者工具、Android XR、Google Flow 等产品公告。本文基于公开资料重新整理和改写，图片来自 Google 官方博客。

Google I/O 2026 的关键词不是“又一个聊天机器人”，而是 **agentic Gemini era**：模型不只是回答问题，而是开始接任务、查信息、生成界面、操作工具，并在你允许的范围内持续跟进。

如果只看发布数量，Google 这次几乎把所有产品线都过了一遍；但如果抓主线，其实很清楚：Gemini 进入更快的模型、更主动的助手、更强的搜索入口，以及更接近现实世界的设备和创作工具。

![Google I/O 2026 主题演讲现场](/blog/google-io-2026/google-io-2026-01.webp)

## 先看大方向：Google 把 Gemini 做成系统能力

Sundar Pichai 在 I/O 2026 上给出了一组规模数据：Google 旗下已有 13 个产品超过 10 亿用户，其中 5 个超过 30 亿用户。AI Overviews 月活超过 25 亿，AI Mode 上线一年已经超过 10 亿月活，Gemini App 月活也从去年的 4 亿增长到超过 9 亿。

更关键的是模型调用规模。Google 表示，两年前每月处理 9.7 万亿 tokens，去年 I/O 时增长到约 480 万亿，而现在已经超过每月 3.2 千万亿。换句话说，Gemini 不再只是一个产品名，而是 Search、Workspace、Android、开发者平台和创作工具背后的通用能力层。

这也是本届 I/O 的核心判断：Google 不想只和 ChatGPT 比聊天体验，它更想把 AI 放进搜索框、浏览器、邮箱、文档、手机、眼镜和开发工具里。

## Gemini 3.5 Flash：速度和智能一起往前推

Google 正式发布了 Gemini 3.5 Flash。它是 Gemini 3.5 系列的第一款模型，主打在 Flash 级速度下提供接近旗舰模型的智能水平。官方称，它已经通过 Google Antigravity、Gemini API、Google AI Studio 和 Android Studio 开放。

![Gemini 3.5 Flash 发布](/blog/google-io-2026/google-io-2026-02.webp)

这次 Google 给 Gemini 3.5 Flash 的定位很直接：适合长周期、需要多步执行的智能体任务。官方列出的 benchmark 包括 Terminal-Bench 2.1、GDPval-AA 和 MCP Atlas，重点都不只是“答得对”，而是能不能计划、调用工具、修改、再迭代。

另一个信息点是 Gemini 3.5 Pro。Google 表示 Pro 版本已经在内部使用，计划下个月推出。对开发者来说，这意味着 3.5 Flash 先承担“高频、低延迟、可执行”的任务，3.5 Pro 再补复杂推理和高难度场景。

## Gemini Omni：Google 的多模态创作新核心

Gemini Omni 是这次最值得关注的模型之一。它的目标不是简单生成视频，而是“从任何输入生成任何输出”。第一阶段先从视频输出开始，后续再扩展到图像、文本等更多模态。

![Gemini Omni 多模态创作](/blog/google-io-2026/google-io-2026-03.webp)

官方强调 Omni 对物理世界的理解更强，比如重力、动能、流体动态等细节会更自然。这对视频生成很关键，因为真实感不只来自清晰度，还来自运动是否合理、场景是否连贯、角色是否稳定。

Omni 也会进入 Gemini App、Google Flow 和 YouTube Shorts Remix。普通用户可以在 Gemini App 里用对话方式改视频，创作者可以在 Flow 里反复调整镜头、角色和风格，YouTube Shorts 则会支持用户基于公开视频做 Remix。生成内容会带有 SynthID 水印，并可在 Gemini、Chrome 和 Search 等入口中验证。

## Search 变得更像“任务入口”

Search 是 Google 最重要的入口，所以这次 I/O 里 AI Search 的升级非常重。Google 表示 AI Mode 已经超过 10 亿月活，并将 Gemini 3.5 Flash 设为新的默认模型。

![AI Search 与 AI Mode](/blog/google-io-2026/google-io-2026-04.webp)

新的搜索框支持文本、图片、文件、视频和 Chrome 标签页。也就是说，用户不再只是输入关键词，而是把当前上下文直接交给 Search。Google 还在把 AI Overviews 和 AI Mode 合并成更连续的体验：先给概览，再继续追问，再回到来源链接。

更明显的变化是 Search agents。Google 先从 information agents 做起，让搜索代理持续监控某个主题、项目或任务。它会查看网页、新闻、社交内容，以及金融、购物、体育等实时数据，在信息变化时给你整理更新。

此外，Google 还展示了 Generative UI：Search 可以根据问题临时生成表格、图表、互动组件甚至小型任务面板。这个功能会借助 Antigravity 和 Gemini 3.5 Flash，在今年夏天向用户免费推出。

购物也被纳入同一套逻辑。Universal Cart 会把 Search、Gemini、YouTube、Gmail 中加入的商品放到一个购物车里，自动比价、检查兼容性，并结合 Google Wallet、优惠、会员权益来辅助决策。它不是单纯“推荐商品”，而是把搜索、比较和结账流程放到一起。

## Gemini App：从聊天助手变成主动助手

Gemini App 的更新重点是“主动”。Google 发布了 Daily Brief 和 Gemini Spark，分别对应每天的信息整理和长期任务执行。

![Gemini App 新界面与功能](/blog/google-io-2026/google-io-2026-05.webp)

Daily Brief 是一个早晨简报智能体。用户授权后，它会从 Gmail、Calendar 等连接应用里整理紧急邮件、日程和后续事项，并按优先级输出成一份可扫读的摘要。它不是单纯把邮件缩短，而是帮你判断哪些事先处理。

Gemini Spark 则更接近个人 AI 代理。它运行在 Gemini 3.5 和 Antigravity harness 上，可以在云端后台继续工作。Google 举的例子包括定期检查信用卡账单中的订阅费、整理学校通知、把会议材料合成 Google Docs，并起草项目启动邮件。

安全边界也被反复强调：Spark 由用户决定是否开启、连接哪些应用；涉及花钱、发邮件等高风险操作前，需要先征得确认。这个设计很现实，因为真正有用的 AI agent 一定会接触敏感权限。

## 开发者工具：Antigravity 成为重点

Google I/O 2026 对开发者最重要的变化，是 Antigravity 从概念走向产品矩阵。Google 发布了 Antigravity 2.0 桌面应用、Antigravity CLI、Antigravity SDK，以及面向企业的 Gemini Enterprise Agent Platform 集成。

![Google I/O 2026 开发者工具](/blog/google-io-2026/google-io-2026-06.webp)

Antigravity 2.0 是一个 agent-first 开发环境，支持多个 agent 并行处理任务，也支持动态子代理、定时任务和后台自动化。CLI 面向喜欢终端的开发者，SDK 则把同一套 agent harness 提供给自定义应用。

Gemini API 里新增的 Managed Agents 也很关键。开发者可以用一次 API 调用启动一个能推理、用工具、执行代码的 agent，并运行在隔离 Linux 环境里。它支持持久状态，也可以通过 Markdown 指令和 skills 定义自有代理。

Google AI Studio 也被增强：移动 App 可以预注册，Workspace API 能被 agent 原生调用，项目可以一键导出到 Antigravity，本地继续开发；还新增了原生 Android 支持，甚至可以连接 Play Console 发布到测试轨道。

## Android XR：智能眼镜今年秋天先从音频款开始

Google 在 Android XR 上给出了更具体的落地时间。与 Samsung、Qualcomm 合作的平台会先推出音频智能眼镜，预计今年秋天上市；显示型眼镜仍在后续阶段。

![Android XR 与智能眼镜](/blog/google-io-2026/google-io-2026-07.webp)

这类眼镜的重点不是炫技，而是“低打扰”。用户可以说 “Hey Google” 或轻触镜架唤起 Gemini，询问眼前事物、导航、发短信、接电话、总结未读消息、拍照片和视频，甚至用 Nano Banana 对照片做简单编辑。

Google 还提到实时翻译、路线中途加点、通过 Uber、Mondly 等应用完成操作，以及 Android 和 iOS 手机配对。它说明 Google 对智能眼镜的判断很清楚：先让它成为轻量、全天候、可佩戴的 Gemini 入口，再逐步走向更复杂的显示体验。

## Flow、YouTube 和内容创作工具继续扩张

Google Flow 去年还更像电影人的 AI 视频工具，今年已经扩展成更完整的创作工作室。新版本加入了 Gemini Omni、Flow Agent、更多自定义工具，以及 Flow Music 的精细编辑能力。

![Google Flow 创作工具](/blog/google-io-2026/google-io-2026-08.webp)

Flow Agent 可以在构思、生成、剪辑、对白调整等阶段参与创作。Flow Music 则支持按片段改歌词、改 beat drop、翻译歌词，或者把整首歌转换成另一种风格，同时保留旋律和结构。

移动端也开始跟进。Flow Android App 进入 beta，iOS 版即将推出；Flow Music iOS 版已可用，Android 版随后上线。YouTube 侧则继续把 Omni 引入 Shorts Remix，让用户基于已有短视频做创意改写。

## 这次 I/O 最值得记住什么

Google I/O 2026 不是单点发布会，而是一次体系化升级。Gemini 3.5 Flash 提供速度和执行能力，Gemini Omni 推进多模态创作，Search 把 AI 变成任务入口，Gemini App 开始做主动代理，Antigravity 则服务开发者把 agent 做进应用。

对普通用户来说，最先感知到的会是 Search、Gemini App 和智能眼镜。对开发者来说，重点是 Antigravity、Managed Agents、Gemini API 和 AI Studio。对内容创作者来说，Omni、Flow 和 YouTube Remix 是新的工具链。

Google 这次的核心不是“我也有 AI”，而是把 AI 放回自己的基础盘：搜索、广告、安卓、浏览器、Workspace、YouTube 和云。真正要观察的是，这些 agent 能不能在权限、安全、成本和可靠性之间找到平衡。如果能，Google 的 AI 入口会比单独一个聊天 App 更难被替代。

## 资料来源

- [Google 官方：100 things we announced at I/O 2026](https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/)
- [Sundar Pichai 主题演讲：I/O 2026: Welcome to the agentic Gemini era](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/)
- [Gemini App 更新：The Gemini app becomes more agentic](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/)
- [开发者工具：Building the agentic future](https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/)
- [Android XR：Intelligent eyewear is coming this fall](https://blog.google/products-and-platforms/platforms/android/android-xr-io-2026/)
- [Google Flow 更新](https://blog.google/innovation-and-ai/models-and-research/google-labs/flow-updates/)

---

## English Version

> Updated: 2026-05-28<br/>
> Sources: Google's official I/O 2026 announcement roundup, Sundar Pichai's keynote transcript, and product updates for the Gemini app, developer tools, Android XR and Google Flow. This article has been rewritten and reorganized for Finding AI Tools. Images are from the official Google Blog.

The key phrase at Google I/O 2026 was not "another chatbot." It was the **agentic Gemini era**. Google wants Gemini to answer less like a static assistant and act more like a task system: searching, checking context, creating interfaces, calling tools and following through when users allow it.

The volume of announcements was large, but the direction was simple. Google is pushing Gemini into faster models, more proactive assistants, a stronger Search entry point, developer agents, creative tools and devices that sit closer to the real world.

![Google I/O 2026 keynote stage](/blog/google-io-2026/google-io-2026-01.webp)

## The Big Picture: Gemini Becomes a System Layer

Sundar Pichai shared several scale numbers during the keynote. Google now has 13 products with more than 1 billion users each, and five products with more than 3 billion users. AI Overviews has more than 2.5 billion monthly active users, AI Mode passed 1 billion monthly active users within a year, and the Gemini app grew from 400 million monthly active users last year to more than 900 million.

The token numbers are even more revealing. Google says it processed 9.7 trillion tokens per month two years ago, around 480 trillion at last year's I/O, and more than 3.2 quadrillion per month today. In practice, Gemini is no longer just an app. It is becoming the shared AI layer behind Search, Workspace, Android, developer platforms and creative tools.

That explains the real theme of I/O 2026. Google does not only want to compare chat interfaces with ChatGPT. It wants AI inside the search box, browser, email, docs, phone, glasses and developer environment.

## Gemini 3.5 Flash: Faster Agentic Work

Google officially launched Gemini 3.5 Flash, the first model in the Gemini 3.5 series. It is designed to deliver Flash-level speed while approaching the intelligence level of much larger flagship models. It is available through Google Antigravity, the Gemini API, Google AI Studio and Android Studio.

![Gemini 3.5 Flash announcement](/blog/google-io-2026/google-io-2026-02.webp)

Google positioned Gemini 3.5 Flash for long-horizon agentic tasks. The official benchmarks include Terminal-Bench 2.1, GDPval-AA and MCP Atlas. The point is not just answering questions correctly; it is whether the model can plan, use tools, make changes and iterate.

Gemini 3.5 Pro is also coming. Google said the Pro model is already being used internally and is expected to roll out next month. For developers, the split is clear: 3.5 Flash handles frequent, fast and executable workloads, while 3.5 Pro should cover harder reasoning scenarios.

## Gemini Omni: A New Multimodal Creation Core

Gemini Omni is one of the most important model announcements from I/O 2026. Its long-term goal is to create any output from any input. The first release starts with video outputs, with image and text expected to follow over time.

![Gemini Omni multimodal creation](/blog/google-io-2026/google-io-2026-03.webp)

Google emphasized Omni's stronger understanding of the physical world, including gravity, kinetic energy and fluid dynamics. That matters for video generation because realism is not just about resolution. Motion, continuity and stable characters are usually what make generated video believable.

Omni is coming to the Gemini app, Google Flow and YouTube Shorts Remix. In the Gemini app, users can edit videos conversationally. In Flow, creators can iterate on scenes, characters and style. In YouTube Shorts, eligible videos can be remixed with user prompts. Generated content includes SynthID watermarking and can be verified through Gemini, Chrome and Search.

## Search Becomes a Task Entry Point

Search remains Google's most important product surface, so the AI Search upgrade matters. Google says AI Mode has already passed 1 billion monthly active users and will now use Gemini 3.5 Flash as the default model globally.

![AI Search and AI Mode](/blog/google-io-2026/google-io-2026-04.webp)

The new Search box can take text, images, files, videos and Chrome tabs. Users are no longer limited to typing keywords. They can hand Search more of the current context. Google is also blending AI Overviews and AI Mode into a more continuous experience: overview first, follow-up conversation next, and links still available for deeper reading.

The bigger shift is Search agents. Google is starting with information agents that can monitor a topic, project or task in the background. They can scan the web, news, social posts and real-time data for finance, shopping and sports, then send synthesized updates when something changes.

Google also showed Generative UI. Search can generate tables, charts, interactive components or task panels on the fly. This will be powered by Antigravity and Gemini 3.5 Flash and is planned to roll out for free this summer.

Shopping is becoming part of the same flow. Universal Cart will collect products added from Search, Gemini, YouTube and Gmail, then help compare prices, check compatibility and use Google Wallet, offers and loyalty information to guide checkout. This is less about product recommendation and more about merging search, comparison and purchase into one workflow.

## The Gemini App Gets More Proactive

The Gemini app update is about proactivity. Google introduced Daily Brief and Gemini Spark, which cover morning planning and longer-running task execution.

![Gemini app updates](/blog/google-io-2026/google-io-2026-05.webp)

Daily Brief is a morning briefing agent. Once users opt in, it can work across connected apps like Gmail and Calendar to pull urgent updates, upcoming events and follow-up items into a skimmable summary. It is not just shortening emails. It tries to help decide what deserves attention first.

Gemini Spark is closer to a personal AI agent. It runs on Gemini 3.5 and the Antigravity harness, and because it is cloud-based, it can keep working in the background. Google's examples include checking monthly credit card statements for new subscriptions, summarizing school updates and turning meeting notes into Google Docs with a draft launch email.

Google also emphasized control. Spark only works when users turn it on and choose which apps it can access. It is designed to ask before high-stakes actions such as spending money or sending emails. That boundary is important because useful agents inevitably touch sensitive permissions.

## Developer Tools: Antigravity Moves to the Center

For developers, the biggest I/O 2026 story is Antigravity becoming a real product family. Google announced Antigravity 2.0 for desktop, Antigravity CLI, Antigravity SDK and integration with the Gemini Enterprise Agent Platform.

![Google I/O 2026 developer tools](/blog/google-io-2026/google-io-2026-06.webp)

Antigravity 2.0 is an agent-first development environment. It supports multiple agents working in parallel, dynamic subagents, scheduled tasks and background automation. The CLI is for developers who prefer the terminal, while the SDK exposes the same agent harness for custom applications.

Managed Agents in the Gemini API are also important. Developers can create an agent with a single API call. The agent can reason, use tools and execute code in an isolated Linux environment. It supports persistent state and custom behavior through markdown instructions and skills.

Google AI Studio is also expanding. A mobile app is available for pre-registration, Workspace APIs can be called natively by agents, projects can be exported to Antigravity for local development, and native Android support now includes a path to publish test builds through the Play Console.

## Android XR: Smart Glasses Arrive First as Audio Glasses

Google gave Android XR a more concrete timeline. The platform, built with Samsung and Qualcomm, will first ship audio smart glasses this fall. Display glasses are still coming later.

![Android XR and smart glasses](/blog/google-io-2026/google-io-2026-07.webp)

The pitch is low-friction help. Users can say "Hey Google" or tap the frame to ask Gemini about what they see, get directions, send texts, take calls, summarize missed messages, capture photos and video, or use Nano Banana to make simple photo edits.

Google also mentioned real-time translation, adding stops to routes, using apps such as Uber and Mondly, and pairing with both Android and iOS phones. The strategy is clear: start with a lightweight, all-day Gemini entry point, then move toward richer display-based experiences later.

## Flow, YouTube and Creative Tools Keep Expanding

Google Flow was introduced last year as an AI video tool built with filmmakers in mind. This year it is becoming a broader creative studio with Gemini Omni, Flow Agent, custom tools and deeper Flow Music editing.

![Google Flow creative tools](/blog/google-io-2026/google-io-2026-08.webp)

Flow Agent can help during brainstorming, generation, editing and dialogue work. Flow Music adds more precise control, including section-level lyric edits, beat changes, translation and full-song style covers that keep the original melody and structure.

Mobile apps are also arriving. Flow for Android is entering beta, iOS is coming soon, Flow Music is available on iOS and Android support is expected to follow. YouTube is also bringing Omni into Shorts Remix so users can creatively rework eligible short videos.

## What Matters Most

Google I/O 2026 was not a single-product event. It was a system upgrade. Gemini 3.5 Flash provides speed and execution, Gemini Omni pushes multimodal creation forward, Search turns AI into a task entry point, the Gemini app becomes more proactive and Antigravity gives developers the tooling to build agents into applications.

For everyday users, the first visible changes will be Search, the Gemini app and smart glasses. For developers, the important parts are Antigravity, Managed Agents, the Gemini API and AI Studio. For creators, Omni, Flow and YouTube Remix form the new toolchain.

The real story is that Google is placing AI back into its own strongest surfaces: Search, ads, Android, Chrome, Workspace, YouTube and Cloud. The next thing to watch is whether these agents can balance permissions, safety, cost and reliability. If they can, Google's AI entry points will be harder to replace than a standalone chat app.

## Sources

- [Google: 100 things we announced at I/O 2026](https://blog.google/innovation-and-ai/technology/ai/google-io-2026-all-our-announcements/)
- [Sundar Pichai keynote: I/O 2026: Welcome to the agentic Gemini era](https://blog.google/innovation-and-ai/sundar-pichai-io-2026/)
- [Gemini app update: The Gemini app becomes more agentic](https://blog.google/innovation-and-ai/products/gemini-app/next-evolution-gemini-app/)
- [Developer tools: Building the agentic future](https://blog.google/innovation-and-ai/technology/developers-tools/google-io-2026-developer-highlights/)
- [Android XR: Intelligent eyewear is coming this fall](https://blog.google/products-and-platforms/platforms/android/android-xr-io-2026/)
- [Google Flow updates](https://blog.google/innovation-and-ai/models-and-research/google-labs/flow-updates/)
