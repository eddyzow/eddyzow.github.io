particlesJS.load("particles-js", "particles.json");
minipages = ["about", "blog", "projects", "contact"];

if (localStorage.getItem("homepage-theme") != "light") {
  localStorage.setItem("homepage-theme", "dark");
  switchDarkTheme();
} else {
  switchLightTheme();
}

function switchDarkTheme() {
  localStorage.setItem("homepage-theme", "dark");
  document.body.setAttribute("style", "");
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("style", "color:white !important");
  }
  links = document.getElementsByClassName("blogpost");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("style", "border: 6px solid white");
  }
  links = document.getElementsByClassName("projectPlay");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("style", "background-color: #ffffff; color:black;");
  }
  links = document.getElementsByClassName("header-item");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute(
      "style",
      "border-left: 2px solid white; border-right: 2px solid white;"
    );
  }

  links = document.getElementsByClassName("header");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("style", "box-shadow: 0px 3px 15px white;");
  }
  document
    .getElementById("theme-changer")
    .setAttribute("style", "filter: drop-shadow(0px 0px 4px #ffffff);");
  document
    .getElementById("theme-changer-icon")
    .setAttribute("class", "fa-solid fa-sun");
  let pjs = document.createElement("div");
  pjs.setAttribute("id", "particles-js");
  document.body.appendChild(pjs);
  particlesJS.load("particles-js", "particles.json");
}

function switchLightTheme() {
  localStorage.setItem("homepage-theme", "light");
  document.body.setAttribute(
    "style",
    "background-color:#ffe8cb; color:#424242;"
  );
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("style", "color:#424242 !important");
  }

  links = document.getElementsByClassName("blogpost");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("style", "border: 6px solid #424242");
  }

  links = document.getElementsByClassName("projectPlay");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("style", "background-color: #3b3b3b; color:#ffe8cb;");
  }

  links = document.getElementsByClassName("header-item");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute(
      "style",
      "border-left: 2px solid #3b3b3b; border-right: 2px solid #3b3b3b;"
    );
  }

  links = document.getElementsByClassName("header");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("style", "box-shadow: 0px 3px 15px #3b3b3b;");
  }
  document
    .getElementById("theme-changer")
    .setAttribute("style", "filter: drop-shadow(0px 0px 4px #3b3b3b);");

  document
    .getElementById("theme-changer-icon")
    .setAttribute("class", "fa-solid fa-moon");

  document.getElementById("particles-js").remove();
}

[...document.getElementsByClassName("header-item")].forEach((el) => {
  el.onclick = function () {
    [...document.getElementsByClassName("header-item")].forEach((el2) => {
      el2.classList.remove("selected");
    });
    el.classList.add("selected");
    window.location.hash = minipages[el.id.split("header")[1] - 1];
    document.getElementById("main-carrier").style.left =
      "-" + (el.id.split("header")[1] * 100 - 50) + "vw";
  };
});

document.getElementById("theme-changer").onclick = function () {
  console.log("test");
  if (localStorage.getItem("homepage-theme") != "dark") {
    // switch to dark theme
    switchDarkTheme();
  } else {
    // switch to light theme

    switchLightTheme();
  }
};

window.onload = () => {
  if (localStorage.getItem("userToken") == null) {
    document.getElementById("login-notice").innerHTML =
      "Log in or create an eddyzow.net account to access all cloud-based apps! (Trivia Champion, JSBeats, etc.)";
  } else {
    document.getElementById("login-notice").innerHTML =
      "You are currently logged into eddyzow.net. Welcome, " +
      localStorage.getItem("username") +
      "!";
  }
  try {
    console.log(minipages.indexOf(window.location.hash.split("#")[1]));
    [...document.getElementsByClassName("header-item")].forEach((el2) => {
      el2.classList.remove("selected");
    });
    document
      .getElementById(
        "header" + (minipages.indexOf(window.location.hash.split("#")[1]) + 1)
      )
      .classList.add("selected");
    document.getElementById("main-carrier").style.left =
      "-" +
      ((minipages.indexOf(window.location.hash.split("#")[1]) + 1) * 100 - 50) +
      "vw";
  } catch {
    window.location.hash = "about";
    [...document.getElementsByClassName("header-item")].forEach((el2) => {
      el2.classList.remove("selected");
    });
    document.getElementById("header1").classList.add("selected");
    document.getElementById("main-carrier").style.left = "-50vw";
  }
};

function login() {
  sessionStorage.setItem("dir", "home");
  window.location.href = "../champion";
}
