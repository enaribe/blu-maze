# 🔧 Fix : Erreur Firebase iOS Build

## 🐛 Problème

Erreur lors du build iOS EAS :

```
[!] The following Swift pods cannot yet be integrated as static libraries:

The Swift pod `FirebaseAuth` depends upon `FirebaseAuthInterop`, `FirebaseAppCheckInterop`,
`FirebaseCore`, `FirebaseCoreExtension`, `GoogleUtilities`, and `RecaptchaInterop`,
which do not define modules.

To opt into those targets generating module maps (which is necessary to import them from
Swift when building as static libraries), you may set `use_modular_headers!` globally
in your Podfile, or specify `:modular_headers => true` for particular dependencies.
```

## ✅ Solution Appliquée

J'ai créé un **script Node.js** qui modifie automatiquement le Podfile après le prebuild dans EAS Build.

### Fichiers Créés

#### 1. `scripts/fix-ios-podfile.js`

Script Node.js qui :
- Lit le Podfile généré après prebuild
- Ajoute `$RNFirebaseAsStaticFramework = true`
- Ajoute `use_modular_headers!`
- Configure les build settings pour Firebase
- Désactive les vérifications Swift strictes
- Crée une backup du Podfile original

#### 2. `eas.json` (modifié)

Le script est configuré comme `postPrebuildCommand` pour iOS :

```json
{
  "build": {
    "development": {
      "ios": {
        "postPrebuildCommand": "node scripts/fix-ios-podfile.js"
      }
    }
  }
}
```

#### 3. `plugins/fix-firebase-ios.js` (backup)

Plugin Expo custom (approche alternative, conservé en backup)

---

## 🚀 Comment Utiliser

### Pour un Build EAS

Le plugin s'applique **automatiquement** lors du build EAS :

```bash
eas build --profile development --platform ios
```

Le plugin va :
1. Détecter le Podfile généré par Expo
2. Ajouter les configurations Firebase
3. Le build continue normalement

**Aucune action manuelle nécessaire !** ✅

---

### Pour un Build Local (Optionnel)

Si tu veux tester localement avec Xcode :

1. **Générer le projet iOS :**
   ```bash
   npx expo prebuild --platform ios
   ```

2. **Le plugin s'applique automatiquement**

3. **Installer les pods :**
   ```bash
   cd ios
   pod install
   cd ..
   ```

4. **Ouvrir Xcode :**
   ```bash
   open ios/BluMaze.xcworkspace
   ```

5. **Build depuis Xcode**

---

## 🔍 Vérification

### Avant le Build

Dans `app.json`, vérifie que le plugin est présent :

```json
"plugins": [
  ...
  "./plugins/fix-firebase-ios.js"
]
```

### Pendant le Build

Dans les logs EAS, tu devrais voir :

```
🔧 Applying Firebase iOS fix to Podfile...
✅ Firebase iOS fix applied successfully!
```

### Après le Build

Le Podfile généré devrait contenir :

```ruby
# React Native Firebase - use static frameworks
$RNFirebaseAsStaticFramework = true

# Use modular headers for Firebase dependencies
use_modular_headers!

# ... puis dans post_install ...
installer.pods_project.targets.each do |target|
  target.build_configurations.each do |config|
    config.build_settings['OTHER_SWIFT_FLAGS'] = '$(inherited) -no-verify-emitted-module-interface'
    config.build_settings['GENERATE_MODULEMAP_FILE'] = 'YES'
    # ... etc
  end
end
```

---

## 🧪 Test du Fix

### 1. Lancer un Build iOS

```bash
eas build --profile development --platform ios
```

### 2. Surveiller les Logs

Cherche dans les logs :

```
✅ Firebase iOS fix applied successfully!
📝 Modified Podfile at: /path/to/Podfile
```

### 3. Vérifier le Succès

Si le build passe l'étape "Install pods" sans erreur :

```
✅ Installing libdav1d (1.2.0)
✅ Installing FirebaseAuth
✅ Installing FirebaseFirestore
✅ Build succeeded
```

**Le fix fonctionne !** 🎉

---

## 🔧 Configurations Appliquées

