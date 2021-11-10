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

      console.log(item);
      addKanapImg(item);
      addKanapTitle(item);
      addKanapDescription (item);
      addKanapOptions (item);
      addKanapPrice (item);

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

function newOrder(quantity,id,option){

  let order = {
    id:id,
    color:option,
    quantity:quantity
  }  
  return order;
}

function getQuantity(){
  const addKanapsQuantity = document.getElementById('quantity').value;
  return addKanapsQuantity;
}

function getColor (){
  const getOption = document.getElementById('colors').value;
  return getOption;
}
/**
 * 
 * @returns Retourne au format JSON le détail du panier
 */


const addBasketButton = document.getElementById('addToCart');
addBasketButton.addEventListener('click', function(){
  try{

    /*Récupération des informations de la commande*/
    let id = product;
    let quantity = getQuantity();
    let option =  getColor();

    /*Création de l'objet qui represente la commande*/

    let order = newOrder(quantity,id,option);
    console.log('Id du produit '+order.id+' la quantité est '+order.quantity+' la couleur est '+order.color);  
    
    /*ajout au panier*/ 

    let key = order.id+order.color
    let searchKeyLocalStorage = localStorage.getItem(key);
    console.log(searchKeyLocalStorage);
    if (searchKeyLocalStorage == null){
      console.log('La clé n existe pas dans le local storage');
      localStorage.setItem(key,order.quantity);
      searchKeyLocalStorage = localStorage.getItem(key);
      console.log ('La valeur pour la clé '+key+'='+searchKeyLocalStorage);
    }else{
      console.log('La clé existe dans le local storage avec la valeur '+searchKeyLocalStorage);
      let addQuantity = parseInt(searchKeyLocalStorage) + parseInt(order.quantity);
      console.log ('Ajout de la nouvelle quantité '+order.quantity);      
      localStorage.setItem(key,addQuantity);
      console.log('Solde avant '+searchKeyLocalStorage+' ajout de '+order.quantity+'='+addQuantity);
      searchKeyLocalStorage = localStorage.getItem(key);
      console.log ('La valeur pour la clé '+key+'='+searchKeyLocalStorage);


    }

 

  }  

/*https://tutowebdesign.com/localstorage-javascript.php*/
  catch{
    console.error('Erreur lors du passage de la commande')
  }

});





