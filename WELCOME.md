# 💊 Bienvenue dans Pharma Scanner!

Merci d'avoir choisi cette application pour gérer votre pharmacie.

## 🎯 C'est quoi?

**Pharma Scanner** est une application de gestion de produits de pharmacie:
- ✅ **Offline** - fonctionne sans Internet
- ✅ **Légère** - chargement rapide
- ✅ **Multilingue** - Français & Anglais
- ✅ **Gratuite** - Source ouverte

## ⚡ Démarrage en 3 étapes

### 1️⃣ Installation
```bash
npm install
```

### 2️⃣ Lancement
```bash
npm run dev
```

### 3️⃣ Ouvrir
Naviguez vers: **http://localhost:5173**

**C'est tout!** 🎉

## 📖 Documentation

| Document | Pour qui | Quand l'utiliser |
|----------|----------|-----------------|
| **README.md** | Développeurs & Utilisateurs | Guide complet |
| **QUICKSTART.md** | Impatients | Demarrage rapide (5 min) |
| **GUIDE_UTILISATEUR.html** | Utilisateurs finaux | Aide visuelle |
| **STRUCTURE.md** | Développeurs | Comprendre l'architecture |
| **CHECKLIST.md** | Développeurs | Voir l'avancement |
| **COMMANDES.sh** | Développeurs | Commandes utiles |

## 🚀 Prochaines étapes

1. **Lancer l'app**: `npm run dev`
2. **Explorer**: Visitez http://localhost:5173
3. **Ajouter un produit**: Testez la fonctionnalité
4. **Exporter**: Sauvegardez vos données (Import/Export)
5. **Lire README.md**: Pour documentation complète

## ❓ Questions Fréquentes

**Q: Où sont stockées mes données?**  
A: Localement dans votre navigateur (IndexedDB). Aucune donnée n'est envoyée à un serveur.

**Q: Comment sauvegarder?**  
A: Allez dans "Import/Export" et cliquez "Exporter en JSON".

**Q: Puis-je changer la langue?**  
A: Oui! Utilisez le sélecteur en haut à droite (FR/EN).

**Q: C'est gratuit?**  
A: Oui! Code source ouvert, libre d'utilisation.

**Q: Puis-je l'installer sur Windows?**  
A: Oui, cliquez sur `start.bat`. Ou utilisez `npm run dev`.

**Q: Besoin d'Internet?**  
A: Non! Fonctionne complètement offline.

## 🛠️ Tech Stack

- **Vue 3** - Framework moderne
- **Vite** - Build tool ultra-rapide
- **Pinia** - Gestion d'état
- **Vue Router** - Navigation
- **Vue-i18n** - Traductions
- **IndexedDB** - Stockage local
- **SCSS** - Styles modernes

## 📝 Notes Importantes

### Sauvegarde
- Sauvegardez régulièrement vos données via "Import/Export"
- Gardez les fichiers JSON en sécurité
- En cas de perte de données du navigateur, vous pouvez restaurer depuis le JSON

### Navigateurs Compatibles
- ✅ Chrome/Chromium
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera

### Limitations Connues
- Stockage limité à ~5-10MB par navigateur (pour beaucoup de produits)
- Pas de synchronisation multi-onglets
- IndexedDB = données navigateur (changez de navigateur = données différentes)

## 🎓 Apprendre Vue 3?

Ressources:
- [Vue 3 Guide](https://vuejs.org/)
- [Vite Docs](https://vitejs.dev/)
- [Pinia Store](https://pinia.vuejs.org/)

## 🤝 Contribution

Avez-vous une idée? Une amélioration?

1. Fork le projet
2. Créez une branche
3. Faites vos changements
4. Créez une Pull Request

## 📞 Support

En cas de problème:
1. Vérifiez **README.md**
2. Consultez **GUIDE_UTILISATEUR.html**
3. Vérifiez votre version Node.js: `node --version`
4. Essayez: `rm -rf node_modules && npm install`

## 🎉 Bon développement!

Merci d'utiliser Pharma Scanner.  
Nous espérons que cette app vous facilite la gestion de votre pharmacie!

---

**Version**: 1.0.0  
**Créé**: 2025-12-25  
**Licence**: MIT (Libre d'utilisation)  
**Langage**: Vue 3 + JavaScript

**Prêt? Lancez: `npm run dev`** 🚀
