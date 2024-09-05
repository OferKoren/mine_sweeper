const HINT_ON = "img/hintOn.png"
const HINT_OFF = "img/hintOff.png"
var gScoreboard = {
    beginner: [],
    medium: [],
    expert: []
}
var gSaveMoves = []

function onToggleHint(elHint) {

    console.log('elHint:', elHint);
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

function getHint(board, colIdx, rowIdx) {
    var copyBoard = copyMat(board)
    console.log(copyBoard[3][3])
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (j < 0 || j > board[0].length - 1) continue
            copyBoard[i][j].isShown = true
        }
    }
    console.log(copyBoard[3][3])
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

        strHTML += `<td>${lvlScoreboard[i].name}</td>`
        strHTML += `<td>${lvlScoreboard[i].time}</td>`


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
    }, 300);
}

function onUndo() {
    if (!gSaveMoves) return
    gSaveMoves.pop()
    gBoard = gSaveMoves.pop()
    renderBoard(gBoard)
}



