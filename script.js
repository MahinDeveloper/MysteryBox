/* 1. GAME DATA */
const games = {

    detective: {
        name: "🕵️ Detective Mystery",
        levels: [
            {
                question: "A diamond disappeared. The camera shows the suspect wearing a black coat. Who is most suspicious?",
                options: [
                    "Mr. Brown - black coat",
                    "Mr. White - white shirt",
                    "Mr. Green - green jacket"
                ],
                answer: 0,
                clue: "Look carefully at what the camera recorded."
            },
            {
                question: "The detective found a wet footprint near the broken window. Which clue is most useful?",
                options: [
                    "A dry book",
                    "A wet shoe print",
                    "An old painting"
                ],
                answer: 1,
                clue: "The important clue is connected to water."
            },
            {
                question: "Where should the detective search for valuable objects?",
                options: [
                    "Library",
                    "Treasure Room",
                    "Garden"
                ],
                answer: 1,
                clue: "Think about where valuable objects are normally kept."
            },
            {
                question: "The detective found a mysterious letter with a hidden message. What should he do first?",
                options: [
                    "Throw it away",
                    "Ignore it",
                    "Read the letter carefully"
                ],
                answer: 2,
                clue: "Important clues are often hidden in letters."
            }
        ]
    },

    codebreaker: {
        name: "🔐 Code Breaker",
        levels: [
            {
                question: "What number comes next? 2, 4, 6, 8, ?",
                options: ["10", "9", "12"],
                answer: 0,
                clue: "The numbers increase by 2."
            },
            {
                question: "What number comes next? 5, 10, 15, 20, ?",
                options: ["30", "22", "25"],
                answer: 2,
                clue: "Add 5 each time."
            },
            {
                question: "What is the secret code? 3 + 4 × 2",
                options: ["14", "11", "10"],
                answer: 1,
                clue: "Remember the normal mathematical order."
            },
            {
                question: "What is the next number? 1, 4, 9, 16, ?",
                options: ["25", "20", "30"],
                answer: 0,
                clue: "These are square numbers."
            }
        ]
    },

    riddle: {
        name: "🧩 Riddle Challenge",
        levels: [
            {
                question: "I have keys but cannot open locks. What am I?",
                options: ["Door", "Keyboard", "Bottle"],
                answer: 1,
                clue: "You use it while typing."
            },
            {
                question: "I have hands but cannot clap. What am I?",
                options: ["Clock", "Robot", "Chair"],
                answer: 0,
                clue: "You use me to know the time."
            },
            {
                question: "I speak without a mouth and hear without ears. What am I?",
                options: ["Book", "Table", "Echo"],
                answer: 2,
                clue: "You can hear it after making a sound."
            },
            {
                question: "What has a face and two hands but no arms or legs?",
                options: ["Book", "Clock", "Chair"],
                answer: 1,
                clue: "You can tell the time with it."
            }
        ]
    },

    hiddenobject: {
        name: "🔎 Hidden Object",
        levels: [
            {
                question: "Which object is usually used to unlock a door?",
                options: ["📚 Book", "🔑 Key", "☕ Cup"],
                answer: 1,
                clue: "Something that opens a lock."
            },
            {
                question: "Which object can be used to see your reflection?",
                options: ["📦 Box", "🪞 Mirror", "✏️ Pencil"],
                answer: 1,
                clue: "Look for an object that reflects light."
            },
            {
                question: "Which object is used to tell time?",
                options: ["🎒 Bag", "🧸 Toy", "🕒 Clock"],
                answer: 2,
                clue: "You can find the current time on it."
            },
            {
                question: "Which object is used to write on paper?",
                options: ["✏️ Pencil", "📚 Book", "☕ Cup"],
                answer: 0,
                clue: "You use it to write or draw."
            }
        ]
    }

};


/* 2. SHOW MESSAGE */

function showMessage(text, type) {
    const old = document.querySelector(".message-box");
    if (old) old.remove();

    const box = document.createElement("div");
    box.className = "message-box " + (type || "info");
    box.textContent = text;
    document.body.appendChild(box);

    setTimeout(function() {
        box.remove();
    }, 3000);
}


/* 3. DATA FUNCTIONS (Per-Game Hints) */

function getData() {
    const saved = localStorage.getItem("mysteryBoxGameData");
    if (saved) return JSON.parse(saved);
    return {
        totalScore: 0,
        games: {
            detective: { completed: 0, score: 0, hintsUsed: 0 },
            codebreaker: { completed: 0, score: 0, hintsUsed: 0 },
            riddle: { completed: 0, score: 0, hintsUsed: 0 },
            hiddenobject: { completed: 0, score: 0, hintsUsed: 0 }
        }
    };
}

function saveData(data) {
    localStorage.setItem("mysteryBoxGameData", JSON.stringify(data));
}


