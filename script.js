// === CONFIGURATION ===
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1505192576494600395/Ee8Ol4i0vzMLhvi_YQSVt7Hodm1XsTM_pl_2jngcIah-FJOgkW6dDW2KXYPQV7uLiJke';

// === ÉTAT DU PANIER ===
let panier = [];
let produitsMap = {};

// === DONNÉES ===
const DATA = {
  restaurant: {
    nom: "REX DINER",
    slogan: "Open 24/7 - Since 1954",
    promo: "⭐ 5 menus achetés = 1 offert ! ⭐"
  },
  categories: [
    {
      nom: "Menus & Formules",
      icone: "🦖",
      produits: [
        { id: "menu-1", nom: "Rexpress", description: "Churros salé + Café", prix: 50, image: "images/rexpressmenu.png" },
        { id: "menu-2", nom: "Bronto (végé)", description: "Rings + Ice Tea", prix: 65, image: "images/brontomenu.png" },
        { id: "menu-3", nom: "Breakfast", description: "Petit-déjeuner + Café + Pancakes", prix: 70, image: "images/breakfastmenu.png" },
        { id: "menu-4", nom: "Raptor", description: "Steak frites + Pumpkin Spice Latte + Soda Cola", prix: 90, image: "images/raptormenu.png" },
        { id: "menu-5", nom: "Rex", description: "Burger + Pilons de poulet + Milkshake pomme caramel + Ice Tea", prix: 130, image: "images/rexmenu.png" }
      ]
    },
    {
      nom: "Plats",
      icone: "🍖",
      produits: [
        { id: "plat-1", nom: "Breakfast", description: "Petit-déjeuner complet", prix: 30, image: "images/breakfast.png" },
        { id: "plat-2", nom: "Pilons de poulet", description: "6 pièces marinées", prix: 30, image: "images/pilonsdepoulet.png" },
        { id: "plat-3", nom: "Bucket de poisson", description: "Poisson frit croustillant", prix: 25, image: "images/bucketdepoisson.png" },
        { id: "plat-4", nom: "Rings", description: "Anneaux frits", prix: 35, image: "images/rings.png" },
        { id: "plat-5", nom: "Churros salé", description: "Churros version salée", prix: 35, image: "images/churrossale.png" },
        { id: "plat-6", nom: "Rex Burger", description: "Le burger signature", prix: 45, image: "images/rexburger.png" },
        { id: "plat-7", nom: "Steak frites", description: "Steak haché + frites maison", prix: 45, image: "images/steakfrites.png" }
      ]
    },
    {
      nom: "Desserts",
      icone: "🍩",
      produits: [
        { id: "dessert-1", nom: "Donut glacé", description: "Glaçage vanille ou chocolat", prix: 20, image: "images/donutglace.png" },
        { id: "dessert-2", nom: "Pancakes", description: "Stack de 3 pancakes", prix: 20, image: "images/pancakes.png" },
        { id: "dessert-3", nom: "Cheesecake myrtilles", description: "Coulis de myrtilles maison", prix: 25, image: "images/cheesecakemyrtilles.png" },
        { id: "dessert-4", nom: "Cinnamon Rolls", description: "Roulés à la cannelle", prix: 30, image: "images/cinnamonrolls.png" }
      ]
    },
    {
      nom: "Boissons",
      icone: "🥤",
      produits: [
        { id: "boisson-1", nom: "Soda Cola", description: "33cl", prix: 15, image: "images/sodacola.png" },
        { id: "boisson-2", nom: "Café", description: "Café filtre américain", prix: 15, image: "images/cafe.png" },
        { id: "boisson-3", nom: "Milkshake mangue", description: "Fruits frais mixés", prix: 25, image: "images/milkshakemangue.png" },
        { id: "boisson-4", nom: "Milkshake pomme caramel", description: "Pomme fraîche + caramel beurre salé", prix: 25, image: "images/milkshakepommecaramel.png" },
        { id: "boisson-5", nom: "Ice Tea", description: "Pêche ou citron", prix: 30, image: "images/icetea.png" },
        { id: "boisson-6", nom: "Pumpkin Spice Latte", description: "Latte épicé à la citrouille", prix: 30, image: "images/pumpkinspicelatte.png" }
      ]
    }
  ]
};

