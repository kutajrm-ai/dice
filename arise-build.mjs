// DICE-ARISE page: built after build.mjs. Uses the Voter Education page's header and footer as the
// frame, writes public/arise.html, and adds an "ARISE" link next to Voter Education in every page's
// header and footer menus.
import fs from 'fs';

const APP = 'https://dicearise-mobile.vercel.app';
const TITLE = 'DICE-ARISE — Citizen Election Monitoring';
const DESC = 'DICE-ARISE (Automated Results & Incident Surveillance Engine) lets trained citizen observers transmit polling-unit results from the EC8A and report election-day incidents with photo evidence.';

const CSS = `<style>
.ar{--g900:#0A3D22;--g800:#0B4A2A;--g600:#1E8A3E;--lime:#8DC63F;--amber:#E8A317;--ink:#10241A;--muted:#4A5D51;--line:#DCE3D6;--paper:#F6F7F2;--soft:#F0F5EC;color:var(--ink);font-family:'Public Sans',system-ui,sans-serif;line-height:1.6}
.ar *{box-sizing:border-box}
.ar h1,.ar h2,.ar h3{font-family:Archivo,'Public Sans',sans-serif;line-height:1.15;margin:0 0 .5em;color:var(--ink)}
.ar p{margin:0 0 1em}
.ar a{color:var(--g600)}
.ar-w{max-width:1120px;margin:0 auto;padding:0 20px}
.ar-hero{background:linear-gradient(135deg,var(--g900),var(--g800) 60%,#11603a);color:#fff;padding:72px 0 64px;position:relative;overflow:hidden}
.ar-hero:after{content:"";position:absolute;right:-120px;top:-120px;width:420px;height:420px;border-radius:50%;border:56px solid rgba(141,198,63,.12)}
.ar-hero h1{color:#fff;font-size:clamp(2rem,5vw,3.4rem);font-weight:800;max-width:15ch}
.ar-hero p{color:rgba(255,255,255,.86);font-size:1.12rem;max-width:60ch}
.ar-eye{display:inline-block;font-family:Archivo,sans-serif;font-weight:700;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;color:var(--lime);margin-bottom:14px}
.ar-cta{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px;position:relative;z-index:1}
.ar-btn{display:inline-flex;align-items:center;gap:8px;padding:13px 22px;border-radius:999px;font-weight:700;text-decoration:none;font-family:Archivo,sans-serif}
.ar .ar-btn-p{background:var(--lime);color:var(--g900)}
.ar .ar-btn-g{border:2px solid rgba(255,255,255,.5);color:#fff}
.ar .ar-btn-d{background:var(--g800);color:#fff}
.ar-sec{padding:64px 0;border-bottom:1px solid var(--line)}
.ar-sec.alt{background:var(--paper)}
.ar-sec h2{font-size:clamp(1.5rem,3vw,2.1rem);font-weight:800}
.ar-lede{color:var(--muted);font-size:1.06rem;max-width:68ch}
.ar-grid{display:grid;gap:18px;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));margin-top:28px}
.ar-card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:22px}
.ar-card h3{font-size:1.1rem;margin-bottom:.35em}
.ar-card p{color:var(--muted);font-size:.95rem;margin:0}
.ar-tag{display:inline-block;font-size:.72rem;font-weight:700;letter-spacing:.08em;text-transform:uppercase;color:var(--g600);background:var(--soft);padding:3px 9px;border-radius:999px;margin-bottom:10px}
.ar-steps{counter-reset:s;list-style:none;padding:0;margin:28px 0 0;display:grid;gap:14px}
.ar-steps li{counter-increment:s;display:grid;grid-template-columns:44px 1fr;gap:14px;align-items:start;background:#fff;border:1px solid var(--line);border-radius:14px;padding:18px}
.ar-steps li:before{content:counter(s);width:44px;height:44px;border-radius:50%;background:var(--g800);color:#fff;font-family:Archivo,sans-serif;font-weight:800;display:grid;place-items:center}
.ar-steps strong{display:block;font-family:Archivo,sans-serif}
.ar-steps span{color:var(--muted);font-size:.95rem}
.ar-list{columns:2 240px;column-gap:28px;padding-left:1.1em;margin:20px 0 0}
.ar-list li{margin-bottom:8px;break-inside:avoid}
.ar-note{border-left:4px solid var(--amber);background:#FEF6E7;padding:14px 18px;border-radius:8px;margin-top:24px;color:#5c3d00}
.ar details{background:#fff;border:1px solid var(--line);border-radius:12px;padding:16px 18px;margin-top:12px}
.ar summary{cursor:pointer;font-weight:700;font-family:Archivo,sans-serif}
.ar details p{margin:.7em 0 0;color:var(--muted)}
.ar-band{background:var(--g900);color:#fff;padding:56px 0;text-align:center}
.ar-band h2{color:#fff}
.ar-band p{color:rgba(255,255,255,.85);max-width:56ch;margin:0 auto 22px}
@media (max-width:600px){.ar-hero{padding:52px 0 44px}.ar-sec{padding:44px 0}}
</style>`;

