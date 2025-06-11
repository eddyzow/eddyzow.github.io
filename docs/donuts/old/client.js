// things to do

saveData = localStorage.getItem("saveData");
let particleStage = 0;
var frenzy = false;
var autoclick = false;
var clickf = false;
Howler.volume(0.2);
console.log(saveData);
document.getElementById("wallpaper").style["background-image"] =
  'url("../../champion/assets/art/wallpapers/' +
  (Math.floor(Math.random() * 8) + 1).toString() +
  '.jpg")';
if (saveData == undefined) {
  saveData = {
    donuts: 0,
    dps: 0,
    dpc: 1,
    items: {
      cursor: 0,
      deepfry: 0,
      restaurant: 0,
      factory: 0,
      time_machine: 0,
      shipment: 0,
      mc: 0,
      planet: 0,
      um: 0,
      js: 0,
    },
    bakeryname: "",
    lastLoggedOn: Math.floor(new Date().getTime() / 1000),
  };
  localStorage.setItem("saveData", JSON.stringify(saveData));
}
try {
  saveData = JSON.parse(saveData);
} catch {
  saveData = {
    donuts: 0,
    dps: 0,
    dpc: 1,
    items: {
      cursor: 0,
      deepfry: 0,
      restaurant: 0,
      factory: 0,
      time_machine: 0,
      shipment: 0,
      mc: 0,
      planet: 0,
      um: 0,
      js: 0,
    },
    bakeryname: "",
    lastLoggedOn: Math.floor(new Date().getTime() / 1000),
  };
  localStorage.setItem("saveData", JSON.stringify(saveData));
}

if (saveData.items.planet == undefined) {
  saveData.items.planet = 0;
}
if (saveData.items.um == undefined) {
  saveData.items.um = 0;
}
if (saveData.items.js == undefined) {
  saveData.items.js = 0;
}
if (saveData.items.factory == undefined) {
  saveData.items.factory = 0;
}
if (saveData.items.shipment == undefined) {
  saveData.items.shipment = 0;
}
if (saveData.items.time_machine == undefined) {
  saveData.items.time_machine = 0;
}
if (saveData.items.mc == undefined) {
  saveData.items.mc = 0;
}

if (localStorage.getItem("detail") == "false") {
  document.getElementById("detail").innerHTML = "GRAPHICS: OFF";
  localStorage.setItem("detail", "false");
} else {
  document.getElementById("detail").innerHTML = "GRAPHICS: ON";
  localStorage.setItem("detail", "true");
  particleStage = 5;
}

document.getElementById("reset-save").onclick = function () {
  resetSave();
};

document.getElementById("pn").onclick = function () {
  document.getElementById("welcomeback").innerHTML = "Patch Notes (Beta v0.3)";
  document.getElementById("loggedOutModal").style.visibility = "visible";
  document.getElementById("loggedOutModal").style.opacity = "100%";
  document.getElementById("loggedOutPopup").style.visibility = "visible";
  document.getElementById("loggedOutPopup").style.opacity = "100%";
  document.getElementById("amountEarned").innerHTML =
    "-Decreased price of doubling DPC towards the start, but increased price further into the game<br><br>-Made large numbers smaller (1000000 contracts to 1.0M)";
  document.getElementById("loggedOutPopup").style.transform =
    "translate(-50%, -50%) scale(1, 1)";
};

document.getElementById("detail").onclick = function () {
  if (localStorage.getItem("detail") != "false") {
    localStorage.setItem("detail", "false");
    document.getElementById("detail").innerHTML = "GRAPHICS: OFF";
    document.getElementById("particles-js").remove();
  } else {
    let pjs = document.createElement("div");
    pjs.setAttribute("id", "particles-js");
    document.body.appendChild(pjs);
    localStorage.setItem("detail", "true");
    document.getElementById("detail").innerHTML = "GRAPHICS: ON";
    particleStage = 5;
  }
};

