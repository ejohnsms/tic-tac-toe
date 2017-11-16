// 1) draw a tick-tick-tack-toe board on the screen, how you do the actual drawing is up to you.
// 2) the screen needs to be interactive, the user has to be able to click and play a turn.
// - board
// -- handle click event
// --- select all of the cells
// --- for each cell wire up click handler and remove when game is done
// -- store what was clicked:
// the event.target.parent has a class that has the row
// the cells could have a class for the column
// -- draw x or o
// --- set the hover state for an active game
// --- don't allow a mark to be overwritten
// -- detect when game is done
// --- the game is done when there are no more squares or one player has
//      three in a row
// --- three in a row: column, row, diagnal
// - players
// -- player is manual or automatic
// 3) The opponent should be the app. After the user plays it's turn the app should play the next turn.
//    The app doesn't need to be smart about how to play, picking an open position at random is OK.
// 4) the app should detect when the game is done or tied an call the winner.

class Player {
  constructor(name, isComputer = true) {
    this.name = name;
    this.isComputer = isComputer;
    this.mark = '';
  }
}

class Board {
  constructor() {
    this._board = [
        ['','',''],
        ['','',''],
        ['','','']
    ];

    this._threeMarks = '^\[xX]{3}|[oO]{3}$';
    this._markedCells = 0;
    this._maxCells = 9;
  }

  updateBoard(row, col, el, player) {
    if (this._board[row][col] === '') {
      this._board[row][col] = player.mark;
      this._markedCells += 1;
      el.innerText = player.mark;
    }
  }

  checkTheBoard() {
    const gameStatus = {
           done: false,
           winner: false
          };

    if (this.hasRow() || this.hasColumn() || this.hasDiagnal()) {
      gameStatus.done = true;
      gameStatus.winner = true;

      return gameStatus;
    }

    if (this._markedCells === this._maxCells) {
      gameStatus.done = true;
      gameStatus.winner = false;

      return gameStatus;
    }

    return gameStatus;
  }

  getElementFrom(row, col) {
    const parent = document.querySelector("[data-row=" + CSS.escape(row) + "]");
    const el = parent.querySelector("[data-col=" + CSS.escape(col) + "]");

    return el;
  }

  getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
  }

  isEmpty(obj) {
     for(let key of Object.keys(obj)){
       if (key) {
         return false;
       }
     }

     return true;
  }

  getCell() {
    let openCell = this.getMiddleCell();
    let findCells = [this.getFirstOpenCell, this.getRandomCell];

    if (this.isEmpty(openCell)) {
      let stratedgy = findCells[this.getRandomIntInclusive(0,1)].bind(this);
      openCell = stratedgy();

      if (this.isEmpty(openCell)) {
        openCell = this.getFirstOpenCell();
      }
    }

    return openCell;
  }

  getFirstOpenCell() {
    const openCell = {};

    findspot: for(let row = 0; row < 3; row += 1){
      for (let col = 0; col < 3; col += 1) {
        if (this._board[row][col] === '') {
          openCell.row = row;
          openCell.col = col;

          openCell.el = this.getElementFrom(row, col);
          break findspot;
        }
      }
    }

    return openCell;
  }

  getMiddleCell() {
    const openCell = {};

    if (this._board[1][1] === '') {
      openCell.row = 1;
      openCell.col = 1;
      openCell.el = this.getElementFrom(1, 1);
    }
    return openCell;
  }

  getRandomCell() {
    const openCell = {};
    const row = this.getRandomIntInclusive(0,2);
    const col = this.getRandomIntInclusive(0,2);

    if (this._board[row][col] === '') {
      openCell.row = row;
      openCell.col = col;
      openCell.el = this.getElementFrom(row, col);
    }
    return openCell;
  }

  hasDiagnal() {
    let hasDiagnal = false;



    if ((Array.prototype.concat(this._board[0][0], this._board[1][1], this._board[2][2]).join('').match(this._threeMarks)) ||
    (Array.prototype.concat(this._board[0][2], this._board[1][1], this._board[2][0]).join('').match(this._threeMarks))) {
      hasDiagnal = true;
    }

    return hasDiagnal;
  }

  hasRow() {
    let hasRow = false;

    for (let i = 0; i< 3; i++) {
      if (this._board[i].join('').match(this._threeMarks)) {
        hasRow = true;
        break;
      }
    }
    return hasRow;
  }

  hasColumn() {
    let hasColumn = false;

    if ((Array.prototype.concat(this._board[0][0], this._board[1][0], this._board[2][0]).join('').match(this._threeMarks)) ||
    (Array.prototype.concat(this._board[0][1], this._board[1][1], this._board[2][1]).join('').match(this._threeMarks)) ||
    (Array.prototype.concat(this._board[0][2], this._board[1][2], this._board[2][2]).join('').match(this._threeMarks))) {
      hasColumn = true;
    }

    return hasColumn;
  }


}

