var tooltipSpan = document.getElementById("details-box");
var statesSelected = [];
var statesTotal = [];

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
  }
  document.getElementById("states-count").innerHTML = numStates;
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

window.onmousemove = function (e) {
  var x = e.clientX,
    y = e.clientY;
  tooltipSpan.style.top = y + 20 + "px";
  tooltipSpan.style.left = x + "px";
};
