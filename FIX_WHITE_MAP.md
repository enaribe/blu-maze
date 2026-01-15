# 🗺️ Fix : Carte Blanche (White Map)

## Problème
La carte Google Maps s'affiche en blanc, mais les logs montrent que tout fonctionne côté code.

## Cause
Les **APIs Google Maps ne sont pas toutes activées** dans Google Cloud Console.

---

## ✅ Solution : Activer toutes les APIs nécessaires

### Étape 1 : Aller sur Google Cloud Console

1. Va sur : https://console.cloud.google.com
2. Connecte-toi avec le compte Google utilisé pour la clé API
3. Sélectionne ton projet (ou crée-en un si nécessaire)

### Étape 2 : Activer les APIs Required

Va sur : **APIs & Services** → **Library**

**Active les APIs suivantes (TOUTES sont nécessaires) :**

#### Pour Android :
1. ✅ **Maps SDK for Android**
   - https://console.cloud.google.com/apis/library/maps-android-backend.googleapis.com
   - Click "ENABLE"

2. ✅ **Maps SDK for iOS** (si tu build pour iOS aussi)
   - https://console.cloud.google.com/apis/library/maps-ios-backend.googleapis.com
   - Click "ENABLE"

#### Pour les fonctionnalités (IMPORTANT) :
3. ✅ **Directions API**
   - https://console.cloud.google.com/apis/library/directions-backend.googleapis.com
   - Click "ENABLE"

4. ✅ **Distance Matrix API**
   - https://console.cloud.google.com/apis/library/distance-matrix-backend.googleapis.com
   - Click "ENABLE"

5. ✅ **Geocoding API**
   - https://console.cloud.google.com/apis/library/geocoding-backend.googleapis.com
   - Click "ENABLE"

6. ✅ **Places API (New)**
   - https://console.cloud.google.com/apis/library/places-backend.googleapis.com
   - Click "ENABLE"

7. ✅ **Geolocation API**
   - https://console.cloud.google.com/apis/library/geolocation.googleapis.com
   - Click "ENABLE"

### Étape 3 : Vérifier les restrictions de l'API Key

1. Va sur : **APIs & Services** → **Credentials**
2. Click sur ta clé API (AIzaSyDh-1JWqpK2QuqAz5a9yDL-MHmNEDp6kgQ)
3. Section **API restrictions** :
   - Option 1 (Recommandé pour le dev) : **Don't restrict key**
   - Option 2 (Plus sécurisé) : Sélectionne toutes les APIs ci-dessus

4. Section **Application restrictions** :
   - Pour le dev : **None**
   - Pour la prod : **Android apps** avec ton package name

5. Click **SAVE**

---

## 🔄 Après avoir activé les APIs

### Option 1 : Attendre (Recommandé)
Les changements prennent **5-10 minutes** pour se propager.

1. Ferme complètement l'app (swipe away)
2. Attends 5 minutes
3. Rouvre l'app
4. ✅ La carte devrait apparaître !

### Option 2 : Rebuild (Si ça ne marche toujours pas)
```bash
# Clean rebuild
npx expo prebuild --clean
eas build --profile development --platform android
```

---

## 🧪 Test Rapide

Pour tester si les APIs sont actives :

### Test 1 : API Maps SDK
1. Ouvre l'app
2. Si tu vois la carte (même vide) → ✅ Maps SDK activé
3. Si blanc → ❌ Maps SDK pas activé

### Test 2 : API Directions
1. Sélectionne une destination
2. Si tu vois la route tracée → ✅ Directions API activé
3. Si pas de route → ❌ Directions API pas activé

### Test 3 : API Geocoding
1. Regarde l'adresse affichée en haut
2. Si tu vois ton adresse exacte → ✅ Geocoding activé
3. Si "Current location" → ❌ Geocoding pas activé

---

## 🎯 Checklist Complète

Avant de tester, vérifie que tu as fait TOUT ça :

### Google Cloud Console
- [ ] Projet créé ou sélectionné
- [ ] Maps SDK for Android activé
- [ ] Directions API activé
- [ ] Geocoding API activé
- [ ] Places API activé
- [ ] Distance Matrix API activé
- [ ] Geolocation API activé
- [ ] API Key sans restrictions (pour le dev)
- [ ] Attendu 5-10 minutes après activation

### App
- [ ] google-services.json présent
- [ ] GoogleService-Info.plist présent (iOS)
- [ ] API key dans app.json (lignes 24 et 46)
- [ ] App rebuilté avec EAS (si nouveau build)
- [ ] App complètement fermée et rouverte

---

## 🐛 Toujours Blanc ?

### Debug : Vérifier l'erreur exacte

Ouvre les logs avec :
```bash
npx expo start
```

Puis dans l'app, va dans :
- Shake le téléphone → Dev Menu
- Remote JS Debugging
- Ouvre Chrome DevTools → Console

Cherche des erreurs comme :
- `This API project is not authorized to use this API`
- `REQUEST_DENIED`
- `OVER_QUERY_LIMIT`

### Si "API project not authorized"
→ L'API n'est pas activée, retourne à l'Étape 2

### Si "REQUEST_DENIED"
→ Restrictions sur l'API key, retourne à l'Étape 3

### Si pas d'erreur mais toujours blanc
→ Rebuild avec :
```bash
npx expo prebuild --clean
eas build --profile development --platform android
```

---

## 📸 À Quoi Ça Devrait Ressembler

### Avant (Carte Blanche)
```
+-------------------+
|                   |
|                   |
|     [BLANC]       |
|                   |
|                   |
+-------------------+
```

### Après (Carte Google Maps)
```
+-------------------+
| My position >     |
| Kairaba Avenue... |
+-------------------+
|  🗺️ [MAP]        |
|    📍 Pickup      |
|    🔵 You         |
|  Routes, POIs...  |
+-------------------+
```

---

## 💡 Astuce Pro

Pour éviter ce problème à l'avenir :
1. Active TOUTES les APIs dès le début
2. Utilise "Don't restrict key" pendant le dev
3. Ajoute les restrictions uniquement en production
4. Vérifie le quota (Google offre 200$/mois gratuit)

---

## 📞 Liens Utiles

- Google Cloud Console : https://console.cloud.google.com
- APIs Library : https://console.cloud.google.com/apis/library
- Credentials : https://console.cloud.google.com/apis/credentials
- Google Maps Platform Pricing : https://mapsplatform.google.com/pricing/

---

**🎯 95% des cartes blanches sont résolues en activant les APIs manquantes !**

Après activation, attends 5 minutes et rouvre l'app. Ça devrait marcher ! 🚀
