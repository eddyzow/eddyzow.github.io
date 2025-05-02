//Copyright 2020+ eddyzow. All rights reserved.

//NOTES BEFORE RELEASE:
//- CHANGE ALL SESSION STORAGE TO LOCAL STORAGE AS IT ALLOWS ONLY ONE ACCOUNT TO BE LOGGED IN AT ONCE
document.title = "Trivia Champion";
//const socket = io("http://127.0.0.1:3000"); // Socket
const socket = io("eddyzow.herokuapp.com");
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
var ranks = [
  "UNRANKED",
  "BRONZE 1",
  "BRONZE 2",
  "BRONZE 3",
  "SILVER 1",
  "SILVER 2",
  "SILVER 3",
  "GOLD 1",
  "GOLD 2",
  "GOLD 3",
  "PLATINUM 1",
  "PLATINUM 2",
  "PLATINUM 3",
  "LEGEND 1",
  "LEGEND 2",
  "LEGEND 3",
  "CHAMPION",
];

function signinup() {
  if (signupPageStatus == 1) {
    //Alert user to log in or sign up.
  } else if (signupPageStatus == 3) {
    //Check credentials, then remove the modal and log in.
    const credentials = {
      username: document.getElementById("usernameInput").value,
      password: document.getElementById("passwordInput").value,
    };
    socket.emit("login", credentials);
  } else if (signupPageStatus == 4) {
    //Check credentials, register user, and then remove the modal and log in.
    if (
      document.getElementById("SUpasswordInput").value ==
      document.getElementById("SUpassword2Input").value
    ) {
      const credentials = {
        username: document.getElementById("SUusernameInput").value,
        password: document.getElementById("SUpasswordInput").value,
      };
      socket.emit("registerUser", credentials);
    } else {
      document.getElementById("login-info").style.opacity = "100%";
      document.getElementById("login-info").innerHTML =
        "Password and confirm do not match!";
      setTimeout(function () {
        document.getElementById("login-info").style.opacity = "0%";
      }, 750);
    }
  }
}

// Page Numbers
// Home: 1
// Play: 2
// Settings: 3
// About: 4
// Play/Solo: 5
// Play/Casual: 6
// Play/Ranked: 7
// Play/Live: 8
// Play/Solo/Results: 9
// Play/Casual/Results: 10
// Play/Ranked/Results: 11
// Channel: 12
// Play/Tournament/Unregistered: 98
// Play/Tournament/Registered: 99
// Play/Tournament/Results: 100
// Custom Games: 101

var connecttimes = 0;
var rankedQueue = 0; // If player is in queue for Ranked game mode.
var casualQueue = 0; // If player is in queue for Casual game mode.
var page = 1; // Used to handle the back button
var minutes = 0; // Matchmaking Timer
var seconds = 0; // Matchmaking Timer
var signupPageStatus = 0; // None
var totalSeconds = 0; // Matchmaking Timer
var interval = 0; // Matchmaking Timer
var clickable;
var emailFlashed = 0;
var chatShown = 0;

// zxzx
window.onload = function () {
  document
    .getElementById("recoveryEmail")
    .addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        if (validateEmail(document.getElementById("recoveryEmail").value)) {
          socket.emit("updateEmail", {
            token: localStorage.getItem("userToken"),
            email: document.getElementById("recoveryEmail").value,
          });
        } else {
          document.getElementById("save-settings").style = "border-color: red";
          document.getElementById("save-message").innerHTML =
            "Email is not in the proper format.";
          document.getElementById("save-message").style = "opacity: 100%";
          setTimeout(function () {
            document.getElementById("save-settings").style = "";
            document.getElementById("save-message").style = "opacity: 0%";
          }, 1000);
        }
      }
    });
  document
    .getElementById("usernameInput")
    .addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        signinup();
      }
    });
  document
    .getElementById("passwordInput")
    .addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        signinup();
      }
    });

  document
    .getElementById("SUpasswordInput")
    .addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        signinup();
      }
    });

  document
    .getElementById("SUusernameInput")
    .addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        signinup();
      }
    });

  document
    .getElementById("SUpassword2Input")
    .addEventListener("keyup", function (e) {
      if (e.key === "Enter") {
        signinup();
      }
    });
};

function flashEmail() {
  if (emailFlashed == 0) {
    emailFlashed = 1;
    document.getElementById("recoveryEmail").style = "color:white";
    setTimeout(function () {
      document.getElementById("recoveryEmail").style = "";
      emailFlashed = 0;
    }, 2000);
  }
}

var backgaudio = new Howl({
  src: [
    "assets/sound/music/" +
      (Math.floor(Math.random() * 11) + 1).toString() +
      ".mp3",
  ],
  loop: true,
  rate: 1,
});

var tournament = new Howl({
  src: ["assets/sound/music/12.mp3"],
  loop: true,
  rate: 1,
});

socket.on("connect_error", function (err) {
  showNotice("Can't connect to server. Attempting to reconnect.");
});

function verifyToken() {
  socket.emit("verifyToken", localStorage.getItem("userToken"));
}

var tick = new Howl({
  src: ["assets/sound/fx/tick.mp3"],
});

var matchBegin = new Howl({
  src: ["assets/sound/fx/matchBegin.mp3"],
});

console.warn(
  `%c${"CAUTION!"}`, // everything after the %c is styled
  `color: red; font-weight: bold; font-size: 2rem;`
);
console.warn(
  `%c${"Don't type ANYTHING into here unless you know what you're doing."}`, // everything after the %c is styled
  `color: lightgreen; font-weight: bold; font-size: 1rem;`
);
console.warn(
  `%c${"You could be giving someone access to your account!"}`, // everything after the %c is styled
  `color: blue; font-weight: bold; font-size: 1rem;`
);

for (var i = 0; i < document.getElementsByClassName("ct").length; i++) {
  document.getElementsByClassName("ct")[i].setAttribute("onclick", "ct()");
}

function ct() {
  tick.play();
}

document.getElementById("notgotitButton").onclick = function closeNotice() {
  document.getElementById("noticeModal").style.opacity = "0%";
  document.getElementById("noticeModal").style.visibility = "hidden";
  document.getElementById("noticePopup").style.opacity = "0%";
  document.getElementById("noticePopup").style.transform =
    "translate(-50%, -50%) scale(0.5, 0.5)";

  document.getElementById("noticePopup").style.visibility = "hidden";
};

document.getElementById("chat-show-button").onclick = function () {
  if (chatShown == 0) {
    chatShown = 1;
    showChat();
  } else {
    chatShown = 0;
    hideChat();
  }
};

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

document.getElementById("reloadButton").onclick = function fatalRestart() {
  localStorage.removeItem("username");
  localStorage.removeItem("id");
  localStorage.removeItem("level");
  localStorage.removeItem("userToken");
  location.reload();
};

if (localStorage.getItem("userToken") === null) {
  //Logged out, trigger login function
  signupPageStatus = 1; //New User Page
  document.getElementById("newLoginContent").style.visibility = "visible";
  document.getElementById("newLoginContent").style.opacity = "100%";
  document.getElementById("newLoginContent").style.transform =
    "translate(-50%, -50%) scale(1, 1)";
} else {
  document.getElementById("usernameDisplayLogin").innerHTML = localStorage
    .getItem("username")
    .toUpperCase();
  signupPageStatus = 2; //Return User Page
  setTimeout(function () {
    document.documentElement.scrollTop = 0;
    document.getElementById("returnLoginContent").style.visibility = "visible";
    document.getElementById("returnLoginContent").style.opacity = "100%";
    document.getElementById("returnLoginContent").style.transform =
      "translate(-50%, -50%) scale(1, 1)";
  }, 1000);
}

document.getElementById("notbuttonreturn").onclick = function logout() {
  if (localStorage.getItem("userToken") !== null) {
    document.getElementById("gobuttonreturn").style.visibility = "hidden";
    document.getElementById("notbuttonreturn").style.visibility = "hidden";
    localStorage.removeItem("username");
    localStorage.removeItem("userToken");
    localStorage.removeItem("id");
    localStorage.removeItem("level");
    document.getElementById("returnLoginContent").style.visibility = "hidden";
    document.getElementById("newLoginContent").style.visibility = "visible";
    document.getElementById("newLoginContent").style.transform =
      "translate(-50%, -50%) scale(1, 1)";
    document.getElementById("newLoginContent").style.opacity = "100%";
  }
};

document.getElementById("loginButton").onclick = function openlogin() {
  document.getElementById("forgot-password").style =
    "visibility: visible; opacity: 100%";
  //Hide signup if tab was opened.
  signupPageStatus = 3; //Login
  document.getElementById("gobutton").innerHTML = "LOG IN";
  document.getElementById("signupCredentials").style.opacity = "0%";
  document.getElementById("signupCredentials").style.visibility = "hidden";
  document.getElementById("newLoginContent").style.height = "385px";
  document.getElementById("loginCredentials").style.visibility = "visible";
  document.getElementById("loginCredentials").style.opacity = "100%";
};
document.getElementById("signupButton").onclick = function opensignup() {
  document.getElementById("forgot-password").style =
    "visibility: visible; opacity: 100%";
  signupPageStatus = 4; //Signup
  //Hide login if tab was opened.
  document.getElementById("gobutton").innerHTML = "CONFIRM";
  document.getElementById("loginCredentials").style.opacity = "0%";
  document.getElementById("loginCredentials").style.visibility = "hidden";
  document.getElementById("newLoginContent").style.height = "430px";
  document.getElementById("signupCredentials").style.visibility = "visible";
  document.getElementById("signupCredentials").style.opacity = "100%";
};

document.getElementById("gobutton").onclick = function () {
  signinup();
};

window.onbeforeunload = function () {
  window.scrollTo(0, 0);
};

function setLevels(id) {
  socket.emit("setLevels", id);
}

socket.on("loginSuccess", (credentials) => {
  if (credentials.email == undefined) {
    document.getElementById("recoveryEmail").value = "";
    showNotice(
      "Please set an email address to your account! It will allow you to recover your account if you forget your password."
    );
  } else {
    document.getElementById("recoveryEmail").value = credentials.email;
  }
  document.getElementById("newLoginContent").style.visibility = "hidden";
  document.getElementById("newLoginContent").style.opacity = "0%";
  document.getElementById("loginCredentials").style.visibility = "hidden";
  document.getElementById("loginCredentials").style.opacity = "0%";
  document.getElementById("returnLoginContent").style.visibility = "hidden";
  document.getElementById("returnLoginContent").style.opacity = "0%";
  document.getElementById("loginModal").style.opacity = "0%";
  document.getElementById("loginModal").style.visibility = "hidden";
  // Begin playing the background music for home menu.
  document.getElementById("signinup").style.bottom = "100px";
  document.getElementById("playerProfile").style.bottom = "8px";
  //Login
  backgaudio.play();
  showMusic(
    musics[backgaudio._src.split("assets/sound/music/")[1].split(".mp3")[0] - 1]
  );
  localStorage.setItem("username", credentials.username);
  localStorage.setItem("id", credentials.id);
  localStorage.setItem("userToken", credentials.accessToken);
  if (sessionStorage.getItem("dir") == "create") {
    sessionStorage.removeItem("dir");
    window.location.href = "../champion/custom/create";
  }
  if (sessionStorage.getItem("dir") == "main") {
    sessionStorage.removeItem("dir");
    window.location.href = "../";
  }
  if (sessionStorage.getItem("dir") == "jsb") {
    sessionStorage.removeItem("dir");
    window.location.href = "../jsb";
  }
  if (sessionStorage.getItem("dir") == "home") {
    sessionStorage.removeItem("dir");
    window.location.href = "../";
  }
  setLevels(localStorage.getItem("id"));
  document.getElementById("playerUsername").innerHTML = localStorage
    .getItem("username")
    .toUpperCase();
  requestRank(localStorage.getItem("userToken"));
  socket.emit("requestTournamentInfo", localStorage.getItem("userToken"));
});

socket.on("loginError", (data) => {
  document.getElementById("login-info").style.opacity = "100%";
  document.getElementById("login-info").innerHTML = data;
  setTimeout(function () {
    document.getElementById("login-info").style.opacity = "0%";
  }, 500);
});

socket.on("creating-account", function () {
  document.getElementById("gobutton").innerHTML = "CREATING ACCOUNT...";
});

