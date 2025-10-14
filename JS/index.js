// 🌈 ===== All-in-One App Script =====

// --- Navigation ---
const views = {
  tasks: document.getElementById("view-tasks"),
  notes: document.getElementById("view-notes"),
  weather: document.getElementById("view-weather")
};

const buttons = {
  tasks: document.getElementById("btn-tasks"),
  notes: document.getElementById("btn-notes"),
  weather: document.getElementById("btn-weather")
};

function show(view) {
  Object.values(views).forEach(v => (v.style.display = "none"));
  views[view].style.display = "block";

  Object.values(buttons).forEach(b => b.classList.remove("active"));
  buttons[view].classList.add("active");

  document.getElementById("main-title").textContent =
    view.charAt(0).toUpperCase() + view.slice(1);
}

buttons.tasks.onclick = () => show("tasks");
buttons.notes.onclick = () => show("notes");
buttons.weather.onclick = () => {
  show("weather");
  getUserLocationWeather();
};

// --- Live Clock & Date ---
function updateClock() {
  const now = new Date();
  document.getElementById("clock").textContent = now.toLocaleTimeString();
  document.getElementById("date").textContent = now.toDateString();
}
setInterval(updateClock, 1000);
updateClock();

// --- TASKS ---
const taskInput = document.getElementById("task-input");
const addTask = document.getElementById("add-task");
const taskList = document.getElementById("tasks-list");
let tasks = JSON.parse(localStorage.getItem("aio_tasks_v2") || "[]");

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((t, i) => {
    const li = document.createElement("li");
    li.className = "task-item";
    if (t.done) li.classList.add("done");

    const check = document.createElement("input");
    check.type = "checkbox";
    check.checked = t.done;
    check.onchange = () => {
      t.done = !t.done;
      saveTasks();
    };

    const span = document.createElement("span");
    span.textContent = t.text;
    span.onclick = () => {
      const newText = prompt("Edit task:", t.text);
      if (newText !== null) {
        t.text = newText.trim();
        saveTasks();
      }
    };

    const del = document.createElement("button");
    del.textContent = "❌";
    del.onclick = () => {
      if (confirm("Delete this task?")) {
        tasks.splice(i, 1);
        saveTasks();
      }
    };

    li.append(check, span, del);
    taskList.appendChild(li);
  });
}

function saveTasks() {
  localStorage.setItem("aio_tasks_v2", JSON.stringify(tasks));
  renderTasks();
}

addTask.onclick = () => {
  const val = taskInput.value.trim();
  if (val) {
    tasks.push({ text: val, done: false });
    taskInput.value = "";
    saveTasks();
  }
};
renderTasks();

// --- NOTES ---
const noteTitle = document.getElementById("note-title");
const noteBody = document.getElementById("note-body");
const saveNote = document.getElementById("save-note");
const notesList = document.getElementById("notes-list");
let notes = JSON.parse(localStorage.getItem("aio_notes_v2") || "[]");

function renderNotes() {
  notesList.innerHTML = "";
  notes.forEach((n, i) => {
    const div = document.createElement("div");
    div.className = "note";
    div.innerHTML = `<h4>${n.title}</h4><p>${n.body}</p>`;

    div.onclick = () => {
      const action = confirm("Delete this note?");
      if (action) {
        notes.splice(i, 1);
        saveNotes();
      }
    };
    notesList.appendChild(div);
  });
}

function saveNotes() {
  localStorage.setItem("aio_notes_v2", JSON.stringify(notes));
  renderNotes();
}

saveNote.onclick = () => {
  const title = noteTitle.value.trim();
  const body = noteBody.value.trim();
  if (title || body) {
    notes.push({ title, body });
    noteTitle.value = "";
    noteBody.value = "";
    saveNotes();
  }
};
renderNotes();

// --- WEATHER ---
const city = document.getElementById("city");
const getWeather = document.getElementById("get-weather");
const weatherResult = document.getElementById("weather-result");

