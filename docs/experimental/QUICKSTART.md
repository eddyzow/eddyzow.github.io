# Quick Start Guide - Eddy's Space Portfolio

## 🚀 Getting Started

### View the Site
Simply open `index.html` in any modern web browser. No installation or build process required!

## 🎮 Navigation

### Using Mouse
1. **Hover** over any orbiting planet to see its name
2. **Click** any planet to open detailed information
3. **Close** with the X button or by pressing ESC

### Using Keyboard
- **H** → Home
- **A** → About  
- **P** → Projects
- **S** → Science Olympiad
- **C** → Contact
- **ESC** → Close panel

### Mobile
- **Tap** planets to navigate
- **Swipe** in content panel to scroll
- Fully optimized for touch devices

## 🎨 Visual Features

- **Orbiting Planets**: Each glowing sphere represents a section
- **3D Galaxies**: Beautiful spiral formations with THREE.js
- **Particle Effects**: Interactive particles respond to mouse movement
- **HUD Display**: Futuristic status information in top-left
- **Content Panels**: Smooth sliding panel from the right side

## ⚙️ Customization

### Change Colors
Edit `style.css` and update these variables:
```css
--primary: #00ff88;      /* Main neon green */
--secondary: #00ccff;    /* Cyan accent */
--tertiary: #ff00ff;     /* Magenta */
```

### Modify Planets
Edit `planets.js` in the `setupPlanets()` method to:
- Change positions
- Update labels/emojis
- Adjust orbital speeds
- Modify colors

### Add New Content
Edit `content.js` and add to the `content` object:
```javascript
newSection: {
  title: 'My Section',
  content: '<p>Your HTML here</p>'
}
```

## 🔧 Advanced Configuration

Edit `config.js` to adjust:
- Number of stars and galaxies
- Animation speeds
- Color scheme
- Performance settings
- Accessibility options

## 📊 Performance

### Monitor Performance
- Open DevTools (F12)
- Check FPS in performance tab
- Monitor GPU usage

### Optimize for Low-End Devices
In `config.js`, set:
```javascript
performance: {
  autoReduceOnLowPower: true,
  maxParticleCount: 5000  // Reduce particles
}
```

## 🌐 Deployment

### GitHub Pages
1. Push to your gh-pages branch
2. Site automatically deploys at `yourusername.github.io/experimental`

### Custom Server
1. Copy all files to your web server
2. Ensure proper MIME types are set
3. No special server configuration needed

### Local Testing
```bash
# Python 3
python -m http.server 8000

# Node.js
npx http-server

# Ruby
ruby -run -ehttpd . -p8000
```

Then visit: `http://localhost:8000/experimental/`

## 🐛 Troubleshooting

### Site Not Loading
- Check console for errors (F12)
- Ensure all script files are present
- Try clearing browser cache

### 3D Graphics Not Working
- Update your browser
- Check GPU driver
- Try different browser (Chrome, Firefox, Safari)

### Performance Issues
- Reduce particle count in config.js
- Disable dust effect in config.js
- Close other browser tabs

### Content Not Showing
- Check content.js for syntax errors
- Verify section IDs match
- Check browser console for errors

## 📝 File Guide

| File | Purpose |
|------|---------|
| `index.html` | Main page structure |
| `style.css` | All styling |
| `client.js` | Main interactions |
| `three-scene.js` | 3D galaxies |
| `planets.js` | Planet system |
| `particles-config.js` | Particles.js setup |
| `content.js` | Content management |
| `config.js` | Configuration settings |
| `sw.js` | Service worker (optional) |

## 💡 Tips & Tricks

1. **Disable animations** in CSS for faster load times
2. **Pre-render galaxies** for even better performance
3. **Add sound effects** to planet clicks
4. **Create planet interactions** with hover states
5. **Add project showcase** with 3D models
6. **Implement multiplayer** with WebSockets

## 🎓 Learning Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [Particles.js GitHub](https://github.com/VincentGarreau/particles.js/)
- [WebGL Fundamentals](https://webglfundamentals.org/)
- [Canvas API Guide](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

## 🆘 Support

For issues or questions:
1. Check the README.md
2. Review DevTools console
3. Check browser compatibility
4. Contact: eddy@eddyzow.net

## 📈 Future Ideas

- [ ] VR/AR support
- [ ] 3D model import
- [ ] Audio/music background
- [ ] Achievement system
- [ ] Custom themes
- [ ] Social sharing
- [ ] Real-time updates
- [ ] Analytics integration

---

**Version:** 6.2  
**Last Updated:** February 25, 2026  
**Author:** Eddy Zhao
