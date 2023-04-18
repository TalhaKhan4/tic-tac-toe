// Documentation
// 1.First of all there are event listeners on all the boxes
// 2.When a box is clicked, userMove function is called
// 3.The userMove function first identifies which box is clicked
// 4.Then it checks the mode of the game, it can be either in player vs computer mode or either in player vs player mode
// 5.In player vs computer mode, the userMove function adds image of x in the clicked box and character x in the gamrArr array on the index as per the box (all the boxes are labelled through an id from 0-8)
// 6.Then the same function, userMove, checks for win and draw.
// 7.If there is no win nor a draw then the computerMove function is called
// 8.In case of win or a draw, first of all event listeners are removed from all the boxes. Then if it's a draw/tie, changeScore function is called with tie1 value and in case of win it is called with player value because we are sure that if there is a win on user click, it means the user won the game.
// 9.Once the changeScore function changes the score, it then calls the reset function to reset the game and prepare it for the the next game. The pVsCTurn variable keeps track of who is going to make the first move in the next game computer or user
// 10.When the computerMove function is called (in case of no win no draw), it first removes all the event listeners from the boxes so that user cannot make a move while computer is making its move
// 11.It then calls the evaluateMoveForC (evaluate Move For Computer) function, which finds the best move for the computer and returns it back to the computerMove function and the computer makes that move, where(in that move) it puts image of o on the screen and character o in the gameArr array as per the move calculated for it
// 12.Just like userMove, computerMove function checks for a win or a draw. If there is a win or a draw, it call's the changeScore function.
// 13.If there is no win nor a draw, it adds back event listeners on all the boxes so that user can make their next move

"use strict";
// *** consts and variables ***
let gameArr = [null, null, null, null, null, null, null, null, null];
// These variables keep track of which mode the game is in
let pVsC = true; /*p for player and c for computer*/
let pVsP = false;
let pVsCGameNo = 1; /* This variable helps in finding, whose turn will be in player vs computer mode*/
let pVsPTurn = 1;
let pVsPGameNo = 1;
// These variables keep track of score
let playerScore = 0;
let computerScore = 0;
let player1Score = 0;
let player2Score = 0;
let pVsCTie = 0;
let pVsPTie = 0;
// *** HTML elements ***
const boxes = Array.from(document.getElementsByClassName("boxes"));
const images = Array.from(document.getElementsByClassName("cross-circle"));
// These two are the div's having player/computer scores
const player = document.getElementById("player-score");
const computer = document.getElementById("computer-score");
const tie = document.getElementById("tie");
const message = document.getElementsByClassName("message")[0].firstElementChild;
const mode = document.getElementsByClassName("mode")[0];
const playerCount = document.getElementsByClassName("player-count")[0];
const overlay = document.getElementsByClassName("overlay")[0];
const clickSound = document.querySelector("audio");

// *** functions ***

function winEffect(gameArr, a, b, c) {
  gameArr.forEach(function (element, index) {
    if (element !== null && index !== a && index !== b && index !== c) {
      images[index].style.opacity = "0.5";
    }
  });
}

// This function perform an effect on draw/tie
function drawEffect() {
  for (let i = 0; i < 4; i++) {
    setTimeout(function () {
      boxes.forEach(function (box) {
        box.classList.toggle("border-hide");
      });
    }, 250 * i);
  }
}
// This function resets the game and it is called when a game finishes and prepares for a new game
function reset() {
  gameArr = [null, null, null, null, null, null, null, null, null];
  images.forEach(function (img) {
    img.style.opacity = 0;
  });
  if (pVsC) {
    pVsCGameNo++;
    if (pVsCGameNo % 2 === 0) {
      computerMove();
    } else {
      // changing message
      message.innerHTML =
        'Its <span class="bold" id="hide">not</span> <span class="bold">your</span> move';
    }
  } else if (pVsP) {
    pVsPGameNo++;
    pVsPTurn = pVsPGameNo;
    if (pVsPTurn % 2 === 0) {
      message.innerHTML =
        "Its &nbsp;<span class='bold'>Player2</span>&nbsp; move";
    } else if (pVsPTurn % 2 === 1) {
      message.innerHTML =
        "Its &nbsp;<span class='bold'>Player1</span>&nbsp; move";
    }
  }
}
// This function changes the score
function changeScore(target) {
  switch (target) {
    case "player":
      playerScore++;
      player.textContent = playerScore;
      message.innerHTML = '<span class="bold">You Won!</span>';
      break;
    case "computer":
      computerScore++;
      computer.textContent = computerScore;
      message.innerHTML = '<span class="bold">Computer Won!</span>';
      break;
    case "tie1":
      pVsCTie++;
      tie.textContent = pVsCTie;
      message.innerHTML = '<span class="bold">It\'s a tie!</span>';
      break;
    case "tie2":
      pVsPTie++;
      tie.textContent = pVsPTie;
      message.innerHTML = '<span class="bold">It\'s a tie!</span>';
      break;
    case "player1":
      player1Score++;
      player.textContent = player1Score;
      message.innerHTML = '<span class="bold">Player1 Won!</span>';
      break;
    case "player2":
      player2Score++;
      computer.textContent = player2Score;
      message.innerHTML = '<span class="bold">Player2 Won!</span>';
      break;
  }
  // In case of win/draw, we will set the display of overlay to block, and then when some one click's one it, we will set it's display back to none and will call the reset function
  overlay.style.display = "block";
}

