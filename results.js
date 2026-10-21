(function(){
if(!document.getElementById('er-mapbox'))return;
var G9='#0B4A2A',G7='#13693A',GL='#E6F2E3',GOLDD='#B07D06',GOLDT='#8A6205',MUT='#55605A',LINE='#E4E6DF',INK='#111813',NOD='#E2E4DE';
var SEQ=['#EAF4E6','#C6E3BE','#93CB86','#55AC55','#23803F','#0B4A2A'];
var DNEG=['#8A6205','#C99A2E','#EED9A2'],DPOS=['#D3EBCB','#7DBE6E','#2E8B45','#0B4A2A'];
var LOGOS={"AA":"/party-logos/action-alliance-aa_logo.DQolkzM6.jpg","ADP":"/party-logos/action-democratic-party-adp_logo.7qxyEaV2.png","APP":"/party-logos/action-peoples-party-app_logo.BhRwRU7M.png","AAC":"/party-logos/african-action-congress-aac_logo.BiPR0ZxO.jpg","ADC":"/party-logos/african-democratic-congress-adc_logo.DBilnanA.jpg","APC":"/party-logos/all-progressives-congress-apc_logo.CSXCWB6p.jpg","APGA":"/party-logos/all-progressives-grand-alliance-apga_logo.PfgYjSjV.jpg","APM":"/party-logos/allied-peoples-movement-apm_logo.BQN54Bkl.jpg","BP":"/party-logos/boot-party-bp_logo.Br5O5Wf6.jpg","LP":"/party-logos/labour-party-lp_logo.SV1XCjLU.jpg","NRM":"/party-logos/national-rescue-movement-nrm_logo.BUg-M2QT.png","NNPP":"/party-logos/new-nigeria-peoples-party-nnpp_logo.DkfmFai5.jpg","PDP":"/party-logos/peoples-democratic-party-pdp_logo.BClIHPW3.jpg","PRP":"/party-logos/peoples-redemption-party-prp_logo.C8_o4OQI.png","SDP":"/party-logos/social-democratic-party-sdp_logo.DhlQ2VXw.png","YPP":"/party-logos/young-progressive-party-ypp_logo.Biw28-Pp.jpeg","ZLP":"/party-logos/zenith-labour-party-zlp_logo.B_S46I7c.jpg"};
var NAMES={A:'Accord',AA:'Action Alliance',AAC:'African Action Congress',ADC:'African Democratic Congress',ADP:'Action Democratic Party',APC:'All Progressives Congress',APGA:'All Progressives Grand Alliance',APM:'Allied Peoples Movement',APP:'Action Peoples Party',BP:'Boot Party',LP:'Labour Party',NNPP:'New Nigeria Peoples Party',NRM:'National Rescue Movement',PDP:'Peoples Democratic Party',PRP:'Peoples Redemption Party',SDP:'Social Democratic Party',YPP:'Young Progressives Party',ZLP:'Zenith Labour Party',PCP:'Peoples Coalition Party',ACPN:'Alliance for a New Nigeria',ANRP:'Abundant Nigeria Renewal Party',GPN:'Green Party of Nigeria',KP:'KOWA Party',AAP:'Advanced Allied Party',NCP:'National Conscience Party',PPA:'Progressive Peoples Alliance',YES:'Young Educated Party'};
var CAND={23:{APC:'Bola Ahmed Tinubu',PDP:'Atiku Abubakar',LP:'Peter Obi',NNPP:'Rabiu Musa Kwankwaso'},19:{APC:'Muhammadu Buhari',PDP:'Atiku Abubakar'}};
var PCOL={APC:'#2B66B0',PDP:'#C8322B',LP:'#2E8B3E',NNPP:'#E39B12',APGA:'#7A3FA0',ADC:'#0E8C8C',SDP:'#B5527F',PCP:'#6D5D2E',YPP:'#3F7F9E',ADP:'#8E6C1E',PRP:'#A9442F',AAC:'#555B8F'};
var D={},SUM=null,TOPO=null,ST={};
function $(id){return document.getElementById(id);}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmt(n){return n==null?'—':Math.round(n).toLocaleString('en-GB');}
function sfmt(n){return n==null?'—':(n>0?'+':n<0?'−':'')+Math.abs(Math.round(n)).toLocaleString('en-GB');}
function kfmt(n){var a=Math.abs(n),sg=n>0?'+':n<0?'−':'';return a>=1e6?sg+(a/1e6).toFixed(1)+'m':a>=1e4?sg+Math.round(a/1e3)+'k':sfmt(n);}
function pct(a,b,d){return b>0?a/b*100:null;}
function pf(v,d){return v==null||!isFinite(v)?'—':v.toFixed(d==null?1:d)+'%';}
function pts(v){return v==null||!isFinite(v)?'—':(v>0?'+':v<0?'−':'')+Math.abs(v).toFixed(1)+' pts';}
function tc(s){if(/^fct$/i.test(String(s).trim()))return 'FCT';return String(s).toLowerCase().replace(/(^|[\s\-\/(.'’])([a-z])/g,function(m,a,b){return a+b.toUpperCase();});}
function norm(s){return String(s).toLowerCase().replace(/[^a-z0-9]+/g,' ').trim();}
function J(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(r.status);return r.json();});}
function pcol(p){return PCOL[p]||'#7C857F';}
function stateOf(c){for(var i=0;i<SUM.s.length;i++)if(SUM.s[i].c===c)return SUM.s[i];}
function lgaName(s,l){var a=stateOf(s).l;for(var i=0;i<a.length;i++)if(a[i][0]===l)return a[i][1];return l;}
function opt(v,t,sel){return '<option value="'+esc(v)+'"'+(sel?' selected':'')+'>'+esc(t)+'</option>';}
function mix(hex,a){var r=parseInt(hex.substr(1,2),16),g=parseInt(hex.substr(3,2),16),b=parseInt(hex.substr(5,2),16);r=Math.round(255+(r-255)*a);g=Math.round(255+(g-255)*a);b=Math.round(255+(b-255)*a);return '#'+[r,g,b].map(function(x){return ('0'+x.toString(16)).slice(-2);}).join('');}
function badge(p,sz){sz=sz||28;var t=p.length>3?Math.round(sz*0.3):Math.round(sz*0.36);
 return '<span title="'+esc(p+(NAMES[p]?' — '+NAMES[p]:''))+'" style="position:relative;flex:0 0 '+sz+'px;width:'+sz+'px;height:'+sz+'px;border-radius:6px;background:'+pcol(p)+';color:#fff;font-weight:800;font-size:'+t+'px;display:inline-flex;align-items:center;justify-content:center;letter-spacing:-.02em;overflow:hidden">'+esc(p)+(LOGOS[p]?'<img src="'+LOGOS[p]+'" alt="'+esc(p)+' logo" loading="lazy" decoding="async" onerror="this.remove()" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#fff;border:1px solid '+LINE+';border-radius:6px;box-sizing:border-box;padding:1px">':'')+'</span>';}

/* ---------- aggregation ---------- */
// row: [reg,acc,valid,rej,cast, v1..vn]
function obj(y,row){if(!row)return null;var o={y:y,reg:row[0],acc:row[1],val:row[2],rej:row[3],cast:row[4],v:row.slice(5)};return derive(o);}
function derive(o){var P=D[o.y].p,idx=o.v.map(function(v,i){return i;}).sort(function(a,b){return o.v[b]-o.v[a];});
 o.order=idx;o.w=o.val>0&&o.v[idx[0]]>0?P[idx[0]]:null;o.r=P[idx[1]];o.wv=o.v[idx[0]];o.rv=o.v[idx[1]];
 o.mar=o.val>0?(o.wv-o.rv)/o.val*100:null;o.accR=pct(o.acc,o.reg);o.to=pct(o.cast,o.reg);o.toA=pct(o.cast,o.acc);o.rejR=pct(o.rej,o.cast);return o;}
function sumRows(y,rows){var n=D[y].p.length,t=[0,0,0,0,0].concat(new Array(n).fill(0)),k=0;rows.forEach(function(r){if(!r)return;k++;for(var i=0;i<r.length;i++)t[i]+=r[i];});return k?t:null;}
function lgaRow(y,s,l){var st=D[y].s[s];return st?st[l]:null;}
function stateRow(y,s){if(!ST[y+s]){var st=D[y].s[s];ST[y+s]=st?sumRows(y,Object.keys(st).map(function(k){return st[k];})):null;}return ST[y+s];}
function natRow(y){if(!ST[y]){ST[y]=sumRows(y,SUM.s.map(function(o){return stateRow(y,o.c);}));}return ST[y];}
function get(y,s,l){return obj(y,l?lgaRow(y,s,l):s?stateRow(y,s):natRow(y));}
function share(o,p){if(!o)return null;var i=D[o.y].p.indexOf(p);return i<0?0:(o.val>0?o.v[i]/o.val*100:null);}
function votes(o,p){if(!o)return null;var i=D[o.y].p.indexOf(p);return i<0?0:o.v[i];}
function units(s){return s?stateOf(s).l.map(function(a){return {s:s,l:a[0],n:a[1]};}):SUM.s.map(function(o){return {s:o.c,l:'',n:o.n};});}
function placeName(s,l){return l?tc(lgaName(s,l)):s?tc(stateOf(s).n):'Nigeria';}

/* ---------- download gate (shared with Voter Register) ---------- */
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
 fetch('/api/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,email:email,consent:$('vr-consent').checked,page:'results',website:$('vr-hp').value})})
 .then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};});})
 .then(function(res){if(!res.ok)throw new Error(res.j&&res.j.error||'Something went wrong.');try{localStorage.setItem('dice_member',JSON.stringify({name:name,email:email,at:Date.now()}));}catch(_){}
  var fn=pendingDl;$('vr-modal').hidden=true;pendingDl=null;b.disabled=false;b.textContent='Register & download';if(fn)fn();})
 .catch(function(err){st.style.color='#A33A1F';st.textContent=err.message||'Could not register you. Please try again.';b.disabled=false;b.textContent='Register & download';});});
