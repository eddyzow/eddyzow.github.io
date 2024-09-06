Date.prototype.getJulian = function () {
  return this / 86400000 - this.getTimezoneOffset() / 1440 + 2440587.16666667;
};

// TODO:
// fix screen size

var disabledkey = 1;
var guessList = [];
var colors = [];
var hardMode = false;
var darkTheme = 0;
var qum = 1;
var alreadyPlayed = 0;
var numGuesses = 0;
var numbersSubmitted = 0; // 1 to 36
var numbersGuessed = 0; // 1 to 6
var passcode = "Loading";
var guessing = 1;
var today = new Date(); //set any date
var julian = (Math.floor(today.getJulian()) + 0).toString(); //get Julian counterpart
var gameID = Math.floor(today.getJulian()) - 2460540;
var statistics = [];
try {
  statistics = JSON.parse(localStorage.getItem("statistics"));
  if (statistics == null) {
    statistics = [];
    localStorage.setItem("statistics", "[]");
  }
} catch {
  statistics = [];
  localStorage.setItem("statistics", "[]");
}

function longestWinningStreak(statistics) {
  if (statistics.length === 0) return 0;

  let longestStreak = 0;
  let currentStreak = 0;
  let previousGameID = null;

  for (let i = 0; i < statistics.length; i++) {
    let currentGameID = statistics[i][0];
    let gameResult = statistics[i][1];

    if (gameResult !== 0) {
      if (previousGameID === null || currentGameID === previousGameID + 1) {
        currentStreak++;
      } else {
        currentStreak = 1; // Reset streak if IDs aren't consecutive
      }
    } else {
      currentStreak = 0; // Reset streak on loss
    }

    if (currentStreak > longestStreak) {
      longestStreak = currentStreak;
    }

    previousGameID = currentGameID; // Update the previous game ID
  }

  return longestStreak;
}

function calculateCurrentStreak(statistics, gameID) {
  if (!statistics || statistics.length === 0) return 0;

  let currentStreak = 0;

  // Start checking from today's game ID and work backwards
  for (let i = gameID; i >= 1; i--) {
    let foundGame = statistics.find((stat) => stat[0] === i);

    if (foundGame) {
      if (foundGame[1] === 0) {
        // Player lost this game, stop streak
        break;
      } else {
        // Player won this game, continue streak
        currentStreak++;
      }
    } else {
      // No record of this game, stop streak unless it's today's game
      if (i === gameID) {
        continue; // Keep the streak if the player hasn't played today
      } else {
        break; // No record of a previous game, stop streak
      }
    }
  }

  return currentStreak;
}

function readStatistics() {
  try {
    statistics = JSON.parse(localStorage.getItem("statistics"));
    if (statistics == null) {
      statistics = [];
      localStorage.setItem("statistics", "[]");
    }
  } catch {
    statistics = [];
    localStorage.setItem("statistics", "[]");
  }
  $("#games-played").text(statistics.length);
  let failureCount = 0;
  for (let i = 0; i < statistics.length; i++) {
    if (statistics[i][1] === 0) {
      failureCount++;
    }
  }

  if (statistics.length == 0) {
    $("#win-percentage").text("0%");
  } else {
    $("#win-percentage").text(
      100 - (failureCount / statistics.length).toFixed(2) * 100 + "%"
    );
  }

  $("#best-streak").text(longestWinningStreak(statistics));
  $("#current-streak").text(calculateCurrentStreak(statistics, gameID));

  let count1 = 0;
  statistics.forEach((game) => {
    if (game[1] === 1) {
      count1++;
    }
  });

  let count2 = 0;
  statistics.forEach((game) => {
    if (game[1] === 2) {
      count2++;
    }
  });
  let count3 = 0;
  statistics.forEach((game) => {
    if (game[1] === 3) {
      count3++;
    }
  });
  let count4 = 0;
  statistics.forEach((game) => {
    if (game[1] === 4) {
      count4++;
    }
  });
  let count5 = 0;
  statistics.forEach((game) => {
    if (game[1] === 5) {
      count5++;
    }
  });
  let totalc = count1 + count2 + count3 + count4 + count5;
  $("#guessbar-1").css("width", (count1 / totalc) * 100 + "%");
  $("#guessbar-2").css("width", (count2 / totalc) * 100 + "%");
  $("#guessbar-3").css("width", (count3 / totalc) * 100 + "%");
  $("#guessbar-4").css("width", (count4 / totalc) * 100 + "%");
  $("#guessbar-5").css("width", (count5 / totalc) * 100 + "%");
  $("#guess-1-count").text(count1);
  $("#guess-2-count").text(count2);
  $("#guess-3-count").text(count3);
  $("#guess-4-count").text(count4);
  $("#guess-5-count").text(count5);
}

