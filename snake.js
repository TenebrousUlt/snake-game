const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pauseSound = new Audio("audio/touhou-pause-sfx.mp3");

let tileSize;
//const tileSize = 50;

const columns = 20; /*Math.floor(canvas.width / tileSize);*/ // for fullscreen
const rows = 15;/*Math.floor(canvas.height / tileSize);*/ //for fullscreen

const states = {
    MENU: "menu",
    START: "start",
    GAME: "game",
    GAMEOVER: "gameover",
    PAUSE: "pause",
    SETTINGS: "settings",
    EXTRA: "extra"
};

let gameState = states.MENU; 

let speed = 100;
let lastMove = 0;

let direction = "right";
let nextDirection ="right";

const snake = [
    {x: 5, y: 5},
    {x: 4, y: 5},
]

const food = {
    x: Math.floor(Math.random() * columns),
    y: Math.floor(Math.random() * rows),
}

const colors = {
    menu: "rgb(121, 65, 65)",
    background: "rgb(0, 0, 0)",
    sub: "rgb(236, 179, 179)",
    border: "white",
    snake: "rgb(74, 235, 46)",
    food: "rgb(255, 0, 0)",
    grid: "rgb(24, 24, 24)",
    pause: "rgba(0, 0, 0, 0.5)",
    gameoverbg: "rgba(230, 47, 47, 0.7)",
};

let board = {
    width: columns * tileSize,
    height: rows * tileSize,
    x: (canvas.width - columns * tileSize) / 2,
    y: (canvas.height - rows * tileSize) / 2
};


const Menubuttons = [{
        text: "EXTRAS",
        action: "extras"
    },
    {
        text: "PLAY",
        action: "play"
    },
    {
        text: "SETTINGS",
        action: "settings"
    },
]
const Startbuttons = [{
    text: "PLAY",
    action: "playgame"
}]

const UIbuttons = [{
        text: "LEAVE",
        action: "leavegame"
    },
    {
        text: "↑",
        action: "goup"
    },
    {
        text: "↓",
        action: "godown"
    },
    {
        text: "←",
        action: "goleft"
    },
    {
        text: "→",
        action: "goright"
    },
    {
        text: "PAUSE",
        action: "pause"
    }];

const UIlabels = [{
        text: "HIGHSCORE"
    },
    {
        text: "SCORE"
    },
    {
        text: 0
    },
    {
        text: 0
    }];

let score = UIlabels[3];
let highscore = UIlabels[2];
highscore.text = localStorage.getItem("highscore", highscore.text) || 0;



function gameLoop(time){

    requestAnimationFrame(gameLoop);

    switch(gameState){
        
        case states.MENU:
            drawMenu();
            break;

        case states.START:

            drawStart();
            drawUI();
            break;

        case states.GAME:

            update(time);

            gameLogic();

            if(gameState === states.GAME){
                draw();
            }

            drawUI();

            break;
        
        case states.GAMEOVER:

            drawGameover();
            drawUI();
            break;
        
        case states.PAUSE:

            draw();
            drawUI();
            drawPause();
            break;
    }
}


function drawMenu(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = colors.menu;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = "white";
    ctx.font = "70px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "SNAKE GAME",
        board.x + board.width / 2,
        board.y + board.height / 4
    )

    ctx.fillStyle = colors.sub;
    ctx.font = "50px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    const gap = board.width * 0.05;
    const buttonWidth = board.width * 0.25;
    const buttonHeight = board.height * 0.1;

    const totalWidth =
        buttonWidth * 3 + gap * 2;
            
    let startX = canvas.width / 2 - totalWidth / 2;
    let endY = board.y + board.height / 2;

    for(const button of Menubuttons){
        button.width = board.width * 0.25;
        button.height = board.height * 0.1;

        button.x = startX;
        button.y = endY;

        drawBtn(button);

        startX += button.width + gap;
    }

}
function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);


    ctx.fillStyle = colors.background;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    drawGrid();

    for(let i = 0; i < snake.length; i++){
        ctx.fillStyle = colors.snake;
        ctx.fillRect(board.x + snake[i].x * tileSize,
            board.y + snake[i].y * tileSize,
            tileSize,
            tileSize);
    }

    ctx.fillStyle = colors.food;
    ctx.fillRect(board.x + food.x * tileSize,
        board.y + food.y * tileSize,
        tileSize,
        tileSize);

    ctx.strokeStyle = "white";
    ctx.lineWidth = Math.min(board.width, board.height) * 0.005;

    ctx.strokeRect(
        board.x,
        board.y,
        board.width,
        board.height
    );
};

