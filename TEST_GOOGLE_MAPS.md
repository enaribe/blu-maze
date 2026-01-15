# 🧪 Test Google Maps API

## Test 1 : Vérifier que l'API Key fonctionne

Ouvre ce lien dans ton navigateur (remplace YOUR_API_KEY) :

```
https://maps.googleapis.com/maps/api/geocode/json?address=Banjul,Gambia&key=AIzaSyAFGHTBWWghUIVOKXeVd0Yvh0jeP08FgRo
```

**Si ça marche :**
Tu verras du JSON avec des coordonnées.

**Si ça ne marche pas :**
Tu verras une erreur comme :
- `REQUEST_DENIED` → Billing pas activé ou API pas activée
- `OVER_QUERY_LIMIT` → Quota dépassé
- `INVALID_REQUEST` → Clé invalide

---

## Test 2 : Vérifier Maps SDK for Android

Dans Google Cloud Console :

1. Va sur : https://console.cloud.google.com/apis/dashboard
2. Cherche "Maps SDK for Android" dans la liste
3. Tu devrais voir le nombre de requêtes (ex: "1,234 requests today")
4. Si tu vois 0 requêtes → L'app n'utilise pas cette API !

---

## Test 3 : Vérifier le Billing

1. Va sur : https://console.cloud.google.com/billing
2. Tu devrais voir ton projet lié à un compte de facturation
3. Si tu vois "No billing account" → **C'EST LE PROBLÈME !**

Pour activer :
1. Click "Link a billing account"
2. Crée un compte (carte bancaire requise mais pas de charge si < 200$/mois)
3. Lie-le à ton projet

---

## Test 4 : Vérifier dans l'app

Dans ton app, ajoute ce test dans `components/Map.tsx` :

```typescript
useEffect(() => {
    console.log('🗺️ [Map] Testing API Key...');
    fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=Banjul&key=AIzaSyAFGHTBWWghUIVOKXeVd0Yvh0jeP08FgRo`)
        .then(res => res.json())
        .then(data => {
            console.log('🗺️ [Map] API Test Result:', data.status);
            if (data.status === 'REQUEST_DENIED') {
                console.error('🗺️ [Map] ❌ API Key denied! Check billing and API restrictions');
            } else if (data.status === 'OK') {
                console.log('🗺️ [Map] ✅ API Key works!');
            }
        })
        .catch(err => console.error('🗺️ [Map] API Test Error:', err));
}, []);
```

Lance l'app et regarde les logs. Si tu vois `REQUEST_DENIED`, c'est un problème de billing ou d'API pas activée.

---

## Problèmes Courants

### ❌ Carte Blanche + Geocoding fonctionne
**Cause :** Billing pas activé (gratuit mais carte requise)
**Solution :** Active le billing sur Google Cloud Console

### ❌ "This API project is not authorized"
**Cause :** Maps SDK for Android pas activé
**Solution :** Active-le sur https://console.cloud.google.com/apis/library/maps-android-backend.googleapis.com

### ❌ Carte blanche seulement sur Android (iOS marche)
**Cause :** SHA-1 fingerprint manquant dans restrictions
**Solution :** Enlève les restrictions ou ajoute le fingerprint

---

## Checklist Complète

- [ ] Billing activé (carte bancaire liée)
- [ ] Maps SDK for Android activé (avec bouton "MANAGE")
- [ ] Geocoding API activé
- [ ] Directions API activé
- [ ] Places API activé
- [ ] API Key sans restrictions (pour dev)
- [ ] App rebuilté avec EAS après changement de clé
- [ ] Attendu 5-10 minutes après activation

---

## 🎯 La Vraie Cause 99% du Temps

**BILLING PAS ACTIVÉ**

Google Maps Platform nécessite un compte de facturation actif, même si tu restes dans les limites gratuites (200$/mois).

1. Va sur : https://console.cloud.google.com/billing
2. Link a billing account
3. Ajoute ta carte bancaire
4. ✅ La carte apparaîtra instantanément !

Tu ne seras PAS chargé tant que tu restes sous 200$/mois (largement suffisant pour le dev).
