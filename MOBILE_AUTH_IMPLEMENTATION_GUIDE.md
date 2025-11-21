# Mobile Authentication Implementation Guide

## 🔐 Complete Guide for Apple & Google Login on Mobile

---

## Current Web Authentication Setup

### Your Existing Stack:

```typescript
// src/auth.ts
- NextAuth.js v5 (beta)
- Google OAuth Provider
- Apple OAuth Provider
- Credentials Provider (email/password)
- MongoDB for user storage
```

### Authentication Flow (Web):

```
User clicks Google/Apple button
  ↓
Redirects to OAuth provider
  ↓
Provider authenticates user
  ↓
Redirects back with authorization code
  ↓
NextAuth exchanges code for tokens
  ↓
Creates session in MongoDB
  ↓
Returns session cookie
```

---

## Mobile Authentication Architecture

### Key Differences:

| Aspect        | Web               | Mobile                   |
| ------------- | ----------------- | ------------------------ |
| OAuth Flow    | Redirect-based    | Native SDK-based         |
| Token Storage | HTTP-only cookies | Secure Keychain/Keystore |
| Deep Links    | Not needed        | Required for callbacks   |
| User Agent    | Browser           | Native app               |

---

## 📱 Option 1: React Native Implementation

### Step 1: Install Dependencies

```bash
# Google Sign In
npm install @react-native-google-signin/google-signin

# Apple Sign In
npm install @invertase/react-native-apple-authentication

# Secure Storage
npm install react-native-keychain

# HTTP Client (if not using axios)
npm install axios
```

### Step 2: Configure Google Sign In

#### iOS Configuration (ios/Podfile):

```ruby
platform :ios, '12.0'

target 'HarmoniqMobile' do
  # ... other pods
  pod 'GoogleSignIn'
end
```

Run: `cd ios && pod install`

#### Android Configuration (android/app/build.gradle):

```gradle
dependencies {
    // ... other dependencies
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
}
```

#### Get Google OAuth Credentials:

1. Go to: https://console.cloud.google.com/
2. Select your project
3. Go to: APIs & Services > Credentials
4. Create OAuth 2.0 Client IDs:
    - **iOS Client ID:** For iOS app (Bundle ID: com.harmoniq.fengshui)
    - **Android Client ID:** For Android app (Package name + SHA-1)
    - **Web Client ID:** Keep existing (for backend validation)

### Step 3: Implement Google Sign In

```typescript
// src/services/authService.ts
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import axios from "axios";
import * as Keychain from "react-native-keychain";

// Configure Google Sign In (call this on app startup)
export const configureGoogleSignIn = () => {
	GoogleSignin.configure({
		// Web Client ID (from Google Console)
		webClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",

		// iOS Client ID (optional, recommended for iOS)
		iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",

		// Request offline access (refresh token)
		offlineAccess: true,

		// Request user profile and email
		scopes: ["profile", "email"],
	});
};

// Google Sign In Function
export const signInWithGoogle = async () => {
	try {
		// Check if device supports Google Play Services (Android)
		await GoogleSignin.hasPlayServices();

		// Sign in
		const userInfo = await GoogleSignin.signIn();

		// Get ID token for backend verification
		const tokens = await GoogleSignin.getTokens();

		console.log("Google User Info:", userInfo);
		console.log("ID Token:", tokens.idToken);

		// Send to your backend for verification
		const response = await axios.post(
			"https://your-api.com/api/auth/google/mobile",
			{
				idToken: tokens.idToken,
				user: {
					email: userInfo.user.email,
					name: userInfo.user.name,
					photo: userInfo.user.photo,
				},
			}
		);

		// Store authentication token securely
		await Keychain.setGenericPassword(
			"auth_token",
			response.data.accessToken,
			{
				service: "com.harmoniq.fengshui",
				accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
			}
		);

		return {
			success: true,
			user: response.data.user,
			token: response.data.accessToken,
		};
	} catch (error) {
		console.error("Google Sign In Error:", error);

		if (error.code === "SIGN_IN_CANCELLED") {
			return { success: false, error: "User cancelled sign in" };
		} else if (error.code === "IN_PROGRESS") {
			return { success: false, error: "Sign in already in progress" };
		} else if (error.code === "PLAY_SERVICES_NOT_AVAILABLE") {
			return { success: false, error: "Play Services not available" };
		}

		return { success: false, error: error.message };
	}
};

// Sign Out
export const signOutGoogle = async () => {
	try {
		await GoogleSignin.revokeAccess();
		await GoogleSignin.signOut();
		await Keychain.resetGenericPassword({
			service: "com.harmoniq.fengshui",
		});
		return { success: true };
	} catch (error) {
		console.error("Sign Out Error:", error);
		return { success: false, error: error.message };
	}
};
```

