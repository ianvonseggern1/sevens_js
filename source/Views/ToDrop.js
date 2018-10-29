import React from 'react';
import ReactDOM from 'react-dom';

import Model from "../Model.js";

import Piece from "./Piece.js";

export default class ToDrop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let column = this.props.column;
    if (column === undefined || column === null) {
      column = Math.floor(Model.SIZE / 2);
    }
    // TODO have piece take more general values and fix this hack
    return (
      <Piece
        value={this.props.piece}
        columnIndex={column}
        rowIndex={Model.SIZE - this.props.animationProgress}
      />
    );
  }
}
