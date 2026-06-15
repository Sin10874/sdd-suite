# sdd-suite

> 一套帮你把"我想做个 X"逼成一份 **AI 照着能干、不跑偏**的文件的 Claude Code / Codex skill 套件。
> 覆盖「需求 → 设计 → 技术」三阶段,中间态全部落盘成文件(`spec.md → design.md → plan/tasks`),阶段之间留一道人工 review 门。

集 9 个开源 AI-skill 仓库之长 + 原创补齐它们的共同盲区(技术架构方案)。出处见 [`reference-library.md`](reference-library.md)。

---

## 它解决什么(说人话)

AI 写代码已经不是瓶颈了。**瓶颈是你没想清楚要什么** —— 你给一句模糊的话,agent 就凭空脑补细节,然后越跑越偏,等你发现已经返工一大片。

这套东西不替你写代码,它做的是**前面那一步**:逼你(在它帮助下)把脑子里那团模糊想法,变成一份具体到"换一个零上下文的 agent 照着做也不跑偏"的文件。

一句话:**它把"想清楚"这件事文件化、流程化了。**

## 它怎么工作

```
想法
 │
 ▼  sdd-router(判断你在哪一步,送你进对的门)
 │
 ├─①─ discover-spec ──► spec.md        要做什么(需求 + 页面 + 技术建议)
 │                        ⏸ 你 review、点头
 ├─②─ design-spec  ──► design.md       长什么样(UI / 视觉 / 交互 + design tokens)
 │                        ⏸ 你 review、点头
 ├─③─ tech-spec    ──► plan / tasks    怎么搭(架构 / 数据模型 / 接口 / 拆任务)
 │                        ⏸ 你 review、点头
 ▼
交给 coding agent 照着实现
```

- **每一步产出一个文件**,这个文件是下一步**唯一的输入**。
- **每一步之间停下来给你过目**(叫 HARD-GATE)。你不点头,它不往下冲。错误在当步就被你拦住,不会滚到下游变成灾难。
- `sdd-orchestrate` 负责**判断这事值不值得走完整流程**(小改动别上大流程),并把几段串起来。

## 写完 spec 之后,下一步怎么接

这是最常被问的。**有两条路,按项目大小选:**

### 路径 A · 完整 SDD(团队 / 复杂项目)

`spec.md` →(批准)→ `design-spec` 出 `design.md` →(批准)→ `tech-spec` 出 `plan.md` + `tasks.md` →(批准)→ 交给 coding agent 按文件实现。
每段都有独立的人工门,适合需要把设计、架构都白纸黑字定死、多人协作、要可追溯的场景。

### 路径 B · 轻量(solo / indie / 用 AI 写代码,**推荐给个人**)

新版 `discover-spec` 产出的 spec **已经自带页面与功能清单 + 核心技术方案**,所以你常常不需要手写 design-spec / tech-spec:

```
spec.md  +  一个风格参考(找张喜欢的图 / 一句话描述调性)
   │
   ▼  喂给 Claude design / v0 / Figma Make 这类设计工具
design.md / UI 稿
   │
   ▼  把 spec + design 一起交给 coding agent(Claude Code 等)
照着实现
```

> 关键:**视觉风格不用你手写**,它从"风格参考 + 工具"出来。spec 只要功能完整(它已经做到),视觉交给工具。

### 怎么选

- 改几个文件、没新接口、设计不模糊 → **别走流程**,直接动手(`sdd-orchestrate` 会判成"轻档"放你走)。
- 一个全新 0→1 产品、要给设计/开发交接 → 走完整或路径 B。
- 不确定 → 让 `sdd-orchestrate` 判档,它会告诉你该走几段、为什么。

## 套件构成

| skill | 干什么 | 产出 |
| --- | --- | --- |
| `sdd-router` | 入口。判断你在第几步,送进对的门 | —— |
| `discover-spec` | ① 需求:把想法逼成可落地的 spec | `spec.md`(下方详解) |
| `design-spec` | ② 设计:把 spec 变成 UI 契约 | `design.md` + `design-tokens.json`(9 段 + 反 AI-slop) |
| `tech-spec` | ③ 技术:把需求+设计变成可执行蓝图 | `plan.md` / `data-model.md` / `contracts/` / `tasks.md` |
| `sdd-orchestrate` | 总控:右尺寸判档 + 串成带门流水线 | 一条 gated pipeline |
| `CONSTITUTION.md` | 常驻铁律:分层 / 强制引用 / 必停 review / 不擅自抽象 | —— |

## spec.md 长什么样(结构详解)

discover-spec 的产出不是一篇散文需求,是一份**结构化、可验收**的契约。九段,每段都有明确职责和"不许假大空"的硬规则:

