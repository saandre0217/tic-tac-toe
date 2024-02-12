var rls = require('readline-sync');

let playerName; 
let playerLetter;
let board = [1, 2, 3, 'X', 5, 6, 7, 8, 9]
let playerMove;
const printBoard = (boardArr) => {
 console.log(` ${boardArr[0]} | ${boardArr[1]} | ${boardArr[2]} \n --------- \n ${boardArr[3]} | ${boardArr[4]} | ${boardArr[5]} \n --------- \n ${boardArr[6]} | ${boardArr[7]} | ${boardArr[8]}`)
}

const handleComputerMove = (currBoard) => {

}
const handlePlayerMove = (move, prevBoard) => {
if(move > 9 || move < 1 || !prevBoard.includes(move)){
  const newMove = rls.question(`Oops! ${move} isn't on the board. Try again!`)
  console.log(prevBoard, newMove)
  return handlePlayerMove(newMove, prevBoard)
} else {
const moveInd = move - 1;
const boardWPlayerMove = prevBoard.slice()
boardWPlayerMove.splice(moveInd, 1, playerLetter)
printBoard(boardWPlayerMove)
}
}
//game play
  playerName = rls.question('Welcome to The Totally Tremendous Tic Tac Toe! What is your name?' )

  if (rls.keyInYN(`Excited to play, ${playerName}?! Enter Y if you want to play as X's or N if you want to play as O's` )){
    playerLetter='X'
  } else {
    playerLetter='O'
  }
  printBoard(board)
  playerMove = rls.questionInt(`Great! Let\'s get started. You go first! Enter the number where you want your first ${playerLetter} to go!`)
  handlePlayerMove(playerMove, board)