socket.on("account-created", (credentials) => {
  localStorage.setItem("username", credentials.username);
  localStorage.setItem("id", credentials.id);
  localStorage.setItem("userToken", credentials.accessToken);
  if (sessionStorage.getItem("dir") == "create") {
    sessionStorage.removeItem("dir");
    window.location.href = "../champion/custom/create";
  }
  if (sessionStorage.getItem("dir") == "main") {
    sessionStorage.removeItem("dir");
    window.location.href = "../";
  }
  if (sessionStorage.getItem("dir") == "jsb") {
    sessionStorage.removeItem("dir");
    window.location.href = "../jsb";
  }
  document.getElementById("newLoginContent").style.visibility = "hidden";
  document.getElementById("newLoginContent").style.opacity = "0%";
  document.getElementById("loginCredentials").style.visibility = "hidden";
  document.getElementById("loginCredentials").style.opacity = "0%";
  document.getElementById("returnLoginContent").style.visibility = "hidden";
  document.getElementById("returnLoginContent").style.opacity = "0%";
  document.getElementById("loginModal").style.opacity = "0%";
  document.getElementById("loginModal").style.visibility = "hidden";
  document.getElementById("signupCredentials").style.visibility = "hidden";
  document.getElementById("signupCredentials").style.opacity = "0%";
  // Begin playing the background music for home menu.
  socket.emit("requestTournamentInfo", localStorage.getItem("userToken"));
  document.getElementById("signinup").style.bottom = "100px";
  document.getElementById("playerProfile").style.bottom = "8px";
  setLevels(localStorage.getItem("id"));
  document.getElementById("playerUsername").innerHTML = localStorage
    .getItem("username")
    .toUpperCase();
  backgaudio.play();
  showMusic(
    musics[backgaudio._src.split("assets/sound/music/")[1].split(".mp3")[0] - 1]
  );
  requestRank(localStorage.getItem("userToken"));
});

document.getElementById("gobuttonreturn").onclick =
  function gobuttonretclicked() {
    if (localStorage.getItem("userToken") !== null) {
      verifyToken();
      // Remove the modal and log in.
      socket.emit("requestTournamentInfo", localStorage.getItem("userToken"));
      requestRank(localStorage.getItem("userToken"));
      document.getElementById("loginCredentials").style.visibility = "hidden";
      document.getElementById("loginCredentials").style.opacity = "0%";
      document.getElementById("signupCredentials").style.visibility = "hidden";
      document.getElementById("signupCredentials").style.opacity = "0%";
      document.getElementById("returnLoginContent").style.visibility = "hidden";
      document.getElementById("returnLoginContent").style.opacity = "0%";
      document.getElementById("loginModal").style.opacity = "0%";
      document.getElementById("loginModal").style.visibility = "hidden";
      // Begin playing the background music for home menu.
      document.getElementById("signinup").style.bottom = "100px";
      document.getElementById("playerProfile").style.bottom = "8px";
      setLevels(localStorage.getItem("id"));
      document.getElementById("playerUsername").innerHTML = localStorage
        .getItem("username")
        .toUpperCase();
      document.documentElement.scrollTop = 0;
      backgaudio.play();
      showMusic(
        musics[
          backgaudio._src.split("assets/sound/music/")[1].split(".mp3")[0] - 1
        ]
      );
      document.getElementById("newLoginContent").style.visibility = "hidden";
      document.getElementById("newLoginContent").style.opacity = "0%";
      socket.emit("setSocket", localStorage.getItem("id"));
    } else {
      document.getElementById("gobuttonreturn").style.visibility = "hidden";
      document.getElementById("notbuttonreturn").style.visibility = "hidden";
      localStorage.removeItem("username");
      localStorage.removeItem("userToken");
      localStorage.removeItem("id");
      localStorage.removeItem("level");
      document.getElementById("returnLoginContent").style.visibility = "hidden";
      document.getElementById("newLoginContent").style.visibility = "visible";
      document.getElementById("newLoginContent").style.transform =
        "translate(-50%, -50%) scale(1, 1)";
      document.getElementById("newLoginContent").style.opacity = "100%";
    }
  };

function setTime() {
  ++totalSeconds;
  seconds = pad(totalSeconds % 60);
  minutes = pad(parseInt(totalSeconds / 60));
  if (casualQueue == 1) {
    document.getElementById("casualmatchmakingText").innerHTML =
      "IN QUEUE - " + minutes.toString() + ":" + seconds.toString();
  } else if (rankedQueue == 1) {
    document.getElementById("rankedmatchmakingText").innerHTML =
      "IN QUEUE - " + minutes.toString() + ":" + seconds.toString();
  }
}

function pad(val) {
  var valString = val + "";
  if (valString.length < 2) {
    return "0" + valString;
  } else {
    return valString;
  }
}

function showMusic(name) {
  document.getElementById("musicPlaying").innerHTML = "♫ " + name;
  document.getElementById("musicPlaying").style.visibility = "visible";
  document.getElementById("musicPlaying").style.bottom = "80px";
  setTimeout(function () {
    document.getElementById("musicPlaying").style.bottom = "-80px";
    document.getElementById("musicPlaying").style.visibility = "hidden";
  }, 2000);
}

function requestRank(id) {
  socket.emit("requestRank", id);
}

document.getElementById("wallpaper").style["background-image"] =
  'url("assets/art/wallpapers/' +
  (Math.floor(Math.random() * 8) + 1).toString() +
  '.jpg")';
document.getElementById("gameBackground").style["background-image"] =
  'url("assets/art/wallpapers/' +
  (Math.floor(Math.random() * 8) + 1).toString() +
  '.jpg")';
document.getElementById("gameBackground").style["filter"] = "brightness(80%)";

document.getElementById("casual-play").onclick = function casualPlay() {
  ct();
  page = 6;
  document.body.style.overflowY = "visible";
  elem = document.getElementById("screen2");
  elem.style.left = "70vw";
  elem.style.opacity = "0%";
  elem = document.getElementById("screenCasual");
  elem.style["pointer-events"] = "auto";
  elem.style.visibility = "visible";
  elem.style.left = "0vw";
  elem.style.opacity = "100%";
  elem = document.getElementById("back");
  elem.style.visibility = "visible";
  elem.style.opacity = "100%";
  document.getElementById("pageinfo").innerHTML = "CASUAL";
};

socket.on("newPlayerCountUpdate", (data) => {
  document.getElementById("tourn-player-count").innerHTML = data;
  document.getElementById("tournprog-player-count").innerHTML = data;
});

document.getElementById("play").onclick = function play() {
  ct();
  elem = document.getElementById("screen1");
  elem.style.left = "70vw";
  elem.style.opacity = "0%";
  elem = document.getElementById("screen2");
  elem.style["pointer-events"] = "auto";
  elem.style.visibility = "visible";
  elem.style.left = "0vw";
  elem.style.opacity = "100%";
  elem = document.getElementById("back");
  elem.style.visibility = "visible";
  elem.style.opacity = "100%";
  document.getElementById("pageinfo").innerHTML = "PLAY";
  page = 2;
};

document.getElementById("settings").onclick = function settings() {
  ct();
  requestRank(localStorage.getItem("userToken"));
  elem = document.getElementById("screen1");
  elem.style.left = "70vw";
  elem.style.opacity = "0%";
  elem = document.getElementById("screenSettings");
  elem.style["pointer-events"] = "auto";
  elem.style.visibility = "visible";
  elem.style.left = "0vw";
  elem.style.opacity = "100%";
  elem = document.getElementById("back");
  elem.style.visibility = "visible";
  elem.style.opacity = "100%";
  document.getElementById("pageinfo").innerHTML = "SETTINGS";
  page = 3;
};

document.getElementById("about").onclick = function about() {
  ct();
  document.getElementById("wallpaper").style.filter = "brightness(50%)";
  elem = document.getElementById("screen1");
  elem.style.left = "70vw";
  elem.style.opacity = "0%";
  elem = document.getElementById("aboutScreen");
  elem.style.position = "absolute";
  document.body.style.overflowY = "visible";
  elem.style["pointer-events"] = "auto";
  elem.style.visibility = "visible";
  elem.style.left = "0vw";
  elem.style.opacity = "100%";
  elem = document.getElementById("back");
  elem.style.visibility = "visible";
  elem.style.opacity = "100%";
  document.getElementById("pageinfo").innerHTML = "ABOUT";
  page = 4;
};

socket.on("rankRequested", (data) => {
  if (data.email == undefined) {
    document.getElementById("recoveryEmail").value = "";
    if (
      sessionStorage.getItem("askEmail") == 0 ||
      sessionStorage.getItem("askEmail") == undefined
    ) {
      sessionStorage.setItem("askEmail", 1);
      showNotice(
        "Please set an email address to your account in Settings! It will allow you to recover your account if you forget your password."
      );
    }
  } else {
    document.getElementById("recoveryEmail").value = data.email;
  }
  document.getElementById("playersInQueue").innerHTML = data.docs + " ";
  document.getElementById("your-rank-rankname").innerHTML = ranks[data.rank];
  if (data.rank != 0) {
    document.getElementById("playerBadge").style.content =
      "url('assets/art/ranks/" + data.rank + ".png')";
    document
      .getElementById("playerBadge")
      .setAttribute("title", ranks[data.rank]);
  }
  document.getElementById("your-rank-rankpic").style.content =
    "url('assets/art/ranks/" + data.rank + ".png')";
  if (data.placements >= 5) {
    document.getElementById("your-rank-rating").innerHTML = "";
  } else {
    document.getElementById("your-rank-rating").innerHTML =
      "PLAY " + (5 - data.placements) + " MORE GAME(S) TO SEE YOUR RANK";
  }
});

document.getElementById("closeHostScreen").onclick = function () {
  document.getElementById("pastGamesPrescreen").style =
    "visibility: hidden; bottom: -100%;";
  document.getElementById("noticeModal").style.visibility = "hidden";
  document.getElementById("noticeModal").style.opacity = "0%";
};

document.getElementById("rankedpast-games").onclick = function () {
  ct();
  socket.emit("getPastGames", localStorage.getItem("userToken"));
};

document.getElementById("casualpast-games").onclick = function () {
  ct();
  socket.emit("getPastGames", localStorage.getItem("userToken"));
};

socket.on("pastGamesGot", (data) => {
  var paras = document.getElementsByClassName("pastGame");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  let pastGames = data.reverse();
  document.getElementById("noticeModal").style.visibility = "visible";
  document.getElementById("noticeModal").style.opacity = "100%";
  document.getElementById("pastGamesPrescreen").style =
    "visibility: visible; bottom: 0;";
  let numFor = 0;
  if (pastGames.length == 0) {
    document.getElementById("pastGamesContainer").innerHTML = "No games played";
  }
  pastGames.forEach((game) => {
    numFor += 1;
    if (numFor <= 15) {
      qelem = document.createElement("div");
      let datey = new Date(game.timeGameStarted * 1000);
      let month = datey.getMonth();
      let date = datey.getDate();
      let year = datey.getFullYear();
      let hours = datey.getHours();
      let minutes = datey.getMinutes();
      let ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12;
      hours = hours ? hours : 12; // the hour '0' should be '12'
      minutes = minutes < 10 ? "0" + minutes : minutes;
      var months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      var selectedMonthName =
        months[month] +
        " " +
        date +
        ", " +
        year +
        " " +
        hours +
        ":" +
        minutes +
        " " +
        ampm +
        " - " +
        game.gameType;
      dateElem = document.createElement("div");
      dateElem.setAttribute("class", "pastGameDate");
      dateElem.textContent = selectedMonthName;
      resultElem = document.createElement("p");
      if (game.winStatus == 1) {
        qelem.setAttribute("class", "pastGame pastGameVictory");
        resultElem.textContent = "VICTORY";
      } else {
        qelem.setAttribute("class", "pastGame pastGameDefeat");
        resultElem.textContent = "DEFEAT";
      }
      qelem.setAttribute("style", "position:relative");
      qelem.appendChild(dateElem);
      qelem.appendChild(resultElem);

      pastGameScore = document.createElement("div");
      pastGameScore.setAttribute("class", "pastGameScore");
      yourName = document.createElement("div");
      yourName.setAttribute("class", "inline yourName");
      yourName.textContent = game.yourUsername + " ";
      yourScore = document.createElement("div");
      yourScore.setAttribute("class", "inline yourScore");
      yourScore.textContent = game.yourScore + " ";
      hyphen = document.createElement("div");
      hyphen.setAttribute("class", "inline hyphen");
      hyphen.textContent = "- ";
      opponentScore = document.createElement("div");
      opponentScore.setAttribute("class", "inline opponentScore");
      opponentScore.textContent = game.theirScore + " ";
      opponentUsername = document.createElement("div");
      opponentUsername.setAttribute("class", "inline opponentName");
      opponentUsername.textContent = game.opponentUsername;

      pastGameScore.appendChild(yourName);
      pastGameScore.appendChild(yourScore);
      pastGameScore.appendChild(hyphen);
      pastGameScore.appendChild(opponentScore);
      pastGameScore.appendChild(opponentUsername);
      qelem.appendChild(pastGameScore);
      document.getElementById("pastGamesContainer").appendChild(qelem);
    }
  });
});

