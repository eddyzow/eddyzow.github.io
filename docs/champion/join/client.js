const socket = io(window.SOCKET_URL || "https://eddyzow.herokuapp.com/"); // Socket
var inputGameCode = 0;
var answered = 1;
var gamemode = 0;
var blitzStartTime = 0;
var joinTries = 1;
var connecttimes = 0;
var selectedRob = 0;
var wordsLetters = [];
var clickable = 0;
var answerStreak = 0;
var mpqlevel = 1;
var sblevel = 1;
var mlevel = 1;
var ilevel = 1;
var shieldlevel = 1;
var heistPowerPrices = [
  [10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
  [15, 30, 45, 60, 75],
];
var insurancelevel = 1;
var defenselevel = 1;
var upgrader = 0;
var healther = 0;
var heister = 0;
var items = [
  "Are you 100% sure?",
  "Are you just better?",
  "Right or wrong?",
  "Waiting for other players!",
  "Play safely... or don't.",
  "Keep calm or be violent. There is no in between.",
  "Don't be the person shouting out the correct answer...",
  "25% chance isn't so bad to guess for.",
  "Have faith in yourself.",
  "If you're not in last place, you're doing fine!",
  "Answer fast and accurately for the most points.",
  "You can answer using the number keys, if you didn't know!",
  "There are more gamemodes than just this one, make sure to try them!",
  "Here's a tip: READ the question before you answer.",
  "Here's a tip: answer streaks award guaranteed points for correct answers!",
];
var prices = {
  mpq: [
    10, 100, 900, 7200, 50000, 300000, 1500000, 6000000, 36000000, 360000000,
    2500000000, 6750000000, 18000000000,
  ],
  sb: [
    20, 200, 1800, 14400, 100000, 600000, 3000000, 12000000, 96000000,
    576000000, 1296000000, 3564000000, 18000000000,
  ],
  m: [
    15, 150, 1350, 10800, 75000, 450000, 2250000, 9000000, 54000000, 200000000,
    400000000, 800000000, 1240000000,
  ],
  i: [
    25, 250, 2250, 18000, 125000, 750000, 3750000, 15000000, 90000000,
    150000000, 200000000, 300000000, 500000000,
  ],
};

// cash mode powerup gains
var mpq = [
  1, 5, 50, 100, 1000, 2000, 5000, 10000, 50000, 250000, 1250000, 6250000,
  12500000, 30000000,
];
var sb = [
  1, 3, 10, 50, 300, 1000, 5000, 8000, 25000, 100000, 500000, 1000000, 2500000,
  10000000,
];
var m = [1, 2, 3, 5, 7, 10, 15, 20, 30, 50, 100, 150, 200, 250];
var i = [0, 5, 10, 15, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99];

var sendNewChat = function (author, message) {
  let chatContainer = document.createElement("div");
  let chatAuthor = document.createElement("p");
  let chatMessage = document.createElement("p");
  chatContainer.setAttribute("class", "chat-message");
  chatAuthor.setAttribute("class", "inline chat-author");
  chatMessage.setAttribute("class", "inline chat-text");
  chatAuthor.innerHTML = author;
  chatMessage.innerHTML = " " + message;
  chatContainer.appendChild(chatAuthor);
  chatContainer.appendChild(chatMessage);
  document.getElementById("chatContainer").appendChild(chatContainer);
  document
    .getElementById("chatContainer")
    .scrollTo(0, document.getElementById("chatContainer").scrollHeight);
};

// playerError socket
// Modes:
// 1: Classic
// 2: Blitz
// 3: Feud
// 4: Words
// 5: Team
// 6: Cash
// 7: Survival
// 8: Heist

// finish: make sure for each submitted letter cannot be submitted twice.
// more levels of upgrades

var modes = [
  "Classic",
  "Blitz",
  "Feud",
  "Words",
  "Team",
  "Cash Grab",
  "Survival",
  "Heist",
];

function sendHeistNotify(data) {
  let elem = document.createElement("div");
  elem.setAttribute("class", "robbedNotification");
  elem.addEventListener("click", function () {
    elem.remove();
  });
  elem.innerHTML = data + " was successfully upgraded!";
  document.getElementById("cashInterface").appendChild(elem);
  setTimeout(function () {
    try {
      elem.remove();
    } catch {}
  }, 7500);
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

function sendHeistNotify2(data) {
  let elem = document.createElement("div");
  elem.setAttribute("class", "robbedNotification");
  elem.addEventListener("click", function () {
    elem.remove();
  });
  elem.innerHTML = data;
  document.getElementById("cashInterface").appendChild(elem);
  setTimeout(function () {
    try {
      elem.remove();
    } catch {}
  }, 7500);
}

function sendRobbedMessage(username, success, amount) {
  console.log(amount);
  let elem = document.createElement("div");
  elem.setAttribute("class", "robbedNotification");
  elem.addEventListener("click", function () {
    elem.remove();
  });
  if (success == true) {
    elem.innerHTML =
      "You were just robbed for $" +
      amount.toFixed(2) +
      " by an unknown source!";
  } else {
    elem.innerHTML =
      username +
      ", who has $" +
      amount.toFixed(2) +
      ", just tried to rob you, but failed thanks to your shield.";
  }
  document.getElementById("cashInterface").appendChild(elem);
  setTimeout(function () {
    try {
      elem.remove();
    } catch {}
  }, 7500);
}

socket.on("incomingHeist", (data) => {
  console.log("aaa");
  console.log(data);
  sendRobbedMessage(data[0], data[1], data[2]);
});

function zeroPad(num, numZeros) {
  var n = Math.abs(num);
  var zeros = Math.max(0, numZeros - Math.floor(n).toString().length);
  var zeroString = Math.pow(10, zeros).toString().substr(1);
  if (num < 0) {
    zeroString = "-" + zeroString;
  }

  return zeroString + n;
}

document.onkeydown = function (e) {
  e = e || window.event;
  var key = e.which || e.keyCode;
  if (key === 49) {
    document.getElementById("answerOption1").style.background = "#8cffff";
  } else if (key === 50) {
    document.getElementById("answerOption2").style.background = "#8cffff";
  } else if (key === 51) {
    document.getElementById("answerOption3").style.background = "#8cffff";
  } else if (key === 52) {
    document.getElementById("answerOption4").style.background = "#8cffff";
  }
};

socket.on("fightGameEnded", function () {
  document.getElementById("waitingContainer").style =
    "visibility: hidden; opacity: 0";
  document.getElementById("cashInterface").style =
    "visibility: hidden; opacity: 0";
  document.getElementById("questionEndScreen").style.visibility = "hidden";
  document.getElementById("questionEndScreen").style.opacity = "0%";
  localStorage.removeItem("rejoinSocketID");
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("loading").style.opacity = "100%";
  document.getElementById("questionContainer").style.opacity = "0%";
  document.getElementById("questionContainer").style.visibility = "hidden";
  document.getElementById("loadingQuestion").innerHTML = "Good game!";
  document.getElementById("goodluck").innerHTML =
    "Awesome effort! Play again soon!";
});

socket.on("cashGameEnded", (winners) => {
  document.getElementById("waitingContainer").style =
    "visibility: hidden; opacity: 0";
  document.getElementById("cashInterface").style =
    "visibility: hidden; opacity: 0";
  document.getElementById("questionEndScreen").style.visibility = "hidden";
  document.getElementById("questionEndScreen").style.opacity = "0%";
  localStorage.removeItem("rejoinSocketID");
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("loading").style.opacity = "100%";
  document.getElementById("questionContainer").style.opacity = "0%";
  document.getElementById("questionContainer").style.visibility = "hidden";
  if (
    winners.firstplace == socket.id ||
    winners.secondplace == socket.id ||
    winners.thirdplace == socket.id
  ) {
    if (winners.firstplace == socket.id) {
      document.getElementById("loadingQuestion").innerHTML = "YOU WIN!";
      document.getElementById("goodluck").innerHTML =
        "You made the most money and are now the winner! Awesome work!";
    } else {
      document.getElementById("loadingQuestion").innerHTML = "Top 3!";
      document.getElementById("goodluck").innerHTML =
        "You made the top 3! Could you win next game?";
    }
  } else {
    document.getElementById("loadingQuestion").innerHTML = "Good game!";
    document.getElementById("goodluck").innerHTML =
      "Awesome effort! Play again soon!";
  }
});

socket.on("updateBalanceHeist", (newBalance) => {
  document.getElementById("playerPoints").innerHTML =
    "$" + newBalance.toFixed(2);
});

socket.on("heistUpgradeSuccess", (data) => {
  sendHeistNotify(data);
});

document.getElementById("purchase-heistupgrade2").onclick = function () {
  socket.emit("heistUpgrade", "heistinsurance");
};

document.getElementById("purchase-heistupgrade3").onclick = function () {
  socket.emit("heistUpgrade", "defense");
};

document.getElementById("purchase-heistupgrade4").onclick = function () {
  socket.emit("purchaseRichest3");
};

socket.on("heistShieldUpdated", (data) => {
  document.getElementById("current-shield").innerHTML =
    "Your current shield is " +
    data +
    "% (" +
    (100 - data) +
    "% chance you will lose in a robbery)";
  document.getElementById("purchase-heistupgrade1").innerHTML =
    "Cost: $" + (Math.pow(2, 0.8 + data / 100) / 4).toFixed(2);
});

socket.on("updateHeistLevels", (data) => {
  if (data[0] == "Defense") {
    let defensepower = [3, 5, 7, 10, 12, 15];
    defenselevel = data[1];
    if (defenselevel != 6) {
      document.getElementById("purchase-heistupgrade3").innerHTML =
        "Cost: $" + heistPowerPrices[1][defenselevel - 1].toFixed(2);
    } else {
      document.getElementById("purchase-heistupgrade3").innerHTML =
        "Maximum Level";
    }
    document.getElementById("current-defense").innerHTML =
      "Your current level is " +
      defenselevel +
      " (Enemies can pay $" +
      defensepower[defenselevel - 1] +
      " to rob you)";
  }
  if (data[0] == "Insurance") {
    let insurancepower = [75, 60, 45, 35, 30, 25, 20, 18, 15, 12, 10];
    insurancelevel = data[1];
    if (insurancelevel != 11) {
      document.getElementById("purchase-heistupgrade2").innerHTML =
        "Cost: $" + heistPowerPrices[0][insurancelevel - 1].toFixed(2);
    } else {
      document.getElementById("purchase-heistupgrade2").innerHTML =
        "Maximum Level";
    }
    document.getElementById("current-insurance").innerHTML =
      "Your current level is " +
      insurancelevel +
      " (" +
      insurancepower[insurancelevel - 1] +
      "% lost if robbed)";
  }
});

document.onkeyup = function (e) {
  e = e || window.event;
  var key = e.which || e.keyCode;
  if (gamemode == 1 || gamemode == 2) {
    if (key === 49) {
      if (answered == 0) {
        answered = 1;
        socket.emit("liveClientAnswer", 1);
      }
      document.getElementById("answerOption1").style.background = "#ffffff";
    } else if (key === 50) {
      if (answered == 0) {
        answered = 1;
        socket.emit("liveClientAnswer", 2);
      }
      document.getElementById("answerOption2").style.background = "#ffffff";
    } else if (key === 51) {
      if (answered == 0) {
        answered = 1;
        socket.emit("liveClientAnswer", 3);
      }
      document.getElementById("answerOption3").style.background = "#ffffff";
    } else if (key === 52) {
      if (answered == 0) {
        answered = 1;
        socket.emit("liveClientAnswer", 4);
      }
      document.getElementById("answerOption4").style.background = "#ffffff";
    }
  } else if (gamemode == 4) {
    if (answered == 0) {
      if (
        wordsLetters.includes(String.fromCharCode(key).toLowerCase()) == false
      ) {
        wordsLetters.push(String.fromCharCode(key).toLowerCase());
        if (event.keyCode >= 65 && event.keyCode <= 90) {
          socket.emit("wordsCheck", event.keyCode);
        } else if (event.keyCode >= 97 && event.keyCode <= 122) {
          socket.emit("wordsCheck", event.keyCode);
        }
      }
    }
  } else if (
    (gamemode == 6 && upgrader == 0) ||
    (gamemode == 7 && upgrader == 0 && healther == 0) ||
    (gamemode == 8 && upgrader == 0 && healther == 0 && heister == 0)
  ) {
    if (key === 49) {
      if (clickable == 1) {
        clickable = 0;
        document.getElementById("cashInterfaceQuestionScreen").style =
          "top: 100vh; left: 0";
        socket.emit("submitCashAnswer", 1);
      }
    }
    if (key === 50) {
      if (clickable == 1) {
        clickable = 0;
        document.getElementById("cashInterfaceQuestionScreen").style =
          "top: 100vh; left: 0";
        socket.emit("submitCashAnswer", 2);
      }
    }
    if (key === 51) {
      if (clickable == 1) {
        clickable = 0;
        document.getElementById("cashInterfaceQuestionScreen").style =
          "top: 100vh; left: 0";
        socket.emit("submitCashAnswer", 3);
      }
    }
    if (key === 52) {
      if (clickable == 1) {
        clickable = 0;
        document.getElementById("cashInterfaceQuestionScreen").style =
          "top: 100vh; left: 0";
        socket.emit("submitCashAnswer", 4);
      }
    }
    if (key === 13) {
      document.getElementById("cashInterfaceCorrectScreen").style =
        "top: 100vh";
      socket.emit("requestQuestion");
    }
  }
};

document.getElementById("wallpaper").style["background-image"] =
  'url("../assets/art/wallpapers/' +
  (Math.floor(Math.random() * 8) + 1).toString() +
  '.jpg")';

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

document.getElementById("codeEnterButton").onclick = function () {
  // verify the game code is a real game code before continuing.
  socket.emit("checkGameOpen", document.getElementById("gameCodeInput").value);
};

document.getElementById("nameEnterButton").onclick = function () {
  // verify the game code is a real game code before continuing.
  if (joinTries == 1) {
    joinTries = 0;
    // verify a game code has been selected in the server
    socket.emit("attemptJoinGame", {
      socketid: socket.id,
      username: document.getElementById("usernameInput").value,
      gameCode: inputGameCode,
    });
    setTimeout(function () {
      joinTries = 1;
    }, 5000);
  }
};
window.onload = function () {
  document
    .getElementById("gameCodeInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        // verify the game code is a real game code before continuing.
        socket.emit(
          "checkGameOpen",
          document.getElementById("gameCodeInput").value
        );
      }
    });
  document
    .getElementById("usernameInput")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter" && joinTries == 1) {
        joinTries = 0;
        // verify a game code has been selected in the server
        socket.emit("attemptJoinGame", {
          socketid: socket.id,
          username: document.getElementById("usernameInput").value,
          gameCode: inputGameCode,
        });
        setTimeout(function () {
          joinTries = 1;
        }, 5000);
      }
    });
  document
    .getElementById("chat-text-input")
    .addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        if (document.getElementById("chat-text-input").value.trim() != "") {
          socket.emit(
            "send-chat-message",
            document.getElementById("chat-text-input").value.trim()
          );
          document.getElementById("chat-text-input").value = "";
        }
      }
    });
};

