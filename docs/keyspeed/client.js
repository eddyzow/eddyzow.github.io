particlesJS.load("particles-js", "particles.json");
var started = 0;
var lastNoteSent = 0;
var noteSpeed = 3;
var inprog = 0;
var noteList = [];
var hold1 = 0;
var hold2 = 0;
var hold3 = 0;
var hold4 = 0;
var stopint;
var beep = new Howl({
  src: ["beep.mp3"],
  volume: 0.5,
});

var beepf = function () {
  beep.stop();
  beep.play();
};

var sendNote = function () {
  let list = [1, 2, 3, 4];
  if (lastNoteSent != 0) {
    list.splice(lastNoteSent - 1, 1)[0];
  }
  let item = list[Math.floor(Math.random() * list.length)];
  lastNoteSent = item;

  noteList.push(item);
  let elem = document.createElement("div");
  elem.setAttribute("class", "note");
  elem.style =
    "left: " +
    (40 + 5 * (item - 1)) +
    "vw; animation: notefall " +
    17 / noteSpeed +
    "s linear";
  document.getElementById("notes").appendChild(elem);
  setTimeout(function () {
    if (inprog == 1) {
      sendNote();
    }
  }, 1000 / noteSpeed);
  setTimeout(function () {
    if (inprog == 1) {
      if (document.body.contains(elem) == true) {
        elem.remove();

        started = 0;
        var paras = document.getElementsByClassName("note");
        while (paras[0]) {
          paras[0].parentNode.removeChild(paras[0]);
        }
        clearInterval(stopint);
        document.getElementById("intro-screen").style = "visibility: visible";
        document.getElementById("game-screen").style = "visibility: hidden";
        localStorage.setItem("KSlast", noteSpeed);
        if (Number.parseFloat(localStorage.getItem("KSbest")) < noteSpeed) {
          localStorage.setItem("KSbest", noteSpeed);
        }
        document.getElementById("lasttry").innerHTML =
          "Your last try: " +
          Number.parseFloat(localStorage.getItem("KSlast")).toFixed(3) +
          " kps";
        document.getElementById("besttry").innerHTML =
          "Your best try: " +
          Number.parseFloat(localStorage.getItem("KSbest")).toFixed(3) +
          " kps";
        inprog = 0;
      }
    }
  }, 17000 / noteSpeed);
};

document.onkeyup = function (e) {
  e = e || window.event;
  var key = e.key;
  if (key == "a" || key == "A") {
    document.getElementById("lane1").style = "";
    hold1 = 0;
  }
  if (key == "s" || key == "S") {
    document.getElementById("lane2").style = "";
    hold2 = 0;
  }
  if (key == "k" || key == "K") {
    document.getElementById("lane3").style = "";
    hold3 = 0;
  }
  if (key == "l" || key == "L") {
    document.getElementById("lane4").style = "";
    hold4 = 0;
  }
};

