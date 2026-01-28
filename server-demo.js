/*
  server-demo.js
  Simple demo Express server with /api/register, /api/login and /api/me
  WARNING: This is a minimal demo for local development only.
  Use bcrypt, HTTPS, rate-limiting, email verification, and secure session storage for production.
*/
const express = require('express');
const fs = require('fs');
const path = require('path');
const compression = require('compression');
const crypto = require('crypto');

const app = express();
app.use(express.json());
app.use(compression());
const DATA = path.join(__dirname, 'users.json');

function hashPass(p){
  return crypto.createHash('sha256').update(p).digest('hex');
}

function loadUsers(){
  try{
    const raw = fs.readFileSync(DATA,'utf8');
    return JSON.parse(raw);
  }catch(e){
    return {users:[]};
  }
}
function saveUsers(obj){
  fs.writeFileSync(DATA, JSON.stringify(obj,null,2),'utf8');
}

app.post('/api/register', (req,res)=>{
  const {name,email,password} = req.body||{};
  if(!email || !password) return res.status(400).json({message:'email and password required'});
  const all = loadUsers();
  if(all.users.find(u=>u.email===email)) return res.status(409).json({message:'email already registered'});
  const user = {id: Date.now().toString(36), name, email, passwordHash: hashPass(password), created: new Date().toISOString()};
  all.users.push(user);
  saveUsers(all);
  // demo token is simple
  const token = crypto.createHash('sha256').update(user.id+Date.now()).digest('hex');
  return res.json({token, user:{id:user.id, name:user.name, email:user.email}});
});

app.post('/api/login', (req,res)=>{
  const {email,password} = req.body||{};
  if(!email||!password) return res.status(400).json({message:'email and password required'});
  const all = loadUsers();
  const h = hashPass(password);
  const user = all.users.find(u=>u.email===email && u.passwordHash===h);
  if(!user) return res.status(401).json({message:'invalid credentials'});
  const token = crypto.createHash('sha256').update(user.id+Date.now()).digest('hex');
  return res.json({token, user:{id:user.id, name:user.name, email:user.email}});
});

app.get('/api/me', (req,res)=>{
  // demo returns a user if token passed via query ?token=...
  const token = req.query.token || '';
  // in demo we don't store tokens; return nothing
  res.json({ok:true});
});

app.use(express.static(path.join(__dirname,'public')));
app.listen(process.env.PORT||3000, ()=>console.log('demo server on 3000'));
