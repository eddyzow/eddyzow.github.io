// Initialize particles.js
particlesJS.load("particles-js", "particles.json");

// Typewriter effect for terminal
const commands = [
  "whoami",
  "ls -la ~/projects/",
  "cd ~/observatory/",
  "python telescope_controller.py",
  "git status",
  "npm run dev",
  "echo 'hello world'"
];

let currentCommand = 0;
let currentChar = 0;
let isDeleting = false;

function typeWriter() {
  const typewriterElement = document.getElementById("typewriter");
  if (!typewriterElement) return;
  
  const current = commands[currentCommand];
  
  if (isDeleting) {
    typewriterElement.textContent = current.substring(0, currentChar - 1);
    currentChar--;
  } else {
    typewriterElement.textContent = current.substring(0, currentChar + 1);
    currentChar++;
  }
  
  if (!isDeleting && currentChar === current.length) {
    setTimeout(() => isDeleting = true, 1500);
  } else if (isDeleting && currentChar === 0) {
    isDeleting = false;
    currentCommand = (currentCommand + 1) % commands.length;
  }
  
  const speed = isDeleting ? 50 : 100;
  setTimeout(typeWriter, speed);
}

// Navigation system
const sections = ["home", "projects", "builds", "scioly", "contact"];

function showSection(sectionId) {
  sections.forEach(id => {
    const section = document.getElementById(id);
    if (section) {
      section.style.display = id === sectionId ? 
        (id === "home" ? "flex" : (id === "contact" ? "flex" : "block")) : "none";
    }
  });
}

// Handle navigation clicks
document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    showSection(targetId);
    window.location.hash = targetId;
  });
});

// Handle initial page load and hash changes
window.addEventListener('hashchange', () => {
  const hash = window.location.hash.substring(1);
  if (sections.includes(hash)) {
    showSection(hash);
  } else {
    showSection('home');
  }
});

// Initialize page
window.addEventListener('DOMContentLoaded', () => {
  const hash = window.location.hash.substring(1);
  if (sections.includes(hash)) {
    showSection(hash);
  } else {
    showSection('home');
  }
  
  // Start typewriter effect
  setTimeout(typeWriter, 1000);
});