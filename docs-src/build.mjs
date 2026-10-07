// Generates the public site in ../docs from one source of truth (content.mjs).
//   node docs-src/build.mjs
// Output: docs/index.html (en, x-default), docs/ko/index.html, docs/zh/index.html,
//         docs/privacy.html (body kept verbatim from privacy-body.html), docs/sitemap.xml.
// No dependencies. Share images are rendered separately by og.mjs (needs Playwright).
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { langs, site } from './content.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const out = join(here, '..', 'docs');

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const url = (code) => site.base + langs[code].path;
const min = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\s*\n\s*/g, '').replace(/\s*([{};,>])\s*/g, '$1').replace(/:\s+/g, ':');

/* ---------------------------------------------------------------- styles */

// Layout: one left-aligned column on a cool, water-tinted ground. The hero pairs the headline
// with a live demo; later sections hang off a narrow left rail. One accent (water blue).
const baseCss = `
:root{
  --bg:#f3f6f8; --surface:#ffffff; --stage:#e4ecf1; --ink:#0f1a24; --ink-2:#4b5967; --line:#d5dee6;
  --accent:#0a6a92; --accent-ink:#ffffff; --accent-soft:#d6e9f2;
  /* mulbit's own window is always dark, like the real app */
  --mb-bg:#17191f; --mb-line:#3a3f4b; --mb-ink:#e8eaee; --mb-ink-2:#8a92a0; --mb-track:#343946; --mb-live:#5fd6a0;
  --sans:"Segoe UI Variable Text","Segoe UI",system-ui,-apple-system,BlinkMacSystemFont,"Helvetica Neue","Apple SD Gothic Neo","Malgun Gothic","PingFang SC","Microsoft YaHei",sans-serif;
  --display:"Segoe UI Variable Display","Segoe UI",system-ui,-apple-system,BlinkMacSystemFont,"Helvetica Neue","Apple SD Gothic Neo","Malgun Gothic","PingFang SC","Microsoft YaHei",sans-serif;
  --mono:ui-monospace,"Cascadia Mono","SF Mono",Consolas,"Liberation Mono",monospace;
  --fs-display:clamp(2.125rem,1.1rem + 4.4vw,3.75rem); --fs-h2:clamp(1.5rem,1.25rem + 1vw,2rem);
  --fs-lead:clamp(1.125rem,1.02rem + .45vw,1.3125rem); --fs-body:1.0625rem; --fs-small:.875rem;
  --gutter:clamp(20px,5vw,48px); --section:clamp(72px,11vw,136px);
  color-scheme:light dark;
}
@media (prefers-color-scheme:dark){:root{
  --bg:#101216; --surface:#20242c; --stage:#08090c; --ink:#e9ecf0; --ink-2:#9ea8b5; --line:#30353f;
  --accent:#7cc9ea; --accent-ink:#071b25; --accent-soft:#163442;
}}
:lang(ko){
  --sans:"Segoe UI Variable Text","Segoe UI",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR","Noto Sans CJK KR",system-ui,sans-serif;
  --display:"Segoe UI Variable Display","Segoe UI",-apple-system,BlinkMacSystemFont,"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR","Noto Sans CJK KR",system-ui,sans-serif;
}
:lang(zh-CN){
  --sans:"Segoe UI Variable Text","Segoe UI",-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei UI","Microsoft YaHei","Noto Sans SC","Noto Sans CJK SC",system-ui,sans-serif;
  --display:"Segoe UI Variable Display","Segoe UI",-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei UI","Microsoft YaHei","Noto Sans SC","Noto Sans CJK SC",system-ui,sans-serif;
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:var(--fs-body)/1.65 var(--sans);overflow-wrap:break-word}
body:lang(ko),body:lang(zh-CN){line-height:1.75}
body:lang(ko){word-break:keep-all}
h1,h2,h3,p,ol,ul,dl,dd,figure{margin:0}
ol,ul{padding:0;list-style:none}
h1,h2,h3{font-family:var(--display);text-wrap:balance}
p,dd,li{text-wrap:pretty}
a{color:var(--accent);text-underline-offset:.18em;text-decoration-thickness:1px}
a:hover{text-decoration-thickness:2px}
:focus-visible{outline:2px solid var(--accent);outline-offset:3px;border-radius:4px}
kbd{display:inline-block;min-width:1.55em;padding:0 .4em;border:1px solid var(--line);border-bottom-width:2px;border-radius:6px;background:var(--surface);color:var(--ink);font:600 .82em/1.5 var(--mono);text-align:center;vertical-align:.08em}
.wrap{max-width:1168px;margin-inline:auto;padding-inline:var(--gutter)}
.vh{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap}

.top{display:flex;align-items:center;justify-content:space-between;gap:16px;padding-block:20px}
.brand{display:inline-flex;align-items:center;gap:10px;color:var(--ink);font:650 1.0625rem/1 var(--display);letter-spacing:-.01em;text-decoration:none}
.brand img{display:block;width:32px;height:32px}
.lang{display:flex;gap:2px;font-size:var(--fs-small)}
.lang a{padding:6px 9px;border-radius:8px;color:var(--ink-2);text-decoration:none;white-space:nowrap}
.lang a:hover{color:var(--ink)}
.lang a[aria-current]{color:var(--ink);font-weight:600}

.foot{margin-top:var(--section);padding-block:28px 44px;border-top:1px solid var(--line);color:var(--ink-2);font-size:var(--fs-small)}
.foot-in{display:flex;flex-wrap:wrap;justify-content:space-between;gap:10px 32px}
.foot ul{display:flex;flex-wrap:wrap;gap:4px 20px}
.foot a{color:var(--ink-2)}
.foot a:hover{color:var(--ink)}
.foot p+p{margin-top:4px}
`;

