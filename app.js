var PHASES=[{"label": "Pre-election", "summary": "Long before polling day, we watch the processes that decide who gets to vote and who gets on the ballot.", "items": ["Voter registration and CVR", "PVC collection and distribution", "Party primaries, congresses and nominations", "Campaign conduct, finance and media", "Electoral security assessments"]}, {"label": "Election Day", "summary": "Trained, accredited observers at polling units and collation centres — from opening to declaration.", "items": ["Polling unit opening", "Accreditation and voting", "Counting at the polling unit", "Collation: ward, LGA, state, national", "Announcement of results"]}, {"label": "Post-election", "summary": "The vote is not over when polls close. We follow results, disputes and the handover of power.", "items": ["Result transmission and publication", "Election petitions and litigation", "Supplementary elections", "Transition of power", "Post-election violence monitoring"]}];
var STEPS=[["Register or update your details", "At an INEC CVR centre, or pre-register online."], ["Collect your PVC", "In person, from your INEC LGA office or designated centre."], ["Know your polling unit", "You can only vote where you registered."], ["Learn how voting works", "Accreditation with BVAS, thumb-printing, your rights, assistance for PWDs."], ["Vote and protect the count", "Vote early, refuse inducements, report incidents — not rumours."]];
var NOTES=['start with step one.','good start.','keep going.','more than halfway.','one step left.','you are Vote Ready!'];
function daysTo(){var t=Date.UTC(2027,0,15,23,0,0);return Math.max(0,Math.ceil((t-Date.now())/86400000));}
function tabStyle(on){return 'font:inherit;font-size:16px;font-weight:700;padding:12px 22px;min-height:48px;border-radius:999px;cursor:pointer;border:1.5px solid '+(on?'#F2B91C':'rgba(255,255,255,0.35)')+';background:'+(on?'#F2B91C':'transparent')+';color:'+(on?'#2B2105':'#FFFFFF');}
function cardStyle(d){return 'display:flex;gap:18px;align-items:flex-start;border-radius:18px;padding:20px;border:1.5px solid '+(d?'#3A9B3F':'#E4E6DF')+';background:'+(d?'#E6F2E3':'#FFFFFF');}
function checkStyle(d){return 'flex-shrink:0;width:48px;height:48px;border-radius:50%;cursor:pointer;display:flex;align-items:center;justify-content:center;border:2px solid #13693A;background:'+(d?'#13693A':'#FFFFFF');}
function titleStyle(d){return 'margin:0;font-family:Archivo,sans-serif;font-weight:700;font-size:19px;color:'+(d?'#55605A':'#111813')+';text-decoration:'+(d?'line-through':'none');}
function barStyle(n){return 'height:100%;background:#13693A;border-radius:999px;transition:width .3s;width:'+(n*20)+'%';}

