function getAllKanaps () {
    fetch ("http://localhost:3000/api/products")
    .then(function(res) {
        try{
            if (res.ok) {
                return res.json();
                }
        }
        catch{
            console.error('Erreur conversion JSON'); 
        }
    })
        .then(function(kanaps) {
            try{
                addKanaps(kanaps);

            }
            catch{
                console.error('Erreur lors de l ecriture sur la page');
            }
        })

    .catch(function(err) {
        console.error('Impossible de joindre le serveur',err)
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

  