Date.prototype.getJulian = function () {
  return this / 86400000 - this.getTimezoneOffset() / 1440 + 2440587.66666667;
};

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
  passcode = parseInt(code);
});

$("#help").click(function () {
  $("#rules-screen").css("top", "50%");
  $("#rules-screen").css("opacity", "1");
  $("#rules-screen").css("visibility", "visible");
});

$("#close-rules").click(function () {
  $("#rules-screen").css("top", "150%");
  $("#rules-screen").css("opacity", "0");
  $("#rules-screen").css("visibility", "hidden");
});
