# design.md 模板 · 9 段式

借 awesome-design-md / open-design 的 DESIGN.md 范式。一份 .md 丢进项目,AI 据此生成一致 UI。
**铁律**:正文写 token 引用 `{colors.primary}`,禁写裸 hex;所有数值来自 design-tokens.json,禁发明表外值。

```markdown
> source: docs/sdd/<slug>/spec.md

# <产品名> Design

## 1 · Overview / 调性
一句话视觉定位 + 品牌人格(3 个词) + anti-references(明确不要像谁)。

## 2 · 色板(语义角色)
不按颜色名,按角色:{colors.primary} / {colors.surface} / {colors.text.primary} /
{colors.border} / {colors.focus} … 每个角色说用在哪、对比度是否过 WCAG。

## 3 · 排版层级
字族 + 尺度({type.h1}…{type.body}{type.caption}) + 行高 + 字重。说清层级关系。

## 4 · 间距 / 网格
基础间距单位 + 尺度({space.1}…) + 栅格列数 + 容器宽度。

## 5 · 组件态
关键组件(按钮 / 输入 / 卡片…)的 default / hover / active / disabled / error 态,各引 token。

## 6 · 动效 / 交互
时长({motion.fast}…)+ 缓动 + 用在哪。克制:动效服务理解,不炫技。

## 7 · Do / Don'ts
逐条写,且 **每条写"为什么"**。例:Don't 用纯黑 #000 做正文——伤对比疲劳,用 {colors.text.primary}。

## 8 · Known Gaps
显式列这份设计没覆盖的边界(暗色模式?国际化?极端长文案?)。诚实标边界。

## 9 · Agent Prompt Guide
给下游生成 UI 的 agent 的一段指令:必须读哪些 token、禁止哪些 slop、遇未定义维度怎么办。

---
## 走了默认的维度(必填)
列出所有未经用户确认、走了默认值的维度,逐条标出,供 review。
```
