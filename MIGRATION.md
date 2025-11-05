# Migration Guide: Client-Server Restructure

## What Changed

The repository has been restructured to separate client-side and server-side code:

### Old Structure
```
eddyzow.github.io/
└── docs/           # Website files (served by GitHub Pages)
```

### New Structure
```
eddyzow.github.io/
├── docs/           # Static website files (served by GitHub Pages)
│   ├── index.html
│   ├── 404.html
│   ├── style.css
│   ├── client.js
│   ├── CNAME
│   └── [project folders]
├── server/         # Node.js backend
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── .gitignore
└── README.md
```

## Next Steps

### 1. Commit and Push Changes

```bash
cd /Users/eddyz/Documents/GitHub/eddyzow.github.io
git add .
git commit -m "Restructure: add server folder alongside docs"
git push origin main
```

**Note:** GitHub Pages will continue to deploy from the `docs/` folder as configured in your repository settings (branch-based deployment).

### 2. Set Up the Server Locally

```bash
cd server
npm install
node server.js
```

### 3. Development Workflow

**For client-only changes:**
- Edit files in `docs/`
- Push to GitHub (auto-deploys from the branch)

**For server development:**
- Edit files in `server/`
- Test locally with `node server.js`
- Deploy to your hosting platform (Heroku, Render, etc.)

## Benefits

✅ Clean separation of concerns
✅ Client still deploys automatically via GitHub Pages (from docs/ folder)
✅ Server can be developed and tested locally
✅ Single repository for the entire project
✅ Your existing server code is now integrated

## Important Notes

- The `docs/` folder is what gets deployed to GitHub Pages
- The `server/` folder is for local development and separate deployment
- CNAME file is in `docs/` so your custom domain works
- 404.html is in `docs/` for custom error pages
- GitHub Pages deployment remains branch-based (no GitHub Actions needed)
