function getIdProduit (){
  var str = location;
  console.log (location);
  var url = new URL(str);
  var search_params = new URLSearchParams(url.search); 
  if(search_params.has('id')) {
    var product = search_params.get('id');
  }
  return product

}

fetch("http://localhost:3000/api/products/"+getIdProduit())
  .then (function (res){
    if (res.ok){
      return res.json();
    }
  })
    .then (function (item) {

      addKanap(item);

      kanap = newKanap(item._id,item.name,item.imageUrl,item.price);

    })

    .catch (function (err) {
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
 * @param {guid} id 
 * @param {string} color 
 * @returns 
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
 * @param {*} id 
 * @param {*} name 
 * @param {*} img 
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

function getQuantity(){
  const getQuantity = document.getElementById('quantity').value;
  return getQuantity;
}

function getColor(){
  const getColor = document.getElementById('colors').value;
  return getColor;
}

function searchOrder(uuid){
  try{
    let search = localStorage.getItem(uuid);
    if (search != undefined){
      return true
    }else{
      return false
    }
  }
  catch{
    console.error('Erreur lors de la recherche de la commande');
  }
}

function updateQuantity(uuid,quantity){
  try{
    let order = getLocalStorage(uuid);
    let oldQuantity = order.quantity;
    console.log ('Avant mise à jour la commande pour l id/color '+order.id+order.color+' contient '+order.quantity);
    let newQuantity = parseInt(oldQuantity)+parseInt(quantity);
    console.log('Ajout de '+quantity+' la fonction retourne'+newQuantity);
    return newQuantity;

  }
  catch{
    console.error('Erreur lors de la mise à jour de la commande');
  }
}

function controleQuantity(quantity){

  if (quantity == 0 || quantity >100 ){
    return true
  }else{
    return false
  }
}

function controleOption(option){
  
  if (option == ""){
    return true
  }else{
    return false
  }
}

const addBasketButton = document.getElementById('addToCart');
addBasketButton.addEventListener('click', function(){

  
    let order = newOrder(kanap.id,kanap.name,kanap.img);
    console.log('Id du produit '+order.id+' la quantité est '+order.quantity+' la couleur est '+order.color+' le nom est '+order.name+' l image est stocké '+order.img);  
    
    if (controleQuantity(order.quantity) == true || controleOption(order.color) == true){
      addBasketButton.textContent = "Erreur sur la commande vérifier la quantité et choisir une couleur";
      console.log("Pas d' enregistrement dans le localStorage");
    }else{
      addBasketButton.textContent = "Ajouter au panier";

      /*ajout au panier*/ 
      /*Recherche si la commande existe déjà */
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

      const succesOrder = document.createElement("p");
      succesOrder.textContent = "La commande a été ajouté au panier";
      const succes = document.getElementsByClassName("item__content__addButton");

      succes[0].appendChild(succesOrder);
    }

    
});