function drawStart(){
    ctx.clearRect(0,0,canvas.width,canvas.height);


    ctx.fillStyle = colors.background;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    drawGrid();

    ctx.strokeStyle = colors.border;
    ctx.lineWidth = Math.min(board.width, board.height) * 0.005;

    ctx.strokeRect(
        board.x,
        board.y,
        board.width,
        board.height
    );

    for(const button of Startbuttons){

        button.width = board.width * 0.25;
        button.height = board.height * 0.1;

        button.x = board.x - button.width - board.width * 0.05;
        button.y = board.y + board.height * 0.1;

        drawBtn(button);
    }
};

function drawGameover(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = colors.background;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.strokeStyle = colors.border;
    ctx.lineWidth = Math.min(board.width, board.height) * 0.005;

    ctx.strokeRect(
        board.x,
        board.y,
        board.width,
        board.height
    );

    ctx.fillStyle = colors.gameoverbg; 
    ctx.fillRect(board.x,board.y,board.width,board.height);

    ctx.fillStyle = colors.sub;
    ctx.font = `${board.height * 0.08}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "GAME OVER",
        board.x + board.width / 2,
        board.y + board.height / 2
    )

    for(const button of Startbuttons){

        button.width = board.width * 0.25;
        button.height = board.height * 0.1;

        button.x = board.x - button.width - board.width * 0.05;
        button.y = board.y + board.height * 0.1;

        drawBtn(button);
    }
    
}

function drawUI(){

        const leaveButton = UIbuttons[0];
        const pauseButton = UIbuttons[5];

        leaveButton.width = board.width * 0.25;
        leaveButton.height = board.height * 0.1;

        leaveButton.x = board.x - leaveButton.width - board.width * 0.05;
        leaveButton.y = board.y + leaveButton.height * 2.5;

        drawBtn(leaveButton);

        pauseButton.width = board.width * 0.25;
        pauseButton.height = board.height * 0.1;

        pauseButton.x = board.x - pauseButton.width - board.width * 0.05;
        pauseButton.y = board.y + pauseButton.height * 4;

        drawBtn(pauseButton);


        const startX = board.x - board.width * 0.3;
        const startY = board.y + board.height * 0.65;
        const gap = board.width * 0.03;
        const arrowSize = board.width * 0.07;
        

        const UP = UIbuttons[1];
        const DOWN = UIbuttons[2];
        const LEFT = UIbuttons[3];
        const RIGHT = UIbuttons[4];

        const buttonGap = arrowSize * 0.3;

        UP.x = startX + arrowSize + buttonGap;
        UP.y = startY;
        UP.width = arrowSize;
        UP.height = arrowSize;

        LEFT.x = startX;
        LEFT.y = startY + arrowSize + buttonGap;
        LEFT.width = arrowSize;
        LEFT.height = arrowSize;

        DOWN.x = startX + arrowSize + buttonGap;
        DOWN.y = startY + arrowSize + buttonGap;
        DOWN.width = arrowSize;
        DOWN.height = arrowSize;

        RIGHT.x = startX + (arrowSize + buttonGap) * 2;
        RIGHT.y = startY + arrowSize + buttonGap;
        RIGHT.width = arrowSize;
        RIGHT.height = arrowSize;

        drawBtn(UP);
        drawBtn(DOWN);
        drawBtn(LEFT);
        drawBtn(RIGHT);

        const highscoreShow = UIlabels[0];
        let highscoreText = UIlabels[2];
        const scoreShow = UIlabels[1];
        let scoreText = UIlabels[3];

        highscoreShow.width = board.width * 0.3;
        highscoreShow.height = board.height * 0.3;

        highscoreShow.x = board.x + board.width + board.width * 0.01;
        highscoreShow.y = board.y + board.height * 0.01;

        highscoreText.width = board.width * 0.3;
        highscoreText.height = board.height * 0.3;

        highscoreText.x = board.x + board.width + board.width * 0.01;
        highscoreText.y = board.y + board.height * 0.1;


        scoreShow.width = board.width * 0.3;
        scoreShow.height = board.height * 0.3;

        scoreShow.x = board.x + board.width + board.width * 0.01;
        scoreShow.y = board.y + board.height * 0.2;

        scoreText.width = board.width * 0.3;
        scoreText.height = board.height * 0.3;

        scoreText.x = board.x + board.width + board.width * 0.01;
        scoreText.y = board.y + board.height * 0.3;

        ctx.fillStyle = colors.sub;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = `${Math.min(highscoreShow.width, highscoreShow.height) * 0.2}px Arial`;
        ctx.fillText(
            highscoreShow.text,
            highscoreShow.x + highscoreShow.width / 2,
            highscoreShow.y + highscoreShow.height / 2
            );

        ctx.font = `${Math.min(highscoreText.width, highscoreText.height) * 0.2}px Arial`;
        ctx.fillText(
            highscoreText.text,
            highscoreText.x + highscoreText.width / 2,
            highscoreText.y + highscoreText.height / 2
            );

        ctx.font = `${Math.min(scoreShow.width, scoreShow.height) * 0.2}px Arial`;
        ctx.fillText(
            scoreShow.text,
            scoreShow.x + scoreShow.width / 2,
            scoreShow.y + scoreShow.height / 2
            );

        ctx.font = `${Math.min(scoreText.width, scoreText.height) * 0.2}px Arial`;
        ctx.fillText(
            scoreText.text,
            scoreText.x + scoreText.width / 2,
            scoreText.y + scoreText.height / 2
            );

        ctx.font = `${Math.min(scoreText.width, scoreText.height) * 0.1}px Arial`;
        const text = "R = RESTART\nSPACE = PAUSE\n↑,W = UP  \n←,A = LEFT\n↓,S = DOWN\n→,D = RIGHT\nESC = LEAVE";

        const lines = text.split("\n");

        lines.forEach((line, index) => {
            ctx.fillText(
                line,
                scoreText.x + scoreText.width / 2,
                scoreText.y + scoreText.height + index * 30
            );
});
}

function drawPause(){

    ctx.fillStyle = colors.pause;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = colors.sub;
    ctx.font = `${board.height * 0.08}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "PAUSE",
        board.x + board.width / 2,
        board.y + board.height / 2
    )
}

