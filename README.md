# sdd-suite

> 一套覆盖「需求 → 设计 → 技术」三阶段的 Claude Code / Codex skill 套件。
> 把一个想法,经由文件化中间态(`spec.md → design.md → plan/tasks`)+ 阶段 gate,变成 AI 能照着落地、不跑偏的产品。

集 9 个大师级 AI-skill 仓库之长,原创补齐它们的共同盲区——**技术架构方案**。参考库见 [`reference-library.md`](reference-library.md)。

---

## 它解决什么

AI 写代码已经不是瓶颈。瓶颈在**需求模糊、设计含糊、技术无计划** → agent 凭空脑补 → 跑偏。

sdd-suite 用一条 **SDD 主梁**把三阶段焊死:每段产出一份文件,是下一段的**唯一合法输入**,阶段之间留一道**人 review gate**。错误在阶段内被拦,不滚到下游复利成灾。

```
想法 → spec.md → design.md → plan + tasks → 实现
       (需求)    (设计)      (技术)
       每段一个文件 · 每段一道 gate · 下游只接受上游已批准的产物
```

## 套件构成

| skill | 阶段 | 产出 | 集成自 |
| --- | --- | --- | --- |
| `sdd-router` | 入口路由 | 判断你在哪一阶段并分发 | dbskill 纯路由 + 中文别名 |
| `discover-spec` | ① 需求 | `spec.md`(6 段 + 可验收 AC) | ecc AC-NNN · gstack 六逼问 · lenny PRD · SDD |
| `design-spec` | ② 设计 | `design.md`(9 段 + tokens) | impeccable · open-design · awesome-design-md |
| `tech-spec` | ③ 技术 | `plan / data-model / contracts / tasks` | SDD · ecc ADR · superpowers writing-plans |
| `sdd-orchestrate` | 总控 | 右尺寸判档,串成 gated pipeline | ecc orch-pipeline · gstack autoplan |
| `CONSTITUTION.md` | 常驻约束 | 分层 / 强制引用 / gate / 禁擅自抽象 | SDD constitution |

## 一个好需求文档的框架(discover-spec 的内核)

**= 6 段结构 × 可验收的精细度。**

结构:① 背景/问题 ② 用户/场景 ③ **验收标准 AC** ④ 范围边界 ⑤ 差异化/立项理由 ⑥ 未决项。
精细度:每条 AC 六要素齐(起始/触发/预期产出/禁止副作用/验证方法/优先级)+ 压成 EARS 可验证句 + 无空词 + 未决项不静默假设。
> 判据:**一个零上下文的 agent 照着做,也不会跑偏。**

## 安装

### 方式一 · Claude Code 插件(推荐)

```
/plugin marketplace add Sin10874/sdd-suite
/plugin install sdd-suite@sdd-suite
```

### 方式二 · 手动软链到全局 skills

```bash
git clone git@github.com:Sin10874/sdd-suite.git
for s in sdd-suite/skills/*/; do ln -s "$(pwd)/$s" ~/.claude/skills/"$(basename "$s")"; done
```

## 快速开始

装好后,在任意项目里:

```
/ohspec PaycheckCity        # 复刻一个已验证产品的需求
/ohspec 一个给独立开发者记账的工具   # 从零 idea 起
```

`/ohspec` 会用 `discover-spec`:判断输入模式(新 idea / 复刻 / 竞品加 feature)→ 没想清的逼问你、想清的帮你完善 → 落成一份六段齐、可验收的 `spec.md`。

## 设计哲学

- **文件化中间态**:不靠对话记忆,靠落盘的文档接力。
- **强制引用**:下游唯一合法输入是上游已批准的产物。
- **暴露而非假设**:不确定的写成 `[NEEDS CLARIFICATION]`,逼自己暴露。
- **右尺寸**:小改动给逃生口,别用大流程碾小事。

## License

MIT
