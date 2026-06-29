# sdd-suite

> 一套帮你把"我想做个 X"逼成一份 **AI 照着能干、不跑偏**的 `spec.md` 的 Claude Code / Codex skill 套件。
> 核心就一件事:把模糊想法,变成一份**厚到能直接交给设计工具出 UI、交给 coding agent 写代码**的需求方案文件。

集 9 个开源 AI-skill 仓库之长 + 原创补齐它们的共同盲区(技术架构方案)。出处见 [`reference-library.md`](reference-library.md)。

---

## 它解决什么(说人话)

AI 写代码、AI 出设计稿,已经不是瓶颈了。**瓶颈是你没想清楚要什么** —— 你给一句模糊的话,工具就凭空脑补细节,然后越跑越偏,等你发现已经返工一大片。

这套东西不替你写代码、不替你出图,它做的是**前面那一步**:逼你(在它帮助下)把脑子里那团模糊想法,变成一份具体到"换一个零上下文的工具/agent 照着做也不跑偏"的 `spec.md`。

一句话:**它把"想清楚"这件事文件化了。一份 spec.md,就是后面所有工具的唯一输入。**

## 它怎么工作

```
想法
 │
 ▼  sdd-router  判断你在哪一步、送进对的门
 │
 ▼  discover-spec ─────────► spec.md      ★ 主角:一份够厚的需求 + 方案
 │                            ⏸ 你 review、点头
 │
 ├─ 设计 ── spec.md + 风格参考 ─► Claude Design / Open Design / Codex Product Design ─► 设计稿
 │
 ▼  计划 ── gen-plan ─► tasks.md + plan.md   ← 多数项目走这条:拆成可并行执行的开发计划
 │            └ 复杂 / 团队项目:先 tech-spec 出 ADR / 数据模型 / 契约,再回 gen-plan 编排
 │
 ▼  开发 ── spec.md(+ 设计稿 + tasks/plan)─► coding agent / worktree 并行执行
```

**关键:spec.md 是中心,不是流水线的第一节。** 写完它,设计、技术、开发都从它分叉出去——设计交给外部 AI 设计工具,开发交给 coding agent,技术方案只在复杂项目才单独做。

## 写完 spec 之后,下一步怎么接

### 出设计稿(每个 web/App 项目都要)

```
spec.md  +  一个风格参考(找张喜欢的图 / 一句话描述调性)
   │
   ▼  喂给 Claude Design / Open Design / Codex Product Design(或 v0 / Figma Make)
设计稿 / design.md
```

- **为什么不在 suite 里手写 design.md**:这些 AI 设计工具直接生成真实视觉,比一份 markdown token 表强得多;而 spec 已经给了它们要的一切(页面与功能清单 + 品牌 + 真实文案)。你只需再补一个**风格参考**——视觉品味是 spec 不该管、也管不了的。
- **拿到产出后,对照这张反 AI-slop 清单过一眼**(命中就让工具重做或自己调):
  - AI 默认靛蓝 / 紫渐变(`#6366f1` 一类)、SaaS 模板味的蓝→青渐变
  - 纯黑 `#000` 做正文、字号层级糊成一团
  - 无意义 emoji 当装饰、假指标(无来源的 "10x")、千篇一律三卡片 + 渐变大标题
  - 所有东西等距、没主次、没呼吸

### 出开发计划(多数项目都要)

```
spec.md(+ 设计稿)
   │
   ▼  gen-plan
tasks.md  ← 独立、清晰、可验证的原子任务清单(每条精确到文件路径 + 能跑的验收命令 + 回指 AC)
plan.md   ← 基于任务依赖的并行 [P] / 串行编排 + 批次 gate + 关键路径
```

- **gen-plan 是 tech-spec 的轻量版**:不做架构 ADR / 数据模型 / 接口契约,只做"把需求拆成能派给 coding agent 的任务 + 排好执行顺序"。solo / 用 AI 写代码的人,绝大多数时候要的是这个,不是重档 tech-spec。
- 产出能**直接喂并行执行**:每条 `[P]` 开一棵 git worktree,多个 agent 同时跑,批次间做 gate。
- 配了个 `validate-plan.mjs` 机器自检:每条任务有文件路径 + 验收 + AC 回指、无 placeholder、同批 `[P]` 文件不重叠、有集成冒烟收尾、spec 每条 AC 都被覆盖。六项不过就打回重拆。

