
# Welcome to eddyzow.net!

This is the open source code for [my website](https://eddyzow.net)! All my projects can be found here. Everything I write is open-source, so you can see exactly what code goes into making everything. I hope you enjoy!

## Repository Structure

This repository contains both the client-side and server-side code for eddyzow.net:

- **`docs/`** - Static website files served via GitHub Pages
  - Contains all HTML, CSS, JavaScript, and assets
  - Deployed to GitHub Pages from the `docs` folder (branch-based deployment)
  
- **`server/`** - Node.js backend server
  - Node.js server for API endpoints and dynamic features
  - Run locally for development or deploy to your hosting platform

## Getting Started

### Client (Static Website)

The client is automatically deployed via GitHub Pages from the `docs/` folder. To view locally:

1. Navigate to the docs directory:
   ```bash
   cd docs
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   python -m http.server 8000
   ```

### Server (Node.js Backend)

To run the server locally:

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node server.js
   ```

The server will run on the configured port.

## License

Open source - feel free to use and learn from this code!
