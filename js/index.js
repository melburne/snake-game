const canvas = document.getElementById('snake-game');
const ctx = canvas.getContext('2d');

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width/tileCount - 2;
let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let appleX = 5;
let appleY = 5

let xVelocity = 0;
let yVelocity = 0;

let score = 0;

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

function changeSnakePosition() {
  headX = headX + xVelocity;
  headY = headY + yVelocity;
}

function isGameOver() {
  let gameOver = false;

  if(xVelocity == 0 && yVelocity == 0) {
    return false;
  }

  // check for walls
  if(headX < 0) {
    gameOver = true;
  } else if (headX == tileCount) {
    gameOver = true;
  } else if (headY < 0) {
    gameOver = true;
  } else if (headY == tileCount) {
    gameOver = true;
  }

  for(let i=0; i<snakeParts.length; i++) {
    let part = snakeParts[i];
    if(part.x == headX && part.y == headY) {
      gameOver = true;
      break;
    }
  }

  return gameOver;
}

function clearScreen() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function checkAppleCollision() {
  if(appleX == headX && appleY == headY) {
    let randomNumber = Math.floor(Math.random() * tileCount);
    appleX = randomNumber;
    appleY = randomNumber;
    tailLength++;
    score++;
  }
}

function drawApple() {
  ctx.fillStyle = 'red';
  ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function drawSnake() {
  ctx.fillStyle = 'green';
  for(let i=0; i<snakeParts.length; i++) {
    let part = snakeParts[i];
    ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
  }

  snakeParts.push(new SnakePart(headX, headY));
  if(snakeParts.length > tailLength) {
    snakeParts.shift();
  }

  ctx.fillStyle = 'orange';
  ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize);
}

function drawScore() {
  ctx.fillStyle = 'white';
  ctx.font = '12px Verdana';
  ctx.fillText('Score ' + score, canvas.width - 60, 15);
}


document.body.addEventListener('keydown', keyDown);

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
