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
  console.log('removal index', index)
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

const getWinningMove = (currentBoard) => { //remove?
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

const findWinningMove = (currentBoard) => {
for(let i = 0; i < currentBoard.length; i++){
  if(currentBoard[i] === computerLetter){
    if(checkRows(i, currentBoard)){
      return checkRows(i, currentBoard)
    } else {
      if(checkColumns(i, currentBoard)){
        return checkColumns(i, currentBoard)
      } else {
        console.log('diag')
      }
    }
  }
}
}
//block when player 2 
const getComputerMove = (lastMoveInd, prevMoveInd, currentBoard) => {
  if(directionIndicatorObj.ltr.includes(lastMoveInd) && directionIndicatorObj.ltr.includes(prevMoveInd)){
    if (checkDiagonals(directionIndicatorObj.ltr, currentBoard)){
      return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoves[computerMoves.length - 1], currentBoard)
    } else {
      console.log('returned false diagonal')
    }
  } else if(directionIndicatorObj.rtl.includes(lastMoveInd) && directionIndicatorObj.rtl.includes(prevMoveInd)){
    return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
  } else if(directionIndicatorObj.row.includes(prevMoveInd - lastMoveInd)){
    console.log('row')
    if(checkRows(lastMoveInd, currentBoard)){
      console.log('is it working')
      return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoves[computerMoves.length - 1], currentBoard)
    } else {
      console.log('returned false row')
    }
    //return checkRows(lastMoveInd, currentBoard)
  } else if(directionIndicatorObj.col.includes(prevMoveInd - lastMoveInd)){
    console.log('col')
    if(checkColumns(lastMoveInd, currentBoard)){
      return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoves[computerMoves.length - 1], currentBoard)
    } else {
      console.log('return false col')
    }
  } else {
    return currentBoard
  }
}

const handleBlockOrWin = (currentBoard) => {
  
  for(let i = 0; i < currentBoard.length; i++){
    if(currentBoard[i] === computerLetter){
      for(let j = i + 1; j < currentBoard.length; j++){
       if(currentBoard[j] === computerLetter && indexCoordObj[i][0] === indexCoordObj[j][0]){
        console.log('win row', indexCoordObj[i][0], indexCoordObj[j][0], j, i)
        return checkRows(j, currentBoard)
       } else if(currentBoard[j] === computerLetter && indexCoordObj[i][1] === indexCoordObj[j][1]){
        console.log('win col', indexCoordObj[i][1], indexCoordObj[j][1], j, i)
        return checkColumns(j, currentBoard)
       } else if(currentBoard[j] === computerLetter && indexCoordObj.ltr.includes(j) && indexCoordObj.ltr.includes(i)){
        console.log('win ltr', j, i)
        return checkDiagonals(indexCoordObj.ltr, currentBoard)
       } else if(currentBoard[j] === computerLetter && indexCoordObj.rtl.includes(j) && indexCoordObj.rtl.includes(i)){
        console.log('win rtl', j, i)
        return checkDiagonals(indexCoordObj.rtl, currentBoard)
       }
      }
    } else if(currentBoard[i] === playerLetter){
      for(let j = i + 1; j < currentBoard.length; j++){
        if(currentBoard[j] === playerLetter && indexCoordObj[i][0] === indexCoordObj[j][0]){
          console.log('block row', indexCoordObj[i][0], indexCoordObj[j][0], j, i)
         return checkRows(j, currentBoard)
        } else if(currentBoard[j] === playerLetter && indexCoordObj[i][1] === indexCoordObj[j][1]){
          console.log('block col', indexCoordObj[i][0], indexCoordObj[j][0], j, i)
          return checkColumns(j, currentBoard)
         } else if(currentBoard[j] === playerLetter && indexCoordObj.ltr.includes(j)){
          console.log('block ltr', j, i)
          return checkDiagonals(indexCoordObj.ltr, currentBoard)
         } else if(currentBoard[j] === playerLetter && indexCoordObj.rtl.includes(j)){
          console.log('block rtl', j, i)
          return checkDiagonals(indexCoordObj.rtl, currentBoard)
         }
       }

    } else {
     return findFirstEmptyMove(currentBoard)
    }
  }

}


