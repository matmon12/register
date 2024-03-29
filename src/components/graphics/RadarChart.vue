<template>
  <Radar :data="dataPosts" :options="optionsPost"/>
</template>

<script setup>
import { defineProps } from 'vue';
import { Radar } from 'vue-chartjs';

const props = defineProps({
  dataPosts: Object,
  optionsPost: Object
})
</script>

<style lang="scss" scoped>

</style>