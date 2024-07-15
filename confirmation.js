
const urlParams = new URLSearchParams(window.location.search);
const ID = urlParams.get("orderId");
console.log(ID);

const orderIde = document.getElementById("orderId")

orderIde.innerHTML += ID
