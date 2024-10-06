document.addEventListener("DOMContentLoaded", function () {
  const timeLeftEl = document.getElementById("time-left");
  const currentScoreEl = document.getElementById("current-score");
  const startTimerBtn = document.getElementById("start-timer");
  const resetTimerBtn = document.getElementById("reset-timer");
  const competitorsList = document.getElementById("competitors-list");
  const addCompetitorBtn = document.getElementById("add-competitor");
  const competitorNameInput = document.getElementById("competitor-name");

  let timer;
  let scoreTimer; // Separate timer for score decrement
  let timeLeft = 600; // 10 minutes in seconds
  let currentScore = 1200; // Starting score
  let timerRunning = false;

  // Function to update the timer display
  function updateTime() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timeLeftEl.textContent = `${minutes}:${seconds
      .toString()
      .padStart(2, "0")}`;
    currentScoreEl.textContent = currentScore;
  }

  // Function to start or stop the timer
  function toggleTimer() {
    if (timerRunning) {
      clearInterval(timer);
      clearInterval(scoreTimer); // Stop score decrement
      timerRunning = false;
      startTimerBtn.textContent = "Start Timer";
    } else {
      timer = setInterval(function () {
        if (timeLeft > 0) {
          timeLeft--; // Decrease time every second
          updateTime();
        } else {
          clearInterval(timer);
        }
      }, 1000); // Update every second

      scoreTimer = setInterval(function () {
        if (currentScore > 0 && timeLeft > 0) {
          currentScore--; // Decrease score every 0.5 seconds
          updateTime();
        }
      }, 500); // Score decreases every 0.5 seconds

      timerRunning = true;
      startTimerBtn.textContent = "Stop Timer";
    }
  }

  // Function to reset the timer
  function resetTimer() {
    clearInterval(timer);
    clearInterval(scoreTimer);
    timeLeft = 600; // Reset to 10 minutes
    currentScore = 1200; // Reset score
    updateTime();
    timerRunning = false;
    startTimerBtn.textContent = "Start Timer";
  }

  // Function to create a new competitor
  function createCompetitor(name) {
    const competitorDiv = document.createElement("div");
    competitorDiv.classList.add("competitor");

    const nameEl = document.createElement("div");
    nameEl.classList.add("name");
    nameEl.textContent = name;
    competitorDiv.appendChild(nameEl);

    const scoreEl = document.createElement("input");
    scoreEl.setAttribute("type", "text");
    scoreEl.setAttribute("readonly", true);
    competitorDiv.appendChild(scoreEl);

    const showScoreBtn = document.createElement("button");
    showScoreBtn.textContent = "Show Score";
    showScoreBtn.addEventListener("click", function () {
      scoreEl.value = currentScore + " - " + (600 - timeLeft);
    });
    competitorDiv.appendChild(showScoreBtn);

    const confirmBtn = document.createElement("button");
    confirmBtn.textContent = "Confirm";
    confirmBtn.addEventListener("click", function () {
      if (confirmBtn.textContent === "Confirm") {
        competitorDiv.classList.add("confirmed");
        confirmBtn.textContent = "Unconfirm";
      } else {
        competitorDiv.classList.remove("confirmed");
        confirmBtn.textContent = "Confirm";
      }
    });
    competitorDiv.appendChild(confirmBtn);

    const deleteBtn = document.createElement("button"); // Add delete button
    deleteBtn.textContent = "Delete";
    deleteBtn.style.backgroundColor = "red";
    deleteBtn.addEventListener("click", function () {
      competitorDiv.remove(); // Remove competitor div
    });
    competitorDiv.appendChild(deleteBtn);

    competitorsList.appendChild(competitorDiv);
  }

  // Add competitor from input
  addCompetitorBtn.addEventListener("click", function () {
    const competitorName = competitorNameInput.value.trim();
    if (competitorName) {
      createCompetitor(competitorName);
      competitorNameInput.value = "";
    }
  });

  // Event listeners for timer control buttons
  startTimerBtn.addEventListener("click", toggleTimer);
  resetTimerBtn.addEventListener("click", resetTimer);

  // Initial time and score update
  updateTime();
});
