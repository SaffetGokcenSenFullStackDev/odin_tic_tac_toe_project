// the module to deal with the content of the tic tac toe board.
const theBoard = (() => {
  // the array holding the board content
  const boardContent = [];

  // the board is filled with ''.
  const createBoard = (dim) => {
    for (let i = 0; i < dim; i += 1) {
      boardContent[i] = [];
      for (let j = 0; j < dim; j += 1) {
        boardContent[i][j] = '';
      }
    }
  };

  // the method to set a specific location of the board to the specified mark.
  const setBoardContent = (x, y, theMark) => {
    boardContent[x][y] = theMark;
  };

  // detects if the marks on a row or a column are the same.
  const gameComplete = (x, y, theMark) => {
    // function to be used in the array method "map".
    const allSame = (value) => value === theMark;
    // column extraction from https://stackoverflow.com/a/12985968/9994049
    return (boardContent[x].every(allSame)) || (boardContent.map((value) => value[y]).every(allSame));
  };

  // an object with the methods createBoard, getBoardContent and setBoardContent 
  // is returned.
  return { createBoard, setBoardContent, gameComplete };
}
)();

// the module to get the dimension of the board from the player(s).
const gameController = (() => {
  let theDim; // the dimension of the board
  const boardArray = []; // the array to hold the board content.
  // the array to hold the player notifications and change-player button.
  const playerNoticeButtonArray = [];
  // holds the info about which player's turn in the game.
  let whichPlayer = "player1";
  // holds the cell location the player ticks on.
  let cellLocation;
  // the array to hold the locations of the marked cells.
  let markedCells = [];
  // the array to manipulate the locations of the cells clicked before the final 
  // choice
  let markedCellsTemp = [];
  // the variable to indicate if the player has put a mark on the board.
  let markPut = 0;
  // the maximum number of moves that can be made in the game.
  let moveLimit;
  // the number of moves made so far.
  let numMoves = 0;
  // boolean for the game status.
  let gameFinished;

  // draws the game board to the screen as soon as the requested dimension is 
  // obtained from the user.
  const drawTheBoard = () => {
    // the controller to give the abort signal to the event listeners of the 
    // board cells.
    const controller = new AbortController();

    // the function which is invoked when the "Change player" button is pressed.
    const nextPlayerFunc = () => {
      const rowIndex = markedCellsTemp[0][0]-1;
      const columnIndex = markedCellsTemp[0][1]-1;
      if (whichPlayer === "player1") {
        // erase the notification that it is the turn of the player 1.
        playerNoticeButtonArray[0].textContent = "PLAYER 1'S TURN NOW!";
        playerNoticeButtonArray[0].style.color = "white";
        // write the notification that it is the turn of the player 2.
        playerNoticeButtonArray[2].textContent = "PLAYER 2'S TURN NOW!";
        playerNoticeButtonArray[2].style.color = "black";
        // now, it is the turn of the second player.
        whichPlayer = "player2";
        // the player cannot be changed until a valid marking.
        changePlayerButton.disabled = true;
        // the mark is recorded in the board array.
        theBoard.setBoardContent(rowIndex, columnIndex, "x")
        gameFinished = theBoard.gameComplete(rowIndex, columnIndex, "x")
        if (gameFinished) {
          playerNoticeButtonArray[0].textContent = "PLAYER 1 WINS!";
          playerNoticeButtonArray[2].textContent = "PLAYER 1 WINS!";
          playerNoticeButtonArray[0].style.color = "black";
          playerNoticeButtonArray[2].style.color = "black";

          // the event listeners of the cells are aborted.
          controller.abort();
        }
      }
      else {
        // erase the notification that it is the turn of the player 2.
        playerNoticeButtonArray[2].textContent = "PLAYER 2'S TURN NOW!";
        playerNoticeButtonArray[2].style.color = "white";
        // write the notification that it is the turn of the player 1.
        playerNoticeButtonArray[0].textContent = "PLAYER 1'S TURN NOW!";
        playerNoticeButtonArray[0].style.color = "black";
        // now, it is the turn of the first player.
        whichPlayer = "player1";
        // the player cannot be changed until a valid marking.
        changePlayerButton.disabled = true;
        // the mark is recorded in the board array.
        theBoard.setBoardContent(rowIndex, columnIndex, "o");
        gameFinished = theBoard.gameComplete(rowIndex, columnIndex, "o");
        if (gameFinished) {
          playerNoticeButtonArray[0].textContent = "PLAYER 2 WINS!";
          playerNoticeButtonArray[2].textContent = "PLAYER 2 WINS!";
          playerNoticeButtonArray[0].style.color = "black";
          playerNoticeButtonArray[2].style.color = "black";

          // the event listeners of the cells are aborted.
          controller.abort();
        }
      }
      // register the position of the cell on which a mark has been put 
      // following the rules of the game.
      markedCells = markedCells.concat(markedCellsTemp);
      // the finally selected cell gets its default color
      boardArray[rowIndex][columnIndex].style.backgroundColor = "cadetblue";
      // free the temporary array of cell locations
      markedCellsTemp = [];
      // the next player has not put a mark yet.
      markPut = 0;
      // number of moves made so far is increased by 1.
      numMoves += 1;
      if (numMoves === moveLimit) {
        playerNoticeButtonArray[0].textContent = "TIE!";
        playerNoticeButtonArray[0].style.color = "black";
        playerNoticeButtonArray[2].textContent = "TIE!";
        playerNoticeButtonArray[0].style.color = "black";
        changePlayerButton.disabled = true;
      }
    }

    // the function which enables a player to put a mark on the board following 
    // the rules of the game.
    function drawSign() {
      // the location of the cell the player has clicked on.
      cellLocation = this.style.gridRowStart + this.style.gridColumnStart;
      // if the clicked cell is empty
      if ((markedCells.find((element) => element === cellLocation) === undefined)) {
        // if the cell is empty and the player has not put a mark
        if ((this.textContent === "") && (markPut === 0)) {
          // "X" is put on the cell if it is the turn of the player 1.
          if (whichPlayer === "player1") {
            this.textContent = "X";
            // the prospective cell of the first player becomes red.
            this.style.backgroundColor = "red";
          }
          // "O" is put on the cell if it is the turn of the player 2.
          else {
            this.textContent = "O";
            // the prospective cell of the first player becomes blue.
            this.style.backgroundColor = "blue";
          }
          // "Change player" button is enabled.
          changePlayerButton.disabled = false;
          // the info that the player in turn has put a mark is recorded.
          markPut += 1;
          // prospective clicked cell location recorded.
          markedCellsTemp.push(cellLocation);
        }
        // else if the clicked cell is empty and the player has already put a 
        // mark on a cell
        else if ((this.textContent === "") && (markPut !== 0)) {
          // do not put a mark and keep or make the "Change player" button inactive.
          changePlayerButton.disabled = false;
        }
        // else if the cell is already marked 
        else if ((this.textContent !== "") && (markPut === 0)) {
          // keep or make the "Change player" button inactive.
          changePlayerButton.disabled = true;
        }
        // the player is erasing the mark put in this turn.
        else if ((this.textContent !== "") && (markPut !== 0)) {
          this.textContent = "";
          // the cancelled cell gets back its default color.
          this.style.backgroundColor = "cadetblue";
          markPut = 0;
          changePlayerButton.disabled = true;
          // the location of the cell the player has cancelled is removed.
          markedCellsTemp.pop();
        }
      }
    }

    // the body element of the board page.
    const theBody = document.body;

    // the div to hold the board is created and appended to the body.
    const boardDiv = document.createElement('div');
    theBody.appendChild(boardDiv);
    boardDiv.className = "boardDiv";
    boardDiv.style.gridTemplateColumns = `repeat(${theDim}, 1fr)`;
    boardDiv.style.gridTemplateRows = `repeat(${theDim}, 1fr)`;
    for (let i = 0; i < theDim; i += 1) {
      boardArray[i] = [];
      for (let j = 0; j < theDim; j += 1) {
        const gridCell = document.createElement('div');
        gridCell.style.gridRowStart = i + 1;
        gridCell.style.gridRowEnd = i + 2;
        gridCell.style.gridColumnStart = j + 1;
        gridCell.style.gridColumnEnd = j + 2;
        gridCell.className = "gridCell";
        gridCell.textContent = "";
        gridCell.addEventListener('click', drawSign, { signal: controller.signal });
        boardArray[i][j] = gridCell;
        boardDiv.appendChild(gridCell);
      }
    }

    // the div to hold the player notifications and the change button
    const gameButtonsDiv = document.createElement('div');
    gameButtonsDiv.className = "gameButtons";
    theBody.appendChild(gameButtonsDiv);
    // first player notification
    const player1Notice = document.createElement('div');
    player1Notice.className = "playerNotice";
    player1Notice.textContent = "PLAYER 1'S TURN NOW!";
    gameButtonsDiv.appendChild(player1Notice);
    playerNoticeButtonArray[0] = player1Notice;
    // change player button
    const changePlayerButton = document.createElement('input');
    changePlayerButton.type = 'submit';
    changePlayerButton.value = 'Change player';
    changePlayerButton.disabled = true;
    changePlayerButton.addEventListener('click', nextPlayerFunc);
    gameButtonsDiv.appendChild(changePlayerButton);
    playerNoticeButtonArray[1] = changePlayerButton;
    // second player notification
    const player2Notice = document.createElement('div');
    player2Notice.className = "playerNotice";
    player2Notice.textContent = "PLAYER 2'S TURN NOW!";
    player2Notice.style.color = "white";
    gameButtonsDiv.appendChild(player2Notice);
    playerNoticeButtonArray[2] = player2Notice;
  }

  // builds the user interface to get the board dimension from the player(s).
  const getBoardDim = () => {
    // the body element of the board page.
    const theBody = document.body;

    // the div to hold the radio buttons is created and appended to the body.
    const selectionDiv = document.createElement('div');
    theBody.appendChild(selectionDiv);

    // the instruction text is created and written to the text paragraph.
    const pText = document.createElement('p');
    pText.textContent = 'Please choose the board dimension.';
    // the text paragraph is appended to the parent div.
    selectionDiv.appendChild(pText);

    // declarations for paragraph, radio button and label variables.
    let p1; let p2; let p3; let radioButton1; let radioButton2; let radioButton3;
    let label1; let label2; let label3;
    // the label array is declared and initiated.
    const pArray = [p1, p2, p3];
    // the array of radio buttons is declared and defined.
    const radioButtonArray = [radioButton1, radioButton2, radioButton3];
    // the label array is declared and initiated.
    const labelArray = [label1, label2, label3];
    // the array of board dimensions is declared and initiated.
    const dimArray = ['3x3', '5x5', '7x7'];
    // the radio buttons with their labels are created and appende to their 
    // respective paragraphs. The paragraphs are finally appended to the selection 
    // div.
    for (let i = 0; i < 3; i += 1) {
      // the paragraph to hold the radio button and its label is created.
      pArray[i] = document.createElement('p');
      // the paragraph is a flex container.
      pArray[i].style.display = 'flex';
      // the radio button and its label is centered.
      pArray[i].style.justifyContent = 'center';
      pArray[i].style.alignItems = 'center';
      // the input element is created.
      radioButtonArray[i] = document.createElement('input');
      // the label of the input element is created.
      labelArray[i] = document.createElement('label');
      // the input element is a radio button.
      radioButtonArray[i].type = 'radio';
      // the id of the radio button is set.
      radioButtonArray[i].id = dimArray[i];
      // the value represented by the radio button is set.
      radioButtonArray[i].value = dimArray[i];
      // the name of the radio button is set.
      radioButtonArray[i].name = 'dimension';
      // it is set which radio button the label belongs to.
      labelArray[i].htmlFor = dimArray[i];
      // the text of the label is set.
      labelArray[i].textContent = dimArray[i];
      // the label is appended to its paragraph.
      pArray[i].appendChild(labelArray[i]);
      // the radio button is appended to its paragraph.
      pArray[i].appendChild(radioButtonArray[i]);
      // the paragraph holding the label and the radio button is appended to the 
      // selection div.
      selectionDiv.appendChild(pArray[i]);
    }

    // the first radio button is checked by default.
    radioButtonArray[0].checked = true;

    // the paragraph to hold the choose button is created.
    const pChoose = document.createElement('p');
    // the paragraph is a flex container.
    pChoose.style.display = 'flex';
    // the choose button is at the rightmost of the paragraph.
    pChoose.style.flexDirection = 'row-reverse';
    // the input to be set as the choose button is created.
    const closeButton = document.createElement('input');
    // the input is a submit button.
    closeButton.type = 'submit';
    // the text of the button is 'CHOOSE'.
    closeButton.value = 'CHOOSE';
    // the choose button is appended to its paragraph.
    pChoose.appendChild(closeButton);
    // the choose button is appended to the selection div.
    selectionDiv.appendChild(pChoose);

    // the function to be invoked when the choose button is clicked.
    const setDim = () => {
      // get the radio button which is selected by the player(s).
      const selRadio = document.querySelector('input[name="dimension"]:checked');
      // get the selected dimension as a number
      theDim = +selRadio.value[0];
      // create the board array and initialize its content according to the 
      // selected dimension.
      theBoard.createBoard(theDim);
      // remove the selection user interface after the selection is made.
      selectionDiv.remove();

      // the font size is matched with the selected board dimension using an 
      // object literal
      const fontSizes = {
        3: "28px",
        5: "24px",
        7: "20px"
      }
      // the html element font size is set according to the selected board dimension
      const theRoot = document.querySelector(":root");
      theRoot.style.fontSize = fontSizes[theDim];
      
      // draw the board to the screen
      drawTheBoard();
      moveLimit = theDim * theDim;
    }
    // the click on the choose button is listened to.
    pChoose.addEventListener("click", setDim);
  };

  // an object with the method getBoardDim and the property theDim is returned.
  return { getBoardDim};
}
)();

// the dimension of the board is obtained from the player(s), the board array is 
// created and its content is initialized.
gameController.getBoardDim();