// =========================
// ELEMENTS
// =========================

const spaces = document.querySelectorAll(".space");
const stopButton = document.getElementById("stopButton");

const currentTeamName =
    document.getElementById("currentTeamName");

const currentScore =
    document.getElementById("currentScore");

const currentSpins =
    document.getElementById("currentSpins");

const teamButtons =
    document.querySelectorAll(".team");
const whammyOverlay =
    document.getElementById("whammyOverlay");

const whammyMessage =
    document.getElementById("whammyMessage");

const whammyScore =
    document.getElementById("whammyScore");

const returnButton =
    document.getElementById("returnButton");

const whammyCountDisplay =
    document.getElementById("whammyCountDisplay");

const teacherToggle =
    document.getElementById("teacherToggle");

const teacherPanel =
    document.getElementById("teacherPanel");

const addSpin =
    document.getElementById("addSpin");

const removeSpin =
    document.getElementById("removeSpin");

const addPoints =
    document.getElementById("addPoints");

const removePoints =
    document.getElementById("removePoints");

const stealOverlay =
    document.getElementById("stealOverlay");

const stealTargets =
    document.getElementById("stealTargets");

const cancelSteal =
    document.getElementById("cancelSteal");

const historyBonusOverlay =
    document.getElementById("historyBonusOverlay");

const historyCorrect =
    document.getElementById("historyCorrect");

const historyIncorrect =
    document.getElementById("historyIncorrect");
    
const earnSpinsScreen =
    document.getElementById("earnSpinsScreen");

const bigBoardScreen =
    document.getElementById("bigBoardScreen");

const earnTeams =
    document.getElementById("earnTeams");

const randomChallengeButton =
    document.getElementById(
        "randomChallengeButton"
    );

const goToBigBoard =
    document.getElementById(
        "goToBigBoard"
    );
const challengeOverlay =
    document.getElementById(
        "challengeOverlay"
    );

const challengeTitle =
    document.getElementById(
        "challengeTitle"
    );

const challengeDescription =
    document.getElementById(
        "challengeDescription"
    );

const closeChallenge =
    document.getElementById(
        "closeChallenge"
    );
    const setupScreen =
    document.getElementById(
        "setupScreen"
    );

const startGameButton =
    document.getElementById(
        "startGameButton"
    );

const teamCountButtons =
    document.querySelectorAll(
        ".team-count"
    );

const teamNameInputs =
    document.querySelectorAll(
        "#teamNameInputs input"
    );
    const returnToSetup =
    document.getElementById(
        "returnToSetup"
    );
// =========================
// GAME STATE
// =========================

const teams = [
    { name: "TEAM 1", score: 0, spins: 0, whammies: 0 },
    { name: "TEAM 2", score: 0, spins: 0, whammies: 0 },
    { name: "TEAM 3", score: 0, spins: 0, whammies: 0 },
    { name: "TEAM 4", score: 0, spins: 0, whammies: 0 }
];

let activeTeam = 0;
let numberOfTeams = 4;
let currentSpace = 0;

let selectorTimer = null;
let boardTimer = null;

let boardRunning = false;
let resultPending = false;


// =========================
// SPEED SETTINGS
// =========================

const selectorSpeed = 120;
const boardChangeSpeed = 850;


// =========================
// BOARD OUTCOMES
// =========================

const normalPoints = [
    "200",
    "300",
    "400",
    "500",
    "600",
    "700",
    "750",
    "800",
    "900",
    "1000"
];

const pointsAndSpins = [
    "300<br>+ SPIN",
    "500<br>+ SPIN",
    "750<br>+ SPIN",
    "1000<br>+ SPIN"
];

const specials = [
    "DOUBLE",
    "HISTORY<br>BONUS",
    "STEAL<br>500"
];


// =========================
// WEIGHTED RANDOM OUTCOME
// =========================

function getRandomOutcome() {

    const roll = Math.random() * 100;

    // 55% normal points
    if (roll < 55) {

        return normalPoints[
            Math.floor(Math.random() * normalPoints.length)
        ];
    }

    // 20% points + spin
    if (roll < 75) {

        return pointsAndSpins[
            Math.floor(Math.random() * pointsAndSpins.length)
        ];
    }

    // 15% Whammy
    if (roll < 90) {
        return "WHAMMY!";
    }

    // 10% special
    return specials[
        Math.floor(Math.random() * specials.length)
    ];
}


