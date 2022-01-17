/**
 * La fonction va récupérer dans le local storage la commande
 * @param {string} uuid 
 * @returns 
 */

function getLocalStorage(uuid){
    try{
      let orderLinea = localStorage.getItem(uuid);
      let orderJson = JSON.parse(orderLinea);
      return orderJson;
    }
    catch{
      console.error('Impossible de récupérer le panier');
    }
  
}

/**
 * La fonction créer dans le local storage une nouvelle commande
 * @param {string} key 
 * @param {object} items 
 * @returns 
 */

function setLocalStorage(key,items){
    try{
      let basketLinea = JSON.stringify(items);
      localStorage.setItem(key,basketLinea);
    
    }
    catch{
      return console.error ('Erreur ecriture dans local storage');
    }
  
}

function getOneProduct (id) {

  return new Promise (function (resolve, reject){

      fetch("http://localhost:3000/api/products/"+id)
      .then (function (res){
        if (res.ok){
          resolve(res.json());
        }
        reject(res)
    
      })
    
      .catch(function(err) {
    
        console.error('Impossible de récupérer l\'id du kanap',err)
    
    });

  })

}