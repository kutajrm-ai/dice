(function(){
if(!document.getElementById('vr-mapbox'))return;
var BASE='/vr-data/';
var G9='#0B4A2A',G7='#13693A',G5='#3A9B3F',GL='#E6F2E3',GOLD='#F2B91C',GOLDD='#B07D06',GOLDT='#8A6205',MUT='#55605A',LINE='#E4E6DF',INK='#111813';
var SEQ=['#EAF4E6','#C6E3BE','#93CB86','#55AC55','#23803F','#0B4A2A'];
var DIV_NEG=['#8A6205','#C99A2E','#EED9A2'],DIV_POS=['#D3EBCB','#7DBE6E','#2E8B45','#0B4A2A'];
var PWDH=['Category 1','Category 2','Category 3','Category 4','Category 5','Category 6','Category 7','Category 8','Category 9','Category 10'];
var SUM=null,TOPO=null,ST={},STP={};
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmt(n){return n==null||n<0?'—':Math.round(n).toLocaleString('en-GB');}
function sfmt(n){return (n>0?'+':n<0?'−':'')+Math.abs(Math.round(n)).toLocaleString('en-GB');}
function pc(a,b,d){return b>0?(((a-b)/b*100).toFixed(d==null?1:d)):null;}
function pcs(a,b){var p=pc(a,b);return p==null?'—':(p>0?'+':'')+p+'%';}
function share(a,b){return b>0?(a/b*100).toFixed(1)+'%':'—';}
function tc(s){if(/^fct$/i.test(String(s).trim()))return 'FCT';return String(s).toLowerCase().replace(/(^|[\s\-\/(.'’])([a-z])/g,function(m,a,b){return a+b.toUpperCase();});}
function norm(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function code(){return [].slice.call(arguments).join('-');}
function J(u){return fetch(u.charAt(0)==='/'?u:BASE+u).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();});}
var STE={},WGP={},PUMSG='The polling-unit list for this area is not on the site yet. Ward figures are available; polling units will appear here once they are loaded.';
function J2(a){return J(a[0]).catch(function(){return a.length>1?J2(a.slice(1)):Promise.reject(new Error('missing'));});}
function loadWards(c){var g=Math.floor((+c-1)/7)+1;if(!WGP[g])WGP[g]=J('/data/vr-w'+g+'.json');return WGP[g].then(function(all){var x=all[c],l={};Object.keys(x).forEach(function(lc){var w={};x[lc].forEach(function(r){w[r[0]]={n:r[1],r23:r[2],r19:r[3],p23:r[4],p19:r[5],pn:r[6],u:null};});var lo=lgaOf(c,lc);l[lc]={n:lo?lo[1]:lc,w:w};});return {c:c,l:l,partial:1};});}
function loadState(c){if(ST[c])return Promise.resolve(ST[c]);if(!STP[c])STP[c]=J('st-'+c+'.json').then(function(d){ST[c]=d;delete STE[c];return d;},function(e){STE[c]=1;return loadWards(c).then(function(d){ST[c]=d;return d;},function(){delete STP[c];throw e;});});return STP[c];}
function stateOf(c){for(var i=0;i<SUM.s.length;i++)if(SUM.s[i].c===c)return SUM.s[i];}
function lgaOf(s,l){var a=stateOf(s).l;for(var i=0;i<a.length;i++)if(a[i][0]===l)return a[i];}
function growthTag(a,b){var p=pc(a,b);if(p==null)return '<span style="color:'+MUT+'">—</span>';var c=p<0?GOLDT:G7;return '<span style="color:'+c+';font-weight:700">'+(p>0?'+':'')+p+'%</span>';}
function tag(f){if(f==='n')return '<span class="vr-tag" style="background:#FDF1CC;color:#6B4A0A">New polling unit</span>';if(f==='c')return '<span class="vr-tag" style="background:#E8EEF7;color:#24456E">Renamed</span>';return '';}

/* ---------------- download gate ---------------- */
var pendingDl=null;
function member(){try{return JSON.parse(localStorage.getItem('dice_member')||'null');}catch(_){return null;}}
function gate(fn){if(member()){fn();return;}pendingDl=fn;var m=$('vr-modal');m.hidden=false;$('vr-m-st').textContent='';setTimeout(function(){$('vr-name').focus();},30);}
function closeGate(){$('vr-modal').hidden=true;pendingDl=null;}
$('vr-m-x').addEventListener('click',closeGate);
$('vr-modal').addEventListener('click',function(e){if(e.target.id==='vr-modal')closeGate();});
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!$('vr-modal').hidden)closeGate();});
$('vr-form').addEventListener('submit',function(e){e.preventDefault();var name=$('vr-name').value.trim(),email=$('vr-email').value.trim(),st=$('vr-m-st'),b=$('vr-m-go');
 if(name.length<2){st.textContent='Please enter your full name.';st.style.color='#A33A1F';return;}
 if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){st.textContent='Please enter a valid email address.';st.style.color='#A33A1F';return;}
 b.disabled=true;b.textContent='Registering…';st.style.color=MUT;st.textContent='';
 fetch('/api/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,email:email,consent:$('vr-consent').checked,page:'voterregister',website:$('vr-hp').value})})
 .then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};});})
 .then(function(res){if(!res.ok)throw new Error(res.j&&res.j.error||'Something went wrong.');try{localStorage.setItem('dice_member',JSON.stringify({name:name,email:email,at:Date.now()}));}catch(_){}
  var fn=pendingDl;$('vr-modal').hidden=true;pendingDl=null;b.disabled=false;b.textContent='Register & download';if(fn)fn();})
 .catch(function(err){st.style.color='#A33A1F';st.textContent=err.message||'Could not register you. Please try again.';b.disabled=false;b.textContent='Register & download';});});
function csv(name,head,rows){var q=function(v){v=v==null?'':String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};
 var t=String.fromCharCode(65279)+[head.map(q).join(',')].concat(rows.map(function(r){return r.map(q).join(',');})).join('\n');
 var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},100);}

