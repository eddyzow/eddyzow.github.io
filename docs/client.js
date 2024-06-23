particlesJS.load("particles-js", "particles.json");
minipages = ["about", "projects", "contact"];

[...document.getElementsByClassName("header-item")].forEach((el) => {
  el.onclick = function () {
    [...document.getElementsByClassName("header-item")].forEach((el2) => {
      el2.classList.remove("selected");
    });
    el.classList.add("selected");
    window.location.hash = minipages[el.id.split("header")[1] - 1];
    document.getElementById("main-carrier").style.left =
      "-" + (el.id.split("header")[1] * 100) + "vw";
  };
});

window.onload = () => {
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
      ((minipages.indexOf(window.location.hash.split("#")[1]) + 1) * 100) +
      "vw";
  } catch {
    window.location.hash = "about";
    [...document.getElementsByClassName("header-item")].forEach((el2) => {
      el2.classList.remove("selected");
    });
    document.getElementById("header1").classList.add("selected");
    document.getElementById("main-carrier").style.left = "-100vw"
  }
};