function csv(name,head,rows){var q=function(v){v=v==null?'':String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};
 var t=String.fromCharCode(65279)+[head.map(q).join(',')].concat(rows.map(function(r){return r.map(q).join(',');})).join('\n');
 var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([t],{type:'text/csv;charset=utf-8'}));a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){a.remove();},100);}
function r2(v){return v==null||!isFinite(v)?'':v.toFixed(2);}

/* ---------- tooltip ---------- */
var tip=$('vr-tip');
function showTip(e,h){tip.innerHTML=h;tip.hidden=false;var x=e.clientX+14,y=e.clientY+14;var w=tip.offsetWidth,hh=tip.offsetHeight;if(x+w>innerWidth-8)x=e.clientX-w-14;if(y+hh>innerHeight-8)y=e.clientY-hh-14;tip.style.left=x+'px';tip.style.top=y+'px';}
function hideTip(){tip.hidden=true;}

/* ---------- shared UI pieces ---------- */
function kpi(label,val,sub,col){return '<div class="vr-k"><span>'+label+'</span><b'+(col?' style="color:'+col+'"':'')+'>'+val+'</b>'+(sub?'<i>'+sub+'</i>':'')+'</div>';}
function kpiBlock(o){if(!o)return '<p style="margin:0;color:'+MUT+'">No result in the source document for this area and year.</p>';
 return '<div class="vr-kpis">'+kpi('Registered voters',fmt(o.reg))+kpi('Accredited voters',fmt(o.acc),pf(o.accR)+' of registered')+kpi('Votes cast',fmt(o.cast),'Turnout '+pf(o.to)+' of registered · '+pf(o.toA)+' of accredited')+kpi('Valid · rejected',fmt(o.val),fmt(o.rej)+' rejected ('+pf(o.rejR)+')')+
  (o.w?'<div class="vr-k"><span>Winner</span><b style="display:flex;align-items:center;gap:8px;color:'+INK+'">'+badge(o.w,30)+o.w+'</b><i>'+pf(share(o,o.w))+' of valid votes</i></div>'+kpi('Winning margin',pts(o.mar).replace('+',''),fmt(o.wv-o.rv)+' votes ahead of '+o.r,G7):'')+'</div>';}
function partyBars(o,lim){var P=D[o.y].p,mx=o.wv||1,ord=o.order.filter(function(i){return o.v[i]>0;});var show=lim?ord.slice(0,lim):ord;
 return '<div style="display:flex;flex-direction:column;gap:4px">'+show.map(function(i){var p=P[i],v=o.v[i],c=CAND[o.y][p];
  return '<div style="display:grid;grid-template-columns:30px minmax(70px,150px) minmax(30px,1fr) 118px;gap:8px;align-items:center;font-size:14px" title="'+esc(p+(NAMES[p]?' — '+NAMES[p]:'')+': '+fmt(v)+' votes')+'">'+badge(p,28)+'<span style="min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap"><b>'+esc(p)+'</b>'+(c?'<br><span style="font-size:12px;color:'+MUT+'">'+esc(c)+'</span>':'')+'</span><span style="display:block;height:14px;background:#EEF1EC;border-radius:0 4px 4px 0"><span style="display:block;height:100%;width:'+Math.max(0.6,v/mx*100).toFixed(1)+'%;background:'+pcol(p)+';border-radius:0 4px 4px 0"></span></span><span style="text-align:right;font-weight:600;font-size:13px;white-space:nowrap">'+fmt(v)+' · '+pf(v/o.val*100)+'</span></div>';}).join('')+
  (lim&&ord.length>lim?'<button type="button" class="vr-btn ghost" data-allp style="align-self:flex-start;min-height:36px;font-size:13px">Show all '+ord.length+' parties</button>':'')+'</div>';}
