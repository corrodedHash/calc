enum State {
  Integer,
  Decimal,
  Negative,
  Operation,
  Result,
}

export enum Operation {
  Add,
  Sub,
  Mul,
  Div,
}

interface NumberToken {
  negative: boolean;
  integer: String[];
  decimal: String[];
}
function isNumberToken(item: Token): item is NumberToken {
  return (
    (item as NumberToken).decimal !== undefined &&
    (item as NumberToken).integer !== undefined &&
    (item as NumberToken).negative !== undefined
  );
}
function NumberTokenToNumber(item: NumberToken): number {
  return parseFloat(
    (item.negative ? "-" : "") +
      item.integer.join("") +
      "." +
      item.decimal.join("")
  );
}
interface ResultToken {
  result: number;
}
function isResultToken(item: Token): item is ResultToken {
  return (item as ResultToken).result !== undefined;
}
interface OperationToken {
  op: Operation;
}

function isOperationToken(item: Token): item is OperationToken {
  return (item as OperationToken).op !== undefined;
}

type Token = NumberToken | ResultToken | OperationToken;

export function assertUnreachable(_x: never): never {
  throw new Error("Didn't expect to get here");
}

export default class CalcStateMachine {
  private state: State[] = [];
  private tokens: Token[] = [];
  private lastState(): State | undefined {
    if (this.state.length === 0) {
      return undefined;
    } else {
      return this.state[this.state.length - 1];
    }
  }
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
        if (isNumberToken(item)) {
          return this.numbertokenAsText(item);
        } else if (isResultToken(item)) {
          return item.result.toString();
        }
        return this.opAsText(item);
      })
      .join("");
    if (
      this.lastState() === State.Decimal &&
      (this.lastToken() as NumberToken).decimal.length === 0
    ) {
      result += ",";
    }
    return result;
  }

  operation(x: Operation) {
    let state = this.lastState();
    switch (state) {
      case State.Decimal:
      case State.Integer:
      case State.Result:
        this.state.push(State.Operation);
        this.tokens.push({ op: x });
        break;
      case State.Negative:
        break;
      case State.Operation:
        break;
      case undefined:
        break;
      default:
        assertUnreachable(state);
    }
  }

  digit(d: String) {
    let state = this.lastState();
    switch (state) {
      case State.Decimal:
        (this.lastToken() as NumberToken).decimal.push(d);
        break;
      case State.Integer:
      case State.Negative:
        (this.lastToken() as NumberToken).integer.push(d);
        break;
      case State.Result:
        this.clear();
      case State.Operation:
      case undefined:
        this.state.push(State.Integer);
        this.tokens.push({ negative: false, integer: [d], decimal: [] });
        break;
      default:
        assertUnreachable(state);
    }
  }
  comma() {
    let state = this.lastState();
    switch (state) {
      case State.Integer:
      case State.Negative:
        this.state.push(State.Decimal);
        break;
      case State.Decimal:
      case State.Result:
        return;
      case State.Operation:
      case undefined:
        this.state.push(State.Decimal);
        this.tokens.push({ negative: false, integer: ["0"], decimal: [] });
        break;
      default:
        assertUnreachable(state);
    }
  }
  private shunting_yard(tokens: Token[]): number | undefined {
    let stack: Operation[] = [];
    let outstack: number[] = [];
    function precedence(op: Operation): number {
      switch (op) {
        case Operation.Add:
          return 1;
        case Operation.Sub:
          return 1;
        case Operation.Mul:
          return 2;
        case Operation.Div:
          return 2;
        default:
          assertUnreachable(op);
      }
    }
    function apply_op(op: Operation, left: number, right: number): number {
      switch (op) {
        case Operation.Add:
          return left + right;
        case Operation.Sub:
          return left - right;
        case Operation.Mul:
          return left * right;
        case Operation.Div:
          return left / right;
        default:
          assertUnreachable(op);
      }
    }
    tokens.forEach((element) => {
      if (isResultToken(element)) {
        outstack.push(element.result);
      } else if (isNumberToken(element)) {
        outstack.push(NumberTokenToNumber(element));
      } else {
        while (
          stack.length > 0 &&
          precedence(stack[stack.length - 1]) >= precedence(element.op)
        ) {
          let right = outstack.pop();
          let left = outstack.pop();
          let op = stack.pop();

          outstack.push(
            apply_op(op as Operation, left as number, right as number)
          );
        }
        stack.push(element.op);
      }
    });
    while (stack.length > 0) {
      let right = outstack.pop();
      let left = outstack.pop();
      let op = stack.pop();
      if (left === undefined || right === undefined || op === undefined) {
        return undefined;
      }

      outstack.push(apply_op(op, left, right));
    }
    console.assert(outstack.length === 1, outstack.length);
    return outstack.pop() as number;
  }
  backOne() {}
  equal() {
    let result = this.shunting_yard(this.tokens);
    if (result === undefined) {
      this.tokens = [];
      this.state = [];
      return;
    }
    this.tokens = [{ result: result }];
    this.state = [State.Result];
  }
  clear() {
    this.tokens = [];
    this.state = [];
  }
}
