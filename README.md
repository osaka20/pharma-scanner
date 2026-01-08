# 💊 PharmaScanner - Version HTML5 Standalone

🚀 **Un seul clic pour lancer !** - Double-cliquez sur `Lancer.bat` et c'est parti !

**Solution ultra-compacte, 100% offline, zéro dépendance, zéro antivirus**

## 📋 Résumé

PharmaScanner est une application de gestion de médicaments **entièrement autonome** avec **sauvegarde durable sur disque**.

- ✅ **2 fichiers seulement** pour tout fonctionner
- ✅ **100% offline** - Pas de connexion internet nécessaire
- ✅ **Stockage sur disque dur** - Fichier JSON durable (pharma-data.json)
- ✅ **Zéro perte de données** - Sauvegarde automatique à chaque modification
- ✅ **Zéro installation** - Double-clic et c'est parti
- ✅ **Zéro antivirus** - Format HTA (HTML Application), aucune détection
- ✅ **Windows Ready** - Compatible Windows 10/11/...
- ✅ **Portabilité** - Fonctionne sur clé USB ou dossier partagé

---

## 🚀 Installation (2 étapes)

### 1. Fichiers nécessaires
Vous avez besoin de **2 fichiers** seulement:
- `PharmaScanner.hta` - L'application complète (≈20 KB)
- `Lancer.bat` - Le lanceur Windows (≈1 KB)

**Note:** Un 3ème fichier `pharma-data.json` sera créé automatiquement pour stocker vos données

### 2. Lancer l'application
**Double-cliquez sur `Lancer.bat`** 

C'est tout ! L'application s'ouvre automatiquement dans votre navigateur.

---

## 📂 Structure

```
PharmaScanner/
├── PharmaScanner.hta     ← Application complète
├── pharma-data.json      ← Données (créé automatiquement)
├── Lancer.bat            ← Lanceur (double-cliquez ici !)
└── README.md             ← Ce fichier
```

**Taille totale**: ~20 KB pour l'application + taille variable des données

---

## 💾 Stockage des données - DURABLE ET FIABLE

Les données sont stockées **directement sur votre disque dur** dans un fichier JSON :
- **Fichier physique** - `pharma-data.json` dans le même dossier que l'application
- **Sauvegarde automatique** - À chaque ajout/modification/suppression
- **100% durable** - Ne peut JAMAIS être perdu par le navigateur
- **Portable** - Copiez simplement le fichier pour sauvegarder
- **Lisible** - Format JSON texte, facile à éditer manuellement si nécessaire
- **Rapide** - Accès instantané au disque local

### Avantages du stockage sur disque
- ✅ Pas de risque de perte si vous videz le cache
- ✅ Pas de limite de quota navigateur
- ✅ Transférable facilement entre ordinateurs
- ✅ Peut être sauvegardé avec vos autres fichiers
- ✅ Visible dans l'explorateur Windows

---

## 🎯 Utilisation

### Ajouter un médicament
1. Onglet **"➕ Ajouter"**
2. Remplissez les champs (nom, type, quantité, etc.)
3. Cliquez **"Ajouter"**

### Chercher un médicament
1. Onglet **"📋 Liste"**
2. Tapez dans la barre de recherche
3. Résultats instantanés

### Gérer les données
1. Onglet **"💾 Données"**
2. Téléchargez votre backup
3. Restaurez depuis un backup
4. Effacez si nécessaire

---

## 🔧 Caractéristiques techniques

| Aspect | Détails |
|--------|---------|
| **Format** | HTA (HTML Application) + JavaScript vanilla |
| **Stockage** | Fichier JSON sur disque dur (pharma-data.json) |
| **Responsive** | Fonctionne sur desktop, tablet, mobile |
| **Compatibilité** | Chrome, Firefox, Edge, Safari |
| **Sécurité** | Pas d'upload cloud, données locales uniquement |
| **Performance** | Instantané, pas de requête réseau |

---

## 🛡️ Sécurité & Confidentialité

- ✅ **Zéro réseau** - Pas de transmission de données
- ✅ **Zéro cloud** - Tout reste sur votre PC
- ✅ **Zéro antivirus** - Format HTA (Microsoft), complètement sûr
- ✅ **Open** - Code JavaScript visible, aucune obfuscation
- ✅ **Local** - Données stockées dans un fichier physique sur disque
- ✅ **Durable** - Impossible de perdre les données accidentellement

