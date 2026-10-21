(function(){
if(!document.getElementById('ve-walk'))return;
var G9='#0B4A2A',G7='#13693A',G5='#3A9B3F',GL='#E6F2E3',GOLD='#F2B91C',GOLDT='#8A6205',CREAM='#FBF7EA',MUT='#55605A',LINE='#E4E6DF',INK='#111813';
function $(id){return document.getElementById(id);}
function esc(s){return String(s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function norm(s){return String(s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[’‘]/g,"'");}
var ICON={check:'<path d="M5 12.5l4.5 4.5L19 7.5"></path>',x:'<path d="M6 6l12 12M18 6L6 18"></path>',plus:'<path d="M12 5v14M5 12h14"></path>',arrow:'<path d="M5 12h14M13 6l6 6-6 6"></path>',
 reg:'<rect x="4" y="6" width="16" height="12" rx="2"></rect><circle cx="9" cy="12" r="2"></circle><path d="M13.5 10.5h4M13.5 13.5h3"></path>',
 vote:'<path d="M4 20h16M6 20V11h12v9"></path><path d="M9 11V5h6v6"></path><path d="M10.5 8l1 1 2-2"></path>',
 results:'<path d="M3.5 20.5h17"></path><path d="M6.5 17V11M11 17V6M15.5 17v-8M20 17V13"></path>',
 incl:'<circle cx="12" cy="5" r="2"></circle><path d="M12 8v6M8 10h8M9 21l3-7 3 7"></path>',
 people:'<circle cx="9" cy="8" r="3.5"></circle><path d="M2.5 20c.6-3.6 3.2-5.5 6.5-5.5s5.9 1.9 6.5 5.5"></path><circle cx="17" cy="9" r="2.5"></circle><path d="M17 14.5c2.4 0 4.1 1.5 4.5 4"></path>',
 parties:'<path d="M5 21V4"></path><path d="M5 4h11l-2 4 2 4H5"></path>',
 contest:'<path d="M8 21h8M12 17v4"></path><path d="M7 4h10v5a5 5 0 0 1-10 0V4z"></path><path d="M7 6H4v2a3 3 0 0 0 3 3M17 6h3v2a3 3 0 0 1-3 3"></path>',
 offences:'<path d="M12 3l9 16H3L12 3z"></path><path d="M12 10v4M12 17h.01"></path>',
 petitions:'<path d="M12 3v18M5 21h14"></path><path d="M4 8h16"></path><path d="M6 8l-3 6a3 3 0 0 0 6 0L6 8zM18 8l-3 6a3 3 0 0 0 6 0l-3-6z"></path>',
 inec:'<path d="M3 21h18M5 21V10M19 21V10M9 21v-7M15 21v-7"></path><path d="M2 10l10-6 10 6"></path>'};
function ic(k,c,sz,sw){return '<svg width="'+(sz||22)+'" height="'+(sz||22)+'" viewBox="0 0 24 24" fill="none" stroke="'+(c||'currentColor')+'" stroke-width="'+(sw||2)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+ICON[k]+'</svg>';}
function faqLink(id,t){return '<a href="#faq/'+id+'" data-faq="'+id+'" style="color:'+G7+';font-weight:700">'+(t||'Read the full answer')+' →</a>';}

/* ---------- 1. Am I ready to vote? ---------- */
var CHECKS=[
 ['I am a Nigerian citizen.','Only Nigerian citizens can register and vote.','C16'],
 ['I am a registered voter.','Register during the Continuous Voter Registration (CVR) at an INEC centre or start online at cvr.inecnigeria.org. You must be 18 or older.','C5'],
 ['My name is on the Register of Voters.','Check the displayed register, the INEC website or voters.inecnigeria.org. If your details are wrong, ask for a correction during claims and objections.','C21'],
 ['I have my PVC (or its downloadable copy).','The 2026 Regulations accept the PVC or its downloadable copy. A lost or damaged PVC must be replaced at least 90 days before the election, during the CVR.','C31'],
 ['I will vote at the polling unit where my name appears.','You can only vote at your own polling unit. To move, apply for a transfer during the CVR, at least 90 days before the election.','C34']];
var ans={};
function renderReady(){var yes=0,no=0;CHECKS.forEach(function(_,i){if(ans[i]===1)yes++;if(ans[i]===0)no++;});
 var list='<ol style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px">'+CHECKS.map(function(c,i){var a=ans[i];
  return '<li style="background:#fff;border:1px solid '+(a===0?'#E8D6A6':LINE)+';border-radius:14px;padding:14px 16px;display:flex;flex-direction:column;gap:10px">'+
  '<div style="display:flex;gap:12px;justify-content:space-between;align-items:center;flex-wrap:wrap"><span style="font-weight:700;font-size:16px;flex:1 1 220px">'+(i+1)+'. '+esc(c[0])+'</span>'+
  '<span role="group" aria-label="'+esc(c[0])+'" style="display:flex;gap:8px"><button type="button" class="ve-yn y" data-ck="'+i+'" data-v="1" aria-pressed="'+(a===1)+'">Yes</button><button type="button" class="ve-yn n" data-ck="'+i+'" data-v="0" aria-pressed="'+(a===0)+'">Not yet</button></span></div>'+
  (a===0?'<p style="margin:0;font-size:14px;color:'+INK+';background:'+CREAM+';border-radius:10px;padding:10px 12px">'+esc(c[1])+' '+faqLink(c[2])+'</p>':'')+'</li>';}).join('')+'</ol>';
 var done=yes+no===CHECKS.length,msg,bg,fg;
 if(no){msg='<strong>'+no+' thing'+(no>1?'s':'')+' to sort out</strong> before election day. The notes under each “Not yet” tell you how.';bg=CREAM;fg=GOLDT;}
 else if(done){msg='<strong>You are ready.</strong> On election day the BVAS will check your fingerprint or face, then you vote. See the steps below.';bg=GL;fg=G9;}
 else{msg='Answer all five questions to see your result.';bg='#fff';fg=MUT;}
 var pct=Math.round(yes/CHECKS.length*100);
 var side='<div class="ve-card" style="display:flex;flex-direction:column;gap:16px;position:sticky;top:96px">'+
  '<div style="display:flex;align-items:baseline;gap:10px"><span style="font-family:Archivo,sans-serif;font-weight:700;font-size:56px;line-height:1;color:'+G9+'">'+yes+'<span style="font-size:28px;color:'+MUT+'">/5</span></span><span style="font-size:15px;color:'+MUT+'">conditions met</span></div>'+
  '<div style="height:12px;background:#EEF1EC;border-radius:999px;overflow:hidden" role="progressbar" aria-valuemin="0" aria-valuemax="5" aria-valuenow="'+yes+'"><div style="height:100%;width:'+pct+'%;background:'+G7+';border-radius:999px;transition:width .25s"></div></div>'+
  '<p aria-live="polite" style="margin:0;font-size:15px;line-height:1.5;padding:12px 14px;border-radius:12px;background:'+bg+';color:'+fg+';border:1px solid '+LINE+'">'+msg+'</p>'+
  '<p style="margin:0;font-size:13px;color:'+MUT+'">The sixth condition is checked on the day: the BVAS must authenticate your fingerprint or face.</p>'+
  '<button type="button" id="ve-ready-reset" class="ve-btn ghost" style="align-self:flex-start">Start again</button></div>';
 $('ve-ready').innerHTML=list+side;}
$('ve-ready').addEventListener('click',function(e){var b=e.target.closest('[data-ck]');if(b){var i=+b.getAttribute('data-ck'),v=+b.getAttribute('data-v');ans[i]=ans[i]===v?undefined:v;renderReady();var nb=document.querySelector('[data-ck="'+i+'"][data-v="'+v+'"]');if(nb)nb.focus();return;}
 if(e.target.id==='ve-ready-reset'){ans={};renderReady();}});

/* ---------- 2. Election day walkthrough ---------- */
var STEPS=[
 {t:'Before you leave home',who:'You',body:['Take your PVC or its downloadable copy. No other ID is accepted.','Go to the polling unit where your name is on the register.','Do not wear or carry any party badge, cap, flag or poster — it is an offence at the polling unit.'],tip:'Polls open at 8:30am and close at 2:30pm. Anyone on the queue by 2:30pm will vote.',faq:'E30'},
 {t:'Polls open and you join the queue',who:'Presiding Officer',body:['From 8:00am the Presiding Officer introduces the officials and agents and checks the materials.','He or she opens the empty ballot box for everyone to see and shows that the BVAS count is zero, then seals the box.','Separate queues are made for persons with disabilities, visibly pregnant women, nursing mothers and the elderly — they vote first. Men and women may queue separately where culture requires.'],tip:'Voting opens at 8:30am.',faq:'R8'},
 {t:'First check',who:'APO III',body:['Confirms you are at the right polling unit. If your PVC is for another unit, you will be sent there.','Looks at the cuticle of your finger to make sure you have not voted elsewhere.','Asks if you need an assistive device, such as a Braille Ballot Guide or a magnifying glass.'],tip:'Check the list of voters pasted at the polling unit if you are not sure it is yours.',faq:'R4'},
 {t:'BVAS verification',who:'APO I',body:['Finds your record on the BVAS by scanning your PVC, the QR code in the register, the last six digits of your VIN, or your surname.','Checks your photo and polling unit details.','Asks you to place your thumb or finger on the BVAS. If that fails, the BVAS matches your face.'],tip:'If you cannot be verified after three tries, you will not be allowed to vote.',faq:'E43'},
 {t:'Register and ink',who:'APO II',body:['Finds your name in the Register of Voters and ticks it.','Gives assistive materials to voters with disabilities, where available.','Applies indelible ink to the cuticle of your finger (where available).'],tip:'The ink shows you have been accredited — and stops anyone voting twice.',faq:'E41'},
 {t:'Collect your ballot paper',who:'Presiding Officer',body:['Checks your inked finger.','Stamps, signs and dates the back of your ballot paper. A ballot without this is not counted.','Asks you to put away your phone or any camera before you enter the cubicle.'],tip:'Make sure the back of your ballot is stamped, signed and dated.',faq:'E58'},
 {t:'Vote in secret',who:'You',body:['In the voting cubicle, use the ink provided to thumbprint the box of the party you choose. One choice only.','Do not write your name or make any other mark — the ballot will be rejected.','Fold the ballot carefully while still in the cubicle, then drop it in the right ballot box in full view.'],tip:'Spoilt it by accident? Show it to the Presiding Officer and you will get a new one.',faq:'E47'},
 {t:'Stay and watch the count',who:'Everyone',body:['You may stay near the polling unit, peacefully, to watch the sorting, counting and announcement.','The result is written on Form EC8A, sent to the IReV portal from the BVAS, and pasted at the unit on Form EC60(E).','Polling agents may ask for one recount.'],tip:'You can check your polling unit’s result on the IReV portal.',faq:'E63'}];
var step=0,seen={0:1};
function renderWalk(){var s=STEPS[step];
 var dots='<div role="group" aria-label="Steps" style="display:flex;flex-wrap:wrap;gap:8px;align-items:center">'+STEPS.map(function(x,i){return '<button type="button" class="ve-dot'+(seen[i]&&i!==step?' done':'')+'" data-step="'+i+'" aria-label="Step '+(i+1)+': '+esc(x.t)+'"'+(i===step?' aria-current="step"':'')+'>'+(i+1)+'</button>'+(i<STEPS.length-1?'<span aria-hidden="true" style="width:14px;height:2px;background:'+(seen[i+1]?G5:'#D5D9D0')+'"></span>':'');}).join('')+'</div>';
 var card='<div class="ve-card" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:24px 40px;border-top:4px solid '+GOLD+'">'+
  '<div style="display:flex;flex-direction:column;gap:10px"><span style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:'+GOLDT+'">Step '+(step+1)+' of '+STEPS.length+' · '+esc(s.who)+'</span>'+
  '<h3 id="ve-step-title" tabindex="-1" style="margin:0;font-family:Archivo,sans-serif;font-weight:700;font-size:clamp(24px,2.6vw,32px);line-height:1.15;color:'+G9+'">'+esc(s.t)+'</h3>'+
  '<p style="margin:0;font-size:15px;line-height:1.5;padding:12px 14px;border-radius:12px;background:'+CREAM+'"><strong>Tip:</strong> '+esc(s.tip)+'</p>'+faqLink(s.faq,'Related question')+'</div>'+
  '<ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px">'+s.body.map(function(b){return '<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px;line-height:1.5"><span style="flex-shrink:0;margin-top:2px;width:22px;height:22px;border-radius:50%;background:'+GL+';display:inline-flex;align-items:center;justify-content:center">'+ic('check',G7,14,3)+'</span><span>'+esc(b)+'</span></li>';}).join('')+'</ul></div>';
 var nav='<div style="display:flex;gap:12px;justify-content:space-between;flex-wrap:wrap"><button type="button" class="ve-btn ghost" data-go="-1"'+(step===0?' disabled':'')+'>← Back</button><button type="button" class="ve-btn" data-go="1">'+(step===STEPS.length-1?'Start again':'Next step →')+'</button></div>';
 $('ve-walk').innerHTML='<div style="display:flex;flex-direction:column;gap:18px">'+dots+card+nav+'</div>';}
$('ve-walk').addEventListener('click',function(e){var b=e.target.closest('[data-step],[data-go]');if(!b||b.disabled)return;
 if(b.hasAttribute('data-step'))step=+b.getAttribute('data-step');else{var g=+b.getAttribute('data-go');step=step+g;if(step>=STEPS.length){step=0;seen={};}if(step<0)step=0;}
 seen[step]=1;renderWalk();var t=$('ve-step-title');if(t&&!b.hasAttribute('data-step'))t.focus({preventScroll:true});});

/* ---------- 3. What if…? ---------- */
var WHATIF=[
 ['The BVAS stops working','Voting is paused until a replacement BVAS arrives. If none arrives by 2:30pm, voting at that polling unit continues the next day.','Clause 27','R5'],
 ['The BVAS cannot verify me','After three failed tries with fingerprint and face, you cannot vote. The official marks “FA” and advises you to report it to INEC through the Resident Electoral Commissioner.','Clause 23','E37'],
 ['My PVC is for another polling unit','You will be asked to go to the polling unit where you are registered. You cannot vote anywhere else.','Clauses 17 and 25','R4'],
 ['I spoil my ballot paper','Hand it to the Presiding Officer. You get a new ballot paper and the spoilt one is marked “cancelled”.','Clause 31','R3'],
 ['I arrive after 2:30pm','If you are already on the queue at 2:30pm, you will vote. A security officer stands behind the last person; anyone arriving later cannot join.','Clauses 22 and 38','E40'],
 ['I have a disability and need help','You get priority. You may bring a person of your choice to help you vote — not an election official, polling agent or security officer.','Clauses 28 and 29','R9'],
 ['Someone offers me money to vote','Refuse. Giving or taking money to vote is an offence for both sides. Report it on the vote-buying hotline 0908 444 4333.','Electoral offences','G14'],
 ['Someone uses another person’s PVC','The person will not be allowed to vote and is liable to arrest and prosecution.','Clause 26','R6']];
var openWI=-1;
function renderWhatif(){$('ve-whatif').innerHTML=WHATIF.map(function(w,i){var o=openWI===i;
 return '<button type="button" class="ve-wi" data-wi="'+i+'" aria-expanded="'+o+'" style="'+(o?'border-color:'+G7+';background:'+GL:'')+'"><span style="display:flex;justify-content:space-between;gap:10px;align-items:flex-start"><span style="font-family:Archivo,sans-serif;font-weight:700;font-size:17px;line-height:1.3">What if '+esc(/^I /.test(w[0])?w[0]:w[0].charAt(0).toLowerCase()+w[0].slice(1))+'?</span><span style="flex-shrink:0;transform:rotate('+(o?45:0)+'deg);transition:transform .15s">'+ic('plus',G7,20,2.4)+'</span></span>'+
 (o?'<span style="font-size:15px;line-height:1.5;color:'+INK+'">'+esc(w[1])+'</span><span style="font-size:13px;color:'+MUT+'">'+esc(w[2])+' · <span data-faq="'+w[3]+'" style="color:'+G7+';font-weight:700;text-decoration:underline">More</span></span>':'')+'</button>';}).join('');}
$('ve-whatif').addEventListener('click',function(e){var f=e.target.closest('[data-faq]');if(f){e.preventDefault();e.stopPropagation();openFaq(f.getAttribute('data-faq'));return;}
 var b=e.target.closest('[data-wi]');if(!b)return;var i=+b.getAttribute('data-wi');openWI=openWI===i?-1:i;renderWhatif();var nb=document.querySelector('[data-wi="'+i+'"]');if(nb)nb.focus();});
var DOS=['Bring your PVC or its downloadable copy','Vote only at your own polling unit','Queue calmly; priority voters go first','Thumbprint inside one box only','Fold your ballot before leaving the cubicle','Stay peacefully to watch the count if you wish','Report vote buying and violence'];
var DONTS=['Do not take photos in the voting cubicle','Do not show anyone who you voted for','Do not write your name or any mark on the ballot','Do not wear party badges or colours to the polling unit','Do not sell or buy a PVC, or vote twice','Do not vote with another person’s card','Do not loiter or cause trouble near the polling unit'];
function list(items,ok){return '<div class="ve-card" style="display:flex;flex-direction:column;gap:14px;border-top:4px solid '+(ok?G5:GOLD)+'"><h3 style="margin:0;font-family:Archivo,sans-serif;font-weight:700;font-size:22px;color:'+(ok?G9:GOLDT)+'">'+(ok?'Do':'Don’t')+'</h3><ul style="list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px">'+items.map(function(t){return '<li style="display:flex;gap:12px;align-items:flex-start;font-size:16px"><span style="flex-shrink:0;width:24px;height:24px;border-radius:50%;background:'+(ok?GL:'#FBEFD0')+';display:inline-flex;align-items:center;justify-content:center">'+ic(ok?'check':'x',ok?G7:GOLDT,14,3)+'</span>'+esc(t)+'</li>';}).join('')+'</ul></div>';}
$('ve-dos').innerHTML=list(DOS,true)+list(DONTS,false);

/* ---------- 4. Quiz ---------- */
var QUIZ=[
 ['What must you show to be accredited to vote?',['Your National ID card','Your PVC or its downloadable copy','Any photo ID with your name'],1,'Only the PVC or its downloadable copy is checked at accreditation (2026 Regulations, clauses 5 and 22).'],
 ['What time do polls close?',['12:00 noon','2:30pm — but anyone on the queue by then still votes','6:00pm'],1,'Accreditation and voting run from 8:30am to 2:30pm. Everyone already on the queue at 2:30pm is allowed to vote.'],
 ['Can you take your phone into the voting cubicle?',['Yes, to take a photo of your ballot','Only if it is switched off','No — phones and cameras stay out of the cubicle'],2,'You may bring a phone to the polling unit, but not into the cubicle, and you must not photograph other voters (clause 34).'],
 ['You spoil your ballot paper by mistake. What happens?',['You lose your vote','The Presiding Officer gives you a new one','You can fix it with a pen'],1,'The spoilt ballot is marked “cancelled” and you get a replacement (clause 31).'],
 ['Can you vote at any polling unit near you on election day?',['Yes, any unit in your state','Yes, any unit in your LGA','No — only at the unit where your name is on the register'],2,'You vote only where your name appears in the Register of Voters. To move, apply for a transfer during the CVR.'],
 ['Who may help a voter with a disability to vote?',['A person the voter chooses, but not an official, polling agent or security officer','Only the Presiding Officer','Any party agent'],0,'The voter may choose a helper, other than an election official, polling agent or security officer on duty (clause 28).'],
 ['Is it an offence to accept money to vote for someone?',['No, only giving money is an offence','Yes — both giving and taking are offences','Only if the amount is large'],1,'Vote buying and selling are electoral offences for both the giver and the receiver.'],
 ['After voting, can you stay to watch the count?',['Yes, if you are orderly','No, you must go home at once','Only party agents can stay'],0,'Voters may remain in the vicinity of the polling unit to witness sorting, counting and the announcement, provided they are orderly (clause 37).']];
var qi=0,qsel=null,score=0;
function renderQuiz(){var box=$('ve-quiz');
 if(qi>=QUIZ.length){var pc=Math.round(score/QUIZ.length*100);box.innerHTML='<div style="display:flex;flex-direction:column;gap:16px;align-items:flex-start"><span style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:'+GOLDT+'">Your score</span><h3 tabindex="-1" id="ve-quiz-h" style="margin:0;font-family:Archivo,sans-serif;font-weight:700;font-size:48px;line-height:1;color:'+G9+'">'+score+' / '+QUIZ.length+'</h3><p style="margin:0;font-size:17px">'+(pc===100?'Perfect. You are ready for election day.':pc>=60?'Good work. Read the steps above to fill the gaps.':'Worth a second look — go through the election-day steps above, then try again.')+'</p><button type="button" class="ve-btn" id="ve-quiz-again">Try again</button></div>';return;}
 var q=QUIZ[qi],answered=qsel!==null;
 box.innerHTML='<div style="display:flex;flex-direction:column;gap:16px">'+
  '<div style="display:flex;justify-content:space-between;gap:12px;align-items:center;flex-wrap:wrap"><span style="font-size:13px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:'+GOLDT+'">Question '+(qi+1)+' of '+QUIZ.length+'</span><span style="font-size:14px;font-weight:600;color:'+MUT+'">Score: '+score+'</span></div>'+
  '<div style="height:6px;background:#EEF1EC;border-radius:999px;overflow:hidden"><div style="height:100%;width:'+(qi/QUIZ.length*100)+'%;background:'+GOLD+'"></div></div>'+
  '<h3 id="ve-quiz-h" tabindex="-1" style="margin:0;font-family:Archivo,sans-serif;font-weight:700;font-size:clamp(20px,2.2vw,26px);line-height:1.25">'+esc(q[0])+'</h3>'+
  '<div role="group" aria-label="Answers" style="display:flex;flex-direction:column;gap:10px">'+q[1].map(function(o,i){var st='';var mark='<span style="flex-shrink:0;width:28px;height:28px;border-radius:50%;border:1.5px solid #C9D6CC;display:inline-flex;align-items:center;justify-content:center;font-weight:700;font-size:13px;color:'+MUT+'">'+'ABC'[i]+'</span>';
   if(answered){if(i===q[2]){st='border-color:'+G7+';background:'+GL;mark='<span style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:'+G7+';display:inline-flex;align-items:center;justify-content:center">'+ic('check','#fff',16,3)+'</span>';}else if(i===qsel){st='border-color:'+GOLDT+';background:#FBEFD0';mark='<span style="flex-shrink:0;width:28px;height:28px;border-radius:50%;background:'+GOLDT+';display:inline-flex;align-items:center;justify-content:center">'+ic('x','#fff',16,3)+'</span>';}else st='opacity:.6';}
   return '<button type="button" class="ve-opt" data-opt="'+i+'"'+(answered?' disabled':'')+' style="'+st+'">'+mark+'<span>'+esc(o)+'</span></button>';}).join('')+'</div>'+
  (answered?'<div aria-live="polite" style="padding:14px 16px;border-radius:12px;background:'+(qsel===q[2]?GL:CREAM)+';font-size:15px;line-height:1.5"><strong>'+(qsel===q[2]?'Correct.':'Not quite.')+'</strong> '+esc(q[3])+'</div><button type="button" class="ve-btn" id="ve-quiz-next" style="align-self:flex-end">'+(qi===QUIZ.length-1?'See my score':'Next question →')+'</button>':'')+'</div>';}
$('ve-quiz').addEventListener('click',function(e){var o=e.target.closest('[data-opt]');
 if(o&&!o.disabled){qsel=+o.getAttribute('data-opt');if(qsel===QUIZ[qi][2])score++;renderQuiz();var n=$('ve-quiz-next');if(n)n.focus();return;}
 if(e.target.id==='ve-quiz-next'){qi++;qsel=null;renderQuiz();var h=$('ve-quiz-h');if(h)h.focus({preventScroll:true});}
 if(e.target.id==='ve-quiz-again'){qi=0;qsel=null;score=0;renderQuiz();var h2=$('ve-quiz-h');if(h2)h2.focus({preventScroll:true});}});

/* ---------- 5. Glossary ---------- */
var GLOSS=[['APO','Assistant Presiding Officer. Each polling unit has three: APO I, II and III.'],['BVAS','Bimodal Voter Accreditation System — the device that verifies voters by fingerprint or face and uploads results.'],['CVR','Continuous Voter Registration.'],['EC8A','The result sheet filled at the polling unit.'],['EC60(E)','The result poster pasted at the polling unit after counting.'],['EMB','Election Management Body.'],['EO','Electoral Officer — heads the INEC office in an LGA.'],['ICCC','INEC Citizens Contact Centre.'],['ICCES','Inter-Agency Consultative Committee on Election Security.'],['IDP','Internally Displaced Person.'],['IReV','INEC Result Viewing portal, where polling unit results are published.'],['IVED','INEC Voter Enrolment Device, used for registration.'],['LGA','Local Government Area.'],['NICVEP','National Inter-Agency Committee on Voter Education and Publicity.'],['PO','Presiding Officer — in charge of the polling unit.'],['PRV','Preliminary Register of Voters, displayed for claims and objections.'],['PU','Polling Unit.'],['PVC','Permanent Voter’s Card.'],['PWD','Person with Disability.'],['RA / RAC','Registration Area (ward) / Registration Area Centre.'],['REC','Resident Electoral Commissioner — heads INEC in a State or the FCT.'],['RO','Returning Officer — declares the result of an election.'],['SIEC','State Independent Electoral Commission.'],['SPO','Supervisory Presiding Officer.'],['TVC','Temporary Voter’s Card / registration slip.'],['VIN','Voter Identification Number, printed on your PVC.'],['Margin of lead','The gap between the two leading candidates. Used to decide if cancelled units must vote again.'],['Run-off','A second election between the top candidates when no one meets the winning spread.']];
function renderGloss(){var q=norm($('ve-gq').value.trim());var it=GLOSS.filter(function(g){return !q||norm(g[0]+' '+g[1]).indexOf(q)>=0;});
 $('ve-gloss').innerHTML=it.length?it.map(function(g){return '<div style="border:1px solid '+LINE+';border-radius:14px;padding:14px 16px;background:#fff"><dt style="font-family:Archivo,sans-serif;font-weight:700;font-size:18px;color:'+G9+'">'+esc(g[0])+'</dt><dd style="margin:4px 0 0;font-size:14px;color:'+MUT+'">'+esc(g[1])+'</dd></div>';}).join(''):'<p style="margin:0;color:'+MUT+'">No term matches.</p>';}
$('ve-gq').addEventListener('input',renderGloss);

/* ---------- 6. FAQ ---------- */
var CATS=[],ALL=[],cat='all',q='',open={},limit=25;
function hl(t,terms){var s=esc(t);terms.forEach(function(w){if(w.length<2)return;var re=new RegExp('('+w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+')','ig');s=s.replace(re,'<mark class="ve-hl">$1</mark>');});return s;}
var MARK=/^(\(?[ivxlc]+[.)]|\(?[a-h][.)]|[IVX]+\.|♦|•|\d+[.)])\s*/i;
function body(a,terms){var out='',ul=false;a.forEach(function(p){
  if(/^\([a-e]\)/.test(p)&&/\?$/.test(p)){if(ul){out+='</ul>';ul=false;}out+='<p style="font-weight:700;color:'+G9+';margin-top:6px">'+hl(p.replace(/^\([a-e]\)\.?\s*/,'').replace(/\?$/,''),terms)+'</p>';return;}
  if(MARK.test(p)){if(!ul){out+='<ul>';ul=true;}out+='<li>'+hl(p.replace(MARK,''),terms)+'</li>';}
  else{if(ul){out+='</ul>';ul=false;}out+='<p>'+hl(p,terms)+'</p>';}});
 if(ul)out+='</ul>';return out;}
function matches(){var terms=norm(q.trim()).split(/\s+/).filter(Boolean);var pool=cat==='all'||terms.length?ALL:ALL.filter(function(x){return x.c===cat;});
 if(terms.length){pool=pool.filter(function(x){return terms.every(function(w){return x._s.indexOf(w)>=0;});});
  pool=pool.slice().sort(function(a,b){var sa=terms.filter(function(w){return a._q.indexOf(w)>=0;}).length,sb=terms.filter(function(w){return b._q.indexOf(w)>=0;}).length;return sb-sa;});
  if(cat!=='all'){var inC=pool.filter(function(x){return x.c===cat;});if(inC.length)pool=inC;}}
 return {list:pool,terms:terms};}
function catName(k){for(var i=0;i<CATS.length;i++)if(CATS[i].k===k)return CATS[i].t;return '';}
function renderCats(){
 $('ve-cats').innerHTML=CATS.map(function(c){var on=cat===c.k;return '<button type="button" class="ve-cat" data-cat="'+c.k+'" aria-pressed="'+on+'"><span class="ve-ci" style="width:40px;height:40px;border-radius:12px;background:'+(on?G7:GL)+';display:inline-flex;align-items:center;justify-content:center">'+ic(c.k,on?'#fff':G7,22,1.9)+'</span><span class="ve-ct" style="font-family:Archivo,sans-serif;font-weight:700;font-size:17px;line-height:1.2;color:'+INK+'">'+esc(c.t)+'</span><span style="font-size:13px;color:'+MUT+'">'+c.qs.length+' questions</span></button>';}).join('');
}
function renderFaq(){var m=matches(),list=m.list,terms=m.terms;
 var shown=list.slice(0,limit);
 $('ve-count').textContent=terms.length?(list.length?list.length+' answer'+(list.length>1?'s':'')+' for “'+q.trim()+'”'+(cat!=='all'?'':''):'No answers for “'+q.trim()+'”. Try fewer or different words.'):(cat==='all'?'All topics · ':catName(cat)+' · ')+list.length+' questions';
 $('ve-clear').hidden=!terms.length&&cat==='all';$('ve-clear').textContent=terms.length?'Clear search':'Show all topics';
 $('ve-list').innerHTML=shown.length?shown.map(function(x,i){var o=!!open[x.id]||(terms.length&&list.length<=3);
  return '<div id="q-'+x.id+'" style="border-bottom:'+(i<shown.length-1?'1px solid '+LINE:'0')+';scroll-margin-top:96px"><h3 style="margin:0;font-size:inherit"><button type="button" class="ve-q" data-q="'+x.id+'" aria-expanded="'+o+'" aria-controls="a-'+x.id+'"><span>'+hl(x.q,terms)+(cat==='all'||terms.length?'<span style="display:block;margin-top:4px;font-size:12px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;color:'+MUT+'">'+esc(catName(x.c))+'</span>':'')+'</span>'+ic('plus',G7,20,2.4)+'</button></h3>'+
  '<div class="ve-ans" id="a-'+x.id+'"'+(o?'':' hidden')+'>'+body(x.a,terms)+
  (x.u?'<div style="margin-top:4px;border-left:4px solid '+GOLD+';background:'+CREAM+';border-radius:0 10px 10px 0;padding:10px 14px;font-size:14px"><strong style="color:'+GOLDT+'">Update · '+esc(x.u[0])+':</strong> '+esc(x.u[1])+'</div>':'')+
  '<div style="display:flex;flex-wrap:wrap;gap:6px 16px;font-size:12px;color:'+MUT+'"><span>'+(x.s==='r'?'Source: Regulations and Guidelines for the Conduct of Elections, 2026':'Source: INEC FAQ booklet (2022)')+'</span><button type="button" data-copy="'+x.id+'" style="font:inherit;font-size:12px;font-weight:700;background:none;border:0;padding:0;color:'+G7+';cursor:pointer;text-decoration:underline">Copy link</button></div></div></div>';}).join(''):'<p style="margin:0;padding:24px 0;color:'+MUT+'">Nothing matches. Try a single word such as “PVC”, “BVAS” or “transfer”.</p>';
 var mb=$('ve-more');mb.hidden=list.length<=limit;mb.textContent='Show more ('+(list.length-limit)+' more)';
 $('ve-expand').textContent=shown.length&&shown.every(function(x){return open[x.id];})?'Close all':'Open all';}
function setCat(k){cat=k;limit=25;renderCats();renderFaq();}
$('ve-cats').addEventListener('click',function(e){var b=e.target.closest('[data-cat]');if(!b)return;var k=b.getAttribute('data-cat');setCat(cat===k?'all':k);if(cat!=='all')$('ve-listtop').scrollIntoView({behavior:'smooth',block:'start'});});
$('ve-list').addEventListener('click',function(e){var c=e.target.closest('[data-copy]');if(c){var url=location.origin+location.pathname+'#faq/'+c.getAttribute('data-copy');try{navigator.clipboard.writeText(url);c.textContent='Link copied';}catch(_){}return;}
 var a=e.target.closest('a[data-faq]');if(a){e.preventDefault();openFaq(a.getAttribute('data-faq'));return;}
 var b=e.target.closest('[data-q]');if(!b)return;var id=b.getAttribute('data-q');var o=b.getAttribute('aria-expanded')!=='true';open[id]=o;b.setAttribute('aria-expanded',o);$('a-'+id).hidden=!o;
 $('ve-expand').textContent='Open all';});
$('ve-more').addEventListener('click',function(){limit+=25;renderFaq();});
$('ve-expand').addEventListener('click',function(){var m=matches().list.slice(0,limit);var all=m.every(function(x){return open[x.id];});m.forEach(function(x){open[x.id]=!all;});renderFaq();});
$('ve-clear').addEventListener('click',function(){if(q.trim()){q='';$('ve-search').value='';renderFaq();$('ve-search').focus();}else setCat('all');});
var t;$('ve-search').addEventListener('input',function(e){q=e.target.value;limit=25;clearTimeout(t);t=setTimeout(function(){renderFaq();},150);});
$('ve-search').addEventListener('keydown',function(e){if(e.key==='Enter'){e.preventDefault();$('faq').scrollIntoView({behavior:'smooth'});}});
var QUICK=[['Lost or damaged PVC','C31'],['What to bring','E30'],['Transfer my registration','C34'],['Phones at the polling unit','R2'],['If the BVAS fails','R5'],['Help for voters with disabilities','R9'],['2027 election dates','R1']];
$('ve-quick').innerHTML=QUICK.map(function(x){return '<button type="button" class="ve-chip" data-faq="'+x[1]+'">'+esc(x[0])+'</button>';}).join('');
function openFaq(id){var x=null;ALL.forEach(function(y){if(y.id===id)x=y;});if(!x)return;q='';$('ve-search').value='';cat=x.c;open[id]=true;
 var idx=ALL.filter(function(y){return y.c===x.c;}).indexOf(x);limit=Math.max(25,idx+1);renderCats();renderFaq();
 try{history.replaceState(null,'','#faq/'+id);}catch(_){}
 var el=$('q-'+id);if(el){el.scrollIntoView({behavior:'smooth',block:'start'});var b=el.querySelector('.ve-q');if(b)setTimeout(function(){b.focus({preventScroll:true});},400);}}
document.addEventListener('click',function(e){var a=e.target.closest('[data-faq]');if(!a||e.defaultPrevented)return;if(a.closest('#ve-list')||a.closest('#ve-whatif'))return;e.preventDefault();openFaq(a.getAttribute('data-faq'));});

window.addEventListener('hashchange',function(){var h=location.hash.match(/^#faq\/([A-Z]\d+)$/);if(h&&ALL.length)openFaq(h[1]);});
renderReady();renderWalk();renderWhatif();renderQuiz();renderGloss();
$('ve-list').innerHTML='<p style="margin:0;padding:24px 0;color:'+MUT+'">Loading questions…</p>';
Promise.all([0,1,2].map(function(i){return fetch('/data/faq-'+i+'.json').then(function(r){if(!r.ok)throw 0;return r.json();});})).then(function(ps){var d=[].concat(ps[0],ps[1],ps[2]);CATS=d;
 d.forEach(function(c){c.qs.forEach(function(x){x.c=c.k;x._q=norm(x.q);x._s=norm(x.q+' '+x.a.join(' ')+' '+(x.u?x.u[1]:''));ALL.push(x);});});
 $('ve-n-q').textContent=ALL.length;$('ve-n-c').textContent=CATS.length;renderCats();renderFaq();
 var h=location.hash.match(/^#faq\/([A-Z]\d+)$/);if(h)setTimeout(function(){openFaq(h[1]);},50);})
.catch(function(){$('ve-list').innerHTML='<p style="margin:0;padding:24px 0;color:'+MUT+'">Could not load the questions. Please refresh the page.</p>';});
})();
