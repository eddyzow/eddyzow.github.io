const socket = io("https://eddyzow.herokuapp.com/"); // Socket
var numQuestions = 1;
var qelem;
var qnum;
var page = 0;
var searchedId = 0;
var howlerMuted = 0;
var totalRepair = 0;
var correctAnswer = 0;
var repairers = {};
var totalquestions;
var correctAnswerWord = "";
var survivedTime = 0;
var bossinithealth = 1000000;
var gameState = 0;
var tournendTimer;
var tournendTimer1;
var eliminatedList = [];
var blitzStopwatch;
var stopwatch = 0;
var currentWork = 0;
var unsaved = 0;
var gamemode = 0;
var cashTime = 0;
var minPlayers = [9999999, 3, 3, 3, 1, 1, 1, 3, 3];
var saving = 0;
var cashintro = new Howl({
  src: ["../../assets/sound/music/20.mp3"],
  rate: 1,
  preload: false,
});

document.getElementById("difficulty").selectedIndex = 2;
document.getElementById("startingHP").value = "1000000";
document.getElementById("gameLength").value = "5";

function openSurvivalSettings(id, token) {
  document.getElementById("survival-starting-hp").style =
    "position: static; visibility: visible";
  document.getElementById("survival-difficulty").style =
    "position: static; visibility: visible";
  document.getElementById("gameHostPrescreen").style = "";
  document.getElementById("gameHostSettings").style =
    "visibility: visible; bottom: 0;";
  document
    .getElementById("host-survival")
    .addEventListener("click", function () {
      if (
        Number.parseInt(
          document.getElementById("startingHP").value
        ).toString() == "NaN"
      ) {
        alert("You need to set starting HP for this game");
      } else {
        document.getElementById("gameHostPrescreen").style =
          "visibility: hidden; bottom: -100%;";
        document.getElementById("gameHostSettings").style =
          "visibility: hidden; bottom: -100%;";
        bossinithealth = Number.parseInt(
          document.getElementById("startingHP").value
        );
        socket.emit("hostRequest", {
          id: id,
          token: token,
          startingHP: document.getElementById("startingHP").value,
          difficulty: document.getElementById("difficulty").selectedIndex,
          mode: 7,
        });
      }
    });
}

function openCashSettings(id, token) {
  document.getElementById("gametime").style =
    "position: static; visibility: visible";
  document.getElementById("gameHostPrescreen").style = "";
  document.getElementById("gameHostSettings").style =
    "visibility: visible; bottom: 0;";
  document
    .getElementById("host-survival")
    .addEventListener("click", function () {
      if (
        Number.parseInt(
          document.getElementById("gameLength").value
        ).toString() == "NaN"
      ) {
        alert("You need to set the game length for this game.");
      } else {
        document.getElementById("gameHostPrescreen").style =
          "visibility: hidden; bottom: -100%;";
        document.getElementById("gameHostSettings").style =
          "visibility: hidden; bottom: -100%;";
        cashTime = Number.parseInt(document.getElementById("gameLength").value);
        socket.emit("hostRequest", {
          id: id,
          token: token,
          mode: 6,
        });
      }
    });
}

function openHeistSettings(id, token) {
  document.getElementById("gametime").style =
    "position: static; visibility: visible";
  document.getElementById("gameHostPrescreen").style = "";
  document.getElementById("gameHostSettings").style =
    "visibility: visible; bottom: 0;";
  document
    .getElementById("host-survival")
    .addEventListener("click", function () {
      if (
        Number.parseInt(
          document.getElementById("gameLength").value
        ).toString() == "NaN"
      ) {
        alert("You need to set the game length for this game.");
      } else {
        document.getElementById("gameHostPrescreen").style =
          "visibility: hidden; bottom: -100%;";
        document.getElementById("gameHostSettings").style =
          "visibility: hidden; bottom: -100%;";
        cashTime = Number.parseInt(document.getElementById("gameLength").value);
        socket.emit("hostRequest", {
          id: id,
          token: token,
          mode: 8,
        });
      }
    });
}

function display(seconds) {
  const format = (val) => `0${Math.floor(val)}`.slice(-2);
  const hours = seconds / 3600;
  const minutes = (seconds % 3600) / 60;
  return [minutes, seconds % 60].map(format).join(":");
}

function sendChat(chat) {
  let elem = document.createElement("div");
  elem.setAttribute("class", "chat-message");
  elem.innerHTML = chat;
  document.getElementById("chatFeed").appendChild(elem);
  setTimeout(function () {
    elem.remove();
  }, 7500);
}

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// zxzx

// -2 > MAJOR!!!: verify lengths of any inputs in the server to prevent overload
// -3 > MAJOR!!!: spinner usernames
// -4 > MAJOR!!!: Words: show list of letters already typed.
// -5 > MAJOR!!!: Words: If puzzle is already solved...

//

// Game States
// 0: Not In Game
// 1: In Game Waiting Room
// 2: Pre-Question
// 3: During Question
// 4: Post-Question
// 5: Leaderboard

// Pages
// 0: Home Menu
// 1: Searching For Games
// 2: Your Games
// 3: Editor

// Modes:
// 1: Classic
// 2: Blitz
// 3: Feud
// 4: Words
// 5: Team
// 6: Cash
// 7: Boss Fight
// 8: Speed

