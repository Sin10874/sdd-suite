# SDD Constitution · 不可协商的规则

每个 SDD skill 启动时必须先读本文件并遵守。建议同时用 SessionStart hook 注入为常驻 context,
或在每个项目根放一份副本 `docs/sdd/CONSTITUTION.md`。下游产物违反任一条 = 必须打回,不得继续。

## 1 · 分层铁律(防 AI 提前跳阶段)

- **需求阶段(discover-spec)** 只写 WHAT / WHY。严禁写 HOW(技术选型、代码、架构、组件库)。
- **设计阶段(design-spec)** 只定 UI / 视觉 / 交互 / 信息架构。不碰后端架构与数据建模。
- **技术阶段(tech-spec)** 才写 HOW。

一旦在上游阶段看到下游内容(需求里出现 React、设计里出现数据库 schema),停下并打回。

## 2 · 强制引用(唯一合法输入)

- `design-spec` 的唯一合法输入是 `spec.md`。无 `spec.md` 则拒绝开工。
- `tech-spec` 的唯一合法输入是 `design.md` + `spec.md`。
- 每份产物在文首用一行声明来源:`> source: docs/sdd/<slug>/spec.md`。
- commit 时引用对应 spec 段落 ID。

## 3 · 未决项必须暴露,不许静默假设

- 任何不确定点写成 `[NEEDS CLARIFICATION: 具体问题]`,逼自己暴露而非猜。
- 从现状 / 代码反推业务真值时,标 `[ASSUMPTION: ...]`,不当事实写入。

## 4 · 阶段间必停 review(HARD-GATE)

- 每个阶段产物落盘后,**停下**,显式请用户 review 并批准,才进下一阶段。
- 不允许一口气从需求冲到代码。这是硬门,不可压缩。

## 5 · 禁止擅自加抽象(Phase -1 gate)

- 新增任何抽象层 / 框架 / 依赖,必须在 `plan.md` 写一段书面 justification。
- 三问:Simplicity(能不能更简单?)/ Anti-Abstraction(这层抽象现在真需要吗?)/ Integration-First(先打通端到端再优化?)。
- 默认走最简方案,YAGNI。

## 6 · 右尺寸逃生口(别过度工程)

- 不是所有任务都值得走完整三段。**改几个文件、无新接口契约、设计不模糊**的小改动,允许跳过派生文档直接动手。
- SDD 对一次性脚本 / 探索性原型是过度工程——给逃生口。
- 由 `sdd-orchestrate` 按 blast-radius(改动文件数 / 是否新增契约 / 设计是否模糊,取最高档)判档,或用户显式声明"轻档"。
