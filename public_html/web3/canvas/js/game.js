// Créer le canevas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = document.documentElement.clientWidth;
canvas.height = document.documentElement.clientHeight;
document.querySelector("#gameBox").appendChild(canvas);

// Charger les sprites
// Image d'arrière-plan
var bgReady = false;
var bgImage = new Image();
bgImage.src = "images/bg_lab.png";
bgImage.onload = function () {
    bgReady = true; 
};

// Estampe gagnant
var winReady = false;
var winImage = new Image(); 
winImage.src = "images/win.png"; 
winImage.onload = function () {
    winReady = true; 
};

var gameOver = false;
var gameOverImage = new Image(); 
gameOverImage.src = "images/over.png"; 
gameOverImage.onload = function () {
    gameOver = true; 
};

// Image du joueur
var playerReady = false;
var playerImage = new Image(); 
playerImage.src = "images/doctor_player.png"; 
playerImage.onload = function () {
    playerReady = true; 
};

// Image des goodies
var goodyAReady = false;
var goodyAImage = new Image(); 
goodyAImage.src = "images/green_goodie.png";
goodyAImage.onload = function () {
    goodyAReady = true; 
};

var goodyBReady = false;
var goodyBImage = new Image(); 
goodyBImage.src = "images/red_goodie.png";
goodyBImage.onload = function () {
    goodyBReady = true; 
};

// Image des baddies
var baddieAReady = false;
var baddieAImage = new Image(); 
baddieAImage.src = "images/red_baddie.png"; 
baddieAImage.onload = function () {
    baddieAReady = true; 
};

var baddieBReady = false;
var baddieBImage = new Image(); 
baddieBImage.src = "images/green_baddie.png"; 
baddieBImage.onload = function () {
    baddieBReady = true; 
};

// Créer des objets de jeu globaux 
var player = {
    speed : 5, // mouvement en pixels par tick 
    width: 90,
    height: 96
};

var goodies = [ 
    { width: 127, height: 48 }, 
    { width: 127, height: 48 }, 
    { width: 127, height: 48 }, 
    { width: 127, height: 48 },
    { width: 127, height: 48 },
    { width: 127, height: 48 }  
];

var baddies = [ 
    { width: 73, height: 69}
];

var goodyImagesArray = [goodyAImage, goodyBImage];
var baddieImagesArray = [baddieAImage, baddieBImage];

// Variables de vitesse
var vX = 0;
var vY = 0;

var lose = false;

// Gérer les commandes du clavier
addEventListener("keydown", function (e) {
    if (e.keyCode == 38) { // HAUT
        vX = 0;
        vY = -player.speed;
    }
    if (e.keyCode == 40) { // BAS
        vX = 0;
        vY = player.speed;
    }
    if (e.keyCode == 37) { // GAUCHE
        vX = -player.speed;
        vY = 0;
    }
    if (e.keyCode == 39) { // DROITE
        vX = player.speed;
        vY = 0;
    }
    if (e.keyCode == 32) { // ARRÊT barre d’espace
        vX = 0;
        vY = 0;
    }
}, false);

// Gérer les commandes tactiles
addEventListener("touchstart", function (e) {
    if (e.target.id == "uArrow") { // HAUT
        vX = 0;
        vY = -player.speed;
    }
    else if (e.target.id == "dArrow") { // BAS
        vX = 0;
        vY = player.speed;
    }
    else if (e.target.id == "lArrow") { // GAUCHE
        vX = -player.speed;
        vY = 0;
    }
    else if (e.target.id == "rArrow") { //DROIT
        vX = player.speed;
        vY = 0;
    }
    else { // ARRÊT S’arrête si vous touchez ailleurs
        vX = 0;
        vY = 0;
    }
});

//Définir l'état initial
var init = function () {
    player.x = (canvas.width - player.width) / 2; 
    player.y = (canvas.height - player.height) / 2;

    for (var i in goodies) {
        goodies[i].x = Math.random() * (canvas.width - goodies[i].width);
        goodies[i].y = Math.random() * (canvas.height - goodies[i].height);
        goodies[i].img = Math.floor(Math.random() * goodyImagesArray.length);
    }

    for (var i in baddies) {
        baddies[i].x = Math.random() * (canvas.width - baddies[i].width);
        baddies[i].y = Math.random() * (canvas.height - baddies[i].height);
        baddies[i].img = Math.floor(Math.random() * baddieImagesArray.length);
    }
};

// La boucle de jeu principale
var main = function () {
    if (checkWin()) {
        if (winReady) {
            ctx.drawImage(winImage, (canvas.width - winImage.width)/2, 
                (canvas.height - winImage.height)/2);
        }
        return; 
    }
    else if (lose) {
        // console.log("loser~!");
        if (gameOver) {
            ctx.drawImage(gameOverImage, (canvas.width - gameOverImage.width)/2,
                (canvas.height - gameOverImage.height)/2);
        }
    }
    else {
        //déplacer le joueur
        if (player.x > 0 && player.x < canvas.width - player.width) {
            player.x += vX;
        }
        else {
            player.x -= vX;
            vX = -vX; //bounce
        }
        if (player.y > 0 && player.y < canvas.height - player.height) {
            player.y += vY
        }
        else {
            player.y -= vY;
            vY = -vY; //bounce
        }

        //vérifier les collisions
        for (var i in goodies) {
            if (checkCollision(player,goodies[i])) {
                goodies.splice(i,1);
            }
        }

        for (var i = 0; i < baddies.length; i++) {
            if (checkCollision(player, baddies[i])) {
                lose = true;
                //render();
                //return;
            }
        }

        if (Math.random() > 0.983 && baddies.length < 15) {
            spawnBaddies();
        }

        render();
        window.requestAnimationFrame(main);
    }
};

// Dessinez le tout
var render = function () {
    if (bgReady) {
        ctx.fillStyle = ctx.createPattern(bgImage, 'repeat');
        ctx.fillRect(0,0,canvas.width,canvas.height);
    }
    if (playerReady) {
        ctx.drawImage(playerImage, player.x, player.y);
    }

    if (goodyAReady && goodyBReady) {
        for (var i in goodies) {
            ctx.drawImage(goodyImagesArray[goodies[i].img], goodies[i].x, goodies[i].y);
        }
    }

    if (baddieAReady && baddieBReady) {
        for (var i in baddies) {
            ctx.drawImage(baddieImagesArray[baddies[i].img], baddies[i].x, baddies[i].y);
        }
    }

    //Label
    ctx.fillStyle = "rgb(250, 250, 250)";
    ctx.font = "24px Georgina"
    ctx.fillText("Vaccins restants : "+goodies.length, 48, 48
    );
};

//Fonction générique pour vérifier les collisions 
var checkCollision = function (obj1,obj2) {
    if (obj1.x < (obj2.x + obj2.width) && 
        (obj1.x + obj1.width) > obj2.x && 
        obj1.y < (obj2.y + obj2.height) && 
        (obj1.y + obj1.height) > obj2.y
        ) {
            return true;
    }
    return false;
};

//Vérifiez si nous avons gagné
var checkWin = function () {
    if (goodies.length > 0) { 
        return false;
    } else { 
        return true;
    }
};


let spawnBaddies = function() {
    baddies.push({
        x: (Math.random() * (canvas.width - 70)),
        y: (Math.random() * (canvas.height - 90)),
        width: 79,
        height: 75,
        img: Math.floor(Math.random() * baddieImagesArray.length)
    });
};

//Démarrer le jeu
init();
window.requestAnimationFrame(main);