| # | 段 | 写什么 | 硬规则 |
| --- | --- | --- | --- |
| 1 | 背景 / 问题 | 具体的谁、在什么真实场景、现在怎么凑合 | 要一个具体的人 + 真实瞬间,不是"大家都需要" |
| 2 | 战略立项 | 核心赌注、最窄切入、护城河、为什么是现在、**放弃阈值(kill-criteria)**、写码前最便宜的证伪动作 | 专家视角,但每条要落地,不许空话 |
| 3 | 产品形态 & 分发 | 按形态路由;**website 强制 SEO + GEO** | 带真实关键词簇 + 真实标题/meta + 可被 AI 引用的答案块 |
| 4 | 品牌与产品体系 | 定位陈述、2–3 个命名候选、品牌声音、系统主线 | 每块带真实样例(含"品牌腔 vs 通用腔"对比),不是功能汤 |
| 5 | 页面与功能清单 | 有哪些页 + 每页功能 + 状态(空/加载/付费/错误)+ 对应 AC | 写**功能与内容**,不写 UI 视觉(那是设计工具的活)。这是设计工具的直接输入 |
| 6 | 跨切面决策 | 多语言 / 平台 / 账号 / 支付 / 隐私 / 未成年人… | 每条:决定 + 理由 + `[已确认]`/`[待确认]`。主动给建议并和用户确认,不静默跳过 |
| 7 | 验收标准 AC | 每条 AC 六要素 + 真实样例 + EARS | 见下 |
| 8 | 核心技术实现方案 | 架构 + **复用的 GitHub 项目(真实链接)** + API 服务选型 + 不造轮子说明 | 真去搜过再写、引真实可点链接;到"小白照着能搭"为止,不写完整代码 |
| 9 | Out of scope / BLOCKER / 未决项 | 明确不做什么、阻塞型未决、普通未决 | 改产品方向的列 BLOCKER,HARD-GATE 前清零 |

> 复刻已验证产品 / 竞品驱动加 feature 时,额外多两段:`复刻范围` + `差异化点`(竞品洞察逐条映射,一条不丢)。

**一条 AC 的样子(六要素 + EARS):**
```
### AC-001 · 测完即给一句"行为预测" (P0)
- 起始条件:用户答完测评
- 触发:提交答卷
- 预期产出:WHEN 提交 THE SYSTEM SHALL 生成结果卡,首行是引用其具体分数的行为预测
- 禁止副作用:不输出与分数无关的通用鸡汤
- 验证方法:两份不同档案各测一次,断言两张卡的预测句可区分
- 示例:Conscientiousness 42 的卡首行 = "You start strong and bail at the messy middle."
- 优先级:P0
```

> **总判据:一个零上下文的 agent 照着这份 spec 做,也不会跑偏。** 做不到 = 还不够具体,回炉。
> 还配一个 `validate-spec.mjs` 脚本,机械检查:AC 六要素齐、有真实样例(拒绝假大空)、有页面清单、有技术方案且带真实链接、未决项盘点。

## 安装

### 方式一 · Claude Code 插件(推荐)
```
/plugin marketplace add Sin10874/sdd-suite
/plugin install sdd-suite@sdd-suite
```

