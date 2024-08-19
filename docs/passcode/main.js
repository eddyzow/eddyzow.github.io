Date.prototype.getJulian = function () {
  return this / 86400000 - this.getTimezoneOffset() / 1440 + 2440587.66666667;
};

var numGuesses = 0;
var numbersSubmitted = 0; // 1 to 36
var numbersGuessed = 0; // 1 to 6
var passcode = "Loading";
var today = new Date(); //set any date
var julian = (Math.floor(today.getJulian()) + 0).toString(); //get Julian counterpart

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

generateSixDigitCode().then((code) => {
  passcode = code;
});

function submitGuess() {
  if (numbersGuessed == 6) {
    let guess =
      $("#square-" + (numbersSubmitted - 5)).html() +
      $("#square-" + (numbersSubmitted - 4)).html() +
      $("#square-" + (numbersSubmitted - 3)).html() +
      $("#square-" + (numbersSubmitted - 2)).html() +
      $("#square-" + (numbersSubmitted - 1)).html() +
      $("#square-" + (numbersSubmitted - 0)).html();
    let totalDist = 0;
    for (let i = 0; i < 6; i++) {
      setTimeout(() => {
        // Run after 100 milliseconds

        if (Math.abs(parseInt(guess[i]) - parseInt(passcode[i])) > 5) {
          totalDist +=
            10 - Math.abs(parseInt(guess[i]) - parseInt(passcode[i]));
        } else {
          totalDist += Math.abs(parseInt(guess[i]) - parseInt(passcode[i]));
        }
        // first calculate greens
        if (parseInt(guess[i]) == parseInt(passcode[i])) {
          console.log(numbersSubmitted - 5 + i);
          $("#square-" + (numbersSubmitted - 5 + i)).css(
            "transform",
            "rotateY(180deg) scale(-1, 1)"
          );
          $("#square-" + (numbersSubmitted - 5 + i)).css(
            "background-color",
            "green"
          );
          $("#square-" + (numbersSubmitted - 5 + i)).css("color", "white");
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

$(document).keydown(function (event) {
  console.log(event.key);
  if (event.key == "Enter" && numbersSubmitted > 0) {
    submitGuess();
  }
  if (event.key == "Backspace" && numbersGuessed > 0) {
    deleteNumber();
  }
  if (event.key >= 0 && event.key <= 9) {
    // number pressed
    if (numbersGuessed < 6 && numbersGuessed >= 0) {
      submitNumber(event.key);
    }
  }
});

function deleteNumber(key) {
  $("#square-" + numbersSubmitted).text("");
  numbersGuessed--;
  numbersSubmitted--;
}

function submitNumber(key) {
  $("#square-" + (numbersSubmitted + 1)).text(key);
  numbersGuessed++;
  numbersSubmitted++;
}

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
