import React from 'react';
import ReactDOM from 'react-dom';

import Model from "../Model.js";

import Score from "./Score.js";
import Grid from "./Grid.js";
import StrategyValues from "./StrategyValues.js";
import Remaining from "./Remaining.js";
import Piece from "./Piece.js";
import ToDrop from "./ToDrop.js";


export default class Game extends React.Component {
  constructor(props) {
    super(props);

    var model = new Model();
    model.setup();
    this.state = {model: model};

    // bind this to callbacks
    this.onClick = this.onClick.bind(this);
  }

  popUntilDone(needToDecrement) {
    let popMask = this.state.model.getToPopMask();
    if (this.state.model.popCount(popMask) === 0) {
      if (needToDecrement) {
        this.state.model.decrementPieceCount();
        this.setState({model: this.state.model});
        setTimeout(() => this.popUntilDone(false), 500);
      }
      return;
    }
    this.setState({popMask: popMask});
    this.animatePops(() => {
      this.state.model.performDecrementGrays(popMask);
      this.state.model.performPops(popMask);
      this.setState({model: this.state.model});
      this.popUntilDone(needToDecrement)
    });
    //setTimeout(() => this.popUntilDone(needToDecrement), 500);
  }

  animatePops(completion) {
    let STEP_SIZE = 0.1;
    let progress;

    if (this.state.popAnimationProgress >= 1) {
      this.setState({popAnimationProgress: null});
      completion();
      return;

    } else if (!this.state.popAnimationProgress) {
      progress = STEP_SIZE;
    } else {
      progress = this.state.popAnimationProgress + STEP_SIZE;
    }

    this.setState({popAnimationProgress: progress});
    setTimeout(() => this.animatePops(completion), 50);
  }

  onClick(event) {
    let column = Math.floor(event.clientX / Piece.SQUARE_SIZE);

    // TODO this probably shouldn't mutate the model, simply return a new board
    let canDrop = this.state.model.dropNextPiece(column);
    if (!canDrop) {
      return;
    }
    this.setState({model: this.state.model});
    this.popUntilDone(true);
  }

  render() {
    return (
      <div onClick={this.onClick} style={{
        display: 'inline-block',
        width: Model.SIZE * Piece.SQUARE_SIZE
      }}>
        <div>
          <Remaining count={this.state.model.piecesLeftInRound} />
          <Score score={this.state.model.score} />
        </div>
        <ToDrop piece={this.state.model.nextPiece} />
        <Grid
          board={this.state.model.board}
          popMask={this.state.popMask}
          popAnimationProgress={this.state.popAnimationProgress} />
        <StrategyValues
          strategy={this.props.strategy}
          model={this.state.model}
        />
      </div>
    );
  }
}
