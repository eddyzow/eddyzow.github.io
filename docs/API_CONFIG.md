# Dynamic API Configuration

This setup allows your projects to automatically switch between local development and production servers.

## How It Works

All Socket.IO projects now use `config.js` which automatically detects the environment:

- **Local development** (`localhost`): Connects to `http://localhost:3000`
- **Production** (`eddyzow.net`): Connects to `https://eddyzow.herokuapp.com`

## Setup Instructions

### Running Locally

1. Start your local server:
   ```bash
   cd server
   npm install
   node server.js
   ```

2. Serve your client files on `localhost:5500` or `5501`:
   ```bash
   # Using VS Code Live Server (default port 5500)
   # Or using Python
   cd docs
   python -m http.server 5500
   ```

3. Open any project (e.g., `http://localhost:5500/fermi/`)

### Deploying to Production

Simply push your code:

```bash
# Client (GitHub Pages)
git add docs/
git commit -m "Update client"
git push origin main

# Server (Heroku)
cd server
git push heroku main
```

**That's it!** The environment detection happens automatically.

### Testing

Open the browser console - you should see:

**Local Development:**
```
🌍 Environment: development
🔌 Socket URL: http://localhost:3000
🔗 API URL: http://localhost:3000/api
```

**Production:**
```
🌍 Environment: production
🔌 Socket URL: https://eddyzow.herokuapp.com
🔗 API URL: https://eddyzow.herokuapp.com/api
```

## Security

See [CORS_SECURITY.md](../CORS_SECURITY.md) for detailed security information.

**Key points:**
- ✅ Only `eddyzow.net` can access production server
- ✅ Only `localhost:5500/5501` can access local server
- ✅ Server code is private (not pushed to GitHub)
- ✅ Automatic environment detection - no manual configuration needed

## Files Updated

The following projects now use dynamic configuration:

- `/fermi/` - Fermi Questions
- `/wwtbam/` - Who Wants To Be A Millionaire
- `/live/` - Live Quiz
- `/KeyboardHero/` - Keyboard Hero
- `/jsb/` - JSBeats
- `/keyspeed/` - Keyspeed Test
- `/champion/` and subdirectories - Trivia Champion

## Fallback

All projects include a fallback to `https://eddyzow.herokuapp.com/` if the config fails to load, ensuring backward compatibility.

## Is It Seamless?

**Yes!** Here's what happens automatically:

1. **Push to GitHub** → Client updates on eddyzow.net
2. **User visits eddyzow.net** → Detects production environment
3. **Connects to** → `https://eddyzow.herokuapp.com`

No configuration files to change, no environment variables to set on the client side. It just works!
