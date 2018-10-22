import React from 'react';
import ReactDOM from 'react-dom';

import MachinePlay from "../MachinePlay.js";
import Strategies from "../Strategies.js";

// Show a drop down to switch strategies as well as see the features and
// functions used by the current strategy
export default class StrategiesView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.onChange = this.onChange.bind(this);
    this.runStrategy = this.runStrategy.bind(this);
  }

  runStrategy() {
    let machine = new MachinePlay(
      Strategies.getStrategy(this.props.strategy)
    );
    this.setState({'runValue': machine.playN(100)});
  }

  onChange(event) {
    let strategy = event.target.value;
    let weights = Strategies.strategies[strategy];
    this.setState({
      'weights': weights,
      'runValue': null
    });

    this.props.onStrategyChange(strategy);
  }

  render() {
    let options = Object.keys(Strategies.strategies).map(
      (strategy) => <option key={strategy} value={strategy}>{strategy}</option>
    );

    var runButton = null;
    if (this.props.strategy) {
      runButton = <button key="runButton" onClick={this.runStrategy}>Run 100 Times</button>;
    }

    var featureWeights = [];
    if (this.state.weights) {
      for (var feature in this.state.weights) {
        featureWeights.push(
          <p key={feature} style={{
            fontFamily: 'monospace'
          }}>
            <b>{feature + ":"}</b>{" "+this.state.weights[feature]}
          </p>
        );
      }
    }

    return (
      <div style={{
        width: 200,
        display: 'inline-block',
        paddingLeft: 20}}
      >
        <div key="label"><b>Strategies:</b></div>
        <select
          key="select"
          value={this.props.strategy}
          onChange={this.onChange}
          style={{
            margin: 5,
        }}>
          {options}
        </select>
        {runButton}
        {this.state.runValue}
        {featureWeights}
      </div>
    );
  }
}
