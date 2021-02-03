<template>
  <div class="gridbox">
    <div
      v-for="x in buttons()"
      :key="x[0]"
      class="button"
      @click="pressed(x[0])"
      :style="{ 'grid-area': x[0] }"
    >
      {{ x[1] }}
    </div>
  </div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  emits: {
    numberpress: (char: String) => {
      return typeof char === "string";
    },
    clear: (amount: number) => {
      return typeof amount === "number";
    },
  },
  methods: {
    pressed(which: String) {
      if (which == "back") {
        this.$emit("clear", 1);
      } else if (which == "clear") {
        this.$emit("clear", -1);
      } else if (which.match(/^n[0-9]$/)) {
        this.$emit("numberpress", which[1]);
      } else {
        this.$emit("numberpress", which);
      }
    },
    buttons() {
      let res = [
        ["openpar", "("],
        ["closepar", ")"],
        ["clear", "C"],
        ["div", "\u00F7"],
        ["mul", "\u00D7"],
        ["back", "\u2190"],
        ["comma", ","],
        ["sub", "-"],
        ["add", "+"],
        ["equal", "="],
        ["power", "x\u207F"],
        ["sin", "sin"],
        ["cos", "cos"],
        ["tan", "tan"],
        ["ln", "ln"],
        ["log", "log"],
      ];
      for (let i = 0; i < 10; i++) {
        res.push([`n${i}`, `${i}`]);
      }
      return res;
    },
  },
})
export default class InputPad extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.button {
  width: 1cm;
  height: 1cm;
  line-height: 1cm;
  padding: 4px;
  cursor: pointer;
  background-color: lightblue;
  user-select: none;
}
.button:hover {
  background-color: rgb(96, 195, 228);
}
.button:active {
  background-color: rgb(96, 195, 228);
  border: 4px;
  padding: 0px;
  border-color: brown;
  border-style: inset;
}
.gridbox {
  display: grid;
  grid-template-areas:
    "sin openpar clear div mul back"
    "cos closepar n1 n2 n3 sub"
    "tan power n4 n5 n6 add"
    "ln e0 n7 n8 n9 equal"
    "log e2 e3 n0 comma equal";
  width: min-content;
  grid-auto-columns: min-content;
  grid-template-rows: repeat(5, 1fr);
  row-gap: 2px;
  column-gap: 2px;
}
</style>
