export default class OpNode {
  // 0   +
  // 1  -
  // 2  *

  getOperation(op, a, b) {
    if (op === 0) return a + b;
    else if (op === 1) return Math.abs(a - b);
    else if (op === 2) return a * b;
  }

  constructor(parentA = null, parentB = null, op = 0, value = null) {
    this.a = parentA;
    this.b = parentB;
    this.op = op;
    if (value) this.value = value;
    else this.value = this.getOperation(this.op, this.a.value, this.b.value);

    this.lineage = [this];

    if (parentA && parentB) {
      this.depth = parentA.depth + parentB.depth;
      this.lineage = this.lineage
        .concat(parentA.lineage)
        .concat(parentB.lineage);
    } else {
      this.depth = 1;
    }
  }

  static getString(node) {
    let s = "";
    let opWrappers = [
      ["(", ")"],
      ["|", "|"],
      ["", ""],
    ];
    if (node.a && node.b) {
      s += opWrappers[node.op][0];
      s += OpNode.getString(node.a);
      s += OpNode.getOpString(node.op);
      if (node.b) s += OpNode.getString(node.b);
      s += opWrappers[node.op][1];
    } else {
      s += node.value;
    }

    return s;
  }

  static getOpString(op) {
    if (op === 0) return "+";
    else if (op === 1) return "-";
    else if (op === 2) return "*";
  }
}
