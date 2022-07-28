///// CONSTANT DEFINITIONS /////

let numSquares;
let sketchTiles;

const container = document.querySelector(".container");
const settingsBtn = document.querySelector("#settings-button");
const settingsModalContent = document.querySelector(".settings-modal-content");
const slider = document.querySelector("#slider-range");
const gridSize = document.querySelector("#grid-size");
const startBtn = document.querySelector("#start-button");
const columnLeft = document.querySelector(".column-left");
const header = document.querySelector(".header");
const columnRight = document.querySelector(".column-right");
const settings = document.querySelector(".settings");
let sketchGrid = document.querySelector(".sketchgrid");
const footer = document.querySelector(".footer");

//array to store areas where if the user hovers over these we know that the user has stopped drawing
const outOfDrawBounds = [columnLeft, header, columnRight, settings, footer]; 

//const numSquares = 16; //height and width of sketch grid
//numSquares = Number(slider.value);
//console.log(typeof numSquares);

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  gridSize.textContent = this.value;
}

//flag for drawing pen down / up
let drawLine = false;

//flag for whether modal just closed to avoid drawing one dot for the square under the modal button
let modalJustClosed = false;


///// FUNCTIONS /////

//function to draw grid tiles and add event listeners which set out how line drawings can be constructed by the user
const initTiles = () => {

  numSquares = Number(slider.value);
  //update slider to show slider content
  gridSize.textContent = numSquares;

  //create blank matrix of numSquares x numSquares
  sketchTiles = Array(numSquares).fill('').map(() => Array(numSquares).fill(''));
  //console.table(sketchTiles);

  //create grid of tiles from blank matrix above and add them to the DOM
  sketchTiles.forEach((rowTile, rowIdx) => {
    //create grid rows
    const rowElement = document.createElement("div");
    //tileElement.setAttribute("class", 'tile');
    rowElement.setAttribute("class", `row-${rowIdx}`);
    //add row to grid int the DOM
    sketchGrid.appendChild(rowElement);

    rowTile.forEach((columnTile, columnIdx) => {
      //create grid tiles
      const tileElement = document.createElement("div");
      //tileElement.setAttribute("class", 'tile');
      tileElement.setAttribute("class", `tile-${rowIdx}-${columnIdx}`); //name the tile so we could access it by name if we want

      //if user clicked a square then set flag to true so other squares know we are drawing and color the current square
      tileElement.addEventListener('pointerdown', (event) => {
        if(!modalJustClosed && settingsModalContent.style.display === "none") {
          drawLine = true;
          tileElement.style.backgroundColor = "black";
        }
        //drawLine = true;
        //tileElement.style.backgroundColor = "black";
        //console.log(`Pointer moved in for tile-${rowIdx}-${columnIdx}`);
      });

      //color the current square if the user has clicked on another square
      tileElement.addEventListener('pointerover', (event) => {
        if(drawLine && !modalJustClosed && settingsModalContent.style.display === "none") tileElement.style.backgroundColor = "black";
      });

      //color the current square and then set flag to false so other squares know we have stopped drawing
      tileElement.addEventListener('pointerup', (event) => {
        if(!modalJustClosed && settingsModalContent.style.display === "none") {
          tileElement.style.backgroundColor = "black";
          drawLine = false;

        }
        //tileElement.style.backgroundColor = "black";
        //drawLine = false;
      });

      //add tile to row in the DOM
      rowElement.appendChild(tileElement);

    });

  });

}


///// MAIN /////

//add grid tiles
initTiles();

//open modal when settings button is clicked
settingsBtn.addEventListener("pointerdown", (event) => {
  settingsModalContent.style.display = "block";
  container.classList.add("is-blurred"); //blur background
});

//create new grid when start button is pressed
startBtn.addEventListener("pointerdown", (event) => {
  //remove previous grid and create new one
  container.removeChild(sketchGrid); 
  sketchGrid = document.createElement("div");
  sketchGrid.setAttribute("class", "sketchgrid");
  container.appendChild(sketchGrid);
  //create new grid tiles
  initTiles();
  container.classList.remove("is-blurred"); //remove background blur
  //set modal closed flag true to tiles will know not to draw mark under where we clicked the start button
  modalJustClosed = true;
  //close the modal
  settingsModalContent.style.display = "none";
});

//add listener so if the modal was just closed we know to allow drawing again, but only after the user finishes pressing the start button
container.addEventListener("pointerup", (event) => {
  if(modalJustClosed) modalJustClosed = false;
})

//if user draws a line and continues cursor off the grid then set flag to false so other squares know we have stopped drawing
outOfDrawBounds.forEach(area => {
  area.addEventListener("pointerover", (event) => {
    drawLine = false;
  });
});





