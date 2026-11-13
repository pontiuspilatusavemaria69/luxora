(()=>{'use strict';
const DATA=window.SITE_DATA||{provinces:[],listings:[]};
const CITY=document.body.dataset.city||'';
const ROOT=document.body.dataset.root||'';
const embeddedImages=window.EMBEDDED_IMAGES||{};
const imageVariants=path=>DATA.images?.[path]||[];
const imgUrl=path=>{const variants=imageVariants(path);return ROOT+(variants.length?variants[variants.length-1].src:String(path||''))};
const imageAttrs=(path,sizes='(max-width: 760px) 50vw, 400px')=>{const variants=imageVariants(path);return variants.length?`srcset="${variants.map(v=>ROOT+v.src+' '+v.width+'w').join(', ')}" sizes="${sizes}" width="${variants.at(-1).width}" height="${variants.at(-1).height}"`:''};
document.querySelectorAll('img[data-bundled-src]').forEach(img=>{const path=img.getAttribute('data-bundled-src');if(embeddedImages[path])img.src=embeddedImages[path];});
const $=s=>document.querySelector(s);
const esc=v=>String(v??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const profileHref=a=>ROOT+'profil-'+a.slug+'.html';
const normPhone=p=>String(p||'').replace(/[\s()\-]/g,'');
const validPhone=p=>/^\+?[0-9]{7,15}$/.test(normPhone(p));
const svgPhone='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.8 2.5c-.7-.6-1.7-.7-2.4-.1l-2 1.8C1.7 4.8 1.3 5.8 1.5 7c1 6.7 8.8 14.4 15.7 15.5 1.1.2 2.2-.2 2.9-1l1.5-1.9c.6-.8.5-1.9-.2-2.5l-3.2-2.6c-.7-.6-1.6-.6-2.3-.1l-1.6 1.2c-2.6-1.2-4.8-3.3-6.1-5.9l1.1-1.6c.5-.7.5-1.6-.1-2.3z"/></svg>';
const svgWhatsapp='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.7 14.92L2 22l5.25-1.37A10 10 0 1 0 12 2Zm0 18a8.1 8.1 0 0 1-4.1-1.11l-.3-.18-3.08.8.83-3-.2-.32A8.08 8.08 0 1 1 12 20Zm4.45-5.95c-.25-.13-1.5-.73-1.73-.81-.23-.09-.4-.13-.58.13-.17.25-.66.8-.81.96-.15.17-.29.19-.54.07a6.62 6.62 0 0 1-1.97-1.21 7.5 7.5 0 0 1-1.37-1.7c-.14-.25-.02-.38.1-.51l.38-.44.26-.42a.46.46 0 0 0-.02-.44l-.78-1.9c-.21-.5-.42-.43-.58-.44h-.49a.95.95 0 0 0-.69.33 2.91 2.91 0 0 0-.91 2.16 5.1 5.1 0 0 0 1.07 2.7 11.66 11.66 0 0 0 4.5 3.97 5.6 5.6 0 0 0 2.49.58 2.12 2.12 0 0 0 1.42-1.02 1.78 1.78 0 0 0 .12-1.02c-.05-.1-.21-.17-.46-.29Z"/></svg>';
const whatsappNumber=a=>String(a.whatsapp||a.phone||'').replace(/\D/g,'');
const silhouette=`<svg viewBox="0 0 180 280" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><circle cx="90" cy="76" r="40" fill="currentColor" opacity=".70"/><path d="M38 186c0-35 23-65 52-65s52 30 52 65v33H38z" fill="currentColor" opacity=".50"/><path d="M24 266c1-42 23-69 66-69s65 27 66 69" stroke="currentColor" stroke-width="30" opacity=".36"/></svg>`;
const safePhotoPath=p=>/^(?:(?:assets\/photos|bilder(?:\/profil-[0-9]+)?)\/)?[a-zA-Z0-9_-]+\.(?:webp|jpe?g|png)$/i.test(String(p||''));
const verifiedBadge="<span class=\"verified-badge\" role=\"img\" aria-label=\"Doğrulanmış VIP\" title=\"Doğrulanmış VIP\"><svg viewBox=\"0 0 24 24\" aria-hidden=\"true\"><circle cx=\"12\" cy=\"12\" r=\"11\" fill=\"#259cf4\"/><path d=\"m7 12 3.2 3.2L17 8.5\" fill=\"none\" stroke=\"white\" stroke-width=\"2.6\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></span>";
function card(a){
 const isvip=a.vip===true;
 const colors=['linear-gradient(135deg,#49353a,#262028)','linear-gradient(140deg,#3b3441,#231d28)','linear-gradient(140deg,#524033,#272027)','linear-gradient(140deg,#363748,#1a1d29)','linear-gradient(140deg,#5d3e3e,#241d20)'];
 const baseStyle=`--photo-bg:${colors[(a.slot-1)%colors.length]}`;
 const slotNumber=String(a.slot).padStart(2,'0');
 const displayNumber=String(a.displayNumber||a.slot).padStart(2,'0');
 const fullimage=imgUrl(a.image||'');
 const phoneOk=validPhone(a.phone);
 const safeImg=safePhotoPath(a.image);
 const hasGallery=safeImg;
 return `<article id="profil-${a.slot}" class="profile ${isvip?'vip':''}" style="${baseStyle}">
 <div class="photo"><div class="placeholder">${silhouette}</div>${safeImg?`<img src="${esc(fullimage)}" ${imageAttrs(a.image)} alt="${esc(a.name)}" loading="${a.slot===1?'eager':'lazy'}" decoding="async" onerror="if(this.dataset.fallbackSrc){this.src=this.dataset.fallbackSrc;delete this.dataset.fallbackSrc}else{this.remove()}">`:''}${hasGallery?`<button class="gallery-tap" type="button" data-gallery-slot="${a.slot}" aria-label="${esc(a.name)} fotoğraflarını görüntüle" hidden></button><span class="gallery-count" hidden>▣ ${a.gallery?.length?a.gallery.length+' Fotoğraf':'Fotoğrafları Gör'}</span>`:''}${isvip?'<div class="vip-chip">✦ VIP</div>':''}<span class="hint">${isvip?'VIP · ':'İLAN · '}#${displayNumber}</span></div>
 <div class="profile-info"><h3 class="profile-name"><a href="${esc(profileHref(a))}">${esc(a.name)}</a>${isvip&&a.verified===true?verifiedBadge:''}</h3><div class="profile-meta">⌖ ${a.city?esc(a.city):'Konum bilgisi eklenecek'}${a.district?' · '+esc(a.district):''}</div><p class="profile-description">${esc(a.description)}</p>
 ${(phoneOk||validPhone(a.whatsapp))?`<div class="contact-actions${phoneOk?'':' single'}">${phoneOk?`<a class="call" href="tel:${esc(normPhone(a.phone))}" aria-label="${esc(a.name)} için telefonla ara">${svgPhone} Ara</a>`:''}${validPhone(a.whatsapp||a.phone)?`<a class="whatsapp" href="https://wa.me/${whatsappNumber(a)}" target="_blank" rel="noopener noreferrer" aria-label="${esc(a.name)} için WhatsApp üzerinden iletişime geç">${svgWhatsapp} WhatsApp</a>`:''}</div>`:`<div class="call disabled" aria-disabled="true">${svgPhone} İletişim bilgisi eklenecek</div>`}</div></article>`;
}
function freeSlotCard(a){
 const number=String(a.slot).padStart(2,'0');
 const kind=a.vip===true?'VIP':'Standart';
 return `<article class="rental-slot" id="alan-${a.slot}"><span class="rental-status">MÜSAİT</span><h3>${kind} Profil #${number}</h3><p>Kiralanabilir profil alanı.</p><span class="rental-type">${kind} profil · Türkiye</span></article>`;
}
// Display a gallery control only for listings whose cover.webp is available.
document.addEventListener('load',event=>{
 const img=event.target;
 if(!(img instanceof HTMLImageElement)||!img.closest('.photo'))return;
 const box=img.closest('.photo');
 box.querySelector('[data-gallery-slot]')?.removeAttribute('hidden');
 box.querySelector('.gallery-count')?.removeAttribute('hidden');
},true);
// One profile is displayed at a time; the carousel advances automatically.
const featuredVIPs=DATA.listings.filter(p=>p.active!==false&&p.vip===true&&safePhotoPath(p.image)).sort((a,b)=>a.slot-b.slot);
let featuredIndex=0;
const carousel=$('#luxoraCarousel');
const featuredPair=$('#rcPair');
const featuredDots=$('#rcDots');
const $hero=q=>carousel.querySelector(q);
const iconCall='<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6.8 2.5c-.7-.6-1.7-.7-2.4-.1l-2 1.8C1.7 4.8 1.3 5.8 1.5 7c1 6.7 8.8 14.4 15.7 15.5 1.1.2 2.2-.2 2.9-1l1.5-1.9c.6-.8.5-1.6-.1-2.3z"/></svg>';
function featuredCard(a){
 const buttons=[];
 if(validPhone(a.phone)) buttons.push('<a href="tel:'+esc(normPhone(a.phone))+'" aria-label="'+esc(a.name)+' telefonla ara">'+iconCall+' Ara</a>');
 if(validPhone(a.whatsapp||a.phone)) buttons.push('<a class="rc-wa" href="https://wa.me/'+whatsappNumber(a)+'" target="_blank" rel="noopener noreferrer" aria-label="'+esc(a.name)+' WhatsApp">'+svgWhatsapp+' WhatsApp</a>');
 return `<article class="rc-duo-panel" aria-label="VIP ${esc(a.name)}"><a class="rc-profile-open" href="${esc(profileHref(a))}" data-gallery-slot="${a.slot}" aria-label="${esc(a.name)} profilini aç"></a><img src="${esc(imgUrl(a.image))}" ${imageAttrs(a.image)} alt="${esc(a.name)} — VIP profil fotoğrafı" decoding="async"><span class="rc-duo-top">✦ VIP ${String(a.slot).padStart(2,'0')}</span><div class="rc-duo-info"><span class="rc-duo-city">⌖ ${esc(a.city||'Türkiye')}</span><h2 class="rc-duo-name">${esc(a.name)}${a.verified===true?verifiedBadge:''}</h2><p class="rc-duo-desc">${esc(a.description||'Fotoğraf galerisini inceleyin.')}</p><div class="rc-duo-actions">${buttons.join('')}</div></div></article>`;
}
function updateFeaturedIndicators(){
 $hero('#rcCount').textContent=(featuredIndex+1)+' / '+featuredVIPs.length;
 [...featuredDots.children].forEach((dot,i)=>dot.setAttribute('aria-current',String(i===featuredIndex)));
}
function renderFeatured(){
 if(!featuredVIPs.length){carousel.hidden=true;return;}
 const a=featuredVIPs[featuredIndex];
 featuredPair.innerHTML=featuredCard(a);
 if(!featuredDots.children.length) for(const [i,profile] of featuredVIPs.entries()){
   const btn=document.createElement('button');btn.type='button';btn.className='rc-dot';
   btn.setAttribute('aria-label',profile.name+' ilk sırada göster');
   btn.setAttribute('aria-current',String(i===featuredIndex));
   btn.addEventListener('click',()=>{setFeatured(i);restartFeaturedTimer()});
   featuredDots.appendChild(btn);
 }
 $hero('#rcPrevious').hidden=featuredVIPs.length<2;
 $hero('#rcNext').hidden=featuredVIPs.length<2;
 updateFeaturedIndicators();
}
let transitionHandle=null;
function setFeatured(index){
 if(!featuredVIPs.length)return;
 const next=(index+featuredVIPs.length)%featuredVIPs.length;
 if(next===featuredIndex)return;
 featuredIndex=next;
 if(transitionHandle)clearTimeout(transitionHandle);
 if(reducedMotion.matches){renderFeatured();return;}
 featuredPair.classList.add('rc-fading');
 transitionHandle=setTimeout(()=>{renderFeatured();featuredPair.classList.remove('rc-fading');transitionHandle=null},190);
}

$hero('#rcPrevious').addEventListener('click',()=>{setFeatured(featuredIndex-1);restartFeaturedTimer()});
$hero('#rcNext').addEventListener('click',()=>{setFeatured(featuredIndex+1);restartFeaturedTimer()});
carousel.addEventListener('keydown',e=>{if(!galleryOverlayHiddenForCarousel())return;if(e.key==='ArrowRight'){e.preventDefault();setFeatured(featuredIndex+1);restartFeaturedTimer()}if(e.key==='ArrowLeft'){e.preventDefault();setFeatured(featuredIndex-1);restartFeaturedTimer()}});
function galleryOverlayHiddenForCarousel(){return $('#profileGallery').hidden}
let slideStartX=null;
let suppressCarouselClickUntil=0;
carousel.addEventListener('touchstart',e=>{slideStartX=e.changedTouches[0]?.clientX??null},{passive:true});
carousel.addEventListener('touchend',e=>{if(slideStartX===null)return;const delta=(e.changedTouches[0]?.clientX??slideStartX)-slideStartX;slideStartX=null;if(Math.abs(delta)>45){suppressCarouselClickUntil=Date.now()+500;setFeatured(featuredIndex+(delta<0?1:-1));restartFeaturedTimer()}},{passive:true});
let featuredTimer=null;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function restartFeaturedTimer(){if(featuredTimer)clearInterval(featuredTimer);if(featuredVIPs.length>1&&!reducedMotion.matches)featuredTimer=setInterval(()=>{if($('#ageOverlay').classList.contains('open')||document.hidden||carousel.matches(':hover')||carousel.contains(document.activeElement)||!$('#profileGallery').hidden)return;setFeatured(featuredIndex+1)},6500)}
document.addEventListener('visibilitychange',()=>{if(!document.hidden)restartFeaturedTimer()});
reducedMotion.addEventListener?.('change',restartFeaturedTimer);
$('#heroActiveVipCount').textContent=featuredVIPs.length;
renderFeatured();restartFeaturedTimer();
const heroCity=$('#heroCity'),cityFilter=$('#cityFilter'),vip=$('#vipGrid'),standard=$('#standardGrid');
DATA.provinces.forEach(p=>{for(const select of [heroCity,cityFilter]){let o=document.createElement('option');o.value=p.slug;o.textContent=p.name;select.append(o)}});
const qsCity=new URLSearchParams(location.search).get('il')||new URLSearchParams(location.hash.slice(1)).get('il')||''; const activeCity=DATA.provinces.find(x=>x.name===CITY||x.slug===qsCity);
if(activeCity){heroCity.value=activeCity.slug;cityFilter.value=activeCity.slug}
function update(){
 const slug=cityFilter.value;
 const selected=DATA.provinces.find(x=>x.slug===slug);
 const listings=DATA.listings;
 const slots=listings.filter(x=>x.active!==false&&(!selected||x.city===selected.name));
 const profileOrder=(a,b)=>Number(a.active===false)-Number(b.active===false)||(b.displayPriority||0)-(a.displayPriority||0)||a.slot-b.slot;
 const v=slots.filter(x=>x.vip===true).sort(profileOrder);
 const s=slots.filter(x=>x.vip!==true).sort(profileOrder);
 vip.innerHTML=v.length?v.map(card).join(''):'<div class="empty">Bu şehirde aktif VIP profil bulunmuyor.</div>';
 standard.innerHTML=s.length?s.map(card).join(''):'<div class="empty">Bu şehirde aktif standart profil bulunmuyor.</div>';
 const occupied=listings.filter(x=>x.active!==false).length;
 const free=listings.length-occupied;
 const vipVacant=listings.filter(x=>x.vip===true&&x.active===false).length;
 const standardVacant=listings.filter(x=>x.vip!==true&&x.active===false).length;
 $('#freeSlotGrid').innerHTML=listings.filter(x=>x.active===false).map(freeSlotCard).join('')||'<p>Şu anda boş ilan alanı bulunmuyor.</p>';
 $('#slotTotal').textContent=listings.length;
 $('#slotFree').textContent=free;
 const heroFree=$('#heroFreeCount'); if(heroFree)heroFree.textContent=free;
 $('#slotOccupied').textContent=occupied;
 $('#vipFree').textContent=vipVacant;
 $('#standardFree').textContent=standardVacant;
 $('#vipCount').textContent=v.length+' aktif profil';
 $('#standardCount').textContent=s.length+' aktif profil';
 $('#overallCount').textContent=(v.length+s.length)+' aktif profil';
}
update();
window.addEventListener('popstate',()=>{const slug=new URLSearchParams(location.search).get('il')||new URLSearchParams(location.hash.slice(1)).get('il')||'';const valid=DATA.provinces.some(p=>p.slug===slug)?slug:'';cityFilter.value=valid;heroCity.value=valid;update()});
function goCity(slug){if(DATA.listings.some(a=>a.active!==false&&a.citySlug===slug)){location.href=ROOT+'sehir-'+slug+'.html';return;}if(document.body.dataset.single==='1'){const found=DATA.provinces.find(p=>p.slug===slug);cityFilter.value=slug;heroCity.value=slug;update();try{history.pushState(null,'',slug?'#il='+slug:location.pathname)}catch(e){};document.querySelector('#vip').scrollIntoView({behavior:'smooth'});return;}location.href=ROOT+(slug?'sehir-'+slug+'.html':'index.html')}
$('#heroForm').addEventListener('submit',e=>{e.preventDefault();goCity(heroCity.value)});
cityFilter.addEventListener('change',()=>goCity(cityFilter.value));
$('#resetButton').addEventListener('click',()=>goCity(''));
const cityLinks=$('#cityLinks');
// City links are generated as real, crawlable HTML links during build.a.textContent=p.name;cityLinks.append(a)});

// Client-only image gallery: no user accounts, server or storage required.
const galleryOverlay=$('#profileGallery'),galleryImage=$('#galleryImage'),galleryTitle=$('#galleryTitle');
const galleryCounter=$('#galleryCounter'),galleryThumbnails=$('#galleryThumbnails');
let galleryListing=null,galleryPhotos=[],galleryIndex=0,galleryTrigger=null;
function renderGallery(){
 if(!galleryListing||!galleryPhotos.length)return;
 const status=$('#galleryStatus');status.textContent='Fotoğraf yükleniyor…';
 galleryImage.onload=()=>{status.textContent='';};
 galleryImage.onerror=()=>{status.textContent='Fotoğraf yüklenemedi. Başka bir fotoğraf seçin.';};
 galleryImage.src=galleryPhotos[galleryIndex];
 galleryImage.alt=galleryListing.name+' — fotoğraf '+(galleryIndex+1)+' / '+galleryPhotos.length;
 galleryCounter.textContent=(galleryIndex+1)+' / '+galleryPhotos.length;
 for(const [i,button] of [...galleryThumbnails.children].entries()){
   button.setAttribute('aria-pressed',String(i===galleryIndex));
   if(i===galleryIndex)button.scrollIntoView({block:'nearest',inline:'nearest'});
 }
}
function showGallery(a,trigger){
 const paths=(a.gallery?.length?a.gallery:[a.image]).filter(safePhotoPath);
 if(!paths.length)return;
 galleryListing=a;galleryPhotos=paths.map(imgUrl);galleryIndex=0;galleryTrigger=trigger;
 $('#galleryPermalink').href=profileHref(a);
 galleryTitle.textContent=a.name+' · '+(a.city||'Türkiye');
 $('#galleryDescription').textContent=a.description||'';
 $('#galleryPrevious').hidden=paths.length<2;$('#galleryNext').hidden=paths.length<2;
 galleryThumbnails.replaceChildren();
 paths.forEach((path,i)=>{
  const btn=document.createElement('button');btn.className='gallery-thumbnail';btn.type='button';
  btn.setAttribute('aria-label','Fotoğraf '+(i+1)+' görüntüle');btn.setAttribute('aria-pressed',String(i===0));
  const image=document.createElement('img');image.src=ROOT+(imageVariants(path)[0]?.src||path);image.alt='';image.loading='lazy';image.width=65;image.height=72;
  btn.append(image);btn.addEventListener('click',()=>{galleryIndex=i;renderGallery()});galleryThumbnails.append(btn);
 });
 galleryOverlay.hidden=false;setModalBackground(galleryOverlay,true);renderGallery();$('#galleryClose').focus();
}
function closeGallery(){galleryOverlay.hidden=true;setModalBackground(galleryOverlay,false);galleryImage.removeAttribute('src');galleryListing=null;galleryPhotos=[];if(galleryTrigger&&document.contains(galleryTrigger))galleryTrigger.focus();galleryTrigger=null}
function shiftGallery(direction){if(!galleryPhotos.length)return;galleryIndex=(galleryIndex+direction+galleryPhotos.length)%galleryPhotos.length;renderGallery()}
document.addEventListener('click',e=>{
 const button=e.target.closest('[data-gallery-slot]');if(!button)return;
 if(e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
 if(button.tagName==='A')e.preventDefault();
 if(button.closest('#luxoraCarousel')&&Date.now()<suppressCarouselClickUntil){e.preventDefault();return;}
 const listing=DATA.listings.find(x=>x.slot===Number(button.dataset.gallerySlot));if(listing)showGallery(listing,button);
});
$('#galleryClose').addEventListener('click',closeGallery);
$('#galleryPrevious').addEventListener('click',()=>shiftGallery(-1));
$('#galleryNext').addEventListener('click',()=>shiftGallery(1));
galleryOverlay.addEventListener('click',e=>{if(e.target===galleryOverlay)closeGallery()});
document.addEventListener('keydown',e=>{
 if(galleryOverlay.hidden)return;
 if(e.key==='Escape'){e.preventDefault();closeGallery()}
 if(e.key==='ArrowLeft'){e.preventDefault();shiftGallery(-1)}
 if(e.key==='ArrowRight'){e.preventDefault();shiftGallery(1)}
 if(e.key==='Tab'){
   const focusables=[...galleryOverlay.querySelectorAll('button')].filter(el=>!el.hidden&&!el.disabled);const first=focusables[0],last=focusables[focusables.length-1];
   if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
   else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
 }
});
let startX=null;
$('#galleryStage').addEventListener('touchstart',e=>{startX=e.changedTouches[0]?.screenX??null},{passive:true});
$('#galleryStage').addEventListener('touchend',e=>{if(startX===null)return;const dx=(e.changedTouches[0]?.screenX??startX)-startX;startX=null;if(Math.abs(dx)>45)shiftGallery(dx<0?1:-1)},{passive:true});

function setModalBackground(modal,open){
 for(const child of document.body.children){if(child!==modal&&!['SCRIPT','STYLE'].includes(child.tagName))child.inert=open;}
 document.body.style.overflow=open?'hidden':'';
}
const overlay=$('#ageOverlay');
const ageAccept=$('#ageAccept'),ageExit=$('#ageExit');
ageAccept.addEventListener('click',()=>{
 overlay.classList.remove('open');setModalBackground(overlay,false);
 try{sessionStorage.setItem('et_age_ok','yes')}catch(e){}
 document.querySelector('.logo').focus();
});
ageExit.addEventListener('click',e=>{e.preventDefault();location.href='about:blank'});
overlay.addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;
 if(e.shiftKey&&document.activeElement===ageAccept){e.preventDefault();ageExit.focus()}
 else if(!e.shiftKey&&document.activeElement===ageExit){e.preventDefault();ageAccept.focus()}
});
let admitted=false;try{admitted=sessionStorage.getItem('et_age_ok')==='yes'}catch(e){}
if(!admitted){overlay.classList.add('open');setModalBackground(overlay,true);ageAccept.focus();}
})();
