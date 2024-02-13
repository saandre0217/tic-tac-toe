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

//function for computer to play a move
const handleComputerMove = (currentBoard) => {
  let computerMoveInd;
  

if(playerMoves.length === 1){
  //const playerMoveInd = playerMoves[0]
  const computerMoveOptions = currentBoard.slice()
  const removalInd = playerMove - 1
  computerMoveOptions.splice(removalInd, 1)
  const randomInd = Math.floor(Math.random() * computerMoveOptions.length)
  computerMoveInd = computerMoveOptions[randomInd]
  console.log('first play', playerMove, removalInd, computerMoveOptions, computerMoveInd)
  computerMoves.push(computerMoveInd)
  console.log('computer moves', computerMoves)
  return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
} else {
  const playerLastMoveInd = playerMoves[playerMoves.length - 1]

  const computerLastMoveInd = computerMoves[computerMoves.length - 1]
  const playerPrevMoveInd = playerMoves[playerMoves.length - 2]
  console.log('p last', playerLastMoveInd, 'p prev', playerPrevMoveInd)
  console.log('computer moves after first', computerMoves)

  if(directionIndicatorObj.ltr.includes(playerLastMoveInd) && directionIndicatorObj.ltr.includes(playerPrevMoveInd)){
    return checkDiagonals(directionIndicatorObj.ltr, currentBoard)
  } else if(directionIndicatorObj.rtl.includes(playerLastMoveInd) && directionIndicatorObj.rtl.includes(playerPrevMoveInd)){
    return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
  } else if(directionIndicatorObj.row.includes(playerPrevMoveInd - playerLastMoveInd)){
    console.log('row')
    return checkRows(playerLastMoveInd, currentBoard)
  } else if(directionIndicatorObj.col.includes(playerPrevMoveInd - playerLastMoveInd)){
    console.log('col')
    return checkColumns(playerLastMoveInd, currentBoard)
  } else {
    return checkColumns(computerLastMoveInd, currentBoard)
  }

}
}
checkDiagonals = (diagArr, currentBoard) => {
  if(typeof currentBoard[diagArr[0]] === 'number'){
    return handleWaitToUpdateBoard(updateBoard, computerLetter, diagArr[0], currentBoard)
  } else if (typeof currentBoard[diagArr[1]] === 'number'){
    return handleWaitToUpdateBoard(updateBoard, computerLetter, diagArr[1], currentBoard)
  } else if(typeof currentBoard[diagArr[2]] === 'number'){
    return handleWaitToUpdateBoard(updateBoard, computerLetter, diagArr[2], currentBoard)
  } else if(isNoWinner(currentBoard)){
    console.log('you are very smart! looks like we both win!!')
  } 
}
const findFirstEmptyMove = (currentBoard) => {
  for(let i = 0; i > currentBoard.length; i++){
    if(typeof currentBoard[i] === 'number'){
      return handleWaitToUpdateBoard(updateBoard, computerLetter, currentBoard[i], currentBoard)
    } else {
      console.log('you are very smart! looks like we both win!!')
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
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else if(typeof currentBoard[lastMove + 2] === 'number' ){
        computerMoveInd = lastMove + 2
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
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else  if(typeof currentBoard[lastMove - 1] === 'number' ){
        computerMoveInd = lastMove - 1
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
  } else if(indexCoordObj[lastMove][1] === 2){
    // if(currentBoard[lastMove - 1] === playerLetter || currentBoard[lastMove - 2] === playerLetter){
    //   console.log('need to check diagonal')
    // } else {
      if(typeof currentBoard[lastMove - 1] === 'number'){
        computerMoveInd = lastMove - 1
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else  if(typeof currentBoard[lastMove - 2] === 'number'){
        computerMoveInd = lastMove - 2
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


//function to check if player or computer has won
const handleWinner = (currentBoard) => {
  let winner;

    //8 possible ways to win
    //columns & rows
    for (var i = 0; i < 3; i += 1) {
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
      } else {
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

/**
 * if(currentBoard[lastMove + 3] && typeof currentBoard[lastMove + 3] === 'number' ){
    computerMoveInd = lastMove + 3
    return new Promise ((resolve) => {
      setTimeout(() => {
        resolve(updateBoard(computerLetter, computerMoveInd, currentBoard))
      }, 3000)
    })
  } else if(currentBoard[lastMove + 1] && typeof currentBoard[lastMove + 1] === 'number'){
    computerMoveInd = lastMove + 1
    return new Promise ((resolve) => {
      setTimeout(() => {
        resolve(updateBoard(computerLetter, computerMoveInd, currentBoard))
      }, 3000)
    })
  } else if(currentBoard[lastMove + 2] && typeof currentBoard[lastMove + 2] === 'number'){
    computerMoveInd = lastMove + 2
    return new Promise ((resolve) => {
      setTimeout(() => {
        resolve(updateBoard(computerLetter, computerMoveInd, currentBoard))
      }, 3000)
    })
  } else if(currentBoard[lastMove + 4] && typeof currentBoard[lastMove + 4] === 'number'){
    computerMoveInd = lastMove + 2
    return new Promise ((resolve) => {
      setTimeout(() => {
        resolve(updateBoard(computerLetter, computerMoveInd, currentBoard))
      }, 3000)
    })
    } else if(currentBoard[lastMove - 1] && typeof currentBoard[lastMove - 1] === 'number'){
      computerMoveInd = lastMove - 1
      return new Promise ((resolve) => {
        setTimeout(() => {
          resolve(updateBoard(computerLetter, computerMoveInd, currentBoard))
        }, 3000)
      })
    } else if(currentBoard[lastMove - 2] && typeof currentBoard[lastMove - 2] === 'number'){
      computerMoveInd = lastMove - 2
      return new Promise ((resolve) => {
        setTimeout(() => {
          resolve(updateBoard(computerLetter, computerMoveInd, currentBoard))
        }, 3000)
      })
    }
    const possComputerMoves = [
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
 */