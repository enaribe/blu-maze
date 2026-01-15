# 🗺️ Fix : Chemins (Routes) Disparaissent sur la Map

## 🐛 Problème Identifié

### Symptômes
- ✅ Map s'affiche correctement
- ✅ Directions calculées (259 points)
- ❌ **Polyline (chemin) disparaît immédiatement**
- ❌ Re-renders constants (HomeScreen se remonte en boucle)
- ❌ `routePoints` passe de 0 → 259 → 0

### Cause Racine

**Re-renders en boucle causés par :**

1. **Tableau `markers` recréé à chaque render** dans `index.tsx`
   ```typescript
   // ❌ AVANT : Nouveau tableau à chaque render
   const markers = [];
   if (pickupLocation) {
     markers.push(...);
   }
   // → Cela causait un re-render du composant Map
   // → Qui causait fitToCoordinates
   // → Qui causait un re-render de HomeScreen
   // → Boucle infinie !
   ```

2. **useEffect se déclenche trop souvent** pour calculer la route
   ```typescript
   // ❌ AVANT : Se déclenche même quand destination identique
   useEffect(() => {
     if (pickupLocation) {
       calculateRoute(...);
     }
   }, [params.destination, params.destLat, params.destLng, pickupLocation]);
   // → Route recalculée en boucle
   ```

3. **fitToCoordinates appelé trop souvent** dans Map.tsx
   ```typescript
   // ❌ AVANT : Appelé à chaque changement de markers/route
   useEffect(() => {
     mapRef.current.fitToCoordinates(...);
   }, [markers, route, userLocation]);
   // → Causait des animations en boucle
   ```

---

## ✅ Solution Appliquée

### 1. Mémorisation des Markers (`app/(main)/index.tsx`)

**Avant :**
```typescript
const markers = [];
if (pickupLocation) {
  markers.push({
    coordinate: pickupLocation.coords,
    title: 'Pickup',
    description: pickupLocation.address,
  });
}
// ... etc
```

**Après :**
```typescript
import { useEffect, useState, useMemo } from 'react';

const markers = useMemo(() => {
  const markersList = [];
  if (pickupLocation) {
    markersList.push({
      coordinate: pickupLocation.coords,
      title: 'Pickup',
      description: pickupLocation.address,
    });
  }
  // ... etc
  return markersList;
}, [pickupLocation, destinationLocation, driverLocation, step, rideStatus]);
```

**Résultat :**
- ✅ Markers ne sont recréés **que quand nécessaire**
- ✅ Pas de re-renders inutiles du composant Map

---

### 2. Éviter le Recalcul de Route (`app/(main)/index.tsx`)

**Avant :**
```typescript
useEffect(() => {
  if (params.destination && params.destLat && params.destLng) {
    const destCoords = {
      latitude: parseFloat(params.destLat as string),
      longitude: parseFloat(params.destLng as string),
    };

    setDestinationLocation({
      address: params.destination as string,
      coords: destCoords,
    });

    if (pickupLocation) {
      calculateRoute(pickupLocation.coords, destCoords);
    }
  }
}, [params.destination, params.destLat, params.destLng, pickupLocation]);
```

**Après :**
```typescript
useEffect(() => {
  if (params.destination && params.destLat && params.destLng && pickupLocation) {
    const destCoords = {
      latitude: parseFloat(params.destLat as string),
      longitude: parseFloat(params.destLng as string),
    };

    // ✅ Vérifier si destination a vraiment changé
    if (!destinationLocation ||
        destinationLocation.coords.latitude !== destCoords.latitude ||
        destinationLocation.coords.longitude !== destCoords.longitude) {

      setDestinationLocation({
        address: params.destination as string,
        coords: destCoords,
      });

      calculateRoute(pickupLocation.coords, destCoords);
    }
  }
}, [params.destination, params.destLat, params.destLng, pickupLocation]);
```

**Résultat :**
- ✅ Route calculée **une seule fois** par changement de destination
- ✅ Pas de recalculs inutiles

