
'use strict'
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomInt(min, max) {
    const minCeiled = Math.ceil(min);
    const maxFloored = Math.floor(max);
    return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

function onToggleHide() {
    const elHidden = document.querySelectorAll('.board-table td')
    elHidden.forEach(element => {
        element.classList.toggle("hidden")
    });
}

function toggleModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.toggle("hidden")
}

function hideModal() {
    const elModal = document.querySelector('.modal')
    const elWin = document.querySelector('.win')
    const elLose = document.querySelector('.lose')

    elModal.classList.add("hidden")
    elWin.classList.add("hidden")
    elLose.classList.add("hidden")
}

function showModal() {
    const elModal = document.querySelector('.modal')
    elModal.classList.remove("hidden")
}

function copyMat(board) {
    var copy = []
    for (var i = 0; i < board.length; i++) {
        copy[i] = []
        for (var j = 0; j < board[0].length; j++) {
            copy[i][j] = { ...board[i][j] }
        }
    }
    return copy
}

function GenericNegsLoop(rowIdx, colIdx) {
    for (var i = rowIdx - 1; i <= rowIdx + 1; i++) {
        if (i < 0 || i > board.length - 1) continue
        for (var j = colIdx - 1; j <= colIdx + 1; j++) {
            if (i === rowIdx && j === colIdx) continue
            if (j < 0 || j > board[0].length - 1) continue
            if (board[i][j].isMine) return
        }
    }
}

function getEmptyPos(board) {
    var emptyPoss = []
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            if (!board[i][j].isMine && !board[i][j].isShown) {
                emptyPoss.push({ i, j })
            }
        }
    }
    var randIdx = getRandomInt(0, emptyPoss.length)
    return emptyPoss[randIdx]
}