(function(){
if(!document.getElementById('ec-mapbox'))return;
var G9='#0B4A2A',G7='#13693A',MUT='#55605A',LINE='#E4E6DF',INK='#111813',NOD='#E2E4DE',GOLDT='#8A6205';
var SEQ=['#EAF4E6','#C6E3BE','#93CB86','#55AC55','#23803F','#0B4A2A'];
var CAT=['#7FA7D6','#E9A86B','#86C08A','#E58F8F','#9DD0CB','#E8D27A','#C2A0C9','#B9A28C'];
var LV={sd:{t:'Senatorial districts',one:'Senatorial district',sh:'SD'},fc:{t:'Federal constituencies',one:'Federal constituency',sh:'FC'},sc:{t:'State constituencies',one:'State constituency',sh:'SC'}};
var SUM,TOPO,E={sd:[],fc:[],sc:[]},LG={},SH={},ST={},R23={};
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmt(n){return n==null?'—':Math.round(n).toLocaleString('en-GB');}
function pf(v,d){return v==null||!isFinite(v)?'—':v.toFixed(d==null?1:d)+'%';}
function tc(s){s=String(s).replace(/\s+/g,' ').trim();if(/^fct$/i.test(s))return 'FCT';if(s!==s.toUpperCase())return s;return s.toLowerCase().replace(/(^|[\s\-\/(.'’])([a-z])/g,function(m,a,b){return a+b.toUpperCase();}).replace(/\b(Ii|Iii|Iv|Vi|Vii)\b/g,function(m){return m.toUpperCase();}).replace(/\bFct\b/g,'FCT');}
function norm(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function J(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();});}
function opt(v,t,sel){return '<option value="'+esc(v)+'"'+(sel?' selected':'')+'>'+esc(t)+'</option>';}
function sName(s){return tc(ST[s].n);}
function lName(s,l){return tc(LG[s+l].n);}

/* ---------- data model ---------- */
function build(raw,rawsc){
 SUM.s.forEach(function(st){ST[st.c]=st;st.l.forEach(function(a){LG[st.c+a[0]]={s:st.c,l:a[0],n:a[1],r:a[2],sd:null,fc:[],sc:[]};});});
 ['sd','fc','sc'].forEach(function(k){var rows=k==='sc'?rawsc.sc:raw[k];rows.forEach(function(r,i){var o={k:k,i:i,id:k+i,code:r[0],n:tc(r[1]),s:r[2],t:r[3],l:r[4],part:r[5]===1};E[k].push(o);
  o.l.forEach(function(l){var g=LG[o.s+l];if(!g)return;if(k==='sd')g.sd=o;else g[k].push(o);});});});
 // links
 E.sd.forEach(function(d){d.fcs=[];d.l.forEach(function(l){LG[d.s+l].fc.forEach(function(f){if(d.fcs.indexOf(f)<0)d.fcs.push(f);});});});
 E.fc.forEach(function(f){f.sd=LG[f.s+f.l[0]].sd;f.scs=[];f.l.forEach(function(l){LG[f.s+l].sc.forEach(function(c){if(f.scs.indexOf(c)<0)f.scs.push(c);});});});
 E.sc.forEach(function(c){c.sd=LG[c.s+c.l[0]].sd;c.fcs=[];c.l.forEach(function(l){LG[c.s+l].fc.forEach(function(f){if(c.fcs.indexOf(f)<0)c.fcs.push(f);});});});
 // state stats
 SUM.s.forEach(function(st){st.cnt={};['sd','fc','sc'].forEach(function(k){var a=E[k].filter(function(o){return o.s===st.c;});st.cnt[k]=a.length;st['avg'+k]=a.length?a.reduce(function(x,o){return x+o.t;},0)/a.length:null;});st.reg=E.sd.filter(function(o){return o.s===st.c;}).reduce(function(x,o){return x+o.t;},0);});
}
function stateTotal(s){return s?ST[s].reg:E.sd.reduce(function(x,o){return x+o.t;},0);}
/* shapes: groups of LGAs drawn as one polygon, each carrying the constituencies it represents */
function shapes(k){if(SH[k])return SH[k];var out=[],byL={};
 if(k==='sc'){var par={};var f=function(x){while(par[x]&&par[x]!==x)x=par[x];return x;};
  E.sc.forEach(function(c){var a=c.s+c.l[0];c.l.slice(1).forEach(function(l){var b=c.s+l,ra=f(a),rb=f(b);if(ra!==rb)par[rb]=ra;});});
  var grp={};Object.keys(LG).forEach(function(key){var r=f(key);(grp[r]=grp[r]||[]).push(key);});
  Object.keys(grp).forEach(function(r){var keys=grp[r].sort(),s=keys[0].slice(0,2);var cs=[];keys.forEach(function(key){LG[key].sc.forEach(function(c){if(cs.indexOf(c)<0)cs.push(c);});});out.push({k:k,s:s,keys:keys,cs:cs});});}
 else{var seen={};E[k].forEach(function(o){var key=o.l.map(function(l){return o.s+l;}).sort().join(',');if(seen[key]){seen[key].cs.push(o);return;}seen[key]={k:k,s:o.s,keys:key.split(','),cs:[o]};out.push(seen[key]);});}
 out.forEach(function(sh,i){sh.i=i;sh.keys.forEach(function(key){byL[key]=sh;});sh.cs.forEach(function(c){c.shape=sh;});sh.t=sh.cs.reduce(function(x,c){return x+c.t;},0);sh.avg=sh.cs.length?sh.t/sh.cs.length:null;});
 // colouring: greedy over neighbouring shapes
 var geoms=TOPO.objects.lgas.geometries,nb=topojson.neighbors(geoms),adj=out.map(function(){return {};});
 geoms.forEach(function(g,gi){var a=byL[g.properties.s+g.properties.l];if(!a)return;nb[gi].forEach(function(j){var h=geoms[j],b=byL[h.properties.s+h.properties.l];if(b&&b!==a){adj[a.i][b.i]=1;}});});
 out.slice().sort(function(a,b){return Object.keys(adj[b.i]).length-Object.keys(adj[a.i]).length;}).forEach(function(sh){var used={};Object.keys(adj[sh.i]).forEach(function(j){if(out[j].col!=null)used[out[j].col]=1;});var c=0;while(used[c]&&c<CAT.length-1)c++;sh.col=c;});
 out.forEach(function(sh){var gs=geoms.filter(function(g){return byL[g.properties.s+g.properties.l]===sh;});sh.geo=gs.length?topojson.merge(TOPO,gs):null;});
 SH[k]={list:out,byL:byL};return SH[k];}
function shapeLabel(sh){if(sh.k!=='sc'||sh.cs.length===1)return sh.cs.length===1?sh.cs[0].n:sh.cs.map(function(c){return c.n;}).join(' · ');
 return sh.keys.map(function(k){return tc(LG[k].n);}).join(' / ')+' ('+sh.cs.length+')';}

/* ---------- download gate (shared across the site) ---------- */
var pendingDl=null;
function member(){try{return JSON.parse(localStorage.getItem('dice_member')||'null');}catch(_){return null;}}
function gate(fn){if(member()){fn();return;}pendingDl=fn;$('vr-modal').hidden=false;$('vr-m-st').textContent='';setTimeout(function(){$('vr-name').focus();},30);}
function closeGate(){$('vr-modal').hidden=true;pendingDl=null;}
$('vr-m-x').addEventListener('click',closeGate);
$('vr-modal').addEventListener('click',function(e){if(e.target.id==='vr-modal')closeGate();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('vr-modal').hidden)closeGate();});
$('vr-form').addEventListener('submit',function(e){e.preventDefault();var name=$('vr-name').value.trim(),email=$('vr-email').value.trim(),st=$('vr-m-st'),b=$('vr-m-go');
 if(name.length<2){st.textContent='Please enter your full name.';st.style.color='#A33A1F';return;}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){st.textContent='Please enter a valid email address.';st.style.color='#A33A1F';return;}
 b.disabled=true;b.textContent='Registering…';st.style.color=MUT;st.textContent='';
 fetch('/api/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,email:email,consent:$('vr-consent').checked,page:'constituencies',website:$('vr-hp').value})})
 .then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};});})
 .then(function(res){if(!res.ok)throw new Error(res.j&&res.j.error||'Something went wrong.');try{localStorage.setItem('dice_member',JSON.stringify({name:name,email:email,at:Date.now()}));}catch(_){}
  var fn=pendingDl;$('vr-modal').hidden=true;pendingDl=null;b.disabled=false;b.textContent='Register & download';if(fn)fn();})
 .catch(function(err){st.style.color='#A33A1F';st.textContent=err.message||'Could not register you. Please try again.';b.disabled=false;b.textContent='Register & download';});});