// 👇 Paste your OpenWeatherMap API key here
const OPENWEATHER_API_KEY = "1a6278c4512c42c667df1ad5ed303949";

async function fetchWeatherByCity(q) {
  if (!OPENWEATHER_API_KEY)
    return (weatherResult.textContent = "⚠️ Please add your API key first.");

  weatherResult.textContent = "Fetching weather...";
  try {
    const r = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${q}&appid=${OPENWEATHER_API_KEY}&units=metric`
    );
    const d = await r.json();
    if (d.cod !== 200) {
      weatherResult.textContent = "City not found.";
      return;
    }
    weatherResult.innerHTML = `
      <h3>${d.name}</h3>
      <p>${d.weather[0].description}</p>
      <p class="temp">${Math.round(d.main.temp)}°C</p>
      <p>Humidity: ${d.main.humidity}%</p>
      <p>Wind: ${d.wind.speed} m/s</p>`;
  } catch (e) {
    weatherResult.textContent = "Error fetching weather.";
  }
}

getWeather.onclick = () => {
  const q = city.value.trim();
  if (q) fetchWeatherByCity(q);
};

// --- Auto Detect Location ---
function getUserLocationWeather() {
  if (!navigator.geolocation) {
    weatherResult.textContent = "Geolocation not supported.";
    return;
  }
  navigator.geolocation.getCurrentPosition(
    async pos => {
      const { latitude, longitude } = pos.coords;
      if (!OPENWEATHER_API_KEY) {
        weatherResult.textContent = "⚠️ Please add your API key first.";
        return;
      }
      try {
        const r = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${OPENWEATHER_API_KEY}&units=metric`
        );
        const d = await r.json();
        weatherResult.innerHTML = `
          <h3>${d.name}</h3>
          <p>${d.weather[0].description}</p>
          <p class="temp">${Math.round(d.main.temp)}°C</p>
          <p>Humidity: ${d.main.humidity}%</p>
          <p>Wind: ${d.wind.speed} m/s</p>`;
      } catch (e) {
        weatherResult.textContent = "Error fetching weather.";
      }
    },
    () => {
      weatherResult.textContent = "Location access denied.";
    }
  );
}

// --- Init ---
show("tasks");
















//     /* =====================
//        Configuration
//        ===================== */
//     // Put your OpenWeatherMap API key here (string). Leave blank to see guidance message.
//     const OPENWEATHER_API_KEY = '';

//     /* =====================
//        Utilities
//        ===================== */
//     const qs = s => document.querySelector(s);
//     const qsa = s => Array.from(document.querySelectorAll(s));
//     function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,8)}
//     function fmtDate(d){return new Date(d).toLocaleString();}
//     function el(tag, props = {}, ...kids){const e=document.createElement(tag);Object.entries(props||{}).forEach(([k,v])=>{if(k==='class')e.className=v;else if(k==='html')e.innerHTML=v;else e.setAttribute(k,v)});kids.flat().forEach(k=>{if(typeof k==='string') e.appendChild(document.createTextNode(k)); else if(k) e.appendChild(k)});return e}

//     /* =====================
//        App State
//        ===================== */
//     const STORAGE = {TASKS:'aio_tasks_v2', NOTES:'aio_notes_v2'};
//     let tasks = []; let notes = [];

//     /* =====================
//        DOM refs & Navigation
//        ===================== */
//     const views = {tasks:qs('#view-tasks'), notes:qs('#view-notes'), weather:qs('#view-weather')};
//     const navButtons = {tasks:qs('#btn-tasks'), notes:qs('#btn-notes'), weather:qs('#btn-weather')};
//     function show(view){ Object.values(views).forEach(v=>v.classList.remove('active')); views[view].classList.add('active'); Object.values(navButtons).forEach(b=>b.classList.remove('active')); navButtons[view].classList.add('active'); document.getElementById('status').textContent = view.charAt(0).toUpperCase()+view.slice(1); if(view==='weather'){ autoDetectWeather(); } }
//     navButtons.tasks.addEventListener('click', ()=>show('tasks'));
//     navButtons.notes.addEventListener('click', ()=>show('notes'));
//     navButtons.weather.addEventListener('click', ()=>show('weather'));

