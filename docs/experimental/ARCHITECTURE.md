# Architecture & Flow Diagrams

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     HTML Structure                           │
│                   (index.html)                               │
│  ┌───────────────┬──────────────┬──────────────────────┐    │
│  │ Space Canvas  │ Particles JS │ Content Panel        │    │
│  │ (Three.js)    │              │ (Dynamic Content)    │    │
│  └───────────────┴──────────────┴──────────────────────┘    │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ Planets Container (Orbital Navigation)               │   │
│  │  🏠 🙋 🚀 🔭 ✉️                                        │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │   CSS Styling (style.css)            │
        │ - Gradients & animations             │
        │ - Responsive layout                  │
        │ - Neon color scheme                  │
        └─────────────────────────────────────┘
                          ↓
        ┌─────────────────────────────────────┐
        │   JavaScript Execution               │
        │ (Multiple modules)                   │
        └─────────────────────────────────────┘
```

## JavaScript Module Dependencies

```
config.js (Global Configuration)
    ↓
    ├─→ three-scene.js (Creates 3D space)
    │    └─→ Renders galaxies & stars
    │
    ├─→ planets.js (Creates navigation)
    │    └─→ Orbital mechanics & interactions
    │
    ├─→ particles-config.js (Particle system)
    │    └─→ Interactive particle effects
    │
    ├─→ content.js (Content management)
    │    └─→ Manages panels & sections
    │
    └─→ client.js (Main orchestrator)
         └─→ Coordinates all systems
         └─→ Handles user interactions
         └─→ Manages animations
```

## User Interaction Flow

```
User Loads Page
    ↓
Browser Fetches Files
    ├─ HTML structure loaded
    ├─ CSS applied
    └─ JavaScript parsed
    ↓
DOM Ready Event Triggers
    ├─ SpaceScene initialized
    ├─ PlanetSystem created
    ├─ ContentManager setup
    └─ InteractiveEffects started
    ↓
Animations Begin
    ├─ Galaxy spirals rotate
    ├─ Planets orbit
    ├─ Stars render
    ├─ Particles animate
    └─ Dust floats
    ↓
User Interaction
    ├─ Hover Planet → Glow effect
    ├─ Click Planet → Show content
    ├─ Press Key → Navigate
    ├─ Move Mouse → Particle interaction
    └─ Close Panel → Return to space
```

## Content Panel Flow

```
User Clicks Planet
    ↓
Planet Button Event Triggered
    ├─ Get section ID
    ├─ Play sound (optional)
    └─ Call contentManager.showSection()
    ↓
ContentManager Opens Panel
    ├─ Fetch content from content.js
    ├─ Render HTML to panel
    ├─ Add animation
    └─ Update HUD
    ↓
Panel Displayed
    ├─ Content scrollable
    ├─ Links clickable
    ├─ Close button available
    └─ ESC key closes
    ↓
User Closes Panel
    ├─ Remove animation
    ├─ Slide panel away
    └─ Return focus to space
```

## Animation Loop

```
RequestAnimationFrame Called
    ↓
    ├─ SpaceScene.animate()
    │   ├─ Update camera position
    │   ├─ Rotate spirals
    │   ├─ Render THREE.js scene
    │   └─ Request next frame
    │
    ├─ PlanetSystem.animate()
    │   ├─ Update planet positions
    │   ├─ Calculate orbital angles
    │   ├─ Update DOM positions
    │   └─ Request next frame
    │
    ├─ Dust Canvas Animation
    │   ├─ Update particle positions
    │   ├─ Draw on canvas
    │   └─ Handle wobble
    │
    └─ Effects System
        ├─ Glow effect calculations
        ├─ Ripple animations
        └─ HUD updates
    ↓
Loop Continues (60 FPS Target)
```

## Event Handling Tree

```
window.addEventListener()
    ├─ scroll → Update header color
    ├─ resize → Adjust layouts
    ├─ mousemove → Glow effects
    ├─ keydown → Keyboard shortcuts
    ├─ DOMContentLoaded → Initialize
    └─ load → Start animations
    
document.addEventListener()
    ├─ click on planets → Show content
    ├─ click on close button → Close panel
    ├─ keyboard events → Navigation
    └─ ripple effects
    
element.addEventListener()
    ├─ mouseenter on planets → Highlight
    ├─ mouseleave on planets → Normal
    ├─ click anywhere → Ripple effect
    └─ scroll in content → Panel scroll
```

## Data Flow

```
Static Content (content.js)
    ├─ Home
    ├─ About
    ├─ Projects
    ├─ Science Olympiad
    └─ Contact
    ↓
