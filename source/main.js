import React from 'react';
import ReactDOM from 'react-dom';
import "babel-register";

import Model from "./Model.js";
import Game from "./Views/Game.js";
import StrategiesView from "./Views/StrategiesView.js"

import MachinePlay from "./MachinePlay.js";
import Strategies from "./Strategies.js";

"use strict";


class Site extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onStrategyChange = this.onStrategyChange.bind(this);
  }

  onStrategyChange(strategy) {
    this.setState({strategy: strategy});
  }

  render() {
    return (
      <div style={{display: 'flex'}}>
        <Game strategy={this.state.strategy} />
        {
          this.props.showStrategies
            ? <StrategiesView
                strategy={this.state.strategy}
                onStrategyChange={this.onStrategyChange}
              />
            : null
        }
      </div>
    );
  }
}

// Uncomment to console log the results of strategy simulations on each load
// ['strat4', 'min_grays_and_height', 'min_height', 'min_grays', 'random'].forEach((strat) => {
//   let machine = new MachinePlay(Strategies.getStrategy(strat));
//   console.log(machine.playN(100));
// });

ReactDOM.render(
  <Site showStrategies={window.location.search.includes("strategy")} />,
  document.getElementById('root')
);