document.getElementById("ranked-play").onclick = function rankedPlay() {
  ct();
  requestRank(localStorage.getItem("userToken"));
  page = 7;
  document.body.style.overflowY = "visible";
  elem = document.getElementById("screen2");
  elem.style.left = "70vw";
  elem.style.opacity = "0%";
  elem = document.getElementById("screenRanked");
  elem.style.position = "absolute";
  elem.style["pointer-events"] = "auto";
  elem.style.visibility = "visible";
  elem.style.left = "0vw";
  elem.style.opacity = "100%";
  elem = document.getElementById("back");
  elem.style.visibility = "visible";
  elem.style.opacity = "100%";
  document.getElementById("pageinfo").innerHTML = "RANKED";
};

document.getElementById("back").onclick = function back() {
  ct();
  if (page == 11) {
    socket.emit("clearGame", localStorage.getItem("id"));
    hideChatMan();
    requestRank(localStorage.getItem("userToken"));
    page = 7;
    elem = document.getElementById("screenRankedResults");
    elem.style.opacity = "0%";
    elem.style.visibility = "hidden";
    elem = document.getElementById("screenRanked");
    elem.style["pointer-events"] = "auto";
    elem.style.visibility = "visible";
    elem.style.left = "0vw";
    elem.style.opacity = "100%";
    elem = document.getElementById("back");
    elem.style.visibility = "visible";
    elem.style.opacity = "100%";
    document.getElementById("pageinfo").innerHTML = "RANKED";
  } else if (page == 7) {
    if (rankedQueue == 0) {
      document.documentElement.scrollTop = 0;
      document.body.style.overflowY = "hidden";
      document.getElementById("pageinfo").innerHTML = "PLAY";
      elem = document.getElementById("screenRanked");
      elem.style.position = "fixed";
      elem.style["pointer-events"] = "none";
      elem.style.visibility = "hidden";
      page = 2;
      elem.style.left = "0vw";
      elem.style.opacity = "0";
      elem = document.getElementById("screen2");
      elem.style.left = "0vw";
      elem.style.opacity = "100%";
    } else if (casualQueue == 1) {
      document.getElementById("pageinfo").innerHTML = "RANKED - IN QUEUE";
    }
  } else if (page == 6) {
    if (casualQueue == 0) {
      document.documentElement.scrollTop = 0;
      document.body.style.overflowY = "hidden";
      document.getElementById("pageinfo").innerHTML = "PLAY";
      elem = document.getElementById("screenCasual");
      elem.style["pointer-events"] = "none";
      elem.style.visibility = "hidden";
      page = 2;
      elem.style.left = "0vw";
      elem.style.opacity = "0";
      elem = document.getElementById("screen2");
      elem.style.left = "0vw";
      elem.style.opacity = "100%";
    } else if (casualQueue == 1) {
      document.getElementById("pageinfo").innerHTML = "CASUAL - IN QUEUE";
    }
  } else if (page == 98) {
    page = 2;
    // clear player's game and remove from room.
    elem = document.getElementById("screenTournament");
    elem.style.opacity = "0%";
    elem.style.visibility = "hidden";
    elem = document.getElementById("next-tournament");
    elem.style.opacity = "0%";
    elem.style.visibility = "hidden";
    elem = document.getElementById("tourn-players");
    elem.style.opacity = "0%";
    elem.style.visibility = "hidden";
    elem = document.getElementById("tournament-register-button");
    elem.style.opacity = "0%";
    elem.style.visibility = "hidden";
    elem = document.getElementById("wallpaper");
    elem.style.opacity = "100%";
    elem = document.getElementById("screen2");
    elem.style["pointer-events"] = "auto";
    elem.style.visibility = "visible";
    elem.style.left = "0vw";
    elem.style.opacity = "100%";
    elem = document.getElementById("back");
    elem.style.visibility = "visible";
    elem.style.opacity = "100%";
    document.getElementById("pageinfo").innerHTML = "PLAY";
    tournament.fade(1, 0, 1000);
    backgaudio.play();
  } else if (page == 10) {
    page = 6;
    // clear player's game and remove from room.
    socket.emit("clearGame", localStorage.getItem("id"));
    hideChatMan();
    elem = document.getElementById("screenCasualResults");
    elem.style.opacity = "0%";
    elem.style.visibility = "hidden";
    elem = document.getElementById("screenCasual");
    elem.style["pointer-events"] = "auto";
    elem.style.visibility = "visible";
    elem.style.left = "0vw";
    elem.style.opacity = "100%";
    elem = document.getElementById("back");
    elem.style.visibility = "visible";
    elem.style.opacity = "100%";
    document.getElementById("pageinfo").innerHTML = "CASUAL";
  } else if (page == 4) {
    document.documentElement.scrollTop = 0;
    document.body.style.overflowY = "hidden";
    document.getElementById("pageinfo").innerHTML = "HOME";
    elem = document.getElementById("aboutScreen");
    elem.style["pointer-events"] = "none";
    elem.style.visibility = "hidden";
    elem.style.position = "fixed";
    page = 1;
    document.getElementById("wallpaper").style.filter = "brightness(100%)";
    elem.style.left = "0vw";
    elem.style.opacity = "0";
    elem = document.getElementById("screen1");
    elem.style.left = "0vw";
    elem.style.opacity = "100%";
    elem = document.getElementById("back");
    elem.style.opacity = "0";
    elem.style.visibility = "hidden";
  } else if (page == 2) {
    document.documentElement.scrollTop = 0;
    document.body.style.overflowY = "hidden";
    document.getElementById("pageinfo").innerHTML = "HOME";
    elem = document.getElementById("screen2");
    elem.style["pointer-events"] = "none";
    elem.style.visibility = "hidden";
    page = 1;
    elem.style.left = "0vw";
    elem.style.opacity = "0";
    elem = document.getElementById("screen1");
    elem.style.left = "0vw";
    elem.style.opacity = "100%";
    elem = document.getElementById("back");
    elem.style.visibility = "hidden";
    elem.style.opacity = "0";
  } else if (page == 3) {
    document.documentElement.scrollTop = 0;
    document.body.style.overflowY = "hidden";
    document.getElementById("pageinfo").innerHTML = "HOME";
    elem = document.getElementById("screenSettings");
    elem.style["pointer-events"] = "none";
    elem.style.visibility = "hidden";
    page = 1;
    elem.style.left = "100vw";
    elem.style.opacity = "0";
    elem = document.getElementById("screen1");
    elem.style.left = "0vw";
    elem.style.opacity = "100%";
    elem = document.getElementById("back");
    elem.style.visibility = "hidden";
    elem.style.opacity = "0";
  }
};

function showNotice(notice) {
  document.getElementById("noticeModal").style.visibility = "visible";
  document.getElementById("noticeModal").style.opacity = "100%";
  document.getElementById("noticeText").innerHTML = notice;
  document.getElementById("noticePopup").style.visibility = "visible";
  document.getElementById("noticePopup").style.opacity = "100%";
  document.getElementById("noticePopup").style.transform =
    "translate(-50%, -50%) scale(1, 1)";
  document.getElementById("noticePopup").style.opacity = "100%";
}

function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

function showWin(notice) {
  document.getElementById("tournWinModal").style.visibility = "visible";
  document.getElementById("tournWinModal").style.opacity = "100%";
  document.getElementById("tournWinText").innerHTML = notice;
  document.getElementById("tournWinPopup").style.visibility = "visible";
  document.getElementById("tournWinPopup").style.opacity = "100%";
  document.getElementById("tournWinPopup").style.transform =
    "translate(-50%, -50%) scale(1, 1)";
  document.getElementById("tournWinPopup").style.opacity = "100%";
}

function showFatal(notice) {
  document.getElementById("fatalModal").style.visibility = "visible";
  document.getElementById("fatalModal").style.opacity = "100%";
  document.getElementById("fatalText").innerHTML = notice;
  document.getElementById("fatalPopup").style.visibility = "visible";
  document.getElementById("fatalPopup").style.opacity = "100%";
  document.getElementById("fatalPopup").style.transform =
    "translate(-50%, -50%) scale(1, 1)";
}

socket.on("casualvictory", (data) => {
  document.getElementById("actPointsPla").style.visibility = "hidden";
  document.getElementById("actPointsPla").style.opacity = "0%";
  document.getElementById("actPointsOpp").style.visibility = "hidden";
  document.getElementById("actPointsOpp").style.opacity = "0%";
  document.getElementById("matchInfo").style.visibility = "hidden";
  document.getElementById("matchInfoPlayer").style.bottom = "100vh";
  document.getElementById("matchInfoOpponent").style.top = "100vh";
  document.getElementById("matchloadStatus").style.visibility = "hidden";
  document.getElementById("matchloadStatus").style.opacity = "0%";
  document.getElementById("matchInfoPlayerLevel").style.visibility = "hidden";
  document.getElementById("matchInfoPlayerLevel").style.opacity = "0%";
  document.getElementById("matchInfoOpponentLevel").style.visibility = "hidden";
  document.getElementById("matchInfoOpponentLevel").style.opacity = "0%";
  document.getElementById("matchInfo").style.visibility = "hidden";
  document.getElementById("matchInfo").style.opacity = "0%";
  document.getElementById("screenCasual").style.visibility = "hidden";
  document.getElementById("screenCasual").style.opacity = "0%";
  document.getElementById("matchResultBackground").style.background =
    "linear-gradient(to right,rgba(255, 217, 0, 0.568),rgba(255, 208, 0, 0.418)),url('crystal2.png')";
  document.getElementById("matchResultBackground").style.visibility = "visible";
  document.getElementById("matchResultBackground").style.left = "0";
  document.getElementById("matchResult").innerHTML = "VICTORY";
  document.getElementById("matchResult").style.color = "gold";
  document.getElementById("matchResult").style.visibility = "visible";
  document.getElementById("matchResult").style.left = "0";
  document.getElementById("matchResult").style.opacity = "100%";
  document.getElementById("matchResult").style.transform = "scale(1,1)";
  document.getElementById("QuestionScreen").style.visibility = "hidden";
  document.getElementById("ingamePlayerInfo").style.visibility = "hidden";
  document.getElementById("ingameOpponentInfo").style.visibility = "hidden";
  document.getElementById("matchContent").style.visibility = "hidden";
  document.getElementById("QuestionNum").style.visibility = "hidden";
  document.getElementById("QuestionCategory").style.visibility = "hidden";
  document.getElementById("questionButton1").style.visibility = "hidden";
  document.getElementById("questionButton2").style.visibility = "hidden";
  document.getElementById("questionButton3").style.visibility = "hidden";
  document.getElementById("questionButton4").style.visibility = "hidden";
  document.getElementById("gameBackground").style.visibility = "hidden";
  document.body.style.overflowY = "hidden";
  new Howl({
    src: ["assets/sound/fx/victory.mp3"],
    onend: function () {
      page = 10;
      document.getElementById("gameBackground").style.left = "100vw";
      backgaudio = new Howl({
        src: ["assets/sound/music/5.mp3"],
        loop: true,
        rate: 1,
      });
      backgaudio.play();
      showMusic(musics[4]);
      minutes = 0;
      totalSeconds = 0;
      seconds = 0;
      document.getElementById("casualmatchmakingText").innerHTML =
        "BEGIN MATCHMAKING";
      document.getElementById("casualmatchmakingCancelText").innerHTML =
        "LEAVING COUNTS AS A LOSS";
      document.getElementById("enter-casualmatchmaking").style.border = "none";
      document.getElementById("enter-casualmatchmaking").style.background =
        "linear-gradient(to right,rgba(0, 0, 0, 0.5),rgba(255, 255, 255, 0.5)), url('crystal2.png')";
      casualQueue = 0;
      document.getElementById("pageinfo").innerHTML = "CASUAL - RESULTS";
      document.getElementById("matchResult").style.left = "100vw";
      document.getElementById("matchResultBackground").style.left = "100vw";
      document.getElementById("matchResult").style.transform =
        "scale(0.5, 0.5)";
      document.getElementById("matchResult").style.opacity = "0%";
      document.getElementById("matchResult").style.visibility = "hidden";
      document.getElementById("matchResultBackground").style.visibility =
        "hidden";
      document.getElementById("casualResOutcome").innerHTML = "VICTORY";
      document.getElementById("matchContent").style.visibility = "hidden";
      document.getElementById("ingameOpponentInfo").style = "";
      document.getElementById("ingamePlayerInfo").style = "";
      document.getElementById("actPointsPla").style =
        "opacity: 0; visibility: hidden;";
      document.getElementById("actPointsOpp").style =
        "opacity: 0; visibility: hidden;";
      document.getElementById("casualResOutcome").style.color = "gold";
      document.getElementById("casualResOutcome").style["text-shadow"] =
        "0px 0px 4px gold";
      document.getElementById("casualResPlayerUsername").innerHTML =
        data.player.toUpperCase();
      document.getElementById("casualResOpponentUsername").innerHTML =
        data.enemy.toUpperCase();
      document.getElementById("casualResPlayerScore").innerHTML =
        data.playerscore;
      if (data.disconnected == true) {
        document.getElementById("casualResOpponentScore").innerHTML =
          data.enemyscore + " (DC)";
      } else {
        document.getElementById("casualResOpponentScore").innerHTML =
          data.enemyscore;
      }
      document.getElementById("casualResGameId").innerHTML =
        "Match ID: " + data.gameid;
      document.getElementById("screenCasualResults").style.visibility =
        "visible";
      document.getElementById("screenCasualResults").style.opacity = "100%";

      elem = document.getElementById("back");
      elem.style.visibility = "visible";
      elem.style.opacity = "100%";
      setLevels(localStorage.getItem("id"));
    },
  }).play();
});

