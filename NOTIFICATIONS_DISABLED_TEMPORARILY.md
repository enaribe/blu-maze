# ⚠️ Notifications Temporairement Désactivées

## 🐛 Problème

Les notifications Firebase Messaging ne fonctionnent pas actuellement car **l'app n'a pas été rebuilé avec EAS** après l'installation du package `@react-native-firebase/messaging`.

### Erreur vue dans les logs :

```
ERROR  [Error: You attempted to use a Firebase module that's not installed natively
on your project by calling firebase.messaging().

Ensure you have installed the npm package '@react-native-firebase/messaging',
have imported it in your project, and have rebuilt your native application.]
```

## ✅ Ce qui a été fait

### Package installé ✅
```bash
npm install @react-native-firebase/messaging@23.7.0
```

### Plugin ajouté dans app.json ✅
```json
"plugins": [
  ...
  "@react-native-firebase/messaging"
]
```

### Code implémenté ✅
- `lib/notifications.ts` - Service complet
- `app/_layout.tsx` - Initialisation au login

### ❌ Ce qui manque

**Rebuild avec EAS Build !**

Les modules natifs (comme Firebase Messaging) ne peuvent pas être ajoutés via Expo Go. Ils nécessitent un **build development EAS**.

---

## 🔧 Solution Temporaire Appliquée

Pour éviter les crashes, j'ai wrappé les appels notifications dans des try-catch :

### app/_layout.tsx (ligne 36)

```typescript
// Initialize notifications for this user (skip if not available natively)
try {
  await initializeNotifications(firebaseUser.uid);
} catch (error) {
  console.log('⚠️ [Notifications] Skipped (rebuild required):', error);
}
```

### app/_layout.tsx (ligne 60)

```typescript
// Listen for foreground notifications (skip if not available natively)
useEffect(() => {
  try {
    const unsubscribe = onMessageReceived((message) => {
      Alert.alert(
        message.notification?.title || 'New Notification',
        message.notification?.body || '',
      );
    });
    return unsubscribe;
  } catch (error) {
    console.log('⚠️ [Notifications] Listener skipped (rebuild required)');
    return () => {}; // Return empty cleanup function
  }
}, []);
```

**Résultat :** L'app fonctionne normalement, mais sans notifications.

---

## 🚀 Activer les Notifications (Quand Tu Veux)

### Étape 1 : Build avec EAS

```bash
cd /Users/macbookair/Desktop/projets/myProjects/blu-maze
eas build --profile development --platform android
```

**⏱️ Temps :** ~15-20 minutes (premier build)

### Étape 2 : Installer le Build

Une fois le build terminé :
1. Download le `.apk` depuis EAS dashboard
2. Installe-le sur ton device Android
3. Lance l'app

### Étape 3 : Tester

1. Lance l'app client (nouveau build)
2. Login
3. Crée une ride
4. Lance le dashboard web
5. Accepte la ride depuis le dashboard
6. ✅ **Tu devrais recevoir une notification push !**

---

## 📊 État Actuel

### ✅ Ce qui fonctionne SANS rebuild

- ✅ Authentification (phone + PIN)
- ✅ Map et sélection destination
- ✅ Création de rides
- ✅ Tracking en temps réel via Firestore listeners
- ✅ Historique rides
- ✅ Profile
- ✅ Dashboard web (accepte/start/complete rides)

### ❌ Ce qui ne fonctionne pas SANS rebuild

- ❌ Notifications push (firebase messaging)
- ❌ Background location tracking (si besoin)

---

## 💡 Alternative : Utiliser les Listeners Firestore

En attendant le rebuild, tu peux détecter les changements via les listeners :

### Exemple dans app/(main)/index.tsx

```typescript
useEffect(() => {
  if (!currentRideId) return;

  const unsubscribe = listenToRide(currentRideId, (ride) => {
    if (ride.status === 'accepted' && rideStatus !== 'accepted') {
      // Driver a accepté !
      Alert.alert('🚗 Driver Found!', 'A driver is on the way');
    }

    if (ride.status === 'active' && rideStatus !== 'active') {
      // Trip started !
      Alert.alert('🚀 Trip Started', 'Your ride has begun');
    }

    setRideStatus(ride.status);
  });

  return unsubscribe;
}, [currentRideId]);
```

**Avantage :** Ça marche immédiatement, sans rebuild !

**Inconvénient :** Marche seulement quand l'app est ouverte.

---

## 🎯 Recommandation

### Pour continuer le développement

Tu peux continuer à développer **sans notifications** pour l'instant. Les listeners Firestore suffisent pour l'expérience utilisateur de base.

### Quand faire le rebuild

Fais le rebuild EAS quand :
1. Tu veux tester l'expérience complète avec notifications
2. Tu veux montrer l'app à quelqu'un
3. Tu te prépares pour le lancement

---

## 🔄 Retirer la Solution Temporaire (Après Rebuild)

Une fois l'app rebuildée avec EAS, tu peux retirer les try-catch si tu veux :

```typescript
// Version propre (après rebuild)
await initializeNotifications(firebaseUser.uid);

const unsubscribe = onMessageReceived((message) => {
  Alert.alert(
    message.notification?.title || 'New Notification',
    message.notification?.body || '',
  );
});
```

Mais tu peux aussi **garder les try-catch** pour éviter les crashes si l'app tourne sur un device sans permissions notifications.

---

## 📝 Logs à Surveiller

Dans Metro, tu verras :

```
⚠️ [Notifications] Skipped (rebuild required)
⚠️ [Notifications] Listener skipped (rebuild required)
```

**C'est normal !** Ça signifie que l'app tourne sans notifications, comme prévu.

---

## ✅ Checklist pour Activer les Notifications

- [ ] `eas build --profile development --platform android`
- [ ] Installer le build sur device
- [ ] Accepter permissions notifications dans l'app
- [ ] Vérifier token FCM dans Firestore (collection `users/{userId}.fcmToken`)
- [ ] Tester en créant une ride et l'acceptant depuis le dashboard

---

**🎊 Bon développement ! Les notifications attendront le rebuild EAS !** 🚀
