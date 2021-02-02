import { assert } from "chai";

export enum Operation {
  Add,
  Sub,
  Mul,
  Div,
}

class NumberToken {
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
}
class ResultToken {
  result: number;
  constructor(result: number) {
    this.result = result;
  }
}
class OperationToken {
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
}

type Token = NumberToken | ResultToken | OperationToken;

export function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here");
}

export default class CalcStateMachine {
  private tokens: Token[] = [];
  private lastToken(): Token | undefined {
    if (this.tokens.length === 0) {
      return undefined;
    } else {
      return this.tokens[this.tokens.length - 1];
    }
  }

  private opAsText(item: OperationToken): String {
    switch (item.op) {
      case Operation.Add:
        return " + ";
      case Operation.Sub:
        return " - ";
      case Operation.Mul:
        return " \u00D7 ";
      case Operation.Div:
        return " \u00F7 ";
    }
  }
  private numbertokenAsText(item: NumberToken): String {
    let result = "";
    if (item.negative) result += "-";
    result += item.integer.join("");
    if (item.decimal.length > 0) result += "," + item.decimal.join("");
    return result;
  }

  asText(): String {
    let result = this.tokens
      .map((item) => {
        if (item instanceof NumberToken) {
          return this.numbertokenAsText(item);
        } else if (item instanceof ResultToken) {
          return item.result.toString();
        }
        return this.opAsText(item);
      })
      .join("");
    let lt = this.lastToken();
    if (
      lt !== undefined &&
      lt instanceof NumberToken &&
      lt.decimal.length === 0 &&
      lt.inDecimal
    ) {
      result += ",";
    }
    return result;
  }

  operation(x: Operation) {
    let lt = this.lastToken();
    if (lt === undefined || lt instanceof OperationToken) {
      if (x === Operation.Sub) {
        let nt = new NumberToken();
        nt.negative = true;
        this.tokens.push(nt);
      }
      return;
    }
    if (lt instanceof NumberToken) {
      if (lt.integer.length === 0) {
        return;
      }
      if (lt.inDecimal && lt.decimal.length === 0) {
        lt.decimal.push("0");
      }
    }

    if (lt instanceof NumberToken || lt instanceof ResultToken) {
      this.tokens.push(new OperationToken(x));
      return;
    }
    assertUnreachable(lt);
  }

  digit(d: String) {
    let lt = this.lastToken();
    if (lt === undefined) {
      let nt = new NumberToken();
      nt.integer.push(d);
      this.tokens.push(nt);
      return;
    }
    if (lt instanceof NumberToken) {
      if (lt.inDecimal) {
        lt.decimal.push(d);
      } else {
        lt.integer.push(d);
      }
      return;
    }
    if (lt instanceof ResultToken) {
      this.clear();
    }
    if (lt instanceof ResultToken || lt instanceof OperationToken) {
      let nt = new NumberToken();
      nt.integer.push(d);
      this.tokens.push(nt);
      return;
    }
    assertUnreachable(lt);
  }
  comma() {
    let lt = this.lastToken();
    if (lt === undefined) {
      let nt = new NumberToken();
      nt.integer.push("0");
      nt.inDecimal = true;
      this.tokens.push(nt);
      return;
    }
    if (lt instanceof NumberToken) {
      if (lt.inDecimal) {
        return;
      } else {
        lt.inDecimal = true;
      }
      return;
    }
    if (lt instanceof ResultToken) {
      this.clear();
    }
    if (lt instanceof ResultToken || lt instanceof OperationToken) {
      let nt = new NumberToken();
      nt.integer.push("0");
      nt.inDecimal = true;
      this.tokens.push(nt);
      return;
    }
    assertUnreachable(lt);
  }
  private shunting_yard(tokens: Token[]): number | undefined {
    let stack: OperationToken[] = [];
    let outstack: number[] = [];
    for (let element of this.tokens) {
      if (element instanceof ResultToken) {
        outstack.push(element.result);
      } else if (element instanceof NumberToken) {
        outstack.push(element.toNumber());
      } else {
        while (
          stack.length > 0 &&
          stack[stack.length - 1].precedence >= element.precedence
        ) {
          let right = outstack.pop();
          let left = outstack.pop();
          let op = stack.pop();

          if (left === undefined || right === undefined || op === undefined) {
            return undefined;
          }

          outstack.push(op.apply(left, right));
        }
        stack.push(element);
      }
    }
    while (stack.length > 0) {
      let right = outstack.pop();
      let left = outstack.pop();
      let op = stack.pop();
      if (left === undefined || right === undefined || op === undefined) {
        return undefined;
      }
      outstack.push(op.apply(left, right));
    }
    console.assert(outstack.length === 1, outstack.length);
    return outstack.pop() as number;
  }
  backOne() {
    let lt = this.lastToken();
    if (lt === undefined) {
      return;
    }
    if (lt instanceof ResultToken || lt instanceof OperationToken) {
      this.tokens.pop();
      return;
    }
    if (lt instanceof NumberToken) {
      if (lt.decimal.length > 0) {
        lt.decimal.pop();
      } else if (lt.inDecimal) {
        lt.inDecimal = false;
      } else if (lt.integer.length > 0) {
        lt.integer.pop();
        if (lt.integer.length === 0 && !lt.negative) {
          this.tokens.pop();
        }
      } else if (lt.negative) {
        this.tokens.pop();
      } else {
        console.log(lt);
        this.tokens.pop();
      }
      return;
    }
    assertUnreachable(lt);
  }
  equal() {
    let result = this.shunting_yard(this.tokens);
    if (result === undefined) {
      this.tokens = [];
      return;
    }
    this.tokens = [{ result: result }];
  }
  clear() {
    this.tokens = [];
  }
}
