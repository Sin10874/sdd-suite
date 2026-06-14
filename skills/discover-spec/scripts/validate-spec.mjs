#!/usr/bin/env node
// 校验 spec.md 是否满足 discover-spec 的硬规则。
// 用法: node validate-spec.mjs <path-to-spec.md>
// 退出码: 0 = 通过(可有 warning); 1 = 硬失败; 2 = 文件读不到。
//
// v2:不再只查 3 件事。新增 AC 六要素齐、EARS 句式、Mode B 差异化非空、阻塞型未决项。
// 起因:PaycheckCity dogfood 发现旧脚本对"差异化空白 + 缺 EARS"的残废 spec 仍 exit 0。
import { readFileSync } from 'node:fs';

const path = process.argv[2];
if (!path) { console.error('用法: node validate-spec.mjs <path-to-spec.md>'); process.exit(2); }
let text;
try { text = readFileSync(path, 'utf8'); }
catch { console.error(`读不到文件: ${path}`); process.exit(2); }

const errors = [];
const warnings = [];
const lines = text.split('\n');

// --- 1. 至少一条 AC-NNN ---
if (!/AC-\d{2,}/.test(text)) errors.push('缺少验收标准:未发现任何 AC-NNN 编号的验收标准。');

// --- 2. out-of-scope 段 ---
if (!/(out of scope|out-of-scope|不做|超出范围|范围之外)/i.test(text)) {
  errors.push('缺少 Out of scope 段:必须明确这版不做什么。');
}

// --- 把文档切成 AC 定义块,逐块查六要素 ---
const isAcDef = (ln) => /AC-\d{2,}/.test(ln) && (/^#{1,6}\s/.test(ln) || /^\s*[-*]?\s*\*{0,2}AC-\d/.test(ln));
const isTopHeader = (ln) => /^#{1,3}\s/.test(ln) && !/AC-\d/.test(ln);
const acStarts = [];
lines.forEach((ln, i) => { if (isAcDef(ln)) acStarts.push(i); });

const ANCHORS = [
  ['起始条件', /起始条件|前置条件|起始状态/],
  ['触发', /触发/],
  ['预期产出', /预期产出|预期|产出/],
  ['禁止副作用', /禁止副作用|禁止|副作用/],
  ['验证方法', /验证方法|验证/],
  ['优先级', /优先级|P[012]\b/],
];

acStarts.forEach((start, idx) => {
  let end = lines.length;
  for (let j = start + 1; j < lines.length; j++) {
    if (isAcDef(lines[j]) || isTopHeader(lines[j])) { end = j; break; }
  }
  const block = lines.slice(start, end).join('\n');
  const acId = (lines[start].match(/AC-\d{2,}/) || ['AC-??'])[0];
  const missing = ANCHORS.filter(([, re]) => !re.test(block)).map(([n]) => n);
  if (missing.length) errors.push(`${acId} 缺要素: ${missing.join(' / ')}(六要素必须齐)。`);
  // 阻塞型:验证方法里塞了未决项 → 验收口径不稳
  if (/验证方法[\s\S]*?\[NEEDS CLARIFICATION/.test(block)) {
    warnings.push(`${acId} 的验证方法里有 [NEEDS CLARIFICATION],会让验收口径不稳定,进 design 前应定。`);
  }
});

// --- 3. EARS 句式(warning) ---
if (!/\b(WHEN|IF|WHILE)\b[^\n]*\bSHALL\b/i.test(text)) {
  warnings.push('未发现 EARS 句式(WHEN/IF/WHILE … SHALL):AC 散文够清也建议至少压几条成 EARS 可验证句。');
}

// --- 4. Mode B:复刻范围在场则差异化点必须非空、非全占位 ---
if (/复刻范围/.test(text)) {
  // 定位差异化段
  const dStart = lines.findIndex((ln) => /^#{1,6}\s/.test(ln) && /差异化/.test(ln));
  if (dStart === -1) {
    errors.push('Mode B 缺「## 差异化点」段(检测到复刻范围但无差异化点)。');
  } else {
    let dEnd = lines.length;
    for (let j = dStart + 1; j < lines.length; j++) {
      if (/^#{1,3}\s/.test(lines[j])) { dEnd = j; break; }
    }
    const content = lines.slice(dStart + 1, dEnd).filter((l) => l.trim() && !/^[#>|\-\s]*$/.test(l));
    const allPlaceholder = content.length > 0 && content.every((l) => /\[NEEDS CLARIFICATION/.test(l));
    if (content.length === 0) errors.push('Mode B 差异化点整段为空:Mode B 的立项理由不能留白。');
    else if (allPlaceholder) errors.push('Mode B 差异化点整段全是 [NEEDS CLARIFICATION] 占位:至少要有 1 条落地条目或 [ASSUMPTION]。');
  }
}

// --- 5. 未决项盘点(warning + BLOCKER 提醒) ---
const needs = text.match(/\[NEEDS CLARIFICATION[^\]]*\]/gi) || [];
if (needs.length) warnings.push(`残留 ${needs.length} 个 [NEEDS CLARIFICATION];其中阻塞型(改变产品方向/验收口径)进 HARD-GATE 前必须清零。`);
if (/^#{1,3}\s.*BLOCKER/im.test(text)) warnings.push('检测到 BLOCKER 段:这些是阻塞型未决项,用户未拍板不得进 design-spec。');

// --- 6. 空词(warning) ---
const vague = text.match(/(correctly|securely|优雅地|快速地|高效地)/gi) || [];
if (vague.length) warnings.push(`检测到 ${vague.length} 处不可验证空词(${[...new Set(vague)].join(', ')}),拆成可测条件。`);

warnings.forEach((w) => console.log(`⚠️  ${w}`));
if (errors.length) {
  errors.forEach((e) => console.error(`❌ ${e}`));
  console.error(`\nspec 未通过硬规则校验(${errors.length} 项)。`);
  process.exit(1);
}
console.log('✅ spec 通过硬规则校验' + (warnings.length ? `(${warnings.length} 条 warning,见上)` : '') + '。');
process.exit(0);