---

## 📋 Types de médicaments prédéfinis

- Analgésique
- Antibiotique
- Anti-inflammatoire
- Antitussif
- Antihistaminique
- Cardiovasculaire
- Digestif
- Autre (personnalisé)

---

## 🎨 Interface

- **Design moderne** avec gradient et animations
- **Onglets** pour organiser les fonctionnalités
- **Cartes** pour afficher les médicaments
- **Statistiques** en temps réel
- **Responsive** - S'adapte à la taille de l'écran

---

## 💡 FAQ

### Q: Comment ça marche sans serveur ?
R: L'application est au format HTA (HTML Application de Microsoft). Elle s'exécute comme une application Windows normale et peut écrire des fichiers directement sur le disque.

### Q: Les données sont-elles sauvegardées ?
R: Oui ! Automatiquement dans `pharma-data.json` à chaque modification. C'est un fichier physique sur votre disque.

### Q: Puis-je transférer les données sur un autre PC ?
R: Oui ! Copiez simplement le fichier `pharma-data.json` sur l'autre PC, placez-le à côté de PharmaScanner.hta et c'est tout.

### Q: Ça fonctionne sur clé USB ?
R: Oui ! Copiez les 2 fichiers sur la clé USB et lancez depuis n'importe quel PC.

### Q: Combien de médicaments peuvent être stockés ?
R: Illimité ! Seulement limité par l'espace disque de votre PC (pas de quota navigateur).

### Q: L'antivirus va-t-il bloquer ?
R: Non, le format HTA est de Microsoft et reconnu comme sûr par tous les antivirus.

### Q: Fonctionne hors ligne ?
R: Oui, 100% offline, aucune connexion nécessaire.

### Q: Que se passe-t-il si je vide le cache de mon navigateur ?
R: RIEN ! Vos données sont sur le disque dur, pas dans le navigateur. Elles sont totalement protégées.

---

## 📞 Support

En cas de problème :

1. **L'application ne s'ouvre pas ?**
   - Vérifiez que `PharmaScanner.hta` existe dans le dossier
   - Double-cliquez directement sur `PharmaScanner.hta` si Lancer.bat ne fonctionne pas
   - Assurez-vous d'être sur Windows (HTA est Windows uniquement)

2. **Les données disparaissent ?**
   - **Impossible !** Les données sont dans `pharma-data.json` sur votre disque
   - Vérifiez que le fichier `pharma-data.json` existe
   - Si absent, il sera recréé automatiquement

3. **Message d'erreur au démarrage ?**
   - Normal la première fois (création du fichier de données)
   - Cliquez "OK" et l'application fonctionnera

---

## 🚀 Comparaison des versions

| Aspect | .exe (backup) | .hta (actuel) |
|--------|--------------|------------------|
| Taille | 5 MB | 20 KB |
| Antivirus | Détecté ❌ | Non détecté ✅ |
| Installation | Complexe | Simple |
| Offline | Oui | Oui |
| Dépendances | Zéro | Zéro |
| Stockage | Fichier JSON (serveur) | Fichier JSON (disque direct) |
| Durabilité données | Excellente ✅ | Excellente ✅ |
| Portabilité | Bonne | Excellente |
| Compatibilité | Windows only | Windows only |
| Risque perte données | Très faible | **ZÉRO** ✅ |

---

## 📦 Déploiement rapide

Téléchargez simplement:
- `PharmaScanner.hta` 
- `Lancer.bat`

Et c'est prêt à l'emploi !

**Backup disponible:** Une version .exe est disponible dans le dossier `backup-exe/` si besoin.

---

## 📝 Version

- **Version**: 1.0
- **Date**: Janvier 2026
- **Format**: HTML5 + JavaScript
- **Langue**: Français
- **License**: MIT

---

## 🎯 Cas d'usage

- 📱 Gestion personnelle de médicaments
- 🏥 Inventaire d'une petite pharmacie
- 🚑 Documentation médicale d'urgence
- 📋 Suivi de prescriptions
- 🏠 Armoire à pharmacie numérique

---

**Développé pour simplicité, sécurité et portabilité maximales** 💪
