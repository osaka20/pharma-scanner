# Pharma Scanner - Gestion de Pharmacie 💊

Application de gestion de produits de pharmacie, **offline** et **légère**, sans dépendance réseau.

## 🌍 Langues supportées

L'application est disponible en **français** et **anglais**. Changez la langue avec le sélecteur en haut à droite de la barre de navigation.

## 📋 Fonctionnalités

### Tableau de Bord
- **Total de produits** en stock
- **Valeur totale** du stock
- **Marge totale** réalisée
- Liste des **produits récemment ajoutés**

### Catalogue de Produits
- 📊 **Tableau filtrable et triable**
  - Filtrer par marque
  - Trier par nom, prix, marge ou quantité
  - Recherche globale par nom/marque/code
- 📄 **Pagination** pour affichage optimisé
- ✏️ **Modification rapide** des produits
- 🗑️ **Suppression** avec confirmation

### Fiche Produit Détaillée
- Affichage complet de toutes les informations
- Calcul automatique de la **marge** et du **pourcentage de marge**
- Valeur totale du stock pour le produit
- Édition et suppression directes

### Import / Export
- 📤 **Export en JSON** pour sauvegarde
- 📥 **Import** d'une base exportée précédemment
- Historique des opérations d'import/export
- **Restauration complète** de la base de données

## 🛠️ Installation

### Prérequis
- **Node.js** 16+ et **npm** (ou **yarn**)
- Un navigateur moderne (Chrome, Firefox, Safari, Edge)

### Étapes

1. **Cloner le projet**
   ```bash
   git clone <URL_DU_REPO>
   cd pharma-scanner
   ```

2. **Installer les dépendances**
   ```bash
   npm install
   ```

3. **Lancer en développement**
   ```bash
   npm run dev
   ```
   L'app ouvrira sur `http://localhost:5173`

4. **Construire pour la production**
   ```bash
   npm run build
   ```
   Les fichiers seront dans le dossier `dist/`

## 📊 Champs Produit

| Champ | Type | Description |
|-------|------|-------------|
| **Nom** | Texte | Nom du produit (obligatoire) |
| **Marque** | Texte | Label/marque du produit (obligatoire) |
| **Code** | Texte | Code interne optionnel |
| **Prix d'achat** | Nombre | Coût d'acquisition |
| **Prix de vente** | Nombre | Montant de vente |
| **Marge** | Nombre | Calculée automatiquement (vente - achat) |
| **Quantité** | Nombre | Unités en stock |
| **Notes** | Texte | Informations libres |

### Calculs Automatiques
- **Marge** = Prix de vente - Prix d'achat
- **% Marge** = (Marge / Prix d'achat) × 100
- **Valeur stock** = Quantité × Prix de vente
- **Marge totale stock** = Quantité × Marge

## 💾 Gestion des Données

Les données sont **stockées localement** dans votre navigateur via **IndexedDB**, totalement **hors ligne** et **sécurisé**.

### Sauvegarde
1. Allez dans **Import / Export**
2. Cliquez sur **Exporter en JSON**
3. Un fichier `pharma-db-YYYY-MM-DD.json` sera téléchargé

### Restauration
1. Allez dans **Import / Export**
2. Cliquez sur **Sélectionner un fichier**
3. Choisissez un fichier JSON précédemment exporté
4. Cliquez sur **Importer**
5. **Confirmez** (ceci remplacera tous les produits actuels)

## 🎨 Interface

- **Design moderne** et responsif
- **Palette couleur** violet/bleu pour une identité visuelle cohérente
- **Boutons visibles** et intuitifs
- **Messages de validation** clairs
- **Mode sombre** compatible (selon les paramètres du système)

## ⚡ Performance

- ✅ **Aucune connexion internet** requise
- ✅ **Chargement instantané** de l'interface
- ✅ **Base de données embarquée** (IndexedDB)
- ✅ **Pagination** pour listes longues
- ✅ **Recherche optimisée** en temps réel

## 🗂️ Structure du Projet

```
pharma-scanner/
├── src/
│   ├── main.js              # Point d'entrée Vue
│   ├── App.vue              # Composant racine
│   ├── style.scss           # Styles globaux
│   ├── components/
│   │   └── ProductForm.vue  # Formulaire produit réutilisable
│   ├── views/
│   │   ├── Dashboard.vue    # Tableau de bord
│   │   ├── Products.vue     # Catalogue & liste
│   │   ├── ProductDetail.vue# Détails produit
│   │   └── ImportExport.vue # Import/Export
│   ├── stores/
│   │   └── productStore.js  # Store Pinia
│   ├── db/
│   │   └── database.js      # Gestion IndexedDB
│   ├── i18n/
│   │   ├── index.js         # Config i18n
│   │   └── locales/
│   │       ├── fr.json      # Traductions français
│   │       └── en.json      # Traductions anglais
│   └── router/
│       └── index.js         # Vue Router
├── public/                  # Assets statiques
├── index.html               # HTML principal
├── vite.config.js          # Config Vite
├── package.json            # Dépendances
└── README.md               # Ce fichier
```

## 🚀 Utilisation Rapide

### Ajouter un Produit
1. Cliquez sur **+ Ajouter un Produit**
2. Remplissez les champs requis (Nom, Marque)
3. Entrez les prix → la **marge se calcule automatiquement**
4. Cliquez **Enregistrer**

### Chercher un Produit
1. Utilisez la **barre de recherche** (nom/marque/code)
2. Filtrez par **marque** dans le sélecteur
3. Triez par **nom/prix/marge/quantité**

### Modifier un Produit
1. Cliquez **Modifier** dans la ligne
2. Ou cliquez sur le **nom du produit** pour voir les détails
3. Modifiez les champs
4. Cliquez **Enregistrer**

### Supprimer un Produit
1. Cliquez **Supprimer** dans la ligne
2. Confirmez la suppression

## 📱 Responsive Design

- ✅ Fonctionne sur **Desktop**
- ✅ Adapté aux **tablettes**
- ✅ Vue compacte sur **petits écrans**

## 🔐 Sécurité & Confidentialité

- ✅ **Zéro données** envoyées sur le serveur
- ✅ Données stockées **localement seulement**
- ✅ Aucune **authentification requise**
- ✅ **Sauvegarde manuelle** pour migration

## 🛡️ Gestion des Erreurs

L'application gère :
- ❌ Prix/quantités invalides
- ❌ Champs vides obligatoires
- ❌ Doublons (acceptés, mais avec alertes si utile)
- ❌ Marges négatives (affichées en rouge)

## 🚧 Évolutions Futures

- [ ] Support multi-pharmacies
- [ ] Blocage d'accès par pharmacie
- [ ] Système d'authentification
- [ ] Synchronisation cloud optionnelle
- [ ] Rapports avancés (PDF, graphiques)
- [ ] Gestion des catégories
- [ ] Alertes de stock bas

## 📄 License

MIT - Libre d'utilisation et de modification

## 👨‍💻 Développement

Contributeurs bienvenue! N'hésitez pas à créer des issues ou des pull requests.

---

**Besoin d'aide?** Consultez le code source ou la structure du projet. L'app est faite pour être simple et lisible! 💡