const homeCss = `
.btn{display:inline-flex;align-items:center;gap:10px;padding:14px 22px;border-radius:12px;background:var(--accent);color:var(--accent-ink);font-weight:600;line-height:1.3;text-decoration:none;transition:transform .15s ease,filter .15s ease}
.btn:hover{filter:brightness(1.08)}
.btn:active{transform:translateY(1px)}
.btn svg{flex:none}
.btn span{text-wrap:balance}
@media (max-width:420px){.btn{padding-inline:18px}}
.cta{display:grid;gap:12px;justify-items:start}
.cta-sub{color:var(--ink-2);font-size:.9375rem;text-wrap:wrap}
.cta-sub span{white-space:nowrap}

.hero{display:grid;gap:clamp(36px,6vw,64px);align-items:center;padding-block:clamp(28px,5vw,72px) 0}
.hero-copy{display:grid;gap:clamp(18px,2.4vw,26px);min-width:0}
h1{font-size:var(--fs-display);font-weight:700;line-height:1.08;letter-spacing:-.028em}
:lang(ko) h1{line-height:1.22;letter-spacing:-.02em}
:lang(zh-CN) h1{font-size:clamp(2.125rem,1.1rem + 4.4vw,3.25rem);line-height:1.25;letter-spacing:0}
.nb{white-space:nowrap}
h1 em{font-style:normal;color:var(--accent)}
.lead{max-width:32em;text-wrap:balance;font-size:var(--fs-lead);line-height:1.5;color:var(--ink-2)}
:lang(ko) .lead,:lang(zh-CN) .lead{line-height:1.65}
@media (min-width:980px){.hero{grid-template-columns:minmax(0,5fr) minmax(0,6fr)}}

/* demo: the markup at rest is the finished state; the script rewinds and plays it */
.demo{min-width:0}
.stage{padding:clamp(14px,2.6vw,26px);border-radius:22px;background:var(--stage);user-select:none}
.stage-in{transition:opacity .35s ease}
.demo[data-phase=out] .stage-in{opacity:0;visibility:hidden;transition:opacity .35s ease,visibility 0s .35s}
.win{display:grid;border:1px solid var(--line);border-radius:12px;background:var(--surface);box-shadow:0 1px 2px rgb(10 20 30/.06),0 12px 28px -18px rgb(10 20 30/.35);overflow:hidden}
.win-bar{flex:none;display:flex;align-items:center;justify-content:space-between;height:34px;padding-inline:14px;border-bottom:1px solid var(--line);color:var(--ink-2);font-size:.75rem}
.win-ctl{display:flex;gap:16px;align-items:center}
.win-ctl i{display:block;width:9px;height:9px;border:1px solid currentColor;opacity:.7}
.win-ctl i:first-child{height:0;border-width:1px 0 0}
.win-ctl i:last-child{border:0;background:linear-gradient(45deg,transparent 46%,currentColor 46% 54%,transparent 54%),linear-gradient(-45deg,transparent 46%,currentColor 46% 54%,transparent 54%)}
/* four mock apps share one grid cell, so the window is always as tall as the tallest */
.app{grid-area:1/1;display:flex;flex-direction:column;min-width:0;visibility:hidden;font-size:.875rem;line-height:1.55}
.app.on{visibility:visible}
.app-body{flex:1;display:flex;flex-direction:column;gap:8px;min-width:0;padding:12px 16px 30px}
.app small{color:var(--ink-2);font-size:.75rem}
.line{min-width:0}
/* mail: a compose form */
.mail .app-body{gap:0;padding-top:4px}
.mail-row{display:flex;align-items:baseline;gap:12px;padding-block:7px;border-bottom:1px solid var(--line)}
.mail-row small{flex:none;min-width:4.4em}
.mail-text{flex:1;display:grid;gap:3px;align-content:start;padding-block:10px 12px}
.mail-send{align-self:flex-start;padding:3px 14px;border-radius:7px;background:var(--accent);color:var(--accent-ink);font-size:.75rem;font-weight:600}
/* messenger: a thread with the cursor in the input bar */
.chat .win-bar{height:42px;color:var(--ink);font-size:.8125rem;font-weight:600}
.chat .win-ctl{color:var(--ink-2)}
.who{display:flex;align-items:center;gap:8px}
.av{flex:none;display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--accent-soft);color:var(--accent);font-size:.75rem;font-weight:700;font-style:normal}
.chat .app-body{gap:10px;background:var(--bg)}
.chat-msg{display:flex;align-items:flex-end;gap:8px}
.chat-bub{max-width:78%;padding:6px 12px;border:1px solid var(--line);border-radius:14px 14px 14px 4px;background:var(--surface)}
.chat-in{display:flex;align-items:flex-end;gap:8px;margin-top:auto;padding:6px 6px 6px 14px;border:1px solid var(--line);border-radius:19px;background:var(--surface)}
.chat-in .line{flex:1;padding-block:2px}
.chat-send{flex:none;display:grid;place-items:center;width:26px;height:26px;border-radius:50%;background:var(--accent);color:var(--accent-ink)}
/* assistant: an answer with code above, a large prompt box below */
.split-body{flex:1;display:flex;min-width:0}
.rail{flex:none;display:grid;gap:9px;align-content:start;width:24%;max-width:118px;padding:14px 12px;border-right:1px solid var(--line);background:var(--bg)}
.rail i{display:block;height:8px;border-radius:4px;background:var(--line)}
.rail i:nth-child(2){width:70%}
.rail i:nth-child(3){width:86%}
.rail i:nth-child(4){width:55%}
.ai .app-body{gap:6px}
.ai-code{margin:0;padding:8px 11px;border-radius:9px;background:var(--stage);color:var(--ink);font:.75rem/1.55 var(--mono);white-space:pre;overflow:hidden}
.ai-prompt{display:flex;align-items:flex-end;gap:8px;margin-top:auto;padding:9px 9px 9px 14px;border:1.5px solid var(--accent);border-radius:15px;background:var(--surface);box-shadow:0 0 0 3px var(--accent-soft)}
.ai-prompt .line{flex:1;padding-block:2px}
.ai-up{flex:none;display:grid;place-items:center;width:27px;height:27px;border-radius:9px;background:var(--ink);color:var(--surface)}
/* notes: a list rail and a checklist */
.notes .rail i{height:24px;border-radius:7px;width:100%;opacity:.55}
.notes .rail i:first-child{background:var(--accent-soft);opacity:1}
.note-head{display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin-bottom:2px}
.note-head b{font:650 1.0625rem/1.3 var(--display)}
.todo{display:flex;align-items:flex-start;gap:9px}
.todo i{flex:none;position:relative;width:15px;height:15px;margin-top:.24em;border:1.5px solid var(--ink-2);border-radius:4px}
.todo.done{color:var(--ink-2);text-decoration:line-through}
.todo.done i{border-color:var(--accent);background:var(--accent)}
.todo.done i::after{content:"";position:absolute;left:3.5px;top:.5px;width:4px;height:8px;border:solid var(--accent-ink);border-width:0 1.75px 1.75px 0;transform:rotate(45deg)}
@media (max-width:560px){.rail{display:none}.app-body{padding-inline:14px}}
.landed{border-radius:3px}
.caret{display:inline-block;width:2px;height:1.15em;margin-inline:1px;background:var(--accent);vertical-align:-.2em;animation:blink 1.1s steps(1) infinite}
.caret-a{display:none}
.deck{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr);align-items:end;gap:clamp(12px,3vw,24px);padding-inline:clamp(6px,2vw,18px)}
.dev{display:grid;justify-items:center;align-items:end}
.dev>*{grid-area:1/1}
.key{display:grid;gap:9px;justify-items:center;padding-block:12px 4px}
.mouse{display:block;width:clamp(50px,14vw,62px);height:auto;margin-block:12px 4px;overflow:visible;visibility:hidden}
.m-body,.m-side{fill:var(--surface);stroke:var(--ink-2);stroke-width:1.75}
.m-line,.m-tick{fill:none;stroke:var(--ink-2);stroke-width:1.75;stroke-linecap:round}
.m-tick{stroke:var(--accent);stroke-width:2;opacity:0;transition:opacity .15s}
.m-side{transition:fill .12s,stroke .12s,transform .12s}
.demo[data-scene=mouse] .mouse{visibility:visible}
.demo[data-scene=mouse] .key{visibility:hidden}
.demo[data-scene=mouse] .dev{order:2}
.demo[data-scene=mouse] .deck{grid-template-columns:minmax(0,1fr) auto}
.demo[data-scene=mouse] .mb{justify-self:start}
.keycap{display:grid;place-items:center;width:clamp(48px,13vw,58px);aspect-ratio:1;border:1px solid var(--line);border-radius:13px;background:var(--surface);box-shadow:0 5px 0 var(--line),0 12px 18px -10px rgb(10 20 30/.4);color:var(--ink);font:650 clamp(1.25rem,4.5vw,1.5rem)/1 var(--display);transition:transform .12s ease,box-shadow .12s ease}
.hold{display:block;width:100%;height:3px;border-radius:2px;background:var(--line);overflow:hidden}
.hold i{display:block;height:100%;background:var(--accent);transform:scaleX(0);transform-origin:left}
.mb{justify-self:end;align-self:start;width:100%;margin-top:-16px;max-width:372px;border:1px solid var(--mb-line);border-radius:13px;background:var(--mb-bg);box-shadow:0 18px 36px -16px rgb(0 0 0/.6);color:var(--mb-ink);overflow:hidden}
.mb-grip{height:7px;background:#2c303b}
.mb-row{display:flex;align-items:center;gap:10px;padding:11px 14px 0;color:var(--mb-ink-2)}
.mb-dot{flex:none;width:9px;height:9px;border-radius:50%;background:var(--mb-ink-2);transition:background-color .2s}
.mb-level{flex:1;max-width:120px;height:5px;border-radius:3px;background:var(--mb-track);overflow:hidden}
.mb-level i{display:block;height:100%;border-radius:3px;background:var(--mb-live);transform:scaleX(0);transform-origin:left}
.mb-row svg{margin-left:auto}
.mb-text{min-height:6.3em;padding:8px 14px 13px;font-size:.8125rem;line-height:1.55;transition:opacity .3s}
@media (min-width:360px){.mb-text{min-height:4.8em}}
.w{transition:opacity .22s ease}

.demo.is-live:not([data-phase=done]) .landed{visibility:hidden}
.demo.is-live:not([data-phase=done]) .caret-a{display:inline-block}
.demo.is-live:not([data-phase=done]) .caret-b{display:none}
.demo.is-live .w{opacity:0}
.demo.is-live .w.on{opacity:1}
.demo[data-phase=done] .landed{animation:land 1.4s ease-out}
.demo[data-phase=done] .mb-text{opacity:.5}
.demo[data-phase=press1] .keycap,.demo[data-phase=press2] .keycap{transform:translateY(4px);box-shadow:0 1px 0 var(--line),0 4px 8px -6px rgb(10 20 30/.4)}
.demo[data-phase=press1] .hold i,.demo[data-phase=press2] .hold i{transform:scaleX(1);transition:transform .6s linear}
.demo[data-phase=press1] .m-side,.demo[data-phase=press2] .m-side{fill:var(--accent);stroke:var(--accent);transform:translateX(2.5px)}
.demo[data-phase=press1] .m-tick,.demo[data-phase=press2] .m-tick{opacity:1}
.demo[data-phase=rec] .mb-dot,.demo[data-phase=press2] .mb-dot{background:var(--mb-live)}
.demo[data-phase=rec] .mb-level i,.demo[data-phase=press2] .mb-level i{animation:level 1.9s ease-in-out infinite}
.demo.is-paused *{animation-play-state:paused!important}
@keyframes level-soft{0%,100%{transform:scaleX(.34)}22%{transform:scaleX(.7)}45%{transform:scaleX(.48)}70%{transform:scaleX(.8)}}
@keyframes blink{65%{opacity:0}}
@keyframes land{from{background:var(--accent-soft);box-shadow:0 0 0 3px var(--accent-soft)}to{background:transparent;box-shadow:0 0 0 3px transparent}}
@keyframes level{0%{transform:scaleX(.18)}12%{transform:scaleX(.72)}24%{transform:scaleX(.4)}38%{transform:scaleX(.9)}50%{transform:scaleX(.33)}63%{transform:scaleX(.66)}76%{transform:scaleX(.25)}88%{transform:scaleX(.8)}100%{transform:scaleX(.18)}}

.demo-cap{display:grid;gap:6px;margin-top:14px;padding-inline:4px;color:var(--ink-2);font-size:.9375rem}
.steps-wrap{display:grid}
.steps{grid-area:1/1;display:flex;flex-wrap:wrap;align-items:center;gap:4px 10px;min-width:0;transition:opacity .3s,visibility .3s}
.s-mouse,.demo[data-scene=mouse] .s-key{visibility:hidden;opacity:0}
.demo[data-scene=mouse] .s-mouse{visibility:visible;opacity:1}
.cap-note{max-width:36em;font-size:var(--fs-small);text-wrap:balance}
.steps li{display:flex;align-items:center;gap:10px;white-space:nowrap;transition:color .2s}
.steps li:not(:last-child)::after{content:"";width:14px;height:1px;background:currentColor;opacity:.45}
.cap-row{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:34px}
.cap-row p{color:var(--ink);min-width:0}
@media (max-width:420px){.demo-cap{font-size:.875rem}.steps{gap:4px 7px}.steps li{gap:7px}.steps li:not(:last-child)::after{width:9px}}
.demo.is-live[data-phase=press1] .steps li:nth-child(1),.demo.is-live[data-phase=rec] .steps li:nth-child(2),.demo.is-live[data-phase=press2] .steps li:nth-child(3){color:var(--ink)}
.toggle{flex:none;display:inline-flex;align-items:center;gap:7px;min-height:32px;padding:4px 11px;border:1px solid var(--line);border-radius:999px;background:transparent;color:var(--ink-2);font:inherit;font-size:var(--fs-small);cursor:pointer}
.toggle:hover{color:var(--ink)}
.toggle[hidden]{display:none}
.toggle i{display:block;width:8px;height:10px;border-inline:2.5px solid currentColor}
.toggle.is-play i{width:0;height:0;border:5px solid transparent;border-left:8px solid currentColor;border-right:0}

.section{margin-top:var(--section)}
h2{font-size:var(--fs-h2);font-weight:650;line-height:1.2;letter-spacing:-.018em}
:lang(ko) h2,:lang(zh-CN) h2{line-height:1.35;letter-spacing:-.01em}
:lang(zh-CN) h2{letter-spacing:0}
h3{font-size:1.125rem;font-weight:650;line-height:1.35}

.scenes{display:grid;gap:clamp(36px,5vw,40px) clamp(24px,3vw,40px);margin-top:clamp(28px,4vw,44px)}
.scene{display:grid;grid-template-rows:auto auto 1fr;gap:8px;min-width:0}
.scene p{color:var(--ink-2);max-width:34em}
.vis{display:flex;flex-direction:column;justify-content:center;gap:8px;height:148px;margin-bottom:12px;padding:16px 18px;border-radius:16px;background:var(--stage);font-size:.8125rem;line-height:1.5;overflow:hidden}
.vis-prompt{display:block;padding:10px 12px;border:1px solid var(--line);border-radius:10px;background:var(--surface);color:var(--ink)}
.vis-prompt span{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;line-clamp:4;overflow:hidden;-webkit-mask-image:linear-gradient(#000 55%,transparent);mask-image:linear-gradient(#000 55%,transparent)}
.bub{max-width:82%;padding:7px 12px;border-radius:14px;background:var(--surface);border:1px solid var(--line);color:var(--ink)}
.bub.me{align-self:flex-end;border-color:transparent;background:var(--accent-soft)}
.files,.files ul{display:grid;gap:3px}
.files{font-family:var(--mono);font-size:.78rem;color:var(--ink-2)}
.files li{display:flex;gap:10px;padding-left:16px}
.files li:last-child{color:var(--ink)}
.files small{font:inherit;font-family:var(--sans);color:var(--accent)}
@media (min-width:820px){.scenes{grid-template-columns:repeat(3,minmax(0,1fr))}}

.trust{display:grid;border-block:1px solid var(--line)}
.trust>div{padding-block:22px}
.trust>div+div{border-top:1px solid var(--line)}
.trust h3{font-size:1.25rem}
.trust p{margin-top:4px;color:var(--ink-2);font-size:.9375rem;max-width:30em}
@media (min-width:820px){
  .trust{grid-template-columns:repeat(3,minmax(0,1fr))}
  .trust>div{padding:28px clamp(20px,3vw,40px) 30px 0}
  .trust>div+div{border-top:0;border-left:1px solid var(--line);padding-left:clamp(20px,3vw,40px)}
}

.split{display:grid;gap:clamp(20px,3vw,32px)}
@media (min-width:900px){.split{grid-template-columns:minmax(0,4fr) minmax(0,8fr);gap:40px}}
.how{counter-reset:s;border-top:1px solid var(--line)}
.how li{counter-increment:s;display:grid;grid-template-columns:2.4rem minmax(0,1fr);gap:8px;padding-block:16px;border-bottom:1px solid var(--line)}
.how li::before{content:counter(s);color:var(--accent);font:650 1.0625rem/1.65 var(--display);font-variant-numeric:tabular-nums}
:lang(ko) .how li::before,:lang(zh-CN) .how li::before{line-height:1.75}
.how span{max-width:38em}
.faq{border-top:1px solid var(--line)}
.faq div{padding-block:18px;border-bottom:1px solid var(--line)}
.faq dt{font-weight:650}
.faq dd{margin-top:4px;color:var(--ink-2);max-width:38em}

.end{display:grid;gap:22px;justify-items:start;padding:clamp(24px,5vw,56px);border-radius:22px;background:var(--stage)}
.end h2{font-size:clamp(1.625rem,1.2rem + 2vw,2.5rem)}

@media (prefers-reduced-motion:reduce){
  /* the demo still plays, but with fades: no sliding keycap or mouse button, no blinking caret.
     The small level bar keeps moving (more slowly), because it is the "listening" signal. */
  .caret{animation:none!important}
  .demo[data-phase=rec] .mb-level i,.demo[data-phase=press2] .mb-level i{animation:level-soft 2.8s ease-in-out infinite}
  .demo .keycap{transition:background-color .15s,border-color .15s}
  .demo[data-phase=press1] .keycap,.demo[data-phase=press2] .keycap{transform:none;border-color:var(--accent);background:var(--accent-soft)}
  .demo .hold i{transform:scaleX(1);opacity:0;transition:opacity .3s}
  .demo[data-phase=press1] .hold i,.demo[data-phase=press2] .hold i{opacity:1;transition:opacity .3s}
  .demo .m-side{transition:fill .15s,stroke .15s}
  .demo[data-phase=press1] .m-side,.demo[data-phase=press2] .m-side{transform:none}
  .btn{transition:none}
}
`;

