# Debugging: Champion Custom Create - Game List Not Loading

## Issue
When viewing "My Games" in `/champion/custom/create/`, the list freezes and doesn't return games from the database.

## How the Flow Works

1. **Client Side** (`docs/champion/custom/create/client.js`):
   - Line 1187: `socket.emit("retrieveGames", localStorage.getItem("userToken"));`
   - Waits for server response...
   - Line 1439: `socket.on("gamesRetrieved", (data) => { ... })`

2. **Server Side** (your private `server/server.js`):
   - Should have: `socket.on("retrieveGames", (token) => { ... })`
   - Should query MongoDB for games
   - Should emit: `socket.emit("gamesRetrieved", gamesArray);`

## Debugging Steps

### Step 1: Check Browser Console

Open `localhost:5501/champion/custom/create/` and check the console:

```javascript
// Should see:
🌍 Environment: development
🔌 Socket URL: http://localhost:3000

// When clicking "View My Games":
// Should log the retrieved games
```

### Step 2: Check Server Console

In your server terminal, you should see:
- Socket connection established
- "retrieveGames" event received
- MongoDB query executed

**If you DON'T see these**, the socket event handler might be missing or disabled.

### Step 3: Check MongoDB Connection

In your `server/server.js`, verify:

```javascript
// MongoDB should be connected
const mongoUrl = process.env.MONGODB_URI || "mongodb://localhost:27017/yourdb";

// Check if the connection is established
mongo.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error("❌ MongoDB connection failed:", err);
  } else {
    console.log("✅ MongoDB connected");
  }
});
```

### Step 4: Add Debug Logging

In your server's `retrieveGames` handler, add:

```javascript
socket.on("retrieveGames", async (token) => {
  console.log("📥 retrieveGames called with token:", token ? "present" : "missing");
  
  try {
    // Your MongoDB query here
    const games = await db.collection("games").find({ /* ... */ }).toArray();
    console.log(`📤 Sending ${games.length} games to client`);
    socket.emit("gamesRetrieved", games);
  } catch (error) {
    console.error("❌ Error retrieving games:", error);
    socket.emit("alert", "Failed to retrieve games");
  }
});
```

### Step 5: Check CORS (Should be fine now)

Your CORS settings allow `localhost:5501`, so this should work. Verify in server console:

```
✅ Allowed Origins: [
  'http://localhost:5500',
  'http://localhost:5501',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:5501'
]
```

## Common Issues

### Issue: "No socket connection"
**Solution**: Make sure server is running on port 3000
```bash
cd server
npm run devStart
# Should see: Server running on http://localhost:3000
```

### Issue: "MongoDB not connected"
**Solution**: Check your MongoDB URI in server environment variables or config

### Issue: "Socket event not firing"
**Solution**: The `retrieveGames` handler might not be registered. Check your server code for:
```javascript
io.on("connection", (socket) => {
  // ... other handlers ...
  
  socket.on("retrieveGames", (token) => {
    // Handler code here
  });
});
```

### Issue: "Token invalid"
**Solution**: Check localStorage in browser console:
```javascript
localStorage.getItem("userToken")
// Should return a valid JWT token
```

## Quick Test

In browser console, try manually:

```javascript
// Check if socket is connected
socket.connected
// Should return: true

// Manually trigger the event
socket.emit("retrieveGames", localStorage.getItem("userToken"));

// Listen for response
socket.on("gamesRetrieved", (data) => {
  console.log("Games received:", data);
});
```

## If Still Not Working

The issue is likely in your server code. Check:

1. ✅ MongoDB connection is established
2. ✅ `retrieveGames` socket handler exists
3. ✅ Database collection name is correct
4. ✅ Query logic is correct
5. ✅ `gamesRetrieved` event is being emitted

Since the server code is private, you'll need to debug this in your `server/server.js` file. The client side is correctly set up and should work once the server responds.
