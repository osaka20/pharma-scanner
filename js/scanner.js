// js/scanner.js - SCANNER QUAGGAJS COMPLET

import * as db from './db.js';
import { getCurrentUser } from './auth.js';
import { t } from './i18n.js';
import { showToast } from './ui.js';

let isScanning = false;
let currentStream = null;

// Charger QuaggaJS dynamiquement
const QuaggaScript = document.createElement('script');
QuaggaScript.src = 'https://cdn.jsdelivr.net/npm/@ericblade/quagga2@1.8.4/dist/quagga.min.js';
document.head.appendChild(QuaggaScript);

export async function initScanner() {
    const startBtn = document.getElementById('start-scan-btn');
    const stopBtn = document.getElementById('stop-scan-btn');
    const manualBtn = document.getElementById('manual-entry-btn');
    
    if (startBtn) startBtn.addEventListener('click', startScanning);
    if (stopBtn) stopBtn.addEventListener('click', stopScanning);
    if (manualBtn) manualBtn.addEventListener('click', showManualEntry);
}

async function startScanning() {
    if (isScanning) return;
    
    // Attendre que Quagga soit chargé
    if (typeof Quagga === 'undefined') {
        await new Promise(resolve => {
            QuaggaScript. onload = resolve;
        });
    }
    
    isScanning = true;
    document.getElementById('start-scan-btn')?.classList.add('hidden');
    document.getElementById('stop-scan-btn')?.classList.remove('hidden');
    
    const container = document.getElementById('scanner-container');
    container.innerHTML = `
        <div id="interactive" class="viewport">
            <video autoplay playsinline></video>
            <canvas class="drawingBuffer"></canvas>
        </div>
        <div class="scanner-overlay">
            <div class="scan-frame">
                <div class="corner tl"></div>
                <div class="corner tr"></div>
                <div class="corner bl"></div>
                <div class="corner br"></div>
                <div class="scan-line"></div>
            </div>
            <p class="scan-text">Positionnez le code-barres dans le cadre</p>
        </div>
    `;
    container.classList.remove('hidden');
    
    showToast('Démarrage du scanner...', 'info');
    
    try {
        await initQuagga();
    } catch (error) {
        console.error('Scanner error:', error);
        showToast('Erreur caméra.  Vérifiez les permissions.', 'error');
        stopScanning();
    }
}

function initQuagga() {
    return new Promise((resolve, reject) => {
        Quagga.init({
            inputStream: {
                name: "Live",
                type: "LiveStream",
                target: document.querySelector('#interactive'),
                constraints: {
                    width: { min: 640, ideal: 1280, max: 1920 },
                    height: { min: 480, ideal: 720, max: 1080 },
                    facingMode: "environment",
                    aspectRatio: { min: 1, max: 2 }
                },
                area: {
                    top: "20%",
                    right: "10%",
                    left: "10%",
                    bottom: "20%"
                }
            },
            locator: {
                patchSize: "medium",
                halfSample: true
            },
            numOfWorkers: navigator.hardwareConcurrency || 4,
            frequency: 10,
            decoder: {
                readers: [
                    "ean_reader",
                    "ean_8_reader",
                    "code_128_reader",
                    "code_39_reader",
                    "upc_reader",
                    "upc_e_reader"
                ],
                multiple: false
            },
            locate: true
        }, function(err) {
            if (err) {
                console.error(err);
                reject(err);
                return;
            }
            
            console.log("✅ Scanner initialisé");
            Quagga.start();
            resolve();
        });
        
        Quagga.onDetected(handleDetection);
    });
}

async function handleDetection(result) {
    if (! isScanning) return;
    
    const code = result.codeResult.code;
    console.log("📷 Code détecté:", code);
    
    // Validation basique
    if (code && code.length >= 8) {
        // Feedback
        playBeep();
        vibrate();
        
        stopScanning();
        await searchProduct(code);
    }
}

async function searchProduct(barcode) {
    showToast('🔍 Recherche du produit...', 'info');
    
    // 1. Vérifier localement
    const user = getCurrentUser();
    if (user) {
        const products = await db.getAllProducts(user.id);
        const local = products.find(p => p.barcode === barcode);
        if (local) {
            showProductDialog(local, barcode, true);
            return;
        }
    }
    
    // 2. APIs externes
    const productData = await fetchFromAPIs(barcode);
    
    if (productData) {
        showAddDialog(productData, barcode);
    } else {
        showNotFoundDialog(barcode);
    }
}

async function fetchFromAPIs(barcode) {
    // API 1: Open Food Facts
    try {
        const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}. json`);
        const data = await res.json();
        
        if (data.status === 1 && data.product) {
            const p = data.product;
            return {
                name:  p.product_name || p.generic_name || 'Produit',
                description: p.ingredients_text || p.generic_name_fr || '',
                manufacturer: p.brands || '',
                imageUrl: p.image_url || p.image_front_url || null,
                category: detectCategory(p.product_name + ' ' + p.ingredients_text),
                source: 'Open Food Facts'
            };
        }
    } catch (e) {
        console.log('OpenFoodFacts:  non trouvé');
    }
    
    // API 2: Base Médicaments France
    try {
        const res = await fetch(`https://base-donnees-publique.medicaments.gouv.fr/api/v1/medicaments? code_cip=${barcode}`);
        const data = await res.json();
        
        if (data && data.length > 0) {
            const med = data[0];
            return {
                name: med.denomination || '',
                description: med.composition || '',
                manufacturer: med. titulaire || '',
                category: detectCategory(med.composition),
                source: 'Base Médicaments'
            };
        }
    } catch (e) {
        console.log('Base Médicaments: non trouvé');
    }
    
    return null;
}

