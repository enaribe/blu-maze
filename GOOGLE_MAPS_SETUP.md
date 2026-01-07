# Google Maps Configuration pour Blu Maze

## 🔑 Obtenir une Clé API Google Maps

### Étape 1 : Créer un Projet Google Cloud

1. Va sur [Google Cloud Console](https://console.cloud.google.com/)
2. Clique sur "Créer un projet" ou sélectionne un projet existant
3. Nomme le projet "Blu Maze" (ou autre nom de ton choix)
4. Clique sur "Créer"

### Étape 2 : Activer les APIs Nécessaires

Active les APIs suivantes dans ton projet :

1. **Maps SDK for Android**
2. **Maps SDK for iOS**
3. **Directions API**
4. **Places API**
5. **Geocoding API**
6. **Distance Matrix API**

Pour activer une API :
- Va dans "APIs & Services" > "Library"
- Recherche l'API (ex: "Maps SDK for Android")
- Clique sur l'API puis sur "Activer"

### Étape 3 : Créer les Clés API

#### Pour Android :

1. Va dans "APIs & Services" > "Credentials"
2. Clique sur "Create Credentials" > "API Key"
3. Une clé sera générée (ex: `AIzaSyC...`)
4. Clique sur "Restrict Key" pour sécuriser
5. Dans "Application restrictions", sélectionne "Android apps"
6. Ajoute ton package name : `com.blumaze.client`
7. Ajoute ton SHA-1 fingerprint (obtenu via `keytool`)
8. Dans "API restrictions", sélectionne les APIs listées ci-dessus
9. Sauvegarde

#### Pour iOS :

1. Crée une nouvelle clé API (ou réutilise celle d'Android)
2. Dans "Application restrictions", sélectionne "iOS apps"
3. Ajoute ton Bundle ID : `com.blumaze.client`
4. Sauvegarde

### Étape 4 : Configurer les Clés dans le Projet

1. **Ouvre `app.json`**

2. **Remplace les placeholders :**

```json
"ios": {
  "config": {
    "googleMapsApiKey": "TA_CLE_IOS_ICI"
  }
},
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "TA_CLE_ANDROID_ICI"
    }
  }
}
```

3. **Ouvre `lib/maps.ts`**

4. **Remplace le placeholder :**

```typescript
const GOOGLE_MAPS_API_KEY = 'TA_CLE_API_ICI';
```

**⚠️ IMPORTANT : Utilise la même clé ou crée une clé séparée pour les API Web**

## 💰 Tarification Google Maps

### Plan Gratuit (2026)
- **200 USD de crédit gratuit par mois**
- Équivalent à :
  - ~40,000 requêtes Maps SDK
  - ~40,000 requêtes Directions API
  - ~100,000 requêtes Geocoding API

### Conseils pour Optimiser les Coûts

1. **Cache les résultats** : Ne refais pas la même requête plusieurs fois
2. **Limite les appels** : Attends que l'utilisateur arrête de taper avant d'autocomplete
3. **Utilise les bons endpoints** : Distance Matrix est plus cher que Directions

## 🧪 Tester Sans Clé API (Développement)

Pour tester sans configurer Google Maps immédiatement :

1. La carte affichera un message d'erreur mais l'app fonctionnera
2. Le mock existant continuera de fonctionner
3. Configure les clés quand tu es prêt pour les tests réels

## 📱 Build & Test

Après configuration :

```bash
# Development build (nécessaire pour les modules natifs)
eas build --profile development --platform android
eas build --profile development --platform ios

# Ou utilise expo-dev-client
npx expo install expo-dev-client
npx expo run:android
npx expo run:ios
```

## ⚠️ Sécurité

**Ne commite JAMAIS tes clés API dans Git !**

Pour sécuriser :

1. Crée un fichier `.env` :
```
GOOGLE_MAPS_API_KEY=ta_cle_ici
```

2. Ajoute `.env` au `.gitignore`

3. Utilise `expo-constants` pour charger les variables :
```typescript
import Constants from 'expo-constants';
const API_KEY = Constants.expoConfig?.extra?.googleMapsApiKey;
```

## 🆘 Problèmes Courants

### "Google Maps SDK for Android requires a valid API key"
→ Vérifie que la clé est bien dans `app.json` sous `android.config.googleMaps.apiKey`

### "This API project is not authorized to use this API"
→ Active l'API dans Google Cloud Console

### "The provided API key is invalid"
→ Vérifie que tu as copié la clé complète sans espaces

### La carte est grise/noire
→ Vérifie les restrictions de la clé API (package name, bundle ID)

## 📚 Documentation

- [Google Maps Platform](https://developers.google.com/maps)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Expo Location](https://docs.expo.dev/versions/latest/sdk/location/)
