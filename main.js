/*
  main.js
  Entry point — handles simple interactions and lazy-loads components.
*/
import API from '/js/api.js';
import { createPoster, clear, showToast } from '/js/ui.js';

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.querySelector('.grid') || document.getElementById('movies');
  const search = document.querySelector('#q') || null;
  const btn = document.querySelector('#searchBtn') || null;

  async function loadInitial(){
    if(!container) return;
    try{
      const data = await API.fetchMovies('');
      renderMovies(data || []);
    }catch(e){
      console.warn('Initial load failed', e);
    }
  }

  function renderMovies(list){
    clear(container);
    if(!list || list.length===0){
      const p = document.createElement('p');
      p.className='text-muted';
      p.textContent = 'No movies found — try a different search.';
      container.appendChild(p);
      return;
    }
    list.forEach(m=>{
      const card = createPoster(container, {title:m.title, image:m.poster||'/assets/placeholder.png', year:m.year});
      container.appendChild(card);
    });
  }

  if(btn && search){
    btn.addEventListener('click', async (e)=>{
      const q = search.value.trim();
      try{
        const res = await API.fetchMovies(q);
        renderMovies(res||[]);
      }catch(err){
        showToast('Search failed — try again');
        console.error(err);
      }
    });
  }

  // Lazy load heavy stuff when user scrolls near bottom
  let lazyLoaded=false;
  window.addEventListener('scroll', ()=>{
    if(lazyLoaded) return;
    if((window.innerHeight + window.scrollY) >= (document.body.offsetHeight - 500)){
      lazyLoaded=true;
      import('/js/extras.js').catch(()=>{});
    }
  });

  loadInitial();
});
