# Eddy's Space Portfolio 6.2 (Experimental)

## Overview

Welcome to the next generation of my personal website! This is an **interactive space-themed web application** built with cutting-edge web technologies. Instead of a traditional portfolio site, it's an immersive experience with 3D galaxies, orbiting planets as navigation buttons, and beautiful particle effects.

## Features

### 🌌 3D Space Scene
- **Multiple spiral galaxies** rendered with Three.js
- Dynamic camera movement for depth and perspective
- 10,000 background stars for atmosphere
- Smooth animations and rotating celestial bodies

### 🪐 Interactive Planet Navigation
- **5 interactive planets** orbiting around the center:
  - 🏠 **Home** - Welcome message
  - 👤 **About** - Personal information and background
  - 🚀 **Projects** - Featured projects and portfolio
  - 🔭 **Science Olympiad** - Astronomy education
  - ✉️ **Contact** - Get in touch
- Smooth orbital animation
- Hover effects with dynamic glow
- Click to reveal information

### ✨ Visual Effects
- **Particle system** with interactive elements
- **Cosmic dust** floating effect
- **Ripple animations** on interactions
- **Glowing text** with animated HUD
- **Gradient colors** throughout

### 📱 Responsive Design
- Fully responsive from mobile to 4K displays
- Touch-friendly on mobile devices
- Optimized performance

### ⌨️ Keyboard Shortcuts
- **H** - Home
- **A** - About
- **P** - Projects
- **S** - Science Olympiad
- **C** - Contact
- **ESC** - Close content panel

## Technologies Used

- **Three.js** - 3D graphics and galaxies
- **Pixi.js** - 2D rendering capabilities
- **Particles.js** - Particle effects
- **HTML5 Canvas** - Custom animations
- **CSS3** - Modern styling with gradients and animations
- **Vanilla JavaScript** - No framework dependencies

## File Structure

```
experimental/
├── index.html              # Main HTML file
├── style.css              # Main styling
├── client.js              # Main client script with interactive features
├── three-scene.js         # Three.js 3D space scene
├── planets.js             # Planet system and orbital mechanics
├── particles-config.js    # Particles.js configuration
├── content.js             # Content management system
└── assets/                # Asset folder for future additions
    └── (textures, models, etc.)
```

## How to Use

1. **Open the site** - Navigate to `/experimental/` or open `index.html` in a browser
2. **Explore** - Click on any orbiting planet to reveal information
3. **Navigate** - Use planet buttons or keyboard shortcuts
4. **Close** - Click the X button or press ESC to close content panels

## Browser Compatibility

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

For best experience, use a modern browser with WebGL support.

## Performance Considerations

- Automatic low-power mode detection for older devices
- Particle count optimization based on device capability
- RAF-based animations for smooth 60fps performance
- Lazy loading where applicable

## Future Enhancements

- [ ] Add 3D planet models with textures
- [ ] Implement audio/music background
- [ ] Add more interactive elements
- [ ] Create project detail views with screenshots
- [ ] Add smooth scrolling transitions
- [ ] Implement dark/light theme toggle
- [ ] Add social media integration
- [ ] Create mobile app version

## Building & Deployment

This is a static site with no build process required. Simply serve the files and open in a browser.

### Local Testing
```bash
# Option 1: Using Python
python -m http.server 8000

# Option 2: Using Node.js
npx http-server

# Then visit http://localhost:8000/experimental/
```

### Deployment
Copy all files from the `experimental` folder to your web server.

## Customization

### Adding New Sections
Edit `content.js` and add new entries to the `content` object:

```javascript
contact: {
  title: 'Your Title',
  content: `<p>Your HTML content here</p>`
}
```

### Changing Colors
Modify the color values in `style.css`:
- Primary: `#00ff88` (green)
- Secondary: `#00ccff` (cyan)
- Tertiary: `#ff00ff` (magenta)

### Adjusting Galaxy Parameters
In `three-scene.js`, modify the `galaxies` array to change:
- Position (`x`, `y`)
- Scale
- Rotation
- Color

## Known Limitations

- Heavy on GPU usage (consider reducing particle count on low-end devices)
- Best viewed on screens with decent performance
- Mobile may require optimization for older devices

## License

All code is personal and proprietary.

## Credits

- Three.js team for amazing 3D library
- Particles.js for particle system
- Pixi.js for 2D rendering
- Font Awesome for icons

## Questions?

Feel free to reach out at eddy@eddyzow.net

---

**Version:** 6.2 Experimental  
**Last Updated:** February 2026  
**Status:** Active Development
