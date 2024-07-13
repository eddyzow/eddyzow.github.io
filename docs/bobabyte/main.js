function faqclicker(num) {
  if (document.getElementById("faq-" + num).style.height == "") {
    // open
    document.getElementById("faq-clicker-" + num).classList.add("fa-rotate-90");
    document.getElementById("faq-" + num).style.height = "auto";
    document.getElementById("faq-" + num).style["overflow-y"] = "hidden";
  } else {
    // close
    document
      .getElementById("faq-clicker-" + num)
      .classList.remove("fa-rotate-90");
    document.getElementById("faq-" + num).style.height = "";
    document.getElementById("faq-" + num).style["overflow-y"] = "hidden";
  }
}
