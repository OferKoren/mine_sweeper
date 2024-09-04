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