// === DÉMARRAGE ===
(function() {
    document.getElementById('restaurant-nom').textContent = DATA.restaurant.nom;
    document.getElementById('restaurant-slogan').textContent = DATA.restaurant.slogan;
    document.getElementById('promo-texte').textContent = DATA.restaurant.promo;
    
    // Construire la map des produits
    DATA.categories.forEach(function(cat) {
        cat.produits.forEach(function(produit) {
            produitsMap[produit.id] = produit;
        });
    });
    
    // Créer la navigation
    var nav = document.getElementById('categories-nav');
    nav.innerHTML = '<button class="cat-btn active" data-categorie="toutes">🍽️ Tout</button>';
    DATA.categories.forEach(function(cat, index) {
        nav.innerHTML += '<button class="cat-btn" data-categorie="' + index + '">' + cat.icone + ' ' + cat.nom + '</button>';
    });
    
    // Créer les produits
    var container = document.getElementById('produits-container');
    container.innerHTML = '';
    
    DATA.categories.forEach(function(cat) {
        var html = '<section class="categorie-section"><h2 class="categorie-titre">' + cat.icone + ' ' + cat.nom + '</h2><div class="produits-grid">';
        
        cat.produits.forEach(function(produit) {
            var imageHtml = produit.image 
                ? '<div class="produit-image-container"><img src="' + produit.image + '" alt="' + produit.nom + '" class="produit-image"></div>'
                : '';
            
            html += '<div class="produit-card">' +
                '<div class="produit-content">' +
                '<h3 class="produit-nom">' + produit.nom + '</h3>' +
                '<p class="produit-description">' + produit.description + '</p>' +
                '<p class="produit-prix">$' + produit.prix.toFixed(2) + '</p>' +
                '<button class="btn-ajouter" data-id="' + produit.id + '">➕ Ajouter</button>' +
                '</div>' +
                imageHtml +
                '</div>';
        });
        
        html += '</div></section>';
        container.innerHTML += html;
    });
    
    // Attacher les événements aux boutons
    document.querySelectorAll('.btn-ajouter').forEach(function(btn) {
        btn.addEventListener('click', function() {
            ajouterAuPanier(this.getAttribute('data-id'));
        });
    });
    
    // Navigation
    document.getElementById('categories-nav').addEventListener('click', function(e) {
        if (!e.target.classList.contains('cat-btn')) return;
        
        document.querySelectorAll('.cat-btn').forEach(function(b) { b.classList.remove('active'); });
        e.target.classList.add('active');
        
        var catIndex = e.target.dataset.categorie;
        var sections = document.querySelectorAll('.categorie-section');
        
        if (catIndex === 'toutes') {
            sections.forEach(function(s) { s.style.display = 'block'; });
        } else {
            sections.forEach(function(s, i) {
                s.style.display = (i === parseInt(catIndex)) ? 'block' : 'none';
            });
        }
    });
})();

// === PANIER ===
function ajouterAuPanier(produitId) {
    var existant = panier.find(function(item) { return item.id === produitId; });
    if (existant) {
        existant.quantite++;
    } else {
        panier.push({ id: produitId, quantite: 1 });
    }
    mettreAJourPanier();
}

function retirerDuPanier(produitId) {
    var index = panier.findIndex(function(item) { return item.id === produitId; });
    if (index !== -1) {
        if (panier[index].quantite > 1) {
            panier[index].quantite--;
        } else {
            panier.splice(index, 1);
        }
    }
    mettreAJourPanier();
}

function viderPanier() {
    panier = [];
    mettreAJourPanier();
    document.getElementById('panier-sidebar').classList.remove('open');
    document.getElementById('panier-overlay').classList.remove('open');
}