### Step 4: Configure Apple Sign In

#### iOS Configuration (Info.plist):

```xml
<key>CFBundleURLTypes</key>
<array>
  <dict>
    <key>CFBundleURLSchemes</key>
    <array>
      <string>com.harmoniq.fengshui</string>
    </array>
  </dict>
</array>
```

#### Enable Sign in with Apple:

1. Go to: https://developer.apple.com/
2. Select your App ID
3. Enable "Sign in with Apple" capability
4. In Xcode: Add "Sign in with Apple" to your app's capabilities

### Step 5: Implement Apple Sign In

```typescript
// src/services/authService.ts (continued)
import appleAuth from "@invertase/react-native-apple-authentication";

// Apple Sign In Function
export const signInWithApple = async () => {
	try {
		// Check if Apple Auth is supported (iOS 13+)
		if (!appleAuth.isSupported) {
			return {
				success: false,
				error: "Apple Sign In not supported on this device",
			};
		}

		// Perform Apple Sign In request
		const appleAuthRequestResponse = await appleAuth.performRequest({
			requestedOperation: appleAuth.Operation.LOGIN,
			requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
		});

		// Get credential state
		const credentialState = await appleAuth.getCredentialStateForUser(
			appleAuthRequestResponse.user
		);

		// Ensure Apple credential is authorized
		if (credentialState !== appleAuth.State.AUTHORIZED) {
			return { success: false, error: "Apple authorization failed" };
		}

		console.log("Apple Auth Response:", appleAuthRequestResponse);

		// Send to your backend for verification
		const response = await axios.post(
			"https://your-api.com/api/auth/apple/mobile",
			{
				identityToken: appleAuthRequestResponse.identityToken,
				authorizationCode: appleAuthRequestResponse.authorizationCode,
				user: appleAuthRequestResponse.user,
				fullName: appleAuthRequestResponse.fullName,
				email: appleAuthRequestResponse.email,
			}
		);

		// Store authentication token securely
		await Keychain.setGenericPassword(
			"auth_token",
			response.data.accessToken,
			{
				service: "com.harmoniq.fengshui",
				accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED,
			}
		);

		return {
			success: true,
			user: response.data.user,
			token: response.data.accessToken,
		};
	} catch (error) {
		console.error("Apple Sign In Error:", error);

		if (error.code === appleAuth.Error.CANCELED) {
			return { success: false, error: "User cancelled Apple Sign In" };
		} else if (error.code === appleAuth.Error.FAILED) {
			return { success: false, error: "Apple Sign In failed" };
		} else if (error.code === appleAuth.Error.NOT_HANDLED) {
			return { success: false, error: "Apple Sign In not handled" };
		}

		return { success: false, error: error.message };
	}
};

// Sign Out (Apple)
export const signOutApple = async () => {
	try {
		await Keychain.resetGenericPassword({
			service: "com.harmoniq.fengshui",
		});
		return { success: true };
	} catch (error) {
		console.error("Sign Out Error:", error);
		return { success: false, error: error.message };
	}
};
```

### Step 6: React Native UI Component

```typescript
// src/screens/LoginScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { signInWithGoogle, signInWithApple } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');

    const result = await signInWithGoogle();

    if (result.success) {
      // Navigate to home screen
      navigation.replace('Home');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const handleAppleSignIn = async () => {
    setLoading(true);
    setError('');

    const result = await signInWithApple();

    if (result.success) {
      navigation.replace('Home');
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>HarmoniQ</Text>
      <Text style={styles.subtitle}>風水命理分析</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      {/* Google Sign In Button */}
      <TouchableOpacity
        style={[styles.button, styles.googleButton]}
        onPress={handleGoogleSignIn}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Text style={styles.buttonText}>使用 Google 登入</Text>
          </>
        )}
      </TouchableOpacity>

      {/* Apple Sign In Button (iOS only) */}
      {Platform.OS === 'ios' && (
        <TouchableOpacity
          style={[styles.button, styles.appleButton]}
          onPress={handleAppleSignIn}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>使用 Apple 登入</Text>
          )}
        </TouchableOpacity>
      )}

      <Text style={styles.terms}>
        繼續即表示您同意我們的服務條款和隱私政策
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f8f8f8',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#086E56',
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 40,
    color: '#666',
  },
  button: {
    width: '100%',
    padding: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  googleButton: {
    backgroundColor: '#4285F4',
  },
  appleButton: {
    backgroundColor: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  error: {
    color: 'red',
    marginBottom: 15,
  },
  terms: {
    marginTop: 30,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  },
});

export default LoginScreen;
```

