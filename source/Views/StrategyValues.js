import React from 'react';
import ReactDOM from 'react-dom';

import Model from "../Model.js";
import MachinePlay from "../MachinePlay.js";
import Strategies from "../Strategies.js";

import Piece from "./Piece.js";

// Below the board display the value the current strategy ascribes to dropping
// the next piece in the above column
export default class StrategyValues extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    if (!this.props.strategy) {
      return null;
    }

    let machine = new MachinePlay(Strategies.getStrategy(this.props.strategy));
    var values = [];
    for (var col = 0; col < Model.SIZE; col += 1) {
      values.push(machine.simulateDropUsingStrategy(this.props.model, col))
    }

    let maxValue = Math.max(...values);

    let divs = values.map((value, index) =>
      <div key={index} style={{
        display: 'inline-block',
        width: Piece.SQUARE_SIZE,
        color: (maxValue === value ? 'blue' : 'black'),
        textAlign: 'center'
      }}>
        {value}
      </div>
    );

    return (
      <div>
        {divs}
      </div>
    );
  }
}
