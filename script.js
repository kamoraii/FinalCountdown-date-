let countdownInterval;
let mode = "manuel"; // "manuel" ou "api"
let targetDateManual = null;
let targetDateAPI = null;

// --- 1️⃣ Au chargement de la page : lire localStorage pour les deux modes ---
window.addEventListener('load', () => {
  const savedManual = localStorage.getItem('targetDateManual');
  if (savedManual) {
    const parsed = new Date(savedManual);
    if (!isNaN(parsed)) targetDateManual = parsed;
  }

  const savedAPI = localStorage.getItem('targetDateAPI');
  if (savedAPI) {
    const parsed = new Date(savedAPI);
    if (!isNaN(parsed)) targetDateAPI = parsed;
  }

  // Démarrer le compte actif si présent
  if (mode === "manuel" && targetDateManual) {
    startCountdown();
  } else if (mode === "api" && targetDateAPI) {
    startCountdown();
  }
});

// --- 2️⃣ Charger l'événement depuis JSON API ---
async function loadEventFromAPI() {
  try {
    const response = await fetch('evenements.json');
    const data = await response.json();
    const actifs = data.filter(ev => ev.active);
    if (actifs.length === 0) return;
    const evenement = actifs[0]; // prendre le premier actif

    document.getElementById("eventName").textContent = evenement.name;
    document.getElementById("eventImage").src = evenement.image;

    targetDateAPI = new Date(evenement.date);
    localStorage.setItem('targetDateAPI', targetDateAPI.toString());

    if (mode === "api") startCountdown();
  } catch (e) {
    console.error("Erreur API:", e);
  }
}

// --- 3️⃣ Mise à jour affichage compte à rebours ---
function updateDisplay() {
  const display = document.getElementById("timeRemaining");
  if (!getActiveTargetDate()) { display.textContent = "00:00:00"; return; }

  const now = new Date();
  let diff = getActiveTargetDate() - now;
  if (diff <= 0) {
    display.textContent = "00:00:00";
    clearInterval(countdownInterval);
    return;
  }
  const jours = Math.floor(diff / 1000 / 3600 / 24);
  const heures = Math.floor((diff / 1000 / 3600) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const secondes = Math.floor((diff / 1000) % 60);
  display.textContent = `${jours}j ${heures}h ${minutes}m ${secondes}s`;
}

// --- 4️⃣ Démarrer le compte à rebours ---
function startCountdown() {
  clearInterval(countdownInterval);
  updateDisplay();
  countdownInterval = setInterval(updateDisplay, 1000);
}

// --- 5️⃣ Reset ---
function resetCountdown() {
  clearInterval(countdownInterval);
  if (mode === "manuel") {
    targetDateManual = null;
    localStorage.removeItem('targetDateManual');
  } else {
    targetDateAPI = null;
    localStorage.removeItem('targetDateAPI');
    document.getElementById("eventName").textContent = "Événement";
    document.getElementById("eventImage").src = "";
  }
  document.getElementById("timeRemaining").textContent = "00:00:00";
  document.getElementById("targetTime").textContent = "CIBLE : --:--";
  hideTimePicker();
}

// --- 6️⃣ Pop-up heure ---
function showTimePicker() { document.getElementById("timePickerPopup").classList.add('show'); }
function hideTimePicker() { document.getElementById("timePickerPopup").classList.remove('show'); }

function confirmTime() {
  const timeValue = document.getElementById("timeInput").value;
  if (!timeValue) return;
  const [h, m] = timeValue.split(":").map(Number);
  const now = new Date();
  targetDateManual = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  if (targetDateManual < now) targetDateManual.setDate(targetDateManual.getDate() + 1);
  document.getElementById("targetTime").textContent = "CIBLE : " + timeValue;
  localStorage.setItem('targetDateManual', targetDateManual.toString());

  hideTimePicker();
  if (mode === "manuel") startCountdown();
}

// --- 7️⃣ Switch entre manuel et API ---
function switchMode() {
  clearInterval(countdownInterval);
  mode = mode === "manuel" ? "api" : "manuel";

  // Mettre à jour l’affichage cible
  const currentTarget = getActiveTargetDate();
  if (mode === "manuel") {
    document.getElementById("eventName").textContent = "Événement";
    document.getElementById("eventImage").src = "";
  } else if (mode === "api" && targetDateAPI) {
    document.getElementById("targetTime").textContent = "CIBLE : " + targetDateAPI.toLocaleString();
  }

  if (currentTarget) startCountdown();
}

// --- 8️⃣ Fonction utilitaire pour récupérer la date active ---
function getActiveTargetDate() {
  return mode === "manuel" ? targetDateManual : targetDateAPI;
}