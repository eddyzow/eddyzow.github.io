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
}

function switchLightTheme() {
  localStorage.setItem("homepage-theme", "light");
  document.body.setAttribute(
    "style",
    "background-color:#ffe8cb; color:#535353;"
  );
  var links = document.getElementsByTagName("a");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("style", "color:#535353 !important");
  }

  links = document.getElementsByClassName("blogpost");
  for (var i = 0; i < links.length; i++) {
    links[i].setAttribute("style", "border: 6px solid #535353");
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
    .setAttribute("style", "filter: drop-shadow(0px 0px 8px #3b3b3b);");

  document
    .getElementById("theme-changer-icon")
    .setAttribute("class", "fa-solid fa-moon");

  document.getElementById("particles-js").remove();
}

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