function csv(name,head,rows){var q=function(v){v=v==null?'':String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};
 var t=String.fromCharCode(65279)+[head.map(q).join(',')].concat(rows.map(function(r){return r.map(q).join(',');})).join('\n');
 var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},100);}

/* ---------- tooltip ---------- */
var tip=$('vr-tip');
function showTip(e,h){tip.innerHTML=h;tip.hidden=false;var x=e.clientX+14,y=e.clientY+14;var w=tip.offsetWidth,hh=tip.offsetHeight;if(x+w>innerWidth-8)x=e.clientX-w-14;if(y+hh>innerHeight-8)y=e.clientY-hh-14;tip.style.left=x+'px';tip.style.top=y+'px';}
function hideTip(){tip.hidden=true;}
function kpi(label,val,sub){return '<div class="vr-k"><span>'+label+'</span><b>'+val+'</b>'+(sub?'<i>'+sub+'</i>':'')+'</div>';}

/* ---------- map ---------- */
var V={k:'fc',s:'',c:null,sh:null,m:'cat'};
var W=600,Hh=536,path,svg,gAll,ready=false;
function initMap(){var box=$('ec-mapbox'),states=topojson.feature(TOPO,TOPO.objects.states);
 path=d3.geoPath(d3.geoMercator().fitExtent([[12,12],[W-12,Hh-12]],states));
 svg=d3.select(box).append('svg').attr('viewBox','0 0 '+W+' '+Hh).attr('width','100%').attr('height','100%').attr('role','img').attr('aria-label','Map of electoral constituencies');
 gAll=svg.append('g');
 gAll.append('g').attr('class','bg').selectAll('path').data(states.features).enter().append('path').attr('d',path).attr('fill','#E7E9E3').attr('stroke','#FFFFFF').attr('stroke-width',.6).attr('vector-effect','non-scaling-stroke');
 gAll.append('g').attr('class','shp');
 gAll.append('path').attr('class','lgl').attr('fill','none').attr('stroke','#FFFFFF').attr('stroke-width',.6).attr('stroke-dasharray','2 2').attr('vector-effect','non-scaling-stroke').attr('pointer-events','none').attr('stroke-opacity',.9);
 gAll.append('path').attr('class','stl').attr('fill','none').attr('stroke',INK).attr('stroke-width',.9).attr('vector-effect','non-scaling-stroke').attr('pointer-events','none').attr('d',path(topojson.mesh(TOPO,TOPO.objects.states,function(a,b){return a!==b;})));
 gAll.append('path').attr('class','sel').attr('fill','none').attr('stroke',INK).attr('stroke-width',2.6).attr('vector-effect','non-scaling-stroke').attr('pointer-events','none');
 gAll.append('g').attr('class','lb').attr('pointer-events','none');
 svg.on('mousemove',function(e){var t=e.target,d=t.__data__;if(!d||!d.cs){hideTip();return;}showTip(e,tipHtml(d));}).on('mouseleave',hideTip);
 svg.on('click',function(e){var d=e.target.__data__;if(!d||!d.cs)return;pickShape(d);});
 svg.on('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var d=e.target.__data__;if(!d||!d.cs)return;e.preventDefault();pickShape(d);});
 ready=true;}
function pickShape(sh){if(!V.s){V.s=sh.s;}V.sh=sh;V.c=sh.cs.length===1?sh.cs[0]:null;render();}
function tipHtml(sh){var h='<b>'+esc(shapeLabel(sh))+'</b><span style="opacity:.75"> · '+esc(sName(sh.s))+'</span>';
 if(sh.cs.length===1)return h+'<br>'+esc(sh.cs[0].code)+' · '+fmt(sh.cs[0].t)+' registered voters<br>LGAs: '+esc(sh.keys.map(function(k){return tc(LG[k].n);}).join(', '));
 return h+'<br>'+sh.cs.length+' '+LV[sh.k].t.toLowerCase()+' · '+fmt(sh.t)+' registered voters';}
function valOf(sh){if(V.m==='reg')return sh.avg;if(V.m==='cnt')return sh.cs.length;return null;}
function seq(vals){var v=vals.filter(function(x){return x!=null&&isFinite(x);}).sort(function(a,b){return a-b;});var n=SEQ.length,br=[];for(var i=1;i<n;i++)br.push(v.length?v[Math.min(v.length-1,Math.floor(i/n*v.length))]:0);
 return {f:function(x){if(x==null)return NOD;var i=0;while(i<n-1&&x>br[i])i++;return SEQ[i];},br:br};}
function fillFn(list){if(V.m==='cat')return function(sh){return CAT[sh.col%CAT.length];};var sc=seq(list.map(valOf));fillFn.sc=sc;return function(sh){return sc.f(valOf(sh));};}
function render(){if(!ready)return;var k=V.k;
 $('ec-levels').innerHTML=['sd','fc','sc'].map(function(x){return '<button type="button" class="vr-chip" data-k="'+x+'" aria-pressed="'+(x===k)+'">'+LV[x].t+' ('+E[x].length+')</button>';}).join('');
 var modes=[['cat','Constituency'],['reg',k==='sc'?'Voters per constituency':'Registered voters']];if(k==='sc')modes.push(['cnt','Constituencies per LGA']);if(!modes.some(function(x){return x[0]===V.m;}))V.m='cat';
 $('ec-modes').innerHTML='<span style="font-size:13px;font-weight:700;color:'+MUT+'">Colour by</span>'+modes.map(function(x){return '<button type="button" class="vr-chip" data-m="'+x[0]+'" aria-pressed="'+(x[0]===V.m)+'">'+x[1]+'</button>';}).join('');
 $('ec-crumb').innerHTML='<a href="#explorer" data-go="" style="color:'+(V.s?G7:INK)+'">Nigeria</a>'+(V.s?' <span aria-hidden="true" style="color:'+MUT+'">›</span> <a href="#explorer" data-go="'+V.s+'" style="color:'+(V.sh?G7:INK)+'">'+esc(sName(V.s))+'</a>':'')+(V.sh?' <span aria-hidden="true" style="color:'+MUT+'">›</span> <span>'+esc(V.c?V.c.n:shapeLabel(V.sh))+'</span>':'');
 var S=shapes(k),list=S.list.filter(function(sh){return sh.geo&&sh.cs.length&&(!V.s||sh.s===V.s);}),fill=fillFn(V.s?list:S.list.filter(function(sh){return sh.geo&&sh.cs.length;}));
 var sel=gAll.select('.shp').selectAll('path').data(list,function(d){return d.k+d.i;});sel.exit().remove();
 sel.enter().append('path').attr('class','a').attr('tabindex',0).merge(sel).attr('d',function(d){return path(d.geo);}).attr('fill',fill).attr('aria-label',function(d){return shapeLabel(d);});
 // LGA lines inside the chosen state
 gAll.select('.lgl').attr('d',V.s?path(topojson.mesh(TOPO,TOPO.objects.lgas,function(a,b){return a!==b&&a.properties.s===V.s&&b.properties.s===V.s;})):null);
 gAll.select('.sel').attr('d',V.sh?path(V.sh.geo):null);
 var k2=1;if(V.s){var feat=topojson.feature(TOPO,TOPO.objects.states).features.filter(function(f){return f.properties.s===V.s;})[0],b=path.bounds(feat),dx=b[1][0]-b[0][0],dy=b[1][1]-b[0][1],cx=(b[0][0]+b[1][0])/2,cy=(b[0][1]+b[1][1])/2;k2=Math.min(24,0.92/Math.max(dx/W,dy/Hh));
  gAll.transition().duration(450).attr('transform','translate('+(W/2-k2*cx)+','+(Hh/2-k2*cy)+') scale('+k2+')');}
 else gAll.transition().duration(450).attr('transform','');
 if(!V.s)labels(topojson.feature(TOPO,TOPO.objects.states).features.map(function(f){return {g:f,n:tc(ST[f.properties.s].n)};}),1,false);
 else{var items=list.map(function(sh){return {g:sh.geo,n:shapeLabel(sh),sel:sh===V.sh};});
  if(V.sh&&V.sh.keys.length>1){V.sh.keys.forEach(function(key){var g=TOPO.objects.lgas.geometries.filter(function(x){return x.properties.s+x.properties.l===key;});if(g.length)items.push({g:topojson.merge(TOPO,g),n:tc(LG[key].n),lga:1});});items=items.filter(function(it){return !it.sel;});}
  labels(items,k2,true);}
 legend(list);renderSide();}
function labels(items,k,inState){var g=gAll.select('.lb'),placed=[],fs=(inState?9.5:9)/k;g.selectAll('text').remove();
 items.sort(function(a,b){return (b.sel?1e12:b.lga?1e11:path.area(b.g))-(a.sel?1e12:a.lga?1e11:path.area(a.g));});
 items.forEach(function(it){var a=path.area(it.g)*k*k;if(inState&&a<220&&!it.sel&&!it.lga)return;var c=path.centroid(it.g);if(!isFinite(c[0]))return;
  var nm=it.n;if(nm.length>26)nm=nm.slice(0,24)+'…';
  var t=g.append('text').attr('x',c[0]).attr('y',c[1]).attr('dy','0.35em').attr('text-anchor','middle').attr('font-size',it.lga?fs*0.92:fs).attr('font-weight',it.sel?800:it.lga?500:650).attr('font-style',it.lga?'italic':null).attr('fill',INK).attr('stroke','#FFFFFF').attr('stroke-width',2.6/k).attr('stroke-linejoin','round').attr('paint-order','stroke').attr('font-family','Public Sans,system-ui,sans-serif').text(nm).node();
  if(inState){var bb;try{bb=t.getBBox();}catch(_){return;}var pad=1/k;if(placed.some(function(p){return bb.x<p.x+p.width+pad&&bb.x+bb.width+pad>p.x&&bb.y<p.y+p.height&&bb.y+bb.height>p.y;})){t.remove();return;}placed.push(bb);}});}
function legend(list){var h='';
 if(V.m==='cat')h='<span style="font-weight:700;color:'+INK+'">'+LV[V.k].t+(V.s?' in '+esc(sName(V.s)):'')+': '+list.reduce(function(x,sh){return x+sh.cs.length;},0)+'</span><span>Colours only tell neighbours apart. '+(V.s?'Dashed lines are LGA boundaries.':'Tap a state to see names.')+'</span>';
 else{var sc=fillFn.sc,lab=V.m==='cnt'?function(x){return Math.round(x);}:fmt;h='<span style="font-weight:700;color:'+INK+'">'+(V.m==='cnt'?'State constituencies per LGA':'Registered voters per '+LV[V.k].one.toLowerCase())+'</span>'+SEQ.map(function(c,i){return '<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:14px;height:14px;border-radius:3px;background:'+c+';display:inline-block;border:1px solid rgba(0,0,0,.06)"></span>'+(i===0?'up to '+lab(sc.br[0]):i===SEQ.length-1?'above '+lab(sc.br[SEQ.length-2]):'to '+lab(sc.br[i]))+'</span>';}).join('');}
 $('ec-legend').innerHTML=h;}

/* ---------- side panel ---------- */
function bars(arr,mx){return '<div style="display:flex;flex-direction:column;gap:2px;max-height:360px;overflow:auto;padding-right:4px">'+arr.map(function(o){
 return '<div class="vr-bar click" role="button" tabindex="0" data-pick="'+o.id+'" style="grid-template-columns:minmax(90px,1.2fr) minmax(40px,1fr) 78px"><span style="overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-weight:600" title="'+esc(o.n)+'">'+esc(o.n)+'</span><span class="t"><span style="width:'+Math.max(1,o.t/mx*100).toFixed(1)+'%;background:'+G7+'"></span></span><span style="text-align:right;font-size:13px;font-weight:600">'+fmt(o.t)+'</span></div>';}).join('')+'</div>';}
function chipLink(o){return '<button type="button" class="vr-chip" data-pick="'+o.id+'" style="min-height:34px;font-size:13px;text-align:left">'+esc(o.n)+' <span style="font-weight:500;color:'+MUT+'">'+LV[o.k].sh+'</span></button>';}
function renderSide(){var box=$('ec-side'),k=V.k;
 if(V.c){box.innerHTML=detail(V.c);return;}
 if(V.sh){var sh=V.sh;box.innerHTML='<h3 style="margin:0;font-family:Archivo,sans-serif;font-size:22px;color:'+G9+'">'+esc(sh.keys.map(function(x){return tc(LG[x].n);}).join(' / '))+'</h3><span style="font-size:13px;font-weight:700;color:'+MUT+'">'+(sh.keys.length>1?'LGAs':'LGA')+' in '+esc(sName(sh.s))+' · '+fmt(sh.keys.reduce(function(x,key){return x+LG[key].r;},0))+' registered voters</span><p style="margin:0;font-size:14px;color:'+MUT+'">'+(k==='sc'?'This area is shared by '+sh.cs.length+' state constituencies. Tap one for its details.':'This LGA is split between '+sh.cs.length+' '+LV[k].t.toLowerCase()+'. Tap one for its details.')+'</p>'+bars(sh.cs.slice().sort(function(a,b){return b.t-a.t;}),Math.max.apply(null,sh.cs.map(function(c){return c.t;})));return;}
 var arr=E[k].filter(function(o){return !V.s||o.s===V.s;}).sort(function(a,b){return b.t-a.t;}),mx=arr.length?arr[0].t:1,tot=stateTotal(V.s);
 var head='<h3 style="margin:0;font-family:Archivo,sans-serif;font-size:22px;color:'+G9+'">'+esc(V.s?sName(V.s):'Nigeria')+'</h3>';
 var ks='<div class="vr-kpis">'+kpi('Senatorial districts',fmt(V.s?ST[V.s].cnt.sd:E.sd.length))+kpi('Federal constituencies',fmt(V.s?ST[V.s].cnt.fc:E.fc.length))+kpi('State constituencies',fmt(V.s?ST[V.s].cnt.sc:E.sc.length),V.s==='37'?'The FCT has area councils instead':'')+kpi('Registered voters',fmt(tot),'Average per '+LV[k].one.toLowerCase()+': '+fmt(arr.length?tot/arr.length:null))+'</div>';
 box.innerHTML=head+ks+(arr.length?'<span style="font-size:13px;font-weight:700;color:'+MUT+'">'+LV[k].t+(V.s?'':', largest first')+' · tap one</span>'+bars(V.s?arr:arr.slice(0,40),mx)+(V.s?'':'<span style="font-size:13px;color:'+MUT+'">Showing the 40 largest. Tap a state on the map, or use the directory below, to see the rest.</span>'):'<p style="margin:0;color:'+MUT+'">No '+LV[k].t.toLowerCase()+' in this state.</p>');}
function detail(c){var st=ST[c.s],same=E[c.k].filter(function(o){return o.s===c.s;}),avg=st['avg'+c.k],rank=same.slice().sort(function(a,b){return b.t-a.t;}).indexOf(c)+1;
 var h='<h3 style="margin:0;font-family:Archivo,sans-serif;font-size:22px;color:'+G9+'">'+esc(c.n)+'</h3><span style="font-size:13px;font-weight:700;color:'+MUT+'">'+LV[c.k].one+' · '+esc(c.code)+' · '+esc(sName(c.s))+' State</span>';
 h+='<div class="vr-kpis">'+kpi('Registered voters',fmt(c.t),pf(c.t/st.reg*100)+' of the state')+kpi('Compared with state average',(avg?((c.t/avg-1)*100>=0?'+':'−')+Math.abs((c.t/avg-1)*100).toFixed(0)+'%':'—'),'Ranked '+rank+' of '+same.length+' in the state')+kpi('LGAs',fmt(c.l.length),c.part?'Part of an LGA':'')+'</div>';
 h+='<div style="display:flex;flex-direction:column;gap:6px"><span style="font-size:13px;font-weight:700;color:'+MUT+'">'+(c.k==='sc'?'LGA this constituency is in':'LGAs that make up this constituency')+'</span><div class="vr-scroll" style="max-height:260px"><table class="vr-tbl"><thead><tr><th>LGA</th><th class="n">Registered voters</th></tr></thead><tbody>'+
  c.l.map(function(l){var g=LG[c.s+l],shared=c.k==='sd'?[]:g[c.k].filter(function(o){return o!==c;});return '<tr><td><b>'+esc(tc(g.n))+'</b>'+(shared.length?'<br><span style="font-size:12px;color:'+MUT+'">Shared with '+shared.map(function(o){return esc(o.n);}).join(', ')+'</span>':'')+'</td><td class="n">'+fmt(g.r)+'</td></tr>';}).join('')+'</tbody></table></div></div>';
 if(c.k==='sd')h+=links('Federal constituencies in this district',c.fcs);
 if(c.k==='fc'){h+=links('Senatorial district',c.sd?[c.sd]:[]);h+=links('State constituencies in these LGAs',c.scs);}
 if(c.k==='sc'){h+=links('Federal constituency',c.fcs);h+=links('Senatorial district',c.sd?[c.sd]:[]);}
 return h;}
function links(t,arr){if(!arr.length)return '';return '<div style="display:flex;flex-direction:column;gap:6px"><span style="font-size:13px;font-weight:700;color:'+MUT+'">'+t+' ('+arr.length+')</span><div style="display:flex;flex-wrap:wrap;gap:6px">'+arr.map(chipLink).join('')+'</div></div>';}
function byId(id){var k=id.slice(0,2);return E[k][+id.slice(2)];}
function select(c,scroll){V.k=c.k;V.s=c.s;V.c=c;V.sh=shapes(c.k).byL[c.s+c.l[0]];render();if(scroll)$('explorer').scrollIntoView({behavior:'smooth'});}
$('ec-levels').addEventListener('click',function(e){var b=e.target.closest('[data-k]');if(!b)return;var nk=b.getAttribute('data-k');if(nk===V.k)return;V.k=nk;V.c=null;V.sh=null;render();});
$('ec-modes').addEventListener('click',function(e){var b=e.target.closest('[data-m]');if(!b)return;V.m=b.getAttribute('data-m');render();});
$('ec-crumb').addEventListener('click',function(e){var a=e.target.closest('[data-go]');if(!a)return;e.preventDefault();V.s=a.getAttribute('data-go');V.c=null;V.sh=null;render();});
function sidePick(e){var b=e.target.closest('[data-pick]');if(!b)return;select(byId(b.getAttribute('data-pick')));}
$('ec-side').addEventListener('click',sidePick);
$('ec-side').addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.closest('[data-pick]')){e.preventDefault();sidePick(e);}});

