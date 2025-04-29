const socket = io("https://eddyzow.herokuapp.com/"); // Socket
var Game = {};
var player;
var inGame = 0;
var inorout;

socket.on("liveCheck", (data) => {
  document.getElementById("nextGame").innerHTML = data.nextGame;
  document.getElementById("tournprog-player-count").innerHTML =
    data.playerCount;
  if (inGame == 1) {
    if (data.elim == 1) {
      document.getElementById("eliminated").style =
        "background: yellow; color: black;";
      document.getElementById("eliminated").innerHTML = "Eliminated";
    } else {
      inorout = 1;
      document.getElementById("eliminated").style =
        "background: #00bc00; color: white;";
      document.getElementById("eliminated").innerHTML = "In the Running";
    }
  }
  if (data.live == 1) {
    document.getElementById("gameLive").innerHTML = "Game is live";
    document.getElementById("joinGame").disabled = false;
  } else {
    inGame = 0;
    document.getElementById("question-screen").style =
      "top: 100vh; opacity: 0%;";
    document.getElementById("gameLobby").style = "";
    try {
      player.setVolume(0);
    } catch {}
    document.getElementById("twitchPlayer").remove();
    let pjs = document.createElement("div");
    pjs.setAttribute("id", "twitchPlayer");
    document.getElementById("liveGame").appendChild(pjs);
    document.getElementById("liveGame").style = "visibility: hidden";
    document.getElementById("gameLive").innerHTML =
      "We're not live, check back soon!";
    document.getElementById("joinGame").disabled = true;
  }
});

function showAlert(h1, p1, p2) {
  document.getElementById("alert").innerHTML = h1;
  document.getElementById("alert2").innerHTML = p1;
  document.getElementById("alert3").innerHTML = p2;
  document.getElementById("alert-screen").style = "top: 30vh; opacity: 100%;";
}

document.getElementById("close-alert").onclick = function () {
  document.getElementById("alert-screen").style = "top: 100vh; opacity: 0%;";
};

document.getElementById("exitGame").onclick = function () {
  document.getElementById("gameLobby").style = "";
  try {
    player.setVolume(0);
  } catch {}
  inGame = 0;
  document.getElementById("question-screen").style = "top: 100vh; opacity: 0%;";
  document.getElementById("twitchPlayer").remove();
  let pjs = document.createElement("div");
  pjs.setAttribute("id", "twitchPlayer");
  document.getElementById("liveGame").appendChild(pjs);
  document.getElementById("liveGame").style = "visibility: hidden";
};

socket.on("adcres", (data) => {
  console.log(data);
});

Game.changeLiveState = function (data, data2) {
  socket.emit("changeLiveState", {
    token: localStorage.getItem("userToken"),
    toChange: data,
    change: data2,
  });
};

Game.sendQuestion = function (t, a1, a2, a3, c) {
  socket.emit("attemptSendQuestion", {
    token: localStorage.getItem("userToken"),
    title: t,
    a1: a1,
    a2: a2,
    a3: a3,
    c: c,
  });
};

Game.login = function (username, password) {
  socket.emit("login", {
    username: username,
    password: password,
  });
};

Game.end = function () {
  socket.emit("endGame", localStorage.getItem("userToken"));
};

Game.sendAlert = function (a1, a2, a3) {
  socket.emit("sendAlert", {
    token: localStorage.getItem("userToken"),
    a1: a1,
    a2: a2,
    a3: a3,
  });
};

socket.on("sendAlert", (data) => {
  showAlert(data.a, data.b, data.c);
  if (data.a == "You won!") {
    confetti.start();
    setTimeout(function () {
      confetti.stop();
    }, 5000);
  }
});

socket.on("loginSuccess", (credentials) => {
  localStorage.setItem("username", credentials.username);
  localStorage.setItem("id", credentials.id);
  localStorage.setItem("userToken", credentials.accessToken);
  console.log("Successfully logged in.");
});