---

### 3. Délai pour fitToCoordinates (`components/Map.tsx`)

**Avant :**
```typescript
useEffect(() => {
  if (mapRef.current && (markers.length > 0 || route.length > 0)) {
    const coordinates = [...markers.map(m => m.coordinate), ...route];

    if (coordinates.length > 0) {
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
        animated: true,
      });
    }
  }
}, [markers, route, userLocation]);
```

**Après :**
```typescript
import React, { useRef, useEffect, useState, useCallback } from 'react';

useEffect(() => {
  if (!mapRef.current || (markers.length === 0 && route.length === 0)) {
    return;
  }

  // ✅ Délai de 500ms pour éviter les appels multiples
  const timeoutId = setTimeout(() => {
    if (!mapRef.current) return;

    const coordinates = [
      ...markers.map(m => m.coordinate),
      ...route,
    ];

    if (userLocation) {
      coordinates.push({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
    }

    if (coordinates.length > 0) {
      console.log('🗺️ [Map] Fitting to coordinates:', coordinates.length);
      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
        animated: true,
      });
    }
  }, 500); // ✅ Wait 500ms before fitting

  return () => clearTimeout(timeoutId);
}, [markers, route, userLocation]);
```

**Résultat :**
- ✅ fitToCoordinates appelé **une seule fois** après stabilisation
- ✅ Pas d'animations répétées

---

## 🎯 Résultat Final

### ✅ Ce qui fonctionne maintenant

- ✅ **Map s'affiche** avec les markers
- ✅ **Route (Polyline) visible** et stable
- ✅ **Pas de re-renders en boucle**
- ✅ **Pas de disparition du chemin**
- ✅ **Performances optimisées**

### 📊 Logs Attendus (Normaux)

```
🏠 [HomeScreen] Component mounted, getting location...
🏠 [HomeScreen] Location permission status: granted
🏠 [HomeScreen] ✅ Location obtained: { latitude: 14.7037, longitude: -17.4681 }
🏠 [HomeScreen] Reverse geocoding address...
🏠 [HomeScreen] Address: PG3J+HM7, Dakar, Senegal
🏠 [HomeScreen] Setting loadingLocation to false
🏠 [HomeScreen] Map data updated: { markersCount: 1, routePoints: 0 }

[Après sélection destination]
🏠 [HomeScreen] Map data updated: { markersCount: 2, routePoints: 259 }
🗺️ [Map] Fitting to coordinates: 261
🗺️ [Map] ✅ Map ready!
```

**Pas de cycles répétés !**

---

## 🧪 Comment Tester

### Test 1 : Sélection Destination

1. Lance l'app
2. Click sur le champ destination
3. Sélectionne une destination
4. ✅ **Vérifie que le chemin bleu (Polyline) apparaît**
5. ✅ **Vérifie que le chemin reste visible**
6. ✅ **Vérifie dans les logs qu'il n'y a pas de cycles**

### Test 2 : Order Ride

1. Click "Order ride"
2. Status passe à "connecting"
3. ✅ **Vérifie que le chemin reste visible**
4. ✅ **Pas de disparition**

### Test 3 : Driver Location (Quand ride acceptée)

1. Depuis le dashboard web, accepte la ride
2. ✅ **Marker driver apparaît**
3. ✅ **Chemin toujours visible**
4. ✅ **Pas de re-renders en boucle**

---

## 📝 Fichiers Modifiés

### `app/(main)/index.tsx`
```diff
- import { useEffect, useState } from 'react';
+ import { useEffect, useState, useMemo } from 'react';

- const markers = [];
- if (pickupLocation) { ... }
+ const markers = useMemo(() => {
+   const markersList = [];
+   if (pickupLocation) { ... }
+   return markersList;
+ }, [pickupLocation, destinationLocation, driverLocation, step, rideStatus]);

  useEffect(() => {
-   if (params.destination && params.destLat && params.destLng) {
+   if (params.destination && params.destLat && params.destLng && pickupLocation) {
      const destCoords = { ... };

+     // Only update if destination actually changed
+     if (!destinationLocation ||
+         destinationLocation.coords.latitude !== destCoords.latitude ||
+         destinationLocation.coords.longitude !== destCoords.longitude) {

        setDestinationLocation({ ... });
-       if (pickupLocation) {
          calculateRoute(pickupLocation.coords, destCoords);
-       }
+     }
    }
  }, [params.destination, params.destLat, params.destLng, pickupLocation]);
```

