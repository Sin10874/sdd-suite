---
name: sdd-router
description: SDD 套件的入口与路由。判断用户当前处于需求 / 设计 / 技术哪个阶段,读取已落盘的中间态,把请求分发到 discover-spec、design-spec、tech-spec 或 sdd-orchestrate。Use when starting to build a product or feature, when unsure which phase to enter, or when resuming an in-progress SDD project. 触发词:做个产品 / 开发新功能 / 从需求开始 / 立项 / 写 spec / 做设计 / design.md / 技术方案 / 架构 / SDD / 需求评审 / 继续上次的项目。
---

# SDD Router

把任意"我要做个东西"的请求,接进 SDD 三阶段流水线的正确入口。你只做路由与状态判断,不做实际的需求/设计/技术工作——那是各阶段 skill 的事。

## 启动动作

1. 读 `CONSTITUTION.md`(插件根)。整个会话遵守它。
2. 确定项目 slug(短横线命名)。中间态都落在 `docs/sdd/<slug>/`。
3. 做 **State Detection**:检查已有哪些中间态,决定从哪一段接上。

```bash
ls docs/sdd/<slug>/ 2>/dev/null
# 看是否存在 spec.md / design.md / plan.md / tasks.md
```

## State Detection → 入口

| 已落盘的中间态 | 用户在哪 | 路由到 |
| --- | --- | --- |
| 无 | 从零开始 | `discover-spec`(先把需求问清楚) |
| 只有 `spec.md` | 需求已定,缺设计 | `design-spec` |
| 有 `spec.md` + `design.md` | 设计已定,缺技术方案 | `tech-spec` |
| 三者齐全 | 准备执行 | 移交实现(executing / 你的实现流程) |
| 用户想一把跑完 / 不确定规模 | 需要编排 | `sdd-orchestrate`(它来判档 + 串 gate) |

## Routing Table(按意图)

- "做个产品 / 这个功能要怎么做 / 帮我想清楚需求" → `discover-spec`
- "需求定了,设计一下 UI / 配色 / 页面 / design.md" → `design-spec`
- "设计好了,出技术方案 / 选型 / 架构 / 数据模型 / 拆任务" → `tech-spec`
- "整个流程帮我跑 / 这个改动该走多重的流程" → `sdd-orchestrate`

## 铁律

- **不跳阶段**:用户直接说"帮我写代码",但 `docs/sdd/<slug>/` 是空的 → 先回到 `discover-spec`,除非用户显式声明走"轻档"(见 CONSTITUTION 第 6 条)。
- **不替用户决定**:阶段之间的 review gate 由用户批准,你只负责把人送到正确的门口并说明现在在第几段。
- 路由完成后,明确告诉用户:当前 slug、检测到的状态、即将进入哪个阶段、为什么。
