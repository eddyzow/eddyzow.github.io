const socket = io("https://eddyzow.onrender.com/"); // Socket
particlesJS.load("particles-js", "particles.json");
minipages = ["practice-gen", "practice-unit", "submit", "about"];
var questions = JSON.parse(data);
var pt5 = 0;
var pt3 = 0;
var pt1 = 0;
var pt0 = 0;
var lastQTime = new Date().getTime();
var tpq = 0;
var qnum = 1;
var qid = 0;
var timeTaken = 0;
var lastscore = 0;
var lastq = -1;
var units = {
  time: {
    second: 1,
    minute: 60,
    hour: 3600,
    day: 86400,
    year: 31536000,
    "galactic year": 7258092970000000,
    "Planck time": 0.0000000000000000000000000000000000000000000539,
    jiffy: 0.02,
    quectosecond: 0.000000000000000000000000000001,
    rontosecond: 0.000000000000000000000000001,
    yoctosecond: 0.000000000000000000000001,
    zeptosecond: 0.000000000000000000001,
    attosecond: 0.000000000000000001,
    femtosecond: 0.000000000000001,
    picosecond: 0.000000000001,
    nanosecond: 0.000000001,
    microsecond: 0.000001,
    millisecond: 0.001,
    centisecond: 0.01,
    decisecond: 0.1,
    decasecond: 10,
    hectosecond: 100,
    kilosecond: 1000,
    megasecond: 1000000,
    gigasecond: 1000000000,
    terasecond: 1000000000000,
    petasecond: 1000000000000000,
    exasecond: 1000000000000000000,
    zettasecond: 1000000000000000000000,
    yottasecond: 1000000000000000000000000,
    ronnasecond: 1000000000000000000000000000,
    quettasecond: 1000000000000000000000000000000,
    Svedberg: 0.0000000000001,
    shake: 0.00000001,
    milliday: 86.4,
    moment: 90,
    week: 604800,
    fortnight: 1209600,
    month: 2628000,
    quarantine: 3456000,
    semester: 10886400,
    olympiad: 126144000,
    lustrum: 157680000,
    decade: 315360000,
    indiction: 473040000,
    score: 630720000,
    jubilee: 1576800000,
    century: 3153600000,
    millennium: 31536000000,
    "astrological age": 67760457120,
    megaannum: 31536000000000,
    eon: 31536000000000000,
    kalpa: 136235520000000000,
    "Callippic cycle": 2396736000,
    "Metonic cycle": 599184000,
    "traditional American workweek": 144000,
    "Sun lifetime": 315400000000000000,
    "light-foot": 0.000000001,
    microfortnight: 1.2,
    "Martian sol": 88775,
    "dog year": 220752000,
    Friedman: 15768000,
    Scaramucci: 950400,
    warhol: 900,
  },
};
if (localStorage.getItem("Fermi5Pt") == null) {
  localStorage.setItem("Fermi5Pt", 0);
}
if (localStorage.getItem("Fermi3Pt") == null) {
  localStorage.setItem("Fermi3Pt", 0);
}

if (localStorage.getItem("Fermi1Pt") == null) {
  localStorage.setItem("Fermi1Pt", 0);
}

if (localStorage.getItem("Fermi0Pt") == null) {
  localStorage.setItem("Fermi0Pt", 0);
}

if (localStorage.getItem("FermiTPQ") == null) {
  localStorage.setItem("FermiTPQ", 0);
}

function expo(x, f) {
  return Number.parseFloat(x).toExponential(f);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let k = array[i];
    array[i] = array[j];
    array[j] = k;
  }
  return array;
}

var qbank = shuffle(Object.keys(questions));

document.getElementById("questionNumber").innerHTML =
  "Question " + qnum + " of " + qbank.length;