function drawBtn(button){
    ctx.fillStyle = "#222";
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    ctx.fillRect(button.x, button.y, button.width, button.height);
    ctx.strokeRect(button.x, button.y, button.width, button.height);

    ctx.fillStyle = colors.sub;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = `${Math.min(button.width, button.height) * 0.6}px Arial`;

    ctx.fillText(
    button.text,
    button.x + button.width / 2,
    button.y + button.height / 2
    );
}

function drawGrid(){
    for(let i = 0; i <= columns; i++){
        ctx.strokeStyle = colors.grid;
        ctx.beginPath();

        ctx.moveTo(board.x + i * tileSize, board.y);

        ctx.lineTo(board.x + i * tileSize,board.y + board.height /*canvas.height // for fullscreen*/);

        ctx.stroke();
    }

    for(let i = 0; i <= rows; i++){
        ctx.strokeStyle = colors.grid;
        ctx.beginPath();

        ctx.moveTo(board.x, board.y + i * tileSize);

        ctx.lineTo(board.x + board.width, board.y + i * tileSize);

        ctx.stroke();
    }
};

function gameLogic(){

    if(checkCollision()){
        score.text = 0;
        gameState = states.GAMEOVER;
    }
    else{
                
        if(snake[0].x === food.x && snake[0].y === food.y){
            createFood();
            score.text ++;
            if(score.text >= highscore.text){
                highscore.text = score.text;
                localStorage.setItem("highscore", highscore.text);
            }
            snake.push({x: snake[snake.length - 1].x, y: snake[snake.length - 1].y});
        }
    }
}

function createFood(){

    let validPosition = false;

    food.x = Math.floor(Math.random() * columns);
    food.y = Math.floor(Math.random() * rows);

    while(!validPosition){

        food.x = Math.floor(Math.random() * columns);
        food.y = Math.floor(Math.random() * rows);

        validPosition = true;

        for(let i = 0; i < snake.length; i++){
            if(food.x === snake[i].x && food.y === snake[i].y){
                validPosition = false;
                break; //make it so you can win if theres no place for apples
            }
        }
    }
}

function update(time){

    if(time - lastMove < speed){
        return;
    }

    lastMove = time;


    if(nextDirection === "up" && direction !== "down"){
        direction = "up";
    }

    if(nextDirection === "down" && direction !== "up"){
        direction = "down";
    }

    if(nextDirection === "left" && direction !== "right"){
        direction = "left";
    }

    if(nextDirection === "right" && direction !== "left"){
        direction = "right";
    }




    for(let i = snake.length - 1; i>= 1; i--){
            snake[i].y = snake[i-1].y;
            snake[i].x= snake[i-1].x;
        }


    if(direction === "up"){
        snake[0].y -= 1;
    }

    if(direction === "down"){
        snake[0].y += 1;
    }

    if(direction === "left"){
        snake[0].x -= 1;
    }

    if(direction === "right"){
        snake[0].x += 1;
    }

}

