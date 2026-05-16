// === CONFIGURATION ===
const DISCORD_WEBHOOK_URL = 'https://discord.com/api/webhooks/1505192576494600395/Ee8Ol4i0vzMLhvi_YQSVt7Hodm1XsTM_pl_2jngcIah-FJOgkW6dDW2KXYPQV7uLiJke';

// === ÉTAT DU PANIER ===
let panier = [];
let produitsMap = {};

// === CHARGEMENT DES DONNÉES ===
fetch('./produits.json')
    .then(response => {
        if (!response.ok) throw new Error('Fichier introuvable');
        return response.json();
    })
    .then(data => {
        afficherRestaurant(data.restaurant);
        construireProduitsMap(data.categories);
        afficherCategories(data.categories);
        afficherTousLesProduits(data.categories);
        setupNavigation();
    })
    .catch(error => {
        console.error('Erreur:', error);
        document.getElementById('produits-container').innerHTML = 
            '<p style="text-align:center; color:#d74c7b; padding:50px;">⚠️ Impossible de charger le menu.<br>Vérifiez que produits.json est dans le même dossier.</p>';
    });

// === FONCTIONS D'AFFICHAGE ===
function afficherRestaurant(restaurant) {
    document.getElementById('restaurant-nom').textContent = restaurant.nom;
    document.getElementById('restaurant-slogan').textContent = restaurant.slogan;
    document.getElementById('promo-texte').textContent = restaurant.promo;
}

function construireProduitsMap(categories) {
    produitsMap = {};
    categories.forEach(cat => {
        cat.produits.forEach(produit => {
            produitsMap[produit.id] = produit;
        });
    });
}

function afficherCategories(categories) {
    const nav = document.getElementById('categories-nav');
    nav.innerHTML = '';
    
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
    
    // ⚡ Attacher les événements APRÈS avoir créé tous les produits
    attacherEvenementsBoutons();
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
            <button class="btn-ajouter" data-id="${produit.id}">➕ Ajouter</button>
        </div>
        ${imageHtml}
    `;
    
    return card;
}

function attacherEvenementsBoutons() {
    document.querySelectorAll('.btn-ajouter').forEach(btn => {
        btn.addEventListener('click', function() {
            const produitId = this.getAttribute('data-id');
            ajouterAuPanier(produitId);
        });
    });
}

// === GESTION DU PANIER ===
function ajouterAuPanier(produitId) {
    const existant = panier.find(item => item.id === produitId);
    if (existant) {
        existant.quantite++;
    } else {
        panier.push({ id: produitId, quantite: 1 });
    }
    mettreAJourPanier();
    animerAjoutPanier();
}

function retirerDuPanier(produitId) {
    const index = panier.findIndex(item => item.id === produitId);
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
    fermerPanier();
}

function calculerTotal() {
    return panier.reduce((total, item) => {
        const produit = produitsMap[item.id];
        return total + (produit ? produit.prix * item.quantite : 0);
    }, 0);
}

function mettreAJourPanier() {
    const compteur = document.getElementById('panier-compteur');
    const liste = document.getElementById('panier-liste');
    const totalEl = document.getElementById('panier-total');
    const btnCommander = document.getElementById('btn-commander');
    
    const nbArticles = panier.reduce((sum, item) => sum + item.quantite, 0);
    compteur.textContent = nbArticles;
    
    if (panier.length === 0) {
        liste.innerHTML = '<p class="panier-vide">Votre panier est vide</p>';
        totalEl.innerHTML = '';
        btnCommander.disabled = true;
    } else {
        liste.innerHTML = panier.map(item => {
            const produit = produitsMap[item.id];
            if (!produit) return '';
            return `
                <div class="panier-item">
                    <div class="panier-item-info">
                        <span class="panier-item-nom">${produit.nom}</span>
                        <span class="panier-item-prix">$${(produit.prix * item.quantite).toFixed(2)}</span>
                    </div>
                    <div class="panier-item-actions">
                        <button class="btn-qte" onclick="retirerDuPanier('${item.id}')">−</button>
                        <span class="panier-item-qte">${item.quantite}</span>
                        <button class="btn-qte" onclick="ajouterAuPanier('${item.id}')">+</button>
                    </div>
                </div>
            `;
        }).join('');
        
        const total = calculerTotal();
        totalEl.innerHTML = `
            <div class="panier-total-ligne">
                <span>Total</span>
                <span class="panier-total-prix">$${total.toFixed(2)}</span>
            </div>
        `;
        btnCommander.disabled = false;
    }
}

function animerAjoutPanier() {
    const compteur = document.getElementById('panier-compteur');
    compteur.classList.add('bounce');
    setTimeout(() => compteur.classList.remove('bounce'), 300);
}

// === OUVERTURE / FERMETURE PANIER ===
document.getElementById('panier-toggle').addEventListener('click', ouvrirPanier);
document.getElementById('panier-fermer').addEventListener('click', fermerPanier);
document.getElementById('panier-overlay').addEventListener('click', fermerPanier);

function ouvrirPanier() {
    document.getElementById('panier-sidebar').classList.add('open');
    document.getElementById('panier-overlay').classList.add('open');
}

function fermerPanier() {
    document.getElementById('panier-sidebar').classList.remove('open');
    document.getElementById('panier-overlay').classList.remove('open');
}

// === COMMANDE ===
document.getElementById('commande-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const nom = document.getElementById('client-nom').value.trim();
    const tel = document.getElementById('client-tel').value.trim();
    const type = document.getElementById('client-type').value;
    const numeroCommande = genererNumeroCommande();
    
    if (!nom) return;
    
    afficherConfirmation(numeroCommande);
    await envoyerVersDiscord(nom, tel, type, numeroCommande);
    
    viderPanier();
    document.getElementById('commande-form').reset();
});

function genererNumeroCommande() {
    const maintenant = new Date();
    const heures = String(maintenant.getHours()).padStart(2, '0');
    const minutes = String(maintenant.getMinutes()).padStart(2, '0');
    const aleatoire = Math.floor(Math.random() * 900) + 100;
    return `#${heures}${minutes}-${aleatoire}`;
}