// This function Evaluates move For Computer
function evaluateMoveForC(gameArr) {
  for (let j = 1; j <= 2; j++) {
    let target = j === 1 ? "o" : "x";
    // checking rows
    for (let i = 0; i <= 6; i += 3) {
      // This code represents the row of the gameArr that we are checking
      let row = [gameArr[i], gameArr[i + 1], gameArr[i + 2]];

      let value;
      if (row.indexOf(null) !== -1) {
        value = row.indexOf(null);
        row.splice(value, 1);

        if (row[0] === row[1] && row[0] === target) {
          return value + i;
        }
      }
    }
    //
    // checking columns
    for (let i = 0; i <= 2; i += 1) {
      // This code represents the column of the gameArr that we are checking
      let column = [gameArr[i], gameArr[i + 3], gameArr[i + 6]];

      let value;
      if (column.indexOf(null) !== -1) {
        value = column.indexOf(null);
        column.splice(value, 1);

        if (column[0] === column[1] && column[0] === target) {
          return value * 3 + i;
        }
      }
    }
    //
    // checking diagnol \
    let diagnol1 = [gameArr[0], gameArr[4], gameArr[8]];

    if (diagnol1.indexOf(null) !== -1) {
      let value;
      value = diagnol1.indexOf(null);
      diagnol1.splice(value, 1);

      if (diagnol1[0] === diagnol1[1] && diagnol1[0] === target) {
        return value * 4;
      }
    }
    //
    // checking diagnol /
    let diagnol2 = [gameArr[2], gameArr[4], gameArr[6]];

    if (diagnol2.indexOf(null) !== -1) {
      let value;
      value = diagnol2.indexOf(null);
      diagnol2.splice(value, 1);

      if (diagnol2[0] === diagnol2[1] && diagnol2[0] === target) {
        return value * 2 + 2;
      }
    }
  }

  // In case their is no match we return a random empty position
  let random = Math.floor(Math.random() * 9);

  while (gameArr[random] !== null) {
    random = Math.floor(Math.random() * 9);
  }

  return random;
}

// This functions checks for win
function checkWin(gameArr) {
  // checking rows
  for (let i = 0; i <= 6; i += 3) {
    if (
      gameArr[i] === gameArr[i + 1] &&
      gameArr[i] === gameArr[i + 2] &&
      gameArr[i] !== null
    ) {
      // [i, i + 1, i + 2, gameArr[i]];
      winEffect(gameArr, i, i + 1, i + 2);
      return false;
    }
  }
  // checking columns
  for (let i = 0; i <= 2; i += 1) {
    if (
      gameArr[i] === gameArr[i + 3] &&
      gameArr[i] === gameArr[i + 6] &&
      gameArr[i] !== null
    ) {
      // [i, i + 3, i + 6, gameArr[i]];
      winEffect(gameArr, i, i + 3, i + 6);
      return false;
    }
  }
  // checking diagnol \
  if (
    gameArr[0] === gameArr[4] &&
    gameArr[0] === gameArr[8] &&
    gameArr[0] !== null
  ) {
    //   [0, 4, 8, gameArr[0]];
    winEffect(gameArr, 0, 4, 8);
    return false;
  }
  // checking diagnol /
  if (
    gameArr[2] === gameArr[4] &&
    gameArr[2] === gameArr[6] &&
    gameArr[2] !== null
  ) {
    //  [2, 4, 6, gameArr[2]];
    winEffect(gameArr, 2, 4, 6);
    return false;
  }
  //   draw
  if (gameArr.indexOf(null) === -1) {
    drawEffect();
    return "draw";
  }
  //   otherwise if no one won
  return true;
}

// This function handles computer move
function computerMove() {
  // chaging message
  message.innerHTML =
    'Its <span class="bold">not</span> <span class="bold">your</span> move';
  // removing event listeners so that user cannot perform move while this function is running
  boxes.forEach(function (box) {
    box.removeEventListener("click", userMove);
  });
  setTimeout(function () {
    let move = evaluateMoveForC(gameArr);
    gameArr[move] = "o";
    clickSound.play();
    images[move].src = "./images/circle.png";
    images[move].style.opacity = "1";
    if (checkWin(gameArr) && checkWin(gameArr) !== "draw") {
      // changing message
      message.innerHTML =
        'Its <span class="bold" id="hide">not</span> <span class="bold">your</span> move';
    } else {
      // Changing the score of computer
      if (checkWin(gameArr) !== "draw") {
        changeScore("computer");
      } else {
        changeScore("tie1");
      }
    }
    // adding event listeners back
    boxes.forEach(function (box) {
      box.addEventListener("click", userMove);
    });
  }, 500);
}

