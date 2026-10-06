// Renders the share images docs/og-{en,ko,zh}.png (1200x630) from the same copy as the pages.
// Needs Playwright, which is not a dependency of this repo: run it from a directory that has it,
//   cd <dir with node_modules/playwright> && node <repo>/docs-src/og.mjs
import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { langs } from './content.mjs';

const { chromium } = createRequire(process.cwd() + '/')('playwright');
const here = dirname(fileURLToPath(import.meta.url));
const docs = join(here, '..', 'docs');
const icon = 'data:image/svg+xml;base64,' + readFileSync(join(docs, 'icon.svg')).toString('base64');
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');

const fonts = {
  en: '"Segoe UI",system-ui,sans-serif',
  ko: '"Segoe UI","Malgun Gothic","Apple SD Gothic Neo","Noto Sans KR",sans-serif',
  zh: '"Segoe UI","Microsoft YaHei","PingFang SC","Noto Sans SC",sans-serif',
};

const html = (code, t) => `<!doctype html><html lang="${t.htmlLang}"><meta charset="utf-8"><style>
*{box-sizing:border-box;margin:0}
body{width:1200px;height:630px;display:grid;grid-template-columns:1fr 400px;gap:56px;align-items:center;padding:0 76px;background:#14161b;color:#eceef2;font-family:${fonts[code]};${code === 'ko' ? 'word-break:keep-all;' : ''}}
.brand{display:flex;align-items:center;gap:14px;font-size:30px;font-weight:600;color:#c9ced8}
.brand img{width:52px;height:52px}
h1{margin-top:38px;font-size:${code === 'en' ? 70 : 68}px;line-height:${code === 'en' ? 1.08 : 1.24};letter-spacing:${code === 'zh' ? 0 : '-.025em'};font-weight:700;text-wrap:balance}
h1 em{font-style:normal;color:#7cc9ea}
.nb{white-space:nowrap}
p.lead{margin-top:28px;font-size:29px;line-height:1.5;color:#a3adba;text-wrap:balance}
.vis{display:grid;gap:26px;justify-items:start}
.keycap{display:grid;place-items:center;width:112px;height:112px;border:1px solid #3a3f4b;border-radius:24px;background:#23272f;box-shadow:0 9px 0 #30353f;font-size:50px;font-weight:650}
.mb{width:400px;border:1px solid #3a3f4b;border-radius:20px;background:#1b1e25;overflow:hidden}
.grip{height:11px;background:#2c303b}
.row{display:flex;align-items:center;gap:16px;padding:20px 24px 0}
.dot{width:15px;height:15px;border-radius:50%;background:#5fd6a0}
.level{width:190px;height:8px;border-radius:4px;background:#343946;overflow:hidden}
.level i{display:block;width:64%;height:100%;border-radius:4px;background:#5fd6a0}
.text{padding:14px 24px 24px;font-size:23px;line-height:1.5;color:#e8eaee;text-wrap:balance}
</style>
<div><div class="brand"><img src="${icon}" alt="">mulbit</div><h1>${t.h1Html}</h1><p class="lead">${esc(t.lead)}</p></div>
<div class="vis"><div class="keycap">G</div><div class="mb"><div class="grip"></div><div class="row"><span class="dot"></span><span class="level"><i></i></span></div><div class="text">${esc(t.demo.words.join(t.demo.joiner))}</div></div></div>
</html>`;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
page.setDefaultTimeout(90000);
for (const [code, t] of Object.entries(langs)) {
  await page.setContent(html(code, t), { waitUntil: 'load' });
  await page.screenshot({ path: join(docs, `og-${code}.png`) });
  console.log(`og-${code}.png`);
}
await browser.close();
