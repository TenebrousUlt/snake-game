const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const pauseSound = new Audio("audio/touhou-pause-sfx.mp3");

let tileSize;
//const tileSize = 50;

const columns = 20; /*Math.floor(canvas.width / tileSize);*/ // for fullscreen
const rows = 15;/*Math.floor(canvas.height / tileSize);*/ //for fullscreen

let arrowScale = 1;
arrowScale = Number(localStorage.getItem("arrowScale")) || 1;

let Xscale = 0.3;
let Yscale = 0.65;

Xscale = Number(localStorage.getItem("Xscale")) || 0.3;
Yscale = Number(localStorage.getItem("Yscale")) || 0.65;


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

const themes = {
    classic: {
        menu: "rgb(0, 0, 0)",
        menuBackground: "rgb(28, 28, 28)",
        background: "rgb(0, 0, 0)",
        btnbackground: "rgb(19, 17, 17)",
        sub: "rgb(255, 255, 255)",
        border: "rgb(255, 255, 255)",
        snake: "rgb(74, 235, 46)",
        food: "rgb(255, 0, 0)",
        grid: "rgb(29, 27, 27)",
        pause: "rgba(0, 0, 0, 0.5)",
        gameoverbg: "rgba(255, 0, 0, 0.55)",
    },
    neon: {
        menu: "#001122",
        menuBackground: "#000814",
        background: "#000000",
        btnbackground: "rgb(5, 24, 27)",
        sub: "#00ffff",
        border: "#00ffff",
        snake: "#00ff66",
        food: "#ff00ff",
        grid: "#003344",
        pause: "rgba(0,0,0,0.6)",
        gameoverbg: "rgba(255,0,255,0.4)"
    },
    light: {
        menu: "#dddddd",
        menuBackground: "#cccccc",
        background: "#ffffff",
        btnbackground: "rgb(218, 217, 217)",        
        sub: "#222222",
        border: "#222222",
        snake: "#2ecc71",
        food: "#e74c3c",
        grid: "rgb(0,0,0)",
        pause: "rgba(255,255,255,0.5)",
        gameoverbg: "rgba(255,0,0,0.3)"
    },
    earth: {
        menu: "#3e563e",
        menuBackground: "#1f2f22",
        background: "#091008",
        btnbackground: "#93a889",        
        sub: "#ced9df",
        border: "#93a889",
        snake: "#7993a0",
        food: "#523e3c",
        grid: "rgb(38, 49, 43)",
        pause: "rgba(0,0,0,0.6)",
        gameoverbg: "rgba(120, 0, 0, 0.3)"
    },
    purple: {
        menu: "#4e19a6",
        menuBackground: "#5f2396",
        background: "#140729",
        btnbackground: "#35189f",        
        sub: "#c7a6e5",
        border: "#1b0146",
        snake: "#4863e7",
        food: "#cab3df",
        grid: "rgb(15, 0, 31)",
        pause: "rgba(0,0,0,0.6)",
        gameoverbg: "rgba(46, 22, 50, 0.3)"
    },
    elfenlied: {
        menu: "#a70545",
        menuBackground: "#c40752",
        background: "#63032a",
        btnbackground: "#c63067",           
        sub: "#060004",
        border: "#b12c5d",
        snake: "#dc9dc5",
        food: "#ff1b02",
        grid: "#ad0a4b45",
        pause: "rgba(0,0,0,0.6)",
        gameoverbg: "#d10a5a3c"
    },
    sewers: {
        menu: "#373d34",
        menuBackground: "#232322",
        background: "#131716",
        btnbackground: "#2c3134",
        sub: "	#464f54",
        border: "#2c3134",
        snake: "#486c57",
        food: "#613b36",
        grid: "#202113",
        pause: "rgba(0,0,0,0.6)",
        gameoverbg: "rgba(97, 44, 44, 0.3)"
    },
    ocean: {
        menu: "#81A6C6",
        menuBackground: "#AACDDC",
        background: "#81A6C6",
        btnbackground: "#a0968a",        
        sub: "#F3E3D0",
        border: "#8fc7db",
        snake: "#b3dfc5",
        food: "#edc3bf",
        grid: "rgb(62, 93, 101)",
        pause: "rgba(0,0,0,0.6)",
        gameoverbg: "rgba(236, 145, 145, 0.3)"
    },
    fall: {
        menu: "#480c25",
        menuBackground: "#5f152e",
        background: "#1a0208",
        btnbackground: "#520519",        
        sub: "#d3daed",
        border: "#000000",
        snake: "#765e76",
        food: "#e95111",
        grid: "rgb(0,0,0)",
        pause: "rgba(0,0,0,0.6)",
        gameoverbg: "#5c2c46"
    },

};