// This function handles user move
function userMove(event) {
  const boxClicked = event.target.id.slice(-1);
  // When the game is in player vs computer mode
  if (pVsC && gameArr[boxClicked] === null) {
    clickSound.play();
    gameArr[boxClicked] = "x";
    images[boxClicked].src = "./images/cross.png";
    images[boxClicked].style.opacity = "1";
    // If user didn't won
    if (checkWin(gameArr) && checkWin(gameArr) !== "draw") {
      computerMove();
    }
    // If user won
    else {
      // Changing the score of player
      if (checkWin(gameArr) !== "draw") {
        changeScore("player");
      } else {
        changeScore("tie1");
      }
    }
  }
  //  When the game is in player vs player mode
  else if (pVsP && gameArr[boxClicked] === null) {
    clickSound.play();
    // player 1 move
    if (pVsPTurn % 2 == 1) {
      // Firt we will update the gameArr array and then we will put the image of x on the screen
      gameArr[boxClicked] = "x";
      images[boxClicked].src = "./images/cross.png";
      images[boxClicked].style.opacity = "1";
      // player 1 move
      message.innerHTML =
        "Its &nbsp;<span class='bold'>Player2</span>&nbsp; move";
    }
    // player 2 move
    else if (pVsPTurn % 2 == 0) {
      // same code as above for player 1
      gameArr[boxClicked] = "o";
      images[boxClicked].src = "./images/circle.png";
      images[boxClicked].style.opacity = "1";
      // player 1 move
      message.innerHTML =
        "Its &nbsp;<span class='bold'>Player1</span>&nbsp; move";
    }

    // Now we will check for a win after every player move

    // if no one won
    if (checkWin(gameArr) && checkWin(gameArr) !== "draw") {
      // Now we will update the pVsPTurn variable, so that the next move will be counted for the next player
      pVsPTurn++;
    }
    // if someone won or there is a draw
    else {
      // draw
      if (checkWin(gameArr) === "draw") {
        changeScore("tie2");
      }
      // player 1 win
      else if (checkWin && pVsPTurn % 2 == 1) {
        changeScore("player1");
      }
      // player 2 win
      else if (checkWin && pVsPTurn % 2 == 0) {
        changeScore("player2");
      }
    }
  }
}

// *** event listeners

// Adding event listeners on all the boxes
boxes.forEach(function (box) {
  box.addEventListener("click", userMove);
});

// event listener for the game mode changing button
mode.addEventListener("click", function () {
  if (pVsC) {
    // changing the button for change mode
    mode.firstElementChild.src = "./images/one user.png";
    mode.firstElementChild.classList.remove("two-users");
    mode.firstElementChild.classList.add("one-user");
    playerCount.textContent = "1P";
    playerCount.style.bottom = "0px";
    // Setting player vs computer to false
    pVsC = false;
    // calling the reset function so that the gameArr array is set to default and all the images are removed from the screen
    reset();
    // changing content on screen from player & computer to player1 & player 2
    player.previousElementSibling.textContent = "Player1 (x)";
    computer.previousElementSibling.textContent = "Player2 (o)";
    // setting scores of player & computer to scores of player1 & player2
    player.textContent = player1Score;
    computer.textContent = player2Score;
    tie.textContent = pVsPTie;
    pVsP = true;
    overlay.style.display = "none";
    // player 1 move
    message.innerHTML =
      "Its &nbsp;<span class='bold'>Player1</span>&nbsp; move";
  } else if (pVsP) {
    // changing the button for change mode
    mode.firstElementChild.src = "./images/two users.png";
    mode.firstElementChild.classList.remove("one-user");
    mode.firstElementChild.classList.add("two-users");
    playerCount.textContent = "2P";
    playerCount.style.bottom = "5px";
    // Setting player vs player to false
    pVsP = false;
    // calling the reset function so that the gameArr array is set to default and all the images are removed from the screen
    reset();
    // changing content on screen from player1 & player 2 to player & computer
    player.previousElementSibling.textContent = "Player (x)";
    computer.previousElementSibling.textContent = "Computer (o)";
    // setting the scores of player1 & player2 to scores of player & computer
    player.textContent = playerScore;
    computer.textContent = computerScore;
    tie.textContent = pVsCTie;
    pVsC = true;
    overlay.style.display = "none";
    pVsCGameNo++;
    computerMove();
  }
});

// event listener on overlay
overlay.addEventListener("click", function () {
  overlay.style.display = "none";
  reset();
});
