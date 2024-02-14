const rls = require('readline-sync');
var clc = require("cli-color");

let playerName;
let playerLetter;
const emptyBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let playerMove;
let playerMoves = []
let computerMoves = [];
let computerLetter;

//*************************BOARD FUNCTIONS BEGIN **************************/
const hl = clc.yellow('---------')
const vl = clc.yellow('|')
//function to show board in command line 
const printBoard = (boardArr) => {
  if(boardArr){
    console.log(` ${boardArr[0]} ${vl} ${boardArr[1]} ${vl} ${boardArr[2]} \n ${hl} \n ${boardArr[3]} ${vl} ${boardArr[4]} ${vl} ${boardArr[5]} \n ${hl} \n ${boardArr[6]} ${vl} ${boardArr[7]} ${vl} ${boardArr[8]}`)
  } else {
    console.log('no board')
  }
}

//function to update board array with player or computer moves
const updateBoard = (letter, index, currentBoard) => {
  const newBoard = currentBoard.slice()
  newBoard.splice(index, 1, letter)
  if(letter === computerLetter){
    console.log('I have made my decision')
  } 
  return newBoard;
}

const handleWaitToUpdateBoard = (cb, letter, index, currentBoard) => {
  return new Promise ((resolve) => {
    setTimeout(() => {
      resolve(cb(letter, index, currentBoard))
    }, 3000)
  }) 
}
//function for animation while the computer takes its turn
const loadingAnimation = () => {
  let x = 0;
  let count = 0;
  //chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"];
  chars = ['.', '..', '...', '....', ".....", '......']
  let animationInterval = setInterval(() => {
    process.stdout.write(`\rHmmm${chars[x++]} \r`);
    x = x % chars.length
    count +=1

    if(count === 26){
      clearInterval(animationInterval);
  }
  }, 100)
  return animationInterval
}



