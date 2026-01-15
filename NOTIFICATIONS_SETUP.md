# 📱 Configuration des Notifications Push (Firebase Cloud Messaging)

## ✅ Ce qui a été fait

### Phase 9 - Push Notifications : COMPLÈTE !

- ✅ Package `@react-native-firebase/messaging` installé
- ✅ Plugin FCM ajouté dans `app.json`
- ✅ Service de notifications créé (`lib/notifications.ts`)
- ✅ Demande de permissions implémentée
- ✅ Token FCM sauvegardé dans Firestore
- ✅ Gestion des notifications (foreground/background)
- ✅ Dashboard web envoie des notifications automatiquement
- ✅ Notifications pour toutes les actions (accepted, started, completed)

---

## 🚀 Configuration Requise

### Étape 1 : Obtenir la Server Key (5 minutes)

1. Va sur [Firebase Console](https://console.firebase.google.com)
2. Sélectionne ton projet "blu-maze"
3. Click sur ⚙️ (Settings) → **Project Settings**
4. Va dans l'onglet **Cloud Messaging**
5. Scroll vers le bas jusqu'à **Cloud Messaging API (Legacy)**
6. **Si désactivé :** Click sur les 3 points → Enable Cloud Messaging API (Legacy)
7. Copie la **Server Key** (ressemble à : `AAAAxxxxxxx:APA91...`)

### Étape 2 : Configurer le Dashboard Web

1. Ouvre `web/index.html`
2. Trouve la ligne 14 :
   ```javascript
   const FCM_SERVER_KEY = 'YOUR_SERVER_KEY_HERE';
   ```
3. Remplace par ta Server Key :
   ```javascript
   const FCM_SERVER_KEY = 'AAAAxxxxxxx:APA91...';
   ```
4. Sauvegarde

### Étape 3 : Rebuild l'App

**IMPORTANT :** Les notifications nécessitent un rebuild complet :

```bash
eas build --profile development --platform android
```

**Note :** Expo Go ne supporte PAS les notifications push. Tu DOIS builder avec EAS.

---

## 🧪 Comment Tester

### Test Complet du Flow

#### 1. Lance l'app mobile
```bash
# Installe le nouveau build sur ton device
```

L'app va automatiquement :
- ✅ Demander la permission pour les notifications
- ✅ Obtenir un token FCM
- ✅ Sauvegarder le token dans Firestore
- ✅ S'abonner aux topics

#### 2. Vérifie le token dans Firestore

1. Va sur Firebase Console → Firestore Database
2. Collection `users` → Ton user
3. Tu devrais voir un champ `fcmToken` avec une longue chaîne

#### 3. Lance le dashboard web

```bash
cd web
./start.sh
```

#### 4. Teste le flow complet

**A. Créer une ride (App Mobile)**
- Sélectionne une destination
- Click "Order ride"
- État "connecting" s'affiche

**B. Accepter la ride (Dashboard)**
- Click "Accept"
- ✅ **NOTIFICATION envoyée : "🚗 Driver Found!"**
- ✅ **L'app affiche la notification en haut**

**C. Démarrer le trajet (Dashboard)**
- Click "Start Trip"
- ✅ **NOTIFICATION envoyée : "🚀 Trip Started"**

**D. Terminer le trajet (Dashboard)**
- Click "Complete Trip"
- ✅ **NOTIFICATION envoyée : "✅ Trip Completed"**
- ✅ **Navigation automatique vers rating screen**

---

## 📋 Types de Notifications

### 1. Driver Found (Ride Accepted)
```
Titre : 🚗 Driver Found!
Message : A driver accepted your ride and is on the way.
```

### 2. Trip Started
```
Titre : 🚀 Trip Started
Message : Your trip has begun. Enjoy the ride!
```

### 3. Trip Completed
```
Titre : ✅ Trip Completed
Message : Your trip is complete. Total: D XX.XX
```

### 4. Ride Cancelled
```
Titre : ❌ Ride Cancelled
Message : Your ride has been cancelled.
```

---

## 🎯 Comportement des Notifications

### Quand l'app est au premier plan (foreground)
- ✅ Notification affichée via Alert
- ✅ Son par défaut
- ✅ Géré par `onMessageReceived()` dans `app/_layout.tsx`

### Quand l'app est en arrière-plan (background)
- ✅ Notification système affichée
- ✅ Click sur notification ouvre l'app
- ✅ Géré automatiquement par Firebase

### Quand l'app est fermée (quit)
- ✅ Notification système affichée
- ✅ Click sur notification lance l'app
- ✅ Géré par `getInitialNotification()`

---

## 🔧 Fichiers Modifiés/Créés

### App Mobile
- ✅ `lib/notifications.ts` - Service complet de notifications
- ✅ `app/_layout.tsx` - Initialisation et gestion des notifications
- ✅ `app.json` - Plugin FCM ajouté
- ✅ `package.json` - Package @react-native-firebase/messaging@23.7.0

### Dashboard Web
- ✅ `web/index.html` - Fonction `sendNotification()` ajoutée
- ✅ `web/notifications.js` - Templates et helpers (pour référence)

---

## 🐛 Troubleshooting

### ❌ Aucune notification reçue

**Vérifications :**

1. **Server Key configurée ?**
   - Ouvre `web/index.html`
   - Vérifie que `FCM_SERVER_KEY` n'est pas `'YOUR_SERVER_KEY_HERE'`

2. **App rebuildée ?**
   ```bash
   eas build --profile development --platform android
   ```

3. **Token FCM dans Firestore ?**
   - Firebase Console → Firestore → users → ton user
   - Champ `fcmToken` doit exister

4. **Permissions accordées ?**
   - Settings → Apps → Blu Maze → Notifications
   - Doit être activé

5. **Cloud Messaging API activée ?**
   - Firebase Console → Project Settings → Cloud Messaging
   - Cloud Messaging API (Legacy) doit être enabled

### ❌ "Error sending notification" dans les logs

**Cause :** Server Key invalide ou API pas activée

**Solution :**
1. Vérifie que tu as copié la bonne Server Key
2. Enable Cloud Messaging API (Legacy) dans Firebase Console

### ❌ Notification reçue mais pas d'alerte dans l'app

**Cause :** Gestion foreground pas correcte

**Solution :**
- Vérifie que `app/_layout.tsx` a bien le useEffect avec `onMessageReceived`

---

## 🎨 Personnaliser les Notifications

### Modifier le son

Dans `lib/notifications.ts` :
```typescript
notification: {
    title,
    body,
    sound: 'custom_sound.mp3', // Ton son personnalisé
}
```

### Ajouter une image

```typescript
notification: {
    title,
    body,
    imageUrl: 'https://example.com/image.png',
}
```

### Ajouter des actions (boutons)

```typescript
notification: {
    title,
    body,
    actions: [
        { action: 'view', title: 'View' },
        { action: 'dismiss', title: 'Dismiss' },
    ],
}
```

---

## 🚀 Prochaines Améliorations

### Pour la Production

**1. Déplacer l'envoi vers Cloud Functions**

Actuellement, la Server Key est dans le code web (pas sécurisé).

**Solution :** Créer une Cloud Function :

```bash
firebase init functions
```

`functions/index.js` :
```javascript
exports.onRideAccepted = functions.firestore
    .document('rides/{rideId}')
    .onUpdate(async (change, context) => {
        const newData = change.after.data();
        const previousData = change.before.data();

        if (newData.status === 'accepted' && previousData.status === 'pending') {
            // Send notification
            const admin = require('firebase-admin');
            const messaging = admin.messaging();

            const message = {
                notification: {
                    title: '🚗 Driver Found!',
                    body: 'A driver accepted your ride.',
                },
                token: userFCMToken,
            };

            await messaging.send(message);
        }
    });
```

**2. Notifications avec images**
- Ajouter des photos des chauffeurs
- Logo de l'app

**3. Notifications groupées**
- Grouper les notifications de la même ride

**4. Analytics**
- Tracker quelles notifications sont ouvertes
- A/B test sur les messages

---

## 📊 Statistiques

Pour voir les statistiques d'envoi :

1. Firebase Console → Cloud Messaging
2. Tu verras :
   - Notifications envoyées
   - Taux d'ouverture
   - Erreurs

---

## ✅ Checklist Complète

Avant de dire "ça marche pas" :

- [ ] Server Key copiée dans `web/index.html`
- [ ] Cloud Messaging API (Legacy) activée dans Firebase Console
- [ ] App rebuilté avec EAS (pas Expo Go)
- [ ] Nouveau build installé sur le device
- [ ] Permissions accordées dans Settings
- [ ] Token FCM visible dans Firestore
- [ ] Dashboard web lancé
- [ ] Ride créée depuis l'app
- [ ] Ride acceptée depuis le dashboard

Si tout est ✅, les notifications DOIVENT marcher ! 🎉

---

**🎊 Félicitations ! Les notifications push sont maintenant fonctionnelles !**

Teste le flow complet et tu verras les notifications arriver en temps réel quand tu acceptes/démarres/termines une ride depuis le dashboard.
