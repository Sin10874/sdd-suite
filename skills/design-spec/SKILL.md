---
name: design-spec
description: 设计方案落地(第二阶段,UI / 视觉 / 交互)。读取已批准的 spec.md,产出一份 9 段式 design.md 设计契约 + design tokens,带反 AI-slop 规则与设计评审。Use when docs/sdd/<slug>/spec.md exists and the user needs UI / visual / interaction design before implementation. 触发词:做设计 / UI / 配色 / 排版 / 页面 / 组件 / design.md / 视觉风格 / 设计系统 / 长什么样 / 界面。需要 spec.md 作为输入;不要用于需求(discover-spec)或后端架构(tech-spec)。
---

# design-spec · 设计方案落地

把需求变成一份 AI 能照着生成一致 UI 的 `design.md` 契约。只定 UI / 视觉 / 交互 / 信息架构,不碰后端与数据建模(`CONSTITUTION.md` 第 1 条)。

## 启动

1. 读 `CONSTITUTION.md`。
2. **强制引用**:唯一合法输入是 `docs/sdd/<slug>/spec.md`。不存在则停下,回 discover-spec。
3. 产出落到 `docs/sdd/<slug>/design.md` + `docs/sdd/<slug>/design-tokens.json`,文首写 `> source: spec.md`。

## design-brief 整链(借 impeccable)

1. 从 spec 提取设计意图(产品调性、目标用户、场景)。
2. **闭词表强校验**:把意图映射到固定词表(品牌人格、密度、情绪、对比度…)。**遇到表外/未知值,反问用户,不要猜**。
3. 符号 → token 解析:把选定的词映射到 design tokens(色板角色、排版尺度、间距、圆角、阴影、动效)。
4. 生成 9 段式 `design.md`(下方)。
5. **回报默认值**:文末列出所有走了默认、未经用户确认的维度,逐条标出。

## 9 段式 design.md(借 awesome-design-md / open-design)

模板见 `references/design-md-template.md`。九段:① Overview/调性 ② 色板(语义角色)③ 排版层级 ④ 间距/网格 ⑤ 组件态 ⑥ 动效/交互 ⑦ Do / Don'ts(**写"为什么"**)⑧ Known Gaps(显式边界)⑨ Agent Prompt Guide。

- **token-ref 散文写法**:正文一律引用 `{colors.primary}` 等 token,**禁写裸 hex**——保证 design-tokens.json 是单一真相源。
- **禁发明表外值**:所有数值/颜色/字号都来自 token 表,不临时编。

## 反 AI-slop(借 open-design / impeccable)

按 `references/ai-slop-blacklist.md` 过一遍黑名单(滥用紫色渐变、AI 默认靛蓝、信任感蓝→青渐变、塞 emoji、发明指标、废话填充…)。

> 注意:这是 **advisory**——检测后回灌纠偏,不是硬拦截。想要真 gate,得写 fail-closed 校验(见 CONSTITUTION 第 4 条 / design-md-chrome 的 node assert 思路)。诚实标注哪些是"自动检查"、哪些只是"指引"。

## 三轴正交 + 按需注入(借 open-design)

任务形状 / 品牌语言 / 通用工艺三轴独立。工艺规则**用到才加载**(craft.requires),别一次性灌满 context。

## 评审与交接

- **写码门控不可压缩**:shape → palette → mock 三步,逐步给用户看、收反馈,不允许跳。
- critique 双轨(borrow impeccable):确定性 detector 扫黑名单 + 一轮 LLM 设计评审(Nielsen 启发式 / Julie Zhuo 的 Value→Ease→Delight)。
- **HARD-GATE**:design.md 给用户批准,才进 tech-spec。terminal state → `tech-spec`。
