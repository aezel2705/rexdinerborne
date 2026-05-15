// Charger les produits depuis le fichier JSON
fetch('produits.json')
    .then(response => response.json())
    .then(data => {
        afficherRestaurant(data.restaurant);
        afficherCategories(data.categories);
        afficherTousLesProduits(data.categories);
        setupNavigation(data.categories);
    })
    .catch(error => {
        console.error('Erreur de chargement:', error);
        document.getElementById('produits-container').innerHTML = 
            '<p style="text-align:center; color:#e63946;">⚠️ Erreur de chargement du menu</p>';
    });

function afficherRestaurant(restaurant) {
    document.getElementById('restaurant-nom').textContent = restaurant.nom;
    document.getElementById('restaurant-slogan').textContent = restaurant.slogan;
    document.getElementById('promo-texte').textContent = restaurant.promo;
}

function afficherCategories(categories) {
    const nav = document.getElementById('categories-nav');
    
    // Bouton "Tout voir"
    const btnTout = document.createElement('button');
    btnTout.className = 'cat-btn active';
    btnTout.textContent = '🍽️ Tout';
    btnTout.dataset.categorie = 'toutes';
    nav.appendChild(btnTout);
    
    categories.forEach((cat, index) => {
        const btn = document.createElement('button');
        btn.className = 'cat-btn';
        btn.textContent = `${cat.icone} ${cat.nom}`;
        btn.dataset.categorie = index;
        nav.appendChild(btn);
    });
}

function afficherTousLesProduits(categories) {
    const container = document.getElementById('produits-container');
    container.innerHTML = '';
    
    categories.forEach(cat => {
        const section = creerSectionCategorie(cat);
        container.appendChild(section);
    });
}

function creerSectionCategorie(categorie) {
    const section = document.createElement('section');
    section.className = 'categorie-section';
    section.dataset.categorie = categorie.nom;
    
    const titre = document.createElement('h2');
    titre.className = 'categorie-titre';
    titre.textContent = `${categorie.icone} ${categorie.nom}`;
    section.appendChild(titre);
    
    const grid = document.createElement('div');
    grid.className = 'produits-grid';
    
    categorie.produits.forEach(produit => {
        const card = creerCarteProduit(produit);
        grid.appendChild(card);
    });
    
    section.appendChild(grid);
    return section;
}

function creerCarteProduit(produit) {
    const card = document.createElement('div');
    card.className = 'produit-card';
    
    const imageHtml = produit.image 
        ? `<div class="produit-image-container">
              <img src="${produit.image}" alt="${produit.nom}" class="produit-image">
           </div>`
        : '';
    
    card.innerHTML = `
        <div class="produit-content">
            <h3 class="produit-nom">${produit.nom}</h3>
            <p class="produit-description">${produit.description}</p>
            <p class="produit-prix">$${produit.prix.toFixed(2)}</p>
        </div>
        ${imageHtml}
    `;
    
    return card;
}

function setupNavigation(categories) {
    const boutons = document.querySelectorAll('.cat-btn');
    const sections = document.querySelectorAll('.categorie-section');
    
    boutons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Mise à jour des boutons actifs
            boutons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const catIndex = btn.dataset.categorie;
            
            if (catIndex === 'toutes') {
                sections.forEach(s => s.style.display = 'block');
            } else {
                sections.forEach((s, i) => {
                    s.style.display = (i === parseInt(catIndex)) ? 'block' : 'none';
                });
            }
            
            // Scroll smooth vers le haut des produits
            document.getElementById('produits-container').scrollIntoView({ 
                behavior: 'smooth' 
            });
        });
    });
}