// particles soon
// fever mode (double score for ??)
// streak bonus
// first beatmap
// multiplayer mode
// make the game actually work

var page = 1;
var beatno = 0;
var combo = 0;
var currentScore = 0;
var inGame = 0;
var multiplier = 1.0;
var feverMode = false;
var songLength = 0;
var notes = [];
var specialNotes = [];
var perfect = 0;
var great = 0;
var noteNumber = 0;
var ok = 0;
var miss = 0;
var finish;
var hold1 = 0;
var hold2 = 0;
var hold3 = 0;
var hold4 = 0;
var keybindWait = 0;
var cursong;
var rankPoints2 = 0;
var songData;
var queueBeginTime = 0;
var exitingGame = 0;
var exitPermit = 0;
var maximumCombo = 0;
var connecttimes = 0;
var listPlayers = [];
var enterDown = false;
var down1 = false;
var down2 = false;
var down3 = false;
var down4 = false;
var down5 = false;
// Cheating is not allowed in KBHero! If you're caught cheating, you will be banned.
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
  "SMOKE - FUJINAWA KAZUHIKO",
  "HUE SHIFT - CODA",
  "TO THE LIMIT - KAMIYA",
  "WHITE CALABASH - CHIKA",
];
var backgaudio = new Howl({
  src: [
    "./assets/music/background/" +
      (Math.floor(Math.random() * 4) + 1).toString() +
      ".mp3",
  ],
  loop: true,
  rate: 1,
});
const socket = io(window.SOCKET_URL || "https://eddyzow.herokuapp.com/"); // Socket
document.getElementById("wallpaper").style["background-image"] =
  'url("./assets/wallpapers/' +
  (Math.floor(Math.random() * 7) + 1).toString() +
  '.jpg")';

// pages
// 1) main page
// 2) main levels
// 3) main results
// 4) settings
// 5) online
// 6) queue page for live
// 7) In Queue
// 8) Changing Queue
// 9) about

var notesList1 = [];
var notesList2 = [];
var notesList3 = [];
var notesList4 = [];
var notesList5 = [];
function showMusic(name) {
  document.getElementById("musicPlaying").innerHTML = "♫ " + name;
  document.getElementById("musicPlaying").style.visibility = "visible";
  document.getElementById("musicPlaying").style.bottom = "5vh";
  setTimeout(function () {
    document.getElementById("musicPlaying").style.bottom = "-5vh";
    document.getElementById("musicPlaying").style.visibility = "hidden";
  }, 2000);
}

String.prototype.lpad = function (padString, length) {
  var str = this;
  while (str.length < length) str = padString + str;
  return str;
};

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

document.getElementById("main").onclick = function () {
  document.getElementById("screen1").style = "right: -100vw;";
  document.getElementById("screen2").style = "right: 0vw;";
  document.getElementById("back").style = "left: 0vw;";
  page = 2;
};

socket.on("1pong", function () {
  document.getElementById("modal").style = "visibility: hidden; opacity: 0%;";
});

document.getElementById("closeStart").onclick = function () {
  if (document.getElementById("startScreen").getAttribute("style") == null) {
    backgaudio.play();
    showMusic(
      musics[
        backgaudio._src
          .split("./assets/music/background/")[1]
          .split(".mp3")[0] - 1
      ]
    );
  }

  document.getElementById("startScreen").style =
    "top: 100vh; opacity: 0%; visibility: hidden";
};

document.getElementById("about").onclick = function () {
  document.getElementById("screen1").style = "right: -100vw;";
  document.getElementById("screenAbout").style = "right: 0vw;";
  document.getElementById("back").style = "left: 0vw;";
  page = 9;
};

