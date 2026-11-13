(()=>{'use strict';
const overlay=document.querySelector('#ageOverlay'),accept=document.querySelector('#ageAccept'),exit=document.querySelector('#ageExit');
function background(open){for(const child of document.body.children)if(child!==overlay&&child.tagName!=='SCRIPT')child.inert=open;document.body.style.overflow=open?'hidden':''}
accept.addEventListener('click',()=>{overlay.classList.remove('open');background(false);try{sessionStorage.setItem('et_age_ok','yes')}catch{}document.querySelector('.logo').focus()});
overlay.addEventListener('keydown',e=>{if(e.key!=='Tab')return;if(e.shiftKey&&document.activeElement===accept){e.preventDefault();exit.focus()}else if(!e.shiftKey&&document.activeElement===exit){e.preventDefault();accept.focus()}});
let admitted=false;try{admitted=sessionStorage.getItem('et_age_ok')==='yes'}catch{}
if(!admitted){overlay.classList.add('open');background(true);accept.focus()}
})();

(()=>{'use strict';
function pageHasVipProfile(){
  const labels=[...document.querySelectorAll('.profile-facts dt')];
  const typeLabel=labels.find(dt=>dt.textContent.trim().toLowerCase()==='profil türü');
  const typeValue=(typeLabel?.nextElementSibling?.textContent||'').trim().toUpperCase();
  if(typeValue.includes('VIP')) return true;
  const eyebrow=document.querySelector('.detail-main .eyebrow')?.textContent||'';
  return /VIP/i.test(eyebrow);
}
function addVipTitleBadge(){
  const title=document.querySelector('.detail-main h1');
  if(!title || title.classList.contains('vip-title-badge') || !pageHasVipProfile()) return;
  title.classList.add('vip-title-badge');
}
if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',addVipTitleBadge,{once:true});
else addVipTitleBadge();
})();