### 出技术方案(只在复杂 / 团队项目)

新版 spec 已经自带一段「核心技术实现方案」(架构方向 + 复用的真实 GitHub 项目 + API 选型)。**对 solo / 用 AI 写代码的人,这一段通常就够直接喂 coding agent 了。**

只有当项目复杂、多人协作、要把架构白纸黑字定死时,才用 `tech-spec` 把它**深化**成 ADR / 数据模型 / 接口契约 / 原子任务,再回 `gen-plan` 编排执行。

### 开发

把 `spec.md`(+ 设计稿 +(可选)技术方案)一起交给 coding agent(Claude Code 等),照着实现。spec 里的可验收 AC 就是验收清单。

## 套件构成

| skill | 干什么 | 产出 |
| --- | --- | --- |
| `discover-spec` ★ | **主角**。把想法逼成可落地的 spec | `spec.md`(下方详解) |
| `sdd-router` | 入口。判断你在第几步,送进对的门 | 路由到对的 skill |
| `gen-plan` | **多数项目的计划层**。把 spec(+设计稿)拆成独立可验证的原子任务 + 并行/串行编排 | `tasks.md` + `plan.md` |
| `tech-spec`(可选·重档) | 只有复杂 / 团队项目才用:把技术方向深化成架构蓝图,再回 gen-plan 编排 | `plan.md` / `data-model.md` / `contracts/` / `tasks.md` |
| `sdd-orchestrate` | 总控:右尺寸判档 + 串成带门流程 | 一条 gated pipeline |
| `CONSTITUTION.md` | 常驻铁律:暴露而非假设 / 必停 review / 拒绝假大空 / 不擅自抽象 | 常驻约束 |

> 设计阶段不再有对应 skill —— 它交给外部 AI 设计工具(见上)。

## spec.md 长什么样(结构详解)

discover-spec 的产出不是一篇散文需求,是一份**结构化、可验收**的契约。九段,每段都有明确职责和"不许假大空"的硬规则:

| # | 段 | 写什么 | 硬规则 |
| --- | --- | --- | --- |
| 1 | 背景 / 问题 | 具体的谁、在什么真实场景、现在怎么凑合 | 要一个具体的人 + 真实瞬间,不是"大家都需要" |
| 2 | 战略立项 | 核心赌注、最窄切入、护城河、为什么是现在、**放弃阈值(kill-criteria)**、写码前最便宜的证伪动作 | 专家视角,但每条要落地,不许空话 |
| 3 | 产品形态 & 分发 | 按形态路由;**website 强制 SEO + GEO** | 带真实关键词簇 + 真实标题/meta + 可被 AI 引用的答案块 |
| 4 | 品牌与产品体系 | 定位陈述、2–3 个命名候选、品牌声音、系统主线 | 每块带真实样例(含"品牌腔 vs 通用腔"对比),不是功能汤 |
| 5 | 页面与功能清单 | 有哪些页 + 每页功能 + 状态(空/加载/付费/错误)+ 对应 AC | 写**功能与内容**,不写 UI 视觉(那是设计工具的活)。**这是设计工具的直接输入** |
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

