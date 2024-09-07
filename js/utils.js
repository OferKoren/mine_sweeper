
'use strict'
const SAFE = '🔦'
const EXTER = '👽'
const MEGA_HINT = '💡💡'

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

function hideCustomModal() {
    const elModal = document.querySelector('.custom-modal')
    elModal.classList.add("used")


}

function showCustomModal() {
    console.log("hi")
    renderCustomValues()
    const elModal = document.querySelector('.custom-modal')
    elModal.classList.remove("used")
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

function buttonClickedToggle(elBtn) {
    const elButtons = document.querySelectorAll('.buttons button')
    elButtons.forEach(button => {
        if (button === elBtn) {
            elBtn.classList.toggle("button-on")

        }
        else
            button.classList.remove("button-on")
    });
}

function highlightCurrLvL() {

    const elLvls = document.querySelectorAll('.lvl-buttons button')
    elLvls.forEach(button => {
        if (button.classList.contains(gLevel.LEVEL)) {
            button.classList.add("button-on")

        }
        else
            button.classList.remove("button-on")

    });
}

function onRandom(elBtn) {
    elBtn.classList.toggle("not")
    if (elBtn.classList.contains("not")) {
        elBtn.innerText = 'Not Random'
    }
    else {
        elBtn.innerText = 'Random'
    }
}

function showCounts() {
    const elCounts = document.querySelector('.counts')
    const elCostum = document.querySelector('div.custom')

    elCostum.classList.add("hidden")
    elCounts.classList.remove("hidden")

}

function showMineCount() {
    const elCounts = document.querySelector('.counts')
    const elCostum = document.querySelector('div.custom')

    elCostum.classList.remove("hidden")
    elCounts.classList.add("hidden")
}

function onHoverInfo(elbtn) {
    const elP = document.querySelector('.info-modal p')
    if (elbtn.innerText === SAFE) {
        if (gGame.isOn) {
            elP.innerText = `-when clicked  show you a random safe spot-`
        }
        else {
            elP.innerText = 'cant use safe click when game is not on'
        }
    }
    else if (elbtn.innerText === MEGA_HINT) {
        if (gGame.isOn) {
            elP.innerText = `-press on two cells to see the area between them-\n One-Time-Use`
        }
        else {
            elP.innerText = 'cant use mega hint when game is not on'
        }
    }
    else if (elbtn.innerText === EXTER) {
        if (gGame.isOn) {
            elP.innerText = `-Remove 3 random bombs from the board-`
        }
        else {
            elP.innerText = 'cant use the exterminator when game is not on'
        }
    }
    else if (elbtn.classList.contains("hint")) {
        if (gGame.isOn) {
            elP.innerText = `click on a cell \nyou will see whats hidden in it and its neighbors`
        }
        else {
            elP.innerText = `can't use hint when game is not on`
        }
    }

}

function onMouseOut() {
    const elP = document.querySelector('.info-modal p')
    elP.innerText = ''
}