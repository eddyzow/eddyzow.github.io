var tooltipSpan = document.getElementById("details-box");
var statesSelected = [];
var statesAreas = {
  Alaska: 1723337,
  Texas: 695662,
  California: 423967,
  Montana: 380831,
  "New Mexico": 314917,
  Arizona: 295234,
  Nevada: 286380,
  Colorado: 269601,
  Oregon: 254799,
  Wyoming: 253335,
  Michigan: 250487,
  Minnesota: 225163,
  Utah: 219882,
  Idaho: 216443,
  Kansas: 213100,
  Nebraska: 200330,
  "South Dakota": 199729,
  Washington: 184661,
  "North Dakota": 183108,
  Oklahoma: 181037,
  Missouri: 180540,
  Florida: 170312,
  Wisconsin: 169635,
  Georgia: 153910,
  Illinois: 149995,
  Iowa: 145746,
  "New York": 141297,
  "North Carolina": 139391,
  Arkansas: 137732,
  Alabama: 135767,
  Louisiana: 135659,
  Mississippi: 125438,
  Pennsylvania: 119280,
  Ohio: 116098,
  Virginia: 110787,
  Tennessee: 109153,
  Kentucky: 104656,
  Indiana: 94326,
  Maine: 91633,
  "South Carolina": 82933,
  "West Virginia": 62756,
  Maryland: 32131,
  Hawaii: 28313,
  Massachusetts: 27336,
  Vermont: 24906,
  "New Hampshire": 24214,
  "New Jersey": 22591,
  Connecticut: 14357,
  Delaware: 6446,
  "Rhode Island": 4001,
  "District of Columbia": 177,
};
var totalArea = 0;

document.addEventListener("mouseover", function (e) {
  if (e.target.tagName == "path") {
    var content = e.target.dataset.name;
    document.getElementById("details-box").innerHTML = content;
    document.getElementById("details-box").style.opacity = "100%";
  } else {
    document.getElementById("details-box").style.opacity = "0%";
  }
});

function updateStates() {
  let numStates = 0;
  totalArea = 0;
  var classnames = document.getElementsByClassName("state");
  while (classnames[0]) {
    classnames[0].parentNode.removeChild(classnames[0]);
  }
  for (const element of statesSelected) {
    numStates++;
    let ele = document.createElement("p");
    ele.innerHTML = element;
    ele.classList.add("state");
    document.getElementById("states-list").appendChild(ele);
    totalArea += statesAreas[element];
  }
  document.getElementById("states-count").innerHTML = numStates;
  document.getElementById("area-count").innerHTML = totalArea.toLocaleString();
  document.getElementById("states-percentage").innerHTML =
    "That's " +
    ((statesArea / 9833519) * 100).toFixed(2) +
    "% of the United States!";
  if (numStates == 1) {
    document.getElementById("states-plural").innerHTML = "state,";
  } else {
    document.getElementById("states-plural").innerHTML = "states,";
  }
  if (statesSelected.includes("District of Columbia")) {
    document.getElementById("states-count").innerHTML = numStates - 1 + " + DC";
  }
}

document.addEventListener("click", function (e) {
  if (e.target.tagName == "path") {
    console.log(e.target.dataset.name);
    if (statesSelected.includes(e.target.dataset.name)) {
      statesSelected.splice(statesSelected.indexOf(e.target.dataset.name), 1); //remove the st ate
      e.target.style = "fill: #b0b0b0;";
      // delete all states from states list
      statesSelected.sort();
      updateStates();
    } else {
      statesSelected.push(e.target.dataset.name); //add the state
      e.target.style = "fill: #008f0c;";
      statesSelected.sort();
      updateStates();
    }
  }
});

var timer;

document.getElementById("copy-share").addEventListener("click", function (e) {
  navigator.clipboard.writeText(
    "I've visited " +
      document.getElementById("states-count").innerHTML +
      " U.S. states, with a total area of " +
      totalArea.toLocaleString() +
      " square km! That's " +
      ((totalArea / 9833519) * 100).toFixed(2) +
      "% of the United States!\nHow do you stack up? ⬇️\nhttps://eddyzow.net/states"
  );
  document.getElementById("copy-share").innerHTML = "Copied!";
  clearTimeout(timer);
  timer = setTimeout(() => {
    document.getElementById("copy-share").innerHTML = "Share Copy Link";
  }, 1000);
});

window.onmousemove = function (e) {
  var x = e.clientX,
    y = e.clientY;
  tooltipSpan.style.top = y + 20 + "px";
  tooltipSpan.style.left = x + "px";
};