function cmpRows(a,b,cp){var mk=function(l,x,y,f,ch){return '<tr><td style="font-weight:600">'+l+'</td><td class="n">'+f(x)+'</td><td class="n" style="font-weight:700">'+f(y)+'</td><td class="n">'+ch+'</td></tr>';};
 var dv=function(k){return a&&b?(cp?kfmt(b[k]-a[k]):sfmt(b[k]-a[k]))+(a[k]>0&&!cp?'<br><span style="font-size:12px;color:'+MUT+'">('+((b[k]-a[k])/a[k]*100>0?'+':'')+((b[k]-a[k])/a[k]*100).toFixed(1)+'%)</span>':''):'—';};
 var dp=function(k){return a&&b?pts(b[k]-a[k]):'—';};
 var g=function(o,k){return o?o[k]:null;};
 var rows=mk('Registered voters',g(a,'reg'),g(b,'reg'),fmt,dv('reg'))+mk('Accredited voters',g(a,'acc'),g(b,'acc'),fmt,dv('acc'))+mk('Accreditation rate',g(a,'accR'),g(b,'accR'),pf,dp('accR'))+mk('Votes cast',g(a,'cast'),g(b,'cast'),fmt,dv('cast'))+mk('Turnout (of registered)',g(a,'to'),g(b,'to'),pf,dp('to'))+mk('Turnout (of accredited)',g(a,'toA'),g(b,'toA'),pf,dp('toA'))+mk('Valid votes',g(a,'val'),g(b,'val'),fmt,dv('val'))+mk('Rejected votes',g(a,'rej'),g(b,'rej'),fmt,dv('rej'))+
  '<tr><td style="font-weight:600">Winner · margin</td><td class="n">'+(a&&a.w?a.w+' · '+pf(a.mar):'—')+'</td><td class="n" style="font-weight:700">'+(b&&b.w?b.w+' · '+pf(b.mar):'—')+'</td><td class="n">'+(a&&b&&a.w&&b.w?(a.w===b.w?(cp?'Held':'Held by '+b.w):'<b style="color:'+GOLDT+'">'+a.w+' → '+b.w+'</b>'):'—')+'</td></tr>';
 var ps={};[a,b].forEach(function(o){if(!o)return;D[o.y].p.forEach(function(p,i){if(o.val>0&&o.v[i]/o.val>=0.005)ps[p]=1;});});
 var pl=Object.keys(ps).sort(function(x,y){return ((share(b,y)||0)+(share(a,y)||0))-((share(b,x)||0)+(share(a,x)||0));});
 rows+='<tr><td colspan="4" style="padding-top:16px;font-size:12px;font-weight:700;color:'+MUT+';border-bottom:1.5px solid '+INK+'">VOTES BY PARTY (share of valid votes)</td></tr>'+pl.map(function(p){var s1=share(a,p),s2=share(b,p);
  return '<tr><td><span style="display:inline-flex;align-items:center;gap:8px;font-weight:700">'+badge(p,24)+esc(p)+'</span></td><td class="n">'+(a?(cp?pf(s1):fmt(votes(a,p))+' <span style="color:'+MUT+'">'+pf(s1)+'</span>'):'—')+'</td><td class="n" style="font-weight:700">'+(b?(cp?pf(s2):fmt(votes(b,p))+' <span style="color:'+MUT+';font-weight:400">'+pf(s2)+'</span>'):'—')+'</td><td class="n" style="color:'+(a&&b?(s2-s1>=0?G7:GOLDT):MUT)+';font-weight:700">'+(a&&b?pts(s2-s1):'—')+'</td></tr>';}).join('');
 return '<div class="vr-scroll er-cmp" style="max-height:none"><table class="vr-tbl"><thead><tr><th></th><th class="n">2019</th><th class="n">2023</th><th class="n">Change</th></tr></thead><tbody>'+rows+'</tbody></table></div>';}

/* ---------- map explorer ---------- */
var MY=[{k:'win',t:'Winner'},{k:'mar',t:'Winning margin'},{k:'to',t:'Turnout'},{k:'accR',t:'Accreditation rate'},{k:'ps',t:'Party share'}];
var MC=[{k:'flip',t:'Winner 2019 → 2023'},{k:'dto',t:'Turnout change'},{k:'daccR',t:'Accreditation change'},{k:'dreg',t:'Registered voters growth'},{k:'dps',t:'Party share change'}];
var V={y:'23',s:'',l:'',m:'win',p:'APC',all:0};
function mets(){return V.y==='c'?MC:MY;}
function metName(m){var a=MY.concat(MC);for(var i=0;i<a.length;i++)if(a[i].k===m)return a[i].t+(m==='ps'||m==='dps'?' — '+V.p:'');}
function val(m,s,l){if(V.y!=='c'){var o=get(+V.y,s,l);if(!o)return null;if(m==='ps')return share(o,V.p);return o[m];}
 var a=get(19,s,l),b=get(23,s,l);if(!a||!b)return null;
 if(m==='dto')return b.to-a.to;if(m==='daccR')return b.accR-a.accR;if(m==='dreg')return a.reg>0?(b.reg-a.reg)/a.reg*100:null;if(m==='dps')return share(b,V.p)-share(a,V.p);return null;}
function fmtV(m,v){if(v==null||!isFinite(v))return '—';if(m==='dto'||m==='daccR'||m==='dps')return pts(v);if(m==='dreg')return (v>0?'+':'')+v.toFixed(1)+'%';return pf(v);}
function seqScale(m,vals){var v=vals.filter(function(x){return x!=null&&isFinite(x);}).sort(function(a,b){return a-b;});var n=SEQ.length,br=[];for(var i=1;i<n;i++)br.push(v.length?v[Math.min(v.length-1,Math.floor(i/n*v.length))]:0);
 return {f:function(x){if(x==null||!isFinite(x))return NOD;var i=0;while(i<n-1&&x>br[i])i++;return SEQ[i];},leg:SEQ.map(function(c,i){return [c,(i===0?'up to ':i===n-1?'above ':'to ')+fmtV(m,i===n-1?br[n-2]:br[i])];})};}
function divScale(m,vals){var v=vals.filter(function(x){return x!=null&&isFinite(x);});var neg=v.filter(function(x){return x<0;}).sort(function(a,b){return a-b;}),pos=v.filter(function(x){return x>=0;}).sort(function(a,b){return a-b;});
 var qp=[0.25,0.5,0.75].map(function(q){return pos.length?pos[Math.min(pos.length-1,Math.floor(q*pos.length))]:0;}),qn=[0.33,0.66].map(function(q){return neg.length?neg[Math.min(neg.length-1,Math.floor(q*neg.length))]:0;});
 var f=function(x){if(x==null||!isFinite(x))return NOD;if(x<0){if(x<=qn[0])return DNEG[0];if(x<=qn[1])return DNEG[1];return DNEG[2];}var i=0;while(i<3&&x>qp[i])i++;return DPOS[i];};
 var leg=[];if(neg.length)leg.push([DNEG[0],'below '+fmtV(m,qn[0])],[DNEG[1],'to '+fmtV(m,qn[1])],[DNEG[2],'to 0']);leg.push([DPOS[0],'0 to '+fmtV(m,qp[0])],[DPOS[1],'to '+fmtV(m,qp[1])],[DPOS[2],'to '+fmtV(m,qp[2])],[DPOS[3],'above '+fmtV(m,qp[2])]);return {f:f,leg:leg};}
function winScale(list){var seen={};list.forEach(function(u){var o=get(+V.y,u.s,u.l);if(o&&o.w)seen[o.w]=(seen[o.w]||0)+1;});
 var f=function(s,l){var o=get(+V.y,s,l);if(!o||!o.w)return NOD;var a=o.mar<10?0.45:o.mar<30?0.72:1;return mix(pcol(o.w),a);};
 var leg=Object.keys(seen).sort(function(a,b){return seen[b]-seen[a];}).map(function(p){return [pcol(p),p+' ('+seen[p]+')'];});leg.push([mix('#7C857F',0.45),'Paler = margin under 10 pts']);return {f:f,leg:leg};}
function flipScale(list){var seen={};var g=function(s,l){var a=get(19,s,l),b=get(23,s,l);if(!a||!b||!a.w||!b.w)return null;return {a:a.w,b:b.w};};
 list.forEach(function(u){var x=g(u.s,u.l);if(!x)return;var k=x.a===x.b?x.b+' held':x.a+' → '+x.b;seen[k]=[x.a===x.b?mix(pcol(x.b),0.4):pcol(x.b),(seen[k]?seen[k][1]:0)+1];});
 var f=function(s,l){var x=g(s,l);if(!x)return NOD;return x.a===x.b?mix(pcol(x.b),0.4):pcol(x.b);};
 var leg=Object.keys(seen).sort(function(a,b){return seen[b][1]-seen[a][1];}).map(function(k){return [seen[k][0],k+' ('+seen[k][1]+')'];});return {f:f,leg:leg};}
function scaleFor(list){var m=V.m;if(m==='win')return winScale(list);if(m==='flip')return flipScale(list);
 var vals=list.map(function(u){return val(m,u.s,u.l);});var sc=(m.charAt(0)==='d')?divScale(m,vals):seqScale(m,vals);return {f:function(s,l){return sc.f(val(m,s,l));},leg:sc.leg};}
