# Setup & Deployment Guide

## Installation

### Prerequisites
- A web browser with WebGL support
- Text editor (VS Code, Sublime, etc.) for editing
- Optional: Local web server for testing

### No Build Required
This project is a **static site** - no npm install, no build process, no dependencies to compile!

## Local Testing

### Option 1: Python (Recommended)
```bash
# Python 3.x
cd /path/to/experimental
python -m http.server 8000

# Python 2.x
python -m SimpleHTTPServer 8000
```

Then open: `http://localhost:8000`

### Option 2: Node.js
```bash
# Install http-server globally (one time)
npm install -g http-server

# Run from experimental folder
cd /path/to/experimental
http-server

# Open: http://localhost:8080
```

### Option 3: Using VS Code
1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

### Option 4: Direct Browser
Simply double-click `index.html` to open directly (some features may be limited)

## Deployment

### GitHub Pages

#### Setup (First Time)
1. Create a `gh-pages` branch:
```bash
git checkout -b gh-pages
```

2. Copy experimental folder content to the appropriate location in your gh-pages branch

3. Push to GitHub:
```bash
git push origin gh-pages
```

4. Visit: `https://yourusername.github.io/experimental/`

#### Updates (Subsequent Times)
```bash
# Make changes, then:
git add .
git commit -m "Update experimental site"
git push origin gh-pages
```

### Custom Domain with GitHub Pages
1. Add CNAME file with your domain
2. Configure DNS settings
3. Enable GitHub Pages in repository settings

### Traditional Web Host (FTP/SFTP)

1. **Connect via FTP**
   - Use FileZilla, WinSCP, or similar
   - Connect with your FTP credentials

2. **Upload Files**
   - Upload all files from experimental folder
   - Maintain folder structure
   - Ensure proper permissions (644 for files, 755 for folders)

3. **Access Site**
   - Visit your domain/experimental/

### Docker Deployment
```dockerfile
FROM nginx:alpine
COPY experimental /usr/share/nginx/html/experimental
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Then:
```bash
docker build -t my-space-portfolio .
docker run -p 80:80 my-space-portfolio
```

### AWS S3 + CloudFront

1. **Create S3 Bucket**
   ```bash
   aws s3 mb s3://my-space-portfolio
   ```

2. **Upload Files**
   ```bash
   aws s3 sync . s3://my-space-portfolio --acl public-read
   ```

3. **Create CloudFront Distribution**
   - Point to S3 bucket
   - Set index document to index.html
   - Configure HTTPS

4. **Access via CloudFront URL**

### Vercel Deployment

1. **Sign up** at vercel.com

2. **Connect repository**
   - Import your GitHub repo
   - Select experimental folder

3. **Deploy**
   - Automatic deployments on push
   - Instant preview links
   - CDN distribution included

### Netlify Deployment

1. **Connect GitHub**
   - Authorize Netlify
   - Select repository

2. **Configure**
   - Build command: `(leave blank)`
   - Publish directory: `docs/experimental`

3. **Deploy**
   - Automatic on push
   - Built-in analytics

## Configuration for Deployment

### CORS Settings
If hosting assets on different domain, update CORS headers:

```javascript
// In server config
headers: {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
}
```

### CDN Optimization
For faster loading, use a CDN:

1. Upload files to CloudFlare, Akamai, or similar
2. Update script sources in `index.html`
3. Use CDN URL for all resources

### SSL/TLS Certificate
For production, always use HTTPS:

- Let's Encrypt (free)
- Cloudflare SSL (free)
- Commercial CA

### Performance Optimization

#### Minification
```bash
# Minify CSS
npm install -g cssnano
cssnano style.css -o style.min.css

# Minify JS
npm install -g terser
terser client.js -o client.min.js

# Update index.html to use minified versions
```

#### Image Optimization
```bash
# If adding images, optimize them:
npm install -g imagemin-cli
imagemin assets/* --out-dir=assets
```

#### Gzip Compression
Most modern servers do this automatically. To verify:

```bash
# Check if server sends gzip
curl -I -H "Accept-Encoding: gzip" https://yoursite.com/experimental/

# Should see: Content-Encoding: gzip
```

## Monitoring & Analytics

### Enable Google Analytics
Add to `index.html` in `<head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID');
</script>
```

### Setup Monitoring
- Uptime monitoring (UptimeRobot)
- Error tracking (Sentry)
- Performance monitoring (New Relic)

## Security Considerations

### HTTPS Only
Always use HTTPS in production

### Content Security Policy
Add to server headers:
```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' cdnjs.cloudflare.com cdn.jsdelivr.net pixijs.download
```

### Remove Debug Mode
Set `debug: { enabled: false }` in config.js before deployment

## Troubleshooting Deployment

### Files Not Loading
- Check file paths are relative
- Ensure all files uploaded
- Verify permissions (644 for files)

### Scripts Not Executing
- Check browser console for errors
- Verify MIME types on server
- Ensure JavaScript is enabled

### Performance Issues
- Check CDN caching
- Verify minification
- Use DevTools Performance tab

### CORS Errors
- Enable CORS on server
- Use appropriate headers
- Check external resource URLs

## Rollback Procedure

### GitHub Pages
```bash
git log --oneline
git revert COMMIT_HASH
git push origin gh-pages
```

### FTP/Traditional Hosting
- Keep backup of previous version
- Upload old files back
- Test functionality

## Maintenance

### Regular Updates
- Update Three.js library
- Check for security updates
- Monitor browser compatibility

### Content Updates
- Update content.js as needed
- Add new projects
- Update about section

### Performance Review
- Monitor analytics
- Check error rates
- Optimize based on data

## Version Control

Keep your experimental site in git:

```bash
# Initialize git (if not already done)
git init

# Add files
git add .

# Commit
git commit -m "Initial experimental portfolio commit"

# Push to GitHub
git remote add origin https://github.com/yourusername/repo.git
git push -u origin gh-pages
```

---

**Need Help?**
- Check README.md for overview
- See QUICKSTART.md for usage
- Contact: eddy@eddyzow.net
