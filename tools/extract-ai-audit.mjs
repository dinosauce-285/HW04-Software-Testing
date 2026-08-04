#!/usr/bin/env node
/**
 * Trích AI Audit Report tự động từ transcript phiên làm việc của Claude Code.
 *
 * Đề HW04 §9:113-119 yêu cầu mỗi tương tác AI phải ghi: tên công cụ · ngày giờ ·
 * prompt nguyên văn · output. §9:119 khuyến khích tự động hoá đúng việc này:
 *   "you are encouraged to create a skill or rule that extracts the information
 *    above automatically after an AI session"
 *
 * Dùng:
 *   node tools/extract-ai-audit.mjs [đường-dẫn-thư-mục-transcript]
 *
 * Mặc định đọc ~/.claude/projects/<slug-thư-mục-dự-án>/*.jsonl và ghi đè
 * submission/appendix/AI-Prompt-Log.md
 */

import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';

const PROJECT = process.cwd();
const SLUG = PROJECT.replace(/\//g, '-');
const DEFAULT_DIR = path.join(os.homedir(), '.claude', 'projects', SLUG);
const SRC_DIR = process.argv[2] ?? DEFAULT_DIR;
const OUT = path.join(PROJECT, 'submission', 'appendix', 'AI-Prompt-Log.md');

/** Bỏ các khối do hệ thống chèn, chỉ giữ chữ người dùng thật sự gõ. */
function cleanPrompt(text) {
  return text
    .replace(/<system-reminder>[\s\S]*?<\/system-reminder>/g, '')
    .replace(/<ide_opened_file>[\s\S]*?<\/ide_opened_file>/g, '')
    .replace(/<ide_selection>[\s\S]*?<\/ide_selection>/g, '')
    .replace(/<command-[a-z]+>[\s\S]*?<\/command-[a-z]+>/g, '')
    .trim();
}

function textOf(content) {
  if (typeof content === 'string') return content;
  if (!Array.isArray(content)) return '';
  return content
    .filter(b => b && b.type === 'text' && typeof b.text === 'string')
    .map(b => b.text)
    .join('\n');
}

function toolsOf(content) {
  if (!Array.isArray(content)) return [];
  return content.filter(b => b && b.type === 'tool_use').map(b => b.name);
}

if (!fs.existsSync(SRC_DIR)) {
  console.error(`Không tìm thấy thư mục transcript: ${SRC_DIR}`);
  process.exit(1);
}

const files = fs.readdirSync(SRC_DIR).filter(f => f.endsWith('.jsonl')).sort();
const events = [];

for (const file of files) {
  for (const line of fs.readFileSync(path.join(SRC_DIR, file), 'utf8').split('\n')) {
    if (!line.trim()) continue;
    let d;
    try { d = JSON.parse(line); } catch { continue; }
    const msg = d.message;
    if (!msg) continue;

    if (d.type === 'user' && msg.role === 'user') {
      const raw = textOf(msg.content);
      if (!raw) continue;                       // bỏ khối tool_result
      const prompt = cleanPrompt(raw);
      if (!prompt) continue;                    // bỏ message chỉ có system-reminder
      events.push({ kind: 'prompt', at: d.timestamp, text: prompt });
    }

    if (d.type === 'assistant' && msg.role === 'assistant') {
      const text = textOf(msg.content).trim();
      const tools = toolsOf(msg.content);
      if (!text && !tools.length) continue;
      events.push({ kind: 'reply', at: d.timestamp, text, tools, model: msg.model });
    }
  }
}

// Gom mỗi prompt với toàn bộ phần trả lời cho tới prompt kế tiếp
const turns = [];
for (const e of events) {
  if (e.kind === 'prompt') {
    turns.push({ at: e.at, prompt: e.text, reply: [], tools: [], model: null });
  } else if (turns.length) {
    const t = turns[turns.length - 1];
    if (e.text) t.reply.push(e.text);
    t.tools.push(...e.tools);
    t.model ??= e.model;
  }
}

const fmt = ts => {
  const d = new Date(ts);
  const p = n => String(n).padStart(2, '0');
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const models = [...new Set(turns.map(t => t.model).filter(Boolean))];
const allTools = turns.flatMap(t => t.tools);
const toolCount = allTools.reduce((a, n) => ((a[n] = (a[n] ?? 0) + 1), a), {});

let md = `# AI Audit Report — HW04

*(Phụ lục bắt buộc · đề HW04 §9 · Policies — "AI Disclosure". Thiếu file này → 0 điểm.)*

**Sinh viên:** Lý Quốc Thạnh — \`23127262\`

## Khai báo

**Tôi có sử dụng công cụ AI cho các công việc sau** *(I use AI tools for the following tasks)*:
khảo sát hệ thống cần kiểm thử, sinh và sửa script automation Playwright, tạo bug report,
và soạn tài liệu bài làm.

| Mục | Giá trị |
|---|---|
| Tên công cụ | Claude Code (Anthropic) |
| Mô hình | ${models.join(', ') || 'claude-opus-5'} |
| Số lượt trao đổi | ${turns.length} |
| Khoảng thời gian | ${turns.length ? fmt(turns[0].at) + ' — ' + fmt(turns[turns.length - 1].at) : '—'} |
| Số lượt gọi công cụ | ${allTools.length} |

### Công cụ AI đã sử dụng trong phiên

${Object.entries(toolCount).sort((a, b) => b[1] - a[1]).map(([n, c]) => `- \`${n}\` — ${c} lượt`).join('\n')}

## Cách thu thập log

File này được sinh **tự động** bằng \`tools/extract-ai-audit.mjs\`, đọc trực tiếp transcript
phiên làm việc tại \`~/.claude/projects/${SLUG}/*.jsonl\`. Không chép tay, không tóm tắt lại
bằng lời — prompt và output dưới đây là **nguyên văn**.

Điều này thực hiện đúng gợi ý của đề (§9:119): *"you are encouraged to create a skill or rule
that extracts the information above automatically after an AI session."*

Các khối do hệ thống tự chèn vào lượt của người dùng (\`<system-reminder>\`, \`<ide_opened_file>\`)
đã được lược bỏ vì không phải chữ do sinh viên gõ.

---

## Nhật ký tương tác

`;

turns.forEach((t, i) => {
  md += `### Lượt ${i + 1} — ${fmt(t.at)}\n\n`;
  md += `**Công cụ:** Claude Code${t.model ? ` (${t.model})` : ''}\n\n`;
  md += `**Prompt (nguyên văn):**\n\n\`\`\`\n${t.prompt}\n\`\`\`\n\n`;
  if (t.tools.length) {
    const c = t.tools.reduce((a, n) => ((a[n] = (a[n] ?? 0) + 1), a), {});
    md += `**Hành động của AI:** ${Object.entries(c).map(([n, k]) => `${n}×${k}`).join(' · ')}\n\n`;
  }
  md += `**Output:**\n\n${t.reply.join('\n\n') || '*(chỉ thao tác công cụ, không có phần trả lời dạng văn bản)*'}\n\n---\n\n`;
});

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, md);
console.log(`Đã ghi ${OUT}`);
console.log(`  ${turns.length} lượt trao đổi · ${allTools.length} lượt gọi công cụ · ${(md.length / 1024).toFixed(0)} KB`);
