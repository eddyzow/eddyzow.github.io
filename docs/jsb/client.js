var page = 1;
var beatno = 0;
var combo = 0;
var currentScore = 0;
var inGame = 0;
var multiplier = 1.0;
var songLength = 0;
var notes = [];
var perfect = 0;
var great = 0;
var ok = 0;
var miss = 0;
var finish;
var hold1 = 0;
var hold2 = 0;
var hold3 = 0;
var hold4 = 0;
var cursong;
var rankPoints2 = 0;
var datas;
var queueBeginTime = 0;
var exitingGame = 0;
var exitPermit = 0;
var connecttimes = 0;
var listPlayers = [];
// Cheating is not allowed in JSBeats! If you're caught cheating, you will be banned.
var liveGameData = {
  totalNotes: 0,
  currentScore: 0,
  eachNoteScores: [],
  eachNoteTiming: {
    perfect: 0,
    great: 0,
    ok: 0,
    miss: 0,
  },
};

var rankPoints = {
  1: "D",
  3: "C",
  5: "B",
  15: "A",
  30: "S",
};
var competitive = 0;
var songs = [
  "Tutorial - Kevin MacLeod/eddyzow (5)",
  "not available yet",
  "Dioma - JNATHYN (20)",
  "New Hero In Town - Kevin MacLeod (3)",
  "not available yet",
  "Explorers - Hinkik (16)",
  "Dark Sheep - Chroma (26)",
  "not available yet",
  "not available yet",
  "not available yet",
  "Altale - Sakuzyo (29)",
  "EPIC - Tokyo Machine (2)",
];

var musics = [
  "GO GO GO SUMMER - NOBUHAMU",
  "HANGING OUT IN TOKYO - MEESAN",
  "MAIN STREET - CHIKA",
  "MUSCAT AND WHITE DISHES - TAKAHASHI TAKASHI",
  "SUCCESS STORY - AKIKI SHIOYAMA",
  "SUMMER SKY AND HOMEWORK - TAKAHASHI TAKASHI",
  "WIND TRAIL - CHIKA",
  "THE TIME HAS COME - CHIKA",
  "WHEN YOU REALIZE - MAURO SOMM",
  "DEEP SEA - GONZA!",
  "CHILL - SAKURA HZ",
  "ACID TRUMPET - KEVIN MACLEOD",
  "RISING TIDE - KEVIN MACLEOD",
  "MIAMI VICEROY - KEVIN MACLEOD",
  "MAZE OF THE ABYSS - KAMOKING",
  "READY AIM FIRE - KEVIN MACLEOD",
  "DEPARTURE - CHIKA",
  "BLEEPING DEMO - KEVIN MACLEOD",
  "WET RIFFS - KEVIN MACLEOD",
  "EXIT THE PREMISES - KEVIN MACLEOD",
  "CHIPPER DOODLE - KEVIN MACLEOD",
];
var backgaudio = new Howl({
  src: [
    "../champion/assets/sound/music/" +
      (Math.floor(Math.random() * 11) + 1).toString() +
      ".mp3",
  ],
  loop: true,
  rate: 1,
});
const socket = io("https://eddyzow.herokuapp.com/"); // Socket
document.getElementById("wallpaper").style["background-image"] =
  'url("../champion/assets/art/wallpapers/' +
  (Math.floor(Math.random() * 8) + 1).toString() +
  '.jpg")';

function updateRank() {
  // S: 95% A: 90% B: 80% C: 70% D: 60% F: any lower
  if (rankPoints2 / notes.length >= 0.95) {
    document.getElementById("rank").innerHTML = "S";
    document.getElementById("currentRankNew").style.bottom = "84vh";
    document.getElementById("currentRankNew").innerHTML = "S";
    document.getElementById("rankBarInner").style["clip-path"] =
      "inset(0vh 0 0 0)";
  } else if (rankPoints2 / notes.length >= 0.9) {
    document.getElementById("rank").innerHTML = "A";
    document.getElementById("currentRankNew").innerHTML = "A";
    // number of rank points needed
    document.getElementById("rankBarInner").style["clip-path"] =
      "inset(" +
      (80 -
        80 *
          ((rankPoints2 - notes.length * 0.9) /
            (notes.length * 0.95 - notes.length * 0.9))) +
      "vh 0 0 0)";
    document.getElementById("currentRankNew").style.bottom =
      8 +
      76 *
        ((rankPoints2 - notes.length * 0.9) /
          (notes.length * 0.95 - notes.length * 0.9)) +
      "vh";
  } else if (rankPoints2 / notes.length >= 0.8) {
    document.getElementById("rank").innerHTML = "B";
    document.getElementById("currentRankNew").innerHTML = "B";
    document.getElementById("rankBarInner").style["clip-path"] =
      "inset(" +
      (80 -
        80 *
          ((rankPoints2 - notes.length * 0.8) /
            (notes.length * 0.9 - notes.length * 0.8))) +
      "vh 0 0 0)";
    document.getElementById("currentRankNew").style.bottom =
      8 +
      76 *
        ((rankPoints2 - notes.length * 0.8) /
          (notes.length * 0.9 - notes.length * 0.8)) +
      "vh";
  } else if (rankPoints2 / notes.length >= 0.65) {
    document.getElementById("rank").innerHTML = "C";
    document.getElementById("currentRankNew").innerHTML = "C";
    document.getElementById("rankBarInner").style["clip-path"] =
      "inset(" +
      (80 -
        80 *
          ((rankPoints2 - notes.length * 0.65) /
            (notes.length * 0.8 - notes.length * 0.65))) +
      "vh 0 0 0)";
    document.getElementById("currentRankNew").style.bottom =
      8 +
      76 *
        ((rankPoints2 - notes.length * 0.65) /
          (notes.length * 0.8 - notes.length * 0.65)) +
      "vh";
  } else if (rankPoints2 / notes.length >= 0.5) {
    document.getElementById("rank").innerHTML = "D";
    document.getElementById("currentRankNew").innerHTML = "D";
    document.getElementById("rankBarInner").style["clip-path"] =
      "inset(" +
      (80 -
        80 *
          ((rankPoints2 - notes.length * 0.5) /
            (notes.length * 0.65 - notes.length * 0.5))) +
      "vh 0 0 0)";
    document.getElementById("currentRankNew").style.bottom =
      8 +
      76 *
        ((rankPoints2 - notes.length * 0.5) /
          (notes.length * 0.65 - notes.length * 0.5)) +
      "vh";
  } else {
    document.getElementById("rank").innerHTML = "F";
    document.getElementById("currentRankNew").innerHTML = "F";
    document.getElementById("rankBarInner").style["clip-path"] =
      "inset(" + (80 - 80 * (rankPoints2 / (notes.length * 0.5))) + "vh 0 0 0)";
    document.getElementById("currentRankNew").style.bottom =
      8 + 76 * (rankPoints2 / (notes.length * 0.5)) + "vh";
  }
  if (rankPoints2 <= 0) {
    document.getElementById("rankBarInner").style["clip-path"] =
      "inset(80vh 0 0 0)";
    document.getElementById("currentRankNew").style.bottom = "8vh";
  }
  if (miss == 0) {
    document.getElementById("rank").innerHTML = "SS";
  }
}

// pages
// 1) main page
// 2) main levels
// 3) main results
// 4) settings
// 5) online
// 6) queue page for live
// 7) In Queue
// 8) Changing Queue

// zxzxzxzxzxzx tmrw fix:
// add graphics for perfect note
// finish some songs

var notesList1 = [];
var notesList2 = [];
var notesList3 = [];
var notesList4 = [];

function showWaitingLiveLobby() {
  document.getElementById("screenLobby").style =
    "visibility: visible; opacity: 100%";
  document.getElementById("header").style = "top: 0";
  document.getElementById("screenGame").style =
    "opacity: 0; visibility: hidden;";
  document.getElementById("screenLive").style = "right: 0";
}

function sendSystemMessage(message) {
  var chatelem = document.createElement("div");
  chatelem.setAttribute("class", "chat-element");
  var chatelemAuthor = document.createElement("p");
  var chatelemText = document.createElement("p");
  chatelemAuthor.setAttribute("class", "chat-system");
  chatelemText.setAttribute("class", "chat-text");
  chatelemAuthor.textContent = "[SYSTEM]";
  chatelemText.textContent = " " + message;
  chatelem.appendChild(chatelemAuthor);
  chatelem.appendChild(chatelemText);
  document.getElementById("chat-box").appendChild(chatelem);
  document.getElementById("chat-box").scrollTop =
    document.getElementById("chat-box").scrollHeight;
}

function showMusic(name) {
  document.getElementById("musicPlaying").innerHTML = "♫ " + name;
  document.getElementById("musicPlaying").style.visibility = "visible";
  document.getElementById("musicPlaying").style.bottom = "5vh";
  setTimeout(function () {
    document.getElementById("musicPlaying").style.bottom = "-5vh";
    document.getElementById("musicPlaying").style.visibility = "hidden";
  }, 2000);
}

backgaudio.on("fade", function () {
  backgaudio.stop();
  backgaudio.volume(1);
});

function isItemInArray(array, item) {
  for (var i = 0; i < array.length; i++) {
    // This if statement depends on the format of your array
    if (array[i][0] == item[0] && array[i][1] == item[1]) {
      return i; // Found it
    }
  }
  return false; // Not found
}

