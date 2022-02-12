//récupération l'id de la commande et affichage de l'information

let orderId = getParamURl("idOrder");

const orderDom = document.getElementById("orderId").textContent=orderId;


//Correction suite à la soutenance 
localStorage.clear();
