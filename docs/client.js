document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-button");
  const navLinks = document.querySelectorAll(".nav-link");
  const header = document.querySelector("header");

  // --- Theme Toggle ---
  const setTheme = (theme) => {
    document.body.className = theme;
    localStorage.setItem("theme", theme);
    if (themeToggle) {
      themeToggle.textContent = `theme: ${theme}`;
    }
  };
  const toggleTheme = () => {
    const currentTheme = document.body.classList.contains("light")
      ? "dark"
      : "light";
    setTheme(currentTheme);
  };
  const storedTheme = localStorage.getItem("theme");
  setTheme(storedTheme || "dark");
  if (themeToggle) {
    themeToggle.addEventListener("click", toggleTheme);
  }

  // --- Particles ---
  if (typeof particlesJS !== "undefined") {
    particlesJS.load("particles-js", "particles.json");
  }

  // --- Typewriter ---
  const target = document.getElementById("typewriter");
  if (target) {
    const lines = [
      "I'm a self-taught JavaScript developer specializing in UI/UX.",
      "I'm also an astrophysics/aerospace engineering student at UC Berkeley.",
      "I build the tools I wish someone else had made.",
      "I'm driven by R&B, boba, and the stars.",
    ];
    let lineIndex = 0;
    const loopType = () => {
      const line = lines[lineIndex];
      let charIndex = 0;
      target.textContent = "";
      function typeChar() {
        if (charIndex < line.length) {
          target.textContent += line.charAt(charIndex);
          charIndex++;
          setTimeout(typeChar, 50);
        } else {
          setTimeout(deleteChar, 2000);
        }
      }
      function deleteChar() {
        if (charIndex > 0) {
          target.textContent = target.textContent.slice(0, -1);
          charIndex--;
          setTimeout(deleteChar, 30);
        } else {
          lineIndex = (lineIndex + 1) % lines.length;
          setTimeout(loopType, 500);
        }
      }
      typeChar();
    };
    loopType();
  }

  // --- Mobile Hamburger Menu ---
  const hamburger = document.querySelector(".hamburger-menu");
  const navMenu = document.querySelector(".nav");
  hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("mobile-active");
    header.classList.toggle("mobile-menu-active");
  });
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (navMenu.classList.contains("mobile-active")) {
        navMenu.classList.remove("mobile-active");
        header.classList.remove("mobile-menu-active");
      }
    });
  });

  // --- Show More/Less Projects ---
  const projectGrid = document.querySelector(".project-grid");
  const showMoreBtn = document.querySelector(".show-more-btn");
  const showLessBtn = document.querySelector(".show-less-btn");

  if (showMoreBtn) {
    showMoreBtn.addEventListener("click", () => {
      projectGrid.classList.add("show-all");
      showMoreBtn.style.display = "none";
      showLessBtn.style.display = "inline-block";
    });
  }
  if (showLessBtn) {
    showLessBtn.addEventListener("click", () => {
      projectGrid.classList.remove("show-all");
      showMoreBtn.style.display = "inline-block";
      showLessBtn.style.display = "none";
      document
        .getElementById("projects")
        .scrollIntoView({ behavior: "smooth" });
    });
  }

  // --- Smooth Scrolling for Desktop Nav ---
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll("section");
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -75% 0px", // Creates a trigger line near the top of the viewport
    threshold: 0,
  };
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => {
    sectionObserver.observe(section);
  });
});
