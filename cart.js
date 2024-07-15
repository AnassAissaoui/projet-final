

// Je récupère l'objet canapInfo dans le localStorage et le transforme en un objet JavaScript
const canapParse = JSON.parse(localStorage.getItem("canapInfo"));
console.log(canapParse);

// Je sélectionne les éléments HTML où je vais insérer les informations du panier
const div = document.getElementById("cart__items");
const totalQuantity = document.getElementById("totalQuantity");
const totalPrice = document.getElementById("totalPrice");

// Je sélectionne les éléments HTML pour les champs de saisie utilisateur (prénom, nom, adresse, ville, email)
const inputFirstName = document.getElementById("firstName");
const inputLastName = document.getElementById("lastName");
const inputAddresse = document.getElementById("address");
const inputCity = document.getElementById("city");
const inputMiel = document.getElementById("email");

// Je sélectionne le bouton de commande
const btnCommander = document.getElementById("order");

// Je vide le contenu initial de la div pour éviter l'accumulation des articles lors de la génération
div.innerHTML = "";

// Je génère dynamiquement le contenu du panier en itérant sur chaque élément de canapParse
canapParse.forEach(canap => {
  const html = `
    <article class="cart__item" data-id="${canap.id}" data-color="${canap.color}">
      <div class="cart__item__img">
        <img src="${canap.imageUrl}" alt="Photographie d'un canapé">
      </div>
      <div class="cart__item__content">
        <div class="cart__item__content__description">
          <h2>${canap.name}</h2>
          <p>${canap.color}</p>
          <p>${canap.price}€</p>
        </div>
        <div class="cart__item__content__settings">
          <div class="cart__item__content__settings__quantity">
            <p>Qté : </p>
            <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${canap.quantity}">
          </div>
          <div class="cart__item__content__settings__delete">
            <p class="deleteItem">Supprimer</p>
          </div>
        </div>
      </div>
    </article>`;
  // J'ajoute le HTML généré à la div du panier
  div.innerHTML += html;
});

// Je calcule le total des quantités et des prix de tous les articles dans le panier
const total = canapParse.reduce(
  (acc, canap) => {
    acc.quantity += canap.quantity; // J'ajoute la quantité de l'article au total
    acc.price += canap.price * canap.quantity; // J'ajoute le prix total de l'article (prix * quantité) au total
    return acc;
  },
  { quantity: 0, price: 0 } // Valeurs initiales pour les totaux
);

// J'affiche le total des quantités et des prix dans les éléments HTML correspondants
totalQuantity.innerHTML = total.quantity;
totalPrice.innerHTML = total.price;

// J'ajoute des écouteurs d'événements pour la suppression des articles du panier
document.querySelectorAll(".deleteItem").forEach((button, index) => {
  button.addEventListener("click", () => {
    canapParse.splice(index, 1); // Je supprime l'article du tableau
    localStorage.setItem("canapInfo", JSON.stringify(canapParse)); // Je mets à jour le localStorage
    location.reload(); // Je recharge la page pour afficher les changements
  });
});

// J'ajoute des écouteurs d'événements pour la mise à jour des quantités
document.querySelectorAll(".itemQuantity").forEach((input, i) => {
  input.addEventListener("change", (e) => {
    const nouvelleQuantity = parseInt(e.target.value); // Je récupère la nouvelle quantité

    if (nouvelleQuantity > 0 && nouvelleQuantity <= 100) {
      canapParse[i].quantity = nouvelleQuantity; // Je mets à jour la quantité dans le tableau
      localStorage.setItem("canapInfo", JSON.stringify(canapParse)); // Je mets à jour le localStorage
      location.reload(); // Je recharge la page pour afficher les changements
    } else {
      alert("Veuillez sélectionner une quantité entre 1 et 100."); // Message d'erreur si la quantité est invalide
    }
  });
});

// Fonction pour valider les champs de saisie avec des regex
const validateInput = (input, regex, errorMsg) => {
  const errorElement = document.getElementById(input.id + "ErrorMsg"); // Je récupère l'élément de message d'erreur associé
  input.addEventListener("input", () => {
    errorElement.textContent = input.value.match(regex) ? "" : errorMsg; // Je valide l'entrée et affiche un message d'erreur si nécessaire
  });
};

// J'appelle la fonction de validation pour chaque champ de saisie
validateInput(inputFirstName, /^[A-Za-z-]+$/, "Seules les lettres sont autorisées.");
validateInput(inputLastName, /^[A-Za-z-]+$/, "Seules les lettres sont autorisées.");
validateInput(inputAddresse, /^[A-Za-z0-9\s]+$/, "Seules les lettres, chiffres et espaces sont autorisés.");
validateInput(inputCity, /^[A-Za-z ]+$/, "Seules les lettres sont autorisées.");
validateInput(inputMiel, /^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,4}$/, "Veuillez entrer une adresse e-mail valide.");

// J'ajoute un écouteur d'événements pour le bouton de commande
btnCommander.addEventListener("click", (e) => {
  e.preventDefault(); // Je préviens le comportement par défaut du bouton
  const formData = new FormData(document.querySelector(".cart__order__form")); // Je récupère les données du formulaire

  fetch("http://localhost:3000/api/products/order", {
    method: "POST",
    body: formData // J'envoie les données du formulaire en POST
  })
  .then(response => response.json())
  .then(data => {
    document.location.href = `confirmation.html?orderId=${data.orderId}`; // Je redirige vers la page de confirmation avec l'ID de commande
  })
  .catch(error => console.error("Error:", error)); // Je gère les erreurs de la requête
});
