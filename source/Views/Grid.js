import React from 'react';
import ReactDOM from 'react-dom';

import Model from "../Model.js";

import Piece from "./Piece.js";

export default class Grid extends React.Component {
  render() {
    var pieces = [];
    this.props.board.forEach((column, columnIndex) => {
      column.forEach((piece, rowIndex) => {
        if (piece !== null) {
          var animate = null;
          if (
            this.props.popAnimationProgress &&
            this.props.popMask &&
            this.props.popMask[columnIndex][rowIndex]
          ) {
            animate = this.props.popAnimationProgress;
          }
          pieces.push(
            <Piece
              key={`c${columnIndex}r${rowIndex}`}
              value={piece}
              columnIndex={columnIndex}
              rowIndex={rowIndex}
              animate={animate} />
          );
        }
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