const privacyCss = `
.doc{max-width:46rem;padding-block:clamp(24px,5vw,56px) 0}
.doc h1{font-size:clamp(1.625rem,1.3rem + 1.4vw,2.125rem);font-weight:700;line-height:1.3;letter-spacing:-.015em;margin-bottom:6px}
.doc h2{font-size:1.1875rem;font-weight:650;line-height:1.4;margin:36px 0 8px}
.doc p,.doc ul{margin:0 0 14px}
.doc ul{padding-left:1.2em;list-style:disc}
.doc li{margin-bottom:10px}
.doc small{display:block;margin-bottom:22px;color:var(--ink-2);font-size:var(--fs-small)}
.doc hr{margin:56px 0;border:0;border-top:1px solid var(--line)}
.doc code{font:.9em var(--mono);padding:.1em .35em;border-radius:5px;background:var(--stage)}
`;

/* ---------------------------------------------------------------- script */

// Plays the hero demo: one "moment" (sentence + app + trigger) per loop, then the next.
// Without script the page shows the finished first moment. It autoplays for everyone (the
// Pause button is always there); with reduced motion the CSS swaps movement for plain fades.
const demoJs = `(function(){
var d=document.querySelector('[data-demo]');if(!d)return;
var M=JSON.parse(d.getAttribute('data-moments')),J=d.getAttribute('data-joiner'),
q=function(x){return d.querySelector(x)},apps=d.querySelectorAll('.app'),txt=q('.mb-text'),b=q('.toggle'),l=b.querySelector('span'),
m=0,w=[],s=[],i=0,t=0,live=false,paused=false,away=false;
function ph(p){return function(){d.setAttribute('data-phase',p)}}
function word(k){return function(){w[k].classList.add('on')}}
function load(k){var x=M[k],n=x.w.length,g=x.t==='mouse'?380:700,j,e;m=k;
d.setAttribute('data-scene',x.t);for(j=0;j<apps.length;j++)apps[j].classList.toggle('on',j===k);txt.textContent='';w=[];
for(j=0;j<n;j++){e=document.createElement('span');e.className='w';e.textContent=x.w[j];txt.appendChild(e);if(J&&j<n-1)txt.appendChild(document.createTextNode(J));w.push(e)}
s=[[ph('idle'),800],[ph('press1'),g],[ph('rec'),450]];
for(j=0;j<n;j++)s.push([word(j),j===n-1?600:Math.round(2500/n)]);
s.push([ph('press2'),g],[ph('done'),2700],[ph('out'),450])}
function label(){var p=!live||paused;l.textContent=b.getAttribute(p?'data-play':'data-pause');b.setAttribute('aria-label',b.getAttribute(p?'data-play-label':'data-pause-label'));b.classList.toggle('is-play',p)}
function run(){s[i][0]();t=setTimeout(next,s[i][1])}
function next(){if(++i>=s.length){load((m+1)%M.length);i=0;t=setTimeout(run,140)}else run()}
function sync(){var h=paused||away;clearTimeout(t);t=0;d.classList.toggle('is-paused',h);if(live&&!h)t=setTimeout(next,350)}
function start(){live=true;paused=false;d.classList.add('is-live');load(0);i=-1;label();sync()}
b.addEventListener('click',function(){paused=!paused;label();sync()});
b.hidden=false;start();
function seen(v){if(away===!v)return;away=!v;sync()}
if('IntersectionObserver' in window)new IntersectionObserver(function(e){seen(e[e.length-1].isIntersecting&&!document.hidden)},{threshold:.15}).observe(d);
document.addEventListener('visibilitychange',function(){if(document.hidden)seen(false);else{var r=d.getBoundingClientRect();seen(r.bottom>0&&r.top<innerHeight)}});
})();`;

