<template>
  <PolarArea :data="dataErrors" :options="optionsErrors"/>
</template>

<script setup>
import {PolarArea} from 'vue-chartjs';
import { defineProps } from 'vue';

const props = defineProps({
  dataErrors: Object,
  optionsErrors: Object
})
</script>

<style lang="scss" scoped>

</style>