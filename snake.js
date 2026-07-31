const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const images ={
    board: new Image(),
    background: new Image(),
    snake: new Image(),
    snake2: new Image(),
    snake3: new Image(),
    food: new Image(),
}
const sounds ={
    pause: new Audio(),
    music: new Audio(),
    getPoint: new Audio(),
    lost: new Audio(),
}
sounds.pause.src =("audio/pause.mp3");
sounds.music.src =("audio/music.mp3");
sounds.music.loop = true;
sounds.music.volume = 0.05;
sounds.getPoint.src = ("audio/kamimashita.mp3");
sounds.getPoint.volume = 0.2;
sounds.lost.src = "audio/sound1.mp3";
sounds.lost.volume = 0.2;
sounds.lost.loop = false;

images.board.src = "images/lost.jpg";
images.background.src = "images/background2.jpg";
images.snake.src = "images/snake.jpg";
images.snake2.src = "images/snake2.jpg";

images.food.src = "images/food.jpg";



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
        btnhover: "rgb(37, 37, 37)",
        btnclick: "rgb(48, 48, 48)",
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
        btnhover: "rgb(10, 48, 54)",
        btnclick: "rgb(12, 57, 64)",
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
        btnhover: "rgb(168, 168, 168)",
        btnclick: "rgb(98, 98, 98)",
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
        btnhover: "#5f6d58",
        btnclick: "#495444",
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
        btnhover: "#281278",
        btnclick: "#1f0e5e",
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
        btnhover: "#9d2551",
        btnclick: "#821e43",  
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
        btnhover: "#202426",
        btnclick: "#181b1c",
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
        btnhover: "#7c746a",   
        btnclick: "#615b53",
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
        btnhover: "#3a0412",
        btnclick: "#28030d",     
        sub: "#d3daed",
        border: "#000000",
        snake: "#765e76",
        food: "#e95111",
        grid: "rgb(0,0,0)",
        pause: "rgba(0,0,0,0.6)",
        gameoverbg: "#5c2c46"
    },
    bake: {
        menu: "#0D0D0D",
        menuBackground: "#1B1028",
        background: "#0D0D0D",
        btnbackground: "#1B1028",
        btnhover: "#28183b",
        btnclick: "#FFD166",     
        sub: "#F5F5F5",
        border: "#000000",
        snake: "#b966b9",
        food: "#da6e40",
        grid: "rgb(0,0,0)",
        pause: "rgba(0,0,0,0.6)",
        gameoverbg: "#EF4444"
    },

};

let colors = themes.classic;
let imageTheme = false;

const savedTheme = localStorage.getItem("theme");

imageTheme = localStorage.getItem("imageTheme") === "true";

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
        action: "extras",
        hover: false,
        pressed: false,
    },
    {
        text: "PLAY",
        action: "play",
        hover: false,
        pressed: false
    },
    {
        text: "SETTINGS",
        action: "settings",
        hover: false,
        pressed: false
    },
]
const Startbuttons = [{
    text: "PLAY",
    action: "playgame",
    hover: false,
    pressed: false
}]

const UIbuttons = [{
        text: "LEAVE",
        action: "leavegame",
        hover: false,
        pressed: false
    },
    {
        text: "↑",
        action: "goup",
        radius: 50,
        hover: false,
        pressed: false
    },
    {
        text: "↓",
        action: "godown",
        radius: 50,
        hover: false,
        pressed: false
    },
    {
        text: "←",
        action: "goleft",
        radius: 50,
        hover: false,
        pressed: false
    },
    {
        text: "→",
        action: "goright",
        radius: 50,
        hover: false,
        pressed: false
    },
    {
        text: "PAUSE",
        action: "pause",
        hover: false,
        pressed: false
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
        action: "reduceSize",
        hover: false,
        pressed: false
    },
    {
        text: "+",
        action: "addSize",
        hover: false,
        pressed: false
    },
    {
        text: "LEAVE",
        action: "leave",
        hover: false,
        pressed: false
    },
    {
        text: "-",
        action: "reduceX",
        hover: false,
        pressed: false
    },
        {
        text: "+",
        action: "addX",
        hover: false,
        pressed: false
    },
        {
        text: "-",
        action: "reduceY",
        hover: false,
        pressed: false
    },
        {
        text: "+",
        action: "addY",
        hover: false,
        pressed: false
    },
]

