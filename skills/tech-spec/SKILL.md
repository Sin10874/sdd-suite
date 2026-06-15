---
name: tech-spec
description: 技术方案 / 架构制定(可选,复杂 / 团队项目)。读取已批准的 spec.md(及可选设计稿),把 spec 的「核心技术实现方案」段深化为技术选型矩阵、架构决策记录(ADR)、数据模型、接口契约、plan.md 与原子化可并行的 tasks.md。Use when a spec.md exists and a complex or team project needs a deep technical / architecture plan before coding (solo / simple projects can skip this and go spec → coding agent). 触发词:技术方案 / 架构 / 选型 / 技术栈 / 数据模型 / 数据库 / 接口 / API 契约 / 开发计划 / 拆任务 / plan.md。需要 spec.md 作为输入。
---

# tech-spec · 技术 / 架构方案

把需求 + 设计落成可执行的技术蓝图。这是九个参考仓库共同的盲区,所以本 skill 以**原创 + SDD 方法论为主**,不照抄任何单一 repo。

> 接力点(v0.2):新版 `spec.md` 已含一段「核心技术实现方案」——架构方向 + 复用的 GitHub 项目 + API 服务选型。tech-spec **不从零起**,而是接着它**深化**:把方向落成架构决策(ADR)、数据模型、接口契约、原子任务。spec 给"搭在谁肩膀上",tech-spec 给"逐砖怎么砌"。若 spec 的技术段与你深化后的结论冲突,以 tech-spec 为准并在 ADR 里记下为什么改。

## 启动

1. 读 `CONSTITUTION.md`。
2. **强制引用**:唯一合法输入是已批准的 `spec.md`(设计稿可选——设计现由外部工具产出)。无 spec.md 则停下,回 discover-spec。
3. 产出落到 `docs/sdd/<slug>/` 下:`plan.md`、`data-model.md`、`contracts/`、`tasks.md`。文首写 `> source: spec.md`。

## Phase -1 gates(动手前先过门,借 SDD / spec-kit)

新增任何抽象层 / 框架 / 依赖前,在 plan.md 写书面 justification,过三问(详见 `references/phase-minus-1-gates.md`):

- **Simplicity**:能不能用更少的部件做到?
- **Anti-Abstraction**:这层抽象现在就需要,还是"以后可能用到"?(后者一律砍)
- **Integration-First**:能不能先打通端到端最薄一条,再谈优化?

没过门的抽象不许进 plan。

## 技术选型矩阵

把关键技术决策列成矩阵:候选 × 评估维度(契合需求 / 团队熟悉度 / 运维成本 / 面向地区合规 / 商业模式约束)。每个决策落一条 **ADR**(Nygard 模板,见 `references/adr-template.md`):背景 / 决策 / 后果。决策点回指 spec 的 AC 与 design 的约束。

## 数据模型 + 接口契约

- `data-model.md`:实体 / 字段 / 关系,每个字段回指它服务的需求 AC。
- `contracts/`:接口契约(请求 / 响应 / 错误)。契约先行,实现在后。
- 铁律(borrow ecc):**不从现有代码反推业务真值**,未知标 `[ASSUMPTION]`。

## tasks.md:原子任务(借 superpowers writing-plans)

- 先 **map File Structure**:每文件单一职责,按职责而非技术分层拆。
- 再拆成 bite-sized 任务:单一动作、精确文件路径、明确验收(命令 + 预期输出)、零 placeholder。
- 可并行的标 `[P]`;能写测试的标 test-first。
- **spec coverage 自检**:反查每条 spec AC 是否都有对应 task。漏了就补。

## 评审与交接

- 自检覆盖率(borrow gstack):列一张"AC → task"对照,缺口显式标出。
- 可选:跨模型二次评审(换个模型对架构逐条挑刺)。
- **HARD-GATE**:plan + tasks 给用户批准,才移交实现。terminal state → 实现流程(executing / subagent-driven 等)。
