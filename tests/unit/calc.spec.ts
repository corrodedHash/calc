import { assert, expect } from "chai";
import CalcStateMachine from "@/calc_statemachine";
import { BinaryOperation } from "@/tokens";

describe("parentheses", function() {
  let sm = new CalcStateMachine();
  sm.digit("1");
  sm.digit("7");
  expect(sm.result()).to.equal(17);

  sm.openpar();
  sm.digit("9");
  sm.binary_operation(BinaryOperation.Add);
  sm.digit("3");
  sm.closepar();

  expect(sm.result()).to.equal(204);

  sm.openpar();

  sm.openpar();
  sm.digit("5");
  sm.binary_operation(BinaryOperation.Mul);
  sm.digit("5");
  sm.closepar();

  sm.binary_operation(BinaryOperation.Sub);

  sm.openpar();
  sm.digit("2");
  sm.binary_operation(BinaryOperation.Mul);
  sm.digit("3");
  sm.closepar();

  sm.closepar();

  expect(sm.result()).to.equal(3876);
  sm.equal();
  expect(sm.asText()).to.equal("3876");
});