// =========================
// CHANGE BOARD VALUES
// =========================

function changeBoardValues() {

    spaces.forEach(function(space) {

        const outcome = getRandomOutcome();

        space.innerHTML = outcome;

        space.classList.remove("whammy-space");

        if (outcome === "WHAMMY!") {
            space.classList.add("whammy-space");
        }

    });
}


// =========================
// MOVE SELECTOR
// =========================

function moveSelector() {

    spaces[currentSpace].classList.remove("selected");

    let nextSpace;

    do {

        nextSpace =
            Math.floor(Math.random() * spaces.length);

    } while (nextSpace === currentSpace);

    currentSpace = nextSpace;

    spaces[currentSpace].classList.add("selected");
}


// =========================
// UPDATE SCOREBOARD
// =========================

function updateDisplay() {

    const team = teams[activeTeam];

    currentTeamName.textContent =
        team.name;

    currentScore.textContent =
        team.score.toLocaleString();

    currentSpins.textContent =
        team.spins;


    teamButtons.forEach(function(button, index) {

        if (index >= numberOfTeams) {

    button.style.display = "none";

    return;

} else {

    button.style.display = "";

}
        const teamData = teams[index];

        button.querySelector("strong").textContent =
            teamData.score.toLocaleString();

        button.querySelector("small").textContent =
            teamData.spins + " SPINS";

            const counter =
    button.querySelector(".whammy-counter");

let whammyDisplay = "";

for (let i = 0; i < 4; i++) {

    if (i < teamData.whammies) {
        whammyDisplay += "😈 ";
    } else {
        whammyDisplay += "○ ";
    }

}

counter.textContent =
    whammyDisplay.trim();
        button.classList.toggle(
            "active-team",
            index === activeTeam
        );

    });
}


// =========================
// START BOARD
// =========================

function startBoard() {

    const team = teams[activeTeam];

    if (selectorTimer !== null) {
        return;
    }

    if (team.spins <= 0) {
        showMessage("NO SPINS!");
        return;
    }

    resultPending = false;
    boardRunning = true;

    document.body.classList.remove(
        "board-stopped"
    );

    spaces[currentSpace].classList.add(
        "selected"
    );

    selectorTimer =
        setInterval(
            moveSelector,
            selectorSpeed
        );

    boardTimer =
        setInterval(
            changeBoardValues,
            boardChangeSpeed
        );

    stopButton.textContent = "STOP!";
}


// =========================
// STOP BOARD
// =========================

function stopBoard() {

    clearInterval(selectorTimer);
    clearInterval(boardTimer);

    selectorTimer = null;
    boardTimer = null;

    boardRunning = false;

    document.body.classList.add(
        "board-stopped"
    );

    // Every press costs one spin
    teams[activeTeam].spins--;

    const result =
        spaces[currentSpace]
            .innerText
            .replace(/\s+/g, " ")
            .trim();

    handleResult(result);

    updateDisplay();

    resultPending = true;

    stopButton.textContent = "CONTINUE";
}


// =========================
// HANDLE RESULT
// =========================

function handleResult(result) {

    const team = teams[activeTeam];

    // -------------------------
    // WHAMMY
    // -------------------------

    if (result === "WHAMMY!") {

    triggerWhammy();

    return;
}


    // -------------------------
    // POINTS + SPIN
    // -------------------------

    if (result.includes("+ SPIN")) {

        const points =
            parseInt(result);

        team.score += points;

        // Replaces the spin that was used
        team.spins++;

        showMessage(
            "+" +
            points.toLocaleString() +
            " AND A SPIN!"
        );

        return;
    }


    // -------------------------
    // NORMAL POINTS
    // -------------------------

    if (/^\d+$/.test(result)) {

        const points =
            parseInt(result);

        team.score += points;

        showMessage(
            "+" +
            points.toLocaleString() +
            " POINTS!"
        );

        return;
    }


    // -------------------------
    // DOUBLE
    // -------------------------

    if (result === "DOUBLE") {

        team.score *= 2;

        showMessage(
            "DOUBLE YOUR SCORE!"
        );

        return;
    }


    // -------------------------
// HISTORY BONUS
// -------------------------

if (result.includes("HISTORY BONUS")) {

    startHistoryBonus();

    return;
}


    // -------------------------
// STEAL 500
// -------------------------

if (result.includes("STEAL")) {

    startSteal();

    return;
}

}


