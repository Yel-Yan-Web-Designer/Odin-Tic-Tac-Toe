// using inheritance factories pattern
const Player = () => {
  const getSign = (sign) => sign;
  return {getSign};
}

// DOM elements 
const cells = document.querySelectorAll(".cell");
const endGame = document.querySelector(".endgame");
const declareText = document.querySelector(".text");
const replayBtn  = document.querySelector(".replay");

// create player
const huPlayer = Player().getSign('X');
const aiPlayer = Player().getSign('O');

let board = Array.from(Array(9).keys()); // create array with number elements

// IIFE module pattern
const gameBoard = (() => {

  // add click
  const startGame = () => {
      cells.forEach(x => {
      x.addEventListener("click" , turnClick)
     })
  }
  startGame();

  function turnClick (e) {
      const selected_cell_id = e.target.id;
      // destructure game controller
      let { bestSpot , turn, checkTie } = gameController;

      if(typeof(board[selected_cell_id]) == "number"){
        turn(selected_cell_id , huPlayer);
        if(!checkTie()) turn(bestSpot() , aiPlayer)
      }

  }

  const resetGame = () => {
      board =  Array.from(Array(9).keys());
      endGame.style.display = "none";
      cells.forEach(x => {
        x.innerText = "";
        x.removeEventListener("click" , turnClick);
      })
  }

  replayBtn.addEventListener("click" , () => {
        resetGame();
        startGame();
  })

  return {  turnClick  }
})();





const gameController = (() => {
  let {  turnClick } = gameBoard;

  // turn
  const turn = (squareId , player) => {    
    board[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(board, player);
    if(gameWon) gameOver(gameWon);
  }

  //check win
  const checkWin = (board , player) => {
      let winCombos = [
            [0,1,2],
            [3,4,5],
            [6,7,8],
            [0,3,6],
            [1,4,7],
            [2,5,8],
            [0,4,8],
            [6,4,2]
      ];

    // return array index of both player's sign 
    let plays = board.reduce(( a , e, i ) => ( e === player ? a.concat(i) : a) , []); 
    let gameWon = null;
    
    // entries return key-value pair iterable object
    for(let [ index , win ] of winCombos.entries()){
      let checkCombo = win.every( x => plays.indexOf(x) > -1 );
      if(checkCombo){
        gameWon = {
          index : index,
          player : player
        }
        break;
      }
    }

    return gameWon;
  }


  // check tie
  const checkTie = () => {
    // check emptysquares is empty or not
    if(emptySquares().length === 0){
      cells.forEach(x => {
        x.removeEventListener("click" , turnClick)
      })
      declareWinner("Tie Game!");
      return true;
    } 
    return false;
  }

  // filter huPlayer's selected square
  const emptySquares = () => {
    return board.filter(x => typeof(x) === "number");
  }

  // best spot for ai player
  const bestSpot = () => {
    return emptySquares()[0];
  }

  // game over
  const gameOver = (gameWon) => {
    cells.forEach(x => x.removeEventListener("click" , turnClick));

    declareWinner(gameWon.player === huPlayer ? "You Won!" : "You lose!");
  }

  // declare winner
  const declareWinner = (who) => {
    endGame.style.display = "block";
    declareText.innerText = who;
  }

  return { turn , bestSpot , checkTie }
})();