socket.on("endgameRankData", (data) => {
  document.getElementById("rankedResRankChange").innerHTML = "";
  console.log("EndGameRankData");
  console.log(data);
  if (data.gamesRemaining == 0) {
    document.getElementById("rankedResRating").innerHTML =
      "RATING: " + data.rating.toLocaleString();
    document.getElementById("rankedResRating").innerHTML =
      "RATING: " + data.rating.toLocaleString();
    if (data.ratingChange >= 0) {
      document.getElementById("rankedResRatingChange").innerHTML =
        "+" + data.ratingChange;
      document.getElementById("rankedResRatingChange").style.color =
        "rgb(0, 224, 49)";
    } else if (data.ratingChange < 0) {
      document.getElementById("rankedResRatingChange").innerHTML =
        data.ratingChange;
      document.getElementById("rankedResRatingChange").style.color =
        "rgb(255, 57, 57)";
    }
    if (data.rankChange != 0) {
      if (data.rankChange == 1) {
        document.getElementById("rankedResRankChange").innerHTML = "PROMOTED";
        document.getElementById("rankedResRankChange").style.color =
          "rgb(0, 224, 49)";
      } else if (data.rankChange == -1) {
        document.getElementById("rankedResRankChange").innerHTML = "DEMOTED";
        document.getElementById("rankedResRankChange").style.color =
          "rgb(255, 57, 57)";
      }
    }
    document.getElementById("rankedResRank").innerHTML =
      "RANK: " + ranks[data.rank];
  } else {
    document.getElementById("rankedResRating").innerHTML = "";
    document.getElementById("rankedResRatingChange").innerHTML = "";
    document.getElementById("rankedResRank").innerHTML =
      "PLAY " + data.gamesRemaining + " MORE GAME(S) TO GET YOUR RANK";
  }
});

socket.on("rankedvictory", (data) => {
  document.getElementById("actPointsPla").style.visibility = "hidden";
  document.getElementById("actPointsPla").style.opacity = "0%";
  document.getElementById("actPointsOpp").style.visibility = "hidden";
  document.getElementById("actPointsOpp").style.opacity = "0%";
  document.getElementById("matchInfo").style.visibility = "hidden";
  document.getElementById("matchInfoPlayer").style.bottom = "100vh";
  document.getElementById("matchInfoOpponent").style.top = "100vh";
  document.getElementById("matchloadStatus").style.visibility = "hidden";
  document.getElementById("matchloadStatus").style.opacity = "0%";
  document.getElementById("matchInfoPlayerLevel").style.visibility = "hidden";
  document.getElementById("matchInfoPlayerLevel").style.opacity = "0%";
  document.getElementById("matchInfoOpponentLevel").style.visibility = "hidden";
  document.getElementById("matchInfoOpponentLevel").style.opacity = "0%";
  document.getElementById("matchInfo").style.visibility = "hidden";
  document.getElementById("matchInfo").style.opacity = "0%";
  document.getElementById("screenRanked").style.visibility = "hidden";
  document.getElementById("screenRanked").style.opacity = "0%";
  document.getElementById("matchResultBackground").style.background =
    "linear-gradient(to right,rgba(255, 217, 0, 0.568),rgba(255, 208, 0, 0.418)),url('crystal.png')";
  document.getElementById("matchResultBackground").style.visibility = "visible";
  document.getElementById("matchResultBackground").style.left = "0";
  document.getElementById("matchResult").innerHTML = "VICTORY";
  document.getElementById("matchResult").style.color = "gold";
  document.getElementById("matchResult").style.visibility = "visible";
  document.getElementById("matchResult").style.left = "0";
  document.getElementById("matchResult").style.transform = "scale(1,1)";
  document.getElementById("matchResult").style.opacity = "100%";
  document.getElementById("QuestionScreen").style.visibility = "hidden";

  document.getElementById("ingamePlayerInfo").style.visibility = "hidden";
  document.getElementById("ingameOpponentInfo").style.visibility = "hidden";
  document.getElementById("matchContent").style.visibility = "hidden";
  document.getElementById("QuestionNum").style.visibility = "hidden";
  document.getElementById("QuestionCategory").style.visibility = "hidden";
  document.getElementById("questionButton1").style.visibility = "hidden";
  document.getElementById("questionButton2").style.visibility = "hidden";
  document.getElementById("questionButton3").style.visibility = "hidden";
  document.getElementById("questionButton4").style.visibility = "hidden";
  document.getElementById("gameBackground").style.visibility = "hidden";
  document.body.style.overflowY = "hidden";
  new Howl({
    src: ["assets/sound/fx/victory.mp3"],
    onend: function () {
      page = 11;
      document.getElementById("gameBackground").style.left = "100vw";
      backgaudio = new Howl({
        src: ["assets/sound/music/5.mp3"],
        loop: true,
        rate: 1,
      });
      backgaudio.play();
      showMusic(musics[4]);
      minutes = 0;
      totalSeconds = 0;
      seconds = 0;
      document.getElementById("rankedmatchmakingText").innerHTML =
        "BEGIN MATCHMAKING";
      document.getElementById("rankedmatchmakingCancelText").innerHTML =
        "LEAVING COUNTS AS A LOSS";
      document.getElementById("enter-rankedmatchmaking").style.border = "none";
      document.getElementById("enter-rankedmatchmaking").style.background =
        "linear-gradient(to right,rgba(0, 0, 0, 0.5),rgba(255, 255, 255, 0.5)), url('crystal.png')";
      rankedQueue = 0;
      document.getElementById("pageinfo").innerHTML = "RANKED - RESULTS";
      document.getElementById("matchResult").style.left = "100vw";
      document.getElementById("matchResultBackground").style.left = "100vw";
      document.getElementById("matchResult").style.transform =
        "scale(0.5, 0.5)";
      document.getElementById("matchResult").style.opacity = "0%";
      document.getElementById("matchResult").style.visibility = "hidden";
      document.getElementById("matchResultBackground").style.visibility =
        "hidden";
      document.getElementById("rankedResOutcome").innerHTML = "VICTORY";
      document.getElementById("matchContent").style.visibility = "hidden";
      document.getElementById("ingameOpponentInfo").style = "";
      document.getElementById("ingamePlayerInfo").style = "";
      document.getElementById("actPointsPla").style =
        "opacity: 0; visibility: hidden;";
      document.getElementById("actPointsOpp").style =
        "opacity: 0; visibility: hidden;";
      document.getElementById("rankedResOutcome").style.color = "gold";
      document.getElementById("rankedResOutcome").style["text-shadow"] =
        "0px 0px 4px gold";
      document.getElementById("rankedResPlayerUsername").innerHTML =
        data.player.toUpperCase();
      document.getElementById("rankedResOpponentUsername").innerHTML =
        data.enemy.toUpperCase();
      document.getElementById("rankedResPlayerScore").innerHTML =
        data.playerscore;
      if (data.disconnected == true) {
        document.getElementById("rankedResOpponentScore").innerHTML =
          data.enemyscore + " (DC)";
      } else {
        document.getElementById("rankedResOpponentScore").innerHTML =
          data.enemyscore;
      }
      document.getElementById("rankedResGameId").innerHTML =
        "Match ID: " + data.gameid;
      document.getElementById("screenRankedResults").style.visibility =
        "visible";
      document.getElementById("screenRankedResults").style.opacity = "100%";

      elem = document.getElementById("back");
      elem.style.visibility = "visible";
      elem.style.opacity = "100%";
      setLevels(localStorage.getItem("id"));
    },
  }).play();
});

socket.on("rankeddefeat", (data) => {
  document.getElementById("actPointsPla").style.visibility = "hidden";
  document.getElementById("actPointsPla").style.opacity = "0%";
  document.getElementById("actPointsOpp").style.visibility = "hidden";
  document.getElementById("actPointsOpp").style.opacity = "0%";
  document.getElementById("matchInfo").style.visibility = "hidden";
  document.getElementById("matchInfoPlayer").style.bottom = "100vh";
  document.getElementById("matchInfoOpponent").style.top = "100vh";

  document.getElementById("matchloadStatus").style.visibility = "hidden";
  document.getElementById("matchloadStatus").style.opacity = "0%";
  document.getElementById("matchInfoPlayerLevel").style.visibility = "hidden";
  document.getElementById("matchInfoPlayerLevel").style.opacity = "0%";
  document.getElementById("matchInfoOpponentLevel").style.visibility = "hidden";
  document.getElementById("matchInfoOpponentLevel").style.opacity = "0%";
  document.getElementById("matchInfo").style.visibility = "hidden";
  document.getElementById("matchInfo").style.opacity = "0%";

  document.getElementById("screenRanked").style.visibility = "hidden";
  document.getElementById("screenRanked").style.opacity = "0%";
  document.getElementById("matchResultBackground").style.background =
    "linear-gradient( to right, rgba(0, 119, 255, 0.568), rgba(144, 113, 255, 0.418) ), url('crystal.png')";
  document.getElementById("matchResultBackground").style.visibility = "visible";
  document.getElementById("matchResultBackground").style.left = "0";
  document.getElementById("matchResult").innerHTML = "DEFEAT";
  document.getElementById("matchResult").style.color =
    "rgba(56, 175, 255, 0.596)";
  document.getElementById("matchResult").style.visibility = "visible";
  document.getElementById("matchResult").style.left = "0";
  document.getElementById("matchResult").style.transform = "scale(1,1)";
  document.getElementById("matchResult").style.opacity = "100%";
  document.getElementById("QuestionScreen").style.visibility = "hidden";
  document.getElementById("ingamePlayerInfo").style.visibility = "hidden";
  document.getElementById("ingameOpponentInfo").style.visibility = "hidden";
  document.getElementById("matchContent").style.visibility = "hidden";
  document.getElementById("QuestionNum").style.visibility = "hidden";
  document.getElementById("QuestionCategory").style.visibility = "hidden";
  document.getElementById("questionButton1").style.visibility = "hidden";
  document.getElementById("questionButton2").style.visibility = "hidden";
  document.getElementById("questionButton3").style.visibility = "hidden";
  document.getElementById("questionButton4").style.visibility = "hidden";
  document.getElementById("gameBackground").style.visibility = "hidden";
  document.body.style.overflowY = "hidden";
  new Howl({
    src: ["assets/sound/fx/defeat.mp3"],
    onend: function () {
      page = 11;
      document.getElementById("gameBackground").style.left = "100vw";
      backgaudio = new Howl({
        src: ["assets/sound/music/4.mp3"],
        loop: true,
        rate: 1,
      });
      backgaudio.play();
      showMusic(musics[3]);
      minutes = 0;
      totalSeconds = 0;
      seconds = 0;
      document.getElementById("rankedmatchmakingText").innerHTML =
        "BEGIN MATCHMAKING";
      document.getElementById("rankedmatchmakingCancelText").innerHTML =
        "LEAVING COUNTS AS A LOSS";
      document.getElementById("enter-rankedmatchmaking").style.border = "none";
      document.getElementById("enter-rankedmatchmaking").style.background =
        "linear-gradient(to right,rgba(0, 0, 0, 0.5),rgba(255, 255, 255, 0.5)), url('crystal.png')";
      rankedQueue = 0;
      document.getElementById("pageinfo").innerHTML = "RANKED - RESULTS";
      document.getElementById("matchResult").style.left = "100vw";
      document.getElementById("matchResultBackground").style.left = "100vw";
      document.getElementById("matchResult").style.transform =
        "scale(0.5, 0.5)";
      document.getElementById("matchResult").style.opacity = "0%";
      document.getElementById("matchResult").style.visibility = "hidden";
      document.getElementById("matchResultBackground").style.visibility =
        "hidden";

      document.getElementById("rankedResOutcome").innerHTML = "DEFEAT";
      document.getElementById("matchContent").style.visibility = "hidden";
      document.getElementById("ingameOpponentInfo").style = "";
      document.getElementById("ingamePlayerInfo").style = "";
      document.getElementById("actPointsPla").style =
        "opacity: 0; visibility: hidden;";
      document.getElementById("actPointsOpp").style =
        "opacity: 0; visibility: hidden;";
      document.getElementById("rankedResOutcome").style.color =
        "rgb(0, 119, 255)";
      document.getElementById("rankedResOutcome").style["text-shadow"] =
        "0px 0px 4px rgb(0, 119, 255)";
      document.getElementById("rankedResPlayerUsername").innerHTML =
        data.player.toUpperCase();
      document.getElementById("rankedResOpponentUsername").innerHTML =
        data.enemy.toUpperCase();
      document.getElementById("rankedResPlayerScore").innerHTML =
        data.playerscore;
      document.getElementById("rankedResOpponentScore").innerHTML =
        data.enemyscore;
      document.getElementById("rankedResGameId").innerHTML =
        "Match ID: " + data.gameid;
      document.getElementById("screenRankedResults").style.visibility =
        "visible";
      document.getElementById("screenRankedResults").style.opacity = "100%";

      elem = document.getElementById("back");
      elem.style.visibility = "visible";
      elem.style.opacity = "100%";
      setLevels(localStorage.getItem("id"));
    },
  }).play();
});

