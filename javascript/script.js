// this array represents the game
let gameArr = [null, null, null, null, null, null, null, null, null];

// **** variables and consts ****

// Getting html elements
const boxes = Array.from(document.getElementsByClassName("boxes"));

// **** functions ****

// event listeners on all the boxes to detect user click

boxes.forEach(function (box) {
  box.addEventListener("click", userMove);
});

// function that will take care of the user click on the boxes

function userMove(event) {
  // getting box id
  const boxId = event.target.id;
  // getting the last letter of the id
  const boxClicked = boxId.slice(-1);
  if (gameArr[boxClicked] === null) {
    gameArr[boxClicked] = "x";
    document.getElementById(boxId).firstElementChild.src = "./images/cross.png";
    // removing event listeners from the boxes so that the user cannot perform another move while the computer is performing it's move
    boxes.forEach(function (box) {
      box.removeEventListener("click", userMove);
    });
    // **************************************
    if (gameArr.indexOf(null) === -1) {
      reset();
    }
    // **************************************
    // calling the computerMove function
    setTimeout(function () {
      computerMove();
    }, 200);
  }
}

//This function will perform the move form the computer side
function computerMove() {
  // random number from zero to eight
  let random = Math.floor(Math.random() * 9);
  while (gameArr[random] !== null) {
    random = Math.floor(Math.random() * 9);
  }
  gameArr[random] = "o";
  //   setting the id for the div
  const boxId = "box".concat(random);
  document.getElementById(boxId).firstElementChild.src = "./images/circle.png";
  // adding back the event listeners
  boxes.forEach(function (box) {
    box.addEventListener("click", userMove);
  });
  // **************************************
  if (gameArr.indexOf(null) === -1) {
    reset();
  }
  // **************************************
}
// **********************************
function reset() {
  const images = Array.from(document.getElementsByTagName("img"));
  images.forEach(function (img) {
    img.src = "";
    gameArr = [null, null, null, null, null, null, null, null, null];
  });
}
