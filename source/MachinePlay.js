import Model from "./Model.js";

// A way to simulate a game based on a provided strategy
export default class MachinePlay {
  // Strategy is (model) => score. Higher scores are better
  constructor(strategy) {
    this.strategy = strategy;
  }

  // Returns score
  play() {
    var model = new Model();
    model.setup();
    var column = this.getColumnUsingStrategy(model);
    while (model.performFullRound(column)) {
      var column = this.getColumnUsingStrategy(model);
    }
    return model.score;
  }

  // Returns the average score
  playN(n) {
    var scores = 0;
    for (var i = 0; i < n; i += 1) {
      scores += this.play();
    }
    return scores / n;
  }

  // TODO add '?' pieces to simulation which are a numeric value but none
  // in particular to avoid biasing by random pops, would also allow easy
  // min a max (which might be better than expensive hueristics)
  simulateDropUsingStrategy(model, column) {
    var newModel = model.copy();
    newModel.performFullRound(column);
    return this.strategy(newModel);
  }

  // Returns appropriate column based on strategy
  // Selects randomly among ties
  getColumnUsingStrategy(model) {
    var scores = [];
    for (var col = 0; col < Model.SIZE; col += 1) {
      scores.push(this.simulateDropUsingStrategy(model, col));
    }

  //  console.log(scores);

    let max = Math.max(...scores);
    var columnsWithMax = [];
    for (var col = 0; col < Model.SIZE; col += 1) {
      if (scores[col] === max) {
        columnsWithMax.push(col);
      }
    }
    // TODO error
    if (columnsWithMax.length === 0) {
      console.log("zero col");
    }
    return columnsWithMax[Math.floor(Math.random()*columnsWithMax.length)];
  }
}
