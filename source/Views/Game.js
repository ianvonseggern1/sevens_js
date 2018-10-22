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
    this.state = {
      model: model,
      popAnimationProgress: null,
      dropAnimationProgress: null,
    };

    // bind this to callbacks
    this.onClick = this.onClick.bind(this);
  }

  // The first time this is called needToDecrement is true, after all the popping
  // is finished, we decrement the piece count and then call this again with false
  // TODO all the set state calls should use the callbacks, right now they implictly
  // rely on ordering
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

    let dropMask = this.state.model.getDistanceToDropMask(popMask);
    let maxDrop = Math.max(...dropMask.map((col) => Math.max(...col)))
    this.setState(
      {popMask: popMask, dropMask: dropMask, maxDrop: maxDrop},
      () => this.animatePops(() => {
        this.state.model.performPops(popMask);
        this.setState({model: this.state.model});
        this.popUntilDone(needToDecrement)
      }),
    );
  }

  // After this finishes it calls animatedDrops, completion is simply passed
  // to animateDrops
  animatePops(completion) {
    let STEP_SIZE = 0.1;
    let progress;

    if (this.state.popAnimationProgress >= 1) {
      this.state.model.performDecrementGrays(this.state.popMask);
      this.setState(
        {model: this.state.model, popAnimationProgress: null},
        () => this.animateDrops(completion),
      );
      return;

    } else if (!this.state.popAnimationProgress) {
      progress = STEP_SIZE;
    } else {
      progress = this.state.popAnimationProgress + STEP_SIZE;
    }

    this.setState({popAnimationProgress: progress});
    setTimeout(() => this.animatePops(completion), 50);
  }

  // TODO we can update this to something better than linear dropping
  // such as acceleartion and even a little bounce at the end if we want
  animateDrops(completion) {
    if (this.state.maxDrop === 0) {
      completion();
      return;
    }

    let STEP_SIZE = 0.1;
    let progress;

    if (this.state.dropAnimationProgress >= this.state.maxDrop) {
      this.setState(
        {dropAnimationProgress: null},
        completion,
      );
      return;

    } else if (!this.state.dropAnimationProgress) {
      progress = STEP_SIZE;
    } else {
      progress = this.state.dropAnimationProgress + STEP_SIZE;
    }

    this.setState({dropAnimationProgress: progress});
    setTimeout(() => this.animateDrops(completion), 50);
  }

  onClick(event) {
    // Can't drop a piece while the previous one is still being animated
    if (
      this.state.popAnimationProgress !== null ||
      this.state.dropAnimationProgress !== null
    ) {
      return;
    }

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
          dropMask={this.state.dropMask}
          popAnimationProgress={this.state.popAnimationProgress}
          dropAnimationProgress={this.state.dropAnimationProgress} />
        <StrategyValues
          strategy={this.props.strategy}
          model={this.state.model}
        />
      </div>
    );
  }
}
