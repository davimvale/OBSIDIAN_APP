const P={
"dash":'<rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/>',
"sun":'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/>',
"task":'<path d="m9 11 3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
"repeat":'<path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/>',
"target":'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
"cal":'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
"book":'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
"act":'<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>',
"drop":'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
"wallet":'<path d="M19 7V4a1 1 0 0 0-1-1H5a2 2 0 0 0 0 4h15a1 1 0 0 1 1 1v4h-3a2 2 0 0 0 0 4h3a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1"/><path d="M3 5v14a2 2 0 0 0 2 2h15a1 1 0 0 0 1-1v-4"/>',
"folder":'<path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z"/>',
"note":'<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4M10 9H8M16 13H8M16 17H8"/>',
"chart":'<path d="M3 3v16a2 2 0 0 0 2 2h16"/><path d="M18 17V9M13 17V5M8 17v-3"/>',
"set":'<path d="M21 4h-7M10 4H3M21 12h-9M8 12H3M21 20h-5M12 20H3M14 2v4M8 10v4M16 18v4"/>',
"search":'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
"plus":'<path d="M5 12h14M12 5v14"/>',
"bell":'<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
"eye":'<path d="M2.06 12.35a1 1 0 0 1 0-.7 10.75 10.75 0 0 1 19.88 0 1 1 0 0 1 0 .7 10.75 10.75 0 0 1-19.88 0"/><circle cx="12" cy="12" r="3"/>',
"panel":'<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/>',
"check":'<path d="M20 6 9 17l-5-5"/>',
"clock":'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',
"menu":'<path d="M4 12h16M4 6h16M4 18h16"/>',
"x":'<path d="M18 6 6 18M6 6l12 12"/>',
"alert":'<circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/>',
"help":'<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01"/>'};
const ic=n=>`<svg class="i" viewBox="0 0 24 24" aria-hidden="true">${P[n]}</svg>`;
const $=s=>document.querySelector(s);
const hydrate=r=>r.querySelectorAll('[data-i]').forEach(e=>{e.insertAdjacentHTML('afterbegin',ic(e.dataset.i))});

const groups=[["Hoje",[["dash","Visão geral",1],["sun","Meu dia"],["task","Tarefas"],["repeat","Hábitos"],["target","Metas"],["cal","Calendário"]]],
["Corpo e mente",[["book","Estudos"],["act","Academia"],["drop","Hidratação"]]],
["Trabalho e vida",[["wallet","Finanças"],["folder","Projetos"],["note","Notas"],["chart","Relatórios"]]]];
$('#nav').innerHTML=groups.map(([t,l])=>`<div class="grp"><h2>${t}</h2>${l.map(([i,n,c])=>`<a href="#" ${c?'aria-current="page"':''} title="${n}">${ic(i)}<span>${n}</span></a>`).join('')}</div>`).join('');
$('#foot').innerHTML=`<a href="#" title="Configurações">${ic('set')}<span>Configurações</span></a><a href="#" title="Ajuda">${ic('help')}<span>Ajuda</span></a>`;
$('#bnav').innerHTML=`<a href="#" aria-current="page">${ic('dash')}Início</a><a href="#">${ic('task')}Tarefas</a><button class="fab" id="fab" aria-label="Criar">${ic('plus')}</button><a href="#">${ic('repeat')}Hábitos</a><button id="more">${ic('menu')}Mais</button>`;
$('#collapse').innerHTML=ic('panel');$('#menu').innerHTML=ic('menu');
hydrate(document);

const d=new Date();
$('#date').textContent=new Intl.DateTimeFormat('pt-BR',{weekday:'long',day:'numeric',month:'long'}).format(d).replace(/^./,c=>c.toUpperCase());
const h=d.getHours();$('#hello').textContent=(h<12?'Bom dia':h<18?'Boa tarde':'Boa noite')+', Davi';

