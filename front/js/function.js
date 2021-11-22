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

function setLocalStorage(key,items){
    try{
      let basketLinea = JSON.stringify(items);
      localStorage.setItem(key,basketLinea);
    
    }
    catch{
      return console.error ('Erreur ecriture dans local storage');
    }
  
}