function checkCollision(){
    if(snake[0].x >= columns
        || snake[0].x < 0 
        || snake[0].y >= rows
        || snake[0].y < 0){
        return true;
    }

    for(let i = 1;i < snake.length; i++){

        if(snake[0].x === snake[i].x
           && snake[0].y === snake[i].y){
            return true;
        } 
    }
    return false;
}

function updateBoard(){

    tileSize = Math.min(
        canvas.width * 0.8 / columns,
        canvas.height * 0.8 / rows
    )

    board.width = columns * tileSize;
    board.height = rows * tileSize;

    board.x = (canvas.width - board.width) / 2;
    board.y = (canvas.height - board.height) / 2;
}

function restartGame(){

    snake.length = 0;

    snake.push(
        {x:5, y:5},
        {x:4, y:5}
    );

    createFood();

    direction = "right";
    nextDirection = "right";
    
}
document.addEventListener("keydown", event =>{
    
    if(event.key === "ArrowUp" || event.key === "w"){
        nextDirection = "up";
    }

    if(event.key === "ArrowDown" || event.key === "s"){
        nextDirection = "down";
    }

    if(event.key === "ArrowLeft" || event.key === "a"){
        nextDirection = "left";
    }

    if(event.key === "ArrowRight" || event.key === "d"){
        nextDirection = "right";
    }

    if(event.key === "r" && gameState === states.GAMEOVER){
        gameState = states.GAME;
        restartGame();
    }

    if(event.code === "Space"){
        if(gameState === states.GAME){
            gameState = states.PAUSE;
            pauseSound.volume = 0.2;
            pauseSound.play();
        }
        else if(gameState === states.PAUSE){
            gameState = states.GAME;
        }
    }

    if(event.key === "Escape"){
            gameState = states.MENU;
            score.text = 0;
    }
})

canvas.addEventListener("pointerdown", event =>{
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    for(const button of Menubuttons) {
        if (
            mouseX >= button.x &&
            mouseX <= button.x + button.width &&
            mouseY >= button.y &&
            mouseY <= button.y + button.height
){
    console.log(button.action);
    switch (button.action) {
        case "play":
            gameState = states.START;
            break;

        case "settings":
            console.log("Settings");
            break;

        case "extras":
            console.log("Extras");
            break;
    }
}   
}

    for(const button of Startbuttons){
        if (
            mouseX >= button.x &&
            mouseX <= button.x + button.width &&
            mouseY >= button.y &&
            mouseY <= button.y + button.height
        ){
            switch(button.action){
                case "playgame":
                    gameState = states.GAME;
                    restartGame();
                    break;
            }
        }
    }

    for(const button of UIbuttons){
        if (
            mouseX >= button.x &&
            mouseX <= button.x + button.width &&
            mouseY >= button.y &&
            mouseY <= button.y + button.height
        ){
            switch(button.action){
                case "leavegame":
                    gameState = states.MENU;
                    score.text = 0;
                    break;
            }
            switch(button.action){
                case "goup":
                    nextDirection = "up";
                    break;
            }
            switch(button.action){
                case "godown":
                    nextDirection = "down";
                    break;
            }
            switch(button.action){
                case "goleft":
                    nextDirection = "left";
                    break;
            }
            switch(button.action){
                case "goright":
                    nextDirection = "right";
                    break;
            }  
            switch(button.action){
                case "pause":
                    if(gameState === states.GAME){
                        gameState = states.PAUSE;
                    }
                    else if(gameState === states.PAUSE){
                        gameState = states.GAME;
                    }
                    break;
            }                 

            
        }
    }
})

window.addEventListener("resize", event =>{
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    updateBoard();

    if(gameState === states.GAME){
        draw();
        drawUI();
    }
    
    if(gameState === states.MENU){
        drawMenu();
    }
    if(gameState === states.START){
        drawStart();
        drawUI();
    }
    if(gameState === states.GAMEOVER){
        drawGameover();
        drawUI();
    }
    if(gameState === states.PAUSE){
        draw()
        drawUI();
        drawPause();
    }


})
updateBoard();
createFood();
gameLoop();
drawMenu();