function verifyAnswer() {
  timeTaken = new Date().getTime() - lastQTime;

  // set TPQ locally

  tpq =
    ((pt1 + pt3 + pt5 + pt0) * tpq +
      parseFloat((timeTaken / 1000).toFixed(2))) /
    (pt1 + pt3 + pt5 + pt0 + 1);

  // set TPQ lifetimely

  localStorage.setItem(
    "FermiTPQ",
    ((parseFloat(localStorage.getItem("Fermi1Pt")) +
      parseFloat(localStorage.getItem("Fermi3Pt")) +
      parseFloat(localStorage.getItem("Fermi5Pt")) +
      parseFloat(localStorage.getItem("Fermi0Pt"))) *
      parseFloat(localStorage.getItem("FermiTPQ")) +
      parseFloat((timeTaken / 1000).toFixed(2))) /
      (parseFloat(localStorage.getItem("Fermi1Pt")) +
        parseFloat(localStorage.getItem("Fermi3Pt")) +
        parseFloat(localStorage.getItem("Fermi5Pt")) +
        parseFloat(localStorage.getItem("Fermi0Pt")) +
        1)
  );

  lastQTime = new Date().getTime();

  if (
    !isNaN(
      Number.parseInt(
        document.getElementById("FermiPracticeInput").value.trim()
      )
    )
  ) {
    if (
      Math.abs(
        Number.parseInt(
          document.getElementById("FermiPracticeInput").value.trim()
        ) - questions[qbank[0]]
      ) == 0
    ) {
      // correctPrevious
      document.getElementById("mainScreen1").style =
        "border: 6px solid #49bac5";
      document.getElementById("answerFeedback").style = "color: aqua";
      document.getElementById("answerFeedback").innerHTML =
        "Correct! You got it exactly and scored 5 points! The correct answer was " +
        questions[qbank[0]] +
        ".";
      localStorage.setItem(
        "Fermi5Pt",
        Number.parseInt(localStorage.getItem("Fermi5Pt")) + 1
      );
      pt5++;
      lastscore = 5;
    } else if (
      Math.abs(
        Number.parseInt(
          document.getElementById("FermiPracticeInput").value.trim()
        ) - questions[qbank[0]]
      ) == 1
    ) {
      // +3
      document.getElementById("mainScreen1").style =
        "border: 6px solid #31b746";
      document.getElementById("answerFeedback").style = "color: lime";
      document.getElementById("answerFeedback").innerHTML =
        "You were 1 away and scored 3 points! The correct answer was " +
        questions[qbank[0]] +
        ".";
      localStorage.setItem(
        "Fermi3Pt",
        Number.parseInt(localStorage.getItem("Fermi3Pt")) + 1
      );
      pt3++;
      lastscore = 3;
    } else if (
      Math.abs(
        Number.parseInt(
          document.getElementById("FermiPracticeInput").value.trim()
        ) - questions[qbank[0]]
      ) == 2
    ) {
      // +1
      document.getElementById("mainScreen1").style =
        "border: 6px solid #c3b034";
      document.getElementById("answerFeedback").style = "color: goldenrod";
      document.getElementById("answerFeedback").innerHTML =
        "You were 2 away and scored 1 point! The correct answer was " +
        questions[qbank[0]] +
        ".";
      localStorage.setItem(
        "Fermi1Pt",
        Number.parseInt(localStorage.getItem("Fermi1Pt")) + 1
      );
      pt1++;
      lastscore = 1;
    } else {
      // wrong
      document.getElementById("mainScreen1").style =
        "border: 6px solid #b74949";
      document.getElementById("answerFeedback").style = "color: crimson";
      document.getElementById("answerFeedback").innerHTML =
        "Not quite! You were " +
        Math.abs(
          Number.parseInt(
            document.getElementById("FermiPracticeInput").value.trim()
          ) - questions[qbank[0]]
        ) +
        " off and scored 0 points. The correct answer was " +
        questions[qbank[0]] +
        ".";
      localStorage.setItem(
        "Fermi0Pt",
        Number.parseInt(localStorage.getItem("Fermi0Pt")) + 1
      );
      pt0++;
      lastscore = 0;
    }
    document.getElementById("ReportPrevious").style.visibility = "visible";
    qbank.shift();
    document.getElementById("questionText").innerHTML = qbank[0];
    qnum++;
    qid = Object.keys(questions).indexOf(qbank[0]) + 1;
    document.getElementById("questionId").innerHTML = "Question ID: " + qid;
    document.getElementById("questionNumber").innerHTML =
      "Question " + qnum + " of " + Object.keys(questions).length;
    document.getElementById("FermiPracticeInput").value = "";
    if (localStorage.getItem("FermiStatPref") == "lifetime") {
      document.getElementById("5PtAnswers").innerHTML =
        localStorage.getItem("Fermi5Pt");
      document.getElementById("3PtAnswers").innerHTML =
        localStorage.getItem("Fermi3Pt");
      document.getElementById("1PtAnswers").innerHTML =
        localStorage.getItem("Fermi1Pt");
      document.getElementById("0PtAnswers").innerHTML =
        localStorage.getItem("Fermi0Pt");
      document.getElementById("tpq").innerHTML = parseFloat(
        localStorage.getItem("FermiTPQ")
      ).toFixed(2);
      document.getElementById("ppq").innerHTML = Number.parseFloat(
        (5 * Number.parseInt(localStorage.getItem("Fermi5Pt")) +
          3 * Number.parseInt(localStorage.getItem("Fermi3Pt")) +
          1 * Number.parseInt(localStorage.getItem("Fermi1Pt"))) /
          (Number.parseInt(localStorage.getItem("Fermi5Pt")) +
            Number.parseInt(localStorage.getItem("Fermi3Pt")) +
            Number.parseInt(localStorage.getItem("Fermi1Pt")) +
            Number.parseInt(localStorage.getItem("Fermi0Pt")))
      ).toFixed(2);
    } else {
      localStorage.setItem("FermiStatPref", "session");
      document.getElementById("tpq").innerHTML = tpq.toFixed(2);
      document.getElementById("5PtAnswers").innerHTML = pt5;
      document.getElementById("3PtAnswers").innerHTML = pt3;
      document.getElementById("1PtAnswers").innerHTML = pt1;
      document.getElementById("0PtAnswers").innerHTML = pt0;
      document.getElementById("ppq").innerHTML = (
        Math.round(
          ((5 * pt5 + 3 * pt3 + 1 * pt1) / (pt5 + pt3 + pt1 + pt0)) * 100
        ) / 100
      ).toFixed(2);
    }
  } else {
    document.getElementById("answerFeedback").innerHTML =
      "Make sure your answer is a number before you submit!";
  }
}