socket.on("casualdefeat", (data) => {
  document.getElementById("actPointsPla").style.visibility = "hidden";
  document.getElementById("actPointsPla").style.opacity = "0%";
  document.getElementById("actPointsOpp").style.visibility = "hidden";
  document.getElementById("actPointsOpp").style.opacity = "0%";
  document.getElementById("matchInfo").style.visibility = "hidden";
  document.getElementById("matchInfoPlayer").style.bottom = "100vh";
  document.getElementById("matchInfoOpponent").style.top = "100vh";

  document.getElementById("matchloadStatus").style.visibility = "hidden";
  document.getElementById("matchloadStatus").style.opacity = "0%";
  document.getElementById("matchInfoPlayerLevel").style.visibility = "hidden";
  document.getElementById("matchInfoPlayerLevel").style.opacity = "0%";
  document.getElementById("matchInfoOpponentLevel").style.visibility = "hidden";
  document.getElementById("matchInfoOpponentLevel").style.opacity = "0%";
  document.getElementById("matchInfo").style.visibility = "hidden";
  document.getElementById("matchInfo").style.opacity = "0%";
  document.getElementById("screenCasual").style.visibility = "hidden";
  document.getElementById("screenCasual").style.opacity = "0%";
  document.getElementById("matchResultBackground").style.background =
    "linear-gradient( to right, rgba(0, 119, 255, 0.568), rgba(144, 113, 255, 0.418) ), url('crystal2.png')";
  document.getElementById("matchResultBackground").style.visibility = "visible";
  document.getElementById("matchResultBackground").style.left = "0";
  document.getElementById("matchResult").innerHTML = "DEFEAT";
  document.getElementById("matchResult").style.color =
    "rgba(56, 175, 255, 0.596)";
  document.getElementById("matchResult").style.visibility = "visible";
  document.getElementById("matchResult").style.left = "0";
  document.getElementById("matchResult").style.transform = "scale(1,1)";
  document.getElementById("matchResult").style.opacity = "100%";
  document.getElementById("QuestionScreen").style.visibility = "hidden";
  document.getElementById("ingamePlayerInfo").style.visibility = "hidden";
  document.getElementById("ingameOpponentInfo").style.visibility = "hidden";
  document.getElementById("QuestionNum").style.visibility = "hidden";
  document.getElementById("QuestionCategory").style.visibility = "hidden";
  document.getElementById("questionButton1").style.visibility = "hidden";
  document.getElementById("questionButton2").style.visibility = "hidden";
  document.getElementById("questionButton3").style.visibility = "hidden";
  document.getElementById("questionButton4").style.visibility = "hidden";
  document.getElementById("gameBackground").style.visibility = "hidden";
  document.body.style.overflowY = "hidden";
  new Howl({
    src: ["assets/sound/fx/defeat.mp3"],
    onend: function () {
      page = 10;
      document.getElementById("gameBackground").style.left = "100vw";
      backgaudio = new Howl({
        src: ["assets/sound/music/4.mp3"],
        loop: true,
        rate: 1,
      });
      backgaudio.play();
      showMusic(musics[3]);
      minutes = 0;
      totalSeconds = 0;
      seconds = 0;
      document.getElementById("casualmatchmakingText").innerHTML =
        "BEGIN MATCHMAKING";
      document.getElementById("casualmatchmakingCancelText").innerHTML =
        "LEAVING COUNTS AS A LOSS";
      document.getElementById("enter-casualmatchmaking").style.border = "none";
      document.getElementById("enter-casualmatchmaking").style.background =
        "linear-gradient(to right,rgba(0, 0, 0, 0.5),rgba(255, 255, 255, 0.5)), url('crystal2.png')";
      casualQueue = 0;
      document.getElementById("pageinfo").innerHTML = "CASUAL - RESULTS";
      document.getElementById("matchResult").style.left = "100vw";
      document.getElementById("matchResultBackground").style.left = "100vw";
      document.getElementById("matchResult").style.transform =
        "scale(0.5, 0.5)";
      document.getElementById("matchResult").style.opacity = "0%";
      document.getElementById("matchResult").style.visibility = "hidden";
      document.getElementById("matchResultBackground").style.visibility =
        "hidden";
      document.getElementById("casualResOutcome").innerHTML = "DEFEAT";
      document.getElementById("matchContent").style.visibility = "hidden";
      document.getElementById("ingameOpponentInfo").style = "";
      document.getElementById("ingamePlayerInfo").style = "";
      document.getElementById("actPointsPla").style =
        "opacity: 0; visibility: hidden;";
      document.getElementById("actPointsOpp").style =
        "opacity: 0; visibility: hidden;";
      document.getElementById("casualResOutcome").style.color =
        "rgb(0, 119, 255)";
      document.getElementById("casualResOutcome").style["text-shadow"] =
        "0px 0px 4px rgb(0, 119, 255)";
      document.getElementById("casualResPlayerUsername").innerHTML =
        data.player.toUpperCase();
      document.getElementById("casualResOpponentUsername").innerHTML =
        data.enemy.toUpperCase();
      document.getElementById("casualResPlayerScore").innerHTML =
        data.playerscore;
      document.getElementById("casualResOpponentScore").innerHTML =
        data.enemyscore;
      document.getElementById("casualResGameId").innerHTML =
        "Match ID: " + data.gameid;
      document.getElementById("screenCasualResults").style.visibility =
        "visible";
      document.getElementById("screenCasualResults").style.opacity = "100%";

      elem = document.getElementById("back");
      elem.style.visibility = "visible";
      elem.style.opacity = "100%";
      setLevels(localStorage.getItem("id"));
    },
  }).play();
});

socket.on("enemyDC", function () {
  showNotice("The opposing player has disconnected. You win!");
});

socket.on("disconnect", function () {
  showNotice("Disconnected from server... trying to reconnect.");
});

socket.on("levelsSent", (data) => {
  document.getElementById("playerLevelText").innerHTML = data.level;
  document.getElementById("playerNextLevelProgress").style.width =
    "calc((100% - 60px) * " +
    (data.xp / (500 + (data.level - 1) * 100)).toString() +
    ")";
  localStorage.setItem("level", data.level);
  document.getElementById("playerProfile").title =
    data.xp.toString() +
    "/" +
    (500 + (data.level - 1) * 100).toString() +
    " XP (" +
    Math.round((data.xp / (500 + (data.level - 1) * 100)) * 100).toString() +
    "%) to next level";
  if (data.level < 10) {
    // level 0-9 Level Color
    document.getElementById("playerLevel").style.background =
      "linear-gradient(to right, rgb(255, 255, 255), rgb(160, 160, 160))";
    document.getElementById("playerLevelText").style.color = "black";
  } else if (data.level < 20) {
    // level 10-19 Level Color
    document.getElementById("playerLevel").style.background =
      "linear-gradient(to right, #FFEB3B, rgb(254, 255, 192))";
    document.getElementById("playerLevelText").style.color = "black";
  } else if (data.level < 30) {
    // level 20-29 Level Color
    document.getElementById("playerLevel").style.background =
      "linear-gradient(to right, rgb(151, 255, 0), rgb(0, 255, 161))";
    document.getElementById("playerLevelText").style.color = "black";
  } else if (data.level < 50) {
    // level 30-49 Level Color
    document.getElementById("playerLevel").style.background =
      "linear-gradient(to right, rgb(0 249 255), rgb(86 75 255))";
    document.getElementById("playerLevelText").style.color = "white";
  } else if (data.level < 75) {
    // level 50-74 Level Color
    document.getElementById("playerLevel").style.background =
      "linear-gradient(to right, rgb(255 0 229), rgb(117 0 146))";
    document.getElementById("playerLevelText").style.color = "white";
  } else if (data.level < 100) {
    // level 75-99 Level Color
    document.getElementById("playerLevel").style.background =
      "linear-gradient(to right, rgb(255 63 63), rgb(187 0 0))";
    document.getElementById("playerLevelText").style.color = "#00e7ff";
  } else if (data.level < 150) {
    // level 100-149 Level Color
    document.getElementById("playerLevel").style.background =
      "linear-gradient(to right, rgb(0 96 255), rgb(169 0 255))";
    document.getElementById("playerLevelText").style.color = "#00ffff";
  } else if (data.level < 200) {
    // level 150-199 Level Color
    document.getElementById("playerLevel").style.background =
      "linear-gradient(to right, rgb(255 0 0), rgb(216 0 255))";
    document.getElementById("playerLevelText").style.color = "#00ffff";
  } else {
    // level 200+ Level Color
    document.getElementById("playerLevel").style.background =
      "linear-gradient(to right, rgb(255 0 0), rgb(255 165 0))";
    document.getElementById("playerLevelText").style.color = "#ffffff";
  }
});

function updateSlider(data) {
  document.getElementById("masterVolume").innerHTML =
    "MASTER VOLUME (" + data.value + "%)";
  Howler.volume(data.value / 100);
  localStorage.setItem("prefVol", data.value);
}

document.getElementById("log-out").onclick = function () {
  ct();
  localStorage.removeItem("username");
  localStorage.removeItem("userToken");
  localStorage.removeItem("id");
  localStorage.removeItem("level");
  location.reload();
};

document.getElementById("save-settings").onclick = function () {
  ct();
  if (validateEmail(document.getElementById("recoveryEmail").value)) {
    socket.emit("updateEmail", {
      token: localStorage.getItem("userToken"),
      email: document.getElementById("recoveryEmail").value,
    });
  } else {
    document.getElementById("save-settings").style = "border-color: red";
    document.getElementById("save-message").innerHTML =
      "Email is not in the proper format.";
    document.getElementById("save-message").style = "opacity: 100%";
    setTimeout(function () {
      document.getElementById("save-settings").style = "";
      document.getElementById("save-message").style = "opacity: 0%";
    }, 1000);
  }
};

socket.on("emailSaved", function () {
  document.getElementById("save-settings").style = "border-color: lime";
  document.getElementById("save-message").innerHTML = "Email has been saved!";
  document.getElementById("save-message").style = "opacity: 100%";
  setTimeout(function () {
    document.getElementById("save-settings").style = "";
    document.getElementById("save-message").style = "opacity: 0%";
  }, 1000);
});

