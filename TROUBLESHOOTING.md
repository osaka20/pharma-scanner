# 🚨 Dépannage - Pharma Scanner

Guide pour résoudre les problèmes courants.

## ❌ L'app ne démarre pas

### Erreur: "Node.js not found"
```
Cause: Node.js n'est pas installé
Solution:
1. Téléchargez Node.js depuis https://nodejs.org/
2. Installez la version LTS (16+)
3. Redémarrez votre terminal
4. Vérifiez: node --version
5. Lancez: npm install && npm run dev
```

### Erreur: "Port 5173 is already in use"
```
Cause: Un autre processus utilise le port 5173
Solution (Linux/Mac):
  lsof -i :5173
  kill -9 <PID>
  npm run dev

Solution (Windows):
  Ouvrez un autre terminal
  Ou utilisez un port différent:
  npm run dev -- --port 5174
```

### Erreur: "Missing dependencies"
```
Cause: node_modules incomplet
Solution:
1. rm -rf node_modules package-lock.json
2. npm install
3. npm run dev
```

---

## ⚠️ Problèmes au démarrage

### Blanc à l'écran (Nothing appears)
```
Vérifications:
1. Console navigateur (F12): y-a-t-il des erreurs?
2. Vérifiez que le serveur tourne: npm run dev
3. Redémarrez: Ctrl+C puis npm run dev
4. Attendez le HMR: "ready in X ms"
```

### Boutons/style cassés
```
Cause: CSS pas chargé
Solution:
1. Videz le cache navigateur: Ctrl+Shift+Delete
2. Hard refresh: Ctrl+Shift+R (Windows) ou Cmd+Shift+R (Mac)
3. Redémarrez le serveur dev
```

### Traductions manquantes
```
Cause: i18n pas chargé
Solution:
1. Vérifiez: src/i18n/locales/fr.json et en.json existent
2. Redémarrez: npm run dev
3. Vérifiez console (F12) pour erreurs
```

---

## 💾 Problèmes de données

### Données disparues après fermeture
```
Cause: IndexedDB limité ou cache navigateur vidé
Solution:
1. Activez le stockage persistant du navigateur
2. Ne supprimez pas les cookies/cache
3. Exportez régulièrement en JSON (Import/Export)
4. Gardez les fichiers JSON en sécurité

Restauration:
1. Allez dans Import/Export
2. Choisissez le fichier .json sauvegardé
3. Cliquez Importer et confirmez
```

### Erreur lors de l'import
```
Cause: Fichier JSON invalide ou corrompu
Solution:
1. Vérifiez le format JSON: https://jsonlint.com/
2. Ouvrez le fichier dans un éditeur texte
3. Utilisez une sauvegarde antérieure
4. Vérifiez que c'est bien un export de Pharma Scanner
```

### "IndexedDB quota exceeded"
```
Cause: Trop de données stockées
Solution:
1. Supprimez les anciens produits
2. Exportez en JSON
3. Videz le stockage IndexedDB
4. Réimportez si besoin
```

---

## 🔍 Problèmes de recherche/filtrage

### Recherche ne fonctionne pas
```
Cause: Possible bug ou données mal formatées
Solution:
1. Rafraîchissez: F5
2. Vérifiez que les produits ont des noms/marques
3. Console (F12): vérifiez les erreurs
4. Redémarrez: npm run dev
```

### Filtre par marque vide
```
Cause: Les produits n'ont pas de marque
Solution:
1. Ajoutez une marque à tous les produits
2. Rafraîchissez (F5)
3. Réessayez le filtrage
```

---

## 🎨 Problèmes d'affichage

### Interface décalée/mal alignée
```
Cause: Problème CSS ou résolution
Solution:
1. Redimensionnez la fenêtre
2. Appuyez sur F11 puis F11 (plein écran)
3. Videz le cache: Ctrl+Shift+Delete
4. Hard refresh: Ctrl+Shift+R
```

### Texte trop petit/grand
```
Cause: Zoom navigateur
Solution:
1. Ctrl++ pour agrandir
2. Ctrl+- pour réduire
3. Ctrl+0 pour réinitialiser
4. Allez dans Paramètres → Zoom
```