//     // header clock & date
//     function bootClock(){ const clock=qs('#clock'); const dateEl=qs('#date'); function tick(){ const n=new Date(); clock.textContent = n.toLocaleTimeString([], {hour:'2-digit',minute:'2-digit'}); dateEl.textContent = n.toLocaleDateString(); } tick(); setInterval(tick,1000);} bootClock();

//     // refresh button
//     qs('#btn-refresh').addEventListener('click', ()=>{ loadAll(); flashStatus('Refreshed'); });
//     function flashStatus(t){ const s = qs('#status'); s.textContent = t; setTimeout(()=>s.textContent = document.querySelector('.nav button.active').textContent.trim(), 1200); }

//     /* =====================
//        TASKS
//        ===================== */
//     const taskInput = qs('#task-input'); const addTaskBtn = qs('#add-task'); const tasksList = qs('#tasks-list'); const filterEl = qs('#filter'); const statOpen = qs('#stat-open');

//     function loadTasks(){ try{ tasks = JSON.parse(localStorage.getItem(STORAGE.TASKS) || '[]'); }catch(e){ tasks = [] } renderTasks(); }
//     function saveTasks(){ localStorage.setItem(STORAGE.TASKS, JSON.stringify(tasks)); renderTasks(); }

//     function renderTasks(){ tasksList.innerHTML=''; const filter = filterEl.value; const toShow = tasks.filter(t=> filter==='all'?true:(filter==='open'? !t.done : t.done)); toShow.forEach(t=>{ const item = el('div',{class:'task-item'}); const chk = el('input',{type:'checkbox'}); chk.checked = !!t.done; chk.addEventListener('change', ()=>{ t.done = chk.checked; t.updatedAt = new Date().toISOString(); saveTasks(); }); const title = el('div',{class:'task-title', html: escapeHtml(t.title)}); const meta = el('div',{class:'task-meta', html: t.createdAt? fmtDate(t.createdAt):''}); const actions = el('div',{});
//       const edit = el('button',{class:'icon-btn', title:'Edit'},'✏️'); edit.addEventListener('click', ()=> editTask(t.id));
//       const del = el('button',{class:'icon-btn', title:'Delete'},'🗑️'); del.addEventListener('click', ()=>{ if(confirm('Delete this task?')){ tasks = tasks.filter(x=>x.id!==t.id); saveTasks(); } });
//       actions.appendChild(edit); actions.appendChild(del);
//       item.appendChild(chk); item.appendChild(title); item.appendChild(meta); item.appendChild(actions);
//       if(t.done) item.classList.add('done');
//       tasksList.appendChild(item);
//     }); statOpen.textContent = tasks.filter(t=>!t.done).length; }

//     function addTask(text){ if(!text) return; const t = {id:uid(), title:text, done:false, createdAt:new Date().toISOString()}; tasks.unshift(t); saveTasks(); }
//     addTaskBtn.addEventListener('click', ()=>{ addTask(taskInput.value.trim()); taskInput.value=''; taskInput.focus(); });
//     taskInput.addEventListener('keydown', e=>{ if(e.key==='Enter'){ addTask(taskInput.value.trim()); taskInput.value=''; } });
//     filterEl.addEventListener('change', renderTasks);

//     function editTask(id){ const t = tasks.find(x=>x.id===id); if(!t) return; const val = prompt('Edit task', t.title); if(val!==null){ t.title = val.trim(); t.updatedAt = new Date().toISOString(); saveTasks(); } }

//     /* =====================
//        NOTES
//        ===================== */
//     const notesGrid = qs('#notes-grid'); const newNoteBtn = qs('#new-note'); const noteSearch = qs('#note-search'); const statNotes = qs('#stat-notes');

