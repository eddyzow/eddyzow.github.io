const socket = io("https://eddyzow.onrender.com/"); // Socket
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
var minPlayers = [9999999, 3, 3, 3, 1, 1, 1, 3, 2];
var saving = 0;
var cashintro = new Howl({
  src: ["../../assets/sound/music/20.mp3"],
  rate: 1,
  preload: false,
});

function sendAlert(alert) {
  document.getElementById("savingModal").innerHTML = alert;
  document.getElementById("savingModal").style.visibility = "visible";
  document.getElementById("savingModal").style.opacity = "100%";
  setTimeout(function () {
    document.getElementById("savingModal").style.opacity = "0%";
    document.getElementById("savingModal").style.visibility = "hidden";
  }, 2000);
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

document.getElementById("privacy").addEventListener("change", function () {
  if (page == 3) {
    document.getElementById("unsaved").style =
      "visibility: visible; opacity: 100%;";
    unsaved = 1;
    document.getElementById("saveButton").disabled = false;
    document.getElementById("saveButton").innerHTML = "SAVE NOW";
  }
});

document.getElementById("timeLimit").addEventListener("change", function () {
  if (page == 3) {
    document.getElementById("unsaved").style =
      "visibility: visible; opacity: 100%;";
    unsaved = 1;
    document.getElementById("saveButton").disabled = false;
    document.getElementById("saveButton").innerHTML = "SAVE NOW";
  }
});

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

document.getElementById("timeLimit").selectedIndex = 3;
document.getElementById("privacy").selectedIndex = 0;

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
});