const S={
 agenda:[["08:00","Treino: peito e tríceps","Academia","done"],["10:00","Bloco de foco: Cálculo II","Estudos","done"],["14:00","Revisão do projeto","Projetos","soon"],["16:30","Leitura: capítulo 4","Estudos","soon"],["19:00","Planejar a semana","Meu dia","late"]],
 tasks:[["Enviar lista de exercícios","Alta","Hoje",0],["Pagar fatura do cartão","Alta","Hoje",0],["Atualizar planilha de metas","Média","Amanhã",1],["Comprar creatina","Baixa","Sex",0]],
 habits:[["Beber 2,5 L de água","1,2 de 2,5 L",0,[1,1,0,1,1,1,0]],["Ler 20 minutos","Hoje",0,[1,0,1,1,0,1,1]],["Alongar","Hoje",1,[1,1,1,0,1,1,1]],["Dormir antes das 23h","Hoje",0,[0,1,1,0,1,0,1]]]
};
const tagFor={done:['ok','check','Concluído'],soon:['info','clock','Em breve'],late:['err','alert','Atrasado']};
function draw(){
 $('#agenda').innerHTML=S.agenda.map(([t,n,c,s])=>{const g=tagFor[s];return `<li class="row ${s==='done'?'done':''}"><span class="tm">${t}</span><div class="tt"><div>${n}</div><small>${c}</small></div><span class="tag ${g[0]}">${ic(g[1])}${g[2]}</span></li>`}).join('');
 $('#tasks').innerHTML=S.tasks.map(([n,p,v,k],i)=>`<li class="row ${k?'done':''}"><button class="chk" role="checkbox" aria-checked="${!!k}" aria-label="Concluir: ${n}" data-t="${i}">${ic('check')}</button><div class="tt"><div>${n}</div><small>${v}</small></div><span class="tag ${p==='Alta'?'warn':'neu'}">${p}</span></li>`).join('');
 $('#habits').innerHTML=S.habits.map(([n,s,k,w],i)=>`<div class="hab"><button class="chk" role="checkbox" aria-checked="${!!k}" aria-label="Marcar hábito: ${n}" data-h="${i}">${ic('check')}</button><div class="tt"><div>${n}</div><div class="st">${s}</div><div class="week" aria-label="Últimos 7 dias">${w.map(x=>`<i class="${x?'on':''}"></i>`).join('')}</div></div></div>`).join('');
 const tD=S.tasks.filter(x=>x[3]).length,hD=S.habits.filter(x=>x[2]).length,aD=S.agenda.filter(x=>x[3]==='done').length;
 const tot=S.tasks.length+S.habits.length+S.agenda.length,done=tD+hD+aD,p=Math.round(done/tot*100);
 $('#pct').textContent=p+'%';$('#fg').style.strokeDashoffset=326.7*(1-p/100);
 $('#ptxt').textContent=`${done} de ${tot} itens concluídos`;$('#ringA').setAttribute('aria-label',`Progresso do dia: ${p}%`);
 $('#kpis').innerHTML=[["task","Tarefas",`${tD}<small> / ${S.tasks.length}</small>`,"concluídas hoje"],["repeat","Hábitos",`${hD}<small> / ${S.habits.length}</small>`,"feitos hoje"],["target","Metas",`3<small> ativas</small>`,"1 com prazo na semana"],["clock","Tempo de foco","1h 30<small> min</small>","meta de 3h"],["cal","Próximo compromisso","14:00","Revisão do projeto"],["drop","Hidratação",`1,2<small> / 2,5 L</small>`,"faltam 1,3 L"]]
  .map(([i,l,v,x])=>`<div class="kpi"><div class="l">${ic(i)}${l}</div><div class="v">${v}</div><div class="x">${x}</div></div>`).join('');
}
draw();
document.addEventListener('click',e=>{
 const t=e.target.closest('[data-t]'),b=e.target.closest('[data-h]');
 if(t){const i=+t.dataset.t;S.tasks[i][3]^=1;draw();if(S.tasks[i][3])toast('Tarefa concluída')}
 if(b){const i=+b.dataset.h;S.habits[i][2]^=1;draw();if(S.habits[i][2])toast('Hábito registrado')}
});

$('#eye').onclick=e=>{const b=e.currentTarget,on=b.getAttribute('aria-pressed')!=='true';b.setAttribute('aria-pressed',on);b.setAttribute('aria-label',on?'Mostrar valores':'Ocultar valores');$('#fin').classList.toggle('hide',on)};
const app=$('#app');
$('#collapse').onclick=e=>{const on=app.classList.toggle('mini');e.currentTarget.setAttribute('aria-pressed',on);e.currentTarget.setAttribute('aria-label',on?'Expandir menu':'Recolher menu')};
const mq=matchMedia('(max-width:820px)');
function mob(){$('#menu').style.display=mq.matches?'grid':'none'}mq.onchange=mob;mob();
$('#menu').onclick=()=>{app.classList.add('open');$('#scrim').classList.add('on')};
$('#more').onclick=$('#menu').onclick;

let last;
function openP(){last=document.activeElement;$('#panel').classList.add('on');$('#scrim').classList.add('on');setTimeout(()=>$('#title').focus(),200)}
function closeP(){$('#panel').classList.remove('on');$('#fF').hidden=true;app.classList.remove('open');$('#scrim').classList.remove('on');last&&last.focus&&last.focus()}
['#new','#new2','#fab'].forEach(s=>$(s).onclick=openP);
['#x','#cancel','#scrim'].forEach(s=>$(s).onclick=closeP);
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeP()});
$('#save').onclick=()=>{const v=$('#title').value.trim();$('#fT').classList.toggle('bad',!v);if(!v)return;
 S.tasks.unshift([v,$('#prio').value,'Hoje',0]);$('#title').value='';closeP();draw();toast('Tarefa salva')};
let tm;function toast(m){$('#tmsg').textContent=m;const e=$('#toast');e.classList.add('on');clearTimeout(tm);tm=setTimeout(()=>e.classList.remove('on'),2200)}
