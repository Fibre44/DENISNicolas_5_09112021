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
  try{
    const addItem = document.getElementById("cart__items");
    addItem.innerHTML += '<article class="cart__item" data-id='+order.id+'>'+
                            '<div class="cart__item__img"><img src="'+order.img+'"alt=>'+                                                           
                            '</div>'+
                            '<div class="cart__item__content">'+
                              '<div class="cart__item__content__titlePrice">'+
                                '<h2>'+order.name+'</h2>'+
                                '<p>'+order.price+'€</p>'+ 
                                '<p>Couleur ='+order.color+'</p>'+/*n 'existe pas dans le fichier cart à verifier*/
                                '</div>'+
                              '<div class="cart__item__content__settings">'+
                              '<div class="cart__item__content__settings__quantity">'+
                                '<p>'+order.quantity+'</p>'+
                                '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">'+
                              '</div>'+
                              '<div class="cart__item__content__settings__delete">'+
                                '<p class="deleteItem">Supprimer</p>'+
                              '</div>'+
                            '</div>'+
                          '</article>';

  }
  catch{
    console.error('Erreur mise à jour du dom');
  }
  
}
const articles = document.getElementsByClassName("itemQuantity");
  console.log('Suppression'+articles.length+'détail'+articles);      

async function getQuantityBasket(){
  const quantity = document.getElementsByClassName("itemQuantity");
  return quantity;

}
for (let i = 0; i<articles.length;i++) {
  button = articles[i];
  button.addEventListener("click",async function(){
    let quantity = await getQuantityBasket();
    if(quantity> 42){
      console.log ("+1")
    }else{
      console.log('-1');
    }
  })
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