var happyMusic = new Howl({
  src: ["../../assets/sound/music/24.mp3"],
  loop: true,
  rate: 1,
  volume: 0.5,
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

socket.on("plusGot", (data) => {
  if (data == 1) {
    document.getElementById("getblitz").innerHTML = "Blitz+";
    document.getElementById("getblitzbutton").style.visibility = "hidden";
  } else {
    document.getElementById("getblitz").innerHTML = "Blitz";
    document.getElementById("getblitzbutton").style.visibility = "hidden";
  }
});

document.getElementById("getblitzbutton").onclick = function () {
  document.getElementById("blitzPlusPrescreen").style =
    "visibility: visible; bottom: 0;";
  document.getElementById("savingModal").innerHTML = "";
  document.getElementById("savingModal").style.opacity = "100%";
  document.getElementById("savingModal").style.visibility = "visible";
};

socket.on("usernameGot", (data) => {
  document.getElementById("playerUsername").innerHTML = data.toUpperCase();
});

socket.on("customGameCreated", (id) => {
  currentWork = id;
  document.getElementById("timeLimit").selectedIndex = "3";
  document.getElementById("privacy").selectedIndex = "0";
  document.getElementById("gameID").innerHTML = "GAME ID: " + id;
  document.cookie = "gameid=" + id;
  var paras = document.getElementsByClassName("question");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  document.getElementById("gameTitle").value = "";
  document.getElementById("setname").innerHTML = "";
  document.getElementById("addQuestionWrapper").remove();
  numQuestions = 1;
  qelem = document.createElement("div");
  qelem.setAttribute("class", "question");
  qNum = document.createElement("p");
  qNum.setAttribute("class", "questionNumber");
  qNum.setAttribute(
    "title",
    "To delete a question, leave title and all answers blank and save."
  );
  qNum.textContent = "Question " + numQuestions;
  qText = document.createElement("input");
  qText.setAttribute("autocomplete", "off");
  qText.setAttribute("maxlength", "100");
  qText.setAttribute("class", "questionText");
  qText.setAttribute("placeholder", "QUESTION TEXT");
  qText.addEventListener("input", function () {
    document.getElementById("unsaved").style =
      "visibility: visible; opacity: 100%;";
    unsaved = 1;
    document.getElementById("saveButton").disabled = false;
    document.getElementById("saveButton").innerHTML = "SAVE NOW";
  });
  answer1 = document.createElement("div");
  input1 = document.createElement("input");
  input1.setAttribute("type", "radio");
  input1.setAttribute("name", "answer" + numQuestions);
  input1.setAttribute("class", "answerCheckbox");
  input2 = document.createElement("input");
  input2.setAttribute("autocomplete", "off");
  input2.setAttribute("maxlength", "50");
  input2.setAttribute("class", "choiceText");
  input2.setAttribute("placeholder", "ANSWER CHOICE 1");
  input2.addEventListener("input", function () {
    document.getElementById("unsaved").style =
      "visibility: visible; opacity: 100%;";
    unsaved = 1;
    document.getElementById("saveButton").disabled = false;
    document.getElementById("saveButton").innerHTML = "SAVE NOW";
  });
  answer1.appendChild(input1);
  answer1.appendChild(input2);
  answer2 = document.createElement("div");
  input1 = document.createElement("input");
  input1.setAttribute("type", "radio");
  input1.setAttribute("name", "answer" + numQuestions);
  input1.setAttribute("class", "answerCheckbox");
  input2 = document.createElement("input");
  input2.setAttribute("autocomplete", "off");
  input2.setAttribute("maxlength", "50");
  input2.setAttribute("class", "choiceText");
  input2.setAttribute("placeholder", "ANSWER CHOICE 2");
  input2.addEventListener("input", function () {
    document.getElementById("unsaved").style =
      "visibility: visible; opacity: 100%;";
    unsaved = 1;
    document.getElementById("saveButton").disabled = false;
    document.getElementById("saveButton").innerHTML = "SAVE NOW";
  });
  answer2.appendChild(input1);
  answer2.appendChild(input2);
  answer3 = document.createElement("div");
  input1 = document.createElement("input");
  input1.setAttribute("type", "radio");
  input1.setAttribute("name", "answer" + numQuestions);
  input1.setAttribute("class", "answerCheckbox");
  input2 = document.createElement("input");
  input2.setAttribute("autocomplete", "off");
  input2.setAttribute("maxlength", "50");
  input2.setAttribute("class", "choiceText");
  input2.setAttribute("placeholder", "ANSWER CHOICE 3");
  input2.addEventListener("input", function () {
    document.getElementById("unsaved").style =
      "visibility: visible; opacity: 100%;";
    unsaved = 1;
    document.getElementById("saveButton").disabled = false;
    document.getElementById("saveButton").innerHTML = "SAVE NOW";
  });
  answer3.appendChild(input1);
  answer3.appendChild(input2);
  answer4 = document.createElement("div");
  input1 = document.createElement("input");
  input1.setAttribute("type", "radio");
  input1.setAttribute("name", "answer" + numQuestions);
  input1.setAttribute("class", "answerCheckbox");
  input2 = document.createElement("input");
  input2.setAttribute("autocomplete", "off");
  input2.setAttribute("maxlength", "50");
  input2.setAttribute("class", "choiceText");
  input2.setAttribute("placeholder", "ANSWER CHOICE 4");
  input2.addEventListener("input", function () {
    document.getElementById("unsaved").style =
      "visibility: visible; opacity: 100%;";
    unsaved = 1;
    document.getElementById("saveButton").disabled = false;
    document.getElementById("saveButton").innerHTML = "SAVE NOW";
  });
  answer4.appendChild(input1);
  answer4.appendChild(input2);
  qelem.appendChild(qNum);
  qelem.appendChild(qText);
  qelem.appendChild(answer1);
  qelem.appendChild(answer2);
  qelem.appendChild(answer3);
  qelem.appendChild(answer4);
  document.getElementById("gameCreateWrapper").appendChild(qelem);
  // recreate the button
  if (numQuestions != 49) {
    wrapper = document.createElement("div");
    wrapper.setAttribute("id", "addQuestionWrapper");
    button = document.createElement("div");
    button.setAttribute("id", "addQuestion");
    button.textContent = "+";
    button.addEventListener("click", function () {
      addquestion();
    });
    wrapper.appendChild(button);
    document.getElementById("gameCreateWrapper").appendChild(wrapper);
  }
  document.body.style = "overflow-y: visible;";
  document.getElementById("createGame").style.opacity = "0%";
  document.getElementById("createGame").style.visibility = "hidden";
  document.getElementById("yourGamesWrapper").style.opacity = "0%";
  document.getElementById("yourGamesWrapper").style.visibility = "hidden";
  document.getElementById("searchGame").style.opacity = "0%";
  document.getElementById("searchGame").style.visibility = "hidden";
  document.getElementById("yourGames").style.opacity = "0%";
  document.getElementById("yourGames").style.visibility = "hidden";
  window.scrollTo(0, 0);
  document.getElementById("getblitzbutton").visibility = "hidden";
  document.getElementById("pageinfo").innerHTML = "CREATE";
  document.getElementById("gameCreateWrapper").style.visibility = "visible";
  document.getElementById("gameCreateWrapper").style.opacity = "100%";
  document.getElementById("saveButton").style.visibility = "visible";
  document.getElementById("playButton").style.visibility = "visible";
  document.getElementById("gameID").style.visibility = "visible";
  document.getElementById("saveButton").style.opacity = "100%";
  document.getElementById("playButton").style.opacity = "100%";
  document.getElementById("gameID").style.opacity = "100%";
  document.getElementById("savingModal").style.opacity = "0%";
  document.getElementById("savingModal").style.visibility = "hidden";
  document.getElementById("getblitzbutton").style.visibility = "hidden";
  page = 3;
  saving = 0;
  document.getElementById("saveButton").disabled = true;
  document.getElementById("saveButton").innerHTML = "SAVED";

  showBack();
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

document.getElementById("logOutButton").onclick = function () {
  localStorage.removeItem("username");
  localStorage.removeItem("userToken");
  localStorage.removeItem("id");
  localStorage.removeItem("level");
  window.location.reload();
};

document.getElementById("delete-game").onclick = function delgame() {
  document.getElementById("savingModal").innerHTML = "";
  document.getElementById("savingModal").style.visibility = "visible";
  document.getElementById("savingModal").style.opacity = "100%";
  document.getElementById("deletegamepage").style.visibility = "visible";
  document.getElementById("deletegamepage").style.opacity = "100%";
};

document.getElementById("import-game").onclick = function dwgame() {
  try {
    let z = prompt(
      "Please provide the text given to you in your game download to import your game."
    );
    let game = JSON.parse(z);

    if (z != null) {
      var paras = document.getElementsByClassName("question");
      while (paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
      }
      // add new questions
      // update number of questions as well.​
      numQuestions = game.questions.length;
      document.getElementById("gameTitle").value = game.gameTitle;
      document.getElementById("setname").innerHTML = game.gameTitle;
      let loadSaveIndex = 0;
      document.getElementById("addQuestionWrapper").remove();
      game.questions.forEach((question) => {
        loadSaveIndex += 1;
        // create new question
        qelem = document.createElement("div");
        qelem.setAttribute("class", "question");
        qNum = document.createElement("p");
        qNum.setAttribute("class", "questionNumber");
        qNum.setAttribute(
          "title",
          "To delete a question, leave title and all answers blank and save."
        );
        qNum.textContent = "Question " + loadSaveIndex;
        qText = document.createElement("input");
        qText.setAttribute("autocomplete", "off");
        qText.setAttribute("maxlength", "100");
        qText.setAttribute("class", "questionText");
        qText.setAttribute("placeholder", "QUESTION TEXT");
        qText.addEventListener("input", function () {
          document.getElementById("unsaved").style =
            "visibility: visible; opacity: 100%;";
          unsaved = 1;
          document.getElementById("saveButton").disabled = false;
          document.getElementById("saveButton").innerHTML = "SAVE NOW";
        });
        qText.value = question.questionText;
        answer1 = document.createElement("div");
        input1 = document.createElement("input");
        input1.setAttribute("type", "radio");
        input1.setAttribute("name", "answer" + loadSaveIndex);
        input1.setAttribute("class", "answerCheckbox");
        if (question.correctAnswer == 1) {
          input1.checked = true;
        }
        input2 = document.createElement("input");
        input2.setAttribute("autocomplete", "off");
        input2.setAttribute("maxlength", "50");
        input2.setAttribute("class", "choiceText");
        input2.setAttribute("placeholder", "ANSWER CHOICE 1");
        input2.addEventListener("input", function () {
          document.getElementById("unsaved").style =
            "visibility: visible; opacity: 100%;";
          unsaved = 1;
          document.getElementById("saveButton").disabled = false;
          document.getElementById("saveButton").innerHTML = "SAVE NOW";
        });
        input1.addEventListener("change", function () {
          document.getElementById("unsaved").style =
            "visibility: visible; opacity: 100%;";
          unsaved = 1;
          document.getElementById("saveButton").disabled = false;
          document.getElementById("saveButton").innerHTML = "SAVE NOW";
        });
        input2.value = question.answerChoice1;
        answer1.appendChild(input1);
        answer1.appendChild(input2);
        answer2 = document.createElement("div");
        input1 = document.createElement("input");
        input1.setAttribute("type", "radio");
        input1.setAttribute("name", "answer" + loadSaveIndex);
        input1.setAttribute("class", "answerCheckbox");
        if (question.correctAnswer == 2) {
          input1.checked = true;
        }
        input2 = document.createElement("input");
        input2.setAttribute("autocomplete", "off");
        input2.setAttribute("maxlength", "50");
        input2.setAttribute("class", "choiceText");
        input2.setAttribute("placeholder", "ANSWER CHOICE 2");
        input2.addEventListener("input", function () {
          document.getElementById("unsaved").style =
            "visibility: visible; opacity: 100%;";
          unsaved = 1;
          document.getElementById("saveButton").disabled = false;
          document.getElementById("saveButton").innerHTML = "SAVE NOW";
        });
        input1.addEventListener("change", function () {
          document.getElementById("unsaved").style =
            "visibility: visible; opacity: 100%;";
          unsaved = 1;
          document.getElementById("saveButton").disabled = false;
          document.getElementById("saveButton").innerHTML = "SAVE NOW";
        });
        input2.value = question.answerChoice2;
        answer2.appendChild(input1);
        answer2.appendChild(input2);
        answer3 = document.createElement("div");
        input1 = document.createElement("input");
        input1.setAttribute("type", "radio");
        input1.setAttribute("name", "answer" + loadSaveIndex);
        input1.setAttribute("class", "answerCheckbox");
        if (question.correctAnswer == 3) {
          input1.checked = true;
        }
        input2 = document.createElement("input");
        input2.setAttribute("autocomplete", "off");
        input2.setAttribute("maxlength", "50");
        input2.setAttribute("class", "choiceText");
        input2.setAttribute("placeholder", "ANSWER CHOICE 3");
        input2.addEventListener("input", function () {
          document.getElementById("unsaved").style =
            "visibility: visible; opacity: 100%;";
          unsaved = 1;
          document.getElementById("saveButton").disabled = false;
          document.getElementById("saveButton").innerHTML = "SAVE NOW";
        });
        input1.addEventListener("change", function () {
          document.getElementById("unsaved").style =
            "visibility: visible; opacity: 100%;";
          unsaved = 1;
          document.getElementById("saveButton").disabled = false;
          document.getElementById("saveButton").innerHTML = "SAVE NOW";
        });
        input2.value = question.answerChoice3;
        answer3.appendChild(input1);
        answer3.appendChild(input2);
        answer4 = document.createElement("div");
        input1 = document.createElement("input");
        input1.setAttribute("type", "radio");
        input1.setAttribute("name", "answer" + loadSaveIndex);
        input1.setAttribute("class", "answerCheckbox");
        if (question.correctAnswer == 4) {
          input1.checked = true;
        }
        input2 = document.createElement("input");
        input2.setAttribute("autocomplete", "off");
        input2.setAttribute("maxlength", "50");
        input2.setAttribute("class", "choiceText");
        input2.setAttribute("placeholder", "ANSWER CHOICE 4");
        input2.addEventListener("input", function () {
          document.getElementById("unsaved").style =
            "visibility: visible; opacity: 100%;";
          unsaved = 1;
          document.getElementById("saveButton").disabled = false;
          document.getElementById("saveButton").innerHTML = "SAVE NOW";
        });
        input1.addEventListener("change", function () {
          document.getElementById("unsaved").style =
            "visibility: visible; opacity: 100%;";
          unsaved = 1;
          document.getElementById("saveButton").disabled = false;
          document.getElementById("saveButton").innerHTML = "SAVE NOW";
        });
        input2.value = question.answerChoice4;
        answer4.appendChild(input1);
        answer4.appendChild(input2);
        qelem.appendChild(qNum);
        qelem.appendChild(qText);
        qelem.appendChild(answer1);
        qelem.appendChild(answer2);
        qelem.appendChild(answer3);
        qelem.appendChild(answer4);
        document.getElementById("gameCreateWrapper").appendChild(qelem);
      });
      // recreate the button
      if (numQuestions < 50) {
        wrapper = document.createElement("div");
        wrapper.setAttribute("id", "addQuestionWrapper");
        button = document.createElement("div");
        button.setAttribute("id", "addQuestion");
        button.textContent = "+";
        button.addEventListener("click", function () {
          addquestion();
        });
        wrapper.appendChild(button);
        document.getElementById("gameCreateWrapper").appendChild(wrapper);
      }
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
      document.getElementById("gameSettings").style.opacity = "0%";
      document.getElementById("gameSettings").style.visibility = "hidden";
      document.getElementById("savingModal").style.opacity = "0%";
      document.getElementById("savingModal").style.visibility = "hidden";
    }
  } catch (err) {
    alert("There was an error: " + err);
  }
};

document.getElementById("download-game").onclick = function dwgame() {
  questionList = document.getElementsByClassName("question");
  console.log(questionList);
  var sendGame = {
    gameId: getCookie("gameid"),
    gameTitle: document.getElementById("gameTitle").value,
    gameAuthor: localStorage.getItem("userToken"),
    questions: [],
    isPrivate: Number.parseInt(document.getElementById("privacy").value, 10),
    timeLimit: Number.parseInt(document.getElementById("timeLimit").value, 10),
  };
  Array.from(questionList).forEach((question) => {
    console.log(question);
    // extract the information from each question by getting all inputs
    var inputindex = 0;
    var sendQuestion = { correctAnswer: 0 };
    Array.from(question.getElementsByTagName("input")).forEach((input) => {
      if (input.classList.contains("questionText")) {
        sendQuestion.questionText = input.value;
      }
      if (input.classList.contains("answerCheckbox")) {
        if (input.checked) {
          sendQuestion.correctAnswer = (inputindex + 1) / 2;
        }
      }
      if (input.classList.contains("choiceText")) {
        sendQuestion["answerChoice" + inputindex / 2] = input.value;
      }
      inputindex += 1;
    });
    console.log(sendQuestion);
    sendGame.questions.push(sendQuestion);
  });
  download(
    "Save " + document.getElementById("gameTitle").value + " Blitz Creator.txt",
    "<!-- Delete this line after reading. Copy everything below this line from start to finish and paste it in the import form. Incorrect imports may damage your game. *DO NOT SHARE THIS FILE WITH ANYONE AS IT CONTAINS ACCOUNT INFORMATION!* --> \n\n" +
      JSON.stringify(sendGame)
  );
};

document.getElementById("playerUsername").onclick = function () {
  document.getElementById("logOutButton").style =
    "opacity: 1; visibility: visible";
  document.getElementById("playerProfile").style =
    "border-radius: 12px 12px 0px 0px";
  setTimeout(() => {
    document.getElementById("logOutButton").style =
      "opacity: 0; visibility: hidden";
    document.getElementById("playerProfile").style = "border-radius: 12px";
  }, 5000);
};

// when save clicked
document.getElementById("saveButton").onclick = function savegame() {
  document.getElementById("saveButton").disabled = true;
  document.getElementById("saveButton").innerHTML = "SAVING...";
  saving = 1;
  questionList = document.getElementsByClassName("question");
  console.log(questionList);
  var sendGame = {
    gameId: getCookie("gameid"),
    gameTitle: document.getElementById("gameTitle").value,
    gameAuthor: localStorage.getItem("userToken"),
    questions: [],
    isPrivate: Number.parseInt(document.getElementById("privacy").value, 10),
    timeLimit: Number.parseInt(document.getElementById("timeLimit").value, 10),
  };

  Array.from(questionList).forEach((question) => {
    console.log(question);
    // extract the information from each question by getting all inputs
    var inputindex = 0;
    var sendQuestion = { correctAnswer: 0 };
    Array.from(question.getElementsByTagName("input")).forEach((input) => {
      if (input.classList.contains("questionText")) {
        sendQuestion.questionText = input.value;
      }
      if (input.classList.contains("answerCheckbox")) {
        if (input.checked) {
          sendQuestion.correctAnswer = (inputindex + 1) / 2;
        }
      }
      if (input.classList.contains("choiceText")) {
        sendQuestion["answerChoice" + inputindex / 2] = input.value;
      }
      inputindex += 1;
    });
    console.log(sendQuestion);
    sendGame.questions.push(sendQuestion);
  });
  console.log("FINAL GAME");
  console.log(sendGame);
  socket.emit("sendSaveGame", sendGame);
  setTimeout(function () {
    if (saving == 1) {
      alert(
        "It's taken quite a while to save your game to our database. Maybe your internet is down or the problem is on our end. You can download your questions by going to Settings and then importing them from the same place once everything works!"
      );
    }
  }, 5000);
};

socket.on("savingFailed", (info) => {
  document.getElementById("savingModal").innerHTML = info;
  setTimeout(function () {
    document.getElementById("savingModal").style.opacity = "0%";
    document.getElementById("savingModal").style.visibility = "hidden";
  }, 1000);
});

document.getElementById("gameTitle").oninput = function () {
  document.getElementById("unsaved").style =
    "visibility: visible; opacity: 100%;";
  unsaved = 1;
  document.getElementById("saveButton").disabled = false;
  document.getElementById("saveButton").innerHTML = "SAVE NOW";
};

socket.on("saveCompleted", (game) => {
  console.log("Saved! Here is the returned game");
  console.log(game);
  document.getElementById("unsaved").style = "visibility: hidden; opacity: 0;";
  unsaved = 0;
  saving = 0;
  document.getElementById("savingModal").innerHTML = "SAVED!";
  document.getElementById("saveButton").disabled = true;
  document.getElementById("saveButton").innerHTML = "SAVED";
  // delete existing questions
  var paras = document.getElementsByClassName("question");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  // add new questions
  // update number of questions as well.​
  numQuestions = game.questions.length;
  document.getElementById("gameTitle").value = game.gameTitle;
  document.getElementById("setname").innerHTML = game.gameTitle;

  let loadSaveIndex = 0;
  document.getElementById("addQuestionWrapper").remove();
  game.questions.forEach((question) => {
    loadSaveIndex += 1;
    // create new question
    qelem = document.createElement("div");
    qelem.setAttribute("class", "question");
    qNum = document.createElement("p");
    qNum.setAttribute("class", "questionNumber");
    qNum.setAttribute(
      "title",
      "To delete a question, leave title and all answers blank and save."
    );
    qNum.textContent = "Question " + loadSaveIndex;
    qText = document.createElement("input");
    qText.setAttribute("autocomplete", "off");
    qText.setAttribute("maxlength", "100");
    qText.setAttribute("class", "questionText");
    qText.setAttribute("placeholder", "QUESTION TEXT");
    qText.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    qText.value = question.questionText;
    answer1 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + loadSaveIndex);
    input1.setAttribute("class", "answerCheckbox");
    if (question.correctAnswer == 1) {
      input1.checked = true;
    }
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 1");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input2.value = question.answerChoice1;
    answer1.appendChild(input1);
    answer1.appendChild(input2);
    answer2 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + loadSaveIndex);
    input1.setAttribute("class", "answerCheckbox");
    if (question.correctAnswer == 2) {
      input1.checked = true;
    }
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 2");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input2.value = question.answerChoice2;
    answer2.appendChild(input1);
    answer2.appendChild(input2);
    answer3 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + loadSaveIndex);
    input1.setAttribute("class", "answerCheckbox");
    if (question.correctAnswer == 3) {
      input1.checked = true;
    }
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 3");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input2.value = question.answerChoice3;
    answer3.appendChild(input1);
    answer3.appendChild(input2);
    answer4 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + loadSaveIndex);
    input1.setAttribute("class", "answerCheckbox");
    if (question.correctAnswer == 4) {
      input1.checked = true;
    }
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 4");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input2.value = question.answerChoice4;
    answer4.appendChild(input1);
    answer4.appendChild(input2);
    qelem.appendChild(qNum);
    qelem.appendChild(qText);
    qelem.appendChild(answer1);
    qelem.appendChild(answer2);
    qelem.appendChild(answer3);
    qelem.appendChild(answer4);
    document.getElementById("gameCreateWrapper").appendChild(qelem);
  });
  // recreate the button
  if (numQuestions < 50) {
    wrapper = document.createElement("div");
    wrapper.setAttribute("id", "addQuestionWrapper");
    button = document.createElement("div");
    button.setAttribute("id", "addQuestion");
    button.textContent = "+";
    button.addEventListener("click", function () {
      addquestion();
    });
    wrapper.appendChild(button);
    document.getElementById("gameCreateWrapper").appendChild(wrapper);
  }
  setTimeout(function () {
    document.getElementById("savingModal").style.opacity = "0%";
    document.getElementById("savingModal").style.visibility = "hidden";
  }, 1000);
});