ContentManager.showSection()
    ↓
Renders to #content-wrapper
    ↓
User Sees Content Panel
    ↓
User Interacts with Links
    └─ May open external links
```

## Configuration Hierarchy

```
window.SPACE_CONFIG (config.js)
    ├─ scene (THREE.js settings)
    ├─ galaxies (5 galaxy definitions)
    ├─ planets (5 planet definitions)
    ├─ particles (Particle system config)
    ├─ animation (Speed/timing)
    ├─ colors (Color scheme)
    ├─ performance (Optimization)
    ├─ accessibility (A11y)
    └─ debug (Development tools)
    ↓
Used by all modules
    ├─ three-scene.js reads scene config
    ├─ planets.js reads planet config
    ├─ particles-config.js reads particles config
    └─ client.js reads animation/performance config
```

## Performance Optimization Flow

```
Device Detection
    ├─ Check GPU capability
    ├─ Test performance
    └─ Detect low-power mode
    ↓
If Low-Power Detected
    ├─ Reduce particle count
    ├─ Lower galaxy quality
    ├─ Simplify animations
    └─ Disable some effects
    ↓
Otherwise
    ├─ Use full feature set
    ├─ High particle count
    ├─ Full animations
    └─ All effects enabled
    ↓
Monitor Performance
    ├─ Track FPS
    ├─ Monitor GPU usage
    └─ Throttle if needed
```

## Browser API Usage

```
HTML5 APIs Used:
    ├─ Canvas API
    │  └─ dust-canvas, particles-js, THREE.js
    ├─ WebGL
    │  └─ THREE.js graphics
    ├─ DOM API
    │  └─ Element manipulation
    ├─ Storage API
    │  └─ localStorage (theme, etc.)
    ├─ Performance API
    │  └─ FPS monitoring
    └─ Service Worker API
       └─ Offline support (optional)
```

## Rendering Pipeline

```
1. THREE.js Rendering
   ├─ Camera perspective
   ├─ Galaxy geometry
   ├─ Lighting calculation
   └─ Frame buffer output
    ↓
2. Particles.js Rendering
   ├─ Particle positions
   ├─ Velocity calculations
   └─ WebGL rendering
    ↓
3. Custom Canvas Rendering
   ├─ Dust particle drawing
   ├─ 2D effects
   └─ Compositing
    ↓
4. DOM Rendering
   ├─ Planet positions
   ├─ Panel visibility
   ├─ HUD updates
   └─ CSS animations
    ↓
5. Screen Output
   └─ Final composite image
```

## File Dependencies

```
index.html
    ├─ Links to style.css
    └─ Links to script files:
        ├─ config.js ← Foundation
        ├─ three-scene.js ← Uses config
        ├─ planets.js ← Uses config
        ├─ particles-config.js ← Uses config
        ├─ content.js ← Standalone
        └─ client.js ← Uses all above
```

## Component Relationship Map

```
                    ┌─────────────────┐
                    │  config.js      │
                    │ (Central Config)│
                    └────────┬────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
    ┌─────▼────┐      ┌──────▼───┐      ┌──────▼──────┐
    │three-scene│      │planets.js│      │particles-  │
    │   .js     │      │          │      │config.js   │
    └──────────┘      └─────────┘      └────────────┘
          │                  │                  │
          └──────────────────┼──────────────────┘
                             │
                    ┌────────▼────────┐
                    │ content.js      │
                    │(Independent)    │
                    └─────────────────┘
                             │
                    ┌────────▼────────┐
                    │  client.js      │
                    │(Orchestrator)   │
                    └─────────────────┘
```

## State Management Flow

```
Application State:
    ├─ Current section (home/about/projects/scioly/contact)
    ├─ Panel open/closed
    ├─ Theme (dark/light)
    ├─ Animation running (true/false)
    └─ User preferences
    ↓
State Updates:
    ├─ User clicks planet → Show section
    ├─ User presses ESC → Close panel
    ├─ User presses theme toggle → Change theme
    └─ Auto-detect device → Adjust quality
    ↓
Effects:
    ├─ DOM updates
    ├─ CSS changes
    ├─ Animation triggers
    └─ LocalStorage saves
```

---

**This architecture ensures:**
- ✅ Modular, maintainable code
- ✅ Clear separation of concerns
- ✅ Easy to extend
- ✅ Performance optimized
- ✅ Responsive to user input
- ✅ Smooth animations
- ✅ Graceful degradation