function getBestMove(currentBoard, player){
  let emptySquares = getEmptyIndices(currentBoard);

  //figure out if move wins for computer or player or draws
  if (handleWinning(currentBoard, playerLetter)){
     return {score:-10};
  }
	else if (handleWinning(currentBoard, computerLetter)){
    return {score:10};
	}
  else if (emptySquares.length === 0){
  	return {score:0};
  }

  let moves = [];

  // look at each available index and test if it is a good move for computer
  for (let i = 0; i < emptySquares.length; i++){
    let move = {};
  	move.index = currentBoard[emptySquares[i]];

    currentBoard[emptySquares[i]] = player;

    if (player == computerLetter){
      let result = getBestMove(currentBoard, playerLetter);
      move.score = result.score;
    }
    else{
      let result = getBestMove(currentBoard, computerLetter);
      move.score = result.score;
    }

    currentBoard[emptySquares[i]] = move.index;

    moves.push(move);
  }

  //find the best move in the moves array
  let bestMove;
  if(player === computerLetter){
    let bestScore = -1000000;
    for(let i = 0; i < moves.length; i++){
      if(moves[i].score > bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }else{

    let bestScore = 1000000;
    for(let i = 0; i < moves.length; i++){
      if(moves[i].score < bestScore){
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

 
  return moves[bestMove]
}

// returns the available spots on the board
function getEmptyIndices(board){
  //return  board.filter(s => typeof s === "number");
  return board.reduce((acc, curr) => {
    typeof curr === "number" ? acc.push(curr - 1) : acc;
    return acc
  }, [])
}

// winning combinations using the board indexies for instace the first win could be 3 xes in a row
function handleWinning(currentBoard, player){
  for (let i = 0; i < 3; i++) {
    //column
      if (currentBoard[i] === currentBoard[i + 3] && currentBoard[i] === currentBoard[i + 6]) {
          if(currentBoard[i] === player){
            return true
          } 
    //row
      } else if (currentBoard[i * 3] === currentBoard[(i * 3) + 1] && currentBoard[i * 3] === currentBoard[(i * 3) + 2]) {
          if(currentBoard[i * 3] === player){
            return true
          } 
          
      }
  }
  //diagonals
  if (currentBoard[0] === currentBoard[4] && currentBoard[0] === currentBoard[8]) {
    if(currentBoard[0] === player){
      return true
    } 
    
  } else if (currentBoard[2] === currentBoard[4] && currentBoard[2] === currentBoard[6]) {
    if(currentBoard[2] === player){
      return true
    } 
   
  }

  return false;
}

//allows player to choose move, updates board, and ends game when winner is found
const handlePlayerMove = async (prevBoard) => {
  playerMove = rls.questionInt(clc.bgGreen(`Your Turn!`))
  if(playerMove > 9 || playerMove < 1 || !prevBoard.includes(playerMove)){
    console.log(`Oops! ${playerMove} isn't on the board. Try again!`)
    return handlePlayerMove(prevBoard)
  } else {
    //update board with player move
    const boardWPlayerMove = updateBoard(playerLetter, playerMove - 1, prevBoard)
    printBoard(boardWPlayerMove)
    

    //check for draw
    let boardWComputerMove;
    const emptySquares = getEmptyIndices(boardWPlayerMove)
    if(emptySquares.length === 0){
      console.log(clc.bgMagenta('Good game, my competent competitor! This is as close as you\'ll ever get to beating me!!'))
    } else {
      console.log(clc.red(`Nice Choice! Let's see the quickest way to beat you...`))
      //computer's turn
      loadingAnimation()
      boardWComputerMove = await handleComputerMove(boardWPlayerMove)
      printBoard(boardWComputerMove)

      //check for winner
      if(handleWinning(boardWComputerMove, computerLetter)){
        console.log(clc.bgMagenta('My reign continues!!! Better luck never! Mwahahahah!'))
      } else if(handleWinning(boardWComputerMove, playerLetter)){
        console.log(clc.bgMagenta('How did this happen... I AM UNBEATABLE!'))
      } else {
        if(emptySquares.length > 0){
          handlePlayerMove(boardWComputerMove)
        } 
      }
      
    }
  }
}

//finds best spot for computer and updates board 
const handleComputerMove = (currentBoard) => {
  const bestSpot = getBestMove(currentBoard, computerLetter).index - 1
  return handleWaitToUpdateBoard(updateBoard, computerLetter, bestSpot, currentBoard)
}

//allows player to decide what letter they would like
const getLetters = () => {
  playerLetter = rls.question(clc.cyan(`I am so excited to play with you, ${clc.bgWhite(playerName)}! Enter the letter you want to play with. Please enter either ${clc.bgWhite(' X ')} or ${clc.bgWhite(' O ')} `))
  if(playerLetter === 'x' || playerLetter === 'X'){
    return {
      playerLetter: clc.green('X'),
      computerLetter: clc.red('O')
    }
  } else if (playerLetter == 'o' || playerLetter == 'O'){
    return {
      playerLetter: clc.green('O'),
      computerLetter: clc.red('X')
    }
  } else {
    console.log('That is not an X or O! Try Again!')
    return getLetters()
  }
}

//begins game play
const startGame = () => {

  playerName = rls.question(clc.cyan('Welcome to Trixie\'s Totally Tremendous Tic Tac Toe! What is your name?' ))
  const letterObj = getLetters()
  playerLetter = letterObj.playerLetter
  computerLetter = letterObj.computerLetter
  printBoard(emptyBoard)
  console.log(`${clc.bgCyan(`Great! Let's get started.`)} \n${clc.cyan(`You'll be playing me, Trixie! Some people call me the Tic Tac Toe Wiz!`)} \n${clc.bgCyan(`When it is your turn, you will enter the number where you want your ${clc.bgWhite(playerLetter)} to go!`)}\n${clc.cyan('Good Luck!! You\'ll need it:)')}`)

  handlePlayerMove(emptyBoard)
}
startGame()