// =========================
// WHAMMY TAKEOVER
// =========================

function triggerWhammy() {

    const team = teams[activeTeam];

    const startingScore = team.score;

    // Add one Whammy
    team.whammies++;

    // Generic message for now
    whammyMessage.textContent =
        "YOUR POINTS ARE HISTORY!";


    // Build the four-Whammy display
    let whammyIcons = "";

    for (let i = 0; i < 4; i++) {

        if (i < team.whammies) {

            whammyIcons += "😈 ";

        } else {

            whammyIcons += "○ ";

        }

    }

    whammyCountDisplay.textContent =
        whammyIcons.trim();


    // Put their current score on screen
    whammyScore.textContent =
        startingScore.toLocaleString();


    // Show the Whammy screen
    whammyOverlay.classList.remove(
        "hidden"
    );


    // Animate score falling to zero
    let displayedScore = startingScore;

    const totalSteps = 25;

    const decreaseAmount =
        Math.max(
            1,
            Math.ceil(
                startingScore / totalSteps
            )
        );


    const scoreDrain =
        setInterval(
            function() {

                displayedScore -=
                    decreaseAmount;

                if (displayedScore <= 0) {

                    displayedScore = 0;

                    clearInterval(
                        scoreDrain
                    );

                }

                whammyScore.textContent =
                    displayedScore.toLocaleString();

            },
            55
        );


    // Actual game score becomes zero
    team.score = 0;


    // Four Whammies = done with Big Board
    if (team.whammies >= 4) {

        team.spins = 0;

        whammyMessage.textContent =
            "FOUR WHAMMIES! YOU'RE OUT OF THE BIG BOARD ROUND!";

    }

    updateDisplay();
}


// =========================
// CENTER MESSAGE
// =========================

function showMessage(message) {
    currentTeamName.textContent =
        message;

    setTimeout(function() {

        currentTeamName.textContent =
            teams[activeTeam].name;

    }, 1800);
}


// =========================
// STOP / CONTINUE BUTTON
// =========================

stopButton.addEventListener(
    "click",
    function() {

        if (boardRunning) {

            stopBoard();

        } else {

            startBoard();

        }

    }
);


// =========================
// TEAM SELECTION
// =========================

teamButtons.forEach(
    function(button, index) {

        button.addEventListener(
            "click",
            function() {

                // Don't change teams
                // during an active spin
                if (boardRunning) {
                    return;
                }

                activeTeam = index;

                updateDisplay();
            }
        );

    }
);
// =========================
// TEACHER CONTROLS
// =========================

teacherToggle.addEventListener(
    "click",
    function() {

        teacherPanel.classList.toggle(
            "hidden"
        );

    }
);


addSpin.addEventListener(
    "click",
    function() {

        teams[activeTeam].spins++;

        updateDisplay();

    }
);


removeSpin.addEventListener(
    "click",
    function() {

        if (teams[activeTeam].spins > 0) {

            teams[activeTeam].spins--;

        }

        updateDisplay();

    }
);


addPoints.addEventListener(
    "click",
    function() {

        teams[activeTeam].score += 100;

        updateDisplay();

    }
);


removePoints.addEventListener(
    "click",
    function() {

        teams[activeTeam].score =
            Math.max(
                0,
                teams[activeTeam].score - 100
            );

        updateDisplay();

    }
);

// =========================
// STEAL 500
// =========================

function startSteal() {

    stealTargets.innerHTML = "";

   teams
    .slice(0, numberOfTeams)
    .forEach(
        function(team, index) {

            // Can't steal from yourself
            if (index === activeTeam) {
                return;
            }

            const button =
                document.createElement("button");

            button.classList.add(
                "steal-target"
            );

            button.innerHTML =
                team.name +
                "<strong>" +
                team.score.toLocaleString() +
                "</strong>";

            button.addEventListener(
                "click",
                function() {

                    completeSteal(index);

                }
            );

            stealTargets.appendChild(
                button
            );

        }
    );

    stealOverlay.classList.remove(
        "hidden"
    );
}


