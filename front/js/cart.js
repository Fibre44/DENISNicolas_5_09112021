const cart = document.getElementById("cart__items");

let priceTotal =0;
for( let i = 0; i < localStorage.length; i++){

  let key = localStorage.key(i);
  let order = getLocalStorage(key);
  let basket = {
    orders : []
  };
  basket.orders.push(order,priceTotal);
  priceTotal += order.price*order.quantity;
  updateDomOrders(order);
  updateDomArticlePrice(priceTotal,basket.orders.length);


}

function updateDomOrders(order){
  let kanap = document.createElement("article");
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

//Gestion de la suppression d'un élément

const deleteButton = document.querySelectorAll('.deleteItem');
for (let i = 0; i < deleteButton.length;i++){
  let buttonClick = deleteButton[i];
  buttonClick.addEventListener('click',function(){
    this.innerHTML = '<p> on est ici</p>';
    console.log('Click sur suppression');
  });

}



function updateDomArticlePrice(price,articles){
  try{
    const addPrice = document.getElementById("totalPrice");
    addPrice.innerHTML =price;
    const addQuantity = document.getElementById("totalQuantity");
    addQuantity.innerHTML = articles;
  }
  catch{
    console.error('Erreur mise à jour totaux');
  }
}

const orderButton = document.getElementById("order");
orderButton.addEventListener('click', function(){
  
  let contact =  {
     firstName: document.getElementById("firstName").value,
     lastName: document.getElementById("lastName").value,
     address: document.getElementById("address").value,
     city: document.getElementById("city").value,
     email: document.getElementById("email").value
   }
   contactJson = JSON.stringify(contact);
   console.log('contact'+contact);

   fetch ('http://localhost:3000/api/products/order',{
     method: "POST",
     headers:{
       'Accept':'application/json',
       'Content-Type': 'application/json'
     ,
    },
      body: JSON.stringify(contact)

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
    })
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
  let lastNameTest = lastNameRegex.test(lastName);
  if (lastNameTest){
    const lastNameError = document.getElementById('lastNameErrorMsg').textContent='';
  }else{
    const lastNameError = document.getElementById('lastNameErrorMsg').textContent='Un nom ne peut pas contenir de chiffre';
  }

}