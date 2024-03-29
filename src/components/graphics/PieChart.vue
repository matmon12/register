<template>
  <Pie :data="dataLang" :options="optionsLang"/>
</template>

<script setup>
import {Pie} from 'vue-chartjs';
import { defineProps } from 'vue';

const props = defineProps({
  dataLang: Object,
  optionsLang: Object
})
</script>

<style lang="scss" scoped>

</style>