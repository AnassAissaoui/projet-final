
//  Je récupère les paramètres de l'URL de la page
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get("id"); // Je récupère la valeur du paramètre "id"
console.log(ID); // j'affiche l'ID dans la console pour vérification

// je sélectionne les éléments HTML que l'on va remplir dynamiquement
const imageProduit = document.querySelector(".item__img");
const nomProduit = document.getElementById("title");
const prixProduit = document.getElementById("price");
const desProduit = document.getElementById("description");
const btn = document.getElementById("addToCart");
const select = document.getElementById("quantity");
const couleurs = document.getElementById("colors");

// encore une fois onction asynchrone pour récupérer les données du produit et les afficher
const produits = async () => {
  const url = `http://localhost:3000/api/products/${ID}`; // construction l'URL de l'API avec l'ID du produit
  console.log(url); // On vérifie l'url avec console.log

  try {
    const res = await fetch(url); // Effectue une requête à l'api
    const data = await res.json(); // Convertit la réponse en JSON
    console.log(data); // Affiche les données du produit dans la console

    // j'assigne les éléments html avec les données du produit
    imageProduit.innerHTML = `<img src="${data.imageUrl}" alt="Photo du canap">`;
    nomProduit.textContent = data.name;
    prixProduit.textContent = data.price;
    desProduit.innerHTML = data.description;
    couleurs.innerHTML = data.colors.map(color => `<option value="${color}">${color}</option>`).join("");

    // Ajoute un événement de clic au bouton "Ajouter au panier"
    btn.addEventListener("click", () => {
      // Vérifie que la quantité est supérieure à 0
      if (select.value < 1) {
        alert("Veuillez sélectionner le nombre d'articles voulu");
        return; // Je stoppe l'exécution de la fonction si la condition est vraie
      }
      // Vérifie qu'une couleur est sélectionnée
      if (couleurs.value === "") {
        alert("Veuillez sélectionner une couleur");
        return; // Stoppe l'exécution de la fonction si la condition est vraie
      }

      // Je récupère le panier actuel depuis le localStorage, ou initialise un tableau vide si le panier est vide
      let array = JSON.parse(localStorage.getItem("canapInfo")) || [];
      // Crée un objet contenant les informations du produit à ajouter au panier
      const productData = {
        id: ID,
        name: nomProduit.textContent,
        price: prixProduit.textContent,
        color: couleurs.value,
        quantity: parseInt(select.value),
        imageUrl: imageProduit.querySelector("img").src
      };

      // Cherche un produit dans le panier avec le même ID et la même couleur
      const verifProduit = array.findIndex(item => item.id === ID && item.color === productData.color);
      if (verifProduit !== -1) {
        // Si le produit existe déjà, incrémente sa quantité
        array[verifProduit].quantity += productData.quantity;
      } else {
        // Sinon, ajoute le nouveau produit au panier
        array.push(productData);
      }

      // Enregistre le panier mis à jour dans le localStorage
      localStorage.setItem("canapInfo", JSON.stringify(array));
      // indique que le produit a été ajouté au panier
      alert("Ajouté au panier !");
    });
  } catch (erreur) {
    // En cas d'erreur, affiche un message d'erreur dans la console
    console.log("error", erreur);
  }
};

// Appelle la fonction pour récupérer et afficher les informa
produits();
