import { assert, expect } from "chai";
import CalcStateMachine from "@/calc_statemachine";
import { BinaryOperation, UnaryOperation } from "@/tokens";

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

describe("negative", function() {
  let sm = new CalcStateMachine();
  sm.binary_operation(BinaryOperation.Sub);
  sm.digit("1");
  sm.digit("7");
  expect(sm.result()).to.equal(-17);
  sm.equal();
  expect(sm.asText()).to.equal("-17");
});

describe("unary", function() {
  let sm = new CalcStateMachine();
  sm.binary_operation(BinaryOperation.Sub);
  sm.unary_operation(UnaryOperation.Sin);
  sm.openpar();
  sm.digit("7");
  sm.binary_operation(BinaryOperation.Sub);
  sm.openpar();
  sm.digit("8");
  sm.digit("9");
  sm.binary_operation(BinaryOperation.Mul);
  sm.unary_operation(UnaryOperation.Ln);
  sm.digit("7");
  sm.digit("4");
  sm.comma();
  sm.digit("3");
  sm.closepar();
  sm.closepar();
  expect(sm.result()).to.be.closeTo(-Math.sin(7 - 89 * Math.log(74.3)), 0.00001);
});