var path,svg,gAll,ready=false,W=600,Hh=536;
function initMap(){var box=$('er-mapbox');var states=topojson.feature(TOPO,TOPO.objects.states),lgas=topojson.feature(TOPO,TOPO.objects.lgas);
 var proj=d3.geoMercator().fitExtent([[12,12],[W-12,Hh-12]],states);path=d3.geoPath(proj);
 svg=d3.select(box).append('svg').attr('viewBox','0 0 '+W+' '+Hh).attr('width','100%').attr('height','100%').attr('role','img').attr('aria-label','Map of election results');
 gAll=svg.append('g');
 gAll.append('g').attr('class','lg').selectAll('path').data(lgas.features).enter().append('path').attr('d',path).attr('class','a').attr('data-s',function(d){return d.properties.s;}).attr('data-l',function(d){return d.properties.l;}).attr('tabindex',-1).style('display','none');
 gAll.append('g').attr('class','sg').selectAll('path').data(states.features).enter().append('path').attr('d',path).attr('class','a').attr('data-s',function(d){return d.properties.s;}).attr('tabindex',0);
 gAll.append('g').attr('class','ol').append('path').attr('fill','none').attr('stroke',INK).attr('stroke-width',1.2).attr('vector-effect','non-scaling-stroke').attr('pointer-events','none');
 gAll.append('g').attr('class','lb').attr('pointer-events','none');
 svg.on('mousemove',function(e){var t=e.target;if(!t.getAttribute||!t.classList.contains('a')){hideTip();return;}showTip(e,tipHtml(t.getAttribute('data-s'),t.getAttribute('data-l')));}).on('mouseleave',hideTip);
 svg.on('click',function(e){var t=e.target;if(!t.classList||!t.classList.contains('a'))return;var s=t.getAttribute('data-s'),l=t.getAttribute('data-l');go(s,l?(l===V.l?'':l):'');});
 svg.on('keydown',function(e){if(e.key!=='Enter'&&e.key!==' ')return;var t=e.target;if(!t.classList||!t.classList.contains('a'))return;e.preventDefault();go(t.getAttribute('data-s'),t.getAttribute('data-l')||'');});
 ready=true;}
function tipHtml(s,l){var nm='<b>'+esc(placeName(s,l))+(l?'<span style="opacity:.75;font-weight:400"> · '+esc(tc(stateOf(s).n))+'</span>':'')+'</b>';
 if(V.y==='c'){var a=get(19,s,l),b=get(23,s,l);return nm+'<br>2019: '+(a&&a.w?a.w+' '+pf(share(a,a.w))+' · turnout '+pf(a.to):'no result')+'<br>2023: '+(b&&b.w?b.w+' '+pf(share(b,b.w))+' · turnout '+pf(b.to):'no result')+(V.m!=='flip'?'<br>'+esc(metName(V.m))+': <b>'+fmtV(V.m,val(V.m,s,l))+'</b>':'');}
 var o=get(+V.y,s,l);if(!o)return nm+'<br>No result in source document';
 return nm+'<br>Winner: <b>'+(o.w||'—')+'</b> '+pf(share(o,o.w))+' · margin '+pf(o.mar)+'<br>Turnout '+pf(o.to)+' · accreditation '+pf(o.accR)+(V.m==='ps'?'<br>'+V.p+': <b>'+pf(share(o,V.p))+'</b>':'');}
function go(s,l){V.s=s||'';V.l=l||'';V.all=0;renderMap();}
function partyChoices(){var y=V.y==='c'?23:+V.y,o=get(y,'',''),P=D[y].p;var list=o.order.slice(0,8).map(function(i){return P[i];});if(V.y==='c'){['APC','PDP'].forEach(function(p){if(list.indexOf(p)<0)list.push(p);});}return list;}
function renderMap(){if(!ready)return;var m=V.m;
 $('er-years').innerHTML=[['23','2023'],['19','2019'],['c','Compare 2019 → 2023']].map(function(x){return '<button type="button" class="vr-chip" data-y="'+x[0]+'" aria-pressed="'+(V.y===x[0])+'">'+x[1]+'</button>';}).join('');
 $('er-metrics').innerHTML=mets().map(function(x){return '<button type="button" class="vr-chip" data-m="'+x.k+'" aria-pressed="'+(x.k===m)+'">'+x.t+'</button>';}).join('')+((m==='ps'||m==='dps')?'<select class="vr-sel" id="er-party" aria-label="Party" style="width:auto;min-height:40px">'+partyChoices().map(function(p){return opt(p,p+(NAMES[p]?' — '+NAMES[p]:''),p===V.p);}).join('')+'</select>':'');
 $('er-crumb').innerHTML='<a href="#explorer" data-go="" style="color:'+(V.s?G7:INK)+'">Nigeria</a>'+(V.s?' <span aria-hidden="true" style="color:'+MUT+'">›</span> <a href="#explorer" data-go="'+V.s+'" style="color:'+(V.l?G7:INK)+'">'+esc(tc(stateOf(V.s).n))+'</a>':'')+(V.l?' <span aria-hidden="true" style="color:'+MUT+'">›</span> <span>'+esc(tc(lgaName(V.s,V.l)))+'</span>':'');
 var sg=gAll.select('.sg').selectAll('path'),lg=gAll.select('.lg').selectAll('path'),sc;
 if(!V.s){sc=scaleFor(units(''));sg.style('display',null).attr('fill',function(d){return sc.f(d.properties.s,'');});lg.style('display','none');gAll.select('.ol path').attr('d',null);gAll.transition().duration(450).attr('transform','');
  labels(topojson.feature(TOPO,TOPO.objects.states).features.map(function(f){return {f:f,n:stateOf(f.properties.s).n};}),1,0);}
 else{sc=scaleFor(units(V.s));sg.style('display',function(d){return d.properties.s===V.s?'none':null;}).attr('fill','#E7E9E3');
  lg.style('display',function(d){return d.properties.s===V.s?null:'none';}).attr('fill',function(d){return d.properties.s===V.s?sc.f(V.s,d.properties.l):'none';}).classed('sel',function(d){return d.properties.s===V.s&&d.properties.l===V.l;}).attr('tabindex',function(d){return d.properties.s===V.s?0:-1;});
  lg.filter(function(d){return d.properties.s===V.s&&d.properties.l===V.l;}).raise();
  var feat=topojson.feature(TOPO,TOPO.objects.states).features.filter(function(f){return f.properties.s===V.s;})[0];var b=path.bounds(feat),dx=b[1][0]-b[0][0],dy=b[1][1]-b[0][1],cx=(b[0][0]+b[1][0])/2,cy=(b[0][1]+b[1][1])/2,k=Math.min(24,0.9/Math.max(dx/W,dy/Hh));
  gAll.transition().duration(450).attr('transform','translate('+(W/2-k*cx)+','+(Hh/2-k*cy)+') scale('+k+')');gAll.select('.ol path').attr('d',path(feat));
  labels(topojson.feature(TOPO,TOPO.objects.lgas).features.filter(function(f){return f.properties.s===V.s;}).map(function(f){return {f:f,n:lgaName(V.s,f.properties.l),sel:f.properties.l===V.l};}),k,1);}
 $('er-legend').innerHTML='<span style="font-weight:700;color:'+INK+'">'+esc(metName(m))+(V.y!=='c'?' · '+(V.y==='23'?'2023':'2019'):'')+'</span>'+sc.leg.map(function(x){return '<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:14px;height:14px;border-radius:3px;background:'+x[0]+';display:inline-block;border:1px solid rgba(0,0,0,.06)"></span>'+esc(x[1])+'</span>';}).join('')+'<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:14px;height:14px;border-radius:3px;background:'+NOD+';display:inline-block"></span>No result</span>';
 renderSide();}
