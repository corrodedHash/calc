import {
  Token,
  BinaryOperationToken,
  NumberToken,
  ResultToken,
  OpenParToken,
  CloseParToken,
  shunting_yard,
} from "@/tokens";
import { BinaryOperation } from "@/tokens";
export { BinaryOperation };
import { assertUnreachable } from "@/util";

export default class CalcStateMachine {
  private tokens: Token[] = [];
  private lastToken(): Token | undefined {
    if (this.tokens.length === 0) {
      return undefined;
    } else {
      return this.tokens[this.tokens.length - 1];
    }
  }

  asText(): String {
    let result = this.tokens
      .map((item) => {
        if (item instanceof NumberToken) {
          return item.toString();
        } else if (item instanceof ResultToken) {
          return item.result.toString();
        } else if (item instanceof BinaryOperationToken) {
          return item.toString();
        } else if (item instanceof OpenParToken) {
          return "(";
        } else if (item instanceof CloseParToken) {
          return ")";
        }
        assertUnreachable(item);
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
  result(): number | undefined {
    try {
      return shunting_yard(this.tokens);
    } catch {
      return undefined;
    }
  }

  binary_operation(x: BinaryOperation) {
    let lt = this.lastToken();
    if (
      lt === undefined ||
      lt instanceof BinaryOperationToken ||
      lt instanceof OpenParToken
    ) {
      if (x === BinaryOperation.Sub) {
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

    if (
      lt instanceof NumberToken ||
      lt instanceof ResultToken ||
      lt instanceof CloseParToken
    ) {
      this.tokens.push(new BinaryOperationToken(x));
      return;
    }
    assertUnreachable(lt);
  }

  digit(d: String) {
    let lt = this.lastToken();
    if (lt === undefined || lt instanceof OpenParToken) {
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
    if (lt instanceof ResultToken || lt instanceof BinaryOperationToken) {
      let nt = new NumberToken();
      nt.integer.push(d);
      this.tokens.push(nt);
      return;
    }
    if (lt instanceof CloseParToken) {
      this.tokens.push(new BinaryOperationToken(BinaryOperation.Mul));
      let nt = new NumberToken();
      nt.integer.push(d);
      this.tokens.push(nt);
      return;
    }
    assertUnreachable(lt);
  }
  comma() {
    let lt = this.lastToken();
    if (lt === undefined || lt instanceof OpenParToken) {
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
    if (lt instanceof ResultToken || lt instanceof BinaryOperationToken) {
      let nt = new NumberToken();
      nt.integer.push("0");
      nt.inDecimal = true;
      this.tokens.push(nt);
      return;
    }
    if (lt instanceof CloseParToken) {
      this.tokens.push(new BinaryOperationToken(BinaryOperation.Mul));
      let nt = new NumberToken();
      nt.integer.push("0");
      nt.inDecimal = true;
      this.tokens.push(nt);
      return;
    }
    assertUnreachable(lt);
  }
  backOne() {
    let lt = this.lastToken();
    if (lt === undefined) {
      return;
    }
    if (
      lt instanceof ResultToken ||
      lt instanceof BinaryOperationToken ||
      lt instanceof OpenParToken ||
      lt instanceof CloseParToken
    ) {
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
    let result = this.result();
    if (result === undefined) {
      this.tokens = [];
      return;
    }
    this.tokens = [new ResultToken(result)];
  }
  clear() {
    this.tokens = [];
  }
  openpar() {
    let lt = this.lastToken();
    if (lt instanceof CloseParToken || lt instanceof ResultToken) {
      this.tokens.push(new BinaryOperationToken(BinaryOperation.Mul));
      this.tokens.push(new OpenParToken());
      return;
    }
    if (
      lt instanceof BinaryOperationToken ||
      lt === undefined ||
      lt instanceof OpenParToken
    ) {
      this.tokens.push(new OpenParToken());
      return;
    }
    if (lt instanceof NumberToken) {
      if (lt.integer.length === 0 && lt.negative) {
        lt.integer.push("1");
      }
      if (lt.decimal.length === 0 && lt.inDecimal) {
        lt.decimal.push("0");
      }
      this.tokens.push(new BinaryOperationToken(BinaryOperation.Mul));
      this.tokens.push(new OpenParToken());
      return;
    }

    assertUnreachable(lt);
  }
  closepar() {
    let lt = this.lastToken();
    if (
      lt instanceof OpenParToken ||
      lt instanceof CloseParToken ||
      lt instanceof ResultToken
    ) {
      this.tokens.push(new CloseParToken());
      return;
    }
    if (lt instanceof BinaryOperationToken || lt === undefined) {
      return;
    }
    if (lt instanceof NumberToken) {
      if (lt.integer.length === 0 && lt.negative) {
        lt.integer.push("1");
      }
      if (lt.decimal.length === 0 && lt.inDecimal) {
        lt.decimal.push("0");
      }
      this.tokens.push(new CloseParToken());
      return;
    }
    assertUnreachable(lt);
  }
}