### 方式二 · Codex CLI
Codex 原生读 `SKILL.md`(无需 `openai.yaml`)。把 skills 软链到 Codex 全局 skills 目录:
```bash
git clone git@github.com:Sin10874/sdd-suite.git
mkdir -p ~/.codex/skills
for s in sdd-suite/skills/*/; do ln -s "$(pwd)/$s" ~/.codex/skills/"$(basename "$s")"; done
```
新开一个 Codex 会话,skill 按 description 自动匹配加载。也支持**项目级**:把 skills 放进项目的 `.agents/skills/`(Codex 从 cwd 向上扫到 repo 根)。官方文档:[developers.openai.com/codex/skills](https://developers.openai.com/codex/skills)

### 方式三 · 手动软链(任意读 ~/.claude/skills 的 agent)
```bash
git clone git@github.com:Sin10874/sdd-suite.git
for s in sdd-suite/skills/*/; do ln -s "$(pwd)/$s" ~/.claude/skills/"$(basename "$s")"; done
```

> 三种装法装的是同一批 `SKILL.md` —— 这些 skill 是纯 markdown,不绑定某个 agent。

## 快速开始

装好后,在任意项目里:
```
/ohspec 一个给独立开发者记账的工具       # 从零 idea
/ohspec 复刻 Truity 做个在线测试站        # 对标已验证产品
```
它会用 `discover-spec`:先判断你是从零做、复刻、还是加功能 → 没想清的地方逼问你、给建议让你挑 → 落成一份能往下走的 `spec.md`。

## 设计思路

为什么是"文件 + 阶段 + 门"这套结构,而不是直接跟 AI 聊到它开始写代码 —— 七个有意识的取舍:

**1 · 文件化中间态,而非对话记忆。**
对话会丢、不可 diff、不可审计;一旦上下文被压缩或会话重开,"我们当时说好的"就没了。落盘的 `spec.md / design.md / plan.md` 是**契约**:能 review、能版本控制、能被任意 agent 重新加载。下游对接的是文件,不是聊天记录。

**2 · 分阶段 + 人工门,因为错误的成本随阶段指数放大。**
需求里的一个含糊,做到设计会变成一处歧义,做到代码会变成一片返工。把错误拦在它**产生的那一阶段**,代价最小。每道门是人工 review —— 只有人能拍板跨阶段的取舍,这一步不可压缩。

**3 · 强制引用:下游只接受上游已批准的产物。**
`design-spec` 没有 `spec.md` 就拒绝开工。这条防两件事:防跳阶段(凭空开始设计/写码)、防多源失真(保证每一层都有单一真相源)。

**4 · 暴露而非假设。**
AI 最危险的失败模式是"自信地脑补一个细节然后当真往下做"。规则反过来:不确定的一律写成 `[NEEDS CLARIFICATION]`,从现状反推的标 `[ASSUMPTION]` —— 逼它把不知道的摆到台面上,而不是偷偷猜。

**5 · 拒绝假大空 —— 这套里最反直觉、也最关键的一条。**
一份抽象的 spec(只写"生成得体的文案""做好 SEO")等于**把所有具体决策的真空留给下游 agent**,它会用默认值和套路填满,出来就是千篇一律的 AI 味。所以每个核心主张都必须有**真实样例**锚住:真文案、真样例数据、真页面内容、真 GitHub 项目链接。反过来也禁"具体的假"——不许编一个精确的假数字(`73%`)冒充已核实事实,未实测的标 `[UNVERIFIED-NUMBER]`。具体,是为了约束下游不跑偏。

**6 · 右尺寸,流程是手段不是目的。**
SDD 对一次性脚本、探索性原型就是过度工程。`sdd-orchestrate` 按 blast-radius(改动文件数 / 是否新增契约 / 设计是否模糊)判档,小事给逃生口,直接动手。

**7 · 决定权永远在你。**
skill 给推荐、给判断、把最脆弱的假设指给你看,但跨阶段的取舍由你拍板,它不替你决定。

**关于 discover-spec 被有意做"厚"**:原始 SDD 严格分层——需求只写 WHAT,技术留给 tech-spec。但对 solo、对用 AI 写代码的人,跑满三段太重,他们需要**一份 spec 就够往下走**。所以 discover-spec 被有意扩成"含页面清单 + 技术建议",让 `spec + 风格参考` 就能喂设计工具和 coding agent。代价是它软化了严格分层 —— 这是清醒的取舍,也是下面"已知不一致"那条的由来。

## 诚实的局限与适用场景

**适合:**
- solo dev / 独立开发者 / 用 AI 写代码的人,把模糊想法逼成"能交给设计工具和 coding agent"的文件。
- 0→1 新产品、复刻已验证产品、给已有产品加功能。

**不适合(别硬用):**
- 一次性脚本 / 纯探索原型 —— 过度工程,走轻档或干脆别用。
- 大型既有代码库里的小修小补 —— blast-radius 太小,不值当。
- 需要正式合规审计的企业 PRD 流程 —— 这是个人取向的工具,不是企业级文档系统。

**大胆承认的局限:**
- **这是个人作品**,集开源之长 + 原创,**没有大规模实战验证**。别当圣经。
- **三段里 `discover-spec` 最成熟**(刚深度 dogfood + 重写过);`design-spec` / `tech-spec` 更新少、还没跟着重新 dogfood。
- **分层边界(v0.2 已对齐)**:`discover-spec` 含技术方案建议 + 页面清单,`CONSTITUTION.md` §1 与 `tech-spec` 已同步更新——需求阶段给"技术方向 + 复用清单",tech-spec 把它深化成可执行蓝图(ADR/数据模型/契约/任务),UI 视觉仍专属 design-spec。**仍待验证**:新版 spec 喂给 design-spec / tech-spec 的承接还没端到端 dogfood 过,接不接得住待实测。
- **gate 靠你**:它会停下来请你 review,但你不 review、催它往下冲,它也会冲。纪律最终在人。
- 反 AI-slop 等部分检查是 **advisory(指引)**,不是硬拦截 —— 想要真硬门得自己写 fail-closed 校验。

## License

MIT
