(function(){
var app=document.getElementById('cand-app');if(!app)return;
// Official party logos as published by INEC at inecnigeria.org/parties (served via /party-logos/ rewrite). Text badge shows if a logo fails to load.
var LOGOS={"AA":"/party-logos/action-alliance-aa_logo.DQolkzM6.jpg","ADP":"/party-logos/action-democratic-party-adp_logo.7qxyEaV2.png","APP":"/party-logos/action-peoples-party-app_logo.BhRwRU7M.png","AAC":"/party-logos/african-action-congress-aac_logo.BiPR0ZxO.jpg","ADC":"/party-logos/african-democratic-congress-adc_logo.DBilnanA.jpg","APC":"/party-logos/all-progressives-congress-apc_logo.CSXCWB6p.jpg","APGA":"/party-logos/all-progressives-grand-alliance-apga_logo.PfgYjSjV.jpg","APM":"/party-logos/allied-peoples-movement-apm_logo.BQN54Bkl.jpg","BP":"/party-logos/boot-party-bp_logo.Br5O5Wf6.jpg","DLA":"/party-logos/democratic-leadership-alliance-dla_logo.B-mFJlad.jpg","LP":"/party-logos/labour-party-lp_logo.SV1XCjLU.jpg","NDP":"/party-logos/national-democratic-party_logo.B2wV2anp.jpg","NRM":"/party-logos/national-rescue-movement-nrm_logo.BUg-M2QT.png","NNPP":"/party-logos/new-nigeria-peoples-party-nnpp_logo.DkfmFai5.jpg","NDC":"/party-logos/nigeria-democratic-congress_logo.BauESQLD.jpeg","PDP":"/party-logos/peoples-democratic-party-pdp_logo.BClIHPW3.jpg","PRP":"/party-logos/peoples-redemption-party-prp_logo.C8_o4OQI.png","SDP":"/party-logos/social-democratic-party-sdp_logo.DhlQ2VXw.png","YPP":"/party-logos/young-progressive-party-ypp_logo.Biw28-Pp.jpeg","YP":"/party-logos/youth-party-yp_logo.D9Wh44Zt.png","ZLP":"/party-logos/zenith-labour-party-zlp_logo.B_S46I7c.jpg"};LOGOS.A='data:image/webp;base64,UklGRvYEAABXRUJQVlA4WAoAAAAgAAAARwAARwAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDggCAMAAFARAJ0BKkgASAA+bSySRiQioaEo/b3AgA2JbAC8JFFRcUt7QjzPZ20fVZxgHuK8yfQ285L/Adcz6AHlmez4v/Nr6Dhyes1hn1I9TA1Xd6ZXu1Nxe8N83bBggdJBo0ccRY8Hggk/O7V+f5itHf9ON5kKyKmBzW+8p+iBgBiz2Ws4rky6UA5yfBWJm0xEEmj1zYnTigD+/phO2Q79AS2U/+dnfpbqP/0WzsGo//cear53vxt9/z3HJIaPpJlcNRRJ9QASiAEfRw3sFy/pgC6zCByXxaO3NCvJCggOEQaSTN+EiBCDTfdyxa86DHxvfSDp596kGL3hnA3EBqHu4+kTletdYIRK9I0khVdbJoOvvSPrsZgQ+RaXWNCWHhnOrdbwbbV0XzXVWa04FQK3TaV2YM5VILzJ+t87yGOWzTwThumOjwmqHf09EHKtAIMMgyxVPDSxMRiQS2d19nlsI9/Ir5jY/MiyvVaajmTxnedPyS5m6Iol7k+NAR1UbedoFIY/2aWkcUCDT72AQlg3Kspxj6+fFq01XBoLeyzVC6B6eo5cFjMeCR3BXRauZZn1TdP4QX2asA90x3wmP3etM36Ljmdbo8mW8A9ntPzMicsnFvtM5/fJ1IJuPCTwRbAkOkv7hCRzFlLJO46vn4xHR58PuC1qDYHK2bM1n/3IQe20zNzfnx+U7H4uM43R/pLizsJ8bvKezQXcV/xbYdFMjLvimU+ogZr7TX1pduHaKKIar+QZTmMZcIRrXqYf16pKtrUWfFKcR95rL9SHFzr1nKK3uc5hiaIWJYoMq6PFyWOIiZDTB9fxNQlnvq5gmf7Rb7gzMZgmxViOyGdTJjP6rOA2QO5+TE0Qp59pY6cyTt58vSL0ourX1xLSpkKAjs8KkOfaDJkDWzkOrDpvzqNNnpPJEQcujJcMVf73eyz9LORO6EhdSH5JIr4cminjjTVxCeVk3BUHiUM6M7lKve+PvLbGnY7prY06270Pw/anUIMO3wIgAeZAkTw/ODCsBVGw71/Sjv9DizQB0tAA';
var NAMES={A:'Accord',AA:'Action Alliance',AAC:'African Action Congress',ADC:'African Democratic Congress',ADP:'Action Democratic Party',APC:'All Progressives Congress',APGA:'All Progressives Grand Alliance',APM:'Allied Peoples Movement',APP:'Action Peoples Party',BP:'Boot Party',LP:'Labour Party',NNPP:'New Nigeria Peoples Party',NRM:'National Rescue Movement',PDP:'Peoples Democratic Party',PRP:'Peoples Redemption Party',SDP:'Social Democratic Party',YPP:'Young Progressives Party',ZLP:'Zenith Labour Party',YP:'Youth Party',DLA:'Democratic Leadership Alliance',NDP:'National Democratic Party',NDC:'Nigeria Democratic Congress'};
var SW=['#0B4A2A','#B07D06','#3A9B3F','#13693A','#8A6205','#2E6E57','#5A7D1C','#6B4A0A','#1F5C3A','#946B12','#3F7F4A','#7C5A08'];
var G7='#13693A',G9='#0B4A2A',GL='#E6F2E3',GOLD='#F2B91C',INK='#111813',MUT='#55605A',LINE='#E4E6DF';
var EDU=['Not stated','Primary','Secondary','Diploma / NCE','First degree','Postgraduate'];
var D,S={ch:-1,st:-1,seat:-1,party:-1,g:-1,q:'',more:12},presAll=false;
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function fmt(n){return n.toLocaleString('en-GB');}
function pct(a,b){return b?(a/b*100).toFixed(1)+'%':'—';}
function badge(pi,sz){sz=sz||40;var p=D.parties[pi];var full=NAMES[p]?p+' — '+NAMES[p]:p;
 var fs=p.length>3?Math.round(sz*0.28):Math.round(sz*0.34);
 var txt='<span style="position:absolute;inset:0;border-radius:8px;background:'+SW[pi%SW.length]+';color:#fff;display:flex;align-items:center;justify-content:center;font-family:Archivo,sans-serif;font-weight:800;font-size:'+fs+'px;letter-spacing:-0.01em;box-shadow:inset 0 -3px 0 rgba(0,0,0,0.18)">'+esc(p)+'</span>';
 var img=LOGOS[p]?'<img src="'+LOGOS[p]+'" alt="" loading="lazy" decoding="async" onerror="this.remove()" style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;background:#fff;border:1px solid '+LINE+';border-radius:8px;box-sizing:border-box;padding:1px">':'';
 return '<span role="img" aria-label="'+esc(full)+'" title="'+esc(full)+'" style="position:relative;display:inline-block;width:'+sz+'px;height:'+sz+'px;flex-shrink:0">'+txt+img+'</span>';}
function chamberName(ch,short){return ch===0?'Senate':ch===1?(short?'Reps':'House of Representatives'):(short?'Assembly':'State House of Assembly');}
function norm(s){return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'');}
function $(id){return document.getElementById(id);}

function filtered(skipSeat){var q=norm(S.q.trim());var terms=q?q.split(/\s+/):[];
 return D.c.filter(function(c){var cn=D.cons[c[0]];
  if(S.ch>=0&&cn[1]!==S.ch)return false; if(S.st>=0&&cn[0]!==S.st)return false;
  if(!skipSeat&&S.seat>=0&&c[0]!==S.seat)return false; if(S.party>=0&&c[2]!==S.party)return false;
  if(S.g>=0&&c[4]!==S.g)return false;
  if(terms.length){var h=c._n;for(var i=0;i<terms.length;i++)if(h.indexOf(terms[i])<0)return false;}
  return true;});}

function opt(v,t,sel){return '<option value="'+v+'"'+(sel?' selected':'')+'>'+esc(t)+'</option>';}
function fillSelects(){
 var st=$('f-state'),se=$('f-seat'),pa=$('f-party');
 st.innerHTML=opt(-1,'All states',S.st<0)+D.states.map(function(s,i){return opt(i,s,S.st===i);}).join('');
 var seats=D.cons.map(function(c,i){return [i,c];}).filter(function(x){return (S.st<0||x[1][0]===S.st)&&(S.ch<0||x[1][1]===S.ch);});
 seats.sort(function(a,b){return a[1][1]-b[1][1]||a[1][2].localeCompare(b[1][2]);});
 se.disabled=S.st<0;
 se.innerHTML=opt(-1,S.st<0?'Pick a state first':'All seats in '+D.states[S.st],S.seat<0)+seats.map(function(x){return opt(x[0],chamberName(x[1][1],true)+' · '+x[1][2],S.seat===x[0]);}).join('');
 pa.innerHTML=opt(-1,'All parties',S.party<0)+D.parties.map(function(p,i){return opt(i,p+(NAMES[p]?' — '+NAMES[p]:''),S.party===i);}).join('');
 $('f-gender').value=S.g;
 Array.prototype.forEach.call(document.querySelectorAll('[data-ch]'),function(b){var on=+b.getAttribute('data-ch')===S.ch;b.setAttribute('aria-pressed',on);b.style.cssText=chStyle(on);});
}
function chStyle(on){return 'font:inherit;font-weight:700;font-size:15px;min-height:44px;padding:0 18px;border-radius:999px;cursor:pointer;border:1.5px solid '+(on?G7:'#C9D6CC')+';background:'+(on?G7:'#FFFFFF')+';color:'+(on?'#FFFFFF':G9);}

function kpi(l,v,sub,c){return '<div style="background:#fff;border:1px solid '+LINE+';border-radius:14px;padding:18px 20px"><div style="font-size:13px;font-weight:600;color:'+MUT+'">'+l+'</div><div style="font-family:Archivo,sans-serif;font-weight:700;font-size:clamp(24px,2.4vw,30px);line-height:1.1;margin-top:8px;letter-spacing:-0.02em;color:'+(c||G9)+'">'+v+'</div>'+(sub?'<div style="font-size:13px;margin-top:6px;color:'+MUT+'">'+sub+'</div>':'')+'</div>';}
function card(title,note,body,x){return '<div style="'+(x||'')+'background:#fff;border:1px solid '+LINE+';border-radius:18px;padding:clamp(20px,3vw,28px);display:flex;flex-direction:column;gap:18px;min-width:0"><div style="display:flex;flex-direction:column;gap:4px"><h3 style="margin:0;font-family:Archivo,sans-serif;font-weight:700;font-size:20px;letter-spacing:-0.01em;line-height:1.25">'+title+'</h3><span style="font-size:13px;color:'+MUT+'">'+note+'</span></div>'+body+'</div>';}
function bar(label,v,max,disp,tip,lead,act,vw){vw=vw||120;var w=max?Math.max(1.5,v/max*100):0;var tg=act?'button':'div';
 return '<'+tg+(act?' type="button" '+act:'')+' class="cbar'+(lead?' cbar-l':'')+'" title="'+esc(tip)+'" style="all:unset;box-sizing:border-box;display:grid;grid-template-columns:'+(lead?'40px ':'')+'minmax(64px,150px) minmax(40px,1fr) '+vw+'px;gap:10px;align-items:center;padding:5px 6px;margin:0 -6px;border-radius:8px;'+(act?'cursor:pointer;':'')+'">'+(lead||'')+'<span style="font-weight:600;font-size:14px;line-height:1.25;overflow-wrap:anywhere;min-width:0">'+esc(label)+'</span><span class="cb-track" style="display:block;height:16px;background:#EEF1EC;border-radius:0 4px 4px 0"><span style="display:block;height:100%;width:'+w.toFixed(1)+'%;background:'+G7+';border-radius:0 4px 4px 0"></span></span><span class="cb-val" style="font-size:13px;font-weight:600;white-space:nowrap;text-align:right">'+disp+'</span></'+tg+'>';}
function scopeLabel(){var a=[];if(S.seat>=0){a.push(D.cons[S.seat][2]);}else if(S.st>=0)a.push(D.states[S.st]);else a.push('Nigeria');
 if(S.ch===2)a.push('Presidential');if(S.ch===0)a.push('Senate');if(S.ch===1)a.push('House of Reps');if(S.ch===3)a.push('State House of Assembly');if(S.party>=0)a.push(D.parties[S.party]);if(S.g===1)a.push('women');if(S.g===0)a.push('men');return a.join(' · ');}

function presMatch(){var q=norm(S.q.trim());var terms=q?q.split(/\s+/):[];
 return D.t.filter(function(t){if(S.party>=0&&t[0]!==S.party)return false;
  if(S.g>=0&&t[1][2]!==S.g&&t[2][2]!==S.g)return false;
  if(terms.length){var ok=[t[1],t[2]].some(function(m){return terms.every(function(w){return m._n.indexOf(w)>=0;});});if(!ok)return false;}
  return true;});}
function person(role,m,c){return '<div style="display:flex;flex-direction:column;gap:2px;padding-top:12px;border-top:1px solid '+LINE+'"><span style="font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:'+c+'">'+role+'</span><span style="font-weight:700;font-size:17px;line-height:1.3">'+hl(m[0])+'</span><span style="font-size:13px;color:'+MUT+'">'+(m[2]?'Female':'Male')+' · '+m[1]+' yrs · '+EDU[m[3]]+'</span></div>';}
function renderPres(){var box=$('c-pres');var show=(S.ch===-1||S.ch===2)&&S.seat<0;var list=show?presMatch():[];
 var filt=S.party>=0||S.g>=0||S.q.trim();
 if(!show||(!list.length&&S.ch!==2)){box.hidden=true;box.innerHTML='';return;}
 box.hidden=false;
 var ppl=[];list.forEach(function(t){ppl.push(t[1],t[2]);});var pres=list.map(function(t){return t[1];});
 var w=ppl.filter(function(m){return m[2];}).length,wp=pres.filter(function(m){return m[2];}).length;
 var ages=pres.map(function(m){return m[1];}).sort(function(a,b){return a-b;});
 var yo=pres.slice().sort(function(a,b){return a[1]-b[1];});
 var head='<div style="display:flex;flex-wrap:wrap;gap:8px 24px;justify-content:space-between;align-items:end"><div style="display:flex;flex-direction:column;gap:6px"><div style="display:inline-flex;align-items:center;gap:10px;font-size:13px;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:#8A6205"><span style="width:22px;height:4px;border-radius:2px;background:'+GOLD+';display:inline-block"></span>Presidential election</div><h2 style="margin:0;font-family:Archivo,sans-serif;font-weight:700;font-size:clamp(24px,2.6vw,32px);letter-spacing:-0.02em;line-height:1.15;color:'+G9+'">Presidential tickets</h2></div><span style="font-size:14px;color:'+MUT+'">'+(filt?fmt(list.length)+' of '+D.t.length+' tickets match':D.t.length+' parties · one national ballot')+'</span></div>';
 if(!list.length){box.innerHTML=head+'<p style="margin:0;font-size:15px;color:'+MUT+'">No presidential ticket matches these filters.</p>';return;}
 var k='<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,160px),1fr));gap:14px">'+kpi('Tickets',list.length,'President + Vice-President')+kpi('Women on tickets',w+' of '+ppl.length,wp+' running for President',w/ppl.length<0.15?'#8A6205':G9)+kpi('Median age, President',ages[Math.floor(ages.length/2)],'')+kpi('Youngest · oldest',yo[0][1]+' · '+yo[yo.length-1][1],'presidential candidates')+'</div>';
 var cut=(!presAll&&!filt&&S.ch!==2&&list.length>6);var vis=cut?list.slice(0,6):list;
 var cards='<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,270px),1fr));gap:14px">'+vis.map(function(t){var p=D.parties[t[0]];
  return '<article style="background:#fff;border:1px solid '+LINE+';border-top:4px solid '+GOLD+';border-radius:18px;padding:18px 20px;display:flex;flex-direction:column;gap:12px"><div style="display:flex;gap:12px;align-items:center">'+badge(t[0],96)+'<div style="min-width:0"><div style="font-family:Archivo,sans-serif;font-weight:800;font-size:17px">'+esc(p)+'</div><div style="font-size:13px;color:'+MUT+'">'+esc(NAMES[p]||p)+'</div></div></div>'+person('President',t[1],G7)+person('Vice-President',t[2],'#8A6205')+'</article>';}).join('')+'</div>';
 var more=cut?'<button type="button" id="c-pres-all" style="align-self:center;font:inherit;font-weight:700;font-size:15px;background:#FFFFFF;color:'+G7+';border:1.5px solid '+G7+';border-radius:999px;min-height:48px;padding:0 24px;cursor:pointer">Show all '+list.length+' presidential tickets</button>':'';
 box.innerHTML=head+k+cards+more;}
function render(){
 renderPres();var nass=S.ch!==2;$('c-kpis').hidden=!nass;$('c-charts').hidden=!nass;$('c-results').hidden=!nass;
 var rows=filtered(false);
 var seats={},parties={},women=0,ages=[],pwd=0;
 rows.forEach(function(c){seats[c[0]]=(seats[c[0]]||0)+1;parties[c[2]]=(parties[c[2]]||0)+1;if(c[4])women++;if(c[3])ages.push(c[3]);if(c[5])pwd++;});
 var nSeats=Object.keys(seats).length;ages.sort(function(a,b){return a-b;});
 var med=ages.length?ages[Math.floor(ages.length/2)]:0,young=ages.filter(function(a){return a<35;}).length;
 $('c-scope').textContent=scopeLabel();
 $('c-kpis').innerHTML=kpi('Candidates',fmt(rows.length),nSeats?fmt(nSeats)+' seat'+(nSeats>1?'s':'')+' · '+(rows.length/nSeats).toFixed(1)+' per seat':'')+
  kpi('Parties on the ballot',Object.keys(parties).length,'of '+D.parties.length+' parties nationally')+
  kpi('Women',pct(women,rows.length),fmt(women)+' candidates',women/Math.max(1,rows.length)<0.15?'#8A6205':G9)+
  kpi('Median age',med||'—',ages.length?'Under 35: '+pct(young,ages.length)+(pwd?' · PWD: '+pwd:''):'');
 // party chart
 var pr=Object.keys(parties).map(function(k){return [+k,parties[k]];}).sort(function(a,b){return b[1]-a[1]||a[0]-b[0];});
 var pmax=pr.length?pr[0][1]:0;
 var pbody=pr.length?'<div style="display:flex;flex-direction:column;gap:2px">'+pr.map(function(x){var p=D.parties[x[0]];return bar(p,x[1],pmax,fmt(x[1])+(nSeats>1?' · '+Math.round(x[1]/nSeats*100)+'% of seats':''),p+(NAMES[p]?' ('+NAMES[p]+')':'')+': '+x[1]+' candidates in '+x[1]+' of '+nSeats+' seats',badge(x[0],40),'data-party="'+x[0]+'"',152);}).join('')+'</div>':'<p style="margin:0;color:'+MUT+'">No candidates match.</p>';
 // age bands
 var bands=[['25–34',25,34],['35–44',35,44],['45–54',45,54],['55–64',55,64],['65+',65,200]];
 var bc=bands.map(function(b){return ages.filter(function(a){return a>=b[1]&&a<=b[2];}).length;});var bmax=Math.max.apply(null,bc.concat([1]));
 var abody=bands.map(function(b,i){return bar(b[0],bc[i],bmax,fmt(bc[i])+' · '+pct(bc[i],ages.length),b[0]+': '+bc[i]+' candidates','','',110);}).join('')+
  (ages.length?'<p style="margin:4px 0 0;font-size:13px;color:'+MUT+'">Youngest '+ages[0]+' · oldest '+ages[ages.length-1]+'.</p>':'');
 // education
 var ec=[0,0,0,0,0,0];rows.forEach(function(c){ec[c[6]]++;});var emax=Math.max.apply(null,ec.concat([1]));
 var ebody=[5,4,3,2,1,0].map(function(i){return bar(EDU[i],ec[i],emax,fmt(ec[i])+' · '+pct(ec[i],rows.length),EDU[i]+': '+ec[i]+' candidates','','',110);}).join('')+'<p style="margin:4px 0 0;font-size:13px;color:'+MUT+'">Degree or higher: '+pct(ec[4]+ec[5],rows.length)+'.</p>';
 // women by party
 var wp={};rows.forEach(function(c){if(c[4])wp[c[2]]=(wp[c[2]]||0)+1;});
 var wr=Object.keys(wp).map(function(k){return [+k,wp[k]];}).sort(function(a,b){return b[1]-a[1];}).slice(0,8);var wmax=wr.length?wr[0][1]:1;
 var wbody=wr.length?wr.map(function(x){var p=D.parties[x[0]];return bar(p,x[1],wmax,fmt(x[1])+' of '+fmt(parties[x[0]])+' ('+pct(x[1],parties[x[0]])+')',p+': '+x[1]+' women of '+parties[x[0]]+' candidates',badge(x[0],40),'',132);}).join(''):'<p style="margin:0;color:'+MUT+'">No women candidates in this selection.</p>';
 // most contested seats
 var sr=Object.keys(seats).map(function(k){return [+k,seats[k]];}).sort(function(a,b){return b[1]-a[1]||D.cons[a[0]][2].localeCompare(D.cons[b[0]][2]);}).slice(0,8);var smax=sr.length?sr[0][1]:1;
 var sbody=sr.length?sr.map(function(x){var cn=D.cons[x[0]];var label=cn[2]+(S.st<0?' ('+D.states[cn[0]]+')':'');return bar(label,x[1],smax,x[1]+' · '+chamberName(cn[1],true),cn[2]+' ('+D.states[cn[0]]+', '+chamberName(cn[1],false)+'): '+x[1]+' candidates','','data-seat="'+x[0]+'"',116);}).join(''):'';
 var COL='<div style="display:flex;flex-direction:column;gap:16px;min-width:0">';
 $('c-charts').innerHTML=COL+card('Candidates by party','Each bar is one party’s candidates. Tap a party to filter.',pbody)+
  (sr.length>1?card('Most crowded races','Seats with the most candidates. Tap one to see its ballot.',sbody):card('This race',fmt(rows.length)+' candidates on the ballot','<p style="margin:0;font-size:15px;color:'+MUT+'">The full ballot is listed below.</p>'))+'</div>'+
  COL+card('Age profile','Candidates by age band',abody)+
  card('Highest qualification stated','DICE grouping of the qualifications each candidate submitted',ebody)+
  card('Women candidates by party','Top parties by number of women fielded',wbody)+'</div>';
 // list
 var groups={};rows.forEach(function(c){(groups[c[0]]=groups[c[0]]||[]).push(c);});
 var gk=Object.keys(groups).map(Number).sort(function(a,b){var A=D.cons[a],B=D.cons[b];return A[0]-B[0]||A[1]-B[1]||A[2].localeCompare(B[2]);});
 var shown=gk.slice(0,S.more);
 $('c-count').textContent=rows.length?fmt(rows.length)+' candidate'+(rows.length>1?'s':'')+' in '+fmt(gk.length)+' seat'+(gk.length>1?'s':'')+(S.q.trim()?' matching “'+S.q.trim()+'”':''):'No candidates match these filters.';
 $('c-list').innerHTML=shown.map(function(k){var cn=D.cons[k];var list=groups[k].slice().sort(function(a,b){return D.parties[a[2]].localeCompare(D.parties[b[2]]);});
  return '<article style="background:#fff;border:1px solid '+LINE+';border-radius:18px;overflow:hidden"><header style="display:flex;flex-wrap:wrap;gap:8px 16px;justify-content:space-between;align-items:center;padding:16px 20px;background:'+(cn[1]===0?'#FBF7EA':GL)+';border-bottom:1px solid '+LINE+'"><div><div style="font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:'+(cn[1]===0?'#8A6205':G7)+'">'+chamberName(cn[1],false)+' · '+esc(D.states[cn[0]])+'</div><h3 style="margin:2px 0 0;font-family:Archivo,sans-serif;font-weight:700;font-size:20px;line-height:1.25">'+esc(cn[2])+'</h3></div><span style="font-size:14px;font-weight:600;color:'+MUT+'">'+list.length+' on this list</span></header>'+
  '<ul style="list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,320px),1fr))">'+list.map(function(c){var p=D.parties[c[2]];
   return '<li style="display:flex;gap:14px;align-items:flex-start;padding:16px 20px;border-bottom:1px solid '+LINE+'">'+badge(c[2],68)+'<div style="min-width:0;display:flex;flex-direction:column;gap:2px"><span style="font-weight:700;font-size:16px;line-height:1.3">'+hl(c[1])+'</span><span style="font-size:13px;color:'+MUT+'">'+esc(p)+(NAMES[p]?' · '+esc(NAMES[p]):'')+'</span><span style="font-size:13px;color:'+INK+'">'+(c[4]?'Female':'Male')+' · '+(c[3]?c[3]+' yrs':'age not stated')+(c[5]?' · <span style="background:'+GL+';color:'+G9+';font-weight:700;padding:1px 6px;border-radius:999px">PWD: '+esc(c[5])+'</span>':'')+'</span>'+'<span style="font-size:13px;color:'+MUT+'">Highest qualification stated: <span title="'+esc(c[7]||EDU[c[6]])+'">'+EDU[c[6]]+'</span>'+'</span>'+'</div></li>';}).join('')+'</ul></article>';}).join('');
 var mb=$('c-more');mb.hidden=gk.length<=S.more;mb.textContent='Show more seats ('+fmt(gk.length-S.more)+' more)';
}
function hl(name){var t=S.q.trim();if(!t)return esc(name);var out=esc(name);t.split(/\s+/).forEach(function(w){if(w.length<2)return;var re=new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig');out=out.replace(re,'<mark style="background:#FCE9A8;color:inherit;border-radius:3px;padding:0 1px">$1</mark>');});return out;}

var t;
function update(resetMore){if(resetMore)S.more=12;fillSelects();render();}
function wire(){
 $('f-q').addEventListener('input',function(e){S.q=e.target.value;clearTimeout(t);t=setTimeout(function(){S.more=12;render();},120);});
 $('f-state').addEventListener('change',function(e){S.st=+e.target.value;S.seat=-1;update(true);});
 $('f-seat').addEventListener('change',function(e){S.seat=+e.target.value;update(true);});
 $('f-party').addEventListener('change',function(e){S.party=+e.target.value;update(true);});
 $('f-gender').addEventListener('change',function(e){S.g=+e.target.value;update(true);});
 Array.prototype.forEach.call(document.querySelectorAll('[data-ch]'),function(b){b.addEventListener('click',function(){S.ch=+b.getAttribute('data-ch');if(S.seat>=0&&D.cons[S.seat][1]!==S.ch&&S.ch>=0)S.seat=-1;update(true);});});
 $('f-reset').addEventListener('click',function(){S={ch:-1,st:-1,seat:-1,party:-1,g:-1,q:'',more:12};$('f-q').value='';update(true);});
 $('c-more').addEventListener('click',function(){S.more+=12;render();});
 $('c-pres').addEventListener('click',function(e){if(e.target.id==='c-pres-all'){presAll=true;renderPres();}});
 $('c-charts').addEventListener('click',function(e){var b=e.target.closest('[data-party],[data-seat]');if(!b)return;
  if(b.hasAttribute('data-party')){var p=+b.getAttribute('data-party');S.party=S.party===p?-1:p;}
  else{var s=+b.getAttribute('data-seat');S.seat=s;S.st=D.cons[s][0];}
  update(true);$('c-results').scrollIntoView({behavior:'smooth',block:'start'});});
 $('c-csv').addEventListener('click',function(){var rows=filtered(false);var head=['chamber','state','constituency','name','party','age','gender','pwd','highest_qualification_stated','qualifications_as_submitted','remarks','source_pdf_page'];
  var q=function(v){v=String(v);return /[",\n]/.test(v)?'"'+v.replace(/"/g,'""')+'"':v;};
  var pr=(S.ch===-1||S.ch===2)&&S.seat<0&&S.st<0?presMatch():[];var prow=[];pr.forEach(function(t){[[t[1],'Presidential'],[t[2],'Vice-Presidential']].forEach(function(x){var m=x[0];prow.push([x[1],'Nigeria','Federal Republic of Nigeria',m[0],D.parties[t[0]],m[1],m[2]?'F':'M','',EDU[m[3]],'','',''].map(q).join(','));});});if(S.ch===2)rows=[];
  var csv=[head.join(',')].concat(prow,rows.map(function(c){var cn=D.cons[c[0]];return [chamberName(cn[1],false),D.states[cn[0]],cn[2],c[1],D.parties[c[2]],c[3]||'',c[4]?'F':'M',c[5],EDU[c[6]],c[7]||'',c[8]||'',c[9]||''].map(q).join(',');})).join('\n');
  var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='dice-2027-candidates.csv';document.body.appendChild(a);a.click();a.remove();});
}
function gz(u){return fetch(u).then(function(r){if(!r.ok)throw 0;return r.json();});}
Promise.all([gz('/data/cand-0.json'),gz('/data/cand-1.json'),gz('/data/cand-2.json'),gz('/data/presidential.json'),gz('/data/cand-assembly.json')]).then(function(ps){var assembly=ps.pop();var pt=ps.pop();var d=ps[0];d.c=[];d.t=pt.t.map(function(t){return [d.parties.indexOf(t[0]),t[1],t[2]];}).filter(function(t){return t[0]>=0;});d.t.forEach(function(t){t[1]._n=norm(t[1][0]);t[2]._n=norm(t[2][0]);});ps.forEach(function(p){p.s.forEach(function(s){s[1].forEach(function(t){d.c.push([s[0],t[0],t[1],t[2],t[3],t[5]||'',t[4]]);});});});(pt.fx||[]).forEach(function(f){d.c.forEach(function(c){if(c[0]===f[0]&&c[1]===f[1])c[6]=f[2];});});var offset=d.cons.length;assembly.cons.forEach(function(c){d.cons.push([d.states.indexOf(assembly.states[c[0]]),3,c[2]]);});assembly.s.forEach(function(group){group[1].forEach(function(c){var party=assembly.parties[c[1]];var pi=d.parties.indexOf(party);if(pi<0){pi=d.parties.length;d.parties.push(party);}d.c.push([offset+group[0],c[0],pi,c[2],c[3],c[5]||'',c[4],c[6]||'',c[7]||'',c[8],c[9]]);});});D=d;D.c.forEach(function(c){c._n=norm(c[1]);});
 var u=new URLSearchParams(location.search);var s=u.get('state');if(s){var i=D.states.findIndex(function(x){return x.toLowerCase()===s.toLowerCase();});if(i>=0)S.st=i;}
 if(u.get('chamber')==='state-assembly')S.ch=3;
 if(u.get('q')){S.q=u.get('q');$('f-q').value=S.q;}
 $('c-loading').hidden=true;$('c-ready').hidden=false;wire();update(true);})
.catch(function(){$('c-loading').textContent='Could not load the candidate list. Please refresh the page.';});
})();