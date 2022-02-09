//récupération des informations du localStorage + écriture

const cart = document.getElementById("cart__items");

//lecture du local storage
for( let i = 0; i < localStorage.length; i++){

  let key = localStorage.key(i);
  let order = getLocalStorage(key);//order contient les informations du produit sauf le prix

  getOneProduct(order.id)
  .then(function (response) {

    //Consigne OpenClassRooms on ne stocke pas le prix dans le local storage solution => on réalise un appel API pour obtenir le produit afin de récupérer son prix
    return response
    })

    .then((kanap) => {

      updateDomOrders(order,kanap);

      updateDomArticlePrice();

    })

    .then( () => {

    //Gestion de la suppression d'un élément

      addDelete();

    //Gestion mise à jour quantité

      addUpdate()
    })

    .catch((err) => {

      console.error("Erreur lors de l'ajout des listenner ",err)
    })


    .catch( (req) => {
    console.error("Le serveur retourne une erreur",req)
    });

}

/**
 * Mise à jour du DOM page panier
 * @param {objet} order 
 */

function updateDomOrders(order,kanapDetail){
  let kanap = document.createElement("article");
  kanap.setAttribute("data-id",order.id+order.color);
  kanap.classList.add("cart__item");
  document.getElementById("cart__items").appendChild(kanap);

  let kanapDiv = document.createElement("div");
  kanapDiv.classList.add("cart__item__img");
  kanap.appendChild(kanapDiv);

  let kanapImg = document.createElement("img");
  kanapImg.src = order.img;
  kanapImg.alt = kanapDetail.altTxt;
  kanapDiv.appendChild(kanapImg);

  let kanapItemContent = document.createElement("div");
  kanapItemContent.classList.add("cart__item__content");
  kanap.appendChild(kanapItemContent);

  let kanapItemTitlePrice = document.createElement("div");
  kanapItemTitlePrice.classList.add("cart__item__content__titlePrice");
  kanapItemContent.appendChild(kanapItemTitlePrice);

  let kanapName = document.createElement("h2");
  kanapName.textContent = order.name + "couleur : "+order.color;
  kanapItemTitlePrice.appendChild(kanapName);

  let kanapPrice = document.createElement("p");
  kanapPrice.textContent = kanapDetail.price+" €";
  kanapItemTitlePrice.appendChild(kanapPrice);

  let kanapSettingOption = document.createElement("div");
  kanapSettingOption.classList.add("cart__item__content__settings");
  kanapItemContent.appendChild(kanapSettingOption);

  let kanapSettingQuantity = document.createElement("div");
  kanapSettingQuantity.classList.add("cart__item__content__settings__quantity");
  kanapSettingOption.appendChild(kanapSettingQuantity);

  let kanapQuantity = document.createElement("p");
  kanapQuantity.textContent = "Qté : "+order.quantity;
  kanapSettingQuantity.appendChild(kanapQuantity);

  let updateQuantity = document.createElement("input");
  updateQuantity.setAttribute("type","number");
  updateQuantity.classList.add("itemQuantity");
  updateQuantity.setAttribute("name","itemQuantity");
  updateQuantity.setAttribute("min","1");
  updateQuantity.setAttribute("max","100");
  updateQuantity.setAttribute("value",order.quantity);

  kanapSettingQuantity.appendChild(updateQuantity);

  let kanapDelete = document.createElement("div");
  kanapDelete.classList.add("cart__item__content__settings__delete");
  kanapSettingOption.appendChild(kanapDelete);

  let buttonDelete = document.createElement("p");
  buttonDelete.classList.add("deleteItem");
  buttonDelete.textContent = "Supprimer";
  kanapDelete.appendChild(buttonDelete);

  
}

/**
 * la fonction va ajouter un listenner sur l'ensemble les éléments de la class deleteItem
 */


function addDelete(){

  const deleteButton = document.querySelectorAll('.deleteItem');

  for (let i = 0; i < deleteButton.length;i++){
    let buttonClick = deleteButton[i];
    buttonClick.addEventListener('click',function(){
    //this représente l'élement en cours

      //mise à jour du DOM
      let idKanapDelete = searchDataId(this);
      let section = document.getElementById('cart__items');
      let articles = document.getElementsByTagName('article');
      for (article of articles){
        if (idKanapDelete == article.getAttribute('data-id')){
          console.log('id en cours '+article.getAttribute('data-id'));
          section.removeChild(article);
        }
      }
      //mise à jour localstorage
      console.log('Le parent est '+idKanapDelete);
      localStorage.removeItem(idKanapDelete);

      //mise à jour des totaux
      updateDomArticlePrice()

    });

  }
}

/**
 * la fonction va ajouter un listenner sur les éléments de la class itemQuantity
 */

function addUpdate(){

  const updateQuantity = document.querySelectorAll('.itemQuantity');

  for (let i = 0; i < updateQuantity.length; i++){
    let updateClick = updateQuantity[i];
    //updateClick contient la valeur de le la balise input

    updateClick.addEventListener('change',function(){
      
      //mise à jour du DOM
      let quantityDom = this.previousElementSibling;
      quantityDom.textContent = "Qté : "+updateClick.value;//balise <p> qui contient le prix en euros

      //mise à jour localStorage
      let idKanapUpdateQuantity = searchDataId(this);
      let kanapUpdateQuantityOrder = getLocalStorage(idKanapUpdateQuantity);
      kanapUpdateQuantityOrder.quantity = updateClick.value;
      setLocalStorage(idKanapUpdateQuantity,kanapUpdateQuantityOrder);

      //mise à jour des totaux
      updateDomArticlePrice()

    })
  }

}
/**
 * 
 * @param {integer} price 
 * @param {integer} quantity 
 */

