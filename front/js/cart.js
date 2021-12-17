const cart = document.getElementById("cart__items");

//lecture du local storage
for( let i = 0; i < localStorage.length; i++){

  let key = localStorage.key(i);
  let order = getLocalStorage(key);

  //création des différents articles du panier
  updateDomOrders(order);

  //mise à jour des totaux
  updateDomArticlePrice();

}

/**
 * Mise à jour du DOM page panier
 * @param {objet} order 
 */

function updateDomOrders(order){
  let kanap = document.createElement("article");
  kanap.setAttribute("data-id",order.id+order.color);
  kanap.classList.add("cart__item");
  document.getElementById("cart__items").appendChild(kanap);

  let kanapDiv = document.createElement("div");
  kanapDiv.classList.add("cart__item__img");
  kanap.appendChild(kanapDiv);

  let kanapImg = document.createElement("img");
  kanapImg.src = order.img;
  kanapDiv.appendChild(kanapImg);

  let kanapItemContent = document.createElement("div");
  kanapItemContent.classList.add("cart__item__content");
  kanap.appendChild(kanapItemContent);

  let kanapItemTitlePrice = document.createElement("div");
  kanapItemTitlePrice.classList.add("cart__item__content__titlePrice");
  kanapItemContent.appendChild(kanapItemTitlePrice);

  let kanapName = document.createElement("h2");
  kanapName.textContent = order.name;
  kanapItemContent.appendChild(kanapName);

  let kanapPrice = document.createElement("p");
  kanapPrice.textContent = order.price+" €";
  kanapItemContent.appendChild(kanapPrice);

  let kanapSettingOption = document.createElement("div");
  kanapSettingOption.classList.add("cart__item__content__settings");
  kanapItemContent.appendChild(kanapSettingOption);

  let kanapSettingQuantity = document.createElement("div");
  kanapSettingQuantity.classList.add("cart__item__content__settings__quantity");
  kanapSettingOption.appendChild(kanapSettingQuantity);

  let kanapQuantity = document.createElement("p");
  kanapQuantity.textContent = order.quantity;
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
  kanapSettingQuantity.appendChild(kanapDelete);

  let buttonDelete = document.createElement("p");
  buttonDelete.classList.add("deleteItem");
  buttonDelete.textContent = "Supprimer";
  kanapDelete.appendChild(buttonDelete);

  
}

/**
 * 
 * @param {integer} price 
 * @param {integer} quantity 
 */

function updateDomArticlePrice(){
  let priceTotal = 0;
  let quantityTotal = 0;

  const priceDom = document.getElementById("totalPrice");
  const quantityDom = document.getElementById("totalQuantity");
  //lecture localstorage
  for( let i = 0; i < localStorage.length; i++){

    let key = localStorage.key(i);
    let order = getLocalStorage(key);

    //parseInt pour forcer la conversion sinon il analyse comme du string
    priceTotal += parseInt(order.price)*parseInt(order.quantity);
    quantityTotal += parseInt(order.quantity);

    priceDom.textContent = priceTotal;
    quantityDom.textContent = quantityTotal;
    
  }

}

//Gestion de la suppression d'un élément

//this représente l'élement en cours

const deleteButton = document.querySelectorAll('.deleteItem');
for (let i = 0; i < deleteButton.length;i++){
  let buttonClick = deleteButton[i];
  buttonClick.addEventListener('click',function(){

    //mise à jour du DOM
    let idKanapDelete = searchDataId(this);
    let section = document.getElementById('cart__items');
    let articles = document.getElementsByTagName("article");
    for (article of articles){
      if (idKanapDelete == article.getAttribute("data-id")){
        console.log('id en cours '+article.getAttribute("data-id"));
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


//Gestion mise à jour quantité

const updateQuantity = document.querySelectorAll('.itemQuantity');

for (let i = 0; i < updateQuantity.length; i++){
  let updateClick = updateQuantity[i];
  //updateClick contient la valeur de le la balise input

  updateClick.addEventListener('click',function(){
    
    //mise à jour du DOM
    let quantityDom = this.previousElementSibling;
    quantityDom.textContent = updateClick.value;

    //mise à jour localStorage
    let idKanapUpdateQuantity = searchDataId(this);
    let kanapUpdateQuantityOrder = getLocalStorage(idKanapUpdateQuantity);
    kanapUpdateQuantityOrder.quantity = updateClick.value;
    setLocalStorage(idKanapUpdateQuantity,kanapUpdateQuantityOrder);

    //mise à jour des totaux
    updateDomArticlePrice()
  })
}

/**
 * La fonction va chercher de façon récursive l'attribut data-id de la balise article
 * @param {htmlcollection} localisation 
 * @returns 
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

   console.log('contact'+order.contact.email);
   console.log ('Quantité :'+order.products);
  
   
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
      console.log('Retour du post'+res.orderId);
      localStorage.setItem('orderId',res.orderId);
      document.location.href = "confirmation.html";

    })
    .catch(function(err){
      console.error('Erreur lors du post');
    });
    
    
})

//Regex

function errorOrder(){

  const errorEmail = document.getElementById("emailErrorMsg");
  const buttonOrder = document.getElementById("order");
  console.log(errorEmail);
  if (errorEmail != ''){
    buttonOrder.setAttribute("value","Commander !");    
  }else{
    buttonOrder.setAttribute("value","Erreur sur le formulaire");

  }

  
}



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
  errorOrder();

}

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
}

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

}
