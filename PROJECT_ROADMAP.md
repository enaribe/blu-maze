# 🚀 BLU MAZE - Roadmap Complet du Projet

**Application VTC pour la Gambie**
**Dernière mise à jour :** 8 Janvier 2026
**Statut :** En développement - Phase 7 complète, Phase 8 prochaine

---

## 📊 Vue d'Ensemble

```
Progression Globale : ███████████████████░ 95%

✅ Phase 1-6 : Complètes
✅ Phase 7 : Firebase Auth complète
✅ Phase 8 : Backend - Partie Client complète
✅ Phase 9 : Push Notifications complète
⬜ Phase 10-13: À venir
```

---

## ✅ PHASE 1 : Setup Initial & Structure (COMPLÈTE)

### Configuration de base
- ✅ Projet Expo SDK 54 créé avec TypeScript
- ✅ Expo Router installé et configuré
- ✅ Structure de dossiers créée (`app/`, `components/`, `constants/`, `lib/`, `types/`)
- ✅ `app.json` configuré (dark mode, bundle IDs)
- ✅ `babel.config.js` créé
- ✅ `tsconfig.json` avec path aliases
- ✅ `.gitignore` configuré

### Design System
- ✅ `constants/Colors.ts` - Palette Blu Maze (#00D9D5, noir, etc.)
- ✅ `constants/Typography.ts` - Styles texte

### Packages installés
- ✅ `zustand` - State management
- ✅ `date-fns` - Manipulation dates
- ✅ `@react-native-async-storage/async-storage` - Persistence

**📁 Fichiers clés :** `app.json`, `constants/`, `package.json`

---

## ✅ PHASE 2 : Composants UI (COMPLÈTE)

### Composants réutilisables créés
- ✅ `components/ui/Button.tsx` - Boutons (primary, secondary, outline)
- ✅ `components/ui/Input.tsx` - Champs texte avec validation
- ✅ `components/ui/Card.tsx` - Containers de contenu
- ✅ `components/ui/index.ts` - Exports centralisés

### Styles appliqués
- ✅ Boutons : 56px height, 12px radius, couleur primary
- ✅ Inputs : 56px height, 8px radius, fond #2A2A2A
- ✅ Cards : 16px radius, élévation

**📁 Fichiers clés :** `components/ui/`

---

## ✅ PHASE 3 : Écrans d'Authentification (COMPLÈTE)

### Flow d'auth créé (7 écrans)
- ✅ `app/(auth)/_layout.tsx` - Layout stack pour auth
- ✅ `app/(auth)/welcome.tsx` - Écran d'accueil
- ✅ `app/(auth)/onboarding.tsx` - Carousel onboarding
- ✅ `app/(auth)/phone.tsx` - Saisie numéro téléphone
- ✅ `app/(auth)/verify.tsx` - Vérification OTP (6 digits)
- ✅ `app/(auth)/profile.tsx` - Saisie nom/prénom/photo
- ✅ `app/(auth)/pin.tsx` - Création PIN (4 chiffres)
- ✅ `app/(auth)/pin-confirm.tsx` - Confirmation PIN
- ✅ `app/(auth)/unlock.tsx` - Déverrouillage avec PIN

### Features implémentées
- ✅ Navigation fluide entre écrans
- ✅ Validation des inputs
- ✅ États de chargement
- ✅ Clavier numérique pour PIN
- ✅ Timer pour OTP

**📁 Fichiers clés :** `app/(auth)/`

---

## ✅ PHASE 4 : State Management (COMPLÈTE)

### Zustand Store configuré
- ✅ `lib/store.ts` - Store global avec persistence
- ✅ `lib/utils.ts` - Fonctions utilitaires (formatCurrency, formatPhone, etc.)
- ✅ `types/index.ts` - Types TypeScript complets

### State géré
- ✅ Authentification (user, isAuthenticated, hasCompletedOnboarding)
- ✅ Rides (currentRide)
- ✅ Adresses (home, office, favorites)
- ✅ Persistence avec AsyncStorage

### Routing intelligent
- ✅ `app/index.tsx` - Point d'entrée avec logique de redirection
  - Si authenticated → unlock screen
  - Si onboarding non complété → onboarding
  - Sinon → welcome

**📁 Fichiers clés :** `lib/store.ts`, `lib/utils.ts`, `types/index.ts`

---

## ✅ PHASE 5 : Écrans Principaux (COMPLÈTE)

### Structure `app/(main)/` créée
- ✅ `app/(main)/_layout.tsx` - Layout principal
- ✅ `app/(main)/index.tsx` - Home avec carte mockée (18KB)
  - États : initial, preview, connecting
  - Mock de carte avec landmarks
  - Bottom sheet dynamique
- ✅ `app/(main)/history.tsx` - Historique des courses
- ✅ `app/(main)/profile.tsx` - Profil utilisateur
- ✅ `app/(main)/addresses.tsx` - Gestion adresses
- ✅ `app/(main)/add-address.tsx` - Ajout adresse
- ✅ `app/(main)/menu.tsx` - Menu latéral
- ✅ `app/(main)/request-trip.tsx` - Demande de trajet

### Features UI
- ✅ Mock de carte avec landmarks (hôtels, resorts)
- ✅ Route preview visuelle
- ✅ Bottom sheet avec 3 états
- ✅ Points de fidélité (250 points)
- ✅ Code de parrainage
- ✅ Logout fonctionnel

**📁 Fichiers clés :** `app/(main)/`

---

## ✅ PHASE 6 : Google Maps Integration (100% COMPLÈTE)

### ✅ Packages installés
- ✅ `react-native-maps`
- ✅ `expo-location`
- ✅ `react-native-google-places-autocomplete`

### ✅ Configuration
- ✅ `app.json` configuré :
  - Permissions de localisation (iOS + Android)
  - API Key Google Maps configurée : AIzaSyDh-1JWqpK2QuqAz5a9yDL-MHmNEDp6kgQ
  - Plugin expo-location
- ✅ `components/Map.tsx` créé :
  - MapView avec style dark mode
  - Géolocalisation automatique
  - Markers personnalisés
  - Polylines pour routes
  - Auto-zoom intelligent
- ✅ `lib/maps.ts` créé :
  - `getDirections()` - Route entre 2 points
  - `calculatePrice()` - Calcul prix (base D50 + D15/km + D5/min)
  - `geocodeAddress()` - Adresse → Coordonnées
  - `reverseGeocode()` - Coordonnées → Adresse
  - `calculateDistance()` - Distance Haversine
- ✅ `GOOGLE_MAPS_SETUP.md` créé - Guide complet

### ✅ Composants & Features
- ✅ `components/PlacesAutocomplete.tsx` créé
  - Recherche d'adresses en temps réel avec Google Places API
  - Suggestions filtrées pour la Gambie (country:gm)
  - Sélection et récupération des coordonnées
- ✅ `app/(main)/request-trip.tsx` - Écran de recherche destination
  - Intégration PlacesAutocomplete
  - Section "My addresses" (Home, Office)
  - Section "Recent" destinations
  - Navigation vers home avec params (destination, coords)
- ✅ `app/(main)/index.tsx` - Home screen avec Google Maps
  - Composant `<Map />` remplace le mock
  - Géolocalisation automatique de l'utilisateur
  - Affichage des markers pickup + destination
  - Route visible entre les 2 points
  - **UX Flow préservé** : Click destination → Opens request-trip screen
  - Réception params depuis request-trip → Calcul route automatique
- ✅ Calcul automatique de route et prix
  - Distance (km)
  - Durée (minutes)
  - Prix (D GMD) avec formule : Base D50 + D15/km + D5/min
- ✅ UI responsive avec 3 états :
  - Initial : Sélection destination (ouvre request-trip)
  - Preview : Détails du trajet avec prix
  - Connecting : Recherche de chauffeur

### ✅ UX Flow Final
1. User clicks "Enter destination" sur home screen
2. Opens `request-trip.tsx` (full screen avec search, favorites, recents)
3. User sélectionne une adresse
4. Returns to home avec params (destination, destLat, destLng)
5. Home calcule la route automatiquement
6. Affiche preview avec distance, durée, prix

**📁 Fichiers clés :** `components/Map.tsx`, `components/PlacesAutocomplete.tsx`, `lib/maps.ts`, `app/(main)/index.tsx`, `app/(main)/request-trip.tsx`

**⏱️ Temps réel :** 1 journée

**🎯 Prochaine étape :** Rebuild avec EAS pour tester Google Maps sur device

---

## ✅ PHASE 7 : Firebase Authentication (COMPLÈTE)
 
 ### Setup Firebase
- ✅ Projet Firebase Console créé
- ✅ Apps iOS et Android ajoutées
- ✅ Fichiers de config configurés (google-services.json / GoogleService-Info.plist)
- ✅ Packages installés
 
 ### Implémenter Auth
- ✅ Firebase Phone Auth configuré et fonctionnel
- ✅ Intégration dans `app/(auth)/phone.tsx` (Envoi SMS)
- ✅ Intégration dans `app/(auth)/verify.tsx` (Vérification code)
- ✅ Création/Update user dans Firestore
- ✅ Sauvegarde session locale avec Auth Listener
- ✅ Gestion du PIN sécurisé (SHA256 + SecureStore)
- ✅ Fonction Logout complète (Firebase + Zustand)
- ✅ Correction numéro hardcodé
- ✅ Correction logout incomplet
 
 ### Firestore Structure
- ✅ Collection `users` implémentée avec succès

**📁 Fichiers à modifier :** `app/(auth)/phone.tsx`, `app/(auth)/verify.tsx`, `lib/store.ts`

**⏱️ Temps estimé :** 2-3 jours

---

## 🔄 PHASE 8 : Backend & Matching Drivers (PARTIE CLIENT COMPLÈTE)

### ✅ Firestore Collections - Structure Client
- ✅ Collection `rides` créée avec fonctions CRUD complètes dans `lib/firebase.ts` :
  - `createRide()` - Créer une nouvelle ride
  - `getRideById()` - Récupérer une ride par ID
  - `getUserActiveRide()` - Récupérer la ride active d'un utilisateur
  - `updateRideStatus()` - Mettre à jour le statut
  - `listenToRide()` - Écouter les changements en temps réel
  - `cancelRide()` - Annuler une ride
  - `addRideRating()` - Ajouter un rating

- ✅ Types TypeScript complets pour `Ride` dans `types/index.ts`

### ✅ Real-time Updates - Implémentés
- ✅ Listener Firestore pour statut ride (useEffect dans index.tsx)
- ✅ Update UI en temps réel basé sur le statut
- ✅ Tracking position chauffeur (marker sur la carte)

### ✅ Écrans & UI Flows
- ✅ **État "initial"** - Sélection destination
- ✅ **État "preview"** - Aperçu du trajet avec prix
- ✅ **État "connecting"** - Recherche de chauffeur (pending)
- ✅ **État "active"** - Chauffeur accepté/en route
  - Affichage info chauffeur (avatar, nom, rating, véhicule)
  - Boutons call/chat
  - Détails du trajet (pickup, destination, distance, durée, prix)
  - Tracking position chauffeur sur la carte
- ✅ **Écran "rate-ride"** - Rating après course complétée
  - Rating 1-5 étoiles
  - Commentaire optionnel
  - Skip option

### ✅ Features Implémentées
- ✅ Création de ride dans Firestore au clic sur "Order ride"
- ✅ Vérification de ride active au démarrage de l'app
- ✅ Navigation automatique vers rating screen quand ride complétée
- ✅ Annulation de ride (cancel dans Firestore)
- ✅ Gestion des états de ride (pending → accepted → in_progress → completed)

### ⬜ Cloud Functions - À FAIRE
- ⬜ `onRideCreated` - Matching driver automatique
  - Query drivers online et proches
  - Envoyer notification push
  - Retry toutes les 5 sec
  - Timeout après 2 min

- ⬜ `onRideCompleted` - Post-trajet
  - Update stats chauffeur
  - Update points fidélité client
  - Calculer ratings moyens

### ⬜ À Compléter Plus Tard
- ⬜ Collection `drivers` (sera utilisée par l'app chauffeur - Phase 12)
- ⬜ Cloud Functions setup (nécessite Firebase Functions init)
- ⬜ Données réelles du chauffeur (actuellement mock)
- ⬜ Mise à jour position chauffeur en temps réel (nécessite app chauffeur)

**📁 Fichiers modifiés :**
- `lib/firebase.ts` - Fonctions de gestion des rides
- `app/(main)/index.tsx` - États ride et listeners
- `app/(main)/rate-ride.tsx` - Nouveau écran de rating

**🌐 Simulateur de Chauffeur Créé :**
- `web/index.html` - Interface web interactive
- `web/firebase-config.js` - Configuration Firebase
- `web/README.md` - Documentation complète
- `web/QUICK_START.md` - Guide de démarrage rapide
- `web/start.sh` - Script de lancement

**⏱️ Temps réel :** 3 heures (partie client)

---

## ✅ PHASE 9 : Push Notifications & Chat (COMPLÈTE)

### ✅ Firebase Cloud Messaging
- ✅ Package `@react-native-firebase/messaging` installé et configuré
- ✅ Plugin FCM ajouté dans `app.json`
- ✅ Service de notifications créé (`lib/notifications.ts`)
  - Demande de permissions (iOS + Android)
  - Obtention et sauvegarde du token FCM
  - Gestion des notifications foreground/background
  - Abonnement aux topics
  - Gestion du refresh du token
- ✅ Initialisation automatique au login (`app/_layout.tsx`)
- ✅ Token FCM sauvegardé dans Firestore
- ✅ Notifications envoyées automatiquement depuis le dashboard web :
  - 🚗 Chauffeur trouvé (ride accepted)
  - 🚀 Trajet démarré (trip started)
  - ✅ Trajet terminé (trip completed)
- ✅ Gestion des notifications reçues :
  - Foreground : Alert affiché
  - Background : Notification système
  - App fermée : Click ouvre l'app

### 📱 Fonctionnalités Implémentées
- ✅ Demande de permission native (iOS dialog)
- ✅ Token automatiquement sauvegardé dans Firestore (`users.fcmToken`)
- ✅ Abonnement aux topics (`user_{userId}`, `all_users`)
- ✅ Refresh automatique du token
- ✅ Notifications en temps réel lors des changements de statut
- ✅ Support foreground + background + quit state
- ✅ Data payload inclus dans chaque notification

### 🌐 Dashboard Web Intégré
- ✅ Fonction `sendNotification()` ajoutée
- ✅ Envoi automatique quand :
  - Chauffeur accepte une ride
  - Chauffeur démarre le trajet
  - Chauffeur termine le trajet
- ✅ Templates de notifications prédéfinis

### ⬜ Chat In-App (Pas fait - Optionnel)
- ⬜ Collection `messages`
- ⬜ Écran chat simple
- ⬜ Boutons pré-définis ("Où êtes-vous ?", "J'arrive", etc.)

**Note :** Le chat n'est pas critique pour un MVP. Les notifications push suffisent pour la communication de base.

**📁 Fichiers créés/modifiés :**
- `lib/notifications.ts` - Service complet de notifications
- `app/_layout.tsx` - Initialisation et gestion
- `app.json` - Plugin FCM
- `web/index.html` - Envoi de notifications depuis dashboard
- `web/notifications.js` - Templates et helpers
- `NOTIFICATIONS_SETUP.md` - Documentation complète

**⏱️ Temps réel :** 2 heures

---

## ⬜ PHASE 10 : Payment Integration

### QCell Money / Africell Money
- ⬜ Rechercher APIs de paiement mobile Gambie
- ⬜ Intégrer SDK de paiement
- ⬜ Flow de paiement :
  - Sélection méthode (Cash, QCell, Africell)
  - Si mobile money : redirection
  - Confirmation paiement
  - Update balance

### Wallet System
- ⬜ Afficher balance utilisateur
- ⬜ Historique transactions
- ⬜ Recharge du wallet

**⏱️ Temps estimé :** 3-4 jours

---

## ⬜ PHASE 11 : Polish & Optimisation

### Features Avancées
- ⬜ Schedule ride (planifier course)
- ⬜ Adresses favorites complètes
- ⬜ Programme fidélité fonctionnel
- ⬜ Code parrainage avec rewards
- ⬜ Dashboard chauffeur (revenus)

### Tests & QA
- ⬜ Tests E2E avec Detox
- ⬜ Tests unitaires (Jest)
- ⬜ Performance optimization
- ⬜ Error handling complet
- ⬜ Analytics (Firebase Analytics)

### Documentation
- ⬜ README complet
- ⬜ Guide utilisateur
- ⬜ API documentation

**⏱️ Temps estimé :** 5-7 jours

---

## ⬜ PHASE 12 : App Chauffeur (Driver App)

### Créer nouvelle app
- ⬜ `npx create-expo-app blu-maze-driver`
- ⬜ Même structure que client app
- ⬜ Features spécifiques :
  - Toggle Online/Offline
  - Accepter/Refuser courses
  - Navigation vers client
  - Earnings dashboard
  - Documents upload

**⏱️ Temps estimé :** 7-10 jours

---

## ⬜ PHASE 13 : Déploiement

### Build Production
- ⬜ Configurer EAS Build
- ⬜ Build iOS : `eas build --profile production --platform ios`
- ⬜ Build Android : `eas build --profile production --platform android`

### Submission Stores
- ⬜ Apple App Store
  - Screenshots (6.5", 5.5")
  - Description
  - Privacy policy
  - Submit for review

- ⬜ Google Play Store
  - Screenshots
  - Description
  - Content rating
  - Publish

### Updates OTA
- ⬜ Configurer EAS Update
- ⬜ Flow de deployment :
  - Dev → Staging → Production
  - Rollback si nécessaire

**⏱️ Temps estimé :** 3-5 jours

---

## 📝 Notes Importantes

### APIs à Configurer
1. **Google Maps** (Phase 6)
   - Maps SDK Android
   - Maps SDK iOS
   - Directions API
   - Places API
   - Geocoding API

2. **Firebase** (Phase 7-8)
   - Authentication
   - Firestore
   - Cloud Functions
   - Cloud Messaging
   - Storage

3. **Payment** (Phase 10)
   - QCell Money API
   - Africell Money API

### Coûts Estimés (Mensuel)
- Google Maps : Gratuit jusqu'à 200$/mois
- Firebase : Gratuit jusqu'à 10K users actifs
- EAS Build : 29$/mois (ou builds locaux gratuits)
- Paiement mobile : Frais de transaction variables

### Timeline Estimée
- **Développement complet** : 8-12 semaines
- **MVP (Phases 1-8)** : 4-6 semaines
- **Production ready (Phases 1-13)** : 10-14 semaines

---

## 🆘 Si Tu Perds la Session

### Reprendre depuis Phase 6
```bash
cd blu-maze-client

# Vérifier packages installés
npm list react-native-maps expo-location

# Si manquants
npx expo install react-native-maps expo-location
npm install react-native-google-places-autocomplete

# Lire le guide
cat GOOGLE_MAPS_SETUP.md

# Tester l'app
npx expo start --port 8082
```

### Fichiers Importants à Check
- `app.json` - Config générale
- `lib/store.ts` - State management
- `components/Map.tsx` - Composant carte
- `lib/maps.ts` - Utilitaires Google Maps
- `app/(main)/index.tsx` - Home screen

### Commandes Utiles
```bash
# Démarrer l'app
npx expo start --port 8082

# Clear cache
npx expo start --clear

# Build development
eas build --profile development --platform android

# Update OTA
eas update --branch preview
```

---

## 📞 Contacts & Ressources

### Documentation
- [Expo Docs](https://docs.expo.dev)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Firebase Docs](https://firebase.google.com/docs)
- [Google Maps Platform](https://developers.google.com/maps)

### Support
- Stack Overflow (tag: expo, react-native)
- Expo Discord : https://chat.expo.dev
- GitHub Issues : Report bugs

---

**🎯 Prochain Objectif Immédiat :**

### ✅ Simulateur de Chauffeur Créé !

Le dossier `web/` contient maintenant une interface complète pour tester le système :

**Pour commencer :**
1. Va dans le dossier `web/`
2. Lis `QUICK_START.md`
3. Configure ton `appId` dans `firebase-config.js`
4. Lance `./start.sh` ou `python3 -m http.server 8000`
5. Ouvre http://localhost:8000

**Flow de test complet :**
1. Crée une ride depuis l'app mobile
2. Accepte-la dans le dashboard web
3. Change la position GPS du "chauffeur"
4. Démarre puis termine la course
5. Note le chauffeur dans l'app

### Option 1 : Tester avec le simulateur (Recommandé ⭐)
```bash
cd web
./start.sh
```

Puis teste le flow complet en créant des rides depuis l'app et en les gérant via le dashboard !

### Option 2 : Rebuild et tester sur device
```bash
eas build --profile development --platform android
```

### Option 3 : Passer à Phase 9 (Push Notifications)
Configurer Firebase Cloud Messaging pour notifier l'utilisateur et le chauffeur.

**Bonne chance ! 🚀**