let colors = themes.classic;

const savedTheme = localStorage.getItem("theme");

if(savedTheme && themes[savedTheme]){
    colors = themes[savedTheme];
}
else{
    colors = themes.classic;
}


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
        action: "goup",
        radius: 50
    },
    {
        text: "↓",
        action: "godown",
        radius: 50
    },
    {
        text: "←",
        action: "goleft",
        radius: 50
    },
    {
        text: "→",
        action: "goright",
        radius: 50
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

const settingsBtns = [{
        text: "-",
        action: "reduceSize"
    },
    {
        text: "+",
        action: "addSize"
    },
    {
        text: "LEAVE",
        action: "leave"
    },
    {
        text: "-",
        action: "reduceX"
    },
        {
        text: "+",
        action: "addX"
    },
        {
        text: "-",
        action: "reduceY"
    },
        {
        text: "+",
        action: "addY"
    },
]

const extraBtns = [{
        text: "CLASSIC",
        action: "changetheme1"
    },
    {
        text: "NEON",
        action: "changetheme2"
    },
    {
        text: "LIGHT",
        action: "changetheme3"
    },
    {
        text: "LEAVE",
        action: "leave"
    },
    {
        text: "EARTH",
        action: "changetheme4"
    },
    {
        text: "PURPLE",
        action: "changetheme5"
    },
    {
        text: "ELFEN LIED",
        action: "changetheme6"
    },
    {
        text: "SEWERS",
        action: "changetheme7"
    },
    {
        text: "OCEAN",
        action: "changetheme8"
    },
    {
        text: "FALL",
        action: "changetheme9"
    },
]

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
        
        case states.SETTINGS:

            drawSettings();
            break;

        case states.EXTRA:

            drawExtra();
            break;
    }
}