function verifyAnswer2() {
  if (
    !isNaN(
      Number.parseInt(document.getElementById("FermiUnitInput").value.trim())
    )
  ) {
    if (
      Math.abs(
        Number.parseInt(
          document.getElementById("FermiUnitInput").value.trim()
        ) - chosenAnswer
      ) == 0
    ) {
      // correctPrevious
      document.getElementById("mainScreen2").style =
        "border: 6px solid #49bac5";
      document.getElementById("unitFeedback").style = "color: aqua";
      document.getElementById("unitFeedback").innerHTML =
        "Correct! You got it exactly and scored 5 points! The correct answer was " +
        chosenAnswer +
        ".";
    } else if (
      Math.abs(
        Number.parseInt(
          document.getElementById("FermiUnitInput").value.trim()
        ) - chosenAnswer
      ) == 1
    ) {
      // +3
      document.getElementById("mainScreen2").style =
        "border: 6px solid #31b746";
      document.getElementById("unitFeedback").style = "color: lime";
      document.getElementById("unitFeedback").innerHTML =
        "You were 1 away and scored 3 points! The correct answer was " +
        chosenAnswer +
        ".";
    } else if (
      Math.abs(
        Number.parseInt(
          document.getElementById("FermiUnitInput").value.trim()
        ) - chosenAnswer
      ) == 2
    ) {
      // +1
      document.getElementById("mainScreen2").style =
        "border: 6px solid #c3b034";
      document.getElementById("unitFeedback").style = "color: goldenrod";
      document.getElementById("unitFeedback").innerHTML =
        "You were 2 away and scored 1 point! The correct answer was " +
        chosenAnswer +
        ".";
    } else {
      // wrong
      document.getElementById("mainScreen2").style =
        "border: 6px solid #b74949";
      document.getElementById("unitFeedback").style = "color: crimson";
      document.getElementById("unitFeedback").innerHTML =
        "Not quite! You were " +
        Math.abs(
          Number.parseInt(
            document.getElementById("FermiUnitInput").value.trim()
          ) - chosenAnswer
        ) +
        " off and scored 0 points. The correct answer was " +
        chosenAnswer +
        ".";
    }

    chosenUnitObj =
      units[
        Object.keys(units)[
          Math.floor(Math.random() * Object.keys(units).length + 1) - 1
        ]
      ];

    chosenUnitList =
      //chosenUnitList[
      shuffle(Object.keys(chosenUnitObj));
    // ]
    document.getElementById("questionText2").innerHTML =
      "How many " + chosenUnitList[0] + "s are in a " + chosenUnitList[1] + "?";

    chosenAnswer = expo(
      chosenUnitObj[chosenUnitList[1]] / chosenUnitObj[chosenUnitList[0]]
    ).split("e");
    if (Number.parseInt(chosenAnswer[0].charAt(0)) >= 5) {
      chosenAnswer = Number.parseInt(chosenAnswer[1]) + 1;
    } else {
      chosenAnswer = Number.parseInt(chosenAnswer[1]);
    }

    document.getElementById("FermiUnitInput").value = "";
  } else {
    document.getElementById("unitFeedback").innerHTML =
      "Make sure your answer is a number before you submit!";
  }
}

