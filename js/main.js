'use strict'
var gBoard = []
var gGame = {
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

var gIntervalTimer



function onInit() {
    // alert("lets go")
    reset()
    hideModal()
    BuildBoard()
    renderBoard(gBoard)

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

    /* gBoard[1][1].isMine = true
    gBoard[3][3].isMine = true */


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

//* return the number of mines neighbor to a cell
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
            var className = `cell-${i}-${j}`
            if (board[i][j].isShown) className += " open"
            else className += " close"
            if (board[i][j].isMine) className += " mine"
            strHTML += `<td class = "${className}"onclick = "onCellClicked(this, ${i},${j})"
            oncontextmenu = "onCellMarked(event,this,${i},${j})">`
            if (gBoard[i][j].isMarked) strHTML += MARK
            else if (gBoard[i][j].isShown) {
                if (gBoard[i][j].isMine) strHTML += MINE
                else if (gBoard[i][j].minesAroundCount > 0) strHTML += gBoard[i][j].minesAroundCount
            }
            strHTML += `</span>
            
            </td>`
        }
        strHTML += `</tr>`
    }
    const elTable = document.querySelector('.board-table')

    elTable.innerHTML = strHTML
}


//called when a cell is clicked
function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) {
        gGame.isOn = true
        gBoard[i][j].isMine = true
        addMines(gBoard)
        gBoard[i][j].isMine = false
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        gIntervalTimer = setInterval(updateTimer, 1000)
    }
    if (gGame.isOn) {
        //  console.log(`i:${i} j:${j}`)
        //* cant click on a marked  or shown cell 
        if (gBoard[i][j].isMarked /* || gBoard[i][j].isShown */) {
            return
        }

        //*update model 
        gBoard[i][j].isShown = true


        //* check if clicked on mine if so end game
        if (gBoard[i][j].isMine) {
            showModal()
            showMines(gBoard)
            gGame.isOn = false
            const elLose = document.querySelector('.lose')
            elLose.classList.remove('hidden')
            renderBoard(gBoard)
            return
        }


        //*update DOM
        renderBoard(gBoard)
        expandShown(gBoard, elCell, i, j)

        //*add to the count of cell shown importent to determine if win
        ++gGame.shownCount
        //*checks if gameOver
        checkGameOver()
    }
}
//show all the mines function for when you lose
function showMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) board[i][j].isShown = true
        }
    }
}
//called when cell is right-clicked
function onCellMarked(event, elCell, rowIdx, colIdx) {
    event.preventDefault();
    if (gBoard[rowIdx][colIdx].isShown) return
    if (gGame.isOn) {
        //*update model
        gBoard[rowIdx][colIdx].isMarked = !gBoard[rowIdx][colIdx].isMarked
        if (gBoard[rowIdx][colIdx].isMarked)
            gGame.markedCount++
        else
            gGame.markedCount--

        //*update dom
        renderBoard(gBoard)
        checkGameOver()
    }
}

//check if condition for winning met
function checkGameOver() {
    if (gGame.markedCount + gGame.shownCount
        === gLevel.SIZE ** 2) {
        gGame.isOn = false
        showModal()
        const elWin = document.querySelector('.win')
        elWin.classList.remove('hidden')
    }
}

//*expand shown cells according to the game logic
function expandShown(board, elCELL, rowIdx, colIdx) {

    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j > board[0].length - 1) continue
            if (board[i][j].isMine) return
        }
    }
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j > board[0].length - 1) continue
            //*update model
            if (!board[i][j].isShown) gGame.shownCount++
            board[i][j].isShown = true

        }
    }

    renderBoard(board)
}

function addMines(board) {
    var minesNum = gLevel.MINES
    for (var i = 0; i < minesNum; i++) {
        console.log("hi")
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
    return emptyPoss[randIdx]
}

function reset() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0
    }
}

function onSetLevel(level) {
    console.log("HI")
    switch (level) {
        case 1: {
            console.log("HIssd")
            gLevel.SIZE = 4
            gLevel.MINES = 2
            break
        }
        case 2: {
            gLevel.SIZE = 8
            gLevel.MINES = 14
            break
        }
        case 3: {
            gLevel.SIZE = 12
            gLevel.MINES = 32
            break
        }
    }
    onInit()
}

function updateTimer() {
    if (gGame.isOn)
        gGame.secsPassed++
    const elTimer = document.querySelector('.timer')
    elTimer.innerHTML = gGame.secsPassed
    if (!gGame.isOn)
        clearInterval(gIntervalTimer)
}