const extraBtns = [{
        text: "CLASSIC",
        action: "changetheme1",
        hover: false,
        pressed: false
    },
    {
        text: "NEON",
        action: "changetheme2",
        hover: false,
        pressed: false
    },
    {
        text: "LIGHT",
        action: "changetheme3",
        hover: false,
        pressed: false
    },
    {
        text: "LEAVE",
        action: "leave",
        hover: false,
        pressed: false
    },
    {
        text: "EARTH",
        action: "changetheme4",
        hover: false,
        pressed: false
    },
    {
        text: "PURPLE",
        action: "changetheme5",
        hover: false,
        pressed: false
    },
    {
        text: "ELFEN LIED",
        action: "changetheme6",
        hover: false,
        pressed: false
    },
    {
        text: "SEWERS",
        action: "changetheme7",
        hover: false,
        pressed: false
    },
    {
        text: "OCEAN",
        action: "changetheme8",
        hover: false,
        pressed: false
    },
    {
        text: "FALL",
        action: "changetheme9",
        hover: false,
        pressed: false
    },
    {
        text: "UNLOCK BY GETTING 50 POINTS",
        action: "changetheme10",
        hover: false,
        pressed: false,
        locked: true
    },

]

let score = UIlabels[3];
let highscore = UIlabels[2];
highscore.text = localStorage.getItem("highscore", highscore.text) || 0;

