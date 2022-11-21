export class GameState {
  constructor(vals) {
    this.vals = vals;
  }

  getState() {
    return this.vals;
  }
}

export class GameStateHistory {
  constructor() {
    this.clearHistory();
  }

  pushState(state) {
    this.history.push(state);
  }

  popState() {
    if (this.history.length > 1) return this.history.pop();
    else if (this.history.length == 1) return this.history[0];
    else return null;
  }

  clearHistory() {
    this.history = [];
  }
}
