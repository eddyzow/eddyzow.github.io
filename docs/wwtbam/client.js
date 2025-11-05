const socket = io(window.SOCKET_URL || "https://eddyzow.herokuapp.com/"); // Socket
var stage = 0;
var questionState = 0;
var qnum = 0;
var gamenum = 0;
var finalAnswer = 0;
var fiftyfifty = 1;
var audience = 1;
var audienceprepared = 0;
var audiencing = 0;
var elimmed = 0;
var plusone = 1;
var ataing = 0;
var atas = [];
var atasanswers = { 1: 0, 2: 0, 3: 0, 4: 0 };
var answers = [
  [4, 3, 2, 3, 1, 4, 3, 2, 3, 4, 1, 2, 3, 1],
  [1, 3, 3, 4, 2, 2, 2, 4, 3, 2, 4, 1, 3, 1],
  [1, 4, 1, 2, 1, 4],
];
var monies = [
  0, 500, 1000, 2000, 3000, 5000, 7000, 10000, 20000, 30000, 50000, 100000,
  250000, 500000, 1000000,
];

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function createATAScoreboard() {
  let sumValues =
    atasanswers[1] + atasanswers[2] + atasanswers[3] + atasanswers[4];
  document.getElementById("ata-scoreboard").style.top = "0vh";
  document.getElementById("bara").innerHTML =
    100 * (atasanswers[1] / sumValues).toFixed(2) + "%";
  document.getElementById("barb").innerHTML =
    100 * (atasanswers[2] / sumValues).toFixed(2) + "%";
  document.getElementById("barc").innerHTML =
    100 * (atasanswers[3] / sumValues).toFixed(2) + "%";
  document.getElementById("bard").innerHTML =
    100 * (atasanswers[4] / sumValues).toFixed(2) + "%";
  setTimeout(function () {
    document.getElementById("bara").style.height =
      90 * (atasanswers[1] / sumValues).toFixed(2) + "%";
    document.getElementById("barb").style.height =
      90 * (atasanswers[2] / sumValues).toFixed(2) + "%";
    document.getElementById("barc").style.height =
      90 * (atasanswers[3] / sumValues).toFixed(2) + "%";
    document.getElementById("bard").style.height =
      90 * (atasanswers[4] / sumValues).toFixed(2) + "%";
  }, 800);
}

function getRandom(arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len);
  if (n > len)
    throw new RangeError("getRandom: more elements taken than available");
  while (n--) {
    var x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
}

