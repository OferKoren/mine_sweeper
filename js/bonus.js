const HINT_ON = "img/hintOn.png"
const HINT_OFF = "img/hintOff.png"
const NIGHT = '🌙'
const DAY = '🌞'

var gScoreboard = {
    beginner: [],
    medium: [],
    expert: []
}
var gSaveMoves = []
var gMegaHintPoss = []
var gCustomMinesCount

function onToggleHint(elHint) {

    if (!gGame.isOn) return
    if (elHint.classList.contains("on")) {
        elHint.src = HINT_OFF
        elHint.classList.remove("on")
        gGame.isHintMode = false
    }
    else if (gGame.isHintMode) return
    else {
        elHint.classList.add("on")
        elHint.src = HINT_ON
        gGame.isHintMode = true;
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
        elHint.classList.add("used")
    }, 1000);
}

function saveScore() {
    const name = prompt("enter name to save score")
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
    const lvlScoreboard = gScoreboard[level]
    var strHTML = ""
    for (var i = 0; i < 10 && i < lvlScoreboard.length; i++) {
        strHTML += "<tr>"

        strHTML += `<td>${i + 1}.</td>`
        strHTML += `<td>${lvlScoreboard[i].name}</td>`
        strHTML += `<td>${lvlScoreboard[i].time}s</td>`


        strHTML += "</tr>"
    }
    const elScoreboard = document.querySelector('.scoreboard tbody')
    elScoreboard.innerHTML = strHTML
}

//* load scoreboard  when page load
window.addEventListener('load', () => {
    const savedData = localStorage.getItem('scoreboard');
    if (savedData) {
        gScoreboard = JSON.parse(savedData);
        console.log('scores loaded from localStorage:', gScoreboard);
    }
});

//*save data to local storage before  unloading
window.addEventListener('beforeunload', (event) => {
    saveScores();

});

function saveScores() {
    localStorage.setItem('scoreboard', JSON.stringify(gScoreboard));
}

//* safe function that show you a safe spot to press
function onSafe() {
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
    elSafeCell.classList.add("safe-cell")
    setTimeout(() => {
        elSafeCell.classList.remove("safe-cell")
    }, 3000);
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
    const elAll = document.querySelectorAll('*')
    const elbody = document.body
    elbody.classList.toggle("darkmode")
    /*    elAll.forEach(element => {
           element.classList.toggle("invert")
       }); */
    elBtn.classList.toggle("darkmode")
    elBtn.innerText = elBtn.innerText === NIGHT ? DAY : NIGHT
    gGame.darkmode = !gGame.darkmode
    renderBoard(gBoard)
}

//* create custom board
function onCustomBoard() {
    if (!gGame.isOn) {
        gGame.customMode = !gGame.customMode
        if (!gGame.customMode) onInit()
        const elCustomCount = document.querySelector('.custom-count')
        elCustomCount.innerText = gLevel.MINES
        gCustomMinesCount = gLevel.MINES

        const elCustom = document.querySelector('.custom')
        const elCounts = document.querySelector('.counts')

        elCustom.classList.toggle("hidden")
        elCounts.classList.toggle("hidden")

    }
    else
        alert("cant create a custom mode during game")
}

function addCustomMine(board, rowIdx, colIdx) {
    if (board[rowIdx][colIdx].isMine) return
    board[rowIdx][colIdx].isMine = true;
    board[rowIdx][colIdx].isShown = true;

    renderBoard(board)

    const elCustomCount = document.querySelector('.custom-count')
    elCustomCount.innerHTML = --gCustomMinesCount
    if (gCustomMinesCount === 0) {
        const elCustom = document.querySelector('.custom')
        const elCounts = document.querySelector('.counts')

        elCustom.classList.toggle("hidden")
        elCounts.classList.toggle("hidden")
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
function onMegaHint() {
    if (gGame.isOn) {
        gGame.megaHint = true;
    }
}

function megaHint(board, elCell, rowIdx, colIdx) {
    console.log("hi")
    gMegaHintPoss.push({ i: rowIdx, j: colIdx })
    elCell.classList.add("mega-hint")

    if (gMegaHintPoss.length === 2) {
        const topLeftPos = gMegaHintPoss[0]
        const bottomRightPos = gMegaHintPoss[1]


        var copyBoard = copyMat(board)

        for (var i = topLeftPos.i; i <= bottomRightPos.i; i++) {
            for (var j = topLeftPos.j; j <= bottomRightPos.j; j++) {
                copyBoard[i][j].isShown = true
            }
        }

        renderBoard(copyBoard)

        setTimeout(() => {
            gGame.megaHint = false;
            renderBoard(board)
            const elMegaHintButton = document.querySelector('.mega-hint-button')
            elMegaHintButton.classList.add("hidden")
            gMegaHintPoss = []
        }, 2000);

    }
}

//*remove three random bombs from the board
//*doesnt work on easy level

function onExterminator(elBtn) {
    if (!gGame.isOn) return
    if (gLevel.LEVEL === "beginner") return
    var minePoss = []

    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {

            if (gBoard[i][j].isMine)
                minePoss.push({ i, j })
        }
    }
    gSaveMoves.push(copyMat(gBoard))
    for (var i = 0; i < 3; i++) {
        const randIdx = getRandomInt(0, minePoss.length)
        const randPos = minePoss.splice(randIdx, 1)[0]
        gBoard[randPos.i][randPos.j].isMine = false
        if (gBoard[randPos.i][randPos.j].isMark) {
            gBoard[randPos.i][randPos.j].isMark = false;
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
    elBtn.classList.add("hidden")

}