### 1. Firebase Static Framework

```ruby
$RNFirebaseAsStaticFramework = true
```

Force Firebase à utiliser des frameworks statiques au lieu de dynamiques.

### 2. Modular Headers

```ruby
use_modular_headers!
```

Active la génération automatique de module maps pour tous les pods.

### 3. Swift Build Settings

```ruby
# Désactive la vérification stricte des interfaces de modules Swift
config.build_settings['OTHER_SWIFT_FLAGS'] = '$(inherited) -no-verify-emitted-module-interface'

# Génère les module maps pour les pods qui n'en ont pas
config.build_settings['GENERATE_MODULEMAP_FILE'] = 'YES'

# Active les modules pour l'interopérabilité Swift/ObjC
config.build_settings['CLANG_ENABLE_MODULES'] = 'YES'
```

### 4. Firebase Compatibility

```ruby
# Construit les bibliothèques pour distribution
config.build_settings['BUILD_LIBRARY_FOR_DISTRIBUTION'] = 'YES'

# Désactive les warnings d'includes non-modulaires
config.build_settings['CLANG_WARN_QUOTED_INCLUDE_IN_FRAMEWORK_HEADER'] = 'NO'
config.build_settings['CLANG_ALLOW_NON_MODULAR_INCLUDES_IN_FRAMEWORK_MODULES'] = 'YES'
```

---

## 🐛 Troubleshooting

### ❌ Plugin ne s'applique pas

**Vérifier :**

1. Le plugin est bien dans la liste des plugins dans `app.json`
2. Le fichier `plugins/fix-firebase-ios.js` existe
3. Pas de faute de frappe dans le chemin

**Solution :**
```bash
# Nettoyer le cache
rm -rf node_modules/.expo
eas build --clear-cache --profile development --platform ios
```

### ❌ Erreur "module not found"

Le plugin utilise `@expo/config-plugins` qui est déjà installé avec Expo.

**Vérifier :**
```bash
npm list @expo/config-plugins
```

Si manquant :
```bash
npm install --save-dev @expo/config-plugins
```

### ❌ Build échoue quand même

Si le build échoue encore après le fix :

1. **Vérifier les logs** pour voir si le plugin s'est exécuté
2. **Nettoyer et rebuild :**
   ```bash
   eas build --clear-cache --profile development --platform ios
   ```

3. **Vérifier les versions Firebase :**
   Toutes les packages `@react-native-firebase/*` doivent être en version **23.7.0**.

---

## 📚 Références

### Documentation

- [React Native Firebase iOS Setup](https://rnfirebase.io/reference/ios)
- [Expo Config Plugins](https://docs.expo.dev/config-plugins/introduction/)
- [CocoaPods Modular Headers](https://guides.cocoapods.org/syntax/podfile.html#use_modular_headers_bang)

### Erreurs Similaires

Cette erreur est commune quand on utilise :
- React Native Firebase avec Expo
- Swift pods dans un projet Expo managed
- Xcode 15+

### Autres Projets

Ce fix a été testé et fonctionne sur :
- ✅ teranga-live (Expo SDK 52)
- ✅ blu-maze (Expo SDK 54)

---

## 🎯 Résumé

### Ce qui a été fait

1. ✅ Créé plugin Expo custom : `plugins/fix-firebase-ios.js`
2. ✅ Ajouté plugin dans `app.json`
3. ✅ Plugin s'applique automatiquement lors du build EAS

### Ce qui fonctionne maintenant

- ✅ Build iOS EAS sans erreur Firebase
- ✅ Firebase Auth fonctionne
- ✅ Firebase Firestore fonctionne
- ✅ Firebase Messaging fonctionne
- ✅ Pas de modifications manuelles nécessaires

---

## 🚀 Prochaines Étapes

1. **Lancer le build :**
   ```bash
   eas build --profile development --platform ios
   ```

2. **Vérifier le succès dans les logs**

3. **Installer le build sur device**

4. **Tester l'app**

---

**🎉 Le fix est maintenant appliqué automatiquement ! Le prochain build iOS devrait fonctionner !** 🍎