function zeroPad(num, numZeros) {
  var n = Math.abs(num);
  var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
  var zeroString = Math.pow(10, zeros).toString().substr(1);
  if (num < 0) {
    zeroString = "-" + zeroString;
  }

  return zeroString + n;
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function ordinal_suffix_of(i) {
  var j = i % 10,
    k = i % 100;
  if (j == 1 && k != 11) {
    return i + "st";
  }
  if (j == 2 && k != 12) {
    return i + "nd";
  }
  if (j == 3 && k != 13) {
    return i + "rd";
  }
  return i + "th";
}

document.getElementById("lobbyMusic").selectedIndex = 0;

var lobbyloop = new Howl({
  src: ["../../assets/sound/music/13.mp3"],
  loop: true,
  rate: 1,
  preload: false,
});

var dramaticBoom = new Howl({
  src: ["../../assets/sound/fx/boom.mp3"],
  rate: 1,
});

var dramaticMusic = new Howl({
  src: ["../../assets/sound/music/22.mp3"],
  loop: true,
  rate: 1,
  preload: false,
  volume: 0.6,
});

var spyMusic = new Howl({
  src: ["../../assets/sound/music/25.mp3"],
  loop: true,
  rate: 1,
  volume: 0.8,
  preload: false,
});

var happyMusic = new Howl({
  src: ["../../assets/sound/music/24.mp3"],
  loop: true,
  rate: 1,
  volume: 0.3,
  preload: false,
});

var sadMusic = new Howl({
  src: ["../../assets/sound/music/23.mp3"],
  loop: true,
  rate: 1,
  preload: false,
});

var blitzrules = new Howl({
  src: ["../../assets/sound/music/13S.mp3"],
  loop: true,
  rate: 1,
  preload: false,
});

var questionMusic30 = new Howl({
  src: ["../../assets/sound/music/18.mp3"],
  loop: true,
  rate: 1,
  preload: false,
});

var questionMusic120 = new Howl({
  src: ["../../assets/sound/music/19.mp3"],
  loop: true,
  rate: 1,
  preload: false,
});

var questionMusic45 = new Howl({
  src: ["../../assets/sound/music/21.mp3"],
  loop: true,
  rate: 1,
  preload: false,
});

var questionMusic15 = new Howl({
  src: ["../../assets/sound/music/20.mp3"],
  loop: true,
  rate: 1,
  preload: false,
});

var questionMusic20 = new Howl({
  src: ["../../assets/sound/music/20.mp3"],
  loop: true,
  rate: 1,
  preload: false,
});

var p321 = new Howl({
  src: ["../../assets/sound/fx/321.mp3"],
  rate: 1,
});

var p321s = new Howl({
  src: ["../../assets/sound/fx/321-short.mp3"],
  rate: 1,
});

var gameFinish = new Howl({
  src: ["../../assets/sound/fx/correctAnswer.mp3"],
  rate: 1,
});

var blitzStart = new Howl({
  src: ["../../assets/sound/fx/matchBegin.mp3"],
  rate: 1,
});

var winnersScreenSound = new Howl({
  src: ["../../assets/sound/fx/liveWon.mp3"],
  rate: 1,
});

var blitzMusic = new Howl({
  src: ["../../assets/sound/music/15.mp3"],
  loop: true,
  rate: 1,
  preload: false,
});

window.onbeforeunload = function () {
  if (page == 3 && unsaved == 1) {
    return "Are you sure you want to leave?";
  }
};

document.getElementById("wallpaper").style["background-image"] =
  'url("../../assets/art/wallpapers/' +
  (Math.floor(Math.random() * 8) + 1).toString() +
  '.jpg")';

// verify login
socket.emit("verifyToken", localStorage.getItem("userToken"));
socket.on("accessToken", (info) => {
  if (info != false) {
    // logged in
    socket.emit("getUsername", localStorage.getItem("userToken"));
    socket.emit("getPlus", localStorage.getItem("userToken"));
  }
});

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function isOdd(num) {
  return num % 2 == 1;
}

socket.on("fatalError", (data) => {
  console.log(data);
  localStorage.removeItem("hostInformation");
  localStorage.removeItem("username");
  localStorage.removeItem("userToken");
  localStorage.removeItem("id");
  localStorage.removeItem("level");
  document.getElementById("loggedOutModal").style.visibility = "visible";
  document.getElementById("loggedOutModal").style.opacity = "100%";
  document.getElementById("loggedOutPopup").style.visibility = "visible";
  document.getElementById("loggedOutPopup").style.opacity = "100%";
  document.getElementById("loggedOutPopup").style.transform =
    "translate(-50%, -50%) scale(1, 1)";
});

function isNumeric(str) {
  if (typeof str != "string") return false; // we only process strings!
  return (
    !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
    !isNaN(parseFloat(str))
  ); // ...and ensure strings of whitespace fail
}

document.getElementById("loggedOutButton").onclick = function logout() {
  sessionStorage.setItem("dir", "create");
  window.location.href = "../../";
};

document.getElementById("startingHP").oninput = function () {
  if (isNumeric(document.getElementById("startingHP").value) == false) {
    document.getElementById("startingHP").value = document
      .getElementById("startingHP")
      .value.slice(0, -1);
  }
};

document.getElementById("gameLength").oninput = function () {
  if (isNumeric(document.getElementById("gameLength").value) == false) {
    document.getElementById("gameLength").value = document
      .getElementById("gameLength")
      .value.slice(0, -1);
  }
};

function attemptHost(id, token, setname) {
  document.getElementById("gameHostPrescreen").scrollTo(0, 0);
  document.body.style.overflowY = "hidden";
  // user wants to host a game.
  if (setname != null) {
    document.getElementById("setname").innerHTML = setname;
    document.getElementById("setname2").innerHTML = setname;
  }

  document.getElementById("gameHostPrescreen").style =
    "visibility: visible; bottom: 0;";

  var old_element = document.getElementById("classic-quiz");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  var old_element = document.getElementById("blitz-quiz");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  var old_element = document.getElementById("words-quiz");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  var old_element = document.getElementById("cash-quiz");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  var old_element = document.getElementById("boss-quiz");
  var new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  document
    .getElementById("classic-quiz")
    .addEventListener("click", function () {
      document.getElementById("gameHostPrescreen").style =
        "visibility: hidden; bottom: -100%;";
      socket.emit("hostRequest", {
        id: id,
        token: token,
        mode: 1,
      });
    });
  document.getElementById("blitz-quiz").addEventListener("click", function () {
    document.getElementById("gameHostPrescreen").style =
      "visibility: hidden; bottom: -100%;";
    socket.emit("hostRequest", {
      id: id,
      token: token,
      mode: 2,
    });
  });
  document.getElementById("words-quiz").addEventListener("click", function () {
    document.getElementById("gameHostPrescreen").style =
      "visibility: hidden; bottom: -100%;";
    socket.emit("hostRequest", {
      id: id,
      token: token,
      mode: 4,
    });
  });
  document.getElementById("cash-quiz").addEventListener("click", function () {
    document.getElementById("gameHostPrescreen").style =
      "visibility: hidden; bottom: -100%;";
    openCashSettings(id, token);
  });
  document.getElementById("boss-quiz").addEventListener("click", function () {
    document.getElementById("gameHostPrescreen").style =
      "visibility: hidden; bottom: -100%;";
    openSurvivalSettings(id, token);
  });
  document.getElementById("heist-quiz").addEventListener("click", function () {
    document.getElementById("gameHostPrescreen").style =
      "visibility: hidden; bottom: -100%;";
    openHeistSettings(id, token);
  });

  // socket.emit("hostRequest", {
  //id: id,
  //token: token,
  //});
  //console.log(token);
  //console.log("Testing1");
}

lobbyloop.on("fade", function () {
  lobbyloop.stop();
  lobbyloop.volume(1);
});

cashintro.on("fade", function () {
  cashintro.stop();
  cashintro.volume(1);
});

blitzrules.on("fade", function () {
  blitzrules.stop();
  blitzrules.volume(1);
});

sadMusic.on("fade", function () {
  sadMusic.stop();
  sadMusic.volume(1);
});

questionMusic15.on("fade", function () {
  questionMusic15.stop();
  questionMusic15.volume(1);
});

questionMusic20.on("fade", function () {
  questionMusic20.stop();
  questionMusic20.volume(1);
});

questionMusic30.on("fade", function () {
  questionMusic30.stop();
  questionMusic30.volume(1);
});

questionMusic45.on("fade", function () {
  questionMusic45.stop();
  questionMusic45.volume(1);
});

questionMusic120.on("fade", function () {
  questionMusic120.stop();
  questionMusic120.volume(1);
});

blitzMusic.on("fade", function () {
  blitzMusic.stop();
  blitzMusic.volume(1);
});

socket.on("hostGameCreated", (obj) => {
  document.getElementById("infoEndButton").style = "visibility: hidden";
  document.getElementById("infoAdvanceButton").style = "visibility: hidden";
  gameState = 1;
  page = 3;
  saving = 0;
  gamemode = obj.mode;
  if (obj.mode == 7) {
    dramaticMusic.load();
  }
  if (obj.mode == 8) {
    spyMusic.load();
  }
  if (obj.mode == 1) {
    document.getElementById("blitzlist").style = "visibility: hidden";
    document.getElementById("blitzOn").checked = false;
    document.getElementById("blitzOn").style = "visibility: hidden";
    document.getElementById("blitzTitle").style = "visibility: hidden";
  } else if (obj.mode == 2) {
    document.getElementById("blitzlist").style = "";
    document.getElementById("blitzOn").checked = true;
    document.getElementById("blitzOn").style = "visibility: hidden";
    document.getElementById("blitzTitle").style = "visibility: hidden";
  } else {
    document.getElementById("blitzlist").style = "visibility: hidden";
    document.getElementById("blitzOn").checked = false;
    document.getElementById("blitzOn").style = "visibility: hidden";
    document.getElementById("blitzTitle").style = "visibility: hidden";
  }

  document.getElementById("infoEndButton").disabled = true;
  document.getElementById("infoAdvanceButton").disabled = true;

  document.body.style = "overflow-y: hidden";
  document.getElementById("liveGameStartButton").innerHTML = "Start";
  document.getElementById("liveGameLobby").style.visibility = "visible";
  document.getElementById("liveGameLobby").style.opacity = "100%";
  document.getElementById("joinCodeShow").style.top = "0px";
  document.getElementById("lowerScreenPanel").style.bottom = "0px";
  document.getElementById("usernamesScreenPanel").style.visibility = "visible";
  document.getElementById("gameInfoBar").style =
    "visibility: visible; opacity: 100%;";
  document.getElementById("gameMuteButton").style =
    "visibility: visible; opacity: 100%;";
  document.getElementById("joinCodeShow").style.visibility = "visible";
  document.getElementById("lowerScreenPanel").style.visibility = "visible";
  document.getElementById("usernamesScreenPanel").style.opacity = "100%";
  document.getElementById("joinCodeShow").style.opacity = "100%";
  document.getElementById("lowerScreenPanel").style.opacity = "100%";
  document.getElementById("gameCodeDisplay").innerHTML = obj.gameCode;
  document.getElementById("liveGameStartButton").disabled = true;
  document.getElementById("liveGameStartButton").title =
    "You must have at least " +
    minPlayers[obj.mode] +
    " players in your game to begin";
  document.getElementById("liveGamePlayerCount").innerHTML = "Players: 0";
  document.getElementById("infoBarTitle").innerHTML = obj.setName;
  document.getElementById("infoBarQuestions").innerHTML =
    obj.questionLength + " Questions";
  document.getElementById("infoBarWaiting").innerHTML =
    "Waiting for players...";
  document.getElementById("infoBarWaiting").style.visibility = "visible";
  document.getElementById("infoBarWaiting").style.opacity = "100%";
  var paras = document.getElementsByClassName("playerUsername");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  let songs = ["14", "22", "24", "23", "13", "20", "12", "8", "2", "1"];
  lobbyloop = new Howl({
    src: [
      "../../assets/sound/music/" +
        songs[
          Number.parseInt(document.getElementById("lobbyMusic").value, 10)
        ] +
        ".mp3",
    ],
    loop: true,
    rate: 1,
  });
  if (document.getElementById("lobbyMusic").value != "9") {
    lobbyloop.play();
  }
});

document.getElementById("gameMuteButton").onclick = function () {
  if (howlerMuted == 0) {
    Howler.mute(true);
    howlerMuted = 1;
    document.getElementById("gameMuteButton").innerHTML = "Sound: OFF";
    document.getElementById("gameMuteButton").style.background =
      "rgb(109, 109, 109)";
  } else {
    Howler.mute(false);
    howlerMuted = 0;
    document.getElementById("gameMuteButton").innerHTML = "Sound: ON";
    document.getElementById("gameMuteButton").style.background =
      "rgb(0, 209, 209)";
  }
};

socket.on("playerJoinedLiveGame", (data) => {
  // data includes: username, socketid, newPlayers, mode
  console.log("A player joined! Following information was passed:");
  console.log(data);
  document.getElementById("liveGamePlayerCount").innerHTML =
    "Players: " + data.newPlayers;
  // create element
  qelem = document.createElement("div");
  qelem.setAttribute("class", "playerUsername");
  qelem.setAttribute("id", data.socketid);
  qelem.textContent = data.username;
  qelem.addEventListener("click", function () {
    kickPlayer(data.socketid);
  });
  document.getElementById("liveGameStartButton").title =
    "You must have at least " +
    minPlayers[data.mode] +
    " players in your game to begin";

  document.getElementById("usernamesScreenPanel").appendChild(qelem);
  if (data.newPlayers >= minPlayers[data.mode]) {
    document.getElementById("liveGameStartButton").disabled = false;
  }
});

function kickPlayer(socketid) {
  socket.emit("kickPlayer", {
    socketid: socketid,
    token: localStorage.getItem("userToken"),
  });
}

socket.on("kickingSuccessful", (data) => {
  document.getElementById(data.kickedId).remove();
  document.getElementById("liveGamePlayerCount").innerHTML =
    "Players: " + data.playerCount;
  console.log(data);
  if (data.playerCount < 5) {
    document.getElementById("liveGameStartButton").disabled = true;
  }
});

document.getElementById("liveGameStartButton").onclick = function () {
  if (document.getElementById("liveGameStartButton").disabled == false) {
    // on server side, check if players for the game are adequate
    document.getElementById("liveGameStartButton").disabled = true;
    socket.emit("startLiveGame", {
      token: localStorage.getItem("userToken"),
      blitzEnabled: document.getElementById("blitzOn").checked,
    });
  }
};

socket.on("gameInfoReturned", (data) => {
  if (data.gamemode == 6) {
    document.getElementById("totalcashcash").innerHTML = "$" + data.totalCash;
    document.getElementById("richestmoneycash").innerHTML =
      "$" + data.richestCash;
    document.getElementById("firstplacecash").innerHTML = data.firstplace;
    document.getElementById("secondplacecash").innerHTML = data.secondplace;
    document.getElementById("thirdplacecash").innerHTML = data.thirdplace;
  } else {
    document.getElementById("totalcashheist").innerHTML =
      "$" + data.totalCash.toFixed(2);
    document.getElementById("richestmoneyheist").innerHTML =
      "$" + data.richestCash.toFixed(2);
  }
});

socket.on("fightGameEnded", function () {
  document.getElementById("chatFeed").style.visibility = "hidden";
  sadMusic.load();
  happyMusic.load();
  document.getElementById("wallpaper").style.filter = "";
  console.log("Fight Game Ended ");
  let elem = document.createElement("div");
  elem.setAttribute("class", "blackScreen");
  document.body.appendChild(elem);
  dramaticMusic.stop();
  dramaticBoom.play();
  document.getElementById("bossLiveScreen").style = "";
  document.getElementById("bossDeathScreen").style =
    "visibility: visible; opacity: 100%";
  setTimeout(function () {
    sadMusic.play();
    setTimeout(() => {
      sadMusic.fade(1, 0, 1000);
      setTimeout(function () {
        happyMusic.play();
      }, 3000);
    }, 8600);
  }, 4000);
});

socket.on("bossFightUpdate", (data) => {
  document.getElementById("lossPerSecond").innerHTML =
    "Health Drain/Second: " +
    numberWithCommas((0.17 * Math.pow(data[1], 2)).toFixed(2));
  document.getElementById("bossBar").innerHTML = data[0].toFixed(2);
  document.getElementById("bossStopwatch").innerHTML = display(data[1]);
  document.getElementById("survivalTime").innerHTML = display(data[1]);
  document.getElementById("bossfact2").innerHTML =
    "The final health drain per second at the end of the game was " +
    (0.15 * Math.pow(data[1], 2)).toFixed(2);
  if (data[0] <= 500000) {
    document.getElementById("bossBar").style.background =
      "linear-gradient(to right, rgb(151, 0, 0) 0%, rgb(255, 0, 0) " +
      (data[0] / (bossinithealth / 100) - 3) +
      "%, transparent " +
      data[0] / (bossinithealth / 100) +
      "%)";
  } else {
    document.getElementById("bossBar").style.background =
      "linear-gradient(to right, rgb(0, 194, 194) 0%, rgb(0, 102, 255) " +
      (data[0] / (bossinithealth / 100) - 3) +
      "%, transparent " +
      data[0] / (bossinithealth / 100) +
      "%)";
  }
  survivedTime = data[1];
  if (data[1] % 60 == 0) {
    sendChat("Great job! You've survived for " + data[1] / 60 + " minute(s).");
  }
  if (data[1] % 20 == 0) {
    sendChat("The boss is enraged and does more and more damage!");
  }
  if (data[0] < 0) {
    document.getElementById("bossBar").innerHTML = "0.00";
  }
});

socket.on("bossFightUpdate2", (data) => {
  totalRepair += data[1];
  document.getElementById("bossfact1").innerHTML =
    "The class gained a total amount of " +
    totalRepair.toFixed(2) +
    " health during the game.";
  if (data[2] in repairers == false) {
    repairers[data[2]] = 0;
  }
  repairers[data[2]] += data[1];
  let sortedobj = Object.entries(repairers).sort(([, a], [, b]) => b - a);

  document.getElementById("bossfact3").innerHTML =
    sortedobj[0][0] +
    " contributed the most to repairing team health, with " +
    sortedobj[0][1].toFixed(2) +
    " health!";
  if (data[1] > 0) {
    sendChat(
      data[2] + " just repaired " + data[1].toFixed(2) + " health to the team!"
    );
  }
});

socket.on("questionAnsweredFight", function () {
  totalquestions += 1;
  document.getElementById("bossfact4").innerHTML =
    totalquestions + " questions were answered in total this game!";
});

socket.on("gameStarting", (mode) => {
  totalRepair = 0;
  totalquestions = 0;
  repairers = {};
  cashintro.load();
  document.getElementById("infoEndButton").style = "";
  document.getElementById("infoAdvanceButton").style = "";
  console.log("Game starting!");
  p321.play();
  document.getElementById("liveGameStartButton").innerHTML = "3";
  setTimeout(function () {
    document.getElementById("liveGameStartButton").innerHTML = "2";
    setTimeout(function () {
      document.getElementById("liveGameStartButton").innerHTML = "1";
      setTimeout(function () {
        document.getElementById("infoBarWaiting").innerHTML =
          "Game Code: " + document.getElementById("gameCodeDisplay").innerHTML;
        document.getElementById("liveGameStartButton").innerHTML = "0";
        document.getElementById("joinCodeShow").style.top = "-600px";
        document.getElementById("lowerScreenPanel").style.bottom = "-50vh";
        document.getElementById("usernamesScreenPanel").style.opacity = "0%";
        document.getElementById("joinCodeShow").style.opacity = "0%";
        document.getElementById("lowerScreenPanel").style.opacity = "0%";
        document.getElementById("usernamesScreenPanel").style.visibility =
          "hidden";
        document.getElementById("joinCodeShow").style.visibility = "hidden";
        document.getElementById("lowerScreenPanel").style.visibility = "hidden";
        lobbyloop.fade(1, 0, 1000);
        if (mode == 1 || mode == 2) {
          socket.emit("nextQuestion", localStorage.getItem("userToken"));
        } else if (mode == 4) {
          socket.emit("nextWordQuestion", localStorage.getItem("userToken"));
        } else if (mode == 6) {
          cashintro.load();
          cashintro.play();
          setTimeout(function () {
            document.getElementById("pregame").innerHTML =
              "Welcome to Cash Grab!";
            document.getElementById("cashScreen").style =
              "visibility: visible;";
            console.log("Welcome to Cash Grab!");
            setTimeout(function () {
              document.getElementById("pregame").innerHTML =
                "Your job is to get the most money by answering questions!";

              console.log(
                "Your job is to get the most money by answering questions!"
              );
              setTimeout(function () {
                document.getElementById("pregame").innerHTML =
                  "You can buy powerups to get more money with a correct answer...";

                console.log(
                  "You can buy powerups to get more money with a correct answer..."
                );
                setTimeout(function () {
                  document.getElementById("pregame").innerHTML =
                    "... or to lose less with a wrong answer.";

                  console.log("... or to lose less with a wrong answer.");
                  setTimeout(function () {
                    document.getElementById("pregame").innerHTML = "Good luck!";
                    cashintro.fade(1, 0, 1000);
                    setTimeout(function () {
                      document.getElementById("cashScreen").style = "";
                      socket.emit(
                        "beginCash",
                        localStorage.getItem("userToken")
                      );
                      document.getElementById("gameInfoBar").style.visibility =
                        "hidden";
                      document.getElementById(
                        "infoBarWaiting"
                      ).style.visibility = "hidden";
                      document.getElementById("infoBarWaiting").style.opacity =
                        "0%";
                      document.getElementById("cashLiveScreen").style =
                        "visibility: visible; opacity: 1";
                      document.getElementById("chatFeed").style.visibility =
                        "visible";
                      sendChat("The Game has started!");
                      questionMusic45.load();
                      questionMusic45.play();
                      cashTime = Math.ceil(cashTime * 60);
                      var cashInterval = setInterval(function () {
                        cashTime -= 1;
                        document.getElementById("cashTimer").innerHTML =
                          display(cashTime);
                        if (cashTime % 5 == 0) {
                          socket.emit(
                            "askGameInfo",
                            localStorage.getItem("userToken")
                          );
                        }
                        if (cashTime == 0) {
                          clearInterval(cashInterval);
                          socket.emit(
                            "endCashGame",
                            localStorage.getItem("userToken")
                          );
                        }
                      }, 1000);
                    }, 500);
                  }, 3700);
                }, 3700);
              }, 3700);
            }, 1850);
          }, 1400);
        } else if (mode == 7) {
          survivedTime = 0;
          dramaticMusic.play();
          setTimeout(function () {
            document.getElementById("pregame").innerHTML =
              "One team against one boss!";
            document.getElementById("cashScreen").style =
              "visibility: visible;";
            setTimeout(function () {
              document.getElementById("pregame").innerHTML =
                "You earn ⬙ power and team health for answering questions.";
              setTimeout(function () {
                document.getElementById("pregame").innerHTML =
                  "Purchasing upgrades with your ⬙ power is crucial to surviving!";
                setTimeout(function () {
                  document.getElementById("pregame").innerHTML =
                    "The more power you earn, the more health you repair to your team! Your team starts with " +
                    numberWithCommas(bossinithealth) +
                    " health.";
                  setTimeout(function () {
                    document.getElementById("pregame").innerHTML =
                      "Your health is dropping. Every player counts. Survive as long as you can!";
                    cashintro.fade(1, 0, 1000);
                    setTimeout(function () {
                      document.getElementById("cashScreen").style = "";
                      socket.emit(
                        "beginBoss",
                        localStorage.getItem("userToken")
                      );
                      document.getElementById("infoEndButton").style =
                        "visibility: hidden; opacity: 0%";
                      document.getElementById("infoAdvanceButton").style =
                        "visibility: hidden; opacity: 0%";
                      document.getElementById(
                        "infoBarWaiting"
                      ).style.visibility = "visible";
                      document.getElementById("infoBarWaiting").style.opacity =
                        "100%";
                      document.getElementById("bossLiveScreen").style =
                        "visibility: visible; opacity: 1";
                      document.getElementById("wallpaper").style.filter =
                        "brightness(25%)";
                      document.getElementById("chatFeed").style.visibility =
                        "visible";
                      sendChat("The Game has started!");
                    }, 4500);
                  }, 4800);
                }, 4800);
              }, 4800);
            }, 4800);
          }, 400);
        } else if (mode == 8) {
          cashintro.load();
          cashintro.play();
          setTimeout(function () {
            document.getElementById("pregame").innerHTML =
              "This is the only time you'll ever be encouraged to steal.";
            document.getElementById("cashScreen").style =
              "visibility: visible;";
            setTimeout(function () {
              document.getElementById("pregame").innerHTML =
                "Answer questions to earn money! Then, spend your money to rob other players!";
              setTimeout(function () {
                document.getElementById("pregame").innerHTML =
                  "You can also spend your money on other upgrades to protect yourself from being robbed.";
                setTimeout(function () {
                  document.getElementById("pregame").innerHTML =
                    "Keep an eye out for every detail so you know who has money!";
                  setTimeout(function () {
                    document.getElementById("pregame").innerHTML =
                      "May the best robber win!";
                    cashintro.fade(1, 0, 1000);
                    setTimeout(function () {
                      document.getElementById("gameInfoBar").style.visibility =
                        "hidden";
                      document.getElementById(
                        "infoBarWaiting"
                      ).style.visibility = "hidden";
                      document.getElementById("infoBarWaiting").style.opacity =
                        "0%";
                      socket.emit(
                        "beginHeist",
                        localStorage.getItem("userToken")
                      );
                      document.getElementById("chatFeed").style.visibility =
                        "visible";
                      document.getElementById("heistLiveScreen").style =
                        "visibility: visible; opacity: 1";
                      document.getElementById("cashScreen").style = "";
                      sendChat("The Game has started!");
                      spyMusic.play();
                      cashTime = Math.ceil(cashTime * 60);
                      var cashInterval = setInterval(function () {
                        cashTime -= 1;
                        document.getElementById("heistTimer").innerHTML =
                          display(cashTime);
                        if (cashTime % 5 == 0) {
                          socket.emit(
                            "askGameInfo",
                            localStorage.getItem("userToken")
                          );
                        }
                        if (cashTime <= 0) {
                          cashTime = 99999;
                          clearInterval(cashInterval);
                          socket.emit(
                            "endCashGame",
                            localStorage.getItem("userToken")
                          );
                        }
                      }, 1000);
                    }, 500);
                  }, 3700);
                }, 3700);
              }, 3700);
            }, 1850);
          }, 1400);
        }
      }, 500);
    }, 500);
  }, 500);
});

socket.on("sendChatHeist", (data) => {
  sendChat(data);
});

socket.on("sendUpgrade", (data) => {
  if (data.type == "mpq") {
    if (data.mode == 7) {
      sendChat(
        data.username +
          " upgraded Points Per Question to level " +
          data.newlevel
      );
    } else if (data.mode == 6) {
      sendChat(
        data.username + " upgraded Money Per Question to level " + data.newlevel
      );
    }
  }
  if (data.type == "streakBonus") {
    sendChat(
      data.username + " upgraded Streak Bonus to level " + data.newlevel
    );
  }
  if (data.type == "multiplier") {
    sendChat(data.username + " upgraded Multiplier to level " + data.newlevel);
  }
  if (data.type == "insurance") {
    sendChat(data.username + " upgraded Insurance to level " + data.newlevel);
  }
  if (data.type == "health") {
    sendChat(
      data.username + " upgraded Extra Health to level " + data.newlevel
    );
  }
});

document.getElementById("endCashGameEarly").onclick = function () {
  socket.emit("endCashGame", localStorage.getItem("userToken"));
};

document.getElementById("endHeistGameEarly").onclick = function () {
  socket.emit("endCashGame", localStorage.getItem("userToken"));
};

document.getElementById("endBossGameEarly").onclick = function () {
  socket.emit("endBossGame", localStorage.getItem("userToken"));
};

socket.on("nextWordQuestion", (data) => {
  try {
    clearInterval(tournendTimer);
  } catch {}
  gameState = 2;
  document.getElementById("infoEndButton").disabled = true;
  document.getElementById("infoAdvanceButton").disabled = true;
  document.getElementById("leaderboardScreen").style =
    "visibility: hidden; opacity: 0%;";
  document.getElementById("questionScreen").style =
    "visibility: hidden; opacity: 0%;";
  document.getElementById("loadingBar").style.visibility = "visible";
  document.getElementById("loadingBar").style.width = "90vw";
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("loading").style.opacity = "100%";
  document.getElementById("loadingQuestion").innerHTML =
    "Question " + data.current + " of " + data.length;
  document.getElementById("answers-text").innerHTML = "Solved";
  document.getElementById("elimPl").style = "visibility: hidden;";
  document.getElementById("liveQuestionEliminated").style =
    "position: fixed; visibility: hidden;";
  colorKey = 255 - 51 * data.playersEliminated;
  if (colorKey >= 0) {
    document.getElementById("eliminatedPlayers").style.color =
      "rgb(255, " + colorKey + ", " + colorKey + ")";
  } else {
    document.getElementById("eliminatedPlayers").style.color = "rgb(255, 0, 0)";
  }
  if (data.timeLimit <= 15) {
    questionMusic15.volume(0.4);
    questionMusic15.load();
    questionMusic15.play();
  }
  document.getElementById("correctWordsDisplay").style =
    "font-size: 3vw; color: white; text-align: center; visibility: hidden; opacity: 0%";
  setTimeout(function () {
    gameState = 3;
    document.getElementById("infoAdvanceButton").disabled = false;
    document.getElementById("infoAdvanceButton").innerHTML = "Skip";
    document.getElementById("loading").style.opacity = "0%";
    document.getElementById("loading").style.visibility = "hidden";
    document.getElementById("loadingBar").style.visibility = "hidden";
    document.getElementById("loadingBar").style.width = "0vw";
    document.getElementById("answerOptionWrapper").style =
      "visibility: hidden; opacity: 0%; position: fixed";
    document.getElementById("questionScreen").style.visibility = "visible";
    document.getElementById("questionScreen").style.opacity = "100%";
    document.getElementById("questionTimer").style.visibility = "visible";
    document.getElementById("questionTimer").style.opacity = "100%";
    document.getElementById("playersAnsweredWrapper").style.visibility =
      "visible";
    document.getElementById("playersAnsweredWrapper").style.opacity = "100%";
    // set things to what is in object.
    document.getElementById("questionTimer").innerHTML = data.timeLimit;
    document.getElementById("liveQuestionNumber").innerHTML =
      "Question " + data.current + "/" + data.length;
    document.getElementById("liveQuestionEliminated").innerHTML =
      data.playersEliminated + " Eliminated";
    document.getElementById("playersAnswered").innerHTML = "0";
    document.getElementById("liveQuestionText").innerHTML =
      data.question.questionText;
    correctAnswer = data.question.correct;
    correctAnswerWord = data.question["a" + data.question.correct];
    document.getElementById("correctWordsDisplay").innerHTML =
      "Correct Answer: " + correctAnswerWord;
    if (data.timeLimit > 15) {
      // 15, 20, 30, 45, 120
      if (data.timeLimit >= 90) {
        questionMusic120.load();
        questionMusic120.play();
      } else if (data.timeLimit >= 45) {
        questionMusic45.load();
        questionMusic45.play();
      } else if (data.timeLimit >= 30) {
        questionMusic30.load();
        questionMusic30.play();
      } else {
        questionMusic20.load();
        questionMusic20.play();
      }
    }
    // time limit
    var timeleft = data.timeLimit;
    tournendTimer = setInterval(function () {
      timeleft -= 1;
      document.getElementById("questionTimer").innerHTML = timeleft;
      if (timeleft <= 0) {
        clearInterval(tournendTimer);
      }
    }, 1000);
  }, 5000);
});

socket.on("nextQuestion", (data) => {
  document.getElementById("correctWordsDisplay").style =
    "font-size: 3vw; color: white; text-align: center; visibility: hidden; opacity: 0%";
  try {
    clearInterval(tournendTimer);
  } catch {}
  gameState = 2;
  document.getElementById("infoEndButton").disabled = true;
  document.getElementById("infoAdvanceButton").disabled = true;
  console.log("This is the next question!");
  console.log(data);
  document.getElementById("leaderboardScreen").style =
    "visibility: hidden; opacity: 0%;";
  document.getElementById("questionScreen").style =
    "visibility: hidden; opacity: 0%;";
  document.getElementById("loadingBar").style.visibility = "visible";
  document.getElementById("loadingBar").style.width = "90vw";
  document.getElementById("elimPl").style = "";
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("loading").style.opacity = "100%";
  document.getElementById("loadingQuestion").innerHTML =
    "Question " + data.current + " of " + data.length;
  document.getElementById("liveQuestionEliminated").style = "";
  if (data.mode != 2) {
    document.getElementById("elimPl").style = "visibility: hidden;";
    document.getElementById("liveQuestionEliminated").style =
      "position: fixed; visibility: hidden;";
  }
  document.getElementById("answers-text").innerHTML = "Answers";
  if (data.playersEliminated == 0) {
    document.getElementById("eliminatedPlayers").innerHTML = "No one";
  } else {
    document.getElementById("eliminatedPlayers").innerHTML =
      data.playersEliminated + " player(s)";
  }
  colorKey = 255 - 51 * data.playersEliminated;
  if (colorKey >= 0) {
    document.getElementById("eliminatedPlayers").style.color =
      "rgb(255, " + colorKey + ", " + colorKey + ")";
  } else {
    document.getElementById("eliminatedPlayers").style.color = "rgb(255, 0, 0)";
  }
  if (data.timeLimit <= 15) {
    questionMusic15.volume(0.4);
    questionMusic15.load();
    questionMusic15.play();
  }

  setTimeout(function () {
    gameState = 3;
    document.getElementById("infoAdvanceButton").disabled = false;
    document.getElementById("infoAdvanceButton").innerHTML = "Skip";
    document.getElementById("loading").style.opacity = "0%";
    document.getElementById("loading").style.visibility = "hidden";
    document.getElementById("loadingBar").style.visibility = "hidden";
    document.getElementById("loadingBar").style.width = "0vw";
    document.getElementById("questionScreen").style.visibility = "visible";
    document.getElementById("questionScreen").style.opacity = "100%";
    document.getElementById("questionTimer").style.visibility = "visible";
    document.getElementById("questionTimer").style.opacity = "100%";
    document.getElementById("playersAnsweredWrapper").style.visibility =
      "visible";
    document.getElementById("playersAnsweredWrapper").style.opacity = "100%";
    // set things to what is in object.
    document.getElementById("questionTimer").innerHTML = data.timeLimit;
    document.getElementById("liveQuestionNumber").innerHTML =
      "Question " + data.current + "/" + data.length;
    document.getElementById("liveQuestionEliminated").innerHTML =
      data.playersEliminated + " Eliminated";
    document.getElementById("playersAnswered").innerHTML = "0";
    document.getElementById("answerOption1").style = "";
    document.getElementById("answerOption2").style = "";
    document.getElementById("answerOption3").style = "";
    document.getElementById("answerOption4").style = "";
    document.getElementById("liveQuestionText").innerHTML =
      data.question.questionText;
    document.getElementById("answerOption1").innerHTML = data.question.a1;
    document.getElementById("answerOption2").innerHTML = data.question.a2;
    document.getElementById("answerOption3").innerHTML = data.question.a3;
    document.getElementById("answerOption4").innerHTML = data.question.a4;
    correctAnswer = data.question.correct;
    if (data.timeLimit > 15) {
      // 15, 20, 30, 45, 120
      if (data.timeLimit >= 90) {
        questionMusic120.load();
        questionMusic120.play();
      } else if (data.timeLimit >= 45) {
        questionMusic45.load();
        questionMusic45.play();
      } else if (data.timeLimit >= 30) {
        questionMusic30.load();
        questionMusic30.play();
      } else {
        questionMusic20.load();
        questionMusic20.play();
      }
    }
    // time limit
    var timeleft = data.timeLimit;
    tournendTimer = setInterval(function () {
      timeleft -= 1;
      document.getElementById("questionTimer").innerHTML = timeleft;
      if (timeleft <= 0) {
        clearInterval(tournendTimer);
      }
    }, 1000);
  }, 5000);
});

socket.on("someoneAnswered", function () {
  document.getElementById("playersAnswered").innerHTML =
    Number.parseInt(document.getElementById("playersAnswered").innerHTML) + 1;
});

socket.on("wordsQuestionEnded", (data) => {
  gameState = 4;
  document.getElementById("correctWordsDisplay").style =
    "font-size: 3vw; color: white; text-align: center; visibility: visible; opacity: 100%";
  document.getElementById("infoAdvanceButton").disabled = false;
  document.getElementById("infoAdvanceButton").innerHTML = "Next";
  console.log("Words question ended!");
  console.log(data);
  document.getElementById("questionTimer").style.opacity = "0%";
  document.getElementById("questionTimer").style.visibility = "hidden";
  document.getElementById("playersAnsweredWrapper").style.opacity = "0%";
  document.getElementById("playersAnsweredWrapper").style.visibility = "hidden";
  questionMusic20.fade(1, 0, 1000);
  questionMusic30.fade(1, 0, 1000);
  questionMusic45.fade(1, 0, 1000);
  questionMusic120.fade(1, 0, 1000);
  questionMusic15.fade(0.4, 0, 1000);
});

socket.on("questionEnded", (data) => {
  gameState = 4;
  document.getElementById("infoAdvanceButton").disabled = false;
  document.getElementById("infoAdvanceButton").innerHTML = "Next";
  console.log("Question ended!");
  console.log(data);
  document.getElementById("questionTimer").style.opacity = "0%";
  document.getElementById("questionTimer").style.visibility = "hidden";
  document.getElementById("playersAnsweredWrapper").style.opacity = "0%";
  document.getElementById("playersAnsweredWrapper").style.visibility = "hidden";
  questionMusic20.fade(1, 0, 1000);
  questionMusic30.fade(1, 0, 1000);
  questionMusic45.fade(1, 0, 1000);
  questionMusic120.fade(1, 0, 1000);
  questionMusic15.fade(0.4, 0, 1000);
  if (correctAnswer == 1) {
    document.getElementById("answerOption1").style.background =
      "rgb(0, 210, 15)";
    document.getElementById("answerOption1").style.color = "white";
  }
  if (correctAnswer == 2) {
    document.getElementById("answerOption2").style.background =
      "rgb(0, 210, 15)";
    document.getElementById("answerOption2").style.color = "white";
  }
  if (correctAnswer == 3) {
    document.getElementById("answerOption3").style.background =
      "rgb(0, 210, 15)";
    document.getElementById("answerOption3").style.color = "white";
  }
  if (correctAnswer == 4) {
    document.getElementById("answerOption4").style.background =
      "rgb(0, 210, 15)";
    document.getElementById("answerOption4").style.color = "white";
  }
  eliminatedList = data.eliminatedList;
});

document.getElementById("infoAdvanceButton").onclick = function () {
  if (document.getElementById("infoAdvanceButton").disabled == false) {
    document.getElementById("infoAdvanceButton").disabled = true;
    if (gameState == 3) {
      // Skip Question
      socket.emit("endQuestion", localStorage.getItem("userToken"));
    }
    if (gameState == 4) {
      socket.emit("pullLeaderboard", localStorage.getItem("userToken"));
    }
    if (gameState == 5) {
      if (gamemode == 4) {
        socket.emit("nextWordQuestion", localStorage.getItem("userToken"));
      } else if (gamemode == 1 || gamemode == 2) {
        socket.emit("nextQuestion", localStorage.getItem("userToken"));
      }
    }
  }
};

document.getElementById("infoEndButton").onclick = function () {
  if (document.getElementById("infoEndButton").disabled == false) {
    document.getElementById("infoEndButton").disabled = true;
    if (gameState == 5) {
      socket.emit("endLiveGame", localStorage.getItem("userToken"));
    }
  }
};

socket.on("playerRejoin", (data) => {
  document.getElementById(data.old).onclick = function () {
    kickPlayer(data.new);
  };
});

socket.on("leaderboardPulled", (data) => {
  document.getElementById("infoEndButton").disabled = false;
  document.getElementById("infoAdvanceButton").disabled = false;
  console.log("The leaderboard was pulled. Here's the data.");
  console.log(data);
  gameState = 5;
  // create leaderboard
  // show leaderboard and hide question
  document.getElementById("questionScreen").style =
    "visibility: hidden; opacity: 0%;";
  document.getElementById("leaderboardScreen").style =
    "visibility: visible; opacity: 100%;";
  var keys = data.keys.reverse();
  var values = data.values.reverse();
  var paras = document.getElementsByClassName("leaderboard-player");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  var placeLimit = 0;
  keys.forEach((key) => {
    placeLimit += 1;
    if (placeLimit <= 5) {
      qNum = document.createElement("div");
      qNum.setAttribute("class", "leaderboard-player");
      qNum1 = document.createElement("h1");
      qNum1.setAttribute("class", "player-position");
      qNum1.textContent = ordinal_suffix_of(keys.indexOf(key) + 1);
      qNum2 = document.createElement("div");
      qNum2.setAttribute("class", "leaderboard-username");
      qNum2.textContent = data.names[key];
      qNum3 = document.createElement("h1");
      qNum3.setAttribute("class", "leaderboard-points");
      qNum3.textContent = Math.floor(values[keys.indexOf(key)]);
      qNum.appendChild(qNum1);
      qNum.appendChild(qNum2);
      qNum.appendChild(qNum3);
      document.getElementById("rankingsList").appendChild(qNum);
    }
  });
  eliminatedList.slice(0, 5).forEach((player) => {
    qNum = document.createElement("div");
    qNum.setAttribute("class", "leaderboard-player");
    qNum2 = document.createElement("div");
    qNum2.setAttribute("class", "leaderboard-username");
    qNum2.textContent = "ELIMINATED";
    qNum3 = document.createElement("h1");
    qNum3.setAttribute("class", "leaderboard-points");
    qNum3.textContent = player;
    qNum.appendChild(qNum2);
    qNum.appendChild(qNum3);
    document.getElementById("rankingsList").appendChild(qNum);
  });
});

socket.on("cashGameEnded", (data) => {
  document.getElementById("chatFeed").style.visibility = "hidden";
  console.log(data);
  document.getElementById("1st-pts").innerHTML =
    "$" + numberWithCommas(data.firstcash.toFixed(2));
  document.getElementById("2nd-pts").innerHTML =
    "$" + numberWithCommas(data.secondcash.toFixed(2));
  document.getElementById("3rd-pts").innerHTML =
    "$" + numberWithCommas(data.thirdcash.toFixed(2));
  spyMusic.fade(1, 0, 1000);
  document.getElementById("gameInfoBar").style =
    "visibility: visible; opacity: 100%";
  questionMusic45.fade(1, 0, 1000);
  document.getElementById("cashLiveScreen").style =
    "visibility:hidden; opacity: 0";
  document.getElementById("heistLiveScreen").style =
    "visibility:hidden; opacity: 0";
  document.getElementById("infoEndButton").disabled = true;
  document.getElementById("infoAdvanceButton").disabled = true;
  document.getElementById("1st-place").innerHTML = data.firstplace;
  document.getElementById("2nd-place").innerHTML = data.secondplace;
  document.getElementById("3rd-place").innerHTML = data.thirdplace;
  document.getElementById("leaderboardScreen").style =
    "visibility:hidden;opacity:0";
  document.getElementById("blitzEndgameScreen").style =
    "visibility:visible;opacity:1";
  setTimeout(function () {
    document.getElementById("blitzgameScreen").style = "visibility:hidden";
    winnersScreenSound.volume(0.4);
    winnersScreenSound.play();
    setTimeout(function () {
      document.getElementById("bronze-podium").style.visibility = "visible";
      document.getElementById("bronze-podium").style.filter =
        "brightness(100%)";
      setTimeout(function () {
        document.getElementById("silver-podium").style.visibility = "visible";
        document.getElementById("silver-podium").style.filter =
          "brightness(100%)";
        setTimeout(function () {
          document.getElementById("gold-podium").style.visibility = "visible";
          document.getElementById("gold-podium").style.filter =
            "brightness(100%)";
          confetti.start();
          setTimeout(function () {
            confetti.stop();
          }, 10000);
        }, 3800);
      }, 2100);
    }, 300);
  }, 1000);
});

socket.on("forceEnded", (data) => {
  document.getElementById("infoEndButton").disabled = true;
  document.getElementById("infoAdvanceButton").disabled = true;
  console.log("Force Ended");
  console.log(data);
  document.getElementById("1st-place").innerHTML = data[0];
  document.getElementById("2nd-place").innerHTML = data[1];
  document.getElementById("3rd-place").innerHTML = data[2];
  document.getElementById("leaderboardScreen").style =
    "visibility:hidden;opacity:0";
  document.getElementById("blitzEndgameScreen").style =
    "visibility:visible;opacity:1";
  setTimeout(function () {
    document.getElementById("blitzgameScreen").style = "visibility:hidden";
    winnersScreenSound.volume(0.4);
    winnersScreenSound.play();
    setTimeout(function () {
      document.getElementById("bronze-podium").style.visibility = "visible";
      document.getElementById("bronze-podium").style.filter =
        "brightness(100%)";
      setTimeout(function () {
        document.getElementById("silver-podium").style.visibility = "visible";
        document.getElementById("silver-podium").style.filter =
          "brightness(100%)";
        setTimeout(function () {
          document.getElementById("gold-podium").style.visibility = "visible";
          document.getElementById("gold-podium").style.filter =
            "brightness(100%)";
          confetti.start();
          setTimeout(function () {
            confetti.stop();
          }, 10000);
        }, 3800);
      }, 2100);
    }, 300);
  }, 1000);
});

socket.on("blitzReady", (data) => {
  document.getElementById("infoEndButton").disabled = true;
  console.log("Blitz Ready!");
  console.log(data);
  document.getElementById("blitzIntroScreen").style =
    "visibility: visible; opacity: 100%;";
  document.getElementById("leaderboardScreen").style =
    "visibility: hidden; opacity: 0%;";
  blitzStart.play();
  document.getElementById("blitzBlitzPlayers").innerHTML =
    "Players: " + data.join(", ");
  document.getElementById("blitzIntroScreen1").style = "left:-180vw";
  document.getElementById("blitzIntroScreen2").style = "right:-180vw";
  setTimeout(function () {
    blitzrules.load();
    blitzrules.play();
    document.getElementById("blitzRulesScreen").style =
      "visibility: visible; opacity: 100%;";
    var timeleft = 15;
    tournendTimer1 = setInterval(function () {
      timeleft -= 1;
      document.getElementById("blitzRulesTimer").innerHTML =
        "Starting in " + timeleft;
      if (timeleft <= 0) {
        clearInterval(tournendTimer1);
      }
    }, 1000);
  }, 6000);
});

socket.on("blitzStart", (data) => {
  document.getElementById("blitz-timer-container").innerHTML = "00:00.00";
  blitzrules.fade(1, 0, 1000);
  blitzMusic.volume(0.4);
  document.getElementById("blitz-answered1").innerHTML =
    "0/" + data.questionLength;
  document.getElementById("blitz-answered2").innerHTML =
    "0/" + data.questionLength;
  document.getElementById("blitz-answered3").innerHTML =
    "0/" + data.questionLength;
  document.getElementById("blitz-player1").style.background =
    "linear-gradient(90deg,rgba(102, 225, 255, 1) 0%,rgba(102, 225, 255, 0.8) -3%,rgba(102, 225, 255, 0.65) 0%,rgba(102, 225, 255, 0) 3%)";
  document.getElementById("blitz-player2").style.background =
    "linear-gradient(90deg,rgba(255, 166, 82, 1) 0%,rgba(255, 166, 82, 0.8) -3%, rgba(255, 166, 82, 0.65) 0%,rgba(255, 166, 82, 0) 3%)";
  document.getElementById("blitz-player3").style.background =
    "linear-gradient(90deg, rgba(0, 200, 0, 1) 0%, rgba(0, 200, 0, 0.8) -3%, rgba(0, 200, 0, 0.65) 0%, rgba(0, 200, 0, 0) 3%)";
  document
    .getElementById("blitz-player1")
    .classList.add("blitzPSID" + Object.keys(data.playersIDs)[0]);
  document
    .getElementById("blitz-player2")
    .classList.add("blitzPSID" + Object.keys(data.playersIDs)[1]);
  document
    .getElementById("blitz-player3")
    .classList.add("blitzPSID" + Object.keys(data.playersIDs)[2]);
  document
    .getElementById("blitz-answered1")
    .classList.add("blitzASID" + Object.keys(data.playersIDs)[0]);
  document
    .getElementById("blitz-answered2")
    .classList.add("blitzASID" + Object.keys(data.playersIDs)[1]);
  document
    .getElementById("blitz-answered3")
    .classList.add("blitzASID" + Object.keys(data.playersIDs)[2]);
  document.getElementById("blitz-name1").innerHTML = data.playersNames[0];
  document.getElementById("blitz-name2").innerHTML = data.playersNames[1];
  document.getElementById("blitz-name3").innerHTML = data.playersNames[2];
  document.getElementById("blitzRulesScreen").style =
    "visibility:hidden;opacity:0";
  document.getElementById("blitzgameScreen").style =
    "visibility:visible;opacity:1";
  // get sounds for 321go
  var stopwatch = 0;
  setTimeout(function () {
    p321s.play();
    document.getElementById("blitz-timer-container").innerHTML = "3";
    setTimeout(function () {
      document.getElementById("blitz-timer-container").innerHTML = "2";
      setTimeout(function () {
        document.getElementById("blitz-timer-container").innerHTML = "1";
        setTimeout(function () {
          var stopwatch1 = new Date().getTime();
          document.getElementById("blitz-timer-container").innerHTML =
            "00:00.00";
          blitzMusic.load();
          blitzMusic.play();
          blitzStopwatch = setInterval(function () {
            stopwatch = new Date().getTime() - stopwatch1;
            var seconds = Math.floor((stopwatch / 1000) % 60); // int
            var minutes = Math.floor((stopwatch / (1000 * 60)) % 60); // int
            var cs = Math.floor((stopwatch % 1000) / 10); // int
            document.getElementById("blitz-timer-container").innerHTML =
              zeroPad(minutes, 2) +
              ":" +
              zeroPad(seconds, 2) +
              "." +
              zeroPad(cs, 2);
          }, 10);
        }, 1000);
      }, 1000);
    }, 1000);
  }, 2000);
});

socket.on("blitzAnsweredQ", (data) => {
  if (document.querySelector(".blitzPSID" + data.id).id == "blitz-player1") {
    document.querySelector(".blitzPSID" + data.id).style.background =
      "linear-gradient( 90deg, rgba(78, 167, 189, 1) 0%, rgba(78, 167, 189, 0.8) " +
      (data.amtn - 3) +
      "%, rgba(78, 167, 189, 0.65) " +
      data.amtn +
      "%, rgba(78, 167, 189, 0) " +
      (data.amtn + 3) +
      "% )";
  }
  if (document.querySelector(".blitzPSID" + data.id).id == "blitz-player2") {
    document.querySelector(".blitzPSID" + data.id).style.background =
      "linear-gradient( 90deg, rgba(255, 166, 82, 1) 0%, rgba(255, 166, 82, 0.8) " +
      (data.amtn - 3) +
      "%, rgba(255, 166, 82, 0.65) " +
      data.amtn +
      "%, rgba(255, 166, 82, 0) " +
      (data.amtn + 3) +
      "% )";
  }
  if (document.querySelector(".blitzPSID" + data.id).id == "blitz-player3") {
    document.querySelector(".blitzPSID" + data.id).style.background =
      "linear-gradient( 90deg, rgba(0, 200, 0, 1) 0%, rgba(0, 200, 0, 0.8) " +
      (data.amtn - 3) +
      "%, rgba(10, 200, 0, 0.65) " +
      data.amtn +
      "%, rgba(0, 200, 0, 0) " +
      (data.amtn + 3) +
      "% )";
  }
  document.querySelector(".blitzASID" + data.id).innerHTML = data.amt;
});

socket.on("playerWon", (data) => {
  data.amtn = 100;
  data.amt = document.getElementById("blitz-timer-container").innerHTML;
  console.log(data);
  document.querySelector(".blitzPSID" + data.id).style.border =
    "1.5vh solid #4eff93";
  if (document.querySelector(".blitzPSID" + data.id).id == "blitz-player1") {
    document.querySelector(".blitzPSID" + data.id).style.background =
      "linear-gradient( 90deg, rgba(78, 167, 189, 1) 0%, rgba(78, 167, 189, 0.8) " +
      (data.amtn - 3) +
      "%, rgba(78, 167, 189, 0.65) " +
      data.amtn +
      "%, rgba(78, 167, 189, 0) " +
      (data.amtn + 3) +
      "% )";
  }
  if (document.querySelector(".blitzPSID" + data.id).id == "blitz-player2") {
    document.querySelector(".blitzPSID" + data.id).style.background =
      "linear-gradient( 90deg, rgba(255, 166, 82, 1) 0%, rgba(255, 166, 82, 0.8) " +
      (data.amtn - 3) +
      "%, rgba(255, 166, 82, 0.65) " +
      data.amtn +
      "%, rgba(255, 166, 82, 0) " +
      (data.amtn + 3) +
      "% )";
  }
  if (document.querySelector(".blitzPSID" + data.id).id == "blitz-player3") {
    document.querySelector(".blitzPSID" + data.id).style.background =
      "linear-gradient( 90deg, rgba(0, 200, 0, 1) 0%, rgba(0, 200, 0, 0.8) " +
      (data.amtn - 3) +
      "%, rgba(10, 200, 0, 0.65) " +
      data.amtn +
      "%, rgba(0, 200, 0, 0) " +
      (data.amtn + 3) +
      "% )";
  }
  document.querySelector(".blitzASID" + data.id).innerHTML = data.amt;
});

socket.on("gameOver", (top3) => {
  console.log(top3);
  clearInterval(blitzStopwatch);
  blitzMusic.fade(0.4, 0, 1000);
  gameFinish.play();
  document.getElementById("1st-place").innerHTML = Object.values(top3)[0].name;
  document.getElementById("2nd-place").innerHTML = Object.values(top3)[1].name;
  document.getElementById("3rd-place").innerHTML = Object.values(top3)[2].name;
  setTimeout(function () {
    setTimeout(function () {
      document.getElementById("blitzgameScreen").style = "visibility:hidden";
      document.getElementById("blitzEndgameScreen").style =
        "visibility:visible;opacity:1";
      winnersScreenSound.volume(0.4);
      winnersScreenSound.play();
      setTimeout(function () {
        document.getElementById("bronze-podium").style.visibility = "visible";
        document.getElementById("bronze-podium").style.filter =
          "brightness(100%)";
        setTimeout(function () {
          document.getElementById("silver-podium").style.visibility = "visible";
          document.getElementById("silver-podium").style.filter =
            "brightness(100%)";
          setTimeout(function () {
            document.getElementById("gold-podium").style.visibility = "visible";
            document.getElementById("gold-podium").style.filter =
              "brightness(100%)";
            confetti.start();
            setTimeout(function () {
              confetti.stop();
            }, 10000);
          }, 3800);
        }, 2100);
      }, 300);
    }, 1000);
  }, 3000);
});

window.onload = function () {
  setTimeout(function () {
    window.scrollTo(0, 0);
  }, 100);
};

let info = localStorage.getItem("hostInformation");
console.log(JSON.parse(info));
let info2 = JSON.parse(info);
attemptHost(info2.id, info2.token, info2.setname);

socket.on("alert", (alert) => {
  alert(alert);
});