function labels(items,k,lga){var fs=(lga?9.5:9)/k,g=gAll.select('.lb'),placed=[];g.selectAll('text').remove();
 items.sort(function(a,b){return (b.sel?1e12:path.area(b.f))-(a.sel?1e12:path.area(a.f));});
 items.forEach(function(it){if(!it.n)return;var a=path.area(it.f)*k*k;if(lga&&a<260&&!it.sel)return;var c=path.centroid(it.f);if(!isFinite(c[0]))return;
  var nm=tc(it.n);if(nm.length>16&&lga)nm=nm.replace(/ (North|South|East|West|Central)/,function(m){return ' '+m.trim().charAt(0)+'.';});
  g.append('text').attr('x',c[0]).attr('y',c[1]).attr('dy','0.35em').attr('text-anchor','middle').attr('font-size',fs).attr('font-weight',it.sel?800:600).attr('fill',INK).attr('stroke','#FFFFFF').attr('stroke-width',2.6/k).attr('stroke-linejoin','round').attr('paint-order','stroke').attr('font-family','Public Sans,system-ui,sans-serif').text(nm);
  if(lga){var t=g.select('text:last-child').node(),bb;try{bb=t.getBBox();}catch(_){return;}var pad=1/k;if(placed.some(function(p){return bb.x<p.x+p.width+pad&&bb.x+bb.width+pad>p.x&&bb.y<p.y+p.height&&bb.y+bb.height>p.y;})){t.remove();return;}placed.push(bb);}});}
function unitList(){var list=units(V.s);if(V.l)return '';var y=V.y==='c'?null:+V.y;
 var rows=list.map(function(u){var o=y?get(y,u.s,u.l):null,a=y?null:get(19,u.s,u.l),b=y?null:get(23,u.s,u.l);return {u:u,o:o,a:a,b:b,v:val(V.m,u.s,u.l)};});
 if(V.m==='win'||V.m==='flip')rows.sort(function(x,z){var X=x.o||x.b,Z=z.o||z.b;return (Z?Z.cast:-1)-(X?X.cast:-1);});else rows.sort(function(x,z){return (z.v==null?-1e9:z.v)-(x.v==null?-1e9:x.v);});
 return '<div style="display:flex;flex-direction:column;gap:6px"><span style="font-size:13px;font-weight:700;color:'+MUT+'">'+(V.s?'LGAs':'States')+' · tap to open</span><div style="display:flex;flex-direction:column;gap:2px;max-height:330px;overflow:auto;padding-right:4px">'+rows.map(function(r){
  var right=y?(r.o&&r.o.w?badge(r.o.w,20)+' <span>'+r.o.w+' '+pf(share(r.o,r.o.w),0)+'</span>':'—'):(r.a&&r.b&&r.a.w&&r.b.w?badge(r.a.w,20)+' → '+badge(r.b.w,20):'—');
  return '<div class="vr-bar click" role="button" tabindex="0" data-pick="'+(V.s?r.u.l:r.u.s)+'" style="grid-template-columns:minmax(80px,1fr) auto 84px"><span style="font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+esc(tc(r.u.n))+'</span><span style="display:inline-flex;align-items:center;gap:4px;font-size:13px">'+right+'</span><span style="text-align:right;font-size:13px;font-weight:600">'+(V.m==='win'||V.m==='flip'?pf(y?(r.o?r.o.to:null):(r.b?r.b.to:null))+'<span style="font-weight:400;color:'+MUT+'"> t/o</span>':fmtV(V.m,r.v))+'</span></div>';}).join('')+'</div></div>';}
function renderSide(){var box=$('er-side'),nm=placeName(V.s,V.l),sub=V.l?tc(stateOf(V.s).n):V.s?stateOf(V.s).l.length+' LGAs':'37 states incl. FCT · 774 LGAs';
 var head='<h3 style="margin:0;font-family:Archivo,sans-serif;font-size:22px;color:'+G9+'">'+esc(nm)+' <span style="font-size:14px;color:'+MUT+';font-weight:600">'+esc(sub)+'</span></h3>';
 if(V.y==='c'){box.innerHTML=head+'<span style="font-size:13px;font-weight:700;color:'+MUT+'">Presidential election, 2019 vs 2023</span>'+cmpRows(get(19,V.s,V.l),get(23,V.s,V.l),1)+unitList()+'<button type="button" class="vr-btn ghost" data-open="compare" style="align-self:flex-start">Open in 2019 vs 2023 comparison →</button>';return;}
 var o=get(+V.y,V.s,V.l);
 box.innerHTML=head+'<span style="font-size:13px;font-weight:700;color:'+MUT+'">Presidential election, '+(V.y==='23'?'25 February 2023':'23 February 2019')+'</span>'+kpiBlock(o)+(o?'<div style="display:flex;flex-direction:column;gap:6px"><span style="font-size:13px;font-weight:700;color:'+MUT+'">Votes by party</span>'+partyBars(o,V.all?0:6)+'</div>':'')+unitList()+'<button type="button" class="vr-btn ghost" data-open="tables" style="align-self:flex-start">Open in results tables →</button>';}
$('er-years').addEventListener('click',function(e){var b=e.target.closest('[data-y]');if(!b)return;V.y=b.getAttribute('data-y');var ok=mets().some(function(x){return x.k===V.m;});if(!ok)V.m=V.y==='c'?'flip':'win';renderMap();});
$('er-metrics').addEventListener('click',function(e){var b=e.target.closest('[data-m]');if(!b)return;V.m=b.getAttribute('data-m');renderMap();});
$('er-metrics').addEventListener('change',function(e){if(e.target.id==='er-party'){V.p=e.target.value;renderMap();}});
$('er-crumb').addEventListener('click',function(e){var a=e.target.closest('[data-go]');if(!a)return;e.preventDefault();go(a.getAttribute('data-go'),'');});
function sidePick(e){var b=e.target.closest('[data-pick],[data-allp],[data-open]');if(!b)return;
 if(b.hasAttribute('data-allp')){V.all=1;renderSide();return;}
 if(b.hasAttribute('data-open')){var w=b.getAttribute('data-open');if(w==='compare'){CMP.s=V.s;CMP.l=V.l;renderCmp();}else{TB.y=V.y==='c'?'23':V.y;TB.s=V.s;renderTb();}$(w).scrollIntoView({behavior:'smooth'});return;}
 var c=b.getAttribute('data-pick');if(!V.s)go(c,'');else go(V.s,c);}
$('er-side').addEventListener('click',sidePick);
$('er-side').addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){if(e.target.closest('[data-pick]')){e.preventDefault();sidePick(e);}}});

/* ---------- results tables ---------- */
var TB={y:'23',s:'',q:'',k:'cast',d:-1};
function tbRows(){var y=+TB.y,q=norm(TB.q);var list=units(TB.s);if(q)list=TB.s?list.filter(function(u){return norm(u.n).indexOf(q)>=0;}):(function(){var r=[];SUM.s.forEach(function(o){if(norm(o.n).indexOf(q)>=0)r.push({s:o.c,l:'',n:o.n});o.l.forEach(function(a){if(norm(a[1]).indexOf(q)>=0)r.push({s:o.c,l:a[0],n:a[1],sub:tc(o.n)});});});return r;})();
 return list.map(function(u){return {u:u,o:get(y,u.s,u.l)};});}
