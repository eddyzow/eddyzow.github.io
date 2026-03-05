# Development Guide - Extending Your Space Portfolio

## Architecture Overview

```
index.html
├── HTML Structure
├── External Libraries
│   ├── Three.js (3D graphics)
│   ├── Pixi.js (2D graphics)
│   ├── Particles.js (particle effects)
│   └── Font Awesome (icons)
└── Custom Scripts
    ├── config.js (configuration)
    ├── three-scene.js (3D space)
    ├── planets.js (navigation system)
    ├── particles-config.js (particles setup)
    ├── content.js (content management)
    └── client.js (main interactions)
```

## Adding New Features

### 1. Adding a New Planet

**Step 1:** Update `planets.js`
```javascript
setupPlanets() {
  const planetsData = [
    // ... existing planets ...
    {
      id: 'portfolio',           // Unique ID
      label: '🎨',               // Emoji/icon
      title: 'Portfolio',        // Hover text
      section: 'portfolio',      // Content section
      orbit: { 
        radius: 150, 
        angle: Math.PI * 2.0,    // New position
        speed: 0.001 
      }
    }
  ];
  // ... rest of code
}
```

**Step 2:** Add content in `content.js`
```javascript
this.content = {
  portfolio: {
    title: 'My Portfolio',
    content: `
      <p>Your portfolio content here</p>
      <div class="project-item">...</div>
    `
  },
  // ... other sections
};
```

**Step 3:** Add CSS styling in `style.css`
```css
.planet-portfolio {
  background: radial-gradient(circle at 35% 35%, #9370db, #8a2be2);
  border-color: #8a2be2;
  color: #fff;
}
```

### 2. Adding New Galaxies

Edit `three-scene.js`:
```javascript
createGalaxies() {
  const galaxies = [
    // ... existing galaxies ...
    {
      x: 35,
      y: -25,
      scale: 1.1,
      rotation: Math.PI * 1.5,
      color: 0xff0088
    }
  ];
  // ... rest of code
}
```

### 3. Adding Keyboard Shortcuts

In `client.js`, update `setupKeyboardShortcuts()`:
```javascript
setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const planetMap = {
      'h': 'home',
      'a': 'about',
      'p': 'projects',
      's': 'scioly',
      'c': 'contact',
      'n': 'portfolio'  // New shortcut
    };

    if (planetMap[e.key]) {
      if (window.contentManager) {
        window.contentManager.showSection(planetMap[e.key]);
      }
    }
  });
}
```

### 4. Adding Sound Effects

Create `audio.js`:
```javascript
class AudioManager {
  constructor() {
    this.enabled = true;
    this.sounds = {};
    this.loadSounds();
  }

  loadSounds() {
    this.sounds.click = new Audio('assets/click.mp3');
    this.sounds.hover = new Audio('assets/hover.mp3');
    this.sounds.ambient = new Audio('assets/ambient.mp3');
  }

  playSound(soundName) {
    if (this.enabled && this.sounds[soundName]) {
      this.sounds[soundName].currentTime = 0;
      this.sounds[soundName].play();
    }
  }

  playAmbient() {
    if (this.enabled) {
      this.sounds.ambient.loop = true;
      this.sounds.ambient.play();
    }
  }
}

// In client.js
document.addEventListener('DOMContentLoaded', () => {
  window.audioManager = new AudioManager();
  window.audioManager.playAmbient();

  // Add to planet clicks
  planets.forEach(p => {
    p.addEventListener('click', () => {
      window.audioManager.playSound('click');
    });
  });
});
```

Then add to `index.html`:
```html
<script src="audio.js"></script>
```

## Advanced Customization

### 1. Custom 3D Models

Import GLTF models in `three-scene.js`:
```javascript
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@r128/examples/jsm/loaders/GLTFLoader.js';

loadModel() {
  const loader = new GLTFLoader();
  loader.load('assets/galaxy.glb', (gltf) => {
    const model = gltf.scene;
    this.scene.add(model);
  });
}
```

### 2. Animated Background

Create `background-animation.js`:
```javascript
class BackgroundAnimation {
  constructor() {
    this.canvas = document.getElementById('dust-canvas');
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.init();
  }

  init() {
    // Create background particles
    for (let i = 0; i < 200; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * 3,
        opacity: Math.random() * 0.5,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2
      });
    }
    this.animate();
  }

  animate = () => {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      
      // Wrap around
      if (p.x < 0) p.x = this.canvas.width;
      if (p.x > this.canvas.width) p.x = 0;
      if (p.y < 0) p.y = this.canvas.height;
      if (p.y > this.canvas.height) p.y = 0;

      this.ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      this.ctx.fillRect(p.x, p.y, p.size, p.size);
    });

    requestAnimationFrame(this.animate);
  }
}
```

