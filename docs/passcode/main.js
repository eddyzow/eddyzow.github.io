Date.prototype.getJulian = function () {
  return this / 86400000 - this.getTimezoneOffset() / 1440 + 2440587.16666667;
};

var darkTheme = 0;
var numGuesses = 0;
var numbersSubmitted = 0; // 1 to 36
var numbersGuessed = 0; // 1 to 6
var passcode = "Loading";
var guessing = 1;
var today = new Date(); //set any date
var julian = (Math.floor(today.getJulian()) + 0).toString(); //get Julian counterpart
var gameID = Math.floor(today.getJulian()) - 2460540;

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
    "Passcode #" +
      gameID +
      " (" +
      julianToHumanReadable(today.getJulian()) +
      ")"
  );
  guessing = 0;
});

function countOccurrences(word, letter) {
  return word.split(letter).length - 1;
}

function submitGuess() {
  if (guessing == 0) {
    if (numbersGuessed == 6) {
      guessing = 1;
      let guess =
        $("#square-" + (numbersSubmitted - 5)).html() +
        $("#square-" + (numbersSubmitted - 4)).html() +
        $("#square-" + (numbersSubmitted - 3)).html() +
        $("#square-" + (numbersSubmitted - 2)).html() +
        $("#square-" + (numbersSubmitted - 1)).html() +
        $("#square-" + (numbersSubmitted - 0)).html();

      let totalDist = 0;
      let passcodeMatched = Array(6).fill(false); // Tracking array for the passcode
      let guessMatched = Array(6).fill(false); // Tracking array for the guess

      // First pass: Check for green tiles
      for (let i = 0; i < 6; i++) {
        if (parseInt(guess[i]) == parseInt(passcode[i])) {
          passcodeMatched[i] = true;
          guessMatched[i] = true;
        }
      }

      // Calculate the totalDist
      for (let i = 0; i < 6; i++) {
        if (Math.abs(parseInt(guess[i]) - parseInt(passcode[i])) > 5) {
          totalDist +=
            10 - Math.abs(parseInt(guess[i]) - parseInt(passcode[i]));
        } else {
          totalDist += Math.abs(parseInt(guess[i]) - parseInt(passcode[i]));
        }
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
            $("#square-" + (numbersSubmitted - 5 + i))
              .css("transform", "rotateY(180deg) scale(-1, 1)")
              .css("background-color", "green")
              .css("color", "white");
          } else if (guessMatched[i]) {
            // Yellow
            $("#square-" + (numbersSubmitted - 5 + i))
              .css("transform", "rotateY(180deg) scale(-1, 1)")
              .css("background-color", "goldenrod")
              .css("color", "white");
          } else {
            // Black
            $("#square-" + (numbersSubmitted - 5 + i))
              .css("transform", "rotateY(180deg) scale(-1, 1)")
              .css("background-color", "black")
              .css("color", "white");
          }
          if (i == 5) {
            guessing = 0;
            if (guess == passcode) {
              // WIN
              guessing = 1;
              console.log("WIN");
              $("#share-button").css("visibility", "visible");
              $("#share-button").css("opacity", "100%");
            }
          }
        }, 200 * i);
      }

      numGuesses++;
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
  navigator.clipboard.writeText(
    "I solved Passcode #" + gameID + "!\nhttps://eddyzow.net/passcode/"
  );
  document.getElementById("share-button").innerHTML = "Copied!";
  clearTimeout(timer);
  timer = setTimeout(() => {
    document.getElementById("share-button").innerHTML = "Share Result!";
  }, 1000);
});

$(document).keydown(function (event) {
  console.log(event.key);
  if (event.key == "Enter" && numbersSubmitted > 0 && guessing == 0) {
    submitGuess();
  }
  if (event.key == "Backspace" && numbersGuessed > 0) {
    deleteNumber();
  }
  if (event.key >= 0 && event.key <= 9 && event.key != " ") {
    // number pressed
    if (numbersGuessed < 6 && numbersGuessed >= 0) {
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
  if (numbersGuessed < 6 && numbersGuessed >= 0) {
    submitNumber(0);
  }
});
$("#key-1").click(function () {
  if (numbersGuessed < 6 && numbersGuessed >= 0) {
    submitNumber(1);
  }
});
$("#key-2").click(function () {
  if (numbersGuessed < 6 && numbersGuessed >= 0) {
    submitNumber(2);
  }
});
$("#key-3").click(function () {
  if (numbersGuessed < 6 && numbersGuessed >= 0) {
    submitNumber(3);
  }
});
$("#key-4").click(function () {
  if (numbersGuessed < 6 && numbersGuessed >= 0) {
    submitNumber(4);
  }
});
$("#key-5").click(function () {
  if (numbersGuessed < 6 && numbersGuessed >= 0) {
    submitNumber(5);
  }
});
$("#key-6").click(function () {
  if (numbersGuessed < 6 && numbersGuessed >= 0) {
    submitNumber(6);
  }
});
$("#key-7").click(function () {
  if (numbersGuessed < 6 && numbersGuessed >= 0) {
    submitNumber(7);
  }
});
$("#key-8").click(function () {
  if (numbersGuessed < 6 && numbersGuessed >= 0) {
    submitNumber(8);
  }
});
$("#key-9").click(function () {
  if (numbersGuessed < 6 && numbersGuessed >= 0) {
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

$("#close-rules").click(function () {
  $("#rules-screen").css("top", "150%");
  $("#rules-screen").css("opacity", "0");
  $("#rules-screen").css("visibility", "hidden");
  $("#modal").css("opacity", "0%");
  $("#modal").css("visibility", "hidden");
});
$("#darktheme").click(function () {
  if (darkTheme == 0) {
    darkTheme = 1;
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
  } else {
    darkTheme = 0;
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
  }
});
