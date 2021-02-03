<template>
  <div class="display">{{ text }}</div>
</template>

<script lang="ts">
import { Options, Vue } from "vue-class-component";

@Options({
  props: {
    text: String,
  },
})
export default class Display extends Vue {}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.display {
  width: 100%;
  margin-bottom: 0.2cm;
  font-size: x-large;
  height: 2em;
  line-height: 2em;
  background-color: lightblue;
  border: 2px;
  border-style: ridge;
  border-color: lightcoral;
  white-space: nowrap;
  overflow-x: auto;
  overflow-y: hidden;
}
</style>