socket.on("correct", (correct) => {
  setTimeout(function () {
    document.getElementById("question").innerHTML = "Correct! Nice work!";
    document.getElementById("question-screen").style =
      "top: 20vh; opacity: 100%;";
    document.getElementById("answer1").style.background = "red";
    document.getElementById("answer2").style.background = "red";
    document.getElementById("answer3").style.background = "red";
    document.getElementById("answer" + correct).style.background = "#00b800";
    confetti.start();
    setTimeout(function () {
      confetti.stop();
      setTimeout(function () {
        document.getElementById("question-screen").style =
          "top: 100vh; opacity: 0%;";
      }, 5000);
    }, 2000);
  }, 2000);
});

socket.on("wrong", (correct) => {
  setTimeout(function () {
    document.getElementById("question").innerHTML = "Incorrect! (Eliminated)";
    document.getElementById("question-screen").style =
      "top: 20vh; opacity: 100%;";
    document.getElementById("answer1").style.background = "red";
    document.getElementById("answer2").style.background = "red";
    document.getElementById("answer3").style.background = "red";
    document.getElementById("answer" + correct).style.background = "#00b800";
    setTimeout(function () {
      document.getElementById("question-screen").style =
        "top: 100vh; opacity: 0%;";
      if (inorout == 1) {
        inorout = 0;
        showAlert(
          "Eliminated!",
          "You've been eliminated from the contest.",
          "Try again next time!"
        );
      }
    }, 7000);
  }, 2000);
});

socket.on("answerLocked", (num) => {
  document.getElementById("answer" + num).style.background =
    "hsl(214, 100%, 30%)";
});

socket.on("loginError", (data) => {
  console.log("Login error: " + data);
});

document.getElementById("answer1").onclick = function () {
  socket.emit("slide-answer", 1);
};

document.getElementById("answer2").onclick = function () {
  socket.emit("slide-answer", 2);
};

document.getElementById("answer3").onclick = function () {
  socket.emit("slide-answer", 3);
};

socket.on("newQuestion", (data) => {
  document.getElementById("alert-screen").style = "top: 100vh; opacity: 0%;";
  document.getElementById("answer1").style.background = "hsl(170, 100%, 36%)";
  document.getElementById("answer2").style.background = "hsl(170, 100%, 36%)";
  document.getElementById("answer3").style.background = "hsl(170, 100%, 36%)";
  document.getElementById("timer").style.opacity = "100%";
  console.log("New question!");
  if (data.eliminated == 1) {
    document.getElementById("answer1").disabled = true;
    document.getElementById("answer2").disabled = true;
    document.getElementById("answer3").disabled = true;
  } else {
    document.getElementById("answer1").disabled = false;
    document.getElementById("answer2").disabled = false;
    document.getElementById("answer3").disabled = false;
  }
  document.getElementById("question").innerHTML = data.t;
  document.getElementById("answer1").innerHTML = data.a1;
  document.getElementById("answer2").innerHTML = data.a2;
  document.getElementById("answer3").innerHTML = data.a3;

  document.getElementById("question-screen").style =
    "top: 20vh; opacity: 100%;";
  var timeleft = 10;
  document.getElementById("timer").innerHTML = "10";
  document.getElementById("timer").style.width = "0vw";
  var tournendTimer = setInterval(function () {
    timeleft -= 1;
    document.getElementById("timer").innerHTML = timeleft;
    if (timeleft <= 0) {
      document.getElementById("timer").style.opacity = "0%";
      clearInterval(tournendTimer);
      document.getElementById("timer").style.width = "24vw";
      document.getElementById("question-screen").style =
        "top: 100vh; opacity: 0%;";
    }
  }, 1000);
});

document.getElementById("joinGame").onclick = function () {
  socket.emit("joinGame");
  document.getElementById("liveGame").style = "";
  document.getElementById("gameLobby").style = "visibility: hidden";
  document.getElementById("twitchPlayer").remove();
  let pjs = document.createElement("div");
  pjs.setAttribute("id", "twitchPlayer");
  document.getElementById("liveGame").appendChild(pjs);
  var options = {
    channel: "eddyzow",
    allowfullscreen: false,
    controls: false,
    height: window.innerHeight,
    width: window.innerWidth,
    volume: 0.1,
  };
  player = new Twitch.Player("twitchPlayer", options);
  inGame = 1;
};

var checkForLive = setInterval(function () {
  socket.emit("checkForLive");
}, 1000);

particlesJS.load("particles-js", "particles1.json");
