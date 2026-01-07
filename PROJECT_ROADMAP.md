# 🚀 BLU MAZE - Roadmap Complet du Projet

**Application VTC pour la Gambie**
**Dernière mise à jour :** 5 Janvier 2026
**Statut :** En développement - Phase 6 en cours

---

## 📊 Vue d'Ensemble

```
Progression Globale : ████████████░░░░░░░░ 60%

✅ Phase 1-5 : Complètes
🔄 Phase 6  : En cours (Google Maps)
⬜ Phase 7-10: À venir
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

## 🔄 PHASE 6 : Google Maps Integration (EN COURS - 50%)

### ✅ Fait
- ✅ Packages installés :
  - `react-native-maps`
  - `expo-location`
  - `react-native-google-places-autocomplete`
- ✅ `app.json` configuré :
  - Permissions de localisation (iOS + Android)
  - Placeholders pour API keys
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

### ⬜ À Faire
- ⬜ **URGENT** : Obtenir clés API Google Maps
  1. Créer projet Google Cloud Console
  2. Activer APIs (Maps SDK, Directions, Places, Geocoding)
  3. Créer clés API (Android + iOS)
  4. Configurer dans `app.json` (lignes 23 et 42)
  5. Configurer dans `lib/maps.ts` (ligne 6)

- ⬜ Créer composant Places Autocomplete
  - Input avec suggestions en temps réel
  - Gestion des favoris (Home, Office)
  - Sélection sur carte (drag & drop pin)

- ⬜ Intégrer carte dans `app/(main)/index.tsx`
  - Remplacer le mock par `<Map />`
  - Afficher position utilisateur
  - Afficher route pickup → destination
  - Calculer prix automatiquement

- ⬜ Tester sur device réel
  - Build development avec EAS
  - Tester géolocalisation
  - Tester autocomplete
  - Tester calcul de route

**📁 Fichiers clés :** `components/Map.tsx`, `lib/maps.ts`, `GOOGLE_MAPS_SETUP.md`

**⏱️ Temps estimé :** 2-3 jours

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

## ⬜ PHASE 8 : Backend & Matching Drivers

### Firestore Collections
- ⬜ Collection `drivers` :
  ```typescript
  {
    driverId: string
    phoneNumber: string
    firstName: string
    lastName: string
    isOnline: boolean
    currentLocation: GeoPoint
    rating: number
    totalRides: number
    vehicle: { make, model, year, color, plate }
    documents: { license, insurance, status }
  }
  ```

- ⬜ Collection `rides` :
  ```typescript
  {
    rideId: string
    userId: string
    driverId: string?
    status: 'pending' | 'accepted' | 'in_progress' | 'completed'
    type: 'instant' | 'scheduled'
    pickup: { address, coords }
    destination: { address, coords }
    distance: number
    duration: number
    price: number
    timestamps: { created, accepted?, started?, completed? }
  }
  ```

### Cloud Functions
- ⬜ `onRideCreated` - Matching driver
  - Query drivers online et proches
  - Envoyer notification push
  - Retry toutes les 5 sec
  - Timeout après 2 min

- ⬜ `calculatePrice` - Calcul prix
  - Appel Distance Matrix API
  - Formule : Base + (distance × prix/km) + (durée × prix/min)

- ⬜ `onRideCompleted` - Post-trajet
  - Update stats chauffeur
  - Update points fidélité client
  - Calculer ratings moyens

### Real-time Updates
- ⬜ Listener Firestore pour statut ride
- ⬜ Update UI en temps réel
- ⬜ Tracking position chauffeur (live)

**📁 Nouveaux fichiers :** `functions/`, `lib/firebase.ts`

**⏱️ Temps estimé :** 4-5 jours

---

## ⬜ PHASE 9 : Push Notifications & Chat

### Firebase Cloud Messaging
- ⬜ Configurer FCM
- ⬜ Demander permissions notifications
- ⬜ Sauvegarder token FCM dans Firestore
- ⬜ Envoyer notifications :
  - Chauffeur trouvé
  - Chauffeur en route
  - Chauffeur arrivé
  - Trajet démarré
  - Trajet terminé

### Chat In-App (Optionnel)
- ⬜ Collection `messages`
- ⬜ Écran chat simple
- ⬜ Boutons pré-définis ("Où êtes-vous ?", "J'arrive", etc.)

**⏱️ Temps estimé :** 2-3 jours

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
Obtenir les clés API Google Maps et intégrer la vraie carte !

**Bonne chance ! 🚀**