socket.on("blitzChatMessage", (data) => {
  sendNewChat(data.author, data.message);
});

socket.on("positionReturned", (pos) => {
  document.getElementById("playerRanking").innerHTML = ordinal_suffix_of(pos);
});

document.getElementById("cashUpgrades").onclick = function () {
  if (upgrader == 0) {
    clickable = 1;
    upgrader = 1;
    heister = 0;
    healther = 0;
    socket.emit("returnLevels");
    document.getElementById("cashInterfaceCorrectScreen").style = "top: 100vh";
    document.getElementById("cashInterfaceQuestionScreen").style.left =
      "-100vw";
    document.getElementById("cashInterfaceUpgradeScreen").style =
      "left: 0px; top: 0;";
    document.getElementById("cashInterfaceHealthScreen").style = "";
    document.getElementById("cashInterfaceHeistScreen").style = "top: 100vh";
  }
};

document.getElementById("cashHealth").onclick = function () {
  if (healther == 0) {
    clickable = 1;
    heister = 0;
    healther = 1;
    upgrader = 0;
    socket.emit("returnLevels");
    document.getElementById("cashInterfaceCorrectScreen").style = "top: 100vh";
    document.getElementById("cashInterfaceQuestionScreen").style.left =
      "-100vw";
    document.getElementById("cashInterfaceUpgradeScreen").style.left = "100vw";
    document.getElementById("cashInterfaceHealthScreen").style =
      "left: 0px; top: 0;";
    document.getElementById("cashInterfaceHeistScreen").style = "top: 100vh";
    socket.emit("fetchNumPlayers");
  }
};

document.getElementById("heistPowers").onclick = function () {
  if (heister == 0) {
    clickable = 1;
    healther = 0;
    heister = 1;
    upgrader = 0;
    document.getElementById("cashInterfaceCorrectScreen").style = "top: 100vh";
    document.getElementById("cashInterfaceQuestionScreen").style.left =
      "-100vw";
    document.getElementById("cashInterfaceHealthScreen").style = "top: 100vh";
    document.getElementById("cashInterfaceUpgradeScreen").style.left = "100vw";
    document.getElementById("cashInterfaceHeistScreen").style =
      "left: 0px; top: 0;";
    socket.emit("fetchNumPlayers");
  }
};