socket.on("fatalError", (data) => {
  console.log(data);
  localStorage.removeItem("username");
  localStorage.removeItem("userToken");
  localStorage.removeItem("id");
  localStorage.removeItem("level");
  document.getElementById("loggedOutModal").style.visibility = "visible";
  document.getElementById("loggedOutModal").style.opacity = "100%";
  document.getElementById("loggedOutPopup").style.visibility = "visible";
  document.getElementById("loggedOutPopup").style.opacity = "100%";
  document.getElementById("screenCover").style.opacity = "100%";
  document.getElementById("loggedOutPopup").style.transform =
    "translate(-50%, -50%) scale(1, 1)";
});

document.getElementById("loggedOutButton").onclick = function logout() {
  sessionStorage.setItem("dir", "create");
  window.location.href = "../../";
};

document.getElementById("backButton").onclick = function () {
  window.scrollTo(0, 0);
  document.body.style = "overflow-y: hidden;";
  if (page == 1) {
    page = 0;
    document.getElementById("backButton").style.opacity = "0%";
    document.getElementById("backButton").style.visibility = "hidden";
    document.getElementById("playGameSearchButton").style.visibility = "hidden";
    document.getElementById("searchGamesWrapper").style.opacity = "0%";
    document.getElementById("searchGamesWrapper").style.visibility = "hidden";
    document.getElementById("searchGame").style.visibility = "visible";
    document.getElementById("searchGame").style.opacity = "100%";
    document.getElementById("yourGames").style.visibility = "visible";
    document.getElementById("yourGames").style.opacity = "100%";
    document.getElementById("createGame").style.visibility = "visible";
    document.getElementById("createGame").style.opacity = "100%";
    document.getElementById("pageinfo").innerHTML = "CUSTOM GAMES";
  }
  if (page == 2) {
    page = 0;
    document.getElementById("backButton").style.opacity = "0%";
    document.getElementById("backButton").style.visibility = "hidden";
    document.getElementById("yourGamesWrapper").style.opacity = "0%";
    document.getElementById("yourGamesWrapper").style.visibility = "hidden";
    document.getElementById("searchGame").style.visibility = "visible";
    document.getElementById("searchGame").style.opacity = "100%";
    document.getElementById("yourGames").style.visibility = "visible";
    document.getElementById("yourGames").style.opacity = "100%";
    document.getElementById("createGame").style.visibility = "visible";
    document.getElementById("createGame").style.opacity = "100%";
    document.getElementById("pageinfo").innerHTML = "CUSTOM GAMES";
    var paras = document.getElementsByClassName("yourGameButton");
    while (paras[0]) {
      paras[0].parentNode.removeChild(paras[0]);
    }
  }
  if (page == 3) {
    if (
      unsaved == 0 ||
      confirm("You have unsaved changes. Want to quit anyway?") == true
    ) {
      document.getElementById("unsaved").style =
        "visibility: hidden; opacity: 0;";
      unsaved = 0;
      page = 0;
      saving = 0;
      socket.emit("getPlus", localStorage.getItem("userToken"));
      document.getElementById("backButton").style.opacity = "0%";
      document.getElementById("backButton").style.visibility = "hidden";
      document.getElementById("gameCreateWrapper").style.opacity = "0%";
      document.getElementById("gameCreateWrapper").style.visibility = "hidden";
      document.getElementById("searchGame").style.visibility = "visible";
      document.getElementById("searchGame").style.opacity = "100%";
      document.getElementById("yourGames").style.visibility = "visible";
      document.getElementById("yourGames").style.opacity = "100%";
      document.getElementById("createGame").style.visibility = "visible";
      document.getElementById("createGame").style.opacity = "100%";
      document.getElementById("pageinfo").innerHTML = "CUSTOM GAMES";
      document.getElementById("saveButton").style.opacity = "0%";
      document.getElementById("playButton").style.opacity = "0%";
      document.getElementById("gameID").style.opacity = "0%";
      document.getElementById("saveButton").style.visibility = "hidden";
      document.getElementById("playButton").style.visibility = "hidden";
      document.getElementById("gameID").style.visibility = "hidden";
      document.cookie =
        "gameid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/public/champion/custom/create;";
      var paras = document.getElementsByClassName("question");
      while (paras[0]) {
        paras[0].parentNode.removeChild(paras[0]);
      }
    }
  }
};

