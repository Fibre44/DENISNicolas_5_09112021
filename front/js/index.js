function getAllKanaps () {
    fetch ("http://localhost:3000/api/products")
    .then(function(res) {
        if (res.ok) {
            return res.json();
        }        
    })
    .catch(function (err){
        console.error("erreur de connexion au serveur/conversion de la réponse ",err);
    })
    .then(function(kanaps) {
      
         addKanaps(kanaps);      
    })

    .catch(function (err){

        console.error("Erreur lors de l ecriture sur la page ", err);           

    })

    .catch(function(err) {
        console.error("Impossible de joindre le serveur",err);
  });
}

getAllKanaps()


function addKanaps (kanaps){
    for (kanap of kanaps){
        
    let urlKanap = document.createElement('a');
    document.getElementById('items').appendChild(urlKanap);
    urlKanap.href = './../html/product.html?id='+kanap._id;

    let articleKanap = document.createElement('article');
    urlKanap.appendChild(articleKanap);

    let articleImg = document.createElement('img');
    articleKanap.appendChild(articleImg);
    articleImg.src = kanap.imageUrl;
    articleImg.alt = kanap.altTxt;

    let nameKanap = document.createElement('h3');
    articleKanap.appendChild(nameKanap);
    nameKanap.classList.add('productname');
    nameKanap.textContent = kanap.name;

    let descriptionKanap = document.createElement('p');
    articleKanap.appendChild(descriptionKanap);
    descriptionKanap.classList.add('productDescription');
    descriptionKanap.textContent = kanap.description;
  
    }
  }

  