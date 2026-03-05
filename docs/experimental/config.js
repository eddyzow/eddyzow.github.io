// CONFIGURATION FILE - Customize your space portfolio
const SPACE_CONFIG = {
  // Scene Configuration
  scene: {
    // Star count (increase for more stars, decrease for better performance)
    starCount: 10000,
    
    // Ambient light intensity (0-1)
    ambientLightIntensity: 0.3,
    
    // Point light intensities
    pointLight1Intensity: 0.5,
    pointLight2Intensity: 0.3,
  },

  // Galaxy Configuration
  galaxies: [
    {
      name: 'Andromeda',
      position: { x: 20, y: 15 },
      scale: 1.2,
      rotation: 0,
      color: 0x00ccff,
      particleCount: 3000
    },
    {
      name: 'Triangulum',
      position: { x: -25, y: -20 },
      scale: 0.8,
      rotation: Math.PI / 3,
      color: 0xff00ff,
      particleCount: 2500
    },
    {
      name: 'Milky Way',
      position: { x: 5, y: -30 },
      scale: 1.0,
      rotation: Math.PI / 2,
      color: 0xff8800,
      particleCount: 3500
    },
    {
      name: 'Whirlpool',
      position: { x: -30, y: 10 },
      scale: 0.9,
      rotation: Math.PI / 4,
      color: 0x00ff88,
      particleCount: 3000
    },
    {
      name: 'Sombrero',
      position: { x: 25, y: -10 },
      scale: 0.7,
      rotation: Math.PI,
      color: 0xff0088,
      particleCount: 2000
    }
  ],

  // Planet Configuration
  planets: [
    {
      id: 'home',
      label: '🏠',
      title: 'Home',
      section: 'home',
      orbitRadius: 150,
      orbitAngle: 0,
      orbitSpeed: 0.001,
      color: { r: 135, g: 206, b: 235 }
    },
    {
      id: 'about',
      label: '👤',
      title: 'About',
      section: 'about',
      orbitRadius: 150,
      orbitAngle: Math.PI * 0.4,
      orbitSpeed: 0.0008,
      color: { r: 255, g: 140, b: 66 }
    },
    {
      id: 'projects',
      label: '🚀',
      title: 'Projects',
      section: 'projects',
      orbitRadius: 150,
      orbitAngle: Math.PI * 0.8,
      orbitSpeed: 0.0012,
      color: { r: 255, g: 105, b: 180 }
    },
    {
      id: 'scioly',
      label: '🔭',
      title: 'Science Olympiad',
      section: 'scioly',
      orbitRadius: 150,
      orbitAngle: Math.PI * 1.2,
      orbitSpeed: 0.0009,
      color: { r: 147, g: 112, b: 219 }
    },
    {
      id: 'contact',
      label: '✉️',
      title: 'Contact',
      section: 'contact',
      orbitRadius: 150,
      orbitAngle: Math.PI * 1.6,
      orbitSpeed: 0.001,
      color: { r: 0, g: 255, b: 136 }
    }
  ],

  // Particle System Configuration
  particles: {
    number: 80,
    size: 2.5,
    opacity: 0.4,
    lineDistance: 200,
    lineOpacity: 0.2,
    moveSpeed: 0.8,
    colors: ['#00ff88', '#00ccff', '#ff00ff', '#ff8800'],
    interactionDistance: 200
  },

  // Animation Configuration
  animation: {
    panelTransitionTime: 500, // ms
    rippleEffectDuration: 600, // ms
    hudGlowCycle: 3000, // ms
    dustParticleCount: 50,
    dustSpeed: 0.5,
    cameraMovementScale: 5
  },

  // Color Scheme
  colors: {
    primary: '#00ff88',      // Neon Green
    secondary: '#00ccff',    // Cyan
    tertiary: '#ff00ff',     // Magenta
    accent: '#ff8800',       // Orange
    text: '#ffffff',         // White
    darkBg: '#000000',       // Black
    panelBg: 'rgba(10, 10, 30, 0.95)'
  },

  // Performance Settings
  performance: {
    // Enable/disable specific features
    enableParticles: true,
    enableGalaxies: true,
    enableStars: true,
    enableDustEffect: true,
    enableRippleEffect: true,
    
    // Optimization
    autoReduceOnLowPower: true,
    maxParticleCount: 10000,
    frameRateTarget: 60
  },

  // Content Update Configuration
  content: {
    updateFrequency: 'manual', // 'manual', 'daily', 'weekly'
    lastUpdated: 'February 25, 2026'
  },

  // Accessibility
  accessibility: {
    enableKeyboardNavigation: true,
    enableReducedMotion: false,
    enableHighContrast: false
  },

  // Debug Mode
  debug: {
    enabled: false,
    showFPS: false,
    showGalaxyBounds: false,
    logInteractions: false
  }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SPACE_CONFIG;
}

// Make available globally
window.SPACE_CONFIG = SPACE_CONFIG;