let unlocked;

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

    if(imageTheme){
        ctx.drawImage(
        images.background,
        0,
        0,
        canvas.width,
        canvas.height);
    }
    else{
        ctx.fillStyle = colors.menu;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

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

    if(imageTheme){
        ctx.drawImage(
        images.background,
        0,
        0,
        canvas.width,
        canvas.height);

        ctx.fillStyle = "rgba(27, 16, 40, 0.35)";
        ctx.fillRect(
            board.x,
            board.y,
            board.width,
            board.height
        );
    }
    else{
        ctx.fillStyle = colors.background;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

    drawGrid();
        if(imageTheme){
            for(let i = 0; i < snake.length; i++){

            let snakeImage;

            if(i === 0){
                snakeImage = images.snake;
            }
        else{
            snakeImage = images.snake2;
        }

    ctx.drawImage(
        snakeImage,
        board.x + snake[i].x * tileSize,
        board.y + snake[i].y * tileSize,
        tileSize,
        tileSize
    );
}


        ctx.drawImage(
        images.food,
        board.x + food.x * tileSize,
        board.y + food.y * tileSize,
        tileSize,
        tileSize);
    }
    else{
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
    }

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

    if(imageTheme){
        ctx.drawImage(
        images.background,
        0,
        0,
        canvas.width,
        canvas.height);

        ctx.fillStyle = "rgba(27, 16, 40, 0.35)";
        ctx.fillRect(
            board.x,
            board.y,
            board.width,
            board.height
        );
    }
    else{
        ctx.fillStyle = colors.background;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

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

    if(imageTheme){
        ctx.drawImage(
        images.background,
        0,
        0,
        canvas.width,
        canvas.height);
    }
    else{
        ctx.fillStyle = colors.background;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    ctx.strokeStyle = colors.border;
    ctx.lineWidth = Math.min(board.width, board.height) * 0.005;

    ctx.strokeRect(
        board.x,
        board.y,
        board.width,
        board.height
    );

    if(imageTheme){
        ctx.drawImage(
        images.board,
        board.x,
        board.y,
        board.width,
        board.height);

        ctx.fillStyle = colors.gameoverbg;
        ctx.font = `${board.height * 0.08}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.fillText(
        "GAME OVER",
        board.x + board.width / 2,
        board.y + board.height / 9
    )
    }
    else{
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
    }

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

    if(imageTheme){
        ctx.drawImage(
        images.background,
        0,
        0,
        canvas.width,
        canvas.height);
    }
    else{
        ctx.fillStyle = colors.menu;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

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

    if(imageTheme){
        ctx.drawImage(
        images.background,
        0,
        0,
        canvas.width,
        canvas.height);
    }
    else{
        ctx.fillStyle = colors.menu;
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }

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
    const bakemono = extraBtns[10];

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

    bakemono.x = board.x + gap;
    bakemono.y = board.y + board.height / 1.25;
    bakemono.width = board.width * 0.8;
    bakemono.height = board.height * 0.1;
    bakemono.fontScale = 0.5;
    
    if(highscore.text >= 50){
        bakemono.text = "BAKEMONOGATARI";
        bakemono.locked = false;
    }
    else{
        bakemono.text = "UNLOCK BY GETTING 50 POINTS";
        bakemono.locked = true;
    }

    drawBtn(theme1);
    drawBtn(theme2);
    drawBtn(theme3);
    drawBtn(theme4);
    drawBtn(theme5);
    drawBtn(theme6);
    drawBtn(theme7);
    drawBtn(theme8);
    drawBtn(theme9);
    drawBtn(bakemono);

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

    if (button.pressed) {
    ctx.fillStyle = colors.btnclick;
    }
    else if (button.hover) {
        ctx.fillStyle = colors.btnhover;
    }
    else {
        ctx.fillStyle = colors.btnbackground;
    }
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

        if(imageTheme){
            sounds.lost.play();
        }
    }
    else{
                
        if(snake[0].x === food.x && snake[0].y === food.y){
            createFood();
            if(imageTheme){
                let eat = sounds.getPoint.cloneNode();
                eat.play();
            }
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

function toggleThemeMusic(enabled){
    if(enabled){
        sounds.music.play();
    }
    else{
        sounds.music.pause();
        sounds.music.currentTime = 0;
    }
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
        sounds.lost.pause();
        sounds.lost.currentTime = 0;
        gameState = states.GAME;
        restartGame();
    }

    if(event.code === "Space"){
        if(gameState === states.GAME){
            gameState = states.PAUSE;
            sounds.pause.volume = 0.2;
            sounds.pause.play();
        }
        else if(gameState === states.PAUSE){
            gameState = states.GAME;
        }
    }

    if(event.key === "Escape"){
            sounds.lost.pause();
            sounds.lost.currentTime = 0;
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
                button.pressed = true;
                gameState = states.START;
                return;

            case "settings":
                button.pressed = true;
                gameState = states.SETTINGS;
                return;

            case "extras":
                button.pressed = true;
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
                        sounds.lost.pause();
                        sounds.lost.currentTime = 0;
                        button.pressed = true;
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
                        sounds.lost.pause();
                        sounds.lost.currentTime = 0;
                        button.pressed = true;
                        gameState = states.MENU;
                        score.text = 0;
                        break;
                }
                switch(button.action){
                    case "goup":
                        button.pressed = true;
                        nextDirection = "up";
                        break;
                }
                switch(button.action){
                    case "godown":
                        button.pressed = true;
                        nextDirection = "down";
                        break;
                }
                switch(button.action){
                    case "goleft":
                        button.pressed = true;
                        nextDirection = "left";
                        break;
                }
                switch(button.action){
                    case "goright":
                        button.pressed = true;
                        nextDirection = "right";
                        break;
                }  
                switch(button.action){
                    case "pause":
                        button.pressed = true;
                        if(gameState === states.GAME){
                            gameState = states.PAUSE;
                            sounds.pause.volume = 0.2;
                            sounds.pause.play();
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
                        button.pressed = true;
                        arrowScale = Math.max(0, Number((arrowScale - 0.05).toFixed(2)));
                        localStorage.setItem("arrowScale", arrowScale);
                        break;
                    case "addSize":
                        button.pressed = true;
                        arrowScale = Math.min(3, Number((arrowScale + 0.05).toFixed(2)));
                        localStorage.setItem("arrowScale", arrowScale);
                        break;
                    case "reduceX":
                        button.pressed = true;
                        Xscale = Number((Xscale + 0.05).toFixed(2));
                        localStorage.setItem("Xscale", Xscale);
                        break;
                    case "addX":
                        button.pressed = true;
                        Xscale = Number((Xscale - 0.05).toFixed(2));
                        localStorage.setItem("Xscale", Xscale);
                        break;
                    case "reduceY":
                        button.pressed = true;
                        Yscale = Number((Yscale - 0.05).toFixed(2));
                        localStorage.setItem("Yscale", Yscale);
                        break;
                    case "addY":
                        button.pressed = true;
                        Yscale = Number((Yscale + 0.05).toFixed(2));
                        localStorage.setItem("Yscale", Yscale);
                        break;
                    case "leave":
                        button.pressed = true;
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
                        button.pressed = true;
                        colors = themes.classic;
                        toggleThemeMusic(false);
                        localStorage.setItem("theme", "classic");
                        imageTheme = false;
                        localStorage.setItem("imageTheme", false);
                        break;
                    case "changetheme2":
                        button.pressed = true;
                        colors = themes.neon;
                        toggleThemeMusic(false);
                        imageTheme = false;
                        localStorage.setItem("imageTheme", false);
                        localStorage.setItem("theme", "neon");
                        break;
                    case "changetheme3":
                        button.pressed = true;
                        colors = themes.light;
                        toggleThemeMusic(false);
                        imageTheme = false;
                        localStorage.setItem("imageTheme", false);
                        localStorage.setItem("theme", "light");
                        break;
                    case "changetheme4":
                        button.pressed = true;
                        colors = themes.earth;
                        toggleThemeMusic(false);
                        imageTheme = false;
                        localStorage.setItem("imageTheme", false);
                        localStorage.setItem("theme", "earth");
                        break;
                    case "changetheme5":
                        button.pressed = true;
                        colors = themes.purple;
                        toggleThemeMusic(false);
                        imageTheme = false;
                        localStorage.setItem("imageTheme", false);
                        localStorage.setItem("theme", "purple");
                        break;
                    case "changetheme6":
                        button.pressed = true;
                        colors = themes.elfenlied;
                        toggleThemeMusic(false);
                        imageTheme = false;
                        localStorage.setItem("imageTheme", false);
                        localStorage.setItem("theme", "elfenlied");
                        break;
                    case "changetheme7":
                        button.pressed = true;
                        colors = themes.sewers;
                        toggleThemeMusic(false);
                        localStorage.setItem("theme", "sewers");
                        imageTheme = false;
                        localStorage.setItem("imageTheme", false);
                        break;
                    case "changetheme8":
                        button.pressed = true;
                        colors = themes.ocean;
                        toggleThemeMusic(false);
                        localStorage.setItem("theme", "ocean");
                        imageTheme = false;
                        localStorage.setItem("imageTheme", false);
                        break;
                    case "changetheme9":
                        button.pressed = true;
                        colors = themes.fall;
                        toggleThemeMusic(false);
                        localStorage.setItem("theme", "fall");
                        imageTheme = false;
                        localStorage.setItem("imageTheme", false);
                        
                        break;
                    case "changetheme10":
                        if(button.locked){
                            break;
                        }
                        else{
                            button.pressed = true;
                            imageTheme = true;
                            colors = themes.bake;
                            localStorage.setItem("theme", "bake");
                            localStorage.setItem("imageTheme", true);

                            toggleThemeMusic(true);
                            break;
                        }
                    case "leave":
                        button.pressed = true;
                        gameState = states.MENU;
                        break;
                }
            }
        }
    }
});

canvas.addEventListener("pointermove", event => {
    const mouseX = event.offsetX;
    const mouseY = event.offsetY;

    const allButtons = [
    ...Menubuttons,
    ...Startbuttons,
    ...UIbuttons,
    ...settingsBtns,
    ...extraBtns];

    for (const button of allButtons) {
        button.hover = false;
    }

    let buttons = [];

    switch (gameState) {
        case states.MENU:
            buttons = Menubuttons;
            break;
        case states.START:
            buttons = [...Startbuttons, ...UIbuttons];
            break;
        case states.SETTINGS:
            buttons = settingsBtns;
            break;
        case states.EXTRA:
            buttons = extraBtns;
            break;
        case states.START:
        case states.GAME:
        case states.PAUSE:
        case states.GAMEOVER:
            buttons = UIbuttons;
            break;
    }

    let hovering = false;

    for (const button of buttons) {
        button.hover =
        mouseX >= button.x &&
        mouseX <= button.x + button.width &&
        mouseY >= button.y &&
        mouseY <= button.y + button.height;

        if(button.hover){
            hovering = true;
        }
    }

    canvas.style.cursor = hovering ? "pointer" : "default";
});

canvas.addEventListener("pointerup", () => {
    for (const list of [
        Menubuttons,
        Startbuttons,
        UIbuttons,
        settingsBtns,
        extraBtns
    ]) {
        for (const button of list) {
            button.pressed = false;
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