### Mode sombre problématique
```
Cause: Préférences système conflictuent
Solution:
1. Changez le thème système
2. Videz le cache navigateur
3. Hard refresh: Ctrl+Shift+R
```

---

## 🌍 Problèmes multilingues

### Langue ne change pas
```
Cause: localStorage corrompu
Solution:
1. Ouvrez F12 → Application → Local Storage
2. Supprimez "language"
3. Rafraîchissez (F5)
4. Changez la langue
```

### Traductions vides
```
Cause: i18n pas chargé correctement
Vérifications:
1. src/i18n/index.js existe
2. src/i18n/locales/fr.json existe
3. npm run dev réaffiche "ready in Xms"
```

---

## 📊 Problèmes de calculs

### Marge affichée incorrectement
```
Cause: Problème de conversion nombre
Vérification:
1. Vérifiez les prix: sont-ce des nombres?
2. Pas de symboles €, $, etc. dans les champs
3. Utilisez . pour les décimales (pas ,)
4. Rafraîchissez après modification
```

### "NaN" ou "undefined" affiché
```
Cause: Données corrompues ou manquantes
Solution:
1. Modifiez le produit
2. Remplissez tous les champs correctement
3. Enregistrez
4. Rafraîchissez
```

---

## 🚀 Problèmes de performance

### App lente au démarrage
```
Cause: Beaucoup de produits (>10000)
Solution:
1. Attendez le chargement complet
2. Activez la pagination
3. Supprimez les anciens produits
4. Utilisez la recherche pour limiter les résultats
```

### Recherche lente
```
Cause: Beaucoup de produits avec gros textes
Solution:
1. Utilisez le filtre par marque d'abord
2. Puis cherchez dans les résultats
3. Considérez supprimer les archives
```

---

## 🔄 Problèmes sync/multi-onglets

### Données pas synchronisées entre onglets
```
Note: C'est une limitation connue de IndexedDB
Workaround:
1. Exportez/importez entre sessions
2. Ou fermez les autres onglets pendant édition
3. Rafraîchissez après changement d'onglet
```

---

## 🛠️ Debug Avancé

### Activer les logs de console
```javascript
// Dans console navigateur (F12):
localStorage.setItem('debug', 'true')
// Puis rafraîchissez

// Voir les produits:
indexedDB.databases().then(dbs => console.log(dbs))

// Voir localStorage:
console.log(localStorage)
```

### Inspecter IndexedDB
```
Navigateur (F12) → Application → IndexedDB → PharmaDB
Voir toutes les données stockées
```

### Forcer un reset
```javascript
// ⚠️ ATTENTION: Supprime TOUTES les données!
indexedDB.deleteDatabase('PharmaDB')
location.reload()
```

---

## 📧 Si le problème persiste

Informations à avoir:
1. Version Node.js: `node --version`
2. Version npm: `npm --version`
3. Navigateur utilisé (nom + version)
4. Système (Windows/Mac/Linux)
5. Message d'erreur exact (F12 Console)
6. Étapes pour reproduire

### Vérification diagnostic complète
```bash
# Lancez ceci et mettez le résultat dans le rapport:
node --version
npm --version
npm list vue
npm list vite
node_modules/.bin/vite --version
```

---

## ✅ Checklist "ça ne marche pas"

- [ ] Avez-vous fermé le terminal (npm run dev arrêté)?
- [ ] Avez-vous vidé le cache navigateur (Ctrl+Shift+Delete)?
- [ ] Avez-vous essayé un hard refresh (Ctrl+Shift+R)?
- [ ] Avez-vous vérifiez les erreurs F12 (Console)?
- [ ] Avez-vous réinstallé node_modules?
- [ ] Votre version Node.js est-elle 16+?
- [ ] Votre disque a-t-il de l'espace disponible?
- [ ] Avez-vous redémarré votre ordinateur?

---

## 💡 Si vous êtes bloqué

1. Consultez **README.md** (documentation complète)
2. Consultez **GUIDE_UTILISATEUR.html** (tutoriel visuel)
3. Vérifiez **STRUCTURE.md** (architecture)
4. Lisez les **commentaires du code** (bien documenté)

---

**Bon dépannage!** 🔧  
Si vous trouvez un vrai bug, considérez créer une issue sur GitHub.