/* ---------- directory ---------- */
var DR={t:'fc',s:'',q:'',k:'t',d:-1};
function drRows(){var q=norm(DR.q),ks=DR.t==='all'?['sd','fc','sc']:[DR.t],out=[];
 ks.forEach(function(k){E[k].forEach(function(o){if(DR.s&&o.s!==DR.s)return;if(q){var hay=norm(o.n+' '+o.code+' '+sName(o.s)+' '+o.l.map(function(l){return LG[o.s+l].n;}).join(' '));if(hay.indexOf(q)<0)return;}out.push(o);});});
 var k=DR.k,d=DR.d,gv=function(o){return k==='t'?o.t:k==='n'?o.n:k==='code'?o.code:k==='s'?sName(o.s):o.l.length;};
 out.sort(function(a,b){var A=gv(a),B=gv(b);return typeof A==='string'?d*A.localeCompare(B):d*(A-B);});return out;}
function lgaText(o){return o.l.map(function(l){return tc(LG[o.s+l].n);}).join(', ');}
function renderDr(){$('dr-t').innerHTML=opt('sd','Senatorial districts',DR.t==='sd')+opt('fc','Federal constituencies',DR.t==='fc')+opt('sc','State constituencies',DR.t==='sc')+opt('all','All types',DR.t==='all');
 $('dr-s').innerHTML=opt('','All states',!DR.s)+SUM.s.map(function(o){return opt(o.c,tc(o.n),DR.s===o.c);}).join('');
 var rows=drRows();$('dr-count').textContent=fmt(rows.length)+(DR.t==='all'?' constituencies':' '+LV[DR.t].t.toLowerCase())+(DR.s?' in '+sName(DR.s):'')+(DR.q?' matching “'+DR.q+'”':'');
 var th=function(key,label,n){var on=DR.k===key;return '<th'+(n?' class="n"':'')+' aria-sort="'+(on?(DR.d>0?'ascending':'descending'):'none')+'"><button type="button" data-sort="'+key+'">'+label+(on?(DR.d>0?' ▲':' ▼'):'')+'</button></th>';};
 var shown=rows.slice(0,400);
 $('dr-out').innerHTML=rows.length?'<div class="vr-scroll"><table class="vr-tbl"><thead><tr>'+th('code','Code')+th('n','Constituency')+th('s','State')+th('t','Registered voters',1)+th('l','LGAs')+'</tr></thead><tbody>'+shown.map(function(o){
  return '<tr class="click" tabindex="0" data-row="'+o.id+'"><td style="white-space:nowrap;color:'+MUT+'">'+esc(o.code)+'</td><td><b>'+esc(o.n)+'</b><br><span style="font-size:12px;color:'+MUT+'">'+LV[o.k].one+'</span></td><td>'+esc(sName(o.s))+'</td><td class="n">'+fmt(o.t)+'</td><td style="font-size:13px">'+esc(lgaText(o))+'</td></tr>';}).join('')+'</tbody></table></div>'+(rows.length>shown.length?'<p style="margin:8px 0 0;font-size:13px;color:'+MUT+'">Showing the first 400. Narrow the search or download the full list.</p>':''):'<p style="margin:0;color:'+MUT+'">Nothing matches.</p>';}