document.getElementById("del-acc").onclick = function () {
  ct();
  showNotice("To delete your account, contact a staff member!");
};

// if server returns null, shut the game down
document.getElementById("questionButton1").onclick = function () {
  if (clickable == 1) {
    clickable = 0;
    socket.emit("hitAnswer", 1);
  }
};
document.getElementById("questionButton2").onclick = function () {
  if (clickable == 1) {
    clickable = 0;
    socket.emit("hitAnswer", 2);
  }
};
document.getElementById("questionButton3").onclick = function () {
  if (clickable == 1) {
    clickable = 0;
    socket.emit("hitAnswer", 3);
  }
};
document.getElementById("questionButton4").onclick = function () {
  if (clickable == 1) {
    clickable = 0;
    socket.emit("hitAnswer", 4);
  }
};

socket.on("chatWarning", (data) => {
  var chatelem = document.createElement("div");
  chatelem.setAttribute("class", "chat-element");
  var chatelemAuthor = document.createElement("p");
  var chatelemText = document.createElement("p");
  chatelemAuthor.setAttribute("class", "chat-author chat-system");
  chatelemText.setAttribute("class", "chat-text chat-warning");
  chatelemAuthor.textContent = "[SYSTEM]";
  chatelemText.textContent = " " + data;
  chatelem.appendChild(chatelemAuthor);
  chatelem.appendChild(chatelemText);
  document.getElementById("chat-box").appendChild(chatelem);
  if (chatShown == 1) {
    document.getElementById("chat-box").scrollTop =
      document.getElementById("chat-box").scrollHeight;
  }
});

socket.on("chatMessageReceived", (data) => {
  var chatelem = document.createElement("div");
  chatelem.setAttribute("class", "chat-element");
  var chatelemAuthor = document.createElement("p");
  var chatelemText = document.createElement("p");
  chatelemAuthor.setAttribute("class", "chat-author");
  chatelemText.setAttribute("class", "chat-text");
  chatelemAuthor.textContent = data.author;
  chatelemText.textContent = " " + data.text;
  chatelem.appendChild(chatelemAuthor);
  chatelem.appendChild(chatelemText);
  document.getElementById("chat-box").appendChild(chatelem);
  if (chatShown == 1) {
    document.getElementById("chat-box").scrollTop =
      document.getElementById("chat-box").scrollHeight;
  }
});

document.getElementById("chat-input-form").onsubmit = function (e) {
  e.preventDefault();
  if (document.getElementById("chat-text-input").value.trim() != "") {
    var chatelem = document.createElement("div");
    chatelem.setAttribute("class", "chat-element");
    var chatelemAuthor = document.createElement("p");
    var chatelemText = document.createElement("p");
    chatelemAuthor.setAttribute("class", "chat-author chat-you");
    chatelemText.setAttribute("class", "chat-text");
    // for warning chatelemText.setAttribute("class", "chat-warning");
    chatelemAuthor.textContent = localStorage.getItem("username");
    chatelemText.textContent =
      " " + document.getElementById("chat-text-input").value.trim();
    chatelem.appendChild(chatelemAuthor);
    chatelem.appendChild(chatelemText);
    socket.emit("chatMessageSent", {
      author: localStorage.getItem("id"),
      text: document.getElementById("chat-text-input").value,
    });
    document.getElementById("chat-box").appendChild(chatelem);
    document.getElementById("chat-text-input").value = "";
    if (chatShown == 1) {
      document.getElementById("chat-box").scrollTop =
        document.getElementById("chat-box").scrollHeight;
    }
  } else {
    document.getElementById("chat-text-input").value = "";
  }
};

socket.on("correctAnswer", (answer) => {
  document.getElementById(
    "questionButton" + answer.toString()
  ).style.background = "rgb(0, 255, 136)";
  new Howl({
    src: ["assets/sound/fx/correctAnswer.mp3"],
  }).play();
});

socket.on("wrongAnswer", (data) => {
  document.getElementById(
    "questionButton" + data.correct.toString()
  ).style.background = "rgb(0, 255, 136)";
  document.getElementById(
    "questionButton" + data.selected.toString()
  ).style.background = "rgb(255, 0, 0)";
  new Howl({
    src: ["assets/sound/fx/wrongAnswer.mp3"],
  }).play();
});

socket.on("appError", (data) => {
  showNotice(data);
});

socket.on("tournamentMessage", (data) => {
  showNotice(data);
  if (page == 98) {
    document.getElementById("tournament-register-button").style.visibility =
      "visible";
    document.getElementById("tournament-register-button").style.opacity =
      "100%";
    document.getElementById("tourn-players").style.visibility = "visible";
    document.getElementById("tourn-players").style.opacity = "100%";
  }
});

socket.on("fatalError", (data) => {
  localStorage.removeItem("username");
  localStorage.removeItem("id");
  localStorage.removeItem("level");
  localStorage.removeItem("userToken");
  showFatal(data);
});

socket.on("reconnect_attempt", function () {
  showNotice("Reconnecting...");
  socket.connect();
});

socket.on("connect", function () {
  connecttimes += 1;
  if (connecttimes > 1) {
    showNotice("Reconnected!");
  }
});

socket.on("editGameLoadingText", (data) => {
  document.getElementById("matchloadStatus").innerHTML = data;
});

socket.on("enemyPoints", (data) => {
  document.getElementById("actPointsOpp").innerHTML = data;
});

socket.on("actWon", (data) => {
  // testing, when this is fully added, make sure you transport the numbers in data and update the numbers every time
  document.getElementById("ingameOpponentInfo").style.height = "100vh";
  document.getElementById("ingamePlayerInfo").style.height = "100vh";
  document.getElementById("PlayerUsername").style["font-size"] = "6vw";
  document.getElementById("PlayerScore").style["font-size"] = "8vw";
  document.getElementById("OpponentUsername").style["font-size"] = "6vw";
  document.getElementById("OpponentScore").style["font-size"] = "8vw";
  document.getElementById("PlayerScore").style["text-shadow"] =
    "0px 0px 40px white";
  setTimeout(function () {
    new Howl({
      src: ["assets/sound/fx/correctAnswer.mp3"],
    }).play();
    document.getElementById("PlayerScore").innerHTML = data.playerScore;
    document.getElementById("OpponentScore").innerHTML = data.enemyScore;
  }, 2000);
  setTimeout(function () {
    document.getElementById("PlayerScore").style["text-shadow"] = "none";
    document.getElementById("ingameOpponentInfo").style.height = "70px";
    document.getElementById("ingamePlayerInfo").style.height = "70px";
    document.getElementById("PlayerUsername").style["font-size"] = "2em";
    document.getElementById("PlayerScore").style["font-size"] = "2em";
    document.getElementById("OpponentUsername").style["font-size"] = "2em";
    document.getElementById("OpponentScore").style["font-size"] = "2em";
  }, 3000);
});

socket.on("actLost", (data) => {
  // testing, when this is fully added, make sure you transport the numbers in data and update the numbers every time
  document.getElementById("ingameOpponentInfo").style.height = "100vh";
  document.getElementById("ingamePlayerInfo").style.height = "100vh";
  document.getElementById("PlayerUsername").style["font-size"] = "6vw";
  document.getElementById("PlayerScore").style["font-size"] = "8vw";
  document.getElementById("OpponentUsername").style["font-size"] = "6vw";
  document.getElementById("OpponentScore").style["font-size"] = "8vw";
  document.getElementById("OpponentScore").style["text-shadow"] =
    "0px 0px 40px white";
  setTimeout(function () {
    new Howl({
      src: ["assets/sound/fx/wrongAnswer.mp3"],
    }).play();
    document.getElementById("PlayerScore").innerHTML = data.playerScore;
    document.getElementById("OpponentScore").innerHTML = data.enemyScore;
  }, 2000);
  setTimeout(function () {
    document.getElementById("PlayerScore").style["text-shadow"] = "none";
    document.getElementById("ingameOpponentInfo").style.height = "70px";
    document.getElementById("ingamePlayerInfo").style.height = "70px";
    document.getElementById("PlayerUsername").style["font-size"] = "2em";
    document.getElementById("PlayerScore").style["font-size"] = "2em";
    document.getElementById("OpponentUsername").style["font-size"] = "2em";
    document.getElementById("OpponentScore").style["font-size"] = "2em";
  }, 3000);
});

socket.on("givenPoints", (data) => {
  document.getElementById("actPointsPla").innerHTML = data;
});

socket.on("timesUp", (correct) => {
  document.getElementById("questionButton1").style.filter = "brightness(75%)";
  document.getElementById("questionButton2").style.filter = "brightness(75%)";
  document.getElementById("questionButton3").style.filter = "brightness(75%)";
  document.getElementById("questionButton4").style.filter = "brightness(75%)";
  document.getElementById("questionButton" + correct).style.background =
    "rgb(0, 255, 136)";
});

socket.on("tournamentAnswered", (data) => {
  document.getElementById("tournamentquestionButton" + data).style.background =
    "rgba(0, 255, 255, 0.75)";
});

socket.on("tournamentAnswer", (answer) => {
  setLevels(localStorage.getItem("id"));
  document.getElementById("tournamentquestionButton1").style.background =
    "rgba(255, 0, 0, 0.5)";
  document.getElementById("tournamentquestionButton2").style.background =
    "rgba(255, 0, 0, 0.5)";
  document.getElementById("tournamentquestionButton3").style.background =
    "rgba(255, 0, 0, 0.5)";
  document.getElementById("tournamentquestionButton4").style.background =
    "rgba(255, 0, 0, 0.5)";
  document.getElementById(
    "tournamentquestionButton" + answer
  ).style.background = "rgba(0, 255, 150, 0.5)";
});

socket.on("tournamentBegin", function () {
  document.getElementById("next-tournament").style.opacity = "0%";
  document.getElementById("next-tournament").style.visibility = "hidden";
});

document.getElementById("tournamentquestionButton1").onclick = function () {
  socket.emit("tournamenthitAnswer", {
    answer: 1,
    token: localStorage.getItem("userToken"),
  });
};
document.getElementById("tournamentquestionButton2").onclick = function () {
  socket.emit("tournamenthitAnswer", {
    answer: 2,
    token: localStorage.getItem("userToken"),
  });
};
document.getElementById("tournamentquestionButton3").onclick = function () {
  socket.emit("tournamenthitAnswer", {
    answer: 3,
    token: localStorage.getItem("userToken"),
  });
};
document.getElementById("tournamentquestionButton4").onclick = function () {
  socket.emit("tournamenthitAnswer", {
    answer: 4,
    token: localStorage.getItem("userToken"),
  });
};

socket.on("payoutRequestSuccess", function () {
  showNotice(
    "Your request has been submitted! Please allow a few days for your prize. Stay tuned for the next tournament!"
  );
});

socket.on("tournamentWin", (prize) => {
  document.getElementById("screenTournamentQuestions").style.opacity = "0%";
  document.getElementById("screenTournamentQuestions").style.visibility =
    "hidden";
  document.getElementById("next-tournament").style.visibility = "visible";
  document.getElementById("next-tournament").style.opacity = "100%";
  if (prize != 0) {
    showWin(
      "Congrats, you just won $" +
        prize +
        "! Please type your PayPal email to claim your prize!"
    );
  } else {
    showNotice(
      "Congrats, you won today's tournament! Stay tuned for the next one!"
    );
  }
  particlesJS.load("particles-js", "moneyparticles.json");
  page = 98;
  elem = document.getElementById("back");
  elem.style.visibility = "visible";
  elem.style.opacity = "100%";
});

socket.on("tournEliminated", function () {
  setLevels(localStorage.getItem("id"));
  document.getElementById("screenTournamentQuestions").style.opacity = "0%";
  document.getElementById("screenTournamentQuestions").style.visibility =
    "hidden";
  document.getElementById("next-tournament").style.visibility = "visible";
  document.getElementById("next-tournament").style.opacity = "100%";
  showNotice(
    "You've been eliminated from the tournament. Better luck next time!"
  );
  page = 98;
  elem = document.getElementById("back");
  elem.style.visibility = "visible";
  elem.style.opacity = "100%";
});

