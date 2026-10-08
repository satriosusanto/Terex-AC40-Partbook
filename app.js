const S={cats:[],parts:[],hot:{},imgs:{},meta:{},current:null,zoom:1,filteredCats:[]};
const $=id=>document.getElementById(id);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const norm=s=>String(s??'').toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'');
const debounce=(fn,ms)=>{let t;return(...a)=>{clearTimeout(t);t=setTimeout(()=>fn(...a),ms)}};
async function getJSON(path){const r=await fetch(path,{cache:'no-cache'});if(!r.ok)throw Error(`${path} ${r.status}`);return r.json()}
function setStatus(msg,kind=''){ $('status').textContent=msg; $('status').className='status '+kind; }
async function load(){
 try{
  setStatus('Loading PartBook…');
  [S.cats,S.parts,S.hot,S.imgs,S.meta]=await Promise.all([
   getJSON('data/catalogs.json'),getJSON('data/parts.json'),getJSON('data/hotspots.json'),getJSON('data/images.json'),getJSON('data/image-meta.json')
  ]);
  $('catCount').textContent=S.cats.length; $('partTotal').textContent=S.parts.length.toLocaleString();
  S.filteredCats=S.cats; renderCats();
  const hash=decodeURIComponent(location.hash.slice(1)); if(hash) openCat(hash,false);
  setStatus('Ready','ok');
 }catch(e){console.error(e);setStatus('Failed to load data','error');$('viewer').innerHTML='<div class="empty"><div class="emptyIcon">⚠</div><b>PartBook data could not be loaded</b><span>Upload the complete repository, including the <code>data</code> and <code>images</code> folders.</span></div>';}
}
function renderCats(){
 const a=S.filteredCats; $('catalogs').innerHTML=a.map(c=>`<button class="cat ${S.current?.id===c.id?'active':''}" data-id="${esc(c.id)}"><b>${esc(c.id)}</b><small>${esc(c.title.replace(c.id,'').replace(/^\s+/,''))}</small></button>`).join('');
 document.querySelectorAll('.cat').forEach(x=>x.onclick=()=>openCat(x.dataset.id));
}
function rowsFor(id){return S.parts.filter(p=>p.catalogId===id)}
function openCat(id,push=true){
 const c=S.cats.find(x=>x.id===id); if(!c)return;
 S.current=c; S.zoom=1;
 if(push)history.pushState({id},'',`#${encodeURIComponent(id)}`);
 renderCats();
 $('title').textContent=c.title; $('crumb').textContent=c.id;
 const rows=rowsFor(id); $('stats').textContent=`${rows.length.toLocaleString()} parts`;
 $('partCount').textContent=rows.length?rows.length.toLocaleString():''; $('resultCount').textContent='';
 $('parts').innerHTML=rows.length?rows.map((p,i)=>`<tr data-i="${i}"><td>${esc(p.pos)}</td><td class="pn">${esc(p.partNumber)}</td><td class="desc">${esc(p.description||'')}</td><td class="qty">${esc(p.qty)}</td></tr>`).join(''):'<tr><td colspan="4" class="noRows">No part rows are stored for this catalog node.</td></tr>';
 document.querySelectorAll('#parts tr[data-i]').forEach(r=>r.onclick=()=>showPart(rows[+r.dataset.i]));
 draw();
}
function draw(){
 const im=S.imgs[S.current.id];
 if(!im){$('viewer').innerHTML='<div class="empty"><b>No diagram</b><span>No diagram image is registered for this catalog.</span></div>';return}
 const web=im.replace(/\.(tif|tiff)$/i,'.jpg'); const meta=S.meta[im]||{width:3500,height:2500};
 $('imgName').textContent=`${im} · ${meta.width}×${meta.height}`;
 $('viewer').innerHTML=`<div class="canvas" id="canvas"><img id="diagram" src="images/${encodeURIComponent(web)}" alt="${esc(S.current.title)}"><div id="hots"></div></div>`;
 applyZoom(); const image=$('diagram');
 image.style.width='1600px'; image.style.height=`${Math.round(1600*meta.height/meta.width)}px`;
 image.onload=()=>{
  const hs=S.hot[im]||[]; const layer=$('hots'); layer.innerHTML=hs.map(h=>{
   const l=+h.left,t=+h.top,r=+h.right,b=+h.bottom;
   const label=h.type==='N'?`Pos ${h.text}`:h.text;
   return `<button class="hot ${h.type==='G'?'group':''}" style="left:${l/meta.width*100}%;top:${t/meta.height*100}%;width:${(r-l)/meta.width*100}%;height:${(b-t)/meta.height*100}%" data-type="${esc(h.type)}" data-text="${esc(h.text)}" title="${esc(label)}"><span>${esc(h.text)}</span></button>`;
  }).join('');
  layer.querySelectorAll('.hot').forEach(x=>x.onclick=()=>handleHotspot(x.dataset.type,x.dataset.text));
 };
}
function handleHotspot(type,text){
 if(type==='G'){const target=S.cats.find(c=>c.id===text);if(target){openCat(target.id);return}}
 const rows=rowsFor(S.current.id); const p=rows.find(x=>String(x.pos)===String(text));
 if(p){showPart(p);return}
 if(type==='G'){$('q').value=text;doSearch()}
}
function applyZoom(){const c=$('canvas');if(!c)return;c.style.transform=`scale(${S.zoom})`;c.style.transformOrigin='top left';$('zoomPct').textContent=Math.round(S.zoom*100)+'%';}
function setZoom(v){S.zoom=Math.max(.25,Math.min(3,v));applyZoom()}
function showPart(p){
 $('mPart').textContent=p.partNumber||'—';$('mDesc').textContent=p.description||'No description';$('mPos').textContent=p.pos||'—';$('mQty').textContent=p.qty||'—';$('mCat').textContent=p.catalogId||'—';$('copyPart').dataset.value=p.partNumber||'';$('modal').hidden=false;
}
function doSearch(){
 const q=norm($('q').value.trim()); if(!q){$('results').innerHTML='<div class="searchHint">Enter a part number, description, position, or catalog code.</div>';$('resultCount').textContent='';return}
 const out=S.parts.filter(p=>norm(`${p.partNumber} ${p.description} ${p.catalogId} ${p.pos}`).includes(q));
 $('resultCount').textContent=out.length.toLocaleString();
 $('results').innerHTML=out.length?out.slice(0,1000).map((p,i)=>`<button class="result" data-i="${i}"><b>${esc(p.partNumber)} <span>• Pos ${esc(p.pos)}</span></b><div>${esc(p.description||'')}</div><small>${esc(p.catalogId)} · Qty ${esc(p.qty)}</small></button>`).join(''):'<div class="noResult">No results found.</div>';
 document.querySelector('[data-tab="search"]').click(); document.querySelectorAll('.result[data-i]').forEach(x=>x.onclick=()=>{const p=out[+x.dataset.i];openCat(p.catalogId);setTimeout(()=>showPart(p),0)});
}
function filterCats(v){const q=norm(v);S.filteredCats=S.cats.filter(c=>norm(`${c.id} ${c.title}`).includes(q));renderCats()}
function reset(){S.current=null;history.pushState({},'',location.pathname+location.search);$('q').value='';$('catFilter').value='';S.filteredCats=S.cats;renderCats();$('title').textContent='Select a catalog';$('crumb').textContent='All Catalogs';$('stats').textContent='';$('parts').innerHTML='';$('partCount').textContent='';$('imgName').textContent='';$('viewer').innerHTML='<div class="empty"><div class="emptyIcon">▧</div><b>Select a catalog</b><span>Choose a catalog from the left panel to view its exploded diagram.</span></div>'}

