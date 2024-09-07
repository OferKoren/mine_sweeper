'use strict'
const HINT_ON = 'img/hintOn.png'
const HINT_OFF = 'img/hintOff.png'
const NIGHT = '🌙'
const DAY = '🌞'

var gScoreboard = {
    beginner: [],
    medium: [],
    expert: [],
}
var gSaveMoves = []
var gMegaHintPoss = []
var gCustomMinesCount

function onToggleHint(elHint) {
    if (!gGame.isOn) return

    //*turn off megaHint Mode if on
    if (gGame.megaHint) {
        gGame.megaHint = false
        const elMegaHintButton = document.querySelector('.mega-hint-button')
        buttonClickedToggle(elMegaHintButton)
    }

    if (elHint.classList.contains('on')) {
        elHint.src = HINT_OFF
        elHint.classList.remove('on')
        gGame.isHintMode = false
    } else if (gGame.isHintMode) return
    else {
        elHint.classList.add('on')
        elHint.src = HINT_ON
        gGame.isHintMode = true
    }
}

function getHint(board, rowIdx, colIdx) {
    var copyBoard = copyMat(board)
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            copyBoard[i][j].isShown = true
            console.log(i + ` ` + j)
        }
    }
    renderBoard(copyBoard)
    setTimeout(() => {
        renderBoard(gBoard)
        const elHint = document.querySelector('.hint.on')
        onToggleHint(elHint)
        elHint.classList.add('used')
    }, 1000)
}

function saveScore() {
    if (gLevel.LEVEL === 'custom') return
    const name = prompt('enter name to save score')
    if (name) {
        sortScore(gScoreboard[gLevel.LEVEL], name, gGame.secsPassed)
        renderScoreboard(gLevel.LEVEL)
    }
}
//*make sure the scores are stored in a sorted way
function sortScore(arr, name, time) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].time > time) {
            arr.splice(i, 0, { name, time })
            return
        }
    }
    arr.push({ name, time })
}

function renderScoreboard(level) {
    const elScoreboard = document.querySelector('.scoreboard tbody')

    //*custom level doest not have a scoreboard
    if (level === 'custom') {
        elScoreboard.innerHTML = ''
        return
    }
    const lvlScoreboard = gScoreboard[level]
    var strHTML = ''
    for (var i = 0; i < 10 && i < lvlScoreboard.length; i++) {
        strHTML += '<tr>'

        strHTML += `<td>${i + 1}.</td>`
        strHTML += `<td>${lvlScoreboard[i].name}</td>`
        strHTML += `<td>${lvlScoreboard[i].time}s</td>`

        strHTML += '</tr>'
    }
    elScoreboard.innerHTML = strHTML
}

//* load scoreboard  when page load
window.addEventListener('load', () => {
    const savedData = localStorage.getItem('scoreboard')
    if (savedData) {
        gScoreboard = JSON.parse(savedData)
        console.log('scores loaded from localStorage:', gScoreboard)
    }
})

//*save data to local storage before  unloading
window.addEventListener('beforeunload', (event) => {
    saveScores()
})

function saveScores() {
    localStorage.setItem('scoreboard', JSON.stringify(gScoreboard))
}

//* safe function that show you a safe spot to press
function onSafe() {
    //*if game is not on return
    if (!gGame.isOn) return
    //*if no safe left return
    if (gGame.safe === 0) return
    //*update  modal
    gGame.safe--

    //*update dom
    const elSafe = document.querySelector('.safe-count')
    elSafe.innerHTML = gGame.safe
    if (gGame.safe === 0) {
        const elSafeButton = document.querySelector('.safe')
        elSafeButton.classList.add('used')
    }
    const safeCell = getEmptyPos(gBoard)
    const elSafeCell = document.querySelector(`.cell-${safeCell.i}-${safeCell.j}`)
    elSafeCell.classList.add('safe-cell')
    setTimeout(() => {
        elSafeCell.classList.remove('safe-cell')
    }, 3000)
}

function onUndo() {
    if (gSaveMoves.length === 0) {
        onInit()
        return
    }
    if (gGame.isOn) {
        gBoard = gSaveMoves.pop()
        updateMines(gBoard)
        updateMarked(gBoard)
        updateShown(gBoard)
        renderBoard(gBoard)
    }
}

function updateMarked(board) {
    var count = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMark) count++
        }
    }
    gGame.markedCount = count
    const elMarkCount = document.querySelector('.mark-count')
    elMarkCount.innerHTML = gLevel.MINES - count
}

function updateShown(board) {
    var count = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isShown) count++
        }
    }
    gGame.shownCount = count
}
function updateMines(board) {
    var count = 0
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) count++
        }
    }
    gLevel.MINES = count
}
//*creates a very lousy darkmode
function onDarkmodeToggle(elBtn) {
    const elGame = document.querySelector('.row-container')
    elGame.classList.toggle('invert')

    const elbody = document.body
    elbody.classList.toggle('darkmode')

    const elButtons = document.querySelectorAll('button')
    elButtons.forEach((element) => {
        element.classList.toggle('invert')
    })

    elBtn.classList.toggle('darkmode')
    elBtn.innerText = elBtn.innerText === NIGHT ? DAY : NIGHT
    gGame.darkmode = !gGame.darkmode
    renderBoard(gBoard)
}