function tbParties(){var y=+TB.y,o=get(y,TB.s,''),P=D[y].p;if(!o)o=get(y,'','');return o.order.slice(0,y===23?4:3).map(function(i){return P[i];});}
function renderTb(){$('tb-y').innerHTML=opt('23','2023',TB.y==='23')+opt('19','2019',TB.y==='19');$('tb-s').innerHTML=opt('','All states (Nigeria)',!TB.s)+SUM.s.map(function(o){return opt(o.c,tc(o.n),TB.s===o.c);}).join('');
 var y=+TB.y,rows=tbRows(),pp=tbParties(),k=TB.k,dd=TB.d;var tot=get(y,TB.s,'');
 var gv=function(r){var o=r.o;if(k==='n')return r.u.n;if(!o)return null;if(k.indexOf('p:')===0)return share(o,k.slice(2));return o[k];};
 rows.sort(function(a,b){var A=gv(a),B=gv(b);if(k==='n')return dd*String(A).localeCompare(String(B));if(A==null)return 1;if(B==null)return -1;return dd*(A-B);});
 $('tb-kpis').innerHTML=tot?kpiBlock(tot).replace(/^<div class="vr-kpis">|<\/div>$/g,''):'';
 $('tb-count').textContent=(TB.s?tc(stateOf(TB.s).n):'Nigeria')+' · '+(TB.y==='23'?'2023':'2019')+' presidential election · '+rows.length+(TB.q?' matching':'')+(TB.s?' LGAs':' rows');
 var th=function(key,label,n){var on=k===key;return '<th'+(n?' class="n"':'')+' aria-sort="'+(on?(dd>0?'ascending':'descending'):'none')+'"><button type="button" data-sort="'+key+'">'+label+(on?(dd>0?' ▲':' ▼'):'')+'</button></th>';};
 var head='<tr>'+th('n',TB.s?'LGA':'State')+th('reg','Registered',1)+th('acc','Accredited',1)+th('accR','Accred. rate',1)+th('cast','Votes cast',1)+th('to','Turnout',1)+th('val','Valid',1)+th('rej','Rejected',1)+pp.map(function(p){return th('p:'+p,p,1);}).join('')+th('mar','Winner · margin',1)+'</tr>';
 var body=rows.map(function(r){var o=r.o,click=!r.u.l||!TB.s;var attr=' class="click" tabindex="0" data-row="'+r.u.s+'|'+r.u.l+'"';
  if(!o)return '<tr><td><b>'+esc(tc(r.u.n))+'</b>'+(r.u.sub?'<br><span style="font-size:12px;color:'+MUT+'">'+esc(r.u.sub)+'</span>':'')+'</td><td colspan="'+(9+pp.length)+'" style="color:'+MUT+'">No result in the source document</td></tr>';
  return '<tr'+attr+'><td><b>'+esc(tc(r.u.n))+'</b>'+(r.u.sub?'<br><span style="font-size:12px;color:'+MUT+'">LGA · '+esc(r.u.sub)+'</span>':'')+'</td><td class="n">'+fmt(o.reg)+'</td><td class="n">'+fmt(o.acc)+'</td><td class="n">'+pf(o.accR)+'</td><td class="n">'+fmt(o.cast)+'</td><td class="n" style="font-weight:700">'+pf(o.to)+'</td><td class="n">'+fmt(o.val)+'</td><td class="n">'+fmt(o.rej)+'</td>'+
   pp.map(function(p){return '<td class="n">'+fmt(votes(o,p))+'<br><span style="font-size:12px;color:'+MUT+'">'+pf(share(o,p))+'</span></td>';}).join('')+'<td class="n"><span style="display:inline-flex;align-items:center;gap:6px">'+(o.w?badge(o.w,22)+'<b>'+o.w+'</b>':'—')+'</span><br><span style="font-size:12px;color:'+MUT+'">+'+pf(o.mar)+'</span></td></tr>';}).join('');
 $('tb-out').innerHTML=rows.length?'<div class="vr-scroll"><table class="vr-tbl"><thead>'+head+'</thead><tbody>'+body+'</tbody></table></div>':'<p style="margin:0;color:'+MUT+'">Nothing matches.</p>';}
$('tb-y').addEventListener('change',function(e){TB.y=e.target.value;renderTb();});
$('tb-s').addEventListener('change',function(e){TB.s=e.target.value;TB.q='';$('tb-q').value='';renderTb();});
(function(){var t;$('tb-q').addEventListener('input',function(e){TB.q=e.target.value;clearTimeout(t);t=setTimeout(renderTb,160);});})();
$('tb-out').addEventListener('click',function(e){var s=e.target.closest('[data-sort]');if(s){var k=s.getAttribute('data-sort');TB.d=TB.k===k?-TB.d:(k==='n'?1:-1);TB.k=k;renderTb();return;}
 var tr=e.target.closest('[data-row]');if(!tr)return;var p=tr.getAttribute('data-row').split('|');if(!p[1]){TB.s=p[0];TB.q='';$('tb-q').value='';renderTb();}else{V.y=TB.y;go(p[0],p[1]);$('explorer').scrollIntoView({behavior:'smooth'});}});
$('tb-out').addEventListener('keydown',function(e){if(e.key==='Enter'){var tr=e.target.closest('[data-row]');if(tr)tr.click();}});