var shareString =
  "I played Passcode #" +
  gameID +
  "! Can you crack today's passcode?\nhttps://eddyzow.net/passcode/";

async function generateSixDigitCode() {
  // Convert Julian date to string and then to a Uint8Array
  const encoder = new TextEncoder();
  const data = encoder.encode(julian.toString());

  // Create SHA-256 hash of the Julian date
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert hash to hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Take the first 6 characters of the hash and convert them to an integer

  let code = parseInt(hashHex.substring(24, 30), 16) % 1000000;

  // Ensure it's a six-digit code by padding with leading zeros if necessary
  code = String(code).padStart(6, "0");
  return code;
}

function julianToHumanReadable(julianDate) {
  // Convert Julian Date to a standard Date object
  const unixTime = (julianDate - 2440586.83333333) * 86400000; // 86400000 ms in a day
  const date = new Date(unixTime);

  // Format the date to "Month Day, Year"
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
}

generateSixDigitCode().then((code) => {
  passcode = code;
  $("#passcode-gameid").html(
    "Passcode #" + gameID + " (" + julianToHumanReadable(gameID + 2460540) + ")"
  );
  guessing = 0;
});

function countOccurrences(word, letter) {
  return word.split(letter).length - 1;
}

function submitGuess() {
  if (guessing == 0) {
    if (numbersGuessed == 6) {
      numGuesses++;
      guessing = 1;

      guess =
        $("#square-" + (numbersSubmitted - 5)).html() +
        $("#square-" + (numbersSubmitted - 4)).html() +
        $("#square-" + (numbersSubmitted - 3)).html() +
        $("#square-" + (numbersSubmitted - 2)).html() +
        $("#square-" + (numbersSubmitted - 1)).html() +
        $("#square-" + (numbersSubmitted - 0)).html();

      if (alreadyPlayed == 0) {
        guessList.push(guess);
      }

      let totalDist = 0;
      let passcodeMatched = Array(6).fill(false); // Tracking array for the passcode
      let guessMatched = Array(6).fill(false); // Tracking array for the guess

      // First pass: Check for green tiles and check for digits not in the code
      for (let i = 0; i < 6; i++) {
        /*    if (!passcode.includes(guess[i]) && !hardMode) {
          $("#key-" + guess[i]).addClass("disabled");
       }*/
        if (parseInt(guess[i]) == parseInt(passcode[i])) {
          passcodeMatched[i] = true;
          guessMatched[i] = true;
        }
      }

      // Calculate the totalDist
      for (let i = 0; i < 6; i++) {
        totalDist += Math.abs(parseInt(guess[i]) - parseInt(passcode[i]));
      }

      // Second pass: Check for yellow tiles
      for (let i = 0; i < 6; i++) {
        if (!guessMatched[i]) {
          // Only check if it hasn't been matched
          for (let j = 0; j < 6; j++) {
            if (
              !passcodeMatched[j] &&
              parseInt(guess[i]) == parseInt(passcode[j])
            ) {
              passcodeMatched[j] = true;
              guessMatched[i] = true;
              break;
            }
          }
        }
      }

      // Update the UI based on the results

      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          if (parseInt(guess[i]) == parseInt(passcode[i])) {
            // Green
            colors.push("g");
            $("#square-" + (numbersSubmitted - 5 + i))
              .css("transform", "rotateY(180deg) scale(-1, 1)")
              .css("background-color", "green")
              .css("color", "white");
          } else if (guessMatched[i]) {
            // Yellow
            colors.push("y");
            $("#square-" + (numbersSubmitted - 5 + i))
              .css("transform", "rotateY(180deg) scale(-1, 1)")
              .css("background-color", "goldenrod")
              .css("color", "white");
          } else {
            // Black
            colors.push("b");
            $("#square-" + (numbersSubmitted - 5 + i))
              .css("transform", "rotateY(180deg) scale(-1, 1)")
              .css("background-color", "black")
              .css("color", "white");
          }
          if (i == 5) {
            guessing = 0;
            if (guess == passcode) {
              // WIN

              // TODO: delete this after
              localStorage.setItem("lastPlay", gameID);
              localStorage.setItem("lastGame", JSON.stringify(guessList));

              statistics.push([gameID, numGuesses]);
              if (alreadyPlayed == 0) {
                localStorage.setItem("statistics", JSON.stringify(statistics));
              }
              console.log(colors);
              guessing = 1;
              console.log("WIN");
              $("#notif-share").remove();
              // share
              shareString = "Passcode #" + gameID + " " + numGuesses + "/5\n";
              for (let j = 0; j < numGuesses; j++) {
                for (let k = 0; k < 6; k++) {
                  if (colors[j * 6 + k] == "y") {
                    shareString += "🟨";
                  }
                  if (colors[j * 6 + k] == "g") {
                    shareString += "🟩";
                  }
                  if (colors[j * 6 + k] == "b") {
                    shareString += "⬛";
                  }
                }
                shareString += " " + $("#avg-" + (j + 1)).html();
                shareString += "\n";
              }
              shareString += "https://eddyzow.net/passcode/";

              $("#share-button").css("visibility", "visible");
              $("#share-button").css("opacity", "100%");
              $("#end-message").css("visibility", "visible");
              $("#end-message").css("opacity", "100%");
              $("#end-message").text("Congratulations!");

              setTimeout(() => {
                $("#end-message").css("visibility", "hidden");
                $("#end-message").css("opacity", "0%");
              }, 3000);

              confetti.start();
              setTimeout(function () {
                confetti.stop();
                readStatistics();
                $("#stats-screen").css("top", "50%");
                $("#stats-screen").css("opacity", "1");
                $("#stats-screen").css("visibility", "visible");
                $("#modal").css("opacity", "100%");
                $("#modal").css("visibility", "visible");
              }, 3000);
            } else {
              if (numGuesses == 5) {
                // LOSE
                localStorage.setItem("lastGame", JSON.stringify(guessList));

                $("#end-message").css("visibility", "visible");
                $("#end-message").css("opacity", "100%");
                $("#end-message").text("Better luck tomorrow");

                setTimeout(() => {
                  $("#end-message").css("visibility", "hidden");
                  $("#end-message").css("opacity", "0%");
                }, 3000);
                // TODO: delete this after
                localStorage.setItem("lastPlay", gameID);

                statistics.push([gameID, 0]);
                if (alreadyPlayed == 0) {
                  localStorage.setItem(
                    "statistics",
                    JSON.stringify(statistics)
                  );
                }
                $("#notif-share").remove();
                shareString = "Passcode #" + gameID + " " + "X/5\n";
                for (let j = 0; j < numGuesses; j++) {
                  for (let k = 0; k < 6; k++) {
                    if (colors[j * 6 + k] == "y") {
                      shareString += "🟨";
                    }
                    if (colors[j * 6 + k] == "g") {
                      shareString += "🟩";
                    }
                    if (colors[j * 6 + k] == "b") {
                      shareString += "⬛";
                    }
                  }
                  shareString += " " + $("#avg-" + (j + 1)).html();
                  shareString += "\n";
                }
                shareString += "https://eddyzow.net/passcode/";

                $("#share-button").css("visibility", "visible");
                $("#share-button").css("opacity", "100%");
                setTimeout(function () {
                  readStatistics();
                  $("#stats-screen").css("top", "50%");
                  $("#stats-screen").css("opacity", "1");
                  $("#stats-screen").css("visibility", "visible");
                  $("#modal").css("opacity", "100%");
                  $("#modal").css("visibility", "visible");
                }, 3000);
              }
            }
          }
        }, 150 * i * qum);
      }

      $("#avg-" + numGuesses).text(totalDist);
      $("#avg-" + numGuesses).css(
        "background-color",
        "rgb(" + totalDist * 5 + "," + (150 - totalDist * 5) + "," + 0 + ")"
      );
      numbersGuessed = 0;
    }
  }
}
var timer;