socket.on("numPlayersFetched", (number) => {
  document.getElementById("purchase-bossupgrade1").innerHTML =
    "Cost: ⬙" + 1000 * number;
  document.getElementById("purchase-bossupgrade2").innerHTML =
    "Cost: ⬙" + 10000 * number;
  document.getElementById("purchase-bossupgrade3").innerHTML =
    "Cost: ⬙" + 100000 * number;
  document.getElementById("purchase-bossupgrade4").innerHTML =
    "Cost: ⬙" + 1000000 * number;
  document.getElementById("purchase-bossupgrade5").innerHTML =
    "Cost: ⬙" + 10000000 * number;
});

document.getElementById("purchase-bossupgrade1").onclick = function () {
  if (
    (document.getElementById("purchase-bossupgrade1").innerHTML == "Bought") ==
    false
  ) {
    socket.emit("attemptPurchaseHealthUpgrade", 1);
  }
};

document.getElementById("rob").onclick = function () {
  document.getElementById("rob-screen").style.visibility = "visible";
  document.getElementById("bottombar").style.visibility = "hidden";
  socket.emit("searchRobPlayers");
  document.getElementById("confirmRob").innerHTML = "Rob";
  selectedRob = 0;
};

document.getElementById("scout").onclick = function () {
  document.getElementById("scout-screen").style.visibility = "visible";
  document.getElementById("bottombar").style.visibility = "hidden";
  socket.emit("searchScoutPlayers");
  document.getElementById("confirmScout").innerHTML = "Scout";
  selectedScout = 0;
};

socket.on("scoutPlayersSearched", (players) => {
  var paras = document.getElementsByClassName("scout-player");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  let playersarray = shuffle(Object.keys(players));
  playersarray.forEach((key) => {
    let elem = document.createElement("div");
    elem.setAttribute("class", "scout-player");
    elem.innerHTML = players[key][0];
    elem.addEventListener("click", function () {
      document.querySelectorAll(".scout-player").forEach((elem1) => {
        elem1.style = "";
      });
      selectedScout = key;
      elem.style = "background: #646464; color: white";
      document.getElementById("confirmScout").innerHTML =
        "Scout " + players[key][0] + " (Cost: $5.00)";
    });
    document.getElementById("scout-player-grid").appendChild(elem);
  });
});

socket.on("robPlayersSearched", (players) => {
  console.log(players);
  var paras = document.getElementsByClassName("rob-player");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  let playersarray = shuffle(Object.keys(players));
  playersarray.forEach((key) => {
    let elem = document.createElement("div");
    elem.setAttribute("class", "rob-player");
    elem.innerHTML = players[key][0];
    elem.addEventListener("click", function () {
      document.querySelectorAll(".rob-player").forEach((elem1) => {
        elem1.style = "";
      });
      selectedRob = key;
      elem.style = "background: #646464; color: white";
      document.getElementById("confirmRob").innerHTML =
        "Rob " + players[key][0] + " (Cost: $" + players[key][1] + ")";
    });
    document.getElementById("player-grid").appendChild(elem);
  });
});

document.getElementById("confirmRob").onclick = function () {
  if (selectedRob != 0) {
    // commence with the rob, if it's affordable.
    socket.emit("confirmRob", selectedRob);
  }
};

document.getElementById("confirmScout").onclick = function () {
  if (selectedScout != 0) {
    // commence with the rob, if it's affordable.
    socket.emit("confirmScout", selectedScout);
    document.getElementById("scout-screen").style.visibility = "hidden";
    document.getElementById("bottombar").style.visibility = "visible";
  }
};

document.getElementById("cancel-rob").onclick = function () {
  document.getElementById("rob-screen").style.visibility = "hidden";
  document.getElementById("bottombar").style.visibility = "visible";
};

document.getElementById("cancel-scout").onclick = function () {
  document.getElementById("scout-screen").style.visibility = "hidden";
  document.getElementById("bottombar").style.visibility = "visible";
};

document.getElementById("purchase-heistupgrade1").onclick = function () {
  socket.emit("attemptPurchaseHeistUpgrade", 1);
};

document.getElementById("purchase-bossupgrade2").onclick = function () {
  if (
    (document.getElementById("purchase-bossupgrade2").innerHTML == "Bought") ==
    false
  ) {
    socket.emit("attemptPurchaseHealthUpgrade", 2);
  }
};

document.getElementById("purchase-bossupgrade3").onclick = function () {
  if (
    (document.getElementById("purchase-bossupgrade3").innerHTML == "Bought") ==
    false
  ) {
    socket.emit("attemptPurchaseHealthUpgrade", 3);
  }
};

document.getElementById("purchase-bossupgrade4").onclick = function () {
  if (
    (document.getElementById("purchase-bossupgrade4").innerHTML == "Bought") ==
    false
  ) {
    socket.emit("attemptPurchaseHealthUpgrade", 4);
  }
};

document.getElementById("purchase-bossupgrade5").onclick = function () {
  if (
    (document.getElementById("purchase-bossupgrade5").innerHTML == "Bought") ==
    false
  ) {
    socket.emit("attemptPurchaseHealthUpgrade", 5);
  }
};

socket.on("purchaseHealthUpgradeSuccess", (level) => {
  if (level >= 1) {
    document.getElementById("purchase-bossupgrade1").innerHTML = "Bought";
    document.getElementById("purchase-bossupgrade1").style["background-color"] =
      "gray";
  }
  if (level >= 2) {
    document.getElementById("purchase-bossupgrade2").innerHTML = "Bought";
    document.getElementById("purchase-bossupgrade2").style["background-color"] =
      "gray";
  }
  if (level >= 3) {
    document.getElementById("purchase-bossupgrade3").innerHTML = "Bought";
    document.getElementById("purchase-bossupgrade3").style["background-color"] =
      "gray";
  }
  if (level >= 4) {
    document.getElementById("purchase-bossupgrade4").innerHTML = "Bought";
    document.getElementById("purchase-bossupgrade4").style["background-color"] =
      "gray";
  }
  if (level >= 5) {
    document.getElementById("purchase-bossupgrade5").innerHTML = "Bought";
    document.getElementById("purchase-bossupgrade5").style["background-color"] =
      "gray";
  }
});

document.getElementById("cashQuestions").onclick = function () {
  upgrader = 0;
  healther = 0;
  heister = 0;
  clickable = 1;
  socket.emit("requestQuestion");
  document.getElementById("cashInterfaceQuestionScreen").style =
    "left: 0px; top: 0;";
  document.getElementById("cashInterfaceHealthScreen").style = "";
  document.getElementById("cashInterfaceUpgradeScreen").style.left = "100vw";
  document.getElementById("cashInterfaceHeistScreen").style = "top: 100vh";
};

document.getElementById("nextQuestionCash").onclick = function () {
  document.getElementById("cashInterfaceCorrectScreen").style = "top: 100vh";
  socket.emit("requestQuestion");
};

socket.on("returnQuestion", (data) => {
  document.getElementById("cashInterface").style.visibility = "visible";
  document.getElementById("cashInterface").style.opacity = "100%";
  document.getElementById("cashInterfaceCorrectScreen").style = "top: 100vh";
  console.log(data);
  document.getElementById("cashInterfaceQuestionText").innerHTML =
    data.questionText;
  document.getElementById("interfaceq1").innerHTML = data.a1;
  document.getElementById("interfaceq2").innerHTML = data.a2;
  document.getElementById("interfaceq3").innerHTML = data.a3;
  document.getElementById("interfaceq4").innerHTML = data.a4;
  document.getElementById("cashInterfaceQuestionScreen").style =
    "top: 0px; left: 0";
});

socket.on("wordsChecked", (data) => {
  console.log("Your letter was checked!");
  console.log(data);
  document.getElementById("playerPoints").innerHTML = Math.floor(
    data.newPoints
  );
  if (data.indices.length == 0) {
    document.getElementById("questionContainer").style.background =
      "rgba(255, 0, 0, 0.25)";
  } else {
    document.getElementById("questionContainer").style.background =
      "rgba(0, 255, 0, 0.25)";
    // got it right, post.
    data.indices.forEach((index) => {
      console.log(index);
      document.getElementById("wordsLetterBox" + index).innerHTML =
        data.key.toUpperCase();
      document.getElementById("wordsLetterBox" + index).style.color = "black";
    });
  }
  setTimeout(function () {
    document.getElementById("questionContainer").style.background = "";
  }, 250);
});

socket.on("checkedGameOpen", (valid) => {
  if (valid.valid) {
    document.getElementById("styled-underline").style.visibility = "hidden";
    document.getElementById("gameCodeInput").style = "border: 4px solid lime;";
    setTimeout(function () {
      document.getElementById("gameCodeInput").style =
        "border: 4px solid white;";
      // valid

      document.getElementById("codeEnterContainer").style =
        "visibility: hidden; opacity: 0%";
      document.getElementById("nameEnterContainer").style =
        "visibility: visible; opacity: 100%";
      inputGameCode = valid.gamePin;
      if (valid.eliminated == 1) {
        document.getElementById("usernameInfo").innerHTML =
          "This game has already started. If you proceed, you'll be behind the other players.";
        document.getElementById("usernameInfo").style.color = "#ff8181";
      } else {
        document.getElementById("usernameInfo").innerHTML =
          "Warning! Your host is able to kick players out of the game. Take caution when selecting a username.";
        document.getElementById("usernameInfo").style.color = "white";
      }
    }, 250);
  } else {
    // not valid
    document.getElementById("warningContainer").innerHTML =
      "Invalid game code.";
    document.getElementById("warningContainer").style.bottom = "0px";
    setTimeout(function () {
      document.getElementById("warningContainer").style.bottom = "-150px";
    }, 2000);
    document.getElementById("gameCodeInput").style = "border: 4px solid red;";
    setTimeout(function () {
      document.getElementById("gameCodeInput").style =
        "border: 4px solid white;";
    }, 250);
  }
});