function detectCategory(text) {
    if (!text) return 'Autre';
    
    const t = text.toLowerCase();
    
    const cats = {
        'Antidouleur': ['paracetamol', 'paracétamol', 'ibuprofene', 'ibuprofène', 'aspirine', 'doliprane'],
        'Antibiotique': ['amoxicilline', 'azithromycine', 'penicillin'],
        'Vitamines': ['vitamine', 'vitamin', 'calcium', 'magnesium'],
        'Digestif': ['omeprazole', 'gaviscon', 'smecta'],
    };
    
    for (const [cat, words] of Object.entries(cats)) {
        if (words.some(w => t.includes(w))) return cat;
    }
    
    return 'Autre';
}

function showAddDialog(data, barcode) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>✅ Produit Trouvé!</h3>
            ${data.imageUrl ? `<img src="${data.imageUrl}" style="max-width: 200px;border-radius:8px;margin: 10px auto;display:block;">` : ''}
            <p><strong>Nom:</strong> ${data.name}</p>
            ${data.description ? `<p><strong>Description:</strong> ${data.description. substring(0, 100)}...</p>` : ''}
            ${data.manufacturer ? `<p><strong>Fabricant:</strong> ${data.manufacturer}</p>` : ''}
            <p><strong>Catégorie:</strong> ${data.category}</p>
            <p><small>Source: ${data.source}</small></p>
            <hr>
            <label>Prix (€) *</label>
            <input type="number" id="quick-price" step="0.01" min="0" placeholder="9.99" style="width:100%;padding:10px;margin:10px 0;">
            <div style="display:flex;gap:10px;">
                <button onclick="this.closest('. modal-overlay').remove()" style="flex:1;padding:10px;background:#ccc;border: none;border-radius:5px;">Annuler</button>
                <button onclick="addQuickProduct()" style="flex:1;padding: 10px;background:#667eea;color:white;border:none;border-radius:5px;">Ajouter</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    window.tempProductData = { ...data, barcode };
}

window.addQuickProduct = async function() {
    const price = document.getElementById('quick-price').value;
    if (!price || parseFloat(price) <= 0) {
        alert('Prix invalide');
        return;
    }
    
    const user = getCurrentUser();
    if (!user) {
        alert('Connectez-vous d\'abord');
        return;
    }
    
    const data = window.tempProductData;
    const product = {
        barcode: data.barcode,
        name: data.name,
        price: parseFloat(price),
        description: data.description || '',
        category: data.category,
        imageUrl: data.imageUrl || null,
        userId: user.id,
        createdAt: new Date().toISOString(),
        favorite: false
    };
    
    try {
        await db.addProduct(product);
        showToast('✅ Produit ajouté!', 'success');
        document.querySelector('.modal-overlay').remove();
        
        // Retour à la liste
        if (window.showTab) window.showTab('products');
    } catch (error) {
        alert('Erreur:  ' + error.message);
    }
};

function showNotFoundDialog(barcode) {
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <h3>❌ Produit Non Trouvé</h3>
            <p>Code-barres: ${barcode}</p>
            <p>Ce produit n'est pas dans nos bases. </p>
            <div style="display:flex;gap:10px;">
                <button onclick="this. closest('.modal-overlay').remove()" style="flex:1;padding:10px;background:#ccc;border:none;border-radius:5px;">Fermer</button>
                <button onclick="addManualProduct('${barcode}')" style="flex:1;padding:10px;background:#667eea;color:white;border:none;border-radius:5px;">Ajouter Manuellement</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

window.addManualProduct = function(barcode) {
    document.querySelector('.modal-overlay')?.remove();
    if (window.showTab) {
        window.showTab('add');
        setTimeout(() => {
            const input = document.getElementById('product-barcode');
            if (input) input.value = barcode;
        }, 100);
    }
};

function stopScanning() {
    if (!isScanning) return;
    
    isScanning = false;
    
    if (typeof Quagga !== 'undefined') {
        Quagga.stop();
    }
    
    document.getElementById('start-scan-btn')?.classList.remove('hidden');
    document.getElementById('stop-scan-btn')?.classList.add('hidden');
    document.getElementById('scanner-container')?.classList.add('hidden');
}

function showManualEntry() {
    const code = prompt('Entrez le code-barres manuellement:');
    if (code && code.trim()) {
        searchProduct(code. trim());
    }
}

function playBeep() {
    try {
        const ctx = new (window.AudioContext || window. webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency. value = 800;
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        
        osc. start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.2);
    } catch (e) {}
}

function vibrate() {
    if ('vibrate' in navigator) {
        navigator.vibrate(200);
    }
}

export { startScanning, stopScanning };