document.getElementById("ReportQuestion").onclick = function () {
  let inputReport = prompt(
    "Why are you reporting Q#" +
      qid +
      "? Include the issue with the problem and/or what you think the correct answer is in your response. Submitting this will automatically skip the question. You may see it again in the future; in that case, just submit another report."
  );
  console.log(inputReport);
  if (inputReport != null && inputReport.trim() != "") {
    socket.emit("reportQuestion", {
      qid: qid,
      qtext: qbank[0],
      rtext: inputReport,
    });
  }
};

document.getElementById("ReportPrevious").onclick = function () {
  if (lastq == -1) {
    alert("Error: no previous question to report");
  } else {
    let inputReport = prompt(
      "Why are you reporting Q#" +
        lastq +
        "? Include the issue with the problem and/or what you think the correct answer is in your response. The change to your statistics made by the erroneous question will be undone."
    );
    console.log(inputReport);
    if (inputReport != null && inputReport.trim() != "") {
      socket.emit("reportQuestion2", {
        qid: lastq,
        qtext: qbank[lastq],
        rtext: inputReport,
      });
      document.getElementById("ReportPrevious").style.visibility = "hidden";

      // fix stats
      if (lastscore == 1) {
        pt1--;
        localStorage.setItem(
          "Fermi1Pt",
          Number.parseInt(localStorage.getItem("Fermi1Pt")) - 1
        );
      }
      if (lastscore == 3) {
        pt3--;
        localStorage.setItem(
          "Fermi3Pt",
          Number.parseInt(localStorage.getItem("Fermi3Pt")) - 1
        );
      }
      if (lastscore == 5) {
        pt5--;
        localStorage.setItem(
          "Fermi5Pt",
          Number.parseInt(localStorage.getItem("Fermi5Pt")) - 1
        );
      }
      if (lastscore == 0) {
        pt0--;
        localStorage.setItem(
          "Fermi0Pt",
          Number.parseInt(localStorage.getItem("Fermi0Pt")) - 1
        );
      }
      if (localStorage.getItem("FermiStatPref") == "lifetime") {
        document.getElementById("5PtAnswers").innerHTML =
          localStorage.getItem("Fermi5Pt");
        document.getElementById("3PtAnswers").innerHTML =
          localStorage.getItem("Fermi3Pt");
        document.getElementById("1PtAnswers").innerHTML =
          localStorage.getItem("Fermi1Pt");
        document.getElementById("0PtAnswers").innerHTML =
          localStorage.getItem("Fermi0Pt");
        document.getElementById("ppq").innerHTML = Number.parseFloat(
          (5 * Number.parseInt(localStorage.getItem("Fermi5Pt")) +
            3 * Number.parseInt(localStorage.getItem("Fermi3Pt")) +
            1 * Number.parseInt(localStorage.getItem("Fermi1Pt"))) /
            (Number.parseInt(localStorage.getItem("Fermi5Pt")) +
              Number.parseInt(localStorage.getItem("Fermi3Pt")) +
              Number.parseInt(localStorage.getItem("Fermi1Pt")) +
              Number.parseInt(localStorage.getItem("Fermi0Pt")))
        ).toFixed(2);
      } else {
        localStorage.setItem("FermiStatPref", "session");
        document.getElementById("5PtAnswers").innerHTML = pt5;
        document.getElementById("3PtAnswers").innerHTML = pt3;
        document.getElementById("1PtAnswers").innerHTML = pt1;
        document.getElementById("0PtAnswers").innerHTML = pt0;
        document.getElementById("ppq").innerHTML = (
          Math.round(
            ((5 * pt5 + 3 * pt3 + 1 * pt1) / (pt5 + pt3 + pt1 + pt0)) * 100
          ) / 100
        ).toFixed(2);
      }
    }
  }
};