function afficherConfirmation(numero) {
    document.getElementById('confirmation-numero').textContent = numero;
    document.getElementById('confirmation-overlay').classList.add('open');
    document.getElementById('confirmation-modal').classList.add('open');
    fermerPanier();
}

document.getElementById('confirmation-fermer').addEventListener('click', function() {
    document.getElementById('confirmation-overlay').classList.remove('open');
    document.getElementById('confirmation-modal').classList.remove('open');
});

// === ENVOI VERS DISCORD ===
async function envoyerVersDiscord(nom, tel, type, numeroCommande) {
    const maintenant = new Date();
    const heure = `${String(maintenant.getHours()).padStart(2, '0')}:${String(maintenant.getMinutes()).padStart(2, '0')}`;
    
    let message = `🦖 **Nouvelle commande Rex Diner !**\n\n`;
    message += `👤 **Client :** ${nom}\n`;
    if (tel) message += `📞 **Tél :** ${tel}\n`;
    message += `🏷️ **Type :** ${type}\n`;
    message += `📋 **Commande :** ${numeroCommande}\n`;
    message += `🕐 **Heure :** ${heure}\n`;
    message += `─────────────────────\n`;
    
    panier.forEach(item => {
        const produit = produitsMap[item.id];
        if (produit) {
            message += `${item.quantite}x ${produit.nom} — $${(produit.prix * item.quantite).toFixed(2)}\n`;
        }
    });
    
    message += `─────────────────────\n`;
    message += `💰 **Total : $${calculerTotal().toFixed(2)}**`;
    
    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content: message })
        });
    } catch (error) {
        console.error('Erreur webhook:', error);
    }
}

// === NAVIGATION ===
function setupNavigation() {
    document.getElementById('categories-nav').addEventListener('click', function(e) {
        if (!e.target.classList.contains('cat-btn')) return;
        
        document.querySelectorAll('.cat-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const catIndex = e.target.dataset.categorie;
        const sections = document.querySelectorAll('.categorie-section');
        
        if (catIndex === 'toutes') {
            sections.forEach(s => s.style.display = 'block');
        } else {
            sections.forEach((s, i) => {
                s.style.display = (i === parseInt(catIndex)) ? 'block' : 'none';
            });
        }
        
        document.getElementById('produits-container').scrollIntoView({ behavior: 'smooth' });
    });
}
