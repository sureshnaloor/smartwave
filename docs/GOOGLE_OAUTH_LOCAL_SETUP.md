# Google OAuth Setup for Local Development

## Problem

Google OAuth doesn't allow IP addresses (like `http://192.168.8.222:3000`) as redirect URIs. You'll see errors like:
- "Invalid Redirect: must end with a public top-level domain"
- "Invalid Redirect: must use a domain that is a valid top private domain"

## Solution Options

### Option 1: Use localhost (Recommended for Local Testing)

Google **does allow** `localhost` for development. This is the simplest solution.

#### Steps:

1. **In Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **APIs & Services** → **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Under **Authorized redirect URIs**, add:
     ```
     http://localhost:3000/api/mobile/auth/google/callback
     ```
   - Save

2. **Set environment variable in your web app:**
   ```bash
   cd /Users/sureshmenon/Desktop/nextjsapps/smartwave/smartwave
   ```
   
   Add to `.env.local` (or your `.env` file):
   ```bash
   MOBILE_GOOGLE_CALLBACK_BASE=http://localhost:3000
   ```

3. **Access web app via localhost:**
   - Make sure your web app is accessible at `http://localhost:3000`
   - If you're accessing via IP (`192.168.8.222:3000`), you'll need to also access via `localhost:3000` for OAuth to work

4. **Update mobile app `.env` to use localhost:**
   ```bash
   cd /Users/sureshmenon/Desktop/nextjsapps/smartwave/smartwave-mobile
   ```
   
   Update `.env`:
   ```bash
   EXPO_PUBLIC_API_URL=http://localhost:3000
   ```

5. **Restart both servers:**
   ```bash
   # Web app
   cd /Users/sureshmenon/Desktop/nextjsapps/smartwave/smartwave
   npm run dev

   # Mobile app (in another terminal)
   cd /Users/sureshmenon/Desktop/nextjsapps/smartwave/smartwave-mobile
   npm run web
   ```

**Note:** When using `localhost`, make sure:
- Web app runs on `localhost:3000` (not just IP)
- Mobile app connects to `localhost:3000` (works in web browser, but **not** on physical devices)
- For physical devices, use Option 2 (ngrok) below

---

### Option 2: Use ngrok (For Physical Device Testing)

ngrok creates a public URL that tunnels to your local server. Google accepts these public URLs.

#### Steps:

1. **Install ngrok:**
   ```bash
   # macOS
   brew install ngrok
   # Or download from https://ngrok.com/download
   ```

2. **Start your web app:**
   ```bash
   cd /Users/sureshmenon/Desktop/nextjsapps/smartwave/smartwave
   npm run dev
   ```

3. **Start ngrok tunnel:**
   ```bash
   ngrok http 3000
   ```
   
   You'll see output like:
   ```
   Forwarding  https://abc123.ngrok-free.app -> http://localhost:3000
   ```

4. **Add ngrok URL to Google Cloud Console:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Navigate to **APIs & Services** → **Credentials**
   - Click on your OAuth 2.0 Client ID
   - Under **Authorized redirect URIs**, add:
     ```
     https://YOUR_NGROK_URL.ngrok-free.app/api/mobile/auth/google/callback
     ```
     (Replace `YOUR_NGROK_URL` with your actual ngrok URL)
   - Save

5. **Set environment variable:**
   ```bash
   cd /Users/sureshmenon/Desktop/nextjsapps/smartwave/smartwave
   ```
   
   Add to `.env.local`:
   ```bash
   MOBILE_GOOGLE_CALLBACK_BASE=https://YOUR_NGROK_URL.ngrok-free.app
   ```

6. **Update mobile app `.env`:**
   ```bash
   cd /Users/sureshmenon/Desktop/nextjsapps/smartwave/smartwave-mobile
   ```
   
   Update `.env`:
   ```bash
   EXPO_PUBLIC_API_URL=https://YOUR_NGROK_URL.ngrok-free.app
   ```

7. **Restart servers** and test!

**Note:** 
- ngrok free tier URLs change each time you restart ngrok
- For production, use a fixed domain (your actual domain)
- ngrok works great for testing on physical devices

---

### Option 3: Use Custom Domain (Production)

For production, use your actual domain:

1. **In Google Cloud Console**, add:
   ```
   https://www.smartwave.name/api/mobile/auth/google/callback
   ```

2. **Set environment variable:**
   ```bash
   MOBILE_GOOGLE_CALLBACK_BASE=https://www.smartwave.name
   ```

---

## Quick Reference

| Scenario | Redirect URI | Works For |
|----------|-------------|-----------|
| **Local web testing** | `http://localhost:3000/api/mobile/auth/google/callback` | Browser only |
| **Physical device testing** | `https://YOUR_NGROK_URL.ngrok-free.app/api/mobile/auth/google/callback` | All devices |
| **Production** | `https://www.smartwave.name/api/mobile/auth/google/callback` | Production |

---

## Troubleshooting

### "Redirect URI mismatch"
- Make sure the redirect URI in Google Console **exactly matches** what's in `MOBILE_GOOGLE_CALLBACK_BASE`
- Check for trailing slashes (should be none)
- Check protocol (`http://` vs `https://`)

### "Invalid Redirect" error
- Google doesn't accept IP addresses
- Use `localhost` or ngrok URL instead

### OAuth works in browser but not on device
- Browser can use `localhost`
- Physical devices need ngrok or production URL

---

## Recommended Setup for Testing

**For local web testing:**
- Use `localhost:3000` (Option 1)

**For physical device testing:**
- Use ngrok (Option 2)

**For production:**
- Use your actual domain (Option 3)
