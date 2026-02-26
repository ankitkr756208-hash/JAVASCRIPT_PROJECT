// let boxes=document.querySelectorAll("box");
// let resetBtn =document.querySelector("#reset-btn");

// let turnO =true;//playerX ,playerO

// const winPatterns = [
//     [0,1,2],
//     [0,3,6],
//     [0,4,8],
//     [1,4,7],
//     [2,5,8],
//     [2,4,6],
//     [3,4,5],
//     [6,7,8],

// ];

// boxes.forEach((box) => {
//     box.addEventListener("click",() => {
//         console.log("box was clicked");
//         if(turnO) { //playerO
//             box.innerText ="O";
//             turnO=false;
//         } else { //playerX
//             box.innerText="x";
//             turnO =true;
//         }
//         box.disabled =true;
//         checkWinner =() => {
//             for ( let pattern of  winPatterns) {
//                 console.log(pattern);
//             }
//         }
//     });
// });
let boxes = document.querySelectorAll(".box");//More actions
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let statusText = document.querySelector("#status");
let soundBtn = document.querySelector("#sound-btn");

let turnO = true; //playerX, playerO
let count = 0; //To Track Draw
let gameOver = false;
let soundEnabled = true;

const winPatterns = [
  [0, 1, 2],
  [0, 3, 6],
  [0, 4, 8],
  [1, 4, 7],
  [2, 5, 8],
  [2, 4, 6],
  [3, 4, 5],
  [6, 7, 8],
];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

const playTone = (frequency, duration, type, volume, delay = 0) => {
  if (!soundEnabled) {
    return;
  }

  const now = audioCtx.currentTime + delay;
  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);

  gainNode.gain.setValueAtTime(0.001, now);
  gainNode.gain.exponentialRampToValueAtTime(volume, now + 0.01);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + duration);

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.start(now);
  oscillator.stop(now + duration + 0.02);
};

const playMoveSound = () => {
  playTone(420, 0.11, "square", 0.06);
};

const playWinSound = () => {
  playTone(620, 0.14, "triangle", 0.07, 0);
  playTone(780, 0.16, "triangle", 0.07, 0.12);
  playTone(980, 0.2, "triangle", 0.08, 0.26);
};

const playDrawSound = () => {
  playTone(300, 0.14, "sine", 0.05, 0);
  playTone(250, 0.14, "sine", 0.05, 0.12);
};

const playResetSound = () => {
  playTone(520, 0.1, "square", 0.05, 0);
  playTone(420, 0.1, "square", 0.05, 0.1);
};

const updateStatus = (text) => {
  statusText.innerText = text;
};

const resetGame = () => {
  turnO = true;
  count = 0;
  gameOver = false;
  enableBoxes();
  msgContainer.classList.add("hide");
  updateStatus("Current Turn: O");
  playResetSound();
};

boxes.forEach((box) => {
  box.addEventListener("click", () => {
    if (gameOver) {
      return;
    }

    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }

    let currentPlayer = "O";
    if (turnO) {
      box.innerText = "O";
      turnO = false;
    } else {
      box.innerText = "X";
      turnO = true;
      currentPlayer = "X";
    }

    box.disabled = true;
    count++;
    playMoveSound();

    let isWinner = checkWinner();

    if (count === 9 && !isWinner) {
      gameDraw();
      return;
    }

    if (!isWinner) {
      updateStatus(`Current Turn: ${turnO ? "O" : "X"}`);
    } else {
      updateStatus(`Winner: ${currentPlayer}`);
    }
  });
});

const gameDraw = () => {
  msg.innerText = `Game was a Draw.`;
  msgContainer.classList.remove("hide");
  gameOver = true;
  updateStatus("Result: Draw");
  playDrawSound();
  disableBoxes();
};

const disableBoxes = () => {
  for (let box of boxes) {
    box.disabled = true;
  }
};

const enableBoxes = () => {
  for (let box of boxes) {
    box.disabled = false;
    box.innerText = "";
  }
};

const showWinner = (winner) => {
  msg.innerText = `Congratulations, Winner is ${winner}`;
  msgContainer.classList.remove("hide");
  gameOver = true;
  playWinSound();
  disableBoxes();
};

const checkWinner = () => {
  for (let pattern of winPatterns) {
    let pos1Val = boxes[pattern[0]].innerText;
    let pos2Val = boxes[pattern[1]].innerText;
    let pos3Val = boxes[pattern[2]].innerText;

    if (pos1Val != "" && pos2Val != "" && pos3Val != "") {
      if (pos1Val === pos2Val && pos2Val === pos3Val) {
        showWinner(pos1Val);
        return true;
      }
    }
  }
  return false;
};

soundBtn.addEventListener("click", () => {
  soundEnabled = !soundEnabled;
  soundBtn.innerText = `Sound: ${soundEnabled ? "ON" : "OFF"}`;
  if (soundEnabled && audioCtx.state === "suspended") {
    audioCtx.resume();
  }
});

newGameBtn.addEventListener("click", resetGame);
resetBtn.addEventListener("click", resetGame);

