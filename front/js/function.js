const urlServer = "http://192.168.1.21:3000"

/**
 * La fonction va récupérer dans le local storage la commande
 * @param {string} key indiquer la concaténation de order.id + order.color 
 * @returns retourne un objet Javascript qui représente la commande
 */

function getLocalStorage(uuid){
      let orderLinea = localStorage.getItem(uuid);
      let orderJson = JSON.parse(orderLinea);
      return orderJson;  
}

/**
 * La fonction créer dans le local storage une nouvelle commande
 * @param {string} key indiquer la concaténation de order.id + order.color
 * @param {object} stocker un objet qui réprésente la commande
 * @returns 
 */

function setLocalStorage(key,items){
      let basketLinea = JSON.stringify(items);
      localStorage.setItem(key,basketLinea);
    
}

/**
 * 
 * @param {string} id indiquer l'id du produit 
 * @returns retourne une Promise qui contient un objet Javascript du produit
 */

function getOneProduct (id) {

  return new Promise (function (resolve, reject){

      fetch(urlServer+"/api/products/"+id)
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

/**
 * 
 * @param {string} searchParamUrl 
 * @returns retourne la valeur du paramètre dans l'URL
 * Indiquer la valeur qu'on souhaite rechercher dans l'URL pour obtenir le résultat
 */

function getParamURl (searchParamUrl){
  var str = location;
  console.log (location);
  var url = new URL(str);
  var search_params = new URLSearchParams(url.search); 
  if(search_params.has(searchParamUrl)) {
    var param = search_params.get((searchParamUrl));
  }
  return param

}