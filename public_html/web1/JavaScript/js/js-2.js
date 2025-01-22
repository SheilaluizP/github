console.log("JS 2 in action")

//Step 1 - Selecting the element
const myShape = document.getElementById("oval")

//Step 2 - adding a click event
//myShape.addEventListener("click", function() {
myShape.addEventListener("click", () =>{
    // myShape.style.borderColor = "red transparent"
    myShape.classList.toggle("change-me");
    
})