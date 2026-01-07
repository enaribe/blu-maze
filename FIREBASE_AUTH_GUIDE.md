# 🔥 Firebase Authentication - Guide Technique Complet

**Pour Blu Maze Client App**
**Dernière mise à jour :** 5 Janvier 2026
**Basé sur :** React Native Firebase v20+ (latest)

---

## 📚 Documentation Officielle

- [Phone Authentication | React Native Firebase](https://rnfirebase.io/auth/phone-auth)
- [Authentication Usage](https://rnfirebase.io/auth/usage)
- [API Reference](https://rnfirebase.io/reference/auth)
- [NPM Package](https://www.npmjs.com/package/@react-native-firebase/auth)

---

## 🎯 Vue d'Ensemble

### Ce qu'on va implémenter :
1. ✅ Authentification par numéro de téléphone (SMS OTP)
2. ✅ Vérification code à 6 chiffres
3. ✅ Création/Update profil utilisateur dans Firestore
4. ✅ Gestion de session avec PIN local
5. ✅ Persistence de l'auth

### Flow d'authentification :
```
1. User entre son numéro (+220 XXX XXXX)
2. Firebase envoie SMS avec code (6 digits)
3. User entre le code
4. Vérification du code
5. Si nouveau user → Créer profil (nom, prénom, PIN)
6. Si user existant → Redirection vers unlock (PIN)
7. Sauvegarde session dans Firestore + AsyncStorage
```

---

## 📦 ÉTAPE 1 : Installation des Packages

### Packages nécessaires :

```bash
# Core Firebase
npx expo install @react-native-firebase/app

# Authentication
npx expo install @react-native-firebase/auth

# Firestore (base de données)
npx expo install @react-native-firebase/firestore

# Optional: Analytics
npx expo install @react-native-firebase/analytics
```

### Version attendue :
- `@react-native-firebase/app`: ^20.0.0+
- `@react-native-firebase/auth`: ^20.0.0+
- `@react-native-firebase/firestore`: ^20.0.0+

---

## 🔧 ÉTAPE 2 : Configuration Firebase Console

### 2.1 Créer Projet Firebase (GRATUIT)

1. Va sur [Firebase Console](https://console.firebase.google.com/)
2. Clique "Add project" / "Ajouter un projet"
3. Nom : **Blu Maze**
4. Désactive Google Analytics (optionnel)
5. Clique "Create project"

### 2.2 Ajouter les Apps

#### Pour Android :
1. Dans Firebase Console → Project Settings
2. Clique "Add app" → Android (icône Android)
3. **Android package name** : `com.blumaze.client` (doit correspondre à app.json)
4. **App nickname** : Blu Maze Client
5. Télécharge `google-services.json`
6. Place le fichier dans : `android/app/google-services.json`

#### Pour iOS :
1. Dans Firebase Console → Project Settings
2. Clique "Add app" → iOS (icône Apple)
3. **iOS bundle ID** : `com.blumaze.client` (doit correspondre à app.json)
4. **App nickname** : Blu Maze Client
5. Télécharge `GoogleService-Info.plist`
6. Place le fichier dans : `ios/GoogleService-Info.plist`

### 2.3 Activer Phone Authentication

1. Dans Firebase Console → Authentication → Sign-in method
2. Clique sur "Phone" dans la liste
3. **Enable** le provider
4. Sauvegarde

### 2.4 Activer Firestore Database

1. Dans Firebase Console → Firestore Database
2. Clique "Create database"
3. Mode : **Test mode** (pour développement)
4. Location : **eur3 (europe-west)** (ou autre proche de la Gambie)
5. Enable

---

## 📝 ÉTAPE 3 : Configuration app.json

### Ajouter le plugin Firebase :

```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app",
      "@react-native-firebase/auth"
    ]
  }
}
```

**Note:** Avec Expo SDK 54, le plugin est automatique mais il faut l'ajouter explicitement.

---

## 🔐 ÉTAPE 4 : Firestore Security Rules

### Structure de sécurité (à configurer dans Firebase Console) :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection
    match /users/{userId} {
      // User can read/write their own data
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Drivers collection
    match /drivers/{driverId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == driverId;
    }

    // Rides collection
    match /rides/{rideId} {
      allow read: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        request.auth.uid == resource.data.driverId
      );
      allow create: if request.auth != null;
      allow update: if request.auth != null && (
        request.auth.uid == resource.data.userId ||
        request.auth.uid == resource.data.driverId
      );
    }
  }
}
```

---

## 💻 ÉTAPE 5 : Code d'Implémentation

### 5.1 Initialisation Firebase (`lib/firebase.ts`)

```typescript
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Collections
export const usersCollection = firestore().collection('users');
export const ridesCollection = firestore().collection('rides');

// Auth instance
export const firebaseAuth = auth();

// Helper: Get current user ID
export const getCurrentUserId = () => {
  return firebaseAuth.currentUser?.uid || null;
};

// Helper: Check if user is authenticated
export const isUserAuthenticated = () => {
  return firebaseAuth.currentUser !== null;
};

export { auth, firestore };
```

---

### 5.2 Écran Phone (`app/(auth)/phone.tsx`)

**À modifier pour intégrer Firebase :**

```typescript
import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import auth, { FirebaseAuthTypes } from '@react-native-firebase/auth';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Button, Input } from '../../components/ui';

export default function PhoneScreen() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmation, setConfirmation] = useState<FirebaseAuthTypes.ConfirmationResult | null>(null);

  const handleSendOTP = async () => {
    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    setLoading(true);

    try {
      // Format phone number (must include country code)
      const formattedNumber = phoneNumber.startsWith('+')
        ? phoneNumber
        : `+220${phoneNumber}`; // Gambia country code

      // Send verification code
      const confirmation = await auth().signInWithPhoneNumber(formattedNumber);

      setConfirmation(confirmation);

      // Navigate to verify screen with confirmation
      router.push({
        pathname: '/(auth)/verify',
        params: { phoneNumber: formattedNumber }
      });

    } catch (error: any) {
      console.error('Error sending OTP:', error);

      if (error.code === 'auth/invalid-phone-number') {
        Alert.alert('Error', 'Invalid phone number format');
      } else if (error.code === 'auth/too-many-requests') {
        Alert.alert('Error', 'Too many requests. Please try again later.');
      } else {
        Alert.alert('Error', 'Failed to send verification code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>What's your phone number?</Text>
        <Text style={styles.subtitle}>We'll send you a verification code</Text>

        <Input
          label="Phone Number"
          placeholder="+220 XXX XXXX"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          autoFocus
        />

        <Text style={styles.terms}>
          By continuing you are acknowledging having read and accepted our{' '}
          <Text style={styles.link}>Terms and Conditions</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Send Code"
          onPress={handleSendOTP}
          loading={loading}
          disabled={phoneNumber.length < 7}
        />
      </View>
    </View>
  );
}

// Styles...
```

---

### 5.3 Écran Verify (`app/(auth)/verify.tsx`)

**À modifier pour vérifier le code :**

```typescript
import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import auth from '@react-native-firebase/auth';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Button, Input } from '../../components/ui';
import { usersCollection } from '../../lib/firebase';
import { useStore } from '../../lib/store';

export default function VerifyScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const phoneNumber = params.phoneNumber as string;

  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const { setUser } = useStore();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleVerifyCode = async () => {
    if (code.length !== 6) {
      Alert.alert('Error', 'Please enter the 6-digit code');
      return;
    }

    setLoading(true);

    try {
      // Get confirmation from previous screen (stored in global state or passed via params)
      // For simplicity, we'll sign in again
      const confirmation = await auth().signInWithPhoneNumber(phoneNumber);

      // Confirm the code
      const userCredential = await confirmation.confirm(code);

      const firebaseUser = userCredential.user;

      // Check if user exists in Firestore
      const userDoc = await usersCollection.doc(firebaseUser.uid).get();

      if (userDoc.exists) {
        // Existing user - load profile and go to unlock
        const userData = userDoc.data();
        setUser({
          id: firebaseUser.uid,
          phoneNumber: firebaseUser.phoneNumber || phoneNumber,
          firstName: userData?.firstName || '',
          lastName: userData?.lastName || '',
          email: userData?.email,
          profilePhoto: userData?.profilePhoto,
          pin: userData?.pin,
        });

        router.replace('/(auth)/unlock');
      } else {
        // New user - go to profile setup
        router.push({
          pathname: '/(auth)/profile',
          params: {
            userId: firebaseUser.uid,
            phoneNumber: firebaseUser.phoneNumber || phoneNumber
          }
        });
      }

    } catch (error: any) {
      console.error('Error verifying code:', error);

      if (error.code === 'auth/invalid-verification-code') {
        Alert.alert('Error', 'Invalid verification code');
      } else if (error.code === 'auth/code-expired') {
        Alert.alert('Error', 'Verification code has expired');
      } else {
        Alert.alert('Error', 'Failed to verify code. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      await auth().signInWithPhoneNumber(phoneNumber);
      setTimer(60);
      Alert.alert('Success', 'Verification code resent');
    } catch (error) {
      Alert.alert('Error', 'Failed to resend code');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Enter verification code</Text>
        <Text style={styles.subtitle}>
          We sent a code to {phoneNumber}
        </Text>

        <Input
          placeholder="000000"
          value={code}
          onChangeText={setCode}
          keyboardType="number-pad"
          maxLength={6}
          autoFocus
          style={{ textAlign: 'center', fontSize: 24, letterSpacing: 8 }}
        />

        {timer > 0 ? (
          <Text style={styles.timer}>Resend code in {timer}s</Text>
        ) : (
          <Text style={styles.resend} onPress={handleResendCode}>
            Resend code
          </Text>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Verify"
          onPress={handleVerifyCode}
          loading={loading}
          disabled={code.length !== 6}
        />
      </View>
    </View>
  );
}

// Styles...
```

---

### 5.4 Écran Profile - Créer Utilisateur (`app/(auth)/profile.tsx`)

**À modifier pour sauvegarder dans Firestore :**

```typescript
import { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { usersCollection } from '../../lib/firebase';
import { useStore } from '../../lib/store';
import { Colors } from '../../constants/Colors';
import { Typography } from '../../constants/Typography';
import { Button, Input } from '../../components/ui';

export default function ProfileScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const userId = params.userId as string;
  const phoneNumber = params.phoneNumber as string;

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useStore();

  const handleSaveProfile = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    setLoading(true);

    try {
      // Generate referral code
      const referralCode = `${firstName.toUpperCase()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

      // Create user document in Firestore
      await usersCollection.doc(userId).set({
        userId,
        phoneNumber,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: null,
        profilePhoto: null,
        pin: null, // Will be set in next screen
        addresses: {
          home: null,
          office: null,
          favorites: []
        },
        loyaltyPoints: 0,
        referralCode,
        createdAt: firestore.FieldValue.serverTimestamp(),
        updatedAt: firestore.FieldValue.serverTimestamp(),
      });

      // Update local store
      setUser({
        id: userId,
        phoneNumber,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });

      // Navigate to PIN creation
      router.push('/(auth)/pin');

    } catch (error) {
      console.error('Error creating user:', error);
      Alert.alert('Error', 'Failed to create profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Complete your profile</Text>
        <Text style={styles.subtitle}>Help us get to know you better</Text>

        <Input
          label="First Name"
          placeholder="Enter first name"
          value={firstName}
          onChangeText={setFirstName}
          autoFocus
        />

        <Input
          label="Last Name"
          placeholder="Enter last name"
          value={lastName}
          onChangeText={setLastName}
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button
          title="Continue"
          onPress={handleSaveProfile}
          loading={loading}
          disabled={!firstName.trim() || !lastName.trim()}
        />
      </View>
    </View>
  );
}

// Styles...
```

---

### 5.5 Écran PIN - Sauvegarder PIN (`app/(auth)/pin.tsx`)

**À modifier pour sauvegarder le PIN dans Firestore :**

```typescript
import { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { getCurrentUserId, usersCollection } from '../../lib/firebase';
import { useStore } from '../../lib/store';
// ... autres imports

export default function PinScreen() {
  const router = useRouter();
  const [pin, setPin] = useState('');
  const { user, setUser } = useStore();

  const handleNumberPress = async (num: string) => {
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);

      if (newPin.length === 4) {
        // Save PIN
        try {
          const userId = getCurrentUserId();

          if (userId) {
            // Update Firestore with hashed PIN
            await usersCollection.doc(userId).update({
              pin: newPin, // TODO: Hash this in production
              updatedAt: firestore.FieldValue.serverTimestamp(),
            });

            // Save locally (securely)
            await SecureStore.setItemAsync('user_pin', newPin);

            // Update store
            if (user) {
              setUser({ ...user, pin: newPin });
            }

            // Navigate to main app
            router.replace('/(main)');
          }
        } catch (error) {
          console.error('Error saving PIN:', error);
        }
      }
    }
  };

  // ... rest of component
}
```

---

## 🔒 ÉTAPE 6 : Gestion de Session & Logout

### Listener d'auth globale (`app/_layout.tsx`)

```typescript
import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import { useStore } from '../lib/store';
import { usersCollection } from '../lib/firebase';

export default function RootLayout() {
  const { setUser, logout } = useStore();

  useEffect(() => {
    // Listen to auth state changes
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        try {
          const userDoc = await usersCollection.doc(firebaseUser.uid).get();

          if (userDoc.exists) {
            const userData = userDoc.data();
            setUser({
              id: firebaseUser.uid,
              phoneNumber: firebaseUser.phoneNumber || '',
              firstName: userData?.firstName || '',
              lastName: userData?.lastName || '',
              email: userData?.email,
              profilePhoto: userData?.profilePhoto,
              pin: userData?.pin,
            });
          }
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        // User is signed out
        logout();
      }
    });

    return unsubscribe;
  }, []);

  // ... rest of layout
}
```

### Fonction Logout

```typescript
// Dans lib/firebase.ts ou lib/auth.ts
import auth from '@react-native-firebase/auth';
import * as SecureStore from 'expo-secure-store';

export const logoutUser = async () => {
  try {
    // Sign out from Firebase
    await auth().signOut();

    // Clear secure storage
    await SecureStore.deleteItemAsync('user_pin');

    // Store will be cleared by onAuthStateChanged listener

    return true;
  } catch (error) {
    console.error('Error logging out:', error);
    return false;
  }
};
```

---

## 📱 ÉTAPE 7 : Build & Test

### Pour tester Firebase (nécessite build natif) :

```bash
# Install expo-dev-client
npx expo install expo-dev-client

# Build development
eas build --profile development --platform android

# Ou run localement (si Android Studio / Xcode installé)
npx expo run:android
npx expo run:ios
```

**Note importante:** Firebase nécessite un build natif. Expo Go ne supporte PAS `@react-native-firebase`.

---

## ⚠️ Points d'Attention & Best Practices

### Sécurité

1. **Hasher le PIN** : Ne JAMAIS stocker le PIN en clair
   ```typescript
   import * as Crypto from 'expo-crypto';

   const hashPin = async (pin: string) => {
     return await Crypto.digestStringAsync(
       Crypto.CryptoDigestAlgorithm.SHA256,
       pin
     );
   };
   ```

2. **Firestore Rules** : Toujours limiter l'accès aux données

3. **Rate Limiting** : Firebase limite automatiquement les SMS (10/jour par numéro)

### Performance

1. **Cache les données** : Utilise AsyncStorage pour l'offline
2. **Optimise les queries** : Utilise `.limit()` et indexes
3. **Écoute uniquement ce qui est nécessaire** : Unsubscribe des listeners

### UX

1. **Auto-verification Android** : Certains devices détectent automatiquement le code SMS
2. **Format de numéro** : Toujours inclure le country code (+220 pour Gambie)
3. **Feedback utilisateur** : Affiche des loaders et messages d'erreur clairs

---

## 📚 Resources Supplémentaires

- [Phone Authentication | React Native Firebase](https://rnfirebase.io/auth/phone-auth)
- [Firestore Usage](https://rnfirebase.io/firestore/usage)
- [Security Rules](https://firebase.google.com/docs/firestore/security/get-started)
- [Best Practices](https://firebase.google.com/docs/auth/web/phone-auth#security-best-practices)

---

## ✅ Checklist pour Cursor

Donne ces instructions à Cursor :

1. ⬜ Installer les packages Firebase
2. ⬜ Télécharger `google-services.json` et `GoogleService-Info.plist`
3. ⬜ Créer `lib/firebase.ts` avec les exports
4. ⬜ Modifier `app/(auth)/phone.tsx` pour envoyer OTP
5. ⬜ Modifier `app/(auth)/verify.tsx` pour vérifier code
6. ⬜ Modifier `app/(auth)/profile.tsx` pour créer user Firestore
7. ⬜ Modifier `app/(auth)/pin.tsx` pour sauvegarder PIN
8. ⬜ Ajouter listener auth dans `app/_layout.tsx`
9. ⬜ Créer fonction `logoutUser()` dans `lib/firebase.ts`
10. ⬜ Tester avec `eas build --profile development`

---

**Bon courage ! 🚀**