socket.emit("checkWorldwideGames");

socket.on("worldWideChecked", (number) => {
  document.getElementById("worldwideGames").innerHTML =
    number + " GAMES PLAYED WORLDWIDE";
});

socket.on("successfullyJoinedLiveGame", (setname) => {
  gamemode = setname.gamemode;
  localStorage.setItem("rejoinSocketID", socket.id);
  document.getElementById("codeEnterContainer").style =
    "visibility: hidden; opacity: 0%";
  document.getElementById("nameEnterContainer").style =
    "visibility: hidden; opacity: 0%";
  document.getElementById("intro").style = "visibility: hidden; opacity: 0%";
  document.getElementById("header").style =
    "visibility: visible; opacity: 100%; top: 0px";
  document.getElementById("setName").innerHTML = setname.setName;
  document.getElementById("questionsPlayed").innerHTML =
    setname.numQuestions + " Questions";
  document.getElementById("playerUsername").innerHTML = setname.username;
  if (gamemode == 8) {
    document.getElementById("casha1").style =
      "background-color: rgb(100 100 100); border: 0.5vw solid rgb(255 255 255 / 100%);";
    document.getElementById("casha2").style =
      "background-color: rgb(100 100 100); border: 0.5vw solid rgb(190 190 190 / 100%);";
    document.getElementById("casha4").style =
      "background-color: rgb(100 100 100); border: 0.5vw solid rgb(255 255 255 / 100%);";
    document.getElementById("casha3").style =
      "background-color: rgb(100 100 100); border: 0.5vw solid rgb(190 190 190 / 100%);";
    document.getElementById("cashInterface").style.background =
      "linear-gradient(-225deg, rgb(55, 55, 55), rgb(142, 142, 142))";
    socket.emit("requestQuestion");
    clickable = 1;
  }
  if (gamemode == 6) {
    clickable = 1;
    document.getElementById("mpqtitle").innerHTML = "Money Per Question";
    document.getElementById("playerPoints").innerHTML = "$0";
    document.getElementById("cashHealth").style =
      "visibility: hidden; position: fixed;";
    document.getElementById("heistPowers").style =
      "visibility: hidden; position: fixed;";
  } else if (gamemode == 7) {
    document.getElementById("mpqtitle").innerHTML = "Power Per Question";
    document.getElementById("playerPoints").innerHTML = "⬙0";
    document.getElementById("cashHealth").style = "";
    document.getElementById("heistPowers").style =
      "visibility: hidden; position: fixed;";
  } else if (gamemode == 8) {
    document.getElementById("playerPoints").innerHTML = "$0";
    document.getElementById("cashHealth").style =
      "visibility: hidden; position: fixed;";
    document.getElementById("cashUpgrades").style =
      "visibility: hidden; position: fixed;";
  } else {
    document.getElementById("playerPoints").innerHTML = "0";
  }
  if (setname.eliminated == 0) {
    document.getElementById("playerRanking").innerHTML = "1st";
    document.getElementById("yourein").innerHTML = "Get ready!";
    document.getElementById("waitforothers").innerHTML =
      "Wait for other players to join!";
    document.getElementById("waitingContainer").style =
      "visibility: visible; opacity: 100%";
  } else {
    if (gamemode == 6) {
      mpqlevel = 1;
      sblevel = 1;
      mlevel = 1;
      ilevel = 1;
      document.getElementById("nextCorrect").innerHTML = "Next Correct: $1";
      document.getElementById("answerStreak").innerHTML = "Streak: 0";
      document.getElementById("playerPoints").innerHTML = "$0";
      socket.emit("requestQuestion");
      document.getElementById("cashInterface").style.visibility = "visible";
      document.getElementById("cashInterface").style.opacity = "100%";
    } else if (gamemode == 7) {
      mpqlevel = 1;
      sblevel = 1;
      mlevel = 1;
      ilevel = 1;
      document.getElementById("nextCorrect").innerHTML = "Next Correct: ⬙1";
      document.getElementById("answerStreak").innerHTML = "Streak: 0";
      document.getElementById("playerPoints").innerHTML = "⬙0";
      socket.emit("requestQuestion");
      document.getElementById("cashInterface").style.visibility = "visible";
      document.getElementById("cashInterface").style.opacity = "100%";
    } else {
      document.getElementById("playerPoints").innerHTML = "0";
    }
    if (gamemode == 6) {
      document.getElementById("playerRanking").innerHTML = "1st";
    } else {
      document.getElementById("playerRanking").innerHTML = "OUT";
    }

    document.getElementById("yourein").innerHTML = "You're spectating!";
    document.getElementById("waitforothers").innerHTML =
      "Waiting for the next question...";
    document.getElementById("waitingContainer").style =
      "visibility: visible; opacity: 100%";
  }
});

socket.on("cashKickedFromGame", (data) => {
  document.getElementById("kickedNotification").style.visibility = "visible";
  document.getElementById("kickedReason").innerHTML =
    "Something went wrong... " + data;
});

socket.on("kickedFromGame", (data) => {
  document.getElementById("codeEnterContainer").style =
    "visibility: visible; opacity: 100%";
  document.getElementById("nameEnterContainer").style =
    "visibility: hidden; opacity: 0%";
  document.getElementById("intro").style = "visibility: visible; opacity: 100%";
  document.getElementById("waitingContainer").style =
    "visibility: hidden; opacity: 0%";
  document.getElementById("header").style =
    "visibility: visible; opacity: 100%; top: -65px";
  document.getElementById("gameCodeInput").value = "";
  document.getElementById("usernameInput").value = "";
  document.getElementById("warningContainer").innerHTML =
    "You've been kicked out of the game: " + data;
  joinTries = 1;
  document.getElementById("warningContainer").style.bottom = "0px";
  setTimeout(function () {
    document.getElementById("warningContainer").style.bottom = "-150px";
  }, 5000);
});

socket.on("profaneName", function () {
  document.getElementById("warningContainer").innerHTML =
    "Your username was not accepted. Try a new name!";
  joinTries = 1;
  document.getElementById("warningContainer").style.bottom = "0px";
  setTimeout(function () {
    document.getElementById("warningContainer").style.bottom = "-150px";
  }, 3000);
});

socket.on("disconnect", function () {
  document.getElementById("warningContainer").innerHTML =
    "You've been disconnected from the server - trying to reconnect...";
  document.getElementById("warningContainer").style.bottom = "0px";
});

socket.on("connect_error", function (err) {
  document.getElementById("warningContainer").innerHTML =
    "You've been disconnected from the server - trying to reconnect...";
  document.getElementById("warningContainer").style.bottom = "0px";
});

socket.on("connect", function () {
  connecttimes += 1;
  if (connecttimes > 1) {
    document.getElementById("warningContainer").innerHTML =
      "Reconnected to server!";
    document.getElementById("warningContainer").style.bottom = "0px";
    setTimeout(function () {
      document.getElementById("warningContainer").style.bottom = "-150px";
    }, 2500);
  }
});

socket.on("gameStarting", (mode) => {
  document.getElementById("nameEnterContainer").style =
    "visibility: hidden; opacity: 0%";
  console.log("Game starting! " + mode);
  document.getElementById("gameMode").innerHTML = modes[mode - 1];
});

socket.on("nextWordQuestion", (data) => {
  answered = 0;
  wordsLetters = [];
  document.getElementById("wordsTextWrapper").style = "";
  console.log("This is the next question!");
  console.log(data);
  document.getElementById("loadingBar").style.visibility = "hidden";
  document.getElementById("loadingBar").style.width = "0vw";
  document.getElementById("loading").style.opacity = "0%";
  document.getElementById("loading").style.visibility = "hidden";
  document.getElementById("answerOptionWrapper").style =
    "visibility: hidden; opacity: 0%; position: fixed";
  document.getElementById("questionContainer").style.visibility = "visible";
  document.getElementById("questionContainer").style.opacity = "100%";
  document.getElementById("liveQuestionText").innerHTML = data.qText;
  var paras = document.getElementsByClassName("letterBox");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  var paras = document.getElementsByClassName("spaceBox");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  for (let i = 0; i < data.length; i++) {
    console.log(i);
    let elem = document.createElement("div");
    elem.setAttribute("id", "wordsLetterBox" + i);
    elem.innerHTML = "?";
    if (data.spaces.includes(i)) {
      elem.setAttribute("class", "spaceBox");
    } else {
      elem.setAttribute("class", "letterBox");
      elem.setAttribute("style", "color: white");
    }
    if (data.reveal[i] != undefined) {
      elem.innerHTML = data.reveal[i];
      elem.setAttribute("style", "color: black");
    }
    document.getElementById("wordsTextWrapper").appendChild(elem);
  }
});