socket.on("tournamentQuestion", (data) => {
  document.getElementById("tournamentQuestionNum").innerHTML =
    "Question " +
    parseInt(data.qnum).toString() +
    " of " +
    parseInt(data.totalq).toString();
  document.getElementById("tournamentQuestionCategory").innerHTML =
    "Category: " + data.category;
  document.getElementById("screenTournamentQuestions").style.visibility =
    "visible";
  document.getElementById("screenTournamentQuestions").style.opacity = "100%";
  document.getElementById("tournamentQuestionText").innerHTML = data.text;
  document.getElementById("tournamentquestionButton1").style.background =
    "rgba(0, 0, 255, 0.5)";
  document.getElementById("tournamentquestionButton2").style.background =
    "rgba(0, 0, 255, 0.5)";
  document.getElementById("tournamentquestionButton3").style.background =
    "rgba(0, 0, 255, 0.5)";
  document.getElementById("tournamentquestionButton4").style.background =
    "rgba(0, 0, 255, 0.5)";
  document.getElementById("tournamentquestionButton1").innerHTML = data.answer1;
  document.getElementById("tournamentquestionButton2").innerHTML = data.answer2;
  document.getElementById("tournamentquestionButton3").innerHTML = data.answer3;
  document.getElementById("tournamentquestionButton4").innerHTML = data.answer4;
  document.getElementById("tournamentTimerLeft").style.visibility = "visible";
  document.getElementById("tournamentTimerLeft").style.opacity = "100%";
  document.getElementById("tournamentTimerLeft").innerHTML = "10";
  document.getElementById("tournamentTimerLeft").style.width = "60vw";
  var timeleft = 9;
  var tournendTimer = setInterval(function () {
    if (timeleft <= 0) {
      clearInterval(tournendTimer);
      document.getElementById("tournamentTimerLeft").style.opacity = "0%"; // To hide the progress bars. This is not needed right now. Upon right or wrong, change to a red/green to lighter shade gradient.
      document.getElementById("tournamentTimerLeft").style.width = "60vw";
      document.getElementById("tournamentTimerLeft").style.visibility =
        "hidden";
    }
    document.getElementById("tournamentTimerLeft").innerHTML = timeleft;
    document.getElementById("tournamentTimerLeft").style.width =
      Math.floor(Math.round((timeleft / 10) * 60)).toString() + "vw";
    timeleft -= 1;
  }, 1000);
});

socket.on("newQuestion", (data) => {
  document.getElementById("questionButton1").style.filter = "brightness(100%)";
  document.getElementById("questionButton2").style.filter = "brightness(100%)";
  document.getElementById("questionButton3").style.filter = "brightness(100%)";
  document.getElementById("questionButton4").style.filter = "brightness(100%)";
  new Howl({
    src: ["assets/sound/fx/newQuestion.mp3"],
  }).play();
  document.getElementById("QuestionNum").innerHTML =
    "Question " + (parseInt(data.number) + 1).toString();
  document.getElementById("QuestionCategory").innerHTML =
    "Category: " + data.question.category;
  document.getElementById("QuestionNum").style.visibility = "visible";
  document.getElementById("QuestionNum").style.opacity = "100%";
  document.getElementById("QuestionCategory").style.visibility = "visible";
  document.getElementById("QuestionCategory").style.opacity = "100%";
  document.getElementById("QuestionCategory").style.transform = "scale(1, 1)";
  document.getElementById("QuestionNum").style.transform = "scale(1, 1)";
  document.getElementById("QuestionScreen").style.visibility = "visible";
  document.getElementById("QuestionScreen").style.opacity = "100%";
  document.getElementById("questionButton1").style.background = "white";
  document.getElementById("questionButton2").style.background = "white";
  document.getElementById("questionButton3").style.background = "white";
  document.getElementById("questionButton4").style.background = "white";
  Array.from(document.getElementsByClassName("question-button")).forEach(
    function (item, index) {
      item.style.visibility = "visible";
      item.style.transform = "scale(1, 1)";
      item.style.opacity = "100%";
    }
  );
  document.getElementById("QuestionText").innerHTML = data.question.text;
  document.getElementById("questionButton1").innerHTML = data.question.answer1;
  document.getElementById("questionButton2").innerHTML = data.question.answer2;
  document.getElementById("questionButton3").innerHTML = data.question.answer3;
  document.getElementById("questionButton4").innerHTML = data.question.answer4;
  document.getElementById("timerLeft").innerHTML = "10";
  document.getElementById("timerLeft").style.visibility = "visible";
  document.getElementById("timerLeft").style.opacity = "100%";
  document.getElementById("QuestionTimer").style.visibility = "visible";
  document.getElementById("QuestionTimer").style.opacity = "100%";
  document.getElementById("timerLeft").style.width = "80vw";
  clickable = 1;
  var timeleft = 9;
  new Howl({
    src: ["assets/sound/fx/question.mp3"],
  }).play();
  var endTimer = setInterval(function () {
    if (timeleft <= 0) {
      clearInterval(endTimer);
      document.getElementById("timerLeft").style.opacity = "0%"; // To hide the progress bars. This is not needed right now. Upon right or wrong, change to a red/green to lighter shade gradient.
      document.getElementById("QuestionTimer").style.opacity = "0%";
      document.getElementById("timerLeft").style.width = "80vw";
      document.getElementById("QuestionTimer").style.visibility = "hidden";
      document.getElementById("timerLeft").style.visibility = "hidden";
    }
    document.getElementById("timerLeft").innerHTML = timeleft;
    document.getElementById("timerLeft").style.width =
      Math.floor(Math.round((timeleft / 10) * 80)).toString() + "vw";
    timeleft -= 1;
  }, 1000);
});

socket.on("timesUp", function () {});

socket.on("newAct", (act) => {
  document.getElementById("actSideLeft").style.left = "0vw";
  document.getElementById("actSideRight").style.right = "0vw";
  document.getElementById("ActText").style.visibility = "visible";
  document.getElementById("actSideLeft").style.visibility = "visible";
  document.getElementById("actSideRight").style.visibility = "visible";
  document.getElementById("ActText").style.transform = "scale(1,1)";
  document.getElementById("ActText").style.opacity = "100%";
  document.getElementById("ActText").innerHTML = "ACT " + act.number.toString();
  setTimeout(function () {
    document.getElementById("actSideLeft").style.left = "-51vw";
    document.getElementById("actSideRight").style.right = "-51vw";
    document.getElementById("ActText").style.transform = "scale(0.5, 0.5)";
    document.getElementById("ActText").style.opacity = "0%";
    document.getElementById("ActText").style.visibility = "hidden";
    document.getElementById("actSideLeft").style.visibility = "hidden";
    document.getElementById("actSideRight").style.visibility = "hidden";
    document.getElementById("matchPoint").style.opacity = "0%";
    document.getElementById("matchPoint").style.visibility = "hidden";
  }, 5000);
  if (act.matchPoint == 1) {
    new Howl({
      src: ["assets/sound/fx/matchPoint.mp3"],
    }).play();
    // show match point animation and act
    document.getElementById("matchPoint").style.visibility = "visible";
    document.getElementById("matchPoint").style.opacity = "100%";
  } else if (act.number >= 1 && act.number <= 3) {
    new Howl({
      src: ["assets/sound/fx/act-intro1.mp3"],
    }).play();
    // show act animation
  } else if (act.number >= 4 && act.number <= 6) {
    new Howl({
      src: ["assets/sound/fx/act-intro2.mp3"],
    }).play();
    // show act animation
  } else {
    new Howl({
      src: ["assets/sound/fx/act-intro3.mp3"],
    }).play();
    // show act animation
  }
});

document
  .getElementById("youtube-button")
  .addEventListener("click", function (e) {
    window.open("https://youtube.com/eddyzow", "_blank");
  });

document
  .getElementById("patreon-button")
  .addEventListener("click", function (e) {
    window.open("https://patreon.com/eddyzow", "_blank");
  });

socket.on("rankedmatchFound", (info) => {
  document.getElementById("pastGamesPrescreen").style =
    "visibility: hidden; bottom: -100%;";
  document.getElementById("noticeModal").style.visibility = "hidden";
  document.getElementById("noticeModal").style.opacity = "0%";
  elem = document.getElementById("back");
  elem.style.visibility = "hidden";
  elem.style.opacity = "0%";
  // if you're already in a game, you can't join a new one
  document.getElementById("matchContent").style.left = "0vw";
  document.getElementById("gameBackground").style.left = "0vw";
  document.body.style.overflowY = "hidden";
  rankedQueue = 2;
  minutes = 0;
  totalSeconds = 0;
  seconds = 0;
  backgaudio.fade(1, 0, 1000);
  clearInterval(interval);
  document.getElementById("rankedmatchmakingText").innerHTML = "MATCH FOUND!";
  document.getElementById("rankedmatchmakingCancelText").innerHTML =
    "JOINING MATCH";
  document.getElementById("enter-rankedmatchmaking").style.border =
    "3px solid white";
  document.getElementById("enter-rankedmatchmaking").style.background =
    "linear-gradient(to right,rgba(255, 255, 255, 0.75),rgba(255, 255, 255, 0.5)), url('crystal.png')";
  document.getElementById("pageinfo").innerHTML = "RANKED";
  setTimeout(function () {
    document.getElementById("matchInfo").style.opacity = "100%";
    document.getElementById("matchInfo").style.visibility = "visible";
    document.getElementById("matchInfoPlayerText").innerHTML =
      localStorage.getItem("username");
    document.getElementById("matchInfoOpponentText").innerHTML = info.username;

    document.getElementById("matchInfoOpponentRank").innerHTML =
      ranks[info.ranks.their];
    document.getElementById("matchInfoPlayerRank").innerHTML =
      ranks[info.ranks.you];

    document.getElementById("matchInfoOpponentLevel").innerHTML =
      "LEVEL " + info.userLevel.toString();
    document.getElementById("matchInfoPlayerLevel").innerHTML =
      "LEVEL " + localStorage.getItem("level");
    document.getElementById("matchloadStatus").innerHTML = "LOADING GAME";
    document.getElementById("matchInfoPlayer").style.bottom = "0vh";
    document.getElementById("matchInfoOpponent").style.top = "0vh";
    document.getElementById("matchInfoPlayerLevel").style.visibility =
      "visible";
    document.getElementById("matchInfoOpponentLevel").style.visibility =
      "visible";
    document.getElementById("matchloadStatus").style.visibility = "visible";
    document.getElementById("matchInfoPlayerLevel").style.opacity = "100%";
    document.getElementById("matchInfoOpponentLevel").style.opacity = "100%";
    document.getElementById("matchInfoPlayerRank").style.visibility = "visible";
    document.getElementById("matchInfoOpponentRank").style.visibility =
      "visible";
    document.getElementById("matchInfoPlayerRank").style.opacity = "100%";
    document.getElementById("matchInfoOpponentRank").style.opacity = "100%";

    document.getElementById("matchloadStatus").style.opacity = "100%";
    document.getElementById("VSWord").style.transform = "scale(1, 1)";
    document.getElementById("VSWord").style.opacity = "100%";
    matchBegin.play();
    document.getElementById("matchContent").style.visibility = "visible";
    document.getElementById("ingamePlayerInfo").style.visibility = "visible";
    document.getElementById("ingameOpponentInfo").style.visibility = "visible";
    document.getElementById("actPointsPla").style.visibility = "visible";
    document.getElementById("actPointsPla").style.opacity = "100%";
    document.getElementById("actPointsOpp").style.visibility = "visible";
    document.getElementById("actPointsOpp").style.opacity = "100%";
    //PlayerUsername
    document.getElementById("PlayerUsername").innerHTML = localStorage
      .getItem("username")
      .toUpperCase();
    //PlayerScore
    document.getElementById("PlayerScore").innerHTML = "0";
    //OpponentUsername
    document.getElementById("OpponentUsername").innerHTML =
      info.username.toUpperCase();
    //OpponentScore
    document.getElementById("OpponentScore").innerHTML = "0";
  }, 2000);
});

function showChat() {
  chatShown = 1;
  document.getElementById("chat-show-button").innerHTML = "CLICK TO CLOSE CHAT";
  document.getElementById("chat-box").style.overflowY = "auto";
  document.getElementById("chat-box").style.visibility = "visible";
  document.getElementById("chat-box").style.bottom = "40px";
  document.getElementById("chat-text-input").style.bottom = "0px";
  document.getElementById("chat-input-form").style.bottom = "0px";
}