document.getElementById("share-button").addEventListener("click", function (e) {
  navigator.clipboard.writeText(shareString);
  document.getElementById("share-button").innerHTML = "Copied!";
  clearTimeout(timer);
  timer = setTimeout(() => {
    document.getElementById("share-button").innerHTML = "Share Result!";
  }, 1000);
});

document
  .getElementById("share-button2")
  .addEventListener("click", function (e) {
    navigator.clipboard.writeText(shareString);
    document.getElementById("share-button2").innerHTML = "Copied!";
    clearTimeout(timer);
    timer = setTimeout(() => {
      document.getElementById("share-button2").innerHTML = "Share Result!";
    }, 1000);
  });

$(document).keydown(function (event) {
  console.log(event.key);
  if (
    event.key == "Enter" &&
    numbersSubmitted > 0 &&
    guessing == 0 &&
    disabledkey == 0
  ) {
    submitGuess();
  }
  if (event.key == "Backspace" && numbersGuessed > 0 && disabledkey == 0) {
    deleteNumber();
  }
  if (
    event.key >= 0 &&
    event.key <= 9 &&
    event.key != " " &&
    disabledkey == 0
  ) {
    // number pressed
    if (
      numbersGuessed < 6 &&
      numbersGuessed >= 0 &&
      !$("#key-" + event.key).hasClass("disabled")
    ) {
      submitNumber(event.key);
    }
  }
});