### 3. Theme Switching

Create `themes.js`:
```javascript
class ThemeManager {
  constructor() {
    this.themes = {
      dark: {
        primary: '#00ff88',
        secondary: '#00ccff',
        background: '#000000'
      },
      neon: {
        primary: '#ff00ff',
        secondary: '#00ff00',
        background: '#0a0a0a'
      },
      cosmic: {
        primary: '#ff8800',
        secondary: '#ff00ff',
        background: '#0a0a20'
      }
    };
    
    this.currentTheme = 'dark';
    this.applyTheme('dark');
  }

  applyTheme(themeName) {
    const theme = this.themes[themeName];
    if (!theme) return;

    document.documentElement.style.setProperty('--primary', theme.primary);
    document.documentElement.style.setProperty('--secondary', theme.secondary);
    document.body.style.background = theme.background;
    
    localStorage.setItem('theme', themeName);
    this.currentTheme = themeName;
  }

  toggleTheme() {
    const themes = Object.keys(this.themes);
    const currentIndex = themes.indexOf(this.currentTheme);
    const nextTheme = themes[(currentIndex + 1) % themes.length];
    this.applyTheme(nextTheme);
  }
}
```

## Performance Optimization

### 1. Lazy Loading Content

```javascript
class LazyContentLoader {
  constructor() {
    this.loadedSections = new Set();
  }

  loadSection(section) {
    if (this.loadedSections.has(section)) return;

    // Simulate loading delay
    const spinner = document.getElementById('loading-spinner');
    spinner.classList.add('active');

    setTimeout(() => {
      // Load content
      this.loadedSections.add(section);
      spinner.classList.remove('active');
    }, 300);
  }
}
```

### 2. Request Animation Frame Optimization

```javascript
class OptimizedAnimationLoop {
  constructor() {
    this.frameTime = 0;
    this.lastTime = Date.now();
    this.fps = 60;
    this.frameInterval = 1000 / this.fps;
  }

  update(callback) {
    const now = Date.now();
    const delta = now - this.lastTime;

    if (delta >= this.frameInterval) {
      callback(delta);
      this.lastTime = now;
    }

    requestAnimationFrame(() => this.update(callback));
  }
}
```

## Testing

### Unit Tests with Jest

```javascript
// test/planets.test.js
describe('Planet System', () => {
  test('should create 5 planets', () => {
    const system = new PlanetSystem();
    expect(system.planets.length).toBe(5);
  });

  test('planet should have correct properties', () => {
    const system = new PlanetSystem();
    const planet = system.planets[0];
    expect(planet.id).toBe('home');
    expect(planet.label).toBe('🏠');
  });
});
```

Run with:
```bash
npm test
```

## Debugging

### Enable Debug Mode

In `config.js`:
```javascript
debug: {
  enabled: true,
  showFPS: true,
  showGalaxyBounds: true,
  logInteractions: true
}
```

### Browser DevTools Tips

```javascript
// Check scene state
console.log(spaceScene.scene);

// Check planet positions
console.log(planetSystem.planets);

// Monitor performance
performance.mark('animation-start');
// ... code ...
performance.mark('animation-end');
performance.measure('animation', 'animation-start', 'animation-end');
```

## Git Workflow for Development

```bash
# Create feature branch
git checkout -b feature/add-sound-effects

# Make changes
# ... edit files ...

# Commit
git add .
git commit -m "Add sound effects to planet interactions"

# Push
git push origin feature/add-sound-effects

# Create Pull Request on GitHub
# After review, merge to main/gh-pages
```

## API Reference

### PlanetSystem
```javascript
planetSystem.handlePlanetClick(section)  // Click handler
planetSystem.updateInteractions(text)    // Update HUD
```

### ContentManager
```javascript
contentManager.showSection(section)  // Show content panel
contentManager.closePanel()          // Close content panel
contentManager.updateHUD(section)    // Update HUD display
```

### SpaceScene
```javascript
spaceScene.createGalaxies()     // Create galaxy objects
spaceScene.createStars()        // Create star field
spaceScene.animate()            // Main animation loop
```

## Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [WebGL Best Practices](https://www.khronos.org/webgl/wiki/WebGL_Best_Practices)
- [JavaScript Performance](https://developer.mozilla.org/en-US/docs/Tools/Performance)

---

**Ready to Extend?**
Happy coding! For questions, reach out to eddy@eddyzow.net