const formatCash = (n) => {
  if (n < 1e6) return n;
  if (n >= 1e6 && n < 1e9) return (n / 1e6).toFixed(3) + "M";
  if (n >= 1e9 && n < 1e12) return (n / 1e9).toFixed(3) + "B";
  if (n >= 1e12 && n < 1e15) return (n / 1e12).toFixed(3) + "T";
  if (n >= 1e15 && n < 1e18) return (n / 1e15).toFixed(3) + "q";
  if (n >= 1e18 && n < 1e21) return (n / 1e18).toFixed(3) + "Q";
  if (n >= 1e21 && n < 1e24) return (n / 1e21).toFixed(3) + "s";
  if (n >= 1e24 && n < 1e27) return (n / 1e24).toFixed(3) + "S";
  if (n >= 1e27 && n < 1e30) return (n / 1e27).toFixed(3) + "O";
  if (n >= 1e30 && n < 1e33) return (n / 1e30).toFixed(3) + "N";
  if (n >= 1e33 && n < 1e36) return (n / 1e33).toFixed(3) + "D";
  if (n >= 1e36) return (n / 1e36).toFixed(3) + "D";
};

function resetSave() {
  if (
    confirm("Are you sure you'd like to restart your Donut Simulator save?") &&
    confirm(
      "THIS IS THE LAST WARNING!! Are you SURE you want to RESET EVERYTHING?"
    )
  ) {
    saveData = {
      donuts: 0,
      dps: 0,
      dpc: 1,
      items: {
        cursor: 0,
        deepfry: 0,
        restaurant: 0,
        factory: 0,
        time_machine: 0,
        shipment: 0,
        mc: 0,
        planet: 0,
        um: 0,
        js: 0,
      },
      bakeryname: "",
      lastLoggedOn: Math.floor(new Date().getTime() / 1000),
    };
    localStorage.setItem("saveData", JSON.stringify(saveData));
    window.location.reload();
  }
}

// dpc (donuts per click add)
// frenzy time (depends on dpc)
function saveDonuts() {
  localStorage.setItem("saveData", JSON.stringify(saveData));
  if (clickf == true) {
    document.getElementById("donut-count").innerHTML =
      formatCash(Math.floor(saveData.donuts)) +
      " Donuts (" +
      formatCash(saveData.dps) +
      " DPS, " +
      formatCash(saveData.dpc) +
      "x333" +
      " DPC)";
  } else if (frenzy == true) {
    document.getElementById("clickf-price").innerHTML = formatCash(
      Math.ceil(saveData.dpc * 30000)
    );
    document.getElementById("donut-count").innerHTML =
      formatCash(Math.floor(saveData.donuts)) +
      " Donuts (" +
      formatCash(saveData.dps) +
      "x7" +
      " DPS, " +
      formatCash(saveData.dpc) +
      "x7" +
      " DPC)";
  } else {
    document.getElementById("clickf-price").innerHTML = formatCash(
      Math.ceil(saveData.dpc * 30000)
    );
    document.getElementById("minif-price").innerHTML = formatCash(
      Math.ceil((saveData.dps / 1.2 + 7 * saveData.dpc) * 30 + 200)
    );
    document.getElementById("frenzy-price").innerHTML = formatCash(
      Math.ceil((saveData.dps / 1.2 + 7 * saveData.dpc) * 300 + 2000)
    );
    document.getElementById("donut-count").innerHTML =
      formatCash(Math.floor(saveData.donuts)) +
      " Donuts (" +
      formatCash(saveData.dps) +
      " DPS, " +
      formatCash(saveData.dpc) +
      " DPC)";
  }
  document.getElementById("cursor-count").innerHTML =
    "Cursor (x" + saveData.items.cursor + ")";
  document.getElementById("oven-count").innerHTML =
    "Deep Fryer (x" + saveData.items.deepfry + ")";
  document.getElementById("restaurant-count").innerHTML =
    "Restaurant (x" + saveData.items.restaurant + ")";
  document.getElementById("factory-count").innerHTML =
    "Factory (x" + saveData.items.factory + ")";
  document.getElementById("tm-count").innerHTML =
    "Time Machine (x" + saveData.items.time_machine + ")";
  document.getElementById("shipment-count").innerHTML =
    "Shipment (x" + saveData.items.shipment + ")";
  document.getElementById("planet-count").innerHTML =
    "Donut Planet (x" + saveData.items.planet + ")";
  document.getElementById("um-count").innerHTML =
    "Universe Manipulation (x" + saveData.items.um + ")";
  document.getElementById("js-count").innerHTML =
    "JavaScript Console (x" + saveData.items.js + ")";
  document.getElementById("mc-count").innerHTML =
    "Matter Creator (x" + saveData.items.mc + ")";
  document.getElementById("dpc-price").innerHTML = formatCash(
    Math.floor((saveData.dpc * 40) ** 1.4)
  );
  if (autoclick == false) {
    document.getElementById("autoclick-price").innerHTML = formatCash(
      Math.floor(saveData.dpc * 480)
    );
  }
  if (localStorage.getItem("detail") == "true") {
    if (saveData.donuts > 1000000) {
      if (particleStage != 4) {
        particleStage = 4;
        document.getElementById("particles-js").remove();
        let pjs = document.createElement("div");
        pjs.setAttribute("id", "particles-js");
        document.body.appendChild(pjs);
        particlesJS.load("particles-js", "particles4.json");
      }
    } else if (saveData.donuts > 1000000) {
      if (particleStage != 3) {
        particleStage = 3;
        document.getElementById("particles-js").remove();
        let pjs = document.createElement("div");
        pjs.setAttribute("id", "particles-js");
        document.body.appendChild(pjs);
        particlesJS.load("particles-js", "particles3.json");
      }
    } else if (saveData.donuts > 25000) {
      if (particleStage != 2) {
        particleStage = 2;
        document.getElementById("particles-js").remove();
        let pjs = document.createElement("div");
        pjs.setAttribute("id", "particles-js");
        document.body.appendChild(pjs);
        particlesJS.load("particles-js", "particles2.json");
      }
    } else if (particleStage != 1) {
      particleStage = 1;
      document.getElementById("particles-js").remove();
      let pjs = document.createElement("div");
      pjs.setAttribute("id", "particles-js");
      document.body.appendChild(pjs);
      particlesJS.load("particles-js", "particles1.json");
    }
  }
}