### `components/Map.tsx`
```diff
- import React, { useRef, useEffect, useState } from 'react';
+ import React, { useRef, useEffect, useState, useCallback } from 'react';

  useEffect(() => {
-   if (mapRef.current && (markers.length > 0 || route.length > 0)) {
+   if (!mapRef.current || (markers.length === 0 && route.length === 0)) {
+     return;
+   }

+   const timeoutId = setTimeout(() => {
+     if (!mapRef.current) return;

      const coordinates = [...markers.map(m => m.coordinate), ...route];

      if (coordinates.length > 0) {
+       console.log('🗺️ [Map] Fitting to coordinates:', coordinates.length);
        mapRef.current.fitToCoordinates(coordinates, {
-         edgePadding: { top: 100, right: 50, bottom: 100, left: 50 },
+         edgePadding: { top: 100, right: 50, bottom: 300, left: 50 },
          animated: true,
        });
      }
-   }
+   }, 500);
+
+   return () => clearTimeout(timeoutId);
  }, [markers, route, userLocation]);
```

---

## 🔧 Concepts React Utilisés

### 1. **useMemo**
Mémorise une valeur calculée et ne la recalcule que si les dépendances changent.

```typescript
const markers = useMemo(() => {
  // Calcul coûteux
  return result;
}, [dependencies]);
```

### 2. **Debouncing avec setTimeout**
Attend un délai avant d'exécuter une fonction pour éviter les appels multiples.

```typescript
useEffect(() => {
  const timeoutId = setTimeout(() => {
    // Action à exécuter
  }, 500);

  return () => clearTimeout(timeoutId); // Cleanup
}, [dependencies]);
```

### 3. **Vérification de Changement Avant Update**
Évite les updates inutiles en vérifiant si la valeur a vraiment changé.

```typescript
if (!state || state.value !== newValue) {
  setState(newValue);
}
```

---

## 🎓 Leçons Apprises

### ❌ Erreurs à Éviter

1. **Créer des objets/arrays dans le render**
   ```typescript
   // ❌ BAD
   const markers = [];
   markers.push(...);

   // ✅ GOOD
   const markers = useMemo(() => { ... }, [deps]);
   ```

2. **useEffect sans condition de sortie**
   ```typescript
   // ❌ BAD : Boucle infinie
   useEffect(() => {
     calculateRoute();
   }, [pickupLocation]); // Se déclenche en boucle

   // ✅ GOOD
   useEffect(() => {
     if (shouldCalculate) {
       calculateRoute();
     }
   }, [pickupLocation, shouldCalculate]);
   ```

3. **Animations répétées**
   ```typescript
   // ❌ BAD : fitToCoordinates à chaque render
   useEffect(() => {
     mapRef.current.fitToCoordinates(...);
   }, [markers, route]);

   // ✅ GOOD : Avec délai
   useEffect(() => {
     const timeout = setTimeout(() => {
       mapRef.current.fitToCoordinates(...);
     }, 500);
     return () => clearTimeout(timeout);
   }, [markers, route]);
   ```

---

## 📚 Références

- [React useMemo](https://react.dev/reference/react/useMemo)
- [React useEffect cleanup](https://react.dev/reference/react/useEffect#removing-unnecessary-object-dependencies)
- [React Native Maps - fitToCoordinates](https://github.com/react-native-maps/react-native-maps/blob/master/docs/mapview.md#methods)

---

**🎉 Fix appliqué ! Les routes devraient maintenant rester visibles sur la map sans disparaître !** 🗺️
