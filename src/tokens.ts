import { assert } from "chai";
import { assertUnreachable } from "./util";

function operation_precedence(op: BinaryOperationToken | UnaryOperationToken) {
  let x: UnaryOperation | BinaryOperation;
  if (op instanceof BinaryOperationToken) {
    x = op.op;
  } else {
    x = op.unary_op;
    if (!(op instanceof UnaryOperationToken)) {
      assertUnreachable(op);
    }
  }
  switch (x) {
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
    case UnaryOperation.Ln:
    case UnaryOperation.Log:
    case UnaryOperation.Negate:
    case UnaryOperation.Sin:
    case UnaryOperation.Cos:
    case UnaryOperation.Tan:
      return 4;
    default:
      assertUnreachable(x);
  }
}

export enum BinaryOperation {
  Add,
  Sub,
  Mul,
  Div,
  Power,
}

export enum UnaryOperation {
  Negate,
  Ln,
  Log,
  Sin,
  Cos,
  Tan,
}

export class OpenParToken {}
export class CloseParToken {}

export class NumberToken {
  integer: String[] = [];
  decimal: String[] = [];
  inDecimal: boolean = false;
  toNumber(): number {
    return parseFloat(this.integer.join("") + "." + this.decimal.join(""));
  }

  toString(): String {
    let result = "";
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

export class UnaryOperationToken {
  unary_op: UnaryOperation;
  constructor(unary_op: UnaryOperation) {
    this.unary_op = unary_op;
  }
  apply(n: number): number {
    switch (this.unary_op) {
      case UnaryOperation.Negate:
        return -n;
      case UnaryOperation.Ln:
        return Math.log(n);
      case UnaryOperation.Log:
        return Math.log10(n);
      case UnaryOperation.Cos:
        return Math.cos(n);
      case UnaryOperation.Sin:
        return Math.sin(n);
      case UnaryOperation.Tan:
        return Math.tan(n);
      default:
        assertUnreachable(this.unary_op);
    }
  }
  toString(): String {
    switch (this.unary_op) {
      case UnaryOperation.Negate:
        return "-";
      case UnaryOperation.Ln:
        return "ln ";
      case UnaryOperation.Log:
        return "log ";
      case UnaryOperation.Cos:
        return "cos ";
      case UnaryOperation.Sin:
        return "sin ";
      case UnaryOperation.Tan:
        return "tan ";
      default:
        assertUnreachable(this.unary_op);
    }
  }
}
export type Token =
  | NumberToken
  | ResultToken
  | BinaryOperationToken
  | UnaryOperationToken
  | OpenParToken
  | CloseParToken;

export function shunting_yard(tokens: Token[]): number | undefined {
  let stack: (BinaryOperationToken | UnaryOperationToken)[] = [];
  let outstack: number[] = [];
  let openparstack: number[] = [];
  function apply_while(predicate: () => boolean) {
    while (stack.length > 0 && predicate()) {
      let op = stack.pop();
      if (op === undefined) {
        throw "StackEmpty";
      }
      if (op instanceof BinaryOperationToken) {
        let right = outstack.pop();
        let left = outstack.pop();

        if (left === undefined || right === undefined) {
          throw "StackEmpty";
        }

        outstack.push(op.apply(left, right));
        continue;
      } else if (op instanceof UnaryOperationToken) {
        let n = outstack.pop();
        if (n === undefined) {
          throw "StackEmpty";
        }
        outstack.push(op.apply(n));
        continue;
      }
      assertUnreachable(op);
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
          (operation_precedence(last_op) > operation_precedence(cur_op) ||
            (cur_op.leftAssociative &&
              operation_precedence(last_op) == operation_precedence(cur_op))) &&
          (last_par === undefined || last_par < stack.length)
        );
      });
      stack.push(element);
      continue;
    } else if (element instanceof UnaryOperationToken) {
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