document.onkeydown = function (e) {
  e = e || window.event;
  var key = e.key;

  if ((key == "a" || key == "A") && inprog == 1 && hold1 == 0) {
    hold1 = 1;
    document.getElementById("lane1").style =
      "background: linear-gradient(to bottom,rgba(0, 0, 0, 0.5) 0%,rgba(0, 0, 0, 0.5) 90%,rgb(0, 255, 200) 100%);";
    if (noteList[0] == 1) {
      // nice
      document.getElementsByClassName("note")[0].remove();
      noteList.shift();
      beepf();
    } else {
      // game is over

      started = 0;
      var paras = document.getElementsByClassName("note");
      while (paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
      }
      clearInterval(stopint);
      document.getElementById("intro-screen").style = "visibility: visible";
      document.getElementById("game-screen").style = "visibility: hidden";
      localStorage.setItem("KSlast", noteSpeed);
      if (Number.parseFloat(localStorage.getItem("KSbest")) < noteSpeed) {
        localStorage.setItem("KSbest", noteSpeed);
      }
      document.getElementById("lasttry").innerHTML =
        "Your last try: " +
        Number.parseFloat(localStorage.getItem("KSlast")).toFixed(3) +
        " kps";
      document.getElementById("besttry").innerHTML =
        "Your best try: " +
        Number.parseFloat(localStorage.getItem("KSbest")).toFixed(3) +
        " kps";
      inprog = 0;
    }
  }
  if ((key == "s" || key == "S") && inprog == 1 && hold2 == 0) {
    hold2 = 1;
    document.getElementById("lane2").style =
      "background: linear-gradient(to bottom,rgba(0, 0, 0, 0.5) 0%,rgba(0, 0, 0, 0.5) 90%,rgb(0, 255, 200) 100%);";
    if (noteList[0] == 2) {
      // nice

      document.getElementsByClassName("note")[0].remove();
      noteList.shift();
      beepf();
    } else {
      // game is over

      started = 0;
      var paras = document.getElementsByClassName("note");
      while (paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
      }
      clearInterval(stopint);
      document.getElementById("intro-screen").style = "visibility: visible";
      document.getElementById("game-screen").style = "visibility: hidden";
      localStorage.setItem("KSlast", noteSpeed);
      if (Number.parseFloat(localStorage.getItem("KSbest")) < noteSpeed) {
        localStorage.setItem("KSbest", noteSpeed);
      }
      document.getElementById("lasttry").innerHTML =
        "Your last try: " +
        Number.parseFloat(localStorage.getItem("KSlast")).toFixed(3) +
        " kps";
      document.getElementById("besttry").innerHTML =
        "Your best try: " +
        Number.parseFloat(localStorage.getItem("KSbest")).toFixed(3) +
        " kps";
      inprog = 0;
    }
  }
  if ((key == "k" || key == "K") && inprog == 1 && hold3 == 0) {
    hold3 = 1;
    document.getElementById("lane3").style =
      "background: linear-gradient(to bottom,rgba(0, 0, 0, 0.5) 0%,rgba(0, 0, 0, 0.5) 90%,rgb(0, 255, 200) 100%);";
    if (noteList[0] == 3) {
      // nice
      document.getElementsByClassName("note")[0].remove();
      noteList.shift();
      beepf();
    } else {
      // game is over
      started = 0;
      var paras = document.getElementsByClassName("note");
      while (paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
      }
      clearInterval(stopint);
      document.getElementById("intro-screen").style = "visibility: visible";
      document.getElementById("game-screen").style = "visibility: hidden";
      localStorage.setItem("KSlast", noteSpeed);
      if (Number.parseFloat(localStorage.getItem("KSbest")) < noteSpeed) {
        localStorage.setItem("KSbest", noteSpeed);
      }
      document.getElementById("lasttry").innerHTML =
        "Your last try: " +
        Number.parseFloat(localStorage.getItem("KSlast")).toFixed(3) +
        " kps";
      document.getElementById("besttry").innerHTML =
        "Your best try: " +
        Number.parseFloat(localStorage.getItem("KSbest")).toFixed(3) +
        " kps";
      inprog = 0;
    }
  }
  if ((key == "l" || key == "L") && inprog == 1 && hold4 == 0) {
    hold4 = 1;
    document.getElementById("lane4").style =
      "background: linear-gradient(to bottom,rgba(0, 0, 0, 0.5) 0%,rgba(0, 0, 0, 0.5) 90%,rgb(0, 255, 200) 100%);";
    if (noteList[0] == 4) {
      // nice
      document.getElementsByClassName("note")[0].remove();
      noteList.shift();
      beepf();
    } else {
      // game is over

      started = 0;
      var paras = document.getElementsByClassName("note");
      while (paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
      }
      clearInterval(stopint);
      document.getElementById("intro-screen").style = "visibility: visible";
      document.getElementById("game-screen").style = "visibility: hidden";
      localStorage.setItem("KSlast", noteSpeed);
      if (Number.parseFloat(localStorage.getItem("KSbest")) < noteSpeed) {
        localStorage.setItem("KSbest", noteSpeed);
      }
      document.getElementById("lasttry").innerHTML =
        "Your last try: " +
        Number.parseFloat(localStorage.getItem("KSlast")).toFixed(3) +
        " kps";
      document.getElementById("besttry").innerHTML =
        "Your best try: " +
        Number.parseFloat(localStorage.getItem("KSbest")).toFixed(3) +
        " kps";
      inprog = 0;
    }
  }
  if (key == " " && started == 0) {
    noteSpeed = 3;
    started = 1;
    beepf();
    document.getElementById("intro-screen").style = "visibility: hidden";
    document.getElementById("game-screen").style = "visibility: visible";
    setTimeout(function () {
      setTimeout(function () {
        beepf();
        setTimeout(function () {
          beepf();
          setTimeout(function () {
            beepf();
            setTimeout(function () {
              inprog = 1;
              noteList = [];
              sendNote();
              stopint = setInterval(function () {
                noteSpeed += 0.012;
                document.getElementById("notespeed").innerHTML =
                  noteSpeed.toFixed(3);
              }, 100);
            }, 1000);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  }
};

if (localStorage.getItem("KSlast") == null) {
  localStorage.setItem("KSlast", 0);
}

if (localStorage.getItem("KSbest") == null) {
  localStorage.setItem("KSbest", 0);
}

document.getElementById("lasttry").innerHTML =
  "Your last try: " +
  Number.parseFloat(localStorage.getItem("KSlast")).toFixed(3) +
  " kps";
document.getElementById("besttry").innerHTML =
  "Your best try: " +
  Number.parseFloat(localStorage.getItem("KSbest")).toFixed(3) +
  " kps";
