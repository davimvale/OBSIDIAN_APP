(()=>{
P.edit='<path d="M12 20h9"/><path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.854z"/>';
P.flame='<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>';
const KEY='obs.v1';let DB={tasks:[],habits:[]};
try{const r=JSON.parse(localStorage.getItem(KEY));if(r&&r.tasks&&r.habits)DB=r}catch(e){}
DB.goals=DB.goals||[];DB.subjects=DB.subjects||[];DB.sessions=DB.sessions||[];DB.workouts=DB.workouts||[];DB.wlogs=DB.wlogs||[];DB.active=DB.active||null;DB.tx=DB.tx||[];DB.hide=!!DB.hide;DB.wlog=DB.wlog||[];DB.wgoal=DB.wgoal||2500;DB.notes=DB.notes||[];DB.projects=DB.projects||[];
const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(DB))}catch(e){toast('Não foi possível salvar neste navegador')}};
const uid=()=>Math.random().toString(36).slice(2,9);
const key=d=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
const TODAY=()=>key(new Date());
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=k=>{const[y,m,d]=k.split('-');return d+'/'+m};
const PR={Alta:0,'Média':1,Baixa:2};
const cmp=(a,b)=>{const x=a.due||'9',y=b.due||'9';return x<y?-1:x>y?1:PR[a.prio]-PR[b.prio]};
const isLate=t=>!t.done&&t.due&&t.due<TODAY();
const empty=(t,d,b)=>`<li class="empty"><b>${t}</b>${d}${b?'<br>'+b:''}</li>`;
const newBtn=(k,l)=>`<button class="btn pri" data-new="${k}">${ic('plus')}${l}</button>`;
const taskRow=t=>`<li class="row ${t.done?'done':''}"><button class="chk" role="checkbox" aria-checked="${t.done}" aria-label="Concluir: ${esc(t.title)}" data-tk="${t.id}">${ic('check')}</button><div class="tt"><div>${esc(t.title)}</div><small>${t.due?(isLate(t)?'Venceu em ':'')+fmt(t.due):'Sem data'}</small></div>${isLate(t)?'<span class="tag err">'+ic('alert')+'Atrasada</span>':''}<span class="tag ${t.prio==='Alta'?'warn':'neu'}">${t.prio}</span><button class="ico-btn" aria-label="Editar: ${esc(t.title)}" data-et="${t.id}">${ic('edit')}</button></li>`;
const did=(h,k)=>!!h.log[k];
const streak=h=>{const d=new Date();let n=0;if(!did(h,key(d)))d.setDate(d.getDate()-1);while(did(h,key(d))){n++;d.setDate(d.getDate()-1)}return n};
const last7=h=>{const d=new Date();let n=0;for(let i=0;i<7;i++){if(did(h,key(d)))n++;d.setDate(d.getDate()-1)}return n};
const strip=h=>{let o='';const d=new Date();d.setDate(d.getDate()-13);for(let i=0;i<14;i++){const k=key(d);o+=`<button class="${did(h,k)?'on':''} ${k===TODAY()?'today':''}" aria-pressed="${did(h,k)}" aria-label="${esc(h.name)}, ${fmt(k)}" title="${fmt(k)}" data-hd="${h.id}|${k}"></button>`;d.setDate(d.getDate()+1)}return o};
const sOf=n=>`${n} ${n===1?'dia':'dias'}`;