/* ---------------------------------------------------------------- pieces */

const icons = {
  download:
    '<svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 2.5v9M5 8l4 4 4-4M3 15.5h12"/></svg>',
  // top view of a mouse; .m-side is the thumb button on its left edge
  mouse:
    '<svg class="mouse" viewBox="-14 0 82 88" width="62" height="67"><path class="m-tick" d="M-4 33l-7-4M-5 44h-8M-4 55l-7 4"/><rect class="m-side" x="0" y="31" width="16" height="26" rx="6"/><rect class="m-body" x="9" y="2" width="50" height="84" rx="25"/><path class="m-line" d="M34 2v30M9 32.5h50"/><rect class="m-body" x="30.5" y="10" width="7" height="14" rx="3.5"/></svg>',
  send: '<svg width="13" height="13" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true"><path d="M2 2.5l12 5.5-12 5.5 2.2-5.5z"/></svg>',
  up: '<svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8 13V3.5M3.8 7.5L8 3.3l4.2 4.2"/></svg>',
  mic: '<svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" aria-hidden="true"><rect x="5.75" y="1.5" width="4.5" height="8" rx="2.25"/><path d="M3 7.5a5 5 0 0 0 10 0M8 12.5v2"/></svg>',
};

function header(root, current, navLabel) {
  const links = Object.entries(langs)
    .map(([code, l]) => {
      const href = root + l.path || './';
      const cur = code === current ? ' aria-current="page"' : '';
      return `<a href="${href}" hreflang="${l.hreflang}" lang="${l.htmlLang}"${cur}>${l.label}</a>`;
    })
    .join('');
  const home = (current ? root + langs[current].path : root) || './';
  return `<header class="wrap top">
<a class="brand" href="${home}"><img src="${root}icon.svg" alt="" width="32" height="32">mulbit</a>
<nav class="lang" aria-label="${esc(navLabel)}">${links}</nav>
</header>`;
}

