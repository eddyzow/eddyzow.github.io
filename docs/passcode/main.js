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
