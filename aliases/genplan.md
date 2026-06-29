---
description: 用 gen-plan 把 spec.md(+设计稿)拆成 tasks.md + plan.md
argument-hint: [项目 slug,留空用当前 docs/sdd]
---
用 gen-plan skill,把已批准的 `spec.md`(+ 可选设计稿)拆成可并行执行的开发计划:独立可验证的原子任务 `tasks.md` + 并行/串行编排 `plan.md`,并用它自带的 `validate-plan.mjs` 自检,停在 HARD-GATE 等我 review。

$ARGUMENTS