function updateDomArticlePrice(){

  console.log("Le local storage contient : "+localStorage.length);

  if (localStorage.length == 0){

    //on force les valeurs à 0 sinon problème d'actualisation du solde si on supprime l'ensemble des éléments du panier

    const priceDom = document.getElementById("totalPrice");
    const quantityDom = document.getElementById("totalQuantity");

    priceDom.textContent = "0";
    quantityDom.textContent = "0";

  }else{

    getTotal()
    
  }
  
}

/**
 * La fonction calcul la quantité total et le prix total en relisant le DOM puis va écrire dans le DOM les totaux
 * 
 */

function getTotal(){

  let priceTotal = 0;
  let quantityTotal = 0;

  const priceDom = document.getElementById("totalPrice");
  const quantityDom = document.getElementById("totalQuantity");

  let priceArray = document.querySelectorAll(".cart__item__content__titlePrice p");//attention il faudra supprimer le €
  let quantityArray = document.querySelectorAll(".cart__item__content__settings__quantity input");//contient les quantités
  let totalarticles = document.getElementsByTagName("article");//nombre d'articles
  
  for (let i = 0; i <totalarticles.length; i++ ){

    let price = priceArray[i]
    let quantity = quantityArray[i]

    priceTotal += parseInt(price.textContent.replace(' €',''))*parseInt(quantity.value);
    quantityTotal += parseInt(quantity.value);

    console.log("Le prix total est de "+priceTotal+' la quantité total est de '+quantityTotal);

  }

  priceDom.textContent = priceTotal;
  quantityDom.textContent = quantityTotal;
}

/**
 * La fonction va chercher de façon récursive l'attribut data-id de la balise article
 * @param {htmlcollection} localisation 
 * @returns le data-id de l'article qu'on souhaite supprimer/modifier
 */

function searchDataId(localisation){
  if (localisation.getAttribute("data-id") != undefined ) {
    return localisation.getAttribute("data-id");
  }else{
    return searchDataId(localisation.parentElement);
  }
}

function getBasket(){
  let products = [];

  for (let i =0; i <localStorage.length; i++){
    let key = localStorage.key(i);
    let order = getLocalStorage(key);
    products.push(order.id);

  }
  return products;

}

/**
 * 
 * @returns un object contact avec l'ensemble des informations du formulaire
 */

function getContact(){
  let contact =  {
    firstName: document.getElementById("firstName").value,
    lastName: document.getElementById("lastName").value,
    address: document.getElementById("address").value,
    city: document.getElementById("city").value,
    email: document.getElementById("email").value
  }
  return contact;

}

const orderButton = document.getElementById("order");
orderButton.addEventListener('click', function(event){

  event.preventDefault();
  order = {
    contact : getContact(),
    products : getBasket(), 
  }
  
   //requete Post
   fetch ('http://localhost:3000/api/products/order',{
     method: "POST",
     headers:{
       'Accept':'application/json',
       'Content-Type': 'application/json'
     ,
    },
      body: JSON.stringify(order)

    })
    .then (function (res){
      if (res.ok){
        return res.json();
      }    
    })
    .then(function(res){
      document.location.href = "confirmation.html?idOrder="+res.orderId;

    })
    .catch(function(err){
      console.error('Erreur lors du post');
    });
    
    
})

//Regex


const email = document.getElementById('email').addEventListener('change',function(){
  validationEmail(this);
})


function validationEmail(email){
  let emailRegex = new RegExp('^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$','g');
  let testEmail = emailRegex.test(email.value);
  if (testEmail){
    const emailError = document.getElementById('emailErrorMsg').textContent='';
  

  }else{
    const emailError = document.getElementById('emailErrorMsg').textContent='La saisie de votre email est invalide';

  }

  errorForm()

}

//gestion du champ prénom

const fistName = document.getElementById('firstName').addEventListener('change',function(){
  validationFirstName(this);
})

function validationFirstName(firstName){
  let firstNameRegex = new RegExp("^[a-zA-Z ,.'-]+$",'g');
  let firstNameTest = firstNameRegex.test(firstName.value);
  if (firstNameTest){
    const firstNameError = document.getElementById('firstNameErrorMsg').textContent='';
 

  }else{
    const firstNameError = document.getElementById('firstNameErrorMsg').textContent='Un prénom ne peut pas contenir de chiffre';

  }

  errorForm()
}

//gestion du nom

const lastName = document.getElementById('lastName').addEventListener('change',function(){
  validationLasteName(this);
})

function validationLasteName(lastName){
  let lastNameRegex = new RegExp("^[a-zA-Z ,.'-]+$",'g');
  let lastNameTest = lastNameRegex.test(lastName.value);
  if (lastNameTest){
    const lastNameError = document.getElementById('lastNameErrorMsg').textContent='';

  }else{
    const lastNameError = document.getElementById('lastNameErrorMsg').textContent='Un nom ne peut pas contenir de chiffre';

  }
  errorForm()
}

/**
 * 
 * Si un regex donne une erreur alors la fonction bloque le bouton du formulaire
 */

function errorForm (){
  button = document.getElementById('order');

  let emailTest = document.getElementById('emailErrorMsg').textContent;
  let fistNameTest = document.getElementById('firstNameErrorMsg').textContent;
  let lastNameTest = document.getElementById('lastNameErrorMsg').textContent;


  console.log('email contien'+emailTest.length+' prénom contient'+fistNameTest.length);

  if (emailTest.length > 0 || fistNameTest.length > 0 || lastNameTest.length > 0){

    button.disabled = true

  
   }else if (emailTest.length == 0 && fistNameTest.length == 0 && lastNameTest.length == 0) {
    button.disabled = false
   }
   
}