function completeSteal(targetIndex) {

    const thief =
        teams[activeTeam];

    const victim =
        teams[targetIndex];

    const amount =
        Math.min(
            500,
            victim.score
        );

    victim.score -= amount;

    thief.score += amount;

    stealOverlay.classList.add(
        "hidden"
    );

    updateDisplay();

    showMessage(
        "STOLE " +
        amount.toLocaleString() +
        " FROM " +
        victim.name +
        "!"
    );
}

// =========================
// HISTORY BONUS
// =========================

function startHistoryBonus() {

    historyBonusOverlay.classList.remove(
        "hidden"
    );
}


// CORRECT ANSWER
historyCorrect.addEventListener(
    "click",
    function() {

        teams[activeTeam].spins += 2;

        historyBonusOverlay.classList.add(
            "hidden"
        );

        updateDisplay();

        showMessage(
            "+2 BONUS SPINS!"
        );

    }
);


// INCORRECT ANSWER
historyIncorrect.addEventListener(
    "click",
    function() {

        historyBonusOverlay.classList.add(
            "hidden"
        );

        updateDisplay();

        showMessage(
            "NO BONUS SPINS!"
        );

    }
);

// =========================
// RETURN FROM WHAMMY
// =========================

returnButton.addEventListener(
    "click",
    function() {

        whammyOverlay.classList.add(
            "hidden"
        );

        updateDisplay();

        stopButton.textContent =
            "CONTINUE";

    }
);

// =========================
// EARN YOUR SPINS
// =========================

function buildEarnSpinsScreen() {

    earnTeams.innerHTML = "";

    const activeTeams =
        teams.slice(0, numberOfTeams);

    activeTeams.forEach(
        function(team, index) {

            const card =
                document.createElement("div");

            card.classList.add(
                "earn-team-card"
            );

            const teamName =
                document.createElement("div");

            teamName.classList.add(
                "earn-team-name"
            );

            teamName.textContent =
                team.name;


            const spinNumber =
                document.createElement("div");

            spinNumber.classList.add(
                "earn-spin-number"
            );

            spinNumber.textContent =
                team.spins;


            const spinLabel =
                document.createElement("div");

            spinLabel.classList.add(
                "earn-spin-label"
            );

            spinLabel.textContent =
                "SPINS";


            const controls =
                document.createElement("div");

            controls.classList.add(
                "earn-spin-controls"
            );


            // REMOVE ONE

            const removeButton =
                document.createElement(
                    "button"
                );

            removeButton.textContent =
                "−1";

            removeButton.classList.add(
                "remove-earned-spin"
            );

            removeButton.addEventListener(
                "click",
                function() {

                    team.spins =
                        Math.max(
                            0,
                            team.spins - 1
                        );

                    spinNumber.textContent =
                        team.spins;

                    updateDisplay();

                }
            );


            // ADD ONE

            const addOneButton =
                document.createElement(
                    "button"
                );

            addOneButton.textContent =
                "+1";

            addOneButton.addEventListener(
                "click",
                function() {

                    team.spins++;

                    spinNumber.textContent =
                        team.spins;

                    updateDisplay();

                }
            );


            // ADD TWO

            const addTwoButton =
                document.createElement(
                    "button"
                );

            addTwoButton.textContent =
                "+2";

            addTwoButton.addEventListener(
                "click",
                function() {

                    team.spins += 2;

                    spinNumber.textContent =
                        team.spins;

                    updateDisplay();

                }
            );


            controls.appendChild(
                removeButton
            );

            controls.appendChild(
                addOneButton
            );

            controls.appendChild(
                addTwoButton
            );


            card.appendChild(
                teamName
            );

            card.appendChild(
                spinNumber
            );

            card.appendChild(
                spinLabel
            );

            card.appendChild(
                controls
            );


            earnTeams.appendChild(
                card
            );

        }
    );
}
goToBigBoard.addEventListener(
    "click",
    function() {

        earnSpinsScreen.classList.add(
            "hidden"
        );

        bigBoardScreen.classList.remove(
            "hidden"
        );

        activeTeam = 0;

        updateDisplay();

        stopButton.textContent =
            "START BOARD";

    }
);
// =========================
// RANDOM CHALLENGES
// =========================

