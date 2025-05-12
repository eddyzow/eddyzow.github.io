document.addEventListener("DOMContentLoaded", () => {
  const text = "I build games, tools, and hackathons.";
  const target = document.getElementById("typewriter");
  let i = 0;

  const lines = [
    "👋 I'm Eddy Zhao, from Boston, MA, USA.",
    "I'm a self-taught JavaScript developer specializing in UI/UX.",
    "I'm also an astrophysics/aerospace engineering student at UC Berkeley.",
    "I build the tools I wish someone else had made.",
    "I'm driven by R&B, boba, and the stars.",
    "I don't sleep enough, but when I do, I dream in dark mode.",
  ];
  let lineIndex = 0;

  function loopType() {
    const line = lines[lineIndex];
    let charIndex = 0;
    target.textContent = "";

    function typeChar() {
      if (charIndex < line.length) {
        target.textContent += line.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, 60);
      } else {
        setTimeout(deleteChar, 1500);
      }
    }

    function deleteChar() {
      if (charIndex > 0) {
        target.textContent = target.textContent.slice(0, -1);
        charIndex--;
        setTimeout(deleteChar, 32);
      } else {
        lineIndex = (lineIndex + 1) % lines.length;
        setTimeout(loopType, 300);
      }
    }

    typeChar();
  }

  setTimeout(() => {
    loopType();
  }, 1000);

  // Theme toggle
  const themeToggle = document.createElement("button");
  themeToggle.textContent = "🌓";
  themeToggle.className = "theme-button";
  document.body.appendChild(themeToggle);

  const navLinks = document.querySelectorAll(".nav a");

  const setTheme = (theme) => {
    document.body.classList.remove("light", "dark");
    document.body.classList.add(theme);
    localStorage.setItem("theme", theme);

    // Adjust button and link colors based on theme
    const light = theme === "light";
    const color = light ? "#333" : "#fff";
    themeToggle.style.borderColor = color;
    themeToggle.style.color = color;
    navLinks.forEach((link) => {
      link.style.color = color;
    });
  };

  const toggleTheme = () => {
    const current = document.body.classList.contains("light")
      ? "dark"
      : "light";
    setTheme(current);
  };

  const stored = localStorage.getItem("theme");
  setTheme(stored || "dark");

  themeToggle.addEventListener("click", toggleTheme);

  // Load particles
  particlesJS.load("particles-js", "particles.json");

  // Page section transitions
  const links = document.querySelectorAll("a.fade-link");
  const sections = ["home", "projects", "scioly", "contact"];

  const setActiveLink = (id) => {
    links.forEach((link) => {
      const target = link.getAttribute("href").slice(1);
      if (target === id) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };

  links.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const id = link.getAttribute("href").slice(1);

      document.body.classList.remove("fade-in");
      document.body.classList.add("fade-out");

      setTimeout(() => {
        sections.forEach((sec) => {
          const el = document.getElementById(sec);
          el.style.display = sec === id ? "flex" : "none";
        });

        document.body.classList.remove("fade-out");
        document.body.classList.add("fade-in");

        window.location.hash = id;
        setActiveLink(id);
      }, 400);
    });
  });

  const visible = location.hash?.substring(1) || "home";
  sections.forEach((sec) => {
    const el = document.getElementById(sec);
    el.style.display = sec === visible ? "flex" : "none";
  });
  setActiveLink(visible);
});
