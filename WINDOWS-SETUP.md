# Guide Windows - Sans droits admin

## 📋 Prérequis

- **Go** (version 1.18+) : https://go.dev/dl/
- **Windows 7, 8, 10 ou 11**
- **Aucun droit admin requis** ✅

## 🚀 Installation (Méthode recommandée)

### Étape 1 : Installer Go

1. Téléchargez Go depuis https://go.dev/dl/
2. Double-cliquez sur le fichier `.msi`
3. Acceptez les conditions et installez
4. **Redémarrez votre ordinateur** (important!)

### Étape 2 : Vérifier Go

Ouvrez **cmd.exe** et tapez :
```
go version
```

Vous devriez voir quelque chose comme `go version go1.21 windows/amd64`

### Étape 3 : Compiler depuis Windows

1. Téléchargez/clonez ce projet
2. Ouvrez l'Explorateur et allez dans le dossier du projet
3. **Double-cliquez sur `build.bat`**
4. Le build commence automatiquement
5. Un fichier `PharmaScanner.exe` est créé

## ▶️ Lancer l'application

### Méthode 1 : Double-clic (Plus simple)
- Double-cliquez sur `PharmaScanner.exe`
- L'app s'ouvre automatiquement dans votre navigateur

### Méthode 2 : Ligne de commande
```
cd C:\chemin\vers\pharma-scanner
PharmaScanner.exe
```

### Méthode 3 : Créer un raccourci
1. Clic droit sur `PharmaScanner.exe`
2. **Créer un raccourci**
3. Déplacez le raccourci sur le **Bureau**
4. Double-cliquez pour lancer

## ⚙️ Compilation personnalisée

Ouvrez **cmd.exe** dans le dossier du projet et tapez :

```batch
REM Compiler avec le script batch
build.bat

REM Ou compiler manuellement
set GOOS=windows
set GOARCH=amd64
go build -o PharmaScanner.exe ./server/main.go
```

## ⚠️ Problèmes antivirus

Si Windows Defender bloque le fichier :

### Solution 1 : Cliquer "Exécuter quand même"
- Ignorez l'avertissement au premier lancement

### Solution 2 : Ajouter une exception
1. Ouvrez **Sécurité Windows**
2. **Protection contre les virus et menaces**
3. **Gérer les paramètres**
4. **Exclusions** → **Ajouter une exclusion** → **Fichier**
5. Sélectionnez `PharmaScanner.exe`

## 🔧 Dépannage

### "go: not found" ou "go n'est pas reconnu"
→ Go n'est pas installé ou PATH est mal configuré
→ Redémarrez après installation de Go

### Port 8080 déjà utilisé
→ Changez le port dans [server/main.go](server/main.go) ligne 28

### Antivirus bloque toujours
→ Décompressez le ZIP dans un dossier sans restriction (pas dans `Program Files`)

## 💾 Fichiers importants

- `build.bat` - Script de compilation
- `PharmaScanner.exe` - Application compilée
- `pharma-data.json` - Données de l'app (créé automatiquement)
- `app-standalone.html` - Interface web

## ✅ Pas besoin de :
- ❌ Droits administrateur
- ❌ Visual Studio
- ❌ Node.js ou Python
- ❌ Certificat de signature

Juste Go et c'est bon ! 🚀