function footer(root, t) {
  const note = t ? `<p>${esc(t.footNote)}</p>` : '';
  const f = t ? t.footLinks : { github: 'GitHub', releases: 'Releases', privacy: 'Privacy Policy', terms: 'License' };
  return `<footer class="wrap"><div class="foot"><div class="foot-in">
<div>${note}<p>© 2026 philaxis · ${site.email}</p></div>
<ul><li><a href="${site.repo}">${esc(f.github)}</a></li><li><a href="${site.releases}">${esc(f.releases)}</a></li><li><a href="${root}privacy.html">${esc(f.privacy)}</a></li><li><a href="${site.license}">${esc(f.terms)}</a></li></ul>
</div></div></footer>`;
}

function cta(t) {
  return `<div class="cta">
<a class="btn" href="${site.download}">${icons.download}<span>${esc(t.cta)}</span></a>
<p class="cta-sub">${esc(t.ctaSub)} <span>${esc(t.ctaMeta)}</span></p>
</div>`;
}

const winCtl = '<span class="win-ctl"><i></i><i></i><i></i></span>';
const rail = '<div class="rail"><i></i><i></i><i></i><i></i></div>';
const code = 'async function upload(chunk) {\n  await api.put(chunk)\n}';

// One mock app per moment. Each is recognisable by its layout, and each puts the caret
// (and later the dictated sentence) where that kind of app takes text.
function app(m, joiner, on) {
  const line = `<p class="line"><span class="caret caret-a"></span><span class="landed">${esc(m.words.join(joiner))}</span><span class="caret caret-b"></span></p>`;
  const open = `<div class="app ${m.kind}${on ? ' on' : ''}">`;
  if (m.kind === 'mail')
    return `${open}<div class="win-bar"><span>${esc(m.title)}</span>${winCtl}</div><div class="app-body">
<div class="mail-row"><small>${esc(m.toLabel)}</small><span>${esc(m.to)}</span></div>
<div class="mail-row"><small>${esc(m.subjectLabel)}</small><span>${esc(m.subject)}</span></div>
<div class="mail-text"><p>${esc(m.greeting)}</p>${line}</div>
<span class="mail-send">${esc(m.send)}</span></div></div>`;
  if (m.kind === 'chat')
    return `${open}<div class="win-bar"><span class="who"><i class="av">${esc(m.initial)}</i>${esc(m.name)}</span>${winCtl}</div><div class="app-body">
<div class="chat-msg"><i class="av">${esc(m.initial)}</i><span class="chat-bub">${esc(m.incoming)}</span></div>
<div class="chat-in">${line}<span class="chat-send">${icons.send}</span></div></div></div>`;
  if (m.kind === 'ai')
    return `${open}<div class="win-bar"><span>${esc(m.title)}</span>${winCtl}</div><div class="split-body">${rail}<div class="app-body">
<small>${esc(m.answer)}</small><pre class="ai-code">${esc(code)}</pre>
<div class="ai-prompt">${line}<span class="ai-up">${icons.up}</span></div></div></div></div>`;
  const items = m.items.map((x, i) => `<div class="todo${i ? '' : ' done'}"><i></i><span>${esc(x)}</span></div>`).join('');
  return `${open}<div class="win-bar"><span>${esc(m.title)}</span>${winCtl}</div><div class="split-body">${rail}<div class="app-body">
<div class="note-head"><b>${esc(m.heading)}</b><small>${esc(m.date)}</small></div>${items}
<div class="todo"><i></i>${line}</div></div></div></div>`;
}

