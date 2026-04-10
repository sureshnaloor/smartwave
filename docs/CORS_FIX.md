# CORS Fix for Expo Web Development

## Problem

When running Expo web (`npm run web`), requests to the backend API fail with:
```
Origin http://localhost:8081 is not allowed by Access-Control-Allow-Origin
```

This happens because the Expo web dev server runs on `localhost:8081` but the backend doesn't allow CORS from that origin.

## Solution

Created `middleware.ts` in the web app root that:
- ✅ Adds CORS headers for all `/api/mobile/*` routes
- ✅ Allows all `localhost:*` origins in **development** (permissive)
- ✅ Uses strict whitelist in **production** (secure)
- ✅ Handles OPTIONS preflight requests automatically

## What Changed

- **New file:** `middleware.ts` - Next.js middleware for CORS
- **Development:** Allows any `localhost:*` or `127.0.0.1:*` origin
- **Production:** Uses strict whitelist (can be extended via `ALLOWED_CORS_ORIGINS` env var)

## Testing

1. **Restart the web app dev server:**
   ```bash
   cd /Users/sureshmenon/Desktop/nextjsapps/smartwave/smartwave
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Test in Expo web:**
   ```bash
   cd /Users/sureshmenon/Desktop/nextjsapps/smartwave/smartwave-mobile
   npm run web
   ```

3. **Try signing in** - CORS errors should be gone!

## Environment Variables (Optional)

For production, you can add allowed origins via environment variable:

```bash
# .env.local or production env
ALLOWED_CORS_ORIGINS=https://www.smartwave.name,https://app.smartwave.name
```

## Notes

- Middleware only applies to `/api/mobile/*` routes
- Other API routes are unaffected
- In development, all localhost origins are allowed (convenient for testing)
- In production, only whitelisted origins are allowed (secure)