socket.on("fermiFeedbackSent3", (data) => {
  alert("Thanks for submitting a report! This question will be skipped.");
  qbank.shift();
  document.getElementById("questionText").innerHTML = qbank[0];
  qnum++;
  qid = Object.keys(questions).indexOf(qbank[0]) + 1;
  document.getElementById("questionId").innerHTML = "Question ID: " + qid;
  document.getElementById("questionNumber").innerHTML =
    "Question " + qnum + " of " + Object.keys(questions).length;
  document.getElementById("FermiPracticeInput").value = "";
  document.getElementById("answerFeedback").innerHTML =
    "You reported and skipped the last question!";
});

socket.on("fermiFeedbackSent4", (data) => {
  alert("Thanks for submitting a report!");
});

document.getElementById("resetStats").onclick = function () {
  if (
    confirm(
      "Are you sure you want to reset your lifetime stats? This cannot be undone!"
    )
  ) {
    localStorage.setItem("Fermi0Pt", 0);
    localStorage.setItem("Fermi1Pt", 0);
    localStorage.setItem("Fermi3Pt", 0);
    localStorage.setItem("Fermi5Pt", 0);
    localStorage.setItem("FermiTPQ", 0);
    document.getElementById("5PtAnswers").innerHTML =
      localStorage.getItem("Fermi5Pt");
    document.getElementById("3PtAnswers").innerHTML =
      localStorage.getItem("Fermi3Pt");
    document.getElementById("1PtAnswers").innerHTML =
      localStorage.getItem("Fermi1Pt");
    document.getElementById("0PtAnswers").innerHTML =
      localStorage.getItem("Fermi0Pt");
    document.getElementById("ppq").innerHTML = Number.parseFloat(
      (5 * Number.parseInt(localStorage.getItem("Fermi5Pt")) +
        3 * Number.parseInt(localStorage.getItem("Fermi3Pt")) +
        1 * Number.parseInt(localStorage.getItem("Fermi1Pt"))) /
        (Number.parseInt(localStorage.getItem("Fermi5Pt")) +
          Number.parseInt(localStorage.getItem("Fermi3Pt")) +
          Number.parseInt(localStorage.getItem("Fermi1Pt")) +
          Number.parseInt(localStorage.getItem("Fermi0Pt")))
    ).toFixed(2);
  }
};

document.getElementById("statSwitch").onclick = function () {
  if (localStorage.getItem("FermiStatPref") == "lifetime") {
    localStorage.setItem("FermiStatPref", "session");
    document.getElementById("statName").innerHTML = "Session Stats";
    document.getElementById("statSwitch").innerHTML =
      "Switch to Lifetime Stats";
    document.getElementById("5PtAnswers").innerHTML = pt5;
    document.getElementById("3PtAnswers").innerHTML = pt3;
    document.getElementById("1PtAnswers").innerHTML = pt1;
    document.getElementById("0PtAnswers").innerHTML = pt0;
    document.getElementById("tpq").innerHTML = tpq.toFixed(2);
    document.getElementById("ppq").innerHTML = (
      Math.round(
        ((5 * pt5 + 3 * pt3 + 1 * pt1) / (pt5 + pt3 + pt1 + pt0)) * 100
      ) / 100
    ).toFixed(2);
    // change to session
  } else {
    localStorage.setItem("FermiStatPref", "lifetime");
    document.getElementById("statName").innerHTML = "Lifetime Stats";
    document.getElementById("statSwitch").innerHTML = "Switch to Session Stats";
    document.getElementById("5PtAnswers").innerHTML =
      localStorage.getItem("Fermi5Pt");
    document.getElementById("3PtAnswers").innerHTML =
      localStorage.getItem("Fermi3Pt");
    document.getElementById("1PtAnswers").innerHTML =
      localStorage.getItem("Fermi1Pt");
    document.getElementById("0PtAnswers").innerHTML =
      localStorage.getItem("Fermi0Pt");
    document.getElementById("tpq").innerHTML = parseFloat(
      localStorage.getItem("FermiTPQ")
    ).toFixed(2);
    document.getElementById("ppq").innerHTML = Number.parseFloat(
      (5 * Number.parseInt(localStorage.getItem("Fermi5Pt")) +
        3 * Number.parseInt(localStorage.getItem("Fermi3Pt")) +
        1 * Number.parseInt(localStorage.getItem("Fermi1Pt"))) /
        (Number.parseInt(localStorage.getItem("Fermi5Pt")) +
          Number.parseInt(localStorage.getItem("Fermi3Pt")) +
          Number.parseInt(localStorage.getItem("Fermi1Pt")) +
          Number.parseInt(localStorage.getItem("Fermi0Pt")))
    ).toFixed(2);
    // change to lifetime
  }
};

