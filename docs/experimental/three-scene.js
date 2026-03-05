// THREE.JS 3D SPACE SCENE
class SpaceScene {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10000);
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    
    this.init();
    this.createGalaxies();
    this.createStars();
    this.addLights();
    this.animate();
    this.setupResize();
  }

  init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 1);
    document.getElementById('space-canvas').appendChild(this.renderer.domElement);
    
    this.camera.position.z = 50;
    this.camera.position.x = 0;
    this.camera.position.y = 0;
  }

  createGalaxies() {
    // Create multiple galaxy-like structures
    const galaxies = [
      { x: 20, y: 15, scale: 1.2, rotation: 0, color: 0x00ccff },
      { x: -25, y: -20, scale: 0.8, rotation: Math.PI / 3, color: 0xff00ff },
      { x: 5, y: -30, scale: 1.0, rotation: Math.PI / 2, color: 0xff8800 },
      { x: -30, y: 10, scale: 0.9, rotation: Math.PI / 4, color: 0x00ff88 },
      { x: 25, y: -10, scale: 0.7, rotation: Math.PI, color: 0xff0088 }
    ];

    galaxies.forEach(galaxy => {
      this.createSpiral(galaxy.x, galaxy.y, galaxy.scale, galaxy.rotation, galaxy.color);
    });
  }

  createSpiral(centerX, centerY, scale, rotation, color) {
    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const colors = [];

    const particleCount = 3000;
    const spiralTurns = 5;

    for (let i = 0; i < particleCount; i++) {
      const progress = i / particleCount;
      const angle = progress * Math.PI * 2 * spiralTurns + rotation;
      const distance = progress * 15 * scale;
      
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      const z = (Math.random() - 0.5) * 10 * scale;

      positions.push(x, y, z);

      // Color variation
      const colorVariation = new THREE.Color(color);
      colorVariation.multiplyScalars(0.5 + Math.random() * 0.5);
      colors.push(colorVariation.r, colorVariation.g, colorVariation.b);
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });

    const points = new THREE.Points(geometry, material);
    this.scene.add(points);

    // Rotate the spiral
    points.rotation.z = rotation;
    
    // Store for animation
    if (!this.spirals) this.spirals = [];
    this.spirals.push({
      mesh: points,
      rotationSpeed: (Math.random() - 0.5) * 0.001,
      centerX: centerX,
      centerY: centerY
    });
  }

  createStars() {
    // Create background stars
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];

    for (let i = 0; i < 10000; i++) {
      const x = (Math.random() - 0.5) * 200;
      const y = (Math.random() - 0.5) * 200;
      const z = (Math.random() - 0.5) * 200;
      starPositions.push(x, y, z);
    }

    starGeometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(starPositions), 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.05,
      opacity: 0.8,
      transparent: true,
      sizeAttenuation: true
    });

    const stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(stars);

    this.stars = stars;
  }

  addLights() {
    // Add ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0x00ccff, 0.3);
    this.scene.add(ambientLight);

    // Add point lights for dramatic effect
    const light1 = new THREE.PointLight(0x00ff88, 0.5);
    light1.position.set(30, 30, 30);
    this.scene.add(light1);

    const light2 = new THREE.PointLight(0xff00ff, 0.3);
    light2.position.set(-30, -30, 20);
    this.scene.add(light2);
  }

  animate = () => {
    requestAnimationFrame(this.animate);

    // Rotate spirals
    if (this.spirals) {
      this.spirals.forEach(spiral => {
        spiral.mesh.rotation.z += spiral.rotationSpeed;
      });
    }

    // Slowly rotate stars
    if (this.stars) {
      this.stars.rotation.z += 0.00005;
    }

    // Gentle camera movement
    this.camera.position.x = Math.sin(Date.now() * 0.00001) * 5;
    this.camera.position.y = Math.cos(Date.now() * 0.000008) * 5;
    this.camera.lookAt(0, 0, 0);

    this.renderer.render(this.scene, this.camera);
  }

  setupResize() {
    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
    });
  }
}

// Initialize the scene when the page loads
let spaceScene;
document.addEventListener('DOMContentLoaded', () => {
  spaceScene = new SpaceScene();
});