function calculerTotal() {
    var total = 0;
    panier.forEach(function(item) {
        var produit = produitsMap[item.id];
        if (produit) total += produit.prix * item.quantite;
    });
    return total;
}

function mettreAJourPanier() {
    var compteur = document.getElementById('panier-compteur');
    var liste = document.getElementById('panier-liste');
    var totalEl = document.getElementById('panier-total');
    var btnCommander = document.getElementById('btn-commander');
    
    var nbArticles = 0;
    panier.forEach(function(item) { nbArticles += item.quantite; });
    compteur.textContent = nbArticles;
    
    if (panier.length === 0) {
        liste.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
        totalEl.innerHTML = '';
        btnCommander.disabled = true;
    } else {
        var html = '';
        panier.forEach(function(item) {
            var produit = produitsMap[item.id];
            if (produit) {
                html += '<div class="panier-item">' +
                    '<div class="panier-item-info">' +
                    '<span class="panier-item-nom">' + produit.nom + '</span>' +
                    '<span class="panier-item-prix">$' + (produit.prix * item.quantite).toFixed(2) + '</span>' +
                    '</div>' +
                    '<div class="panier-item-actions">' +
                    '<button class="btn-qte" onclick="retirerDuPanier(\'' + item.id + '\')">−</button>' +
                    '<span class="panier-item-qte">' + item.quantite + '</span>' +
                    '<button class="btn-qte" onclick="ajouterAuPanier(\'' + item.id + '\')">+</button>' +
                    '</div>' +
                    '</div>';
            }
        });
        liste.innerHTML = html;
        
        totalEl.innerHTML = '<div class="panier-total-ligne"><span>Total</span><span class="panier-total-prix">$' + calculerTotal().toFixed(2) + '</span></div>';
        btnCommander.disabled = false;
    }
}

// === PANIER OUVERTURE/FERMETURE ===
document.getElementById('panier-toggle').addEventListener('click', function() {
    document.getElementById('panier-sidebar').classList.add('open');
    document.getElementById('panier-overlay').classList.add('open');
});

document.getElementById('panier-fermer').addEventListener('click', function() {
    document.getElementById('panier-sidebar').classList.remove('open');
    document.getElementById('panier-overlay').classList.remove('open');
});

document.getElementById('panier-overlay').addEventListener('click', function() {
    document.getElementById('panier-sidebar').classList.remove('open');
    document.getElementById('panier-overlay').classList.remove('open');
});

// === COMMANDE ===
document.getElementById('commande-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    var nom = document.getElementById('client-nom').value.trim();
    var tel = document.getElementById('client-tel').value.trim();
    var numero = '#' + Math.floor(Math.random() * 9000 + 1000);
    
    if (!nom) return;
    
    document.getElementById('confirmation-numero').textContent = numero;
    document.getElementById('confirmation-overlay').classList.add('open');
    document.getElementById('confirmation-modal').classList.add('open');
    
    var message = '<@&1221768622825799750>\n🦖 **Nouvelle commande Rex Diner !**\n\n';
    message += '👤 **Client :** ' + nom + '\n';
    if (tel) message += '📞 **Tél :** ' + tel + '\n';
    message += '📋 **Commande :** ' + numero + '\n';
    message += '─────────────────────\n';
    
    panier.forEach(function(item) {
        var produit = produitsMap[item.id];
        if (produit) {
            message += item.quantite + 'x ' + produit.nom + ' — $' + (produit.prix * item.quantite).toFixed(2) + '\n';
        }
    });
    
    message += '─────────────────────\n';
    message += '💰 **Total : $' + calculerTotal().toFixed(2) + '**';
    
    fetch(DISCORD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: message, allowed_mentions: { parse: ['roles'] } })
    });
    
    viderPanier();
    document.getElementById('commande-form').reset();
});

// === CONFIRMATION ===
document.getElementById('confirmation-fermer').addEventListener('click', function() {
    document.getElementById('confirmation-overlay').classList.remove('open');
    document.getElementById('confirmation-modal').classList.remove('open');
});
