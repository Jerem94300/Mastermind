const table = document.querySelector('.table');
const clickCircle = document.querySelectorAll(".touch__circle");
const colors = ["color__blue", "color__red", "color__yellow", "color__green"];
const colorRandomCode = document.querySelectorAll(".circle__random");
const btnRandom = document.querySelector(".btn__random");
const btnHidden = document.querySelector(".btn__hidden");
const randomCodeDiv = document.querySelector(".random__code");
const btnValider = document.querySelector(".btn__valider");
const btnReplay = document.querySelector(".btn__replay");
const messageEnd = document.querySelector(".message__end");
const messageTentative = document.querySelector(".block__tentatives");
const indication = document.querySelector('.block__indication');

let tentatives = 1; // Indique la tentative actuelle
messageTentative.textContent = "NOMBRE DE TENTATIVES : " + tentatives;

let circle__random = []; // Stocke la combinaison secrète
btnHidden.textContent = "COMBINAISON SECRETE";

//masque de certains blocks pour page d'accueil

messageTentative.style.display = "none";
btnHidden.style.display = "none";
indication.style.display = "none";
table.style.display = "none";
btnValider.style.display = "none";
btnReplay.style.display = "none";

// Gestion des couleurs au clic
const selectLetter = (td) => {
  td.addEventListener("click", function () {
    // On récupère data-color de l'HTML ou sinon c'est = à 0
    let colorDefault = parseInt(td.dataset.color) || 0;

    td.classList.remove(...colors); // Supprimer toutes les couleurs actuelles en décomposant les éléments du tableau grâce à (...)
    // Passer à la couleur suivante en boucle entre 0 et 3 grâce au modulo
    // Exemple avec modulo :
    // Si colorDefault + 1 = 4 et colors.length = 4 : 4 % 4 = 0 → Retourne au début du tableau
    // Si colorDefault + 1 = 5 et colors.length = 4 : 5 % 4 = 1 → Retourne au deuxième élément
    colorDefault = (colorDefault + 1) % colors.length; 
    td.classList.add(colors[colorDefault]); // Ajouter la nouvelle couleur

    td.dataset.color = colorDefault; // Mettre à jour le dataset
  });
};
clickCircle.forEach((td) => selectLetter(td));

// Génération de la combinaison secrète au clic
btnRandom.addEventListener("click", function () {
  messageTentative.style.display = "block";
btnHidden.style.display = "block";
indication.style.display = "flex";
table.style.display = "block";
btnValider.style.display = "block";
btnReplay.style.display = "block";



  circle__random = []; // Réinitialiser la combinaison secrète
  for (let i = 0; i < 4; i++) {
    let randomIndex = Math.floor(Math.random() * colors.length);
    circle__random.push(colors[randomIndex]);
  }

  table.style.display = "flex"; // Réaffiche le plateau
  messageEnd.textContent = ""; // Vide le message de fin
  messageEnd.style.display = "none";
  randomCodeDiv.style.display = "none"; // Masque la combinaison secrète
  btnHidden.textContent = "Afficher la combinaison secrète";
  tentatives = 1; // Réinitialise les tentatives
  messageTentative.textContent = "NOMBRE DE TENTATIVES : " + tentatives;

  // Réinitialiser les cercles du plateau
  document.querySelectorAll(".touch__circle").forEach((cell) => {
    cell.classList.remove(...colors); // Supprimer les couleurs
    cell.dataset.color = ""; // Réinitialiser le dataset
  });

  // Réinitialiser les feedbacks
  document.querySelectorAll(".feedback__color, .feedback__position").forEach((cell) => {
    cell.textContent = ""; // Effacer les indices
  });

  console.log("Nouvelle combinaison secrète : ", circle__random);

  // Afficher la combinaison secrète
  function afficherSecretCode(combinaison) {
    colorRandomCode.forEach((cell, index) => {
      cell.classList.remove(...colors);
      cell.classList.add(combinaison[index]);
    });
  }
  afficherSecretCode(circle__random); // Montre la combinaison si nécessaire
});