secDiff = Math.floor(new Date().getTime() / 1000) - saveData.lastLoggedOn;
donutsAway = secDiff * saveData.dps * 0.5;
if (donutsAway >= saveData.dps * 604800) {
  donutsAway = saveData.dps * 604800;
}
saveData.donuts += donutsAway;
if (secDiff >= 1800) {
  document.getElementById("welcomeback").innerHTML = "WELCOME BACK!";
  document.getElementById("loggedOutModal").style.visibility = "visible";
  document.getElementById("loggedOutModal").style.opacity = "100%";
  document.getElementById("loggedOutPopup").style.visibility = "visible";
  document.getElementById("loggedOutPopup").style.opacity = "100%";
  document.getElementById("amountEarned").innerHTML =
    "While you were away, you earned " +
    Math.floor(donutsAway) +
    " donuts. (50% DPS)";
  document.getElementById("loggedOutPopup").style.transform =
    "translate(-50%, -50%) scale(1, 1)";
}

document.getElementById("loggedOutButton").onclick = function () {
  document.getElementById("loggedOutModal").style.visibility = "hidden";
  document.getElementById("loggedOutModal").style.opacity = "0%";
  document.getElementById("loggedOutPopup").style.visibility = "hidden";
  document.getElementById("loggedOutPopup").style.opacity = "0%";
  document.getElementById("loggedOutPopup").style.transform =
    "translate(-50%, -50%) scale(0.5, 0.5)";
};

document.getElementById("bakeryname").value = saveData.bakeryname;
document.getElementById("bakeryname").oninput = function () {
  saveData["bakeryname"] = document.getElementById("bakeryname").value;
  saveDonuts();
};

if (localStorage.getItem("detail") == "true") {
  if (saveData.donuts <= 1000) {
    particlesJS.load("particles-js", "particles1.json");
  } else if (saveData.donuts <= 50000) {
    particlesJS.load("particles-js", "particles2.json");
  } else if (saveData.donuts <= 1000000) {
    particlesJS.load("particles-js", "particles3.json");
  } else {
    particlesJS.load("particles-js", "particles4.json");
  }
}

document.getElementById("cursor-count").innerHTML =
  "Cursor (x" + saveData.items.cursor + ")";
document.getElementById("oven-count").innerHTML =
  "Deep Fryer (x" + saveData.items.deepfry + ")";
