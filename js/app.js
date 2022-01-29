'use strict'

const MINE = '🧨'
const FLAG = '🚩'
const NORMAL = '😋'
const SAD = '😭'
const WIN = '😎'

var gBoard;
var gIdTimeInterval;
var gTotalSeconds = 0;
var gIsGameON = false;
var gIsclicked = true;
var gLives = 3;

var gSize = 0;
var gMines = 0;

function initGame() {
	gBoard = buildBoard();
	renderBoard(gBoard);
	setMinesNegsCount(gBoard);
}

function gameLevel(elCell) {
	if (elCell.innerHTML === 'Beginner') {
		gSize = 4;
		gMines = 2;

	} else if (elCell.innerHTML === 'Medium') {
		gSize = 8;
		gMines = 12;
	} else if (elCell.innerHTML === 'Expert') {
		gSize = 12;
		gMines = 30;
	}
	initGame();
}


function buildBoard() {
	var board = [];
	for (var i = 0; i < gSize; i++) {
		board[i] = [];
		for (var j = 0; j < gSize; j++) {
			var cell = {
				minesAroundCount: 0,
				isShown: false,
				isMine: false,
				isMarked: false,
			}
			board[i][j] = cell;
		}

	}

	addMines(board, gMines);

	return board
}


function renderBoard(board) {
	var strHtml = '';
	for (var i = 0; i < board.length; i++) {
		var row = board[i];
		strHtml += '<tr>';
		for (var j = 0; j < row.length; j++) {
			var cell = row[j];
			var isMineCell = cell.isMine;
			strHtml += `<td class="${isMineCell}"
            data-i="${i}" data-j="${j}" onContextMenu="cellMarked(this , ${i}, ${j})"
            onclick="cellClicked(this , ${i}, ${j})"></td>`
		}
		strHtml += '</tr>';
	}
	var elMat = document.querySelector('.board');
	elMat.innerHTML = strHtml;
}


function setMinesNegsCount(board) {
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var numOfMineNegs = minesNegsCount(board, i, j);
			board[i][j].minesAroundCount = numOfMineNegs;
		}
	}
	return board;
}

function minesNegsCount(mat, cellI, cellJ) {
	var mineNegsCount = 0;
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= mat.length) continue;
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (j < 0 || j >= mat[i].length) continue;
			if (i === cellI && j === cellJ) continue;
			if (mat[i][j].isMine) mineNegsCount++;
		}
	}
	return mineNegsCount;
}

function addMines(board, minesCount) {
	for (var i = 0; i < minesCount; i++) {
		var mineCoord = createMine(board);
		if (board[mineCoord.i][mineCoord.j].isMine) minesCount++
		else board[mineCoord.i][mineCoord.j].isMine = true;
	}
}

function createMine(mat) {
	var randIdx = getRandomIntexclusive(0, mat.length);
	var randJdx = getRandomIntexclusive(0, mat[0].length);
	var randCoord = { i: randIdx, j: randJdx };
	return randCoord;
}

function startTimer() {
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
	document.getElementById("time").innerHTML = hour + " : " + minute + " : " + seconds;
}

function cellClicked(elCell, cellI, cellJ) {
	changeSmile(NORMAL);
	var currCell = gBoard[cellI][cellJ];
	if (currCell.isShown) return
	if (!gIsclicked) return
	if (!gIsGameON) {
		gIsGameON = true;
		gIdTimeInterval = setInterval(startTimer, 1000);
	}
	if (currCell.isMarked) return;
	if (currCell.isMine) {
		changeSmile(SAD);
		if (gLives > 1) {
			gLives--
			var elLives = document.querySelector('h3');
			elLives.innerHTML = 'Lives: ' + (gLives);
			return;
		} else {
			gLives--
			var elLives = document.querySelector('h3');
			elLives.innerHTML = 'Lives: ' + (gLives);
			gIsclicked = false;
			//update the model:
			gBoard[cellI][cellJ].isShown = true;
			//update the dom:      
			var mines = document.querySelectorAll("[class='true']");
			for (var i = 0; i < mines.length; i++) {
				mines[i].innerHTML = MINE;
			}
			gameOver();
		}
	} else if (currCell.minesAroundCount > 0) {
		changeSmile(NORMAL)
		//update the model:
		gBoard[cellI][cellJ].isShown = true;
		//update the dom:
		elCell.classList.add('showNumber');
		elCell.innerHTML = currCell.minesAroundCount;

	} else {
		changeSmile(NORMAL)
		expandShown(gBoard, cellI, cellJ);
	}

	checkVictory(gBoard);
}

