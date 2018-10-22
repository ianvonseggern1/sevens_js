export default class Model {
  // Numbered pieces are simply int's representing themselves. These constants
  // are the other two pieces
  static GRAY_PIECE = "GRAY";
  static DOUBLE_GRAY_PIECE = "DOUBLE_GRAY";

  static SIZE = 7;
  static PIECES_PER_ROUND = 5;

  static PIECES_TO_START = 20;

  static CHAIN_MULTIPLIERS = [
    7, 39, 109, 224, 391, 617, 907, 1267, 1701, 2213,
    2809, 3491, 4265, 5133, 6099, 7168, 8341, 9622
  ];

  constructor() {
  }

  setup() {
    this.nextPiece = this.getNextPiece();
    this.piecesLeftInRound = Model.PIECES_PER_ROUND;

    // board[column][row] -> not the typical indexing, but it makes things
    // easier since pieces are dropped down columns
    this.board = [];
    for (var i = 0; i < Model.SIZE; i += 1) {
      let column = new Array(Model.SIZE).fill(null);
      this.board.push(column);
    }

    for (var i = 0; i < Model.PIECES_TO_START; i += 1) {
      let column = Math.floor(Math.random() * Model.SIZE);
      this.performFullRound(column, false);
    }

    this.score = 0;
  }

  copy() {
    var newModel = new Model();

    newModel.score = this.score;
    newModel.piecesLeftInRound = this.piecesLeftInRound;
    newModel.nextPiece = this.nextPiece;
    newModel.board = this.board.map((column) => column.map((piece) => piece));

    return newModel;
  }

  popCount(popMask) {
    return popMask.reduce(
      (accum1, column) => accum1 + column.reduce(
        (accum2, value) => accum2 + (value ? 1 : 0), 0),
        0
    );
  }

  // TODO take care of case where you lose by filling the whole board
  // I think I need to fix the ability to place things on a full column actually
  // entirely
  performFullRound(column, decrementPieceCount=true) {
    this.dropNextPiece(column);
    var popMask = this.getToPopMask();
    while (this.popCount(popMask) > 0) {
       this.performDecrementGrays(popMask);
       this.performPops(popMask);
       popMask = this.getToPopMask();
    }

    if (decrementPieceCount) {
      let notLost = this.decrementPieceCount();
      if (!notLost) {
        return false;
      }
      popMask = this.getToPopMask();
      while (this.popCount(popMask) > 0) {
         this.performDecrementGrays(popMask);
         this.performPops(popMask);
         popMask = this.getToPopMask();
      }
    }
    return true;
  }

  // Used for both the next piece after dropping one, and when a gray becomes
  // a numbered piece
  getNextPiece() {
    return Math.floor(Math.random() * Model.SIZE) + 1;
  }

  // Returns false if the column is full
  dropNextPiece(column) {
    let row = this.board[column].indexOf(null);
    if (row === -1) {
      return false;
    }
    this.board[column][row] = this.nextPiece;
    this.nextPiece = this.getNextPiece();

    this.chainIndex = 0;
    return true;
  }

  // The rule of drop 7 is the any piece whos value matches the total number
  // of pieces in that column or the total number of pieces adjacent in the row
  // is 'popped'
  // Returns an 2d SIZE x SIZE array of bools. true indicates the piece should
  // be popped
  getToPopMask() {
    return this.board.map((column, pieceColumn) => {
      let columnCount = column.indexOf(null);
      columnCount = (columnCount === -1) ? Model.SIZE : columnCount;

      return column.map((piece, pieceRow) => {
        var rowCount = 1;
        var column = pieceColumn + 1;
        while (column < Model.SIZE && this.board[column][pieceRow] !== null) {
          rowCount += 1;
          column += 1;
        }
        column = pieceColumn - 1;
        while (column >= 0 && this.board[column][pieceRow] !== null) {
          rowCount += 1;
          column -= 1;
        }

        return ((rowCount === piece) || (columnCount === piece));
      });
    });
  }

  // For a given popMask this returns how far each piece will end up falling
  // during the perform pop. This utility allows animation of that process,
  // it isn't required for simulations which can simply call the performPop
  // method
  // NOTE: for simplicity this mask shows how far a piece would fall if there
  // were a piece in that square. It doesn't mean there is a piece there however
  getDistanceToDropMask(popMask) {
    return this.board.map((column, columnIndex) => {
      let totalPopsInCol = 0;
      return column.map((piece, rowIndex) => {
        if (popMask[columnIndex][rowIndex]) {
          totalPopsInCol += 1;
          return totalPopsInCol - 1;
        }
        return totalPopsInCol;
      });
    });
  }

  // Any time a piece pops next to a gray piece, that gray piece becomes a
  // numbered piece. A double gray becomes a gray. If two pieces pop next to
  // a double gray it becomes numbered. This tallies the pops adjacent to a
  // piece and replaces the pieces with the appropriate new one
  performDecrementGrays(popMask) {
    let newBoard = this.board.map((column, columnIndex) => {
      return column.map((piece, rowIndex) => {
        // If this isn't a gray piece it can't be decremented
        if (piece !== Model.GRAY_PIECE && piece !== Model.DOUBLE_GRAY_PIECE) {
          return piece;
        }

        var decrementCount = 0;
        [[-1, 0], [1, 0], [0, -1], [0, 1]].forEach(deltas => {
          let newRow = rowIndex + deltas[0];
          let newCol = columnIndex + deltas[1];
          if (
            newRow >= 0 && newCol >= 0 &&
            newRow < Model.SIZE && newCol < Model.SIZE
          ) {
            decrementCount += popMask[newCol][newRow] ? 1 : 0;
          }
        });

        if (
          (decrementCount > 0 && piece === Model.GRAY_PIECE) ||
          (decrementCount > 1 && piece === Model.DOUBLE_GRAY_PIECE)
        ) {
          return this.getNextPiece();
        }
        if (decrementCount > 0 && piece === Model.DOUBLE_GRAY_PIECE) {
          return Model.GRAY_PIECE;
        }
        return piece;
      });
    });
    this.board = newBoard;
  }

  // TODO there is a 70k score bonus for a cleared screen. This is rare however
  // so I haven't bothered yet
  performPops(popMask) {
    let newBoard = this.board.map((column, columnIndex) => {
      var newCol = [];
      column.forEach((piece, rowIndex) => {
        if (!popMask[columnIndex][rowIndex] && piece !== null) {
          newCol.push(piece);
        }
      });
      while (newCol.length < Model.SIZE) {
        newCol.push(null);
      }
      return newCol;
    });
    this.board = newBoard;

    let popCount = this.popCount(popMask);
    this.score += popCount * Model.CHAIN_MULTIPLIERS[this.chainIndex];
    this.chainIndex += 1;
  }

  // Decrements the count, and if its the end of the round, bumps the
  // lowest row (another round of popping needs to be performed after this)
  // with double gray pieces. We then remove the top item of each column,
  // unless its game over, then we leave it and display it.
  // Returns false if they lost as a result
  decrementPieceCount() {
    this.piecesLeftInRound -= 1;
    var notLost = true;
    if (this.piecesLeftInRound === 0) {
      this.piecesLeftInRound = Model.PIECES_PER_ROUND;
      this.board.forEach((column) => {
        column.unshift(Model.DOUBLE_GRAY_PIECE);
        if (column[Model.SIZE] != null) {
          notLost = false;
        } else {
          column.pop();
        }
      });

      this.score += 17000;
    }
    return notLost;
  }

  // These are features we can use to try to figure out what is and is not a
  // good move
  getFeatures() {
    return {
        score: this.score,
        height: Math.max(...this.board.map((column) => {
            let height = column.indexOf(null);
            return (height !== -1) ? height : Model.SIZE;
        })),
        // ones_count: this.countPieces(1),
        // twos_count: this.countPieces(2),
        // threes_count: this.countPieces(3),
        // fours_count: this.countPieces(4),
        // fives_count: this.countPieces(5),
        // sixs_count: this.countPieces(6),
        // sevens_count: this.countPieces(7),
        nums_count: this.countPieces((x) => Number.isInteger(x)),
        grays_count: this.countPieces((x) => x === Model.GRAY_PIECE),
        double_grays_count: this.countPieces((x) => x === Model.DOUBLE_GRAY_PIECE)
    }
      // TODO include, left column and right column height
      // number of pieces above their count (by how many?)
      // number of pieces below their count (by how many?)
      // break above by row v column?
  }

  countPieces(test) {
    return this.board.reduce(
      (accum1, column) => accum1 + column.reduce(
        (accum2, piece) => accum2 + test(piece) ? 1 : 0,
        0
      ),
      0
    );
  }
}