// Bouton pour afficher/masquer la combinaison secrète
btnHidden.addEventListener("click", function () {
  if (
    randomCodeDiv.style.display === "none" ||
    randomCodeDiv.style.display === ""
  ) {
    randomCodeDiv.style.display = "block"; // Affiche la combinaison
    table.style.display = "none"; // Masque le plateau
    btnHidden.textContent = "Cacher la combinaison secrète";
    messageEnd.style.display = "flex";
    messageEnd.textContent = "GAME OVER !! Vous avez vu la combinaison secrète !";
    indication.style.display = "none";
  } else {
    randomCodeDiv.style.display = "none"; // Cache la combinaison
    btnHidden.textContent = "Afficher la combinaison secrète";
    messageEnd.style.display = "none";
  }
});

// Fonction pour comparer les couleurs jouées avec la combinaison secrète
function comparerTentative(tentative, combinaisonSecrete) {
  let bienPlaces = 0;
  let malPlaces = 0;

  // Copies pour éviter de modifier les tableaux originaux
  let tentativeCopy = [...tentative];
  let combinaisonCopy = [...combinaisonSecrete];

  // Compter les bien placés
  for (let i = 0; i < tentativeCopy.length; i++) {
    if (tentativeCopy[i] && tentativeCopy[i] === combinaisonCopy[i]) {
      bienPlaces++;
      tentativeCopy[i] = null; // Marquer comme traité
      combinaisonCopy[i] = null; // Marquer comme traité
    }
  }

  // Compter les mal placés
  for (let i = 0; i < tentativeCopy.length; i++) {
    if (tentativeCopy[i] !== null) {
      const index = combinaisonCopy.indexOf(tentativeCopy[i]);
      if (index !== -1) {
        malPlaces++;
        combinaisonCopy[index] = null; // Marquer comme traité
      }
    }
  }

  return { bienPlaces, malPlaces }; // Retourner les résultats
}

// Gérer la validation des tentatives
btnValider.addEventListener("click", function () {
  // Récupérer les couleurs jouées sur la ligne active
  let tentative = Array.from(
    document.querySelectorAll(`[data-step="${tentatives}"]`)
  ).map((cell) => colors[parseInt(cell.dataset.color)]);

  console.log("Tentative :", tentative);
  console.log("Combinaison secrète :", circle__random);

  // Vérifiez que toutes les cases de la tentative sont remplies
  if (tentative.includes(undefined)) {
    alert("Veuillez remplir toutes les cases avant de valider.");
    return;
  }

  // Comparer la tentative avec la combinaison secrète
  let resultat = comparerTentative(tentative, circle__random);

  console.log("Bien placés :", resultat.bienPlaces);
  console.log("Mal placés :", resultat.malPlaces);

  // Afficher les résultats sur la ligne active
  let ligneActive = document.querySelectorAll(`[data-step="${tentatives}"]`);
  ligneActive[0].parentElement.querySelector(".feedback__color").textContent =
    resultat.malPlaces;
  ligneActive[0].parentElement.querySelector(".feedback__position").textContent =
    resultat.bienPlaces;

  // Vérifier si la combinaison est correcte
  if (resultat.bienPlaces === 4) {
    messageEnd.style.display = "flex";
    messageEnd.textContent = "FÉLICITATIONS, VOUS AVEZ GAGNÉ !";
    randomCodeDiv.style.display = "block";
    btnHidden.textContent = "Cacher la combinaison secrète";
    return;
  }

  // Passer à la tentative suivante
  if (tentatives < 12) {
    tentatives++;
    messageTentative.textContent = "NOMBRE DE TENTATIVES : " + tentatives;
  } else {
    messageEnd.style.display = "flex";
    messageEnd.textContent = "GAME OVER !";
    randomCodeDiv.style.display = "block";
    btnHidden.textContent = "Cacher la combinaison secrète";
    btnValider.style.display = "none";
  }
});

// Gérer le bouton Rejouer
btnReplay.addEventListener("click", function () {
  btnRandom.click(); // Simule un clic sur le bouton "Jouer" pour tout réinitialiser
});
