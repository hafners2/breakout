const grid = document.querySelector('.grid')
const user = document.createElement('div')
const ball = document.createElement('div')
let score = document.querySelector('#score')
let result = 0;

score.innerHTML = result;

let randAudio = Math.floor(Math.random() * 2)
const blockWidth = 100;
const blockHeight = 20;
const gridWidth = 560;
const gridHeight = 300;
const ballDiameter = 50;

let xDirection = 2
let yDirection = 2

let userHit = new Audio('userHit.wav')
let lost = new Audio('lose.mp3')
let gameWon = new Audio('gameWon.mp3')

var audio = [];
audio[0] = new Audio();
audio[0].src = "hitStone/Stone_hit6.ogg";
audio[1] = new Audio();
audio[1].src = "hitStone/Stone_jump1.wav";
audio[2] = new Audio();
audio[2].src = "hitStone/Stone_jump2.wav";


const startUserPosition = [230, 20]
const currentUserPosition = startUserPosition

const startBallPosition = [255, 50]
const currentBallPosition = startBallPosition

function addBlock() {
    for(i = 0; i < blocks.length; i++) {
        const stoneBlock = document.createElement('div')
        stoneBlock.classList.add('stone-block')
        stoneBlock.style.left = blocks[i].bottomLeft[0] + 'px';
        stoneBlock.style.bottom = blocks[i].bottomLeft[1] + 'px';
        grid.append(stoneBlock)
    }
}

class Block {
    //assigning coordinates
    constructor(xAxis, yAxis) {
        this.bottomLeft = [xAxis, yAxis]
        this.bottomRight = [xAxis + blockWidth, yAxis]
        this.topLeft = [xAxis, yAxis + blockHeight]
        this.topRight = [xAxis + blockWidth, yAxis + blockHeight];
    }
}

const blocks = [
    //row 1
    new Block(10, 270),
    new Block(120, 270),
    new Block(230, 270),
    new Block(340, 270),
    new Block(450, 270),
    //row 2
    new Block(10, 240),
    new Block(120, 240),
    new Block(230, 240),
    new Block(340, 240),
    new Block(450, 240),
    //row3
    new Block(10, 210),
    new Block(120, 210),
    new Block(230, 210),
    new Block(340, 210),
    new Block(450, 210),
    //row4
    new Block(10, 180),
    new Block(120, 180),
    new Block(230, 180),
    new Block(340, 180),
    new Block(450, 180),
]

function addUser() {
    user.classList.add('user')  
    drawUser()
    grid.append(user)
}

function addBall() {
    ball.classList.add('ball')
    drawBall()
    grid.append(ball)
}

function drawUser() {
    user.style.left = currentUserPosition[0] + 'px'
    user.style.bottom = currentUserPosition[1] + 'px'
}

function drawBall() {
    ball.style.left = currentBallPosition[0] + 'px'
    ball.style.bottom = currentBallPosition[1] + 'px'
}

function moveUser(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if(currentUserPosition[0] > 0) {
                currentUserPosition[0] -=10
                user.style.left = currentUserPosition[0] + 'px'
                drawUser()
            }
            break;
        case 'ArrowRight':
            if(currentUserPosition[0] < gridWidth - blockWidth) {
                currentUserPosition[0] +=10
                user.style.left = currentUserPosition[0] + 'px'
                drawUser()
            }
            break;
    }
}

function moveBall() {
    currentBallPosition[0] += xDirection
    currentBallPosition[1] += yDirection
    drawBall()
    checkForCollision()
}

let timerId = setInterval(moveBall, 30)

function checkForCollision() {
    //block collision
    for(let i = 0; i < blocks.length; i++) {
        if(
            currentBallPosition[0] > blocks[i].bottomLeft[0] &&
            currentBallPosition[0] < blocks[i].bottomRight[0] &&
            (currentBallPosition[1] + ballDiameter) > blocks[i].bottomLeft[1] &&
            currentBallPosition[1] < blocks[i].topLeft[1]
        ) {
            const allBlocks = Array.from(document.querySelectorAll('.stone-block'))
            console.log(allBlocks, i)
            allBlocks[i].classList.remove('stone-block')
            blocks.splice(i, 1)
            audio[randAudio].play()
            changeDirection()
            result++
            score.innerHTML = result
        }

    }

    //user collision
    if(
        (currentBallPosition[0] > currentUserPosition[0] && currentBallPosition[0] < currentUserPosition[0] + (blockWidth + 10)) &&
        (currentBallPosition[1] > currentUserPosition[1] && currentBallPosition[1] < currentUserPosition[1] + (blockHeight))
     )
        {
            userHit.play()
            changeDirection()
        }

    //wall collisions
    if(currentBallPosition[0] >= (gridWidth - ballDiameter) ||
    currentBallPosition[1] >= (gridHeight - ballDiameter) ||
    currentBallPosition[0] <= 0) {
        changeDirection()
    }

    if(currentBallPosition[1] <= 0) {
        clearInterval(timerId)
        lost.play()
        alert("Game Over! Your final score is: " +score.innerHTML)
    }

    if(result == 20) {
        gameWon.play()
        alert('Yay! You did it!')
        clearInterval(timerId)
        return
    }
}

function changeDirection() {
    if(xDirection === 2 && yDirection === 2) {
        yDirection = -2
        return
    }
    if(xDirection === 2 && yDirection === -2) {
        xDirection = -2
        return
    }
    if(xDirection === -2 && yDirection === -2) {
        yDirection = 2
        return
    }
    if(xDirection === -2 && yDirection === 2) {
        xDirection = 2
        return
    }
}

document.addEventListener('keydown', moveUser)

addBlock()
addUser()
addBall()