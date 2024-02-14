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