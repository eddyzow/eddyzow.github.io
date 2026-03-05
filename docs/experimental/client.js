// MAIN CLIENT SCRIPT - Interactive Features & Effects

class InteractiveEffects {
  constructor() {
    this.setupDustCanvas();
    this.setupMouseTracking();
    this.setupPlanetInteractions();
    this.initializeUI();
  }

  setupDustCanvas() {
    const canvas = document.getElementById('dust-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    // Create floating dust particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 0.5,
        opacity: Math.random() * 0.3 + 0.1,
        wobble: Math.random() * Math.PI * 2,
        wobbleSpeed: Math.random() * 0.02 + 0.01
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = 'rgba(0, 255, 136, 0.05)';

      particles.forEach(p => {
        // Update position
        p.x += p.vx;
        p.y += p.vy;
        p.wobble += p.wobbleSpeed;

        // Wrap around edges
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Draw particle with wobble
        const wobbleOffset = Math.sin(p.wobble) * 2;
        ctx.fillRect(p.x + wobbleOffset, p.y, p.size, p.size);
      });

      requestAnimationFrame(animate);
    };

    animate();

    // Handle resize
    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  setupMouseTracking() {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      // Update glow effect on nearby elements
      this.updateGlowEffects(mouseX, mouseY);
    });

    this.mouseX = mouseX;
    this.mouseY = mouseY;
  }

  updateGlowEffects(x, y) {
    const planets = document.querySelectorAll('.planet-button');
    
    planets.forEach(planet => {
      const rect = planet.getBoundingClientRect();
      const planetX = rect.left + rect.width / 2;
      const planetY = rect.top + rect.height / 2;
      
      const distance = Math.hypot(x - planetX, y - planetY);
      const maxDistance = 200;
      
      if (distance < maxDistance) {
        const intensity = 1 - (distance / maxDistance);
        planet.style.boxShadow = `
          0 0 ${20 + intensity * 30}px rgba(255, 255, 255, ${0.2 + intensity * 0.3}),
          inset 0 0 ${10 + intensity * 10}px rgba(255, 255, 255, ${intensity * 0.2})
        `;
      } else {
        planet.style.boxShadow = '0 0 20px rgba(255, 255, 255, 0.2)';
      }
    });
  }

  setupPlanetInteractions() {
    const planets = document.querySelectorAll('.planet-button');
    
    planets.forEach(planet => {
      planet.addEventListener('mouseenter', (e) => {
        const title = planet.title;
        if (window.planetSystem) {
          window.planetSystem.updateInteractions(`Hover over ${title} • Click to explore`);
        }
        
        // Add scale animation
        planet.style.transform = 'scale(1.2) translateZ(0)';
      });

      planet.addEventListener('mouseleave', (e) => {
        if (window.planetSystem) {
          window.planetSystem.updateInteractions('Click on any planet to explore');
        }
        planet.style.transform = 'scale(1) translateZ(0)';
      });
    });
  }

  initializeUI() {
    // Initialize HUD
    this.updateHUDTime();
    setInterval(() => this.updateHUDTime(), 1000);

    // Add keyboard shortcuts info
    this.setupKeyboardShortcuts();
  }

  updateHUDTime() {
    // You could add a clock or status here if desired
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Keyboard navigation
      const planetMap = {
        'h': 'home',
        'a': 'about',
        'p': 'projects',
        's': 'scioly',
        'c': 'contact'
      };

      if (planetMap[e.key]) {
        if (window.contentManager) {
          window.contentManager.showSection(planetMap[e.key]);
        }
      }
    });
  }
}

// Enhanced ripple effect for interactive elements
function createRipple(event) {
  const element = event.currentTarget;
  const circle = document.createElement('span');
  
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  circle.style.width = circle.style.height = size + 'px';
  circle.style.left = x + 'px';
  circle.style.top = y + 'px';
  circle.classList.add('ripple');

  // Ensure element can contain positioned children
  if (getComputedStyle(element).position === 'static') {
    element.style.position = 'relative';
  }

  // Remove any existing ripples
  const existingRipple = element.querySelector('.ripple');
  if (existingRipple) existingRipple.remove();

  element.appendChild(circle);

  setTimeout(() => circle.remove(), 600);
}

// Add ripple CSS if not already present
function setupRippleCSS() {
  const style = document.createElement('style');
  style.textContent = `
    .ripple {
      position: absolute;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(255,255,255,0.8), transparent);
      pointer-events: none;
      animation: ripple-animation 0.6s ease-out;
    }

    @keyframes ripple-animation {
      from {
        transform: scale(0);
        opacity: 1;
      }
      to {
        transform: scale(1);
        opacity: 0;
      }
    }
  `;
  
  if (!document.querySelector('style[data-ripple]')) {
    style.setAttribute('data-ripple', 'true');
    document.head.appendChild(style);
  }
}

// Performance optimization
class PerformanceOptimizer {
  constructor() {
    this.enableLowPowerMode = this.detectLowPowerDevice();
    if (this.enableLowPowerMode) {
      this.applyLowPowerSettings();
    }
  }

  detectLowPowerDevice() {
    // Check for low-end devices
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    
    if (!gl) return true;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : 'unknown';
    
    return renderer.toLowerCase().includes('adreno') || 
           renderer.toLowerCase().includes('mali');
  }

  applyLowPowerSettings() {
    console.log('Low-power mode enabled');
    
    // Reduce particle count
    if (typeof particlesJS !== 'undefined') {
      document.addEventListener('DOMContentLoaded', () => {
        const pjs = window.pJSDom[0].pJS;
        pjs.particles.number.value = 40;
      });
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // Setup ripple effect CSS
  setupRippleCSS();

  // Add ripple listeners to interactive elements
  const interactiveElements = document.querySelectorAll('.planet-button, .close-btn, a, button');
  interactiveElements.forEach(el => {
    el.addEventListener('click', createRipple);
  });

  // Initialize interactive effects
  window.effects = new InteractiveEffects();

  // Initialize performance optimizer
  window.performanceOptimizer = new PerformanceOptimizer();

  // Show loading spinner briefly
  const spinner = document.getElementById('loading-spinner');
  spinner.classList.add('active');
  
  setTimeout(() => {
    spinner.classList.remove('active');
  }, 1500);
});

// Service Worker registration for offline support (optional)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment to enable offline functionality
    // navigator.serviceWorker.register('/experimental/sw.js');
  });
}
