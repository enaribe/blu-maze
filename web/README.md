# 🚗 Blu Maze - Driver Simulator

Interface web simple pour simuler un chauffeur et tester le système de rides en temps réel.

## 🎯 Fonctionnalités

- ✅ Voir les rides en attente (status: 'pending')
- ✅ Accepter ou refuser une ride
- ✅ Démarrer une course (accepted → in_progress)
- ✅ Terminer une course (in_progress → completed)
- ✅ Mettre à jour la position GPS du chauffeur
- ✅ Real-time updates via Firestore listeners
- ✅ Statistiques en temps réel

## 🚀 Installation

### 1. Obtenir la configuration Firebase

1. Va sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionne ton projet "Blu Maze"
3. Click sur l'icône **⚙️ (Settings)** → **Project settings**
4. Scroll vers le bas jusqu'à "Your apps"
5. Si tu n'as pas encore d'app Web, click sur **</> Web**
6. Donne un nom (ex: "Driver Simulator")
7. **Copie la configuration Firebase** (ressemble à ça) :

```javascript
const firebaseConfig = {
    apiKey: "AIza...",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456:web:abc123"
};
```

### 2. Configurer le fichier HTML

1. Ouvre `web/index.html`
2. Trouve la ligne 275 qui dit :
   ```javascript
   // Firebase configuration - REPLACE WITH YOUR CONFIG
   const firebaseConfig = {
   ```
3. **Remplace** les valeurs par ta config Firebase copiée ci-dessus

### 3. Lancer l'interface

**Option 1 : Double-click sur index.html**
- Simple, mais peut avoir des restrictions CORS

**Option 2 : Serveur local (Recommandé)**

Avec Python 3 :
```bash
cd web
python3 -m http.server 8000
```

Avec Node.js (si tu as npx) :
```bash
cd web
npx serve
```

Puis ouvre dans ton navigateur : `http://localhost:8000`

## 📖 Comment Utiliser

### Flow Complet de Test

#### 1️⃣ **Créer une ride depuis l'app mobile**
- Ouvre l'app Blu Maze sur ton device
- Sélectionne une destination
- Click "Order ride"
- L'app passe à l'état "connecting"

#### 2️⃣ **Accepter la ride (Dashboard Web)**
- Ouvre le dashboard dans ton navigateur
- Tu verras la ride apparaître dans "Pending Rides"
- Click sur **"Accept"**
- ✅ L'app mobile passe automatiquement à l'état "active" !

#### 3️⃣ **Mettre à jour la position du chauffeur**
- Dans le dashboard, va dans "Active Ride"
- Tu verras une section "Update Driver Location"
- Change les coordonnées Latitude/Longitude
- Click "Update Location"
- ✅ Le marker du chauffeur se déplace sur la carte dans l'app !

**Suggestions de positions pour tester :**
- **Départ (Serrekunda)** : Lat: 13.4549, Lng: -16.6788
- **En route** : Lat: 13.4500, Lng: -16.6700
- **Arrivée (Banjul)** : Lat: 13.4544, Lng: -16.5790

#### 4️⃣ **Démarrer la course**
- Click sur **"Start Trip"**
- ✅ Status passe de 'accepted' à 'in_progress'
- ✅ L'app affiche "Trip in progress"

#### 5️⃣ **Terminer la course**
- Click sur **"Complete Trip"**
- ✅ Status passe à 'completed'
- ✅ L'app navigue automatiquement vers l'écran de rating !

#### 6️⃣ **Rating (App Mobile)**
- Note le chauffeur (1-5 étoiles)
- Ajoute un commentaire optionnel
- Submit
- ✅ Retour au home screen

## 🎨 Interface

### Section "Pending Rides"
Affiche toutes les rides avec status 'pending' :
- ID de la ride
- Adresse de départ et destination
- Distance et prix
- Boutons : Accept / Reject

### Section "Active Ride"
Affiche la ride acceptée ou en cours :
- Détails de la ride
- Simulateur de position GPS
- Boutons : Start Trip / Complete Trip

### Statistiques (en haut)
- Nombre de rides en attente
- Nombre de rides actives
- Nombre de rides complétées aujourd'hui

## 🔧 Troubleshooting

### ❌ "Firebase not defined"
- Vérifie que tu as bien remplacé la config Firebase
- Vérifie que tu utilises un serveur local (pas file://)

### ❌ "Permission denied"
- Va sur Firebase Console → Firestore Database → Rules
- Vérifie que les règles permettent les lectures/écritures
- Pour le développement, tu peux utiliser (TEMPORAIREMENT) :
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true; // ⚠️ UNIQUEMENT POUR LE DEV
    }
  }
}
```

### ❌ Aucune ride n'apparaît
- Vérifie que tu as créé une ride depuis l'app mobile
- Ouvre la console du navigateur (F12) pour voir les erreurs
- Vérifie que la config Firebase est correcte

### ❌ L'app mobile ne se met pas à jour
- Vérifie que tu as rebuild l'app avec les nouvelles fonctionnalités
- Ferme et rouvre l'app mobile
- Vérifie dans Firestore Console que le statut change bien

## 🎯 Prochaines Améliorations

Idées pour améliorer le simulateur :
- [ ] Simulation automatique du trajet (GPS qui bouge tout seul)
- [ ] Affichage de la carte Google Maps
- [ ] Historique des rides complétées
- [ ] Statistiques de revenus
- [ ] Mode "Auto-accept" (accepte automatiquement les rides)
- [ ] Plusieurs chauffeurs simultanés
- [ ] Chat en temps réel avec le client

## 📝 Notes

- Ce simulateur est pour le **développement et test uniquement**
- Il ne nécessite pas d'authentification (pas de login)
- Tous les chauffeurs partagent la même interface
- Les données sont directement lues/écrites dans Firestore

---

**🚀 Prêt à tester ! Ouvre `index.html` dans ton navigateur et commence à accepter des rides !**
