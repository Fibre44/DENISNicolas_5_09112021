var str = location;
console.log (location);
var url = new URL(str);
var search_params = new URLSearchParams(url.search); 
if(search_params.has('id')) {
  var product = search_params.get('id');
}


fetch("http://localhost:3000/api/products/"+product)
  .then (function (res){
    if (res.ok){
      return res.json();
    }
  })
    .then (function (item) {

      addKanapImg(item);
      addKanapTitle(item);
      addKanapDescription (item);
      addKanapOptions (item);
      addKanapPrice (item);

      kanap = newKanap(item._id,item.name,item.imageUrl,item.price);

    })


  .catch(function(err) {

    console.error('Impossible de récupérer l\id du kanap')
});


function addKanapImg(img){
  const kanapImg = document.querySelector('div .item__img');
  kanapImg.innerHTML += '<img src='+img.imageUrl+' alt='+img.altTxt+'></img>';
  console.log(img.imageUrl);
}

function addKanapTitle(title){
  const kanapTitle = document.getElementById('title');
  kanapTitle.innerHTML += title.name;
}

function addKanapDescription (description){
  const kanapDescription = document.getElementById('description');
  kanapDescription.innerHTML += description.description;
}

function addKanapOptions(options){
  const kanapOptions = document.getElementById('colors');
  for (option of  options.colors){
    kanapOptions.innerHTML += '<option value='+option+'>'+option+'</option>';
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
function newOrder(id,color,quantity,name,img,price){

  let order = {
    id:id,
    color:color,
    quantity:quantity,
    name:name,
    img:img,
    price:price,
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




const addBasketButton = document.getElementById('addToCart');
addBasketButton.addEventListener('click', function(){
  try{
    /*Récupération des informations de la commande*/
    let quantity = getQuantity();
    let color =  getColor();

    /*Création de l'objet qui represente la commande*/

    let order = newOrder(kanap.id,color,quantity,kanap.name,kanap.img,kanap.price);
    console.log('Id du produit '+order.id+' la quantité est '+order.quantity+' la couleur est '+order.color+' le nom est '+order.name+' l image est stocké '+order.img);  
    
    /*ajout au panier*/ 
    /*Recherche si la commande existe déjà */
    let search = searchOrder(order.id+order.color);
    if (search == true){
      console.log('Mise à jour de la commande');
      let newQuantity = updateQuantity(order.id+order.color,order.quantity);
      order.quantity = newQuantity;
      setLocalStorage(order.id+order.color,order);

    }else{
      console.log('Nouvel commmande');
      setLocalStorage(order.id+order.color,order);
    }
  
  }  

  catch{
    console.error('Erreur lors du passage de la commande')
  }

});