//*render the dropdown menus for the custom mode
function renderCustomValues() {
    var selectNames = ['rows', 'cols', 'mines']
    var strHtml = ''
    for (var i = 0; i < 3; i++) {
        strHtml += `<td> <select name = '${selectNames[i]}'>`
        for (var j = 1; j <= 30; j++) {
            strHtml += `<option value = '${j}'>${j}</option>`
        }
        strHtml += '</select></td>'
    }
    const elCustomValues = document.querySelector('.costum-values')
    elCustomValues.innerHTML = strHtml
}

//*set the custom game dimension and bomb count
function onSetCustom() {
    gGame.customMode = true
    //*reterive the selected values
    const elSelectRows = document.querySelector('select[name="rows"]')
    const elSelectCols = document.querySelector('select[name="cols"]')
    const elSelectMines = document.querySelector('select[name="mines"]')

    //* set the values to interger
    const rows = parseInt(elSelectRows.value)
    const cols = parseInt(elSelectCols.value)
    const mines = parseInt(elSelectMines.value)

    //*check that no impossible values are entered such as
    //*more mines that cells
    if (mines >= rows * cols) {
        alert('impossible to create this custom game because there are more mines than cells')
        return
    }

    //*update the model gLevel with the custom values
    gLevel.ROW = rows
    gLevel.COL = cols
    gLevel.MINES = mines

    //*set the custom mine count so it will know when to start the game
    //*after all the mines are place
    const elRandom = document.querySelector('.random')

    if (elRandom.classList.contains('not')) {
        const elCustomCount = document.querySelector('.custom-count')
        elCustomCount.innerText = gLevel.MINES
        gCustomMinesCount = gLevel.MINES

        //*show how many mine are left to place
        showMineCount()
    } else showCounts

    BuildBoard()
    renderBoard(gBoard)
    updateMarked(gBoard)
    updateShown(gBoard)
}
function addCustomMine(board, rowIdx, colIdx) {
    if (board[rowIdx][colIdx].isMine) return
    board[rowIdx][colIdx].isMine = true
    board[rowIdx][colIdx].isShown = true

    renderBoard(board)

    const elCustomCount = document.querySelector('.custom-count')
    elCustomCount.innerHTML = --gCustomMinesCount
    if (gCustomMinesCount === 0) {
        const elCustom = document.querySelector('div.custom')
        const elCounts = document.querySelector('.counts')

        elCustom.classList.toggle('hidden')
        elCounts.classList.toggle('hidden')
        startCustomGame()
    }
}

function startCustomGame() {
    gGame.isOn = true
    hideCustomMines(gBoard)
    gGame.shownCount = 0
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)
    gIntervalTimer = setInterval(updateTimer, 1000)
}

function hideCustomMines(board) {
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (board[i][j].isMine) {
                board[i][j].isShown = false
            }
        }
    }
}
//*just make the mega hint activated
function onMegaHint(elBtn) {
    if (gGame.isOn) {
        buttonClickedToggle(elBtn)
        gGame.megaHint = !gGame.megaHint
        if (gGame.megaHint) {
            console.log('mega hint on')
            gGame.isHintMode = false
            const elHints = document.querySelectorAll('.hint')
            elHints.forEach(hint => {
                hint.classList.remove('on')
                hint.src = HINT_OFF
            });
        }
        else console.log('mega hint off')
    }
}

//*add position of range for the mega hint and than show the range when recieve two positions
function megaHint(board, elCell, rowIdx, colIdx) {
    console.log('hi')
    gMegaHintPoss.push({ i: rowIdx, j: colIdx })
    elCell.classList.add('mega-hint')

    if (gMegaHintPoss.length === 2) {
        gGame.megaHint = false
        const firstPos = gMegaHintPoss[0]
        const secondPos = gMegaHintPoss[1]

        const iStart = firstPos.i < secondPos.i ? firstPos.i : secondPos.i
        const iEnd = firstPos.i > secondPos.i ? firstPos.i : secondPos.i

        const jStart = firstPos.j < secondPos.j ? firstPos.j : secondPos.j
        const jEnd = firstPos.j > secondPos.j ? firstPos.j : secondPos.j

        var copyBoard = copyMat(board)

        for (var i = iStart; i <= iEnd; i++) {
            for (var j = jStart; j <= jEnd; j++) {
                copyBoard[i][j].isShown = true
            }
        }

        renderBoard(copyBoard)

        setTimeout(() => {
            renderBoard(board)
            const elMegaHintButton = document.querySelector('.mega-hint-button')
            elMegaHintButton.classList.add('hidden')
            gMegaHintPoss = []
        }, 2000)
    }
}

//*remove three random bombs from the board
//*doesnt work on easy level

function onExterminator(elBtn) {
    if (!gGame.isOn) return
    if (gLevel.MINES <= 3) {
        const elP = document.querySelector('.info-modal p')
        elP.innerText = 'cant use the exterminator on games with less than 4 mines'
        return
    }
    var minePoss = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            if (gBoard[i][j].isMine) minePoss.push({ i, j })
        }
    }
    gSaveMoves.push(copyMat(gBoard))
    for (var i = 0; i < 3; i++) {
        const randIdx = getRandomInt(0, minePoss.length)
        const randPos = minePoss.splice(randIdx, 1)[0]
        gBoard[randPos.i][randPos.j].isMine = false
        if (gBoard[randPos.i][randPos.j].isMark) {
            gBoard[randPos.i][randPos.j].isMark = false
        }
    }
    //*update mine nums
    gLevel.MINES -= 3

    //*update marked
    updateMarked(gBoard)

    //*update neighbors
    setMinesNegsCount(gBoard)
    renderBoard(gBoard)

    //*hide button because its a one time button
    elBtn.classList.add('hidden')
}
