let countdownInterval;
let targetDate = null;

// Charger l'événement depuis JSON API
async function loadEventFromAPI() {
  try {
    const response = await fetch('evenements.json');
    const data = await response.json();
    const actifs = data.filter(ev => ev.active);
    if (actifs.length === 0) return;
    const evenement = actifs[0]; // prendre le premier actif
    document.getElementById("eventName").textContent = evenement.name;
    document.getElementById("eventImage").src = evenement.image;
    targetDate = new Date(evenement.date);
    document.getElementById("targetTime").textContent =
      "CIBLE : " + targetDate.toLocaleString();
    startCountdown();
  } catch (e) {
    console.error("Erreur API:", e);
  }
}

// Mise à jour affichage compte à rebours
function updateDisplay() {
  const display = document.getElementById("timeRemaining");
  if (!targetDate) { display.textContent = "00:00:00"; return; }
  const now = new Date();
  let diff = targetDate - now;
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

// Démarrer le compte à rebours
function startCountdown() {
  if (!targetDate) { alert("Choisissez d'abord une heure ou chargez l'événement API !"); return; }
  clearInterval(countdownInterval);
  updateDisplay();
  countdownInterval = setInterval(updateDisplay, 1000);
}

// Reset
function resetCountdown() {
  clearInterval(countdownInterval);
  targetDate = null;
  document.getElementById("timeRemaining").textContent = "00:00:00";
  document.getElementById("targetTime").textContent = "CIBLE : --:--";
  document.getElementById("eventName").textContent = "Événement";
  document.getElementById("eventImage").src = "";
  hideTimePicker();
}

// Pop-up heure
function showTimePicker() { document.getElementById("timePickerPopup").classList.add('show'); }
function hideTimePicker() { document.getElementById("timePickerPopup").classList.remove('show'); }

function confirmTime() {
  const timeValue = document.getElementById("timeInput").value;
  if (!timeValue) return;
  const [h, m] = timeValue.split(":").map(Number);
  const now = new Date();
  targetDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  if (targetDate < now) targetDate.setDate(targetDate.getDate() + 1);
  document.getElementById("targetTime").textContent = "CIBLE : " + timeValue;
  hideTimePicker();
  startCountdown();
}