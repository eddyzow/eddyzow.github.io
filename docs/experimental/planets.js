// INTERACTIVE PLANET BUTTONS SYSTEM
class PlanetSystem {
  constructor() {
    this.planets = [];
    this.setupPlanets();
    this.animatePlanets();
  }

  setupPlanets() {
    const planetsData = [
      {
        id: 'home',
        label: '🏠',
        title: 'Home',
        section: 'home',
        orbit: { radius: 150, angle: 0, speed: 0.001 }
      },
      {
        id: 'about',
        label: '👤',
        title: 'About',
        section: 'about',
        orbit: { radius: 150, angle: Math.PI * 0.4, speed: 0.0008 }
      },
      {
        id: 'projects',
        label: '🚀',
        title: 'Projects',
        section: 'projects',
        orbit: { radius: 150, angle: Math.PI * 0.8, speed: 0.0012 }
      },
      {
        id: 'scioly',
        label: '🔭',
        title: 'Science Olympiad',
        section: 'scioly',
        orbit: { radius: 150, angle: Math.PI * 1.2, speed: 0.0009 }
      },
      {
        id: 'contact',
        label: '✉️',
        title: 'Contact',
        section: 'contact',
        orbit: { radius: 150, angle: Math.PI * 1.6, speed: 0.001 }
      }
    ];

    const container = document.getElementById('planets-container');
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight / 2;

    planetsData.forEach(data => {
      const button = document.createElement('div');
      button.className = `planet-button planet-${data.id}`;
      button.textContent = data.label;
      button.dataset.section = data.section;
      button.title = data.title;

      container.appendChild(button);

      this.planets.push({
        element: button,
        ...data,
        currentAngle: data.orbit.angle,
        x: 0,
        y: 0
      });

      // Add click event
      button.addEventListener('click', () => this.handlePlanetClick(data.section));
    });

    this.centerX = centerX;
    this.centerY = centerY;
  }

  animatePlanets = () => {
    requestAnimationFrame(this.animatePlanets);

    this.planets.forEach(planet => {
      // Update orbital position
      planet.currentAngle += planet.orbit.speed;
      planet.x = this.centerX + Math.cos(planet.currentAngle) * planet.orbit.radius;
      planet.y = this.centerY + Math.sin(planet.currentAngle) * planet.orbit.radius;

      // Update position with smooth animation
      planet.element.style.left = `${planet.x - 40}px`;
      planet.element.style.top = `${planet.y - 40}px`;

      // Add parallax effect on hover (would be handled in CSS hover)
    });
  }

  handlePlanetClick(section) {
    // Trigger content panel with section data
    if (window.contentManager) {
      window.contentManager.showSection(section);
    }
  }

  updateInteractions(hoverText) {
    const interactionsDiv = document.getElementById('hud-interactions');
    if (interactionsDiv) {
      interactionsDiv.textContent = hoverText || 'Click on any planet to explore';
    }
  }
}

// Initialize planets when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.planetSystem = new PlanetSystem();
});
