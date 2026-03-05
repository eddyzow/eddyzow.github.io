// CONTENT MANAGEMENT SYSTEM
class ContentManager {
  constructor() {
    this.panel = document.getElementById('content-panel');
    this.wrapper = document.getElementById('content-wrapper');
    this.closeBtn = document.querySelector('.close-btn');
    this.currentSection = null;

    this.closeBtn.addEventListener('click', () => this.closePanel());
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closePanel();
    });

    this.initializeContent();
  }

  initializeContent() {
    // Store content data
    this.content = {
      home: {
        title: 'Welcome to My Space',
        content: `
          <p>Welcome to my interactive space portfolio! I'm <strong>Eddy Zhao</strong>, an undergraduate at UC Berkeley studying Astrophysics and Computer Science.</p>
          
          <p>Navigate through the cosmic spheres to explore different sections of my digital universe. Each planet holds unique information about my work, projects, and passions.</p>
          
          <h3>Quick Links</h3>
          <p>
            <a href="https://github.com/eddyzow" target="_blank">GitHub</a> •
            <a href="https://linkedin.com/in/eddyzow" target="_blank">LinkedIn</a> •
            <a href="https://youtube.com/eddyzow" target="_blank">YouTube</a>
          </p>
        `
      },
      about: {
        title: 'About Me',
        content: `
          <p>I'm an undergraduate at UC Berkeley studying Astrophysics and Computer Science, combining my passion for the cosmos with cutting-edge technology.</p>
          
          <h3>Research & Leadership</h3>
          <p>I serve as a research assistant at the <a href="https://www.ssl.berkeley.edu/" target="_blank">Space Sciences Lab</a> and lead <a href="https://eggster.org" target="_blank">Eggster</a> and <a href="https://sciolyatberkeley.org" target="_blank">Science Olympiad at Berkeley</a>.</p>
          
          <h3>Background</h3>
          <p>I began my journey in STEM through Science Olympiad in high school, competing for Acton-Boxborough and attending Nationals in 2024. Now, I contribute to the field as a member of the Astronomy A-Team, administering exams for major invitationals.</p>
          
          <h3>Skills</h3>
          <p>Full-stack development, 3D graphics, particle systems, interactive web applications, scientific computing, and more.</p>
        `
      },
      projects: {
        title: 'Featured Projects',
        content: `
          <h3>Rostrum</h3>
          <div class="project-item">
            <div class="project-title">Next-Gen Hackathon Platform</div>
            <p>A comprehensive peer shipping/voting/judging platform with event creation, project management, and ELO-based ratings. 70+ projects, 120+ attendees, 850+ votes.</p>
            <div class="project-tags">
              <span class="tag">React</span>
              <span class="tag">MongoDB</span>
              <span class="tag">REST APIs</span>
            </div>
          </div>

          <h3>Shatter The Ice</h3>
          <div class="project-item">
            <div class="project-title">AI-Powered Roommate Finder (Cal Hacks 12.0)</div>
            <p>An innovative matching platform built with AI using Claude API and Three.js visualization.</p>
            <div class="project-tags">
              <span class="tag">React</span>
              <span class="tag">Three.js</span>
              <span class="tag">Claude API</span>
            </div>
          </div>

          <h3>Wheel of Fortune</h3>
          <div class="project-item">
            <div class="project-title">Game Show Recreation</div>
            <p>Open-source recreation of the classic TV game show with multiple game modes.</p>
            <div class="project-tags">
              <span class="tag">HTML</span>
              <span class="tag">JavaScript</span>
              <span class="tag">Canvas</span>
            </div>
          </div>

          <h3>Interactive Games</h3>
          <div class="project-item">
            <div class="project-title">Keyboard Hero, JSBeats, Champion Blitz</div>
            <p>Various interactive games and educational platforms built with WebSockets and real-time multiplayer capabilities.</p>
            <div class="project-tags">
              <span class="tag">WebSockets</span>
              <span class="tag">Multiplayer</span>
              <span class="tag">Gaming</span>
            </div>
          </div>

          <p><a href="https://eddyzow.net" target="_blank">View all projects on my main site →</a></p>
        `
      },
      scioly: {
        title: 'Science Olympiad',
        content: `
          <h3>My Journey</h3>
          <p>Science Olympiad shaped my interest in STEM and astrophysics. In high school, I competed and captained for Acton-Boxborough, attending Nationals in 2024.</p>
          
          <h3>Astronomy A-Team</h3>
          <p>Since 2025, I've been a member of the Astronomy A-Team, the committee that administers the Astronomy National Division C event and writes exams for prestigious invitationals including MIT and Golden Gate.</p>
          
          <h3>Exams & Resources</h3>
          <p>As part of my contribution, I help create comprehensive exams and solutions. My focus is on making science education engaging and rigorous for high school students nationwide.</p>
          
          <h3>Philosophy</h3>
          <p>I believe Science Olympiad is more than a competition—it's a community of passionate learners dedicated to discovering the universe. By serving on the A-Team, I hope to inspire the next generation of astronomers and scientists.</p>
          
          <p><a href="https://eddyzow.net#scioly" target="_blank">Browse exams on my main site →</a></p>
        `
      },
      contact: {
        title: 'Get In Touch',
        content: `
          <h3>Let's Connect</h3>
          <p>I'm always interested in collaborating on exciting projects, discussing astrophysics, or talking about technology.</p>
          
          <h3>Email</h3>
          <p>eddy@eddyzow.net</p>
          
          <h3>Social Media</h3>
          <p>
            <a href="https://github.com/eddyzow" target="_blank">GitHub</a><br>
            <a href="https://linkedin.com/in/eddyzow" target="_blank">LinkedIn</a><br>
            <a href="https://youtube.com/eddyzow" target="_blank">YouTube</a><br>
            <a href="https://www.last.fm/user/eddyzow" target="_blank">Last.fm</a>
          </p>
          
          <h3>Location</h3>
          <p>Near Boston, MA or the San Francisco Bay Area</p>
          
          <h3>Quick Facts</h3>
          <ul style="margin-left: 20px; color: #ccc;">
            <li>UC Berkeley - Astrophysics & Computer Science</li>
            <li>Space Sciences Lab Research Assistant</li>
            <li>Full-stack Developer</li>
            <li>Science Olympiad Enthusiast</li>
            <li>Space & Music Lover</li>
          </ul>
        `
      }
    };
  }

  showSection(section) {
    this.currentSection = section;
    const data = this.content[section];
    
    if (!data) return;

    this.wrapper.innerHTML = `
      <h2>${data.title}</h2>
      <div class="section-content">${data.content}</div>
    `;

    // Add animation
    this.panel.classList.add('active');
    
    // Update HUD
    this.updateHUD(section);
  }

  closePanel() {
    this.panel.classList.remove('active');
    this.currentSection = null;
    document.getElementById('hud-subtitle').textContent = 'Navigate to explore';
  }

  updateHUD(section) {
    const titles = {
      home: 'Welcome Aboard',
      about: 'Personal Data',
      projects: 'Project Database',
      scioly: 'Science Division',
      contact: 'Communication Hub'
    };

    document.getElementById('hud-subtitle').textContent = titles[section] || 'Exploring...';
  }
}

// Initialize content manager
document.addEventListener('DOMContentLoaded', () => {
  window.contentManager = new ContentManager();
});
