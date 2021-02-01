<template>
  <div class="gridbox">
    <button @click="clear()" :style="{ 'grid-area': absolute_area(0, 0) }">
      C
    </button>
    <button
      @click="pressed('div')"
      :style="{ 'grid-area': absolute_area(0, 1) }"
    >
      {{ "\u00F7" }}
    </button>
    <button
      @click="pressed('mul')"
      :style="{ 'grid-area': absolute_area(0, 2) }"
    >
      {{ "\u00D7" }}
    </button>
    <button @click="back_one()" :style="{ 'grid-area': absolute_area(0, 3) }">
      {{ "\u2190" }}
    </button>
    <button
      v-for="char in 9"
      :key="char"
      @click="pressed(char.toString())"
      :style="{ 'grid-area': number_area(char) }"
    >
      {{ char }}
    </button>
    <button @click="pressed('0')" :style="{ 'grid-area': absolute_area(4, 1) }">
      0
    </button>
    <button
      @click="pressed('comma')"
      :style="{ 'grid-area': absolute_area(4, 2) }"
    >
      ,
    </button>
    <button
      @click="pressed('sub')"
      :style="{ 'grid-area': absolute_area(1, 3) }"
    >
      -
    </button>
    <button
      @click="pressed('add')"
      :style="{ 'grid-area': absolute_area(2, 3) }"
    >
      +
    </button>
    <button
      @click="pressed('equal')"
      :style="{ 'grid-area': absolute_area(3, 3, 2, 1) }"
    >
      =
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
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(5, 1fr);
}
</style>