$('dr-t').addEventListener('change',function(e){DR.t=e.target.value;renderDr();});
$('dr-s').addEventListener('change',function(e){DR.s=e.target.value;renderDr();});
(function(){var t;$('dr-q').addEventListener('input',function(e){DR.q=e.target.value.trim();clearTimeout(t);t=setTimeout(renderDr,160);});})();
$('dr-out').addEventListener('click',function(e){var s=e.target.closest('[data-sort]');if(s){var k=s.getAttribute('data-sort');DR.d=DR.k===k?-DR.d:(k==='t'||k==='l'?-1:1);DR.k=k;renderDr();return;}var tr=e.target.closest('[data-row]');if(tr)select(byId(tr.getAttribute('data-row')),true);});
$('dr-out').addEventListener('keydown',function(e){if(e.key==='Enter'){var tr=e.target.closest('[data-row]');if(tr)tr.click();}});

/* ---------- state table ---------- */
var STK={k:'reg',d:-1};
function stRows(){return SUM.s.map(function(st){var f=E.fc.filter(function(o){return o.s===st.c;}).sort(function(a,b){return b.t-a.t;});return {st:st,big:f[0],small:f[f.length-1],ratio:f.length>1?f[0].t/f[f.length-1].t:null};});}
function renderSt(){var rows=stRows(),k=STK.k,d=STK.d,gv=function(r){switch(k){case 'n':return tc(r.st.n);case 'sd':return r.st.cnt.sd;case 'fc':return r.st.cnt.fc;case 'sc':return r.st.cnt.sc;case 'avg':return r.st.avgfc;case 'ratio':return r.ratio||0;default:return r.st.reg;}};
 rows.sort(function(a,b){var A=gv(a),B=gv(b);return typeof A==='string'?d*A.localeCompare(B):d*(A-B);});
 var th=function(key,label,n){var on=k===key;return '<th'+(n?' class="n"':'')+' aria-sort="'+(on?(d>0?'ascending':'descending'):'none')+'"><button type="button" data-sort="'+key+'">'+label+(on?(d>0?' ▲':' ▼'):'')+'</button></th>';};
 $('st-out').innerHTML='<div class="vr-scroll"><table class="vr-tbl"><thead><tr>'+th('n','State')+th('reg','Registered voters',1)+th('sd','Senatorial districts',1)+th('fc','Federal const.',1)+th('sc','State const.',1)+th('avg','Voters per federal const.',1)+'<th>Largest federal constituency</th><th>Smallest federal constituency</th>'+th('ratio','Largest ÷ smallest',1)+'</tr></thead><tbody>'+rows.map(function(r){var st=r.st;
  return '<tr class="click" tabindex="0" data-st="'+st.c+'"><td><b>'+esc(tc(st.n))+'</b></td><td class="n">'+fmt(st.reg)+'</td><td class="n">'+st.cnt.sd+'</td><td class="n">'+st.cnt.fc+'</td><td class="n">'+(st.cnt.sc||'—')+'</td><td class="n">'+fmt(st.avgfc)+'</td><td style="font-size:13px">'+(r.big?esc(r.big.n)+'<br><span style="color:'+MUT+'">'+fmt(r.big.t)+'</span>':'—')+'</td><td style="font-size:13px">'+(r.small&&r.small!==r.big?esc(r.small.n)+'<br><span style="color:'+MUT+'">'+fmt(r.small.t)+'</span>':'—')+'</td><td class="n">'+(r.ratio?r.ratio.toFixed(1)+'×':'—')+'</td></tr>';}).join('')+'</tbody></table></div>';}
