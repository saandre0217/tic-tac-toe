const rls = require('readline-sync');
var clc = require("cli-color");

let playerName;
let playerLetter;
const emptyBoard = [1, 2, 3, 4, 5, 6, 7, 8, 9]
let playerMove;
let playerMoves = []
let computerMoves = [];
let computerLetter;
const indexCoordObj = {
  0: [0, 0],
  1: [0, 1],
  2: [0, 2],
  3: [1, 0],
  4: [1, 1],
  5: [1, 2],
  6: [2, 0],
  7: [2, 1],
  8: [2, 2]
}

const directionIndicatorObj = {
  row: [1, 2, -1, -2],
  col: [3, 6, -3, -6],
  ltr: [0, 4, 8],
  rtl: [2, 4, 6]
}
//*************************BOARD FUNCTIONS BEGIN **************************/
//function to show board in command line 
const printBoard = (boardArr) => {
  if(boardArr){
    console.log(` ${boardArr[0]} | ${boardArr[1]} | ${boardArr[2]} \n --------- \n ${boardArr[3]} | ${boardArr[4]} | ${boardArr[5]} \n --------- \n ${boardArr[6]} | ${boardArr[7]} | ${boardArr[8]}`)
  } else {
    console.log('no board')
  }
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
//*************************BOARD FUNCTIONS END **************************/

//*************************COMPUTER PLAY FUNCTIONS BEGIN **************************/

const getFirstMoveOptions = (playerFirstMoveInd, currentBoard) => {
  let options = [];
  for(let i = 0; i < directionIndicatorObj.row.length; i++){
    if(currentBoard[playerFirstMoveInd + directionIndicatorObj.row[i]]){
      options.push([playerFirstMoveInd + directionIndicatorObj.row[i]])
    }
  }

  for(let i = 0; i < directionIndicatorObj.col.length; i++){
    if(currentBoard[playerFirstMoveInd + directionIndicatorObj.col[i]]){
      options.push([playerFirstMoveInd + directionIndicatorObj.col[i]])
    }
  }

  if(directionIndicatorObj.ltr.includes(playerFirstMoveInd)){
    for(let i = 0; i < directionIndicatorObj.ltr.length; i++){
      if(playerFirstMoveInd !== directionIndicatorObj.ltr[i]){
        options.push(directionIndicatorObj.ltr[i])
      }
    }
  }

  if(directionIndicatorObj.rtl.includes(playerFirstMoveInd)){
    for(let i = 0; i < directionIndicatorObj.rtl.length; i++){
      if(playerFirstMoveInd !== directionIndicatorObj.rtl[i]){
        options.push(directionIndicatorObj.rtl[i])
      }
    }
  }

  return options.flat()
}

const getWinningMove = (currentBoard) => {
  console.log('winning functions')
  for(let i = 0; i < currentBoard.length; i++){
    if(currentBoard[i] === computerLetter){
      console.log('i', currentBoard[i])
      if (currentBoard[i] === currentBoard[i + 3] || currentBoard[i] === currentBoard[i + 6]){
        if(typeof currentBoard[i + 3] === 'number'){
          console.log('win col')
          return handleWaitToUpdateBoard(updateBoard, computerLetter, currentBoard[i + 3], currentBoard)
        }
      } else if (currentBoard[i * 3] === currentBoard[(i * 3) + 1] || currentBoard[i * 3] === currentBoard[(i * 3) + 2]){
        if(typeof currentBoard[(i * 3) + 1] === 'number'){
          console.log('win row')
          return handleWaitToUpdateBoard(updateBoard, computerLetter, currentBoard[(i * 3) + 1], currentBoard)
        }
      }
    }
  }

  if(computerMoves.includes(0) || computerMoves.includes(8)){
    console.log('win diag 1')
    return checkDiagonals(directionIndicatorObj.ltr, currentBoard)
  } else if(computerMoves.includes(2) || computerMoves.includes(6)){
    console.log('win diag 2')
    return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
  } else {
    const computerLastMoveInd = computerMoves[computerMoves.length - 1]
    const computerPrevMoveInd = computerMoves[computerMoves.length - 2]
    console.log('c last', computerLastMoveInd, 'c prev', computerPrevMoveInd)
    console.log('computer moves last', computerMoves)
    console.log('last resort')
    return getComputerMove(computerLastMoveInd, computerPrevMoveInd, currentBoard)
  }

}


const getComputerMove = (lastMoveInd, prevMoveInd, currentBoard) => {
  if(directionIndicatorObj.ltr.includes(lastMoveInd) && directionIndicatorObj.ltr.includes(prevMoveInd)){
    return checkDiagonals(directionIndicatorObj.ltr, currentBoard)
  } else if(directionIndicatorObj.rtl.includes(lastMoveInd) && directionIndicatorObj.rtl.includes(prevMoveInd)){
    return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
  } else if(directionIndicatorObj.row.includes(prevMoveInd - lastMoveInd)){
    console.log('row')
    return checkRows(lastMoveInd, currentBoard)
  } else if(directionIndicatorObj.col.includes(prevMoveInd - lastMoveInd)){
    console.log('col')
    return checkColumns(lastMoveInd, currentBoard)
  } else {
    return currentBoard
  }
}


const checkDiagonals = (diagArr, currentBoard) => {
  if(typeof currentBoard[diagArr[0]] === 'number'){
    computerMoves.push(diagArr[0])
    return handleWaitToUpdateBoard(updateBoard, computerLetter, diagArr[0], currentBoard)
  } else if (typeof currentBoard[diagArr[1]] === 'number'){
    computerMoves.push(diagArr[1])
    return handleWaitToUpdateBoard(updateBoard, computerLetter, diagArr[1], currentBoard)
  } else if(typeof currentBoard[diagArr[2]] === 'number'){
    computerMoves.push(diagArr[2])
    return handleWaitToUpdateBoard(updateBoard, computerLetter, diagArr[2], currentBoard)
  } else {
    return currentBoard
  } 
}
const findFirstEmptyMove = (currentBoard) => {
  for(let i = 0; i > currentBoard.length; i++){
    if(typeof currentBoard[i] === 'number'){
      computerMoves.push(currentBoard[i])
      return handleWaitToUpdateBoard(updateBoard, computerLetter, currentBoard[i], currentBoard)
    } else {
      return currentBoard
    }
  }
}

const isNoWinner = (currentBoard) => {
  return currentBoard.every((move) => typeof move === 'string' )
}
const checkRows = (lastMove, currentBoard) => {
  if(indexCoordObj[lastMove][1] === 0){
    // if(currentBoard[lastMove + 1] === playerLetter || currentBoard[lastMove + 2] === playerLetter){
    //   console.log('need to check diagonal')
    // } else {
      if(typeof currentBoard[lastMove + 1] === 'number' ){
        computerMoveInd = lastMove + 1
        computerMoves.push(computerMoveInd)
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else if(typeof currentBoard[lastMove + 2] === 'number' ){
        computerMoveInd = lastMove + 2
        computerMoves.push(computerMoveInd)
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else {
        // if(isNoWinner(currentBoard)){
        //   console.log('you are very smart! looks like we both win!!')
        // } else 
        if(playerMoves.includes(0) || playerMoves.includes(8)){
          return checkDiagonals(directionIndicatorObj.ltr, currentBoard)
        } else if(playerMoves.includes(2) || playerMoves.includes(6)){
          return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
        } else {
          return findFirstEmptyMove(currentBoard)
        }
      }
    //}
  } else if(indexCoordObj[lastMove][1] === 1){
    // if(currentBoard[lastMove + 1] === playerLetter || currentBoard[lastMove - 1] === playerLetter){
    //   console.log('need to check diagonal')
    // } else {
      if(typeof currentBoard[lastMove + 1] === 'number'){
        computerMoveInd = lastMove + 1
        computerMoves.push(computerMoveInd)
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else  if(typeof currentBoard[lastMove - 1] === 'number' ){
        computerMoveInd = lastMove - 1
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else {
        // if(isNoWinner(currentBoard)){
        //   console.log('you are very smart! looks like we both win!!')
        // } else 
        if(playerMoves.includes(0) || playerMoves.includes(8)){
          computerMoves.push(computerMoveInd)
          return checkDiagonals(directionIndicatorObj.ltr, currentBoard)
        } else if(playerMoves.includes(2) || playerMoves.includes(6)){
          computerMoves.push(computerMoveInd)
          return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
        } else {
          return findFirstEmptyMove(currentBoard)
        }
      }
  //}
  } else if(indexCoordObj[lastMove][1] === 2){
    // if(currentBoard[lastMove - 1] === playerLetter || currentBoard[lastMove - 2] === playerLetter){
    //   console.log('need to check diagonal')
    // } else {
      if(typeof currentBoard[lastMove - 1] === 'number'){
        computerMoveInd = lastMove - 1
        computerMoves.push(computerMoveInd)
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else  if(typeof currentBoard[lastMove - 2] === 'number'){
        computerMoveInd = lastMove - 2
        computerMoves.push(computerMoveInd)
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else {
        // if(isNoWinner(currentBoard)){
        //   console.log('you are very smart! looks like we both win!!')
        // } else 
        if(playerMoves.includes(0) || playerMoves.includes(8)){
          return checkDiagonals(directionIndicatorObj.ltr, currentBoard)
        } else if(playerMoves.includes(2) || playerMoves.includes(6)){
          return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
        } else {
          return findFirstEmptyMove(currentBoard)
        }
      }
  //}
}
}

const checkColumns = (lastMove, currentBoard) => {
  console.log('computer last move', lastMove)
  if(indexCoordObj[lastMove][0] === 0){ //last move was on the top row

    // if(currentBoard[lastMove + 3] === playerLetter || currentBoard[lastMove + 6] === playerLetter ){
    //   return checkRows(lastMove, currentBoard)
    // } else {
      if(typeof currentBoard[lastMove + 3] === 'number' ){
        computerMoveInd = lastMove + 3
        computerMoves.push(computerMoveInd)
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else if (typeof currentBoard[lastMove + 6] === 'number'){
        computerMoveInd = lastMove + 6
        computerMoves.push(computerMoveInd)
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else {
        console.log('column check else block 1')
        // if(isNoWinner(currentBoard)){
        //   console.log('you are very smart! looks like we both win!!')
        // } else 
        if(playerMoves.includes(0) || playerMoves.includes(8)){
          return checkDiagonals(directionIndicatorObj.ltr, currentBoard)
        } else if(playerMoves.includes(2) || playerMoves.includes(6)){
          return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
        } else {
          return findFirstEmptyMove(currentBoard)
        }
      }
    // }
 
  } else if (indexCoordObj[lastMove][0] === 1) { //last move was on the middle row
    // if(currentBoard[lastMove + 3] === playerLetter || currentBoard[lastMove - 3] === playerLetter ){
    //   return checkRows(lastMove, currentBoard)
    // } else {
      if(typeof currentBoard[lastMove + 3] === 'number'){
        computerMoveInd = lastMove + 3
        computerMoves.push(computerMoveInd)
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else if (typeof currentBoard[lastMove - 3] === 'number'){
        computerMoveInd = lastMove - 3
        computerMoves.push(computerMoveInd)
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else {
        console.log('column check else block 2')
        // if(isNoWinner(currentBoard)){
        //   console.log('you are very smart! looks like we both win!!')
        // } else 
        if(playerMoves.includes(0) || playerMoves.includes(8)){
          return checkDiagonals(directionIndicatorObj.ltr, currentBoard)
        } else if(playerMoves.includes(2) || playerMoves.includes(6)){
          return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
        } else {
          return findFirstEmptyMove(currentBoard)
        }
      }
   // }
  } else if (indexCoordObj[lastMove][0] === 2) { //last move was on the last row
    // if(currentBoard[lastMove - 3] === playerLetter || currentBoard[lastMove - 6] === playerLetter ){
    //   return checkRows(lastMove, currentBoard)
    // } else {
      if(typeof currentBoard[lastMove - 3] === 'number'){
        computerMoveInd = lastMove - 3
        computerMoves.push(computerMoveInd)
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else if (typeof currentBoard[lastMove - 6] === 'number'){
        computerMoveInd = lastMove - 6
        computerMoves.push(computerMoveInd)
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else {
        console.log('column check else block 3')
        if(playerMoves.includes(0) || playerMoves.includes(8)){
          return checkDiagonals(directionIndicatorObj.ltr, currentBoard)
        } else if(playerMoves.includes(2) || playerMoves.includes(6)){
          return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
        } else {
          return findFirstEmptyMove(currentBoard)
        }
      }
    //}
  } 
}

//*************************COMPUTER PLAY FUNCTIONS END **************************/

//*************************HANDLER FUNCTIONS BEGIN **************************/

//function to check if player or computer has won
const handleWinner = (currentBoard) => {
  let winner;

    //8 possible ways to win
    //columns & rows
    if(isNoWinner(currentBoard)){
      return 'both'
    }
    for (let i = 0; i < 3; i++) {
        if (currentBoard[i] === currentBoard[i + 3] && currentBoard[i] === currentBoard[i + 6]) {
            if(currentBoard[i] === computerLetter){
              winner = 'computer'
            } else {
              winner = 'player'
            }
            return winner
        } else if (currentBoard[i * 3] === currentBoard[(i * 3) + 1] && currentBoard[i * 3] === currentBoard[(i * 3) + 2]) {
            if(currentBoard[i * 3] === computerLetter){
              winner = 'computer'
            } else {
              winner = 'player'
            }
            console.log('block2', winner)
            return winner
        }
    }
    //diagonals
    if (currentBoard[0] === currentBoard[4] && currentBoard[0] === currentBoard[8]) {
      if(currentBoard[0] === computerLetter){
        winner = 'computer'
      } else {
        winner = 'player'
      }
      console.log('block3', winner)
        return winner
    } else if (currentBoard[2] === currentBoard[4] && currentBoard[2] === currentBoard[6]) {
      if(currentBoard[2] === computerLetter){
        winner = 'computer'
      } else {
        winner = 'player'
      }
      console.log('block1', winner)
        return winner
    }
  
      return 'none'
   
}

//function for computer to play a move
const handleComputerMove = (currentBoard) => {
  let computerMoveInd;
if(computerMoves.length === 0){
  const playerMoveInd = playerMoves[0]
  const computerMoveOptions = getFirstMoveOptions(playerMoveInd, currentBoard)
  const randomInd = Math.floor(Math.random() * computerMoveOptions.length)
  computerMoveInd = computerMoveOptions[randomInd]
  console.log('first play', playerMove, computerMoveOptions, computerMoveInd)
  computerMoves.push(computerMoveInd)
  console.log('computer moves', computerMoves)
  return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
} else if(computerMoves.length === 1){
  const playerLastMoveInd = playerMoves[playerMoves.length - 1]
  const playerPrevMoveInd = playerMoves[playerMoves.length - 2]
  console.log('p last', playerLastMoveInd, 'p prev', playerPrevMoveInd)
  console.log('computer moves after first', computerMoves)
  return getComputerMove(playerLastMoveInd, playerPrevMoveInd, currentBoard)
} else {
 return getWinningMove(currentBoard)
}
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
    console.log(playerMoves)
    const boardWPlayerMove = updateBoard(playerLetter, moveInd, prevBoard)
    printBoard(boardWPlayerMove)
    console.log(`Nice Choice! Let's see where Tic Tac Toe Wiz, Trixie, plays her ${computerLetter}`)
  
    const loading = loadingAnimation()
    const boardWComputerMove =  await handleComputerMove(boardWPlayerMove)
    const newBoard =  printBoard(boardWComputerMove)
    const winner = handleWinner(boardWComputerMove)
      if(winner === 'none'){
        handlePlayerMove(boardWComputerMove)
      } else if(winner === 'computer'){
        console.log('So sorry!! No one beats the Whiz!')
      } else if(winner === 'both'){
        console.log('looks like we are both smarty pants! 2 winners it is!')
      }else {
        console.log(`ULTIMATE VICTORY FOR ${playerName.toUpperCase()}!!!!`)
      }
    
  }
}



//game play
  playerName = rls.question(clc.red('Welcome to The Totally Tremendous Tic Tac Toe! What is your name?' ))

  if (rls.keyInYN(clc.red(`Excited to play, ${clc.bgWhite(playerName)}?! Enter ${clc.bgGreen(' Y ')} if you want to play as ${clc.bgGreen('X\'s')} or ${clc.bgCyan(' N ')} if you want to play as ${clc.bgCyan('O\'s')}`) )){
    playerLetter=clc.red('X')
    computerLetter=clc.green('O')
  } else {
    playerLetter=clc.red('X')
    computerLetter=clc.green('O')
  }
  printBoard(emptyBoard)
  console.log(`Great! Let's get started. \nYou will be playing against Tic Tac Toe Wiz, Trixie. \nWhen it is your turn, you will enter the number where you want your ${playerLetter} to go!`)

  handlePlayerMove(emptyBoard)

