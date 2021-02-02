<template>
  <div class="gridbox">
    <button @click="clear()" :style="{ 'grid-area': 'clear' }">
      C
    </button>
    <button @click="pressed('div')" :style="{ 'grid-area': 'div' }">
      {{ "\u00F7" }}
    </button>
    <button @click="pressed('mul')" :style="{ 'grid-area': 'mul' }">
      {{ "\u00D7" }}
    </button>
    <button @click="back_one()" :style="{ 'grid-area': 'back' }">
      {{ "\u2190" }}
    </button>
    <button
      v-for="char in 9"
      :key="char"
      @click="pressed(char.toString())"
      :style="{ 'grid-area': 'n' + char.toString() }"
    >
      {{ char }}
    </button>
    <button @click="pressed('0')" :style="{ 'grid-area': 'n0' }">
      0
    </button>
    <button @click="pressed('comma')" :style="{ 'grid-area': 'comma' }">
      ,
    </button>
    <button @click="pressed('sub')" :style="{ 'grid-area': 'sub' }">
      -
    </button>
    <button @click="pressed('add')" :style="{ 'grid-area': 'add' }">
      +
    </button>
    <button @click="pressed('equal')" :style="{ 'grid-area': 'equal' }">
      =
    </button>
    <button @click="pressed('openpar')" :style="{ 'grid-area': 'openpar' }">
      (
    </button>
    <button @click="pressed('closepar')" :style="{ 'grid-area': 'closepar' }">
      )
    </button>
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
      this.$emit("numberpress", which);
    },
    clear() {
      this.$emit("clear", -1);
    },
    back_one() {
      this.$emit("clear", 1);
    },
    number_area(id: number): String {
      let column = (id - 1) % 3;
      let row = (((id - 1) / 3) | 0) + 1;
      return this.absolute_area(row, column);
    },
    absolute_area(
      row: number,
      column: number,
      row_size: number = 1,
      column_size: number = 1
    ): String {
      row += 1;
      column += 1;
      return (
        row +
        " / " +
        column +
        " / " +
        (row + row_size) +
        " / " +
        (column + column_size)
      );
    },
  },
})
export default class InputPad extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.gridbox {
  display: grid;
  grid-template-areas:
    "openpar clear div mul back"
    "closepar n1 n2 n3 sub"
    "extra n4 n5 n6 add"
    "extra n7 n8 n9 equal"
    "extra empty n0 comma equal";
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: repeat(5, 1fr);
}
.numbox {
  display: grid;
  grid-area: num;
  grid-template-columns: subgrid;
  grid-template-rows: subgrid;
}
</style>