const MAIN = `<main id="main" class="ar">
<section class="ar-hero"><div class="ar-w">
<span class="ar-eye">DICE-ARISE · Automated Results &amp; Incident Surveillance Engine</span>
<h1>Every polling unit, watched by citizens.</h1>
<p>DICE-ARISE is DICE's citizen election-monitoring platform. Trained observers send polling-unit results straight from the posted EC8A result sheet and report incidents as they happen — each backed by a photo — to a central situation room.</p>
<div class="ar-cta">
<a class="ar-btn ar-btn-p" href="${APP}" target="_blank" rel="noopener">Open the observer app →</a>
<a class="ar-btn ar-btn-g" href="#how">How it works</a>
</div>
</div></section>

<section class="ar-sec"><div class="ar-w">
<h2>What ARISE does</h2>
<p class="ar-lede">ARISE turns thousands of citizens at polling units into one clear, evidence-based picture of election day. It is built around five modules.</p>
<div class="ar-grid">
<div class="ar-card"><span class="ar-tag">Results</span><h3>ARISE Results</h3><p>Observers capture the scores on the EC8A posted at the polling unit, with a photo of the sheet, for independent tallying.</p></div>
<div class="ar-card"><span class="ar-tag">Incidents</span><h3>ARISE Incidents</h3><p>Report late materials, BVAS problems, vote buying, violence and other irregularities with photos and location.</p></div>
<div class="ar-card"><span class="ar-tag">Alerts</span><h3>ARISE Alerts</h3><p>Serious incidents are flagged to the situation room so they can be escalated quickly to the right authorities.</p></div>
<div class="ar-card"><span class="ar-tag">Dashboard</span><h3>ARISE Dashboard</h3><p>A live view of reporting coverage, results received and incidents by state, LGA, ward and polling unit.</p></div>
<div class="ar-card"><span class="ar-tag">Reports</span><h3>ARISE Reports</h3><p>Verified findings published as statements and post-election reports to support transparency and reform.</p></div>
</div>
</div></section>

<section class="ar-sec alt" id="how"><div class="ar-w">
<h2>How it works</h2>
<p class="ar-lede">The observer app runs in the phone's browser and can be added to the home screen — no app-store download needed.</p>
<ol class="ar-steps">
<li><div><strong>Sign in</strong><span>Use your first name and Nigerian phone number on the DICE-ARISE observer app.</span></div></li>
<li><div><strong>Go to your assigned polling unit</strong><span>Observe accreditation and voting calmly and without interference.</span></div></li>
<li><div><strong>Report incidents as they happen</strong><span>Pick the incident type, add a short description and a photo, and send.</span></div></li>
<li><div><strong>Transmit the result</strong><span>After counting, photograph the signed EC8A once it is posted, enter the party scores, and submit.</span></div></li>
<li><div><strong>Verification and reporting</strong><span>The DICE situation room checks each submission against its photo before it is used in the dashboard or any public report.</span></div></li>
</ol>
</div></section>

<section class="ar-sec"><div class="ar-w">
<h2>What to report</h2>
<p class="ar-lede">Report what you see yourself. Stick to facts, times and places.</p>
<ul class="ar-list">
<li>Late arrival or shortage of election materials</li>
<li>BVAS malfunction or accreditation delays</li>
<li>Vote buying or inducement near the polling unit</li>
<li>Violence, intimidation or thuggery</li>
<li>Ballot box snatching or stuffing</li>
<li>Voters turned away or unable to find their names</li>
<li>Obstruction of observers, agents or the media</li>
<li>Result sheet not posted, altered or not signed</li>
<li>Difficulties for persons with disabilities, the elderly or nursing mothers</li>
<li>Any other irregularity affecting the vote</li>
</ul>
<div class="ar-note"><strong>Stay safe.</strong> Your safety comes first. Do not confront anyone or take photos where it puts you at risk — move away and report when it is safe.</div>
</div></section>

<section class="ar-sec alt"><div class="ar-w">
<h2>Our principles</h2>
<div class="ar-grid">
<div class="ar-card"><h3>Non-partisan</h3><p>ARISE serves no party or candidate. Observers report facts, not preferences.</p></div>
<div class="ar-card"><h3>Evidence first</h3><p>Every result and incident carries a photo, so findings can be checked.</p></div>
<div class="ar-card"><h3>Complements INEC</h3><p>ARISE does not declare results. INEC's declared results and IReV remain the official record; ARISE provides independent citizen verification.</p></div>
<div class="ar-card"><h3>Privacy</h3><p>Observer phone numbers are used only for sign-in and coordination, never published.</p></div>
</div>
</div></section>

<section class="ar-sec"><div class="ar-w">
<h2>Questions</h2>
<details><summary>Are ARISE results official?</summary><p>No. Only INEC declares election results. ARISE results are an independent citizen record taken from the EC8A posted at each polling unit, used to check that results are transmitted and collated faithfully.</p></details>
<details><summary>Who can be an ARISE observer?</summary><p>Observers are recruited and trained by DICE. To volunteer, contact DICE and you will be told when recruitment and training open in your area.</p></details>
<details><summary>Do I need internet at the polling unit?</summary><p>A data connection is needed to send. If the network is poor, keep the app open and send again once you have a signal.</p></details>
<details><summary>What happens to my report?</summary><p>It goes to the DICE situation room, where it is checked against its photo. Serious incidents are escalated; verified findings feed the dashboard and DICE's public reports.</p></details>
</div></section>

<section class="ar-band"><div class="ar-w">
<h2>Be the eyes of your polling unit</h2>
<p>Credible elections need citizens who watch, record and report. Join DICE-ARISE.</p>
<a class="ar-btn ar-btn-p" href="${APP}" target="_blank" rel="noopener">Open the observer app →</a>
</div></section>
</main>`;