function cellMarked(elCell, cellI, cellJ) {
	document.addEventListener('contextmenu', event => event.preventDefault());
	if (!gIsclicked) return
	if (!gIsGameON) {
		gIdTimeInterval = setInterval(startTimer, 1000);
		gIsGameON = true;
	}

	if (!gBoard[cellI][cellJ].isShown && !gBoard[cellI][cellJ].isMarked) {
		//update the model 
		gBoard[cellI][cellJ].isMarked = true;
		//update the dom:
		elCell.innerHTML = FLAG;
	} else if (gBoard[cellI][cellJ].isMarked) {
		//update the model 
		gBoard[cellI][cellJ].isMarked = false;
		//update the dom:
		elCell.innerHTML = '';
	}

	checkVictory(gBoard);
}

function checkVictory(board) {
	var check = [];
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var cell = board[i][j];
			if ((cell.isMine && cell.isMarked) || (!cell.isMine && cell.isShown)) {
				check.push(cell);
			}
		}
	}

	if (check.length === board.length * board.length) {
		clearInterval(gIdTimeInterval);
		winGame(board);
	}

}

function winGame(mat) {
	console.log(mat);
	var elModal = document.querySelector('.modal');
	elModal.innerHTML = 'You win! Press restart to play again';
	var elSmile = document.querySelector('.smile');
	elSmile.innerHTML = WIN;

}

function renderCell(cellI, cellJ, innerText, className) {
	var elCell = document.querySelector(`[data-i="${cellI}"][data-j="${cellJ}"]`);
	if (innerText === 'EMPTY') {
		elCell.innerHTML = ''
	} else {
		elCell.innerHTML = innerText;
	}
	elCell.classList.add(className);
}

function expandShown(board, cellI, cellJ) {
	for (var i = cellI - 1; i <= cellI + 1; i++) {
		if (i < 0 || i >= board.length) continue;
		for (var j = cellJ - 1; j <= cellJ + 1; j++) {
			if (j < 0 || j >= board[i].length) continue;
			//update the model
			board[i][j].isShown = true;
			if (board[i][j].minesAroundCount > 0) {
				//update the dom
				renderCell(i, j, board[i][j].minesAroundCount, 'showNumber');
			} else {
				renderCell(i, j, 'EMPTY', 'showEmpty');
			}
		}
	}
}

function gameOver() {
	clearInterval(gIdTimeInterval);
	var elModal = document.querySelector('.modal')
	elModal.innerHTML = 'Game Over! Press restart to play again'
	var elSmile = document.querySelector('.smile');
	elSmile.innerHTML = SAD;

}

function restart() {
	clearInterval(gIdTimeInterval);
	gTotalSeconds = 0;
	document.getElementById("time").innerHTML = '00 : 00 : 00'
	var elModal = document.querySelector('.modal')
	elModal.innerHTML = '';
	var elSmile = document.querySelector('.smile');
	elSmile.innerHTML = NORMAL;
	gLives = 3;
	var elLives = document.querySelector('h3');
	elLives.innerHTML = 'Lives: ' + (gLives);
	gSize = 0;
	gMines = 0;
	gIsclicked = true;
	gIsGameON = false;
	initGame();
}

function changeSmile(smile) {
	var elSmile = document.querySelector('.smile');
	elSmile.innerHTML = smile;
}



