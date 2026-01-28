/*
  ui.js
  DOM helpers & rendering logic
*/
export function createPoster(card, {title, image, year}){
  const el = document.createElement('div');
  el.className = 'card';
  el.innerHTML = `
    <img loading="lazy" class="movie-poster" src="${image}" alt="${title} poster" />
    <div style="margin-top:0.6rem"><strong>${title}</strong><div class="text-muted small">${year||''}</div></div>
  `;
  return el;
}

export function clear(node){
  while(node.firstChild) node.removeChild(node.firstChild);
}

export function showToast(msg, timeout=3000){
  let t = document.createElement('div');
  t.className='card';
  t.style.position='fixed';
  t.style.right='16px';
  t.style.bottom='16px';
  t.style.zIndex='9999';
  t.style.padding='0.6rem 0.9rem';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), timeout);
}