//     function loadNotes(){ try{ notes = JSON.parse(localStorage.getItem(STORAGE.NOTES) || '[]'); }catch(e){ notes = [] } renderNotes(); }
//     function saveNotes(){ localStorage.setItem(STORAGE.NOTES, JSON.stringify(notes)); renderNotes(); }

//     function renderNotes(){ notesGrid.innerHTML=''; const q = (noteSearch.value||'').toLowerCase(); const filtered = notes.filter(n=> (n.title||'').toLowerCase().includes(q) || (n.body||'').toLowerCase().includes(q)); filtered.forEach(n=>{ const card = el('div',{class:'note'}); const h = el('h4',{}, n.title || 'Untitled'); const p = el('p',{}, n.body||''); const meta = el('div',{class:'small'}, n.updatedAt? fmtDate(n.updatedAt): (n.createdAt? fmtDate(n.createdAt):'')); const actions = el('div',{});
//       const open = el('button',{class:'btn'},'Open'); open.addEventListener('click', ()=> openNoteEditor(n.id));
//       const del = el('button',{class:'icon-btn'},'🗑️'); del.addEventListener('click', ()=>{ if(confirm('Delete note?')){ notes = notes.filter(x=>x.id!==n.id); saveNotes(); } });
//       actions.appendChild(open); actions.appendChild(del);
//       card.appendChild(h); card.appendChild(p); card.appendChild(meta); card.appendChild(actions);
//       notesGrid.appendChild(card);
//     }); statNotes.textContent = notes.length; }

//     newNoteBtn.addEventListener('click', ()=>{ const note = {id:uid(), title:'New note', body:'', createdAt:new Date().toISOString(), updatedAt:new Date().toISOString()}; notes.unshift(note); saveNotes(); openNoteEditor(note.id); });
//     noteSearch.addEventListener('input', renderNotes);

//     function openNoteEditor(id){ const note = notes.find(n=>n.id===id); if(!note) return; // inline modal
//       const overlay = el('div',{style:'position:fixed;inset:0;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999'});
//       const box = el('div',{style:'width:92%;max-width:900px;background:#071022;padding:16px;border-radius:12px'});
//       const t = el('input',{style:'width:100%;padding:12px;border-radius:8px;margin-bottom:8px', value:note.title});
//       const b = el('textarea',{style:'width:100%;height:360px;padding:12px;border-radius:8px'}, note.body);
//       const save = el('button',{class:'btn',style:'margin-top:8px'},'Save');
//       const cancel = el('button',{class:'icon-btn',style:'margin-left:8px'},'Cancel');
//       const del = el('button',{class:'icon-btn',style:'margin-left:8px'},'Delete');
//       save.addEventListener('click', ()=>{ note.title = t.value; note.body = b.value; note.updatedAt = new Date().toISOString(); saveNotes(); document.body.removeChild(overlay); });
//       cancel.addEventListener('click', ()=> document.body.removeChild(overlay));
//       del.addEventListener('click', ()=>{ if(confirm('Delete note?')){ notes = notes.filter(x=>x.id!==note.id); saveNotes(); document.body.removeChild(overlay); } });
//       box.appendChild(t); box.appendChild(b); box.appendChild(save); box.appendChild(cancel); box.appendChild(del); overlay.appendChild(box); document.body.appendChild(overlay);
//     }

//     /* =====================
//        WEATHER
//        ===================== */
//     const cityInput = qs('#city-input'); const btnGeo = qs('#btn-geo'); const btnGet = qs('#btn-get-weather'); const weatherSnapshot = qs('#weather-snapshot'); const weatherDetails = qs('#weather-details');

//     async function fetchWeatherByCoords(lat,lon){ if(!OPENWEATHER_API_KEY){ weatherSnapshot.innerHTML = 'API key missing — add OPENWEATHER_API_KEY in the script.'; return; }
//       try{ weatherSnapshot.innerHTML = 'Loading...'; const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${OPENWEATHER_API_KEY}`; const res = await fetch(url); if(!res.ok) throw new Error('Network error'); const data = await res.json(); renderWeather(data); }catch(e){ weatherSnapshot.innerHTML = 'Unable to fetch weather: '+e.message; }
//     }

