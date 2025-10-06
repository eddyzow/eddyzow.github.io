document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.querySelector(".theme-button");
  const navLinks = document.querySelectorAll(".nav-link");
  const header = document.querySelector("header");
  const scrollIndicator = document.querySelector(".scroll-down-indicator");

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

  // --- Header border & Scroll Indicator ---
  function handleScroll() {
    const scrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const scrollTop = window.scrollY;

    // Header border color
    if (scrollTop <= 10) {
      header.style.borderColor = "";
    } else {
      const scrollPercent = scrollTop / scrollableHeight;
      const hue = Math.floor(scrollPercent * 360);
      header.style.borderColor = `hsl(${hue}, 40%, 60%)`;
    }

    // Scroll down indicator visibility
    if (scrollIndicator) {
      if (scrollTop > 20) {
        scrollIndicator.classList.add("hidden");
      } else {
        scrollIndicator.classList.remove("hidden");
      }
    }
  }
  window.addEventListener("scroll", handleScroll);
  handleScroll(); // Initial check on load

  // --- Hamburger Menu ---
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

  // --- Active Nav Link on Scroll ---
  const sections = document.querySelectorAll("#home, section.page-section");

  // Create an array of objects containing each section's ID and its top position on the page.
  // This is more robust than hardcoding pixel values, as it adapts to content and screen size.
  const sectionPositions = Array.from(sections).map((s) => {
    return { id: s.id, top: s.offsetTop };
  });

  function updateActiveNavOnScroll() {
    // Get the current vertical scroll position, adding an offset for the header height.
    const scrollPosition = window.scrollY + 150;
    let currentActiveId = "";

    // Iterate through the sections from the bottom up.
    for (let i = sectionPositions.length - 1; i >= 0; i--) {
      // If the scroll position has passed the top of the current section,
      // that section is the active one.
      if (scrollPosition >= sectionPositions[i].top) {
        currentActiveId = sectionPositions[i].id;
        break; // Exit the loop once the active section is found.
      }
    }

    // Update the 'active' class on the corresponding navigation link.
    navLinks.forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${currentActiveId}`
      );
    });
  }

  // Add the event listener to the window.
  window.addEventListener("scroll", updateActiveNavOnScroll);

  // Call the function once on load to set the initial state.
  updateActiveNavOnScroll();

  // --- Carousel Logic ---
  const carousel = document.querySelector(".carousel");
  if (carousel) {
    const track = carousel.querySelector(".carousel-track");
    const container = carousel.querySelector(".carousel-container");
    const projectTemplate = document.getElementById("project-template");
    if (!projectTemplate || !track || !container) return;

    // --- Core Variables ---
    let slides = [];
    let slideCount = 0;
    let currentIndex = 0;
    let isAnimating = false;
    let isDragging = false;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    const animationSpeed = 400;
    let desktopPrev, desktopNext, mobilePrev, mobileNext;

    function setupCarousel() {
      const originalSlides = Array.from(
        projectTemplate.content.children
      ).reverse();
      if (originalSlides.length === 0) return;

      slideCount = originalSlides.length;
      const clonesStart = originalSlides.map((s) => s.cloneNode(true));
      const clonesEnd = originalSlides.map((s) => s.cloneNode(true));

      track.innerHTML = "";
      [...clonesEnd, ...originalSlides, ...clonesStart].forEach(
        (slideContent) => {
          const slide = document.createElement("div");
          slide.classList.add("carousel-slide");
          slide.appendChild(slideContent);
          track.appendChild(slide);
        }
      );

      slides = Array.from(track.children);
      currentIndex = slideCount - 1;
      createAndAppendButtons();
      setPositionByIndex(false);

      window.addEventListener("resize", () =>
        setTimeout(() => setPositionByIndex(false), 100)
      );
    }

    function createAndAppendButtons() {
      // Desktop buttons
      desktopPrev = document.createElement("button");
      desktopPrev.classList.add("carousel-button-desktop", "prev");
      desktopPrev.innerHTML = `<i class="fas fa-chevron-left"></i>`;
      desktopPrev.setAttribute("aria-label", "Previous project");
      desktopPrev.addEventListener("click", () => moveByOffset(-1));

      desktopNext = document.createElement("button");
      desktopNext.classList.add("carousel-button-desktop", "next");
      desktopNext.innerHTML = `<i class="fas fa-chevron-right"></i>`;
      desktopNext.setAttribute("aria-label", "Next project");
      desktopNext.addEventListener("click", () => moveByOffset(1));

      container.appendChild(desktopPrev);
      container.appendChild(desktopNext);

      // Mobile buttons
      const mobileNav = document.createElement("div");
      mobileNav.classList.add("carousel-nav-mobile");

      mobilePrev = document.createElement("button");
      mobilePrev.classList.add("carousel-button-mobile");
      mobilePrev.textContent = "Previous";
      mobilePrev.addEventListener("click", () => moveByOffset(-1));

      mobileNext = document.createElement("button");
      mobileNext.classList.add("carousel-button-mobile");
      mobileNext.textContent = "Next";
      mobileNext.addEventListener("click", () => moveByOffset(1));

      mobileNav.appendChild(mobilePrev);
      mobileNav.appendChild(mobileNext);
      carousel.appendChild(mobileNav);
    }

    function setPositionByIndex(withTransition = true) {
      const slideWidth = getSlideWidth();
      if (slideWidth === 0) return;

      currentTranslate =
        -currentIndex * slideWidth + (container.clientWidth - slideWidth) / 2;

      track.style.transition = withTransition
        ? `transform ${animationSpeed}ms cubic-bezier(0.22, 0.61, 0.36, 1)`
        : "none";
      track.style.transform = `translateX(${currentTranslate}px)`;

      slides.forEach((slide, index) => {
        slide.classList.toggle("is-selected", index === currentIndex);
      });
    }

    function setAnimationState(animating) {
      isAnimating = animating;
      if (desktopPrev && desktopNext && mobilePrev && mobileNext) {
        desktopPrev.disabled = animating;
        desktopNext.disabled = animating;
        mobilePrev.disabled = animating;
        mobileNext.disabled = animating;
      }
    }

    function moveByOffset(offset) {
      if (isAnimating) return;
      setAnimationState(true);

      currentIndex += offset;
      setPositionByIndex(true);

      setTimeout(() => {
        handleLooping();
        setAnimationState(false);
      }, animationSpeed);
    }

    function handleLooping() {
      if (currentIndex < slideCount) {
        currentIndex += slideCount;
        setPositionByIndex(false);
      } else if (currentIndex >= slideCount * 2) {
        currentIndex -= slideCount;
        setPositionByIndex(false);
      }
    }

    function getSlideWidth() {
      return slides.length > 0 ? slides[0].offsetWidth : 0;
    }

    function getPositionX(event) {
      return event.type.includes("mouse")
        ? event.pageX
        : event.touches[0].clientX;
    }

    function dragStart(event) {
      if (
        event.target.closest(
          ".carousel-button-desktop, .carousel-button-mobile"
        )
      ) {
        return;
      }
      if (isAnimating) return;
      isDragging = true;
      startPos = getPositionX(event);
      const transformMatrix = new DOMMatrix(
        window.getComputedStyle(track).transform
      );
      prevTranslate = transformMatrix.m41;
      track.style.transition = "none";
      carousel.classList.add("is-dragging");
    }

    function drag(event) {
      if (isDragging) {
        const currentPosition = getPositionX(event);
        currentTranslate = prevTranslate + (currentPosition - startPos);
        track.style.transform = `translateX(${currentTranslate}px)`;
      }
    }

    function dragEnd() {
      if (!isDragging) return;
      isDragging = false;
      setAnimationState(true);
      carousel.classList.remove("is-dragging");

      const movedBy = currentTranslate - prevTranslate;
      const slideWidth = getSlideWidth();
      if (slideWidth > 0 && Math.abs(movedBy) > 50) {
        currentIndex -= Math.round(movedBy / slideWidth);
      }

      setPositionByIndex(true);

      setTimeout(() => {
        handleLooping();
        setAnimationState(false);
      }, animationSpeed);
    }

    // --- Event Listeners ---
    container.addEventListener("mousedown", dragStart);
    container.addEventListener("touchstart", dragStart, { passive: true });
    window.addEventListener("mousemove", drag);
    window.addEventListener("touchmove", drag, { passive: true });
    window.addEventListener("mouseup", dragEnd);
    window.addEventListener("mouseleave", dragEnd);
    window.addEventListener("touchend", dragEnd);

    setupCarousel();
  }

  // --- Science Olympiad Filtering ---
  const sciolyTemplate = document.getElementById("scioly-template");
  const examList = document.getElementById("scioly-exam-list");
  const seasonFilter = document.getElementById("season-filter");
  const eventFilter = document.getElementById("event-filter");

  if (sciolyTemplate && examList && seasonFilter && eventFilter) {
    const exams = Array.from(sciolyTemplate.content.children).map((el) => ({
      season: el.dataset.season,
      event: el.dataset.event,
      title: el.dataset.title,
      linksHTML: el.innerHTML,
    }));

    const seasons = ["All Seasons", ...new Set(exams.map((e) => e.season))]
      .sort()
      .reverse();
    seasons.splice(seasons.indexOf("All Seasons"), 1);
    seasons.unshift("All Seasons");

    const events = ["All Events", ...new Set(exams.map((e) => e.event))].sort();
    events.splice(events.indexOf("All Events"), 1);
    events.unshift("All Events");

    seasons.forEach(
      (s) => (seasonFilter.innerHTML += `<option value="${s}">${s}</option>`)
    );
    events.forEach(
      (e) => (eventFilter.innerHTML += `<option value="${e}">${e}</option>`)
    );

    function filterExams() {
      const selectedSeason = seasonFilter.value;
      const selectedEvent = eventFilter.value;
      examList.innerHTML = "";

      if (selectedSeason === "All Seasons" && selectedEvent === "All Events") {
        examList.innerHTML =
          '<li class="scioly-exam-item">Select a season or event to view exams!</li>';
        return;
      }

      const filteredExams = exams.filter(
        (exam) =>
          (selectedSeason === "All Seasons" ||
            exam.season === selectedSeason) &&
          (selectedEvent === "All Events" || exam.event === selectedEvent)
      );

      if (filteredExams.length === 0) {
        examList.innerHTML =
          '<li class="scioly-exam-item">No exams match the selected criteria.</li>';
        return;
      }

      filteredExams.forEach((exam) => {
        const li = document.createElement("li");
        li.classList.add("scioly-exam-item");
        li.innerHTML = `<div class="exam-title">${exam.title}</div>${exam.linksHTML}`;
        examList.appendChild(li);
      });
    }

    seasonFilter.addEventListener("change", filterExams);
    eventFilter.addEventListener("change", filterExams);

    filterExams(); // Initial population
  }
});
