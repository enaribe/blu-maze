# 🚀 Quick Start - Driver Simulator

## Étape 1 : Configuration Firebase (1 minute)

### Option A : App Web déjà créée
Si tu as déjà créé une app Web dans Firebase Console :

1. Va sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionne "blu-maze"
3. Settings → Your apps → Web app
4. Copie l'`appId` (ex: `1:986986468078:web:abc123`)
5. Ouvre `firebase-config.js`
6. Remplace `YOUR_WEB_APP_ID` par ton appId

### Option B : Créer une nouvelle app Web
Si c'est la première fois :

1. Va sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionne "blu-maze"
3. Settings → Your apps
4. Click sur **"</> Web"**
5. Nom : "Driver Simulator"
6. **NE PAS** cocher "Firebase Hosting"
7. Click "Register app"
8. Copie l'`appId` de la config
9. Ouvre `firebase-config.js`
10. Remplace `YOUR_WEB_APP_ID` par ton appId

## Étape 2 : Vérifier les règles Firestore

Pour le développement, assure-toi que les règles permettent les lectures/écritures :

1. Firebase Console → Firestore Database → Rules
2. Vérifie que tu as :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // Pour le dev seulement !
    }
  }
}
```

⚠️ **Note :** Ces règles sont ouvertes à tous. OK pour le dev, mais à sécuriser avant la production !

## Étape 3 : Lancer le serveur

### Mac/Linux (Python 3)
```bash
cd web
python3 -m http.server 8000
```

### Avec Node.js
```bash
cd web
npx serve
```

Puis ouvre : **http://localhost:8000**

## Étape 4 : Tester !

1. **Sur ton téléphone** : Ouvre l'app Blu Maze
2. Sélectionne une destination
3. Click "Order ride"
4. **Dans le navigateur** : Tu verras la ride apparaître !
5. Click "Accept"
6. **Sur ton téléphone** : L'app passe en mode "active" automatiquement ! ✨

---

## 🎬 Scénario Complet de Test

### 1. Créer une ride (App Mobile)
- Lance l'app sur ton device
- Click "Enter destination"
- Sélectionne "Senegambia Beach" (dans Recent)
- Click "Order ride"
- ✅ État "connecting" s'affiche

### 2. Accepter la ride (Dashboard)
- Dans le navigateur, tu vois la ride dans "Pending Rides"
- Click "Accept"
- ✅ La ride passe dans "Active Ride"
- ✅ L'app mobile affiche les infos du chauffeur

### 3. Simuler le déplacement (Dashboard)
- Dans "Active Ride", change les coordonnées GPS :
  - Lat: 13.4500
  - Lng: -16.6700
- Click "Update Location"
- ✅ Le marker du chauffeur bouge sur la carte mobile !

### 4. Démarrer le trajet (Dashboard)
- Click "Start Trip"
- ✅ Status passe à "in_progress"
- ✅ L'app affiche "Trip in progress"

### 5. Terminer le trajet (Dashboard)
- Click "Complete Trip"
- ✅ L'app navigue automatiquement vers l'écran de rating !

### 6. Noter le chauffeur (App Mobile)
- Sélectionne 5 étoiles ⭐⭐⭐⭐⭐
- Ajoute un commentaire : "Great driver!"
- Click "Submit Rating"
- ✅ Retour au home screen

### 7. Vérifier dans Firestore
- Firebase Console → Firestore → rides
- Trouve ta ride
- ✅ Tu verras le rating et le commentaire !

---

## ⚡ Commandes Rapides

```bash
# Démarrer le serveur
cd web && python3 -m http.server 8000

# Ouvrir dans le navigateur
open http://localhost:8000

# Arrêter le serveur
Ctrl + C
```

---

## 🐛 Problèmes Courants

### ❌ "Import not found"
Solution : Tu dois utiliser un serveur local (pas file://)

### ❌ Aucune ride n'apparaît
- Vérifie que tu as bien créé une ride depuis l'app mobile
- Ouvre la console (F12) pour voir les erreurs
- Vérifie que l'appId est correct dans firebase-config.js

### ❌ "Permission denied"
- Vérifie les règles Firestore (voir Étape 2)
- Publie les règles (click "Publish")

---

**🎉 C'est tout ! Amuse-toi bien à tester ton système de rides !**
