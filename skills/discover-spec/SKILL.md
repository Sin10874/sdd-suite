---
name: discover-spec
description: 产品需求方案制定(第一阶段)。支持三种入口——一个新想法、一个要复刻的竞品、或给已有产品新增的功能——通过结构化提问 / 逆向 / 竞品分析,收敛成一份可验收的 spec.md(验收标准 AC + 范围边界 + 未决项)。Use when starting requirements for a product or feature, whether from a raw idea, by cloning a validated competitor, or by discovering new features through competitive analysis, or when docs/sdd/<slug>/spec.md does not yet exist. 触发词:做个产品 / 新想法 / 这个功能 / 加功能 / 新功能 / 复刻 / 竞品 / 对标 / 需求是什么 / 写需求 / PRD / 验收标准 / 立项。不要用于 UI 视觉设计(用 design-spec)或技术架构(用 tech-spec)。
---

# discover-spec · 需求方案制定

把"我想做个 X"逼问成一份机器和人都能照着干的 `spec.md`。这一阶段只回答 WHAT / WHY,严禁碰 HOW(技术、代码、架构)——见 `CONSTITUTION.md` 第 1 条。

## 启动

1. 读 `CONSTITUTION.md`(插件根,定义跨阶段 gate)。作为 `/ohspec` 单独跑需求阶段、找不到时,按本 skill 内置规则继续即可。
2. 确定 slug(产品名英文小写 + 连字符,如 `paycheckcity`;用户未指定就按此自动生成,不要猜),产出落到 `docs/sdd/<slug>/spec.md`。
3. 判断**输入模式**(见下),按模式选开场。不要一上来就写文档。

## 输入模式(先判断从哪进)

三种入口,机制不同,但都收敛到**同一份 spec.md**。下游 design-spec / tech-spec 无差别。

| 模式 | 你手上有什么 | 开场怎么走 | 产物里多一段 |
| --- | --- | --- | --- |
| **A · 从零 idea** | 一个想法 / 一句话 | interview mode + 六逼问,从用户脑子里逼出真需求(默认) | — |
| **B · 复刻已验证** | 一个现成产品(URL / 名) | 逆向:扒它的核心功能与 AC,定"复刻范围 + 差异化点",需求主要来自产品 | `## 复刻范围 / 差异化点` |
| **C · 竞品驱动加 feature** | 一个已有产品 + 一组竞品 | 竞品分析找 feature gap → 和用户讨论选 → 给新功能写 spec(范围限定为与现有产品集成) | `## 现有产品上下文` + `## 竞品对照` |

规则:

- **判断不了模式就问一句**:"这是从零做、复刻某个产品、还是给已有产品加功能?"
- **B / C 也要跑 interview 的关键几问**(谁用、为什么是现在、明确不做什么)——只是大部分需求从产品 / 竞品来,不是从访谈来。
- **C 模式复用现成能力**:用 `competitive-analysis` skill / competitor-research-analyst agent 做竞品拆解与 feature gap,本 skill 不重造竞品分析;拿到 gap 后回到这里讨论选型 + 写 spec。
- **B / C 必须多产出 `## 复刻范围` 和 `## 差异化点` 两段**——结构与硬规则见 `references/mode-b-scope.md`。**差异化点不得整段全是占位**,至少 1 条落地条目或 `[ASSUMPTION]`,否则立项理由悬空、过不了门。
- **竞品洞察必须接线**:当有竞品分析(commonGaps / differentiation)传入,逐条映射进差异化点或 out-of-scope,**一条都不能丢**(见 mode-b-scope.md)。
- **逆向 / 非交互豁免**:被 orchestrator 当 subagent 跑、无真人可问时,「至少一轮真问答」的 HARD-GATE 豁免方式 = 把六逼问转成 `[ASSUMPTION: … | 来源: …]` 自答(逆向映射见 `references/six-questions.md` 末尾),不算违反。
- 不管哪个模式,最终产物都是带 AC-NNN + out-of-scope + `[NEEDS CLARIFICATION]` 的 spec.md。

## Interview mode(模式 A 的核心;B / C 也问关键几问)

- **一次只问 2-3 个问题**,等真实回答,再问下一组。禁止用单句 prompt 合成整份 spec。
- 至少跑一轮真问答,才允许下笔写 spec。
- **反谄媚**(borrow gstack):禁说"这个想法很棒/有意思"。每个回答都要表态——哪里站不住、哪里有风险。
- 提问按产品阶段路由:0→1 找真需求,1→N 找瓶颈。详细问题清单见 `references/six-questions.md`。

## 六个逼问(打开真需求)

按 `references/six-questions.md` 逐项过:需求现实性 / 现状替代方案 / 绝望级具体性 / 最窄切入 / 观察与意外 / 未来契合。每个问题三段式:Ask → Push-until(追问到具体)→ Red-flags(听到这些要警惕)。

## 写 spec:结构与硬规则

产出 `spec.md`,必须包含:

- **背景 / 问题**:谁、在什么场景、现在怎么凑合(WHY)。
- **验收标准 AC**:用 `references/ac-template.md` 的 **AC-NNN 六要素**(起始条件 / 触发 / 预期产出 / 禁止副作用 / 验证方法 / 优先级)。禁止 "correctly / securely / 优雅地" 这类不可验证的空词。
- **EARS 句式**:把行为压成可验证条件。例:`IF 60 秒内校验失败 3 次 THEN 系统 SHALL 锁定账号 15 分钟`。
- **Out of scope**(强制):明确这版不做什么。没有 out-of-scope 段不算完成。
- **未决项**:所有不确定写成 `[NEEDS CLARIFICATION: 问题]`;从现状反推的写 `[ASSUMPTION: ...]`。

## 防跳阶段(Rationalization Table)

| 你可能冒出的念头 | 现实 |
| --- | --- |
| "需求很简单,直接写代码吧" | 简单也要一句话 AC + out-of-scope,否则范围会漂。 |
| "顺便把技术选型定了" | 停。HOW 是 tech-spec 的事,现在写会锁死后面。 |
| "用户没回答,我替他假设" | 写成 `[NEEDS CLARIFICATION]`,不要静默假设。 |

**红旗**:写到 React / 数据库 / API / 组件库 → 你跳到 HOW 了,删掉,回到 WHAT。

## 校验与交接

- 跑 `scripts/validate-spec.mjs docs/sdd/<slug>/spec.md`:检查 AC 段、out-of-scope 段、是否残留 `[NEEDS CLARIFICATION]`。
- **HARD-GATE**:把 spec 给用户 review,明确请求批准。未批准不得进入 design-spec。
- terminal state:用户批准后 → `design-spec`。