document.querySelectorAll('.tabs button').forEach(b=>b.onclick=()=>{document.querySelectorAll('.tabs button').forEach(x=>x.classList.remove('active'));b.classList.add('active');$('partsPanel').hidden=b.dataset.tab!=='parts';$('searchPanel').hidden=b.dataset.tab!=='search'});
$('searchBtn').onclick=doSearch;$('q').onkeydown=e=>{if(e.key==='Enter')doSearch()};$('q').addEventListener('input',debounce(doSearch,220));$('clearSearch').onclick=()=>{$('q').value='';$('results').innerHTML='<div class="searchHint">Enter a part number, description, position, or catalog code.</div>';$('resultCount').textContent='';document.querySelector('[data-tab="parts"]').click()};$('catFilter').addEventListener('input',debounce(e=>filterCats(e.target.value),150));$('resetBtn').onclick=reset;$('back').onclick=()=>{const id=decodeURIComponent(location.hash.slice(1));if(id)history.back();else reset()};
$('zoomIn').onclick=()=>setZoom(S.zoom+.25);$('zoomOut').onclick=()=>setZoom(S.zoom-.25);$('zoomFit').onclick=()=>setZoom(1);
$('themeBtn').onclick=()=>{document.body.classList.toggle('dark');localStorage.setItem('pb-dark',document.body.classList.contains('dark')?'1':'0')};if(localStorage.getItem('pb-dark')==='1')document.body.classList.add('dark');
$('close').onclick=()=>$('modal').hidden=true;$('modal').onclick=e=>{if(e.target.id==='modal')$('modal').hidden=true};$('aboutBtn').onclick=()=>$('about').hidden=false;$('aboutClose').onclick=()=>$('about').hidden=true;$('about').onclick=e=>{if(e.target.id==='about')$('about').hidden=true};
$('copyPart').onclick=async()=>{const v=$('copyPart').dataset.value;if(v){try{await navigator.clipboard.writeText(v);$('copyPart').textContent='Copied ✓';setTimeout(()=>$('copyPart').textContent='Copy Part Number',1200)}catch{$('copyPart').textContent=v}}};
window.onpopstate=()=>{const id=decodeURIComponent(location.hash.slice(1));id?openCat(id,false):reset()};
load();