document.getElementById("deleteButton").onclick = function () {
  socket.emit("deleteGame", {
    delete: currentWork,
    token: localStorage.getItem("userToken"),
    password: document.getElementById("deletePW").value,
  });
};
document.getElementById("closeSettings").onclick = function () {
  document.getElementById("gameSettings").style.opacity = "0%";
  document.getElementById("gameSettings").style.visibility = "hidden";
  document.getElementById("savingModal").style.opacity = "0%";
  document.getElementById("savingModal").style.visibility = "hidden";
};

document.getElementById("closeDelete").onclick = function () {
  document.getElementById("deletePW").value = "";
  document.getElementById("deletegamepage").style.opacity = "0%";
  document.getElementById("deletegamepage").style.visibility = "hidden";
};

document.getElementById("gameSettingsButton").onclick = function () {
  if (page != 3) {
    document.getElementById("savingModal").innerHTML =
      "No available settings for this page.";
    document.getElementById("savingModal").style.visibility = "visible";
    document.getElementById("savingModal").style.opacity = "100%";
    setTimeout(function () {
      document.getElementById("savingModal").style.opacity = "0%";
      document.getElementById("savingModal").style.visibility = "hidden";
    }, 1000);
  } else {
    // open settings manual
    document.getElementById("savingModal").innerHTML = "";
    document.getElementById("savingModal").style.visibility = "visible";
    document.getElementById("savingModal").style.opacity = "100%";
    document.getElementById("gameSettings").style.visibility = "visible";
    document.getElementById("gameSettings").style.opacity = "100%";
  }
};