> **总判据:一个零上下文的工具/agent 照着这份 spec 做,也不会跑偏。** 做不到 = 还不够具体,回炉。
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
新开一个 Codex 会话,skill 按 description 自动匹配加载。也支持**项目级**:把 skills 放进项目的 `.agents/skills/`。官方文档:[developers.openai.com/codex/skills](https://developers.openai.com/codex/skills)

### 方式三 · 手动软链(任意读 ~/.claude/skills 的 agent)
```bash
git clone git@github.com:Sin10874/sdd-suite.git
for s in sdd-suite/skills/*/; do ln -s "$(pwd)/$s" ~/.claude/skills/"$(basename "$s")"; done
```

> 三种装法装的是同一批 `SKILL.md` —— 纯 markdown,不绑定某个 agent。

## 快速开始

装好后,在任意项目里:
```
/ohspec 一个给独立开发者记账的工具       # ① 从零 idea     → spec.md
/ohspec 复刻 Truity 做个在线测试站        # ① 对标已验证产品 → spec.md
/genplan                                  # ② spec 批准后,拆成 tasks.md + plan.md
```
- `/ohspec` 用 `discover-spec`:判断你是从零做、复刻、还是加功能 → 没想清的地方逼问你、给建议让你挑 → 落成 `spec.md`,停下等你 review。
- spec 点头后(web/App 项目先去外部设计工具出设计稿),`/genplan` 用 `gen-plan` 把 spec(+设计稿)拆成可并行执行的开发计划,再交给 coding agent / worktree 开干。

## 设计思路

为什么收敛成"一份厚 spec + 外部工具",而不是搭一条三段流水线 —— 几个有意识的取舍:

**1 · 一份 spec.md 是中心,不是流水线第一节。**
早期版本是"需求→设计→技术"三段各写一份文件。但实践下来:设计稿现在由 AI 设计工具直接生成(给它 spec + 风格参考即可),代码由 coding agent 直接写。**手写一份 markdown 设计文档、一份技术文档,是夹在中间的弱环节** —— 工具做得更好。所以把力气全压在 spec 上,让它厚到下游工具不用猜。

**2 · 文件化,而非对话记忆。**
对话会丢、不可 diff、不可审计。`spec.md` 是落盘的契约:能 review、能版本控制、关掉重开不丢、能被任意工具/agent 重新加载。下游对接的是文件,不是聊天记录。

**3 · 拒绝假大空 —— 这套里最关键的一条。**
一份抽象的 spec(只写"生成得体的文案""做好 SEO")等于**把所有具体决策的真空留给下游工具**,它会用默认值和套路填满,出来就是千篇一律的 AI 味。所以每个核心主张都必须有**真实样例**锚住:真文案、真样例数据、真页面内容、真 GitHub 项目链接。反过来也禁"具体的假"——不许编一个精确的假数字冒充已核实事实,未实测的标 `[UNVERIFIED-NUMBER]`。具体,是为了约束下游不跑偏。

**4 · 暴露而非假设。**
AI 最危险的失败模式是"自信地脑补一个细节然后当真往下做"。规则反过来:不确定的写成 `[NEEDS CLARIFICATION]`,从现状反推的标 `[ASSUMPTION]` —— 逼它把不知道的摆到台面上。

**5 · 一道硬门:spec 落盘后停下,等你点头。**
不是三道门,就一道——但这一道不可压缩。spec 是后面一切的源头,源头错了下游全错。所以写完必须你 review 批准,才往设计/开发走。

**6 · 右尺寸,流程是手段不是目的。**
改几个文件的小事,别上这套。`sdd-orchestrate` 按 blast-radius 判档,小事给逃生口直接动手。

**7 · 决定权永远在你。**
skill 给推荐、把最脆弱的假设指给你看,但取舍由你拍板。

## 诚实的局限与适用场景

**适合:**
- solo dev / 独立开发者 / 用 AI 写代码的人,把模糊想法逼成"能交给设计工具和 coding agent"的一份文件。
- 0→1 新产品、复刻已验证产品、给已有产品加功能。

**不适合(别硬用):**
- 一次性脚本 / 纯探索原型 —— 过度工程,直接动手。
- 大型既有代码库里的小修小补 —— 不值当。
- 需要正式合规审计的企业 PRD 流程 —— 这是个人取向的工具,不是企业级文档系统。

**大胆承认的局限:**
- **这是个人作品**,集开源之长 + 原创,**没有大规模实战验证**。别当圣经。
- **`discover-spec` 是被深度打磨过的那一个**;`tech-spec` 是"复杂项目才用"的可选重档,**没怎么 dogfood 过**,当心。
- **设计这一环依赖外部工具的质量**(Claude Design / Open Design 等)。suite 只保证把 spec 喂好,出来好不好看,看工具 + 你给的风格参考。
- **gate 靠你**:它会停下来请你 review,但你不 review、催它往下冲,它也会冲。纪律最终在人。

## License

MIT