/* ---------------- shared selects ---------------- */
function opt(v,t,sel){return '<option value="'+esc(v)+'"'+(sel?' selected':'')+'>'+esc(t)+'</option>';}
function Sel(p,onChange){var self={s:'',l:'',w:'',q:''};
 var es=$(p+'-s'),el=$(p+'-l'),ew=$(p+'-w'),eq=$(p+'-q');
 function fill(){es.innerHTML=opt('','All states (Nigeria)',!self.s)+SUM.s.map(function(s){return opt(s.c,tc(s.n),self.s===s.c);}).join('');
  if(!self.s){el.innerHTML=opt('','Pick a state first',true);el.disabled=true;ew.innerHTML=opt('','Pick an LGA first',true);ew.disabled=true;return;}
  el.disabled=false;el.innerHTML=opt('','All LGAs',!self.l)+stateOf(self.s).l.slice().sort(function(a,b){return a[1].localeCompare(b[1]);}).map(function(l){return opt(l[0],tc(l[1]),self.l===l[0]);}).join('');
  if(!self.l){ew.innerHTML=opt('','Pick an LGA first',true);ew.disabled=true;return;}
  var d=ST[self.s];if(!d){ew.innerHTML=opt('',STE[self.s]?'Not available yet':'Loading…',true);ew.disabled=true;return;}
  var ws=d.l[self.l].w;ew.disabled=false;ew.innerHTML=opt('','All wards',!self.w)+Object.keys(ws).sort(function(a,b){return ws[a].n.localeCompare(ws[b].n);}).map(function(k){return opt(k,tc(ws[k].n),self.w===k);}).join('');}
 self.fill=fill;
 self.set=function(s,l,w){self.s=s||'';self.l=l||'';self.w=w||'';fill();if(self.s)loadState(self.s).then(function(){fill();onChange();},function(){fill();onChange();});onChange();};
 es.addEventListener('change',function(){self.set(es.value,'','');});
 el.addEventListener('change',function(){self.set(self.s,el.value,'');});
 ew.addEventListener('change',function(){self.set(self.s,self.l,ew.value);});
 var t;eq.addEventListener('input',function(){self.q=eq.value;clearTimeout(t);t=setTimeout(onChange,160);});
 return self;}

/* ---------------- tooltip ---------------- */
var tip=$('vr-tip');
function showTip(e,h){tip.innerHTML=h;tip.hidden=false;var x=e.clientX+14,y=e.clientY+14;var w=tip.offsetWidth,hh=tip.offsetHeight;if(x+w>innerWidth-8)x=e.clientX-w-14;if(y+hh>innerHeight-8)y=e.clientY-hh-14;tip.style.left=x+'px';tip.style.top=y+'px';}
function hideTip(){tip.hidden=true;}

/* ---------------- map explorer ---------------- */
var MET=[{k:'r23',t:'Registered voters 2023'},{k:'gr',t:'Growth since 2019'},{k:'p23',t:'Polling units 2023'},{k:'pn',t:'New polling units'},{k:'vpp',t:'Voters per polling unit'},{k:'fem',t:'Women (%)',nat:1},{k:'pwd',t:'PWD per 100,000',nat:1}];
var V={s:'',l:'',m:'gr'};
function rowStats(o){return o;}
function valOf(m,o){if(!o)return null;switch(m){case 'r23':return o.r23;case 'gr':return o.r19>0?(o.r23-o.r19)/o.r19*100:null;case 'p23':return o.p23;case 'pn':return o.pn;case 'vpp':return o.p23?o.r23/o.p23:null;case 'fem':return o.g?o.g[0]/(o.g[0]+o.g[1])*100:null;case 'pwd':return o.d?(o.d.reduce(function(a,b){return a+b;},0))/o.r23*1e5:null;}}
function fmtVal(m,v){if(v==null)return '—';if(m==='gr')return (v>0?'+':'')+v.toFixed(1)+'%';if(m==='fem')return v.toFixed(1)+'%';if(m==='vpp')return Math.round(v).toLocaleString('en-GB');if(m==='pwd')return v.toFixed(0);return fmt(v);}
function lgaObj(s,l){var a=lgaOf(s,l);return a?{c:a[0],n:a[1],r23:a[2],r19:a[3],p23:a[4],p19:a[5],pn:a[6],w:a[7]}:null;}
function scale(m,vals){var v=vals.filter(function(x){return x!=null&&isFinite(x);}).sort(function(a,b){return a-b;});
 if(m==='gr'){var neg=v.filter(function(x){return x<0;}),pos=v.filter(function(x){return x>=0;});
  var qp=[0.25,0.5,0.75].map(function(q){return pos.length?pos[Math.min(pos.length-1,Math.floor(q*pos.length))]:0;});
  var mn=neg.length?neg[0]:0;
  var f=function(x){if(x==null)return '#E2E4DE';if(x<0){if(x<=mn*0.66)return DIV_NEG[0];if(x<=mn*0.33)return DIV_NEG[1];return DIV_NEG[2];}var i=0;while(i<3&&x>qp[i])i++;return DIV_POS[i];};
  var leg=[];if(neg.length)leg.push([DIV_NEG[0],'Fell']);leg.push([DIV_POS[0],'+0 to '+qp[0].toFixed(0)+'%'],[DIV_POS[1],'to '+qp[1].toFixed(0)+'%'],[DIV_POS[2],'to '+qp[2].toFixed(0)+'%'],[DIV_POS[3],'above '+qp[2].toFixed(0)+'%']);
  return {f:f,leg:leg};}
 var n=SEQ.length,br=[];for(var i=1;i<n;i++)br.push(v.length?v[Math.min(v.length-1,Math.floor(i/n*v.length))]:0);
 var f2=function(x){if(x==null)return '#E2E4DE';var i=0;while(i<n-1&&x>br[i])i++;return SEQ[i];};
 var leg2=SEQ.map(function(c,i){return [c,(i===0?'up to ':i===n-1?'above ':'to ')+fmtVal(m,i===n-1?br[n-2]:br[i])];});
 return {f:f2,leg:leg2};}