var CSV={"results": [["election", "winner", "winner_party", "winner_votes", "runner_up", "runner_up_party", "runner_up_votes", "valid_votes", "rejected_votes", "total_votes_cast", "registered", "accredited"], [2015, "Muhammadu Buhari", "APC", 15424921, "Goodluck Jonathan", "PDP", 12853162, 28587564, 844519, 29432083, 67422005, 31746490], [2019, "Muhammadu Buhari", "APC", 15191847, "Atiku Abubakar", "PDP", 11262978, 27324583, 1289607, 28614190, 84004084, 29364209], [2023, "Bola Ahmed Tinubu", "APC", 8794726, "Atiku Abubakar", "PDP", 6984520, 24025940, 939278, 24965218, 93469008, 25286616]], "registration": [["metric", "value", "note"], ["registered_2015", 67422005, "INEC"], ["registered_2019", 84004084, "INEC"], ["registered_2023", 93469008, "INEC"], ["cvr_2025_26_new_registrants", 10772421, "provisional"], ["cvr_phase_1", 2572054, ""], ["cvr_phase_2", 3748704, ""], ["register_2023_youth_18_34_pct", 39.65, ""], ["register_2023_35_49_pct", 35.75, ""], ["register_2023_50_69_pct", 18.94, ""], ["register_2023_70_plus_pct", 5.66, ""], ["register_2023_female_pct", 47.52, ""], ["register_2023_male_pct", 52.48, ""]], "accreditation": [["election", "registered", "accredited", "accreditation_rate_pct", "votes_cast", "turnout_pct"], [2015, 67422005, 31746490, 47.09, 29432083, 43.65], [2019, 84004084, 29364209, 34.96, 28614190, 34.06], [2023, 93469008, 25286616, 27.05, 24965218, 26.71], ["zone_2023_north_central", "", "", "", "", 32.83], ["zone_2023_north_west", "", "", "", "", 32.61], ["zone_2023_north_east", "", "", "", "", 30.39], ["zone_2023_south_west", "", "", "", "", 28.71], ["zone_2023_south_south", "", "", "", "", 23.28], ["zone_2023_south_east", "", "", "", "", 22.3]]};
(function(){
var d=document.getElementById('days');if(d)d.textContent=daysTo();document.querySelectorAll('.days-count').forEach(function(e){e.textContent=daysTo();});
var btn=document.getElementById('dd-btn'),panel=document.getElementById('dd-panel');
function setMenu(o){panel.hidden=!o;btn.setAttribute('aria-expanded',o);}
if(btn){setMenu(false);btn.addEventListener('click',function(e){e.stopPropagation();setMenu(panel.hidden);});
document.addEventListener('click',function(e){if(!panel.contains(e.target))setMenu(false);});
document.addEventListener('keydown',function(e){if(e.key==='Escape')setMenu(false);});}
// tabs
var tabs=document.getElementById('tabs');
if(tabs){var cur=1;var render=function(f){tabs.innerHTML='';PHASES.forEach(function(p,i){var on=i===cur,b=document.createElement('button');b.type='button';b.setAttribute('role','tab');b.setAttribute('aria-selected',on);b.textContent=p.label;b.style.cssText=tabStyle(on);b.onclick=function(){cur=i;render(true);};tabs.appendChild(b);});if(f)tabs.children[cur].focus();
document.getElementById('phase-summary').textContent=PHASES[cur].summary;var ul=document.getElementById('phase-items');ul.innerHTML='';
PHASES[cur].items.forEach(function(t){var li=document.createElement('li');li.style.cssText='display:flex;gap:12px;align-items:center;border-bottom:1px solid rgba(255,255,255,0.18);padding:14px 0;font-size:16px';li.innerHTML='<span style="width:10px;height:10px;border-radius:50%;background:#F2B91C;flex-shrink:0"></span>';li.appendChild(document.createTextNode(t));ul.appendChild(li);});};render(false);}
// vote ready
var ol=document.getElementById('steps');
if(ol){var done={};var tick='<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';
var rs=function(focus){ol.innerHTML='';var n=0;STEPS.forEach(function(s,i){var dn=!!done[i];if(dn)n++;var li=document.createElement('li');li.style.cssText=cardStyle(dn);
var b=document.createElement('button');b.type='button';b.setAttribute('aria-pressed',dn);b.setAttribute('aria-label',(dn?'Unmark':'Mark')+' step '+(i+1)+' as done');b.style.cssText=checkStyle(dn);
b.innerHTML=dn?tick:'<span style="font-family:Archivo,sans-serif;font-weight:700;font-size:16px;color:#13693A">0'+(i+1)+'</span>';b.onclick=function(){done[i]=!done[i];rs(i);};
var c=document.createElement('div');c.style.cssText='display:flex;flex-direction:column;gap:4px;padding-top:10px';var h=document.createElement('h3');h.textContent=s[0];h.style.cssText=titleStyle(dn);var p=document.createElement('p');p.textContent=s[1];p.style.cssText='margin:0;font-size:15px;color:#55605A';
c.appendChild(h);c.appendChild(p);li.appendChild(b);li.appendChild(c);ol.appendChild(li);});
document.getElementById('bar').style.width=(n*20)+'%';document.getElementById('progress').textContent=n+' of 5 — '+NOTES[n];if(focus!==undefined)ol.children[focus].querySelector('button').focus();};rs();}
// gate
var gate=document.getElementById('gate');
function getMember(){try{return JSON.parse(localStorage.getItem('dice_member')||'null');}catch(e){return null;}}
function unlock(m){if(!gate)return;gate.classList.remove('locked');var g=document.getElementById('gated');g.removeAttribute('aria-hidden');g.removeAttribute('inert');var w=document.getElementById('welcome');if(w&&m&&m.name){w.textContent='Welcome, '+m.name.split(' ')[0]+'. The full analysis is unlocked on all three election data pages.';w.hidden=false;}}
if(gate){var m=getMember();if(m){unlock(m);}else{gate.classList.add('locked');var g=document.getElementById('gated');g.setAttribute('aria-hidden','true');g.setAttribute('inert','');}
var f=document.getElementById('gate-form'),st=document.getElementById('g-status'),sb=document.getElementById('g-submit');
f.addEventListener('submit',function(e){e.preventDefault();var name=f.name.value.trim(),email=f.email.value.trim();
if(name.length<2){st.style.color='#A33A1F';st.textContent='Please enter your full name.';f.name.focus();return;}
if(!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)){st.style.color='#A33A1F';st.textContent='Please enter a valid email address.';f.email.focus();return;}
sb.disabled=true;sb.textContent='Unlocking…';st.style.color='#55605A';st.textContent='';
fetch('/api/signup',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:name,email:email,consent:f.consent.checked,website:f.website.value,page:f.getAttribute('data-page')})})
.then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};});})
.then(function(res){if(!res.ok)throw new Error(res.j&&res.j.error||'Something went wrong.');var mm={name:name,email:email,at:Date.now()};try{localStorage.setItem('dice_member',JSON.stringify(mm));}catch(_){}unlock(mm);var w=document.getElementById('welcome');if(w)w.focus&&w.setAttribute('tabindex','-1'),w.focus();})
.catch(function(err){st.style.color='#A33A1F';st.textContent=err.message||'Could not sign you up. Please try again.';sb.disabled=false;sb.textContent='Unlock full analysis';});});}
// csv
var dl=document.getElementById('dl-csv');
if(dl)dl.addEventListener('click',function(){var k=dl.getAttribute('data-page');var rows=CSV[k];var csv=rows.map(function(r){return r.map(function(c){c=String(c);return /[",\n]/.test(c)?'"'+c.replace(/"/g,'""')+'"':c;}).join(',');}).join('\n');
var a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='dice-'+k+'.csv';document.body.appendChild(a);a.click();a.remove();});
})();
