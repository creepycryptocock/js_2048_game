'use strict';

/**
 * This class represents the game.
 * Now it has a basic structure, that is needed for testing.
 * Feel free to add more props and methods if needed.
 */
class Game {
  constructor(
    initialState = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
  ) {
    this.initialState = initialState;
    this.board = initialState.map((row) => [...row]);
    this.score = 0;
    this.status = '';
  }

  moveLeft() {
    if (!this.canMoveLeft()) {
      return;
    }

    const board = this.board;

    for (let row = 0; row < board.length; row++) {
      const nonZeroRow = board[row].filter((el) => el !== 0);

      const newRow = [];

      for (let i = 0; i < nonZeroRow.length; i++) {
        if (nonZeroRow[i] === nonZeroRow[i + 1]) {
          const merged = nonZeroRow[i] + nonZeroRow[i + 1];

          newRow.push(merged);
          this.score += merged;
          i++;
        } else {
          newRow.push(nonZeroRow[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      board[row] = newRow;
    }

    this.addRandomTile();
  }

  moveRight() {
    if (!this.canMoveRight()) {
      return;
    }

    const board = this.board;

    for (let row = 0; row < board.length; row++) {
      const nonZeroRow = board[row].filter((el) => el !== 0);

      const newRow = [];

      for (let i = nonZeroRow.length - 1; i >= 0; i--) {
        if (nonZeroRow[i] === nonZeroRow[i - 1]) {
          const merged = nonZeroRow[i] + nonZeroRow[i - 1];

          newRow.push(merged);
          this.score += merged;
          i--;
        } else {
          newRow.push(nonZeroRow[i]);
        }
      }

      while (newRow.length < 4) {
        newRow.push(0);
      }

      newRow.reverse();
      board[row] = newRow;
    }
    this.addRandomTile();
  }

  moveUp() {
    if (!this.canMoveUp()) {
      return;
    }

    const board = this.board;
    const columns = [[], [], [], []];

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        columns[col].push(board[row][col]);
      }
    }

    for (let col = 0; col < 4; col++) {
      const nonZero = columns[col].filter((n) => n !== 0);
      const newCol = [];

      for (let i = 0; i < nonZero.length; i++) {
        if (nonZero[i] === nonZero[i + 1]) {
          const merged = nonZero[i] + nonZero[i + 1];

          newCol.push(merged);
          this.score += merged;
          i++;
        } else {
          newCol.push(nonZero[i]);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      for (let row = 0; row < 4; row++) {
        board[row][col] = newCol[row];
      }
    }

    this.addRandomTile();
  }

  moveDown() {
    if (!this.canMoveDown()) {
      return;
    }

    const board = this.board;
    const columns = [[], [], [], []];

    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        columns[col].push(board[row][col]);
      }
    }

    for (let col = 0; col < 4; col++) {
      const nonZero = columns[col].filter((n) => n !== 0);
      const newCol = [];

      for (let i = nonZero.length - 1; i > 0; i--) {
        if (nonZero[i] === nonZero[i - 1]) {
          const merged = nonZero[i] + nonZero[i - 1];

          newCol.push(merged);
          this.score += merged;
          i--;
        } else {
          newCol.push(nonZero[i]);
        }
      }

      while (newCol.length < 4) {
        newCol.push(0);
      }

      newCol.reverse();

      for (let row = 0; row < 4; row++) {
        board[row][col] = newCol[row];
      }
    }

    this.addRandomTile();
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  getStatus() {
    if (
      !this.canMoveDown() &&
      !this.canMoveUp() &&
      !this.canMoveLeft() &&
      !this.canMoveRight()
    ) {
      return 'lose';
    }

    if (this.score >= 2048) {
      return 'win';
    }

    if (this.isTheSame(this.board, this.initialState)) {
      return 'idle';
    }

    return 'playing';
  }

  start() {
    this.score = 0;
    this.board = this.initialState.map((row) => [...row]);
    this.status = 'playing';

    this.addRandomTile();
    this.addRandomTile();
  }

  restart() {}

  // HELPERS
  addRandomTile() {
    const emptyCells = this.findEmpty();

    if (emptyCells.length > 0) {
      const random = Math.floor(Math.random() * emptyCells.length);
      const probability = Math.random();
      let tile;

      if (probability <= 0.1) {
        tile = 4;
      } else {
        tile = 2;
      }

      const [row, column] = emptyCells[random];

      this.board[row][column] = tile;
    }
  }

  findEmpty() {
    const emptyCells = [];
    const board = this.board;

    for (let row = 0; row < board.length; row++) {
      for (let column = 0; column < board[row].length; column++) {
        const cell = board[row][column];

        if (cell === 0) {
          emptyCells.push([row, column]);
        }
      }
    }

    return emptyCells;
  }

  canMoveLeft() {
    for (let row = 0; row < 4; row++) {
      for (let col = 1; col < 4; col++) {
        if (this.board[row][col] !== 0) {
          if (
            this.board[row][col - 1] === 0 ||
            this.board[row][col - 1] === this.board[row][col]
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  canMoveRight() {
    for (let row = 0; row < 4; row++) {
      for (let col = 2; col >= 0; col--) {
        if (this.board[row][col] !== 0) {
          if (
            this.board[row][col + 1] === 0 ||
            this.board[row][col + 1] === this.board[row][col]
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  canMoveUp() {
    for (let row = 1; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = this.board[row][col];

        if (cell !== 0) {
          if (
            this.board[row - 1][col] === 0 ||
            this.board[row - 1][col] === cell
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  canMoveDown() {
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const cell = this.board[row][col];

        if (cell !== 0) {
          if (
            this.board[row + 1][col] === 0 ||
            this.board[row + 1][col] === cell
          ) {
            return true;
          }
        }
      }
    }

    return false;
  }

  isTheSame(boardOne, boardTwo) {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const cellOne = boardOne[row][col];
        const cellTwo = boardTwo[row][col];

        if (cellOne !== cellTwo) {
          return false;
        }
      }
    }

    return true;
  }

  handler(e) {
    switch (e.key) {
      case 'ArrowLeft':
        this.moveLeft();
        break;

      case 'ArrowRight':
        this.moveRight();
        break;

      case 'ArrowUp':
        this.moveUp();
        break;

      case 'ArrowDown':
        this.moveDown();
        break;
    }
  }
}

module.exports = Game;
