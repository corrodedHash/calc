import { assertUnreachable } from "./util";

export enum Operation {
  Add,
  Sub,
  Mul,
  Div,
}

export class OpenParToken {}
export class CloseParToken {}

export class NumberToken {
  negative: boolean = false;
  integer: String[] = [];
  decimal: String[] = [];
  inDecimal: boolean = false;
  toNumber(): number {
    return parseFloat(
      (this.negative ? "-" : "") +
        this.integer.join("") +
        "." +
        this.decimal.join("")
    );
  }

  toString(): String {
    let result = "";
    if (this.negative) result += "-";
    result += this.integer.join("");
    if (this.decimal.length > 0) result += "," + this.decimal.join("");
    return result;
  }
}
export class ResultToken {
  result: number;
  constructor(result: number) {
    this.result = result;
  }
}
export class OperationToken {
  op: Operation;
  constructor(op: Operation) {
    this.op = op;
  }

  get precedence(): number {
    switch (this.op) {
      case Operation.Add:
        return 1;
      case Operation.Sub:
        return 1;
      case Operation.Mul:
        return 2;
      case Operation.Div:
        return 2;
      default:
        assertUnreachable(this.op);
    }
  }
  apply(left: number, right: number): number {
    switch (this.op) {
      case Operation.Add:
        return left + right;
      case Operation.Sub:
        return left - right;
      case Operation.Mul:
        return left * right;
      case Operation.Div:
        return left / right;
      default:
        assertUnreachable(this.op);
    }
  }

  toString(): String {
    switch (this.op) {
      case Operation.Add:
        return " + ";
      case Operation.Sub:
        return " - ";
      case Operation.Mul:
        return " \u00D7 ";
      case Operation.Div:
        return " \u00F7 ";
      default:
        assertUnreachable(this.op);
    }
  }
}

export type Token =
  | NumberToken
  | ResultToken
  | OperationToken
  | OpenParToken
  | CloseParToken;
