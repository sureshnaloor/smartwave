# SmartWave Mobile App – Newbie Guide (iOS + Android)

This guide walks you through creating the **SmartWave mobile app** (iOS now, Android later) with the **same features** as the web app: sign in, profile form, and sharing your digital profile as **Apple Wallet** and **Google Wallet** passes.

The mobile app lives in a **separate folder** from the web app so builds stay lean and the two codebases stay independent.

---

## 1. Why Expo (React Native)?

- **One codebase for iOS and Android** – you write the app once; we’ll focus on iOS first, then you can build for Android from the same project.
- **Uses React and TypeScript** – similar to your Next.js app, so less to learn.
- **No need to open Xcode for day‑to‑day coding** – you can run the app in the simulator from the terminal.
- **Wallet passes** – the app doesn’t “create” the pass; it opens the same URLs your web app uses (`/api/wallet/apple`, `/api/wallet/google`). The backend (this Next.js app) already generates the passes.

---

## 2. Prerequisites (install these first)

### On your Mac

1. **Node.js** (v18+) – you likely have this. Check: `node -v`
2. **Xcode** (from Mac App Store) – needed for the iOS simulator and for building a real app. Install Xcode and then run once so it installs extra components.
3. **Xcode Command Line Tools** (if not already installed):
   ```bash
   xcode-select --install
   ```
