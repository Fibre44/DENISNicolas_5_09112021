const cart = document.getElementById("cart__items");

let priceTotal = 0;
let quantityTotal = 0;
for( let i = 0; i < localStorage.length; i++){

  let key = localStorage.key(i);
  let order = getLocalStorage(key);
  quantityTotal += parseInt(order.quantity);
  priceTotal += parseInt(order.price)*parseInt(order.quantity);
  console.log('Key : '+key+' quantité '+order.quantity+' la variable contient '+quantityTotal+' articles. Le prix total est de '+priceTotal);

  updateDomOrders(order);
  updateDomArticlePrice(priceTotal,quantityTotal);

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

function updateDomArticlePrice(price,quantity){
  try{
    const addPrice = document.getElementById("totalPrice");
    addPrice.textContent =price;
    const addQuantity = document.getElementById("totalQuantity");
    addQuantity.textContent = quantity;
  }
  catch{
    console.error('Erreur mise à jour totaux');
  }
}


//Gestion de la suppression d'un élément

const deleteButton = document.querySelectorAll('.deleteItem');
for (let i = 0; i < deleteButton.length;i++){
  let buttonClick = deleteButton[i];
  buttonClick.addEventListener('click',function(){
    let idKanapDelete = this.parentElement.parentElement.parentElement.parentElement.parentElement;
    console.log('Le parent est '+idKanapDelete.getAttribute("data-id"));
    alert('L article a été supprimé du panier');
    localStorage.removeItem(idKanapDelete.getAttribute("data-id"));
    location.reload();

  });

}

//Gestion mise à jour quantité

const updateQuantity = document.querySelectorAll('.itemQuantity');

for (let i = 0; i < updateQuantity.length; i++){
  let updateClick = updateQuantity[i];
  updateClick.addEventListener('click',function(){
    let idKanapUpdateQuantity = this.parentElement.parentElement.parentElement.parentElement;
    let kanapUpdateQuantityOrder = getLocalStorage(idKanapUpdateQuantity.getAttribute("data-id"));
    kanapUpdateQuantityOrder.quantity = updateClick.value;
    setLocalStorage(idKanapUpdateQuantity.getAttribute("data-id"),kanapUpdateQuantityOrder);
    location.reload();


  })
}

//Reflexion faire une fonction qui trouvera le data id

function getBasket(){
  let products = [];

  for (let i =0; i <localStorage.length; i++){
    let key = localStorage.key(i);
    let order = getLocalStorage(key);
    products.push(order.id);

  }
  return products;

}

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
   console.log ('QUantité :'+order.products);
  
   
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
      console.log('Retour du post'+res);
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
  console.log(testEmail);
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
