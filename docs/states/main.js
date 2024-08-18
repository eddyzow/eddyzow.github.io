var tooltipSpan = document.getElementById("details-box");

document.addEventListener("mouseover", function (e) {
  if (e.target.tagName == "path") {
    var content = e.target.dataset.name;
    document.getElementById("details-box").innerHTML = content;
    document.getElementById("details-box").style.opacity = "100%";
  } else {
    document.getElementById("details-box").style.opacity = "0%";
  }
});

document.addEventListener("click", function (e) {
  if (e.target.tagName == "path") {
    var content = e.target.dataset.name;
    e.target.style = "fill: #008f0c;";
    console.log(e.target.style);
  }
});

window.onmousemove = function (e) {
  var x = e.clientX,
    y = e.clientY;
  tooltipSpan.style.top = y + 20 + "px";
  tooltipSpan.style.left = x + "px";
};