document.getElementById("searchGame").onclick = function yourgames() {
  document.getElementById("createGame").style.opacity = "0%";
  document.getElementById("createGame").style.visibility = "hidden";
  document.getElementById("searchGame").style.opacity = "0%";
  document.getElementById("searchGame").style.visibility = "hidden";
  document.getElementById("yourGames").style.opacity = "0%";
  document.getElementById("yourGames").style.visibility = "hidden";
  document.getElementById("pageinfo").innerHTML = "SEARCH GAMES";
  document.getElementById("searchGamesWrapper").style.visibility = "visible";
  document.getElementById("searchGamesWrapper").style.opacity = "100%";
  page = 1;
  showBack();
};

document.getElementById("yourGames").onclick = function yourgames() {
  var paras = document.getElementsByClassName("yourGameButton");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  document.getElementById("createGame").style.opacity = "0%";
  document.getElementById("createGame").style.visibility = "hidden";
  document.getElementById("searchGame").style.opacity = "0%";
  document.getElementById("searchGame").style.visibility = "hidden";
  document.getElementById("yourGames").style.opacity = "0%";
  document.getElementById("yourGames").style.visibility = "hidden";
  document.getElementById("pageinfo").innerHTML = "YOUR GAMES";
  document.getElementById("yourGamesWrapper").style.visibility = "visible";
  document.getElementById("yourGamesWrapper").style.opacity = "100%";
  document.getElementById("savingModal").innerHTML =
    "RETRIEVING LIST OF GAMES...";
  document.getElementById("savingModal").style.visibility = "visible";
  document.getElementById("savingModal").style.opacity = "100%";
  socket.emit("retrieveGames", localStorage.getItem("userToken"));
  page = 2;
  showBack();
};

