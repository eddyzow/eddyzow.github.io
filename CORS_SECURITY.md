# CORS Security Configuration

## Overview

Your server is now configured with strict CORS (Cross-Origin Resource Sharing) policies to ensure only authorized domains can access your API and WebSocket connections.

## Security Features

### ✅ Origin Whitelisting

**Production Mode** (Heroku):
- Only allows requests from:
  - `https://eddyzow.net`
  - `https://www.eddyzow.net`
  - `https://eddyzow.github.io`

**Development Mode** (localhost):
- Only allows requests from:
  - `http://localhost:5500`
  - `http://localhost:5501`
  - `http://127.0.0.1:5500`
  - `http://127.0.0.1:5501`

### ✅ Protection Against

- **Unauthorized domains** trying to access your API
- **Cross-site request forgery** (CSRF) attacks
- **API scraping** from unknown sources
- **Bandwidth theft** from third-party sites

## How It Works

### Client-Side (Automatic)

1. When you open your site locally (`http://localhost:5500`):
   - `config.js` detects the hostname
   - Sets `SOCKET_URL = 'http://localhost:3000'`
   - Client connects to local server

2. When users visit production (`https://eddyzow.net`):
   - `config.js` detects the hostname
   - Sets `SOCKET_URL = 'https://eddyzow.herokuapp.com'`
   - Client connects to Heroku server

### Server-Side (Automatic)

1. **Local Development**:
   ```bash
   # Run without NODE_ENV (defaults to development)
   node server.js
   ```
   - Allows connections from `localhost:5500/5501` only

2. **Production (Heroku)**:
   ```bash
   # Heroku automatically sets NODE_ENV=production
   ```
   - Allows connections from `eddyzow.net` domains only

## Testing

### Local Development

1. Start your server:
   ```bash
   cd server
   npm install
   node server.js
   ```

2. Open your site:
   ```
   http://localhost:5500/docs/fermi/
   ```

3. Check the browser console - you should see:
   ```
   🌍 Environment: development
   🔌 Socket URL: http://localhost:3000
   ```

4. Try opening from a different port (e.g., `localhost:3000`) - connection should fail.

### Production

1. Visit: `https://eddyzow.net/fermi/`

2. Check console:
   ```
   🌍 Environment: production
   🔌 Socket URL: https://eddyzow.herokuapp.com
   ```

3. Try accessing from a different domain - should fail with CORS error.

## Deployment

### To Heroku

```bash
# From your server directory
git add .
git commit -m "Update CORS configuration"
git push heroku main
```

Heroku will automatically:
- Set `NODE_ENV=production`
- Apply production CORS rules
- Only allow eddyzow.net domains

### To GitHub Pages

```bash
# From repository root
git add docs/
git commit -m "Update client configuration"
git push origin main
```

GitHub Pages will serve the client files, which will automatically connect to the correct server based on the environment.

## Is It Secure?

**Yes!** Here's why:

1. **Server code is private** - Nobody can run `localhost:3000` except you
2. **Origin validation** - Server checks the `Origin` header on every request
3. **Whitelist approach** - Only explicitly allowed domains can connect
4. **Environment-based** - Different rules for dev/prod automatically

### What attackers CAN'T do:

❌ Access your localhost server from the internet
❌ Scrape data from your Heroku server from their own website
❌ Make requests from unauthorized domains
❌ Bypass CORS by modifying client-side code (server validates origin)

### What you CAN do:

✅ Develop locally with full server access
✅ Deploy to production seamlessly
✅ Keep server code private
✅ Allow only your frontend to access your backend

## Troubleshooting

### CORS Error in Console

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Cause**: You're accessing from an unauthorized origin.

**Solutions**:
- For local development: Use `localhost:5500` or `localhost:5501`
- For production: Access via `eddyzow.net` (not via IP or other domains)

### Can't Connect to Local Server

1. Check server is running: `node server.js`
2. Check you're using the correct port: `localhost:5500` or `5501`
3. Check browser console for environment detection

### Production Not Working

1. Verify Heroku has `NODE_ENV=production`:
   ```bash
   heroku config:get NODE_ENV
   ```

2. If not set:
   ```bash
   heroku config:set NODE_ENV=production
   ```

## Advanced: Adding More Origins

If you need to add more allowed origins, edit `server/server.js`:

```javascript
const ALLOWED_ORIGINS = process.env.NODE_ENV === 'production' 
  ? [
      'https://eddyzow.net',
      'https://www.eddyzow.net',
      'https://eddyzow.github.io',
      'https://yournewdomain.com'  // Add here
    ]
  : [
      'http://localhost:5500',
      'http://localhost:5501',
      'http://127.0.0.1:5500',
      'http://127.0.0.1:5501',
      'http://localhost:8000'  // Or here
    ];
```

## Summary

✅ **Automatic**: Environment detection happens automatically
✅ **Secure**: Only authorized domains can access your server  
✅ **Seamless**: Push code and it works in both dev and production
✅ **Private**: Server code stays closed-source, client is open-source
