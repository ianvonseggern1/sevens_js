import React from 'react';
import ReactDOM from 'react-dom';

import Model from "../Model.js";

export default class Piece extends React.Component {
  static SQUARE_SIZE = 50;
  static PADDING = 5;

  constructor(props) {
    super(props);
    this.state = {};
  }

  getColor() {
    switch(this.props.value) {
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'orange';
      case 4:
        return 'red';
      case 5:
        return 'purple';
      case 6:
        return 'lightblue';
      case 7:
        return 'blue';
      case Model.GRAY_PIECE:
        return 'lightgray';
      case Model.DOUBLE_GRAY_PIECE:
        return 'gray';
    }
  }

  render() {
    var text = "";
    if (
      this.props.value !== Model.GRAY_PIECE &&
      this.props.value !== Model.DOUBLE_GRAY_PIECE
    ) {
      text = String(this.props.value);
    }

    var diameter = Piece.SQUARE_SIZE - 2 * Piece.PADDING;
    var padding = Piece.PADDING;
    var textPadding = 10;
    if (this.props.animate) {
      let animateDistance = this.props.animate * Piece.PADDING;
      diameter += 2 * animateDistance;
      padding -= animateDistance;
      textPadding += animateDistance;
    }

    return (
      <div style={{
        position: "absolute",
        left: this.props.columnIndex * Piece.SQUARE_SIZE + padding,
        top: (Model.SIZE - this.props.rowIndex - 1) * Piece.SQUARE_SIZE + padding,
        height: diameter,
        width: diameter,
        borderRadius: diameter / 2,
        backgroundColor: this.getColor(),
      }}>
        <span style={{
          textAlign: "center",
          width: diameter,
          paddingTop: textPadding,
          fontSize: "large",
          display: "inline-block"
        }}>
          {text}
        </span>
      </div>
    );
  }
}
