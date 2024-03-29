<template>
  <Bar id="my-chart-id" :options="dataSales" :data="optionsSales" />
</template>

<script setup>
import {defineProps} from 'vue';
import { Bar } from "vue-chartjs";

const props = defineProps({
  dataSales: Object,
  optionsSales: Object
})
</script>

<style lang="scss" scoped></style>