//     async function fetchWeatherByCity(q){ if(!OPENWEATHER_API_KEY){ weatherSnapshot.innerHTML = 'API key missing — add OPENWEATHER_API_KEY in the script.'; return; }
//       try{ weatherSnapshot.innerHTML = 'Loading...'; const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(q)}&units=metric&appid=${OPENWEATHER_API_KEY}`; const res = await fetch(url); if(!res.ok){ const txt = await res.text(); throw new Error(res.status+' '+txt); } const data = await res.json(); renderWeather(data); }catch(e){ weatherSnapshot.innerHTML = 'Unable to fetch weather: '+e.message; }
//     }

//     function renderWeather(data){ if(!data || !data.main) { weatherSnapshot.innerHTML='No data'; return; }
//       const t = Math.round(data.main.temp); const desc = data.weather && data.weather[0] ? data.weather[0].description : ''; weatherSnapshot.innerHTML = `<div style="display:flex;gap:12px;align-items:center;justify-content:flex-end"><div class="temp">${t}°C</div><div style="text-align:right"><div style="font-weight:800">${escapeHtml(data.name)}</div><div class="small">${escapeHtml(desc)}</div><div class="small">Feels ${Math.round(data.main.feels_like)}°C • Hum ${data.main.humidity}%</div></div></div>`; weatherDetails.innerHTML = `<pre style="white-space:pre-wrap">${escapeHtml(JSON.stringify(data, null, 2))}</pre>`; }

//     btnGet.addEventListener('click', ()=>{ const q = cityInput.value.trim(); if(!q){ if(navigator.geolocation){ navigator.geolocation.getCurrentPosition(p=>fetchWeatherByCoords(p.coords.latitude, p.coords.longitude), ()=>alert('Unable to detect location — enter a city.')); } else alert('Enter a city'); return; } fetchWeatherByCity(q); });
//     btnGeo.addEventListener('click', ()=>{ if(!navigator.geolocation) return alert('Geolocation not supported'); navigator.geolocation.getCurrentPosition(pos=>{ fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude); }, err=>{ alert('Unable to get location: '+err.message) }) });

//     // Auto-detect when weather tab is opened (smart): if city input empty -> geolocate else use typed city
//     let autoDetectTimeout;
//     function autoDetectWeather(){ clearTimeout(autoDetectTimeout); autoDetectTimeout = setTimeout(()=>{
//       const q = cityInput.value.trim(); if(q) return; if(navigator.geolocation){ navigator.geolocation.getCurrentPosition(pos=>{ fetchWeatherByCoords(pos.coords.latitude, pos.coords.longitude); }, ()=>{ weatherSnapshot.innerHTML = 'Allow location or search a city.' }); } else { weatherSnapshot.innerHTML = 'Enter a city to get weather.' }
//     }, 300); }

//     /* =====================
//        Helpers & boot
//        ===================== */
//     function escapeHtml(s){ return String(s||'').replace(/[&<>\"]/g, c=> ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

//     function loadAll(){ loadTasks(); loadNotes(); }
//     loadAll();

//     // Auto show tasks initially
//     show('tasks');

//     // Save on unload
//     window.addEventListener('beforeunload', ()=>{ localStorage.setItem(STORAGE.TASKS, JSON.stringify(tasks)); localStorage.setItem(STORAGE.NOTES, JSON.stringify(notes)); });

//     // small UX: keyboard shortcuts
//     window.addEventListener('keydown', e=>{
//       if(e.key==='/' && document.activeElement.tagName !== 'INPUT' && document.activeElement.tagName !== 'TEXTAREA'){ e.preventDefault(); show('notes'); qs('#note-search').focus(); }
//       if(e.key==='1') show('tasks'); if(e.key==='2') show('notes'); if(e.key==='3') show('weather');
//     });




// // const key='1a6278c4512c42c667df1ad5ed303949';