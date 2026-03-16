let cell = document.querySelectorAll(".cell");
let paneauStatus = document.querySelector("#message");
let panneauMessageGagnant = document.querySelector("#message img");
let replayBtn = document.querySelector(".restart-botton");



let joueurX = true;
const patrons = [
    [0,1,2],
    [0,3,6],
    [0,4,8],
    [1,4,7],
    [2,5,8],
    [2,4,6],
    [3,4,5],
    [6,7,8]
];

for (let boite of cell) {
    boite.active = true;
    boite.addEventListener("click", function() {
        if(boite.active){
            if (joueurX){
                // boite.innerText = "X";
                boite.style.backgroundImage = "url('./img/X.svg')";
                joueurX = false;
            }
            else{
                // boite.innerText = "O";
                boite.style.backgroundImage = "url('./img/O.svg')";
                 joueurX = true;
            } 
            boite.style.backgroundSize = "cover;"
            boite.active = false;   
        valide();
        }

    });

}

const valide = function (){
    for (let patron of patrons) {
        // let val1 = cell[patron[0]].innerText;
        // let val2 = cell[patron[1]].innerText;
        // let val3 = cell[patron[2]].innerText;
        let val1 = cell[patron[0]].style.backgroundImage.slice(5,16);
        let val2 = cell[patron[1]].style.backgroundImage.slice(5,16);
        let val3 = cell[patron[2]].style.backgroundImage.slice(5,16);
        
        if (val1 &&
            val1 === val2 &&
            val1 === val3) {
            console.log(`Le gagnant est ${val1}`);
            console.log(panneauMessageGagnant);
            panneauMessageGagnant.src = val1;
            for (let boite of cell) {
                boite.active = false;

            }
        }
    }
}

replayBtn.addEventListener("click", function() {
    for (let boite of cell) {
        boite.style.backgroundImage = "";
        boite.active = true;
        // boite.innerText = "";
        joueurX = true;
        // paneauStatus.innerText = "";
    }
})
