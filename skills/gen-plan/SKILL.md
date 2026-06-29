---
name: gen-plan
description: 把已批准的 spec.md(+ 可选设计稿)生成一份能直接照做的开发计划:独立、清晰、可验证的原子 Task 清单(tasks.md)+ 基于任务依赖的并行 [P] / 串行执行编排(plan.md)。比 tech-spec 轻:不做架构 ADR / 数据模型 / 接口契约,只聚焦"把需求拆成能派给 coding agent 的任务 + 排好执行顺序"。Use when a spec.md (and optional design) exists and you need an actionable, verifiable task list plus a parallel/serial execution plan before coding, the common solo/medium case that skips the heavy tech-spec. 触发词:开发计划 / 拆任务 / task 清单 / tasks.md / 并行串行 / 排开发顺序 / 把 spec 变成计划 / plan.md / 怎么开干 / 排开发。需要 spec.md 作为输入。
---

# gen-plan · 从 spec + 设计稿,生成能照做的开发计划

把一份够厚的 `spec.md`(+ 可选设计稿)落成两个产物:

- `tasks.md`:独立、清晰、可验证的原子任务清单
- `plan.md`:基于任务依赖排出的并行 `[P]` / 串行执行顺序

**定位**:tech-spec 的轻量版。tech-spec 适合复杂 / 团队项目(要 ADR + 数据模型 + 接口契约);gen-plan 只做**任务拆解 + 执行编排**,适合最常见的"spec / design 都有了,直接想要一份能派活的计划"。需要架构深度时再上 tech-spec,本 skill 不碰架构 / 数据模型 / 契约。

## 启动

1. 读 `CONSTITUTION.md`(若在 sdd-suite 内运行)。
2. **强制引用**:唯一合法输入是已批准的 `spec.md`(设计稿可选)。无 spec.md 则停下,回 discover-spec。
3. 产出落到 `docs/sdd/<slug>/`:`tasks.md`、`plan.md`。文首写 `> source: docs/sdd/<slug>/spec.md`。

## 第一步 · 立一把尺子:一条好 Task 的四条标准

一条任务合格,必须同时满足四条(拒绝"模糊大块"):

- **独立**:单一动作、单一职责,不依赖同批其他任务的中间产物就能开干。
- **清晰**:精确到**文件路径**(`src/auth.ts`,不是"鉴权模块"),动词开头(新增 / 改 / 删),**零 placeholder**(TBD / TODO / "加适当错误处理"全禁)。
- **可验证**:带一条**能跑的命令 + 预期输出**(如"错密码 `POST /login` 返回 401")。能写测试的标 test-first。
- **最小**:一个新审阅者半天内能做完、能 review。太大就拆。

每条回指它服务的 spec AC(`-> AC-003`)。不可验证的任务,等于没拆。

## 第二步 · 拆(spec -> tasks.md)

1. **先画 File Structure map**:每文件单一职责,按职责分(不按技术分层硬切)。让任务"改的文件不重叠",这是后面能并行的物理前提。
2. 按 map 把 spec 的每条功能 / AC 切成原子任务。
3. **spec coverage 自检**:列「AC -> task」对照,每条 AC 必有 task,漏了补,多出来的质疑。

## 第三步 · 编排(tasks -> plan.md)

把任务排成可执行的**批次**,不是一长条流水账:

- **标依赖**:B 用到 A 的产物 -> B 串行依赖 A。
- **标 `[P]`**:无依赖 + 改的文件不重叠 -> 同批 `[P]`,分到不同 worktree 同时跑。
- **排批次**:批 1([P] 地基)-> 批 2(依赖批 1)-> ... -> 集成 / 冒烟收尾。
- **标关键路径**:最长那条串行链,决定"最快多久跑完"。

## 反模式:这 6 种一看就是烂计划

1. **按技术分层拆**(前端 / 后端 / 数据库各一个任务):改的文件全重叠,没法并行。应按职责 / feature 竖切。
2. **任务带 placeholder**("实现登录(细节待定)"):待定就是没拆完,打回。
3. **验收写"功能正常"**:不可执行。必须是一条能跑出 0/1 的命令 + 预期。
4. **一个任务改 5+ 文件**:太大、无法独立 review。拆到以"一文件一任务"为主。
5. **全标 [P] 但其实有依赖**(登录接口和登录页同时跑,接口没好页面测不了):有数据 / 契约依赖的必须串行。
6. **漏集成 / 冒烟任务**:三条并行线合并后没人验端到端。每个计划末尾必须有一条集成冒烟任务。

## 一个端到端样例(spec 一段 -> tasks -> plan)

spec 片段:

> 功能:邮箱密码登录。AC-001 错密码返回 401、对的返回 token。AC-002 登录页宽 375px 不溢出。AC-003 接口文档含两种响应。

`tasks.md`:

```
> source: docs/sdd/login/spec.md

## tasks(独立 · 清晰 · 可验证 · 文件不重叠)

- [ ] T1 [P] src/auth.ts : 登录接口            -> AC-001
      验收:错密码 POST /login 返回 401,对的返回 token
- [ ] T2 [P] ui/login.css : 登录页样式          -> AC-002
      验收:宽 375px 时按钮不溢出、占满整行
- [ ] T3 [P] docs/api.md : 登录接口文档          -> AC-003
      验收:含 /login 请求体 + 401/200 两种响应
- [ ] T4     集成冒烟(依赖 T1-T3)               -> AC-all
      验收:三条线合并后 npm run smoke 退出码为 0
```

`plan.md`:

```
> source: docs/sdd/login/spec.md

## 执行计划

批次 1 [P 并行] : T1 / T2 / T3   ← 文件不重叠,三棵 worktree 同时跑
批次 2 [串行]   : T4 集成冒烟     ← 依赖批次 1 全绿
关键路径 : T1 -> T4
```

## plan 怎么直接喂并行执行

plan.md 不是写完就完,它直接驱动跑:

- 批次 1 的每条 `[P]` 开一棵 worktree:`git worktree add ../feat-auth -b feat-auth`,三条线用 `claude --worktree` / Cmux 各跑一个 agent。
- **批次间是 gate**:批 1 三棵都审过、合进主干,才开批 2。
- **关键路径**(T1 -> T4)告诉你"最快多久";想提速,要么并行化、要么拆短关键路径上的任务。
- **接 tech-spec**:复杂项目先 tech-spec 出 ADR / 数据模型 / 契约,再回 gen-plan 编排;简单项目直接 gen-plan -> 并行跑。

## 移交前自检:跑 validate-plan.mjs

别靠肉眼,跑一遍机器校验:

```
node validate-plan.mjs docs/sdd/<slug>/
```

它检查六件:① 每条 task 有文件路径 + 验收 + AC 回指 ② 无 placeholder ③ 同批 `[P]` 的文件不重叠 ④ plan 有批次 + 关键路径 ⑤ 有集成 / 冒烟收尾 ⑥ 每条 spec AC 都被覆盖。任一不过 -> NOT READY,打回重拆。

## HARD-GATE

- **自检覆盖率**:贴「AC -> task」对照,缺口显式标。
- `tasks.md` + `plan.md` 给用户批准,**才**移交实现(coding agent / worktree 并行执行)。

## 在 sdd-suite 里的位置

`discover-spec`(需求) -> 外部设计工具(设计稿) -> **`gen-plan`(轻量计划,多数项目)** 或 `tech-spec`(深度蓝图,复杂项目) -> coding agent / worktree 并行执行。

也能脱离 sdd-suite 单独用:手上有一份说清 WHAT/WHY + 功能清单 + AC 的需求文档就能跑。
