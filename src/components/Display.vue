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
  white-space: nowrap;
}
</style>