function deleteNumber(key) {
  if (guessing == 0) {
    $("#square-" + numbersSubmitted).text("");
    numbersGuessed--;
    numbersSubmitted--;
  }
}

function submitNumber(key) {
  if (guessing == 0) {
    $("#square-" + (numbersSubmitted + 1)).text(key);
    numbersGuessed++;
    numbersSubmitted++;
  }
}

$("#key-0").click(function () {
  if (
    numbersGuessed < 6 &&
    numbersGuessed >= 0 &&
    !$("#key-" + 0).hasClass("disabled")
  ) {
    submitNumber(0);
  }
});
$("#key-1").click(function () {
  if (
    numbersGuessed < 6 &&
    numbersGuessed >= 0 &&
    !$("#key-" + 1).hasClass("disabled")
  ) {
    submitNumber(1);
  }
});
$("#key-2").click(function () {
  if (
    numbersGuessed < 6 &&
    numbersGuessed >= 0 &&
    !$("#key-" + 2).hasClass("disabled")
  ) {
    submitNumber(2);
  }
});
$("#key-3").click(function () {
  if (
    numbersGuessed < 6 &&
    numbersGuessed >= 0 &&
    !$("#key-" + 3).hasClass("disabled")
  ) {
    submitNumber(3);
  }
});
$("#key-4").click(function () {
  if (
    numbersGuessed < 6 &&
    numbersGuessed >= 0 &&
    !$("#key-" + 4).hasClass("disabled")
  ) {
    submitNumber(4);
  }
});
$("#key-5").click(function () {
  if (
    numbersGuessed < 6 &&
    numbersGuessed >= 0 &&
    !$("#key-" + 5).hasClass("disabled")
  ) {
    submitNumber(5);
  }
});
$("#key-6").click(function () {
  if (
    numbersGuessed < 6 &&
    numbersGuessed >= 0 &&
    !$("#key-" + 6).hasClass("disabled")
  ) {
    submitNumber(6);
  }
});
$("#key-7").click(function () {
  if (
    numbersGuessed < 6 &&
    numbersGuessed >= 0 &&
    !$("#key-" + 7).hasClass("disabled")
  ) {
    submitNumber(7);
  }
});
$("#key-8").click(function () {
  if (
    numbersGuessed < 6 &&
    numbersGuessed >= 0 &&
    !$("#key-" + 8).hasClass("disabled")
  ) {
    submitNumber(8);
  }
});
$("#key-9").click(function () {
  if (
    numbersGuessed < 6 &&
    numbersGuessed >= 0 &&
    !$("#key-" + 9).hasClass("disabled")
  ) {
    submitNumber(9);
  }
});
$("#key-bs").click(function () {
  if (numbersGuessed > 0) {
    deleteNumber();
  }
});
$("#key-sub").click(function () {
  if (numbersSubmitted > 0) {
    submitGuess();
  }
});

$("#help").click(function () {
  $("#rules-screen").css("top", "50%");
  $("#rules-screen").css("opacity", "1");
  $("#rules-screen").css("visibility", "visible");
  $("#modal").css("opacity", "100%");
  $("#modal").css("visibility", "visible");
});

$("#changelog").click(function () {
  $("#changelog-screen").css("top", "50%");
  $("#changelog-screen").css("opacity", "1");
  $("#changelog-screen").css("visibility", "visible");
  $("#modal").css("opacity", "100%");
  $("#modal").css("visibility", "visible");
});

$("#close-changelog").click(function () {
  $("#changelog-screen").css("top", "150%");
  $("#changelog-screen").css("opacity", "0");
  $("#changelog-screen").css("visibility", "hidden");
  $("#modal").css("opacity", "0%");
  $("#modal").css("visibility", "hidden");
});

$("#close-rules").click(function () {
  $("#rules-screen").css("top", "150%");
  $("#rules-screen").css("opacity", "0");
  $("#rules-screen").css("visibility", "hidden");
  $("#modal").css("opacity", "0%");
  $("#modal").css("visibility", "hidden");
});

