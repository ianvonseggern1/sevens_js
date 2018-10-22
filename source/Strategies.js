export default class Strategies {
  // Each object is a strategy which maps a feature to a function to compute
  // a score. The value of any given board is the sum of the these functions
  // applied to the current value of the feature on the board.
  // A higher score indicates a stronger board, as judged by that strategy.
  static strategies = {
      min_grays: {
        'grays_count': (x) => -1 * x,
        'double_grays_count': (x) => -2 * x
      },
      min_height: {
        'height': (x) => -1 * x * x
      },
      min_grays_and_height: {
        'height': (x) => -3 * x * x,
        'grays_count': (x) => -1 * x,
        'double_grays_count': (x) => -2 * x
      },
      strat4: {
        'height': (x) => -3 * x * x,
        'grays_count': (x) => -1 * x,
        'double_grays_count': (x) => -2 * x,
        'nums_count': (x) => 0.1 * x,
      },
      random: {}
  };

  static getStrategy(name) {
    return (model) => {
      var score = 0;
      let features = model.getFeatures();
      let featureWeightFunctions = Strategies.strategies[name];

      // console.log(Strategies.strategies);
      // console.log(features);
      // console.log(featureWeightFunctions);

      for (var feature in featureWeightFunctions) {
        let weightFormula = featureWeightFunctions[feature];
        // console.log("feature");
        // console.log(feature);
        // console.log(weightFormula);
        score += weightFormula(features[feature]);
      }
      return score
    }
  }
}
