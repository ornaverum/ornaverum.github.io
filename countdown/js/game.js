import OpNode from "./opNode.js";
import { GameState, GameStateHistory } from "./gameState.js";
export default class Game {
  // static this.availableOperators = _.range(0, 3);
  // 0   +
  // 1  -
  // 2  *
  constructor(numBigs = 1) {
    this.initialValues = [];
    this.state = null;
    this.stateHistory = new GameStateHistory();
    this.targetValue = 0;
    this.targetNode = null;
    this.numBigs = numBigs;
    this.availableOperators = _.range(0, 3);
    this.nodeSet = [];
    // this.gameState =
  }

  // getValues() {
  //   return this.values;
  // }

  // checkWin() {
  //   return this.values.includes(this.targetValue);
  // }

  generateValues() {
    const smallVals = _.range(1, 11).concat(_.range(1, 11));
    const bigVals = [25, 50, 75, 100, 25, 50, 75, 100];

    let bigs = _.sample(bigVals, this.numBigs);
    let vals = bigs;
    if (this.numBigs < 5) {
      let smalls = _.sample(smallVals, 5 - this.numBigs);
      vals = vals.concat(smalls);
    }
    this.initialValues = _.sortBy(vals, (num) => -num);
    this.state = new GameState(this.initialValues);
    // this.stateHistory.pushState(this.state);
  }

  runOperation(i, j, op) {
    // i, j are indices of operands
    // i is default node, val will replace
    let stateVals = [...this.state.getState()];
    let a = stateVals[i];
    let b = stateVals[j];
    let val = this.getOperation(op, a, b);
    stateVals.splice(j, 1);
    stateVals.splice(i, 1, val);
    this.state = new GameState(stateVals);
    this.stateHistory.pushState(this.state);
    return val;
  }

  getOperation(op, a, b) {
    if (op === 0) return a + b;
    else if (op === 1) return Math.abs(a - b);
    else if (op === 2) return a * b;
  }

  getIdentity(op) {
    if (op === 2) return 1; // 2 is *
    return 0; // 0, 1 is *
  }

  generateNodes() {
    this.initialValues.forEach((val, i) => {
      this.nodeSet.push(new OpNode(null, null, 0, val));
    });
  }

  iterateNodes() {
    this.nodeSet.forEach((a, i) => {
      this.nodeSet.forEach((b, j) => {
        if (!(a.lineage.includes(b) || b.lineage.includes(a))) {
          this.availableOperators.forEach((op, i) => {
            let node = new OpNode(a, b, op);
            if (node.value < 1000) this.nodeSet.push(node);
          });
        }
      });
    });
    this.nodeSet = _.filter(this.nodeSet, (node) => {
      return node.value > 100 && node.value < 1000 && !(node.value % 10 == 0);
    });
    this.nodeSet = _.uniq(this.nodeSet, (node) => node.value);
    // console.log("nodeSet = ", this.nodeSet);
  }

  selectTargetValue() {
    this.targetNode = _.sample(this.nodeSet);
    this.targetValue = this.targetNode.value;
    console.log("Cheat: ", OpNode.getString(this.targetNode));
  }

  printSolution(node) {}
}
