<template>
  <display :text="display()" />
  <input-pad @numberpress="bla" @clear="clear" />
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";
import Display from "@/components/Display.vue";
import InputPad from "@/components/InputPad.vue";
import CalcStateMachine from "@/calc_statemachine";
import { Operation } from "@/calc_statemachine";

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
          this.sm.operation(Operation.Add);
          break;
        case "sub":
          this.sm.operation(Operation.Sub);
          break;
        case "mul":
          this.sm.operation(Operation.Mul);
          break;
        case "div":
          this.sm.operation(Operation.Div);
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
</style>