socket.on("prepareWordQuestion", (data) => {
  console.log("Prepare for the next question!");
  console.log(data);
  document.getElementById("questionEndScreen").style = "";
  document.getElementById("questionContainer").style =
    "visibility: hidden; opacity: 0%;";
  document.getElementById("waitingContainer").style.opacity = "0";
  document.getElementById("waitingContainer").style.visibility = "hidden";
  document.getElementById("loadingBar").style.visibility = "visible";
  document.getElementById("loadingBar").style.width = "90vw";
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("loading").style.opacity = "100%";
  document.getElementById("goodluck").innerHTML = "HINT: " + data.hint;
  document.getElementById("goodluck").style = "font-weight: 700";
  document.getElementById("loadingQuestion").innerHTML =
    "Question " + data.current + " of " + data.length;
  document.getElementById("questionsPlayed").innerHTML =
    data.current + "/" + data.length;
});

socket.on("prepareQuestion", (data) => {
  console.log("Prepare for the next question!");
  console.log(data);
  document.getElementById("questionEndScreen").style = "";
  document.getElementById("questionContainer").style =
    "visibility: hidden; opacity: 0%;";
  document.getElementById("waitingContainer").style.opacity = "0";
  document.getElementById("waitingContainer").style.visibility = "hidden";
  document.getElementById("loadingBar").style.visibility = "visible";
  document.getElementById("loadingBar").style.width = "90vw";
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("loading").style.opacity = "100%";
  document.getElementById("goodluck").innerHTML = "Good luck!";
  document.getElementById("loadingQuestion").innerHTML =
    "Question " + data.current + " of " + data.length;
  document.getElementById("questionsPlayed").innerHTML =
    data.current + "/" + data.length;
});

socket.on("nextQuestion", (data) => {
  document.getElementById("wordsTextWrapper").style = "visibility: hidden";
  answered = 0;
  console.log("This is the next question!");
  console.log(data);
  document.getElementById("loadingBar").style.visibility = "hidden";
  document.getElementById("loadingBar").style.width = "0vw";
  document.getElementById("loading").style.opacity = "0%";
  document.getElementById("loading").style.visibility = "hidden";
  document.getElementById("questionContainer").style.visibility = "visible";
  document.getElementById("questionContainer").style.opacity = "100%";
  document.getElementById("liveQuestionText").innerHTML = data.qText;
  document.getElementById("answerOption1").style.background = "#ffffff";
  document.getElementById("answerOption2").style.background = "#ffffff";
  document.getElementById("answerOption3").style.background = "#ffffff";
  document.getElementById("answerOption4").style.background = "#ffffff";
  document.getElementById("answerOption1").innerHTML = data.a1;
  document.getElementById("answerOption2").innerHTML = data.a2;
  document.getElementById("answerOption3").innerHTML = data.a3;
  document.getElementById("answerOption4").innerHTML = data.a4;
});

document.getElementById("answerOption1").onclick = function () {
  socket.emit("liveClientAnswer", 1);
};

document.getElementById("answerOption2").onclick = function () {
  socket.emit("liveClientAnswer", 2);
};

document.getElementById("answerOption3").onclick = function () {
  socket.emit("liveClientAnswer", 3);
};

document.getElementById("answerOption4").onclick = function () {
  socket.emit("liveClientAnswer", 4);
};

socket.on("answerSubmitted", (addedPoints) => {
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("loading").style.opacity = "100%";
  document.getElementById("questionContainer").style.opacity = "0%";
  document.getElementById("questionContainer").style.visibility = "hidden";
  if (addedPoints.mode == 4) {
    document.getElementById("goodluck").innerHTML =
      "Puzzle solved! Please wait for other players...";
    answered = 1;
  } else {
    let item = items[Math.floor(Math.random() * items.length)];
    document.getElementById("goodluck").innerHTML = item;
  }
});

socket.on("wordsQuestionEnded", (data) => {
  document.getElementById("answerOption1").style.background = "#ffffff";
  document.getElementById("answerOption2").style.background = "#ffffff";
  document.getElementById("answerOption3").style.background = "#ffffff";
  document.getElementById("answerOption4").style.background = "#ffffff";
  document.getElementById("questionContainer").style.opacity = "0%";
  document.getElementById("questionContainer").style.visibility = "hidden";
  document.getElementById("loading").style.opacity = "0%";
  document.getElementById("loading").style.visibility = "hidden";
  console.log("Words question ended!");
  console.log(data);
  document.getElementById("playerRanking").innerHTML =
    ordinal_suffix_of(data.position) + "/" + data.playersInGame;
  console.log(Math.floor(data.points));
  console.log(
    Number.parseInt(document.getElementById("playerPoints").innerHTML, 10)
  );
  if (
    Math.floor(data.points) !=
    Number.parseInt(document.getElementById("playerPoints").innerHTML, 10)
  ) {
    console.log("Correct!");
    document.getElementById("questionEndScreen").style.background =
      "rgba(0, 255, 0, 0.75)";
    document.getElementById("questionEndResult").innerHTML =
      "Solved (+" +
      Math.floor(
        data.points - document.getElementById("playerPoints").innerHTML
      ) +
      ")";
    document.getElementById("playerPoints").innerHTML = Math.floor(data.points);
    document.getElementById("checkmark").style.content =
      "url('https://cdn.discordapp.com/attachments/783532902280724511/783532913979424808/checkmark-removebg-preview.png')";
    document.getElementById("placement").innerHTML =
      "You're in " + ordinal_suffix_of(data.position) + " place.";
  } else {
    document.getElementById("playerPoints").innerHTML = Math.floor(data.points);
    console.log("Incorrect!");
    document.getElementById("questionEndScreen").style.background =
      "rgba(255, 0, 0, 0.75)";
    document.getElementById("questionEndResult").innerHTML = "Incorrect";
    document.getElementById("checkmark").style.content =
      "url('https://cdn.discordapp.com/attachments/783532902280724511/783536446090117140/output-onlinepngtools.png')";
    document.getElementById("placement").innerHTML =
      "You're in " + ordinal_suffix_of(data.position) + " place.";
  }
  document.getElementById("questionEndScreen").style.visibility = "visible";
  document.getElementById("questionEndScreen").style.opacity = "100%";
});

