const cart = document.getElementById("cart__items");
let totalQuantity = 0
let totalPrice = 0

for( let i = 0; i < localStorage.length; i++){
    let key = localStorage.key(i);
    let id = key.substring(0,32);/*récupération de l'id dans la chaine de caractéres*/
    let quantity = localStorage.getItem(key);    
    totalQuantity += parseInt(quantity);
    console.log ('Pour la clé '+key+' quantité = '+quantity);
    console.log('total '+totalQuantity);
    fetch("http://localhost:3000/api/products/"+id)
    .then (function (res){
        if (res.ok){
          return res.json();
          
        }
      })
        .then (function (item) {
            console.log(item);
            let color = key.substring(32,key.length)
            console.log ( 'key ='+id+' quantité'+quantity+' nom'+item.name);
            const addItem = document.getElementById("cart__items");
            addItem.innerHTML += '<article class="cart__item" data-id='+item._id+'>'+
                                    '<div class="cart__item__img"><img src="'+item.imageUrl+'"alt=>'+                                
                                   
                                    '</div>'+
                                    '<div class="cart__item__content">'+
                                      '<div class="cart__item__content__titlePrice">'+
                                        '<h2>'+item.name+'</h2>'+
                                        '<p>'+item.price+'€</p>'+ 
                                        '<p>Couleur ='+color+'</p>'+/*n 'existe pas dans le fichier cart à verifier*/
                                        '</div>'+
                                      '<div class="cart__item__content__settings">'+
                                      '<div class="cart__item__content__settings__quantity">'+
                                        '<p>'+quantity+'</p>'+
                                        '<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="42">'+
                                      '</div>'+
                                      '<div class="cart__item__content__settings__delete">'+
                                        '<p class="deleteItem">Supprimer</p>'+
                                      '</div>'+
                                    '</div>'+
                                  '</article>';
                                  
          /*Créer une fonction MAJ prix + quantité*/                        
          totalPrice += parseInt(quantity)*parseInt(item.price);   
          console.log ('Prix total = '+totalPrice);
          const totalQuantitySpan = document.getElementById('totalQuantity');
          totalQuantitySpan.innerHTML = totalQuantity;
          const totalPriceSpan = document.getElementById('totalPrice');
          totalPriceSpan.innerHTML = totalPrice;         

        })


    .catch(function(err) {

        console.error('Impossible de récupérer l\id du kanap')
    });

}

const orderButton = document.getElementById("order");
orderButton.addEventListener('click', function(){
  const firstNameInput = document.getElementById("firstName").value;
  const lasttNameInput = document.getElementById("lastName").value;
  const addressInput = document.getElementById("address").value;
  const city = document.getElementById("city").value;
  const email = document.getElementById("email").value;
  let contact =  {
     firstName: firstNameInput,
     lastName: lasttNameInput,
     address: addressInput,
     city: city,
     email: email
   }
   contactJson = JSON.stringify(contact);
   console.log('contact'+contact);
   console.log('contactJson'+contactJson);

   fetch ('http://localhost:3000/api/products/order',{
     method: "POST",
     headers:{
       'Accept':'application/json',
       'Content-Type': 'application/json'
     ,
    },
      body: JSON.stringify(contact)

    });
})

