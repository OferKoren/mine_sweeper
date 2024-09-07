'use strict'
var gBoard = []
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 3,
    isHintMode: false,
    safe: 3,
    darkmode: false,
    customMode: false,
    megaHint: false
}
const gLevel = {
    LEVEL: 'beginner',
    ROW: 4,
    COL: 4,
    get SIZE() {
        return this.COL * this.ROW
    },
    MINES: 2
}
const MINE = '💣'
const MARK = '🚩'
const EMPTY = ''
const WIN = '😎'
const LOSE = '😭'
const REGULAR = '😁'

var gIntervalTimer


function onInit() {
    reset()
    BuildBoard()
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)

    setTimeout(() => {
        renderScoreboard(gLevel.LEVEL)
    }, 3)

}

//* creates a the game board
//DONE seed BuildBoard
function BuildBoard() {
    gBoard = []
    for (var i = 0; i < gLevel.ROW; i++) {
        gBoard[i] = []
        for (var j = 0; j < gLevel.COL; j++) {
            gBoard[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
        //* addition for seed game
    }


    /*  gBoard[3][2].isMine = true
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
            if (board[i][j].isShown) {
                if (board[i][j].isMine) strHTML += MINE
                else if (board[i][j].minesAroundCount > 0) strHTML += board[i][j].minesAroundCount
            }
            else {
                if (gBoard[i][j].isMarked) strHTML += MARK
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
    if (!gGame.isOn && gGame.lives > 0) {
        //* only enter this part if in manual mode
        if (gLevel.LEVEL === 'custom') {

            if (gGame.customMode) {
                const elRandom = document.querySelector('.random')
                if (elRandom.classList.contains("not")) {
                    addCustomMine(gBoard, i, j)
                    return
                }
            }
            else return
        }
        //* initiate game regularly after first click
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
        //* check if game is on hintMode
        if (gGame.isHintMode) {
            getHint(gBoard, i, j)
            return
        }
        //*check if game is on mega Hint
        if (gGame.megaHint) {
            megaHint(gBoard, elCell, i, j)
            return
        }
        //* cant click on a marked  or shown cell 
        if (gBoard[i][j].isMarked /* || gBoard[i][j].isShown */) {
            return
        }
        //* check if clicked on mine if so end game
        if (gBoard[i][j].isMine) {
            if (gGame.lives > 0) {
                minusLive()
                if (gGame.lives > 0)
                    return
            }
            /* showModal()
            const elLose = document.querySelector('.lose')
            elLose.classList.remove('hidden') */
            showMines(gBoard)
            gGame.isOn = false

            renderBoard(gBoard)
            const elRestart = document.querySelector('.restart')
            elRestart.innerHTML = LOSE
            return
        }
        //*save move importent before updateing the modal
        gSaveMoves.push(copyMat(gBoard))

        //*update model 
        gBoard[i][j].isShown = true

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

        //*does not let you put more flags than mines
        if (gGame.markedCount === gLevel.MINES) {
            if (gBoard[rowIdx][colIdx].isMarked) {
                console.log('ji')
                //*save move importent before updateing the modal
                gSaveMoves.push(copyMat(gBoard))
                gBoard[rowIdx][colIdx].isMarked = false
            }
            else return
        }
        //*update model
        else {
            //*save move importent before updateing the modal
            gSaveMoves.push(copyMat(gBoard))
            gBoard[rowIdx][colIdx].isMarked = !gBoard[rowIdx][colIdx].isMarked
        }
        if (gBoard[rowIdx][colIdx].isMarked)
            gGame.markedCount++
        else
            gGame.markedCount--

        //*update dom
        const elMarkCount = document.querySelector('.mark-count ')
        elMarkCount.innerHTML = gLevel.MINES - gGame.markedCount
        renderBoard(gBoard)
        checkGameOver()
    }
}