socket.on("questionEnded", (data) => {
  document.getElementById("answerOption1").style.background = "#ffffff";
  document.getElementById("answerOption2").style.background = "#ffffff";
  document.getElementById("answerOption3").style.background = "#ffffff";
  document.getElementById("answerOption4").style.background = "#ffffff";
  document.getElementById("questionContainer").style.opacity = "0%";
  document.getElementById("questionContainer").style.visibility = "hidden";
  document.getElementById("loading").style.opacity = "0%";
  document.getElementById("loading").style.visibility = "hidden";
  console.log("Question ended!");
  console.log(data);
  if (data.position == "OUT") {
    document.getElementById("playerRanking").innerHTML = "OUT";
  } else {
    document.getElementById("playerRanking").innerHTML =
      ordinal_suffix_of(data.position) + "/" + data.playersInGame;
  }
  if (
    Math.floor(data.points) !=
    Number.parseInt(document.getElementById("playerPoints").innerHTML, 10)
  ) {
    console.log("Correct!");
    document.getElementById("questionEndScreen").style.background =
      "rgba(0, 255, 0, 0.75)";
    document.getElementById("questionEndResult").innerHTML =
      "Correct! (+" +
      Math.floor(
        data.points - document.getElementById("playerPoints").innerHTML
      ) +
      ")";
    document.getElementById("playerPoints").innerHTML = Math.floor(data.points);
    document.getElementById("checkmark").style.content =
      "url('https://cdn.discordapp.com/attachments/783532902280724511/783532913979424808/checkmark-removebg-preview.png')";

    if (data.blitzEnabled == true) {
      if (data.position <= 3) {
        document.getElementById("placement").innerHTML =
          "You're in " +
          ordinal_suffix_of(data.position) +
          " place! Keep it up, and you'll make it to the Blitz!";
      } else if (data.position <= data.playersInGame / 2) {
        document.getElementById("placement").innerHTML =
          "You're in " +
          ordinal_suffix_of(data.position) +
          " place! Great work, try to hit the top 3!";
      } else {
        if (data.position == "OUT") {
          document.getElementById("placement").innerHTML =
            "You have been eliminated. Keep practicing to make the cut, or even win the next game!";
        } else {
          if (data.position <= data.playersInGame / 1.5) {
            document.getElementById("placement").innerHTML =
              "You're in " +
              ordinal_suffix_of(data.position) +
              " place. Stay away from the bottom!";
          } else {
            document.getElementById("placement").innerHTML =
              "You're in " +
              ordinal_suffix_of(data.position) +
              " place, dangerous territory. Try to escape the bottom as fast as possible!";
          }
        }
      }
    } else {
      document.getElementById("placement").innerHTML =
        "You're in " + ordinal_suffix_of(data.position) + " place.";
    }
  } else {
    document.getElementById("playerPoints").innerHTML = Math.floor(data.points);
    console.log("Incorrect!");
    document.getElementById("questionEndScreen").style.background =
      "rgba(255, 0, 0, 0.75)";
    document.getElementById("questionEndResult").innerHTML =
      "Incorrect (Streak Reset)";
    document.getElementById("checkmark").style.content =
      "url('https://cdn.discordapp.com/attachments/783532902280724511/783536446090117140/output-onlinepngtools.png')";

    if (data.blitzEnabled == true) {
      if (data.position <= 3) {
        document.getElementById("placement").innerHTML =
          "You're in " +
          ordinal_suffix_of(data.position) +
          " place! Keep it up, and you'll make it to the Blitz!";
      } else if (data.position <= data.playersInGame / 2) {
        document.getElementById("placement").innerHTML =
          "You're in " +
          ordinal_suffix_of(data.position) +
          " place. Try to hit the top 3!";
      } else {
        if (data.position == "OUT") {
          document.getElementById("placement").innerHTML =
            "You have been eliminated. Keep practicing to make the cut, or even win the next game!";
        } else {
          if (data.position <= data.playersInGame / 1.5) {
            document.getElementById("placement").innerHTML =
              "You're in " +
              ordinal_suffix_of(data.position) +
              " place. Stay away from the bottom!";
          } else {
            document.getElementById("placement").innerHTML =
              "You're in " +
              ordinal_suffix_of(data.position) +
              " place, dangerous territory. Try to escape the bottom as fast as possible!";
          }
        }
      }
    } else {
      document.getElementById("placement").innerHTML =
        "You're in " + ordinal_suffix_of(data.position) + " place.";
    }
  }
  document.getElementById("questionEndScreen").style.visibility = "visible";
  document.getElementById("questionEndScreen").style.opacity = "100%";
});

// on end question, post the standings in the right corner.
document.getElementById("styled-underline").onclick = function () {
  socket.emit("rejoinGame", localStorage.getItem("rejoinSocketID"));
  document.getElementById("styled-underline").style.visibility = "hidden";
};

socket.on("fightStarting", function () {
  mpqlevel = 1;
  sblevel = 1;
  document.getElementById("nextCorrect").innerHTML = "Next Correct: ⬙1";
  mlevel = 1;
  ilevel = 1;
  clickable = 1;
  // create interface
  document.getElementById("answerStreak").innerHTML = "Streak: 0";
  socket.emit("requestQuestion");
  document.getElementById("cashInterface").style.visibility = "visible";
  document.getElementById("cashInterface").style.opacity = "100%";
});

socket.on("cashStarting", function () {
  mpqlevel = 1;
  sblevel = 1;
  document.getElementById("nextCorrect").innerHTML = "Next Correct: $1";
  mlevel = 1;
  ilevel = 1;
  clickable = 1;
  // create interface
  document.getElementById("answerStreak").innerHTML = "Streak: 0";
  socket.emit("requestQuestion");
  document.getElementById("cashInterface").style.visibility = "visible";
  document.getElementById("cashInterface").style.opacity = "100%";
});

socket.on("heistStarting", function () {
  shieldlevel = 1;
  insurancelevel = 1;
  document.getElementById("nextCorrect").innerHTML = "";
  defenselevel = 1;
  clickable = 1;
  // create interface
  document.getElementById("answerStreak").innerHTML = "Streak: 0";
  socket.emit("requestQuestion");
  document.getElementById("cashInterface").style.visibility = "visible";
  document.getElementById("cashInterface").style.opacity = "100%";
});

socket.on("gameRejoined", (data) => {
  console.log(data);
  gamemode = data.gamemode;
  localStorage.setItem("rejoinSocketID", socket.id);
  document.getElementById("codeEnterContainer").style =
    "visibility: hidden; opacity: 0%";
  document.getElementById("nameEnterContainer").style =
    "visibility: hidden; opacity: 0%";
  document.getElementById("intro").style = "visibility: hidden; opacity: 0%";
  document.getElementById("header").style =
    "visibility: visible; opacity: 100%; top: 0px";
  document.getElementById("setName").innerHTML = data.setName;
  if (gamemode == 8) {
    document.getElementById("casha1").style =
      "background-color: rgb(159 159 159); border: 0.5vw solid rgb(255 255 255 / 100%);";
    document.getElementById("casha2").style =
      "background-color: rgb(159 159 159); border: 0.5vw solid rgb(190 190 190 / 100%);";
    document.getElementById("casha4").style =
      "background-color: rgb(159 159 159); border: 0.5vw solid rgb(255 255 255 / 100%);";
    document.getElementById("casha3").style =
      "background-color: rgb(159 159 159); border: 0.5vw solid rgb(190 190 190 / 100%);";
    document.getElementById("cashInterface").style.background =
      "linear-gradient(-225deg, rgb(55, 55, 55), rgb(142, 142, 142))";
    document.getElementById("cashInterface").style.visibility = "visible";
    document.getElementById("cashInterface").style.opacity = "100%";
  }
  if (gamemode != 6 && gamemode != 7 && gamemode != 8) {
    document.getElementById("questionsPlayed").innerHTML =
      data.numQuestions + " Questions";
  } else {
    document.getElementById("questionsPlayed").innerHTML = "";
    if (gamemode == 6) {
      clickable = 1;
      document.getElementById("cashHealth").style =
        "visibility: hidden; position: fixed;";
      document.getElementById("heistPowers").style =
        "visibility: hidden; position: fixed;";
      document.getElementById("answerStreak").innerHTML = "Streak: 0";
      socket.emit("requestQuestion");
    } else if (gamemode == 7) {
      document.getElementById("heistPowers").style =
        "visibility: hidden; position: fixed;";
      clickable = 1;
      document.getElementById("answerStreak").innerHTML = "Streak: 0";
      socket.emit("requestQuestion");
    } else if (gamemode == 8) {
      document.getElementById("cashHealth").style =
        "visibility: hidden; position: fixed;";
      document.getElementById("cashUpgrades").style =
        "visibility: hidden; position: fixed;";
      clickable = 1;
      document.getElementById("answerStreak").innerHTML = "Streak: 0";
      socket.emit("requestQuestion");
    }
  }
  document.getElementById("playerUsername").innerHTML = data.username;
  document.getElementById("playerPoints").innerHTML = Math.floor(data.points);
  if (data.eliminated == 0) {
    document.getElementById("playerRanking").innerHTML = "1st";
    document.getElementById("yourein").innerHTML = "You've rejoined!";
    document.getElementById("waitforothers").innerHTML =
      "Waiting for the next question..";
    document.getElementById("waitingContainer").style =
      "visibility: visible; opacity: 100%";
  } else {
    if (gamemode == 6) {
      document.getElementById("playerRanking").innerHTML = "1st";
    } else {
      document.getElementById("playerRanking").innerHTML = "OUT";
    }
    document.getElementById("yourein").innerHTML =
      "You're currently eliminated.";
    document.getElementById("waitforothers").innerHTML =
      "You can still answer questions.";
    document.getElementById("waitingContainer").style =
      "visibility: visible; opacity: 100%";
  }
});

socket.on("rejoinFailed", function () {
  document.getElementById("styled-underline").style.visibility = "hidden";
  localStorage.removeItem("rejoinSocketID");
});

socket.on("blitzReady", (data) => {
  console.log("Blitz Ready!");
  console.log(data);
  document.getElementById("questionEndScreen").style = "";
  document.getElementById("questionContainer").style =
    "visibility: hidden; opacity: 0%;";
  document.getElementById("waitingContainer").style.opacity = "0";
  document.getElementById("waitingContainer").style.visibility = "hidden";
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("loading").style.opacity = "100%";
  if (data == 1) {
    document.getElementById("goodluck").innerHTML = "For all the marbles...";
    document.getElementById("loadingQuestion").innerHTML = "Blitz Round (In)";
    document.getElementById("questionsPlayed").innerHTML = "Blitz Round";
  } else {
    document.getElementById("goodluck").innerHTML = "Spectating Blitz Round";
    document.getElementById("loadingQuestion").innerHTML = "Blitz Round (Out)";
    document.getElementById("questionsPlayed").innerHTML = "Blitz Round";
  }
});

socket.on("blitzStarted", function () {
  blitzStartTime = Math.floor(new Date().getTime());
});