---

## 🔧 Backend API Updates

### Create Mobile-Specific Auth Endpoints

```typescript
// src/app/api/auth/google/mobile/route.ts
import { NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
	try {
		const { idToken, user } = await request.json();

		// Verify the Google ID token
		const ticket = await client.verifyIdToken({
			idToken: idToken,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		const payload = ticket.getPayload();

		if (!payload) {
			return NextResponse.json(
				{ error: "Invalid token" },
				{ status: 401 }
			);
		}

		// Connect to database
		await dbConnect();

		// Find or create user
		let dbUser = await User.findOne({ email: payload.email });

		if (!dbUser) {
			dbUser = await User.create({
				email: payload.email,
				name: payload.name,
				provider: "google",
				userId: payload.email,
				profilePicture: payload.picture,
			});
		}

		// Generate JWT for mobile app
		const accessToken = jwt.sign(
			{
				userId: dbUser._id,
				email: dbUser.email,
				provider: "google",
			},
			process.env.NEXTAUTH_SECRET!,
			{ expiresIn: "30d" } // Longer expiry for mobile
		);

		return NextResponse.json({
			success: true,
			accessToken,
			user: {
				id: dbUser._id,
				email: dbUser.email,
				name: dbUser.name,
				picture: dbUser.profilePicture,
			},
		});
	} catch (error) {
		console.error("Google Mobile Auth Error:", error);
		return NextResponse.json(
			{ error: "Authentication failed" },
			{ status: 500 }
		);
	}
}
```

```typescript
// src/app/api/auth/apple/mobile/route.ts
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import dbConnect from "@/lib/mongoose";
import User from "@/models/User";

// Apple JWKS client
const client = jwksClient({
	jwksUri: "https://appleid.apple.com/auth/keys",
});

function getApplePublicKey(header, callback) {
	client.getSigningKey(header.kid, (err, key) => {
		if (err) {
			callback(err);
		} else {
			const signingKey = key.getPublicKey();
			callback(null, signingKey);
		}
	});
}

export async function POST(request: Request) {
	try {
		const { identityToken, user, email, fullName } = await request.json();

		// Verify Apple identity token
		const decoded: any = await new Promise((resolve, reject) => {
			jwt.verify(
				identityToken,
				getApplePublicKey,
				{
					issuer: "https://appleid.apple.com",
					audience: process.env.APPLE_ID,
				},
				(err, decoded) => {
					if (err) reject(err);
					else resolve(decoded);
				}
			);
		});

		if (!decoded) {
			return NextResponse.json(
				{ error: "Invalid Apple token" },
				{ status: 401 }
			);
		}

		await dbConnect();

		// Apple user identifier
		const appleUserId = decoded.sub;
		const userEmail = email || decoded.email;

		// Find or create user
		let dbUser = await User.findOne({
			$or: [{ appleUserId: appleUserId }, { email: userEmail }],
		});

		if (!dbUser) {
			const userName = fullName
				? `${fullName.givenName || ""} ${fullName.familyName || ""}`.trim()
				: userEmail?.split("@")[0] || "User";

			dbUser = await User.create({
				email: userEmail,
				name: userName,
				provider: "apple",
				appleUserId: appleUserId,
				userId: userEmail || appleUserId,
			});
		}

		// Generate JWT
		const accessToken = jwt.sign(
			{
				userId: dbUser._id,
				email: dbUser.email,
				provider: "apple",
			},
			process.env.NEXTAUTH_SECRET!,
			{ expiresIn: "30d" }
		);

		return NextResponse.json({
			success: true,
			accessToken,
			user: {
				id: dbUser._id,
				email: dbUser.email,
				name: dbUser.name,
			},
		});
	} catch (error) {
		console.error("Apple Mobile Auth Error:", error);
		return NextResponse.json(
			{ error: "Authentication failed" },
			{ status: 500 }
		);
	}
}
```

### Update User Model

```typescript
// src/models/User.ts - Add these fields
{
  // ... existing fields
  appleUserId: {
    type: String,
    sparse: true,
    unique: true,
  },
  profilePicture: String,
  lastLoginAt: Date,
  deviceTokens: [String], // For push notifications
}
```

---

## 📱 Option 2: Capacitor Implementation (Simpler)

### Step 1: Install Capacitor

```bash
npm install @capacitor/core @capacitor/cli
npx cap init HarmoniqMobile com.harmoniq.fengshui
```