$('st-out').addEventListener('click',function(e){var s=e.target.closest('[data-sort]');if(s){var k=s.getAttribute('data-sort');STK.d=STK.k===k?-STK.d:(k==='n'?1:-1);STK.k=k;renderSt();return;}var tr=e.target.closest('[data-st]');if(!tr)return;V.s=tr.getAttribute('data-st');V.c=null;V.sh=null;render();$('explorer').scrollIntoView({behavior:'smooth'});});
$('st-out').addEventListener('keydown',function(e){if(e.key==='Enter'){var tr=e.target.closest('[data-st]');if(tr)tr.click();}});

/* ---------- downloads ---------- */
function names(arr){return arr.map(function(o){return o.n;}).join('; ');}
function codes(arr){return arr.map(function(o){return o.code;}).join('; ');}
function doDl(k){
 if(k==='sd'){csv('dice-senatorial-districts.csv',['code','senatorial_district','state','registered_voters','lga_count','lgas','federal_constituencies','federal_constituency_codes'],E.sd.map(function(o){return [o.code,o.n,sName(o.s),o.t,o.l.length,lgaText(o),names(o.fcs),codes(o.fcs)];}));return;}
 if(k==='fc'){csv('dice-federal-constituencies.csv',['code','federal_constituency','state','registered_voters','senatorial_district','lga_count','lgas','part_of_lga','state_constituencies'],E.fc.map(function(o){return [o.code,o.n,sName(o.s),o.t,o.sd?o.sd.n:'',o.l.length,lgaText(o),o.part?'yes':'',names(o.scs)];}));return;}
 if(k==='sc'){csv('dice-state-constituencies.csv',['code','state_constituency','state','registered_voters','lga','federal_constituency','senatorial_district'],E.sc.map(function(o){return [o.code,o.n,sName(o.s),o.t,lgaText(o),names(o.fcs),o.sd?o.sd.n:''];}));return;}
 if(k==='lga'){var rows=[];SUM.s.forEach(function(st){st.l.forEach(function(a){var g=LG[st.c+a[0]];rows.push([tc(st.n),st.c,tc(g.n),g.l,g.r,g.sd?g.sd.n:'',g.sd?g.sd.code:'',names(g.fc),codes(g.fc),names(g.sc),codes(g.sc)]);});});
  csv('dice-lga-constituency-lookup.csv',['state','state_code','lga','lga_code','registered_voters_2023','senatorial_district','sd_code','federal_constituency','fc_code','state_constituencies','sc_codes'],rows);return;}
 if(k==='dr'){csv('dice-constituencies-'+(DR.t==='all'?'all':LV[DR.t].t.toLowerCase().replace(/ /g,'-'))+(DR.s?'-'+norm(ST[DR.s].n).replace(/ /g,'-'):'')+'.csv',['type','code','constituency','state','registered_voters','lgas'],drRows().map(function(o){return [LV[o.k].one,o.code,o.n,sName(o.s),o.t,lgaText(o)];}));return;}
 if(k==='st'){csv('dice-constituencies-by-state.csv',['state','registered_voters','senatorial_districts','federal_constituencies','state_constituencies','voters_per_federal_constituency','largest_federal_constituency','largest_voters','smallest_federal_constituency','smallest_voters'],stRows().map(function(r){var st=r.st;return [tc(st.n),st.reg,st.cnt.sd,st.cnt.fc,st.cnt.sc,Math.round(st.avgfc),r.big?r.big.n:'',r.big?r.big.t:'',r.small?r.small.n:'',r.small?r.small.t:''];}));return;}}
