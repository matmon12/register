<script setup>
import { ref } from "vue";
const count = ref(0);

defineProps({
  msg: String,
});

</script>

<template>
  <h1>{{ msg }}</h1>
  <p class="class">
    <p class="class__text">g;fkkdjs</p>
  </p>
</template>

<style scoped lang="scss">
.class{
&__text{
  color: gray;
}
}
</style>
