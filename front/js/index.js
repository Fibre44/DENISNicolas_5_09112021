/*import {url} from './../js/function.js';
console.log(url);*/
fetch ("http://localhost:3000/api/products")
    .then(function(items) {
        if (items.ok) {
        return items.json();
        }
    })
        .then(function(kanaps) {
            addItems(kanaps);
            console.log ('Connexion à l \'API ok lancement de la MAJ du DOM')
        })
    .catch(function(err) {

        console.error('Impossible de joindre le serveur')
  });

  /**
   * 
   * @param {array} kanaps 
   * La fonction va prendre l'ensemble des "kanaps" en paramétre puis va mettre à jour le DOM avec une boucle
   */

  function addItems (kanaps){
      for (kanap of kanaps){
        const addKanap = document.getElementById('items');
        addKanap.innerHTML += '<a href=./../html/product.html?id='+kanap._id+'>'+
                             '<article><img class="cart__item__img" src='+kanap.imageUrl+' alt='+kanap.altTxt+'>'+
                                '<h3>'+kanap.name+'</h3>'+
                                '<p>'+kanap.description+'</p>'+
                            '</article>'+
                            '</a>';    
      
    }
  }

  