4. **Expo account** (free) – sign up at [expo.dev](https://expo.dev). You’ll use it for builds and updates.

### Apple Developer account

- You already have the **paid Apple Developer account** ($99/year). You’ll need it when we configure the app’s **Bundle ID** and for **App Store** submission later.

---

## 3. Where things live

- **Web app (this repo):**  
  `…/smartwave/smartwave/`  
  Next.js, API routes, Wallet pass generation, MongoDB, etc.

- **Mobile app (separate project):**  
  `…/smartwave/smartwave-mobile/`  
  Expo (React Native) app: sign in, profile, “Add to Wallet” links.

The two projects are **separate**. The mobile app talks to the web app only via **HTTP APIs** (login, get/update profile, open wallet URLs).

---

## 4. Create and run the mobile app (first time)

The mobile app is already scaffolded in a **separate folder** so the web codebase stays lean.

### Step 1: Open the mobile project

The Expo app lives next to your web app:

- **Web app:** `…/smartwave/smartwave/`
- **Mobile app:** `…/smartwave/smartwave-mobile/`

```bash
cd /Users/sureshmenon/Desktop/nextjsapps/smartwave/smartwave-mobile
```

(If the folder doesn’t exist yet, create it with:

```bash
cd /Users/sureshmenon/Desktop/nextjsapps/smartwave
npx create-expo-app@latest smartwave-mobile --template blank-typescript
cd smartwave-mobile
npx expo install expo-secure-store expo-linking @react-navigation/native @react-navigation/native-stack react-native-screens react-native-safe-area-context
```

Then copy in the `src/` folder, `App.tsx`, and config from the web repo’s docs or this guide.)

### Step 2: Configure the backend URL

Edit `src/config.ts` and set `API_BASE` (or `EXPO_PUBLIC_API_URL`) to your deployed backend, e.g. `https://www.smartwave.name`. For local testing from a device/simulator, use your machine’s IP (e.g. `http://192.168.1.x:3000`).

### Step 3: Run on the iOS simulator

```bash
npm install
npx expo start
```

Then press **`i`** in the terminal (or click “Run on iOS simulator” in the browser).  
The first time, this may take a few minutes (Xcode may need to install a simulator).

You should see the SmartWave sign-in screen. Sign in with the same email and password as the web app (Credentials provider), then use Profile and “Add to Wallet”.

---

## 5. Configure the app to talk to your backend

The app must call your **real** backend (not localhost on the phone).

1. **Backend URL**  
   Use your deployed URL, e.g. `https://www.smartwave.name` (or your staging URL).

2. **In the mobile project**, create a small config (e.g. `src/config.ts` or `.env`):

   ```ts
   export const API_BASE = 'https://www.smartwave.name';
   ```

   Use this for:

   - `POST ${API_BASE}/api/mobile/auth` – login (email + password).
   - `GET ${API_BASE}/api/mobile/profile` – get profile (with `Authorization: Bearer <token>`).
   - `PATCH ${API_BASE}/api/mobile/profile` – update profile (with `Authorization: Bearer <token>`).
   - Wallet: open in browser / in-app browser:
     - Apple: `https://www.smartwave.name/api/wallet/apple?shorturl=USER_SHORTURL`
     - Google: `https://www.smartwave.name/api/wallet/google?shorturl=USER_SHORTURL`

3. **Sign in**  
   The app uses **email + password** (same as the web “Credentials” provider).  
   Users who only signed up with Google on the web must set a password (e.g. via a “set password” flow on the web) or you add “Sign in with Google” in the app later.

---

## 6. Auth flow (high level)

1. User enters **email** and **password** in the app.
2. App sends `POST /api/mobile/auth` with `{ email, password }`.
3. Backend checks credentials (same as NextAuth Credentials), returns a **JWT** and user info.
4. App stores the **token** in **expo-secure-store** and uses it for all later API calls:
   - `Authorization: Bearer <token>` for GET/PATCH `/api/mobile/profile`.

No cookies; everything is token-based so it works from a native app.

---

## 7. Main screens in the app

1. **Sign In** – email + password → call `/api/mobile/auth` → save token → go to Profile.
2. **Profile** – load profile with GET `/api/mobile/profile`, show a form (same fields as web: name, title, company, phone, email, etc.), save with PATCH `/api/mobile/profile`.
3. **Add to Wallet** – two buttons:
   - **Add to Apple Wallet** – open `https://www.smartwave.name/api/wallet/apple?shorturl=<user's shorturl>` (e.g. with `Linking.openURL` or a WebView).
   - **Save to Google Wallet** – open `https://www.smartwave.name/api/wallet/google?shorturl=<user's shorturl>`.

The backend already supports `shorturl` in the wallet API; the app only needs the logged-in user’s `shorturl` from the profile.

---

## 8. Apple Developer: app identity (when you’re ready for a real device / App Store)

1. Go to [developer.apple.com](https://developer.apple.com) → **Certificates, Identifiers & Profiles** → **Identifiers**.
2. Click **+** and create an **App ID** (e.g. `com.smartwave.app` or `pass.com.smartwave.card` – don’t reuse the Wallet pass type ID).
3. In the Expo project, set this in **app.json** (or **app.config.js**):
   - `expo.ios.bundleIdentifier` = that App ID (e.g. `com.smartwave.app`).
4. For **EAS Build** (Expo Application Services), run:
   ```bash
   npm install -g eas-cli
   eas login
   eas build:configure
   eas build --platform ios
   ```
   Expo will prompt you to connect your Apple Developer account and create the right provisioning profile and certificate.

---

## 9. Android later (same project)

- The **same** `smartwave-mobile` project can build for Android.
- Run: `npx expo start` → press **`a`** for Android (with Android Studio and an emulator installed), or:
  ```bash
  eas build --platform android
  ```
- Same login, profile, and Wallet URLs; Google Wallet link works on Android too.

---

## 10. Quick reference: backend APIs for mobile

| What            | Method | URL                              | Auth        | Body / query          |
|----------------|--------|----------------------------------|------------|------------------------|
| Login          | POST   | `/api/mobile/auth`               | None       | `{ email, password }`  |
| Get profile    | GET    | `/api/mobile/profile`            | Bearer JWT | –                     |
| Update profile | PATCH  | `/api/mobile/profile`             | Bearer JWT | Partial profile JSON  |
| Apple Wallet   | GET    | `/api/wallet/apple?shorturl=XXX` | None       | –                     |
| Google Wallet  | GET    | `/api/wallet/google?shorturl=XXX`| None       | –                     |

---

## 11. Next steps (order that makes sense)

1. Create the Expo project (Step 4 above) and run it in the iOS simulator.
2. Add the three screens (Sign In, Profile, Add to Wallet) and wire them to the APIs above.
3. Test with your deployed backend and a test user (email + password).
4. When ready, set the iOS Bundle ID and use EAS Build to produce an IPA for TestFlight / App Store.
5. When you’re ready for Android, use the same app and run an Android build.

If you tell me your preferred folder path for `smartwave-mobile` and whether you want the app scaffold (screens + API client) generated next, I can outline the exact file structure and code snippets for the Expo app step by step.
