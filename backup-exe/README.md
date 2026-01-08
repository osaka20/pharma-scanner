# Backup - Version .exe

Ce dossier contient la **version serveur Go** de PharmaScanner.

## Fichier sauvegardé

- `PharmaScanner.exe` (4.9 MB) - Serveur HTTP Go compilé

## Pourquoi ce backup ?

Cette version .exe est fonctionnelle et crée un serveur HTTP local sur le port 8080. 
Elle sauvegarde les données dans un fichier JSON durable.

**Avantages :**
- ✅ Données durables sur disque (pharma-data.json)
- ✅ Interface web complète
- ✅ Fonctionne 100% offline

**Inconvénients :**
- ❌ Détecté par certains antivirus (faux positif)
- ❌ Taille plus grande (5 MB vs 27 KB pour .hta)
- ❌ Nécessite d'ouvrir le navigateur manuellement

## Utilisation

Si vous préférez cette version :
1. Copiez `PharmaScanner.exe` dans le dossier principal
2. Double-cliquez dessus
3. Ouvrez `http://localhost:8080` dans votre navigateur

## Version recommandée

La version **PharmaScanner.hta** (dans le dossier parent) est recommandée car :
- Plus légère (27 KB)
- Zéro détection antivirus
- Même stockage durable sur disque
- S'ouvre automatiquement dans sa propre fenêtre

---

**Date de sauvegarde:** Janvier 2026
