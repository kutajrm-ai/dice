// Build step: copy the static site into public/ and point the menu, footer and home tile at the Voter Register page.
import fs from 'fs';
import { createHash } from 'crypto';
import { execFileSync } from 'child_process';
const skip = new Set(['api', 'node_modules', 'public', 'package.json', 'package-lock.json', 'vercel.json', 'build.mjs', 'vr-patch.json', 'y27-main.html']);
fs.rmSync('public', { recursive: true, force: true });
fs.mkdirSync('public');
for (const n of fs.readdirSync('.')) {
  if (skip.has(n) || n.startsWith('.')) continue;
  fs.cpSync(n, 'public/' + n, { recursive: true });
}
// Voter Register: real PWD headings and the age section (2023 register statistics).
if (fs.existsSync('vr-patch.json')) for (const [f, from, to] of JSON.parse(fs.readFileSync('vr-patch.json', 'utf8'))) {
  const p = 'public/' + f, t = fs.readFileSync(p, 'utf8');
  if (t.split(from).length !== 2) { console.log('vr patch skipped:', f, from.slice(0, 60)); continue; }
  fs.writeFileSync(p, t.replace(from, () => to));
}
// 2027 Elections hub page: the constituencies page's header and footer around the content in y27-main.html.
if (fs.existsSync('y27-main.html') && fs.existsSync('public/constituencies.html')) {
  const c = fs.readFileSync('public/constituencies.html', 'utf8');
  const t27 = '2027 General Elections — DICE Election Data';
  const d27 = 'Everything on DICE about Nigeria’s 2027 general elections: dates, countdown, seats on the ballot, candidates, constituencies, the voter register and how to be vote ready.';
  let h27 = c.slice(0, c.indexOf('<main>') + 6) + fs.readFileSync('y27-main.html', 'utf8') + c.slice(c.indexOf('</main>'));
  h27 = h27.replace(/<title>[^<]*<\/title>/, () => '<title>' + t27 + '</title>')
    .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*/g, (m, a) => a + d27)
    .replace(/(<meta property="og:title" content=")[^"]*/, (m, a) => a + t27)
    .replace(/<script src="https:\/\/cdnjs[^"]*" defer><\/script>\n/g, '').replace('<script src="/constituencies.js" defer></script>\n', '');
  fs.writeFileSync('public/2027.html', h27);
}
// Offline page for the app (shown when a page that was never opened is requested without a connection).
if (fs.existsSync('public/constituencies.html')) {
  const c = fs.readFileSync('public/constituencies.html', 'utf8');
  const off = '<section style="background: #F6F7F4"><div style="max-width: 720px; margin: 0 auto; padding: 96px 24px; display: flex; flex-direction: column; gap: 16px; align-items: flex-start">'
    + '<h1 style="margin: 0; font-family: Archivo, sans-serif; font-size: clamp(32px, 5vw, 48px); color: #0B4A2A">You are offline</h1>'
    + '<p style="margin: 0; font-size: 18px; color: #55605A">This page has not been saved on this device yet. Pages you have already opened still work without a connection. Reconnect to see the latest figures.</p>'
    + '<a href="/" style="font-weight: 700; color: #FFFFFF; background: #13693A; padding: 12px 22px; border-radius: 999px; text-decoration: none">Go to the home page</a></div></section>';
  let o = c.slice(0, c.indexOf('<main>') + 6) + off + c.slice(c.indexOf('</main>'));
  o = o.replace(/<title>[^<]*<\/title>/, '<title>Offline — DICE Election Data</title>')
    .replace(/<script src="https:\/\/cdnjs[^"]*" defer><\/script>\n/g, '').replace('<script src="/constituencies.js" defer></script>\n', '');
  fs.writeFileSync('public/offline.html', o);
}
for (const h of fs.readdirSync('public').filter(n => n.endsWith('.html'))) {
  const p = h.slice(0, -5), f = 'public/' + h;
  let s = fs.readFileSync(f, 'utf8');
  s = s.replace(/>Results analysis<\/span><span class="([^"]*)">[^<]*</g, '>Election Results</span><span class="$1">2019 &amp; 2023 by state &amp; LGA<')
    .replace(/href="\/results">Results analysis</g, 'href="/results">Election Results<')
    .replace(/>Results analysis<\/span>/g, '>Election Results</span>')
    .replace(/2023: winner polled 36.61% of valid votes/, '2019 &amp; 2023 presidential · state &amp; LGA');
  s = s.replace(/<a href="\/registration" class="dd-item ([^"]*)"><span class="([^"]*)">Voter registration<\/span><span class="([^"]*)">[^<]*<\/span>/,
    '<a href="/voter-register" class="dd-item $1"><span class="$2">Voter Register</span><span class="$3">Polling units &amp; 2019–2023 growth</span>');
  const i = s.lastIndexOf('<footer');
  if (i > 0) s = s.slice(0, i) + s.slice(i).replace(/<a class="([^"]*)" href="\/registration">Voter registration<\/a>/, '<a class="$1" href="/voter-register">Voter Register</a>');
  s = s.replace(/<a href="\/registration" class="tile /, '<a href="/voter-register" class="tile ');
  s = s.replace(/(<a href="\/voter-register" class="dd-item ([^"]*)"><span class="([^"]*)">Voter Register<\/span><span class="([^"]*)">[^<]*<\/span><\/a>)(?![\s\S]{0,40}\/constituencies)/,
    '$1<a href="/constituencies" class="dd-item $2"><span class="$3">Electoral Constituency</span><span class="$4">Senatorial, federal &amp; state constituencies</span></a>');
  const fi = s.lastIndexOf('<footer');
  if (fi > 0 && !s.slice(fi).includes('href="/constituencies"')) s = s.slice(0, fi) + s.slice(fi).replace(/(<a class="([^"]*)" href="\/voter-register">Voter Register<\/a>)/, '$1<a class="$2" href="/constituencies">Electoral Constituency</a>');
  if (p === 'index' && !s.includes('Electoral Constituency</span></span>')) {
    s = s.replace(/<a href="\/#observation" class="tile ([^"]*)">/, '<a href="/#observation" class="tile $1" style="grid-column: span 1">');
    const tile = '<a href="/constituencies" class="tile" style="position: relative; grid-column: span 1; grid-row: span 1; background: #E6F2E3; color: #0B4A2A; padding: 20px 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; border-radius: 4px; overflow: hidden; text-decoration: none">\n'
      + '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#0B4A2A" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink: 0"><path d="M3 6.5l5.5-2.5 7 2.5L21 4v13.5l-5.5 2.5-7-2.5L3 20z"></path><path d="M8.5 4v13.5M15.5 6.5V20"></path></svg>\n'
      + '<span style="display: flex; flex-direction: column; gap: 4px"><span class="tile-t" style="font-family: Archivo, sans-serif; font-weight: 700; font-size: 22px; line-height: 1.15">Electoral Constituency</span><span class="tile-d" style="font-size: 14px; opacity: 0.92; line-height: 1.4">109 senatorial · 360 federal · 993 state</span></span>\n</a>';
    const j = s.indexOf('<a href="/#observation" class="tile ');
    const e = j < 0 ? -1 : s.indexOf('</a>', j);
    if (e > 0) s = s.slice(0, e + 4) + '\n' + tile + s.slice(e + 4);
  }
  if (p === 'index' && !s.includes('Election Guidelines</span>')) {
    // Eighth tile, then a 4 x 2 grid of square tiles with a white outline.
    const act = '<div class="tile tile-soon" style="position: relative; background: #0B2E1C; color: #FFFFFF; padding: 20px 22px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; overflow: hidden">\n'
      + '<span style="position: absolute; top: 14px; right: 14px; font-size: 11px; font-weight: 800; letter-spacing: .06em; text-transform: uppercase; background: #F2B91C; color: #2B2105; padding: 3px 9px; border-radius: 999px">Coming soon</span>\n'
      + '<svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="flex-shrink: 0"><path d="M12 3v18M7 21h10"></path><path d="M4 7h16"></path><path d="M6.5 7L3.5 13.5a3 3 0 006 0zM17.5 7l-3 6.5a3 3 0 006 0z"></path></svg>\n'
      + '<span style="display: flex; flex-direction: column; gap: 4px"><span class="tile-t" style="font-family: Archivo, sans-serif; font-weight: 700; font-size: 22px; line-height: 1.15">Electoral Act &amp; Election Guidelines</span><span class="tile-d" style="font-size: 14px; opacity: 0.92; line-height: 1.4">The law and INEC rules for elections in Nigeria</span></span>\n</div>';
    const j2 = s.indexOf('<a href="/constituencies" class="tile"');
    const e2 = j2 < 0 ? -1 : s.indexOf('</a>', j2);
    if (e2 > 0) s = s.slice(0, e2 + 4) + '\n' + act + s.slice(e2 + 4);
    const css = '<style id="tiles-8">'
      + 'section[aria-label="Quick access"]{background:#F6F7F4!important}'
      + '.tiles{grid-template-columns:repeat(4,minmax(0,1fr))!important;grid-auto-rows:auto!important;gap:18px!important;padding:4px}'
      + '.tiles>.tile{grid-column:span 1!important;grid-row:span 1!important;aspect-ratio:1/1;min-width:0;border-radius:12px!important;box-shadow:0 0 0 4px #FFFFFF,0 10px 26px rgba(11,46,28,.16)}'
      + '.tiles>.tile-soon{cursor:default}'
      + '.tiles .saa940e{font-size:clamp(40px,4.6vw,60px)!important}.tiles .sd25ffc>svg{display:none}.tiles .sd25ffc .sdf2469{font-size:14px}'
      + '.tiles .sd25ffc .sd3a919{font-size:12.5px!important;line-height:1.35}'
      + '@media (max-width:1000px){.tiles .sd25ffc .sd3a919{display:none}.tiles .sd91a71,.tiles .tile-t{font-size:19px!important}.tiles .sd3a919,.tiles .tile-d{font-size:13px!important}.tiles>.tile{padding:16px!important}}'
      + '@media (max-width:760px){.tiles{grid-template-columns:repeat(2,minmax(0,1fr))!important;gap:14px!important}.tiles .sd3a919,.tiles .tile-d,.tiles .sd25ffc .sd3a919{display:none}.tiles svg{width:30px;height:30px}.tiles .saa940e{font-size:48px!important}.tiles .sd91a71,.tiles .tile-t{font-size:17px!important}.tiles>.tile{padding:14px!important}.tile-soon>span:first-child{top:10px!important;right:10px!important;font-size:9px!important;padding:2px 7px!important}}'
      + '</style>';
    s = s.replace('</head>', css + '\n</head>');
  }
  // 2027 Elections hub: menu and footer entry, countdown tile link, and a logo 50% larger (50px -> 75px).
  if (!s.includes('href="/2027" class="dd-item')) s = s.replace(/(<div class="[^"]*" id="dd-panel" hidden>\s*)<a href="\/results" class="dd-item ([^"]*)"><span class="([^"]*)">([^<]*)<\/span><span class="([^"]*)">/,
    '$1<a href="/2027" class="dd-item $2"><span class="$3">2027 Elections</span><span class="$5">Dates, seats, candidates &amp; more</span></a><a href="/results" class="dd-item $2"><span class="$3">$4</span><span class="$5">');
  const f27 = s.lastIndexOf('<footer');
  if (f27 > 0 && !s.slice(f27).includes('href="/2027"')) s = s.slice(0, f27) + s.slice(f27).replace(/<a class="([^"]*)" href="\/results">/, '<a class="$1" href="/2027">2027 Elections</a><a class="$1" href="/results">');
  if (p === 'index') s = s.replace('<a href="/#vote-ready" class="tile sd25ffc">', '<a href="/2027" class="tile sd25ffc">');
  if (!s.includes('id="logo-15"')) s = s.replace('</head>', '<style id="logo-15">.s99ea85{height:75px!important}@media (max-width:420px){.s99ea85{height:64px!important}}</style>\n</head>');
  // Installable app (PWA): manifest, icons and Apple home-screen tags, plus the install helper on every page.
  if (!s.includes('rel="manifest"')) s = s.replace('</head>', '<link rel="manifest" href="/manifest.webmanifest">\n<link rel="apple-touch-icon" href="/apple-touch-icon.png">\n<meta name="application-name" content="DICE">\n<meta name="apple-mobile-web-app-title" content="DICE">\n<meta name="mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-capable" content="yes">\n<meta name="apple-mobile-web-app-status-bar-style" content="default">\n<meta name="msapplication-TileColor" content="#0B4A2A">\n</head>');
  if (!s.includes('/pwa.js')) s = s.replace('</body>', '<script src="/pwa.js" defer></script>\n</body>');
  fs.writeFileSync(f, s);
  console.log('patched', f, (s.match(/\/voter-register/g) || []).length);
}
console.log('public:', fs.readdirSync('public').join(' '));