if (localStorage.getItem("FermiStatPref") == "lifetime") {
  document.getElementById("statName").innerHTML = "Lifetime Stats";
  document.getElementById("statSwitch").innerHTML = "Switch to Session Stats";
  document.getElementById("5PtAnswers").innerHTML =
    localStorage.getItem("Fermi5Pt");
  document.getElementById("3PtAnswers").innerHTML =
    localStorage.getItem("Fermi3Pt");
  document.getElementById("1PtAnswers").innerHTML =
    localStorage.getItem("Fermi1Pt");
  document.getElementById("0PtAnswers").innerHTML =
    localStorage.getItem("Fermi0Pt");
  document.getElementById("tpq").innerHTML = parseFloat(
    localStorage.getItem("FermiTPQ")
  ).toFixed(2);
  document.getElementById("ppq").innerHTML = Number.parseFloat(
    (5 * Number.parseInt(localStorage.getItem("Fermi5Pt")) +
      3 * Number.parseInt(localStorage.getItem("Fermi3Pt")) +
      1 * Number.parseInt(localStorage.getItem("Fermi1Pt"))) /
      (Number.parseInt(localStorage.getItem("Fermi5Pt")) +
        Number.parseInt(localStorage.getItem("Fermi3Pt")) +
        Number.parseInt(localStorage.getItem("Fermi1Pt")) +
        Number.parseInt(localStorage.getItem("Fermi0Pt")))
  ).toFixed(2);
} else {
  document.getElementById("statName").innerHTML = "Session Stats";
  document.getElementById("statSwitch").innerHTML = "Switch to Lifetime Stats";
  document.getElementById("5PtAnswers").innerHTML = pt5;
  document.getElementById("3PtAnswers").innerHTML = pt3;
  document.getElementById("1PtAnswers").innerHTML = pt1;
  document.getElementById("0PtAnswers").innerHTML = pt0;
  document.getElementById("tpq").innerHTML = tpq.toFixed(2);
  document.getElementById("ppq").innerHTML = (
    Math.round(
      ((5 * pt5 + 3 * pt3 + 1 * pt1) / (pt5 + pt3 + pt1 + pt0)) * 100
    ) / 100
  ).toFixed(2);
}

document.getElementById("submitAnswer").onclick = function () {
  lastq = qid;
  verifyAnswer();
};

document
  .getElementById("FermiPracticeInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      lastq = qid;

      verifyAnswer();
    }
  });

document
  .getElementById("FermiUnitInput")
  .addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      verifyAnswer2();
    }
  });

document.getElementById("submitUnit").onclick = function () {
  verifyAnswer2();
};

document.getElementById("questionText").innerHTML = qbank[0];
qid = Object.keys(questions).indexOf(qbank[0]) + 1;
document.getElementById("questionId").innerHTML = "Question ID: " + qid;