/* 4. PAGE PROTECTION */

const protectedPages = ["index.html", "games.html", "scoreboard.html", "result.html", "about.html"];

if (protectedPages.includes(location.pathname.split("/").pop()) && localStorage.getItem("mysteryBoxLoggedIn") !== "true") {
    location.replace("auth.html");
}


/* 5. BECOME A DETECTIVE (Multiple Users) */

const detectiveForm = document.getElementById("detectiveForm");

if (detectiveForm) {
    detectiveForm.addEventListener("submit", function(e) {
        e.preventDefault();

        const name = document.getElementById("detectiveName").value.trim();
        const code = document.getElementById("mysteryCode").value;

        if (name.length < 2) {
            showMessage("❌ Name must be at least 2 characters.", "error");
            return;
        }

        if (code.length < 6) {
            showMessage("❌ Mystery code must be at least 6 characters.", "error");
            return;
        }

        let users = JSON.parse(localStorage.getItem("mysteryBoxUsers")) || [];

        const nameExists = users.find(function(u) {
            return u.name === name;
        });

        if (nameExists) {
            if (nameExists.code === code) {
                localStorage.setItem("mysteryBoxLoggedIn", "true");
                localStorage.setItem("mysteryBoxName", name);
                showMessage("✅ Welcome back, Detective " + name + "!", "success");
                setTimeout(function() {
                    location.replace("index.html");
                }, 1500);
            } else {
                showMessage("❌ Wrong code! This name is already taken.", "error");
            }
        } else {
            users.push({ name: name, code: code });
            localStorage.setItem("mysteryBoxUsers", JSON.stringify(users));
            localStorage.setItem("mysteryBoxLoggedIn", "true");
            localStorage.setItem("mysteryBoxName", name);
            showMessage("🎉 Welcome, Detective " + name + "!", "success");
            setTimeout(function() {
                location.replace("index.html");
            }, 1500);
        }
    });
}


/* 6. LOGOUT */

const logoutButton = document.getElementById("logoutButton");

if (logoutButton) {
    logoutButton.addEventListener("click", function() {
        localStorage.setItem("mysteryBoxLoggedIn", "false");
        showMessage("👋 Logged out successfully!", "success");
        setTimeout(function() {
            location.replace("auth.html");
        }, 1000);
    });
}


/* 7. GAME VARIABLES */

let currentGame = "";
let currentLevel = 0;
let selectedAnswer = null;
let timeLeft = 30;
let timer = null;
let hints = 0;


/*  8. START GAME */

function startGame(gameName, levelNumber) {
    currentGame = gameName;
    currentLevel = levelNumber - 1;
    selectedAnswer = null;
    hints = 0;

    if (!games[gameName]) return;

    createGameArea();
    showQuestion();
}


/* 9. CREATE GAME AREA */

function createGameArea() {
    let area = document.getElementById("gameArea");

    if (!area) {
        area = document.createElement("section");
        area.id = "gameArea";
        document.querySelector("main").appendChild(area);
    }

    area.scrollIntoView({ behavior: "smooth" });
}


/* 10. SHOW QUESTION */

function showQuestion() {
    const game = games[currentGame];
    const level = game.levels[currentLevel];
    const area = document.getElementById("gameArea");

    if (!level || !area) return;

    area.innerHTML = `
        <h2>${game.name} - Level ${currentLevel + 1}</h2>

        <p id="gameTimer">⏱️ Time Left: <strong>30</strong> seconds</p>

        <h3>${level.question}</h3>

        <div class="answer-options">
            ${level.options.map((option, index) => `
                <label>
                    <input type="radio" name="answer" value="${index}">
                    ${option}
                </label>
            `).join("")}
        </div>

        <button id="hintButton">💡 Get Clue (-20 Points)</button>
        <button id="submitButton">✅ Submit Answer</button>
    `;

    document.querySelectorAll('input[name="answer"]').forEach(input => {
        input.addEventListener("change", function() {
            selectedAnswer = Number(this.value);
        });
    });

    document.getElementById("hintButton").addEventListener("click", useHint);
    document.getElementById("submitButton").addEventListener("click", checkAnswer);

    startTimer();
}


/* 11. TIMER */

function startTimer() {
    clearInterval(timer);
    timeLeft = 30;
    updateTimer();

    timer = setInterval(function() {
        timeLeft--;
        updateTimer();

        if (timeLeft <= 0) {
            clearInterval(timer);
            showMessage("⏰ Time's Up! Try again.", "error");
            startGame(currentGame, currentLevel + 1);
        }
    }, 1000);
}

function updateTimer() {
    const timerElement = document.getElementById("gameTimer");
    if (timerElement) {
        timerElement.innerHTML = `⏱️ Time Left: <strong>${timeLeft}</strong> seconds`;
    }
}


