fetch('evenements.json')
  .then(response => response.json())
  .then(data => {
    const compteurDiv = document.getElementById("compteur");

    // Filtrer événements actifs
    const actifs = data.filter(ev => ev.active);
    
    if (actifs.length === 0) {
      compteurDiv.innerHTML = "<p>Aucun événement actif</p>";
      return;
    }

    // Choisir un événement aléatoire
    const evenement = actifs[Math.floor(Math.random() * actifs.length)];

    // Couleurs aléatoires pour le fun
    const couleurs = ["#FF5722", "#4CAF50", "#2196F3", "#9C27B0"];
    const couleurTitre = couleurs[Math.floor(Math.random() * couleurs.length)];

    compteurDiv.innerHTML = `
      <h2 style="color:${couleurTitre}">${evenement.name}</h2>
      <p>Prochain événement le ${new Date(evenement.date).toLocaleString()}</p>
      <img src="${evenement.image}" alt="${evenement.name}">
    `;
  });
