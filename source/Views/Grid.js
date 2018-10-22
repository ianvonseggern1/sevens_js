import React from 'react';
import ReactDOM from 'react-dom';

import Model from "../Model.js";

import Piece from "./Piece.js";

export default class Grid extends React.Component {
  render() {
    var pieces = [];
    this.props.board.forEach((column, columnIndex) => {
      column.forEach((piece, rowIndex) => {
        if (piece === null) {
          return;
        }

        var popAnimateScale = null;
        if (
          this.props.popAnimationProgress &&
          this.props.popMask &&
          this.props.popMask[columnIndex][rowIndex]
        ) {
          popAnimateScale = this.props.popAnimationProgress;
        }

        let dropDistance = 0;
        if (this.props.dropAnimationProgress && this.props.dropMask) {
          // Don't render popped pieces if we are in the dropping phase
          if (this.props.popMask && this.props.popMask[columnIndex][rowIndex]) {
            return;
          }
          dropDistance = Math.min(
            this.props.dropMask[columnIndex][rowIndex],
            this.props.dropAnimationProgress,
          );
        }

        pieces.push(
          <Piece
            key={`c${columnIndex}r${rowIndex}`}
            value={piece}
            columnIndex={columnIndex}
            rowIndex={rowIndex - dropDistance}
            animate={popAnimateScale} />
        );
      });
    });

    return (
      <div style={{
        position: "relative",
        backgroundColor: "#333333",
        width: Model.SIZE * Piece.SQUARE_SIZE,
        height: Model.SIZE * Piece.SQUARE_SIZE,
        marginTop: Piece.SQUARE_SIZE
      }}>
        {pieces}
      </div>
    );
  }
}