document.getElementById("settings").onclick = function () {
  document.getElementById("screen1").style = "right: -100vw;";
  document.getElementById("screenSettings").style = "right: 0vw;";
  document.getElementById("sound-slider").style = "left: -8px";
  document.getElementById("back").style = "left: 0vw;";
  page = 4;
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
  }
  if (page == 4) {
    document.getElementById("back").style = "left: -50vw;";
    document.getElementById("screenSettings").style =
      "opacity: 0%; visibility: hidden;";
    document.getElementById("sound-slider").style = "left: 100vw";
    document.getElementById("screen1").style = "right: 0vw;";
    page = 1;
  }
  if (page == 9) {
    document.getElementById("back").style = "left: -50vw;";
    document.getElementById("screenAbout").style =
      "opacity: 0%; visibility: hidden;";
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

socket.on("wrongBeatmapPW", function () {
  document.getElementById("modal").style = "visibility: hidden; opacity: 0%;";
  alert("Wrong password");
});

var noteList = [];

document.getElementById("change-bind1").onclick = function () {
  document.getElementById("back").style = "left: -50vw;";
  keybindWait = 1;
  document.getElementById("modal").innerHTML =
    "PRESS A KEY TO SET KEYBIND (CLICK TO CANCEL)";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

document.getElementById("change-bind2").onclick = function () {
  document.getElementById("back").style = "left: -50vw;";
  keybindWait = 2;
  document.getElementById("modal").innerHTML =
    "PRESS A KEY TO SET KEYBIND (CLICK TO CANCEL)";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};
document.getElementById("change-bind3").onclick = function () {
  document.getElementById("back").style = "left: -50vw;";
  keybindWait = 3;
  document.getElementById("modal").innerHTML =
    "PRESS A KEY TO SET KEYBIND (CLICK TO CANCEL)";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};
document.getElementById("change-bind4").onclick = function () {
  document.getElementById("back").style = "left: -50vw;";
  keybindWait = 4;
  document.getElementById("modal").innerHTML =
    "PRESS A KEY TO SET KEYBIND (CLICK TO CANCEL)";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};
document.getElementById("change-bind5").onclick = function () {
  document.getElementById("back").style = "left: -50vw;";
  keybindWait = 5;
  document.getElementById("modal").innerHTML =
    "PRESS A KEY TO SET KEYBIND (CLICK TO CANCEL)";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};
document.getElementById("change-bind6").onclick = function () {
  document.getElementById("back").style = "left: -50vw;";
  keybindWait = 6;
  document.getElementById("modal").innerHTML =
    "PRESS A KEY TO SET KEYBIND (CLICK TO CANCEL)";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

document.getElementById("modal").onclick = function () {
  if (keybindWait != 0) {
    document.getElementById("modal").style = "visibility: hidden; opacity: 0%";
    keybindWait = 0;
    document.getElementById("back").style = "left: 0;";
  }
};

document.onkeydown = function (e) {
  e = e || window.event;
  var key = e.code;
  if (key === "Backspace") {
    if (inGame == 1 && competitive == 0) {
      if (exitingGame == 0) {
        exitingGame = 1;
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
                      inGame = 0;
                      document.getElementById("score").innerHTML = currentScore;
                      document.getElementById("maxcombo").innerHTML =
                        maximumCombo;
                      document.getElementById("amt-perfect").innerHTML =
                        perfect;
                      document.getElementById("amt-miss").innerHTML = miss;
                      document.getElementById("accuracy").innerHTML =
                        ((rankPoints2 / songData.notes.length) * 100).toFixed(
                          2
                        ) + "%";
                      // rank by percentage?
                      if ((rankPoints2 / songData.notes.length) * 100 == 100) {
                        document.getElementById("rank").innerHTML = "SSS";
                      } else if (
                        (rankPoints2 / songData.notes.length) * 100 >=
                        97.5
                      ) {
                        document.getElementById("rank").innerHTML = "SS";
                      } else if (
                        (rankPoints2 / songData.notes.length) * 100 >=
                        95
                      ) {
                        document.getElementById("rank").innerHTML = "S";
                      } else if (
                        (rankPoints2 / songData.notes.length) * 100 >=
                        90
                      ) {
                        document.getElementById("rank").innerHTML = "A";
                      } else if (
                        (rankPoints2 / songData.notes.length) * 100 >=
                        80
                      ) {
                        document.getElementById("rank").innerHTML = "B";
                      } else if (
                        (rankPoints2 / songData.notes.length) * 100 >=
                        65
                      ) {
                        document.getElementById("rank").innerHTML = "C";
                      } else {
                        document.getElementById("rank").innerHTML = "F";
                      }
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
  if (!e.repeat) {
    if (keybindWait == 1) {
      localStorage.setItem("KBHbind1", key);
      document.getElementById("modal").style =
        "visibility: hidden; opacity: 0%";
      keybindWait = 0;
      document.getElementById("back").style = "left: 0;";
    }
    if (keybindWait == 2) {
      localStorage.setItem("KBHbind2", key);
      document.getElementById("modal").style =
        "visibility: hidden; opacity: 0%";
      keybindWait = 0;
      document.getElementById("back").style = "left: 0;";
    }
    if (keybindWait == 3) {
      localStorage.setItem("KBHbind3", key);
      document.getElementById("modal").style =
        "visibility: hidden; opacity: 0%";
      keybindWait = 0;
      document.getElementById("back").style = "left: 0;";
    }
    if (keybindWait == 4) {
      localStorage.setItem("KBHbind4", key);
      document.getElementById("modal").style =
        "visibility: hidden; opacity: 0%";
      keybindWait = 0;
      document.getElementById("back").style = "left: 0;";
    }
    if (keybindWait == 5) {
      localStorage.setItem("KBHbind5", key);
      document.getElementById("modal").style =
        "visibility: hidden; opacity: 0%";
      keybindWait = 0;
      document.getElementById("back").style = "left: 0;";
    }
    if (keybindWait == 6) {
      localStorage.setItem("KBHbindS", key);
      document.getElementById("modal").style =
        "visibility: hidden; opacity: 0%";
      keybindWait = 0;
      document.getElementById("back").style = "left: 0;";
    }
    document.getElementById("change-bind1").innerHTML =
      "Keybind 1 (Currently: " + localStorage.getItem("KBHbind1") + ")";
    document.getElementById("change-bind2").innerHTML =
      "Keybind 2 (Currently: " + localStorage.getItem("KBHbind2") + ")";
    document.getElementById("change-bind3").innerHTML =
      "Keybind 3 (Currently: " + localStorage.getItem("KBHbind3") + ")";
    document.getElementById("change-bind4").innerHTML =
      "Keybind 4 (Currently: " + localStorage.getItem("KBHbind4") + ")";
    document.getElementById("change-bind5").innerHTML =
      "Keybind 5 (Currently: " + localStorage.getItem("KBHbind5") + ")";
    document.getElementById("change-bind6").innerHTML =
      "Strum Keybind (Currently: " + localStorage.getItem("KBHbindS") + ")";

    if (localStorage.getItem("KBHbind1") == key) {
      down1 = true;
      specialNotes.push({
        type: "normalshort",
        lane: 1,
        startBeat: Math.round(beatno),
        endBeat: Math.round(beatno),
      });
    }
    if (localStorage.getItem("KBHbind2") == key) {
      down2 = true;
      specialNotes.push({
        type: "normalshort",
        lane: 2,
        startBeat: Math.round(beatno),
        endBeat: Math.round(beatno),
      });
    }
    if (localStorage.getItem("KBHbind3") == key) {
      down3 = true;
      specialNotes.push({
        type: "normalshort",
        lane: 3,
        startBeat: Math.round(beatno),
        endBeat: Math.round(beatno),
      });
    }
    if (localStorage.getItem("KBHbind4") == key) {
      down4 = true;
      specialNotes.push({
        type: "normalshort",
        lane: 4,
        startBeat: Math.round(beatno),
        endBeat: Math.round(beatno),
      });
    }
    if (localStorage.getItem("KBHbind5") == key) {
      down5 = true;
      specialNotes.push({
        type: "normalshort",
        lane: 5,
        startBeat: Math.round(beatno),
        endBeat: Math.round(beatno),
      });
    }
    if (localStorage.getItem("KBHbindS") == key) {
      enterDown = true;
      if (down1) {
        document.getElementById("noteReceiver1").src =
          "./assets/graphics/a1.svg";
        if (notesList1.length > 0) {
          if (Math.abs(beatno - notesList1[0].beat) <= 0.5) {
            document.getElementById("note" + notesList1[0].id).remove();
            currentScore += Math.round(
              (1 - Math.abs(beatno - notesList1[0].beat)) * 1000 * multiplier
            );
            bringEffect(
              Math.round(
                (1 - Math.abs(beatno - notesList1[0].beat)) * 1000 * multiplier
              ),
              1
            );
            currentScore = Math.round(currentScore);
            combo += 1;
            perfect += 1;
            rankPoints2 += 1 - Math.abs(beatno - notesList1[0].beat);
            notesList1.shift();

            if (combo > maximumCombo) {
              maximumCombo = combo;
            }
            if (combo >= 10) {
              if (feverMode) {
                multiplier = 4;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(251, 0, 255, 0.5); border: 0.5vh solid rgb(255, 68, 249); color: rgb(255, 119, 251);";
              } else {
                multiplier = 2;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(255, 129, 0, 0.5); border: 0.5vh solid rgb(255, 129, 0); color: rgb(255, 188, 0);";
              }
            }
            if (combo >= 20) {
              if (feverMode) {
                multiplier = 6;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(255, 0, 0, 0.5); border: 0.5vh solid rgb(255, 68, 68); color: rgb(255, 154, 154);";
              } else {
                multiplier = 3;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(39, 255, 0, 0.5); border: 0.5vh solid rgb(4, 255, 0); color: rgb(73, 255, 87);";
              }
            }
            if (combo >= 30) {
              if (feverMode) {
                multiplier = 8;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(0, 227, 185, 0.5); border: 0.5vh solid rgb(22, 213, 160); color: rgb(154, 255, 218);";
              } else {
                multiplier = 4;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(251, 0, 255, 0.5); border: 0.5vh solid rgb(255, 68, 249); color: rgb(255, 119, 251);";
              }
            }
            document.getElementById("currentMultiplier").innerHTML =
              "x" + multiplier;
            document.getElementById("currentScore").innerHTML = currentScore
              .toString()
              .lpad("0", 7);
            document.getElementById("currentStreak").innerHTML = combo
              .toString()
              .lpad("0", 3);
          }
        }
      }
      if (down2) {
        document.getElementById("noteReceiver2").src =
          "./assets/graphics/a2.svg";
        if (notesList2.length > 0) {
          if (Math.abs(beatno - notesList2[0].beat) < 0.5) {
            document.getElementById("note" + notesList2[0].id).remove();
            currentScore += Math.round(
              (1 - Math.abs(beatno - notesList2[0].beat)) * 1000 * multiplier
            );
            bringEffect(
              Math.round(
                (1 - Math.abs(beatno - notesList2[0].beat)) * 1000 * multiplier
              ),
              2
            );
            currentScore = Math.round(currentScore);
            combo += 1;
            perfect += 1;
            rankPoints2 += 1 - Math.abs(beatno - notesList2[0].beat);
            notesList2.shift();

            if (combo > maximumCombo) {
              maximumCombo = combo;
            }
            if (combo >= 10) {
              if (feverMode) {
                multiplier = 4;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(251, 0, 255, 0.5); border: 0.5vh solid rgb(255, 68, 249); color: rgb(255, 119, 251);";
              } else {
                multiplier = 2;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(255, 129, 0, 0.5); border: 0.5vh solid rgb(255, 129, 0); color: rgb(255, 188, 0);";
              }
            }
            if (combo >= 20) {
              if (feverMode) {
                multiplier = 6;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(255, 0, 0, 0.5); border: 0.5vh solid rgb(255, 68, 68); color: rgb(255, 154, 154);";
              } else {
                multiplier = 3;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(39, 255, 0, 0.5); border: 0.5vh solid rgb(4, 255, 0); color: rgb(73, 255, 87);";
              }
            }
            if (combo >= 30) {
              if (feverMode) {
                multiplier = 8;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(0, 227, 185, 0.5); border: 0.5vh solid rgb(22, 213, 160); color: rgb(154, 255, 218);";
              } else {
                multiplier = 4;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(251, 0, 255, 0.5); border: 0.5vh solid rgb(255, 68, 249); color: rgb(255, 119, 251);";
              }
            }
            document.getElementById("currentMultiplier").innerHTML =
              "x" + multiplier;
            document.getElementById("currentScore").innerHTML = currentScore
              .toString()
              .lpad("0", 7);
            document.getElementById("currentStreak").innerHTML = combo
              .toString()
              .lpad("0", 3);
          }
        }
      }
      if (down3) {
        document.getElementById("noteReceiver3").src =
          "./assets/graphics/a3.svg";
        if (notesList3.length > 0) {
          if (Math.abs(beatno - notesList3[0].beat) < 0.5) {
            document.getElementById("note" + notesList3[0].id).remove();
            currentScore += Math.round(
              (1 - Math.abs(beatno - notesList3[0].beat)) * 1000 * multiplier
            );
            bringEffect(
              Math.round(
                (1 - Math.abs(beatno - notesList3[0].beat)) * 1000 * multiplier
              ),
              3
            );
            currentScore = Math.round(currentScore);

            combo += 1;
            perfect += 1;
            rankPoints2 += 1 - Math.abs(beatno - notesList3[0].beat);
            notesList3.shift();

            if (combo > maximumCombo) {
              maximumCombo = combo;
            }
            if (combo >= 10) {
              if (feverMode) {
                multiplier = 4;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(251, 0, 255, 0.5); border: 0.5vh solid rgb(255, 68, 249); color: rgb(255, 119, 251);";
              } else {
                multiplier = 2;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(255, 129, 0, 0.5); border: 0.5vh solid rgb(255, 129, 0); color: rgb(255, 188, 0);";
              }
            }
            if (combo >= 20) {
              if (feverMode) {
                multiplier = 6;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(255, 0, 0, 0.5); border: 0.5vh solid rgb(255, 68, 68); color: rgb(255, 154, 154);";
              } else {
                multiplier = 3;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(39, 255, 0, 0.5); border: 0.5vh solid rgb(4, 255, 0); color: rgb(73, 255, 87);";
              }
            }
            if (combo >= 30) {
              if (feverMode) {
                multiplier = 8;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(0, 227, 185, 0.5); border: 0.5vh solid rgb(22, 213, 160); color: rgb(154, 255, 218);";
              } else {
                multiplier = 4;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(251, 0, 255, 0.5); border: 0.5vh solid rgb(255, 68, 249); color: rgb(255, 119, 251);";
              }
            }
            document.getElementById("currentMultiplier").innerHTML =
              "x" + multiplier;
            document.getElementById("currentScore").innerHTML = currentScore
              .toString()
              .lpad("0", 7);
            document.getElementById("currentStreak").innerHTML = combo
              .toString()
              .lpad("0", 3);
          }
        }
      }
      if (down4) {
        document.getElementById("noteReceiver4").src =
          "./assets/graphics/a4.svg";
        if (notesList4.length > 0) {
          if (Math.abs(beatno - notesList4[0].beat) < 0.5) {
            document.getElementById("note" + notesList4[0].id).remove();
            currentScore += Math.round(
              (1 - Math.abs(beatno - notesList4[0].beat)) * 1000 * multiplier
            );
            bringEffect(
              Math.round(
                (1 - Math.abs(beatno - notesList4[0].beat)) * 1000 * multiplier
              ),
              4
            );
            currentScore = Math.round(currentScore);

            combo += 1;
            perfect += 1;
            rankPoints2 += 1 - Math.abs(beatno - notesList4[0].beat);
            notesList4.shift();

            if (combo > maximumCombo) {
              maximumCombo = combo;
            }
            if (combo >= 10) {
              if (feverMode) {
                multiplier = 4;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(251, 0, 255, 0.5); border: 0.5vh solid rgb(255, 68, 249); color: rgb(255, 119, 251);";
              } else {
                multiplier = 2;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(255, 129, 0, 0.5); border: 0.5vh solid rgb(255, 129, 0); color: rgb(255, 188, 0);";
              }
            }
            if (combo >= 20) {
              if (feverMode) {
                multiplier = 6;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(255, 0, 0, 0.5); border: 0.5vh solid rgb(255, 68, 68); color: rgb(255, 154, 154);";
              } else {
                multiplier = 3;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(39, 255, 0, 0.5); border: 0.5vh solid rgb(4, 255, 0); color: rgb(73, 255, 87);";
              }
            }
            if (combo >= 30) {
              if (feverMode) {
                multiplier = 8;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(0, 227, 185, 0.5); border: 0.5vh solid rgb(22, 213, 160); color: rgb(154, 255, 218);";
              } else {
                multiplier = 4;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(251, 0, 255, 0.5); border: 0.5vh solid rgb(255, 68, 249); color: rgb(255, 119, 251);";
              }
            }
            document.getElementById("currentMultiplier").innerHTML =
              "x" + multiplier;
            document.getElementById("currentScore").innerHTML = currentScore
              .toString()
              .lpad("0", 7);
            document.getElementById("currentStreak").innerHTML = combo
              .toString()
              .lpad("0", 3);
          }
        }
      }
      if (down5) {
        document.getElementById("noteReceiver5").src =
          "./assets/graphics/a5.svg";
        if (notesList5.length > 0) {
          if (Math.abs(beatno - notesList5[0].beat) < 0.5) {
            document.getElementById("note" + notesList5[0].id).remove();
            currentScore += Math.round(
              (1 - Math.abs(beatno - notesList5[0].beat)) * 1000 * multiplier
            );
            bringEffect(
              Math.round(
                (1 - Math.abs(beatno - notesList5[0].beat)) * 1000 * multiplier
              ),
              5
            );
            currentScore = Math.round(currentScore);

            combo += 1;
            perfect += 1;
            rankPoints2 += 1 - Math.abs(beatno - notesList5[0].beat);
            notesList5.shift();

            if (combo > maximumCombo) {
              maximumCombo = combo;
            }
            if (combo >= 10) {
              if (feverMode) {
                multiplier = 4;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(251, 0, 255, 0.5); border: 0.5vh solid rgb(255, 68, 249); color: rgb(255, 119, 251);";
              } else {
                multiplier = 2;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(255, 129, 0, 0.5); border: 0.5vh solid rgb(255, 129, 0); color: rgb(255, 188, 0);";
              }
            }
            if (combo >= 20) {
              if (feverMode) {
                multiplier = 6;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(255, 0, 0, 0.5); border: 0.5vh solid rgb(255, 68, 68); color: rgb(255, 154, 154);";
              } else {
                multiplier = 3;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(39, 255, 0, 0.5); border: 0.5vh solid rgb(4, 255, 0); color: rgb(73, 255, 87);";
              }
            }
            if (combo >= 30) {
              if (feverMode) {
                multiplier = 8;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(0, 227, 185, 0.5); border: 0.5vh solid rgb(22, 213, 160); color: rgb(154, 255, 218);";
              } else {
                multiplier = 4;
                document.getElementById("currentMultiplier").style =
                  "background: rgba(251, 0, 255, 0.5); border: 0.5vh solid rgb(255, 68, 249); color: rgb(255, 119, 251);";
              }
            }
            document.getElementById("currentMultiplier").innerHTML =
              "x" + multiplier;
            document.getElementById("currentScore").innerHTML = currentScore
              .toString()
              .lpad("0", 7);
            document.getElementById("currentStreak").innerHTML = combo
              .toString()
              .lpad("0", 3);
          }
        }
      }
    }
  }
};

document.onkeyup = function (e) {
  e = e || window.event;
  var key = e.code;
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
  if (localStorage.getItem("KBHbind1") == key) {
    down1 = false;
    document.getElementById("noteReceiver1").src = "./assets/graphics/i1.svg";
  }
  if (localStorage.getItem("KBHbind2") == key) {
    down2 = false;
    document.getElementById("noteReceiver2").src = "./assets/graphics/i2.svg";
  }
  if (localStorage.getItem("KBHbind3") == key) {
    down3 = false;
    document.getElementById("noteReceiver3").src = "./assets/graphics/i3.svg";
  }
  if (localStorage.getItem("KBHbind4") == key) {
    down4 = false;
    document.getElementById("noteReceiver4").src = "./assets/graphics/i4.svg";
  }
  if (localStorage.getItem("KBHbind5") == key) {
    down5 = false;
    document.getElementById("noteReceiver5").src = "./assets/graphics/i5.svg";
  }
  if (localStorage.getItem("KBHbindS") == key) {
    enterDown = false;
    document.getElementById("noteReceiver1").src = "./assets/graphics/i1.svg";
    document.getElementById("noteReceiver2").src = "./assets/graphics/i2.svg";
    document.getElementById("noteReceiver3").src = "./assets/graphics/i3.svg";
    document.getElementById("noteReceiver4").src = "./assets/graphics/i4.svg";
    document.getElementById("noteReceiver5").src = "./assets/graphics/i5.svg";
  }
};

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

document
  .getElementById("password-input")
  .addEventListener("keyup", function (e) {
    if (e.key === "Enter" && inGame == 0) {
      socket.emit("KBHrequestBeatmap", {
        password: document.getElementById("password-input").value,
      });
    }
  });

document.getElementById("main-level3").onclick = function () {
  socket.emit("KBHrequestBeatmap", {
    beatmap: 3,
  });
  document.getElementById("back").style = "left: -50vw;";
  document.getElementById("modal").innerHTML = "PLEASE WAIT...";
  document.getElementById("modal").style =
    "visibility: visible; opacity: 100%;";
};

function gameSeek(beat) {
  beatno = beat;
  cursong.seek((beat / songData.bpm) * 60 + songData.offsetsec);
}

function noteMiss(num) {
  combo = 0;
  miss += 1;
  multiplier = 1;
  document.getElementById("currentMultiplier").style =
    "background: rgb(22 22 22 / 50%); border: 0.5vh solid rgb(207 207 207); color: rgb(191 191 191);";
  document.getElementById("currentMultiplier").innerHTML = "x" + multiplier;
  document.getElementById("currentScore").innerHTML = currentScore
    .toString()
    .lpad("0", 7);
  document.getElementById("currentStreak").innerHTML = combo
    .toString()
    .lpad("0", 3);
}

function bringEffect(status, number) {
  let elemy = document.createElement("div");
  elemy.setAttribute("class", "noteResult");
  elemy.innerHTML = status;
  elemy.style.color = "rgba(255, 255, 255, 0.5)";
  let vh = 25;
  if (number == 1) {
    vh = 12.6;
  }
  if (number == 2) {
    vh = 18.8;
  }
  if (number == 3) {
    vh = 25;
  }
  if (number == 4) {
    vh = 31.2;
  }
  if (number == 5) {
    vh = 37.4;
  }
  elemy.style["margin-left"] = vh + "%";
  document.getElementById("screenGameHolder").appendChild(elemy);
  setTimeout(function () {
    elemy.remove();
  }, 1000);
}

function bringNote(type, lane, targetBeat) {
  // fever
  // star power?
  noteNumber += 1;
  if (type == "normalshort") {
    let curNote = document.createElement("img");
    curNote.setAttribute("src", "./assets/graphics/n" + lane + ".svg");
    curNote.setAttribute("draggable", "false");
    curNote.setAttribute("class", "fallingNote" + lane);
    curNote.setAttribute("id", "note" + noteNumber);
    curNote.setAttribute("noteid", noteNumber);
    if (lane == 1) {
      notesList1.push({ type: type, beat: targetBeat, id: noteNumber });
    }
    if (lane == 2) {
      notesList2.push({ type: type, beat: targetBeat, id: noteNumber });
    }
    if (lane == 3) {
      notesList3.push({ type: type, beat: targetBeat, id: noteNumber });
    }
    if (lane == 4) {
      notesList4.push({ type: type, beat: targetBeat, id: noteNumber });
    }
    if (lane == 5) {
      notesList5.push({ type: type, beat: targetBeat, id: noteNumber });
    }
    curNote.style.animationDuration = (240 / songData.bpm) * 1.08 + "s";
    document.getElementById("screenGame").appendChild(curNote);
    setTimeout(function () {
      try {
        if (lane == 1 && notesList1.length > 0) {
          if (
            notesList1[0].id == Number.parseInt(curNote.getAttribute("noteid"))
          ) {
            noteMiss(1);
            notesList1.shift();
            curNote.remove();
          }
        }
        if (lane == 2 && notesList2.length > 0) {
          if (
            notesList2[0].id == Number.parseInt(curNote.getAttribute("noteid"))
          ) {
            noteMiss(2);
            notesList2.shift();
            curNote.remove();
          }
        }
        if (lane == 3 && notesList3.length > 0) {
          if (
            notesList3[0].id == Number.parseInt(curNote.getAttribute("noteid"))
          ) {
            noteMiss(3);
            notesList3.shift();
            curNote.remove();
          }
        }
        if (lane == 4 && notesList4.length > 0) {
          if (
            notesList4[0].id == Number.parseInt(curNote.getAttribute("noteid"))
          ) {
            noteMiss(4);
            notesList4.shift();
            curNote.remove();
          }
        }
        if (lane == 5 && notesList5.length > 0) {
          if (
            notesList5[0].id == Number.parseInt(curNote.getAttribute("noteid"))
          ) {
            noteMiss(5);
            notesList5.shift();
            curNote.remove();
          }
        }
      } catch (err) {}
    }, (1.07 * 240000) / songData.bpm);
  }
}

socket.on("beatmapReturned", (data) => {
  noteNumber = 0;
  maximumCombo = 0;
  rankPoints2 = 0;
  feverMode = false;
  backgaudio.fade(1, 0, 500);
  document.getElementById("modal").style = "visibility: hidden; opacity: 0%;";
  document.getElementById("back").style = "left: -50vw;";
  document.getElementById("screen2").style = "right: -100vw;";
  document.getElementById("screenGame").style =
    "opacity: 100%; visibility: visible;";
  inGame = 1;
  multiplier = 1.0;
  combo = 0;
  currentScore = 0;
  document.getElementById("currentScore").innerHTML = currentScore
    .toString()
    .lpad("0", 7);
  document.getElementById("currentStreak").innerHTML = combo
    .toString()
    .lpad("0", 3);
  document.getElementById("currentMultiplier").innerHTML = "x" + multiplier;
  document.getElementById("currentScore").innerHTML = currentScore
    .toString()
    .lpad("0", 7);
  document.getElementById("currentStreak").innerHTML = combo
    .toString()
    .lpad("0", 3);
  perfect = 0;
  great = 0;
  ok = 0;
  songData = data;
  miss = 0;
  tick = new Howl({
    src: ["./assets/sounds/tick.mp3"],
  });
  setTimeout(function () {
    notes = data.notes;
    cursong = new Howl({
      src: ["./assets/music/levels/" + data.originalid + ".mp3"],
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
        finish = new interval((60 / data.bpm) * 100, function () {
          if (
            beatno ==
            (Math.ceil(0 - (data.offsetsec / 60) * data.bpm * 10) / 10).toFixed(
              2
            )
          ) {
            cursong.play();
          }
          beatno += 0.1;
          beatno = Number.parseFloat(beatno.toFixed(3));
          beatno = Math.round(beatno * 1000) / 1000;
          if ((beatno - 1) % 16 == 0) {
            cursong.seek((beatno / data.bpm) * 60 + data.offsetsec);
          }
          if (beatno % 1 == 0) {
            if (beatno <= 0) {
              tick.play();
            }
          }
          data.notes.forEach((note) => {
            if (note.startBeat - 4 == beatno) {
              bringNote(note.type, note.lane, note.startBeat);
            }
          });
          if (beatno >= data.totalBeats) {
            // end
            cursong.stop();
            finish.stop();
            var paras = document.getElementsByClassName("noteResult");
            while (paras[0]) {
              paras[0].parentNode.removeChild(paras[0]);
            }
            page = 3;
            document.getElementById("score").innerHTML = currentScore;
            document.getElementById("maxcombo").innerHTML = maximumCombo;
            document.getElementById("amt-perfect").innerHTML = perfect;
            document.getElementById("amt-miss").innerHTML = miss;
            document.getElementById("accuracy").innerHTML =
              ((rankPoints2 / songData.notes.length) * 100).toFixed(2) + "%";
            // rank by percentage?
            if ((rankPoints2 / songData.notes.length) * 100 == 100) {
              document.getElementById("rank").innerHTML = "SSS";
            } else if ((rankPoints2 / songData.notes.length) * 100 >= 97.5) {
              document.getElementById("rank").innerHTML = "SS";
            } else if ((rankPoints2 / songData.notes.length) * 100 >= 95) {
              document.getElementById("rank").innerHTML = "S";
            } else if ((rankPoints2 / songData.notes.length) * 100 >= 90) {
              document.getElementById("rank").innerHTML = "A";
            } else if ((rankPoints2 / songData.notes.length) * 100 >= 80) {
              document.getElementById("rank").innerHTML = "B";
            } else if ((rankPoints2 / songData.notes.length) * 100 >= 65) {
              document.getElementById("rank").innerHTML = "C";
            } else {
              document.getElementById("rank").innerHTML = "F";
            }
            document.getElementById("back").style = "left: 0vw;";
            document.getElementById("resultsLeft").style = "left: 0vw";
            document.getElementById("resultsRight").style = "right: 0vw";
            inGame = 0;
            backgaudio.play();
          }
        });
        finish.run();
      }, 1000);
    });
  }, 1000);
});

setTimeout(function () {
  document.getElementById("startPopup").style =
    "opacity: 100%; transform: scale(1, 1) rotate(-1deg)";
  setTimeout(function () {
    document.getElementById("startPopup").style =
      "opacity: 100%; transform: scale(1, 1) rotate(-1deg); animation: rotateStart 5s ease-in-out infinite;";
  }, 500);
}, 250);

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

socket.on("connect", function () {
  connecttimes += 1;
  if (connecttimes > 1) {
  }
});

socket.on("systemMessage", (data) => {
  sendSystemMessage(data);
});

function updateSlider(data) {
  document.getElementById("masterVolume").innerHTML =
    "MASTER VOLUME (" + data.value + "%)";
  Howler.volume(data.value / 100);
  localStorage.setItem("prefVol", data.value);
}

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

if (
  localStorage.getItem("KBHbind1") == null ||
  localStorage.getItem("KBHbind2") == null ||
  localStorage.getItem("KBHbind3") == null ||
  localStorage.getItem("KBHbind4") == null ||
  localStorage.getItem("KBHbind5") == null ||
  localStorage.getItem("KBHbindS") == null ||
  localStorage.getItem("KBHbind1") == "" ||
  localStorage.getItem("KBHbind2") == "" ||
  localStorage.getItem("KBHbind3") == "" ||
  localStorage.getItem("KBHbind4") == "" ||
  localStorage.getItem("KBHbind5") == "" ||
  localStorage.getItem("KBHbindS") == ""
) {
  localStorage.setItem("KBHbind1", "KeyA");
  localStorage.setItem("KBHbind2", "KeyS");
  localStorage.setItem("KBHbind3", "KeyD");
  localStorage.setItem("KBHbind4", "KeyF");
  localStorage.setItem("KBHbind5", "KeyG");
  localStorage.setItem("KBHbindS", "Enter");
}

document.getElementById("change-bind1").innerHTML =
  "Keybind 1 (Currently: " + localStorage.getItem("KBHbind1") + ")";
document.getElementById("change-bind2").innerHTML =
  "Keybind 2 (Currently: " + localStorage.getItem("KBHbind2") + ")";
document.getElementById("change-bind3").innerHTML =
  "Keybind 3 (Currently: " + localStorage.getItem("KBHbind3") + ")";
document.getElementById("change-bind4").innerHTML =
  "Keybind 4 (Currently: " + localStorage.getItem("KBHbind4") + ")";
document.getElementById("change-bind5").innerHTML =
  "Keybind 5 (Currently: " + localStorage.getItem("KBHbind5") + ")";
document.getElementById("change-bind6").innerHTML =
  "Strum Keybind (Currently: " + localStorage.getItem("KBHbindS") + ")";