const pub = 'public/';
const tplName = ['voter-education.html', 'candidates.html', 'results.html'].find(f => fs.existsSync(pub + f));
let page;
if (tplName) {
  const t = fs.readFileSync(pub + tplName, 'utf8');
  const hEnd = t.indexOf('</header>');
  const fStart = t.lastIndexOf('<footer');
  if (hEnd > 0 && fStart > hEnd) {
    let head = t.slice(0, hEnd + 9);
    head = head.replace(/<title>[\s\S]*?<\/title>/, `<title>${TITLE}</title>`)
      .replace(/(<meta name="description" content=")[^"]*/, `$1${DESC}`)
      .replace(/(<meta property="og:title" content=")[^"]*/, `$1${TITLE}`)
      .replace(/(<meta property="og:description" content=")[^"]*/, `$1${DESC}`)
      .replace('</head>', CSS + '\n</head>')
      .replace(/\s*aria-current="page"/g, '')
      .replace(/<a\b[^>]*href="\/voter-education(?:\.html)?"[^>]*>/g, a => a.replace(/\b(is-)?(active|current)\b/g, ''));
    page = head + '\n' + MAIN + '\n' + t.slice(fStart);
  }
}
if (!page) {
  page = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${TITLE}</title><meta name="description" content="${DESC}"><link rel="icon" type="image/png" href="/favicon.png"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Archivo:wght@500;600;700;800&family=Public+Sans:wght@400;500;600;700&display=swap"><link rel="stylesheet" href="/styles.css">${CSS}</head><body><div class="ar"><div class="ar-w" style="padding:14px 20px"><a href="/" style="font-weight:800;text-decoration:none">← DICE home</a></div></div>${MAIN}</body></html>`;
  console.log('arise: template not found, built standalone page');
}
fs.writeFileSync(pub + 'arise.html', page);

// Menu link: clone the Voter Education link (or its <li>) inside the header and footer.
const linkRe = /href="\/voter-education(?:\.html)?"/;
function addLink(seg) {
  if (seg.includes('href="/arise"')) return seg;
  let out = '', rest = seg;
  for (;;) {
    const m = rest.match(linkRe);
    if (!m) { out += rest; break; }
    const aStart = rest.lastIndexOf('<a', m.index);
    const aEnd = rest.indexOf('</a>', m.index) + 4;
    let s = aStart, e = aEnd;
    const liStart = rest.lastIndexOf('<li', aStart), liClose = rest.lastIndexOf('</li>', aStart);
    if (liStart >= 0 && liStart > liClose) {
      const liEnd = rest.indexOf('</li>', aEnd);
      if (liEnd >= 0 && rest.lastIndexOf('<li', liEnd) === liStart) { s = liStart; e = liEnd + 5; }
    }
    const el = rest.slice(s, e);
    let clone = el.replace(linkRe, 'href="/arise"').replace(/\s*aria-current="[^"]*"/g, '').replace(/\b(is-)?active\b/g, '');
    clone = /Voter Education/i.test(clone) ? clone.replace(/Voter Education/gi, 'DICE-ARISE') : clone.replace(/>([^<>]+)<\/a>/, '>DICE-ARISE</a>');
    out += rest.slice(0, e) + clone;
    rest = rest.slice(e);
  }
  return out;
}
let n = 0;
for (const f of fs.readdirSync(pub).filter(f => f.endsWith('.html'))) {
  let t = fs.readFileSync(pub + f, 'utf8');
  const before = t;
  const h0 = t.indexOf('<header'), h1 = t.indexOf('</header>');
  if (h0 >= 0 && h1 > h0) t = t.slice(0, h0) + addLink(t.slice(h0, h1)) + t.slice(h1);
  const f0 = t.lastIndexOf('<footer'), f1 = t.indexOf('</footer>', f0);
  if (f0 >= 0 && f1 > f0) t = t.slice(0, f0) + addLink(t.slice(f0, f1)) + t.slice(f1);
  if (f === 'arise.html') t = t.replace(/(<a\b[^>]*href="\/arise")/, '$1 aria-current="page"');
  if (t !== before) { fs.writeFileSync(pub + f, t); n++; }
}
for (const f of ['arise-build.mjs']) fs.rmSync(pub + f, { force: true });
console.log(`arise: wrote public/arise.html (frame: ${tplName || 'standalone'}), menu link added on ${n} pages`);