socket.on("alert", (alert) => {
  document.getElementById("savingModal").innerHTML = alert;
  document.getElementById("savingModal").style.visibility = "visible";
  document.getElementById("savingModal").style.opacity = "100%";
  setTimeout(function () {
    document.getElementById("savingModal").style.opacity = "0%";
    document.getElementById("savingModal").style.visibility = "hidden";
  }, 2000);
});

socket.on("gameLoaded", (object) => {
  document.getElementById("timeLimit").value = object.timeLimit;
  document.getElementById("privacy").selectedIndex = object.isPrivate;
  console.log(object);
  try {
    document.getElementById("addQuestionWrapper").remove();
  } catch {}
  // create new question, and re-set the variable
  document.getElementById("gameID").innerHTML = "GAME ID: " + object.gameId;
  document.cookie = "gameid=" + object.gameId;
  document.getElementById("gameTitle").value = object.gameTitle;
  document.getElementById("setname").innerHTML = object.gameTitle;
  var paras = document.getElementsByClassName("question");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  qindex = 1;
  numQuestions = object.questions.length;
  object.questions.forEach((question) => {
    qelem = document.createElement("div");
    qelem.setAttribute("class", "question");
    qNum = document.createElement("p");
    qNum.setAttribute("class", "questionNumber");
    qNum.setAttribute(
      "title",
      "To delete a question, leave title and all answers blank and save."
    );
    qNum.textContent = "Question " + qindex;
    qText = document.createElement("input");
    qText.setAttribute("autocomplete", "off");
    qText.setAttribute("maxlength", "100");
    qText.setAttribute("class", "questionText");
    qText.setAttribute("placeholder", "QUESTION TEXT");
    qText.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    qText.value = question.questionText;
    answer1 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + qindex);
    input1.setAttribute("class", "answerCheckbox");
    if (question.correctAnswer == 1) {
      input1.checked = true;
    }
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 1");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input2.value = question.answerChoice1;
    answer1.appendChild(input1);
    answer1.appendChild(input2);
    answer2 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + qindex);
    input1.setAttribute("class", "answerCheckbox");
    if (question.correctAnswer == 2) {
      input1.checked = true;
    }
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 2");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input2.value = question.answerChoice2;
    answer2.appendChild(input1);
    answer2.appendChild(input2);
    answer3 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + qindex);
    input1.setAttribute("class", "answerCheckbox");
    if (question.correctAnswer == 3) {
      input1.checked = true;
    }
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 3");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input2.value = question.answerChoice3;
    answer3.appendChild(input1);
    answer3.appendChild(input2);
    answer4 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + qindex);
    input1.setAttribute("class", "answerCheckbox");
    if (question.correctAnswer == 4) {
      input1.checked = true;
    }
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 4");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input2.value = question.answerChoice4;
    answer4.appendChild(input1);
    answer4.appendChild(input2);
    qelem.appendChild(qNum);
    qelem.appendChild(qText);
    qelem.appendChild(answer1);
    qelem.appendChild(answer2);
    qelem.appendChild(answer3);
    qelem.appendChild(answer4);
    document.getElementById("gameCreateWrapper").appendChild(qelem);
    qindex += 1;
  });
  if (numQuestions < 50) {
    wrapper = document.createElement("div");
    wrapper.setAttribute("id", "addQuestionWrapper");
    button = document.createElement("div");
    button.setAttribute("id", "addQuestion");
    button.textContent = "+";
    button.addEventListener("click", function () {
      addquestion();
    });
    wrapper.appendChild(button);
    document.getElementById("gameCreateWrapper").appendChild(wrapper);
  }
  document.getElementById("savingModal").style.opacity = "0%";
  document.getElementById("savingModal").style.visibility = "hidden";
  document.getElementById("getblitzbutton").style.visibility = "hidden";
  document.getElementById("saveButton").disabled = true;
  page = 3;
  saving = 0;

  document.getElementById("saveButton").innerHTML = "SAVED";

  showBack();
});

socket.on("deleteFail", function () {
  document.getElementById("deletePW").value = "";
  document.getElementById("wrongpwdel").style.opacity = "100%";
  setTimeout(function () {
    document.getElementById("wrongpwdel").style.opacity = "0%";
  }, 1500);
});

