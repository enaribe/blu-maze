# 🚗 Lien avec l'App Driver

## 📂 Emplacement

L'app driver est dans un projet séparé :

```
/Users/macbookair/Desktop/projets/myProjects/
├── blu-maze/           # ← Ce projet (app client/passager)
└── blu-maze-driver/    # ← App driver (chauffeur)
```

## 🔗 Partage de Code

L'app driver **réutilise le code** de ce projet via Metro `watchFolders` :

### Fichiers partagés

```typescript
// Dans blu-maze-driver, on importe depuis @client/
import { auth, db } from '@client/lib/firebase';
import { initializeNotifications } from '@client/lib/notifications';
import PlacesAutocomplete from '@client/components/PlacesAutocomplete';
```

### Configuration (blu-maze-driver/metro.config.js)

```javascript
watchFolders: [
  path.resolve(__dirname, '../blu-maze'),  // Surveille ce projet
],
extraNodeModules: {
  '@client': path.resolve(__dirname, '../blu-maze'),  // Alias @client/
}
```

## 📊 Firestore Partagé

### Collection `rides`

Les deux apps utilisent la même collection :

```typescript
rides/{rideId}
{
  // Champs créés par CLIENT
  userId: string
  pickup: { address, coords }
  destination: { address, coords }
  distance: number
  duration: number
  price: number
  status: 'pending' | 'accepted' | 'active' | 'completed' | 'cancelled'
  createdAt: Timestamp

  // Champs ajoutés par DRIVER
  driverId: string | null
  acceptedAt: Timestamp | null
  startedAt: Timestamp | null
  completedAt: Timestamp | null
}
```

### Collection `drivers` (nouvelle)

Créée par l'app driver :

```typescript
drivers/{driverId}
{
  fullName: string
  email: string
  phone: string
  status: 'pending_approval' | 'approved' | 'suspended'
  isOnline: boolean
  currentRideId: string | null
  currentLocation: GeoPoint
  rating: number
  totalRides: number
  totalEarnings: number
  ...
}
```

## 🔔 Notifications

### Client → Driver

Quand le client crée une ride, le dashboard web envoie une notification aux drivers online :

```javascript
// web/index.html (dashboard)
await sendNotification(
  driverId,
  '🚗 New Ride Request',
  'A passenger needs a ride nearby'
);
```

### Driver → Client

Quand le driver accepte/démarre/complète, le client reçoit des notifications :

```javascript
// Déjà implémenté dans Phase 9
// app/_layout.tsx gère les notifications entrantes
```

## 🔄 Flow Complet

```
1. CLIENT crée ride
   ↓
2. rides/{id} créé avec status: 'pending'
   ↓
3. DRIVER online voit la ride dans sa liste
   ↓
4. DRIVER click "Accept"
   ↓
5. rides/{id}.status = 'accepted'
   rides/{id}.driverId = {driverId}
   ↓
6. CLIENT voit "Driver Found!" (via listener)
   ↓
7. DRIVER navigue vers pickup
   ↓
8. DRIVER click "Start Trip"
   ↓
9. rides/{id}.status = 'active'
   ↓
10. DRIVER navigue vers destination
    ↓
11. DRIVER click "Complete Trip"
    ↓
12. rides/{id}.status = 'completed'
    drivers/{id}.totalRides++
    drivers/{id}.totalEarnings += price
    ↓
13. CLIENT redirigé vers rating screen
```

## 🧪 Tester les Deux Apps Ensemble

### Setup

1. **Build et lance l'app client** (ce projet)
   ```bash
   cd blu-maze
   npx expo start
   ```

2. **Build et lance l'app driver**
   ```bash
   cd ../blu-maze-driver
   npm install
   npx expo start --port 8082  # Port différent
   ```

### Test Flow

1. **Sur l'app CLIENT :**
   - Login avec phone
   - Sélectionne une destination
   - Click "Order ride"
   - Status : "connecting"

2. **Sur l'app DRIVER :**
   - Login avec email/password
   - Toggle "Online"
   - Vois la ride dans "New Ride Requests"
   - Click "Accept"

3. **Sur l'app CLIENT :**
   - ✅ Notification "Driver Found!"
   - ✅ Map montre driver location
   - ✅ Status passe à "active"

4. **Sur l'app DRIVER :**
   - Click "Start Trip"
   - Puis "Complete Trip"

5. **Sur l'app CLIENT :**
   - ✅ Navigation vers rating screen
   - Rate le driver

## 📝 Modifications à ce Projet

### Si tu modifies `lib/firebase.ts`

Les changements seront automatiquement disponibles dans l'app driver grâce à `watchFolders`.

**Exemple :**
```typescript
// blu-maze/lib/firebase.ts
export const someNewFunction = () => { ... }

// Immédiatement disponible dans blu-maze-driver :
import { someNewFunction } from '@client/lib/firebase';
```

### Si tu modifies `lib/notifications.ts`

Pareil, les deux apps verront les changements.

### Fichiers NON partagés

- `app/` (routes différentes)
- `app.json` (config différente)
- `package.json` (même dépendances mais projets séparés)

## 🚀 Déploiement

### Builds Séparés

Les deux apps doivent être buildées séparément :

```bash
# Client app
cd blu-maze
eas build --profile development --platform android

# Driver app
cd ../blu-maze-driver
eas build --profile development --platform android
```

### Différents Package Names

- Client : `com.blumaze.enatech`
- Driver : `com.blumaze.driver`

Donc les deux apps peuvent être installées en même temps sur un device.

## 📊 Dashboard Web

Le dashboard web (`blu-maze/web/`) peut :
- Simuler des actions driver (accept, start, complete)
- Envoyer des notifications aux deux apps
- Voir toutes les rides en temps réel

## 🎯 Prochaines Étapes

1. **Phase 13 : Admin Dashboard**
   - Approuver les drivers depuis le web
   - Voir tous les drivers online
   - Analytics globales

2. **Phase 14 : Advanced Features**
   - Upload documents driver
   - In-app chat client ↔ driver
   - Voice navigation

---

**Pour plus de détails sur l'app driver, voir :**
`../blu-maze-driver/README.md`
`../blu-maze-driver/PHASE12_DRIVER_APP_RECAP.md`