class Game {
  constructor() {
    this.msgs = document.getElementById('messages');
    this.clickHandler = this.clickHandler.bind(this);

    this._cells = document.getElementsByClassName('col');
    this._display = document.getElementsByClassName('board')[0];
    this._players = [];
    this._currentPlayer = null;
  }

  nextPlayer() {
    if (this._currentPlayer === null) {
      this._currentPlayer = this._players[0];
    } else {
      this._currentPlayer = this._currentPlayer === this._players[0] ? this._players[1] : this._players[0];
    }
    this.addMessage(`Player ${this._currentPlayer.name} goes.`);

    if (this._currentPlayer.isComputer) {
      const openCell = this._board.getCell();
      this.playerMoves(openCell.row, openCell.col, openCell.el, this._currentPlayer);
    }
  }

  clickHandler(event) {
    const row = parseInt(event.target.parentElement.dataset.row);
    const col = parseInt(event.target.dataset.col);

    this.playerMoves(row, col, event.target, this._currentPlayer);
  }

  playerMoves(row, col, el, player) {
    this._board.updateBoard(row, col, el, this._currentPlayer);

    const status = this._board.checkTheBoard();

    if (!status.done && !status.winner) {
      this.nextPlayer();
    } else if (status.done && !status.winner) {
      this.addMessage(`Game over no one wins`);
      this.stopPlay();
    } else if (status.done && status.winner) {
      this.addMessage(`Player ${this._currentPlayer.name}, wins the game.`);
      this.stopPlay();
    }

  }

  addMessage(msg) {
    const li = document.createElement('li');
    li.innerText = msg;
    this.msgs.appendChild(li);
  }

  stopPlay() {
    for (let cell of this._cells) {
        cell.removeEventListener('click', this.clickHandler, false);
    }

    this._display.classList.remove('active');
  }

  addPlayer(player) {
    this._players.push(player);
  }

  init() {
    this._display.classList.add('active');
    for (let cell of this._cells) {
        cell.addEventListener('click', this.clickHandler, false);
    }

    this._board = new Board();
  }

  start() {
    this._players[0].mark = 'X';
    this._players[1].mark = 'O';

    this.nextPlayer();
  }
}

document.addEventListener("DOMContentLoaded", function(event) {
  const tic = new Game();

  const startButton = document.querySelector('.start-game');
  const addPlayerButton = document.querySelector('[name="add-player"]');
  const playerList = document.querySelector('.player-list');
  let playerCount = 0;

  const addPlayerClick = (event) => {

    let isComputer = document.querySelector('#player-type');
    let playerName = document.querySelector('[name="player-name"]');
    let player = new Player(playerName.value, isComputer.checked);

    tic.addPlayer(player);
    playerCount += 1;

    let li = document.createElement('li');
    li.innerText = playerName.value;
    playerList.appendChild(li);

    playerName.value = '';
    isComputer.checked = false;

    if (playerCount === 2) {
      const userInput = document.querySelector('.add-player');
      userInput.hidden = true;
    }
  }

  const startGameClick = (event) => {
    tic.init();
    tic.start();
  }

  startButton.addEventListener('click', startGameClick, false);
  addPlayerButton.addEventListener('click', addPlayerClick, false);

});
