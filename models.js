document.querySelectorAll('.unit-card[data-model]').forEach(card=>{
 card.addEventListener('click',()=>{
  document.querySelectorAll('.unit-card[data-model]').forEach(item=>item.setAttribute('aria-pressed','false'));
  card.setAttribute('aria-pressed','true');
  document.querySelector('#selection-message').textContent=`${card.dataset.model} dipilih. Katalog untuk model ini belum tersedia.`;
 });
});
