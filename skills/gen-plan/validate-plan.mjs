#!/usr/bin/env node
// gen-plan 自检:校验 tasks.md + plan.md 够不够格移交并行执行
// 用法: node validate-plan.mjs docs/sdd/<slug>/
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const dir = process.argv[2] || '.';
const fail = [];
const ok = (cond, msg) => { if (!cond) fail.push(msg); };

let tasks = '', plan = '', spec = '';
try { tasks = readFileSync(join(dir, 'tasks.md'), 'utf8'); } catch { fail.push('找不到 tasks.md'); }
try { plan = readFileSync(join(dir, 'plan.md'), 'utf8'); } catch { fail.push('找不到 plan.md'); }
try { spec = readFileSync(join(dir, 'spec.md'), 'utf8'); } catch { /* spec 可选 */ }

const taskLines = tasks.split('\n').filter((l) => /^- \[/.test(l));
ok(taskLines.length > 0, 'tasks.md 里没有任何任务行(- [ ] ...)');

// 1. 无 placeholder
ok(!/\b(TBD|TODO|待定|待完善|待补|加适当)\b/i.test(tasks), 'tasks 里有 placeholder(TBD / TODO / 待定 / 加适当)');

// 文件路径正则:认 Next.js 动态路由段 [lang] / (marketing),否则 monorepo 真实路径会被切成 page.tsx 误判
const PATH = /[\w./\[\]()-]+\.\w+/;

// 2. 每条任务:文件路径(集成任务豁免) + AC 回指
for (const l of taskLines) {
  const isIntegration = /集成|冒烟|smoke/i.test(l);
  if (!isIntegration) ok(PATH.test(l), `任务缺文件路径: ${l.trim().slice(0, 44)}`);
  ok(/AC-?\w+/i.test(l), `任务缺 AC 回指: ${l.trim().slice(0, 44)}`);
}

// 3. 有集成 / 冒烟收尾
ok(/集成|冒烟|smoke/i.test(tasks), '缺集成 / 冒烟收尾任务(并行线合并后没人验端到端)');

// 4. plan 有批次 + 关键路径
ok(/批次|batch/i.test(plan), 'plan 缺批次划分');
ok(/关键路径|critical/i.test(plan), 'plan 缺关键路径标注');

// 5. 同批 [P] 的文件不重叠
const pFiles = {};
for (const l of taskLines) {
  if (/\[P\]/.test(l)) {
    // 跳过行首的 [ ] 复选框与 [P] 标记,取第一个真正的文件路径
    const m = l.replace(/^- \[[ x]\]\s*\S+\s*\[P\]/, '').match(new RegExp(`(${PATH.source})`));
    if (m) pFiles[m[1]] = (pFiles[m[1]] || 0) + 1;
  }
}
for (const [f, c] of Object.entries(pFiles)) ok(c <= 1, `多个 [P] 任务改同一文件 ${f},不能并行(去掉 [P] 或拆开)`);

// 6. spec 每条 AC 都被覆盖
if (spec) {
  const norm = (s) => s.toUpperCase().replace(/-/g, '');
  const acs = new Set([...spec.matchAll(/AC-?\d+/gi)].map((m) => norm(m[0])));
  const tNorm = norm(tasks);
  for (const ac of acs) ok(tNorm.includes(ac), `spec 的 ${ac} 没有对应 task`);
}

if (fail.length) {
  console.log('NOT READY for execution:');
  for (const f of fail) console.log('  - ' + f);
  process.exit(1);
} else {
  console.log('READY: tasks.md + plan.md 通过六项自检,可移交并行执行。');
}
