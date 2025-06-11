// Originally by eddyzow

// ==================================================================================
// GAME SETUP
// ==================================================================================
const Game = {
  // --------------- STATE ---------------
  state: {},

  // --------------- CONFIG ---------------
  config: {
    buildings: {
      cursor: { baseCost: 10, baseDps: 0.2, name: "Cursor" },
      deepfry: { baseCost: 200, baseDps: 5, name: "Deep Fryer" },
      restaurant: { baseCost: 1000, baseDps: 32, name: "Restaurant" },
      factory: { baseCost: 11000, baseDps: 400, name: "Factory" },
      shipment: { baseCost: 240000, baseDps: 8000, name: "Shipment" },
      time_machine: { baseCost: 3000000, baseDps: 66666, name: "Time Machine" },
      mc: { baseCost: 50000000, baseDps: 1000000, name: "Matter Creator" },
      portal: { baseCost: 950000000, baseDps: 15000000, name: "Donut Portal" }, // New!
      planet: {
        baseCost: 18000000000,
        baseDps: 250000000,
        name: "Donut Planet",
      },
      um: {
        baseCost: 330000000000,
        baseDps: 2700000000,
        name: "Universe Manipulation",
      },
      js: {
        baseCost: 5000000000000,
        baseDps: 140000000000,
        name: "JavaScript Console",
      },
    },
    saveInterval: 5000, // 5 seconds
    gameTick: 50, // 20 times per second
    ascendDonutRequirement: 1e12, // 1 Trillion
    costIncreaseRate: 1.15,
  },

  // --------------- DOM ELEMENTS ---------------
  els: {},

  // ==================================================================================
  // INITIALIZATION
  // ==================================================================================
  init() {
    this.cacheDOMElements();
    this.loadGame();
    this.bindEvents();
    this.runGameLoop();
    this.runSaveLoop();
    this.updateUI();
    this.showWelcomeModal();
    Howler.volume(0.2);
    this.setRandomWallpaper();
    console.log("Donut Simulator: Re-Fried Edition Initialized!");
  },

  cacheDOMElements() {
    this.els = {
      // Stats
      donutCount: document.getElementById("donut-count"),
      dpsCount: document.getElementById("dps-count"),
      bakeryName: document.getElementById("bakeryname"),
      // Donut
      mainDonut: document.getElementById("main-donut"),
      clickTextContainer: document.getElementById("click-text-container"),
      wallpaper: document.getElementById("wallpaper"),
      // Buttons
      pnButton: document.getElementById("pn-button"),
      graphicsButton: document.getElementById("graphics-button"),
      resetButton: document.getElementById("reset-button"),
      // Modals
      modalBackdrop: document.getElementById("modal-backdrop"),
      welcomeModal: document.getElementById("welcome-modal"),
      modalTitle: document.getElementById("modal-title"),
      modalText: document.getElementById("modal-text"),
      modalCloseButton: document.getElementById("modal-close-button"),
      ascendModal: document.getElementById("ascend-modal"),
      ascendModalReward: document.getElementById("ascend-modal-reward"),
      ascendConfirmButton: document.getElementById("ascend-confirm-button"),
      ascendCancelButton: document.getElementById("ascend-cancel-button"),
    };
    // Cache shop items
    for (const key in this.config.buildings) {
      this.els[`buy-${key}`] = document.getElementById(`buy-${key}`);
      this.els[`${key}-count`] = document.getElementById(`${key}-count`);
      this.els[`${key}-price`] = document.getElementById(`${key}-price`);
    }
    this.els["buy-portal"] = document.getElementById("buy-portal"); // New building
    this.els["portal-count"] = document.getElementById("portal-count");
    this.els["portal-price"] = document.getElementById("portal-price");

    // Cache Powerups
    this.els["buy-dpc"] = document.getElementById("buy-dpc");
    this.els["dpc-price"] = document.getElementById("dpc-price");
    this.els["buy-frenzy"] = document.getElementById("buy-frenzy");
    this.els["frenzy-price"] = document.getElementById("frenzy-price");
    this.els["buy-clickf"] = document.getElementById("buy-clickf");
    this.els["clickf-price"] = document.getElementById("clickf-price");
    this.els["buy-autoclick"] = document.getElementById("buy-autoclick");
    this.els["autoclick-price"] = document.getElementById("autoclick-price");

    // Ascension
    this.els["ascend-button"] = document.getElementById("ascend-button");
    this.els["ascend-info"] = document.getElementById("ascend-info");
    this.els["ascend-reward"] = document.getElementById("ascend-reward");
  },

  // ==================================================================================
  // SAVE & LOAD
  // ==================================================================================

  createDefaultSave() {
    const defaultState = {
      donuts: 0,
      dpc: 1,
      bakeryname: "",
      lastLoggedOn: Math.floor(Date.now() / 1000),
      graphicsOn: true,
      donutsEver: 0,
      prestige: 0,
      buildings: {},
      activeBoosts: {}, // { frenzy: endTime, clickf: endTime, ... }
    };
    for (const key in this.config.buildings) {
      defaultState.buildings[key] = 0;
    }
    return defaultState;
  },

  loadGame() {
    let savedData;
    try {
      savedData = JSON.parse(localStorage.getItem("donutSimulatorSave"));
    } catch (e) {
      console.warn("Could not parse save data. Starting fresh.");
    }

    this.state = Object.assign(this.createDefaultSave(), savedData);
    this.recalculateDPS();
  },

  saveGame() {
    this.state.lastLoggedOn = Math.floor(Date.now() / 1000);
    localStorage.setItem("donutSimulatorSave", JSON.stringify(this.state));
  },

  resetSave() {
    if (
      confirm(
        "Are you sure you want to completely reset your save? There is no going back!"
      )
    ) {
      this.state = this.createDefaultSave();
      this.saveGame();
      window.location.reload();
    }
  },

  // ==================================================================================
  // GAME LOOP & CALCULATIONS
  // ==================================================================================

  runGameLoop() {
    setInterval(() => {
      const dps = this.state.dps * this.getFrenzyMultiplier();
      this.earnDonuts(dps / (1000 / this.config.gameTick));
      this.updateBoosts();
      this.updateUI();
    }, this.config.gameTick);
  },

  runSaveLoop() {
    setInterval(() => {
      this.saveGame();
    }, this.config.saveInterval);
  },

  recalculateDPS() {
    let totalDps = 0;
    for (const key in this.state.buildings) {
      totalDps +=
        this.state.buildings[key] * this.config.buildings[key].baseDps;
    }
    const prestigeBonus = 1 + this.state.prestige * 0.01;
    this.state.dps = totalDps * prestigeBonus;
  },

  earnDonuts(amount) {
    this.state.donuts += amount;
    this.state.donutsEver += amount;
  },

  getClickValue() {
    const prestigeBonus = 1 + this.state.prestige * 0.01;
    let clickValue = this.state.dpc * prestigeBonus;
    clickValue *= this.getFrenzyMultiplier();
    clickValue *= this.getClickFrenzyMultiplier();
    return clickValue;
  },

  getBuildingCost(key) {
    return Math.ceil(
      this.config.buildings[key].baseCost *
        Math.pow(this.config.costIncreaseRate, this.state.buildings[key])
    );
  },

  // ==================================================================================
  // ACTIONS (Clicking, Buying, Selling)
  // ==================================================================================

  donutClicked(event) {
    const clickValue = this.getClickValue();
    this.earnDonuts(clickValue);
    this.playSound("click.mp3");

    // Create click text animation
    const text = document.createElement("div");
    text.className = "click-text";
    text.textContent = `+${this.formatNumber(clickValue)}`;
    const rect = this.els.mainDonut.getBoundingClientRect();
    const containerRect = this.els.clickTextContainer.getBoundingClientRect();

    const x = event.clientX - containerRect.left;
    const y = event.clientY - containerRect.top;

    text.style.left = `${x}px`;
    text.style.top = `${y}px`;

    this.els.clickTextContainer.appendChild(text);
    setTimeout(() => text.remove(), 1500);
  },

  buyBuilding(key) {
    const cost = this.getBuildingCost(key);
    if (this.state.donuts >= cost) {
      this.state.donuts -= cost;
      this.state.buildings[key]++;
      this.recalculateDPS();
      // this.playSound('buy.mp3'); // Sound removed
    }
  },

  sellBuilding(key) {
    if (this.state.buildings[key] > 0) {
      const costOfLastOne = Math.ceil(
        this.config.buildings[key].baseCost *
          Math.pow(this.config.costIncreaseRate, this.state.buildings[key] - 1)
      );
      const refund = costOfLastOne * 0.4; // Sell for 40% of what the last one cost
      this.state.donuts += refund;
      this.state.buildings[key]--;
      this.recalculateDPS();
      // this.playSound('sell.mp3'); // Sound removed
    }
  },

  // ==================================================================================
  // POWERUPS & BOOSTS
  // ==================================================================================

  buyDPC() {
    const cost = Math.floor((this.state.dpc * 40) ** 1.35);
    if (this.state.donuts >= cost) {
      this.state.donuts -= cost;
      this.state.dpc *= 2;
      // this.playSound('upgrade.mp3'); // Sound removed
    }
  },

  buyFrenzy() {
    const cost = Math.ceil((this.state.dps + 7 * this.state.dpc) * 200 + 2000);
    if (this.state.donuts >= cost && !this.state.activeBoosts.frenzy) {
      this.state.donuts -= cost;
      this.state.activeBoosts.frenzy = Date.now() + 77000;
      // this.playSound('upgrade.mp3'); // Sound removed
    }
  },

  buyClickFrenzy() {
    const cost = Math.ceil(this.state.dpc * 25000);
    if (this.state.donuts >= cost && !this.state.activeBoosts.clickf) {
      this.state.donuts -= cost;
      this.state.activeBoosts.clickf = Date.now() + 15000;
      // this.playSound('upgrade.mp3'); // Sound removed
    }
  },

  buyAutoclick() {
    const cost = this.state.dpc * 480;
    if (this.state.donuts >= cost && !this.state.activeBoosts.autoclick) {
      this.state.donuts -= cost;
      this.state.activeBoosts.autoclick = Date.now() + 60000;
      // this.playSound('upgrade.mp3'); // Sound removed
      // Start clicking
      const autoClicker = setInterval(() => {
        if (this.state.activeBoosts.autoclick) {
          this.earnDonuts(this.getClickValue());
        } else {
          clearInterval(autoClicker);
        }
      }, 100);
    }
  },

  updateBoosts() {
    const now = Date.now();
    for (const boost in this.state.activeBoosts) {
      if (now > this.state.activeBoosts[boost]) {
        delete this.state.activeBoosts[boost];
      }
    }
  },

  getFrenzyMultiplier() {
    return this.state.activeBoosts.frenzy ? 7 : 1;
  },
  getClickFrenzyMultiplier() {
    return this.state.activeBoosts.clickf ? 333 : 1;
  },

  // ==================================================================================
  // ASCENSION
  // ==================================================================================

  calculatePrestigeGain() {
    return Math.floor(Math.sqrt(this.state.donutsEver / 1e12)) * 5;
  },

  ascend() {
    const prestigeGain = this.calculatePrestigeGain();
    if (prestigeGain > 0) {
      const defaultSave = this.createDefaultSave();
      this.state.donuts = defaultSave.donuts;
      this.state.dpc = defaultSave.dpc;
      this.state.buildings = defaultSave.buildings;
      this.state.donutsEver = defaultSave.donutsEver;
      this.state.prestige += prestigeGain;
      this.recalculateDPS();
      this.saveGame();
      this.showModal(
        "welcome-modal",
        `ASCENDED!`,
        `You have gained ${prestigeGain} Prestige levels! Your production is now permanently boosted by ${this.state.prestige}%.`
      );
      // this.playSound('ascend.mp3'); // Sound removed
    }
  },

  // ==================================================================================
  // UI & VISUALS
  // ==================================================================================

  updateUI() {
    // Stats
    this.els.donutCount.textContent = `${this.formatNumber(
      this.state.donuts
    )} Donuts`;
    const prestigeBonus =
      this.state.prestige > 0 ? ` (+${this.state.prestige}%)` : "";
    this.els.dpsCount.textContent = `${this.formatNumber(
      this.state.dps * this.getFrenzyMultiplier()
    )} DPS${prestigeBonus}`;
    this.els.bakeryName.value = this.state.bakeryname;

    // Building Shop
    for (const key in this.config.buildings) {
      const cost = this.getBuildingCost(key);
      this.els[`${key}-count`].textContent = `x${this.state.buildings[key]}`;
      this.els[`${key}-price`].textContent = this.formatNumber(cost);
      this.els[`buy-${key}`].classList.toggle(
        "can-buy",
        this.state.donuts >= cost
      );
    }

    // Powerups
    const dpcCost = Math.floor((this.state.dpc * 40) ** 1.35);
    this.els["dpc-price"].textContent = this.formatNumber(dpcCost);
    this.els["buy-dpc"].classList.toggle(
      "can-buy",
      this.state.donuts >= dpcCost
    );

    this.updateBoostUI(
      "frenzy",
      77,
      "frenzy-price",
      Math.ceil((this.state.dps + 7 * this.state.dpc) * 200 + 2000)
    );
    this.updateBoostUI(
      "clickf",
      15,
      "clickf-price",
      Math.ceil(this.state.dpc * 25000)
    );
    this.updateBoostUI(
      "autoclick",
      60,
      "autoclick-price",
      this.state.dpc * 480
    );

    this.els.dpsCount.classList.toggle(
      "frenzy-active-text",
      !!this.state.activeBoosts.frenzy
    );

    // Ascension
    const prestigeGain = this.calculatePrestigeGain();
    const canAscend =
      this.state.donutsEver >= this.config.ascendDonutRequirement;
    this.els["ascend-button"].classList.toggle("can-buy", canAscend);
    this.els["ascend-reward"].textContent = `+${prestigeGain} Prestige`;
    this.els["ascend-info"].textContent = canAscend
      ? `(Ready!)`
      : `(Requires ${this.formatNumber(
          this.config.ascendDonutRequirement
        )} total donuts)`;
  },

  updateBoostUI(boostName, duration, elId, cost) {
    if (this.state.activeBoosts[boostName]) {
      const timeLeft = (this.state.activeBoosts[boostName] - Date.now()) / 1000;
      this.els[elId].textContent = `${timeLeft.toFixed(1)}s`;
      this.els[elId].classList.add("frenzy-active");
    } else {
      this.els[elId].textContent = this.formatNumber(cost);
      this.els[elId].classList.remove("frenzy-active");
      this.els[`buy-${boostName}`].classList.toggle(
        "can-buy",
        this.state.donuts >= cost
      );
    }
  },

  showWelcomeModal() {
    const timeDiff = Math.floor(Date.now() / 1000) - this.state.lastLoggedOn;
    if (timeDiff > 60) {
      // 1 minute
      const offlineDps = this.state.dps * 0.5; // 50% offline production
      const donutsGained = Math.min(
        offlineDps * timeDiff,
        this.state.dps * 3600 * 24
      ); // Capped at 24h
      this.earnDonuts(donutsGained);
      const title = this.state.donutsEver > 1 ? "WELCOME BACK!" : "WELCOME!";
      const text =
        timeDiff > 3600
          ? `While you were away for over an hour, your bakery earned ${this.formatNumber(
              donutsGained
            )} donuts!`
          : `You earned ${this.formatNumber(
              donutsGained
            )} donuts while you were away.`;
      this.showModal("welcome-modal", title, text);
    }
  },

  showModal(modalId, title, text) {
    const modal = document.getElementById(modalId);
    if (title) document.getElementById("modal-title").textContent = title;
    if (text) document.getElementById("modal-text").textContent = text;

    this.els.modalBackdrop.classList.add("visible");
    modal.classList.add("visible");
  },

  hideModals() {
    this.els.modalBackdrop.classList.remove("visible");
    document
      .querySelectorAll(".modal.visible")
      .forEach((m) => m.classList.remove("visible"));
  },

  toggleGraphics() {
    this.state.graphicsOn = !this.state.graphicsOn;
    const pjs = document.getElementById("particles-js");
    if (this.state.graphicsOn) {
      this.els.graphicsButton.textContent = "GRAPHICS: ON";
      pjs.style.display = "block";
    } else {
      this.els.graphicsButton.textContent = "GRAPHICS: OFF";
      pjs.style.display = "none";
    }
  },

  // ==================================================================================
  // UTILITIES (Sound, Formatting, etc.)
  // ==================================================================================

  playSound(soundFile) {
    new Howl({ src: [soundFile], volume: 0.5 }).play();
  },

  setRandomWallpaper() {
    const wallpaperId = Math.floor(Math.random() * 8) + 1;
    this.els.wallpaper.style.backgroundImage = `url('../champion/assets/art/wallpapers/${wallpaperId}.jpg')`;
  },

  formatNumber(n) {
    if (n < 1e6)
      return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
    const suffixes = [
      "M",
      "B",
      "T",
      "q",
      "Q",
      "s",
      "S",
      "O",
      "N",
      "D",
      "A",
      "B",
      "C",
      "E",
      "F",
      "G",
      "H",
      "I",
      "J",
      "K",
      "L",
      "P",
      "R",
      "U",
      "V",
      "W",
      "X",
      "Y",
      "Z",
      "AA",
      "AB",
      "AC",
      "AD",
      "AE",
      "AF",
      "AG",
      "AH",
      "AI",
      "AJ",
      "AK",
      "AL",
      "AM",
      "AN",
      "AO",
      "AP",
      "AQ",
      "AR",
      "AS",
      "AT",
      "AU",
      "AV",
      "AW",
      "AX",
      "AY",
      "AZ",
      "I bet nobody will get this far",
    ];
    const i = Math.floor(Math.log10(n) / 3) - 2;
    const num = n / 10 ** ((i + 2) * 3);
    return `${num.toFixed(3)} ${suffixes[i]}`;
  },

  // ==================================================================================
  // EVENT BINDING
  // ==================================================================================

  bindEvents() {
    this.els.mainDonut.addEventListener("click", (e) => this.donutClicked(e));
    this.els.bakeryName.addEventListener("input", (e) => {
      this.state.bakeryname = e.target.value;
    });
    this.els.resetButton.addEventListener("click", () => this.resetSave()); // <<< SYNTAX CORRECTED HERE
    this.els.graphicsButton.addEventListener("click", () =>
      this.toggleGraphics()
    );
    this.els.modalCloseButton.addEventListener("click", () =>
      this.hideModals()
    );
    this.els.modalBackdrop.addEventListener("click", () => this.hideModals());

    // Bind building purchases
    for (const key in this.config.buildings) {
      this.els[`buy-${key}`].addEventListener("click", () =>
        this.buyBuilding(key)
      );
      this.els[`buy-${key}`].addEventListener("contextmenu", (e) => {
        e.preventDefault();
        this.sellBuilding(key);
      });
    }

    // Bind powerup purchases
    this.els["buy-dpc"].addEventListener("click", () => this.buyDPC());
    this.els["buy-frenzy"].addEventListener("click", () => this.buyFrenzy());
    this.els["buy-clickf"].addEventListener("click", () =>
      this.buyClickFrenzy()
    );
    this.els["buy-autoclick"].addEventListener("click", () =>
      this.buyAutoclick()
    );

    // Bind Ascension
    this.els["ascend-button"].addEventListener("click", () => {
      if (this.state.donutsEver >= this.config.ascendDonutRequirement) {
        this.els.ascendModalReward.textContent = `+${this.calculatePrestigeGain()}`;
        this.showModal("ascend-modal");
      }
    });
    this.els.ascendConfirmButton.addEventListener("click", () => {
      this.hideModals();
      this.ascend();
    });
    this.els.ascendCancelButton.addEventListener("click", () =>
      this.hideModals()
    );

    // Patch notes (simple modal)
    this.els.pnButton.addEventListener("click", () => {
      this.showModal(
        "welcome-modal",
        "Patch Notes (v2.0)",
        "I threw this into AI to see what it could do to the game. Added Ascension, new UI, a new building, balancing, and tons of visual polish. Enjoy lol"
      );
    });
  },
};

// ==================================================================================
// LET'S BAKE!
// ==================================================================================
window.onload = () => {
  // We need to wait for particles.js to be loaded if it exists
  if (typeof particlesJS !== "undefined") {
    particlesJS.load("particles-js", "particles1.json", () => {
      console.log("particles.js loaded");
    });
  }
  Game.init();
};