function interval(duration, fn) {
  var _this = this;
  _this.baseline = undefined;

  _this.run = function () {
    if (_this.baseline === undefined) {
      _this.baseline = new Date().getTime();
    }
    fn();
    _this.end = new Date().getTime();
    _this.baseline += duration;

    _this.nextTick = duration - (_this.end - _this.baseline);
    if (_this.nextTick < 0) {
      _this.nextTick = 0;
    }

    if (_this.run !== undefined) {
      _this.timer = setTimeout(function () {
        _this.run();
      }, _this.nextTick);
    }
  };

  _this.stop = function () {
    clearTimeout(_this.timer);
    _this.run = undefined;
  };
}

if (
  localStorage.getItem("keybind1") == null ||
  localStorage.getItem("keybind2") == null ||
  localStorage.getItem("keybind3") == null ||
  localStorage.getItem("keybind4") == null ||
  localStorage.getItem("keybind1") == "" ||
  localStorage.getItem("keybind2") == "" ||
  localStorage.getItem("keybind3") == "" ||
  localStorage.getItem("keybind4") == ""
) {
  localStorage.setItem("keybind1", "a");
  localStorage.setItem("keybind2", "s");
  localStorage.setItem("keybind3", "k");
  localStorage.setItem("keybind4", "l");
  document.getElementById("keybind1").value = "a";
  document.getElementById("score1").innerHTML = "A";
  document.getElementById("keybind2").value = "s";
  document.getElementById("score2").innerHTML = "S";
  document.getElementById("keybind3").value = "k";
  document.getElementById("score3").innerHTML = "K";
  document.getElementById("keybind4").value = "l";
  document.getElementById("score4").innerHTML = "L";
}

document.getElementById("keybind1").value = localStorage
  .getItem("keybind1")
  .toUpperCase();
document.getElementById("keybind2").value = localStorage
  .getItem("keybind2")
  .toUpperCase();
document.getElementById("keybind3").value = localStorage
  .getItem("keybind3")
  .toUpperCase();
document.getElementById("keybind4").value = localStorage
  .getItem("keybind4")
  .toUpperCase();
document.getElementById("score1").innerHTML = document
  .getElementById("keybind1")
  .value.toUpperCase();
document.getElementById("score2").innerHTML = document
  .getElementById("keybind2")
  .value.toUpperCase();
document.getElementById("score3").innerHTML = document
  .getElementById("keybind3")
  .value.toUpperCase();
document.getElementById("score4").innerHTML = document
  .getElementById("keybind4")
  .value.toUpperCase();

document.getElementById("keybind1").oninput = function () {
  localStorage.setItem(
    "keybind1",
    document.getElementById("keybind1").value.toLowerCase()
  );
  document.getElementById("keybind1").value = document
    .getElementById("keybind1")
    .value.toUpperCase();
  document.getElementById("score1").innerHTML = document
    .getElementById("keybind1")
    .value.toUpperCase();
};

document.getElementById("keybind2").oninput = function () {
  localStorage.setItem(
    "keybind2",
    document.getElementById("keybind2").value.toLowerCase()
  );
  document.getElementById("keybind2").value = document
    .getElementById("keybind2")
    .value.toUpperCase();
  document.getElementById("score2").innerHTML = document
    .getElementById("keybind1")
    .value.toUpperCase();
};

document.getElementById("keybind3").oninput = function () {
  localStorage.setItem(
    "keybind3",
    document.getElementById("keybind3").value.toLowerCase()
  );
  document.getElementById("keybind3").value = document
    .getElementById("keybind3")
    .value.toUpperCase();
  document.getElementById("score3").innerHTML = document
    .getElementById("keybind1")
    .value.toUpperCase();
};

document.getElementById("keybind4").oninput = function () {
  localStorage.setItem(
    "keybind4",
    document.getElementById("keybind4").value.toLowerCase()
  );
  document.getElementById("keybind4").value = document
    .getElementById("keybind4")
    .value.toUpperCase();
  document.getElementById("score4").innerHTML = document
    .getElementById("keybind1")
    .value.toUpperCase();
};

document.getElementById("main").onclick = function () {
  document.getElementById("screen1").style = "right: -100vw;";
  document.getElementById("screen2").style = "right: 0vw;";
  document.getElementById("back").style = "left: 0vw;";
  page = 2;
};

document.getElementById("live").onclick = function () {
  if (document.getElementById("live").classList.contains("disabled") == false) {
    document.getElementById("screenOnline").style = "right: -100vw;";
    document.getElementById("screenLive").style = "right: 0vw;";
    document.getElementById("back").style = "left: 0vw;";
    page = 6;
  }
};

document.getElementById("online").onclick = function () {
  document.getElementById("screen1").style = "right: -100vw;";
  document.getElementById("screenOnline").style = "right: 0vw;";
  document.getElementById("back").style = "left: 0vw;";
  page = 5;
  socket.emit("checkAccount", localStorage.getItem("userToken"));
  document.getElementById("modal").innerHTML = "CONNECTING TO SERVER...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
  socket.emit("1ping");
};

socket.on("1pong", function () {
  document.getElementById("modal").style = "visibility: hidden; opacity: 0%;";
});

document.getElementById("closeStart").onclick = function () {
  if (document.getElementById("startScreen").getAttribute("style") == null) {
    backgaudio.play();
    showMusic(
      musics[
        backgaudio._src.split("assets/sound/music/")[1].split(".mp3")[0] - 1
      ]
    );
  }
  document.getElementById("startScreen").style =
    "top: 100vh; opacity: 0%; visibility: hidden";
};

document.getElementById("settings").onclick = function () {
  document.getElementById("screen1").style = "right: -100vw;";
  document.getElementById("screenSettings").style = "right: 0vw;";
  document.getElementById("sound-slider").style = "left: -8px";
  document.getElementById("back").style = "left: 0vw;";
  page = 4;
  if (
    localStorage.getItem("keybind1") == null ||
    localStorage.getItem("keybind2") == null ||
    localStorage.getItem("keybind3") == null ||
    localStorage.getItem("keybind4") == null ||
    localStorage.getItem("keybind1") == "" ||
    localStorage.getItem("keybind2") == "" ||
    localStorage.getItem("keybind3") == "" ||
    localStorage.getItem("keybind4") == ""
  ) {
    localStorage.setItem("keybind1", "a");
    localStorage.setItem("keybind2", "s");
    localStorage.setItem("keybind3", "k");
    localStorage.setItem("keybind4", "l");
    document.getElementById("keybind1").value = "a";
    document.getElementById("score1").innerHTML = "A";
    document.getElementById("keybind2").value = "s";
    document.getElementById("score2").innerHTML = "S";
    document.getElementById("keybind3").value = "k";
    document.getElementById("score3").innerHTML = "K";
    document.getElementById("keybind4").value = "l";
    document.getElementById("score4").innerHTML = "L";
  }
};

document.getElementById("back").onclick = function () {
  if (page == 2) {
    document.getElementById("back").style = "left: -50vw;";
    document.getElementById("screen2").style = "right: -100vw;";
    document.getElementById("screen1").style = "right: 0vw;";
    page = 1;
  }
  if (page == 3) {
    document.getElementById("screenGame").style =
      "opacity: 0%; visibility: hidden;";
    document.getElementById("resultsLeft").style = "left: -100vw";
    document.getElementById("resultsRight").style = "right: -100vw";
    document.getElementById("screen2").style = "right: 0vw;";
    page = 2;
    document.getElementById("header").style = "top: -8px";
  }
  if (page == 4) {
    document.getElementById("back").style = "left: -50vw;";
    document.getElementById("screenSettings").style =
      "opacity: 0%; visibility: hidden;";
    document.getElementById("sound-slider").style = "left: 100vw";
    document.getElementById("screen1").style = "right: 0vw;";
    page = 1;
  }
  if (page == 5) {
    document.getElementById("back").style = "left: -50vw;";
    document.getElementById("screenOnline").style =
      "opacity: 0%; visibility: hidden;";
    document.getElementById("screen1").style = "right: 0vw;";
    page = 1;
    document.getElementById("modal").style = "visibility: hidden; opacity: 0%;";
  }
  if (page == 6) {
    document.getElementById("screenOnline").style =
      "opacity: 100%; visibility: visible; right: 0vw;";
    document.getElementById("screenLive").style = "right: -100vw;";
    page = 5;
  }
};

//document.getElementById("main-level8").onclick = function () {
//  socket.emit("requestBeatmap", {
//    beatmap: 8,
//  });
//  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
//  document.getElementById("modal").style =
//    "visibility: visible; opacity: 100%;";
//};

//document.getElementById("main-level9").onclick = function () {
//  socket.emit("requestBeatmap", {
//    beatmap: 9,
//  });
//  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
//  document.getElementById("modal").style =
//    "visibility: visible; opacity: 100%;";
//};

//document.getElementById("main-level10").onclick = function () {
//  socket.emit("requestBeatmap", {
//    beatmap: 10,
//  });
//  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
//  document.getElementById("modal").style =
//    "visibility: visible; opacity: 100%;";
//};

