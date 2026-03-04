fetch('evenements.json')
  .then(response => response.json())
  .then(data => {
    const compteurDiv = document.getElementById("compteur");
    const actifs = data.filter(ev => ev.active);
    
    if (actifs.length === 0) {
      compteurDiv.innerHTML = "<p>Aucun événement actif</p>";
      return;
    }

    const evenement = actifs[Math.floor(Math.random() * actifs.length)];

    // Créer un div pour le compte à rebours
    compteurDiv.innerHTML = `
      <h2>${evenement.name}</h2>
      <p id="timer"></p>
      <img src="${evenement.image}" alt="${evenement.name}">
    `;

    const targetDate = new Date(evenement.date).getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance < 0) {
        clearInterval(interval);
        document.getElementById("timer").innerText = "Événement en cours !";
        return;
      }

      const jours = Math.floor(distance / (1000 * 60 * 60 * 24));
      const heures = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secondes = Math.floor((distance % (1000 * 60)) / 1000);

      document.getElementById("timer").innerText =
        `${jours}j ${heures}h ${minutes}m ${secondes}s`;
    }, 1000);
  });