var questions = [
  [
    {
      title: "Traditionally, what are passed out on Easter to young children?",
      a1: "Raw chickens",
      a2: "24 karat gold bars",
      a3: "Brussels sprouts",
      a4: "Plastic eggs",
    },
    {
      title: "Which of these sea creatures is tentacled?",
      a1: "Hermit crab",
      a2: "Whale",
      a3: "Squid",
      a4: "Porpoise",
    },
    {
      title: "Rolex is a company that sells expensive whats?",
      a1: "Phones",
      a2: "Watches",
      a3: "Coats",
      a4: "Shoes",
    },
    {
      title: "The game of Mahjong originated in which country?",
      a1: "Russia",
      a2: "England",
      a3: "China",
      a4: "Japan",
    },
    {
      title:
        'What word can be put in front of the words "track", "way", and "horse" to make three other words?',
      a1: "Race",
      a2: "Sound",
      a3: "Road",
      a4: "Cross",
    },
    {
      title:
        "A vending machine has accepted 85,260 quarters over its lifetime. How many dollars is that?",
      a1: "$21,240",
      a2: "$20,915",
      a3: "$21,715",
      a4: "$21,315",
    },
    {
      title:
        "Which of these cities only gets about 4 hours of sunlight daily in their winter?",
      a1: "New York City, USA",
      a2: "Sydney, Australia",
      a3: "Reykjavik, Iceland",
      a4: "Beijing, China",
    },
    {
      title:
        "Though you probably shouldn't be handling it in the first place, the EPA notes that two tablespoons of what heavy liquid weigh about a pound?",
      a1: "Hydrochloric acid",
      a2: "Mercury",
      a3: "Kerosene",
      a4: "Motor oil",
    },
    {
      title: "How many faces does a dodecahedron have?",
      a1: "10",
      a2: "11",
      a3: "12",
      a4: "14",
    },
    {
      title:
        "If you have 5 different cones and 10 different flavors, how many distinct ice cream cones with 2 DIFFERENT-FLAVORED scoops can you make?",
      a1: "45",
      a2: "500",
      a3: "1,000",
      a4: "450",
    },
    {
      title: "Which country has a flag featuring a large red dragon?",
      a1: "Wales",
      a2: "China",
      a3: "Japan",
      a4: "Canada",
    },
    {
      title:
        "Which of these is a year in which the New Year's Eve ball in New York was not lowered?",
      a1: "2019",
      a2: "1943",
      a3: "1917",
      a4: "1992",
    },
    {
      title:
        "Argentina is larger than Belgium. Belgium has more people than Canada. Canada has more islands than the Philippines. How many statements are true?",
      a1: "0",
      a2: "1",
      a3: "2",
      a4: "3",
    },
    {
      title:
        "Who currently appears on the denomination of money mentioned in the Seventh Amendment?",
      a1: "Andrew Jackson",
      a2: "George Washington",
      a3: "Benjamin Franklin",
      a4: "Abraham Lincoln",
    },
  ],
  [
    {
      title:
        "Saint Nicholas, also known as Santa, is celebrated on which day of the year?",
      a1: "December 25th",
      a2: "July 4th",
      a3: "February 14th",
      a4: "April 1st",
    },
    {
      title: "Which of these stars is closest to the Earth?",
      a1: "Sirius",
      a2: "Alpha Centauri",
      a3: "The Sun",
      a4: "Polaris",
    },
    {
      title: "How many nouns are in this question?",
      a1: "0",
      a2: "1",
      a3: "2",
      a4: "3",
    },
    {
      title:
        "In many Nintendo games, Yoshi has the ability to grab items with his what?",
      a1: "Eyes",
      a2: "Sidekick named Mario",
      a3: "Coin",
      a4: "Tongue",
    },
    {
      title: "Which of these things do NOT usually come in a group of three?",
      a1: "Little Pigs",
      a2: "Corners",
      a3: "Blind Mice",
      a4: "Bears (and Goldilocks)",
    },
    {
      title: "Which word can be a noun AND a past-tense verb?",
      a1: "Went",
      a2: "Rose",
      a3: "Back",
      a4: "Coconut",
    },
    {
      title: "What music note is one octave above A?",
      a1: "B",
      a2: "A",
      a3: "G",
      a4: "C",
    },
    {
      title:
        "How many unique positions can the original 3x3 Rubik's Cube be twisted into?",
      a1: "Less than 20",
      a2: "20 - 999",
      a3: "1,000 - 2,000",
      a4: "More than 2,000",
    },
    {
      title:
        "The first person to see bacteria is also credited with greatly advancing what?",
      a1: "Medicine",
      a2: "Telescope",
      a3: "Microscope",
      a4: "Electricity",
    },
    {
      title: "What does the 500 in Indy 500 stand for?",
      a1: "Laps",
      a2: "Miles",
      a3: "Turns",
      a4: "Kilometers",
    },
    {
      title:
        "By definition, a person with “tall poppy syndrome” dislikes what?",
      a1: "Heights",
      a2: "Poppies",
      a3: "Tall people",
      a4: "Successful people",
    },
    {
      title:
        "The Twitter logo was named for a longtime player on which NBA basketball team?",
      a1: "Boston Celtics",
      a2: "Cleveland Cavaliers",
      a3: "Philadelphia 76ers",
      a4: "Los Angeles Lakers",
    },
    {
      title:
        "What is the lowest value of US paper money with NO portrait of a US president?",
      a1: "$2",
      a2: "$5",
      a3: "$10",
      a4: "$20",
    },
    {
      title:
        "Which of these is a bonus item that appears in the original arcade Pac-Man?",
      a1: "Bell",
      a2: "Lemon",
      a3: "Number 7",
      a4: "Coin",
    },
  ],
  [
    {
      title: "Which of these is an Asian country?",
      a1: "Japan",
      a2: "Iceland",
      a3: "Australia",
      a4: "United States",
    },
    {
      title:
        "What is NOT part of environmentalism’s classic “Three R’s” slogan?",
      a1: "Reduce",
      a2: "Reuse",
      a3: "Recycle",
      a4: "Repeat",
    },
    {
      title: "Which of these is described as one of America’s Gulf States?",
      a1: "Florida",
      a2: "Georgia",
      a3: "Washington",
      a4: "Wisconsin",
    },
    {
      title:
        "In blackjack, what’s the best draw when holding a king and a two?",
      a1: "A seven",
      a2: "A nine",
      a3: "A jack",
      a4: "An eight",
    },
    {
      title: "Which of these planets has the FEWEST moons?",
      a1: "Venus",
      a2: "Mars",
      a3: "Earth",
      a4: "Jupiter",
    },
    {
      title: "Which of these numbers is prime?",
      a1: "2019",
      a2: "2020",
      a3: "2021",
      a4: "2027",
    },
  ],
];
Howler.volume(0.3);

// questionStates:
// 0) Not Open
// 1) Only question
// 2) Full question has appeared.
// run animation to make question shine

var maintheme = new Howl({
  src: ["maintheme.mp3"],
  loop: true,
  rate: 1,
  volume: 0.3,
});

var final = new Howl({
  src: ["final.wav"],
  rate: 1,
});

var bg = new Howl({
  src: ["q15bg.mp3"],
  loop: true,
  rate: 1,
  volume: 1,
});

var audienceprepare = new Howl({
  src: ["audienceprepare.mp3"],
  loop: true,
  rate: 1,
  volume: 1,
});