socket.on("deleteSuccess", function () {
  document.getElementById("deletePW").value = "";
  document.getElementById("deletegamepage").style = "";
  document.getElementById("gameSettings").style = "";
  currentWork = 0;
  page = 0;
  document.body.style = "overflow-y: hidden;";
  window.scrollTo(0, 0);
  document.getElementById("backButton").style.opacity = "0%";
  document.getElementById("backButton").style.visibility = "hidden";
  document.getElementById("gameCreateWrapper").style.opacity = "0%";
  document.getElementById("gameCreateWrapper").style.visibility = "hidden";
  document.getElementById("searchGame").style.visibility = "visible";
  document.getElementById("searchGame").style.opacity = "100%";
  document.getElementById("yourGames").style.visibility = "visible";
  document.getElementById("yourGames").style.opacity = "100%";
  document.getElementById("createGame").style.visibility = "visible";
  document.getElementById("createGame").style.opacity = "100%";
  document.getElementById("pageinfo").innerHTML = "CUSTOM GAMES";
  document.getElementById("saveButton").style.opacity = "0%";
  document.getElementById("playButton").style.opacity = "0%";
  document.getElementById("gameID").style.opacity = "0%";
  document.getElementById("saveButton").style.visibility = "hidden";
  document.getElementById("playButton").style.visibility = "hidden";
  document.getElementById("gameID").style.visibility = "hidden";
  document.cookie =
    "gameid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/public/champion/custom/create;";
  var paras = document.getElementsByClassName("question");
  while (paras[0]) {
    paras[0].parentNode.removeChild(paras[0]);
  }
  document.getElementById("savingModal").style.opacity = "0%";
  document.getElementById("savingModal").style.visibility = "hidden";
});

socket.on("gamesRetrieved", (data) => {
  document.getElementById("savingModal").style.opacity = "0%";
  document.getElementById("savingModal").style.visibility = "hidden";
  document.body.style = "overflow-y: visible;";
  console.log("Game list");
  console.log(data);
  data.forEach((game) => {
    gelem = document.createElement("div");
    gelem.setAttribute("class", "yourGameButton");
    gTitle = document.createElement("div");
    gTitle.textContent = game.gameTitle;
    gqNum = document.createElement("h1");
    gqNum.textContent = "Questions: " + game.questionsLength;
    gID = document.createElement("p");
    gID.textContent = "ID: " + game.gameID;
    dID = document.createElement("button");
    dID.setAttribute("class", "your-play-button");
    dID.textContent = "Play Live";
    console.log(game.questionsLength);
    if (game.questionsLength >= 6) {
      dID.addEventListener("click", function () {
        attemptHost(
          game.gameID,
          localStorage.getItem("userToken"),
          game.gameTitle
        );
      });
    } else {
      console.log("!!");
      dID.disabled = true;
      dID.textContent = "Need More Questions";
      console.log(dID);
    }
    console.log(dID);
    bID = document.createElement("button");
    bID.setAttribute("class", "your-play-button");
    bID.textContent = "Edit";
    bID.addEventListener("click", function () {
      openGameEditor(game.gameID);
      currentWork = game.gameID;
    });
    gelem.appendChild(gTitle);
    gelem.appendChild(gqNum);
    gelem.appendChild(gID);
    gelem.appendChild(dID);
    gelem.appendChild(bID);
    document.getElementById("yourGamesWrapper").appendChild(gelem);
  });
  gelem = document.createElement("div");
  gelem.setAttribute("class", "yourGameButton");
  gelem.setAttribute(
    "style",
    'background: linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url("../../crystal2.png")'
  );
  gTitle = document.createElement("div");
  gTitle.textContent = "​";
  gqNum = document.createElement("h1");
  gqNum.textContent = "Create New Game";
  gID = document.createElement("p");
  gID.textContent = "​";
  dID = document.createElement("button");
  dID.setAttribute("class", "your-play-button");
  dID.textContent = "Create Game";
  dID.addEventListener("click", function () {
    socket.emit("createCustomGame", localStorage.getItem("userToken"));
    numQuestions = 1;
  });
  dID.setAttribute("style", "background: rgba(255, 255, 255, 0.25);");
  bID = document.createElement("button");
  bID.setAttribute("class", "your-play-button");
  bID.setAttribute("style", "opacity:0;visibility:hidden");
  bID.textContent = "Edit";
  gelem.appendChild(gTitle);
  gelem.appendChild(gqNum);
  gelem.appendChild(gID);
  gelem.appendChild(dID);
  gelem.appendChild(bID);
  document.getElementById("yourGamesWrapper").appendChild(gelem);
});

function showBack() {
  document.getElementById("backButton").style.visibility = "visible";
  document.getElementById("backButton").style.opacity = "100%";
}

function openGameEditor(id) {
  document.getElementById("getblitzbutton").style.visibility = "hidden";
  page = 3;
  saving = 0;

  document.getElementById("saveButton").innerHTML = "SAVED";
  document.getElementById("saveButton").disabled = true;
  showBack();
  console.log("Function was triggered, ID of game is " + id);
  window.scrollTo(0, 0);
  document.getElementById("getblitzbutton").visibility = "hidden";
  document.getElementById("pageinfo").innerHTML = "CREATE";
  document.getElementById("yourGamesWrapper").style.opacity = "0%";
  document.getElementById("yourGamesWrapper").style.visibility = "hidden";
  document.getElementById("gameCreateWrapper").style.visibility = "visible";
  document.getElementById("gameCreateWrapper").style.opacity = "100%";
  document.getElementById("saveButton").style.visibility = "visible";
  document.getElementById("playButton").style.visibility = "visible";
  document.getElementById("gameID").style.visibility = "visible";
  document.getElementById("saveButton").style.opacity = "100%";
  document.getElementById("playButton").style.opacity = "100%";
  document.getElementById("gameID").style.opacity = "100%";
  document.cookie = "gameid=" + id;
  document.getElementById("savingModal").innerHTML = "RETRIEVING GAME...";
  document.getElementById("savingModal").style.visibility = "visible";
  document.getElementById("savingModal").style.opacity = "100%";
  // set number of question variable as well.
  socket.emit("loadGame", {
    token: localStorage.getItem("userToken"),
    gameid: id,
  });
}

