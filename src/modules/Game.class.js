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
    const board = this.board;
    const copy = this.makeCopy(board);

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

    let hasChanged = false;

    for (let row = 0; row < board.length; row++) {
      if (hasChanged) {
        break;
      }

      for (let column = 0; column < board.length; column++) {
        if (board[row][column] !== copy[row][column]) {
          hasChanged = true;
          this.addRandomTile();
          break;
        }
      }
    }
  }

  moveRight() {
    const board = this.board;
    const copy = this.makeCopy(board);

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

    let hasChanged = false;

    for (let row = 0; row < board.length; row++) {
      if (hasChanged) {
        break;
      }

      for (let column = 0; column < board.length; column++) {
        if (board[row][column] !== copy[row][column]) {
          hasChanged = true;
          this.addRandomTile();
          break;
        }
      }
    }
  }

  moveUp() {
    const board = this.board;
    const copy = this.makeCopy(board);
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

    let hasChanged = false;

    for (let row = 0; row < board.length; row++) {
      if (hasChanged) {
        break;
      }

      for (let column = 0; column < board.length; column++) {
        if (board[row][column] !== copy[row][column]) {
          hasChanged = true;
          this.addRandomTile();
          break;
        }
      }
    }
  }

  moveDown() {
    const board = this.board;
    const copy = this.makeCopy(board);
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

    let hasChanged = false;

    for (let row = 0; row < board.length; row++) {
      if (hasChanged) {
        break;
      }

      for (let column = 0; column < board.length; column++) {
        if (board[row][column] !== copy[row][column]) {
          hasChanged = true;
          this.addRandomTile();
          break;
        }
      }
    }
  }

  getScore() {
    return this.score;
  }

  getState() {
    return this.board;
  }

  /**
   * Returns the current game status.
   *
   * @returns {string} One of: 'idle', 'playing', 'win', 'lose'
   *
   * `idle` - the game has not started yet (the initial state);
   * `playing` - the game is in progress;
   * `win` - the game is won;
   * `lose` - the game is lost
   */
  getStatus() {}

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

  makeCopy(original) {
    return original.map((e) => [...e]);
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