var proj,path,svg,gAll,ready=false;
function initMap(){var box=$('vr-mapbox');var W=600,Hh=536;
 var states=topojson.feature(TOPO,TOPO.objects.states),lgas=topojson.feature(TOPO,TOPO.objects.lgas);
 proj=d3.geoMercator().fitExtent([[12,12],[W-12,Hh-12]],states);path=d3.geoPath(proj);
 svg=d3.select(box).append('svg').attr('viewBox','0 0 '+W+' '+Hh).attr('width','100%').attr('height','100%').attr('role','img').attr('aria-label','Map of Nigeria');
 gAll=svg.append('g');
 gAll.append('g').attr('class','lg').selectAll('path').data(lgas.features).enter().append('path').attr('d',path).attr('class','a').attr('data-s',function(d){return d.properties.s;}).attr('data-l',function(d){return d.properties.l;}).attr('tabindex',-1).style('display','none');
 gAll.append('g').attr('class','sg').selectAll('path').data(states.features).enter().append('path').attr('d',path).attr('class','a').attr('data-s',function(d){return d.properties.s;}).attr('tabindex',0);
 gAll.append('g').attr('class','ol').append('path').attr('fill','none').attr('stroke','#111813').attr('stroke-width',1.2).attr('vector-effect','non-scaling-stroke').attr('pointer-events','none');
 gAll.append('g').attr('class','lb').attr('pointer-events','none');
 svg.on('mousemove',function(e){var t=e.target;if(!t.getAttribute||!t.classList.contains('a')){hideTip();return;}var s=t.getAttribute('data-s'),l=t.getAttribute('data-l');showTip(e,tipHtml(s,l));}).on('mouseleave',hideTip);
 svg.on('click',function(e){var t=e.target;if(!t.classList||!t.classList.contains('a'))return;var s=t.getAttribute('data-s'),l=t.getAttribute('data-l');if(l)go(s,l===V.l?'':l);else go(s,'');});
 svg.on('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var t=e.target;if(!t.classList||!t.classList.contains('a'))return;e.preventDefault();var s=t.getAttribute('data-s'),l=t.getAttribute('data-l');if(l)go(s,l);else go(s,'');});
 ready=true;}
function tipHtml(s,l){var o=l?lgaObj(s,l):stateOf(s);if(!o)return '';var m=V.m;var v=valOf(m,o);
 return '<b>'+esc(tc(o.n))+(l?'<span style="opacity:.75;font-weight:400"> · '+esc(tc(stateOf(s).n))+'</span>':'')+'</b><br>'+esc(metName(m))+': <b>'+fmtVal(m,v)+'</b><br><span style="opacity:.8">2023: '+fmt(o.r23)+' voters · '+fmt(o.p23)+' PUs</span>';}
function metName(m){for(var i=0;i<MET.length;i++)if(MET[i].k===m)return MET[i].t;}
function go(s,l){V.s=s||'';V.l=l||'';if(!V.s&&!V.l){}if(V.s&&(V.m==='fem'||V.m==='pwd'))V.m='gr';renderMap();if(V.s)loadState(V.s).then(function(){if(V.s===s)renderSide();},function(){if(V.s===s)renderSide();});}
function renderMap(){if(!ready)return;var m=V.m;
 $('vr-metrics').innerHTML=MET.filter(function(x){return !x.nat||!V.s;}).map(function(x){return '<button type="button" class="vr-chip" data-m="'+x.k+'" aria-pressed="'+(x.k===m)+'">'+x.t+'</button>';}).join('');
 $('vr-crumb').innerHTML='<a href="#map" data-go="" style="color:'+(V.s?G7:INK)+'">Nigeria</a>'+(V.s?' <span aria-hidden="true" style="color:'+MUT+'">›</span> <a href="#map" data-go="'+V.s+'" style="color:'+(V.l?G7:INK)+'">'+esc(tc(stateOf(V.s).n))+'</a>':'')+(V.l?' <span aria-hidden="true" style="color:'+MUT+'">›</span> <span>'+esc(tc(lgaObj(V.s,V.l).n))+'</span>':'');
 var sg=gAll.select('.sg').selectAll('path'),lg=gAll.select('.lg').selectAll('path');
 var W=600,Hh=536,k,tx,ty;
 if(!V.s){var vals=SUM.s.map(function(o){return valOf(m,o);});var sc=scale(m,vals);
  sg.style('display',null).attr('fill',function(d){return sc.f(valOf(m,stateOf(d.properties.s)));}).classed('sel',false);lg.style('display','none');
  gAll.select('.ol path').attr('d',null);gAll.transition().duration(450).attr('transform','');legend(sc);
  labels(topojson.feature(TOPO,TOPO.objects.states).features.map(function(f){return {f:f,n:stateOf(f.properties.s).n};}),1,0);}
 else{var st=stateOf(V.s);var lv=st.l.map(function(a){return valOf(m,lgaObj(V.s,a[0]));});var sc2=scale(m,lv);
  sg.style('display',function(d){return d.properties.s===V.s?'none':null;}).attr('fill','#E7E9E3');
  lg.style('display',function(d){return d.properties.s===V.s?null:'none';}).attr('fill',function(d){return d.properties.s===V.s?sc2.f(valOf(m,lgaObj(V.s,d.properties.l))):'none';}).classed('sel',function(d){return d.properties.l===V.l;}).attr('tabindex',function(d){return d.properties.s===V.s?0:-1;});
  lg.filter(function(d){return d.properties.l===V.l;}).raise();
  var feat=topojson.feature(TOPO,TOPO.objects.states).features.filter(function(f){return f.properties.s===V.s;})[0];
  var b=path.bounds(feat),dx=b[1][0]-b[0][0],dy=b[1][1]-b[0][1],cx=(b[0][0]+b[1][0])/2,cy=(b[0][1]+b[1][1])/2;k=Math.min(24,0.9/Math.max(dx/W,dy/Hh));tx=W/2-k*cx;ty=Hh/2-k*cy;
  gAll.transition().duration(450).attr('transform','translate('+tx+','+ty+') scale('+k+')');
  gAll.select('.ol path').attr('d',path(feat));legend(sc2);
  labels(topojson.feature(TOPO,TOPO.objects.lgas).features.filter(function(f){return f.properties.s===V.s;}).map(function(f){var o=lgaObj(V.s,f.properties.l);return {f:f,n:o?o.n:'',sel:f.properties.l===V.l};}),k,1);}
 renderSide();}
function labels(items,k,lga){var fs=(lga?9.5:9)/k,g=gAll.select('.lb'),placed=[];g.selectAll('text').remove();
 items.sort(function(a,b){return (b.sel?1e12:path.area(b.f))-(a.sel?1e12:path.area(a.f));});
 items.forEach(function(it){if(!it.n)return;var a=path.area(it.f)*k*k;if(lga&&a<260&&!it.sel)return;var c=path.centroid(it.f);if(!isFinite(c[0]))return;
  var nm=tc(it.n);if(nm.length>16&&lga)nm=nm.replace(/ (North|South|East|West|Central)/,function(m){return ' '+m.trim().charAt(0)+'.';});
  g.append('text').attr('x',c[0]).attr('y',c[1]).attr('dy','0.35em').attr('text-anchor','middle').attr('font-size',fs).attr('font-weight',it.sel?800:600).attr('fill',INK).attr('stroke','#FFFFFF').attr('stroke-width',2.6/k).attr('stroke-linejoin','round').attr('paint-order','stroke').attr('font-family','Public Sans,system-ui,sans-serif').text(nm);
  if(lga){var t=g.select('text:last-child').node(),bb;try{bb=t.getBBox();}catch(_){return;}var pad=1/k;if(placed.some(function(p){return bb.x<p.x+p.width+pad&&bb.x+bb.width+pad>p.x&&bb.y<p.y+p.height&&bb.y+bb.height>p.y;})){t.remove();return;}placed.push(bb);}});}
function legend(sc){$('vr-legend').innerHTML='<span style="font-weight:700;color:'+INK+'">'+esc(metName(V.m))+'</span>'+sc.leg.map(function(x){return '<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:14px;height:14px;border-radius:3px;background:'+x[0]+';display:inline-block;border:1px solid rgba(0,0,0,.06)"></span>'+esc(x[1])+'</span>';}).join('')+'<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:14px;height:14px;border-radius:3px;background:#E2E4DE;display:inline-block"></span>No data</span>';}
function kpis(o,extra){return '<div class="vr-kpis">'+
 '<div class="vr-k"><span>Registered 2023</span><b>'+fmt(o.r23)+'</b><i>2019: '+fmt(o.r19)+'</i></div>'+
 '<div class="vr-k"><span>Growth since 2019</span><b style="color:'+((o.r23-o.r19)<0?GOLDT:G7)+'">'+pcs(o.r23,o.r19)+'</b><i>'+sfmt(o.r23-o.r19)+' voters</i></div>'+
 '<div class="vr-k"><span>Polling units 2023</span><b>'+fmt(o.p23)+'</b><i>2019: '+fmt(o.p19)+' · '+pcs(o.p23,o.p19)+'</i></div>'+
 '<div class="vr-k"><span>New polling units</span><b style="color:'+GOLDT+'">'+fmt(o.pn)+'</b><i>'+share(o.pn,o.p23)+' of 2023 units</i></div>'+(extra||'')+'</div>';}
function barList(items,m,click){var vals=items.map(function(x){return x.v;}).filter(function(v){return v!=null;});var mx=Math.max.apply(null,vals.map(Math.abs).concat([1e-9]));
 return '<div style="display:flex;flex-direction:column;gap:2px;max-height:360px;overflow:auto;padding-right:4px">'+items.map(function(x){var w=x.v==null?0:Math.max(1.5,Math.abs(x.v)/mx*100);var col=(m==='gr'&&x.v<0)?GOLDD:G7;
  return '<div class="vr-bar'+(click?' click':'')+'"'+(click?' role="button" tabindex="0" data-pick="'+x.c+'"':'')+' title="'+esc(tc(x.n)+': '+fmtVal(m,x.v))+'"><span style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(tc(x.n))+'</span><span class="t"><span style="width:'+w.toFixed(1)+'%;background:'+col+'"></span></span><span style="text-align:right;font-weight:600;font-size:13px">'+fmtVal(m,x.v)+'</span></div>';}).join('')+'</div>';}
function renderSide(){var box=$('vr-side');var m=V.m;
 if(!V.s){var tot={r23:0,r19:0,p23:0,p19:0,pn:0};SUM.s.forEach(function(o){for(var k in tot)tot[k]+=o[k];});
  var items=SUM.s.map(function(o){return {c:o.c,n:o.n,v:valOf(m,o)};}).sort(function(a,b){return (b.v==null?-1e18:b.v)-(a.v==null?-1e18:a.v);});
  box.innerHTML='<h3 style="margin:0;font-family:Archivo,sans-serif;font-size:22px;color:'+G9+'">Nigeria</h3>'+kpis(tot)+'<div style="display:flex;flex-direction:column;gap:6px"><span style="font-size:13px;font-weight:700;color:'+MUT+'">States by '+esc(metName(m).toLowerCase())+' · tap to open</span>'+barList(items,m,true)+'</div>';return;}
 var st=stateOf(V.s);
 if(!V.l){var it=st.l.map(function(a){var o=lgaObj(V.s,a[0]);return {c:o.c,n:o.n,v:valOf(m,o)};}).sort(function(a,b){return (b.v==null?-1e18:b.v)-(a.v==null?-1e18:a.v);});
  box.innerHTML='<h3 style="margin:0;font-family:Archivo,sans-serif;font-size:22px;color:'+G9+'">'+esc(tc(st.n))+' <span style="font-size:14px;color:'+MUT+';font-weight:600">'+st.l.length+' LGAs · '+fmt(st.w)+' wards</span></h3>'+kpis(st)+'<div style="display:flex;flex-direction:column;gap:6px"><span style="font-size:13px;font-weight:700;color:'+MUT+'">LGAs by '+esc(metName(m).toLowerCase())+' · tap to open</span>'+barList(it,m,true)+'</div>';return;}
 var lo=lgaObj(V.s,V.l);var d=ST[V.s];
 var wardHtml='<p style="margin:0;color:'+MUT+'">'+(STE[V.s]?PUMSG:'Loading wards…')+'</p>';
 if(d){var ws=d.l[V.l].w;var rows=Object.keys(ws).map(function(k){var w=ws[k];return {c:k,n:w.n,v:valOf(m==='vpp'||m==='p23'||m==='pn'||m==='r23'?m:'gr',w),w:w};}).sort(function(a,b){return (b.v==null?-1e18:b.v)-(a.v==null?-1e18:a.v);});
  wardHtml='<span style="font-size:13px;font-weight:700;color:'+MUT+'">Wards by '+esc(metName(m==='fem'||m==='pwd'?'gr':m).toLowerCase())+' · tap for polling units</span>'+barList(rows,m==='fem'||m==='pwd'?'gr':m,true).replace(/data-pick="/g,'data-ward="');}
 box.innerHTML='<h3 style="margin:0;font-family:Archivo,sans-serif;font-size:22px;color:'+G9+'">'+esc(tc(lo.n))+' <span style="font-size:14px;color:'+MUT+';font-weight:600">'+esc(tc(st.n))+' · '+lo.w+' wards</span></h3>'+kpis(lo)+'<div style="display:flex;flex-direction:column;gap:6px">'+wardHtml+'</div><button type="button" class="vr-btn ghost" data-open-an style="align-self:flex-start">Open in Polling Unit Analysis →</button>';}
$('vr-metrics').addEventListener('click',function(e){var b=e.target.closest('[data-m]');if(!b)return;V.m=b.getAttribute('data-m');renderMap();});
$('vr-crumb').addEventListener('click',function(e){var a=e.target.closest('[data-go]');if(!a)return;e.preventDefault();go(a.getAttribute('data-go'),'');});
function sidePick(e){var b=e.target.closest('[data-pick],[data-ward],[data-open-an]');if(!b)return;
 if(b.hasAttribute('data-open-an')){AN.set(V.s,V.l,'');$('analysis').scrollIntoView({behavior:'smooth'});return;}
 if(b.hasAttribute('data-ward')){AN.set(V.s,V.l,b.getAttribute('data-ward'));$('analysis').scrollIntoView({behavior:'smooth'});return;}
 var c=b.getAttribute('data-pick');if(!V.s)go(c,'');else go(V.s,c);}
$('vr-side').addEventListener('click',sidePick);
$('vr-side').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();sidePick(e);}});

/* ---------------- directory ---------------- */
var DIR;
function dirUnits(){var d=ST[DIR.s];if(!d||d.partial)return null;var out=[];var ls=DIR.l?[DIR.l]:Object.keys(d.l);
 ls.forEach(function(l){var ws=d.l[l].w;(DIR.w&&DIR.l===l?[DIR.w]:Object.keys(ws)).forEach(function(w){ws[w].u.forEach(function(u){out.push({c:code(DIR.s,l,w,u[0]),n:u[1],r:u[2],f:u[3]<0?'n':'',lga:d.l[l].n,ward:ws[w].n});});});});return out;}
function renderDir(){var box=$('dir-out'),cnt=$('dir-count');
 if(!DIR.s){cnt.textContent='';box.innerHTML='<p style="margin:0;color:'+MUT+'">Start by choosing your state.</p>';return;}
 var u=dirUnits();if(!u){cnt.textContent='';box.innerHTML='<p style="margin:0;color:'+MUT+'">'+(STE[DIR.s]?PUMSG:'Loading polling units…')+'</p>';return;}
 var q=norm(DIR.q);if(q){var terms=q.split(' ');u=u.filter(function(x){var h=norm(x.n+' '+x.c);return terms.every(function(t){return h.indexOf(t)>=0;});});}
 var lim=u.length>600&&!q&&!DIR.w?300:2000;
 cnt.textContent=fmt(u.length)+' polling unit'+(u.length===1?'':'s')+(q?' matching “'+DIR.q.trim()+'”':'')+' · '+fmt(u.reduce(function(a,x){return a+x.r;},0))+' registered voters';
 var showLoc=!DIR.w;
 box.innerHTML=u.length?'<div class="vr-scroll"><table class="vr-tbl"><thead><tr><th>Code</th><th>Polling unit</th>'+(showLoc?'<th>Ward · LGA</th>':'')+'<th class="n">Registered voters (2023)</th><th>Remark</th></tr></thead><tbody>'+u.slice(0,lim).map(function(x){return '<tr><td style="white-space:nowrap;font-variant-numeric:tabular-nums;color:'+MUT+'">'+x.c+'</td><td style="font-weight:600">'+esc(x.n)+'</td>'+(showLoc?'<td style="color:'+MUT+'">'+esc(tc(x.ward))+' · '+esc(tc(x.lga))+'</td>':'')+'<td class="n">'+fmt(x.r)+'</td><td>'+tag(x.f)+'</td></tr>';}).join('')+'</tbody></table></div>'+(u.length>lim?'<p style="margin:8px 0 0;font-size:13px;color:'+MUT+'">Showing the first '+fmt(lim)+'. Pick an LGA and ward, or search, to narrow the list.</p>':''):'<p style="margin:0;color:'+MUT+'">No polling unit matches.</p>';}

/* ---------------- analysis ---------------- */
var AN,ansort={k:'r23',d:-1};
function anRows(){var q=norm(AN.q),out={lvl:'',rows:[],tot:null,pu:false};
 if(!AN.s){out.lvl='State';out.rows=SUM.s.map(function(o){return {id:o.c,n:o.n,r19:o.r19,r23:o.r23,p19:o.p19,p23:o.p23,pn:o.pn};});
  if(q){var r2=[];SUM.s.forEach(function(o){if(norm(o.n).indexOf(q)>=0)r2.push({id:o.c,n:o.n,sub:'State',r19:o.r19,r23:o.r23,p19:o.p19,p23:o.p23,pn:o.pn});o.l.forEach(function(a){if(norm(a[1]).indexOf(q)>=0)r2.push({id:o.c+'|'+a[0],n:a[1],sub:'LGA · '+tc(o.n),r19:a[3],r23:a[2],p19:a[5],p23:a[4],pn:a[6]});});});out.rows=r2;out.lvl='Area';out.hint=r2.length?'':'Tip: choose a state to search ward and polling unit names.';}
  var t={r19:0,r23:0,p19:0,p23:0,pn:0};SUM.s.forEach(function(o){for(var k in t)t[k]+=o[k];});out.tot=t;out.title='Nigeria';return out;}
 var st=stateOf(AN.s),d=ST[AN.s];
 if(q&&q.length>=2){if(!d)return null;out.lvl='Polling unit';out.pu=true;var terms=q.split(' ');
  Object.keys(d.l).forEach(function(l){if(AN.l&&l!==AN.l)return;var ws=d.l[l].w;Object.keys(ws).forEach(function(w){if(AN.w&&w!==AN.w)return;var wn=norm(ws[w].n),ln=norm(d.l[l].n);
   if(terms.every(function(t){return wn.indexOf(t)>=0;}))out.rows.push({id:'w|'+l+'|'+w,n:ws[w].n,sub:'Ward · '+tc(d.l[l].n),r19:ws[w].r19,r23:ws[w].r23,p19:ws[w].p19,p23:ws[w].p23,pn:ws[w].pn,isw:1});
   (ws[w].u||[]).forEach(function(u){var c=code(AN.s,l,w,u[0]);var h=norm(u[1]+' '+c);if(terms.every(function(t){return h.indexOf(t)>=0;}))out.rows.push({id:c,n:u[1],sub:tc(ws[w].n)+' · '+tc(d.l[l].n),r19:u[3],r23:u[2],f:u[3]<0?'n':u[4],old:u[5]});});});});
  out.title='Search results in '+tc(st.n);return out;}
 if(!AN.l){out.lvl='LGA';out.rows=st.l.map(function(a){return {id:a[0],n:a[1],r19:a[3],r23:a[2],p19:a[5],p23:a[4],pn:a[6]};});out.tot=st;out.title=tc(st.n);return out;}
 if(!d)return null;var L=d.l[AN.l];
 if(!AN.w){out.lvl='Ward';out.rows=Object.keys(L.w).map(function(k){var w=L.w[k];return {id:k,n:w.n,r19:w.r19,r23:w.r23,p19:w.p19,p23:w.p23,pn:w.pn};});out.tot=lgaObj(AN.s,AN.l);out.title=tc(L.n)+', '+tc(st.n);return out;}
 var W=L.w[AN.w];if(!W.u)return null;out.lvl='Polling unit';out.pu=true;out.rows=W.u.map(function(u){return {id:code(AN.s,AN.l,AN.w,u[0]),n:u[1],r19:u[3],r23:u[2],f:u[3]<0?'n':u[4],old:u[5]};});out.tot=W;out.title=tc(W.n)+' ward, '+tc(L.n);return out;}
function renderAn(){var r=anRows(),box=$('an-out');
 if(!r){box.innerHTML='<p style="margin:0;color:'+MUT+'">'+(STE[AN.s]?PUMSG:'Loading…')+'</p>';return;}
 $('an-kpis').innerHTML=r.tot?kpis(r.tot).replace(/^<div class="vr-kpis">|<\/div>$/g,''):'';
 var rows=r.rows.slice();var k=ansort.k,dd=ansort.d;
 var gv=function(x,k){if(k==='n')return x.n;if(k==='ch')return x.r19<0?null:x.r23-x.r19;if(k==='g')return x.r19>0?(x.r23-x.r19)/x.r19:null;if(k==='pg')return x.p19>0?(x.p23-x.p19)/x.p19:null;return x[k];};
 rows.sort(function(a,b){var A=gv(a,k),B=gv(b,k);if(k==='n')return dd*String(A).localeCompare(String(B));if(A==null)return 1;if(B==null)return -1;return dd*(A-B);});
 var newN=r.pu?rows.filter(function(x){return x.f==='n';}).length:0;
 $('an-count').textContent=r.title+' · '+fmt(rows.length)+' '+(r.lvl==='Polling unit'?'result':r.lvl==='LGA'?'LGA':r.lvl.toLowerCase())+(rows.length===1?'':'s')+(r.pu&&newN?' · '+fmt(newN)+' new polling units':'');
 var th=function(key,label,n){var on=k===key;return '<th'+(n?' class="n"':'')+' aria-sort="'+(on?(dd>0?'ascending':'descending'):'none')+'"><button type="button" data-sort="'+key+'">'+label+(on?(dd>0?' ▲':' ▼'):'')+'</button></th>';};
 var head='<tr>'+th('n',r.lvl==='Area'?'Area':r.lvl)+th('r19','2019',1)+th('r23','2023',1)+th('ch','Change',1)+th('g','Growth',1)+(r.pu?'<th>Remark</th>':th('p19','PUs 2019',1)+th('p23','PUs 2023',1)+th('pn','New PUs',1)+th('pg','PU growth',1))+'</tr>';
 var lim=1500;
 var body=rows.slice(0,lim).map(function(x){var click=!r.pu||x.isw;var attr=click?' class="click" tabindex="0" data-row="'+esc(x.id)+'"':'';
  return '<tr'+attr+'><td><span style="font-weight:600">'+esc(r.pu&&!x.isw?x.n:tc(x.n))+'</span>'+(x.sub?'<br><span style="font-size:12px;color:'+MUT+'">'+esc(x.sub)+(r.pu&&!x.isw?' · '+x.id:'')+'</span>':(r.pu?'<br><span style="font-size:12px;color:'+MUT+'">'+x.id+'</span>':''))+(x.f==='c'&&x.old?'<br><span style="font-size:12px;color:'+MUT+'">2019 name: '+esc(x.old)+'</span>':'')+'</td>'+
   '<td class="n">'+(x.r19<0?'—':fmt(x.r19))+'</td><td class="n" style="font-weight:700">'+fmt(x.r23)+'</td><td class="n">'+(x.r19<0?'—':sfmt(x.r23-x.r19))+'</td><td class="n">'+(x.r19<0?'—':growthTag(x.r23,x.r19))+'</td>'+
   (r.pu?'<td>'+(x.isw?'<span class="vr-tag" style="background:'+GL+';color:'+G9+'">Ward</span>':tag(x.f))+'</td>':'<td class="n">'+fmt(x.p19)+'</td><td class="n">'+fmt(x.p23)+'</td><td class="n">'+fmt(x.pn)+'</td><td class="n">'+growthTag(x.p23,x.p19)+'</td>')+'</tr>';}).join('');
 box.innerHTML=(rows.length?'<div class="vr-scroll"><table class="vr-tbl"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>':'<p style="margin:0;color:'+MUT+'">Nothing matches.</p>')+(rows.length>lim?'<p style="margin:8px 0 0;font-size:13px;color:'+MUT+'">Showing the first '+fmt(lim)+' rows. Narrow your search to see more.</p>':'')+(r.hint?'<p style="margin:8px 0 0;font-size:13px;color:'+MUT+'">'+r.hint+'</p>':'');
 AN._last=r;AN._rows=rows;}
$('an-out').addEventListener('click',function(e){var s=e.target.closest('[data-sort]');if(s){var k=s.getAttribute('data-sort');ansort={k:k,d:ansort.k===k?-ansort.d:(k==='n'?1:-1)};renderAn();return;}
 var tr=e.target.closest('[data-row]');if(tr)drill(tr.getAttribute('data-row'));});
$('an-out').addEventListener('keydown',function(e){if(e.key!=='Enter')return;var tr=e.target.closest('[data-row]');if(tr)drill(tr.getAttribute('data-row'));});
function drill(id){var q=$('an-q');if(id.indexOf('w|')===0){var p=id.split('|');q.value='';AN.q='';AN.set(AN.s,p[1],p[2]);return;}
 if(id.indexOf('|')>0){var p2=id.split('|');q.value='';AN.q='';AN.set(p2[0],p2[1],'');return;}
 if(!AN.s){AN.set(id,'','');return;}if(!AN.l){AN.set(AN.s,id,'');return;}if(!AN.w){AN.set(AN.s,AN.l,id);return;}}

/* ---------------- gender / pwd / occupation ---------------- */
function hbar(label,v,max,disp,c,attr){return '<div class="vr-bar'+(attr?' click':'')+'"'+(attr||'')+'><span style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(label)+'</span><span class="t"><span style="width:'+Math.max(1.5,v/max*100).toFixed(1)+'%;background:'+(c||G7)+'"></span></span><span style="text-align:right;font-weight:600;font-size:13px">'+disp+'</span></div>';}
function card(t,n,b){return '<div class="vr-card" style="display:flex;flex-direction:column;gap:14px;min-width:0"><div><h3 style="margin:0;font-family:Archivo,sans-serif;font-size:20px">'+t+'</h3>'+(n?'<span style="font-size:13px;color:'+MUT+'">'+n+'</span>':'')+'</div>'+b+'</div>';}
function renderGender(){var f=0,m=0;SUM.s.forEach(function(o){f+=o.g[0];m+=o.g[1];});
 var rows=SUM.s.map(function(o){return {c:o.c,n:o.n,f:o.g[0],m:o.g[1],p:o.g[0]/(o.g[0]+o.g[1])*100};}).sort(function(a,b){return b.p-a.p;});
 var split='<div style="display:flex;height:34px;border-radius:8px;overflow:hidden;font-size:13px;font-weight:700;color:#fff"><div style="width:'+(f/(f+m)*100).toFixed(2)+'%;background:'+GOLDD+';display:flex;align-items:center;padding-left:10px">Women '+(f/(f+m)*100).toFixed(1)+'%</div><div style="flex:1;background:'+G7+';display:flex;align-items:center;justify-content:flex-end;padding-right:10px">Men '+(m/(f+m)*100).toFixed(1)+'%</div></div>'+
  '<div class="vr-kpis"><div class="vr-k"><span>Women</span><b style="color:'+GOLDT+'">'+fmt(f)+'</b></div><div class="vr-k"><span>Men</span><b>'+fmt(m)+'</b></div><div class="vr-k"><span>States where women are the majority</span><b>'+rows.filter(function(x){return x.p>50;}).length+'</b><i>of 37</i></div></div>';
 var bars=rows.map(function(x){return '<div class="vr-bar click" role="button" tabindex="0" data-state="'+x.c+'" title="'+esc(tc(x.n))+': '+fmt(x.f)+' women, '+fmt(x.m)+' men"><span style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(tc(x.n))+'</span><span class="t" style="position:relative;display:flex;border-radius:4px;overflow:hidden;height:14px;background:'+G7+'"><span style="width:'+x.p.toFixed(1)+'%;background:'+GOLDD+';border-radius:0"></span><span style="position:absolute;left:50%;top:-2px;bottom:-2px;width:2px;background:#fff"></span></span><span style="text-align:right;font-weight:600;font-size:13px">'+x.p.toFixed(1)+'% women</span></div>';}).join('');
 $('gen-out').innerHTML=card('Nigeria, 2023',fmt(f+m)+' registered voters',split)+card('Share of women, by state','Gold = women, green = men. The white line marks 50%.','<div style="display:flex;flex-direction:column;gap:2px;max-height:520px;overflow:auto;padding-right:4px">'+bars+'</div><button type="button" class="vr-btn ghost" data-dl="gender" style="align-self:flex-start">Download (CSV)</button>');}
var pwdState='';
function renderPwd(){var tot=PWDH.map(function(){return 0;});SUM.s.forEach(function(o){o.d.forEach(function(v,i){tot[i]+=v;});});var T=tot.reduce(function(a,b){return a+b;},0);
 var src=pwdState?stateOf(pwdState).d:tot,ST_=src.reduce(function(a,b){return a+b;},0);var mx=Math.max.apply(null,src);
 var cats=PWDH.map(function(h,i){return {h:h,v:src[i]};}).sort(function(a,b){return b.v-a.v;});
 var sel='<label class="vr-lab" style="max-width:320px">Show<select class="vr-sel" id="pwd-s">'+opt('','Nigeria',!pwdState)+SUM.s.map(function(o){return opt(o.c,tc(o.n),pwdState===o.c);}).join('')+'</select></label>';
 var a=card('By type of disability'+(pwdState?' — '+esc(tc(stateOf(pwdState).n)):' — Nigeria'),fmt(ST_)+' voters with a disability'+(pwdState?'':' · '+(T/SUM.s.reduce(function(a,o){return a+o.r23;},0)*1e5).toFixed(0)+' per 100,000 registered'),sel+'<div class="vr-wide" style="display:flex;flex-direction:column;gap:2px">'+cats.map(function(c){return hbar(c.h,c.v,mx,fmt(c.v)+' · '+share(c.v,ST_),G7);}).join('')+'</div>'+(PWDH[0]==='Category 1'?'<p style="margin:0;font-size:12px;color:'+MUT+'">Category names to be confirmed.</p>':''));
 var rows=SUM.s.map(function(o){var s=o.d.reduce(function(a,b){return a+b;},0);return {c:o.c,n:o.n,v:s,r:s/o.r23*1e5};}).sort(function(a,b){return b.v-a.v;});var mx2=rows[0].v;
 var b=card('By state','Voters with a disability · per 100,000 registered','<div style="display:flex;flex-direction:column;gap:2px;max-height:520px;overflow:auto;padding-right:4px">'+rows.map(function(x){return hbar(tc(x.n),x.v,mx2,fmt(x.v)+' · '+x.r.toFixed(0),G5,' role="button" tabindex="0" data-pwd="'+x.c+'"');}).join('')+'</div><button type="button" class="vr-btn ghost" data-dl="pwd" style="align-self:flex-start">Download (CSV)</button>');
 $('pwd-out').innerHTML=a+b;$('pwd-s').addEventListener('change',function(e){pwdState=e.target.value;renderPwd();});}
var occState='';
function renderOcc(){var H=SUM.occh,nat=H.map(function(){return 0;});SUM.s.forEach(function(o){o.o.forEach(function(v,i){nat[i]+=v;});});var NT=nat.reduce(function(a,b){return a+b;},0);
 var st=occState?stateOf(occState):null,src=st?st.o:nat,T=src.reduce(function(a,b){return a+b;},0);
 var order=H.map(function(h,i){return i;}).sort(function(a,b){return src[b]-src[a];});var mx=Math.max.apply(null,order.map(function(i){return Math.max(src[i]/T,nat[i]/NT);}));
 var sel='<label class="vr-lab" style="max-width:320px">Show<select class="vr-sel" id="occ-s">'+opt('','Nigeria',!occState)+SUM.s.map(function(o){return opt(o.c,tc(o.n),occState===o.c);}).join('')+'</select></label>';
 var rows=order.map(function(i){var p=src[i]/T,pn=nat[i]/NT;return '<div style="display:grid;grid-template-columns:minmax(90px,140px) minmax(40px,1fr) 120px;gap:10px;align-items:center;font-size:14px"><span style="font-weight:600">'+esc(H[i])+'</span><span style="display:flex;flex-direction:column;gap:2px"><span style="display:block;height:12px;width:'+Math.max(1.5,p/mx*100).toFixed(1)+'%;background:'+G7+';border-radius:0 4px 4px 0"></span>'+(st?'<span style="display:block;height:6px;width:'+Math.max(1,pn/mx*100).toFixed(1)+'%;background:#B9C2BB;border-radius:0 3px 3px 0"></span>':'')+'</span><span style="text-align:right;font-size:13px;font-weight:600">'+(p*100).toFixed(1)+'%'+(st?' <span style="color:'+MUT+';font-weight:400">vs '+(pn*100).toFixed(1)+'%</span>':'')+'</span></div>';}).join('');
 var a=card('Occupation'+(st?' — '+esc(tc(st.n)):' — Nigeria'),fmt(T)+' registered voters'+(st?' · grey bar = Nigeria':''),sel+'<div style="display:flex;flex-direction:column;gap:8px">'+rows+'</div>');
 var si=H.indexOf('Student'),fi=H.indexOf('Farming/fishing'),hi=H.indexOf('Housewife');
 var top=function(i){return SUM.s.map(function(o){return {c:o.c,n:o.n,p:o.o[i]/o.r23*100};}).sort(function(a,b){return b.p-a.p;});};
 var lst=function(i,t,c){var r=top(i).slice(0,8);return '<div style="display:flex;flex-direction:column;gap:2px"><span style="font-size:13px;font-weight:700;color:'+MUT+'">'+t+'</span>'+r.map(function(x){return hbar(tc(x.n),x.p,r[0].p,x.p.toFixed(1)+'%',c,' role="button" tabindex="0" data-occ="'+x.c+'"');}).join('')+'</div>';};
 var b=card('Where each group is largest','Share of each state’s register · tap a state to compare',lst(si,'Students',G7)+lst(fi,'Farming/fishing',G5)+lst(hi,'Housewives',GOLDD)+'<button type="button" class="vr-btn ghost" data-dl="occ" style="align-self:flex-start">Download (CSV)</button>');
 $('occ-out').innerHTML=a+b;$('occ-s').addEventListener('change',function(e){occState=e.target.value;renderOcc();});}
document.addEventListener('click',function(e){var a=e.target.closest('[data-state]');if(a&&a.closest('#gen-out')){go(a.getAttribute('data-state'),'');$('map').scrollIntoView({behavior:'smooth'});}
 var p=e.target.closest('[data-pwd]');if(p){pwdState=p.getAttribute('data-pwd');renderPwd();$('pwd').scrollIntoView({behavior:'smooth'});}
 var o=e.target.closest('[data-occ]');if(o){occState=o.getAttribute('data-occ');renderOcc();$('occupation').scrollIntoView({behavior:'smooth'});}});

/* ---------------- downloads ---------------- */
var DLS=[['gender','Gender by state','Women and men on the 2023 register.'],['pwd','PWD by state','Voters with a disability, by type and state.'],['occ','Occupation by state','Occupations of registered voters, by state.']];
function renderDl(){$('dl-out').innerHTML=DLS.map(function(d){var needS=d[0]==='pu'||d[0]==='ward';return '<div class="vr-card" style="display:flex;flex-direction:column;gap:10px"><h3 style="margin:0;font-family:Archivo,sans-serif;font-size:18px">'+d[1]+'</h3><p style="margin:0;font-size:14px;color:'+MUT+'">'+d[2]+'</p>'+(needS?'<select class="vr-sel" id="dl-s-'+d[0]+'" aria-label="State">'+SUM.s.map(function(o){return opt(o.c,tc(o.n),false);}).join('')+'</select>':'')+'<button type="button" class="vr-btn" data-dl="'+d[0]+'" style="align-self:flex-start">Download CSV</button></div>';}).join('');}
function doDl(kind){var d,rows=[];
 if(kind==='dir'){if(!DIR.s){alert('Choose a state first.');return;}var u=dirUnits();if(!u)return;var q=norm(DIR.q);if(q){var t=q.split(' ');u=u.filter(function(x){var h=norm(x.n+' '+x.c);return t.every(function(s){return h.indexOf(s)>=0;});});}
  csv('dice-polling-units-'+norm(stateOf(DIR.s).n).replace(/ /g,'-')+'.csv',['code','state','lga','ward','polling_unit','registered_voters_2023','remark'],u.map(function(x){return [x.c,stateOf(DIR.s).n,x.lga,x.ward,x.n,x.r,x.f==='n'?'New polling unit':''];}));return;}
 if(kind==='an'){var r=AN._last,rs=AN._rows||[];if(!r)return;csv('dice-pu-analysis-'+norm(r.title).replace(/ /g,'-').slice(0,60)+'.csv',[r.lvl,'detail','code','registered_2019','registered_2023','change','growth_pct'].concat(r.pu?['remark','name_2019']:['pus_2019','pus_2023','new_pus','pu_growth_pct']),rs.map(function(x){return [x.n,x.sub||'',r.pu?x.id:'',x.r19<0?'':x.r19,x.r23,x.r19<0?'':x.r23-x.r19,x.r19>0?pc(x.r23,x.r19,2):''].concat(r.pu?[x.isw?'Ward':x.f==='n'?'New polling unit':x.f==='c'?'Renamed':'',x.old||'']:[x.p19,x.p23,x.pn,pc(x.p23,x.p19,2)]);}));return;}
 if(kind==='lga'){SUM.s.forEach(function(o){rows.push([o.n,'(state total)',o.r19,o.r23,pc(o.r23,o.r19,2),o.p19,o.p23,o.pn]);o.l.forEach(function(a){rows.push([o.n,a[1],a[3],a[2],pc(a[2],a[3],2),a[5],a[4],a[6]]);});});csv('dice-state-lga-summary.csv',['state','lga','registered_2019','registered_2023','growth_pct','pus_2019','pus_2023','new_pus'],rows);return;}
 if(kind==='gender'){csv('dice-gender-2023.csv',['state','female','male','total','female_pct'],SUM.s.map(function(o){return [o.n,o.g[0],o.g[1],o.g[0]+o.g[1],(o.g[0]/(o.g[0]+o.g[1])*100).toFixed(2)];}));return;}
 if(kind==='pwd'){csv('dice-pwd-2023.csv',['state'].concat(PWDH,['total']),SUM.s.map(function(o){return [o.n].concat(o.d,[o.d.reduce(function(a,b){return a+b;},0)]);}));return;}
 if(kind==='occ'){csv('dice-occupation-2023.csv',['state'].concat(SUM.occh,['total']),SUM.s.map(function(o){return [o.n].concat(o.o,[o.r23]);}));return;}
 if(kind==='pu'||kind==='ward'){var sc=$('dl-s-'+kind).value,sn=stateOf(sc).n;loadState(sc).catch(function(){alert(PUMSG);return null;}).then(function(dd){if(!dd)return;var out=[];Object.keys(dd.l).forEach(function(l){var L=dd.l[l];Object.keys(L.w).forEach(function(w){var W=L.w[w];
   if(kind==='ward')out.push([sn,L.n,W.n,code(sc,l,w),W.r19,W.r23,pc(W.r23,W.r19,2),W.p19,W.p23,W.pn]);
   else W.u.forEach(function(u){out.push([code(sc,l,w,u[0]),sn,L.n,W.n,u[1],u[3]<0?'':u[3],u[2],u[3]>0?pc(u[2],u[3],2):'',u[3]<0?'New polling unit':u[4]==='c'?'Renamed':'',u[5]||'']);});});});
  if(kind==='ward')csv('dice-wards-'+norm(sn).replace(/ /g,'-')+'.csv',['state','lga','ward','ward_code','registered_2019','registered_2023','growth_pct','pus_2019','pus_2023','new_pus'],out);
  else csv('dice-polling-units-2019-2023-'+norm(sn).replace(/ /g,'-')+'.csv',['code','state','lga','ward','polling_unit','registered_2019','registered_2023','growth_pct','remark','name_2019'],out);});}}
document.addEventListener('click',function(e){var b=e.target.closest('[data-dl]');if(!b)return;var k=b.getAttribute('data-dl');gate(function(){doDl(k);});});

/* ---------------- boot ---------------- */
var PWDP=fetch('/data/vr-pwd.json').then(function(r){return r.ok?r.json():null;}).catch(function(){return null;});
Promise.all([J2(['/data/vr-summary.json','summary.json']),J2(['/data/vr-geo.json','geo.json']),PWDP]).then(function(r){SUM=r[0];TOPO=r[1];if(r[2]&&r[2].length===10)PWDH=r[2];
 $('vr-status').hidden=true;
 DIR=Sel('dir',renderDir);AN=Sel('an',renderAn);DIR.fill();AN.fill();renderDir();renderAn();
 renderGender();renderPwd();renderOcc();renderDl();
 try{initMap();}catch(err){$('vr-mapbox').innerHTML='<p style="padding:16px;color:'+MUT+'">The map could not load. The tables below still work.</p>';}
 renderMap();
 var h=location.hash.match(/^#pu\/(\d{2})(?:-(\d{2}))?(?:-(\d{2}))?$/);if(h){DIR.set(h[1],h[2]||'',h[3]||'');setTimeout(function(){$('directory').scrollIntoView();},50);}})
.catch(function(){$('vr-status').textContent='The register data could not be loaded. Please refresh the page in a moment.';$('vr-status').style.color='#A33A1F';});
})();