function demo(t) {
  const d = t.demo;
  const first = d.moments[0];
  const words = first.words.map((w) => `<span class="w">${esc(w)}</span>`).join(d.joiner);
  const li = (items) => items.map((x) => `<li>${x}</li>`).join('');
  const moments = JSON.stringify(d.moments.map((m) => ({ t: m.trigger, w: m.words })));
  return `<figure class="demo" data-demo data-scene="${first.trigger}" data-joiner="${esc(d.joiner)}" data-moments="${esc(moments)}">
<div class="stage" aria-hidden="true"><div class="stage-in">
<div class="win">
${d.moments.map((m, i) => app(m, d.joiner, i === 0)).join('\n')}
</div>
<div class="deck">
<div class="dev"><div class="key"><span class="keycap">G</span><span class="hold"><i></i></span></div>${icons.mouse}</div>
<div class="mb"><div class="mb-grip"></div><div class="mb-row"><span class="mb-dot"></span><span class="mb-level"><i></i></span>${icons.mic}</div><p class="mb-text">${words}</p></div>
</div>
</div></div>
<figcaption class="demo-cap">
<div class="steps-wrap"><ol class="steps s-key">${li(d.keyStepsHtml)}</ol><ol class="steps s-mouse">${li(d.mouseStepsHtml)}</ol></div>
<div class="cap-row"><p>${esc(d.result)}</p>
<button class="toggle" type="button" hidden aria-label="${esc(d.pauseLabel)}" data-pause="${esc(d.pause)}" data-play="${esc(d.play)}" data-pause-label="${esc(d.pauseLabel)}" data-play-label="${esc(d.playLabel)}"><i></i><span>${esc(d.pause)}</span></button></div>
<p class="cap-note">${esc(d.mouseNote)}</p>
</figcaption>
</figure>`;
}

