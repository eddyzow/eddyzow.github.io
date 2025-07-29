document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-button");
  const navLinks = document.querySelectorAll(".nav-link");
  const header = document.querySelector("header"); // --- Theme Toggle ---

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

  window.addEventListener("scroll", () => {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;

    if (scrollTop <= 10) {
      header.style.borderColor = "";
    } else {
      const scrollPercent = scrollTop / scrollableHeight;
      const hue = Math.floor(scrollPercent * 360); // 360 degrees in the color wheel

      header.style.borderColor = `hsl(${hue}, 40%, 60%)`;
    }
  });

  if (typeof particlesJS !== "undefined") {
    particlesJS.load("particles-js", "particles.json");
  }

  const target = document.getElementById("typewriter");
  if (target) {
    const lines = [
      "I'm a self-taught developer studying Astrophysics + CS at UC Berkeley.",
      "I specialize in JavaScript and UI/UX design.",
      "I build the tools I wish someone else had made.",
      "I'm driven by R&B, boba, and the stars.",
      "See something interesting? Feel free to explore my site.",
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

  const sections = document.querySelectorAll("section");
  const observerOptions = {
    root: null,
    rootMargin: "-20% 0px -75% 0px",
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

  const devToolsOverlay = document.getElementById("dev-tools-overlay");

  (() => {
    "use strict";
    // FIX: Exit this function if the screen is likely a mobile device.
    if (window.matchMedia("(max-width: 768px)").matches) {
      return;
    }

    const devtools = {
      isOpen: false,
      orientation: undefined,
    };
    const threshold = 160;
    const emitEvent = (isOpen, orientation) => {
      window.dispatchEvent(
        new CustomEvent("devtoolschange", {
          detail: {
            isOpen,
            orientation,
          },
        })
      );
    };
    setInterval(() => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold;
      const heightThreshold =
        window.outerHeight - window.innerHeight > threshold;
      const orientation = widthThreshold ? "vertical" : "horizontal";
      if (
        !(heightThreshold && widthThreshold) &&
        ((window.Firebug &&
          window.Firebug.chrome &&
          window.Firebug.chrome.isInitialized) ||
          widthThreshold ||
          heightThreshold)
      ) {
        if (!devtools.isOpen || devtools.orientation !== orientation) {
          emitEvent(true, orientation);
        }
        devtools.isOpen = true;
        devtools.orientation = orientation;
      } else {
        if (devtools.isOpen) {
          emitEvent(false, undefined);
        }
        devtools.isOpen = false;
        devtools.orientation = undefined;
      }
    }, 500);
    if (typeof module !== "undefined" && module.exports) {
      module.exports = devtools;
    } else {
      window.devtools = devtools;
    }
  })();

  window.addEventListener("devtoolschange", (event) => {
    if (event.detail.isOpen) {
      devToolsOverlay.classList.add("visible");
    } else {
      devToolsOverlay.classList.remove("visible");
    }
  });
});
