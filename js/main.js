var gBoard = []
const gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0
}
const gLevel = {
    SIZE: 4,
    MINES: 2
}
const MINE = '💣'
const MARK = '🚩'
const EMPTY = ''





function onInit() {
    // alert("lets go")
    BuildBoard()
    renderBoard(gBoard)
    setMinesNegsCount(gBoard)
}

//* creates a the game board
//DONE seed BuildBoard
function BuildBoard() {
    gBoard = []
    for (var i = 0; i < gLevel.SIZE; i++) {
        gBoard[i] = []
        for (var j = 0; j < gLevel.SIZE; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
        //* addition for seed game
    }
    // addMines(gBoard, 0)

    gBoard[1][1].isMine = true
    gBoard[3][3].isMine = true


}

//*count mines around each cell and  set the
//*cell's mine around it
function setMinesNegsCount(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine)
                board[i][j].minesAroundCount = getMinesNegsCount(i, j, board)
        }
    }
    renderBoard(board)
}

//* return the number of mine neighbor to a cell
function getMinesNegsCount(rowIdx, colIdx, board) {
    var count = 0;
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j > board[0].length - 1) continue
            if (board[i][j].isMine) count++
        }
    }
    return count
}
//render the board as a table on the DOM
function renderBoard(board) {
    var strHTML = ''
    for (var i = 0; i < board.length; i++) {
        strHTML += `<tr>`
        for (var j = 0; j < board[i].length; j++) {
            const className = `cell-${i}-${j}`
            strHTML += `<td class = "${className}"onclick = "onCellClicked(this, ${i},${j})">
             <span class = "">`
            strHTML += board[i][j].isMine ? MINE : board[i][j].minesAroundCount
            strHTML += `</span></td>`
        }
        strHTML += `</tr>`
    }
    const elTable = document.querySelector('.board-table')

    elTable.innerHTML = strHTML
}

//called when a cell is clicked
function onCellClicked(elCell, i, j) {
    console.log(`i:${i} j:${j}`)
    if (!gBoard[i][j].isMine) {

        elCell.firstElementChild.classList.remove("hidden")
    }

}

//called when cell is right-clicked
function onCellMarked(elCell) {

}

//check if condition for winning met
function checkGameOver() {

}

//*expand shown cells according to the game logic
function expandShown(board, elCELL, i, j) {

}

function addMines(board, posFirstClick) {
    var minesNum = gLevel.MINES
    console.log(minesNum)
    for (var i = 0; i < minesNum; i++) {
        const emptyPos = getEmptyPos(board)
        board[emptyPos.i][emptyPos.j].isMine = true
    }

}
function getEmptyPos(board) {
    var emptyPoss = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine) {
                emptyPoss.push({ i, j })
            }
        }
    }
    var randIdx = getRandomInt(0, emptyPoss.length)
    console.log(emptyPoss)
    return emptyPoss[randIdx]
}