$("#stats").click(function () {
  readStatistics();
  $("#stats-screen").css("top", "50%");
  $("#stats-screen").css("opacity", "1");
  $("#stats-screen").css("visibility", "visible");
  $("#modal").css("opacity", "100%");
  $("#modal").css("visibility", "visible");
});

$("#close-stats").click(function () {
  $("#stats-screen").css("top", "150%");
  $("#stats-screen").css("opacity", "0");
  $("#stats-screen").css("visibility", "hidden");
  $("#modal").css("opacity", "0%");
  $("#modal").css("visibility", "hidden");
});

$("#darktheme").click(function () {
  if (darkTheme == 0) {
    darkTheme = 1;
    localStorage.setItem("darkTheme", "true");
    $("#header").css("background-color", "#424242");
    $("#header").css("color", "white");
    $(".iconb").css("color", "white");
    $("#main-wrapper").css("color", "white");
    $(".iconb").css("background-color", "#424242");
    $(".iconb").css("box-shadow", "0 0 8px 1px #ffffff");
    $("body").css("background-color", "rgb(50, 50, 50)");
    $("#passcode-gameid").css("color", "white");
    $("#modal").css("background-color", "rgb(50, 50, 50)");
    $("#rules-screen").css("background-color", "rgb(80, 80, 80)");
    $("#rules-screen").css("color", "white");
    $("#stats-screen").css("background-color", "rgb(80, 80, 80)");
    $("#stats-screen").css("color", "white");
    $("#changelog-screen").css("background-color", "rgb(80, 80, 80)");
    $("#changelog-screen").css("color", "white");
  } else {
    darkTheme = 0;
    localStorage.setItem("darkTheme", "false");
    $("#header").css("background-color", "white");
    $("#header").css("color", "black");
    $(".iconb").css("color", "black");
    $("#main-wrapper").css("color", "black");
    $(".iconb").css("background-color", "white");
    $(".iconb").css("box-shadow", "0 0 8px 1px #000000");
    $("body").css("background-color", "rgb(245, 245, 245)");
    $("#passcode-gameid").css("color", "black");
    $("#modal").css("background-color", "white");
    $("#rules-screen").css("background-color", "white");
    $("#rules-screen").css("color", "black");
    $("#stats-screen").css("background-color", "white");
    $("#stats-screen").css("color", "black");
    $("#changelog-screen").css("background-color", "white");
    $("#changelog-screen").css("color", "black");
  }
});

if (localStorage.getItem("darkTheme") == "true") {
  darkTheme = 1;
  localStorage.setItem("darkTheme", "true");
  $("#header").css("background-color", "#424242");
  $("#header").css("color", "white");
  $(".iconb").css("color", "white");
  $("#main-wrapper").css("color", "white");
  $(".iconb").css("background-color", "#424242");
  $(".iconb").css("box-shadow", "0 0 8px 1px #ffffff");
  $("body").css("background-color", "rgb(50, 50, 50)");
  $("#passcode-gameid").css("color", "white");
  $("#modal").css("background-color", "rgb(50, 50, 50)");
  $("#rules-screen").css("background-color", "rgb(80, 80, 80)");
  $("#rules-screen").css("color", "white");
  $("#stats-screen").css("background-color", "rgb(80, 80, 80)");
  $("#stats-screen").css("color", "white");
  $("#changelog-screen").css("background-color", "rgb(80, 80, 80)");
  $("#changelog-screen").css("color", "white");
}

if (localStorage.getItem("rulesRead") != "true") {
  localStorage.setItem("rulesRead", "true");
  // open rules prompt
  $("#rules-screen").css("top", "50%");
  $("#rules-screen").css("opacity", "1");
  $("#rules-screen").css("visibility", "visible");
  $("#modal").css("opacity", "100%");
  $("#modal").css("visibility", "visible");
}
window.onload = function () {
  readStatistics();
  // TODO remove later
  if (localStorage.getItem("lastPlay") == gameID) {
    alreadyPlayed = 1;
    qum = 0;
    disabledkey = 1;
    try {
      guessList = JSON.parse(localStorage.getItem("lastGame"));
      let squaren = 0;
      for (let i = 0; i < guessList.length; i++) {
        setTimeout(function () {
          for (let j = 0; j < 6; j++) {
            $("#square-" + (squaren + 1)).text(guessList[i].charAt(j));
            squaren++;
            numbersSubmitted++;
          }

          numbersGuessed = 6;
          guessing = 0;
          submitGuess();
        }, i * 150);
      }
    } catch {
      localStorage.setItem("lastGame", "[]");
    }
  } else {
    disabledkey = 0;
  }
};
