/*
  api.js
  Minimal API wrapper for Movie Match
  Exports: fetchMovies, fetchProfile, postMatch
*/
const API = {
  async fetchMovies(query){
    const url = `/api/movies?q=${encodeURIComponent(query||'')}`;
    const res = await fetch(url);
    if(!res.ok) throw new Error('Failed to fetch movies');
    return res.json();
  },
  async fetchProfile(){
    const res = await fetch('/api/me');
    if(!res.ok) return null;
    return res.json();
  },
  async postMatch(data){
    const res = await fetch('/api/match', {
      method:'POST',
      headers:{'content-type':'application/json'},
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

export default API;


// Auth helpers (client wrappers)
export async function whoami(){ const r = await fetch('/api/me'); if(!r.ok) return null; return r.json(); }