socket.on("newBlitzQuestion", (data) => {
  answered = 0;
  console.log("A question has appeared during the blitz!");
  console.log(data);
  document.getElementById("loadingBar").style.visibility = "hidden";
  document.getElementById("loadingBar").style.width = "0vw";
  document.getElementById("loading").style.opacity = "0%";
  document.getElementById("loading").style.visibility = "hidden";
  document.getElementById("questionContainer").style.visibility = "visible";
  document.getElementById("questionContainer").style.opacity = "100%";
  document.getElementById("liveQuestionText").innerHTML = data.questionText;
  document.getElementById("answerOption1").style.background = "#ffffff";
  document.getElementById("answerOption2").style.background = "#ffffff";
  document.getElementById("answerOption3").style.background = "#ffffff";
  document.getElementById("answerOption4").style.background = "#ffffff";
  document.getElementById("answerOption1").innerHTML = data.a1;
  document.getElementById("answerOption2").innerHTML = data.a2;
  document.getElementById("answerOption3").innerHTML = data.a3;
  document.getElementById("answerOption4").innerHTML = data.a4;
});

socket.on("blitzWrong", function () {
  console.log("BLITZ WRONG!");
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("loading").style.opacity = "100%";
  document.getElementById("questionContainer").style.opacity = "0%";
  document.getElementById("questionContainer").style.visibility = "hidden";
  document.getElementById("loadingQuestion").innerHTML = "Incorrect";
  document.getElementById("goodluck").innerHTML =
    "Answer again in a few seconds!";
  setTimeout(function () {
    answered = 0;
    document.getElementById("loading").style.opacity = "0%";
    document.getElementById("loading").style.visibility = "hidden";
    document.getElementById("questionContainer").style.visibility = "visible";
    document.getElementById("questionContainer").style.opacity = "100%";
  }, 5000);
});

socket.on("playerWon", (rank) => {
  localStorage.removeItem("rejoinSocketID");
  console.log(rank);
  let newtime = Math.floor(new Date().getTime());
  document.getElementById("questionEndScreen").style.visibility = "hidden";
  document.getElementById("questionEndScreen").style.opacity = "0%";
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("loading").style.opacity = "100%";
  document.getElementById("questionContainer").style.opacity = "0%";
  document.getElementById("questionContainer").style.visibility = "hidden";
  if (rank.force == 0) {
    let stopwatch = newtime - blitzStartTime;
    var seconds = Math.floor((stopwatch / 1000) % 60); // int
    var minutes = Math.floor((stopwatch / (1000 * 60)) % 60); // int
    var cs = Math.floor((stopwatch % 1000) / 10); // int
    document.getElementById("loadingQuestion").innerHTML =
      ordinal_suffix_of(rank.pos) +
      " Place (" +
      (zeroPad(minutes, 2) + ":" + zeroPad(seconds, 2) + "." + zeroPad(cs, 2)) +
      ")";
  } else {
    document.getElementById("loadingQuestion").innerHTML =
      ordinal_suffix_of(rank.pos) + " Place";
  }
  if (rank.pos == 1) {
    document.getElementById("goodluck").innerHTML =
      "Hard work pays off, congratulations!";
  } else {
    document.getElementById("goodluck").innerHTML =
      "Great effort! You made it to the top 3!";
  }
});

socket.on("gameOver", (pos) => {
  document.getElementById("questionEndScreen").style.visibility = "hidden";
  document.getElementById("questionEndScreen").style.opacity = "0%";
  localStorage.removeItem("rejoinSocketID");
  document.getElementById("loading").style.visibility = "visible";
  document.getElementById("loading").style.opacity = "100%";
  document.getElementById("questionContainer").style.opacity = "0%";
  document.getElementById("questionContainer").style.visibility = "hidden";
  if (pos != -1) {
    document.getElementById("loadingQuestion").innerHTML =
      "Good effort! (" + ordinal_suffix_of(pos) + " Place)";
    document.getElementById("goodluck").innerHTML =
      "You didn't make the top 3. Try again next time!";
  } else {
    document.getElementById("loadingQuestion").innerHTML = "Game over!";
    document.getElementById("goodluck").innerHTML = "Play again soon!";
  }
});

if (localStorage.getItem("rejoinSocketID") !== null) {
  document.getElementById("styled-underline").style.visibility = "visible";
} else {
  document.getElementById("styled-underline").style.visibility = "hidden";
}

document.getElementById("casha1").onclick = function () {
  if (clickable == 1) {
    upgrader = 1;
    healther = 1;
    clickable = 0;
    document.getElementById("cashInterfaceQuestionScreen").style =
      "top: 100vh; left: 0";
    socket.emit("submitCashAnswer", 1);
  }
};
document.getElementById("casha2").onclick = function () {
  if (clickable == 1) {
    clickable = 0;
    upgrader = 1;
    healther = 1;

    document.getElementById("cashInterfaceQuestionScreen").style =
      "top: 100vh; left: 0";
    socket.emit("submitCashAnswer", 2);
  }
};
document.getElementById("casha3").onclick = function () {
  if (clickable == 1) {
    clickable = 0;
    upgrader = 1;
    healther = 1;

    document.getElementById("cashInterfaceQuestionScreen").style =
      "top: 100vh; left: 0";
    socket.emit("submitCashAnswer", 3);
  }
};
document.getElementById("casha4").onclick = function () {
  if (clickable == 1) {
    clickable = 0;
    upgrader = 1;
    healther = 1;

    document.getElementById("cashInterfaceQuestionScreen").style =
      "top: 100vh; left: 0";
    socket.emit("submitCashAnswer", 4);
  }
};

socket.on("successfulHeist", (data) => {
  document.getElementById("rob-screen").style.visibility = "hidden";
  document.getElementById("bottombar").style.visibility = "visible";
  sendHeistNotify2(
    "Successfully stole $" + data[1].toFixed(2) + " from " + data[0]
  );
});

socket.on("sendHeistNotify2", (data) => {
  sendHeistNotify2(data);
});

socket.on("failedHeist", (data) => {
  document.getElementById("rob-screen").style.visibility = "hidden";
  document.getElementById("bottombar").style.visibility = "visible";
  sendHeistNotify2(
    "The heist was unsuccessful. " +
      data +
      " has been notified of your attempt."
  );
});

socket.on("heistResult", (data) => {
  socket.emit("returnLevels");
  console.log(data);
  clickable = 1;
  upgrader = 0;
  healther = 0;
  if (data.correct == 1) {
    document.getElementById("correctwrong").style.background =
      "rgb(0, 162, 50)";
    document.getElementById("correctwrong").innerHTML = "+$" + data.moneyAdded;
    console.log("Correct");
  } else {
    document.getElementById("correctwrong").style.background = "rgb(155, 0, 0)";
    console.log("Wrong");
    document.getElementById("correctwrong").innerHTML =
      "-$" + (0 - data.moneyAdded);
  }
  console.log("Balance Change: $" + data.moneyAdded);
  console.log("New Balance: $" + data.newBalance);
  answerStreak = data.answerStreak;
  document.getElementById("answerStreak").innerHTML =
    "Streak: " + data.answerStreak;
  document.getElementById("playerPoints").innerHTML =
    "$" + data.newBalance.toFixed(2);
  document.getElementById("cashInterfaceCorrectScreen").style = "top: 0";
  document.getElementById("nextCorrect").style = "visibility: hidden";
});

socket.on("cashResult", (data) => {
  socket.emit("returnLevels");
  console.log(data);
  clickable = 1;
  upgrader = 0;
  healther = 0;
  if (data.correct == 1) {
    document.getElementById("correctwrong").style.background =
      "rgb(0, 162, 50)";
    document.getElementById("correctwrong").innerHTML = "+$" + data.moneyAdded;
    console.log("Correct");
  } else {
    document.getElementById("correctwrong").style.background = "rgb(155, 0, 0)";
    console.log("Wrong");
    document.getElementById("correctwrong").innerHTML =
      "-$" + (0 - data.moneyAdded);
  }
  console.log("Balance Change: $" + data.moneyAdded);
  console.log("New Balance: $" + data.newBalance);
  answerStreak = data.answerStreak;
  document.getElementById("answerStreak").innerHTML =
    "Streak: " + data.answerStreak;
  document.getElementById("playerPoints").innerHTML = "$" + data.newBalance;
  document.getElementById("cashInterfaceCorrectScreen").style = "top: 0";
  document.getElementById("nextCorrect").innerHTML =
    "Next Correct: $" +
    (mpq[mpqlevel - 1] + sb[sblevel - 1] * answerStreak) * m[mlevel - 1];
});

