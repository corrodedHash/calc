import { assert, expect } from "chai";
import CalcStateMachine from "../../src/calc_statemachine";
import { Operation } from "../../src/tokens";

describe("parentheses", function() {
  let sm = new CalcStateMachine();
  sm.digit("1");
  sm.digit("7");
  expect(sm.result()).to.equal(17);
  sm.openpar();
  sm.digit("9");
  sm.operation(Operation.Add);
  sm.digit("3");
  sm.closepar();
  expect(sm.result()).to.equal(204);

  sm.openpar();
  sm.openpar();
  sm.digit("5");
  sm.operation(Operation.Mul);
  sm.digit("5");
  sm.closepar();
  sm.operation(Operation.Sub);
  sm.openpar();
  sm.digit("2");
  sm.operation(Operation.Mul);
  sm.digit("3");
  sm.closepar();
  sm.closepar();
  expect(sm.result()).to.equal(3876);
  sm.equal();
  expect(sm.asText()).to.equal("3876");
});