let filt='pend',cur='inicio';
function rDash(){
 const T=TODAY(),tk=DB.tasks,hb=DB.habits;
 const tt=tk.filter(t=>t.due===T),late=tk.filter(isLate),tD=tt.filter(t=>t.done).length,hD=hb.filter(h=>did(h,T)).length;
 const tot=tt.length+hb.length,dn=tD+hD,p=tot?Math.round(dn/tot*100):0;
 $('#pct').textContent=p+'%';$('#fg').style.strokeDashoffset=326.7*(1-p/100);
 $('#ptxt').textContent=tot?`${dn} de ${tot} itens concluídos`:'Nada planejado para hoje';
 $('#ringA').setAttribute('aria-label','Progresso do dia: '+p+'%');
 const ag=tk.filter(t=>t.due===T||isLate(t)).sort(cmp);
 $('#agc').textContent=ag.length+(ag.length===1?' item':' itens');
 $('#agenda').innerHTML=ag.length?ag.map(taskRow).join(''):empty('Dia livre','Nenhuma tarefa com prazo para hoje.',newBtn('t','Nova tarefa').replace('pri','sec'));
 const top=tk.filter(t=>!t.done).sort((a,b)=>PR[a.prio]-PR[b.prio]||cmp(a,b)).slice(0,4);
 $('#tasks').innerHTML=top.length?top.map(taskRow).join(''):empty('Nada pendente','Suas tarefas pendentes aparecem aqui.');
 $('#habits').innerHTML=hb.length?hb.map(h=>`<div class="hab"><button class="chk" role="checkbox" aria-checked="${did(h,T)}" aria-label="Marcar hoje: ${esc(h.name)}" data-hk="${h.id}">${ic('check')}</button><div class="tt"><div>${esc(h.name)}</div><div class="st">${sOf(streak(h))} seguidos</div></div></div>`).join(''):'<div class="empty" style="grid-column:1/-1"><b>Nenhum hábito ainda</b>Crie o primeiro e acompanhe sua sequência.<br>'+newBtn('h','Novo hábito').replace('pri','sec')+'</div>';
 const mx=Math.max(0,...hb.map(streak));
 $('#kpis').innerHTML=[['task','Tarefas hoje',`${tD}<small> / ${tt.length}</small>`,'concluídas'],['repeat','Hábitos',`${hD}<small> / ${hb.length}</small>`,'feitos hoje'],['alert','Atrasadas',late.length,late.length?'precisam de atenção':'tudo em dia'],['clock','Tempo de foco',fK(fToday()),'hoje'],['target','Metas',`${DB.goals.filter(g=>gp(g)<100).length}<small> ativas</small>`,'em andamento'],['drop','Hidratação',`${fL(wTot())}<small> / ${fL(DB.wgoal)}</small>`,wTot()>=DB.wgoal?'meta batida':'faltam '+fL(DB.wgoal-wTot())]].map(([i,l,v,x])=>`<div class="kpi"><div class="l">${ic(i)}${l}</div><div class="v">${v}</div><div class="x">${x}</div></div>`).join('');
}
function rTasks(){
 const T=TODAY(),all=DB.tasks.slice().sort(cmp);
 document.querySelectorAll('[data-f]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.f===filt));
 const pend=all.filter(t=>!t.done),dn=all.filter(t=>t.done);
 const g=filt==='done'?[['Concluídas',dn]]:[['Atrasadas',pend.filter(isLate)],['Hoje',pend.filter(t=>t.due===T)],['Próximas',pend.filter(t=>t.due>T)],['Sem data',pend.filter(t=>!t.due)],['Concluídas',filt==='all'?dn:[]]];
 const b=g.filter(x=>x[1].length).map(([n,l])=>`<h2 class="sech">${n} <span class="tag neu">${l.length}</span></h2><ul class="list tasklist">${l.map(taskRow).join('')}</ul>`).join('');
 $('#tkBody').innerHTML=b||'<ul class="list">'+(all.length?empty('Nada nesta lista','Troque o filtro para ver outras tarefas.'):empty('Nenhuma tarefa ainda','Crie a primeira e organize o seu dia.',newBtn('t','Nova tarefa')))+'</ul>';
}
function rHab(){
 const T=TODAY();
 $('#hbBody').innerHTML=DB.habits.length?DB.habits.map(h=>`<div class="hcard"><button class="chk" role="checkbox" aria-checked="${did(h,T)}" aria-label="Marcar hoje: ${esc(h.name)}" data-hk="${h.id}">${ic('check')}</button><div style="flex:1;min-width:0"><div class="big">${esc(h.name)}</div><div class="aux">${last7(h)} de ${h.goal} dias nos últimos 7</div><div class="strip" style="margin-top:8px" role="group" aria-label="Últimos 14 dias">${strip(h)}</div></div><span class="streak">${ic('flame')}${sOf(streak(h))}</span><button class="ico-btn" aria-label="Editar: ${esc(h.name)}" data-eh="${h.id}">${ic('edit')}</button></div>`).join(''):'<div class="card"><ul class="list">'+empty('Nenhum hábito ainda','Escolha algo pequeno e repetível para começar.',newBtn('h','Novo hábito'))+'</ul></div>';
}
P.prev='<path d="m15 18-6-6 6-6"/>';P.next='<path d="m9 18 6-6-6-6"/>';
const gItems=g=>[...g.ms.map(m=>m.done),...DB.tasks.filter(t=>t.goal===g.id).map(t=>t.done)];
const gp=g=>{const a=gItems(g);return a.length?Math.round(a.filter(Boolean).length/a.length*100):0};
function rGoals(){
 const gs=DB.goals.slice().sort((a,b)=>(a.due||'9')<(b.due||'9')?-1:1);
 $('#glBody').innerHTML=gs.length?gs.map(g=>{
  const p=gp(g),a=gItems(g),lt=DB.tasks.filter(t=>t.goal===g.id),late=g.due&&g.due<TODAY()&&p<100;
  const tag=p===100?'<span class="tag ok">'+ic('check')+'Concluída</span>':late?'<span class="tag err">'+ic('alert')+'Atrasada</span>':g.due?'<span class="tag neu">Prazo '+fmt(g.due)+'</span>':'<span class="tag neu">Sem prazo</span>';
  const rows=g.ms.map((m,i)=>`<li class="row ${m.done?'done':''}"><button class="chk" role="checkbox" aria-checked="${m.done}" aria-label="Marco: ${esc(m.t)}" data-mk="${g.id}|${i}">${ic('check')}</button><div class="tt"><div>${esc(m.t)}</div></div></li>`).join('')+lt.map(taskRow).join('');
  return `<section class="card" style="margin-bottom:12px"><h3 style="margin-bottom:0"><span>${esc(g.title)}</span><span style="display:flex;gap:8px;align-items:center">${tag}<button class="ico-btn" aria-label="Editar meta: ${esc(g.title)}" data-eg="${g.id}">${ic('edit')}</button></span></h3><div class="bar ${p===100?'ok':''}" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso da meta"><i style="width:${p}%"></i></div><div class="aux">${a.filter(Boolean).length} de ${a.length} itens · ${p}%</div>${rows?'<ul class="list" style="margin-top:12px">'+rows+'</ul>':''}</section>`}).join(''):'<div class="card"><ul class="list">'+empty('Nenhuma meta ainda','Defina algo que você quer alcançar e quebre em marcos.',newBtn('g','Nova meta'))+'</ul></div>';
}
let cm=new Date(),cs=TODAY();cm.setDate(1);
function rCal(){
 const y=cm.getFullYear(),m=cm.getMonth(),first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),cap=s=>s.replace(/^./,c=>c.toUpperCase());
 $('#calT').textContent=cap(new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(cm));
 let c=['D','S','T','Q','Q','S','S'].map(d=>`<div class="cw" aria-hidden="true">${d}</div>`).join('');
 for(let i=0;i<first;i++)c+='<div></div>';
 for(let d=1;d<=n;d++){const k=key(new Date(y,m,d)),tk=DB.tasks.filter(t=>t.due===k),gl=DB.goals.filter(g=>g.due===k),pd=tk.filter(t=>!t.done).length;
  c+=`<button class="cd ${k===TODAY()?'today':''}" aria-pressed="${k===cs}" aria-label="${d}: ${tk.length} tarefas${gl.length?', '+gl.length+' prazo(s) de meta':''}" data-cd="${k}"><span>${d}</span><span class="dots">${pd?'<i></i>':''}${tk.length-pd?'<i class="ok"></i>':''}${gl.length?'<i class="g"></i>':''}</span></button>`}
 $('#calG').innerHTML=c;
 const tk=DB.tasks.filter(t=>t.due===cs).sort(cmp),gl=DB.goals.filter(g=>g.due===cs);
 $('#calD').textContent=cap(new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long'}).format(new Date(cs+'T12:00')));
 $('#calL').innerHTML=gl.map(g=>`<li class="row"><span class="tag info">${ic('target')}Prazo da meta</span><div class="tt"><div>${esc(g.title)}</div></div></li>`).join('')+tk.map(taskRow).join('')||empty('Nada neste dia','Sem tarefas nem prazos de metas.');
}
function openGoal(id){
 F={type:'g',id};const it=id&&DB.goals.find(x=>x.id===id);
 $('#pt').textContent=it?'Editar meta':'Nova meta';
 $('#title').previousElementSibling.textContent='Meta';$('#due').previousElementSibling.textContent='Prazo';
 $('#title').value=it?it.title:'';$('#due').value=it?it.due:'';$('#ms').value=it?it.ms.map(m=>m.t).join('\n'):'';
 $('#prio').parentElement.hidden=true;$('#fG').hidden=true;$('#fL').hidden=true;$('#fM').hidden=false;$('#fM label').textContent='Marcos (um por linha)';$('#due').parentElement.hidden=false;
 $('#fT').classList.remove('bad');$('#save').textContent='Salvar meta';$('#del').hidden=!it;$('#del').textContent='Excluir';
 last=document.activeElement;$('#panel').classList.add('on');$('#scrim').classList.add('on');setTimeout(()=>$('#title').focus(),200);
}
function saveGoal(){
 const v=$('#title').value.trim();$('#fT').classList.toggle('bad',!v);if(!v)return;
 const o=F.id&&DB.goals.find(x=>x.id===F.id),ms=$('#ms').value.split('\n').map(s=>s.trim()).filter(Boolean).map(t=>({t,done:!!(o&&o.ms.find(m=>m.t===t&&m.done))}));
 const d={title:v,due:$('#due').value,ms};
 o?Object.assign(o,d):DB.goals.push({id:uid(),...d});
 persist();closeP();render();toast(o?'Alterações salvas':'Meta criada');
}
hydrate($('#vgoal'));hydrate($('#vcal'));hydrate($('#vstudy'));hydrate($('#vgym'));
P.play='<polygon points="6 3 20 12 6 21 6 3"/>';P.pause='<rect x="14" y="4" width="4" height="16" rx="1"/><rect x="6" y="4" width="4" height="16" rx="1"/>';
const fP=m=>m<60?m+' min':Math.floor(m/60)+'h '+(m%60)+'min';
const fK=m=>m<60?`${m}<small> min</small>`:`${Math.floor(m/60)}h ${m%60}<small> min</small>`;
const wk0=()=>{const d=new Date();d.setDate(d.getDate()-6);return key(d)};
const sumS=f=>DB.sessions.filter(f).reduce((a,s)=>a+s.min,0);
const fToday=()=>sumS(s=>s.date===TODAY());
let TM={total:1500,left:1500,end:0,run:false,sid:''};
const mmss=s=>String(Math.floor(s/60)).padStart(2,'0')+':'+String(s%60).padStart(2,'0');
const tmLeft=()=>TM.run?Math.max(0,Math.round((TM.end-Date.now())/1000)):TM.left;
function tmUpdate(){const l=tmLeft();$('#tmD').textContent=mmss(l);document.title=TM.run?mmss(l)+' · OBSIDIAN':'OBSIDIAN';if(TM.run&&l<=0)tmFinish(true)}
function tmFinish(auto){
 const min=auto?Math.round(TM.total/60):Math.floor((TM.total-tmLeft())/60);
 if(min<1){toast('Nada a salvar ainda: foque ao menos 1 minuto');return}
 const s=DB.subjects.find(x=>x.id===TM.sid);
 DB.sessions.push({id:uid(),sid:TM.sid,name:s?s.name:'Foco livre',min,date:TODAY()});
 TM.run=false;TM.left=TM.total;persist();render();toast(min+' min de foco salvos');
}
function rStudy(){
 $('#tmSub').innerHTML='<option value="">Foco livre</option>'+DB.subjects.map(s=>`<option value="${s.id}">${esc(s.name)}</option>`).join('');
 if(!DB.subjects.find(s=>s.id===TM.sid))TM.sid='';
 $('#tmSub').value=TM.sid;$('#tmSub').disabled=TM.run;
 $('#tmGo').innerHTML=ic(TM.run?'pause':'play')+(TM.run?'Pausar':TM.left<TM.total?'Retomar':'Iniciar');
 document.querySelectorAll('[data-pm]').forEach(b=>b.setAttribute('aria-pressed',+b.dataset.pm*60===TM.total));
 const w=wk0();
 $('#stT').textContent='Hoje: '+fP(fToday())+' · Últimos 7 dias: '+fP(sumS(s=>s.date>=w));
 $('#sbL').innerHTML=DB.subjects.length?DB.subjects.map(s=>`<li class="row"><div class="tt"><div>${esc(s.name)}</div><small>Hoje ${fP(sumS(x=>x.sid===s.id&&x.date===TODAY()))} · 7 dias ${fP(sumS(x=>x.sid===s.id&&x.date>=w))}</small></div><button class="ico-btn" aria-label="Editar disciplina: ${esc(s.name)}" data-es="${s.id}">${ic('edit')}</button></li>`).join(''):empty('Nenhuma disciplina ainda','Cadastre suas matérias para ver quanto tempo dedica a cada uma.',newBtn('s','Nova disciplina'));
 tmUpdate();
}
const lastOf=n=>{for(const l of DB.wlogs)for(const e of l.ex)if(e.name===n)return e.sets[e.sets.length-1]};
function startW(id){const w=DB.workouts.find(x=>x.id===id);if(!w.ex.length){toast('Adicione exercícios à rotina');return}
 DB.active={name:w.name,ex:w.ex.map(n=>{const l=lastOf(n)||{};return{name:n,sets:[{kg:l.kg||'',reps:l.reps||'',done:false}]}})};persist()}
function finishW(){
 const A=DB.active,ex=A.ex.map(e=>({name:e.name,sets:e.sets.filter(s=>s.done).map(s=>({kg:+s.kg||0,reps:+s.reps||0}))})).filter(e=>e.sets.length);
 if(!ex.length){toast('Marque ao menos uma série como feita');return}
 DB.wlogs.unshift({id:uid(),date:TODAY(),name:A.name,ex});DB.active=null;persist();render();toast('Treino salvo');
}
function rGym(){
 const A=DB.active;
 if(A){$('#gyBody').innerHTML=`<section class="card"><h3>${esc(A.name)}<span class="tag info">${ic('clock')}Em andamento</span></h3>${A.ex.map((e,ei)=>`<div style="margin-bottom:20px"><div class="big">${esc(e.name)}</div><div class="setr aux"><span>Série</span><span>Carga (kg)</span><span>Reps</span><span></span></div>${e.sets.map((s,si)=>`<div class="setr"><span class="mut">${si+1}</span><input class="num" type="number" inputmode="decimal" min="0" step="0.5" value="${esc(s.kg)}" aria-label="Carga em kg, ${esc(e.name)}, série ${si+1}" data-sk="${ei}|${si}|kg"><input class="num" type="number" inputmode="numeric" min="0" value="${esc(s.reps)}" aria-label="Repetições, ${esc(e.name)}, série ${si+1}" data-sk="${ei}|${si}|reps"><button class="chk" style="width:36px;height:36px" role="checkbox" aria-checked="${!!s.done}" aria-label="Série ${si+1} feita, ${esc(e.name)}" data-sd="${ei}|${si}">${ic('check')}</button></div>`).join('')}<button class="btn ter" style="margin-top:8px" data-sa="${ei}">${ic('plus')}Série</button></div>`).join('')}<div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn pri" data-wf="1">Finalizar treino</button><button class="btn sec" data-wd="1">${A.cf?'Confirmar descarte':'Descartar'}</button></div></section>`;return}
 const lw=w=>DB.wlogs.find(l=>l.name===w.name);
 const hist=DB.wlogs.slice(0,8).map(l=>{const sets=l.ex.reduce((a,e)=>a+e.sets.length,0),vol=l.ex.reduce((a,e)=>a+e.sets.reduce((b,s)=>b+s.kg*s.reps,0),0);return `<li class="row"><span class="tm">${fmt(l.date)}</span><div class="tt"><div>${esc(l.name)}</div><small>${sets} séries · ${vol.toLocaleString('pt-BR')} kg de volume</small></div></li>`}).join('');
 $('#gyBody').innerHTML=(DB.workouts.length?DB.workouts.map(w=>{const l=lw(w);return `<div class="hcard"><div style="flex:1;min-width:0"><div class="big">${esc(w.name)}</div><div class="aux">${w.ex.length} exercícios${l?' · último treino '+fmt(l.date):''}</div></div><button class="btn pri" data-ws="${w.id}">${ic('play')}Iniciar</button><button class="ico-btn" aria-label="Editar rotina: ${esc(w.name)}" data-ew="${w.id}">${ic('edit')}</button></div>`}).join(''):'<div class="card"><ul class="list">'+empty('Nenhuma rotina ainda','Crie uma rotina com seus exercícios e comece a registrar.',newBtn('w','Nova rotina'))+'</ul></div>')+(hist?`<h2 class="sech">Histórico recente</h2><ul class="list tasklist">${hist}</ul>`:'');
}
function openSimple(type,id){
 F={type,id};const S=type==='s',it=id&&(S?DB.subjects:DB.workouts).find(x=>x.id===id);
 $('#pt').textContent=S?(it?'Editar disciplina':'Nova disciplina'):(it?'Editar rotina':'Nova rotina');
 $('#title').previousElementSibling.textContent=S?'Disciplina':'Nome da rotina';
 $('#title').value=it?it.name:'';
 $('#prio').parentElement.hidden=true;$('#due').parentElement.hidden=true;$('#fG').hidden=true;$('#fL').hidden=true;$('#fM').hidden=S;
 $('#fM label').textContent='Exercícios (um por linha)';$('#ms').value=it&&!S?it.ex.join('\n'):'';
 $('#fT').classList.remove('bad');$('#save').textContent=S?'Salvar disciplina':'Salvar rotina';$('#del').hidden=!it;$('#del').textContent='Excluir';
 last=document.activeElement;$('#panel').classList.add('on');$('#scrim').classList.add('on');setTimeout(()=>$('#title').focus(),200);
}
function saveSimple(){
 const v=$('#title').value.trim();$('#fT').classList.toggle('bad',!v);if(!v)return;
 const S=F.type==='s',list=S?DB.subjects:DB.workouts,o=F.id&&list.find(x=>x.id===F.id),d={name:v};
 if(!S)d.ex=$('#ms').value.split('\n').map(s=>s.trim()).filter(Boolean);
 o?Object.assign(o,d):list.push({id:uid(),...d});
 persist();closeP();render();toast(o?'Alterações salvas':S?'Disciplina criada':'Rotina criada');
}
const R=n=>n.toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
const pm=s=>{s=String(s).trim();return s.includes(',')?parseFloat(s.replace(/\./g,'').replace(',','.')):parseFloat(s)};
const up=s=>s.replace(/^./,c=>c.toUpperCase());
const sumM=(ym,t)=>DB.tx.filter(x=>x.date.startsWith(ym)&&(!t||x.type===t)).reduce((a,x)=>a+x.amount,0);
const CAT={out:['Moradia','Alimentação','Transporte','Saúde','Estudos','Lazer','Outros'],in:['Salário','Freelance','Outros']};
const fillCat=c=>{$('#fcat').innerHTML=CAT[$('#ftp').value].map(x=>`<option>${x}</option>`).join('');if(c)$('#fcat').value=c};
$('#ftp').onchange=()=>fillCat();
let fm=new Date(),ff='all';fm.setDate(1);
function rFin(){
 const cy=TODAY().slice(0,7),ym=key(fm).slice(0,7),I=sumM(ym,'in'),O=sumM(ym,'out'),B=I-O,cI=sumM(cy,'in'),cO=sumM(cy,'out');
 $('#fSal').textContent=R(cI-cO);$('#fIn').textContent='+ '+R(cI);$('#fOut').textContent='− '+R(cO);
 [$('#fin'),$('#vfin'),$('#vrep')].forEach(e=>e.classList.toggle('hide',DB.hide));
 ['#eye','#eye2'].forEach(s=>{const b=$(s);b.setAttribute('aria-pressed',DB.hide);b.setAttribute('aria-label',DB.hide?'Mostrar valores':'Ocultar valores')});
 $('#fmT').textContent=up(new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(fm));
 $('#fKp').innerHTML=[['Receitas',I,'var(--ok)','+ '],['Despesas',O,'','− '],['Saldo do mês',B,B<0?'var(--err)':'var(--ok)',B<0?'− ':'']].map(([l,v,c,s])=>`<div class="kpi"><div class="l">${l}</div><div class="v val" ${c?`style="color:${c}"`:''}>${s}${R(Math.abs(v))}</div></div>`).join('');
 const mt=DB.tx.filter(x=>x.date.startsWith(ym)),cs={};
 mt.filter(x=>x.type==='out').forEach(x=>cs[x.cat]=(cs[x.cat]||0)+x.amount);
 const cl=Object.entries(cs).sort((a,b)=>b[1]-a[1]);
 $('#fCat').innerHTML=cl.length?cl.map(([c,v])=>`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;gap:8px"><span>${c}</span><span class="val">${R(v)} <span class="aux">· ${Math.round(v/O*100)}%</span></span></div><div class="bar" style="margin:6px 0 0"><i style="width:${v/O*100}%"></i></div></div>`).join(''):'<div class="empty">Sem despesas neste mês.</div>';
 document.querySelectorAll('[data-ff]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.ff===ff));
 const l=mt.filter(x=>ff==='all'||x.type===ff).sort((a,b)=>a.date<b.date?1:a.date>b.date?-1:0);
 $('#fL2').innerHTML=l.length?l.map(x=>`<li class="row"><span class="tm">${fmt(x.date)}</span><div class="tt"><div>${esc(x.desc)}</div><small>${esc(x.cat)}</small></div><span class="val" style="text-align:right;font-weight:500;white-space:nowrap;${x.type==='in'?'color:var(--ok)':''}">${x.type==='in'?'+ ':'− '}${R(x.amount)}</span><button class="ico-btn" aria-label="Editar lançamento: ${esc(x.desc)}" data-ef="${x.id}">${ic('edit')}</button></li>`).join(''):empty(mt.length?'Nada neste filtro':'Nenhum lançamento neste mês','Registre receitas e despesas para ver o saldo e os gastos por categoria.',newBtn('f','Novo lançamento'));
}
function openFin(id){
 F={type:'f',id};const it=id&&DB.tx.find(x=>x.id===id);
 $('#pt').textContent=it?'Editar lançamento':'Novo lançamento';
 $('#title').previousElementSibling.textContent='Descrição';$('#title').value=it?it.desc:'';
 $('#due').previousElementSibling.textContent='Data';$('#due').value=it?it.date:TODAY();
 $('#prio').parentElement.hidden=true;$('#fG').hidden=true;$('#fL').hidden=true;$('#fM').hidden=true;$('#due').parentElement.hidden=false;$('#fF').hidden=false;
 $('#ftp').value=it?it.type:'out';fillCat(it&&it.cat);$('#famt').value=it?String(it.amount).replace('.',','):'';
 $('#fT').classList.remove('bad');$('#fA').classList.remove('bad');$('#save').textContent='Salvar lançamento';$('#del').hidden=!it;$('#del').textContent='Excluir';
 last=document.activeElement;$('#panel').classList.add('on');$('#scrim').classList.add('on');setTimeout(()=>$('#title').focus(),200);
}
function saveFin(){
 const v=$('#title').value.trim(),a=pm($('#famt').value),ok=a>0;
 $('#fT').classList.toggle('bad',!v);$('#fA').classList.toggle('bad',!ok);if(!v||!ok)return;
 const o=F.id&&DB.tx.find(x=>x.id===F.id),d={type:$('#ftp').value,desc:v,amount:Math.round(a*100)/100,date:$('#due').value||TODAY(),cat:$('#fcat').value};
 o?Object.assign(o,d):DB.tx.push({id:uid(),...d});persist();closeP();render();toast(o?'Alterações salvas':'Lançamento salvo');
}
hydrate($('#vfin'));
const fL=ml=>(ml/1000).toLocaleString('pt-BR',{maximumFractionDigits:2})+' L';
const wTot=(d=TODAY())=>DB.wlog.filter(x=>x.date===d).reduce((a,x)=>a+x.ml,0);
function rWater(){
 const t=wTot(),g=DB.wgoal,p=Math.min(100,Math.round(t/g*100));
 $('#wSub').textContent=fL(t)+' de '+fL(g)+' hoje';
 $('#wBig').innerHTML=`${fL(t)}<small> / ${fL(g)}</small>`;
 $('#wBar').className='bar'+(t>=g?' ok':'');$('#wBar').setAttribute('aria-valuenow',p);$('#wBar i').style.width=p+'%';
 $('#wTxt').textContent=t>=g?'Meta batida. Bom trabalho.':`Faltam ${fL(g-t)} (${p}%)`;
 if(document.activeElement!==$('#wgoal'))$('#wgoal').value=g;
 const l=DB.wlog.filter(x=>x.date===TODAY()).sort((a,b)=>b.t-a.t);
 $('#wL').innerHTML=l.length?l.map(x=>`<li class="row"><div class="tt"><div>${x.ml} ml</div><small>${new Date(x.t).toLocaleTimeString('pt-BR',{hour:'2-digit',minute:'2-digit'})}</small></div><button class="ico-btn" aria-label="Remover ${x.ml} ml" data-wr="${x.id}">${ic('x')}</button></li>`).join(''):empty('Nenhum registro hoje','Toque num dos valores acima quando beber água.');
 const days=[...Array(7)].map((_,i)=>{const d=new Date();d.setDate(d.getDate()-6+i);return[d,wTot(key(d))]}),mx=Math.max(g,...days.map(x=>x[1]));
 $('#wWk').innerHTML=days.map(([d,v])=>{const lb=d.toLocaleDateString('pt-BR',{weekday:'short'}).replace('.','');return `<div style="flex:1;text-align:center;min-width:0"><div style="height:96px;display:flex;align-items:flex-end"><div role="img" aria-label="${lb}: ${fL(v)}${v>=g?', meta batida':''}" style="width:100%;height:${Math.round(v/mx*96)}px;min-height:${v?4:0}px;background:${v>=g?'var(--ok)':'var(--p)'};border-radius:6px 6px 0 0"></div></div><div class="aux" style="margin-top:6px">${lb}</div><div class="aux">${fL(v)}</div></div>`}).join('');
}
$('#wgoal').onchange=e=>{const v=+e.target.value;if(v>=500&&v<=10000){DB.wgoal=v;persist();render()}else{toast('Informe uma meta entre 500 e 10000 ml');e.target.value=DB.wgoal}};
let nSel='',ndc=false,nq='';
function rNoteList(){
 const q=nq.toLowerCase(),l=DB.notes.filter(n=>!q||(n.title+' '+n.body).toLowerCase().includes(q)).sort((a,b)=>b.updated-a.updated);
 $('#nList').innerHTML=l.length?l.map(n=>`<button class="nitem" ${n.id===nSel?'aria-current="true"':''} data-nn="${n.id}"><b>${esc(n.title||'Sem título')}</b><span>${esc(n.body.slice(0,60).replace(/\n/g,' '))||'Nota vazia'}</span><small>${new Date(n.updated).toLocaleDateString('pt-BR',{day:'2-digit',month:'2-digit'})}</small></button>`).join(''):`<div class="empty">${DB.notes.length?'Nenhuma nota encontrada.':'Nenhuma nota ainda.'}</div>`;
}
function rNotes(){
 if(!DB.notes.find(n=>n.id===nSel))nSel=DB.notes.length?DB.notes.slice().sort((a,b)=>b.updated-a.updated)[0].id:'';
 const n=DB.notes.find(x=>x.id===nSel);
 $('#nForm').hidden=!n;$('#nEmpty').hidden=!!n;
 if(n&&document.activeElement!==$('#nTi')&&document.activeElement!==$('#nBd')){$('#nTi').value=n.title;$('#nBd').value=n.body}
 $('#nDel').textContent=ndc?'Confirmar exclusão':'Excluir nota';
 rNoteList();
}
function newNote(){const n={id:uid(),title:'',body:'',updated:Date.now()};DB.notes.push(n);nSel=n.id;ndc=false;persist();render();$('#nTi').value='';$('#nBd').value='';$('#nTi').focus()}
const nEdit=f=>e=>{const n=DB.notes.find(x=>x.id===nSel);if(n){n[f]=e.target.value;n.updated=Date.now();persist();rNoteList()}};
$('#nTi').oninput=nEdit('title');$('#nBd').oninput=nEdit('body');
$('#nSearch').oninput=e=>{nq=e.target.value;rNoteList()};
hydrate($('#vnotes'));
const COLS=['A fazer','Fazendo','Feito'];let nPrj='',pCol=0;
const curP=()=>DB.projects.find(p=>p.id===nPrj);
function rPrj(){
 if(!curP())nPrj=DB.projects.length?DB.projects[0].id:'';
 if(!nPrj){$('#pjBody').innerHTML='<div class="card"><ul class="list">'+empty('Nenhum projeto ainda','Crie um projeto e organize o trabalho em colunas.',newBtn('p','Novo projeto'))+'</ul></div>';return}
 const pr=curP(),tot=pr.cards.length,dn=pr.cards.filter(c=>c.col===2).length,p=tot?Math.round(dn/tot*100):0,sm='style="width:30px;height:30px"';
 const card=(c,ci)=>{const late=c.due&&c.due<TODAY()&&ci<2;return `<div class="kc ${ci===2?'done':''}" draggable="true" data-cid="${c.id}"><div class="kt">${esc(c.title)}</div><div class="ka">${c.due?`<span class="tag ${late?'err':'neu'}">${late?ic('alert'):''}${fmt(c.due)}</span>`:'<span></span>'}<span style="display:flex">${ci>0?`<button class="ico-btn" ${sm} aria-label="Mover para ${COLS[ci-1]}: ${esc(c.title)}" data-mv="${c.id}|-1">${ic('prev')}</button>`:''}${ci<2?`<button class="ico-btn" ${sm} aria-label="Mover para ${COLS[ci+1]}: ${esc(c.title)}" data-mv="${c.id}|1">${ic('next')}</button>`:''}<button class="ico-btn" ${sm} aria-label="Editar cartão: ${esc(c.title)}" data-ec="${c.id}">${ic('edit')}</button></span></div></div>`};
 $('#pjBody').innerHTML=`<div class="chips" role="group" aria-label="Projetos">${DB.projects.map(x=>`<button class="chip" data-pj="${x.id}" aria-pressed="${x.id===nPrj}">${esc(x.name)}</button>`).join('')}<button class="ico-btn" ${sm} aria-label="Editar projeto: ${esc(pr.name)}" data-ep="1">${ic('edit')}</button></div><div class="aux">${dn} de ${tot} cartões concluídos · ${p}%</div><div class="bar ${tot&&p===100?'ok':''}" role="progressbar" aria-valuenow="${p}" aria-valuemin="0" aria-valuemax="100" aria-label="Progresso do projeto"><i style="width:${p}%"></i></div><div class="kb">${COLS.map((n,ci)=>{const cs=pr.cards.filter(c=>c.col===ci);return `<section class="kcol" data-col="${ci}" aria-label="${n}"><h3>${n} <span class="tag neu">${cs.length}</span><button class="ico-btn" ${sm} aria-label="Novo cartão em ${n}" data-ac="${ci}">${ic('plus')}</button></h3>${cs.map(c=>card(c,ci)).join('')||'<div class="aux" style="padding:8px">Sem cartões</div>'}</section>`}).join('')}</div>`;
}
function openPrj(type,id,col){
 F={type,id};pCol=col||0;const isP=type==='p',it=id&&(isP?DB.projects.find(x=>x.id===id):curP().cards.find(x=>x.id===id));
 $('#pt').textContent=isP?(it?'Editar projeto':'Novo projeto'):(it?'Editar cartão':'Novo cartão');
 $('#title').previousElementSibling.textContent=isP?'Nome do projeto':'Título do cartão';
 $('#title').value=it?(isP?it.name:it.title):'';
 $('#due').previousElementSibling.textContent='Prazo (opcional)';$('#due').value=it&&!isP&&it.due?it.due:'';
 $('#prio').parentElement.hidden=true;$('#fG').hidden=true;$('#fL').hidden=true;$('#fM').hidden=true;$('#fF').hidden=true;$('#due').parentElement.hidden=isP;
 $('#fT').classList.remove('bad');$('#save').textContent=isP?'Salvar projeto':'Salvar cartão';$('#del').hidden=!it;$('#del').textContent='Excluir';
 last=document.activeElement;$('#panel').classList.add('on');$('#scrim').classList.add('on');setTimeout(()=>$('#title').focus(),200);
}
function savePrj(){
 const v=$('#title').value.trim();$('#fT').classList.toggle('bad',!v);if(!v)return;
 if(F.type==='p'){const o=F.id&&DB.projects.find(x=>x.id===F.id);if(o)o.name=v;else{const p={id:uid(),name:v,cards:[]};DB.projects.push(p);nPrj=p.id}}
 else{const pr=curP(),o=F.id&&pr.cards.find(x=>x.id===F.id),d={title:v,due:$('#due').value};o?Object.assign(o,d):pr.cards.push({id:uid(),col:pCol,...d})}
 persist();closeP();render();toast('Salvo');
}
hydrate($('#vprj'));
const fixDB=()=>{DB.goals=DB.goals||[];DB.subjects=DB.subjects||[];DB.sessions=DB.sessions||[];DB.workouts=DB.workouts||[];DB.wlogs=DB.wlogs||[];DB.active=DB.active||null;DB.tx=DB.tx||[];DB.hide=!!DB.hide;DB.wlog=DB.wlog||[];DB.wgoal=DB.wgoal||2500;DB.notes=DB.notes||[];DB.projects=DB.projects||[]};
let bkC=0,wipeC=false,rp='r7';
function bk(a){
 const tx=$('#bkTx'),fw=$('#bkF'),all=()=>JSON.stringify(DB,null,1);
 if(a==='gen'){tx.value=all();fw.classList.remove('bad');toast('Backup gerado')}
 if(a==='copy'){if(!tx.value)tx.value=all();tx.select();try{navigator.clipboard.writeText(tx.value).then(()=>toast('Copiado'),()=>{document.execCommand('copy');toast('Copiado')})}catch(e){try{document.execCommand('copy');toast('Copiado')}catch(x){toast('Selecione o texto e copie manualmente')}}}
 if(a==='dl'){const l=document.createElement('a');l.href=URL.createObjectURL(new Blob([all()],{type:'application/json'}));l.download='obsidian-backup-'+TODAY()+'.json';document.body.appendChild(l);l.click();l.remove();toast('Se o download não começar, use Copiar')}
 if(a==='res'){let o;try{o=JSON.parse(tx.value)}catch(e){}
  const ok=o&&Array.isArray(o.tasks)&&Array.isArray(o.habits);fw.classList.toggle('bad',!ok);if(!ok)return;
  if(!bkC){bkC=1;$('#bkRes').textContent='Confirmar: substitui os dados atuais';return}
  DB=o;fixDB();persist();bkC=0;render();toast('Backup restaurado')}
 if(a==='wipe'){if(!wipeC){wipeC=true;$('#bkWipe').textContent='Confirmar: apagar tudo';return}
  DB={tasks:[],habits:[]};fixDB();persist();wipeC=false;render();toast('Dados apagados')}
}
$('#bkFile').onchange=e=>{const f=e.target.files[0];if(!f)return;const r=new FileReader();r.onload=()=>{$('#bkTx').value=r.result;bkC=0;toast('Arquivo carregado. Clique em Restaurar backup')};r.readAsText(f);e.target.value=''};
function rCfg(){
 $('#bkRes').textContent=bkC?'Confirmar: substitui os dados atuais':'Restaurar backup';$('#bkWipe').textContent=wipeC?'Confirmar: apagar tudo':'Apagar todos os dados';
 $('#cfgInfo').innerHTML=`${DB.tasks.length} tarefas<br>${DB.habits.length} hábitos<br>${DB.goals.length} metas<br>${DB.tx.length} lançamentos<br>${DB.notes.length} notas<br>${DB.projects.length} projetos`;
}
const pctB=p=>`<div class="bar" style="margin:6px 0 0"><i style="width:${p}%"></i></div>`;
const E=(t,d)=>'<ul class="list">'+empty(t,d)+'</ul>';
function rRep(){
 document.querySelectorAll('[data-rp]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.rp===rp));
 const n=rp==='r7'?7:rp==='r30'?30:new Date().getDate(),D=[];
 for(let i=n-1;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);D.push(key(d))}
 const S=new Set(D),f=D[0],l=D[n-1],inR=d=>d>=f&&d<=l,sum=(a,g)=>a.reduce((x,y)=>x+g(y),0);
 const bars=(v,lab,ref)=>{const mx=Math.max(1,...v,ref||0);return `<div role="img" aria-label="${lab}" style="display:flex;align-items:flex-end;gap:${v.length>14?2:6}px;height:90px">${v.map(x=>`<div style="flex:1;height:${Math.round(x/mx*90)}px;min-height:${x?3:0}px;background:${ref&&x>=ref?'var(--ok)':'var(--p)'};border-radius:3px 3px 0 0"></div>`).join('')}</div><div class="aux" style="display:flex;justify-content:space-between;margin-top:6px"><span>${fmt(f)}</span><span>${fmt(l)}</span></div>`};
 const tk=DB.tasks.filter(t=>t.due&&inR(t.due)),td=tk.filter(t=>t.done).length;
 const hb=DB.habits.map(h=>({n:h.name,c:D.filter(d=>h.log[d]).length})),hT=sum(hb,h=>h.c),hP=hb.length?Math.round(hT/(hb.length*n)*100):0;
 const fs=DB.sessions.filter(x=>S.has(x.date)),fM=sum(fs,x=>x.min),fD=D.map(d=>sum(fs.filter(x=>x.date===d),x=>x.min)),fS={};fs.forEach(x=>fS[x.name]=(fS[x.name]||0)+x.min);
 const gl=DB.wlogs.filter(x=>S.has(x.date)),gSt=sum(gl,x=>sum(x.ex,e=>e.sets.length)),gV=sum(gl,x=>sum(x.ex,e=>sum(e.sets,s=>s.kg*s.reps)));
 const wd=D.map(d=>wTot(d)),wA=Math.round(sum(wd,x=>x)/n),wH=wd.filter(x=>x>=DB.wgoal).length;
 const tx=DB.tx.filter(x=>inR(x.date)),I=sum(tx.filter(x=>x.type==='in'),x=>x.amount),O=sum(tx.filter(x=>x.type==='out'),x=>x.amount),B=I-O,cs={};
 tx.filter(x=>x.type==='out').forEach(x=>cs[x.cat]=(cs[x.cat]||0)+x.amount);const cl=Object.entries(cs).sort((a,b)=>b[1]-a[1]).slice(0,5);
 const ins=[];
 if(fM){const mx=Math.max(...fD);ins.push(`Melhor dia de foco: ${fmt(D[fD.indexOf(mx)])}, com ${fP(mx)}.`)}
 if(hb.length&&hT){const b=[...hb].sort((a,c)=>c.c-a.c),w=b[b.length-1];ins.push(`Hábito mais constante: ${esc(b[0].n)} (${b[0].c} de ${n} dias).`);if(b.length>1)ins.push(`Hábito com mais espaço para melhorar: ${esc(w.n)} (${w.c} de ${n} dias).`)}
 if(gl.length)ins.push(`${gl.length} ${gl.length===1?'treino registrado':'treinos registrados'} no período.`);
 if(wH)ins.push(`Meta de água batida em ${wH} de ${n} dias.`);
 if(cl.length)ins.push(`Maior categoria de gasto: ${esc(cl[0][0])}.`);
 const sec=(t,b,c)=>`<section class="card ${c||'c6'}"><h3>${t}</h3>${b}</section>`;
 const kp=[['Tarefas com prazo',`${td}<small> / ${tk.length}</small>`,'concluídas'],['Hábitos',`${hP}<small>%</small>`,'dos dias marcados'],['Foco',fK(fM),'no período'],['Treinos',gl.length,gSt+' séries'],['Água',fL(wA),'média por dia'],['Saldo',`<span class="val" style="color:${B<0?'var(--err)':'var(--ok)'}">${B<0?'− ':''}${R(Math.abs(B))}</span>`,'receitas − despesas']];
 $('#rpBody').innerHTML=`<div class="kpis" style="grid-template-columns:repeat(3,1fr)">${kp.map(([a,b,c])=>`<div class="kpi"><div class="l">${a}</div><div class="v">${b}</div><div class="x">${c}</div></div>`).join('')}</div><div class="grid" style="margin-top:16px">`
  +sec('Resumo',ins.length?`<ul class="list">${ins.map(t=>`<li class="row"><div class="tt"><div style="white-space:normal">${t}</div></div></li>`).join('')}</ul>`:E('Ainda sem dados neste período','Use os módulos por alguns dias e volte aqui.'),'c12')
  +sec('Hábitos',hb.length?hb.map(h=>`<div style="margin-bottom:14px"><div style="display:flex;justify-content:space-between;gap:8px"><span>${esc(h.n)}</span><span class="mut">${h.c} de ${n} dias · ${Math.round(h.c/n*100)}%</span></div>${pctB(Math.round(h.c/n*100))}</div>`).join(''):E('Nenhum hábito','Crie hábitos para ver a consistência.'))
  +sec('Foco',fM?bars(fD,'Foco por dia, total '+fP(fM))+`<ul class="list" style="margin-top:12px">${Object.entries(fS).sort((a,b)=>b[1]-a[1]).map(([k,v])=>`<li class="row"><div class="tt"><div>${esc(k)}</div></div><span class="mut">${fP(v)}</span></li>`).join('')}</ul>`:E('Sem sessões de foco','Use o temporizador em Estudos.'))
  +sec('Treinos',gl.length?`<div class="big">${gl.length} ${gl.length===1?'treino':'treinos'} · ${gSt} séries</div><div class="aux">Volume total: ${gV.toLocaleString('pt-BR')} kg</div><ul class="list" style="margin-top:12px">${gl.slice(0,6).map(x=>`<li class="row"><span class="tm">${fmt(x.date)}</span><div class="tt"><div>${esc(x.name)}</div></div></li>`).join('')}</ul>`:E('Sem treinos','Registre um treino na Academia.'))
  +sec('Hidratação',wA?bars(wd,'Água por dia, média '+fL(wA),DB.wgoal)+`<div class="aux" style="margin-top:8px">Média de ${fL(wA)} por dia · meta batida em ${wH} de ${n} dias (barras verdes)</div>`:E('Sem registros','Registre sua água em Hidratação.'))
  +sec('Finanças',tx.length?`<div style="display:flex;gap:32px;flex-wrap:wrap;margin-bottom:16px"><div><div class="aux">Receitas</div><div class="big val" style="color:var(--ok)">${R(I)}</div></div><div><div class="aux">Despesas</div><div class="big val">${R(O)}</div></div></div>`+(cl.length?cl.map(([c,v])=>`<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between"><span>${esc(c)}</span><span class="val">${R(v)}</span></div>${pctB(Math.round(v/O*100))}</div>`).join(''):''):E('Sem lançamentos','Registre receitas e despesas em Finanças.'),'c12')
  +'</div>';
}
const render=()=>{rDash();rTasks();rHab();rGoals();rCal();rStudy();rGym();rFin();rWater();rNotes();rPrj();rRep();rCfg()};

const V={inicio:['#vdash','Visão geral'],tarefas:['#vtasks','Tarefas'],habitos:['#vhab','Hábitos'],metas:['#vgoal','Metas'],calendario:['#vcal','Calendário'],estudos:['#vstudy','Estudos'],academia:['#vgym','Academia'],financas:['#vfin','Finanças'],hidratacao:['#vwater','Hidratação'],notas:['#vnotes','Notas'],projetos:['#vprj','Projetos'],relatorios:['#vrep','Relatórios'],config:['#vcfg','Configurações']};
function go(v,name){
 if(!V[v]&&v!=='soon')v='inicio';cur=v;
 ['#vdash','#vtasks','#vhab','#vgoal','#vcal','#vstudy','#vgym','#vfin','#vwater','#vnotes','#vprj','#vrep','#vcfg','#vsoon'].forEach(s=>$(s).hidden=true);
 $(V[v]?V[v][0]:'#vsoon').hidden=false;
 if(v==='soon')$('#soonN').textContent=name;
 $('.crumb b').textContent=V[v]?V[v][1]:name;
 document.querySelectorAll('#nav a,#foot a,#bnav a').forEach(a=>{if(a.dataset.v===v&&(v!=='soon'||a.title===name))a.setAttribute('aria-current','page');else a.removeAttribute('aria-current')});
 app.classList.remove('open');$('#scrim').classList.remove('on');window.scrollTo(0,0);render();
}
document.querySelectorAll('#nav a,#foot a').forEach(a=>{a.dataset.v={'Visão geral':'inicio','Tarefas':'tarefas','Hábitos':'habitos','Metas':'metas','Calendário':'calendario','Estudos':'estudos','Academia':'academia','Finanças':'financas','Hidratação':'hidratacao','Notas':'notas','Projetos':'projetos','Relatórios':'relatorios','Configurações':'config'}[a.title]||'soon'});
document.querySelectorAll('#bnav a').forEach((a,i)=>a.dataset.v=['inicio','tarefas','habitos'][i]);
$('#vtasks').querySelectorAll('[data-i]').forEach(e=>{});hydrate($('#vtasks'));hydrate($('#vhab'));

let F=null;
function openForm(type,id){
 F={type,id};const T=type==='t',it=id&&(T?DB.tasks:DB.habits).find(x=>x.id===id);
 $('#pt').textContent=T?(it?'Editar tarefa':'Nova tarefa'):(it?'Editar hábito':'Novo hábito');
 $('#title').previousElementSibling.textContent=T?'Título':'Nome do hábito';
 $('#title').value=it?(T?it.title:it.name):'';
 $('#prio').parentElement.hidden=!T;$('#due').parentElement.hidden=!T;$('#fG').hidden=T;$('#fM').hidden=true;$('#fL').hidden=!T;$('#due').previousElementSibling.textContent='Vencimento';$('#tgoal').innerHTML='<option value="">Nenhuma</option>'+DB.goals.map(g=>`<option value="${g.id}">${esc(g.title)}</option>`).join('');$('#tgoal').value=it&&it.goal?it.goal:'';
 if(T){$('#prio').value=it?it.prio:'Média';$('#due').value=it?it.due:''}else $('#goal').value=it?it.goal:'7';
 $('#fT').classList.remove('bad');$('#save').textContent=T?'Salvar tarefa':'Salvar hábito';
 $('#del').hidden=!it;$('#del').textContent='Excluir';
 last=document.activeElement;$('#panel').classList.add('on');$('#scrim').classList.add('on');setTimeout(()=>$('#title').focus(),200);
}
['#new','#new2','#fab'].forEach(s=>$(s).onclick=()=>cur==='metas'?openGoal():cur==='estudos'?openSimple('s'):cur==='academia'?openSimple('w'):cur==='financas'?openFin():cur==='notas'?newNote():cur==='projetos'?openPrj('p'):openForm(cur==='habitos'?'h':'t'));
$('#save').onclick=()=>{
 const v=$('#title').value.trim();$('#fT').classList.toggle('bad',!v);if(!v)return;
 const T=F.type==='t',list=T?DB.tasks:DB.habits,o=F.id&&list.find(x=>x.id===F.id);
 if(T){const d={title:v,prio:$('#prio').value,due:$('#due').value,goal:$('#tgoal').value};o?Object.assign(o,d):DB.tasks.push({id:uid(),done:false,...d})}
 else{const d={name:v,goal:+$('#goal').value};o?Object.assign(o,d):DB.habits.push({id:uid(),log:{},...d})}
 persist();closeP();render();toast(o?'Alterações salvas':T?'Tarefa criada':'Hábito criado');
};
$('#title').onkeydown=e=>{if(e.key==='Enter')$('#save').click()};
$('#del').onclick=()=>{
 if($('#del').textContent==='Excluir'){$('#del').textContent='Confirmar exclusão';return}
 const k=F.type==='c'?'':{t:'tasks',h:'habits',g:'goals',s:'subjects',w:'workouts',f:'tx',p:'projects'}[F.type];if(F.type==='c'){const pr=curP();pr.cards=pr.cards.filter(x=>x.id!==F.id);persist();closeP();render();toast('Excluído');return}DB[k]=DB[k].filter(x=>x.id!==F.id);if(k==='goals')DB.tasks.forEach(t=>{if(t.goal===F.id)t.goal=''});persist();closeP();render();toast('Excluído');
};

document.addEventListener('click',e=>{
 const c=e.target.closest('[data-tk],[data-hk],[data-hd],[data-et],[data-eh],[data-f],[data-new],[data-mk],[data-eg],[data-cm],[data-cd],[data-ct],[data-pm],[data-tg],[data-te],[data-tr],[data-es],[data-ew],[data-ws],[data-sa],[data-sd],[data-wf],[data-wd],[data-ff],[data-fm],[data-fh],[data-ef],[data-wa],[data-wr],[data-nn],[data-nd],[data-pj],[data-ep],[data-ac],[data-ec],[data-mv],[data-rp],[data-bk],a[data-v],button[data-v]');if(!c)return;
 const D=c.dataset,at=[...c.attributes].find(a=>a.name.startsWith('data-')&&a.name!=='data-i');
 if(D.v){e.preventDefault();go(D.v,c.title);try{history.replaceState(null,'','#'+D.v)}catch(x){}return}
 if(D.new)return D.new==='p'?openPrj('p'):D.new==='n'?newNote():D.new==='f'?openFin():'sw'.includes(D.new)?openSimple(D.new):D.new==='g'?openGoal():openForm(D.new);
 if(D.et)return openForm('t',D.et);
 if(D.eh)return openForm('h',D.eh);
 if(D.cm!==undefined){cm=D.cm==='0'?new Date():new Date(cm.getFullYear(),cm.getMonth()+ +D.cm,1);cm.setDate(1);if(D.cm==='0')cs=TODAY()}
 if(D.cd)cs=D.cd;
 if(D.ct){openForm('t');$('#due').value=cs;return}
 if(D.eg)return openGoal(D.eg);
 if(D.mk){const[id,i]=D.mk.split('|'),g=DB.goals.find(x=>x.id===id),m=g.ms[+i];m.done=!m.done;persist();if(m.done&&gp(g)===100)toast('Meta concluída')}
 if(D.pm&&!TM.run){TM.total=+D.pm*60;TM.left=TM.total}
 if(D.tg){if(TM.run){TM.left=tmLeft();TM.run=false}else{if(TM.left<=0)TM.left=TM.total;TM.end=Date.now()+TM.left*1000;TM.run=true}}
 if(D.te)return tmFinish(false);
 if(D.tr){TM.run=false;TM.left=TM.total}
 if(D.es)return openSimple('s',D.es);
 if(D.ew)return openSimple('w',D.ew);
 if(D.ws)startW(D.ws);
 if(D.sa){const e=DB.active.ex[+D.sa],l=e.sets[e.sets.length-1]||{};e.sets.push({kg:l.kg||'',reps:l.reps||'',done:false});persist()}
 if(D.sd){const[ei,si]=D.sd.split('|'),s=DB.active.ex[+ei].sets[+si];s.done=!s.done;persist()}
 if(D.wf)return finishW();
 if(D.wd){if(DB.active.cf){DB.active=null}else DB.active.cf=1;persist()}
 if(D.rp)rp=D.rp;
 if(D.bk){bk(D.bk);return}
 if(D.pj)nPrj=D.pj;
 if(D.ep)return openPrj('p',nPrj);
 if(D.ac!==undefined)return openPrj('c',null,+D.ac);
 if(D.ec)return openPrj('c',D.ec);
 if(D.mv){const[id,d]=D.mv.split('|'),c=curP().cards.find(x=>x.id===id);c.col=Math.max(0,Math.min(2,c.col+ +d));persist()}
 if(D.wa){const ml=D.wa==='c'?+$('#wc').value:+D.wa;if(!(ml>0&&ml<=5000)){toast('Informe de 1 a 5000 ml');return}DB.wlog.push({id:uid(),date:TODAY(),ml,t:Date.now()});$('#wc').value='';persist();toast('+'+ml+' ml')}
 if(D.wr){DB.wlog=DB.wlog.filter(x=>x.id!==D.wr);persist()}
 if(D.nn){nSel=D.nn;ndc=false}
 if(D.nd){if(ndc){DB.notes=DB.notes.filter(x=>x.id!==nSel);nSel='';ndc=false;persist();toast('Nota excluída')}else ndc=true}
 if(D.ff)ff=D.ff;
 if(D.fm!==undefined){fm=D.fm==='0'?new Date():new Date(fm.getFullYear(),fm.getMonth()+ +D.fm,1);fm.setDate(1)}
 if(D.fh){DB.hide=!DB.hide;persist()}
 if(D.ef)return openFin(D.ef);
 if(D.f)filt=D.f;
 if(D.tk){const t=DB.tasks.find(x=>x.id===D.tk);t.done=!t.done;persist();if(t.done)toast('Tarefa concluída')}
 if(D.hk){const h=DB.habits.find(x=>x.id===D.hk),k=TODAY();h.log[k]?delete h.log[k]:h.log[k]=1;persist();if(h.log[k])toast('Hábito registrado')}
 if(D.hd){const[id,k]=D.hd.split('|'),h=DB.habits.find(x=>x.id===id);h.log[k]?delete h.log[k]:h.log[k]=1;persist()}
 render();
 const n=at&&$(V[cur]?V[cur][0]:'#vsoon').querySelector(`[${at.name}="${at.value}"]`);if(n)n.focus();
});
const _sv=$('#save').onclick;$('#save').onclick=()=>!F?_sv():F.type==='g'?saveGoal():F.type==='f'?saveFin():'pc'.includes(F.type)?savePrj():'sw'.includes(F.type)?saveSimple():_sv();
$('#tmSub').onchange=e=>{TM.sid=e.target.value};
document.addEventListener('input',e=>{const k=e.target.dataset.sk;if(!k||!DB.active)return;const[ei,si,f]=k.split('|');DB.active.ex[+ei].sets[+si][f]=e.target.value;persist()});
setInterval(tmUpdate,1000);
document.addEventListener('dragstart',e=>{const c=e.target.closest&&e.target.closest('[data-cid]');if(c)e.dataTransfer.setData('text/plain',c.dataset.cid)});
document.addEventListener('dragover',e=>{const c=e.target.closest&&e.target.closest('[data-col]');if(c){e.preventDefault();c.classList.add('over')}});
document.addEventListener('dragleave',e=>{const c=e.target.closest&&e.target.closest('[data-col]');if(c&&!c.contains(e.relatedTarget))c.classList.remove('over')});
document.addEventListener('drop',e=>{const c=e.target.closest&&e.target.closest('[data-col]');if(!c)return;e.preventDefault();const k=curP().cards.find(x=>x.id===e.dataTransfer.getData('text/plain'));if(k){k.col=+c.dataset.col;persist()}render()});
const h0=location.hash.slice(1);go(V[h0]?h0:'inicio');
})();