document.getElementById("createGame").onclick = function creategame() {
  document.getElementById("savingModal").innerHTML = "CREATING...";
  document.getElementById("savingModal").style.visibility = "visible";
  document.getElementById("savingModal").style.opacity = "100%";
  socket.emit("createCustomGame", localStorage.getItem("userToken"));
  numQuestions = 1;
};

document.getElementById("addQuestion").onclick = function () {
  addquestion();
};

function addquestion() {
  if (numQuestions < 50) {
    document.getElementById("unsaved").style =
      "visibility: visible; opacity: 100%;";
    unsaved = 1;
    document.getElementById("saveButton").disabled = false;
    document.getElementById("saveButton").innerHTML = "SAVE NOW";
    // delete the button
    document.getElementById("addQuestionWrapper").remove();
    // create new question
    qelem = document.createElement("div");
    qelem.setAttribute("class", "question");
    qNum = document.createElement("p");
    qNum.setAttribute("class", "questionNumber");
    qNum.setAttribute(
      "title",
      "To delete a question, leave title and all answers blank and save."
    );
    qNum.textContent = "Question " + (numQuestions + 1);
    qText = document.createElement("input");
    qText.setAttribute("autocomplete", "off");
    qText.setAttribute("maxlength", "100");
    qText.setAttribute("class", "questionText");
    qText.setAttribute("placeholder", "QUESTION TEXT");
    qText.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    answer1 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + (numQuestions + 1));
    input1.setAttribute("class", "answerCheckbox");
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 1");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    answer1.appendChild(input1);
    answer1.appendChild(input2);
    answer2 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + (numQuestions + 1));
    input1.setAttribute("class", "answerCheckbox");
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 2");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    answer2.appendChild(input1);
    answer2.appendChild(input2);
    answer3 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + (numQuestions + 1));
    input1.setAttribute("class", "answerCheckbox");
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 3");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    answer3.appendChild(input1);
    answer3.appendChild(input2);
    answer4 = document.createElement("div");
    input1 = document.createElement("input");
    input1.setAttribute("type", "radio");
    input1.setAttribute("name", "answer" + (numQuestions + 1));
    input1.setAttribute("class", "answerCheckbox");
    input2 = document.createElement("input");
    input2.setAttribute("autocomplete", "off");
    input2.setAttribute("maxlength", "50");
    input2.setAttribute("class", "choiceText");
    input2.setAttribute("placeholder", "ANSWER CHOICE 4");
    input2.addEventListener("input", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    input1.addEventListener("change", function () {
      document.getElementById("unsaved").style =
        "visibility: visible; opacity: 100%;";
      unsaved = 1;
      document.getElementById("saveButton").disabled = false;
      document.getElementById("saveButton").innerHTML = "SAVE NOW";
    });
    answer4.appendChild(input1);
    answer4.appendChild(input2);
    qelem.appendChild(qNum);
    qelem.appendChild(qText);
    qelem.appendChild(answer1);
    qelem.appendChild(answer2);
    qelem.appendChild(answer3);
    qelem.appendChild(answer4);
    document.getElementById("gameCreateWrapper").appendChild(qelem);
    // recreate the button
    if (numQuestions != 49) {
      wrapper = document.createElement("div");
      wrapper.setAttribute("id", "addQuestionWrapper");
      button = document.createElement("div");
      button.setAttribute("id", "addQuestion");
      button.textContent = "+";
      button.addEventListener("click", function () {
        addquestion();
      });
      wrapper.appendChild(button);
      document.getElementById("gameCreateWrapper").appendChild(wrapper);
    }
    numQuestions += 1;
  }
}

document
  .getElementById("gameSearchBar")
  .addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      socket.emit("searchGame", document.getElementById("gameSearchBar").value);
    }
  });

socket.on("searchGameDone", (obj) => {
  document.getElementById("searchedGameTitle").innerHTML = obj["gameTitle"];
  if (
    obj["creatorUsername"] != "" &&
    obj["creatorUsername"] !=
      "The creator of this game has made their game private."
  ) {
    document.getElementById("searchedGameAuthor").innerHTML =
      "by " + obj["creatorUsername"];
  } else {
    if (
      obj["creatorUsername"] ==
      "The creator of this game has made their game private."
    ) {
      document.getElementById("searchedGameAuthor").innerHTML =
        "The creator of this game has made their game private.";
      document.getElementById("playGameSearchButton").style.visibility =
        "hidden";
      document.getElementById("playGameSearchButton").style.position = "fixed";
    } else {
      document.getElementById("searchedGameAuthor").innerHTML = "";
      document.getElementById("playGameSearchButton").style.visibility =
        "hidden";
      document.getElementById("playGameSearchButton").style.position = "fixed";
    }
  }
  if (
    obj["questionsLength"] !=
      "We couldn't find a game with the specified ID." &&
    obj["questionsLength"] !=
      'If you are the creator of this game, you can play it through "Your Games."'
  ) {
    document.getElementById("searchedGameQuestions").innerHTML =
      "Questions: " + obj["questionsLength"];
    if (obj["questionsLength"] >= 6) {
      document.getElementById("playGameSearchButton").style.visibility =
        "visible";
      document.getElementById("playGameSearchButton").style.position =
        "relative";
    } else {
      document.getElementById("playGameSearchButton").style.visibility =
        "hidden";
      document.getElementById("playGameSearchButton").style.position = "fixed";
    }
  } else {
    document.getElementById("searchedGameQuestions").innerHTML =
      obj["questionsLength"];
  }
  searchedId = obj["gameId"];
});

document.getElementById("playButton").onclick = function () {
  if (numQuestions >= 6) {
    attemptHost(
      getCookie("gameid"),
      localStorage.getItem("userToken"),
      document.getElementById("gameTitle").value
    );
  } else {
    sendAlert("ERROR: GAMES REQUIRE 6+ QUESTIONS TO HOST LIVE");
  }
};

document.getElementById("playGameSearchButton").onclick = function () {
  attemptHost(
    searchedId,
    localStorage.getItem("userToken"),
    document.getElementById("searchedGameTitle").innerHTML
  );
};

function attemptHost(id, token, setname) {
  localStorage.setItem(
    "hostInformation",
    JSON.stringify({
      id: id,
      token: token,
      setname: setname,
    })
  );
  window.open("../host", "_blank");
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

window.onload = function () {
  setTimeout(function () {
    window.scrollTo(0, 0);
  }, 100);
};
