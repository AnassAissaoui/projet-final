let promo = document.getElementById("items")//on récupère l'endroit sur la page ou on va mettre nos nouveaux html

let Prems = async () => { //fontcion asynchrone pour booster le fetch

let url = "http://localhost:3000/api/products"//c'est l'api qui possède nos produits
console.log(url);

fetch(url)
.then(response => response.json())
.then(data => {

for ( let myHtml = 0; myHtml < data.length; myHtml++)
/* for(let myHtml of html) */{

let html = `             
          <a href="./product.html?id=${data[myHtml]._id}">
            <article>
         <img src="${data[myHtml].imageUrl}" alt="Lorem ipsum dolor sit amet, Kanap name1">
              <h3 class="productName">${data[myHtml].name}</h3>
              <p class="productDescription">${data[myHtml].description}</p>
            </article>
          </a>`;

        promo.innerHTML += html;
              }
})
.catch(erreur => console.log("erreur", erreur));

}

Prems()//on appelle la fonction pour la faire marcher
      
