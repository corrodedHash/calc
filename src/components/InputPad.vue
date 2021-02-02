<template>
  <div class="gridbox">
    <div class="button" @click="clear()" :style="{ 'grid-area': 'clear' }">
      C
    </div>
    <div class="button" @click="pressed('div')" :style="{ 'grid-area': 'div' }">
      {{ "\u00F7" }}
    </div>
    <div class="button" @click="pressed('mul')" :style="{ 'grid-area': 'mul' }">
      {{ "\u00D7" }}
    </div>
    <div class="button" @click="back_one()" :style="{ 'grid-area': 'back' }">
      {{ "\u2190" }}
    </div>
    <div
      class="button"
      v-for="char in 9"
      :key="char"
      @click="pressed(char.toString())"
      :style="{ 'grid-area': 'n' + char.toString() }"
    >
      {{ char }}
    </div>
    <div class="button" @click="pressed('0')" :style="{ 'grid-area': 'n0' }">
      0
    </div>
    <div
      class="button"
      @click="pressed('comma')"
      :style="{ 'grid-area': 'comma' }"
    >
      ,
    </div>
    <div class="button" @click="pressed('sub')" :style="{ 'grid-area': 'sub' }">
      -
    </div>
    <div class="button" @click="pressed('add')" :style="{ 'grid-area': 'add' }">
      +
    </div>
    <div
      class="button"
      @click="pressed('equal')"
      :style="{ 'grid-area': 'equal' }"
    >
      =
    </div>
    <div
      class="button"
      @click="pressed('openpar')"
      :style="{ 'grid-area': 'openpar' }"
    >
      (
    </div>
    <div
      class="button"
      @click="pressed('closepar')"
      :style="{ 'grid-area': 'closepar' }"
    >
      )
    </div>

    <div
      class="button"
      @click="pressed('power')"
      :style="{ 'grid-area': 'power' }"
    >
      x&#x207F;
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
      this.$emit("numberpress", which);
    },
    clear() {
      this.$emit("clear", -1);
    },
    back_one() {
      this.$emit("clear", 1);
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
    "openpar clear div mul back"
    "closepar n1 n2 n3 sub"
    "power n4 n5 n6 add"
    "extra n7 n8 n9 equal"
    "extra empty n0 comma equal";
  /* grid-template-columns: repeat(5, 1.5cm); */
  width: min-content;
  grid-auto-columns: min-content;
  grid-template-rows: repeat(5, 1fr);
  row-gap: 2px;
  column-gap: 2px;
}
</style>