document.getElementById("restaurant-count").innerHTML =
  "Restaurant (x" + saveData.items.restaurant + ")";
document.getElementById("factory-count").innerHTML =
  "Factory (x" + saveData.items.factory + ")";
document.getElementById("dpc-price").innerHTML = formatCash(
  Math.floor((saveData.dpc * 40) ** 1.4)
);
document.getElementById("shipment-price").innerHTML = formatCash(
  Math.floor(saveData.items.shipment * 48000 + 240000)
);
document.getElementById("tm-price").innerHTML = formatCash(
  Math.floor(saveData.items.time_machine * 600000 + 3000000)
);
document.getElementById("mc-price").innerHTML = formatCash(
  Math.floor(saveData.items.mc * 10000000 + 50000000)
);
document.getElementById("frenzy-price").innerHTML = formatCash(
  Math.ceil((saveData.dps / 1.2 + 7 * saveData.dpc) * 300 + 2000)
);
document.getElementById("minif-price").innerHTML = formatCash(
  Math.ceil((saveData.dps / 1.2 + 7 * saveData.dpc) * 30 + 200)
);
document.getElementById("clickf-price").innerHTML = formatCash(
  Math.ceil(saveData.dpc * 30000)
);
document.getElementById("cursor-price").innerHTML = formatCash(
  saveData.items.cursor * 2 + 10
);
document.getElementById("oven-price").innerHTML = formatCash(
  saveData.items.deepfry * 40 + 200
);
document.getElementById("restaurant-price").innerHTML = formatCash(
  saveData.items.restaurant * 500 + 1000
);
document.getElementById("factory-price").innerHTML = formatCash(
  saveData.items.factory * 2200 + 11000
);
document.getElementById("planet-price").innerHTML = formatCash(
  saveData.items.planet * 200000000 + 1000000000
);
document.getElementById("um-price").innerHTML = formatCash(
  saveData.items.deepfry * 20000000000 + 100000000000
);
document.getElementById("js-price").innerHTML = formatCash(
  saveData.items.restaurant * 1000000000000 + 5000000000000
);
setInterval(function () {
  saveData.lastLoggedOn = Math.floor(new Date().getTime() / 1000);
  if (frenzy == true) {
    saveData.donuts += (saveData.dps / 20) * 7;
  } else {
    saveData.donuts += saveData.dps / 20;
  }
  saveDonuts();
}, 50);

document.getElementById("buy-frenzy").onclick = function () {
  if (
    saveData.donuts >= (saveData.dps / 1.2 + 7 * saveData.dpc) * 300 + 2000 &&
    frenzy == false &&
    clickf == false
  ) {
    saveData.donuts -= (saveData.dps / 1.2 + 7 * saveData.dpc) * 300 + 2000;
    frenzy = true;
    let dpc = saveData.dpc;
    saveData.dpc = parseFloat(dpc);
    document.getElementById("frenzy-price").innerHTML = "Active (77s)";
    document.getElementById("frenzy-price").style = "color: yellow";
    document.getElementById("donut-count").style = "color: yellow";
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
    let tryF = 0;
    buyfrenzy = setInterval(function () {
      tryF += 1;
      document.getElementById("frenzy-price").innerHTML =
        "Active (" + (77 - tryF) + "s)";
      if (tryF == 77) {
        clearInterval(buyfrenzy);
        frenzy = false;
        document.getElementById("frenzy-price").innerHTML = formatCash(
          Math.ceil((saveData.dps / 1.2 + 7 * saveData.dpc) * 300 + 2000)
        );
        document.getElementById("frenzy-price").style = "";
        document.getElementById("donut-count").style = "";
      }
    }, 1000);
  }
};

