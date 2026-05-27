---
title: "腾讯 WorkBuddy 使用教程：从安装到专家团、Skills 与自动化任务"
title_en: "Tencent WorkBuddy Guide: Installation, Skills, Expert Agents, and Automation"
date: "2026-05-27"
updated: "2026-05-27"
excerpt: "腾讯 WorkBuddy 是面向办公场景的 AI 智能体桌面工作台。本文从安装登录、任务执行、模型切换、Skills、Claw 远程控制、专家团、连接器和自动化任务完整梳理使用流程。"
excerpt_en: "A practical guide to Tencent WorkBuddy, covering installation, task execution, model selection, Skills, Claw remote control, expert agents, connectors, and scheduled automation."
category: "AI工具"
cover: "/blog/workbuddy/workbuddy-01.jpg"
source: "https://blog.csdn.net/zhangcongyi420/article/details/161335906"
---

> 更新时间：2026-05-27  
> 原文出处：[CSDN - zhangcongyi420](https://blog.csdn.net/zhangcongyi420/article/details/161335906)  
> 版权说明：原文遵循 [CC 4.0 BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) 协议。本文基于原文实操内容重新整理和改写，图片来自原文截图并按对应步骤引用。

WorkBuddy 是腾讯推出的全场景职场 AI 智能体桌面工作台。它的定位不是单纯聊天，而是让 AI 直接参与电脑上的办公流程：理解需求、拆解步骤、调用技能、操作文件，并把结果保存到本地。

如果你平时大量处理文档、表格、资料调研、邮件和周期性汇总，WorkBuddy 更像一个可以落地执行任务的桌面助手。下面按实际使用路径梳理一遍。

![WorkBuddy 桌面工作台概览](/blog/workbuddy/workbuddy-01.jpg)

## WorkBuddy 适合做什么

WorkBuddy 的核心价值在于把一句自然语言指令转成可执行任务。常见场景包括：

- 生成工作报告、技术文档、会议纪要和 README
- 分析表格数据，并输出图表或结论
- 根据材料生成 PPT、调研报告或产品文档
- 批量整理、重命名、转换本地文件
- 在编程模式下辅助理解项目、修复 Bug、生成代码
- 通过连接器访问邮箱、文档、项目管理工具等外部服务
- 将日报、周报、资讯汇总等重复任务做成自动化任务

和传统 AI 对话相比，WorkBuddy 不只给建议。它更强调“执行”：可以在授权范围内读取本地目录、生成文件、调用 Skills，最终交付一个你可以打开检查的结果。

## 下载安装

官方下载入口在 WorkBuddy 页面底部的下载区域。根据当前设备选择 Windows 或 macOS 安装包即可。

![WorkBuddy 下载入口](/blog/workbuddy/workbuddy-02.jpg)

安装过程比较直接，按提示完成下一步即可。建议第一次安装时保留默认路径，方便后续排查任务输出目录。

![WorkBuddy 安装向导](/blog/workbuddy/workbuddy-03.jpg)

![WorkBuddy 安装完成](/blog/workbuddy/workbuddy-04.jpg)

## 登录与主界面

打开 WorkBuddy 后会先进入登录页。当前主要使用微信登录，登录后即可进入工作台。

![WorkBuddy 登录页](/blog/workbuddy/workbuddy-05.jpg)

![微信扫码登录](/blog/workbuddy/workbuddy-06.jpg)

登录后的首页就是任务工作台。左侧是功能导航，中间是任务对话区，底部可以输入指令、切换模型或调用技能。

![WorkBuddy 主工作台](/blog/workbuddy/workbuddy-07.jpg)

## 用一句话发起任务

WorkBuddy 最基础的用法，就是像给同事交代需求一样描述任务。比如：

```text
请调研 2026 年 AI 办公自动化趋势，整理成 1000 字以内的报告，并保存到我指定的本地目录。
```

这类任务通常会经历“理解需求、规划步骤、调用工具、生成文件”几个阶段。执行过程中可以看到日志，方便判断它正在做什么。

![输入任务指令](/blog/workbuddy/workbuddy-08.jpg)

![任务执行日志](/blog/workbuddy/workbuddy-09.jpg)

![多技能协同执行](/blog/workbuddy/workbuddy-10.jpg)

任务完成后，结果会落到本地目录。这里是 WorkBuddy 与普通聊天工具的关键区别：不是只返回一段文字，而是尽量生成可验收的文件。

![本地生成文件结果](/blog/workbuddy/workbuddy-11.jpg)

## 模型切换

WorkBuddy 支持在对话框中切换不同 AI 模型。轻量任务可以选择速度更快的模型，复杂分析、长文档或代码类任务则适合选择推理能力更强的模型。

![WorkBuddy 模型选择](/blog/workbuddy/workbuddy-12.jpg)

实际使用时建议按任务类型选择：

- 日常问答、简单整理：优先速度
- 报告、方案、产品文档：优先稳定和长文本能力
- 代码、复杂数据分析：优先推理和工具调用能力

## Skills：把能力做成可复用模块

Skills 是 WorkBuddy 的重要能力。你可以把常用流程做成技能，也可以在技能市场安装别人做好的技能。这样高频任务不需要每次重新写一长串提示词。

![Skills 创建入口](/blog/workbuddy/workbuddy-13.jpg)

比如你经常写小红书种草笔记，就可以让 WorkBuddy 帮你创建一个专门的 Skill。以后只需要给关键词或产品描述，技能就会按固定结构生成内容。

![创建 Skill 的任务过程](/blog/workbuddy/workbuddy-14.jpg)

![Skill 生成结果](/blog/workbuddy/workbuddy-15.jpg)

## Claw：远程控制与移动端触发

Claw 可以理解为 WorkBuddy 的远程任务入口。绑定微信、企业微信、QQ、飞书或钉钉等工具后，即使你不在电脑前，也可以通过手机给 WorkBuddy 下达指令。

![Claw 远程控制入口](/blog/workbuddy/workbuddy-16.jpg)

在设置里可以配置不同通讯工具。这里的重点是：任务仍然在本地电脑执行，移动端更像远程指挥入口。

![Claw 设置面板](/blog/workbuddy/workbuddy-17.jpg)

普通任务适合本机即时操作；Claw 更适合远程触发、持续查看执行记录，或者把所有移动端指令集中到同一个任务通道里。

## 专家中心：让 AI 按角色工作

专家中心提供了预设专家和专家团。它不是简单换一个提示词，而是为不同岗位准备更明确的角色、方法论和处理流程。

![专家团入口](/blog/workbuddy/workbuddy-18.jpg)

![专家角色列表](/blog/workbuddy/workbuddy-19.jpg)

比如选择产品管理专家后，可以让它帮你规划一个员工管理系统。它会先补充提问、明确需求，再生成产品文档。

![选择产品管理专家](/blog/workbuddy/workbuddy-20.jpg)

![专家进入对话窗口](/blog/workbuddy/workbuddy-21.jpg)

![产品文档生成过程](/blog/workbuddy/workbuddy-22.jpg)

![生成的产品文档预览](/blog/workbuddy/workbuddy-23.jpg)

![浏览器打开文档结果](/blog/workbuddy/workbuddy-24.jpg)

这个功能适合需求不够明确的工作。与其直接让 AI 输出完整方案，不如先让专家角色把问题问清楚，再进入生成阶段。

## 技能市场：安装和试用现成能力

技能市场里有很多现成 Skills，适合快速扩展 WorkBuddy 的能力范围。

![技能市场](/blog/workbuddy/workbuddy-25.jpg)

以微信读书助手为例，添加后会出现在“我的技能”里。

![添加微信读书助手](/blog/workbuddy/workbuddy-26.jpg)

![我的技能列表](/blog/workbuddy/workbuddy-27.jpg)

进入技能后点击试用，就可以在对话区调用它。

![试用技能](/blog/workbuddy/workbuddy-28.jpg)

![用技能搜索书籍](/blog/workbuddy/workbuddy-29.jpg)

有些技能需要先配置 API Key 或账号权限。第一次使用前建议认真看配置说明，否则任务可能执行到一半卡住。

![技能配置 API Key](/blog/workbuddy/workbuddy-30.jpg)

## 导入本地技能

除了市场安装，WorkBuddy 也支持导入本地技能包。这个功能适合你已经沉淀了某类固定流程，比如 Excel 数据处理、内容清洗、批量重命名等。

![导入本地技能入口](/blog/workbuddy/workbuddy-31.jpg)

![本地技能包目录](/blog/workbuddy/workbuddy-32.jpg)

导入后可以直接在任务里加载这个技能。

![加载本地技能](/blog/workbuddy/workbuddy-33.jpg)

下面用 Excel 数据处理做测试：先准备一个数据文件，再让 WorkBuddy 调用本地技能进行处理。

![选择技能处理 Excel](/blog/workbuddy/workbuddy-34.jpg)

![技能执行结果](/blog/workbuddy/workbuddy-35.jpg)

处理完成后打开结果文件，可以看到数据已经按要求整理到新的表格里。

![Excel 处理后的文件](/blog/workbuddy/workbuddy-36.jpg)

## 探索：复用别人做好的成品

如果不知道从哪里开始，可以先看“探索”。这里展示了别人制作好的 WorkBuddy 成品，你可以基于现有案例快速生成自己的版本。

![WorkBuddy 探索页](/blog/workbuddy/workbuddy-37.jpg)

选择一个案例后，系统会预填 Prompt、关联 Skills 和专家配置，减少从空白页开始搭建的成本。

![复用探索案例](/blog/workbuddy/workbuddy-38.jpg)

这个功能适合新手，也适合团队内部沉淀模板。把高频流程做成成品后，其他人可以直接复制使用。

## 连接器：打通邮箱和第三方服务

连接器是 WorkBuddy 接入外部系统的桥梁。它可以把邮箱、文档、项目管理工具、网盘等服务接进 AI 工作流。

![连接器列表](/blog/workbuddy/workbuddy-39.jpg)

以 QQ 邮箱为例，点击连接器右侧的添加按钮后，会进入授权流程。

![连接 QQ 邮箱](/blog/workbuddy/workbuddy-40.jpg)

手机端扫码授权时，需要确认 WorkBuddy 申请的权限，例如读取近一个月邮件、发送邮件、获取账号信息等。涉及邮箱权限时要谨慎确认，建议只在明确需要邮件自动化时启用。

![QQ 邮箱授权页面](/blog/workbuddy/workbuddy-41.jpg)

![手机端授权成功](/blog/workbuddy/workbuddy-42.jpg)

连接成功后，QQ 邮箱卡片会显示已连接状态。此后就可以让 WorkBuddy 基于邮箱执行任务，比如汇总未读邮件、起草回复、发送通知。

![QQ 邮箱连接成功](/blog/workbuddy/workbuddy-43.jpg)

## 自动化任务：让重复工作定时执行

自动化适合周期性任务，例如每日 AI 新闻摘要、周报汇总、数据整理、定时提醒等。配置好时间和任务说明后，WorkBuddy 会按计划执行。

![自动化任务页面](/blog/workbuddy/workbuddy-44.jpg)

可以从模板开始添加任务，再根据自己的需求修改触发时间、任务描述和输出位置。

![添加自动化模板](/blog/workbuddy/workbuddy-45.jpg)

![填写自动化任务配置](/blog/workbuddy/workbuddy-46.jpg)

创建完成后，任务会出现在自动化列表里。

![自动化任务列表](/blog/workbuddy/workbuddy-47.jpg)

正式启用前建议先手动测试运行一次，确认输出内容、保存路径和调用权限都正常。

![测试运行自动化任务](/blog/workbuddy/workbuddy-48.jpg)

等待执行完成后，就能看到 AI 汇总出的结果。

![自动化任务输出结果](/blog/workbuddy/workbuddy-49.jpg)

## 使用建议

WorkBuddy 这类桌面智能体工具的能力很强，但也更依赖权限和任务边界。实际使用时建议注意几点：

- 先用低风险目录测试，不要一开始就授权大量敏感文件
- 复杂任务要明确输出格式、保存路径和验收标准
- 涉及邮箱、通讯工具、云文档等连接器时，先确认权限范围
- 高频任务适合做成 Skill 或自动化，临时任务直接用主对话即可
- 专家团适合需求不清晰的场景，普通任务适合目标明确的场景

## 总结

WorkBuddy 的方向很清晰：把 AI 从“回答问题”推进到“执行办公任务”。安装、登录、任务执行、Skills、Claw、专家团、连接器和自动化组合起来后，它已经不只是一个聊天框，而是一个围绕本地电脑和办公流程展开的 AI 工作台。

对个人用户来说，最值得先尝试的是报告生成、文件整理、表格处理和自动化摘要。对团队来说，更有价值的是把稳定流程沉淀为 Skills、专家模板和自动化任务，让 AI 能复用团队经验，而不是每个人都从零写提示词。

> 本文为改写整理版本，原始实操截图与参考内容来自 CSDN 原文：[《【AI智能体】全场景AI智能体工作台WorkBuddy实战操作详解》](https://blog.csdn.net/zhangcongyi420/article/details/161335906)。原文作者：zhangcongyi420，原文版权协议：CC 4.0 BY-SA。

---

## English Version

> Updated: 2026-05-27
> Original source: [CSDN - zhangcongyi420](https://blog.csdn.net/zhangcongyi420/article/details/161335906)
> Copyright note: the original post is published under the [CC 4.0 BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) license. This version has been rewritten and reorganized for Finding AI Tools, with screenshots retained from the original walkthrough and placed next to the relevant steps.

WorkBuddy is Tencent's desktop AI agent workspace for office scenarios. It is not positioned as a simple chatbot. The point is to let an AI agent participate directly in desktop workflows: understand a request, break it into steps, call skills, operate on local files, and save usable output back to the computer.

If your work involves documents, spreadsheets, research notes, emails, or recurring reports, WorkBuddy is closer to an executable desktop assistant than a Q&A tool. The sections below follow the actual usage path from installation to automation.

![WorkBuddy desktop workspace overview](/blog/workbuddy/workbuddy-01.jpg)

## What WorkBuddy Is Good For

WorkBuddy's core value is turning a natural-language request into an executable task. Common use cases include:

- generating work reports, technical documents, meeting notes, and README files
- analyzing spreadsheet data and producing charts or conclusions
- turning source material into slides, research reports, or product documents
- batch organizing, renaming, or converting local files
- assisting with project understanding, bug fixing, and code generation in programming mode
- connecting to email, documents, project management tools, and other external services
- turning daily summaries, weekly reports, and news digests into scheduled automation

Compared with a normal AI chat product, WorkBuddy focuses more on execution. With the right permissions, it can read local directories, generate files, call Skills, and deliver something you can inspect.

## Download and Installation

The official download entry is available on the WorkBuddy website. Choose the Windows or macOS installer according to your device.

![WorkBuddy download entry](/blog/workbuddy/workbuddy-02.jpg)

The installation process is straightforward. For a first install, keeping the default path is usually better, because it makes later troubleshooting and output directory checks easier.

![WorkBuddy installation wizard](/blog/workbuddy/workbuddy-03.jpg)

![WorkBuddy installation completed](/blog/workbuddy/workbuddy-04.jpg)

## Login and Main Interface

After opening WorkBuddy, you first land on the login screen. The current flow mainly uses WeChat login.

![WorkBuddy login page](/blog/workbuddy/workbuddy-05.jpg)

![WeChat QR code login](/blog/workbuddy/workbuddy-06.jpg)

After login, the main workspace appears. The left side contains navigation, the center is the task conversation area, and the bottom input area lets you enter instructions, switch models, or call Skills.

![WorkBuddy main workspace](/blog/workbuddy/workbuddy-07.jpg)

## Start a Task with One Sentence

The simplest way to use WorkBuddy is to describe a task the way you would explain it to a colleague. For example:

```text
Research AI office automation trends in 2026, summarize them into a report under 1,000 words, and save it to my specified local folder.
```

Tasks like this usually go through several phases: understanding the request, planning the steps, calling tools, and generating files. The execution log is useful because it shows what the agent is doing instead of hiding the process.

![Entering a task instruction](/blog/workbuddy/workbuddy-08.jpg)

![Task execution log](/blog/workbuddy/workbuddy-09.jpg)

![Multiple skills working together](/blog/workbuddy/workbuddy-10.jpg)

When the task finishes, the result is saved locally. This is the main difference from a normal chat interface: the target is not just a text answer, but an output file you can review.

![Locally generated result file](/blog/workbuddy/workbuddy-11.jpg)

## Model Switching

WorkBuddy lets you switch between different AI models in the conversation box. Lightweight tasks can use faster models, while long documents, analysis, and coding tasks are better suited to stronger reasoning models.

![WorkBuddy model selector](/blog/workbuddy/workbuddy-12.jpg)

A practical selection rule:

- daily Q&A and simple organization: prioritize speed
- reports, plans, and product documents: prioritize stability and long-context handling
- code and complex data analysis: prioritize reasoning and tool-use ability

## Skills: Turn Repeated Workflows into Reusable Modules

Skills are one of WorkBuddy's key features. You can create your own Skills for repeated workflows, or install existing Skills from the marketplace. This avoids writing a long prompt every time you do the same type of work.

![Skills creation entry](/blog/workbuddy/workbuddy-13.jpg)

For example, if you often write Xiaohongshu-style product notes, you can create a dedicated Skill. Later, you only need to provide keywords or a product description, and the Skill will generate the content using a stable structure.

![Creating a Skill through a task](/blog/workbuddy/workbuddy-14.jpg)

![Generated Skill result](/blog/workbuddy/workbuddy-15.jpg)

## Claw: Remote Control and Mobile Task Triggering

Claw is WorkBuddy's remote task entry point. After binding tools such as WeChat, WeCom, QQ, Feishu, or DingTalk, you can send instructions from your phone even when you are away from the computer.

![Claw remote control entry](/blog/workbuddy/workbuddy-16.jpg)

The settings panel lets you configure different communication tools. The key point is that tasks still run on the local computer; the mobile side works as a remote command channel.

![Claw settings panel](/blog/workbuddy/workbuddy-17.jpg)

Use the main desktop interface for immediate local work. Use Claw when you need remote triggering, ongoing task visibility, or a centralized channel for mobile instructions.

## Expert Center: Let the AI Work in a Specific Role

The Expert Center provides preset experts and expert teams. This is not just a different prompt style. It gives the agent a clearer role, methodology, and workflow for different job types.

![Expert team entry](/blog/workbuddy/workbuddy-18.jpg)

![Expert role list](/blog/workbuddy/workbuddy-19.jpg)

For example, after choosing a product management expert, you can ask it to plan an employee management system. It will first clarify requirements, then produce a product document.

![Choosing the product management expert](/blog/workbuddy/workbuddy-20.jpg)

![Expert conversation window](/blog/workbuddy/workbuddy-21.jpg)

![Product document generation process](/blog/workbuddy/workbuddy-22.jpg)

![Generated product document preview](/blog/workbuddy/workbuddy-23.jpg)

![Opening the document result in a browser](/blog/workbuddy/workbuddy-24.jpg)

This feature is useful when the requirement is still vague. Instead of asking AI to output a complete plan immediately, let the expert role ask the missing questions first, then move into generation.

## Skill Marketplace: Install and Try Existing Capabilities

The Skill marketplace contains ready-made Skills that can expand WorkBuddy quickly.

![Skill marketplace](/blog/workbuddy/workbuddy-25.jpg)

Using the WeRead assistant as an example, after adding it, the Skill appears in "My Skills."

![Adding the WeRead assistant](/blog/workbuddy/workbuddy-26.jpg)

![My Skills list](/blog/workbuddy/workbuddy-27.jpg)

After entering a Skill, click trial mode to call it in the conversation area.

![Trying a Skill](/blog/workbuddy/workbuddy-28.jpg)

![Searching books with the Skill](/blog/workbuddy/workbuddy-29.jpg)

Some Skills require an API key or account permission before first use. Read the configuration instructions carefully; otherwise, the task may stop halfway through execution.

![Skill API key configuration](/blog/workbuddy/workbuddy-30.jpg)

## Import Local Skills

In addition to marketplace installation, WorkBuddy can import local Skill packages. This is useful when you already have a stable workflow, such as Excel data processing, content cleaning, or batch renaming.

![Import local Skill entry](/blog/workbuddy/workbuddy-31.jpg)

![Local Skill package directory](/blog/workbuddy/workbuddy-32.jpg)

After importing, the Skill can be loaded directly into a task.

![Loading a local Skill](/blog/workbuddy/workbuddy-33.jpg)

The following example tests Excel data processing: prepare a spreadsheet first, then ask WorkBuddy to use the local Skill to process it.

![Selecting a Skill to process Excel](/blog/workbuddy/workbuddy-34.jpg)

![Skill execution result](/blog/workbuddy/workbuddy-35.jpg)

After completion, open the result file and check whether the data has been organized into the new spreadsheet as expected.

![Processed Excel output file](/blog/workbuddy/workbuddy-36.jpg)

## Explore: Reuse Finished Workflows from Others

If you do not know where to start, open "Explore" first. It shows finished WorkBuddy examples made by other users, which you can reuse to generate your own version.

![WorkBuddy Explore page](/blog/workbuddy/workbuddy-37.jpg)

After choosing an example, the system can prefill the Prompt, linked Skills, and expert configuration. This reduces the cost of starting from a blank workspace.

![Reusing an Explore example](/blog/workbuddy/workbuddy-38.jpg)

This is useful for beginners and for teams that want to turn repeated workflows into internal templates. Once a frequent process becomes a reusable artifact, other team members can copy it instead of rebuilding it from scratch.

## Connectors: Link Email and Third-Party Services

Connectors are the bridge between WorkBuddy and external systems. They can bring email, documents, project management tools, cloud drives, and other services into the AI workflow.

![Connector list](/blog/workbuddy/workbuddy-39.jpg)

Using QQ Mail as an example, click the add button on the connector card to enter the authorization flow.

![Connecting QQ Mail](/blog/workbuddy/workbuddy-40.jpg)

When scanning the QR code on mobile, check the requested permissions carefully, such as reading recent emails, sending emails, and accessing account information. Email permissions are sensitive, so enable them only when mail automation is genuinely needed.

![QQ Mail authorization page](/blog/workbuddy/workbuddy-41.jpg)

![Mobile authorization success](/blog/workbuddy/workbuddy-42.jpg)

After authorization, the QQ Mail card shows a connected status. From that point, WorkBuddy can perform email-based tasks such as summarizing unread messages, drafting replies, or sending notifications.

![QQ Mail connected](/blog/workbuddy/workbuddy-43.jpg)

## Automation: Run Repeated Work on a Schedule

Automation is designed for recurring tasks, such as daily AI news summaries, weekly reports, data organization, and scheduled reminders. After configuring the time and task description, WorkBuddy can run the task according to the schedule.

![Automation task page](/blog/workbuddy/workbuddy-44.jpg)

You can start from a template, then adjust the trigger time, task description, and output location.

![Adding an automation template](/blog/workbuddy/workbuddy-45.jpg)

![Filling in automation task settings](/blog/workbuddy/workbuddy-46.jpg)

After creation, the task appears in the automation list.

![Automation task list](/blog/workbuddy/workbuddy-47.jpg)

Before enabling it for regular use, run a manual test once. Confirm that the output, save path, and permissions all work correctly.

![Testing an automation task](/blog/workbuddy/workbuddy-48.jpg)

After the test completes, you can inspect the AI-generated result.

![Automation task output result](/blog/workbuddy/workbuddy-49.jpg)

## Practical Tips

WorkBuddy is powerful because it can operate close to your desktop workflow, but that also means permissions and task boundaries matter. In real use, keep these rules in mind:

- test with a low-risk folder first instead of granting broad access to sensitive files
- define the output format, save path, and acceptance criteria for complex tasks
- check permission scope before connecting email, communication tools, cloud documents, or similar services
- turn high-frequency tasks into Skills or automation; use the main chat for one-off tasks
- use Expert Center when the requirement is unclear; use normal tasks when the goal is already specific

## Summary

WorkBuddy's direction is clear: move AI from "answering questions" toward "executing office work." Once installation, login, task execution, Skills, Claw, expert agents, connectors, and automation are combined, it becomes more than a chat box. It becomes an AI workspace built around the local computer and daily office workflows.

For individual users, the best starting points are report generation, file organization, spreadsheet processing, and automated summaries. For teams, the bigger value is turning stable workflows into Skills, expert templates, and automation tasks, so AI can reuse team knowledge instead of forcing everyone to start with a blank prompt.

> This is a rewritten and reorganized version for Finding AI Tools. The original walkthrough screenshots and reference material come from the CSDN article: [《【AI智能体】全场景AI智能体工作台WorkBuddy实战操作详解》](https://blog.csdn.net/zhangcongyi420/article/details/161335906). Original author: zhangcongyi420. Original license: CC 4.0 BY-SA.