document.getElementById("submitQuestion").onclick = function () {
  if (
    document.getElementById("questionFeedbackInput").value.trim() != "" &&
    document.getElementById("questionFeedbackInput").value.trim().length > 10
  ) {
    socket.emit(
      "fermiSubmitQuestion",
      document.getElementById("questionFeedbackInput").value
    );
    document.getElementById("questionFeedbackInput").remove();
    document.getElementById("submitQuestion").remove();
  } else {
    document.getElementById("questionSubmitConfirm").innerHTML =
      "Make sure your message has at least 10 characters!";
    document.getElementById("questionSubmitConfirm").style.opacity = "100";
    setTimeout(function () {
      document.getElementById("questionSubmitConfirm").style.opacity = "0";
    }, 3000);
  }
};

document.getElementById("submitFeedback").onclick = function () {
  if (
    document.getElementById("genFeedbackInput").value.trim() != "" &&
    document.getElementById("genFeedbackInput").value.trim().length > 25
  ) {
    socket.emit(
      "fermiSubmitFeedback",
      document.getElementById("genFeedbackInput").value
    );
    document.getElementById("genFeedbackInput").remove();
    document.getElementById("submitFeedback").remove();
  } else {
    document.getElementById("feedbackSubmitConfirm").innerHTML =
      "Make sure your message has at least 25 characters!";
    document.getElementById("feedbackSubmitConfirm").style.opacity = "100";
    setTimeout(function () {
      document.getElementById("feedbackSubmitConfirm").style.opacity = "0";
    }, 3000);
  }
};

[...document.getElementsByClassName("header-item")].forEach((el) => {
  el.onclick = function () {
    [...document.getElementsByClassName("header-item")].forEach((el2) => {
      el2.classList.remove("selected");
    });
    el.classList.add("selected");
    window.location.hash = minipages[el.id.split("header")[1] - 1];
    document.getElementById("main-carrier").style.left =
      "-" + (el.id.split("header")[1] * 100 - 100) + "vw";
  };
});

socket.on("fermiFeedbackReceived1", (data) => {
  console.log(data);
  document.getElementById("questionSubmitConfirm").innerHTML =
    "Thanks for submitting feedback! Sorry about having to enter questions one at a time - this is a small addition to prevent spam. You can add a new question when you reload the page.";
  document.getElementById("questionSubmitConfirm").style.opacity = "100";
});

socket.on("fermiFeedbackReceived2", (data) => {
  console.log(data);
  document.getElementById("feedbackSubmitConfirm").innerHTML =
    "Thanks for submitting feedback!";
  document.getElementById("feedbackSubmitConfirm").style.opacity = "100";
});

window.onload = () => {
  try {
    console.log(minipages.indexOf(window.location.hash.split("#")[1]));
    [...document.getElementsByClassName("header-item")].forEach((el2) => {
      el2.classList.remove("selected");
    });
    document
      .getElementById(
        "header" + (minipages.indexOf(window.location.hash.split("#")[1]) + 1)
      )
      .classList.add("selected");
    document.getElementById("main-carrier").style.left =
      "-" +
      ((minipages.indexOf(window.location.hash.split("#")[1]) + 1) * 100 -
        100) +
      "vw";
  } catch {
    window.location.hash = "practice-gen";
    [...document.getElementsByClassName("header-item")].forEach((el2) => {
      el2.classList.remove("selected");
    });
    document.getElementById("header1").classList.add("selected");
  }
};

// UNITS

console.log(Object.keys(units).length);
var chosenUnitObj =
  units[
    Object.keys(units)[
      Math.floor(Math.random() * Object.keys(units).length + 1) - 1
    ]
  ];

var chosenUnitList =
  //chosenUnitList[
  shuffle(Object.keys(chosenUnitObj));
// ]
document.getElementById("questionText2").innerHTML =
  "How many " + chosenUnitList[0] + "s are in a " + chosenUnitList[1] + "?";

var chosenAnswer = expo(
  chosenUnitObj[chosenUnitList[1]] / chosenUnitObj[chosenUnitList[0]]
).split("e");
if (Number.parseInt(chosenAnswer[0].charAt(0)) >= 5) {
  chosenAnswer = Number.parseInt(chosenAnswer[1]) + 1;
} else {
  chosenAnswer = Number.parseInt(chosenAnswer[1]);
}
// Math.floor( Math.random() * 7 + 1)
