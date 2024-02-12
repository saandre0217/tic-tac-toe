const rls = require('readline-sync');


let playerName; 
let playerLetter;
const emptyBoard = [1, 2, 3, 'X', 5, 6, 7, 8, 9]
let playerMove;
let playerMoves = []
let computerLetter;
const printBoard = (boardArr) => {
 console.log(`\n ${boardArr[0]} | ${boardArr[1]} | ${boardArr[2]} \n --------- \n ${boardArr[3]} | ${boardArr[4]} | ${boardArr[5]} \n --------- \n ${boardArr[6]} | ${boardArr[7]} | ${boardArr[8]}`)
}

const updateBoard = (letter, index, currentBoard) => {
  const newBoard = currentBoard.slice()
  newBoard.splice(index, 1, letter)
  return newBoard;
}

const loadingAnimation = () => {
  let x = 0;
  chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"];
  return setInterval(function() {
      process.stdout.write(`\r ${chars[x++]} Trixie is Thinking \r`);
      x = x % chars.length;
  }, 100);
}

const beatPlayer = (currentBoard) => {
  let computerMoveInd;
  const computerMoves = [
    [1, 2, 3, 6, 4, 8],
    [0, 2, 4, 7],
    [0, 1, 4, 6, 5, 8],
    [0, 6, 4, 5],
    [0, 8, 1, 7, 2, 6, 3, 5],
    [2, 8, 4, 3],
    [0, 3, 7, 8, 2, 4],
    [1, 4, 6, 8],
    [0, 4, 2, 5, 6, 7]
  ]
if(playerMoves.length === 1){
  const playerMoveInd = playerMoves[0]
  const randomMoveInd = Math.floor(Math.random() * computerMoves[playerMoveInd].length)
  computerMoveInd = computerMoves[playerMoveInd][randomMoveInd]
  return updateBoard(computerLetter, computerMoveInd, currentBoard)
}
}
const handlePlayerMove = (prevBoard) => {
  playerMove = rls.questionInt(`Your Turn!`)
if(playerMove > 9 || playerMove < 1 || !prevBoard.includes(playerMove)){
  console.log(`Oops! ${playerMove} isn't on the board. Try again!`)
  return handlePlayerMove(prevBoard)
} else {
const moveInd = playerMove - 1;
playerMoves.push(moveInd)
const boardWPlayerMove = updateBoard(playerLetter, moveInd, prevBoard)
printBoard(boardWPlayerMove)
console.log(`Nice Choice! Let's see where Tic Tac Toe Wiz, Trixie, plays her ${computerLetter}`)
let loading = loadingAnimation()
setTimeout(() => {
  clearInterval(loading)
  const boardWComputerMove = beatPlayer(boardWPlayerMove)
  printBoard(boardWComputerMove)
  
}, 2000)
}
}
//game play
  playerName = rls.question('Welcome to The Totally Tremendous Tic Tac Toe! What is your name?' )

  if (rls.keyInYN(`Excited to play, ${playerName}?! Enter Y if you want to play as X's or N if you want to play as O's` )){
    playerLetter='X'
    computerLetter='O'
  } else {
    playerLetter='O'
    computerLetter='X'
  }
  printBoard(emptyBoard)
  console.log(`Great! Let's get started. \nYou will be playing against Tic Tac Toe Wiz, Trixie. \nWhen it is your turn, you will enter the number where you want your ${playerLetter} to go!`)

  handlePlayerMove(emptyBoard)

