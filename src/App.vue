<template>
  <display :text="display()" />
  <div class="pad">
    <input-pad @numberpress="bla" @clear="clear" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Display from "@/components/Display.vue";
import InputPad from "@/components/InputPad.vue";
import CalcStateMachine from "@/calc_statemachine";
import { BinaryOperation } from "@/calc_statemachine";
import { UnaryOperation } from "./tokens";

@Options({
  components: {
    Display,
    InputPad,
  },
  data() {
    return { sm: new CalcStateMachine() };
  },
  methods: {
    display(): String {
      return this.sm.asText();
    },
    bla(which: String) {
      which = which.toLowerCase();
      switch (which) {
        case "add":
          this.sm.binary_operation(BinaryOperation.Add);
          break;
        case "sub":
          this.sm.binary_operation(BinaryOperation.Sub);
          break;
        case "mul":
          this.sm.binary_operation(BinaryOperation.Mul);
          break;
        case "div":
          this.sm.binary_operation(BinaryOperation.Div);
          break;
        case "power":
          this.sm.binary_operation(BinaryOperation.Power);
          break;
        case "sin":
          this.sm.unary_operation(UnaryOperation.Sin);
          break;
        case "cos":
          this.sm.unary_operation(UnaryOperation.Cos);
          break;
        case "tan":
          this.sm.unary_operation(UnaryOperation.Tan);
          break;
        case "ln":
          this.sm.unary_operation(UnaryOperation.Ln);
          break;
        case "log":
          this.sm.unary_operation(UnaryOperation.Log);
          break;
        case "comma":
          this.sm.comma();
          break;
        case "equal":
          this.sm.equal();
          break;
        case "openpar":
          this.sm.openpar();
          break;
        case "closepar":
          this.sm.closepar();
          break;
        default:
          this.sm.digit(which);
      }
    },
    clear(amount: number) {
      if (amount <= 0) {
        this.sm.clear();
      } else {
        this.sm.backOne();
      }
    },
  },
})
export default class App extends Vue {}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.pad {
  display: block;
  width: min-content;
  margin-left: auto;
  margin-right: auto;
}
</style>