function drawMenu(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = colors.menu;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = colors.sub;
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

    ctx.strokeStyle = colors.border;
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


        const startX = board.x - board.width * Xscale;
        const startY = board.y + board.height * Yscale;
        const gap = board.width * 0.03;
        const arrowSize = board.width * 0.09 * arrowScale;
        

        const UP = UIbuttons[1];
        const DOWN = UIbuttons[2];
        const LEFT = UIbuttons[3];
        const RIGHT = UIbuttons[4];

        const buttonGap = arrowSize * 0.1;

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

function drawSettings(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = colors.menu;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = colors.menuBackground; 
    ctx.fillRect(board.x,board.y,board.width,board.height);

    ctx.strokeStyle = colors.border;
    ctx.lineWidth = Math.min(board.width, board.height) * 0.005;

    ctx.strokeRect(
        board.x,
        board.y,
        board.width,
        board.height
    );

    ctx.fillStyle = colors.sub;
    ctx.font = `${board.height * 0.05}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "CHANGE ARROWS SIZE",
        board.x + board.width / 2,
        board.y + board.height / 11
    )

    ctx.font = `${board.height * 0.08}px Arial`;
    ctx.fillText(
        arrowScale,
        board.x + board.width / 2,
        board.y + board.height / 5
    )

    const plusSize = settingsBtns[0];
    const minusSize = settingsBtns[1];

    const buttonSize = board.width * 0.1;
    const gap = board.width * 0.3;
    

    for(const label of settingsBtns){
        label.width = buttonSize;
        label.height = buttonSize;
    }

    plusSize.x = board.x + gap;
    plusSize.y = board.y + board.height / 8

    minusSize.x = board.x + (gap * 2);
    minusSize.y = board.y + board.height / 8

    drawBtn(plusSize);
    drawBtn(minusSize);


    ctx.fillStyle = colors.sub;
    ctx.font = `${board.height * 0.05}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "CHANGE ARROWS X POSITION(0.3)",
        board.x + board.width / 2,
        board.y + board.height / 3
    )

    ctx.font = `${board.height * 0.08}px Arial`;
    ctx.fillText(
        Xscale,
        board.x + board.width / 2,
        board.y + board.height / 2.1
    )


    ctx.fillStyle = colors.sub;
    ctx.font = `${board.height * 0.05}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "CHANGE ARROWS Y POSITION(0.65)",
        board.x + board.width / 2,
        board.y + board.height / 1.65
    )

    ctx.font = `${board.height * 0.08}px Arial`;
    ctx.fillText(
        Yscale,
        board.x + board.width / 2,
        board.y + board.height / 1.3
    )


    const plusX = settingsBtns[3];
    const minusX = settingsBtns[4];
    const plusY = settingsBtns[5];
    const minusY = settingsBtns[6];

    plusX.x = board.x + gap;
    plusX.y = board.y + board.height / 2.5;

    minusX.x = board.x + (gap * 2);
    minusX.y = board.y + board.height / 2.5;

    plusY.x = board.x + gap;
    plusY.y = board.y + board.height / 1.45;

    minusY.x = board.x + (gap * 2);
    minusY.y = board.y + board.height / 1.45;

    drawBtn(plusX);
    drawBtn(minusX);
    drawBtn(plusY);
    drawBtn(minusY);


    const leaveBtn = settingsBtns[2];

    leaveBtn.width = board.width * 0.2;
    leaveBtn.height = board.height * 0.1;

    leaveBtn.x = board.x + board.width / 2 - leaveBtn.width / 2;
    leaveBtn.y = board.y + board.height - leaveBtn.height * 0.01;

    drawBtn(leaveBtn);


}

function drawExtra(){
    ctx.clearRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = colors.menu;
    ctx.fillRect(0,0,canvas.width,canvas.height);

    ctx.fillStyle = colors.menuBackground; 
    ctx.fillRect(board.x,board.y,board.width,board.height);

    ctx.strokeStyle = colors.border;
    ctx.lineWidth = Math.min(board.width, board.height) * 0.005;

    ctx.strokeRect(
        board.x,
        board.y,
        board.width,
        board.height
    );

    ctx.fillStyle = colors.sub;
    ctx.font = `${board.height * 0.08}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.fillText(
        "CHANGE THEMES",
        board.x + board.width / 2,
        board.y + board.height / 11
    )
    
    const buttonWidth = board.width * 0.2;
    const buttonHeight = board.width * 0.1;
    const gap = board.width * 0.1;

    for(const label of extraBtns){
        label.width = buttonWidth;
        label.height = buttonHeight;
    }
    const theme1 = extraBtns[0];
    const theme2 = extraBtns[1];
    const theme3 = extraBtns[2];
    const theme4 = extraBtns[4];
    const theme5 = extraBtns[5];
    const theme6 = extraBtns[6];
    const theme7 = extraBtns[7];
    const theme8 = extraBtns[8];
    const theme9 = extraBtns[9];

    for(const button of extraBtns){
        if(button.action === "leave") continue;

        button.fontScale = 0.3;
    }
    

    theme1.x = board.x + gap;
    theme1.y = board.y + board.height / 6;

    theme2.x = board.x + board.width / 2 - theme2.width / 2;
    theme2.y = board.y + board.height / 6;

    theme3.x = board.x + board.width - gap - theme3.width;
    theme3.y = board.y + board.height / 6;

    theme4.x = board.x + gap;
    theme4.y = board.y + board.height / 2.75;

    theme5.x = board.x + board.width / 2 - theme2.width / 2;
    theme5.y = board.y + board.height / 2.75;

    theme6.x = board.x + board.width - gap - theme3.width;
    theme6.y = board.y + board.height / 2.75;

    theme7.x = board.x + gap;
    theme7.y = board.y + board.height / 1.75;

    theme8.x = board.x + board.width / 2 - theme2.width / 2;
    theme8.y = board.y + board.height / 1.75;

    theme9.x = board.x + board.width - gap - theme3.width;
    theme9.y = board.y + board.height / 1.75;

    drawBtn(theme1);
    drawBtn(theme2);
    drawBtn(theme3);
    drawBtn(theme4);
    drawBtn(theme5);
    drawBtn(theme6);
    drawBtn(theme7);
    drawBtn(theme8);
    drawBtn(theme9);

    const leaveBtn = extraBtns[3];

    leaveBtn.width = board.width * 0.2;
    leaveBtn.height = board.height * 0.1;

    leaveBtn.x = board.x + board.width / 2 - leaveBtn.width / 2;
    leaveBtn.y = board.y + board.height - leaveBtn.height * 0.01;

    drawBtn(leaveBtn);
}

