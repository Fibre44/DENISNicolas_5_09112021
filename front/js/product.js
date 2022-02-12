
/**
 * la fonction va récupérer le produit getOneProduct retourne une Promise on lui passe en paramétre de recherche l'ID du produit
*/
getOneProduct(getParamURl('id'))
  .then ((item) => {

    addKanap(item);

    //création d'un objet qui réprésente la commande en mémoire pour la tester si l'utilisateur souhaite ajouter une  l'article au panier.
    kanap = newKanap(item._id,item.name,item.imageUrl,item.price);

  })

  .then(() => {

    //ajout des controles sur la quantité et la couleur
  
    addListener();

    //On lance la fonction de controle au chargement de la page pour bloquer le bouton tout de suite
    buttonControle();


  })

  .catch((err) => {

      console.error('Erreur lors de la mise en place des listenners ou du controle',err)
  })

  .catch ((err) => {
      console.error('Erreur lors la mise à jour du DOM',err)
  })


  .catch(function(err) {

    console.error('Impossible de récupérer l\'id du kanap',err)
});

function addKanap (kanap){

  const kanapImg = document.querySelector('div .item__img');
  const addKanapImg = document.createElement('img');
  kanapImg.appendChild(addKanapImg);
  addKanapImg.src = kanap.imageUrl;
  addKanapImg.alt = kanap.altTxt;

  const kanapName = document.getElementById('title');
  kanapName.textContent = kanap.name;

  const kanapPrice = document.getElementById('price');
  kanapPrice.textContent = kanap.price;

  const kanapDescription = document.getElementById('description');
  kanapDescription.textContent = kanap.description;

  const kanapColors = document.getElementById('colors');
  for (color of kanap.colors){
    let option = document.createElement('option');
    option.value = color;
    option.textContent = color;

    kanapColors.appendChild(option);
  }

}

function addKanapPrice (price){
  const kanapPrice = document.getElementById('price');
  kanapPrice.innerHTML += price.price;
}


/**
 * 
 * @param {number} quantity 
 * @param {string} id 
 * @param {string} color 
 * @param {number} price
 * @returns Retourne un objet qui représente le produit avec ses informations
 */

function newKanap (id,name,img,price){
  let kanap = {
    id:id,
    name:name,
    img:img,
    price:price
  }
  return kanap;
}

/**
 * 
 * @param {string} id 
 * @param {string} name 
 * @param {string} img 
 * @returns un objet qui représente une commande qui sera ensuite enregistré dans le localStorage (MAJ OpenClassRooms on ne stocke pas le prix)
 */
function newOrder(id,name,img){

  let order = {
    id:id,
    color:getColor(),
    quantity:getQuantity(),
    name:name,
    img:img,
  }  
  return order;
}

/**
 * 
 * @returns Retourne la quantité saisie par l'utilisateur
 */

function getQuantity(){
  const getQuantity = document.getElementById('quantity').value;
  return getQuantity;
}

/**
 * 
 * @returns Retourne la couleur saisie par l'utilisateur
 */

function getColor(){
  const getColor = document.getElementById('colors').value;
  return getColor;
}

/**
 * 
 * @param {string} uuid Indiquer l'UUID qu'on souhaite verifier
 * @returns Si l'uuid existe dans le local storage alors vrai sinon faux
 */

function searchOrder(uuid){
    let search = localStorage.getItem(uuid);
    if (search != undefined){
      return true
    }else{
      return false
    }
  
}

/**
 * 
 * @param {string} indiquer l'UUID de la commmande à mettre à jour
 * @param {integer} indiquer la nouvelle quantité à ajouter
 * @returns Retourne la nouvelle quantité ancienne quantité + la nouvelle quantité
 */

function updateQuantity(uuid,quantity){

    let order = getLocalStorage(uuid);
    let oldQuantity = order.quantity;
    console.log ('Avant mise à jour la commande pour l id/color '+order.id+order.color+' contient '+order.quantity);
    let newQuantity = parseInt(oldQuantity)+parseInt(quantity);
    console.log('Ajout de '+quantity+' la fonction retourne'+newQuantity);
    return newQuantity;

}
/**
 * 
 * @param {int} quantity 
 * @returns Retourne Vrai si la quantité est à 0 ou si la quantité est supérieur à 100
 */
function controleQuantity(quantity){

  //modification suite à la soutenance
  if (quantity <= 0 || quantity >100 ){
    return true
  }else{
    return false
  }
}
/**
 * 
 * @param {string} option 
 * @returns retourne vrai si l'utilisation n'a pas choisi de couleur
 */
function controleOption(option){
  
  if (option == ""){
    return true
  }else{
    return false
  }
}

const addBasketButton = document.getElementById('addToCart');
addBasketButton.addEventListener('click', function(){

    //gestion de façon synchrone les étapes doivent s'enchainer de façon séquentiel 

    //On commence par créer un objet commande avec toutes les informations de l'objet Kanap + les informations sur la quantité et la couleur
    let order = newOrder(kanap.id,kanap.name,kanap.img);
    console.log('Id du produit '+order.id+' la quantité est '+order.quantity+' la couleur est '+order.color+' le nom est '+order.name+' l image est stocké '+order.img);  
    
    //On controle une nouvelle fois si la quantité et l'option sont biens renseignés
    
    if (controleQuantity(order.quantity) == true && controleOption(order.color) == true){
      addBasketButton.textContent = "Erreur sur la commande vérifier la quantité et choisir une couleur";
    }else{
      addBasketButton.textContent = "Ajouter au panier";

      //Recherche si la commande existe déjà 
      let search = searchOrder(order.id+order.color);
      if (search == true){
        console.log("Mise à jour de la commande");
        let newQuantity = updateQuantity(order.id+order.color,order.quantity);
        order.quantity = newQuantity;
        setLocalStorage(order.id+order.color,order);

      }else{
        console.log("Nouvel commmande");
        setLocalStorage(order.id+order.color,order);
      }

      /** A voir si suppression
      const succesOrder = document.createElement("p");
      succesOrder.textContent = "La commande a été ajouté au panier";
      const succes = document.getElementsByClassName("item__content__addButton");
      succes[0].appendChild(succesOrder);

      */
    }

    //redirection vers le panier

    document.location.href = "cart.html";


    
});

/**
 * Controle que l'utilisateur indique bien une quantité et une couleur sinon on bloque le bouton
 */

function buttonControle(){

  const option = getColor();
  const quantity = getQuantity();
  const button = document.getElementById("addToCart")

  console.log("option contient "+controleOption(option)+" value contient "+controleQuantity(quantity)); 

  if (controleQuantity(quantity) == true || controleOption(option) == true){
    button.disabled = true;
    console.log("test vrai");
  }else {
    console.log("test faux");
    button.disabled = false;
  }
 
}

/**
 * Ajout des listenner pour lancer les controles lors la modifications de la quantité et de la couleurs
 */

function addListener(){

  document.getElementById("quantity").addEventListener("change",()=>{
    buttonControle();
  })

  document.getElementById("colors").addEventListener("change",()=>{
    buttonControle();
  })
}