/* 12. CHECK ANSWER */

function checkAnswer() {
    if (selectedAnswer === null) {
        showMessage("⚠️ Please select an answer first!", "info");
        return;
    }

    const game = games[currentGame];
    const level = game.levels[currentLevel];

    if (selectedAnswer === level.answer) {
        clearInterval(timer);

        let points = 100;

        if (timeLeft >= 20) {
            points += 20;
        } else if (timeLeft >= 10) {
            points += 10;
        }

        points -= hints * 20;

        if (points < 10) {
            points = 10;
        }

        addScore(points);

        const data = getData();
        data.games[currentGame].completed++;
        saveData(data);

        saveResult(points);

        if (currentLevel < 3) {
            showMessage(`🎉 Correct! +${points} Points — Level ${currentLevel + 2} Unlocked!`, "success");
        } else {
            showMessage(`🏆 Game Completed! +${points} Points`, "success");
        }

        setTimeout(function() {
            location.replace("result.html");
        }, 1500);

    } else {
        const data = getData();
        data.totalScore = Math.max(0, data.totalScore - 10);
        saveData(data);

        showMessage("❌ Wrong Answer! -10 points deducted.", "error");
    }
}


/* 13. HINT (Per-Game Counter) */

function useHint() {
    const level = games[currentGame].levels[currentLevel];

    hints++;

    const data = getData();
    data.games[currentGame].hintsUsed++;
    data.totalScore = Math.max(0, data.totalScore - 20);
    saveData(data);

    const area = document.getElementById("gameArea");
    if (area) {
        let clueBox = document.getElementById("clueBox");
        if (!clueBox) {
            clueBox = document.createElement("p");
            clueBox.id = "clueBox";
            clueBox.style.background = "#163d2b";
            clueBox.style.color = "#2ecc71";
            clueBox.style.padding = "12px";
            clueBox.style.borderRadius = "6px";
            clueBox.style.marginTop = "15px";
            clueBox.style.borderLeft = "3px solid #2ecc71";
            area.appendChild(clueBox);
        }
        clueBox.textContent = "💡 CLUE: " + level.clue + " (-20 Points)";
    }

    showMessage(`💡 Clue: ${level.clue} (-20 Points)`, "info");
}


/* 14. SCORE */

function addScore(points) {
    const data = getData();
    data.totalScore += points;
    data.games[currentGame].score += points;
    saveData(data);
}


/* 15. SAVE RESULT */

function saveResult(points) {
    const level = games[currentGame].levels[currentLevel];

    const result = {
        game: games[currentGame].name,
        gameKey: currentGame,
        level: currentLevel + 1,
        score: points,
        time: timeLeft,
        hints: hints,
        answer: level.options[level.answer]
    };

    localStorage.setItem("mysteryBoxLastResult", JSON.stringify(result));
}


/* 16. RESULT PAGE */

function loadResult() {
    const saved = localStorage.getItem("mysteryBoxLastResult");
    if (!saved) return;

    const result = JSON.parse(saved);

    const set = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    };

    set("resultGame", result.game);
    set("resultLevel", result.level);
    set("resultAnswer", result.answer);
    set("resultScore", result.score);
    set("resultTime", result.time + " seconds");
    set("resultHints", result.hints);

    const message = document.getElementById("unlockMessage");

    if (message) {
        if (result.level < 4) {
            message.innerHTML = `
                <h3>🔓 Level ${result.level + 1} Unlocked!</h3>
                <p>Great job! Continue solving the mystery.</p>
            `;
        } else {
            message.innerHTML = `
                <h3>🏆 Game Completed!</h3>
                <p>You completed all four levels!</p>
            `;
        }
    }
}

loadResult();


/* 17. NEXT LEVEL */

const nextButton = document.getElementById("nextLevelButton");

if (nextButton) {
    nextButton.addEventListener("click", function() {
        const result = JSON.parse(localStorage.getItem("mysteryBoxLastResult"));

        if (result.level < 4) {
            localStorage.setItem("selectedGame", result.gameKey);
            localStorage.setItem("selectedLevel", result.level + 1);
            location.replace("games.html");
        } else {
            location.replace("games.html");
        }
    });
}


/* 18. PLAY AGAIN */

const playAgainButton = document.getElementById("playAgainButton");

if (playAgainButton) {
    playAgainButton.addEventListener("click", function() {
        const result = JSON.parse(localStorage.getItem("mysteryBoxLastResult"));
        const data = getData();

        data.games[result.gameKey].completed = 0;
        data.games[result.gameKey].score = 0;
        data.games[result.gameKey].hintsUsed = 0;

        data.totalScore =
            data.games.detective.score +
            data.games.codebreaker.score +
            data.games.riddle.score +
            data.games.hiddenobject.score;

        saveData(data);

        localStorage.setItem("selectedGame", result.gameKey);
        localStorage.setItem("selectedLevel", "1");
        localStorage.setItem("playAgain", "true");

        location.replace("games.html");
    });
}