// Map boundaries: download geoBoundaries NGA ADM2 (CC BY 4.0), tag each LGA with its INEC state/LGA code, build TopoJSON.
const GEO_URL = 'https://media.githubusercontent.com/media/wmgeolab/geoBoundaries/main/releaseData/gbOpen/NGA/ADM2/geoBoundaries-NGA-ADM2_simplified.geojson';
const GEO_SHA1 = '3b26497eeb02c4406ea160305ffe58df840b6be9';
const CODES = [
  '03020602320832050903032509040909032706073018301332182713030806042810060110232807340710040204341534010220022103173410301127013207102510243204292229210305032414153217140503140321033003011411140914133223',
  '29152903290432023016301730191412110234031414231506053206033103122302302022073511220637062311360235133606190132222104331130331723321014100608230605013219170334121205291230282305360914011101231617043413',
  '33151937370223031807170933013310210722133316202910061108211618161808331314171806030933173323080720282033202720091927181720343322330617122106211802160805181008081823211217271813020908241403082508092220',
  '08063320340405020812032902120215120935050823351408110810021135083416302703200202031812170814340808170205020619413032021932013605082733143516020302083402021728140804031308213507120405173512031105040508',
  '08263203021810143212360435033506351502100213021412160207193120311111360820111920200719101917330236141943331917202008191220163209190419321938030727052103192420021003081814071911350103160803330436072415',
  '20181930031536122110360319351934200303030323192135022114241419281722203019132101194233182111202119092102030619020822192517172025141617061711182217190520322005160506140417050328260119031812261020172119',
  '26030513210821052019051024052815051905122026182005033504370417253007200523070507171527031914181534141919322110202109171612033305301212111402302422100515340920010319202017080509121028053214032605140603',
  '19220606170720241105340622192811200420121218172610191213182135102816100813161905370530302023172405182806180422170418070219073601193920151022280810130404241627200906191620061207050522092309300528032013',
  '18181018190620141908350919181702101710072420191523132419192919333517220417142022120618092010340517011944180528092613330327043613230421212221221122182813240119232310181917212212290818031311192617103610',
  '15043321231424180801131537031811370134112117180121151802212018140201011629241627250904110101271627080718151013011602220316140703071109111308011301140415010416190511250708191501072216031606291604211305',
  '04021601131216110902010907120706091601100419070125122909162604100107150507092617010226072717150227100719090116052928330816152913091216203114161230261408071629053611162204050905011728170414280229180413',
  '16181506162525051112130716091313161601080713070529110106091715030408011129262513290609180401090804170721330927182914010327110820090715081303231216040815250229290913120129301314161307140704091416212923',
  '04060720011529250412291915072920110425082709101216082216151113061310161707102910070809100409130901122927251029071103162404030723290204160105250622011623271925042712291725031509070713021607130430041610',
  '07152901250126200915260810210407260926112616262526222604261228042621260626152618260526232619310831053104121210163116120231093106311231013113310331173102042031073110311126242614260231153312110720322402',
  '21132407193622152404194024092202301510091406281228182205280130253216121510113031111310052511302911091208101511101010110622141001100222080310032230233003302212143001302132130304321532110802330717131718',
  '081608132408241330063002301430083010300927022403241024122707241127062417240627152714071723082301'
].join('');
try {
  const buf = Buffer.from(await (await fetch(GEO_URL)).arrayBuffer());
  const sha = createHash('sha1').update(buf).digest('hex');
  if (sha !== GEO_SHA1) throw new Error('boundary file changed: ' + sha);
  const g = JSON.parse(buf.toString('utf8'));
  g.features.forEach((f, i) => { f.properties = { s: CODES.substr(i * 4, 2), l: CODES.substr(i * 4 + 2, 2) }; });
  fs.writeFileSync('/tmp/lga.geojson', JSON.stringify(g));
  fs.mkdirSync('public/data', { recursive: true });
  execFileSync('node', ['node_modules/mapshaper/bin/mapshaper', '-i', '/tmp/lga.geojson', 'name=lgas', '-simplify', '9%', 'keep-shapes', '-dissolve', 's', '+', 'name=states', '-o', 'public/data/vr-geo.json', 'format=topojson', 'quantization=1e5', 'target=lgas,states'], { stdio: 'inherit' });
  console.log('geo.json', fs.statSync('public/data/vr-geo.json').size);
} catch (e) { console.log('geo build skipped:', e.message); }