const checkDiagonals = (diagArr, currentBoard) => {
  if(typeof currentBoard[diagArr[0]] === 'number'){
    computerMoves.push(diagArr[0])
    //return true;
    return handleWaitToUpdateBoard(updateBoard, computerLetter, diagArr[0], currentBoard)
  } else if (typeof currentBoard[diagArr[1]] === 'number'){
    computerMoves.push(diagArr[1])
    //return true;
    return handleWaitToUpdateBoard(updateBoard, computerLetter, diagArr[1], currentBoard)
  } else if(typeof currentBoard[diagArr[2]] === 'number'){
    computerMoves.push(diagArr[2])
    //return true;
    return handleWaitToUpdateBoard(updateBoard, computerLetter, diagArr[2], currentBoard)
  } else {
    return false
  } 
}
const findFirstEmptyMove = (currentBoard) => {
  for(let i = 0; i > currentBoard.length; i++){
    if(typeof currentBoard[i] === 'number'){
      computerMoves.push(currentBoard[i])
      return handleWaitToUpdateBoard(updateBoard, computerLetter, currentBoard[i], currentBoard)
    } else {
      return handleWinner(currentBoard)
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
        //return true
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else if(typeof currentBoard[lastMove + 2] === 'number' ){
        computerMoveInd = lastMove + 2
        computerMoves.push(computerMoveInd)
        //return true
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
          //return findFirstEmptyMove(currentBoard)
          return false;
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
        //return true
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else  if(typeof currentBoard[lastMove - 1] === 'number' ){
        computerMoveInd = lastMove - 1
        computerMoves.push(computerMoveInd)
        //return true
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else {
        // if(isNoWinner(currentBoard)){
        //   console.log('you are very smart! looks like we both win!!')
        // } else 
        if(playerMoves.includes(0) || playerMoves.includes(8)){
          computerMoves.push(computerMoveInd)
          //return true
          return checkDiagonals(directionIndicatorObj.ltr, currentBoard)
        } else if(playerMoves.includes(2) || playerMoves.includes(6)){
          computerMoves.push(computerMoveInd)
          //return true
          return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
        } else {
          //return findFirstEmptyMove(currentBoard)
          //return false
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
        //return true
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else  if(typeof currentBoard[lastMove - 2] === 'number'){
        computerMoveInd = lastMove - 2
        computerMoves.push(computerMoveInd)
        //return true
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
          //return findFirstEmptyMove(currentBoard)
          return false
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
        //return true
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
          //return findFirstEmptyMove(currentBoard)
          return false
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
        //return true
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else if (typeof currentBoard[lastMove - 3] === 'number'){
        computerMoveInd = lastMove - 3
        computerMoves.push(computerMoveInd)
        //return true
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
          //return findFirstEmptyMove(currentBoard)
          return false
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
        //return true
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else if (typeof currentBoard[lastMove - 6] === 'number'){
        computerMoveInd = lastMove - 6
        computerMoves.push(computerMoveInd)
        //return true
        return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
      } else {
        console.log('column check else block 3')
        if(playerMoves.includes(0) || playerMoves.includes(8)){
          return checkDiagonals(directionIndicatorObj.ltr, currentBoard)
        } else if(playerMoves.includes(2) || playerMoves.includes(6)){
          return checkDiagonals(directionIndicatorObj.rtl, currentBoard)
        } else {
          //return findFirstEmptyMove(currentBoard)
          return false
        }
      }
    //}
  } 
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

  return moves[bestMove].index - 1;
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
//function for computer to play a move
//const handleComputerMove = (currentBoard) => {
//   let computerMoveInd;
// if(computerMoves.length === 0){
//   const playerMoveInd = playerMoves[0]
//   const computerMoveOptions = getFirstMoveOptions(playerMoveInd, currentBoard)
//   const randomInd = Math.floor(Math.random() * computerMoveOptions.length)
//   computerMoveInd = computerMoveOptions[randomInd]
//   console.log('first play', playerMove, computerMoveOptions, computerMoveInd)
//   computerMoves.push(computerMoveInd)
//   console.log('computer moves', computerMoves)
//   return handleWaitToUpdateBoard(updateBoard, computerLetter, computerMoveInd, currentBoard)
// } else {
//   // const playerLastMoveInd = playerMoves[playerMoves.length - 1]
//   // const playerPrevMoveInd = playerMoves[playerMoves.length - 2]
//   // console.log('p last', playerLastMoveInd, 'p prev', playerPrevMoveInd)
//   // console.log('computer moves after first', computerMoves)
//   //return getComputerMove(playerLastMoveInd, playerPrevMoveInd, currentBoard)
//   return handleBlockOrWin(currentBoard)
////} 
// else {
//  return findWinningMove(currentBoard)
// }
//}
const handlePlayerMove = async (prevBoard) => {
  const moveIndex = playerMove 
  playerMove = rls.questionInt(`Your Turn!`)
  if(playerMove > 9 || playerMove < 1 || !prevBoard.includes(playerMove)){
    console.log(`Oops! ${playerMove} isn't on the board. Try again!`)
    return handlePlayerMove(prevBoard)
  } else {
    //playerMoves.push(moveInd)
    console.log(playerMoves)
    const boardWPlayerMove = updateBoard(playerLetter, playerMove - 1, prevBoard)
    printBoard(boardWPlayerMove)
    console.log(`Nice Choice! Let's see where Tic Tac Toe Wiz, Trixie, plays her ${computerLetter}`)
    console.log(boardWPlayerMove)
    const loading = loadingAnimation()
    const boardWComputerMove = await handleComputerMove(boardWPlayerMove)
    printBoard(boardWComputerMove)
    
      if(handleWinning(boardWComputerMove, computerLetter)){
        console.log('So sorry!! No one beats the Whiz!')
      } else if(handleWinning(boardWComputerMove, playerLetter)){
        console.log('wow you won')
      } else {
        const emptySquares = getEmptyIndices(boardWComputerMove)
        if(emptySquares.length === 0){
          console.log('looks like we are both smarty pants! 2 winners it is!')
        } else {
          handlePlayerMove(boardWComputerMove)
        }
      }
    
  }
}

const handleComputerMove = (currentBoard) => {
  const bestSpot = getBestMove(currentBoard, computerLetter)
  console.log('computer movee', currentBoard, bestSpot)
  return handleWaitToUpdateBoard(updateBoard, computerLetter, bestSpot, currentBoard)
}

//game play
const startGame = () => {

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
}
startGame()