/* ---------- comparison ---------- */
var CMP={s:'',l:'',k:'dto',d:-1};
function renderCmp(){$('cm-s').innerHTML=opt('','All states (Nigeria)',!CMP.s)+SUM.s.map(function(o){return opt(o.c,tc(o.n),CMP.s===o.c);}).join('');
 var el=$('cm-l');if(!CMP.s){el.innerHTML=opt('','Pick a state first',true);el.disabled=true;}else{el.disabled=false;el.innerHTML=opt('','All LGAs',!CMP.l)+stateOf(CMP.s).l.slice().sort(function(a,b){return a[1].localeCompare(b[1]);}).map(function(a){return opt(a[0],tc(a[1]),CMP.l===a[0]);}).join('');}
 var a=get(19,CMP.s,CMP.l),b=get(23,CMP.s,CMP.l);
 var note=(!CMP.s||CMP.s==='29')?'<p style="margin:0;font-size:13px;color:'+GOLDT+'">The 2019 source document has no LGA results for Osun State, so 2019 national totals here exclude Osun.</p>':'';
 $('cm-card').innerHTML='<h3 style="margin:0;font-family:Archivo,sans-serif;font-size:22px;color:'+G9+'">'+esc(placeName(CMP.s,CMP.l))+(CMP.l?' <span style="font-size:14px;color:'+MUT+';font-weight:600">'+esc(tc(stateOf(CMP.s).n))+'</span>':'')+'</h3>'+note+cmpRows(a,b,innerWidth<700?1:0);
 $('cm-bars').innerHTML=shareChart(a,b);
 if(CMP.l){$('cm-list').innerHTML='';$('cm-count').textContent='';return;}
 var list=units(CMP.s).map(function(u){var x=get(19,u.s,u.l),z=get(23,u.s,u.l);return {u:u,a:x,b:z};});
 var k=CMP.k,dd=CMP.d,gv=function(r){if(k==='n')return r.u.n;var x=r.a,z=r.b;if(!x||!z)return null;switch(k){case 'reg':return z.reg;case 'dreg':return x.reg>0?(z.reg-x.reg)/x.reg*100:null;case 'to19':return x.to;case 'to23':return z.to;case 'dto':return z.to-x.to;case 'ac19':return x.accR;case 'ac23':return z.accR;case 'dac':return z.accR-x.accR;case 'apc':return share(z,'APC')-share(x,'APC');case 'pdp':return share(z,'PDP')-share(x,'PDP');}};
 list.sort(function(x,z){var A=gv(x),B=gv(z);if(k==='n')return dd*String(A).localeCompare(String(B));if(A==null)return 1;if(B==null)return -1;return dd*(A-B);});
 var th=function(key,label){var on=k===key;return '<th class="n" aria-sort="'+(on?(dd>0?'ascending':'descending'):'none')+'"><button type="button" data-sort="'+key+'">'+label+(on?(dd>0?' ▲':' ▼'):'')+'</button></th>';};
 var flips=list.filter(function(r){return r.a&&r.b&&r.a.w&&r.b.w&&r.a.w!==r.b.w;}).length;
 $('cm-count').textContent=(CMP.s?'LGAs in '+tc(stateOf(CMP.s).n):'States')+' · '+list.length+' · '+flips+' changed winner between 2019 and 2023';
 var col=function(v){return v==null?MUT:v>=0?G7:GOLDT;};
 $('cm-list').innerHTML='<div class="vr-scroll"><table class="vr-tbl"><thead><tr><th><button type="button" data-sort="n">'+(CMP.s?'LGA':'State')+(k==='n'?(dd>0?' ▲':' ▼'):'')+'</button></th>'+th('reg','Registered 2023')+th('dreg','Register growth')+th('to19','Turnout 2019')+th('to23','Turnout 2023')+th('dto','Turnout change')+th('ac19','Accred. 2019')+th('ac23','Accred. 2023')+th('dac','Accred. change')+'<th>Winner 2019 → 2023</th>'+th('apc','APC share change')+th('pdp','PDP share change')+'</tr></thead><tbody>'+list.map(function(r){var x=r.a,z=r.b;
  if(!x||!z)return '<tr class="click" tabindex="0" data-cm="'+(CMP.s?r.u.l:r.u.s)+'"><td><b>'+esc(tc(r.u.n))+'</b></td><td colspan="11" style="color:'+MUT+'">'+(x?'':'No 2019 result in the source document')+(z?'':' No 2023 result')+'</td></tr>';
  var g=x.reg>0?(z.reg-x.reg)/x.reg*100:null,dt=z.to-x.to,da=z.accR-x.accR,dA=share(z,'APC')-share(x,'APC'),dP=share(z,'PDP')-share(x,'PDP');
  return '<tr class="click" tabindex="0" data-cm="'+(CMP.s?r.u.l:r.u.s)+'"><td><b>'+esc(tc(r.u.n))+'</b></td><td class="n">'+fmt(z.reg)+'</td><td class="n" style="color:'+col(g)+';font-weight:700">'+(g==null?'—':(g>0?'+':'')+g.toFixed(1)+'%')+'</td><td class="n">'+pf(x.to)+'</td><td class="n">'+pf(z.to)+'</td><td class="n" style="color:'+col(dt)+';font-weight:700">'+pts(dt)+'</td><td class="n">'+pf(x.accR)+'</td><td class="n">'+pf(z.accR)+'</td><td class="n" style="color:'+col(da)+';font-weight:700">'+pts(da)+'</td><td><span style="display:inline-flex;align-items:center;gap:4px;white-space:nowrap">'+(x.w?badge(x.w,20):'—')+' → '+(z.w?badge(z.w,20):'—')+(x.w&&z.w&&x.w!==z.w?' <span class="vr-tag" style="background:#FDF1CC;color:#6B4A0A">Changed</span>':'')+'</span></td><td class="n" style="color:'+col(dA)+'">'+pts(dA)+'</td><td class="n" style="color:'+col(dP)+'">'+pts(dP)+'</td></tr>';}).join('')+'</tbody></table></div>';}
function shareChart(a,b){var ps=['APC','PDP','LP','NNPP'],o2=b||a;if(!a&&!b)return '';
 var oth=function(o){if(!o)return null;var s=0;ps.forEach(function(p){s+=share(o,p)||0;});return 100-s;};
 var row=function(lbl,o){if(!o)return '<div style="display:grid;grid-template-columns:44px 1fr;gap:8px;align-items:center;font-size:13px"><b>'+lbl+'</b><span style="color:'+MUT+'">No result</span></div>';
  return '<div style="display:grid;grid-template-columns:44px 1fr;gap:8px;align-items:center;font-size:13px"><b>'+lbl+'</b><div style="display:flex;height:26px;border-radius:6px;overflow:hidden;background:#EEF1EC">'+ps.map(function(p){var s=share(o,p)||0;return s>0?'<span title="'+p+' '+pf(s)+'" style="width:'+s.toFixed(2)+'%;background:'+pcol(p)+';color:#fff;font-weight:700;display:flex;align-items:center;justify-content:center;overflow:hidden;white-space:nowrap;border-right:2px solid #fff">'+(s>=7?p+' '+s.toFixed(0)+'%':'')+'</span>':'';}).join('')+'<span title="Others '+pf(oth(o))+'" style="flex:1;background:#B9C2BB"></span></div></div>';};
 return '<div class="vr-card" style="display:flex;flex-direction:column;gap:10px"><b style="font-family:Archivo,sans-serif;font-size:17px">Share of valid votes</b>'+row('2019',a)+row('2023',b)+'<div style="display:flex;flex-wrap:wrap;gap:10px;font-size:12px;color:'+MUT+'">'+ps.map(function(p){return '<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:12px;height:12px;border-radius:3px;background:'+pcol(p)+'"></span>'+p+'</span>';}).join('')+'<span style="display:inline-flex;align-items:center;gap:5px"><span style="width:12px;height:12px;border-radius:3px;background:#B9C2BB"></span>All other parties</span></div></div>';}
$('cm-s').addEventListener('change',function(e){CMP.s=e.target.value;CMP.l='';renderCmp();});
$('cm-l').addEventListener('change',function(e){CMP.l=e.target.value;renderCmp();});
$('cm-list').addEventListener('click',function(e){var s=e.target.closest('[data-sort]');if(s){var k=s.getAttribute('data-sort');CMP.d=CMP.k===k?-CMP.d:(k==='n'?1:-1);CMP.k=k;renderCmp();return;}
 var tr=e.target.closest('[data-cm]');if(!tr)return;var c=tr.getAttribute('data-cm');if(!CMP.s)CMP.s=c;else CMP.l=c;renderCmp();$('compare').scrollIntoView({behavior:'smooth'});});
$('cm-list').addEventListener('keydown',function(e){if(e.key==='Enter'){var tr=e.target.closest('[data-cm]');if(tr)tr.click();}});

/* ---------- downloads ---------- */
function fullRows(y){var P=D[y].p,rows=[];SUM.s.forEach(function(st){st.l.forEach(function(a){var r=lgaRow(y,st.c,a[0]);if(!r)return;var o=obj(y,r);rows.push([st.n,st.c,a[1],a[0],o.reg,o.acc,r2(o.accR),o.cast,r2(o.to),r2(o.toA),o.val,o.rej].concat(o.v,[o.w,o.r,o.wv-o.rv,r2(o.mar)]));});});
 return {h:['state','state_code','lga','lga_code','registered','accredited','accreditation_rate_pct','votes_cast','turnout_of_registered_pct','turnout_of_accredited_pct','valid_votes','rejected_votes'].concat(P,['winner','runner_up','winning_margin_votes','winning_margin_pct']),r:rows};}
