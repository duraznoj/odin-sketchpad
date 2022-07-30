///// CONSTANT DEFINITIONS /////

//grid variables
let numSquares;
let sketchTiles;

//get DOM elements
const container = document.querySelector(".container");
const drawTool = document.querySelector("#draw-radio");
const eraseTool = document.querySelector("#erase-radio");
const settingsBtn = document.querySelector("#settings-button");
const settingsModalContent = document.querySelector(".settings-modal-content");
const slider = document.querySelector("#grid-size-slider-range");
const gridSize = document.querySelector("#grid-size");
const monoRadio = document.querySelector("#mono-radio");
const rgbRadio = document.querySelector("#rgb-radio");
const opacityRadio = document.querySelector("#opacity-radio");
const startBtn = document.querySelector("#start-button");
const columnLeft = document.querySelector(".column-left");
const header = document.querySelector(".header");
const columnRight = document.querySelector(".column-right");
const settings = document.querySelector(".settings");
let sketchGrid = document.querySelector(".sketchgrid");
const footer = document.querySelector(".footer");

//array to store areas where if the user hovers over these we know that the user has stopped drawing
const outOfDrawBounds = [columnLeft, header, columnRight, settings, footer];

// Update the current slider value (each time you drag the slider handle)
slider.oninput = function() {
  gridSize.textContent = this.value + ' x ' + this.value;
}

//flag for drawing pen down / up
let drawLine = false;

//flag for drawing vs erasing
let eraseLine = false;

//flag for drawing monochrome
let monoRBG = false;

//flag for drawing random RGB
let randomRBG = false;

//flag for drawing with incremental opacity (10% darker each time)
let incrementOpacity = false;

//flag for whether modal just closed to avoid drawing one dot for the square under the modal button
let modalJustClosed = false;

///// FUNCTION DEFINITIONS /////

//function to fill in tile with colors corresponding to user defined settings
const paintTile = (tileElem) => {
  if(eraseLine) {
    tileElem.style.backgroundColor = "transparent";
  } else if (monoRBG) {
    tileElem.style.backgroundColor = "black";
  }
  else if (randomRBG) {
    const randRed = Math.floor((Math.random() * 25500) / 100);
    const randGreen = Math.floor((Math.random() * 25500) / 100);
    const randBlue = Math.floor((Math.random() * 25500) / 100);
    tileElem.style.backgroundColor = `rgb(${randRed}, ${randGreen}, ${randBlue})`;
  } else if (incrementOpacity) {
    const alphaValue = Math.round(Number(tileElem.getAttribute("data-alpha-counter")) * 10) / 10;
    if(alphaValue < 1) {
      tileElem.style.backgroundColor = `rgb(0,0,0,${alphaValue})`;
      tileElem.setAttribute("data-alpha-counter", `${alphaValue + 0.1}`);
    } else if(alphaValue === 1) {
      tileElem.style.backgroundColor = `rgb(0,0,0,${alphaValue})`;              
    }
  }
}

//function to draw grid tiles and add event listeners which set out how line drawings can be constructed by the user
const initTiles = () => {

  //get grid dimensions from slider
  numSquares = Number(slider.value);

  //set slider text value to show grid dimensions
  gridSize.textContent = numSquares + ' x ' + numSquares;

  //get value from checkbox so we know if we need to draw monochrome colors for each tile
  monoRBG = monoRadio.checked;

  //get value from checkbox so we know if we need to draw random colors for each tile
  randomRBG = rgbRadio.checked;
  //console.log(randomRBG)

  //get value from checkbox so we know if we need to draw incremental opacity for a given tile
  incrementOpacity = opacityRadio.checked;

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
      tileElement.setAttribute("data-alpha-counter", 0.1); //attribute to store opacity value

      //if user clicked a square then set flag to true so other squares know we are drawing and color the current square
      tileElement.addEventListener('pointerdown', (event) => {
        if(!modalJustClosed && (settingsModalContent.style.display === "none" || window.getComputedStyle(settingsModalContent).getPropertyValue("display") === "none")) {
          drawLine = true; //enable drawing
          paintTile(tileElement); //edit tile color
        }
      });

      //color the current square if the user has clicked on another square
      tileElement.addEventListener('pointerover', (event) => {
        if(drawLine && !modalJustClosed && (settingsModalContent.style.display === "none" || window.getComputedStyle(settingsModalContent).getPropertyValue("display") === "none")) {
          paintTile(tileElement); //edit tile color
        }
      });

      //color the current square and then set flag to false so other squares know we have stopped drawing
      tileElement.addEventListener('pointerup', (event) => {
        if(!modalJustClosed && (settingsModalContent.style.display === "none" || window.getComputedStyle(settingsModalContent).getPropertyValue("display") === "none")) {
          paintTile(tileElement); //edit tile color
        }
        drawLine = false; //stop drawing when user lifts up their pointing device
      });

      //add tile to row in the DOM
      rowElement.appendChild(tileElement);

    });
  });
}


///// MAIN /////

//add grid tiles
initTiles();

//listen for changes to draw tool
drawTool.addEventListener("change", (event) => {
  //console.log(event.target.value)
  eraseLine = false;
});

//listen for changes to erase tool
eraseTool.addEventListener("change", (event) => {
  //console.log(event.target.value)
  eraseLine = true;
});

//open modal when settings button is clicked
settingsBtn.addEventListener("pointerdown", (event) => {
  settingsModalContent.style.display = "flex";
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

  //reset radio buttons
  eraseLine = false;
  eraseTool.checked = false;
  drawTool.checked = true;

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