document.addEventListener('click',function(e){var b=e.target.closest('[data-dl]');if(!b)return;var k=b.getAttribute('data-dl');gate(function(){doDl(k);});});

/* ---------- hero ---------- */
function hero(){var tot=stateTotal(''),f=E.fc.slice().sort(function(a,b){return b.t-a.t;});
 $('ec-hero').innerHTML=kpi('Senatorial districts',fmt(E.sd.length),'3 per state, 1 for the FCT')+kpi('Federal constituencies',fmt(E.fc.length),'Seats in the House of Representatives')+kpi('State constituencies',fmt(E.sc.length),'Seats in the 36 state Houses of Assembly')+kpi('Registered voters',fmt(tot),'Average '+fmt(tot/E.fc.length)+' per federal constituency')+kpi('Largest federal constituency',fmt(f[0].t),esc(f[0].n)+', '+esc(sName(f[0].s))+' · smallest: '+esc(f[f.length-1].n)+', '+fmt(f[f.length-1].t));}

/* ---------- boot ---------- */
Promise.all([J('/data/vr-summary.json'),J('/data/vr-geo.json'),J('/data/ec.json'),J('/data/ec-sc.json')]).then(function(r){
 SUM=r[0];TOPO=r[1];build(r[2],r[3]);$('ec-status').hidden=true;hero();
 try{initMap();}catch(err){$('ec-mapbox').innerHTML='<p style="padding:16px;color:'+MUT+'">The map could not load. The directory below still works.</p>';}
 render();renderDr();renderSt();})
.catch(function(){$('ec-status').textContent='The constituency data could not be loaded. Please refresh the page in a moment.';$('ec-status').style.color='#A33A1F';});
})();
