'use strict'

var gBoard;
var gLevel;
var gGame;
var gIdIntevalTimer;
var gIsGameOn = true;
var gTotalSeconds = 0; 


function initGame() {
    gBoard = buildBoard();
    addMines(gBoard)
    renderBoard(gBoard);
}

function buildBoard() {
    var board = createMat(4, 4);
    for (var i = 0; i < board.length; i++) {
        for (var j = 0; j < board[0].length; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
            board[i][j] = cell;
        }
    }
    return board;
}

function renderBoard(board) {
    var strHTML = '';
    for (var i = 0; i < board.length; i++) {
        strHTML += '<tr>'
        for (var j = 0; j < board[0].length; j++) {
            var cell = board[i][j];
            var className = (cell.isMine) ? 'mine' : '';
            // var elTdInnerTxt = setMinesNegsCount(board, i, j);
            strHTML += `<td class="${className}" data-i="${i}" data-j="${j}" 
            onclick="cellClicked(this , ${i}, ${j})"></td>`
        }
        strHTML += '</tr>'
    }
    // console.log('strHTML', strHTML)
    var elBoard = document.querySelector('.board');
    elBoard.innerHTML = strHTML;
}

function cellClicked(elCell, i, j) {
    var value = setMinesNegsCount(gBoard, i, j);
    elCell.innerHTML = value;
    console.log(gBoard);
    if (gIsGameOn) gIdIntevalTimer = setInterval(countTimer, 1000);    
}

function setMinesNegsCount(mat, cellI, cellJ) {
    var strHTML = '';
    for (var i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= mat.length) continue;
        for (var j = cellJ - 1; j <= cellJ + 1; j++) {
            if (j < 0 || j >= mat[i].length) continue;
            if (i === cellI && j === cellJ) continue;
            var cell = mat[i][j];
            // console.log('cell', cell);
            if (cell.isMine) {
                mat[cellI][cellJ].minesAroundCount++;
            }
            if (mat[cellI][cellJ].isMine) {
                strHTML = 'MINE';
            } else {
                strHTML = mat[cellI][cellJ].minesAroundCount;
            }
        }
    }
    return strHTML;
}

function addMines(board) {
    for (var i = 0; i < 2; i++) {
        var mineCoord = createMine(board);
        board[mineCoord.i][mineCoord.j].isMine = true;
    }
}

function createMine(mat) {
    var randIdx = getRandomIntexclusive(0, mat.length);
    var randJdx = getRandomIntexclusive(0, mat[0].length);
    var randCoord = { i: randIdx, j: randJdx };
    return randCoord;
}

function countTimer() {
    ++gTotalSeconds;
    var hour = Math.floor(gTotalSeconds / 3600);
    var minute = Math.floor((gTotalSeconds - hour * 3600) / 60);
    var seconds = gTotalSeconds - (hour * 3600 + minute * 60);
    if (hour < 10)
        hour = "0" + hour;
    if (minute < 10)
        minute = "0" + minute;
    if (seconds < 10)
        seconds = "0" + seconds;

    var elTimer = document.querySelector('.time');
    elTimer.innerHTML = hour + " : " + minute + " : " + seconds;
}


cellMarked();

function cellMarked() {
 document.addEventListener('contextmenu', event => event.preventDefault());
}



function endGame() {
    gIsGameOn = false;
    clearInterval(gIdIntevalTimer);
}