function sceneVis(v) {
  if (v.prompt) return `<div class="vis" aria-hidden="true"><div class="vis-prompt"><span>${esc(v.prompt)}</span></div></div>`;
  if (v.incoming) return `<div class="vis" aria-hidden="true"><span class="bub">${esc(v.incoming)}</span><span class="bub me">${esc(v.outgoing)}</span></div>`;
  const end = new Date(site.lastmod + 'T00:00:00Z');
  const days = [2, 1, 0].map((n) => new Date(end - n * 864e5).toISOString().slice(0, 10));
  const rows = days.map((day, i) => `<li>${day}.md${i === 2 ? ` <small>${esc(v.today)}</small>` : ''}</li>`).join('');
  return `<div class="vis" aria-hidden="true"><div class="files"><span>${esc(v.folder)}</span><ul>${rows}</ul></div></div>`;
}

function jsonLd(code, t) {
  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: 'mulbit',
        alternateName: ['물빛', 'mulbit voice typing keyboard'],
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Windows 10, Windows 11',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
        isAccessibleForFree: true,
        description: t.description,
        url: url(code),
        image: `${site.base}og-${code}.png`,
        downloadUrl: site.download,
        inLanguage: t.htmlLang,
        author: { '@type': 'Person', name: 'philaxis' },
      },
      {
        '@type': 'FAQPage',
        mainEntity: t.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
      },
    ],
  };
  return JSON.stringify(data).replace(/</g, '\\u003c');
}

