let countdownIntervalManual = null;
let countdownIntervalAPI = null;
let mode = "manuel"; // "manuel" ou "api"

// --- 1️⃣ Variables de dates ---
let targetDateManual = null;
let targetDateAPI = null;

// --- 2️⃣ Au chargement, récupérer les dates depuis localStorage ---
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

  // Démarrage automatique du mode manuel si date existante
  if (targetDateManual) startCountdownManual();
});

// --- 3️⃣ Fonction utilitaire pour mettre à jour affichage ---
function updateDisplay(targetDate) {
  const display = document.getElementById("timeRemaining");
  if (!targetDate) { display.textContent = "00:00:00"; return; }

  const now = new Date();
  let diff = targetDate - now;
  if (diff <= 0) {
    display.textContent = "00:00:00";
    return;
  }

  const jours = Math.floor(diff / 1000 / 3600 / 24);
  const heures = Math.floor((diff / 1000 / 3600) % 24);
  const minutes = Math.floor((diff / 1000 / 60) % 60);
  const secondes = Math.floor((diff / 1000) % 60);
  display.textContent = `${jours}j ${heures}h ${minutes}m ${secondes}s`;

  // Mettre à jour cible en haut
  if (mode === "manuel") {
    document.getElementById("targetTime").textContent =
      "CIBLE : " + targetDateManual.toLocaleString();
  } else {
    document.getElementById("targetTime").textContent =
      "CIBLE : " + targetDateAPI.toLocaleString();
  }
}

// --- 4️⃣ Compte à rebours manuel ---
function startCountdownManual() {
  clearInterval(countdownIntervalManual);
  mode = "manuel";
  countdownIntervalManual = setInterval(() => {
    updateDisplay(targetDateManual);
  }, 1000);
}

// --- 5️⃣ Compte à rebours API ---
function startCountdownAPI() {
  clearInterval(countdownIntervalAPI);
  mode = "api";
  countdownIntervalAPI = setInterval(() => {
    updateDisplay(targetDateAPI);
  }, 1000);
}

// --- 6️⃣ Reset ---
function resetCountdown() {
  if (mode === "manuel") {
    clearInterval(countdownIntervalManual);
    targetDateManual = null;
    localStorage.removeItem('targetDateManual');
  } else {
    clearInterval(countdownIntervalAPI);
    targetDateAPI = null;
    localStorage.removeItem('targetDateAPI');
    document.getElementById("eventName").textContent = "Événement";
    document.getElementById("eventImage").src = "";
  }
  document.getElementById("timeRemaining").textContent = "00:00:00";
  document.getElementById("targetTime").textContent = "CIBLE : --:--";
  hideTimePicker();
}

// --- 7️⃣ Pop-up heure ---
function showTimePicker() { document.getElementById("timePickerPopup").classList.add('show'); }
function hideTimePicker() { document.getElementById("timePickerPopup").classList.remove('show'); }

function confirmTime() {
  const timeValue = document.getElementById("timeInput").value;
  if (!timeValue) return;
  const [h, m] = timeValue.split(":").map(Number);
  const now = new Date();
  targetDateManual = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  if (targetDateManual < now) targetDateManual.setDate(targetDateManual.getDate() + 1);
  localStorage.setItem('targetDateManual', targetDateManual.toString());
  hideTimePicker();
  if (mode === "manuel") startCountdownManual();
}

// --- 8️⃣ Charger API ---
async function loadEventFromAPI() {
  try {
    const response = await fetch('evenements.json');
    const data = await response.json();
    const actifs = data.filter(ev => ev.active);
    if (actifs.length === 0) return;
    const evenement = actifs[0];

    document.getElementById("eventName").textContent = evenement.name;
    document.getElementById("eventImage").src = evenement.image;

    targetDateAPI = new Date(evenement.date);
    localStorage.setItem('targetDateAPI', targetDateAPI.toString());

    startCountdownAPI(); // bascule automatique sur API
  } catch (e) {
    console.error("Erreur API:", e);
  }
}

// --- 9️⃣ Switch manuel ↔ API ---
function switchMode() {
  if (mode === "manuel") {
    clearInterval(countdownIntervalManual);
    if (targetDateAPI) startCountdownAPI();
  } else {
    clearInterval(countdownIntervalAPI);
    if (targetDateManual) startCountdownManual();
  }
}

// --- 10️⃣ Récupérer date active pour affichage (optionnel) ---
function getActiveTargetDate() {
  return mode === "manuel" ? targetDateManual : targetDateAPI;
}