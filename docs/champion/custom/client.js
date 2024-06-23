const socket = io("https://eddyzow.onrender.com/"); // Socket

document.getElementById("wallpaper").style["background-image"] =
  'url("../assets/art/wallpapers/' +
  (Math.floor(Math.random() * 8) + 1).toString() +
  '.jpg")';

// verify login
socket.emit("verifyToken", localStorage.getItem("userToken"));
socket.on("accessToken", (info) => {
  if (info != false) {
    console.log(info);
    document.getElementById("loggedIn").innerHTML =
      "You're logged in. Join or create games below!";
    socket.emit("getUsername", localStorage.getItem("userToken"));
  }
});

socket.on("usernameGot", (data) => {
  document.getElementById("helloUser").innerHTML = "Hello, " + data + "!";
});

socket.on("fatalError", (info) => {
  document.getElementById("helloUser").innerHTML = "Hello, guest!";
  document.getElementById("loggedIn").innerHTML =
    "You are NOT logged in. Join a game now, or login to create games!";
});

document.getElementById("joinGame").onclick = function joingame() {
  window.location.href = "/champion/join";
};

document.getElementById("createGame").onclick = function creategame() {
  window.location.href = "/champion/custom/create";
};