function head(code, t, root) {
  const alternates = Object.entries(langs)
    .map(([c, l]) => `<link rel="alternate" hreflang="${l.hreflang}" href="${url(c)}">`)
    .join('\n');
  const ogAlt = Object.entries(langs)
    .filter(([c]) => c !== code)
    .map(([, l]) => `<meta property="og:locale:alternate" content="${l.ogLocale}">`)
    .join('\n');
  const img = `${site.base}og-${code}.png`;
  return `<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(t.title)}</title>
<meta name="description" content="${esc(t.description)}">
<meta name="keywords" content="${esc(t.keywords)}">
<link rel="canonical" href="${url(code)}">
${alternates}
<link rel="alternate" hreflang="x-default" href="${url('en')}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="mulbit">
<meta property="og:title" content="${esc(t.title)}">
<meta property="og:description" content="${esc(t.description)}">
<meta property="og:url" content="${url(code)}">
<meta property="og:locale" content="${t.ogLocale}">
${ogAlt}
<meta property="og:image" content="${img}">
<meta property="og:image:type" content="image/png">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta property="og:image:alt" content="${esc(t.ogAlt)}">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(t.title)}">
<meta name="twitter:description" content="${esc(t.description)}">
<meta name="twitter:image" content="${img}">
<meta name="twitter:image:alt" content="${esc(t.ogAlt)}">
<meta name="theme-color" content="#f3f6f8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#101216" media="(prefers-color-scheme: dark)">
<link rel="icon" href="${root}icon.svg" type="image/svg+xml">
<script type="application/ld+json">${jsonLd(code, t)}</script>
<style>${min(baseCss + homeCss)}</style>`;
}

function page(code) {
  const t = langs[code];
  const root = t.path ? '../' : '';
  const h1 = t.h1Html;
  const scenes = t.scenes
    .map((s) => `<div class="scene">${sceneVis(s.vis)}<h3>${esc(s.title)}</h3><p>${esc(s.text)}</p></div>`)
    .join('\n');
  const trust = t.trust.map((x) => `<div><h3>${esc(x.title)}</h3><p>${esc(x.text)}</p></div>`).join('\n');
  const how = t.startHtml.map((s) => `<li><span>${s}</span></li>`).join('\n');
  const faq = t.faq.map(([q, a]) => `<div><dt>${esc(q)}</dt><dd>${esc(a)}</dd></div>`).join('\n');
  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
${head(code, t, root)}
</head>
<body>
${header(root, code, t.langNav)}
<main class="wrap">
<section class="hero">
<div class="hero-copy">
<h1>${h1}</h1>
<p class="lead">${esc(t.lead)}</p>
${cta(t)}
</div>
${demo(t)}
</section>
<section class="section" aria-labelledby="scenes">
<h2 id="scenes">${esc(t.scenesTitle)}</h2>
<div class="scenes">
${scenes}
</div>
</section>
<section class="section" aria-labelledby="trust">
<h2 id="trust" class="vh">${esc(t.trustTitle)}</h2>
<div class="trust">
${trust}
</div>
</section>
<section class="section split" aria-labelledby="start">
<h2 id="start">${esc(t.startTitle)}</h2>
<ol class="how">
${how}
</ol>
</section>
<section class="section split" aria-labelledby="faq">
<h2 id="faq">${esc(t.faqTitle)}</h2>
<dl class="faq">
${faq}
</dl>
</section>
<section class="section end" aria-labelledby="end">
<h2 id="end">${esc(t.endTitle)}</h2>
${cta(t)}
</section>
</main>
${footer(root, t)}
<script>${demoJs}</script>
</body>
</html>
`;
}

function privacy() {
  const body = readFileSync(join(here, 'privacy-body.html'), 'utf8').trim();
  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>mulbit 개인정보처리방침 · Privacy Policy</title>
<link rel="canonical" href="${site.base}privacy.html">
<meta name="theme-color" content="#f3f6f8" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#101216" media="(prefers-color-scheme: dark)">
<link rel="icon" href="icon.svg" type="image/svg+xml">
<style>${min(baseCss + privacyCss)}</style>
</head>
<body>
${header('', null, 'Language')}
<main class="wrap"><article class="doc">
${body}
</article></main>
${footer('', null)}
</body>
</html>
`;
}

function sitemap() {
  const alts = Object.entries(langs)
    .map(([c, l]) => `<xhtml:link rel="alternate" hreflang="${l.hreflang}" href="${url(c)}"/>`)
    .join('');
  const xdef = `<xhtml:link rel="alternate" hreflang="x-default" href="${url('en')}"/>`;
  const rows = Object.keys(langs)
    .map((c) => `<url><loc>${url(c)}</loc>${alts}${xdef}<lastmod>${site.lastmod}</lastmod></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${rows}
<url><loc>${site.base}privacy.html</loc><lastmod>${site.lastmod}</lastmod></url>
</urlset>
`;
}

for (const code of Object.keys(langs)) {
  const dir = join(out, langs[code].path);
  mkdirSync(dir, { recursive: true });
  const html = page(code);
  writeFileSync(join(dir, 'index.html'), html);
  console.log(`${langs[code].path}index.html  ${Buffer.byteLength(html)} bytes`);
}
writeFileSync(join(out, 'privacy.html'), privacy());
writeFileSync(join(out, 'sitemap.xml'), sitemap());
console.log('privacy.html, sitemap.xml');
