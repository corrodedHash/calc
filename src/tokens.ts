import { assertUnreachable } from "./util";

export enum BinaryOperation {
  Add,
  Sub,
  Mul,
  Div,
  Power,
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
export class BinaryOperationToken {
  op: BinaryOperation;
  constructor(op: BinaryOperation) {
    this.op = op;
  }

  get leftAssociative(): boolean {
    switch (this.op) {
      case BinaryOperation.Add:
      case BinaryOperation.Sub:
      case BinaryOperation.Mul:
      case BinaryOperation.Div:
        return true;
      case BinaryOperation.Power:
        return false;
      default:
        assertUnreachable(this.op);
    }
  }
  get precedence(): number {
    switch (this.op) {
      case BinaryOperation.Add:
        return 1;
      case BinaryOperation.Sub:
        return 1;
      case BinaryOperation.Mul:
        return 2;
      case BinaryOperation.Div:
        return 2;
      case BinaryOperation.Power:
        return 3;
      default:
        assertUnreachable(this.op);
    }
  }
  apply(left: number, right: number): number {
    switch (this.op) {
      case BinaryOperation.Add:
        return left + right;
      case BinaryOperation.Sub:
        return left - right;
      case BinaryOperation.Mul:
        return left * right;
      case BinaryOperation.Div:
        return left / right;
      case BinaryOperation.Power:
        return Math.pow(left, right);
      default:
        assertUnreachable(this.op);
    }
  }

  toString(): String {
    switch (this.op) {
      case BinaryOperation.Add:
        return " + ";
      case BinaryOperation.Sub:
        return " - ";
      case BinaryOperation.Mul:
        return " \u00D7 ";
      case BinaryOperation.Div:
        return " \u00F7 ";
      case BinaryOperation.Power:
        return " ^ ";
      default:
        assertUnreachable(this.op);
    }
  }
}

export type Token =
  | NumberToken
  | ResultToken
  | BinaryOperationToken
  | OpenParToken
  | CloseParToken;

export function shunting_yard(tokens: Token[]): number | undefined {
  let stack: BinaryOperationToken[] = [];
  let outstack: number[] = [];
  let openparstack: number[] = [];
  function apply_while(predicate: () => boolean) {
    while (stack.length > 0 && predicate()) {
      let right = outstack.pop();
      let left = outstack.pop();
      let op = stack.pop();

      if (left === undefined || right === undefined || op === undefined) {
        throw "StackEmpty";
      }

      outstack.push(op.apply(left, right));
    }
  }
  for (let element of tokens) {
    if (element instanceof ResultToken) {
      outstack.push(element.result);
      continue;
    } else if (element instanceof NumberToken) {
      outstack.push(element.toNumber());
      continue;
    } else if (element instanceof BinaryOperationToken) {
      apply_while(() => {
        let last_op = stack[stack.length - 1];
        let cur_op = element as BinaryOperationToken;
        let last_par = openparstack[openparstack.length - 1];
        return (
          (last_op.precedence > cur_op.precedence ||
            (cur_op.leftAssociative &&
              last_op.precedence == cur_op.precedence)) &&
          (last_par === undefined || last_par < stack.length)
        );
      });
      stack.push(element);
      continue;
    } else if (element instanceof OpenParToken) {
      openparstack.push(stack.length);
      continue;
    } else if (element instanceof CloseParToken) {
      let openparpos = openparstack.pop();
      if (openparpos === undefined) {
        throw "Missing open parentheses";
      }
      apply_while(() => stack.length > (openparpos as number));
      continue;
    }
    assertUnreachable(element);
  }
  apply_while(() => true);
  console.assert(stack.length === 0, stack);
  console.assert(outstack.length === 1, outstack);
  return outstack.pop() as number;
}