function stateTotals(){var rows=[];[19,23].forEach(function(y){SUM.s.forEach(function(st){var o=get(y,st.c,'');if(!o){rows.push([2000+y,st.n,'','','','','','','','','','','','','','','No result in source document']);return;}
  rows.push([2000+y,st.n,o.reg,o.acc,r2(o.accR),o.cast,r2(o.to),r2(o.toA),o.val,o.rej,votes(o,'APC'),votes(o,'PDP'),votes(o,'LP'),votes(o,'NNPP'),o.w,r2(o.mar),'']);});var n=get(y,'','');rows.push([2000+y,'NIGERIA (sum of LGA results)',n.reg,n.acc,r2(n.accR),n.cast,r2(n.to),r2(n.toA),n.val,n.rej,votes(n,'APC'),votes(n,'PDP'),votes(n,'LP'),votes(n,'NNPP'),n.w,r2(n.mar),y===19?'Excludes Osun (not in source)':'']);});
 return {h:['year','state','registered','accredited','accreditation_rate_pct','votes_cast','turnout_of_registered_pct','turnout_of_accredited_pct','valid_votes','rejected_votes','APC','PDP','LP','NNPP','winner','winning_margin_pct','note'],r:rows};}
function cmpAll(){var rows=[];var add=function(lvl,sn,ln,a,b){var g=function(o,k){return o?o[k]:'';};rows.push([lvl,sn,ln,g(a,'reg'),g(b,'reg'),g(a,'acc'),g(b,'acc'),a?r2(a.accR):'',b?r2(b.accR):'',a&&b?r2(b.accR-a.accR):'',g(a,'cast'),g(b,'cast'),a?r2(a.to):'',b?r2(b.to):'',a&&b?r2(b.to-a.to):'',a?r2(share(a,'APC')):'',b?r2(share(b,'APC')):'',a?r2(share(a,'PDP')):'',b?r2(share(b,'PDP')):'',b?r2(share(b,'LP')):'',b?r2(share(b,'NNPP')):'',a?a.w:'',b?b.w:'']);};
 add('National','Nigeria','',get(19,'',''),get(23,'',''));SUM.s.forEach(function(st){add('State',st.n,'',get(19,st.c,''),get(23,st.c,''));});SUM.s.forEach(function(st){st.l.forEach(function(a){add('LGA',st.n,a[1],get(19,st.c,a[0]),get(23,st.c,a[0]));});});
 return {h:['level','state','lga','registered_2019','registered_2023','accredited_2019','accredited_2023','accreditation_rate_2019_pct','accreditation_rate_2023_pct','accreditation_change_pts','votes_cast_2019','votes_cast_2023','turnout_2019_pct','turnout_2023_pct','turnout_change_pts','APC_share_2019_pct','APC_share_2023_pct','PDP_share_2019_pct','PDP_share_2023_pct','LP_share_2023_pct','NNPP_share_2023_pct','winner_2019','winner_2023'],r:rows};}
function doDl(k){var x;
 if(k==='f23'){x=fullRows(23);csv('dice-presidential-2023-lga-results.csv',x.h,x.r);return;}
 if(k==='f19'){x=fullRows(19);csv('dice-presidential-2019-lga-results.csv',x.h,x.r);return;}
 if(k==='st'){x=stateTotals();csv('dice-presidential-2019-2023-state-totals.csv',x.h,x.r);return;}
 if(k==='cmp'){x=cmpAll();csv('dice-presidential-2019-vs-2023-comparison.csv',x.h,x.r);return;}
 if(k==='tb'){var y=+TB.y,P=D[y].p,rows=tbRows().map(function(r){var o=r.o,sn=r.u.l?stateOf(r.u.s).n:r.u.n,ln=r.u.l?r.u.n:'';if(!o)return [sn,ln,'','','','','','','','',''];return [sn,ln,o.reg,o.acc,r2(o.accR),o.cast,r2(o.to),r2(o.toA),o.val,o.rej].concat(o.v,[o.w,r2(o.mar)]);});
  csv('dice-presidential-'+(2000+y)+'-'+(TB.s?norm(stateOf(TB.s).n).replace(/ /g,'-'):'states')+'.csv',['state','lga','registered','accredited','accreditation_rate_pct','votes_cast','turnout_of_registered_pct','turnout_of_accredited_pct','valid_votes','rejected_votes'].concat(P,['winner','winning_margin_pct']),rows);return;}
 if(k==='cm'){var rr=[],us=CMP.l?[{s:CMP.s,l:CMP.l,n:lgaName(CMP.s,CMP.l)}]:[{s:CMP.s,l:'',n:CMP.s?stateOf(CMP.s).n:'Nigeria'}].concat(units(CMP.s));us.forEach(function(u){var a=get(19,u.s,u.l),b=get(23,u.s,u.l),g=function(o,k){return o?o[k]:'';};
   rr.push([u.n,g(a,'reg'),g(b,'reg'),g(a,'acc'),g(b,'acc'),a?r2(a.accR):'',b?r2(b.accR):'',g(a,'cast'),g(b,'cast'),a?r2(a.to):'',b?r2(b.to):'',a&&b?r2(b.to-a.to):'',g(a,'val'),g(b,'val'),g(a,'rej'),g(b,'rej'),votes(a,'APC'),votes(b,'APC'),votes(a,'PDP'),votes(b,'PDP'),votes(b,'LP'),votes(b,'NNPP'),a?a.w:'',b?b.w:'']);});
  csv('dice-2019-vs-2023-'+norm(placeName(CMP.s,CMP.l)).replace(/ /g,'-')+'.csv',['area','registered_2019','registered_2023','accredited_2019','accredited_2023','accreditation_rate_2019_pct','accreditation_rate_2023_pct','votes_cast_2019','votes_cast_2023','turnout_2019_pct','turnout_2023_pct','turnout_change_pts','valid_2019','valid_2023','rejected_2019','rejected_2023','APC_2019','APC_2023','PDP_2019','PDP_2023','LP_2023','NNPP_2023','winner_2019','winner_2023'],rr);return;}}
document.addEventListener('click',function(e){var b=e.target.closest('[data-dl]');if(!b)return;var k=b.getAttribute('data-dl');gate(function(){doDl(k);});});

/* ---------- hero ---------- */
function hero(){var a=get(19,'',''),b=get(23,'','');
 $('er-hero').innerHTML=kpi('Registered voters, 2023',fmt(b.reg),'2019: '+fmt(a.reg)+'*')+kpi('Accredited, 2023',fmt(b.acc),pf(b.accR)+' of registered · 2019: '+pf(a.accR))+kpi('Turnout, 2023',pf(b.to),'votes cast ÷ registered · 2019: '+pf(a.to),GOLDT)+
  '<div class="vr-k"><span>Winner, 2023</span><b style="display:flex;align-items:center;gap:8px">'+badge(b.w,30)+b.w+' '+pf(share(b,b.w))+'</b><i>'+esc(CAND[23][b.w]||'')+' · margin '+pts(b.mar).replace('+','')+'</i></div>'+
  '<div class="vr-k"><span>Winner, 2019</span><b style="display:flex;align-items:center;gap:8px">'+badge(a.w,30)+a.w+' '+pf(share(a,a.w))+'</b><i>'+esc(CAND[19][a.w]||'')+' · margin '+pts(a.mar).replace('+','')+'*</i></div>';}

/* ---------- boot ---------- */
Promise.all([J('/data/vr-summary.json'),J('/data/vr-geo.json'),J('/data/er23-1.json'),J('/data/er23-2.json'),J('/data/er19-1.json'),J('/data/er19-2.json'),J('/data/er19-3.json')]).then(function(r){
 SUM=r[0];TOPO=r[1];D[23]={p:r[2].p,s:Object.assign({},r[2].s,r[3].s)};D[19]={p:r[4].p,s:Object.assign({},r[4].s,r[5].s,r[6].s)};
 $('er-status').hidden=true;hero();
 try{initMap();}catch(err){$('er-mapbox').innerHTML='<p style="padding:16px;color:'+MUT+'">The map could not load. The tables below still work.</p>';}
 renderMap();renderTb();renderCmp();})
.catch(function(){$('er-status').textContent='The results data could not be loaded. Please refresh the page in a moment.';$('er-status').style.color='#A33A1F';});
})();
