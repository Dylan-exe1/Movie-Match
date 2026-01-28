/*
  auth.js
  Client-side helper: register, login, logout, session storage (demo)
*/
export async function register({name,email,password}){
  const res = await fetch('/api/register', {
    method:'POST',
    headers:{'content-type':'application/json'},
    body: JSON.stringify({name, email, password})
  });
  if(!res.ok){
    const err = await res.json().catch(()=>({message:'Registration failed'}));
    throw new Error(err.message || 'Registration failed');
  }
  return res.json();
}

export async function login({email,password}){
  const res = await fetch('/api/login', {
    method:'POST',
    headers:{'content-type':'application/json'},
    body: JSON.stringify({email, password})
  });
  if(!res.ok){
    const err = await res.json().catch(()=>({message:'Login failed'}));
    throw new Error(err.message || 'Login failed');
  }
  const data = await res.json();
  // store simple session token (demo)
  localStorage.setItem('mm_session', JSON.stringify({token:data.token, user:data.user}));
  return data.user;
}

export function logout(){
  localStorage.removeItem('mm_session');
}

export function currentUser(){
  try{
    const s = localStorage.getItem('mm_session');
    if(!s) return null;
    const obj = JSON.parse(s);
    return obj.user || null;
  }catch(e){
    return null;
  }
}