document.getElementById("main-level11").onclick = function () {
  socket.emit("requestBeatmap", {
    beatmap: 11,
  });
  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

document.getElementById("main-level13").onclick = function () {
  socket.emit("requestBeatmap", {
    beatmap: 13,
  });
  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

document.getElementById("main-level14").onclick = function () {
  socket.emit("requestBeatmap", {
    beatmap: 14,
  });
  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

document.getElementById("main-level15").onclick = function () {
  socket.emit("requestBeatmap", {
    beatmap: 15,
  });
  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

document.getElementById("main-level12").onclick = function () {
  socket.emit("requestBeatmap", {
    beatmap: 12,
  });
  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

document.getElementById("main-level7").onclick = function () {
  socket.emit("requestBeatmap", {
    beatmap: 7,
  });
  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

document.getElementById("main-level1").onclick = function () {
  socket.emit("requestBeatmap", {
    beatmap: 1,
  });
  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

document.getElementById("main-level3").onclick = function () {
  socket.emit("requestBeatmap", {
    beatmap: 3,
  });
  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

document.getElementById("main-level4").onclick = function () {
  socket.emit("requestBeatmap", {
    beatmap: 4,
  });
  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

//document.getElementById("main-level5").onclick = function () {
//  socket.emit("requestBeatmap", {
//    beatmap: 5,
//    password: prompt(
//      "This level is set to require a password to play. Please type it here."
//    ),
//  });
//  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
//  document.getElementById("modal").style =
//    "visibility: visible; opacity: 100%;";
//};

document.getElementById("main-level6").onclick = function () {
  socket.emit("requestBeatmap", {
    beatmap: 6,
  });
  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

socket.on("wrongBeatmapPW", function () {
  document.getElementById("modal").style = "visibility: hidden; opacity: 0%;";
  alert("Wrong password");
});

function bringEffect(status, number) {
  let elemy = document.createElement("div");
  elemy.setAttribute("class", "noteResult");
  elemy.innerHTML = status;
  if (status == "PERFECT") {
    elemy.style.color = "cyan";
  } else if (status == "GREAT") {
    elemy.style.color = "lime";
  } else if (status == "OKAY") {
    elemy.style.color = "goldenrod";
  } else if (status == "MISS") {
    elemy.style.color = "crimson";
  }
  let vh = 0;
  if (number == 1) {
    vh = -18;
  }
  if (number == 2) {
    vh = -6;
  }
  if (number == 3) {
    vh = 6;
  }
  if (number == 4) {
    vh = 18;
  }
  elemy.style.left = vh + "vh";
  document.getElementById("screenGameHolder").appendChild(elemy);
  setTimeout(function () {
    elemy.remove();
  }, 1000);
}

var noteList = [];

document.onkeydown = function (e) {
  e = e || window.event;
  var key = e.key;
  console.log(Math.round(beatno * 2) / 2);
  if (key.toLowerCase() === localStorage.getItem("keybind1")) {
    noteList.push([Math.round(beatno), 1]);
  }
  if (key.toLowerCase() === localStorage.getItem("keybind2")) {
    noteList.push([Math.round(beatno), 2]);
  }
  if (key.toLowerCase() === localStorage.getItem("keybind3")) {
    noteList.push([Math.round(beatno), 3]);
  }
  if (key.toLowerCase() === localStorage.getItem("keybind4")) {
    noteList.push([Math.round(beatno), 4]);
  }

  if (combo >= 100) {
    document.getElementById("combowrapper").style =
      "background: radial-gradient(rgb(68 80 255), rgb(199 0 199))";
  } else {
    document.getElementById("combowrapper").style = "";
  }
  document.getElementById("currentAcc").innerHTML =
    (
      ((100 * ok + 200 * great + 300 * perfect) /
        (300 * (miss + ok + great + perfect))) *
      100
    ).toFixed(2) + "%";
  document.getElementById("accuracy").innerHTML =
    (
      ((100 * ok + 200 * great + 300 * perfect) /
        (300 * (miss + ok + great + perfect))) *
      100
    ).toFixed(2) + "%";
  if (document.getElementById("currentAcc").innerHTML == "NaN%") {
    document.getElementById("currentAcc").innerHTML = "100.00%";
    document.getElementById("accuracy").innerHTML = "100.00%";
  }
  if (key === "Backspace") {
    if (inGame == 1 && competitive == 0) {
      if (exitingGame == 0) {
        exitingGame = 1;
        document.getElementById("quitgame").style = "font-size: 3vh";
        if (exitingGame == 1) {
          document.getElementById("quitgame").innerHTML =
            "Hold Backspace for 3 more seconds to quit game.";
          setTimeout(function () {
            if (exitingGame == 1) {
              document.getElementById("quitgame").innerHTML =
                "Hold Backspace for 2 more seconds to quit game.";
              setTimeout(function () {
                if (exitingGame == 1) {
                  document.getElementById("quitgame").innerHTML =
                    "Hold Backspace for 1 more second to quit game.";
                  setTimeout(function () {
                    if (exitingGame == 1) {
                      document.getElementById("quitgame").style =
                        "opacity: 0%; visibility: hidden;";
                      cursong.fade(1, 0, 500);
                      document.getElementById("quitgame").innerHTML = "";
                      inGame = 0;
                      finish.stop();
                      var paras = document.getElementsByClassName("noteResult");
                      while (paras[0]) {
                        paras[0].parentNode.removeChild(paras[0]);
                      }
                      page = 3;
                      document.getElementById("back").style = "left: 0vw;";
                      document.getElementById("resultsLeft").style =
                        "left: 0vw";
                      document.getElementById("resultsRight").style =
                        "right: 0vw";
                      document.getElementById("scoreholder").style =
                        "opacity: 0%; visibility: hidden;";
                      inGame = 0;
                      document.getElementById("amt-perfect").innerHTML =
                        perfect;
                      document.getElementById("amt-great").innerHTML = great;
                      document.getElementById("amt-ok").innerHTML = ok;
                      document.getElementById("amt-miss").innerHTML = miss;
                      document.getElementById("score").innerHTML = currentScore;
                      miss = 99999;
                      backgaudio.play();
                    } else {
                      document.getElementById("quitgame").style =
                        "font-size: 1.5vh";
                      document.getElementById("quitgame").innerHTML =
                        "Hold Backspace for 3 seconds to quit game.";
                    }
                  }, 1000);
                } else {
                  document.getElementById("quitgame").style =
                    "font-size: 1.5vh";
                  document.getElementById("quitgame").innerHTML =
                    "Hold Backspace for 3 seconds to quit game.";
                }
              }, 1000);
            } else {
              document.getElementById("quitgame").style = "font-size: 1.5vh";
              document.getElementById("quitgame").innerHTML =
                "Hold Backspace for 3 seconds to quit game.";
            }
          }, 1000);
        } else {
          document.getElementById("quitgame").style = "font-size: 1.5vh";
          document.getElementById("quitgame").innerHTML =
            "Hold Backspace for 3 seconds to quit game.";
        }
      }
    }
  }
  if (key.toLowerCase() === localStorage.getItem("keybind1") && hold1 == 0) {
    hold1 = 1;
    document.getElementById("score1").style.background =
      "linear-gradient(to bottom,rgba(0, 0, 0, 0.5) 88.25%,rgb(255 255 255 / 100%) 90.25%,rgb(0 255 152 / 75%) 93.75%,rgba(0, 0, 0, 0.5) 95.75%)";
    if (inGame == 1) {
      // now, check the closest beat and see if there is one within click distance.
      let noteIndex = 9999999;
      let currentTiming = 9999999;
      if (notesList1.length >= 1) {
        noteIndex = notesList1[0][0];
        currentTiming = notesList1[0][1];
      }
      let abscurrent = Math.abs(beatno - currentTiming);
      if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.2) {
        try {
          notesList1.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList1.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 1;
          updateRank();
          bringEffect("PERFECT", 1);
          perfect += 1;
          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;
          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.perfect += 1;
        } catch (err) {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 1);
          miss += 1;
          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";
          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.4) {
        try {
          notesList1.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList1.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 0.67;
          updateRank();
          bringEffect("GREAT", 1);
          great += 1;
          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.great += 1;
        } catch {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 1);
          miss += 1;

          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.6) {
        try {
          notesList1.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList1.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 0.33;
          updateRank();
          bringEffect("OKAY", 1);
          ok += 1;

          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.ok += 1;
        } catch {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 1);
          miss += 1;
          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 4) {
        liveGameData.eachNoteScores.push(1);
        rankPoints2 -= 0.5;
        updateRank();
        bringEffect("MISS", 1);
        miss += 1;

        document.getElementById("currentAcc").innerHTML =
          (
            ((100 * ok + 200 * great + 300 * perfect) /
              (300 * (miss + ok + great + perfect))) *
            100
          ).toFixed(2) + "%";
        document.getElementById("accuracy").innerHTML =
          (
            ((100 * ok + 200 * great + 300 * perfect) /
              (300 * (miss + ok + great + perfect))) *
            100
          ).toFixed(2) + "%";
        currentScore -= 300;
        document.getElementById("currentScore").innerHTML = currentScore;
        combo = 0;
        multiplier = 1.0;
        document.getElementById("currentCombo").innerHTML = "0";
        document.getElementById("multiplier").innerHTML = "x1.00";
        liveGameData.currentScore = currentScore;
      }
    }
  } else if (
    key.toLowerCase() === localStorage.getItem("keybind2") &&
    hold2 == 0
  ) {
    hold2 = 1;
    document.getElementById("score2").style.background =
      "linear-gradient(to bottom,rgba(0, 0, 0, 0.5) 88.25%,rgb(255 255 255 / 100%) 90.25%,rgb(0 255 152 / 75%) 93.75%,rgba(0, 0, 0, 0.5) 95.75%)";
    if (inGame == 1) {
      // now, check the closest beat and see if there is one within click distance.
      let noteIndex = 9999999;
      let currentTiming = 9999999;
      if (notesList2.length >= 1) {
        noteIndex = notesList2[0][0];
        currentTiming = notesList2[0][1];
      }
      let abscurrent = Math.abs(beatno - currentTiming);
      if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.2) {
        try {
          notesList2.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList2.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 1;
          updateRank();
          bringEffect("PERFECT", 2);
          perfect += 1;

          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.perfect += 1;
        } catch (err) {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 2);
          miss += 1;

          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.4) {
        try {
          notesList2.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList2.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 0.67;
          updateRank();
          bringEffect("GREAT", 2);
          great += 1;
          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.great += 1;
        } catch {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 2);
          miss += 1;

          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.6) {
        try {
          notesList2.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList2.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 0.33;
          updateRank();
          bringEffect("OKAY", 2);
          ok += 1;

          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.ok += 1;
        } catch {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 2);
          miss += 1;

          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 4) {
        liveGameData.eachNoteScores.push(1);
        rankPoints2 -= 0.5;
        updateRank();
        bringEffect("MISS", 2);
        miss += 1;

        document.getElementById("currentAcc").innerHTML =
          (
            ((100 * ok + 200 * great + 300 * perfect) /
              (300 * (miss + ok + great + perfect))) *
            100
          ).toFixed(2) + "%";
        document.getElementById("accuracy").innerHTML =
          (
            ((100 * ok + 200 * great + 300 * perfect) /
              (300 * (miss + ok + great + perfect))) *
            100
          ).toFixed(2) + "%";
        currentScore -= 300;
        document.getElementById("currentScore").innerHTML = currentScore;
        combo = 0;
        multiplier = 1.0;
        document.getElementById("currentCombo").innerHTML = "0";
        document.getElementById("multiplier").innerHTML = "x1.00";
        liveGameData.currentScore = currentScore;
      }
    }
  } else if (
    key.toLowerCase() === localStorage.getItem("keybind3") &&
    hold3 == 0
  ) {
    hold3 = 1;
    document.getElementById("score3").style.background =
      "linear-gradient(to bottom,rgba(0, 0, 0, 0.5) 88.25%,rgb(255 255 255 / 100%) 90.25%,rgb(0 255 152 / 75%) 93.75%,rgba(0, 0, 0, 0.5) 95.75%)";
    if (inGame == 1) {
      // now, check the closest beat and see if there is one within click distance.
      let noteIndex = 9999999;
      let currentTiming = 9999999;
      if (notesList3.length >= 1) {
        noteIndex = notesList3[0][0];
        currentTiming = notesList3[0][1];
      }
      let abscurrent = Math.abs(beatno - currentTiming);

      if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.2) {
        try {
          notesList3.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList3.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 1;
          updateRank();
          bringEffect("PERFECT", 3);
          perfect += 1;

          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.perfect += 1;
        } catch {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 3);
          miss += 1;

          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.4) {
        try {
          notesList3.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList3.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 0.67;
          updateRank();
          bringEffect("GREAT", 3);
          great += 1;

          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.great += 1;
        } catch {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 3);
          miss += 1;

          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.6) {
        try {
          notesList3.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList3.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 0.33;
          updateRank();
          bringEffect("OKAY", 3);
          ok += 1;

          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.ok += 1;
        } catch {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 3);
          miss += 1;

          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 4) {
        liveGameData.eachNoteScores.push(1);
        rankPoints2 -= 0.5;
        updateRank();
        bringEffect("MISS", 3);
        miss += 1;

        document.getElementById("currentAcc").innerHTML =
          (
            ((100 * ok + 200 * great + 300 * perfect) /
              (300 * (miss + ok + great + perfect))) *
            100
          ).toFixed(2) + "%";
        document.getElementById("accuracy").innerHTML =
          (
            ((100 * ok + 200 * great + 300 * perfect) /
              (300 * (miss + ok + great + perfect))) *
            100
          ).toFixed(2) + "%";
        currentScore -= 300;
        document.getElementById("currentScore").innerHTML = currentScore;
        combo = 0;
        multiplier = 1.0;
        document.getElementById("currentCombo").innerHTML = "0";
        document.getElementById("multiplier").innerHTML = "x1.00";
        liveGameData.currentScore = currentScore;
      }
    }
  } else if (
    key.toLowerCase() === localStorage.getItem("keybind4") &&
    hold4 == 0
  ) {
    hold4 = 1;
    document.getElementById("score4").style.background =
      "linear-gradient(to bottom,rgba(0, 0, 0, 0.5) 88.25%,rgb(255 255 255 / 100%) 90.25%,rgb(0 255 152 / 75%) 93.75%,rgba(0, 0, 0, 0.5) 95.75%)";
    if (inGame == 1) {
      // now, check the closest beat and see if there is one within click distance.
      let noteIndex = 9999999;
      let currentTiming = 9999999;
      if (notesList4.length >= 1) {
        noteIndex = notesList4[0][0];
        currentTiming = notesList4[0][1];
      }
      let abscurrent = Math.abs(beatno - currentTiming);

      if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.2) {
        try {
          notesList4.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList4.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 1;
          updateRank();
          bringEffect("PERFECT", 4);
          perfect += 1;

          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.perfect += 1;
        } catch {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 4);
          miss += 1;

          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.4) {
        try {
          notesList4.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList4.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 0.67;
          updateRank();
          bringEffect("GREAT", 4);
          great += 1;

          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.great += 1;
        } catch {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 4);
          miss += 1;

          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 0.6) {
        try {
          notesList4.forEach(function (notelistnote, index) {
            if (
              notelistnote[0] == noteIndex &&
              notelistnote[1] == currentTiming
            ) {
              notesList4.splice(index, 1);
            }
          });
          document.getElementById("gameBeat" + noteIndex).remove();
          rankPoints2 += 0.33;
          updateRank();
          bringEffect("OKAY", 4);
          ok += 1;
          combo += 1;
          if (
            combo >
            Number.parseInt(document.getElementById("maxcombo").innerHTML)
          ) {
            document.getElementById("maxcombo").innerHTML = combo;
          }
          if (multiplier < 2.0) {
            multiplier += 0.01;
            multiplier = Number.parseFloat(multiplier.toFixed(2));
          }
          document.getElementById("multiplier").innerHTML = "x" + multiplier;
          currentScore += Math.round((0.8 - abscurrent) * 1250 * multiplier);
          document.getElementById("currentScore").innerHTML = currentScore;

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.totalNotes += 1;
          liveGameData.currentScore = currentScore;
          liveGameData.eachNoteScores.push(abscurrent);

          liveGameData.eachNoteTiming.ok += 1;
        } catch {
          liveGameData.eachNoteScores.push(1);
          rankPoints2 -= 0.5;
          updateRank();
          bringEffect("MISS", 4);
          miss += 1;

          document.getElementById("currentAcc").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          document.getElementById("accuracy").innerHTML =
            (
              ((100 * ok + 200 * great + 300 * perfect) /
                (300 * (miss + ok + great + perfect))) *
              100
            ).toFixed(2) + "%";
          currentScore -= 300;
          document.getElementById("currentScore").innerHTML = currentScore;

          combo = 0;
          multiplier = 1.0;
          document.getElementById("currentCombo").innerHTML = "0";
          document.getElementById("multiplier").innerHTML = "x1.00";

          document.getElementById("currentCombo").innerHTML = combo;
          liveGameData.currentScore = currentScore;
        }
      } else if (Number.parseFloat(abscurrent.toFixed(2)) <= 4) {
        liveGameData.eachNoteScores.push(1);
        rankPoints2 -= 0.5;
        updateRank();
        bringEffect("MISS", 4);
        miss += 1;

        document.getElementById("currentAcc").innerHTML =
          (
            ((100 * ok + 200 * great + 300 * perfect) /
              (300 * (miss + ok + great + perfect))) *
            100
          ).toFixed(2) + "%";
        document.getElementById("accuracy").innerHTML =
          (
            ((100 * ok + 200 * great + 300 * perfect) /
              (300 * (miss + ok + great + perfect))) *
            100
          ).toFixed(2) + "%";
        currentScore -= 300;
        document.getElementById("currentScore").innerHTML = currentScore;
        combo = 0;
        multiplier = 1.0;
        document.getElementById("currentCombo").innerHTML = "0";
        document.getElementById("multiplier").innerHTML = "x1.00";
        liveGameData.currentScore = currentScore;
      }
    }
  }
};

document.onkeyup = function (e) {
  e = e || window.event;
  var key = e.key;
  if (key === "Backspace") {
    if (inGame == 1) {
      if (exitingGame == 1) {
        exitingGame = 0;
        document.getElementById("quitgame").style = "font-size: 1.5vh";
        document.getElementById("quitgame").innerHTML =
          "Hold Backspace for 3 seconds to quit game.";
      }
    }
  }
  if (key.toLowerCase() === localStorage.getItem("keybind1")) {
    hold1 = 0;
    document.getElementById("score1").style.background = "";
  } else if (key.toLowerCase() === localStorage.getItem("keybind2")) {
    hold2 = 0;

    document.getElementById("score2").style.background = "";
  } else if (key.toLowerCase() === localStorage.getItem("keybind3")) {
    hold3 = 0;

    document.getElementById("score3").style.background = "";
  } else if (key.toLowerCase() === localStorage.getItem("keybind4")) {
    hold4 = 0;

    document.getElementById("score4").style.background = "";
  }
};

function bringNote(number, secs, beat) {
  let notenum = isItemInArray(notes, [beat + 4, number]);
  let elem = document.createElement("div");
  elem.setAttribute("class", "note");
  elem.setAttribute("id", "gameBeat" + notenum);
  // [note number (id), beat number (beatno)]
  if (number == 1) {
    notesList1.push([notenum, beat + 4]);
  }
  if (number == 2) {
    notesList2.push([notenum, beat + 4]);
  }
  if (number == 3) {
    notesList3.push([notenum, beat + 4]);
  }
  if (number == 4) {
    notesList4.push([notenum, beat + 4]);
  }
  let vh = 12.5 * number - 37.5;
  elem.style =
    "bottom: 100vh; left: calc(" +
    vh +
    "vh + 50vw + 7px); animation-duration: " +
    secs * 1.26 +
    "s";
  document.getElementById("screenGameHolder").appendChild(elem);
  setTimeout(function () {
    try {
      if (number == 1) {
        notesList1.forEach(function (note, index) {
          if (note[0] == notenum && note[1] == beat + 4) {
            notesList1.splice(index, 1);
          }
        });
      }
      if (number == 2) {
        notesList2.forEach(function (note, index) {
          if (note[0] == notenum && note[1] == beat + 4) {
            notesList2.splice(index, 1);
          }
        });
      }
      if (number == 3) {
        notesList3.forEach(function (note, index) {
          if (note[0] == notenum && note[1] == beat + 4) {
            notesList3.splice(index, 1);
          }
        });
      }
      if (number == 4) {
        notesList4.forEach(function (note, index) {
          if (note[0] == notenum && note[1] == beat + 4) {
            notesList4.splice(index, 1);
          }
        });
      }
      document
        .getElementById("gameBeat" + isItemInArray(notes, [beat + 4, number]))
        .remove();
      liveGameData.eachNoteScores.push(1);
      rankPoints2 -= 0.5;
      updateRank();
      bringEffect("MISS", number);
      miss += 1;

      document.getElementById("currentAcc").innerHTML =
        (
          ((100 * ok + 200 * great + 300 * perfect) /
            (300 * (miss + ok + great + perfect))) *
          100
        ).toFixed(2) + "%";
      document.getElementById("accuracy").innerHTML =
        (
          ((100 * ok + 200 * great + 300 * perfect) /
            (300 * (miss + ok + great + perfect))) *
          100
        ).toFixed(2) + "%";
      currentScore -= 300;
      document.getElementById("currentScore").innerHTML = currentScore;
      combo = 0;
      multiplier = 1.0;
      document.getElementById("currentCombo").innerHTML = "0";
      document.getElementById("multiplier").innerHTML = "x1.00";
      document.getElementById("currentCombo").innerHTML = combo;
      liveGameData.currentScore = currentScore;
    } catch {}
  }, secs * 1260);
  // 'secs' is the number of seconds it takes to bring a note down
  // work on this tomorrow - it takes 4 beats to bring a note down.
}

function gameSeek(beat) {
  beatno = beat;
  cursong.seek((beat / datas.bpm) * 60 + datas.offsetsec);
}

socket.on("beatmapReturned", (data) => {
  songLength = data.length;
  document.getElementById("performance").innerHTML = "Incomplete";
  document.getElementById("currentRankNew").innerHTML = "F";
  document.getElementById("currentRankNew").style = "";
  document.getElementById("rankBarInner").style = "";
  rankPoints2 = 0;
  notesList1 = [];
  notesList2 = [];
  notesList3 = [];
  notesList4 = [];
  competitive = 0;
  backgaudio.fade(1, 0, 500);
  datas = data;
  document.getElementById("maxcombo").innerHTML = "0";
  document.getElementById("scoreholder").style =
    "opacity: 100%; visibility: visible;";
  document.getElementById("combowrapper").style = "";
  document.getElementById("modal").style = "visibility: hidden; opacity: 0%;";
  document.getElementById("back").style = "left: -50vw;";
  document.getElementById("screen2").style = "right: -100vw;";
  document.getElementById("header").style = "top: calc(-16px + -6.8vh)";
  new Howl({
    src: ["start.mp3"],
  }).play();
  inGame = 1;
  multiplier = 1.0;
  combo = 0;
  currentScore = 0;
  perfect = 0;
  great = 0;
  ok = 0;
  miss = 0;
  document.getElementById("score1").innerHTML = document
    .getElementById("keybind1")
    .value.toUpperCase();
  document.getElementById("score2").innerHTML = document
    .getElementById("keybind2")
    .value.toUpperCase();
  document.getElementById("score3").innerHTML = document
    .getElementById("keybind3")
    .value.toUpperCase();
  document.getElementById("score4").innerHTML = document
    .getElementById("keybind4")
    .value.toUpperCase();
  if (
    localStorage.getItem("keybind1") == null ||
    localStorage.getItem("keybind2") == null ||
    localStorage.getItem("keybind3") == null ||
    localStorage.getItem("keybind4") == null ||
    localStorage.getItem("keybind1") == "" ||
    localStorage.getItem("keybind2") == "" ||
    localStorage.getItem("keybind3") == "" ||
    localStorage.getItem("keybind4") == ""
  ) {
    localStorage.setItem("keybind1", "a");
    localStorage.setItem("keybind2", "s");
    localStorage.setItem("keybind3", "k");
    localStorage.setItem("keybind4", "l");
    document.getElementById("keybind1").value = "a";
    document.getElementById("score1").innerHTML = "A";
    document.getElementById("keybind2").value = "s";
    document.getElementById("score2").innerHTML = "S";
    document.getElementById("keybind3").value = "k";
    document.getElementById("score3").innerHTML = "K";
    document.getElementById("keybind4").value = "l";
    document.getElementById("score4").innerHTML = "L";
  }
  document.getElementById("quitgame").innerHTML =
    "Hold Backspace for 3 seconds to quit game.";
  document.getElementById("quitgame").style = "";
  document.getElementById("screenGame").style =
    "opacity: 100%; visibility: visible;";
  document.getElementById("currentScore").innerHTML = "0";
  document.getElementById("currentAcc").innerHTML = "100.00%";
  document.getElementById("currentCombo").innerHTML = "0";
  document.getElementById("multiplier").innerHTML = "x1.00";
  setTimeout(function () {
    notes = data.notes;
    cursong = new Howl({
      src: [data.originalid + ".mp3"],
    });
    cursong.on("fade", function () {
      cursong.stop();
      cursong.volume(1);
      cursong.unload();
    });
    cursong.on("end", function () {
      cursong.unload();
    });
    cursong.unload();
    cursong.load();
    cursong.once("load", function () {
      setTimeout(function () {
        beatno = -8;
        finish = new interval((60 / data.bpm) * 50, function () {
          if (
            beatno ==
            (
              Math.ceil(0 - (datas.offsetsec / 60) * datas.bpm * 20) / 20
            ).toFixed(2)
          ) {
            cursong.play();
          }
          beatno += 0.05;
          beatno = Math.round(beatno * 1000) / 1000;
          if ((beatno - 1) % 16 == 0) {
            cursong.seek((beatno / datas.bpm) * 60 + datas.offsetsec);
          }
          if (beatno % 1 == 0) {
          }
          data.notes.forEach((note) => {
            if (note[0] - 4 == beatno) {
              // bring the note down
              bringNote(note[1], 240 / data.bpm, beatno);
            }
            if (note[0] == beatno) {
              // fix beatmaps 1, 4, and 5
            }
          });
          if (beatno >= data.totalBeats) {
            // end
            finish.stop();
            var paras = document.getElementsByClassName("noteResult");
            while (paras[0]) {
              paras[0].parentNode.removeChild(paras[0]);
            }
            page = 3;
            document.getElementById("back").style = "left: 0vw;";
            document.getElementById("resultsLeft").style = "left: 0vw";
            document.getElementById("resultsRight").style = "right: 0vw";
            document.getElementById("scoreholder").style =
              "opacity: 0%; visibility: hidden;";
            inGame = 0;
            document.getElementById("amt-perfect").innerHTML = perfect;
            document.getElementById("amt-great").innerHTML = great;
            document.getElementById("amt-ok").innerHTML = ok;
            document.getElementById("amt-miss").innerHTML = miss;
            document.getElementById("score").innerHTML = currentScore;
            document.getElementById("performance").innerHTML = (
              (rankPoints2 / notes.length) *
              Math.pow(notes.length / songLength, 2) *
              10
            ).toFixed(2);
            backgaudio.play();
          }
        });
        finish.run();
      }, 2000);
    });
  }, 200);
});

socket.on("checkedAccount", (data) => {
  if (data == true) {
    try {
      document.getElementById("noAccountScreen").remove();
    } catch {}
  }
});

function login() {
  sessionStorage.setItem("dir", "jsb");
  window.location.href = "../champion";
}

document.getElementById("agreeNoCheat").onchange = function () {
  if (document.getElementById("agreeNoCheat").checked == true) {
    document.getElementById("warningScreen").remove();
    document.getElementById("live").setAttribute("class", "select3");
    localStorage.setItem("agreeNoCheat", "true");
  }
};

if (localStorage.getItem("agreeNoCheat") == "true") {
  document.getElementById("warningScreen").remove();
  document.getElementById("live").setAttribute("class", "select3");
}

document.getElementById("startMatchmaking").onclick = function () {
  if (
    document
      .getElementById("startMatchmaking")
      .classList.contains("disabled") == false
  ) {
    document
      .getElementById("startMatchmaking")
      .setAttribute("class", "disabled");
    socket.emit("startMatchmakingJSB", localStorage.getItem("userToken"));
    document.getElementById("matchmakingText").innerHTML = "PLEASE WAIT";
    document.getElementById("matchmakingCapt").innerHTML =
      "Changing Queue Status";
    page = 8;
    document.getElementById("back").style = "left: -50vw;";
  }
};

setTimeout(function () {
  document.getElementById("startPopup").style =
    "opacity: 100%; transform: scale(1, 1)";
}, 1000);

socket.on("appError", (data) => {
  document.getElementById("noticeModal").style =
    "opacity: 100%; visibility: visible;";
  document.getElementById("noticePopup").style =
    "opacity: 100%; visibility: visible; transform: translate(-50%, -50%) scale(1, 1)";
  document.getElementById("noticeNotify").innerHTML = "NOTICE";
  document.getElementById("noticeText").innerHTML = "App Error: " + data;
  // exit queue
  document.getElementById("startMatchmaking").removeAttribute("class");
  document.getElementById("startMatchmaking").style = "";
  document.getElementById("matchmakingText").innerHTML = "FIND A MATCH";
  document.getElementById("matchmakingCapt").innerHTML =
    "Match with random players and play a song, highest score wins.";
  page = 6;
  document.getElementById("back").style = "left: 0vw;";
});

socket.on("matchmakingStartedJSB", function () {
  document.getElementById("startMatchmaking").style =
    "background: linear-gradient(to left,rgb(78 0 0 / 75%),rgb(255 0 0 / 35%)),url(../champion/crystal.png); color: white;";
  document.getElementById("startMatchmaking").removeAttribute("class");
  queueBeginTime = new Date().getTime() / 1000;
  document.getElementById("matchmakingText").innerHTML = "IN QUEUE - 00:00";
  document.getElementById("matchmakingCapt").innerHTML =
    "Click again to dequeue. Leaving a live game results in a loss and possible queue penalties.";
  page = 7;
  document.getElementById("back").style = "left: -50vw;";
});

setInterval(function () {
  if (page == 7) {
    let SECONDS = Math.floor(new Date().getTime() / 1000 - queueBeginTime);
    if (SECONDS < 3600) {
      document.getElementById("matchmakingText").innerHTML =
        "IN QUEUE - " + new Date(SECONDS * 1000).toISOString().substr(14, 5);
    } else {
      document.getElementById("matchmakingText").innerHTML =
        "IN QUEUE - " + new Date(SECONDS * 1000).toISOString().substr(11, 8);
    }
  }
}, 250);

socket.on("endedMatchmakingJSB", function () {
  document.getElementById("startMatchmaking").removeAttribute("class");
  document.getElementById("startMatchmaking").style = "color: white;";
  document.getElementById("matchmakingText").innerHTML = "BEGIN MATCHMAKING";
  document.getElementById("matchmakingCapt").innerHTML =
    "Match with random players and play a song, highest score wins.";
  page = 6;
  document.getElementById("back").style = "left: 0vw;";
});

socket.on("disconnect", function () {
  document.getElementById("startMatchmaking").style =
    "opacity: 100%; visibility: visible";
  document.getElementById("screenLobby").style =
    "opacity: 0%; visibility: hidden";
  document.getElementById("chat-text-input").style =
    "opacity: 0%; visibility: hidden";
  page = 6;
  document.getElementById("startMatchmaking").removeAttribute("class");
  document.getElementById("startMatchmaking").style = "";
  document.getElementById("matchmakingText").innerHTML = "BEGIN MATCHMAKING";
  document.getElementById("matchmakingCapt").innerHTML =
    "Match with random players and play a song, highest score wins.";
  document.getElementById("back").style = "left: 0vw;";
});

socket.on("connect", function () {
  connecttimes += 1;
  if (connecttimes > 1) {
  }
});

document.getElementById("chat-input-form").onsubmit = function (e) {
  e.preventDefault();
  if (document.getElementById("chat-text-input").value.trim() != "") {
    socket.emit("sendChatMessageJSB", {
      token: localStorage.getItem("userToken"),
      room: localStorage.getItem("currentJSBRoom").toString(),
      message: document.getElementById("chat-text-input").value,
    });
    document.getElementById("chat-text-input").value = "";
  }
};

socket.on("JSBmatchFound", (data) => {
  document.getElementById("readyButton").removeAttribute("class");
  document.getElementById("exitButton").removeAttribute("class");
  document.getElementById("readyButton").innerHTML = "Ready";
  var paras = document.getElementsByClassName("chat-element");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  localStorage.setItem("currentJSBRoom", data._id);
  var chatelem = document.createElement("div");
  chatelem.setAttribute("class", "chat-element");
  var chatelemAuthor = document.createElement("p");
  var chatelemText = document.createElement("p");
  chatelemAuthor.setAttribute("class", "chat-system");
  chatelemText.setAttribute("class", "chat-text");
  chatelemAuthor.textContent = "[SYSTEM]";
  chatelemText.textContent =
    " " + localStorage.getItem("username") + " has joined the game!";
  chatelem.appendChild(chatelemAuthor);
  chatelem.appendChild(chatelemText);
  document.getElementById("chat-box").appendChild(chatelem);
  document.getElementById("chat-box").scrollTop =
    document.getElementById("chat-box").scrollHeight;
  sendSystemMessage(
    "Welcome to JSBeats! Reminder that cheating is prohibited and will result in ban if detected."
  );
  sendSystemMessage("The current song pool consists of:");
  sendSystemMessage("- New Hero In Town (3)");
  sendSystemMessage("- Explorers (12)");
  sendSystemMessage("- Dark Sheep (28)");
  document.getElementById("startMatchmaking").setAttribute("class", "disabled");
  page = 8;
  if (data.source == 1) {
    document.getElementById("matchmakingText").innerHTML =
      "EXISTING MATCH FOUND!";
  } else {
    document.getElementById("matchmakingText").innerHTML = "MATCH CREATED!";
  }
  document.getElementById("matchmakingCapt").innerHTML = "Joining Lobby";
  document.getElementById("startMatchmaking").style =
    "background: linear-gradient(to left, rgb(255 255 255 / 65%), rgb(255 255 255 / 80%)), url(../champion/crystal.png); color: black;";
  if (data.players[0] == undefined) {
    data.players[0] = ["Searching", "Searching", "Searching For Player"];
  }
  if (data.players[1] == undefined) {
    data.players[1] = ["Searching", "Searching", "Searching For Player"];
  }
  if (data.players[2] == undefined) {
    data.players[2] = ["Searching", "Searching", "Searching For Player"];
  }
  if (data.players[3] == undefined) {
    data.players[3] = ["Searching", "Searching", "Searching For Player"];
  }
  document.getElementById("player1Name").innerHTML = data.players[0][2];
  document.getElementById("player2Name").innerHTML = data.players[1][2];
  document.getElementById("player3Name").innerHTML = data.players[2][2];
  document.getElementById("player4Name").innerHTML = data.players[3][2];
  if (
    data.players[0][2] != "Searching For Player" &&
    data.players[0][2] != localStorage.getItem("username")
  ) {
    document.getElementById("player1Ready").innerHTML =
      "Retrieving Ready Status...";
  }
  if (
    data.players[1][2] != "Searching For Player" &&
    data.players[1][2] != localStorage.getItem("username")
  ) {
    document.getElementById("player2Ready").innerHTML =
      "Retrieving Ready Status...";
  }
  if (
    data.players[2][2] != "Searching For Player" &&
    data.players[2][2] != localStorage.getItem("username")
  ) {
    document.getElementById("player3Ready").innerHTML =
      "Retrieving Ready Status...";
  }
  if (
    data.players[3][2] != "Searching For Player" &&
    data.players[3][2] != localStorage.getItem("username")
  ) {
    document.getElementById("player4Ready").innerHTML =
      "Retrieving Ready Status...";
  }
  listPlayers = [
    document.getElementById("player1Name").innerHTML,
    document.getElementById("player2Name").innerHTML,
    document.getElementById("player3Name").innerHTML,
    document.getElementById("player4Name").innerHTML,
  ];
  if (
    document.getElementById("player1Name").innerHTML ==
    localStorage.getItem("username")
  ) {
    document.getElementById("player1Ready").innerHTML = "Not Ready";
    document.getElementById("liveUser1").setAttribute("class", "liveUserYou");
  } else {
    document.getElementById("liveUser1").setAttribute("class", "liveUser");
  }
  if (
    document.getElementById("player2Name").innerHTML ==
    localStorage.getItem("username")
  ) {
    document.getElementById("player2Ready").innerHTML = "Not Ready";
    document.getElementById("liveUser2").setAttribute("class", "liveUserYou");
  } else {
    document.getElementById("liveUser2").setAttribute("class", "liveUser");
  }
  if (
    document.getElementById("player3Name").innerHTML ==
    localStorage.getItem("username")
  ) {
    document.getElementById("player3Ready").innerHTML = "Not Ready";
    document.getElementById("liveUser3").setAttribute("class", "liveUserYou");
  } else {
    document.getElementById("liveUser3").setAttribute("class", "liveUser");
  }
  if (
    document.getElementById("player4Name").innerHTML ==
    localStorage.getItem("username")
  ) {
    document.getElementById("player4Ready").innerHTML = "Not Ready";
    document.getElementById("liveUser4").setAttribute("class", "liveUserYou");
  } else {
    document.getElementById("liveUser4").setAttribute("class", "liveUser");
  }
  data.players.forEach((player) => {
    if (data.playersReady.includes(player[0])) {
      document.getElementById(
        "player" + (data.players.indexOf(player) + 1) + "Ready"
      ).innerHTML = "READY";
    } else {
      document.getElementById(
        "player" + (data.players.indexOf(player) + 1) + "Ready"
      ).innerHTML = "Not Ready";
    }
  });
  if (
    document.getElementById("player1Name").innerHTML == "Searching For Player"
  ) {
    document.getElementById("player1Ready").innerHTML = "Searching For Player";
  }
  if (
    document.getElementById("player2Name").innerHTML == "Searching For Player"
  ) {
    document.getElementById("player2Ready").innerHTML = "Searching For Player";
  }
  if (
    document.getElementById("player3Name").innerHTML == "Searching For Player"
  ) {
    document.getElementById("player3Ready").innerHTML = "Searching For Player";
  }
  if (
    document.getElementById("player4Name").innerHTML == "Searching For Player"
  ) {
    document.getElementById("player4Ready").innerHTML = "Searching For Player";
  }
  setTimeout(function () {
    document.getElementById("startMatchmaking").style =
      "opacity: 0%; visibility: hidden";
    document.getElementById("screenLobby").style =
      "opacity: 100%; visibility: visible";
    document.getElementById("chat-text-input").style =
      "opacity: 100%; visibility: visible";
  }, 1000);
});

document.getElementById("exitButton").onclick = function () {
  if (
    document.getElementById("exitButton").classList.contains("disabled") ==
    false
  ) {
    if (exitPermit == 0) {
      socket.emit("exitLive");
    } else {
      exitPermit = 0;
      document.getElementById("startMatchmaking").style =
        "opacity: 100%; visibility: visible";
      document.getElementById("screenLobby").style =
        "opacity: 0%; visibility: hidden";
      document.getElementById("chat-text-input").style =
        "opacity: 0%; visibility: hidden";
      page = 6;

      document.getElementById("startMatchmaking").removeAttribute("class");
      document.getElementById("startMatchmaking").style = "";
      document.getElementById("matchmakingText").innerHTML =
        "BEGIN MATCHMAKING";
      document.getElementById("matchmakingCapt").innerHTML =
        "Match with random players and play a song, highest score wins.";
      document.getElementById("back").style = "left: 0vw;";
    }
  }
};

document.getElementById("readyButton").onclick = function () {
  if (
    document.getElementById("readyButton").classList.contains("disabled") ==
    false
  ) {
    socket.emit("readyJSB");
  }
};

socket.on("liveExit", function () {
  document.getElementById("startMatchmaking").style =
    "opacity: 100%; visibility: visible";
  document.getElementById("screenLobby").style =
    "opacity: 0%; visibility: hidden";
  document.getElementById("chat-text-input").style =
    "opacity: 0%; visibility: hidden";
  page = 6;

  document.getElementById("startMatchmaking").removeAttribute("class");
  document.getElementById("startMatchmaking").style = "";
  document.getElementById("matchmakingText").innerHTML = "BEGIN MATCHMAKING";
  document.getElementById("matchmakingCapt").innerHTML =
    "Match with random players and play a song, highest score wins.";
  document.getElementById("back").style = "left: 0vw;";
});

document.getElementById("notgotitButton").onclick = function () {
  document.getElementById("noticeModal").style =
    "opacity: 0%; visibility: hidden;";
  document.getElementById("noticePopup").style =
    "opacity: 0%; visibility: hidden; transform: translate(-50%, -50%) scale(0.5, 0.5)";
};

socket.on("chatMessageReceived", (data) => {
  var chatelem = document.createElement("div");
  chatelem.setAttribute("class", "chat-element");
  var chatelemAuthor = document.createElement("p");
  var chatelemText = document.createElement("p");
  chatelemAuthor.setAttribute("class", "chat-author");
  if (data.author == localStorage.getItem("username")) {
    chatelemAuthor.setAttribute("class", "chat-author chat-you");
  }
  chatelemText.setAttribute("class", "chat-text");
  chatelemAuthor.textContent = data.author;
  chatelemText.textContent = " " + data.text;
  chatelem.appendChild(chatelemAuthor);
  chatelem.appendChild(chatelemText);
  document.getElementById("chat-box").appendChild(chatelem);
  document.getElementById("chat-box").scrollTop =
    document.getElementById("chat-box").scrollHeight;
});

socket.on("newPlayerJoined", (data) => {
  var chatelem = document.createElement("div");
  chatelem.setAttribute("class", "chat-element");
  var chatelemAuthor = document.createElement("p");
  var chatelemText = document.createElement("p");
  chatelemAuthor.setAttribute("class", "chat-system");
  chatelemText.setAttribute("class", "chat-text");
  chatelemAuthor.textContent = "[SYSTEM]";
  chatelemText.textContent = " " + data.username + " has joined the game!";
  chatelem.appendChild(chatelemAuthor);
  chatelem.appendChild(chatelemText);
  document.getElementById("chat-box").appendChild(chatelem);
  document.getElementById("chat-box").scrollTop =
    document.getElementById("chat-box").scrollHeight;
  if (listPlayers[0] == "Searching For Player") {
    listPlayers[0] = data.username;
  } else if (listPlayers[1] == "Searching For Player") {
    listPlayers[1] = data.username;
  } else if (listPlayers[2] == "Searching For Player") {
    listPlayers[2] = data.username;
  } else if (listPlayers[3] == "Searching For Player") {
    listPlayers[3] = data.username;
  }
  document.getElementById("player1Name").innerHTML = listPlayers[0];
  document.getElementById("player2Name").innerHTML = listPlayers[1];
  document.getElementById("player3Name").innerHTML = listPlayers[2];
  document.getElementById("player4Name").innerHTML = listPlayers[3];
  listPlayers = [
    document.getElementById("player1Name").innerHTML,
    document.getElementById("player2Name").innerHTML,
    document.getElementById("player3Name").innerHTML,
    document.getElementById("player4Name").innerHTML,
  ];
  if (document.getElementById("player1Name").innerHTML == data.username) {
    document.getElementById("player1Ready").innerHTML = "Not Ready";
  }
  if (document.getElementById("player2Name").innerHTML == data.username) {
    document.getElementById("player2Ready").innerHTML = "Not Ready";
  }
  if (document.getElementById("player3Name").innerHTML == data.username) {
    document.getElementById("player3Ready").innerHTML = "Not Ready";
  }
  if (document.getElementById("player4Name").innerHTML == data.username) {
    document.getElementById("player4Ready").innerHTML = "Not Ready";
  }
});

socket.on("playerLeft", (data) => {
  localStorage.setItem("currentJSBRoom", data._id);

  sendSystemMessage("A player has left the game!");
  if (data.players[0] == undefined) {
    data.players[0] = ["Searching", "Searching", "Searching For Player"];
  }
  if (data.players[1] == undefined) {
    data.players[1] = ["Searching", "Searching", "Searching For Player"];
  }
  if (data.players[2] == undefined) {
    data.players[2] = ["Searching", "Searching", "Searching For Player"];
  }
  if (data.players[3] == undefined) {
    data.players[3] = ["Searching", "Searching", "Searching For Player"];
  }
  document.getElementById("player1Name").innerHTML = data.players[0][2];
  document.getElementById("player2Name").innerHTML = data.players[1][2];
  document.getElementById("player3Name").innerHTML = data.players[2][2];
  document.getElementById("player4Name").innerHTML = data.players[3][2];
  listPlayers = [
    document.getElementById("player1Name").innerHTML,
    document.getElementById("player2Name").innerHTML,
    document.getElementById("player3Name").innerHTML,
    document.getElementById("player4Name").innerHTML,
  ];
  if (
    document.getElementById("player1Name").innerHTML == "Searching For Player"
  ) {
    document.getElementById("player1Ready").innerHTML = "Searching For Player";
  }
  if (
    document.getElementById("player2Name").innerHTML == "Searching For Player"
  ) {
    document.getElementById("player2Ready").innerHTML = "Searching For Player";
  }
  if (
    document.getElementById("player3Name").innerHTML == "Searching For Player"
  ) {
    document.getElementById("player3Ready").innerHTML = "Searching For Player";
  }
  if (
    document.getElementById("player4Name").innerHTML == "Searching For Player"
  ) {
    document.getElementById("player4Ready").innerHTML = "Searching For Player";
  }
  if (
    document.getElementById("player1Name").innerHTML ==
    localStorage.getItem("username")
  ) {
    document.getElementById("liveUser1").setAttribute("class", "liveUserYou");
  } else {
    document.getElementById("liveUser1").setAttribute("class", "liveUser");
  }
  if (
    document.getElementById("player2Name").innerHTML ==
    localStorage.getItem("username")
  ) {
    document.getElementById("liveUser2").setAttribute("class", "liveUserYou");
  } else {
    document.getElementById("liveUser2").setAttribute("class", "liveUser");
  }
  if (
    document.getElementById("player3Name").innerHTML ==
    localStorage.getItem("username")
  ) {
    document.getElementById("liveUser3").setAttribute("class", "liveUserYou");
  } else {
    document.getElementById("liveUser3").setAttribute("class", "liveUser");
  }
  if (
    document.getElementById("player4Name").innerHTML ==
    localStorage.getItem("username")
  ) {
    document.getElementById("liveUser4").setAttribute("class", "liveUserYou");
  } else {
    document.getElementById("liveUser4").setAttribute("class", "liveUser");
  }
});

socket.on("systemMessage", (data) => {
  sendSystemMessage(data);
});

socket.on("readyStatus", (data) => {
  if (data.status == 1) {
    sendSystemMessage(data.username + " is now ready to start!");
    if (document.getElementById("player1Name").innerHTML == data.username) {
      document.getElementById("player1Ready").innerHTML = "READY";
    }
    if (document.getElementById("player2Name").innerHTML == data.username) {
      document.getElementById("player2Ready").innerHTML = "READY";
    }
    if (document.getElementById("player3Name").innerHTML == data.username) {
      document.getElementById("player3Ready").innerHTML = "READY";
    }
    if (document.getElementById("player4Name").innerHTML == data.username) {
      document.getElementById("player4Ready").innerHTML = "READY";
    }
    if (localStorage.getItem("username") == data.username) {
      document.getElementById("readyButton").innerHTML = "Unready";
    }
  } else {
    sendSystemMessage(data.username + " is no longer ready to start!");
    if (document.getElementById("player1Name").innerHTML == data.username) {
      document.getElementById("player1Ready").innerHTML = "Not Ready";
    }
    if (document.getElementById("player2Name").innerHTML == data.username) {
      document.getElementById("player2Ready").innerHTML = "Not Ready";
    }
    if (document.getElementById("player3Name").innerHTML == data.username) {
      document.getElementById("player3Ready").innerHTML = "Not Ready";
    }
    if (document.getElementById("player4Name").innerHTML == data.username) {
      document.getElementById("player4Ready").innerHTML = "Not Ready";
    }
    if (localStorage.getItem("username") == data.username) {
      document.getElementById("readyButton").innerHTML = "Ready";
    }
  }
});

function updateSlider(data) {
  document.getElementById("masterVolume").innerHTML =
    "MASTER VOLUME (" + data.value + "%)";
  Howler.volume(data.value / 100);
  localStorage.setItem("prefVol", data.value);
}

socket.on("readyToStart", function () {
  document.getElementById("readyButton").setAttribute("class", "disabled");
  document.getElementById("exitButton").setAttribute("class", "disabled");
  backgaudio.fade(1, 0, 1000);
  sendSystemMessage(
    "All players are ready! Do not leave. Song pick begins in 5 seconds..."
  );
});

socket.on("songPick", (song) => {
  sendSystemMessage(
    "A song has been chosen! The song being played is: " +
      songs[song - 1] +
      ". Game begins in 5 seconds..."
  );
});

socket.on("songBegin", (data) => {
  songLength = data.length;
  document.getElementById("currentRankNew").innerHTML = "F";
  document.getElementById("currentRankNew").style = "";
  document.getElementById("rankBarInner").style = "";
  rankPoints2 = 0;
  // if ready
  if (document.getElementById("player1Ready").innerHTML == "READY") {
    document.getElementById("player1Ready").innerHTML =
      "Awaiting Score Submission";
  }
  if (document.getElementById("player2Ready").innerHTML == "READY") {
    document.getElementById("player2Ready").innerHTML =
      "Awaiting Score Submission";
  }
  if (document.getElementById("player3Ready").innerHTML == "READY") {
    document.getElementById("player3Ready").innerHTML =
      "Awaiting Score Submission";
  }
  if (document.getElementById("player4Ready").innerHTML == "READY") {
    document.getElementById("player4Ready").innerHTML =
      "Awaiting Score Submission";
  }
  notesList1 = [];
  notesList2 = [];
  notesList3 = [];
  notesList4 = [];
  competitive = 1;
  liveGameData = {
    totalNotes: 0,
    currentScore: 0,
    eachNoteScores: [],
    eachNoteTiming: {
      perfect: 0,
      great: 0,
      ok: 0,
      miss: 0,
    },
    gameStartTime: new Date().getTime() / 1000,
  };

  datas = data.beatmap;
  document.getElementById("maxcombo").innerHTML = "0";
  document.getElementById("scoreholder").style =
    "opacity: 100%; visibility: visible;";
  document.getElementById("combowrapper").style = "";
  document.getElementById("modal").style = "visibility: hidden; opacity: 0%;";
  document.getElementById("back").style = "left: -50vw;";
  document.getElementById("screenLobby").style = "";
  document.getElementById("startMatchmaking").style = "";
  document.getElementById("screenLive").style = "right: -100vw;";
  document.getElementById("header").style = "top: calc(-16px + -6.8vh)";
  new Howl({
    src: ["start.mp3"],
  }).play();
  inGame = 1;
  multiplier = 1.0;
  combo = 0;
  currentScore = 0;
  perfect = 0;
  great = 0;
  ok = 0;
  miss = 0;
  document.getElementById("score1").innerHTML = document
    .getElementById("keybind1")
    .value.toUpperCase();
  document.getElementById("score2").innerHTML = document
    .getElementById("keybind2")
    .value.toUpperCase();
  document.getElementById("score3").innerHTML = document
    .getElementById("keybind3")
    .value.toUpperCase();
  document.getElementById("score4").innerHTML = document
    .getElementById("keybind4")
    .value.toUpperCase();
  if (
    localStorage.getItem("keybind1") == null ||
    localStorage.getItem("keybind2") == null ||
    localStorage.getItem("keybind3") == null ||
    localStorage.getItem("keybind4") == null ||
    localStorage.getItem("keybind1") == "" ||
    localStorage.getItem("keybind2") == "" ||
    localStorage.getItem("keybind3") == "" ||
    localStorage.getItem("keybind4") == ""
  ) {
    localStorage.setItem("keybind1", "a");
    localStorage.setItem("keybind2", "s");
    localStorage.setItem("keybind3", "k");
    localStorage.setItem("keybind4", "l");
    document.getElementById("keybind1").value = "a";
    document.getElementById("score1").innerHTML = "A";
    document.getElementById("keybind2").value = "s";
    document.getElementById("score2").innerHTML = "S";
    document.getElementById("keybind3").value = "k";
    document.getElementById("score3").innerHTML = "K";
    document.getElementById("keybind4").value = "l";
    document.getElementById("score4").innerHTML = "L";
  }
  document.getElementById("quitgame").innerHTML =
    "You cannot quit in a live match!";
  document.getElementById("quitgame").style = "";
  document.getElementById("screenGame").style =
    "opacity: 100%; visibility: visible;";
  document.getElementById("currentScore").innerHTML = "0";
  document.getElementById("currentAcc").innerHTML = "100.00%";
  document.getElementById("currentCombo").innerHTML = "0";
  document.getElementById("multiplier").innerHTML = "x1.00";
  setTimeout(function () {
    notes = data.beatmap.notes;
    cursong = new Howl({
      src: [data.beatmap.originalid + ".mp3"],
    });
    cursong.on("fade", function () {
      cursong.stop();
      cursong.volume(1);
      cursong.unload();
    });
    cursong.on("end", function () {
      cursong.unload();
    });
    cursong.unload();
    cursong.load();
    cursong.once("load", function () {
      setTimeout(function () {
        beatno = -8;
        finish = new interval((60 / data.beatmap.bpm) * 50, function () {
          if (
            beatno ==
            (
              Math.ceil(0 - (datas.offsetsec / 60) * datas.bpm * 20) / 20
            ).toFixed(2)
          ) {
            cursong.play();
          }
          beatno += 0.05;
          beatno = Math.round(beatno * 1000) / 1000;
          if ((beatno - 1) % 16 == 0) {
            cursong.seek((beatno / datas.bpm) * 60 + datas.offsetsec);
          }
          if (beatno % 1 == 0) {
          }
          data.beatmap.notes.forEach((note) => {
            if (note[0] - 4 == beatno) {
              // bring the note down
              bringNote(note[1], 240 / data.beatmap.bpm, beatno);
            }
            if (note[0] == beatno) {
              // fix beatmaps 1, 4, and 5
            }
          });
          if (beatno >= data.beatmap.totalBeats) {
            // end
            finish.stop();
            var paras = document.getElementsByClassName("noteResult");
            while (paras[0]) {
              paras[0].parentNode.removeChild(paras[0]);
            }
            document.getElementById("scoreholder").style =
              "opacity: 0%; visibility: hidden;";
            inGame = 0;
            liveGameData.gameFinishTime = new Date().getTime() / 1000;
            socket.emit("liveGameFinish", {
              token: localStorage.getItem("userToken"),
              room: localStorage.getItem("currentJSBRoom").toString(),
              data: liveGameData,
            });
            showWaitingLiveLobby();
            backgaudio.play();
          }
        });
        finish.run();
      }, 2000);
    });
  }, 200);
});

socket.on("playerDQed", (username) => {
  sendSystemMessage(
    "Anti-cheat has disqualified " +
      username +
      " for a suspicious play. They have automatically been given a score of -9999999"
  );
});

socket.on("finalScore", (data) => {
  if (document.getElementById("player1Name").innerHTML == data.username) {
    document.getElementById("player1Ready").innerHTML =
      "Final Score: " + data.finalScore;
  }
  if (document.getElementById("player2Name").innerHTML == data.username) {
    document.getElementById("player2Ready").innerHTML =
      "Final Score: " + data.finalScore;
  }
  if (document.getElementById("player3Name").innerHTML == data.username) {
    document.getElementById("player3Ready").innerHTML =
      "Final Score: " + data.finalScore;
  }
  if (document.getElementById("player4Name").innerHTML == data.username) {
    document.getElementById("player4Ready").innerHTML =
      "Final Score: " + data.finalScore;
  }
});

socket.on("gameEnd", (data) => {
  document.getElementById("exitButton").setAttribute("class", "");

  exitPermit = 1;
});

var startYear = 19;
var endYear = 147;
var yearArray = [];

while (startYear <= endYear) {
  if (startYear % 2 == 0) {
    yearArray.push([startYear, 4]);
  } else {
    yearArray.push([startYear, 3]);
  }

  //yearArray.push(startYear);
  startYear++;
}

if (localStorage.getItem("prefVol") !== null) {
  document.getElementById("masterVolumeSlider").value =
    localStorage.getItem("prefVol");
  Howler.volume(localStorage.getItem("prefVol") / 100);
  document.getElementById("masterVolume").innerHTML =
    "MASTER VOLUME (" + localStorage.getItem("prefVol") + "%)";
} else {
  document.getElementById("masterVolumeSlider").value = 50;
  Howler.volume(0.5);
  localStorage.setItem("prefVol", 50);
  document.getElementById("masterVolume").innerHTML = "MASTER VOLUME (50%)";
}