socket.on("fightResult", (data) => {
  socket.emit("returnLevels");
  console.log(data);
  clickable = 1;
  upgrader = 0;
  healther = 0;
  if (data.correct == 1) {
    document.getElementById("correctwrong").style.background =
      "rgb(0, 162, 50)";
    document.getElementById("correctwrong").innerHTML = "+⬙" + data.moneyAdded;
    console.log("Correct");
  } else {
    document.getElementById("correctwrong").style.background = "rgb(155, 0, 0)";
    console.log("Wrong");
    document.getElementById("correctwrong").innerHTML =
      "-⬙" + (0 - data.moneyAdded);
  }
  console.log("Balance Change: ⬙" + data.moneyAdded);
  console.log("New Balance: ⬙" + data.newBalance);
  answerStreak = data.answerStreak;
  document.getElementById("answerStreak").innerHTML =
    "Streak: " + data.answerStreak;
  document.getElementById("playerPoints").innerHTML = "⬙" + data.newBalance;
  document.getElementById("cashInterfaceCorrectScreen").style = "top: 0";
  document.getElementById("nextCorrect").innerHTML =
    "Next Correct: ⬙" +
    (mpq[mpqlevel - 1] + sb[sblevel - 1] * answerStreak) * m[mlevel - 1];
});

document.getElementById("upgrade1").onclick = function () {
  socket.emit("upgrade", "mpq");
};

document.getElementById("upgrade2").onclick = function () {
  socket.emit("upgrade", "streakBonus");
};

document.getElementById("upgrade3").onclick = function () {
  socket.emit("upgrade", "multiplier");
};

document.getElementById("upgrade4").onclick = function () {
  socket.emit("upgrade", "insurance");
};

socket.on("upgradeSuccess", (data) => {
  if (data.gameMode == 7) {
    answerStreak = 0;
    document.getElementById("answerStreak").innerHTML = "Streak: 0";
    document.getElementById("nextCorrect").innerHTML =
      "Next Correct: ⬙" +
      (mpq[mpqlevel - 1] + sb[sblevel - 1] * answerStreak) * m[mlevel - 1];
    socket.emit("returnLevels");
    document.getElementById("playerPoints").innerHTML = "⬙" + data.newBalance;
  } else {
    answerStreak = 0;
    document.getElementById("answerStreak").innerHTML = "Streak: 0";
    document.getElementById("nextCorrect").innerHTML =
      "Next Correct: $" +
      (mpq[mpqlevel - 1] + sb[sblevel - 1] * answerStreak) * m[mlevel - 1];
    socket.emit("returnLevels");
    document.getElementById("playerPoints").innerHTML = "$" + data.newBalance;
  }
});

socket.on("levelsReturned", (data) => {
  mpqlevel = data.mpq;
  sblevel = data.streakBonus;
  mlevel = data.multiplier;
  ilevel = data.insurance;
  document.getElementById("nextCorrect").innerHTML =
    "Next Correct: $" +
    (mpq[mpqlevel - 1] + sb[sblevel - 1] * answerStreak) * m[mlevel - 1];
  if (data.mpq != 14) {
    document.getElementById("mpqlevel").innerHTML =
      "Level " + data.mpq + " -> Level " + (data.mpq + 1);
    document.getElementById("mpqcompare").innerHTML =
      "$" + mpq[data.mpq - 1] + " -> $" + mpq[data.mpq];
    document.getElementById("mpqcost").innerHTML =
      "Click to upgrade to Level " +
      (data.mpq + 1) +
      " ($" +
      prices["mpq"][data.mpq - 1] +
      ")";
  } else {
    document.getElementById("mpqlevel").innerHTML =
      "MAX LEVEL ($" + mpq[9] + ")";
    document.getElementById("mpqcompare").innerHTML = "";
    document.getElementById("mpqcost").innerHTML = "";
  }
  if (data.streakBonus != 14) {
    document.getElementById("sblevel").innerHTML =
      "Level " + data.streakBonus + " -> Level " + (data.streakBonus + 1);
    document.getElementById("sbcompare").innerHTML =
      "$" + sb[data.streakBonus - 1] + " -> $" + sb[data.streakBonus];
    document.getElementById("sbcost").innerHTML =
      "Click to upgrade to Level " +
      (data.streakBonus + 1) +
      " ($" +
      prices["sb"][data.streakBonus - 1] +
      ")";
  } else {
    document.getElementById("sblevel").innerHTML = "MAX LEVEL ($" + sb[9] + ")";
    document.getElementById("sbcompare").innerHTML = "";
    document.getElementById("sbcost").innerHTML = "";
  }
  if (data.multiplier != 14) {
    document.getElementById("mlevel").innerHTML =
      "Level " + data.multiplier + " -> Level " + (data.multiplier + 1);
    document.getElementById("mcompare").innerHTML =
      "x" + m[data.multiplier - 1] + " -> x" + m[data.multiplier];
    document.getElementById("mcost").innerHTML =
      "Click to upgrade to Level " +
      (data.multiplier + 1) +
      " ($" +
      prices["m"][data.multiplier - 1] +
      ")";
  } else {
    document.getElementById("mlevel").innerHTML = "MAX LEVEL (x" + m[9] + ")";
    document.getElementById("mcompare").innerHTML = "";
    document.getElementById("mcost").innerHTML = "";
  }
  if (data.insurance != 14) {
    document.getElementById("ilevel").innerHTML =
      "Level " + data.insurance + " -> Level " + (data.insurance + 1);
    document.getElementById("icompare").innerHTML =
      i[data.insurance - 1] + "% -> " + i[data.insurance] + "%";
    document.getElementById("icost").innerHTML =
      "Click to upgrade to Level " +
      (data.insurance + 1) +
      " ($" +
      prices["i"][data.insurance - 1] +
      ")";
  } else {
    document.getElementById("ilevel").innerHTML = "MAX LEVEL (" + i[9] + "%)";
    document.getElementById("icompare").innerHTML = "";
    document.getElementById("icost").innerHTML = "";
  }
});

socket.on("fightLevelsReturned", (data) => {
  mpqlevel = data.mpq;
  sblevel = data.streakBonus;
  mlevel = data.multiplier;
  ilevel = data.insurance;
  document.getElementById("nextCorrect").innerHTML =
    "Next Correct: ⬙" +
    (mpq[mpqlevel - 1] + sb[sblevel - 1] * answerStreak) * m[mlevel - 1];
  if (data.mpq != 14) {
    document.getElementById("mpqlevel").innerHTML =
      "Level " + data.mpq + " -> Level " + (data.mpq + 1);
    document.getElementById("mpqcompare").innerHTML =
      "⬙" + mpq[data.mpq - 1] + " -> ⬙" + mpq[data.mpq];
    document.getElementById("mpqcost").innerHTML =
      "Click to upgrade to Level " +
      (data.mpq + 1) +
      " (⬙" +
      prices["mpq"][data.mpq - 1] +
      ")";
  } else {
    document.getElementById("mpqlevel").innerHTML =
      "MAX LEVEL (⬙" + mpq[13] + ")";
    document.getElementById("mpqcompare").innerHTML = "";
    document.getElementById("mpqcost").innerHTML = "";
  }
  if (data.streakBonus != 14) {
    document.getElementById("sblevel").innerHTML =
      "Level " + data.streakBonus + " -> Level " + (data.streakBonus + 1);
    document.getElementById("sbcompare").innerHTML =
      "⬙" + sb[data.streakBonus - 1] + " -> ⬙" + sb[data.streakBonus];
    document.getElementById("sbcost").innerHTML =
      "Click to upgrade to Level " +
      (data.streakBonus + 1) +
      " (⬙" +
      prices["sb"][data.streakBonus - 1] +
      ")";
  } else {
    document.getElementById("sblevel").innerHTML =
      "MAX LEVEL (⬙" + sb[13] + ")";
    document.getElementById("sbcompare").innerHTML = "";
    document.getElementById("sbcost").innerHTML = "";
  }
  if (data.multiplier != 14) {
    document.getElementById("mlevel").innerHTML =
      "Level " + data.multiplier + " -> Level " + (data.multiplier + 1);
    document.getElementById("mcompare").innerHTML =
      "x" + m[data.multiplier - 1] + " -> x" + m[data.multiplier];
    document.getElementById("mcost").innerHTML =
      "Click to upgrade to Level " +
      (data.multiplier + 1) +
      " (⬙" +
      prices["m"][data.multiplier - 1] +
      ")";
  } else {
    document.getElementById("mlevel").innerHTML = "MAX LEVEL (x" + m[13] + ")";
    document.getElementById("mcompare").innerHTML = "";
    document.getElementById("mcost").innerHTML = "";
  }
  if (data.insurance != 14) {
    document.getElementById("ilevel").innerHTML =
      "Level " + data.insurance + " -> Level " + (data.insurance + 1);
    document.getElementById("icompare").innerHTML =
      i[data.insurance - 1] + "% -> " + i[data.insurance] + "%";
    document.getElementById("icost").innerHTML =
      "Click to upgrade to Level " +
      (data.insurance + 1) +
      " (⬙" +
      prices["i"][data.insurance - 1] +
      ")";
  } else {
    document.getElementById("ilevel").innerHTML = "MAX LEVEL (" + i[13] + "%)";
    document.getElementById("icompare").innerHTML = "";
    document.getElementById("icost").innerHTML = "";
  }
});