function hideChat() {
  chatShown = 0;
  document.getElementById("chat-show-button").innerHTML = "CHAT";
  document.getElementById("chat-box").style.overflowY = "hidden";
  document.getElementById("chat-box").scrollTop = "0";
  document.getElementById("chat-box").style.bottom = "calc(-50% + 17px)";
  document.getElementById("chat-text-input").style.bottom = "-40px";
  document.getElementById("chat-input-form").style.bottom = "-40px";
}

function hideChatMan() {
  chatShown = 0;
  document.getElementById("chat-show-button").innerHTML = "CHAT";
  document.getElementById("chat-box").style.overflowY = "hidden";
  document.getElementById("chat-box").style.bottom = "calc(-50% - 43px)";
  document.getElementById("chat-text-input").style.bottom = "-40px";
  document.getElementById("chat-input-form").style.bottom = "-40px";
  document.getElementById("chat-box").style.visibility = "hidden";
}

socket.on("casualmatchFound", (info) => {
  document.getElementById("pastGamesPrescreen").style =
    "visibility: hidden; bottom: -100%;";
  document.getElementById("noticeModal").style.visibility = "hidden";
  document.getElementById("noticeModal").style.opacity = "0%";
  // if you're already in a game, you can't join a new one
  elem = document.getElementById("back");
  elem.style.visibility = "hidden";
  elem.style.opacity = "0%";
  document.getElementById("matchContent").style.left = "0vw";
  document.getElementById("gameBackground").style.left = "0vw";
  document.body.style.overflowY = "hidden";
  casualQueue = 2;
  minutes = 0;
  totalSeconds = 0;
  seconds = 0;
  backgaudio.fade(1, 0, 1000);
  clearInterval(interval);
  document.getElementById("casualmatchmakingText").innerHTML = "MATCH FOUND!";
  document.getElementById("casualmatchmakingCancelText").innerHTML =
    "JOINING MATCH";
  document.getElementById("enter-casualmatchmaking").style.border =
    "3px solid white";
  document.getElementById("enter-casualmatchmaking").style.background =
    "linear-gradient(to right,rgba(255, 255, 255, 0.75),rgba(255, 255, 255, 0.5)), url('crystal2.png')";
  document.getElementById("pageinfo").innerHTML = "CASUAL";
  setTimeout(function () {
    document.getElementById("matchInfo").style.opacity = "100%";
    document.getElementById("matchInfo").style.visibility = "visible";
    document.getElementById("matchInfoPlayerText").innerHTML =
      localStorage.getItem("username");
    document.getElementById("matchInfoOpponentText").innerHTML = info.username;
    document.getElementById("matchInfoOpponentLevel").innerHTML =
      "LEVEL " + info.userLevel.toString();
    document.getElementById("matchInfoPlayerLevel").innerHTML =
      "LEVEL " + localStorage.getItem("level");
    document.getElementById("matchloadStatus").innerHTML = "LOADING GAME";
    document.getElementById("matchInfoPlayer").style.bottom = "0vh";
    document.getElementById("matchInfoOpponent").style.top = "0vh";
    document.getElementById("matchInfoPlayerLevel").style.visibility =
      "visible";
    document.getElementById("matchInfoOpponentLevel").style.visibility =
      "visible";
    document.getElementById("matchloadStatus").style.visibility = "visible";
    document.getElementById("matchInfoPlayerLevel").style.opacity = "100%";
    document.getElementById("matchInfoOpponentLevel").style.opacity = "100%";
    document.getElementById("matchloadStatus").style.opacity = "100%";
    document.getElementById("VSWord").style.transform = "scale(1, 1)";
    document.getElementById("VSWord").style.opacity = "100%";
    matchBegin.play();
    document.getElementById("matchContent").style.visibility = "visible";
    document.getElementById("ingamePlayerInfo").style.visibility = "visible";
    document.getElementById("ingameOpponentInfo").style.visibility = "visible";
    document.getElementById("actPointsPla").style.visibility = "visible";
    document.getElementById("actPointsPla").style.opacity = "100%";
    document.getElementById("actPointsOpp").style.visibility = "visible";
    document.getElementById("actPointsOpp").style.opacity = "100%";
    //PlayerUsername
    document.getElementById("PlayerUsername").innerHTML = localStorage
      .getItem("username")
      .toUpperCase();
    //PlayerScore
    document.getElementById("PlayerScore").innerHTML = "0";
    //OpponentUsername
    document.getElementById("OpponentUsername").innerHTML =
      info.username.toUpperCase();
    //OpponentScore
    document.getElementById("OpponentScore").innerHTML = "0";
  }, 2000);
});

socket.on("beginGame", function () {
  document.querySelectorAll(".chat-element").forEach(function (a) {
    a.remove();
  });
  showChat();
  document.getElementById("gameBackground").style.visibility = "visible";
  document.getElementById("matchInfoPlayerLevel").style.opacity = "0%";
  document.getElementById("matchInfoOpponentLevel").style.opacity = "0%";
  document.getElementById("matchloadStatus").style.opacity = "0%";
  document.getElementById("matchInfoPlayerLevel").style.visibility = "hidden";
  document.getElementById("matchInfoOpponentLevel").style.visibility = "hidden";
  document.getElementById("matchloadStatus").style.visibility = "hidden";
  document.getElementById("matchInfoPlayer").style.bottom = "100vh";
  document.getElementById("matchInfoOpponent").style.top = "100vh";
  document.getElementById("matchInfoPlayerLevel").style.opacity = "0%";
  document.getElementById("matchInfoOpponentLevel").style.opacity = "0%";
  document.getElementById("matchInfoPlayerRank").style.visibility = "hidden";
  document.getElementById("matchInfoOpponentRank").style.visibility = "hidden";
  document.getElementById("VSWord").style.transform = "scale(0.5, 0.5)";
  document.getElementById("VSWord").style.opacity = "0%";
  document.getElementById("VSWord").style.visibility = "hidden";
});

backgaudio.on("fade", function () {
  backgaudio.stop();
  backgaudio.volume(1);
});

tournament.on("fade", function () {
  tournament.stop();
  tournament.volume(1);
});

socket.on("casualMatchmakingLeft", function () {
  minutes = 0;
  totalSeconds = 0;
  seconds = 0;
  clearInterval(interval);
  elem = document.getElementById("back");
  elem.style.visibility = "visible";
  elem.style.opacity = "100%";
  document.getElementById("casualmatchmakingText").innerHTML =
    "BEGIN MATCHMAKING";
  document.getElementById("casualmatchmakingCancelText").innerHTML =
    "LEAVING COUNTS AS A LOSS";
  document.getElementById("enter-casualmatchmaking").style.border = "none";
  document.getElementById("enter-casualmatchmaking").style.background =
    "linear-gradient(to right,rgba(0, 0, 0, 0.5),rgba(255, 255, 255, 0.5)), url('crystal2.png')";
  casualQueue = 0;
  document.getElementById("pageinfo").innerHTML = "CASUAL";
});

socket.on("casualMatchmakingJoined", function () {
  elem = document.getElementById("back");
  elem.style.visibility = "hidden";
  elem.style.opacity = "0";
  document.getElementById("casualmatchmakingText").innerHTML =
    "IN QUEUE - 00:00";
  document.getElementById("casualmatchmakingCancelText").innerHTML =
    "CLICK TO CANCEL";
  document.getElementById("enter-casualmatchmaking").style.border =
    "3px solid darkred";
  document.getElementById("enter-casualmatchmaking").style.background =
    "linear-gradient(to right,rgba(200, 0, 0, 0.5),rgba(255, 255, 255, 0.5)), url('crystal2.png')";
  casualQueue = 1;
  document.getElementById("pageinfo").innerHTML = "CASUAL - IN QUEUE";
  //Timer
  interval = setInterval(setTime, 1000);
});

socket.on("rankedMatchmakingJoined", function () {
  elem = document.getElementById("back");
  elem.style.visibility = "hidden";
  elem.style.opacity = "0";
  document.getElementById("rankedmatchmakingText").innerHTML =
    "IN QUEUE - 00:00";
  document.getElementById("rankedmatchmakingCancelText").innerHTML =
    "CLICK TO CANCEL";
  document.getElementById("enter-rankedmatchmaking").style.border =
    "3px solid darkred";
  document.getElementById("enter-rankedmatchmaking").style.background =
    "linear-gradient(to right,rgba(200, 0, 0, 0.5),rgba(255, 255, 255, 0.5)), url('crystal.png')";
  rankedQueue = 1;
  document.getElementById("pageinfo").innerHTML = "RANKED - IN QUEUE";
  requestRank(localStorage.getItem("userToken"));
  //Timer
  interval = setInterval(setTime, 1000);
});

socket.on("rankedMatchmakingLeft", function () {
  requestRank(localStorage.getItem("userToken"));
  minutes = 0;
  totalSeconds = 0;
  seconds = 0;
  clearInterval(interval);
  elem = document.getElementById("back");
  elem.style.visibility = "visible";
  elem.style.opacity = "100";
  document.getElementById("rankedmatchmakingText").innerHTML =
    "BEGIN MATCHMAKING";
  document.getElementById("rankedmatchmakingCancelText").innerHTML =
    "LEAVING COUNTS AS A LOSS";
  document.getElementById("enter-rankedmatchmaking").style.border = "none";
  document.getElementById("enter-rankedmatchmaking").style.background =
    "linear-gradient(to right,rgba(0, 0, 0, 0.5),rgba(255, 255, 255, 0.5)),url('crystal.png')";
  document.getElementById("pageinfo").innerHTML = "RANKED";
  rankedQueue = 0;
});

document.getElementById("winSubmitButton").onclick = function () {
  if (validateEmail(document.getElementById("tournWinSubmit").value)) {
    socket.emit("processWin", {
      email: document.getElementById("tournWinSubmit").value,
      verify: localStorage.getItem("userToken"),
    });
    document.getElementById("tournWinModal").style.opacity = "0%";
    document.getElementById("tournWinModal").style.visibility = "hidden";
    document.getElementById("tournWinPopup").style.opacity = "0%";
    document.getElementById("tournWinPopup").style.transform =
      "translate(-50%, -50%) scale(0.5, 0.5)";
    showNotice("Processing your win... please keep this page open.");
  } else {
    document.getElementById("tournWinError").style.opacity = "100%";
    document.getElementById("tournWinError").innerHTML =
      "Please input a valid email.";
    setTimeout(function () {
      document.getElementById("tournWinError").style.opacity = "0%";
    }, 1000);
  }
};

document.getElementById("enter-casualmatchmaking").onclick =
  function Matchmaking() {
    ct();
    if (casualQueue == 0 && rankedQueue == 0) {
      const userInfo = {
        userToken: localStorage.getItem("userToken"),
        socketId: socket.id,
        timeExecuted: Date.now(),
      };
      socket.emit("joinedCasualMatchmaking", userInfo);
    } else if (casualQueue == 1) {
      const userInfo = {
        userToken: localStorage.getItem("userToken"),
        socketId: socket.id,
      };
      socket.emit("leftCasualMatchmaking", userInfo);
    }
  };

document.getElementById("enter-rankedmatchmaking").onclick =
  function Matchmaking() {
    ct();
    if (casualQueue == 0 && rankedQueue == 0) {
      const userInfo = {
        userToken: localStorage.getItem("userToken"),
        socketId: socket.id,
      };
      socket.emit("joinedRankedMatchmaking", userInfo);
    } else if (rankedQueue == 1) {
      const userInfo = {
        userToken: localStorage.getItem("userToken"),
        socketId: socket.id,
      };
      socket.emit("leftRankedMatchmaking", userInfo);
    }
  };

localStorage.setItem(
  "read-this",
  "Do not share or edit anything here with anyone! You will lose access to your account."
);

particlesJS.load("particles-js", "particles.json");
if (sessionStorage.getItem("dir") == null) {
  document.getElementById("logintoyouracc").innerHTML =
    "Log in to your account, or sign up to play!";
} else if (sessionStorage.getItem("dir") == "create") {
  document.getElementById("logintoyouracc").innerHTML =
    "REDIRECTING TO: Blitz Creator";
} else if (sessionStorage.getItem("dir") == "main") {
  document.getElementById("logintoyouracc").innerHTML =
    "REDIRECTING TO: Main Website";
} else if (sessionStorage.getItem("dir") == "jsb") {
  document.getElementById("logintoyouracc").innerHTML =
    "REDIRECTING TO: JSBeats";
} else if (sessionStorage.getItem("dir") == "home") {
  document.getElementById("logintoyouracc").innerHTML =
    "REDIRECTING TO: eddyzow.net";
}
