const rls = require('readline-sync');

let playerName;
let playerLetter;
const emptyBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let playerMove;
let playerMoves = []
let computerLetter;
//function to show board in command line
const printBoard = (boardArr) => {
 console.log(` ${boardArr[0]} | ${boardArr[1]} | ${boardArr[2]} \n --------- \n ${boardArr[3]} | ${boardArr[4]} | ${boardArr[5]} \n --------- \n ${boardArr[6]} | ${boardArr[7]} | ${boardArr[8]}`)
}

//function to update board array with player or computer moves
const updateBoard = (letter, index, currentBoard) => {
  const newBoard = currentBoard.slice()
  newBoard.splice(index, 1, letter)
  if(letter === computerLetter){
    console.log('Trixie has made her decision')
  }
  return newBoard;
}

//function for animation while the computer takes its turn
const loadingAnimation = () => {
  let x = 0;
  let count = 0;
  chars = ["⠙", "⠘", "⠰", "⠴", "⠤", "⠦", "⠆", "⠃", "⠋", "⠉"];
  let animationInterval = setInterval(() => {
    process.stdout.write(`\r ${chars[x++]} Trixie is Thinking \r`);
    x = x % chars.length
    count +=1

    if(count === 26){
      clearInterval(animationInterval);
  }
  }, 100)
  return animationInterval
}


//function for computer to play a move
const handleComputerMove = (currentBoard) => {
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
  return new Promise ((resolve) => {
    setTimeout(() => {
      resolve(updateBoard(computerLetter, computerMoveInd, currentBoard))
    }, 3000)
  }) 
} else {
console.log('computer')
}
}

//function to check if player or computer has won
const handleWinner = (currentBoard) => {
return 'none'
}


//function to handle player moves
const handlePlayerMove = async (prevBoard) => {
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
  
    const loading = loadingAnimation()
    const boardWComputerMove =  await handleComputerMove(boardWPlayerMove)
    const newBoard =  printBoard(boardWComputerMove)
    // const winner = await handleWinner(boardWComputerMove)
    //   if(winner === 'none'){
    //     await handlePlayerMove(boardWComputerMove)
    //   } else if(checkWinner(boardWComputerMove) === 'computer'){
    //     console.log('So sorry!! No one beats the Whiz!')
    //   } else {
    //     console.log(`ULTIMATE VICTORY FOR ${playerName.toUpperCase()}!!!!`)
    //   }
    
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