document.getElementById("buy-minif").onclick = function () {
  if (
    saveData.donuts >= (saveData.dps / 1.2 + 7 * saveData.dpc) * 30 + 200 &&
    frenzy == false &&
    clickf == false
  ) {
    saveData.donuts -= (saveData.dps / 1.2 + 7 * saveData.dpc) * 30 + 200;
    frenzy = true;
    let dpc = saveData.dpc;
    saveData.dpc = parseFloat(dpc);
    document.getElementById("minif-price").innerHTML = "Active (7.0s)";
    document.getElementById("minif-price").style = "color: yellow";
    document.getElementById("donut-count").style = "color: yellow";
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
    let tryF = 0;
    buyminif = setInterval(function () {
      tryF += 1;
      document.getElementById("minif-price").innerHTML =
        "Active (" + (70 - tryF) / 10 + "s)";
      console.log(tryF);
      if (tryF == 70) {
        clearInterval(buyminif);
        frenzy = false;
        document.getElementById("minif-price").innerHTML = formatCash(
          Math.ceil((saveData.dps / 1.2 + 7 * saveData.dpc) * 30 + 200)
        );
        document.getElementById("minif-price").style = "";
        document.getElementById("donut-count").style = "";
      }
    }, 100);
  }
};

document.getElementById("buy-clickf").onclick = function () {
  if (
    saveData.donuts >= Math.ceil(saveData.dpc * 30000) &&
    frenzy == false &&
    clickf == false
  ) {
    saveData.donuts -= Math.ceil(saveData.dpc * 30000);
    clickf = true;
    let dpc = saveData.dpc;
    saveData.dpc = parseFloat(dpc);
    document.getElementById("clickf-price").innerHTML = "Active (15.0s)";
    document.getElementById("clickf-price").style = "color: yellow";
    document.getElementById("donut-count").style = "color: yellow";
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
    let tryF = 0;
    buyclickf = setInterval(function () {
      tryF += 1;
      document.getElementById("clickf-price").innerHTML =
        "Active (" + (150 - tryF) / 10 + "s)";
      console.log(tryF);
      if (tryF == 150) {
        clearInterval(buyclickf);
        clickf = false;
        document.getElementById("clickf-price").innerHTML = formatCash(
          Math.ceil(saveData.dpc * 30000)
        );
        document.getElementById("clickf-price").style = "";
        document.getElementById("donut-count").style = "";
      }
    }, 100);
  }
};

document.getElementById("buy-autoclick").onclick = function () {
  if (saveData.donuts >= saveData.dpc * 480 && autoclick == false) {
    saveData.donuts -= saveData.dpc * 480;
    autoclick = true;
    let dpc = saveData.dpc;
    saveData.dpc = parseFloat(dpc);
    document.getElementById("autoclick-price").innerHTML = "Active (60.0s)";
    document.getElementById("autoclick-price").style = "color: yellow";
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
    let tryF = 0;
    buyautoclick = setInterval(function () {
      tryF += 1;
      document.getElementById("autoclick-price").innerHTML =
        "Active (" + (60 - tryF / 10).toFixed(1) + "s)";
      if (frenzy == true) {
        saveData["donuts"] += saveData["dpc"] * 7;
      } else {
        saveData["donuts"] += saveData["dpc"];
      }
      if (tryF == 600) {
        clearInterval(buyautoclick);
        autoclick = false;
        document.getElementById("autoclick-price").innerHTML = formatCash(
          Math.ceil(saveData.dpc * 480)
        );
        document.getElementById("autoclick-price").style = "";
      }
    }, 100);
  }
};

