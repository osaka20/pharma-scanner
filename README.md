# PharmaScanner

🚀 **Un seul clic pour lancer !** - Double-cliquez sur `Lancer.bat` et c'est parti !

Application de gestion pharmaceutique autonome - crée automatiquement tous les fichiers nécessaires.

## 🎯 Installation & Utilisation

### Windows (Recommandé)

**Étape 1 : Téléchargez le dossier**
```
pharma-scanner/
  ├─ Lancer.bat              ← CLIQUEZ ICI
  ├─ PharmaScanner.exe       (créé automatiquement)
  └─ README.md
```

**Étape 2 : Double-cliquez sur `Lancer.bat`**
- ✅ L'application démarre
- ✅ Votre navigateur s'ouvre automatiquement
- ✅ Accédez à `http://localhost:8080`

**C'est tout !** 

### Linux/macOS
```bash
go run server/main.go
```

## ⚙️ Fonctionnement technique

L'application :
1. ✅ Crée `pharma-data.json` automatiquement (données)
2. ✅ Crée `app-standalone.html` automatiquement (interface)
3. ✅ Lance un serveur local sur le port 8080
4. ✅ Ouvre votre navigateur par défaut

**Aucun téléchargement, aucune dépendance externe.**

## ✨ Fonctionnalités
- Gestion du catalogue produits (Ajouter, Modifier, Supprimer)
- Ventes et annulation
- Suivi des marges bénéficiaires
- Historique des ventes avec filtres
- Français/Anglais/Arabe

## 🛡️ Sécurité & Confidentialité

✅ **100% local** - Aucune donnée n'est envoyée sur internet
✅ **Pas d'installation** - Juste un fichier à lancer
✅ **Autonome** - Fonctionne sans connexion internet
✅ **Code source ouvert** - Vérifiez la sécurité dans `server/main.go`

## ⚠️ Note Antivirus

Votre antivirus peut afficher un avertissement car l'application n'est pas signée numériquement.

**C'est un faux positif** - L'application est 100% sûre.

**Solutions :**
- Windows Defender : Cliquez "Exécuter quand même"
- Autres antivirus : Ajoutez une exception dans les paramètres

## 📝 Fichiers inclus

| Fichier | Description |
|---------|-------------|
| `Lancer.bat` | Script de lancement (à double-cliquer) |
| `PharmaScanner.exe` | Application compilée |
| `README.md` | Ce fichier |
| `server/main.go` | Code source Go |
| `server/app-standalone.html` | Interface web (embarquée) |
| `server/pharma-data.json` | Données (créé automatiquement) |

## 🚀 Démarrage rapide

```
1. Double-cliquez sur Lancer.bat
2. Attendez 2 secondes
3. Votre navigateur s'ouvre automatiquement
4. Commencez à utiliser l'application !
```

## 💾 Sauvegarde des données

Les données sont sauvegardées automatiquement dans `pharma-data.json` au même endroit que l'application.

Si vous supprimez ce fichier, l'application recrée un nouveau fichier vide.

## ❓ Problèmes ?

### "Lancer.bat n'existe pas"
→ Le fichier doit être dans le même dossier que `PharmaScanner.exe`

### "Port 8080 déjà utilisé"
→ Une autre application utilise ce port. Fermez-la ou modifiez le port dans `server/main.go`

### "Antivirus bloque l'application"
→ Voir section "Note Antivirus" ci-dessus

## 📖 Documentation technique

[Voir server/main.go](server/main.go) pour les détails d'implémentation.