### Step 2: Add Platforms

```bash
npm run build
npx cap add ios
npx cap add android
```

### Step 3: Install Auth Plugins

```bash
npm install @capacitor-community/apple-sign-in
npm install @codetrix-studio/capacitor-google-auth
```

### Step 4: Configure Capacitor

```typescript
// capacitor.config.ts
import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
	appId: "com.harmoniq.fengshui",
	appName: "HarmoniQ",
	webDir: "out", // Next.js static export
	server: {
		androidScheme: "https",
	},
	plugins: {
		GoogleAuth: {
			scopes: ["profile", "email"],
			serverClientId: "YOUR_WEB_CLIENT_ID.apps.googleusercontent.com",
			forceCodeForRefreshToken: true,
		},
	},
};

export default config;
```

### Step 5: Use in Your Existing Code

```typescript
// src/services/capacitorAuth.ts
import { GoogleAuth } from "@codetrix-studio/capacitor-google-auth";
import { SignInWithApple } from "@capacitor-community/apple-sign-in";
import { Capacitor } from "@capacitor/core";

// Initialize (call on app startup)
if (Capacitor.isNativePlatform()) {
	GoogleAuth.initialize();
}

// Google Sign In
export const signInWithGoogle = async () => {
	try {
		const user = await GoogleAuth.signIn();

		// Send to your backend
		const response = await fetch("/api/auth/google/mobile", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				idToken: user.authentication.idToken,
				user: {
					email: user.email,
					name: user.name,
					photo: user.imageUrl,
				},
			}),
		});

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Google Sign In Error:", error);
		throw error;
	}
};

// Apple Sign In
export const signInWithApple = async () => {
	try {
		const result = await SignInWithApple.authorize({
			clientId: "com.harmoniq.fengshui",
			redirectURI: "https://harmoniq.com/auth/callback",
			scopes: "email name",
		});

		// Send to your backend
		const response = await fetch("/api/auth/apple/mobile", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				identityToken: result.response.identityToken,
				authorizationCode: result.response.authorizationCode,
				email: result.response.email,
				fullName: result.response.givenName
					? {
							givenName: result.response.givenName,
							familyName: result.response.familyName,
						}
					: null,
			}),
		});

		const data = await response.json();
		return data;
	} catch (error) {
		console.error("Apple Sign In Error:", error);
		throw error;
	}
};
```

---

## 🔑 Environment Variables

### Update .env files:

```bash
# .env.local (for development)

# Google OAuth (keep existing + add mobile)
GOOGLE_CLIENT_ID=your-web-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-secret
GOOGLE_IOS_CLIENT_ID=your-ios-client-id.apps.googleusercontent.com
GOOGLE_ANDROID_CLIENT_ID=your-android-client-id.apps.googleusercontent.com

# Apple OAuth (keep existing)
APPLE_ID=com.harmoniq.fengshui
APPLE_CLIENT_SECRET=your-generated-secret
APPLE_TEAM_ID=your-team-id
APPLE_KEY_ID=your-key-id
APPLE_PRIVATE_KEY=your-private-key

# NextAuth
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.com

# MongoDB
MONGODB_URI=your-mongodb-connection-string
```

---

## ✅ Testing Checklist

### iOS Testing:

- [ ] Google Sign In works
- [ ] Apple Sign In works (required if you offer any social login)
- [ ] Token stored in Keychain
- [ ] User can sign out and sign back in
- [ ] Error handling works (cancel, network error)

### Android Testing:

- [ ] Google Sign In works
- [ ] Google Play Services available check
- [ ] Token stored in Keystore
- [ ] User can sign out and sign back in
- [ ] Error handling works

### Backend Testing:

- [ ] Token verification works
- [ ] User creation works
- [ ] User login works
- [ ] JWT generation works
- [ ] API endpoints secured

---

## 🚀 Deployment Requirements

### Apple App Store:

1. **Sign in with Apple is MANDATORY** if you offer any third-party login
2. Configure "Sign in with Apple" in your App ID
3. Add entitlements in Xcode
4. Test on real device (not simulator)

### Google Play Store:

1. Generate SHA-1 certificate fingerprint
2. Add to Google Cloud Console
3. Configure OAuth consent screen
4. Add to Google Play Console

---

## Summary

✅ Your backend authentication system needs minimal changes  
✅ Add mobile-specific endpoints for token exchange  
✅ Use native SDKs for better UX  
✅ Store tokens securely (Keychain/Keystore)  
✅ Capacitor = easiest integration with existing code  
✅ React Native = best performance and native feel

Your authentication architecture is solid and will work great on mobile! 🎉
