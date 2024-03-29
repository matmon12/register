<template>
  <Doughnut :data="dataCountry" :options="optionsCountry"/>
</template>

<script setup>
import { defineProps } from 'vue';
import { Doughnut } from 'vue-chartjs';

const props = defineProps({
  dataCountry: Object,
  optionsCountry: Object
})
</script>

<style lang="scss" scoped>

</style>