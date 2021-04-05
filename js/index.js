const canvas = document.getElementById('snake-game');
const ctx = canvas.getContext('2d');

/**
 * Defines the body of the snake.
 */
class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

// determines the difficulty of the game
let speed = 7;
let xVelocity = 0;
let yVelocity = 0;

// tile dimensions
let tileCount = 20;
let tileSize = canvas.width/tileCount - 2;

// head of the snake
let headX = 10;
let headY = 10;
const snakeParts = [];

// initial tail length
let tailLength = 2;

// initial apple position
let appleX = 5;
let appleY = 5

let score = 0;

// gulp sound played after snake eats apple
const gulpSound = new Audio('audio/gulp.mp3');

/**
 * Handles drawing out the entire game and update intervals.
 */
function drawGame() {
  changeSnakePosition();

  if(isGameOver()) {
    ctx.fillStyle = 'white';
    ctx.font = '40px Verdana';
    ctx.fillText('Game Over', canvas.width - 310, canvas.height / 2);
    return;
  }

  clearScreen();
  checkAppleCollision();
  drawApple();
  drawSnake();
  drawScore();

  setTimeout(drawGame, 1000/speed);
}

/**
 * Moves snake in the direction determined by the velocity.
 */
function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

/**
 * Ends the game if the snake has collided with the wall or itself.
 *
 * @return true if the game is over and false otherwise
 */
function isGameOver() {
  let gameOver = false;

  if(xVelocity == 0 && yVelocity == 0) {
    return false;
  }

  // check collision with walls
  if(headX < 0) {
    gameOver = true;
  } else if (headX == tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY == tileCount) {
    gameOver = true;
  }

  // check collision with snake body
  for(let i=0; i<snakeParts.length; i++) {
    let part = snakeParts[i];
    if(part.x == headX && part.y == headY) {
      gameOver = true;
      break;
    }
  }

  return gameOver;
}

/**
 * Draws the canvas.
 */
function clearScreen() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

/**
 * Checks if the snake has eaten with the apple and updates the score.
 */
function checkAppleCollision() {
  if(appleX == headX && appleY == headY) {
    let randomNumber = Math.floor(Math.random() * tileCount);
    appleX = randomNumber;
    appleY = randomNumber;
    gulpSound.play();  // may not work in Firefox
    tailLength++;
    score++;

    if((score != 0) && (score%3 == 0)) {
      // increase speed when score reaches a multiple of 3
      speed++;
    }
  }
}

/**
 * Draws the apple on the canvas.
 */
function drawApple() {
  ctx.fillStyle = 'red';
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

/**
 * Draws the snake on the canvas.
 */
function drawSnake() {
  // body of the snake
  ctx.fillStyle = 'green';
  for(let i=0; i<snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  // push new snake part where the head currently is
  snakeParts.push(new SnakePart(headX, headY));
  if(snakeParts.length > tailLength) {
    // remove the first part of the body
    snakeParts.shift();
  }

  // head of the snake
  ctx.fillStyle = 'orange';
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

/**
 * Draws the score on the upper right side of the canvas.
 */
function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '12px Verdana';
  ctx.fillText('Score ' + score, canvas.width - 60, 15);
}

// check for key press events
document.body.addEventListener('keydown', keyDown);

/**
 * Changes the velocity of the snake based on the arrow key pressed.
 */
function keyDown(event) {
  // up
  if(event.keyCode == 38) {
    if (yVelocity == 1) {
      return;
    }
    yVelocity = -1;
    xVelocity = 0;
  }

  // down
  if(event.keyCode == 40) {
    if (yVelocity == -1) {
      return;
    }
    yVelocity = 1;
    xVelocity = 0;
  }

  // left
  if(event.keyCode == 37) {
    if (xVelocity == 1) {
      return;
    }
    yVelocity = 0;
    xVelocity = -1;
  }

  // right
  if(event.keyCode == 39) {
    if (xVelocity == -1) {
      return;
    }
    yVelocity = 0;
    xVelocity = 1;
  }
}

drawGame();