document.getElementById("buy-dpc").onclick = function () {
  if (saveData.donuts >= Math.floor((saveData.dpc * 40) ** 1.4)) {
    saveData.donuts -= Math.floor((saveData.dpc * 40) ** 1.4);
    saveData.dpc = saveData.dpc * 2;
    let dpc = saveData.dpc;
    saveData.dpc = parseFloat(dpc);
    document.getElementById("dpc-price").innerHTML = formatCash(
      Math.floor((saveData.dpc * 40) ** 1.4)
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
};

document.getElementById("buy-cursor").onclick = function () {
  if (saveData.donuts >= saveData.items.cursor * 2 + 10) {
    saveData.donuts -= saveData.items.cursor * 2 + 10;
    saveData.items.cursor += 1;
    saveData.dps += 0.2;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    document.getElementById("cursor-price").innerHTML =
      saveData.items.cursor * 2 + 10;
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
};

document.getElementById("buy-oven").onclick = function () {
  if (saveData.donuts >= saveData.items.deepfry * 40 + 200) {
    saveData.donuts -= saveData.items.deepfry * 40 + 200;
    saveData.items.deepfry += 1;
    saveData.dps += 5;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    document.getElementById("oven-price").innerHTML =
      saveData.items.deepfry * 40 + 200;
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
};

document.getElementById("buy-restaurant").onclick = function () {
  if (saveData.donuts >= saveData.items.restaurant * 200 + 1000) {
    saveData.donuts -= saveData.items.restaurant * 200 + 1000;
    saveData.items.restaurant += 1;
    saveData.dps += 32;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    document.getElementById("restaurant-price").innerHTML =
      saveData.items.restaurant * 200 + 1000;
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
};

document.getElementById("buy-factory").onclick = function () {
  if (saveData.donuts >= saveData.items.factory * 2200 + 11000) {
    saveData.donuts -= saveData.items.factory * 2200 + 11000;
    saveData.items.factory += 1;
    saveData.dps += 400;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    document.getElementById("factory-price").innerHTML =
      saveData.items.factory * 2200 + 11000;
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
};

document.getElementById("buy-shipment").onclick = function () {
  if (saveData.donuts >= saveData.items.shipment * 48000 + 240000) {
    saveData.donuts -= saveData.items.shipment * 48000 + 240000;
    saveData.items.shipment += 1;
    saveData.dps += 8000;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    document.getElementById("shipment-price").innerHTML = formatCash(
      saveData.items.shipment * 48000 + 240000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
};

document.getElementById("buy-tm").onclick = function () {
  if (saveData.donuts >= saveData.items.time_machine * 600000 + 3000000) {
    saveData.donuts -= saveData.items.time_machine * 600000 + 3000000;
    saveData.items.time_machine += 1;
    saveData.dps += 66666;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    document.getElementById("tm-price").innerHTML = formatCash(
      saveData.items.time_machine * 600000 + 3000000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
};

document.getElementById("buy-planet").onclick = function () {
  if (saveData.donuts >= saveData.items.planet * 200000000 + 1000000000) {
    saveData.donuts -= saveData.items.planet * 200000000 + 1000000000;
    saveData.items.planet += 1;
    saveData.dps += 25000000;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    document.getElementById("planet-price").innerHTML = formatCash(
      saveData.items.planet * 200000000 + 1000000000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
};

document.getElementById("buy-um").onclick = function () {
  if (saveData.donuts >= saveData.items.um * 20000000000 + 100000000000) {
    saveData.donuts -= saveData.items.um * 20000000000 + 100000000000;
    saveData.items.um += 1;
    saveData.dps += 2700000000;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    document.getElementById("um-price").innerHTML = formatCash(
      saveData.items.um * 20000000000 + 100000000000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
};

document.getElementById("buy-mc").onclick = function () {
  if (saveData.donuts >= saveData.items.mc * 10000000 + 50000000) {
    saveData.donuts -= saveData.items.mc * 10000000 + 50000000;
    saveData.items.mc += 1;
    saveData.dps += 1000000;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    document.getElementById("mc-price").innerHTML = formatCash(
      saveData.items.mc * 10000000 + 50000000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
};

document.getElementById("buy-js").onclick = function () {
  if (saveData.donuts >= saveData.items.js * 1000000000000 + 5000000000000) {
    saveData.donuts -= saveData.items.js * 1000000000000 + 5000000000000;
    saveData.items.js += 1;
    saveData.dps += 140000000000;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    document.getElementById("js-price").innerHTML = formatCash(
      saveData.items.js * 1000000000000 + 5000000000000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
};

document.getElementById("buy-cursor").oncontextmenu = function (e) {
  e.preventDefault();
  if (saveData.items.cursor >= 1) {
    saveData.items.cursor -= 1;
    saveData.dps -= 0.2;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    saveData.donuts += (saveData.items.cursor * 2 + 10) * 0.8;
    document.getElementById("cursor-price").innerHTML =
      saveData.items.cursor * 2 + 10;
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
  return false;
};

document.getElementById("buy-oven").oncontextmenu = function (e) {
  e.preventDefault();
  if (saveData.items.deepfry >= 1) {
    saveData.items.deepfry -= 1;
    saveData.dps -= 5;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    saveData.donuts += (saveData.items.deepfry * 40 + 200) * 0.8;
    document.getElementById("oven-price").innerHTML =
      saveData.items.deepfry * 40 + 200;
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
  return false;
};

document.getElementById("buy-restaurant").oncontextmenu = function (e) {
  e.preventDefault();
  if (saveData.items.restaurant >= 1) {
    saveData.items.restaurant -= 1;
    saveData.dps -= 32;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    saveData.donuts += (saveData.items.restaurant * 200 + 1000) * 0.8;
    document.getElementById("restaurant-price").innerHTML =
      saveData.items.restaurant * 200 + 1000;
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
  return false;
};

document.getElementById("buy-factory").oncontextmenu = function (e) {
  e.preventDefault();
  if (saveData.items.factory >= 1) {
    saveData.items.factory -= 1;
    saveData.dps -= 400;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    saveData.donuts += (saveData.items.factory * 2200 + 11000) * 0.8;
    document.getElementById("factory-price").innerHTML =
      saveData.items.factory * 2200 + 11000;
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
  return false;
};

document.getElementById("buy-shipment").oncontextmenu = function (e) {
  e.preventDefault();
  if (saveData.items.shipment >= 1) {
    saveData.items.shipment -= 1;
    saveData.dps -= 8000;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    saveData.donuts += (saveData.items.shipment * 48000 + 240000) * 0.8;
    document.getElementById("shipment-price").innerHTML = formatCash(
      saveData.items.shipment * 48000 + 240000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
  return false;
};

document.getElementById("buy-tm").oncontextmenu = function (e) {
  e.preventDefault();
  if (saveData.items.time_machine >= 1) {
    saveData.items.time_machine -= 1;
    saveData.dps -= 66666;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    saveData.donuts += (saveData.items.time_machine * 600000 + 3000000) * 0.8;
    document.getElementById("tm-price").innerHTML = formatCash(
      saveData.items.time_machine * 600000 + 3000000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
  return false;
};

document.getElementById("buy-mc").oncontextmenu = function (e) {
  e.preventDefault();
  if (saveData.items.mc >= 1) {
    saveData.items.mc -= 1;
    saveData.dps -= 1000000;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    saveData.donuts += (saveData.items.mc * 10000000 + 50000000) * 0.8;
    document.getElementById("mc-price").innerHTML = formatCash(
      saveData.items.mc * 10000000 + 50000000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
  return false;
};

document.getElementById("buy-planet").oncontextmenu = function (e) {
  e.preventDefault();
  if (saveData.items.planet >= 1) {
    saveData.items.planet -= 1;
    saveData.dps -= 25000000;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    saveData.donuts += (saveData.items.planet * 200000000 + 1000000000) * 0.8;
    document.getElementById("planet-price").innerHTML = formatCash(
      saveData.items.planet * 200000000 + 1000000000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
  return false;
};

document.getElementById("buy-um").oncontextmenu = function (e) {
  e.preventDefault();
  if (saveData.items.um >= 1) {
    saveData.items.um -= 1;
    saveData.dps -= 2700000000;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    saveData.donuts += (saveData.items.um * 20000000000 + 100000000000) * 0.8;
    document.getElementById("um-price").innerHTML = formatCash(
      saveData.items.um * 20000000000 + 100000000000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
  return false;
};

document.getElementById("buy-js").oncontextmenu = function (e) {
  e.preventDefault();
  if (saveData.items.js >= 1) {
    saveData.items.js -= 1;
    saveData.dps -= 140000000000;
    let dps = saveData.dps;
    dps = dps.toFixed(1);
    saveData.dps = parseFloat(dps);
    saveData.donuts +=
      (saveData.items.js * 1000000000000 + 5000000000000) * 0.8;
    document.getElementById("js-price").innerHTML = formatCash(
      saveData.items.js * 1000000000000 + 5000000000000
    );
    saveDonuts();
    new Howl({
      src: ["button_click.mp3"],
    }).play();
  }
  return false;
};

document.getElementById("real-donut").onclick = function clickDonut() {
  if (clickf == true) {
    saveData["donuts"] += saveData["dpc"] * 333;
  } else if (frenzy == true) {
    saveData["donuts"] += saveData["dpc"] * 7;
  } else {
    saveData["donuts"] += saveData["dpc"];
  }
  saveDonuts();
  new Howl({
    src: ["button_click.mp3"],
  }).play();
};
