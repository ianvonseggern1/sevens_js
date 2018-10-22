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
    // TODO have piece take more general values and fix this hack
    return (
      <Piece
        value={this.props.piece}
        columnIndex={Math.floor(Model.SIZE / 2)}
        rowIndex={Model.SIZE - 1}
      />
    );
  }
}
