# Installation de PharmaScanner

## 🚀 Installation Rapide

### Option A : Utiliser l'installateur (Recommandé)
1. Téléchargez `PharmaScanner-Setup.exe`
2. Double-cliquez pour installer
3. Si Windows SmartScreen s'affiche :
   - Cliquez **"Informations complémentaires"**
   - Puis **"Exécuter quand même"**

### Option B : Exécutable portable
1. Téléchargez `PharmaScanner.exe`
2. Mettez-le dans un dossier avec `pharma-data.json` et `app-standalone.html`
3. Suivez les étapes anti-antivirus ci-dessous

---

## ⚠️ Pourquoi l'antivirus bloque ?

**C'est un faux positif** - l'application est open-source et sûre.

Les exécutables Go sans certificat de signature (coût : ~300€/an) sont souvent détectés par erreur.

## 🛡️ Solutions au blocage

### Windows Defender - Méthode 1 (Rapide)
1. Quand l'avertissement apparaît, cliquez **"Informations complémentaires"**
2. Cliquez **"Exécuter quand même"**

### Windows Defender - Méthode 2 (Permanent)
1. Ouvrez **Sécurité Windows** → **Protection contre les virus et menaces**
2. Cliquez **"Gérer les paramètres"**
3. Faites défiler → **"Exclusions"** → **"Ajouter ou supprimer des exclusions"**
4. Cliquez **"Ajouter une exclusion"** → **"Fichier"**
5. Sélectionnez `PharmaScanner.exe`

### Débloquer le fichier téléchargé
1. Clic droit sur le fichier → **Propriétés**
2. Cochez **"Débloquer"** en bas
3. Cliquez **OK**

---

## ✅ Vérification de sécurité

Vous pouvez vérifier la sécurité :
- **Code source** : Consultez `server/main.go` (100% transparent)
- **VirusTotal** : Scannez sur https://www.virustotal.com
- **Compilation** : Compilez vous-même avec `./build_windows.sh`

---

## 📞 Besoin d'aide ?

Si le blocage persiste, c'est généralement votre antivirus tiers (Avast, Norton, etc.). Ajoutez l'exclusion dans ses paramètres.