var ata = new Howl({
  src: ["ata.mp3"],
  rate: 1,
  volume: 1,
  loop: 1,
});

var ataresult = new Howl({
  src: ["ataresult.mp3"],
  rate: 1,
  volume: 1,
});

function flare(flare) {
  if (flare == 1) {
    let flare = document.createElement("flare");
    flare.setAttribute("class", "flare");
    flare.setAttribute("style", "bottom: -1.6vw");
    document.getElementById("questions-screen").appendChild(flare);
  } else if (flare == 2) {
    let flare = document.createElement("flare");
    flare.setAttribute("class", "flare");
    flare.setAttribute("style", "bottom: -1.6vw; left: 39vw");
    document.getElementById("questions-screen").appendChild(flare);
  } else if (flare == 3) {
    let flare = document.createElement("flare");
    flare.setAttribute("class", "flare");
    flare.setAttribute("style", "bottom: -6.5vw; left: 12.2vw");
    document.getElementById("questions-screen").appendChild(flare);
  } else if (flare == 4) {
    let flare = document.createElement("flare");
    flare.setAttribute("class", "flare");
    flare.setAttribute("style", "bottom: -6.5vw; left: 39vw");
    document.getElementById("questions-screen").appendChild(flare);
  }
}

function rightflare(flare) {
  if (flare == 1) {
    let flare = document.createElement("flare");
    flare.setAttribute("class", "flare");
    flare.setAttribute("style", "bottom: -1.6vw");
    document.getElementById("questions-screen").appendChild(flare);
    setTimeout(function () {
      let flare = document.createElement("flare");
      flare.setAttribute("class", "flare");
      flare.setAttribute("style", "bottom: -1.6vw; left: 17.2vw");
      document.getElementById("questions-screen").appendChild(flare);
      setTimeout(function () {
        let flare = document.createElement("flare");
        flare.setAttribute("class", "flare");
        flare.setAttribute("style", "bottom: -1.6vw; left:22.2vw");
        document.getElementById("questions-screen").appendChild(flare);
      }, 100);
      setTimeout(function () {
        let flare = document.createElement("flare");
        flare.setAttribute("class", "flare");
        flare.setAttribute("style", "bottom: -1.6vw; left: 27.2vw");
        document.getElementById("questions-screen").appendChild(flare);
      }, 100);
      setTimeout(function () {
        let flare = document.createElement("flare");
        flare.setAttribute("class", "flare");
        flare.setAttribute("style", "bottom: -1.6vw; left: 32.2vw");
        document.getElementById("questions-screen").appendChild(flare);
      }, 100);
    }, 100);
  } else if (flare == 2) {
    let flare = document.createElement("flare");
    flare.setAttribute("class", "flare");
    flare.setAttribute("style", "bottom: -1.6vw; left: 39vw");
    document.getElementById("questions-screen").appendChild(flare);
    setTimeout(function () {
      let flare = document.createElement("flare");
      flare.setAttribute("class", "flare");
      flare.setAttribute("style", "bottom: -1.6vw; left: 44vw");
      document.getElementById("questions-screen").appendChild(flare);
      setTimeout(function () {
        let flare = document.createElement("flare");
        flare.setAttribute("class", "flare");
        flare.setAttribute("style", "bottom: -1.6vw; left: 49vw");
        document.getElementById("questions-screen").appendChild(flare);
      }, 100);
      setTimeout(function () {
        let flare = document.createElement("flare");
        flare.setAttribute("class", "flare");
        flare.setAttribute("style", "bottom: -1.6vw; left: 54vw");
        document.getElementById("questions-screen").appendChild(flare);
      }, 100);
      setTimeout(function () {
        let flare = document.createElement("flare");
        flare.setAttribute("class", "flare");
        flare.setAttribute("style", "bottom: -1.6vw; left: 59vw");
        document.getElementById("questions-screen").appendChild(flare);
      }, 100);
    }, 100);
  } else if (flare == 3) {
    let flare = document.createElement("flare");
    flare.setAttribute("class", "flare");
    flare.setAttribute("style", "bottom: -6.5vw; left: 12.2vw");
    document.getElementById("questions-screen").appendChild(flare);
    setTimeout(function () {
      let flare = document.createElement("flare");
      flare.setAttribute("class", "flare");
      flare.setAttribute("style", "bottom: -6.5vw; left: 17.2vw");
      document.getElementById("questions-screen").appendChild(flare);
      setTimeout(function () {
        let flare = document.createElement("flare");
        flare.setAttribute("class", "flare");
        flare.setAttribute("style", "bottom: -6.5vw; left: 22.2vw");
        document.getElementById("questions-screen").appendChild(flare);
        setTimeout(function () {
          let flare = document.createElement("flare");
          flare.setAttribute("class", "flare");
          flare.setAttribute("style", "bottom: -6.5vw; left: 27.2vw");
          document.getElementById("questions-screen").appendChild(flare);
          setTimeout(function () {
            let flare = document.createElement("flare");
            flare.setAttribute("class", "flare");
            flare.setAttribute("style", "bottom: -6.5vw; left: 32.2vw");
            document.getElementById("questions-screen").appendChild(flare);
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  } else if (flare == 4) {
    let flare = document.createElement("flare");
    flare.setAttribute("class", "flare");
    flare.setAttribute("style", "bottom: -6.5vw; left: 39vw");
    document.getElementById("questions-screen").appendChild(flare);
    setTimeout(function () {
      let flare = document.createElement("flare");
      flare.setAttribute("class", "flare");
      flare.setAttribute("style", "bottom: -6.5vw; left: 44vw");
      document.getElementById("questions-screen").appendChild(flare);
      setTimeout(function () {
        let flare = document.createElement("flare");
        flare.setAttribute("class", "flare");
        flare.setAttribute("style", "bottom: -6.5vw; left: 49vw");
        document.getElementById("questions-screen").appendChild(flare);
        setTimeout(function () {
          let flare = document.createElement("flare");
          flare.setAttribute("class", "flare");
          flare.setAttribute("style", "bottom: -6.5vw; left: 54vw");
          document.getElementById("questions-screen").appendChild(flare);
          setTimeout(function () {
            let flare = document.createElement("flare");
            flare.setAttribute("class", "flare");
            flare.setAttribute("style", "bottom: -6.5vw; left: 59vw");
            document.getElementById("questions-screen").appendChild(flare);
          }, 100);
        }, 100);
      }, 100);
    }, 100);
  }
}

bg.on("fade", function () {
  bg.stop();
  bg.volume(1);
});

final.on("fade", function () {
  final.stop();
  final.volume(1);
});

maintheme.on("fade", function () {
  maintheme.stop();
  maintheme.volume(0.3);
});

var rulestheme = new Howl({
  src: ["rules.mp3"],
  loop: true,
  rate: 1,
  volume: 0.3,
});

var ambient = new Howl({
  src: ["ambient.wav"],
  loop: true,
  rate: 1,
  volume: 0.3,
});

ambient.on("fade", function () {
  ambient.stop();
  ambient.volume(0.3);
});

var letsplay = new Howl({
  src: ["lets play.mp3"],
  rate: 1,
});

letsplay.on("fade", function () {
  letsplay.stop();
  letsplay.volume(1);
});

rulestheme.on("fade", function () {
  rulestheme.stop();
  rulestheme.volume(0.3);
});

maintheme.play();

function normalGraphic(num) {
  flare(num);
  document.getElementById("correct12").style["left"] = "";
  document.getElementById("final12").style["left"] = "";
  document.getElementById("correct34").style["left"] = "";
  document.getElementById("final34").style["left"] = "";
  document.getElementById("correct12").style["clip-path"] = "";
  document.getElementById("final12").style["clip-path"] = "";
  document.getElementById("correct34").style["clip-path"] = "";
  document.getElementById("final34").style["clip-path"] = "";
  document.getElementById("answera" + num).style.color = "goldenrod";
  document.getElementById("answer" + num).style.color = "white";
}

function correctGraphic(num) {
  rightflare(num);
  if (num == 1 || num == 2) {
    document.getElementById("correct12").style["clip-path"] =
      "polygon(-75% 0, 100% 0, 100% 100%, -100% 100%)";
    if (num == 1) {
      document.getElementById("correct12").style["left"] = "0";
    } else {
      document.getElementById("correct12").style["left"] = "calc(26.4vw + 4px)";
    }
  } else {
    document.getElementById("correct34").style["clip-path"] =
      "polygon(-75% 0, 100% 0, 100% 100%, -100% 100%)";
    if (num == 3) {
      document.getElementById("correct34").style["left"] = "0";
    } else {
      document.getElementById("correct34").style["left"] = "calc(26.4vw + 4px)";
    }
  }
  document.getElementById("answera" + num).style.color = "black";
  document.getElementById("answer" + num).style.color = "white";
}

function finalGraphic(num) {
  flare(num);
  if (num == 1 || num == 2) {
    document.getElementById("final12").style["clip-path"] =
      "polygon(-75% 0, 100% 0, 100% 100%, -100% 100%)";
    if (num == 1) {
      document.getElementById("final12").style["left"] = "0";
    } else {
      document.getElementById("final12").style["left"] = "calc(26.4vw + 4px)";
    }
  } else {
    document.getElementById("final34").style["clip-path"] =
      "polygon(-75% 0, 100% 0, 100% 100%, -100% 100%)";
    if (num == 3) {
      document.getElementById("final34").style["left"] = "0";
    } else {
      document.getElementById("final34").style["left"] = "calc(26.4vw + 4px)";
    }
  }
  document.getElementById("answera" + num).style.color = "black";
  document.getElementById("answer" + num).style.color = "black";
}

setTimeout(function () {
  document.getElementById("starter-screen").style =
    "top: 0; transform: scale(1)";
}, 500);

document.getElementById("wallpaper").style["background-image"] =
  'url("bckg.jpg")';

setInterval(function () {
  document.getElementById("start").style.color = "rgba(0, 0, 0, 0)";
  setTimeout(function () {
    document.getElementById("start").innerHTML = "PRESS SPACE TO START";
    document.getElementById("start").style.color = "rgba(255, 255, 255, 1)";
    setTimeout(function () {
      document.getElementById("start").style.color = "rgba(0, 0, 0, 0)";
      setTimeout(function () {
        document.getElementById("start").innerHTML = "WAITING ON START";
        document.getElementById("start").style.color = "rgba(255, 255, 255, 1)";
      }, 1000);
    }, 1000);
  }, 1000);
}, 4000);

document.getElementById("audience-button").onclick = function () {
  let gamecode = prompt(
    "Please enter the join code of the user you're answering for."
  );
  console.log(gamecode);
  if (gamecode != null) {
    socket.emit("checkGamecode", gamecode);
  }
};

socket.on("receivedATAanswer", (data) => {
  if (atas.includes(data.socketid) == false) {
    atas.push(data.socketid);
    atasanswers[data.answer] += 1;
    console.log(atasanswers);
  }
});

socket.on("ATAend", function () {
  ataing = 0;
  document.getElementById("question1-screen").style = "";
  document.getElementById("question2-screen").style = "";
  document.getElementById("audience-message").innerHTML =
    "WAITING FOR AN ASK THE AUDIENCE";
});

socket.on("ATAstart", function () {
  document.getElementById("audience-message").innerHTML =
    "INCOMING ASK THE AUDIENCE! GET READY TO ANSWER!";
  normalGraphic(1);
  normalGraphic(2);
  normalGraphic(3);
  normalGraphic(4);
  document.getElementById("answer1").innerHTML = "";
  document.getElementById("answer2").innerHTML = "";
  document.getElementById("answer3").innerHTML = "";
  document.getElementById("answer4").innerHTML = "";
});

socket.on("ATAprompt", function () {
  document.getElementById("audience-message").innerHTML =
    "HIT THE A, B, C, OR D KEYS ON YOUR KEYBOARD TO LOCK IN AN ANSWER. THE CONTESTANT'S ANSWER DEPENDS ON YOURS!";
  ataing = 1;
  document.getElementById("question1-screen").style =
    "filter: brightness(1); transform: scale(1)";
  document.getElementById("question2-screen").style =
    "filter: brightness(1); transform: scale(1)";
});

socket.on("returnedJoincode", (code) => {
  document.getElementById("audience").style.visibility = "";
  localStorage.setItem("wwtbamcode", code.toUpperCase());
  document.getElementById("askaudience").innerHTML =
    "Joincode generated. The code is: " +
    code.toUpperCase() +
    ". Your audience can come to this page, enter the code, and vote in Ask the Audience!";
  document.getElementById("gamecodeDisplay").innerHTML =
    "AUDIENCE CODE: " + code.toUpperCase();
  stage = 1;
});

socket.on("gamecodeCheckedWWT", (data) => {
  if (data.data == true) {
    localStorage.setItem("wwtbamcode", data.code.toUpperCase());
    maintheme.fade(0.3, 0, 500);
    audiencing = 1;
    document.getElementById("gamecode").innerHTML = "JOIN CODE: " + data.code;
    document.getElementById("starter-screen").style =
      "opacity: 0; visibility: hidden; top: -100vh; transform: scale(1)";
    document.getElementById("audience-screen").style =
      "opacity: 1; visibility: visible;";
  }
  if (data.data == false) {
    localStorage.removeItem("wwtbamcode");
    alert("Error, incorrect code.");
  }
});

document.getElementById("askaudience").onclick = function () {
  if (localStorage.getItem("wwtbamcode") == null && stage == 1) {
    stage = 10000;
    socket.emit("genJoinCode");
  }
};

document.onkeydown = function (e) {
  document.getElementById("disclaimer").style.visibility = "hidden";
  e = e || window.event;
  var key = e.key;
  console.log(key);
  if (key == " " && stage == 0 && audiencing == 0) {
    document.getElementById("starter-screen").style =
      "opacity: 0; visibility: hidden; top: -100vh; transform: scale(1)";
    document.getElementById("rules-screen").style =
      "opacity: 100%; visibility: visible;";
    maintheme.fade(0.3, 0, 1000);
    localStorage.removeItem("wwtbamcode");

    setTimeout(function () {
      document.getElementById("audience").style.visibility = "hidden";
      document.getElementById("gamecodeDisplay").innerHTML = "LIFELINES:";
      stage = 1;
      rulestheme.play();
    }, 500);
  } else if (key == " " && stage == 1) {
    document.getElementById("rules-screen").style = "";
    elimmed = 0;
    gamenum += 1;
    stage = 2;
    rulestheme.fade(0.3, 0, 1000);
    setTimeout(function () {
      letsplay.play();
      setTimeout(function () {
        letsplay.fade(1, 0, 2000);
        ambient.play();
      }, 2000);
    }, 500);
  } else if (key.toLowerCase() == "z" && stage == 2 && questionState == 0) {
    document.getElementById("answer1").style = "";
    document.getElementById("answer2").style = "";
    document.getElementById("answer3").style = "";
    document.getElementById("answer4").style = "";
    qnum += 1;
    document.getElementById("questions-screen").style.bottom = "";

    var paras = document.getElementsByClassName("flare");
    while (paras[0]) {
      paras[0].parentNode.removeChild(paras[0]);
    }
    normalGraphic(1);
    normalGraphic(2);
    normalGraphic(3);
    normalGraphic(4);
    document.getElementById("question").innerHTML =
      questions[gamenum - 1][qnum - 1]["title"];
    document.getElementById("answer1").innerHTML =
      questions[gamenum - 1][qnum - 1]["a1"];
    document.getElementById("answer2").innerHTML =
      questions[gamenum - 1][qnum - 1]["a2"];
    document.getElementById("answer3").innerHTML =
      questions[gamenum - 1][qnum - 1]["a3"];
    document.getElementById("answer4").innerHTML =
      questions[gamenum - 1][qnum - 1]["a4"];
    finalAnswer = 0;
    questionState = 1;
    document.getElementById("question").style =
      "transform: scale(2.75, 2.75); filter: brightness(100%)";

    if (qnum > 10) {
      new Howl({
        src: ["100kopen.mp3"],
        rate: 1,
      }).play();
    } else {
      new Howl({
        src: ["lessopen.mp3"],
        rate: 1,
      }).play();
    }
  } else if (key.toLowerCase() == "z" && stage == 2 && questionState == 1) {
    questionState = 2;
    document.getElementById("num").innerHTML =
      "$" + numberWithCommas(monies[qnum]);
    document.getElementById("num").style =
      "filter: brightness(1); transform: scale(1)";
    if (qnum <= 10) {
      new Howl({
        src: ["lessopen.mp3"],
        rate: 1,
      }).play();
      document.getElementById("question").style =
        "bottom: 13vw; transform: scale(2.75, 2.75); filter: brightness(100%)";
      ambient.volume(0.2);
      setTimeout(() => {
        document.getElementById("question1-screen").style =
          "filter: brightness(1); transform: scale(1)";
        document.getElementById("question2-screen").style =
          "filter: brightness(1); transform: scale(1)";
        if (qnum == 1) {
          document.getElementById("lifelines-screen").style.opacity = "1";
          bg = new Howl({
            src: ["q15bg.mp3"],
            loop: true,
            rate: 1,
            volume: 1,
          });
          bg.on("fade", function () {
            bg.stop();
            bg.volume(1);
          });
          bg.play();
        }
        if (qnum == 6 || qnum == 7 || qnum == 8) {
          bg = new Howl({
            src: ["intermedq1.mp3"],
            loop: true,
            rate: 1,
            volume: 1,
          });
          bg.on("fade", function () {
            bg.stop();
            bg.volume(1);
          });
          bg.play();
        }
        if (qnum == 9 || qnum == 10) {
          bg = new Howl({
            src: ["intermedq2.mp3"],
            loop: true,
            rate: 1,
            volume: 1,
          });
          bg.on("fade", function () {
            bg.stop();
            bg.volume(1);
          });
          bg.play();
        }
      }, 800);
    } else {
      new Howl({
        src: ["100kopen.mp3"],
        rate: 1,
      }).play();
      document.getElementById("question").style =
        "bottom: 13vw; transform: scale(2.75, 2.75); filter: brightness(100%)";
      ambient.volume(0.2);
      setTimeout(() => {
        document.getElementById("question1-screen").style =
          "filter: brightness(1); transform: scale(1)";
        document.getElementById("question2-screen").style =
          "filter: brightness(1); transform: scale(1)";
        if (qnum == 11 || qnum == 12) {
          bg = new Howl({
            src: ["real100k.mp3"],
            loop: true,
            rate: 1,
            volume: 1,
          });
          bg.on("fade", function () {
            bg.stop();
            bg.volume(1);
          });
          bg.play();
        } else if (qnum == 13) {
          bg = new Howl({
            src: ["100k.mp3"],
            loop: true,
            rate: 1,
            volume: 1,
          });
          bg.on("fade", function () {
            bg.stop();
            bg.volume(1);
          });
          bg.play();
        } else {
          bg = new Howl({
            src: ["1m.mp3"],
            loop: true,
            rate: 1,
            volume: 1,
          });
          bg.on("fade", function () {
            bg.stop();
            bg.volume(1);
          });
          bg.play();
        }
      }, 800);
    }
  } else if (key.toLowerCase() == "a") {
    if (ataing == 0 && stage == 2 && questionState == 2) {
      finalGraphic(1);

      bg.fade(1, 0, 500);
      final.play();
      finalAnswer = 1;
    } else if (ataing == 1) {
      finalGraphic(1);

      socket.emit("ATAanswer", {
        code: localStorage.getItem("wwtbamcode"),
        answer: 1,
      });
      ataing = 0;
      document.getElementById("question1-screen").style = "";
      document.getElementById("question2-screen").style = "";
      document.getElementById("audience-message").innerHTML =
        "THANKS FOR VOTING!";
    }
  } else if (key.toLowerCase() == "b") {
    if (ataing == 0 && stage == 2 && questionState == 2) {
      finalGraphic(2);

      bg.fade(1, 0, 500);
      final.play();
      finalAnswer = 2;
    } else if (ataing == 1) {
      finalGraphic(2);

      socket.emit("ATAanswer", {
        code: localStorage.getItem("wwtbamcode"),
        answer: 2,
      });
      ataing = 0;
      document.getElementById("question1-screen").style = "";
      document.getElementById("question2-screen").style = "";
      document.getElementById("audience-message").innerHTML =
        "THANKS FOR VOTING!";
    }
  } else if (key.toLowerCase() == "c") {
    if (ataing == 0 && stage == 2 && questionState == 2) {
      finalGraphic(3);

      bg.fade(1, 0, 500);
      final.play();
      finalAnswer = 3;
    } else if (ataing == 1) {
      finalGraphic(3);

      socket.emit("ATAanswer", {
        code: localStorage.getItem("wwtbamcode"),
        answer: 3,
      });
      ataing = 0;
      document.getElementById("question1-screen").style = "";
      document.getElementById("question2-screen").style = "";
      document.getElementById("audience-message").innerHTML =
        "THANKS FOR VOTING!";
    }
  } else if (key.toLowerCase() == "d") {
    if (ataing == 0 && stage == 2 && questionState == 2) {
      finalGraphic(4);

      bg.fade(1, 0, 500);
      final.play();
      finalAnswer = 4;
    } else if (ataing == 1) {
      finalGraphic(4);

      socket.emit("ATAanswer", {
        code: localStorage.getItem("wwtbamcode"),
        answer: 4,
      });
      ataing = 0;
      document.getElementById("question1-screen").style = "";
      document.getElementById("question2-screen").style = "";
      document.getElementById("audience-message").innerHTML =
        "THANKS FOR VOTING!";
    }
  } else if (key.toLowerCase() == "v" && audiencing == 0) {
    final.fade(1, 0, 500);
    normalGraphic(1);
    normalGraphic(2);
    normalGraphic(3);
    normalGraphic(4);
    finalAnswer = 0;
    bg.stop();
    bg.play();
  } else if (
    key.toLowerCase() == "x" &&
    stage == 2 &&
    questionState == 2 &&
    finalAnswer != 0
  ) {
    final.fade(1, 0, 500);
    if (answers[gamenum - 1][qnum - 1] == finalAnswer) {
      ambient.volume(0.3);
      console.log("correct");
      questionState = 3;
      correctGraphic(finalAnswer);
      new Howl({
        src: ["correct.mp3"],
        rate: 1,
      }).play();
      setTimeout(function () {
        if (qnum <= 4) {
          bg.play();
        }
      }, 800);
    } else {
      elimmed = 1;
      console.log("wrong");
      document.getElementById("lifelines-screen").style.opacity = "0";
      questionState = 0;
      stage = 3;
      correctGraphic(answers[gamenum - 1][qnum - 1]);
      new Howl({
        src: ["wrong.mp3"],
        rate: 1,
      }).play();
    }
  } else if (key.toLowerCase() == "z" && stage == 2 && questionState == 3) {
    document.getElementById("ata-scoreboard").style.top = "";
    questionState = 4;
    document.getElementById("bigprize").innerHTML =
      "$" + numberWithCommas(monies[qnum]);
    document.getElementById("bigprize").style =
      "transform: scale(2.75, 2.75); filter: brightness(100%)";
    document.getElementById("questions-screen").style.bottom = "-20vw";
    document.getElementById("question").style = "";
    document.getElementById("question1-screen").style = "";
    document.getElementById("question2-screen").style = "";
    document.getElementById("num").style = "";
    if (qnum < 5) {
      new Howl({
        src: ["1kw.mp3"],
        rate: 1,
      }).play();
    }
    if (qnum == 5 || qnum == 10) {
      new Howl({
        src: ["win5k.mp3"],
        rate: 1,
      }).play();
    }
    if (qnum == 6 || qnum == 7) {
      new Howl({
        src: ["win7k+.mp3"],
        rate: 1,
      }).play();
    }
    if (qnum == 8 || qnum == 9) {
      new Howl({
        src: ["win30k.wav"],
        rate: 1,
      }).play();
    }
    if (qnum == 11 || qnum == 12) {
      new Howl({
        src: ["win100k.mp3"],
        rate: 1,
      }).play();
    }
    if (qnum == 13) {
      new Howl({
        src: ["win500k.mp3"],
        rate: 1,
      }).play();
    }
    if (qnum == 14) {
      new Howl({
        src: ["win1m.mp3"],
        rate: 1,
      }).play();
    }
  } else if (key.toLowerCase() == "z" && stage == 2 && questionState == 4) {
    questionState = 0;
    document.getElementById("bigprize").style = "";
  } else if (key.toLowerCase() == "s" && stage == 2) {
    new Howl({
      src: ["lets play.mp3"],
      rate: 1,
    }).play();
  } else if (key.toLowerCase() == "l" && audiencing == 0) {
    bg.fade(1, 0, 1000);
    new Howl({
      src: ["walk.mp3"],
      rate: 1,
    }).play();
    document.getElementById("ata-scoreboard").style.top = "";
    document.getElementById("num").style = "";
    document.getElementById("question").style = "";
    document.getElementById("question1-screen").style = "";
    document.getElementById("question2-screen").style = "";
    document.getElementById("lifelines-screen").style.opacity = "0";
    document.getElementById("5050").style.visibility = "";
    document.getElementById("plusone").style.visibility = "";

    if (localStorage.getItem("wwtbamcode") != null) {
      document.getElementById("audience").style.visibility = "";
    } else {
      document.getElementById("audience").style.visibility = "hidden";
    }
    ambient.fade(0.3, 0, 1000);
    stage = 1;
    questionState = 0;
    finalAnswer = 0;
    fiftyfifty = 1;
    audience = 1;
    audienceprepared = 0;
    plusone = 1;
    if (elimmed == 0) {
      document.getElementById("bigprize").innerHTML =
        "$" + numberWithCommas(monies[qnum - 1]);
    } else {
      if (monies[qnum - 1] < 5000) {
        document.getElementById("bigprize").innerHTML = "$0";
      } else if (monies[qnum - 1] < 50000) {
        document.getElementById("bigprize").innerHTML = "$5,000";
      } else {
        document.getElementById("bigprize").innerHTML = "$50,000";
      }
    }
    qnum = 0;
    document.getElementById("bigprize").style =
      "transform: scale(2.75, 2.75); filter: brightness(100%)";
    setTimeout(function () {
      document.getElementById("bigprize").style = "";
    }, 8000);
  } else if (
    key.toLowerCase() == "q" &&
    fiftyfifty == 1 &&
    questionState == 2
  ) {
    document.getElementById("5050").style.visibility = "hidden";
    fiftyfifty = 0;
    let list = [1, 2, 3, 4];
    list.splice(answers[gamenum - 1][qnum - 1] - 1, 1);
    let randoms = getRandom(list, 2);
    new Howl({
      src: ["5050.mp3"],
      rate: 1,
    }).play();
    bg.volume(0.3);
    setTimeout(function () {
      document.getElementById("answer" + randoms[0]).style =
        "transform: scale(0); opacity: 0";
      document.getElementById("answer" + randoms[1]).style =
        "transform: scale(0); opacity: 0";
      bg.volume(1);
    }, 4300);
  } else if (key.toLowerCase() == "e" && plusone == 1 && questionState == 2) {
    plusone = 0;
    document.getElementById("plusone").style.visibility = "hidden";
    new Howl({
      src: ["5050.mp3"],
      rate: 1,
    }).play();
  } else if (
    key.toLowerCase() == "w" &&
    audience == 1 &&
    questionState == 2 &&
    audienceprepared == 0 &&
    localStorage.getItem("wwtbamcode") != null
  ) {
    audience = 0;
    document.getElementById("audience").style.visibility = "hidden";
    bg.fade(1, 0, 500);
    audienceprepare.play();
    audienceprepared = 1;
    atas = [];
    atasanswers = { 1: 0, 2: 0, 3: 0, 4: 0 };
    socket.emit("startATA", localStorage.getItem("wwtbamcode"));
  } else if (
    key.toLowerCase() == "w" &&
    questionState == 2 &&
    audienceprepared == 1 &&
    localStorage.getItem("wwtbamcode") != null
  ) {
    audienceprepare.stop();
    audienceprepared = 2;
    ata.play();
    socket.emit("sendATA", localStorage.getItem("wwtbamcode"));
  } else if (
    key.toLowerCase() == "w" &&
    questionState == 2 &&
    audienceprepared == 2 &&
    localStorage.getItem("wwtbamcode") != null
  ) {
    socket.emit("endATA", localStorage.getItem("wwtbamcode"));
    ata.stop();
    audienceprepared = 3;
    ataresult.play();
    createATAScoreboard();
    setTimeout(function () {
      bg.play();
    }, 1300);
  } else if (key.toLowerCase() == "r" && questionState == 2 && stage != 6) {
    bg.fade(1, 0, 500);
    new Howl({
      src: ["5050.mp3"],
      rate: 1,
    }).play();
    stage = 6;
    document.getElementById("lifelines-screen").style.opacity = "0";
  } else if (key.toLowerCase() == "r" && stage == 6) {
    stage = 2;
    correctGraphic(answers[gamenum - 1][qnum - 1]);
  }
};