function drawPause(){

    ctx.fillStyle = colors.pause;
    ctx.fillRect(0,0,canvas.width,canvas.height);

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
    ctx.fillStyle = colors.btnbackground;
    ctx.strokeStyle = colors.sub;
    ctx.lineWidth = 2;

    const fontScale = button.fontScale || 0.6

    if (button.radius) {
        ctx.beginPath();
        ctx.roundRect(button.x, button.y, button.width, button.height, button.radius);
        ctx.fill();
        ctx.stroke();
    }
    else{
        ctx.fillRect(button.x, button.y, button.width, button.height);
        ctx.strokeRect(button.x, button.y, button.width, button.height);
    }

    ctx.fillStyle = colors.sub;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.font = `${Math.min(button.width, button.height) * fontScale}px Arial`;

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

    if(gameState === states.MENU){
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
                return;

            case "settings":
                gameState = states.SETTINGS;
                return;

            case "extras":
                gameState = states.EXTRA;
                return;
        }
            }   
        }
    }

    if(gameState === states.START || gameState === states.GAMEOVER){
        for(const button of Startbuttons){
            if (
                mouseX >= button.x &&
                mouseX <= button.x + button.width &&
                mouseY >= button.y &&
                mouseY <= button.y + button.height
            ){
                switch(button.action){
                    case "playgame":
                        if(gameState === states.START || gameState === states.GAMEOVER){
                            gameState = states.GAME;
                            restartGame();
                            break;
                        }
                }
            }
        }
    }

    if(gameState === states.START || gameState === states.GAME || states.GAMEOVER){
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
                            pauseSound.volume = 0.2;
                            pauseSound.play();
                        }
                        else if(gameState === states.PAUSE){
                            gameState = states.GAME;
                        }
                        break;
                }                 

                
            }
        }
    }

    if(gameState === states.SETTINGS){
        for(const button of settingsBtns){
            if (
                mouseX >= button.x &&
                mouseX <= button.x + button.width &&
                mouseY >= button.y &&
                mouseY <= button.y + button.height
            ){
                switch(button.action){
                    case "reduceSize":
                        arrowScale = Math.max(0, Number((arrowScale - 0.05).toFixed(2)));
                        localStorage.setItem("arrowScale", arrowScale);
                        break;
                    case "addSize":
                        arrowScale = Math.min(3, Number((arrowScale + 0.05).toFixed(2)));
                        localStorage.setItem("arrowScale", arrowScale);
                        break;
                    case "reduceX":
                        Xscale = Number((Xscale + 0.05).toFixed(2));
                        localStorage.setItem("Xscale", Xscale);
                        break;
                    case "addX":
                        Xscale = Number((Xscale - 0.05).toFixed(2));
                        localStorage.setItem("Xscale", Xscale);
                        break;
                    case "reduceY":
                        Yscale = Number((Yscale - 0.05).toFixed(2));
                        localStorage.setItem("Yscale", Yscale);
                        break;
                    case "addY":
                        Yscale = Number((Yscale + 0.05).toFixed(2));
                        localStorage.setItem("Yscale", Yscale);
                        break;
                    case "leave":
                        gameState = states.MENU;
                        break;
                }
            }
        }
    }

    if(gameState === states.EXTRA){
        for(const button of extraBtns){
            if (
                mouseX >= button.x &&
                mouseX <= button.x + button.width &&
                mouseY >= button.y &&
                mouseY <= button.y + button.height
            ){
                switch(button.action){
                    case "changetheme1":
                        colors = themes.classic;
                        localStorage.setItem("theme", "classic");
                        break;
                    case "changetheme2":
                        colors = themes.neon;
                        localStorage.setItem("theme", "neon");
                        break;
                    case "changetheme3":
                        colors = themes.light;
                        localStorage.setItem("theme", "light");
                        break;
                    case "changetheme4":
                        colors = themes.earth;
                        localStorage.setItem("theme", "earth");
                        break;
                    case "changetheme5":
                        colors = themes.purple;
                        localStorage.setItem("theme", "purple");
                        break;
                    case "changetheme6":
                        colors = themes.elfenlied;
                        localStorage.setItem("theme", "elfenlied");
                        break;
                    case "changetheme7":
                        colors = themes.sewers;
                        localStorage.setItem("theme", "sewers");
                        break;
                    case "changetheme8":
                        colors = themes.ocean;
                        localStorage.setItem("theme", "ocean");
                        break;
                    case "changetheme9":
                        colors = themes.fall;
                        localStorage.setItem("theme", "fall");
                        break;
                    /*case "changetheme3":
                        colors = themes.light;
                        localStorage.setItem("theme", "light");
                        break;*/
                    case "leave":
                        gameState = states.MENU;
                        break;
                }
            }
        }
    }
});

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
    if(gameState === states.SETTINGS){
        drawSettings();
    }
    if(gameState === states.EXTRA){
        drawExtra();
    }


})
updateBoard();
createFood();
gameLoop();
drawMenu();