const randomChallenges = [

    {
        title: "DOUBLE DOWN",
        description:
            "The next question is worth 2 spins for every team that answers correctly."
    },

    {
        title: "HEAD-TO-HEAD",
        description:
            "Each team chooses one player. First player to answer correctly earns 2 spins for their team."
    },

    {
        title: "ALL PLAY",
        description:
            "Everybody plays. Every team that answers correctly earns 2 spins."
    },

    {
        title: "STEAL A SPIN",
        description:
            "First team to answer correctly may take 1 spin from another team."
    },

    {
        title: "PRESS YOUR KNOWLEDGE",
        description:
            "Choose a team to risk 1 spin. Correct answer earns 2 spins. Incorrect answer loses 1 spin."
    },

    {
        title: "LIGHTNING ROUND",
        description:
            "Three rapid-fire questions. Each correct answer earns 1 spin."
    }

];
randomChallengeButton.addEventListener(
    "click",
    function() {

        const randomIndex =
            Math.floor(
                Math.random() *
                randomChallenges.length
            );

        const challenge =
            randomChallenges[
                randomIndex
            ];

        challengeTitle.textContent =
            challenge.title;

        challengeDescription.textContent =
            challenge.description;

        challengeOverlay.classList.remove(
            "hidden"
        );

    }
);
closeChallenge.addEventListener(
    "click",
    function() {

        challengeOverlay.classList.add(
            "hidden"
        );

    }
);
// =========================
// GAME SETUP
// =========================

teamCountButtons.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                numberOfTeams =
                    parseInt(
                        button.dataset.count
                    );


                // Highlight selected number

                teamCountButtons.forEach(
                    function(otherButton) {

                        otherButton.classList.remove(
                            "active"
                        );

                    }
                );

                button.classList.add(
                    "active"
                );


                // Show only needed name inputs

                teamNameInputs.forEach(
                    function(input, index) {

                        input.classList.toggle(
                            "hidden",
                            index >= numberOfTeams
                        );

                    }
                );

            }
        );

    }
);
startGameButton.addEventListener(
    "click",
    function() {

        // Save team names

        for (
            let i = 0;
            i < numberOfTeams;
            i++
        ) {

            const enteredName =
                teamNameInputs[i]
                    .value
                    .trim();

            if (enteredName !== "") {

                teams[i].name =
                    enteredName.toUpperCase();

            } else {

                teams[i].name =
                    "TEAM " + (i + 1);

            }


            // Fresh game

            teams[i].score = 0;
            teams[i].spins = 0;
            teams[i].whammies = 0;

        }


        activeTeam = 0;


        // Hide setup

        setupScreen.classList.add(
            "hidden"
        );


        // Show Earn Your Spins

        earnSpinsScreen.classList.remove(
            "hidden"
        );


        buildEarnSpinsScreen();

        updateDisplay();

    }
);
function resetGame() {

    // Stop the Big Board if it happens to be running

    if (boardRunning) {
        stopBoard();
    }


    // Reset ALL team data

    teams.forEach(
        function(team) {

            team.score = 0;
            team.spins = 0;
            team.whammies = 0;

        }
    );


    // Reset active team

    activeTeam = 0;


    // Close any overlays that may be open

    challengeOverlay.classList.add(
        "hidden"
    );

    historyBonusOverlay.classList.add(
        "hidden"
    );

    stealOverlay.classList.add(
        "hidden"
    );

    whammyOverlay.classList.add(
        "hidden"
    );


    // Hide gameplay screens

    earnSpinsScreen.classList.add(
        "hidden"
    );

    bigBoardScreen.classList.add(
        "hidden"
    );


    // Return to setup

    setupScreen.classList.remove(
        "hidden"
    );


    // Reset board button

    stopButton.textContent =
        "START BOARD";


    updateDisplay();
}
returnToSetup.addEventListener(
    "click",
    function() {

        const confirmed =
            confirm(
                "Return to Game Setup?\n\n" +
                "All scores, spins, and Whammies " +
                "will be reset."
            );

        if (confirmed) {
            resetGame();
        }

    }
);
// =========================
// INITIALIZE
// =========================

changeBoardValues();

buildEarnSpinsScreen();

updateDisplay();

stopButton.textContent =
    "START BOARD";