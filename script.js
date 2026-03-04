let countdownInterval;
let mode = 'manual';
let targetDateManual = null;
let targetDateAPI = null;

const modeIndicator = document.getElementById("modeIndicator");

// Charger depuis localStorage
window.addEventListener('load', () => {
  const savedManual = localStorage.getItem('targetDateManual');
  if (savedManual) targetDateManual = new Date(savedManual);
  const savedAPI = localStorage.getItem('targetDateAPI');
  if (savedAPI) targetDateAPI = new Date(savedAPI);
  updateDisplay();
});

function updateDisplay() {
  const display = document.getElementById("timeRemaining");
  let now = new Date();
  let diff;
  if (mode === 'manual' && targetDateManual) diff = targetDateManual - now;
  else if (mode === 'api' && targetDateAPI) diff = targetDateAPI - now;
  else { display.textContent = "00:00:00"; return; }

  if (diff <= 0) { display.textContent = "00:00:00"; clearInterval(countdownInterval); return; }

  const hours = Math.floor(diff / 1000 / 3600);
  const minutes = Math.floor((diff / 1000 % 3600) / 60);
  const seconds = Math.floor(diff / 1000 % 60);
  display.textContent = `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}:${String(seconds).padStart(2,'0')}`;

  modeIndicator.textContent = mode === 'manual' ? "Mode : Manuel" : "Mode : API";
  modeIndicator.style.color = mode==='manual' ? '#22C55E' : '#FFD700';

  if(mode==='manual' && targetDateManual) document.getElementById("targetTime").textContent = "CIBLE : " + targetDateManual.toTimeString().slice(0,5);
  else if(mode==='api' && targetDateAPI) document.getElementById("targetTime").textContent = "CIBLE : " + targetDateAPI.toLocaleString();
}

// --- Pop-up manuel ---
function showTimePicker() { document.getElementById("timePickerPopup").classList.add('show'); }
function hideTimePicker() { document.getElementById("timePickerPopup").classList.remove('show'); }
function confirmTime() {
  const timeValue = document.getElementById("timeInput").value;
  if (!timeValue) return;
  const [h,m] = timeValue.split(":").map(Number);
  const now = new Date();
  targetDateManual = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  if (targetDateManual < now) targetDateManual.setDate(targetDateManual.getDate()+1);
  localStorage.setItem('targetDateManual', targetDateManual.toString());
  mode='manual'; updateDisplay(); hideTimePicker();
}

// --- Countdown manuel ---
function startCountdownManual() {
  if (!targetDateManual) { alert("Choisissez d'abord une heure !"); return; }
  mode='manual';
  clearInterval(countdownInterval);
  updateDisplay();
  countdownInterval = setInterval(updateDisplay,1000);
}

// --- Reset ---
function resetCountdown() {
  clearInterval(countdownInterval);
  targetDateManual=null;
  targetDateAPI=null;
  localStorage.removeItem('targetDateManual');
  localStorage.removeItem('targetDateAPI');
  document.getElementById("timeRemaining").textContent="00:00:00";
  document.getElementById("targetTime").textContent="CIBLE : --:--";
  document.getElementById("eventName").textContent="Événement";
  document.getElementById("eventImage").src="";
}

// --- Switch Mode ---
function switchMode() {
  mode = (mode==='manual') ? 'api' : 'manual';
  clearInterval(countdownInterval);
  updateDisplay();
  countdownInterval = setInterval(updateDisplay,1000);
}

// --- API live ---
async function loadEventFromAPI() {
  try {
    const url = 'https://opensky-network.org/api'
;
    const res = await fetch(url);
    const data = await res.json();
    const evenement = {
      name: data.name,
      date: data.date_utc,
      image: data.links.patch.small
    };

    document.getElementById("eventName").textContent = evenement.name;
    document.getElementById("eventImage").src = evenement.image;

    targetDateAPI = new Date(evenement.date);
    localStorage.setItem('targetDateAPI', targetDateAPI.toString());

    mode='api';
    clearInterval(countdownInterval);
    updateDisplay();
    countdownInterval = setInterval(updateDisplay,1000);
  } catch(e) {
    console.error("Erreur API:",e);
  }
}