/* 19. LEVEL BUTTONS */

function updateLevelButtons() {
    const data = getData();

    document.querySelectorAll(".level-button").forEach(button => {
        const gameName = button.dataset.game;
        const level = Number(button.dataset.level);
        const completed = data.games[gameName].completed;

        if (level === 1 || level <= completed + 1) {
            button.disabled = false;
            button.classList.remove("locked");
            button.textContent = `Level ${level} 🔓`;
        } else {
            button.disabled = true;
            button.classList.add("locked");
            button.textContent = `Level ${level} 🔒`;
        }
    });
}

updateLevelButtons();


/* 20. LEVEL BUTTON CLICK */

document.querySelectorAll(".level-button").forEach(function(button) {
    button.addEventListener("click", function() {
        if (button.disabled) return;

        const gameName = button.dataset.game;
        const level = Number(button.dataset.level);

        startGame(gameName, level);
    });
});


/* 21. AUTO START */

const selectedGame = localStorage.getItem("selectedGame");
const selectedLevel = localStorage.getItem("selectedLevel");

if (selectedGame && selectedLevel && document.querySelector(".games-container")) {
    localStorage.removeItem("selectedGame");
    localStorage.removeItem("selectedLevel");

    startGame(selectedGame, Number(selectedLevel));
}


/* 22. SCOREBOARD */

function loadScoreboard() {
    const data = getData();

    const set = (id, value) => {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = value;
        }
    };

    set("totalScore", data.totalScore);
    set("detectiveLevels", data.games.detective.completed);
    set("detectiveScore", data.games.detective.score);
    set("codebreakerLevels", data.games.codebreaker.completed);
    set("codebreakerScore", data.games.codebreaker.score);
    set("riddleLevels", data.games.riddle.completed);
    set("riddleScore", data.games.riddle.score);
    set("hiddenobjectLevels", data.games.hiddenobject.completed);
    set("hiddenobjectScore", data.games.hiddenobject.score);
}

loadScoreboard();


/* 23. PASSWORD SHOW / HIDE */

function passwordToggle(id) {
    const input = document.getElementById(id);
    if (!input) return;

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "👁";
    button.className = "show-password";

    input.parentElement.appendChild(button);

    button.addEventListener("click", function() {
        if (input.type === "password") {
            input.type = "text";
            button.textContent = "●";
        } else {
            input.type = "password";
            button.textContent = "👁";
        }
    });
}

passwordToggle("mysteryCode");


/* 24. ACHIEVEMENTS  */

function updateAchievements() {
    const data = getData();

    const totalCompleted =
        data.games.detective.completed +
        data.games.codebreaker.completed +
        data.games.riddle.completed +
        data.games.hiddenobject.completed;

    const achievements = document.querySelectorAll(".achievement");

    if (!achievements.length) return;

    /* First Mystery — complete first level */
    if (totalCompleted >= 1) {
        achievements[0].style.opacity = "1";
        achievements[0].style.borderColor = "#f39c12";
    }

    /* No Hint Master — complete all 4 levels of a game without hints */
    const noHintGame =
        (data.games.detective.completed >= 4 && data.games.detective.hintsUsed === 0) ||
        (data.games.codebreaker.completed >= 4 && data.games.codebreaker.hintsUsed === 0) ||
        (data.games.riddle.completed >= 4 && data.games.riddle.hintsUsed === 0) ||
        (data.games.hiddenobject.completed >= 4 && data.games.hiddenobject.hintsUsed === 0);

    if (noHintGame) {
        achievements[1].style.opacity = "1";
        achievements[1].style.borderColor = "#f39c12";
    }

    /* Mystery Hunter — complete all 4 levels of any game */
    const completedGame =
        data.games.detective.completed >= 4 ||
        data.games.codebreaker.completed >= 4 ||
        data.games.riddle.completed >= 4 ||
        data.games.hiddenobject.completed >= 4;

    if (completedGame) {
        achievements[2].style.opacity = "1";
        achievements[2].style.borderColor = "#f39c12";
    }
}

updateAchievements();


/* 25. PLAYER NAME SHOW */

const playerNameEl = document.getElementById("playerName");
if (playerNameEl) {
    const name = localStorage.getItem("mysteryBoxName");
    playerNameEl.textContent = name ? name : "Guest";
}


/* 26. PAGE LOAD */

document.addEventListener("DOMContentLoaded", function() {
    loadResult();
    loadScoreboard();
    updateLevelButtons();
    updateAchievements();
});