//check if condition for winning met
function checkGameOver() {
    if (gGame.markedCount !== parseInt(gLevel.MINES)) return
    if (gGame.shownCount
        === gLevel.SIZE - gLevel.MINES) {
        gGame.isOn = false
        gGame.customMode = false;
        /*  showModal()
         const elWin = document.querySelector('.win')
         elWin.classList.remove('hidden') */

        const elRestart = document.querySelector('.restart')
        elRestart.innerHTML = WIN
        renderBoard(gBoard)
        //*add to scoreboard
        setTimeout(() => {
            saveScore()
        }, 300);
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
            if (board[i][j].isMarked) continue
            if (!board[i][j].isShown) {
                gGame.shownCount++
                if (!board[i][j].isMine && !board[i][j].isMarked) {
                    board[i][j].isShown = true
                    expandShown(board, null, i, j)
                }
            }

        }
    }
    renderBoard(board)
    return
}

function addMines(board) {
    var minesNum = gLevel.MINES
    for (var i = 0; i < minesNum; i++) {
        const emptyPos = getEmptyPos(board)
        board[emptyPos.i][emptyPos.j].isMine = true
    }

}

function onSetLevel(event, level) {
    console.log(event)
    switch (level) {
        case 'beginner': {
            gLevel.ROW = 4
            gLevel.COL = 4
            gLevel.MINES = 2
            gLevel.LEVEL = 'beginner'
            gGame.customMode = false;
            break
        }
        case 'medium': {
            gLevel.ROW = 8
            gLevel.COL = 8
            gLevel.MINES = 14
            gLevel.LEVEL = 'medium'
            gGame.customMode = false;
            break
        }
        case 'expert': {
            gLevel.ROW = 12
            gLevel.COL = 12
            gLevel.MINES = 18
            gLevel.LEVEL = 'expert'
            gGame.customMode = false;

            break
        }
        case 'custom': {
            if (!gGame.isOn) {
                gLevel.LEVEL = 'custom'
                if (event)
                    showCustomModal()
                renderScoreboard("custom")
            }
            else {
                if (gLevel.LEVEL !== 'modal') {
                    const elP = document.querySelector('.info-modal p')
                    elP.innerText = 'cant enter custom mode during a game'
                    return
                }
            }
        }
    }
    highlightCurrLvL()

    if (event && gLevel.LEVEL !== 'custom') {
        onInit();
    }
}

function updateTimer() {
    if (gGame.isOn)
        gGame.secsPassed++
    const elTimer = document.querySelector('.timer')
    elTimer.innerHTML = gGame.secsPassed
    if (!gGame.isOn)
        clearInterval(gIntervalTimer)
}

function minusLive() {
    //*update model
    gGame.lives--

    //*update DOM
    const elLive = document.querySelector(`.live${3 - gGame.lives}`)

    elLive.classList.add("hidden")
}

function reset() {
    gGame = {
        isOn: false,
        shownCount: 0,
        markedCount: 0,
        secsPassed: 0,
        lives: 3,
        isHintMode: false,
        safe: 3,
        darkmode: false,
        customMode: gGame.customMode,
        megaHint: false
    }
    const ellives = document.querySelectorAll('.live')
    ellives.forEach(live => {
        live.classList.remove("hidden")
    });
    const elRestart = document.querySelector('.restart')
    elRestart.innerHTML = REGULAR

    const elHints = document.querySelectorAll('.hint.used')
    elHints.forEach(hint => {
        hint.classList.remove("used")
    });

    //*return to defult values of a level
    onSetLevel(null, gLevel.LEVEL)

    //* reset mark count left
    const elMarkCount = document.querySelector('.mark-count ')
    elMarkCount.innerHTML = gLevel.MINES - gGame.markedCount

    //* reset hint count left
    const elHintCount = document.querySelector('.safe-count ')
    elHintCount.innerHTML = 3

    //* reset timer 
    const elTimer = document.querySelector('.timer')
    elTimer.innerHTML = 0;

    //* reterive mega hint button
    const elMegaHintButton = document.querySelector('.mega-hint-button')
    elMegaHintButton.classList.remove("hidden")

    //*reterive ExterButton
    const elExterButton = document.querySelector('.exter-button')
    elExterButton.classList.remove('hidden')

    //*reteriv safeButton
    const elSafe = document.querySelector('.safe')
    elSafe.classList.remove('used')

    //*highlight the current level ()
    highlightCurrLvL()
    buttonClickedToggle(null)

    //*clears info modal
    const elP = document.querySelector('.info-modal p')
    elP.innerText = ''

    //*specific reset
    if (gLevel.LEVEL === 'custom') {
        onSetCustom()
    }
    else {
        showCounts()
        hideCustomModal()
    }

}