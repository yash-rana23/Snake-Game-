// Game Constants
let inputDir = {x:0,y:0};
const foodSound = new Audio('../sounds/food.wav');
const gameOverSound = new Audio('../sounds/losing.wav');
const moveSound = new Audio('../sounds/turn.wav');
const musicSound = new Audio('../sounds/bg.wav');
let lastPaintTime = 0;
let speed = 5;
let score = 0;
let snakeArr = [
    {x:13 , y:15}
];
let food = {x:6,y:7};
let board = document.getElementById('board');
let scoreBoard = document.getElementById('score');

// Game Functions
function main(ctime){
    window.requestAnimationFrame(main);
    if((ctime-lastPaintTime)/1000<1/speed){
        return;
    }

    lastPaintTime = ctime;
    gameEngine();
}

function isCollide(sArr){

    // If snake bumps into itself
    for(i=1;i<sArr.length;i++){
        if(sArr[i].x===sArr[0].x && sArr[i].y===sArr[0].y){
            return true;
        }
    }

    // If snake bumps into wall
    if(sArr[0].x>18 || sArr[0].x<=0 || sArr[0].y>18 || sArr[0].y<=0){
        return true;
    }

    return false;
}

function gameEngine(){

    musicSound.play();

    //Part 1 : Updating the snake array and food

    // Move the Snake
    for(i=snakeArr.length-2;i>=0;i--){
        snakeArr[i+1] = {...snakeArr[i]};
    }

    snakeArr[0].x += inputDir.x;
    snakeArr[0].y += inputDir.y;
    
    // Collision
    if(isCollide(snakeArr)){
        musicSound.pause();
        gameOverSound.play();
        inputDir = {x:0,y:0};
        alert("Game Over. Press OK play again.");
        snakeArr = [{x:13 , y:15}];
        musicSound.play();
        score = 0;
        scoreBoard.innerHTML = "Score: " + score;
        speed = 5;
    }

    // If snake has eaten the food, increment the score and regenerate the food.
    if(snakeArr[0].x===food.x && snakeArr[0].y===food.y){
        foodSound.play();
        score++;
        if(score>highScoreVal){
            highScoreVal = score;
            localStorage.setItem('highScore',JSON.stringify(highScoreVal));
            highScoreBox.innerHTML = "High Score: " + highScoreVal;
        }
        speed++
        scoreBoard.innerHTML = "Score: " + score;
        snakeArr.unshift({x : snakeArr[0].x + inputDir.x, y : snakeArr[0].y + inputDir.y});
        let a = 2;
        let b = 16;
        food = {x: Math.round(a + (b-a)*Math.random()), y: Math.round(a + (b-a)*Math.random())};
    }


    // Part 2 : Display the snake and food
    board.innerHTML = "";
    // Display Snake
    snakeArr.forEach((e,index)=>{
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if(index===0){
            snakeElement.classList.add('head')
        }
        else{
            snakeElement.classList.add('snake');
        }
        board.appendChild(snakeElement);
    });

    // Display Food
    let foodElement = document.createElement('div');
    foodElement.style.gridRowStart = food.y;
    foodElement.style.gridColumnStart = food.x;
    foodElement.classList.add('food');
    board.appendChild(foodElement);

}



// Main Logic

let highScore = localStorage.getItem('highScore');
if(highScore===null){
    highScoreVal = 0;
    localStorage.setItem('highScore',JSON.stringify(highScoreVal));
}
else{
    highScoreVal = JSON.parse(highScore);
    highScoreBox.innerHTML = "High Score: " + highScoreVal;
}

window.requestAnimationFrame(main);
window.addEventListener('keydown',e =>{
    
    moveSound.play();
    switch (e.key){
        case "ArrowUp" :
            inputDir.x = 0;
            inputDir.y = -1;
            break;

        case "ArrowDown" :
            inputDir.x = 0;
            inputDir.y = 1;
            break;

        case "ArrowLeft" :
            inputDir.x = -1;
            inputDir.y = 0;
            break;

        case "ArrowRight" :
            inputDir.x = 1;
            inputDir.y = 0;
            break;
    
        default:
            break;
    }
})